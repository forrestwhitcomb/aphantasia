import { NextRequest } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { aiCallTracker } from "@/lib/aiCallTracker";
import type { UIResolvedComponent, UILayer2Override } from "@/ui-mode/types";

// POST /api/rebtel/render — Layer 2 AI render for Rebtel mode (streaming SSE)
//
// Rebtel-contextualized version of /api/ui-render.
// Generates realistic content for Rebtel app components:
// real country names, E.164 phone numbers, realistic calling rates,
// carrier names, top-up amounts in USD.

interface RequestBody {
  components: UIResolvedComponent[];
  globalNotes: string[];
  frameContext: { width: number; height: number; name?: string };
}

const SYSTEM_PROMPT = `You are a mobile UI content engine for Rebtel, an international calling and mobile top-up app.

You receive a list of UI components from a wireframe prototype. Your job is to fill them with realistic Rebtel app content.

## Rebtel Context
Rebtel helps migrant communities stay connected with family abroad. Core features:
- Mobile Top-Up: Send prepaid credit to phones in 150+ countries (Cubacel, Claro, MTN, Telcel, Orange, Airtel)
- International Calling: Crystal-clear calls to 190+ countries
- Products: one-time credits, bundles (minutes + data + SMS), recurring plans

## Content Rules

1. **Phone numbers**: Use realistic E.164 format (+1 555 234 5678, +234 801 234 5678, +53 5 234 5678)
2. **Rates**: Realistic per-minute rates (Cuba: $0.69/min, Nigeria: $0.02/min, India: $0.01/min, Mexico: $0.03/min)
3. **Top-up amounts**: Common amounts in USD ($5, $10, $15, $20, $30, $50)
4. **Country flags**: Use emoji flags (🇨🇺 🇳🇬 🇮🇳 🇲🇽 🇵🇭 🇨🇴 🇬🇭 🇰🇪 🇪🇬 🇵🇰)
5. **Contact names**: Diverse real names (María García, Ahmed Hassan, Priya Patel, Juan Rodríguez)
6. **Carriers**: Real carriers (Cubacel, MTN, Claro, Telcel, Orange, Airtel, Tigo, Virgin Mobile)
7. **Dates**: Recent dates (Mar 2026 timeframe)
8. **Currency**: USD with $ symbol
9. **Balance amounts**: $5 – $50 range for credits
10. **Tone**: Warm, human, family-focused — not corporate

## Output Rules

1. Only include overrides that ADD value — skip components that look fine with defaults
2. If a component has a user label, USE it — don't replace meaningful labels
3. Notes attached to a component are INSTRUCTIONS — obey them literally
4. Use Rebtel's color tokens: --rebtel-red (#E63946), --rebtel-green (#2ECC71), --rebtel-blue (#3498DB)

## Schema

Return ONLY a JSON array of UILayer2Override objects:
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
    "styleOverrides": { "background": "transparent" },
    "variantOverride": "outline"
  }
]
\`\`\`

Return an empty array [] if no overrides are needed.`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const { components, globalNotes, frameContext } = body;

    if (!components) {
      return new Response(JSON.stringify({ error: "Missing components" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    aiCallTracker.trackRender();

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
${globalNotes.length > 0 ? `\n## Screen context\n${globalNotes.map((n) => `- ${n}`).join("\n")}` : ""}

## Components to enhance
${JSON.stringify(componentDescriptions, null, 2)}

Return a JSON array of UILayer2Override objects for components that need realistic Rebtel content.`;

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

        // Track token usage
        const finalMessage = await stream.finalMessage();
        if (finalMessage.usage) {
          aiCallTracker.addTokens({ input: finalMessage.usage.input_tokens, output: finalMessage.usage.output_tokens });
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
          overrides = [];
        }

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
    console.error("[rebtel-render] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Render failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
