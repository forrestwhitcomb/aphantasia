// ============================================================
// APHANTASIA — DNA → CSS Bridge
// ============================================================
// Converts a DesignDNA object into ThemeTokens-compatible CSS
// custom properties. This bridge ensures all 18 existing section
// components work without modification — they continue reading
// var(--accent), var(--font-heading), etc.
// ============================================================

import type { ThemeTokens } from "@/lib/theme";
import type { DesignDNA } from "./DesignDNA";
import { fontFamilyCSS } from "./fontLibrary";

// ---------------------------------------------------------------------------
// Extended tokens (DNA-specific properties beyond ThemeTokens)
// ---------------------------------------------------------------------------

export interface ExtendedThemeTokens extends ThemeTokens {
  "--button-radius": string;
  "--button-style": string;
  "--button-size": string;
  "--motion-level": string;
  "--motion-entrance": string;
  "--motion-hover": string;
  "--motion-duration": string;
  "--motion-stagger": string;
  "--decorative-style": string;
  "--decorative-intensity": string;
  "--heading-weight": string;
  "--heading-letter-spacing": string;
  "--image-radius": string;
  "--image-treatment": string;
  "--image-frame": string;
  "--surface-hero": string;
  "--surface-sections": string;
  "--surface-cards": string;
}

// ---------------------------------------------------------------------------
// Spacing density → spacing scale mapping
// ---------------------------------------------------------------------------

function spacingScale(density: DesignDNA["spacing"]["density"]) {
  switch (density) {
    case "spacious":
      return {
        "--spacing-xs": "6px",
        "--spacing-sm": "10px",
        "--spacing-md": "16px",
        "--spacing-lg": "20px",
        "--spacing-xl": "28px",
        "--spacing-2xl": "36px",
        "--spacing-3xl": "56px",
        "--spacing-4xl": "80px",
      };
    case "tight":
      return {
        "--spacing-xs": "3px",
        "--spacing-sm": "6px",
        "--spacing-md": "10px",
        "--spacing-lg": "14px",
        "--spacing-xl": "20px",
        "--spacing-2xl": "28px",
        "--spacing-3xl": "40px",
        "--spacing-4xl": "60px",
      };
    case "balanced":
    default:
      return {
        "--spacing-xs": "4px",
        "--spacing-sm": "8px",
        "--spacing-md": "12px",
        "--spacing-lg": "16px",
        "--spacing-xl": "24px",
        "--spacing-2xl": "32px",
        "--spacing-3xl": "48px",
        "--spacing-4xl": "72px",
      };
  }
}

// ---------------------------------------------------------------------------
// Typography scale → text size mapping
// ---------------------------------------------------------------------------

function textScale(scale: DesignDNA["typography"]["scale"]) {
  switch (scale) {
    case "dramatic":
      return {
        "--text-xs": "12px",
        "--text-sm": "14px",
        "--text-base": "16px",
        "--text-md": "18px",
        "--text-lg": "20px",
        "--text-xl": "24px",
        "--text-2xl": "28px",
        "--text-3xl": "36px",
      };
    case "compact":
      return {
        "--text-xs": "11px",
        "--text-sm": "12px",
        "--text-base": "13px",
        "--text-md": "14px",
        "--text-lg": "15px",
        "--text-xl": "17px",
        "--text-2xl": "19px",
        "--text-3xl": "22px",
      };
    case "balanced":
    default:
      return {
        "--text-xs": "12px",
        "--text-sm": "13px",
        "--text-base": "14px",
        "--text-md": "15px",
        "--text-lg": "16px",
        "--text-xl": "18px",
        "--text-2xl": "20px",
        "--text-3xl": "24px",
      };
  }
}

// ---------------------------------------------------------------------------
// Border opacity extraction
// ---------------------------------------------------------------------------

function extractBorderOpacity(border: string): string {
  const rgbaMatch = border.match(/rgba\([^)]*,\s*([\d.]+)\)/);
  if (rgbaMatch) return rgbaMatch[1];
  // If it's a solid color (hex, named), opacity is 1
  return "1";
}

// ---------------------------------------------------------------------------
// Surface blur/opacity based on card surface style
// ---------------------------------------------------------------------------

function surfaceProperties(cards: DesignDNA["surfaces"]["cards"]) {
  switch (cards) {
    case "glass":
      return { "--surface-blur": "16px", "--surface-opacity": "0.06" };
    case "elevated":
      return { "--surface-blur": "0px", "--surface-opacity": "1" };
    case "bordered":
      return { "--surface-blur": "0px", "--surface-opacity": "0.06" };
    case "flat":
      return { "--surface-blur": "0px", "--surface-opacity": "0" };
    case "accent-top":
      return { "--surface-blur": "0px", "--surface-opacity": "0.06" };
    default:
      return { "--surface-blur": "0px", "--surface-opacity": "0.06" };
  }
}

// ---------------------------------------------------------------------------
// Radius from button radius → general radius scale
// ---------------------------------------------------------------------------

function radiusScale(buttonRadius: string): {
  "--radius": string;
  "--radius-sm": string;
  "--radius-lg": string;
} {
  const px = parseInt(buttonRadius, 10);
  if (isNaN(px) || px === 0) {
    return { "--radius": "0px", "--radius-sm": "0px", "--radius-lg": "0px" };
  }
  if (px >= 9999) {
    // Pill buttons → larger general radius
    return { "--radius": "16px", "--radius-sm": "8px", "--radius-lg": "24px" };
  }
  return {
    "--radius": `${Math.max(px, 6)}px`,
    "--radius-sm": `${Math.max(Math.round(px * 0.5), 2)}px`,
    "--radius-lg": `${Math.round(px * 2)}px`,
  };
}

