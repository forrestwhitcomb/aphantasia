import { NextRequest } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import type { CanvasDocument } from "@/engine/CanvasEngine";
import type { StructuredContext } from "@/types/context";
import type { ReferenceItem } from "@/types/reference";
import { buildPromptV2 } from "@/render/promptSystemV2";
import { validateRenderResponse, applySectionProps } from "@/render/validateRenderResponse";
import type { SectionContent } from "@/types/render";

// POST /api/render-v2 — Layer 2 variant-aware JSON prop-schema pipeline
// Body: { doc, context, rawText, references? }
// Returns: SSE stream — final event contains validated RenderResponse

export async function POST(req: NextRequest) {
  const { doc, context, rawText, references } = (await req.json()) as {
    doc: CanvasDocument;
    context: StructuredContext | null;
    rawText: string;
    references?: ReferenceItem[];
  };

  if (!doc?.shapes?.length) {
    return new Response(JSON.stringify({ error: "No shapes provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { systemMessage, userMessage, imageBlocks } = buildPromptV2({
    doc,
    context,
    rawText,
    references: references ?? [],
  });

  type MediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  const validMediaTypes = new Set<MediaType>(["image/jpeg", "image/png", "image/gif", "image/webp"]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentBlocks: any[] = [{ type: "text", text: userMessage }];

  for (const img of imageBlocks) {
    const match = img.dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (!match) continue;
    const mediaType = match[1] as MediaType;
    const data = match[2];
    if (!validMediaTypes.has(mediaType)) continue;
    contentBlocks.push({ type: "text", text: `${img.label}:` });
    contentBlocks.push({
      type: "image",
      source: { type: "base64", media_type: mediaType, data },
    });
  }

  const client = getAnthropicClient();
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      // Send progress event immediately
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ status: "generating" })}\n\n`)
      );

      try {
        // Non-streaming call (response is small ~1200 tokens)
        const response = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: systemMessage,
          messages: [{ role: "user", content: contentBlocks }],
        });

        // Extract text from response
        let fullText = "";
        for (const block of response.content) {
          if (block.type === "text") {
            fullText += block.text;
          }
        }

        // Strip markdown fences if present
        fullText = fullText
          .trim()
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/, "");

        // Parse JSON
        let parsed: unknown;
        try {
          parsed = JSON.parse(fullText);
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                error: "AI returned invalid JSON",
                raw: fullText.slice(0, 500),
              })}\n\n`
            )
          );
          controller.close();
          return;
        }

        // Validate against schema
        const validShapeIds = new Set(doc.shapes.map((s) => s.id));
        const validated = validateRenderResponse(parsed, validShapeIds);

        if (!validated) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                error: "AI response failed validation",
                raw: fullText.slice(0, 500),
              })}\n\n`
            )
          );
          controller.close();
          return;
        }

        // Convert each section to typed SectionContent
        const typedSections: Array<{ id: string; section: SectionContent }> = [];
        for (const s of validated.sections) {
          const typed = applySectionProps(s);
          if (typed) {
            typedSections.push({ id: s.id, section: typed });
          }
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              done: true,
              coherenceStrategy: validated.coherenceStrategy,
              sections: typedSections,
              tokenUsage: {
                input: response.usage.input_tokens,
                output: response.usage.output_tokens,
              },
            })}\n\n`
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, error: message })}\n\n`
          )
        );
      }

      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
