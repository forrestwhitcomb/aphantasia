import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import type { UIDesignSystem } from "@/types/uiDesign";

// POST /api/ui/extract-design
// Body: { imageData: string } — base64 dataUrl of reference screenshot
// Returns: UIDesignSystem JSON (comprehensive)

const SYSTEM_PROMPT = `You are an elite mobile UI design system architect. Your job is to reverse-engineer a complete, production-grade design system from a single mobile app screenshot.

Study every pixel of the screenshot. Analyze:
- Color relationships (primary actions, backgrounds, surfaces, text hierarchy, borders, states)
- Typography system (font family identification, size scale, weight scale, line heights, letter spacing)
- Spacing rhythm (horizontal page margins, gaps between elements, internal padding)
- Corner radius strategy (buttons vs cards vs inputs vs avatars — each likely differs)
- Elevation strategy (shadows vs borders vs flat — how are surfaces differentiated?)
- Component dimensions (nav height, input height, button height, list row height, tab bar)
- Overall visual density and personality

Return ONLY a valid JSON object — no markdown fences, no explanation, no extra text.

The JSON must match this shape exactly. For optional fields, include them if you can determine them; omit if not visible:

{
  "primaryColor": "<hex — dominant brand/action color for buttons, links, active states>",
  "secondaryColor": "<hex — secondary brand color; if none, a complementary shade>",
  "backgroundColor": "<hex — main screen/page background>",
  "surfaceColor": "<hex — card or elevated surface background>",
  "surfaceAltColor": "<hex — subtle alternate surface, e.g. input backgrounds, hover states>",
  "textColor": "<hex — primary/heading text color>",
  "textMutedColor": "<hex — secondary/body/caption text>",
  "accentColor": "<hex — accent/highlight/success color>",
  "borderColor": "<hex — dividers, subtle strokes>",

  "errorColor": "<hex — destructive/error color, typically red>",
  "successColor": "<hex — success/confirmation color, typically green>",
  "warningColor": "<hex — warning/caution color>",
  "buttonTextColor": "<hex — text color on primary-colored buttons>",
  "navBackground": "<hex — nav bar background (may be same as backgroundColor or different)>",
  "primaryGradient": "<CSS gradient string if any gradient is visible, otherwise omit>",
  "cardBorderColor": "<hex — card border color, often transparent or very subtle>",

  "fontFamily": "<CSS font stack — identify the typeface precisely. Examples: 'SF Pro Display', -apple-system, sans-serif OR 'Inter', sans-serif OR 'Poppins', sans-serif>",
  "headingSize": "<px — largest heading size visible>",
  "subheadingSize": "<px — section heading / medium heading>",
  "bodySize": "<px — standard body text>",
  "captionSize": "<px — smallest text (captions, timestamps, badges)>",
  "labelSize": "<px — form labels, nav items, tab labels>",
  "headingWeight": "<number — heading font weight>",
  "bodyWeight": "<number — body text font weight, usually 400>",
  "headingLineHeight": "<number — e.g. 1.2>",
  "bodyLineHeight": "<number — e.g. 1.5 or 1.6>",
  "headingLetterSpacing": "<CSS value — e.g. '-0.5px' or 'normal'>",

  "borderRadius": "<px — base/default corner radius>",
  "cardRadius": "<px — card corner radius>",
  "buttonRadius": "<px — button corner radius (could be 'full' for pill buttons; express as half of button height)>",
  "inputRadius": "<px — input field corner radius>",
  "avatarRadius": "<'50%' for circles or px value>",
  "tagRadius": "<px — chip/badge/tag radius>",

  "shadowSm": "<CSS box-shadow — subtle for small elements>",
  "shadowCard": "<CSS box-shadow — card/panel elevation>",
  "shadowLg": "<CSS box-shadow — large/modal elevation>",

  "spacingXs": "<px — tightest spacing unit>",
  "spacingSm": "<px — small spacing>",
  "spacingBase": "<px — standard spacing unit>",
  "spacingLg": "<px — larger spacing>",
  "spacingXl": "<px — section-level vertical spacing>",
  "sectionPadding": "<px — horizontal page margin / section padding>",

  "navHeight": "<px — top navigation bar height>",
  "tabBarHeight": "<px — bottom tab bar height if visible>",
  "buttonHeight": "<px — primary action button height>",
  "inputHeight": "<px — text input field height>",
  "listItemHeight": "<px — list row height if visible>",
  "cardPadding": "<px — internal card padding>",
  "iconSize": "<px — standard icon size>",

  "borderWidth": "<px — standard border/stroke width>",
  "dividerColor": "<hex — list/section divider color>",

  "mood": "<3-6 word description of the visual personality, e.g. 'bold modern fintech with depth' or 'soft minimal wellness'>",
  "density": "<'compact' | 'normal' | 'spacious'>",
  "iconStyle": "<'outlined' | 'filled' | 'duotone'>",
  "elevationStyle": "<'shadow' | 'border' | 'flat'>"
}

Critical rules:
- ALL color values must be 6-digit hex (e.g. "#1A1A2E"), never 3-digit, never named.
- All dimension values must include "px" suffix (e.g. "16px").
- For fontFamily, make your BEST identification. Look at letterforms: geometric sans → Inter/Geist/DM Sans, humanist → Nunito/Plus Jakarta Sans, neo-grotesque → SF Pro/Helvetica Neue, round → Nunito/Comfortaa.
- shadowCard and shadowSm: be precise — examine the actual shadow spread/blur visible. If the app uses borders instead of shadows, set shadows to "none" and set elevationStyle to "border".
- For primaryGradient: only include if you can see a gradient in the screenshot. Use CSS syntax like "linear-gradient(135deg, #7C3AED, #4F46E5)".
- spacingBase should reflect the actual rhythm you see — measure gaps between elements.
- Identify whether the design is compact (tight spacing, small text), normal, or spacious (generous whitespace).
- buttonRadius: if buttons are fully rounded (pill shape), use half the buttonHeight value.`;

export async function POST(req: NextRequest) {
  const { imageData } = (await req.json()) as { imageData: string };

  if (!imageData?.startsWith("data:image/")) {
    return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
  }

  const match = imageData.match(/^data:(image\/[^;]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Could not parse image data" }, { status: 400 });
  }

  type MediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  const validMediaTypes: Set<MediaType> = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
  const mediaType = match[1] as MediaType;
  const data = match[2];

  if (!validMediaTypes.has(mediaType)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }

  const client = getAnthropicClient();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data },
          },
          {
            type: "text",
            text: "Extract a comprehensive design system from this mobile app screenshot. Analyze every detail — colors, typography, spacing rhythm, corner radii, shadows, component dimensions, visual density, and personality. Return the JSON object.",
          },
        ],
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  let designSystem: UIDesignSystem;
  try {
    designSystem = JSON.parse(cleaned) as UIDesignSystem;
  } catch {
    return NextResponse.json(
      { error: "Failed to parse design system from AI response", raw },
      { status: 500 }
    );
  }

  return NextResponse.json(designSystem);
}
