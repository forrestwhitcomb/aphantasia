import type { CanvasDocument, CanvasShape } from "@/engine/CanvasEngine";
import type { RenderEngine, RenderOutput } from "../RenderEngine";
import type { ThemeTokens } from "@/lib/theme";
import { tokensToCSS } from "@/lib/theme";
import { contextStore } from "@/context/ContextStore";
import { referenceStore } from "@/reference/ReferenceStore";
import { renderBlock, shapeToBlock } from "@/render/renderSection";
import { resolveDesignDirection, type ResolvedDesignDirection } from "@/render/themeResolver";
import { BASE_CSS, RESPONSIVE_CSS, SCROLL_REVEAL_SCRIPT, getAnimationCSS, getDecorativeCSS } from "@/render/sharedCSS";
import { buildGoogleFontsLink } from "@/dna/fontLibrary";
import { dnaToRootCSS, dnaStore } from "@/dna";

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
  const dna = direction.dna;
  const rootCSS = dnaToRootCSS(dna);
  const fontLinks = buildGoogleFontsLink(dna.typography.headingFamily, dna.typography.bodyFamily);
  const motionCSS = getAnimationCSS(dna);
  const decorativeCSS = getDecorativeCSS(dna);
  return `<!DOCTYPE html>
<html lang="en" data-deco="${dna.decorative.style}" data-motion="${dna.motion.level}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${fontLinks}
  <style>
${rootCSS}

${BASE_CSS}
${motionCSS}
${decorativeCSS}
${RESPONSIVE_CSS}
  </style>
</head>
<body>
${body}
${direction.animationLevel !== "none" ? SCROLL_REVEAL_SCRIPT : ""}
</body>
</html>`;
}

function emptyState(theme: ThemeTokens): string {
  const dna = dnaStore.getDNA();
  const direction: ResolvedDesignDirection = {
    archetype: "minimal",
    contentType: "general",
    tokenPalette: theme,
    typographyScale: "balanced",
    animationLevel: "none",
    layoutDensity: "balanced",
    tokenPaletteCSS: tokensToCSS(theme),
    dna,
  };
  return wrapDocument(
    `<div class="aph-empty"><p>Draw shapes inside the Page frame to see a live preview.</p></div>`,
    direction
  );
}
