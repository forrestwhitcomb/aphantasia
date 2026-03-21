// ============================================================
// APHANTASIA — Decorative CSS Generator
// ============================================================
// Generates CSS for 6 decorative background styles, each at
// 3 intensity levels. Uses ::before/::after pseudo-elements
// so content remains unaffected (z-index layering).
// Keyed off data-deco attribute on <html>.
// ============================================================

import type { DecorativeStyle, DecorativeIntensity, DNAPalette } from "./DesignDNA";

// ---------------------------------------------------------------------------
// Intensity → opacity mapping
// ---------------------------------------------------------------------------

function intensityOpacity(intensity: DecorativeIntensity): number {
  switch (intensity) {
    case "subtle": return 0.03;
    case "moderate": return 0.06;
    case "bold": return 0.12;
  }
}

function intensityScale(intensity: DecorativeIntensity): number {
  switch (intensity) {
    case "subtle": return 0.5;
    case "moderate": return 1;
    case "bold": return 1.5;
  }
}

// ---------------------------------------------------------------------------
// Helper: hex to rgba with opacity
// ---------------------------------------------------------------------------

function hexToRGBA(hex: string, alpha: number): string {
  // Handle rgba() passthrough
  if (hex.startsWith("rgba")) return hex;
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(128,128,128,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
}

// ---------------------------------------------------------------------------
// SVG encoding helper
// ---------------------------------------------------------------------------

function encodeSVG(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// ---------------------------------------------------------------------------
// Shared pseudo-element base styles
// ---------------------------------------------------------------------------

const PSEUDO_BASE = `
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`;

const CONTENT_Z = `
[data-deco] section > * { position: relative; z-index: 1; }
`;

// ---------------------------------------------------------------------------
// GEOMETRIC — Angular SVG patterns, circles, grid lines
// ---------------------------------------------------------------------------

function geometricCSS(intensity: DecorativeIntensity, palette: DNAPalette): string {
  const opacity = intensityOpacity(intensity);
  const accentRGBA = hexToRGBA(palette.accent, opacity);
  const borderRGBA = hexToRGBA(palette.accent, opacity * 0.5);

  // Hero: large geometric circles + angular lines
  const heroSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><circle cx="680" cy="80" r="200" fill="none" stroke="${accentRGBA}" stroke-width="1"/><circle cx="120" cy="500" r="150" fill="none" stroke="${accentRGBA}" stroke-width="0.5"/><line x1="0" y1="300" x2="800" y2="280" stroke="${borderRGBA}" stroke-width="0.5"/><line x1="400" y1="0" x2="420" y2="600" stroke="${borderRGBA}" stroke-width="0.3"/></svg>`;

  // Sections: smaller grid pattern
  const sectionSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><line x1="0" y1="60" x2="120" y2="60" stroke="${borderRGBA}" stroke-width="0.5"/><line x1="60" y1="0" x2="60" y2="120" stroke="${borderRGBA}" stroke-width="0.5"/></svg>`;

  return `
[data-deco="geometric"] section { position: relative; overflow: hidden; }
[data-deco="geometric"] .aph-hero::before,
[data-deco="geometric"] section:first-of-type::before {
  ${PSEUDO_BASE}
  background-image: ${encodeSVG(heroSVG)};
  background-size: cover;
  background-position: center;
  opacity: ${intensityScale(intensity)};
}
[data-deco="geometric"] section:not(:first-of-type)::before {
  ${PSEUDO_BASE}
  background-image: ${encodeSVG(sectionSVG)};
  background-size: 120px 120px;
  opacity: ${intensityScale(intensity) * 0.5};
}
`;
}

// ---------------------------------------------------------------------------
// ORGANIC — Fluid gradients, soft blobs, natural shapes
// ---------------------------------------------------------------------------

function organicCSS(intensity: DecorativeIntensity, palette: DNAPalette): string {
  const opacity = intensityOpacity(intensity);
  const accentRGBA = hexToRGBA(palette.accent, opacity * 2);
  const mutedRGBA = hexToRGBA(palette.muted, opacity * 3);

  return `
[data-deco="organic"] section { position: relative; overflow: hidden; }
[data-deco="organic"] .aph-hero::before,
[data-deco="organic"] section:first-of-type::before {
  ${PSEUDO_BASE}
  background:
    radial-gradient(ellipse 600px 400px at 85% 20%, ${accentRGBA}, transparent),
    radial-gradient(ellipse 400px 500px at 10% 80%, ${mutedRGBA}, transparent);
}
[data-deco="organic"] section:not(:first-of-type)::before {
  ${PSEUDO_BASE}
  background:
    radial-gradient(ellipse 300px 200px at 90% 50%, ${accentRGBA}, transparent);
  opacity: 0.7;
}
`;
}

// ---------------------------------------------------------------------------
// MINIMAL — Clean whitespace, subtle dividers only
// ---------------------------------------------------------------------------

function minimalCSS(_intensity: DecorativeIntensity, _palette: DNAPalette): string {
  return `
[data-deco="minimal"] section { position: relative; }
[data-deco="minimal"] section + section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(80%, var(--inner-max, 1100px));
  height: 1px;
  background: var(--border);
  pointer-events: none;
  z-index: 0;
}
`;
}

// ---------------------------------------------------------------------------
// EDITORIAL — Horizontal rules, typographic ornaments, drop caps
// ---------------------------------------------------------------------------

function editorialCSS(intensity: DecorativeIntensity, _palette: DNAPalette): string {
  const ornamentSize = intensity === "bold" ? "16px" : intensity === "moderate" ? "14px" : "12px";

  return `
[data-deco="editorial"] section { position: relative; }
[data-deco="editorial"] section + section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(60%, 600px);
  height: 1px;
  background: var(--border);
  pointer-events: none;
  z-index: 0;
}
[data-deco="editorial"] section + section::after {
  content: '\\2666';
  position: absolute;
  top: -0.6em;
  left: 50%;
  transform: translateX(-50%);
  font-size: ${ornamentSize};
  color: var(--muted-foreground);
  background: var(--background);
  padding: 0 12px;
  pointer-events: none;
  z-index: 1;
  line-height: 1;
}
[data-deco="editorial"] .aph-body-text p:first-of-type::first-letter,
[data-deco="editorial"] .aph-hero-sub::first-letter {
  font-family: var(--font-heading);
  font-size: 3.2em;
  float: left;
  line-height: 0.85;
  margin-right: 8px;
  margin-top: 4px;
  color: var(--accent);
}
`;
}

// ---------------------------------------------------------------------------
// GRID-OVERLAY — Subtle dot or line grid behind content
// ---------------------------------------------------------------------------

function gridOverlayCSS(intensity: DecorativeIntensity, palette: DNAPalette): string {
  const opacity = intensityOpacity(intensity);
  const dotSize = intensity === "bold" ? 2 : intensity === "moderate" ? 1.5 : 1;
  const dotColor = hexToRGBA(palette.border.startsWith("rgba") ? palette.foreground : palette.border, opacity * 4);

  const gridSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="${dotSize}" fill="${dotColor}"/></svg>`;

  return `
[data-deco="grid-overlay"] section { position: relative; overflow: hidden; }
[data-deco="grid-overlay"] section::before {
  ${PSEUDO_BASE}
  background-image: ${encodeSVG(gridSVG)};
  background-size: 24px 24px;
  opacity: ${intensityScale(intensity)};
}
`;
}

// ---------------------------------------------------------------------------
// GRADIENT-BLOBS — Large soft gradient spheres (Stripe-like)
// ---------------------------------------------------------------------------

function gradientBlobsCSS(intensity: DecorativeIntensity, palette: DNAPalette): string {
  const opacity = intensityOpacity(intensity) * 2;
  const accentRGBA = hexToRGBA(palette.accent, opacity);
  // Derive a complementary color by shifting hue conceptually (simple approach: blend with muted)
  const complementRGBA = hexToRGBA(palette.muted, opacity * 1.5);
  const size = intensity === "bold" ? "700px" : intensity === "moderate" ? "550px" : "400px";

  return `
[data-deco="gradient-blobs"] section { position: relative; overflow: hidden; }
[data-deco="gradient-blobs"] .aph-hero::before,
[data-deco="gradient-blobs"] section:first-of-type::before {
  ${PSEUDO_BASE}
  background:
    radial-gradient(circle ${size} at 80% 30%, ${accentRGBA}, transparent 70%),
    radial-gradient(circle ${size} at 20% 70%, ${complementRGBA}, transparent 70%);
}
[data-deco="gradient-blobs"] section:not(:first-of-type)::before {
  ${PSEUDO_BASE}
  background:
    radial-gradient(circle ${intensity === "bold" ? "500px" : "350px"} at 70% 50%, ${accentRGBA}, transparent 70%);
  opacity: 0.6;
}
@media (max-width: 768px) {
  [data-deco="gradient-blobs"] .aph-hero::before,
  [data-deco="gradient-blobs"] section:first-of-type::before {
    background:
      radial-gradient(circle 60vw at 80% 30%, ${accentRGBA}, transparent 70%),
      radial-gradient(circle 50vw at 20% 70%, ${complementRGBA}, transparent 70%);
  }
  [data-deco="gradient-blobs"] section:not(:first-of-type)::before {
    background:
      radial-gradient(circle 40vw at 70% 50%, ${accentRGBA}, transparent 70%);
  }
}
`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function generateDecorativeCSS(
  style: DecorativeStyle,
  intensity: DecorativeIntensity,
  palette: DNAPalette
): string {
  let css = CONTENT_Z;

  switch (style) {
    case "geometric":
      css += geometricCSS(intensity, palette);
      break;
    case "organic":
      css += organicCSS(intensity, palette);
      break;
    case "minimal":
      css += minimalCSS(intensity, palette);
      break;
    case "editorial":
      css += editorialCSS(intensity, palette);
      break;
    case "grid-overlay":
      css += gridOverlayCSS(intensity, palette);
      break;
    case "gradient-blobs":
      css += gradientBlobsCSS(intensity, palette);
      break;
  }

  return css;
}
