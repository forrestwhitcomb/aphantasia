import type { CanvasDocument, CanvasShape } from "@/engine/CanvasEngine";
import type { RenderEngine, RenderOutput } from "../RenderEngine";
import type { ThemeTokens } from "@/lib/theme";
import { PRESETS, DEFAULT_PRESET, tokensToCSS, applyBrandColors, applyReferenceTokens } from "@/lib/theme";
import { contextStore } from "@/context/ContextStore";
import { referenceStore } from "@/reference/ReferenceStore";
import { renderSection, shapeToSection } from "@/render/renderSection";

// ---------------------------------------------------------------------------
// WebRenderer — Phase 1
// Converts a semantically resolved CanvasDocument into a full HTML page.
// Uses typed section components with CSS custom property theming.
// Synchronous, deterministic, zero AI dependency.
// ---------------------------------------------------------------------------

export class WebRenderer implements RenderEngine {
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

    if (inside.length === 0) {
      return { html: emptyState(getTheme()), css: "" };
    }

    const theme = getTheme();
    const blocks = inside
      .map((s) => renderBlock(s, theme))
      .filter(Boolean)
      .join("\n");
    return { html: wrapDocument(blocks, theme), css: "" };
  }

  async render(doc: CanvasDocument, context: string): Promise<RenderOutput> {
    return this.renderPhase1(doc);
  }

  async renderPhase2(doc: CanvasDocument, _context: string): Promise<RenderOutput> {
    return this.renderPhase1(doc);
  }
}

// ---------------------------------------------------------------------------
// Block dispatch — delegates to shared shapeToSection + renderSection
// ---------------------------------------------------------------------------

function renderBlock(shape: CanvasShape, _theme: ThemeTokens): string {
  const section = shapeToSection(shape);
  return renderSection(section);
}

// ---------------------------------------------------------------------------
// Theme resolution — reads from ContextStore
// ---------------------------------------------------------------------------

function getTheme(): ThemeTokens {
  const ctx = contextStore.getContext();
  let theme = PRESETS[DEFAULT_PRESET];

  // Layer 1: Apply reference-extracted tokens (background, radius, fonts, spacing, etc.)
  const readyRefs = referenceStore.getReadyReferences();
  const styleRefs = readyRefs.filter((r) => r.tag === "style" && r.extractedTokens);
  for (const ref of styleRefs) {
    theme = applyReferenceTokens(theme, ref.extractedTokens!);
  }

  // Layer 2: Explicit context brand colors take highest priority
  if (ctx?.colors?.length) {
    theme = applyBrandColors(theme, ctx.colors);
  }

  return theme;
}

// ---------------------------------------------------------------------------
// Document shell
// ---------------------------------------------------------------------------

function wrapDocument(body: string, theme: ThemeTokens): string {
  const rootCSS = tokensToCSS(theme);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,400&display=swap" rel="stylesheet" />
  <style>
${rootCSS}

${BASE_CSS}
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function emptyState(theme: ThemeTokens): string {
  return wrapDocument(
    `<div class="aph-empty"><p>Draw shapes inside the Page frame to see a live preview.</p></div>`,
    theme
  );
}

// ---------------------------------------------------------------------------
// Base CSS — all values via CSS custom properties
// ---------------------------------------------------------------------------

const BASE_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; }
body {
  font-family: var(--font-body);
  background: var(--background);
  color: var(--foreground);
  line-height: 1.6;
}
a { color: inherit; text-decoration: none; }

/* Layout */
.aph-inner {
  max-width: var(--inner-max);
  margin: 0 auto;
  padding: 0 40px;
}

/* Buttons */
.aph-btn-accent {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 11px 22px;
  background: var(--accent);
  color: var(--accent-foreground);
  font-family: var(--font-body);
  font-size: 14px; font-weight: 600;
  border-radius: var(--radius);
  border: none; cursor: pointer;
  transition: opacity 0.15s;
}
.aph-btn-accent:hover { opacity: 0.85; }
.aph-btn-accent.aph-btn-sm { padding: 7px 14px; font-size: 13px; }
.aph-btn-accent.aph-btn-lg { padding: 14px 28px; font-size: 15px; }
.aph-btn-accent.aph-btn-full { width: 100%; justify-content: center; }

.aph-btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 11px 22px;
  border: 1px solid var(--border);
  color: var(--foreground);
  font-family: var(--font-body);
  font-size: 14px; font-weight: 500;
  border-radius: var(--radius);
  cursor: pointer;
  transition: border-color 0.15s;
}
.aph-btn-ghost:hover { border-color: var(--muted-foreground); }
.aph-btn-ghost.aph-btn-lg { padding: 14px 28px; font-size: 15px; }

