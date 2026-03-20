import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import type { UIDesignSystem } from "@/types/uiDesign";

// POST /api/ui/extract-design
// Body: { imageData: string } — base64 dataUrl of reference screenshot
// Returns: UIDesignSystem JSON (comprehensive nested structure)
//
// This is the #1 priority endpoint for UI mode. Every downstream component
// reads from the extracted design system. If extraction gets colors wrong,
// every component looks wrong. If it misses list item style, lists don't
// match. If spacing is off, the whole screen feels wrong even if individual
// components are correct.

const SYSTEM_PROMPT = `You are an expert mobile UI designer reverse-engineering a design system from a product screenshot.

Your job is to extract every design decision visible in this screenshot as precise, CSS-ready values. You are not describing the screenshot — you are reconstructing the design system that produced it.

You will receive a screenshot of a mobile app. Assume a 393px viewport width (iPhone 15 logical pixels). All measurements should be in px relative to this viewport.

## How to analyze

Work through the screenshot systematically:

### 1. Color sampling
Sample exact hex colors from the screenshot. Do not guess or approximate.
- Background: sample the dominant screen background
- Text colors: sample primary heading text, secondary/body text, and tertiary/placeholder text
- Accent: sample the primary interactive color (buttons, links, toggles, active states)
- Surfaces: sample card backgrounds, cell backgrounds, elevated surfaces
- Separators: sample divider/border colors between elements
- If the app is dark-themed, backgrounds will be dark and text will be light — identify this correctly

### 2. Typography identification
Identify the typeface by examining letterforms:
- Geometric sans-serif (circular o, even stroke width): Inter, Circular, Geist, DM Sans, Nunito Sans
- Neo-grotesque (slightly squared, neutral): SF Pro, Helvetica Neue, Roboto, Suisse Int'l
- Humanist (calligraphic influence, varied stroke): Plus Jakarta Sans, Nunito, Source Sans
- Rounded (soft terminals): Nunito, Comfortaa, Quicksand
- Serif: look for serifs on stems
Provide a complete CSS font stack. For iOS apps where the font appears to be the system font, use: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"

For the type scale, measure the actual pixel sizes visible in the screenshot:
- largeTitle: the biggest heading visible (often 34px on iOS)
- title1: primary section headings
- title2: secondary headings
- title3: tertiary headings or large labels
- headline: emphasized body text or navigation titles
- body: standard readable text
- callout: slightly smaller than body
- subhead: secondary labels, metadata
- footnote: small labels, timestamps
- caption: smallest text visible (badges, fine print)

If only a few sizes are visible, derive the complete scale using the platform's standard type ramp ratios. On iOS, the standard ratios are: 34 / 28 / 22 / 20 / 17 / 17 / 16 / 15 / 13 / 12.

### 3. Spacing measurement
Measure in px assuming 393px viewport width:
- screenPadding: the horizontal margin between screen edge and content (usually 16px or 20px)
- sectionGap: vertical space between major content groups
- itemGap: vertical space between adjacent items in a list or stack
- innerPadding: padding inside cards, cells, containers
- iconSize: the standard icon dimension (usually 20-28px)
- avatarSize: profile picture / avatar dimensions (usually 32-48px)

### 4. Corner radius strategy
Apps have a deliberate radius hierarchy:
- radiusSmall: chips, badges, small tags (4-8px)
- radiusMedium: cards, inputs, buttons (8-16px)
- radiusLarge: modals, bottom sheets, large cards (16-24px)
- radiusFull: pills, circular avatars, toggle tracks (999px)

### 5. Elevation model
How does the app differentiate surface layers?
- "flat": no shadows, no visible borders — surfaces differentiated only by fill color
- "subtle-shadow": light, diffuse shadows on cards and elevated elements
- "material": strong, defined shadows with clear offset (Material Design)
- "glass": frosted glass / backdrop-blur effects
Extract the actual CSS box-shadow values you observe. If the app uses borders instead of shadows, set shadows to "none".

### 6. Component pattern extraction
This is critical. Look at each visible component type and extract the ACTUAL pattern used, not what you'd recommend:

**Nav bar**: Is it large-title (iOS-style with big text that collapses), inline-title (centered or left-aligned smaller title), transparent (overlays content), or colored (solid color background different from page)?

**Tab bar**: Does it show icon+label under each item, icon-only, label-only, or floating (detached from bottom edge)?

**List items**: What's the row height? Plain (full-width rows), inset-grouped (rounded section with inset rows), grouped (separated sections), or card (each row is a card)? Do they have disclosure chevrons? Dividers? How far is the divider inset from the left?

**Cards**: Elevated (shadow), bordered (stroke outline), filled (solid background, no shadow/border), or glass (blur)?

**Buttons**: Filled (solid accent color), tinted (semi-transparent accent), or outlined (border only)?

**Inputs**: Underline (bottom border only), bordered (full border), filled (solid background), or floating-label (label animates above)?

**Status bar**: Is the status bar content light (white icons — indicates dark background) or dark (black icons — indicates light background)?

### 7. Platform identification
- iOS indicators: SF Pro font, large-title nav bars, rounded rect tab bar icons, pull-to-refresh rubber banding, notch/dynamic island
- Android indicators: Roboto font, Material top app bar, bottom navigation with filled icons, FAB, system nav bar
- Cross-platform: doesn't clearly match either (e.g., custom design system like Linear or Notion)

## Output format
Return ONLY valid JSON matching the UIDesignSystem schema below. No markdown fences. No explanation. No extra text.`;

