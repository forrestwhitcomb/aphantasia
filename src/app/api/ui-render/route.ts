import { NextRequest } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import type { UIDesignSystem, UIResolvedComponent, UILayer2Override } from "@/ui-mode/types";

// POST /api/ui-render — Layer 2 AI render for UI mode (streaming SSE)
//
// Takes resolved components + design system + notes.
// Returns streaming SSE with per-component content/style/variant overrides.
// The viewport merges these into the Layer 1 output progressively.

interface RequestBody {
  components: UIResolvedComponent[];
  designSystem: UIDesignSystem;
  globalNotes: string[];
  frameContext: { width: number; height: number; name?: string };
}

const SYSTEM_PROMPT = `You are a mobile UI content and styling engine for Aphantasia, a wireframing tool.

You receive a list of UI components that have been inferred from canvas wireframe shapes. Each component has:
- type: the component type (navBar, card, listGroup, button, etc.)
- label: text the user wrote on the shape (may be empty)
- notes: instructions the user attached to this specific component
- globalNotes: context about the entire app/screen

Your job is to return a JSON array of overrides that make each component look realistic and contextually appropriate.

## Rules

1. For each component, decide:
   - contentOverrides: fill in realistic placeholder content (titles, descriptions, labels, item names)
   - styleOverrides: CSS overrides if the notes request specific styling (e.g., "transparent background")
   - variantOverride: change the variant if the notes suggest one (e.g., "outline" for a button)

2. Content should be contextually appropriate:
   - If globalNotes say "fitness app", list items should be "Today's Workout", "Weekly Progress", etc.
   - If globalNotes say "banking app", cards should be "Checking Account", "Savings", etc.
   - If a component has a label, USE it — don't replace meaningful user labels

3. Only include overrides that ADD value. If a component looks fine with defaults, skip it.

4. Notes attached to a component are INSTRUCTIONS. Obey them literally:
   - "3 items: Home, Search, Profile" → set itemLabels and itemCount
   - "transparent background" → styleOverrides with background: transparent
   - "primary, full width" → variantOverride: "primary", styleOverrides with width: 100%
   - "show user avatar and name" → contentOverrides with appropriate content

5. Return ONLY a JSON array of UILayer2Override objects. No markdown, no explanation.

## UILayer2Override Schema

\`\`\`json
[
  {
    "componentId": "<shapeId>",
    "contentOverrides": {
      "title": "...",
      "description": "...",
      "itemLabels": ["...", "..."],
      "itemCount": 3
    },
    "styleOverrides": {
      "background": "transparent",
      "color": "#fff"
    },
    "variantOverride": "outline"
  }
]
\`\`\`

Return an empty array [] if no overrides are needed.`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const { components, designSystem, globalNotes, frameContext } = body;

    if (!components || !designSystem) {
      return new Response(JSON.stringify({ error: "Missing components or designSystem" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build user message with component context
    const componentDescriptions = components.map((c) => ({
      id: c.shapeId,
      type: c.type,
      label: c.label || null,
      variant: c.variant || null,
      notes: c.notes.length > 0 ? c.notes : null,
      itemCount: c.itemCount || null,
      bounds: {
        y: Math.round(c.bounds.y),
        width: Math.round(c.bounds.width),
        height: Math.round(c.bounds.height),
      },
    }));

    const userMessage = `Frame: ${frameContext.width}×${frameContext.height}px${frameContext.name ? ` (${frameContext.name})` : ""}
Design system: "${designSystem.name}" — primary: ${designSystem.colors.primary}, font: ${designSystem.fonts.heading.family}
${globalNotes.length > 0 ? `\nGlobal context:\n${globalNotes.map((n) => `- ${n}`).join("\n")}` : ""}

Components to enhance:
${JSON.stringify(componentDescriptions, null, 2)}

Return a JSON array of UILayer2Override objects for components that need content, style, or variant overrides.`;

    const client = getAnthropicClient();

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
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
              encoder.encode(`data: ${JSON.stringify({ delta: event.delta.text })}\n\n`)
            );
          }
        }

        // Parse the complete response
        let overrides: UILayer2Override[] = [];
        try {
          let jsonStr = fullText.trim();
          if (jsonStr.startsWith("```")) {
            jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
          }
          overrides = JSON.parse(jsonStr);
        } catch {
          // If parsing fails, send empty overrides
          overrides = [];
        }

        // Send final parsed overrides
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, overrides })}\n\n`
          )
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
  } catch (error) {
    console.error("[ui-render] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Render failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
