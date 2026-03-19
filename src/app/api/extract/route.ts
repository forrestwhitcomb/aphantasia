import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import type { StructuredContext } from "@/types/context";

// POST /api/extract
// Body: { text: string }
// Returns: StructuredContext (V3 — with classification, voice, content signals)
export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json(
      { error: "text is required" },
      { status: 400 }
    );
  }

  const client = getAnthropicClient();

  const prompt = `You are a product analyst. Extract structured context from a product/project description. Be specific and actionable — vague descriptors are useless.

Return a JSON object with these fields. Include ONLY fields that are mentioned or clearly implied. Omit fields with no basis in the text.

## Identity
- productName: string — the name of the product, company, or project
- tagline: string — a short punchy tagline (extract verbatim if present, or infer a compelling one)
- description: string — 1–2 sentence description of what it does and who it's for

## Classification
- contentType: one of "saas" | "portfolio" | "editorial" | "ecommerce" | "event" | "personal" | "agency" | "restaurant" | "nonprofit" | "general"
  → Be specific. A productivity app is "saas". A photographer's site is "portfolio". A Shopify store is "ecommerce".
- audience: string — who is this for? Be specific. "developers building APIs" not "developers". "enterprise marketing teams" not "businesses".

## Voice
- tone: object with:
  - formality: "casual" | "neutral" | "formal"
  - energy: "calm" | "confident" | "urgent" | "playful"
  - personality: string — 2-3 word descriptor. "bold and direct" for Stripe. "warm and approachable" for a therapist. "technical and precise" for a dev tool.
  → "professional" is NOT a useful descriptor. Be specific about HOW professional.

## Content Signals
- valueProp: string — the single core value proposition in one sentence. What makes this different?
- features: string[] — up to 6 key features or benefits (short phrases, not sentences)
- socialProof: string — trust signals if mentioned: "10k users", "YC-backed", "featured in TechCrunch"
- pricing: object with:
  - model: "free" | "freemium" | "paid" | "enterprise" | "custom"
  - tiers: string[] — tier names if mentioned (e.g. ["Starter", "Pro", "Enterprise"])
- cta: object with:
  - primary: string — the main call to action: "Get started", "Book a demo", "View portfolio"
  - secondary: string — secondary action: "Learn more", "See pricing", "Watch demo"

## Visual Signals
- brandColors: string[] — brand colors if mentioned (hex codes)
- visualDirection: string — aesthetic direction if mentioned: "minimal", "bold", "editorial", "dark mode", etc.
- references: string[] — mentioned competitors or inspiration sites

## Legacy (include if relevant)
- events: string[] — event names/dates if it's an events product
- products: string[] — product names if e-commerce
- portfolio: string[] — project names if portfolio
- team: string[] — team member names
- colors: string[] — same as brandColors (backward compat)
- fonts: string[] — font names if mentioned

## Input Text

${text.trim()}

Return ONLY valid JSON. No markdown code fences, no explanation.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
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

    // Sync legacy color fields
    if (structured.brandColors?.length && !structured.colors?.length) {
      structured.colors = structured.brandColors;
    } else if (structured.colors?.length && !structured.brandColors?.length) {
      structured.brandColors = structured.colors;
    }

    return NextResponse.json({
      ...structured,
      _tokenUsage: { input: message.usage.input_tokens, output: message.usage.output_tokens },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response", raw: content.text },
      { status: 500 }
    );
  }
}