// ---------------------------------------------------------------------------
// Max-width from content max-width
// ---------------------------------------------------------------------------

function maxWidths(contentMaxWidth: string) {
  const px = parseInt(contentMaxWidth, 10);
  if (isNaN(px)) {
    return { "--max-w-sm": "560px", "--max-w-md": "720px", "--max-w-lg": "800px" };
  }
  return {
    "--max-w-sm": `${Math.round(px * 0.5)}px`,
    "--max-w-md": `${Math.round(px * 0.65)}px`,
    "--max-w-lg": `${Math.round(px * 0.73)}px`,
  };
}

// ---------------------------------------------------------------------------
// dnaToCSS — produces ThemeTokens-compatible output
// ---------------------------------------------------------------------------

/**
 * Converts a DesignDNA into a ThemeTokens object compatible with the existing
 * component library. All 18 section components can read these CSS custom
 * properties without any modification.
 */
export function dnaToCSS(dna: DesignDNA): ThemeTokens {
  const { palette, typography, spacing, surfaces, buttons } = dna;
  const radii = radiusScale(buttons.radius);
  const surf = surfaceProperties(surfaces.cards);

  return {
    // Backgrounds
    "--background": palette.background,
    "--surface": palette.muted,
    "--surface-alt": palette.card,
    // Text
    "--foreground": palette.foreground,
    "--muted-foreground": palette.mutedForeground,
    // Accent
    "--accent": palette.accent,
    "--accent-foreground": palette.accentForeground,
    // Borders
    "--border": palette.border,
    "--border-opacity": extractBorderOpacity(palette.border),
    // Shape
    ...radii,
    // Typography
    "--font-heading": fontFamilyCSS(typography.headingFamily),
    "--font-body": fontFamilyCSS(typography.bodyFamily),
    "--font-mono": "'JetBrains Mono', 'Menlo', monospace",
    "--letter-spacing-heading": typography.headingLetterSpacing,
    // Blur / glass
    ...surf,
    // Spacing
    "--section-py": spacing.sectionPadding,
    "--inner-max": spacing.contentMaxWidth,
    ...spacingScale(spacing.density),
    // Typography scale
    ...textScale(typography.scale),
    // Max-widths
    ...maxWidths(spacing.contentMaxWidth),
  };
}

// ---------------------------------------------------------------------------
// dnaToExtendedCSS — ThemeTokens + DNA-specific properties
// ---------------------------------------------------------------------------

export function dnaToExtendedCSS(dna: DesignDNA): ExtendedThemeTokens {
  const base = dnaToCSS(dna);
  return {
    ...base,
    // Button personality
    "--button-radius": dna.buttons.radius,
    "--button-style": dna.buttons.style,
    "--button-size": dna.buttons.size,
    // Motion personality
    "--motion-level": dna.motion.level,
    "--motion-entrance": dna.motion.entrance,
    "--motion-hover": dna.motion.hover,
    "--motion-duration": dna.motion.duration,
    "--motion-stagger": dna.motion.staggerDelay,
    // Decorative
    "--decorative-style": dna.decorative.style,
    "--decorative-intensity": dna.decorative.intensity,
    // Typography extras
    "--heading-weight": String(dna.typography.headingWeight),
    "--heading-letter-spacing": dna.typography.headingLetterSpacing,
    // Image treatment
    "--image-radius": dna.images.radius,
    "--image-treatment": dna.images.treatment,
    "--image-frame": dna.images.frame,
    // Surface styles
    "--surface-hero": dna.surfaces.hero,
    "--surface-sections": dna.surfaces.sections,
    "--surface-cards": dna.surfaces.cards,
  };
}

// ---------------------------------------------------------------------------
// dnaToRootCSS — complete :root block as a CSS string
// ---------------------------------------------------------------------------

/**
 * Generates a complete `:root { ... }` CSS block from a DesignDNA object.
 * Includes both ThemeTokens-compatible properties and DNA-specific extensions.
 */
export function dnaToRootCSS(dna: DesignDNA): string {
  const tokens = dnaToExtendedCSS(dna);
  const entries = Object.entries(tokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root {\n${entries}\n}`;
}

// ---------------------------------------------------------------------------
// Memoization for performance
// ---------------------------------------------------------------------------

let _cachedDNA: DesignDNA | null = null;
let _cachedTokens: ThemeTokens | null = null;
let _cachedExtended: ExtendedThemeTokens | null = null;
let _cachedRootCSS: string | null = null;

export function dnaToCSSmemo(dna: DesignDNA): ThemeTokens {
  if (dna === _cachedDNA && _cachedTokens) return _cachedTokens;
  _cachedDNA = dna;
  _cachedTokens = dnaToCSS(dna);
  _cachedExtended = null;
  _cachedRootCSS = null;
  return _cachedTokens;
}

export function dnaToRootCSSmemo(dna: DesignDNA): string {
  if (dna === _cachedDNA && _cachedRootCSS) return _cachedRootCSS;
  _cachedDNA = dna;
  _cachedRootCSS = dnaToRootCSS(dna);
  _cachedTokens = null;
  _cachedExtended = null;
  return _cachedRootCSS;
}