const USER_PROMPT = `Analyze this mobile app screenshot and extract the complete UIDesignSystem.

For every field, provide the ACTUAL CSS-ready value you observe, not a description.
For colors, use exact hex values sampled from the screenshot.
For typography, identify the font family and provide exact sizes in px.
For spacing, measure in px relative to the screen width (assume 393px viewport).
For component patterns, describe what you see — not what you'd recommend.

If the screenshot shows an iOS app, set platform: "ios".
If Android (Material Design patterns), set platform: "android".
If neither clearly, set platform: "cross-platform".

Return ONLY valid JSON matching this exact schema. No explanation.

{
  "productName": "string or null",
  "platform": "ios | android | cross-platform",
  "colors": {
    "background": "#hex — main screen background",
    "backgroundSecondary": "#hex — secondary surfaces, grouped backgrounds",
    "foreground": "#hex — primary text",
    "foregroundSecondary": "#hex — secondary/muted text",
    "foregroundTertiary": "#hex — placeholder, disabled text",
    "accent": "#hex — tint, buttons, interactive elements",
    "accentForeground": "#hex — text on accent backgrounds",
    "separator": "#hex — dividers, hairlines",
    "destructive": "#hex — delete, error (default #EF4444 if not visible)",
    "surface": "#hex — card/cell background",
    "surfaceElevated": "#hex — modal/sheet background",
    "overlay": "rgba(0,0,0,0.4) — scrim"
  },
  "typography": {
    "fontFamily": "CSS font stack — precise identification",
    "fontFamilyMono": "mono font or null",
    "scale": {
      "largeTitle": { "size": "34px", "weight": "700", "tracking": "-0.4px" },
      "title1": { "size": "28px", "weight": "700", "tracking": "-0.4px" },
      "title2": { "size": "22px", "weight": "700", "tracking": "-0.3px" },
      "title3": { "size": "20px", "weight": "600", "tracking": "-0.2px" },
      "headline": { "size": "17px", "weight": "600", "tracking": "-0.2px" },
      "body": { "size": "17px", "weight": "400", "tracking": "-0.2px" },
      "callout": { "size": "16px", "weight": "400", "tracking": "-0.2px" },
      "subhead": { "size": "15px", "weight": "400", "tracking": "-0.1px" },
      "footnote": { "size": "13px", "weight": "400", "tracking": "0px" },
      "caption": { "size": "12px", "weight": "400", "tracking": "0px" }
    }
  },
  "shape": {
    "radiusSmall": "Npx",
    "radiusMedium": "Npx",
    "radiusLarge": "Npx",
    "radiusFull": "999px"
  },
  "elevation": {
    "model": "flat | subtle-shadow | material | glass",
    "cardShadow": "CSS box-shadow or none",
    "sheetShadow": "CSS box-shadow",
    "navShadow": "CSS box-shadow or none"
  },
  "spacing": {
    "screenPadding": "Npx",
    "sectionGap": "Npx",
    "itemGap": "Npx",
    "innerPadding": "Npx",
    "iconSize": "Npx",
    "avatarSize": "Npx"
  },
  "components": {
    "navBar": {
      "style": "large-title | inline-title | transparent | colored",
      "background": "#hex",
      "titleWeight": "number",
      "hasDivider": true/false
    },
    "tabBar": {
      "style": "icon-label | icon-only | label-only | floating",
      "background": "#hex",
      "activeColor": "#hex",
      "inactiveColor": "#hex",
      "hasDivider": true/false
    },
    "listItem": {
      "height": "Npx",
      "style": "plain | inset-grouped | grouped | card",
      "hasChevron": true/false,
      "hasDivider": true/false,
      "dividerInset": "Npx"
    },
    "card": {
      "style": "elevated | bordered | filled | glass",
      "padding": "Npx",
      "radius": "Npx"
    },
    "button": {
      "primaryStyle": "filled | tinted | outlined",
      "radius": "Npx",
      "height": "Npx",
      "textWeight": "number"
    },
    "input": {
      "style": "underline | bordered | filled | floating-label",
      "radius": "Npx",
      "height": "Npx"
    },
    "statusBar": "light | dark"
  },
  "iconography": {
    "style": "sf-symbols | material | outlined | filled | custom",
    "weight": "light | regular | medium | semibold",
    "size": "Npx"
  }
}`;

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
    max_tokens: 4096,
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
            text: USER_PROMPT,
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