/* Badge */
.aph-badge {
  display: inline-block;
  padding: 3px 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 12px; font-weight: 500;
  color: var(--muted-foreground);
}
.aph-badge-outline {
  background: transparent;
  border-color: var(--border);
}

/* Section header */
.aph-section-header { text-align: center; margin-bottom: 56px; }
.aph-section-title {
  font-family: var(--font-heading);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.aph-section-subtitle {
  margin-top: 12px;
  font-size: 17px;
  color: var(--muted-foreground);
  max-width: 560px;
  margin-left: auto; margin-right: auto;
}

/* Nav */
.aph-nav {
  border-bottom: 1px solid var(--border);
  background: var(--background);
  position: sticky; top: 0; z-index: 10;
}
.aph-nav-inner {
  display: flex; align-items: center;
  justify-content: space-between;
  padding-top: 18px; padding-bottom: 18px;
}
.aph-logo {
  font-family: var(--font-heading);
  font-size: 17px; font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.aph-nav-links {
  list-style: none;
  display: flex; gap: 28px;
}
.aph-nav-link {
  font-size: 14px; font-weight: 500;
  color: var(--muted-foreground);
  transition: color 0.15s;
}
.aph-nav-link:hover { color: var(--foreground); }

/* Hero */
.aph-hero { padding: var(--section-py) 0; }
.aph-hero-inner { max-width: var(--inner-max); margin: 0 auto; padding: 0 40px; }
.aph-hero-badge { margin-bottom: 24px; }
.aph-hero-h1 {
  font-family: var(--font-heading);
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  max-width: 760px;
  color: var(--foreground);
}
.aph-hero-sub {
  margin-top: 24px;
  font-size: 18px;
  color: var(--muted-foreground);
  line-height: 1.7;
  max-width: 560px;
}
.aph-hero-cta {
  margin-top: 40px;
  display: flex; gap: 12px; flex-wrap: wrap;
}

/* Feature grid */
.aph-feature-grid {
  padding: var(--section-py) 0;
  background: var(--surface-alt);
}
.aph-feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
.aph-feature-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  transition: transform 0.2s;
}
.aph-feature-card:hover { transform: translateY(-2px); }
.aph-feature-icon {
  font-size: 22px; margin-bottom: 16px;
  color: var(--accent);
}
.aph-feature-heading {
  font-family: var(--font-heading);
  font-size: 17px; font-weight: 600;
  margin-bottom: 8px;
  color: var(--foreground);
}
.aph-feature-body {
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.65;
}
.aph-feature-image {
  margin: -28px -28px 16px -28px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow: hidden;
}
.aph-feature-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}
.aph-feature-card--has-image { padding-top: 0; }

/* Split */
.aph-split { padding: var(--section-py) 0; }
.aph-split-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.aph-split-flip { direction: rtl; }
.aph-split-flip > * { direction: ltr; }
.aph-split-heading {
  font-family: var(--font-heading);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  color: var(--foreground);
}
.aph-split-body {
  font-size: 16px;
  color: var(--muted-foreground);
  line-height: 1.7;
  margin-bottom: 28px;
}
.aph-split-cta { margin-top: 4px; }
.aph-split-image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: var(--radius-lg);
  display: block;
}
.aph-split-placeholder {
  aspect-ratio: 4/3;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
}
.aph-split-placeholder-label {
  font-size: 12px;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* CTA */
.aph-cta {
  padding: var(--section-py) 0;
  background: var(--foreground);
}
.aph-cta-inner { text-align: center; }
.aph-cta-heading {
  font-family: var(--font-heading);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--background);
  margin-bottom: 16px;
}
.aph-cta-sub {
  font-size: 17px;
  color: color-mix(in srgb, var(--background) 70%, transparent);
  margin-bottom: 36px;
}
.aph-cta-actions {
  display: flex; gap: 12px;
  justify-content: center; flex-wrap: wrap;
}
.aph-cta .aph-btn-accent {
  background: var(--background);
  color: var(--foreground);
}
.aph-cta .aph-btn-ghost {
  border-color: rgba(255,255,255,0.25);
  color: var(--background);
}

