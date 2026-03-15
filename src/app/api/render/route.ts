import { NextRequest } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import type { CanvasDocument } from "@/engine/CanvasEngine";
import type { StructuredContext } from "@/types/context";
import type { ReferenceItem } from "@/types/reference";
import { resolveSemanticTag } from "@/semantic/rules";
import { buildContextBundle, serializeForPrompt } from "@/render/serializer";

// POST /api/render — Layer 2 AI render pipeline (streaming)
// Body: { doc, context, rawText, references? }
// Returns: SSE stream — final event contains parsed SectionContent[] per shape

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

  // Use client-resolved semantics (includes spatial hierarchy + consumed flags).
  // Only re-resolve shapes that lack a semantic tag.
  const resolvedDoc: CanvasDocument = {
    ...doc,
    shapes: doc.shapes.map((s) => ({
      ...s,
      semanticTag: s.semanticTag || resolveSemanticTag(s, doc.frame.width, doc.frame.height),
    })),
  };

  const bundle = buildContextBundle(resolvedDoc, context, rawText);
  const layoutPrompt = serializeForPrompt(resolvedDoc, bundle, references);

  // Build the sections list
  const insideFrame = resolvedDoc.shapes
    .filter(
      (s) =>
        s.isInsideFrame &&
        s.semanticTag !== "unknown" &&
        s.semanticTag !== "scratchpad" &&
        s.semanticTag !== "context-note" &&
        s.semanticTag !== "image" &&
        !s.meta?._consumed
    )
    .sort((a, b) => a.y - b.y);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sectionIds = insideFrame.map((s) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entry: any = {
      id: s.id,
      type: s.semanticTag,
      label: s.label || s.content || "",
    };
    // Include pre-extracted compound structure so Claude enhances rather than replaces
    if (s.meta?._spatialGroup) {
      const sg = s.meta._spatialGroup as Record<string, unknown>;
      entry.existingStructure = {
        title: sg.title,
        subtitle: sg.subtitle,
        featureCount: Array.isArray(sg.features) ? sg.features.length : 0,
        features: Array.isArray(sg.features)
          ? (sg.features as Array<Record<string, unknown>>).map((f) => ({
              heading: f.heading,
              body: f.body,
              cta: f.cta,
              hasImage: !!f.imageSrc,
            }))
          : [],
      };
    }
    return entry;
  });

  const prompt = `You are a senior web designer generating content for a landing page.

${layoutPrompt}

SECTIONS TO FILL (in order from top to bottom):
${JSON.stringify(sectionIds, null, 2)}

For each section, generate rich, contextual content that matches the product/brand context above.

Return a JSON array where each element has:
- "id": the shape ID (from the list above)
- "type": the section type matching these exact values: "nav", "hero", "feature-grid", "text-image-split", "cta", "footer", "portfolio", "ecommerce-grid", "event-signup", "generic"
- "props": an object with the appropriate props for that section type

Section prop schemas:
- nav: { logo, links (string[]), cta }
- hero: { headline, subheadline, cta, ctaSecondary, badge }
- feature-grid: { title, subtitle, features: [{ icon, heading, body, cta }] }
- text-image-split: { heading, body, cta, imageAlt, imagePosition ("left"|"right") }
- cta: { heading, subheading, cta, ctaSecondary }
- footer: { logo, tagline, columns: [{ heading, links (string[]) }], copyright }
- portfolio: { title, subtitle, items: [{ title, description, tags (string[]) }] }
- ecommerce-grid: { title, subtitle, products: [{ name, price, description, badge }] }
- event-signup: { eventName, date, location, description, cta }
- generic: { title, body, cta }

Rules:
- Use the product context to make all copy specific and relevant — never use placeholder text
- Match the tone specified in the context
- For features, generate exactly 3 items with distinct unicode icons (◆ ◈ ◉ ✦ ⚡ etc.)
- Keep copy concise: headlines under 8 words, body text 1-2 sentences
- Use the product name in nav logo and footer
- Map semantic tags to section types: cards→feature-grid, split→text-image-split, button→cta, form→event-signup, section→generic
- If style reference images are attached, you MUST match their visual aesthetic in the copy you generate: match the tone, energy level, formality, and phrasing style you see in the reference. If the reference feels minimal and elegant, write minimal elegant copy. If it feels bold and playful, write bold playful copy.
- If STYLE REFERENCES are listed in the context with extracted tokens (colors, typography, mood, tone of voice), use those tokens to guide the feel of your copy. Match the mood and tone of voice exactly.
- CRITICAL: If a section has "existingStructure", the user has already laid out this compound section on the canvas. You MUST preserve the structure — keep the same number of features/items, enhance the headings and body copy to be richer and more contextual, but do NOT change the count or restructure. The canvas layout is the source of truth for structure; your job is to elevate the copy within that structure.

Respond with ONLY the JSON array. No markdown fences, no explanation.`;

  // Collect style reference images from the bundle
  const imageBlocks: Array<{ shapeId: string; dataUrl: string; description?: string }> = [];
  for (const [shapeId, ctx] of Object.entries(bundle.shapeContexts)) {
    if (ctx.styleRef?.dataUrl) {
      imageBlocks.push({ shapeId, dataUrl: ctx.styleRef.dataUrl, description: ctx.styleRef.description });
    }
  }

  // Build content blocks — text prompt + optional vision images
  type MediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  const validMediaTypes = new Set<MediaType>(["image/jpeg", "image/png", "image/gif", "image/webp"]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentBlocks: any[] = [{ type: "text", text: prompt }];

  for (const img of imageBlocks) {
    const match = img.dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (!match) continue;
    const mediaType = match[1] as MediaType;
    const data = match[2];
    if (!validMediaTypes.has(mediaType)) continue;
    contentBlocks.push({
      type: "text",
      text: `Style reference for section ${img.shapeId}${img.description ? ` (${img.description})` : ""}:`,
    });
    contentBlocks.push({
      type: "image",
      source: { type: "base64", media_type: mediaType, data },
    });
  }

  // Attach reference images (from Reference Widget) as vision blocks
  const readyRefs = (references ?? []).filter(
    (r) => r.status === "ready" && r.type === "image" && r.source
  );
  for (const ref of readyRefs) {
    const match = ref.source.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (!match) continue;
    const mediaType = match[1] as MediaType;
    const data = match[2];
    if (!validMediaTypes.has(mediaType)) continue;
    contentBlocks.push({
      type: "text",
      text: `Global ${ref.tag} reference (apply to entire page):`,
    });
    contentBlocks.push({
      type: "image",
      source: { type: "base64", media_type: mediaType, data },
    });
  }

  const client = getAnthropicClient();

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
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

      // Send the complete parsed result
      try {
        const raw = fullText
          .trim()
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/, "");
        const sections = JSON.parse(raw);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, sections })}\n\n`
          )
        );
      } catch {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, error: "Failed to parse AI response", raw: fullText })}\n\n`
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
