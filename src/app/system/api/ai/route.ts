// ============================================================
// Aphantasia/System — AI API Route (Server-side)
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "../../../../system/ai/prompts";
import type { AIRequest, AIResponse } from "../../../../system/ai/service";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AIRequest;
    const systemPrompt = buildSystemPrompt(body.context);

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: body.message }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    // Extract JSON from the response — handle potential wrapping
    let parsed: AIResponse;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to extract JSON from markdown fences if the model wrapped it
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        return Response.json(
          { explanation: text, patches: [] } satisfies AIResponse,
        );
      }
    }

    return Response.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
