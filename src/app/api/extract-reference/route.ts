import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import type { ExtractedStyleTokens } from "@/types/reference";

// POST /api/extract-reference
// Body: { imageData?: string (base64 dataUrl), url?: string, tag: "style" | "tone" | "content" }
// Returns: ExtractedStyleTokens

export async function POST(req: NextRequest) {
  const { imageData, url, tag } = (await req.json()) as {
    imageData?: string;
    url?: string;
    tag: "style" | "tone" | "content";
  };

  if (!imageData && !url) {
    return NextResponse.json(
      { error: "Either imageData or url is required" },
      { status: 400 }
    );
  }

  const client = getAnthropicClient();
  const prompt = buildPrompt(tag, url);

  type MediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  const validMediaTypes = new Set<MediaType>(["image/jpeg", "image/png", "image/gif", "image/webp"]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentBlocks: any[] = [];

  if (imageData) {
    const match = imageData.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (match) {
      const mediaType = match[1] as MediaType;
      const data = match[2];
      if (validMediaTypes.has(mediaType)) {
        contentBlocks.push({
          type: "image",
          source: { type: "base64", media_type: mediaType, data },
        });
      }
    }
  }

  contentBlocks.push({ type: "text", text: prompt });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [{ role: "user", content: contentBlocks }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json(
      { error: "Unexpected response from AI" },
      { status: 500 }
    );
  }

  try {
    const raw = content.text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");
    const tokens: ExtractedStyleTokens = JSON.parse(raw);
    return NextResponse.json(tokens);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response", raw: content.text },
      { status: 500 }
    );
  }
}

function buildPrompt(tag: "style" | "tone" | "content", url?: string): string {
  const urlContext = url ? `\nReference URL: ${url}` : "";

  if (tag === "style") {
    return `You are a senior UI designer analyzing a website screenshot to extract precise design tokens.${urlContext}

Study the image carefully. Identify the following UI components and extract ACTUAL CSS-ready values:

COLORS — Look at the page and extract specific hex codes:
- colors: string[] — the dominant palette (up to 6 hex codes, ordered by visual weight)
- background: string — the page background color as hex (e.g. "#ffffff", "#0a0a0f")
- foreground: string — the primary body text color as hex
- mutedForeground: string — secondary/muted text color as hex
- accent: string — the primary accent color (buttons, links, highlights) as hex
- surface: string — card/section background color as hex

TYPOGRAPHY — Identify the fonts used:
- fontHeading: string — CSS font-family for headings (e.g. "Georgia, serif", "Inter, sans-serif")
- fontBody: string — CSS font-family for body text
- headingWeight: string — CSS font-weight for headings (e.g. "700", "900", "400")
- bodyLineHeight: string — CSS line-height for body text (e.g. "1.6", "1.8")

SHAPE & CORNERS — Measure the border-radius on components:
- buttonRadius: string — button corner radius as CSS value (e.g. "4px" for sharp, "8px" for soft, "999px" for pill)
- cardRadius: string — card/container corner radius (e.g. "0px", "12px", "24px")
- inputRadius: string — form input corner radius

SPACING — Estimate the spacing scale:
- sectionPadding: string — vertical padding per section (e.g. "64px", "96px", "120px")
- cardPadding: string — internal padding of cards (e.g. "16px", "24px", "32px")

COMPONENT STYLE — Describe the visual approach:
- buttonStyle: string — one of: "solid filled", "outlined", "ghost", "pill", "rounded solid"
- cardStyle: string — one of: "flat", "elevated shadow", "bordered", "glass", "subtle shadow"
- navStyle: string — one of: "minimal sticky", "transparent overlay", "solid bar", "floating pill"

OVERALL:
- mood: string — the overall feel in 2-4 words (e.g. "minimal and clean", "bold and playful")
- layout: string — layout approach (e.g. "centered symmetric", "asymmetric editorial", "dense grid")

Return a JSON object with ONLY the fields you can confidently determine from the image. Use real CSS values, not descriptions. If you cannot determine a value with confidence, omit it.

Respond with only valid JSON. No markdown code fences, no explanation.`;
  }

  if (tag === "tone") {
    return `Analyze this reference and extract the tone of voice and communication style.${urlContext}

Study any visible text — headlines, body copy, button labels, taglines — and determine:

- toneOfVoice: string — the writing style (e.g. "professional and authoritative", "casual and witty", "warm and approachable", "technical and precise")
- mood: string — the emotional quality in 2-4 words (e.g. "confident and premium", "friendly and fun")
- headingWeight: string — how bold are headings? CSS font-weight (e.g. "400" for light, "700" for bold, "900" for black)
- fontHeading: string — CSS font-family the headings appear to use

Return a JSON object with ONLY the fields you can confidently determine.

Respond with only valid JSON. No markdown code fences, no explanation.`;
  }

  // "content" tag — future state
  return `Analyze this reference and describe its content structure.${urlContext}

Return a JSON object:
- layout: string — describe what content sections are present
- mood: string — overall impression in 2-4 words

Respond with only valid JSON. No markdown code fences, no explanation.`;
}
