import { NextRequest } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import type { CanvasDocument } from "@/engine/CanvasEngine";
import type { UIDesignSystem, UIInspiration } from "@/types/uiDesign";
import { buildMobilePrompt } from "@/render/mobilePromptSystem";

// POST /api/ui/render — Mobile UI AI render pipeline (streaming)
// Body: { doc, designSystem, screenContext, inspirations, designContextImage? }
// Returns: SSE stream — final event contains complete mobile HTML body

export async function POST(req: NextRequest) {
  const { doc, designSystem, screenContext, inspirations, designContextImage } = (await req.json()) as {
    doc: CanvasDocument;
    designSystem: UIDesignSystem;
    screenContext: string;
    inspirations: UIInspiration[];
    designContextImage?: string | null;
  };

  if (!doc || !designSystem) {
    return new Response(JSON.stringify({ error: "Missing doc or designSystem" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { systemMessage, userMessage, imageBlocks } = buildMobilePrompt({
    doc,
    designSystem,
    screenContext: screenContext ?? "",
    inspirations: inspirations ?? [],
    designContextImage: designContextImage ?? null,
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
    max_tokens: 8192,
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

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ done: true, html })}\n\n`)
      );
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
