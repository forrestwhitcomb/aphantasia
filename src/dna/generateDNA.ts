// ============================================================
// APHANTASIA — Client-side DNA Generation + Validation
// ============================================================
// Calls /api/generate-dna and validates every field of the
// response. Falls back to DEFAULT_DNA for any missing/invalid
// fields. Validates font pairings exist in the library.
// ============================================================

import type { DesignDNA } from "./DesignDNA";
import { DEFAULT_DNA } from "./DesignDNA";
import { FONT_PAIRINGS } from "./fontLibrary";

// ---------------------------------------------------------------------------
// Canvas signals interface (passed from canvas state)
// ---------------------------------------------------------------------------

export interface CanvasSignals {
  shapeCount: number;
  hasHero: boolean;
  hasNav: boolean;
  imageCount: number;
  labels: string[];
  notes: string[];
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const VALID_SCALES = ["dramatic", "balanced", "compact"] as const;
const VALID_DENSITIES = ["spacious", "balanced", "tight"] as const;
const VALID_HERO_SURFACES = ["flat", "gradient-mesh", "grain", "accent-wash", "radial-glow"] as const;
const VALID_SECTION_STYLES = ["alternating", "uniform", "contrasting"] as const;
const VALID_CARD_SURFACES = ["elevated", "bordered", "glass", "flat", "accent-top"] as const;
const VALID_DECORATIVE_STYLES = ["geometric", "organic", "minimal", "editorial", "grid-overlay", "gradient-blobs"] as const;
const VALID_DECORATIVE_INTENSITIES = ["subtle", "moderate", "bold"] as const;
const VALID_MOTION_LEVELS = ["none", "subtle", "expressive"] as const;
const VALID_ENTRANCES = ["fade-up", "fade-in", "slide-in", "scale-up", "none"] as const;
const VALID_HOVERS = ["lift", "glow", "scale", "border-accent", "none"] as const;
const VALID_BUTTON_STYLES = ["solid", "outline", "ghost", "gradient"] as const;
const VALID_BUTTON_SIZES = ["compact", "standard", "large"] as const;
const VALID_IMAGE_TREATMENTS = ["natural", "duotone", "grayscale", "saturated"] as const;
const VALID_IMAGE_FRAMES = ["none", "browser", "phone", "shadow"] as const;

function isValidColor(c: unknown): c is string {
  if (typeof c !== "string") return false;
  // Accept hex (#RGB, #RRGGBB, #RRGGBBAA) or rgba()
  return /^#([0-9a-f]{3,8})$/i.test(c) || /^rgba?\(/.test(c);
}

function isEnum<T extends string>(value: unknown, options: readonly T[]): value is T {
  return typeof value === "string" && (options as readonly string[]).includes(value);
}

function isValidCSSLength(v: unknown): v is string {
  if (typeof v !== "string") return false;
  return /^\d/.test(v) || v.startsWith("clamp(");
}

/** Validate a font family name exists in the library */
function isKnownFont(family: unknown): family is string {
  if (typeof family !== "string") return false;
  return FONT_PAIRINGS.some(
    (p) =>
      p.heading === family ||
      p.body === family ||
      p.headingGoogleName === family ||
      p.bodyGoogleName === family
  );
}

// ---------------------------------------------------------------------------
// Deep validation + merge with defaults
// ---------------------------------------------------------------------------

function validateDNA(raw: Record<string, unknown>): DesignDNA {
  const d = DEFAULT_DNA;

  // --- Palette ---
  const rp = (raw.palette ?? {}) as Record<string, unknown>;
  const palette = {
    background: isValidColor(rp.background) ? rp.background : d.palette.background,
    foreground: isValidColor(rp.foreground) ? rp.foreground : d.palette.foreground,
    accent: isValidColor(rp.accent) ? rp.accent : d.palette.accent,
    accentForeground: isValidColor(rp.accentForeground) ? rp.accentForeground : d.palette.accentForeground,
    muted: isValidColor(rp.muted) ? rp.muted : d.palette.muted,
    mutedForeground: isValidColor(rp.mutedForeground) ? rp.mutedForeground : d.palette.mutedForeground,
    card: isValidColor(rp.card) ? rp.card : d.palette.card,
    cardForeground: isValidColor(rp.cardForeground) ? rp.cardForeground : d.palette.cardForeground,
    border: isValidColor(rp.border) ? rp.border : d.palette.border,
  };

  // --- Typography ---
  const rt = (raw.typography ?? {}) as Record<string, unknown>;
  const headingFamily = isKnownFont(rt.headingFamily) ? rt.headingFamily : d.typography.headingFamily;
  const bodyFamily = isKnownFont(rt.bodyFamily) ? rt.bodyFamily : d.typography.bodyFamily;
  const typography = {
    headingFamily,
    bodyFamily,
    headingWeight: typeof rt.headingWeight === "number" && [400, 500, 600, 700, 800, 900].includes(rt.headingWeight) ? rt.headingWeight : d.typography.headingWeight,
    headingLetterSpacing: typeof rt.headingLetterSpacing === "string" ? rt.headingLetterSpacing : d.typography.headingLetterSpacing,
    scale: isEnum(rt.scale, VALID_SCALES) ? rt.scale : d.typography.scale,
  };

  // --- Spacing ---
  const rs = (raw.spacing ?? {}) as Record<string, unknown>;
  const spacing = {
    density: isEnum(rs.density, VALID_DENSITIES) ? rs.density : d.spacing.density,
    sectionPadding: isValidCSSLength(rs.sectionPadding) ? rs.sectionPadding : d.spacing.sectionPadding,
    contentMaxWidth: isValidCSSLength(rs.contentMaxWidth) ? rs.contentMaxWidth : d.spacing.contentMaxWidth,
    cardPadding: isValidCSSLength(rs.cardPadding) ? rs.cardPadding : d.spacing.cardPadding,
    gridGap: isValidCSSLength(rs.gridGap) ? rs.gridGap : d.spacing.gridGap,
  };

  // --- Surfaces ---
  const rsu = (raw.surfaces ?? {}) as Record<string, unknown>;
  const surfaces = {
    hero: isEnum(rsu.hero, VALID_HERO_SURFACES) ? rsu.hero : d.surfaces.hero,
    sections: isEnum(rsu.sections, VALID_SECTION_STYLES) ? rsu.sections : d.surfaces.sections,
    cards: isEnum(rsu.cards, VALID_CARD_SURFACES) ? rsu.cards : d.surfaces.cards,
  };

  // --- Decorative ---
  const rde = (raw.decorative ?? {}) as Record<string, unknown>;
  const decorative = {
    style: isEnum(rde.style, VALID_DECORATIVE_STYLES) ? rde.style : d.decorative.style,
    intensity: isEnum(rde.intensity, VALID_DECORATIVE_INTENSITIES) ? rde.intensity : d.decorative.intensity,
  };

  // --- Motion ---
  const rm = (raw.motion ?? {}) as Record<string, unknown>;
  const motion = {
    level: isEnum(rm.level, VALID_MOTION_LEVELS) ? rm.level : d.motion.level,
    entrance: isEnum(rm.entrance, VALID_ENTRANCES) ? rm.entrance : d.motion.entrance,
    hover: isEnum(rm.hover, VALID_HOVERS) ? rm.hover : d.motion.hover,
    staggerDelay: typeof rm.staggerDelay === "string" ? rm.staggerDelay : d.motion.staggerDelay,
    duration: typeof rm.duration === "string" ? rm.duration : d.motion.duration,
  };

  // --- Buttons ---
  const rb = (raw.buttons ?? {}) as Record<string, unknown>;
  const buttons = {
    radius: isValidCSSLength(rb.radius) ? rb.radius : d.buttons.radius,
    style: isEnum(rb.style, VALID_BUTTON_STYLES) ? rb.style : d.buttons.style,
    size: isEnum(rb.size, VALID_BUTTON_SIZES) ? rb.size : d.buttons.size,
  };

  // --- Images ---
  const ri = (raw.images ?? {}) as Record<string, unknown>;
  const images = {
    radius: isValidCSSLength(ri.radius) ? ri.radius : d.images.radius,
    treatment: isEnum(ri.treatment, VALID_IMAGE_TREATMENTS) ? ri.treatment : d.images.treatment,
    frame: isEnum(ri.frame, VALID_IMAGE_FRAMES) ? ri.frame : d.images.frame,
  };

  // --- Mood slug ---
  const moodSlug = typeof raw.moodSlug === "string" && raw.moodSlug.length > 0
    ? raw.moodSlug
    : d.moodSlug;

  return {
    palette,
    typography,
    spacing,
    surfaces,
    decorative,
    motion,
    buttons,
    images,
    moodSlug,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface GenerateDNAResult {
  dna: DesignDNA;
  tokenUsage?: { input: number; output: number };
}

/**
 * Generate a unique DesignDNA from a product description.
 * Validates every field — falls back to DEFAULT_DNA for invalid values.
 */
export async function generateDNA(
  text: string,
  canvasSignals?: CanvasSignals
): Promise<GenerateDNAResult> {
  const res = await fetch("/api/generate-dna", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, canvasSignals }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  const dna = validateDNA(data.dna ?? {});

  return {
    dna,
    tokenUsage: data._tokenUsage,
  };
}

/**
 * Generate a different DNA direction for "Try another".
 * Adds a random seed to push the AI toward variety.
 */
export async function regenerateDNA(
  text: string,
  canvasSignals?: CanvasSignals
): Promise<GenerateDNAResult> {
  const res = await fetch("/api/generate-dna", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, canvasSignals, seed: Math.random() }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  const dna = validateDNA(data.dna ?? {});

  return {
    dna,
    tokenUsage: data._tokenUsage,
  };
}
