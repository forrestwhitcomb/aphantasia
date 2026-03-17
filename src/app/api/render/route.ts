import { NextRequest } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import type { CanvasDocument } from "@/engine/CanvasEngine";
import type { StructuredContext } from "@/types/context";
import type { ReferenceItem } from "@/types/reference";
import { buildPrompt } from "@/render/promptSystem";

// POST /api/render — Layer 2 bespoke HTML render pipeline (streaming)
// Body: { doc, context, rawText, references? }
// Returns: SSE stream — final event contains bespoke HTML body

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

  const { systemMessage, userMessage, imageBlocks } = buildPrompt({
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

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16384,
    system: systemMessage,
    messages: [{ role: "user", content: contentBlocks }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let fullText = "";

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          fullText += event.delta.text;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
          );
        }
      }

      const html = fullText
        .trim()
        .replace(/^```(?:html)?\s*/i, "")
        .replace(/\s*```$/, "");

      const hasMarkers = /data-aph-id=/.test(html);

      if (hasMarkers) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, html })}\n\n`
          )
        );
      } else {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              done: true,
              html,
              warning: "AI output missing data-aph-id markers — projection may not work",
            })}\n\n`
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
