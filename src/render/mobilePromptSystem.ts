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
  const c = ds.colors;
  const t = ds.typography;
  const s = ds.shape;
  const sp = ds.spacing;
  const comp = ds.components;
  const elev = ds.elevation;

  return `You are a world-class mobile UI engineer specializing in ${ds.platform === "android" ? "Material Design" : "iOS-grade"} interfaces.
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
  --color-bg: ${c.background};
  --color-bg-secondary: ${c.backgroundSecondary};
  --color-text: ${c.foreground};
  --color-text-muted: ${c.foregroundSecondary};
  --color-text-tertiary: ${c.foregroundTertiary};
  --color-primary: ${c.accent};
  --color-primary-fg: ${c.accentForeground};
  --color-separator: ${c.separator};
  --color-surface: ${c.surface};
  --color-surface-elevated: ${c.surfaceElevated};
  --font: ${t.fontFamily};
  --font-title1: ${t.scale.title1.size};
  --font-title3: ${t.scale.title3.size};
  --font-headline: ${t.scale.headline.size};
  --font-body: ${t.scale.body.size};
  --font-caption: ${t.scale.caption.size};
  --font-weight-heading: ${t.scale.headline.weight};
  --radius-sm: ${s.radiusSmall};
  --radius-md: ${s.radiusMedium};
  --radius-lg: ${s.radiusLarge};
  --shadow-card: ${elev.cardShadow};
  --screen-padding: ${sp.screenPadding};
  --inner-padding: ${sp.innerPadding};
  --icon-size: ${sp.iconSize};
}

## Component Patterns
- Nav bar: ${comp.navBar.style} style, ${comp.navBar.hasDivider ? "with divider" : "no divider"}
- Tab bar: ${comp.tabBar.style} style, active=${comp.tabBar.activeColor}
- List items: ${comp.listItem.style} style, height=${comp.listItem.height}, ${comp.listItem.hasChevron ? "chevron" : "no chevron"}
- Cards: ${comp.card.style} style, radius=${comp.card.radius}, padding=${comp.card.padding}
- Buttons: ${comp.button.primaryStyle} style, radius=${comp.button.radius}, height=${comp.button.height}
- Inputs: ${comp.input.style} style, radius=${comp.input.radius}, height=${comp.input.height}

## Mobile Component Excellence Standards
- Cards: always use --radius-md, --shadow-card, consistent padding
- Buttons: always full-width on mobile, --radius-md, min-height ${comp.button.height}
- Nav bars: clean with logo/title left, action icon right
- Tab bars: 5 items max, icons with labels, active item in --color-primary
- Lists: ${comp.listItem.height} row height, leading icon/avatar, title+subtitle
- Typography: heading ${t.scale.title1.size} weight:${t.scale.title1.weight}, body ${t.scale.body.size}
- Imagery: always with --radius-lg, object-fit:cover

## If Design Style Reference Provided
Study the reference screenshot closely. Replicate the visual personality faithfully.

${ds.productName ? `## Product: ${ds.productName}` : ""}`;
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
  const { doc, designSystem: d, screenContext, inspirations } = input;
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
accent: ${d.colors.accent}
background: ${d.colors.background}
surface: ${d.colors.surface}
foreground: ${d.colors.foreground}
foregroundSecondary: ${d.colors.foregroundSecondary}
fontFamily: ${d.typography.fontFamily}
title1: ${d.typography.scale.title1.size}
body: ${d.typography.scale.body.size}
cardRadius: ${d.components.card.radius}
buttonRadius: ${d.components.button.radius}
elevation: ${d.elevation.model}
platform: ${d.platform}

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
