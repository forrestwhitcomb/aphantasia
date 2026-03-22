// ============================================================
// APHANTASIA — Theme Injector
// ============================================================
// Converts a UIDesignSystem into CSS custom properties that
// all UI components read via var(--*). This is the SINGLE
// point where the design system enters the rendering pipeline.
//
// Two exports:
//   designSystemToCSS(ds) → `:root { --color-background: ...; }`
//   googleFontImport(ds)  → `<link href="..." rel="stylesheet">`
//
// CSS variable naming convention:
//   --color-{name}        → colors.background, colors.primary, etc.
//   --font-{role}-family  → fonts.heading.family, fonts.body.family
//   --font-{role}-weight  → fonts.heading.weight, fonts.body.weight
//   --font-{role}-ls      → fonts.heading.letterSpacing
//   --font-size-{scale}   → fontSizes.xs through fontSizes.3xl
//   --spacing-{scale}     → spacing.xs through spacing.2xl
//   --radius-{scale}      → radii.none through radii.full
//   --radius-{comp}       → radii.button, radii.card, radii.input
//   --shadow-{scale}      → shadows.sm through shadows.lg
//   --shadow-{comp}       → shadows.card, shadows.button, shadows.input
//   --comp-{name}-{prop}  → components.navBar.height, etc.
// ============================================================

import type { UIDesignSystem } from "./types";

/**
 * Convert a UIDesignSystem into a CSS `:root` block with custom properties.
 * This string is injected into the viewport iframe's `<style>` tag.
 */
export function designSystemToCSS(ds: UIDesignSystem): string {
  const lines: string[] = [":root {"];

  // ── Colors ──
  lines.push("  /* Colors */");
  lines.push(`  --color-background: ${ds.colors.background};`);
  lines.push(`  --color-foreground: ${ds.colors.foreground};`);
  lines.push(`  --color-primary: ${ds.colors.primary};`);
  lines.push(`  --color-primary-foreground: ${ds.colors.primaryForeground};`);
  lines.push(`  --color-secondary: ${ds.colors.secondary};`);
  lines.push(`  --color-secondary-foreground: ${ds.colors.secondaryForeground};`);
  lines.push(`  --color-muted: ${ds.colors.muted};`);
  lines.push(`  --color-muted-foreground: ${ds.colors.mutedForeground};`);
  lines.push(`  --color-accent: ${ds.colors.accent};`);
  lines.push(`  --color-accent-foreground: ${ds.colors.accentForeground};`);
  lines.push(`  --color-destructive: ${ds.colors.destructive};`);
  lines.push(`  --color-border: ${ds.colors.border};`);
  lines.push(`  --color-input: ${ds.colors.input};`);
  lines.push(`  --color-ring: ${ds.colors.ring};`);
  lines.push(`  --color-card: ${ds.colors.card};`);
  lines.push(`  --color-card-foreground: ${ds.colors.cardForeground};`);

  // ── Typography — Fonts ──
  lines.push("  /* Typography — Fonts */");
  lines.push(`  --font-heading-family: ${ds.fonts.heading.family};`);
  lines.push(`  --font-heading-weight: ${ds.fonts.heading.weight};`);
  lines.push(`  --font-heading-ls: ${ds.fonts.heading.letterSpacing};`);
  lines.push(`  --font-body-family: ${ds.fonts.body.family};`);
  lines.push(`  --font-body-weight: ${ds.fonts.body.weight};`);
  lines.push(`  --font-body-ls: ${ds.fonts.body.letterSpacing};`);
  lines.push(`  --font-caption-family: ${ds.fonts.caption.family};`);
  lines.push(`  --font-caption-weight: ${ds.fonts.caption.weight};`);
  if (ds.fonts.mono) {
    lines.push(`  --font-mono-family: ${ds.fonts.mono.family};`);
    lines.push(`  --font-mono-weight: ${ds.fonts.mono.weight};`);
  }

  // ── Typography — Font Sizes ──
  lines.push("  /* Typography — Sizes */");
  lines.push(`  --font-size-xs: ${ds.fontSizes.xs};`);
  lines.push(`  --font-size-sm: ${ds.fontSizes.sm};`);
  lines.push(`  --font-size-base: ${ds.fontSizes.base};`);
  lines.push(`  --font-size-lg: ${ds.fontSizes.lg};`);
  lines.push(`  --font-size-xl: ${ds.fontSizes.xl};`);
  lines.push(`  --font-size-2xl: ${ds.fontSizes["2xl"]};`);
  lines.push(`  --font-size-3xl: ${ds.fontSizes["3xl"]};`);

  // ── Spacing ──
  lines.push("  /* Spacing */");
  lines.push(`  --spacing-xs: ${ds.spacing.xs};`);
  lines.push(`  --spacing-sm: ${ds.spacing.sm};`);
  lines.push(`  --spacing-md: ${ds.spacing.md};`);
  lines.push(`  --spacing-lg: ${ds.spacing.lg};`);
  lines.push(`  --spacing-xl: ${ds.spacing.xl};`);
  lines.push(`  --spacing-2xl: ${ds.spacing["2xl"]};`);

  // ── Border Radii ──
  lines.push("  /* Radii */");
  lines.push(`  --radius-none: ${ds.radii.none};`);
  lines.push(`  --radius-sm: ${ds.radii.sm};`);
  lines.push(`  --radius-md: ${ds.radii.md};`);
  lines.push(`  --radius-lg: ${ds.radii.lg};`);
  lines.push(`  --radius-xl: ${ds.radii.xl};`);
  lines.push(`  --radius-full: ${ds.radii.full};`);
  lines.push(`  --radius-button: ${ds.radii.button};`);
  lines.push(`  --radius-card: ${ds.radii.card};`);
  lines.push(`  --radius-input: ${ds.radii.input};`);

  // ── Shadows ──
  lines.push("  /* Shadows */");
  lines.push(`  --shadow-sm: ${ds.shadows.sm};`);
  lines.push(`  --shadow-md: ${ds.shadows.md};`);
  lines.push(`  --shadow-lg: ${ds.shadows.lg};`);
  lines.push(`  --shadow-card: ${ds.shadows.card};`);
  lines.push(`  --shadow-button: ${ds.shadows.button};`);
  lines.push(`  --shadow-input: ${ds.shadows.input};`);

  // ── Component-Specific Tokens ──
  lines.push("  /* Component Tokens — NavBar */");
  lines.push(`  --comp-navbar-height: ${ds.components.navBar.height};`);
  lines.push(`  --comp-navbar-blur: ${ds.components.navBar.blur};`);
  lines.push(`  --comp-navbar-border-bottom: ${ds.components.navBar.borderBottom};`);

  lines.push("  /* Component Tokens — Card */");
  lines.push(`  --comp-card-padding: ${ds.components.card.padding};`);
  lines.push(`  --comp-card-gap: ${ds.components.card.gap};`);

  lines.push("  /* Component Tokens — Button */");
  lines.push(`  --comp-button-height: ${ds.components.button.height};`);
  lines.push(`  --comp-button-padding-x: ${ds.components.button.paddingX};`);
  lines.push(`  --comp-button-font-size: ${ds.components.button.fontSize};`);

  lines.push("  /* Component Tokens — Input */");
  lines.push(`  --comp-input-height: ${ds.components.input.height};`);
  lines.push(`  --comp-input-padding-x: ${ds.components.input.paddingX};`);
  lines.push(`  --comp-input-font-size: ${ds.components.input.fontSize};`);

  lines.push("  /* Component Tokens — List */");
  lines.push(`  --comp-list-item-height: ${ds.components.list.itemHeight};`);
  lines.push(`  --comp-list-divider: ${ds.components.list.divider};`);

  lines.push("  /* Component Tokens — TabBar */");
  lines.push(`  --comp-tabbar-height: ${ds.components.tabBar.height};`);
  lines.push(`  --comp-tabbar-icon-size: ${ds.components.tabBar.iconSize};`);

  lines.push("}");
  return lines.join("\n");
}

