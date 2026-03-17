import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import type { ExtractedStyleTokens } from "@/types/reference";

// POST /api/extract-reference
// Body: { imageData?: string (base64 dataUrl), url?: string, tag: "style" | "tone" | "content" }
// Returns: ExtractedStyleTokens

const FETCH_TIMEOUT_MS = 12000;
const FETCH_MAX_BYTES = 800 * 1024; // 800KB

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

  type MediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  const validMediaTypes = new Set<MediaType>(["image/jpeg", "image/png", "image/gif", "image/webp"]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentBlocks: any[] = [];
  let prompt: string;

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
    prompt = buildPrompt(tag, url);
  } else if (url) {
    // Deep-dive: fetch URL and extract HTML/CSS for analysis
    const htmlCss = await fetchUrlAndExtractStyles(url);
    if (!htmlCss) {
      return NextResponse.json(
        { error: "Could not fetch URL or extract content (timeout or invalid)" },
        { status: 400 }
      );
    }
    prompt = buildPromptFromHtmlCss(tag, url, htmlCss);
  } else {
    prompt = buildPrompt(tag, url);
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

DEEPER STYLE (extract when visible):
- shadowCard: string — card/panel box-shadow as CSS value (e.g. "0 4px 6px rgba(0,0,0,0.1)", "none")
- shadowButton: string — button box-shadow if any
- fontSizeHeading: string — main heading font-size (e.g. "clamp(24px, 3vw, 36px)", "32px")
- fontSizeBody: string — body text font-size (e.g. "16px", "1rem")
- borderWidth: string — typical border width (e.g. "1px", "2px")
- letterSpacingHeading: string — heading letter-spacing (e.g. "-0.02em", "0.05em")

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

/** Fetch URL and extract HTML + inline/linked CSS for style extraction (no screenshot). */
async function fetchUrlAndExtractStyles(pageUrl: string): Promise<string | null> {
  const allowedProtocols = ["https:", "http:"];
  let parsed: URL;
  try {
    parsed = new URL(pageUrl);
    if (!allowedProtocols.includes(parsed.protocol)) return null;
  } catch {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(pageUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "AphantasiaStyleExtractor/1.0" },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const contentLength = res.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > FETCH_MAX_BYTES) return null;

    const html = await res.text();
    if (html.length > FETCH_MAX_BYTES) return html.slice(0, FETCH_MAX_BYTES);

    const parts: string[] = [];
    // Inline <style> blocks
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let m: RegExpExecArray | null;
    while ((m = styleRegex.exec(html)) !== null) {
      parts.push(m[1].trim());
    }
    // Linked stylesheets (up to 3)
    const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi;
    const hrefs: string[] = [];
    while ((m = linkRegex.exec(html)) !== null) {
      const href = m[1];
      if (href.startsWith("//")) hrefs.push(parsed.protocol + href);
      else if (href.startsWith("/")) hrefs.push(parsed.origin + href);
      else if (href.startsWith("http")) hrefs.push(href);
      else hrefs.push(new URL(href, pageUrl).href);
    }
    for (const href of hrefs.slice(0, 3)) {
      try {
        const cssRes = await fetch(href, {
          signal: AbortSignal.timeout(5000),
          headers: { "User-Agent": "AphantasiaStyleExtractor/1.0" },
        });
        if (cssRes.ok) {
          const css = await cssRes.text();
          if (css.length < 100000) parts.push(css.trim());
        }
      } catch {
        // skip failed stylesheet
      }
    }
    // First 30k chars of HTML for structure/classes
    const htmlSnippet = html.replace(/<script[\s\S]*?<\/script>/gi, "").slice(0, 30000);
    parts.unshift("<!-- HTML snippet -->\n" + htmlSnippet);
    return parts.join("\n\n---\n\n");
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

function buildPromptFromHtmlCss(
  tag: "style" | "tone" | "content",
  pageUrl: string,
  htmlCss: string
): string {
  if (tag !== "style") {
    return `Analyze the following HTML/CSS from ${pageUrl} and extract tone/structure as requested.

Content (truncated):
${htmlCss.slice(0, 15000)}

Return a JSON object with mood, layout, toneOfVoice as applicable. Only valid JSON.`;
  }

  return `You are a senior UI designer. Below is HTML and CSS extracted from this webpage: ${pageUrl}

Analyze the CSS variables, class styles, and structure to extract precise design tokens. Output ACTUAL CSS-ready values.

COLORS — From :root, [data-theme], or body/background:
- colors: string[] — dominant palette (up to 6 hex codes)
- background: string — page background (hex)
- foreground: string — primary text color (hex)
- mutedForeground: string — secondary text (hex)
- accent: string — accent/CTA color (hex)
- surface: string — card/section background (hex)

TYPOGRAPHY — From font-family, font-size, line-height:
- fontHeading: string — CSS font-family for headings
- fontBody: string — CSS font-family for body
- headingWeight: string — font-weight for headings
- bodyLineHeight: string — line-height
- fontSizeHeading: string — heading font-size (e.g. "clamp(24px, 3vw, 36px)")
- fontSizeBody: string — body font-size (e.g. "16px")
- letterSpacingHeading: string — letter-spacing for headings

SHAPE & SPACING:
- buttonRadius: string — border-radius for buttons
- cardRadius: string — border-radius for cards
- sectionPadding: string — section vertical padding
- cardPadding: string — card internal padding

SHADOWS & BORDERS (if present in CSS):
- shadowCard: string — box-shadow for cards
- shadowButton: string — box-shadow for buttons
- borderWidth: string — typical border-width

COMPONENT STYLE (describe):
- buttonStyle: string — e.g. "solid filled", "outlined", "pill"
- cardStyle: string — e.g. "flat", "elevated shadow", "bordered"
- navStyle: string — e.g. "minimal sticky", "solid bar"
- mood: string — 2-4 words
- layout: string — layout approach

Content:
${htmlCss.slice(0, 28000)}

Return a JSON object with ONLY the fields you can determine from the content. Use real CSS values. Only valid JSON, no markdown fences.`;
}
