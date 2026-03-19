// ============================================================
// APHANTASIA — Mobile Prompt System
// ============================================================
// Builds the system + user prompt for Claude to generate
// a complete mobile UI HTML body for UI mode.
// Pattern mirrors promptSystem.ts for site rendering.
// ============================================================

import type { CanvasDocument, CanvasShape } from "@/engine/CanvasEngine";
import type { UIDesignSystem, UIInspiration } from "@/types/uiDesign";

export interface MobilePromptInput {
  doc: CanvasDocument;
  designSystem: UIDesignSystem;
  screenContext: string;
  inspirations: UIInspiration[];
  designContextImage?: string | null; // base64 dataUrl of reference screenshot
}

export interface MobileBuiltPrompt {
  systemMessage: string;
  userMessage: string;
  imageBlocks: Array<{ label: string; dataUrl: string }>;
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildSystemPrompt(ds: UIDesignSystem): string {
  return `You are a world-class mobile UI engineer specializing in iOS-grade interfaces.
Your output will be rendered directly inside an iPhone frame at exactly 393px wide.
This is a native-feeling mobile app screen — not a website.

## Your Standard
Every screen you produce should feel like it belongs in the App Store's "App of the Day."
Pixel-perfect spacing, considered micro-interactions, real visual hierarchy, and genuine delight.
The internal bar is: "Would this screenshot stop someone mid-scroll on Instagram?"

## Output Format
Return ONLY the content that goes inside <body>. Include a <style> block at the top and optionally a <script> block for micro-interactions.
Do NOT include <!DOCTYPE>, <html>, <head>, or <body> tags — just their contents.
Every section MUST have: data-aph-id="<shapeId>" AND data-aph-type="<sectionType>" attributes.

## Non-Negotiable Technical Rules
1. TOTAL width = 393px. No horizontal overflow ever. Use width:100% and box-sizing:border-box.
2. Use ONLY the exact design tokens provided below as CSS custom properties — never invent colors or styles.
3. Do NOT use any external CSS frameworks (no Tailwind, Bootstrap, etc.).
4. Do NOT use any JavaScript frameworks. Vanilla JS only.
5. Font sizes for inputs must be 16px minimum to prevent iOS zoom-on-focus.
6. Touch targets minimum 44×44px (Apple HIG).
7. Tab bars are 49-68px tall with safe-area-inset-bottom padding.
8. Sticky nav bars: position:sticky; top:0; z-index:50
9. Sticky tab bars: position:sticky; bottom:0; z-index:50

## Design System (Use these EXACTLY)
:root {
  --color-primary: ${ds.primaryColor};
  --color-secondary: ${ds.secondaryColor};
  --color-bg: ${ds.backgroundColor};
  --color-surface: ${ds.surfaceColor};
  --color-surface-alt: ${ds.surfaceAltColor};
  --color-text: ${ds.textColor};
  --color-text-muted: ${ds.textMutedColor};
  --color-accent: ${ds.accentColor};
  --color-border: ${ds.borderColor};
  --font: ${ds.fontFamily};
  --font-heading: ${ds.headingSize};
  --font-body: ${ds.bodySize};
  --font-caption: ${ds.captionSize};
  --font-weight-heading: ${ds.headingWeight};
  --radius: ${ds.borderRadius};
  --radius-card: ${ds.cardRadius};
  --radius-button: ${ds.buttonRadius};
  --radius-input: ${ds.inputRadius};
  --shadow-sm: ${ds.shadowSm};
  --shadow-card: ${ds.shadowCard};
  --spacing: ${ds.spacingBase};
  --spacing-lg: ${ds.spacingLg};
}

## Mobile Component Excellence Standards
- Cards: always use --radius-card, --shadow-card, consistent padding (16-20px)
- Buttons: always full-width on mobile, --radius-button, min-height 50px, --color-primary background
- Nav bars: 56px height, clean with logo/title left, action icon right
- Tab bars: 5 items max, icons with labels, active item in --color-primary
- Lists: 60-70px row height, leading icon/avatar, title+subtitle, trailing chevron
- Typography: heading 20-28px font-weight:700, body 15px, captions 12px, all using --font
- Imagery: always with --radius-card, object-fit:cover
- Empty states: centered, illustration placeholder, helpful message

## If Design Style Reference Provided
Study the reference screenshot closely. Extract:
- The exact visual personality (flat/depth, sparse/dense, light/dark, playful/serious)
- Component proportions and spacing rhythm
- Border styles (thin/thick/none)
- Icon style (outline/filled/duotone)
- Button styles (pill/rounded/sharp)
Replicate this personality faithfully in your output.

${ds.mood ? `## Design Mood\n${ds.mood}` : ""}`;
}

// ---------------------------------------------------------------------------
// User message builder
// ---------------------------------------------------------------------------

function shapeToDescription(shape: CanvasShape): string {
  const sticky = /sticky/i.test(shape.label ?? "") || /sticky/i.test(shape.contextNote ?? "");
  const tag = shape.semanticTag ?? "unknown";
  const label = shape.label ? ` label="${shape.label}"` : "";
  const note = shape.contextNote ? ` note="${shape.contextNote}"` : "";
  const stickyFlag = sticky ? " [STICKY]" : "";
  return `  - id="${shape.id}" type="${tag}"${label} y=${Math.round(shape.y)} h=${Math.round(shape.height)}${stickyFlag}${note}`;
}

function buildUserMessage(input: MobilePromptInput): string {
  const { doc, designSystem: ds, screenContext, inspirations } = input;
  const frameShapes = doc.shapes
    .filter((s) => s.isInsideFrame && !s.meta?._consumed)
    .sort((a, b) => a.y - b.y);

  const layoutLines = frameShapes.map(shapeToDescription).join("\n");
  const frameHeight = doc.frame.height;
  const isScrollable = frameHeight > 852;

  const inspirationLines = inspirations.length > 0
    ? `\n## Inspirations\n${inspirations.map((insp) =>
        `  - Role: ${insp.role}${insp.label ? ` | Note: "${insp.label}"` : ""}`
      ).join("\n")}`
    : "";

  return `## Screen Goal
${screenContext || "A beautiful mobile app screen for this product."}

## Canvas Layout (top → bottom, in order)
Frame: 393×${frameHeight}px${isScrollable ? " [SCROLLABLE — content extends beyond screen]" : " [SINGLE SCREEN]"}

${layoutLines || "  (empty — create a compelling placeholder screen)"}
${inspirationLines}

## Design Tokens Reference
primaryColor: ${ds.primaryColor}
secondaryColor: ${ds.secondaryColor}
backgroundColor: ${ds.backgroundColor}
surfaceColor: ${ds.surfaceColor}
textColor: ${ds.textColor}
textMutedColor: ${ds.textMutedColor}
fontFamily: ${ds.fontFamily}
headingSize: ${ds.headingSize}
bodySize: ${ds.bodySize}
cardRadius: ${ds.cardRadius}
buttonRadius: ${ds.buttonRadius}
shadowCard: ${ds.shadowCard}
spacingBase: ${ds.spacingBase}
${ds.mood ? `mood: ${ds.mood}` : ""}

## Output Requirements
- Output <style> block first, then HTML sections in the exact order from Canvas Layout
- Each section MUST have data-aph-id matching the id above and data-aph-type matching the type
- STICKY sections must use position:sticky; bottom:0 or top:0 as appropriate
- Use ALL provided design tokens — no hardcoded colors
- Make it look like a real app, not a wireframe`;
}

// ---------------------------------------------------------------------------
// Image blocks assembler
// ---------------------------------------------------------------------------

function buildImageBlocks(input: MobilePromptInput): Array<{ label: string; dataUrl: string }> {
  const blocks: Array<{ label: string; dataUrl: string }> = [];

  if (input.designContextImage) {
    blocks.push({
      label: "Design system reference — extract style precisely from this screenshot",
      dataUrl: input.designContextImage,
    });
  }

  for (const insp of input.inspirations) {
    if (insp.source?.startsWith("data:")) {
      blocks.push({
        label: `Inspiration (role: ${insp.role})${insp.label ? ` — ${insp.label}` : ""}`,
        dataUrl: insp.source,
      });
    }
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function buildMobilePrompt(input: MobilePromptInput): MobileBuiltPrompt {
  return {
    systemMessage: buildSystemPrompt(input.designSystem),
    userMessage: buildUserMessage(input),
    imageBlocks: buildImageBlocks(input),
  };
}