// ── Google Fonts ─────────────────────────────────────────────

/**
 * Extract font family names from a CSS font stack and generate
 * a Google Fonts `<link>` tag. Only includes families that look
 * like named web fonts (not system fonts like -apple-system).
 */
export function googleFontImport(ds: UIDesignSystem): string {
  const families = new Set<string>();

  for (const font of [ds.fonts.heading, ds.fonts.body, ds.fonts.caption, ds.fonts.mono]) {
    if (!font) continue;
    const extracted = extractGoogleFontFamily(font.family);
    if (extracted) families.add(extracted);
  }

  if (families.size === 0) return "";

  const params = Array.from(families)
    .map((f) => {
      const encoded = f.replace(/ /g, "+");
      return `family=${encoded}:wght@300;400;500;600;700`;
    })
    .join("&");

  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${params}&display=swap" rel="stylesheet">`;
}

// ── Helpers ──────────────────────────────────────────────────

/** System fonts that should NOT be loaded from Google Fonts. */
const SYSTEM_FONTS = new Set([
  "-apple-system",
  "blinkmacsystemfont",
  "system-ui",
  "segoe ui",
  "roboto",
  "helvetica neue",
  "helvetica",
  "arial",
  "sans-serif",
  "serif",
  "monospace",
  "sf pro",
  "sf pro display",
  "sf pro text",
  "sf mono",
]);

/**
 * Extract the first non-system font family from a CSS font stack.
 * Returns null if no Google Font candidate is found.
 *
 * Example: "'Inter', -apple-system, sans-serif" → "Inter"
 */
function extractGoogleFontFamily(stack: string): string | null {
  const parts = stack.split(",").map((s) => s.trim().replace(/^['"]|['"]$/g, ""));
  for (const part of parts) {
    if (!SYSTEM_FONTS.has(part.toLowerCase())) {
      return part;
    }
  }
  return null;
}

// ── Full Document Builder ───────────────────────────────────

/**
 * Build a complete HTML document string for the viewport iframe.
 * Includes the design system CSS, Google Fonts, base reset, and
 * the provided body HTML.
 */
export function buildUIDocument(
  bodyHtml: string,
  ds: UIDesignSystem,
  baseCSS: string
): string {
  const themeCSS = designSystemToCSS(ds);
  const fontLinks = googleFontImport(ds);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=393, initial-scale=1, maximum-scale=1, user-scalable=no">
${fontLinks}
<style>
${themeCSS}
${baseCSS}
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}
