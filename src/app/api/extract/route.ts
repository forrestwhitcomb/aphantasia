import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import type { StructuredContext } from "@/types/context";

// POST /api/extract
// Body: { text: string }
// Returns: StructuredContext
export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json(
      { error: "text is required" },
      { status: 400 }
    );
  }

  const client = getAnthropicClient();

  const prompt = `Extract structured context from the following product/project description.

Return a JSON object with ONLY the fields that are actually mentioned or clearly implied. Omit fields that have no basis in the text.

Fields to extract:
- productName: string — the name of the product, company, or project
- tagline: string — a short punchy tagline (extract or infer from the text)
- description: string — 1–2 sentence description of what it does
- tone: string — one of: professional, playful, minimal, bold, warm, technical, creative
- pricing: string — pricing info if mentioned (e.g. "$9/month", "free tier available")
- events: string[] — event names or dates if it's an events product
- products: string[] — product names/SKUs if it's e-commerce
- portfolio: string[] — project or case study names if it's a portfolio
- team: string[] — team member names if mentioned
- colors: string[] — brand colors if mentioned (hex codes or color names)
- fonts: string[] — font names if mentioned

Description to analyze:
${text.trim()}

Respond with only valid JSON. No markdown code fences, no explanation, no commentary.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json(
      { error: "Unexpected response from AI" },
      { status: 500 }
    );
  }

  try {
    // Strip markdown code fences if present (e.g. ```json ... ```)
    const raw = content.text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    const structured: StructuredContext = JSON.parse(raw);
    return NextResponse.json(structured);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response", raw: content.text },
      { status: 500 }
    );
  }
}
