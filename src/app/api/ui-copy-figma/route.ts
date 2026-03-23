// ============================================================
// APHANTASIA — Copy to Figma API Route
// ============================================================
// Proxies viewport HTML to code.to.design clipboard API.
// Returns Figma-native clipboard HTML that can be pasted
// directly into Figma as editable frames.
//
// POST { html: string }
// → strips scripts, adds Google Fonts import
// → forwards to https://api.to.design/html { html, clip: true }
// → returns { clipboardHtml: string }
// ============================================================

import { NextRequest, NextResponse } from "next/server";

const C2D_API_URL = "https://api.to.design/html";

/**
 * Strip <script> blocks from the srcDoc — code.to.design
 * only needs the visual HTML + CSS, not interactivity handlers.
 */
function stripScripts(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

/**
 * Ensure Google Fonts are imported for the font families used.
 * code.to.design requires Google Fonts (no system fonts).
 */
function ensureGoogleFonts(html: string): string {
  // Extract font families from CSS custom properties in the HTML
  const fontFamilies = new Set<string>();
  const fontRegex = /--font-[\w-]+-family:\s*'([^']+)'/g;
  let match;
  while ((match = fontRegex.exec(html)) !== null) {
    const family = match[1];
    // Skip system/generic fonts
    if (!["sans-serif", "serif", "monospace", "system-ui", "-apple-system"].includes(family)) {
      fontFamilies.add(family);
    }
  }

  if (fontFamilies.size === 0) {
    // Default: ensure Inter is available
    fontFamilies.add("Inter");
  }

  // Build Google Fonts import URL
  const families = Array.from(fontFamilies)
    .map((f) => `family=${f.replace(/\s+/g, "+")}:wght@100;200;300;400;500;600;700;800;900`)
    .join("&");
  const importUrl = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  const importTag = `<link rel="stylesheet" href="${importUrl}">`;

  // Inject after <head> or at the start
  if (html.includes("<head>")) {
    return html.replace("<head>", `<head>\n${importTag}`);
  }
  return `${importTag}\n${html}`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.CODE_TO_DESIGN_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "CODE_TO_DESIGN_API_KEY not configured",
        setup: "Add your API key from https://code.to.design/settings/api-keys to .env.local",
      },
      { status: 401 }
    );
  }

  let body: { html?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { html } = body;
  if (!html || typeof html !== "string") {
    return NextResponse.json({ error: "Missing html field" }, { status: 400 });
  }

  // Prepare HTML: strip scripts, ensure Google Fonts
  const cleanHtml = ensureGoogleFonts(stripScripts(html));

  try {
    const response = await fetch(C2D_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ html: cleanHtml, clip: true }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error("[ui-copy-figma] code.to.design error:", response.status, errorText);
      return NextResponse.json(
        { error: `code.to.design API error: ${response.status}`, detail: errorText },
        { status: 502 }
      );
    }

    // code.to.design returns the clipboard HTML as text
    const clipboardHtml = await response.text();

    return NextResponse.json({ clipboardHtml });
  } catch (err) {
    console.error("[ui-copy-figma] Network error:", err);
    return NextResponse.json(
      { error: "Failed to connect to code.to.design API" },
      { status: 502 }
    );
  }
}