/* Portfolio */
.aph-portfolio { padding: var(--section-py) 0; }
.aph-portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
.aph-portfolio-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
  transition: transform 0.2s;
}
.aph-portfolio-card:hover { transform: translateY(-3px); }
.aph-portfolio-thumb {
  aspect-ratio: 16/9;
  background: var(--surface-alt);
  border-bottom: 1px solid var(--border);
}
.aph-portfolio-info { padding: 20px; }
.aph-portfolio-title {
  font-size: 16px; font-weight: 600;
  margin-bottom: 6px;
  color: var(--foreground);
}
.aph-portfolio-desc {
  font-size: 13px;
  color: var(--muted-foreground);
  margin-bottom: 12px;
  line-height: 1.5;
}
.aph-portfolio-tags { display: flex; gap: 6px; flex-wrap: wrap; }

/* E-commerce */
.aph-ecommerce { padding: var(--section-py) 0; }
.aph-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
.aph-product-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
}
.aph-product-thumb {
  aspect-ratio: 1;
  background: var(--surface-alt);
  border-bottom: 1px solid var(--border);
  position: relative;
}
.aph-product-badge {
  position: absolute; top: 12px; left: 12px;
  background: var(--accent);
  color: var(--accent-foreground);
  border: none;
}
.aph-product-info { padding: 16px; }
.aph-product-name {
  font-size: 15px; font-weight: 600;
  margin-bottom: 4px;
  color: var(--foreground);
}
.aph-product-desc {
  font-size: 13px;
  color: var(--muted-foreground);
  margin-bottom: 12px;
}
.aph-product-footer {
  display: flex; align-items: center;
  justify-content: space-between;
}
.aph-product-price {
  font-size: 16px; font-weight: 700;
  color: var(--foreground);
}

/* Event signup */
.aph-event { padding: var(--section-py) 0; }
.aph-event-inner {
  max-width: var(--inner-max); margin: 0 auto; padding: 0 40px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start;
}
.aph-event-meta { display: flex; gap: 8px; margin-bottom: 20px; }
.aph-event-title {
  font-family: var(--font-heading);
  font-size: clamp(24px, 3vw, 40px);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  color: var(--foreground);
}
.aph-event-desc {
  font-size: 16px;
  color: var(--muted-foreground);
  line-height: 1.7;
}
.aph-event-form {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  display: flex; flex-direction: column; gap: 12px;
}
.aph-event-form-heading {
  font-size: 16px; font-weight: 600;
  margin-bottom: 4px;
  color: var(--foreground);
}

/* Generic */
.aph-generic { padding: var(--section-py) 0; }
.aph-generic-inner { max-width: 720px; }
.aph-generic-body {
  font-size: 17px;
  color: var(--muted-foreground);
  line-height: 1.75;
  margin-top: 16px; margin-bottom: 28px;
}

/* Footer */
.aph-footer {
  border-top: 1px solid var(--border);
  padding: 48px 0 32px;
  background: var(--surface-alt);
}
.aph-footer-top {
  display: flex; gap: 64px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}
.aph-footer-brand { flex: 0 0 200px; }
.aph-footer-logo {
  font-family: var(--font-heading);
  font-size: 17px; font-weight: 700;
  color: var(--foreground);
  display: block; margin-bottom: 8px;
}
.aph-footer-tagline {
  font-size: 13px;
  color: var(--muted-foreground);
  line-height: 1.5;
}
.aph-footer-cols {
  flex: 1;
  display: flex; gap: 40px; flex-wrap: wrap;
}
.aph-footer-col-heading {
  font-size: 12px; font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--foreground);
  margin-bottom: 12px;
}
.aph-footer-col-links {
  list-style: none;
  display: flex; flex-direction: column; gap: 8px;
}
.aph-footer-col-links a {
  font-size: 13px;
  color: var(--muted-foreground);
  transition: color 0.15s;
}
.aph-footer-col-links a:hover { color: var(--foreground); }
.aph-footer-bottom {
  border-top: 1px solid var(--border);
  padding-top: 24px;
}
.aph-footer-copy {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Form inputs */
.aph-input {
  font-family: var(--font-body);
  font-size: 14px;
  padding: 10px 14px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--foreground);
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}
.aph-input:focus { border-color: var(--muted-foreground); }

/* Image placeholder */
.aph-img-placeholder {
  aspect-ratio: 16/9;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  margin: 20px 0;
}
.aph-img-placeholder span {
  font-size: 13px;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Empty state */
.aph-empty {
  height: 100vh;
  display: flex; align-items: center; justify-content: center;
}
.aph-empty p {
  font-size: 14px;
  color: var(--muted-foreground);
}
`;
