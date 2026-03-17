import type { CanvasDocument, CanvasShape } from "@/engine/CanvasEngine";
import type { RenderEngine, RenderOutput } from "../RenderEngine";
import type { ThemeTokens } from "@/lib/theme";
import { tokensToCSS } from "@/lib/theme";
import { contextStore } from "@/context/ContextStore";
import { referenceStore } from "@/reference/ReferenceStore";
import { renderBlock, shapeToBlock } from "@/render/renderSection";
import { resolveDesignDirection, type ResolvedDesignDirection } from "@/render/themeResolver";
import { BASE_CSS, ANIMATION_CSS, RESPONSIVE_CSS, SCROLL_REVEAL_SCRIPT } from "@/render/sharedCSS";

// ---------------------------------------------------------------------------
// WebRenderer — Phase 1
// Converts a semantically resolved CanvasDocument into a full HTML page.
// Uses typed section components with CSS custom property theming.
// Synchronous, deterministic, zero AI dependency.
// ---------------------------------------------------------------------------

export class WebRenderer implements RenderEngine {
  private _lastDirection: ResolvedDesignDirection | null = null;

  get lastDesignDirection(): ResolvedDesignDirection | null {
    return this._lastDirection;
  }

  renderPhase1(doc: CanvasDocument): RenderOutput {
    const inside = doc.shapes
      .filter(
        (s) =>
          s.isInsideFrame &&
          s.semanticTag !== "unknown" &&
          s.semanticTag !== "scratchpad" &&
          s.semanticTag !== "context-note" &&
          s.semanticTag !== "image" &&
          !s.meta?._consumed
      )
      .sort((a, b) => a.y - b.y);

    const direction = resolveDesignDirection(
      doc,
      contextStore.getContext(),
      referenceStore.getReadyReferences()
    );
    this._lastDirection = direction;

    if (inside.length === 0) {
      return { html: emptyState(direction.tokenPalette), css: "" };
    }

    const blocks = inside
      .map((s) => renderShapeBlock(s, direction))
      .filter(Boolean)
      .join("\n");
    return { html: wrapDocument(blocks, direction), css: "" };
  }

  async render(doc: CanvasDocument, context: string): Promise<RenderOutput> {
    return this.renderPhase1(doc);
  }

  async renderPhase2(doc: CanvasDocument, _context: string): Promise<RenderOutput> {
    return this.renderPhase1(doc);
  }
}

// ---------------------------------------------------------------------------
// Block dispatch
// ---------------------------------------------------------------------------

function renderShapeBlock(shape: CanvasShape, _direction: ResolvedDesignDirection): string {
  const block = shapeToBlock(shape);
  const sectionId = shape.id.replace(/[^a-z0-9-]/gi, "-");
  return renderBlock(block, sectionId);
}

// ---------------------------------------------------------------------------
// Document shell
// ---------------------------------------------------------------------------

function wrapDocument(body: string, direction: ResolvedDesignDirection): string {
  const rootCSS = tokensToCSS(direction.tokenPalette);
  const fontLink = buildFontLink(direction);
  const animCSS = direction.animationLevel !== "none" ? ANIMATION_CSS : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  ${fontLink}
  <style>
${rootCSS}

${BASE_CSS}
${animCSS}
${RESPONSIVE_CSS}
  </style>
</head>
<body>
${body}
${direction.animationLevel !== "none" ? SCROLL_REVEAL_SCRIPT : ""}
</body>
</html>`;
}

function buildFontLink(direction: ResolvedDesignDirection): string {
  const heading = direction.tokenPalette["--font-heading"];
  const body = direction.tokenPalette["--font-body"];
  const families = new Set<string>();
  for (const val of [heading, body]) {
    const match = val.match(/^'([^']+)'/);
    if (match && !["system-ui", "Georgia", "serif", "sans-serif"].includes(match[1])) {
      families.add(match[1]);
    }
  }
  if (families.size === 0) families.add("Inter");
  const params = Array.from(families)
    .map((f) => `family=${f.replace(/ /g, "+")}:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400`)
    .join("&");
  return `<link href="https://fonts.googleapis.com/css2?${params}&display=swap" rel="stylesheet" />`;
}

function emptyState(theme: ThemeTokens): string {
  const direction: ResolvedDesignDirection = {
    archetype: "minimal",
    contentType: "general",
    tokenPalette: theme,
    typographyScale: "balanced",
    animationLevel: "none",
    layoutDensity: "balanced",
    tokenPaletteCSS: tokensToCSS(theme),
  };
  return wrapDocument(
    `<div class="aph-empty"><p>Draw shapes inside the Page frame to see a live preview.</p></div>`,
    direction
  );
}
