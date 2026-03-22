import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import type { UIDesignSystem } from "@/ui-mode/types";
import { DEFAULT_UI_DESIGN_SYSTEM } from "@/ui-mode/defaultDesignSystem";

// POST /api/ui-extract-url
// Body: { url: string }
// Returns: { designSystem: UIDesignSystem }
//
// Fetches a website's HTML + CSS, extracts design tokens via Claude,
// and maps them to the UIDesignSystem schema.

const FETCH_TIMEOUT_MS = 12000;
const FETCH_MAX_BYTES = 800 * 1024;

const SYSTEM_PROMPT = `You are a design system extraction engine. You analyze website HTML and CSS to extract precise design tokens for a mobile UI design system.

You MUST return a JSON object matching this exact schema. Every value must be a valid CSS value.

## Schema

{
  "fonts": {
    "heading": { "family": "<CSS font stack>", "weight": <number>, "letterSpacing": "<CSS value>" },
    "body": { "family": "<CSS font stack>", "weight": <number>, "letterSpacing": "<CSS value>" },
    "caption": { "family": "<CSS font stack>", "weight": <number> },
    "mono": { "family": "<CSS font stack>", "weight": <number> }
  },
  "fontSizes": { "xs": "<px>", "sm": "<px>", "base": "<px>", "lg": "<px>", "xl": "<px>", "2xl": "<px>", "3xl": "<px>" },
  "colors": {
    "background": "<hex>", "foreground": "<hex>", "primary": "<hex>", "primaryForeground": "<hex>",
    "secondary": "<hex>", "secondaryForeground": "<hex>", "muted": "<hex>", "mutedForeground": "<hex>",
    "accent": "<hex>", "accentForeground": "<hex>", "destructive": "<hex>", "border": "<hex>",
    "input": "<hex>", "ring": "<hex>", "card": "<hex>", "cardForeground": "<hex>"
  },
  "spacing": { "xs": "<px>", "sm": "<px>", "md": "<px>", "lg": "<px>", "xl": "<px>", "2xl": "<px>" },
  "radii": { "none": "0px", "sm": "<px>", "md": "<px>", "lg": "<px>", "xl": "<px>", "full": "9999px", "button": "<px>", "card": "<px>", "input": "<px>" },
  "shadows": { "sm": "<CSS>", "md": "<CSS>", "lg": "<CSS>", "card": "<CSS>", "button": "<CSS>", "input": "<CSS>" },
  "components": {
    "navBar": { "height": "<px>", "blur": "<CSS>", "borderBottom": "<CSS>" },
    "card": { "padding": "<px>", "gap": "<px>" },
    "button": { "height": "<px>", "paddingX": "<px>", "fontSize": "<px>" },
    "input": { "height": "<px>", "paddingX": "<px>", "fontSize": "<px>" },
    "list": { "itemHeight": "<px>", "divider": "<CSS>" },
    "tabBar": { "height": "<px>", "iconSize": "<px>" }
  },
  "name": "<website name>",
  "confidence": <0-1>
}

## Instructions

Look at CSS custom properties (:root, [data-theme], html, body), class definitions, and inline styles.
- Map CSS variables like --color-primary, --bg, --text to the semantic color roles
- Extract font-family stacks from headings (h1-h4) and body text
- Extract border-radius from button, card, input selectors
- Extract spacing from padding/margin/gap values
- If the CSS uses a design system (Tailwind, shadcn, Chakra, MUI), recognize the token patterns
- Provide closest Google Font match for any custom/system fonts
- For any fields you can't determine, use reasonable defaults for a modern mobile UI

Return ONLY the JSON object. No markdown, no explanation.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url: string };

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    // Validate URL
    let parsed: URL;
    try {
      parsed = new URL(url);
      if (!["https:", "http:"].includes(parsed.protocol)) {
        return NextResponse.json({ error: "URL must use http or https" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Fetch HTML + CSS
    const htmlCss = await fetchAndExtractStyles(url, parsed);
    if (!htmlCss) {
      return NextResponse.json(
        { error: "Could not fetch URL (timeout, blocked, or invalid)" },
        { status: 400 }
      );
    }

    // Send to Claude for analysis
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Extract the design system from this website: ${url}\n\nHTML and CSS content:\n\n${htmlCss.slice(0, 30000)}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    let jsonStr = textBlock.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const extracted = JSON.parse(jsonStr) as Partial<UIDesignSystem>;

    // Deep merge with defaults for any missing fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const designSystem = deepMerge(DEFAULT_UI_DESIGN_SYSTEM as any, extracted as any) as unknown as UIDesignSystem;
    designSystem.name = extracted.name || parsed.hostname;
    designSystem.confidence = extracted.confidence ?? 0.7;

    return NextResponse.json({ designSystem });
  } catch (error) {
    console.error("[ui-extract-url] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Extraction failed" },
      { status: 500 }
    );
  }
}

/** Fetch URL and extract HTML + CSS for analysis. */
async function fetchAndExtractStyles(pageUrl: string, parsed: URL): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(pageUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "AphantasiaDesignExtractor/1.0" },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const contentLength = res.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > FETCH_MAX_BYTES) return null;

    let html = await res.text();
    if (html.length > FETCH_MAX_BYTES) html = html.slice(0, FETCH_MAX_BYTES);

    const parts: string[] = [];

    // Extract <meta name="theme-color">
    const themeColorMatch = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i);
    if (themeColorMatch) {
      parts.push(`<!-- theme-color: ${themeColorMatch[1]} -->`);
    }

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
          headers: { "User-Agent": "AphantasiaDesignExtractor/1.0" },
        });
        if (cssRes.ok) {
          const css = await cssRes.text();
          if (css.length < 100000) parts.push(css.trim());
        }
      } catch {
        // skip failed stylesheet
      }
    }

    // HTML snippet (stripped of scripts) for structure
    const htmlSnippet = html.replace(/<script[\s\S]*?<\/script>/gi, "").slice(0, 20000);
    parts.unshift("<!-- HTML -->\n" + htmlSnippet);

    return parts.join("\n\n---\n\n");
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

/** Simple deep merge for UIDesignSystem. */
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (sv && typeof sv === "object" && !Array.isArray(sv) && tv && typeof tv === "object" && !Array.isArray(tv)) {
      result[key] = deepMerge(tv as Record<string, unknown>, sv as Record<string, unknown>);
    } else if (sv !== undefined) {
      result[key] = sv;
    }
  }
  return result;
}
