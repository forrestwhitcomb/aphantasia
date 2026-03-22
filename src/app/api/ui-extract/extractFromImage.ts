// Shared design system extraction via Claude Vision.
// Used by both /api/ui-extract (screenshot) and /api/ui-extract-url (URL screenshot).

import { getAnthropicClient } from "@/lib/anthropic";
import type { UIDesignSystem } from "@/ui-mode/types";

export const EXTRACTION_SYSTEM_PROMPT = `You are a design system extraction engine. You analyze screenshots of mobile applications and extract precise design tokens.

You MUST return a JSON object matching this exact schema. Every value must be a valid CSS value.

## Schema

\`\`\`json
{
  "fonts": {
    "heading": { "family": "<CSS font stack>", "weight": <number>, "letterSpacing": "<CSS value>" },
    "body": { "family": "<CSS font stack>", "weight": <number>, "letterSpacing": "<CSS value>" },
    "caption": { "family": "<CSS font stack>", "weight": <number> },
    "mono": { "family": "<CSS font stack>", "weight": <number> }
  },
  "fontSizes": {
    "xs": "<px>", "sm": "<px>", "base": "<px>", "lg": "<px>",
    "xl": "<px>", "2xl": "<px>", "3xl": "<px>"
  },
  "colors": {
    "background": "<hex>",
    "foreground": "<hex>",
    "primary": "<hex>",
    "primaryForeground": "<hex>",
    "secondary": "<hex>",
    "secondaryForeground": "<hex>",
    "muted": "<hex>",
    "mutedForeground": "<hex>",
    "accent": "<hex>",
    "accentForeground": "<hex>",
    "destructive": "<hex>",
    "border": "<hex>",
    "input": "<hex>",
    "ring": "<hex>",
    "card": "<hex>",
    "cardForeground": "<hex>"
  },
  "spacing": {
    "xs": "<px>", "sm": "<px>", "md": "<px>",
    "lg": "<px>", "xl": "<px>", "2xl": "<px>"
  },
  "radii": {
    "none": "0px", "sm": "<px>", "md": "<px>", "lg": "<px>",
    "xl": "<px>", "full": "9999px",
    "button": "<px>", "card": "<px>", "input": "<px>"
  },
  "shadows": {
    "sm": "<CSS box-shadow>", "md": "<CSS box-shadow>", "lg": "<CSS box-shadow>",
    "card": "<CSS box-shadow>", "button": "<CSS box-shadow>", "input": "<CSS box-shadow>"
  },
  "components": {
    "navBar": { "height": "<px>", "blur": "<CSS backdrop-filter>", "borderBottom": "<CSS border>" },
    "card": { "padding": "<px>", "gap": "<px>" },
    "button": { "height": "<px>", "paddingX": "<px>", "fontSize": "<px>" },
    "input": { "height": "<px>", "paddingX": "<px>", "fontSize": "<px>" },
    "list": { "itemHeight": "<px>", "divider": "<CSS border>" },
    "tabBar": { "height": "<px>", "iconSize": "<px>" }
  },
  "name": "<app name or description>",
  "confidence": <0-1>
}
\`\`\`

## Extraction Rules

For colors: Extract EXACT hex values by sampling pixels. Map each to its semantic role:
- background: dominant screen background
- foreground: primary text color — MUST contrast with background
- primary: main brand/action color (buttons, links, active states)
- primaryForeground: text color ON primary backgrounds — MUST contrast with primary (white on dark primary, dark on light primary)
- secondary: supporting background color (chips, secondary buttons)
- secondaryForeground: text on secondary backgrounds — MUST contrast with secondary
- muted: subdued backgrounds (disabled states, subtle containers)
- mutedForeground: subdued text (placeholders, secondary labels) — MUST contrast with muted
- accent: highlight color (badges, active tabs, pills) — often same as primary
- accentForeground: text on accent backgrounds — MUST contrast with accent
- destructive: red/error color
- border: border and divider color
- input: input field border color (often same as border)
- ring: focus ring color (often same as primary)
- card: card/container background (often slightly different from main bg, or same)
- cardForeground: text on cards — MUST contrast with card background

CRITICAL CONTRAST RULE: Every "Foreground" color MUST be readable against its paired background. Dark backgrounds need light text (#FFFFFF or near-white). Light backgrounds need dark text (#000000 or near-black). Never pair similar luminance colors (e.g. white text on white card, or dark text on dark primary).

For typography: Identify font family category and provide closest Google Font match:
- Geometric sans: Inter, DM Sans, Geist, Circular
- Neo-grotesque: SF Pro (use "'Inter', -apple-system, BlinkMacSystemFont, sans-serif")
- Humanist: Plus Jakarta Sans, Nunito
- Rounded: Nunito, Quicksand
Extract approximate sizes for the T-shirt scale based on visible text hierarchy.

For spacing: Measure pixel distances. Provide a consistent scale (typically 4/8/16/24/32/48).

For radii: Measure actual border-radius on buttons, cards, inputs carefully. This is critical for matching the design feel:
- Sharp/angular designs: 0-4px
- Slightly rounded: 6-10px
- Modern rounded: 12-16px
- Very rounded/pill-like: 20-28px
- Full pill: 9999px
Set button, card, and input radii to the EXACT values you observe, not generic defaults. The "feel" of the design depends heavily on getting this right.

For shadows: Describe shadow style and provide CSS box-shadow values. Use "none" if the design is flat.

For component tokens: Measure heights, padding, font sizes of visible NavBar, buttons, inputs, list items, cards, tab bar.

Confidence: Rate 0-1. Lower if screenshot is blurry, partial, or unusual.

Return ONLY the JSON object. No markdown, no explanation.`;

/**
 * Extract a UIDesignSystem from a base64 image using Claude Vision.
 */
export async function extractDesignSystemFromImage(
  base64: string,
  mediaType: "image/png" | "image/jpeg"
): Promise<UIDesignSystem> {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: EXTRACTION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          {
            type: "text",
            text: "Extract the design system from this mobile app screenshot. Return ONLY the JSON object matching the schema.",
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  let jsonStr = textBlock.text.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  return JSON.parse(jsonStr) as UIDesignSystem;
}
