// ============================================================
// APHANTASIA — Theme Resolution Engine
// ============================================================
// Analyzes canvas composition + references + context to resolve
// a design direction BEFORE any AI call. This is what makes
// "Aphantasia decides, AI executes" real.
// ============================================================

import type { CanvasDocument, CanvasShape } from "@/engine/CanvasEngine";
import type { StructuredContext } from "@/types/context";
import type { ExtractedStyleTokens, ReferenceItem } from "@/types/reference";
import type { ThemeTokens } from "@/lib/theme";
import { PRESETS, DEFAULT_PRESET, applyReferenceTokens, applyBrandColors, tokensToCSS } from "@/lib/theme";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type DesignArchetype =
  | "minimal"
  | "editorial"
  | "bold"
  | "gallery"
  | "dashboard"
  | "saas";

export type TypographyScale = "dramatic" | "balanced" | "compact";
export type AnimationLevel = "none" | "subtle" | "expressive";
export type LayoutDensity = "spacious" | "balanced" | "dense";
export type ContentType =
  | "saas"
  | "portfolio"
  | "editorial"
  | "product"
  | "personal"
  | "restaurant"
  | "agency"
  | "general";

export interface ResolvedDesignDirection {
  archetype: DesignArchetype;
  contentType: ContentType;
  tokenPalette: ThemeTokens;
  typographyScale: TypographyScale;
  animationLevel: AnimationLevel;
  layoutDensity: LayoutDensity;
  tokenPaletteCSS: string;
}

// ---------------------------------------------------------------------------
// Archetype-specific token overrides
// ---------------------------------------------------------------------------

const ARCHETYPE_TOKENS: Record<DesignArchetype, Partial<ThemeTokens>> = {
  minimal: {
    "--section-py": "96px",
    "--radius": "8px",
    "--radius-lg": "16px",
  },
  editorial: {
    "--section-py": "112px",
    "--radius": "4px",
    "--radius-sm": "2px",
    "--radius-lg": "8px",
    "--font-heading": "'Playfair Display', 'Georgia', serif",
  },
  bold: {
    "--section-py": "88px",
    "--radius": "12px",
    "--radius-lg": "24px",
  },
  gallery: {
    "--section-py": "64px",
    "--radius": "0px",
    "--radius-sm": "0px",
    "--radius-lg": "0px",
  },
  dashboard: {
    "--section-py": "48px",
    "--inner-max": "1280px",
    "--radius": "8px",
  },
  saas: {
    "--section-py": "80px",
    "--inner-max": "1200px",
  },
};

// ---------------------------------------------------------------------------
// Keyword dictionaries for signal extraction
// ---------------------------------------------------------------------------

const ARCHETYPE_KEYWORDS: Record<DesignArchetype, string[]> = {
  minimal: ["minimal", "minimalist", "clean", "simple", "whitespace", "understated", "elegant", "zen"],
  editorial: ["editorial", "magazine", "serif", "article", "blog", "publication", "literary", "newspaper"],
  bold: ["bold", "vibrant", "colorful", "energetic", "playful", "dynamic", "loud", "neon"],
  gallery: ["gallery", "portfolio", "photography", "visual", "showcase", "architectural", "museum"],
  dashboard: ["dashboard", "admin", "panel", "data", "analytics", "table", "metric"],
  saas: ["saas", "app", "startup", "platform", "pricing", "features", "cta", "conversion"],
};

const CONTENT_TYPE_KEYWORDS: Record<ContentType, string[]> = {
  saas: ["saas", "software", "app", "platform", "api", "pricing", "plan", "startup", "tool", "integration"],
  portfolio: ["portfolio", "projects", "work", "case study", "showcase", "creative"],
  editorial: ["blog", "article", "magazine", "story", "publication", "journal", "editorial"],
  product: ["product", "shop", "store", "price", "buy", "cart", "ecommerce", "commerce"],
  personal: ["personal", "about me", "resume", "cv", "bio", "contact"],
  restaurant: ["restaurant", "menu", "food", "cafe", "bistro", "dining", "reservation"],
  agency: ["agency", "studio", "services", "clients", "team", "we build", "we design", "we create"],
  general: [],
};

// ---------------------------------------------------------------------------
// Main resolver
// ---------------------------------------------------------------------------

export function resolveDesignDirection(
  doc: CanvasDocument,
  context: StructuredContext | null,
  references: ReferenceItem[]
): ResolvedDesignDirection {
  const signals = extractSignals(doc, context, references);
  const archetype = classifyArchetype(signals);
  // Prefer explicit contentType from V3 extraction if available
  const VALID_CONTENT_TYPES = new Set<string>(["saas", "portfolio", "editorial", "product", "personal", "restaurant", "agency", "general"]);
  const extractedCT = context?.contentType;
  const mappedCT = extractedCT === "ecommerce" ? "product" : extractedCT === "event" ? "general" : extractedCT === "nonprofit" ? "personal" : extractedCT;
  const contentType = (mappedCT && VALID_CONTENT_TYPES.has(mappedCT) ? mappedCT : classifyContentType(signals)) as ContentType;
  const typographyScale = resolveTypographyScale(archetype, signals);
  const animationLevel = resolveAnimationLevel(archetype, signals);
  const layoutDensity = resolveLayoutDensity(archetype, signals);
  const tokenPalette = resolveTokenPalette(archetype, context, references);

  return {
    archetype,
    contentType,
    tokenPalette,
    typographyScale,
    animationLevel,
    layoutDensity,
    tokenPaletteCSS: tokensToCSS(tokenPalette),
  };
}

// ---------------------------------------------------------------------------
// Signal extraction from canvas + context + references
// ---------------------------------------------------------------------------

interface CanvasSignals {
  shapeCount: number;
  inFrameShapes: CanvasShape[];
  imageCount: number;
  avgShapeHeight: number;
  whitespaceRatio: number;
  hasHero: boolean;
  hasNav: boolean;
  hasFooter: boolean;
  hasFeaturesGrid: boolean;
  hasPortfolio: boolean;
  hasEcommerce: boolean;
  hasForm: boolean;
  allLabels: string;
  allNotes: string;
  contextTone: string;
  refMood: string;
  refLayout: string;
  refToneOfVoice: string;
}

function extractSignals(
  doc: CanvasDocument,
  context: StructuredContext | null,
  references: ReferenceItem[]
): CanvasSignals {
  const inFrame = doc.shapes.filter(
    (s) =>
      s.isInsideFrame &&
      s.semanticTag !== "unknown" &&
      s.semanticTag !== "scratchpad" &&
      s.semanticTag !== "context-note" &&
      !s.meta?._consumed
  );

  const images = inFrame.filter((s) => s.type === "image" || s.semanticTag === "image");
  const totalFrameArea = doc.frame.width * doc.frame.height;
  const totalShapeArea = inFrame.reduce((a, s) => a + s.width * s.height, 0);
  const whitespaceRatio = totalFrameArea > 0 ? 1 - totalShapeArea / totalFrameArea : 0.5;

  const labels = inFrame.map((s) => (s.label || s.content || "").toLowerCase()).join(" ");
  const notes = doc.shapes
    .filter((s) => s.type === "note")
    .map((s) => (s.label || s.content || "").toLowerCase())
    .join(" ");

  const styleRefs = references.filter((r) => r.status === "ready" && r.extractedTokens);
  const refMoods = styleRefs.map((r) => r.extractedTokens?.mood || "").join(" ");
  const refLayouts = styleRefs.map((r) => r.extractedTokens?.layout || "").join(" ");
  const refTones = styleRefs.map((r) => r.extractedTokens?.toneOfVoice || "").join(" ");

  const tags = new Set(inFrame.map((s) => s.semanticTag));

  return {
    shapeCount: inFrame.length,
    inFrameShapes: inFrame,
    imageCount: images.length,
    avgShapeHeight:
      inFrame.length > 0 ? inFrame.reduce((a, s) => a + s.height, 0) / inFrame.length : 200,
    whitespaceRatio,
    hasHero: tags.has("hero"),
    hasNav: tags.has("nav"),
    hasFooter: tags.has("footer"),
    hasFeaturesGrid: tags.has("cards"),
    hasPortfolio: tags.has("portfolio"),
    hasEcommerce: tags.has("ecommerce"),
    hasForm: tags.has("form"),
    allLabels: labels,
    allNotes: notes,
    contextTone: (typeof context?.tone === "string" ? context.tone : context?.tone?.personality || context?.tone?.energy || "").toLowerCase(),
    refMood: refMoods.toLowerCase(),
    refLayout: refLayouts.toLowerCase(),
    refToneOfVoice: refTones.toLowerCase(),
  };
}

// ---------------------------------------------------------------------------
// Archetype classification
// ---------------------------------------------------------------------------

function classifyArchetype(signals: CanvasSignals): DesignArchetype {
  const scores: Record<DesignArchetype, number> = {
    minimal: 0,
    editorial: 0,
    bold: 0,
    gallery: 0,
    dashboard: 0,
    saas: 0,
  };

  const text = `${signals.allLabels} ${signals.allNotes} ${signals.contextTone} ${signals.refMood} ${signals.refLayout} ${signals.refToneOfVoice}`;

  for (const [arch, keywords] of Object.entries(ARCHETYPE_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.includes(kw)) scores[arch as DesignArchetype] += 2;
    }
  }

  // Composition-based scoring
  if (signals.whitespaceRatio > 0.5) scores.minimal += 2;
  if (signals.whitespaceRatio > 0.65) scores.editorial += 1;
  if (signals.whitespaceRatio < 0.25) scores.dashboard += 2;

  if (signals.shapeCount <= 4 && signals.whitespaceRatio > 0.4) scores.minimal += 2;
  if (signals.shapeCount >= 8) scores.dashboard += 1;

  if (signals.imageCount >= 3) scores.gallery += 3;
  if (signals.imageCount >= 2 && signals.hasPortfolio) scores.gallery += 2;

  if (signals.hasHero && signals.hasFeaturesGrid) scores.saas += 2;
  if (signals.hasForm) scores.saas += 1;
  if (signals.hasEcommerce) scores.bold += 1;
  if (signals.hasPortfolio) scores.gallery += 2;

  if (signals.avgShapeHeight > 300) scores.editorial += 1;

  // Reference mood signals
  if (signals.refMood.includes("minimal") || signals.refMood.includes("elegant")) scores.minimal += 2;
  if (signals.refMood.includes("bold") || signals.refMood.includes("vibrant")) scores.bold += 2;
  if (signals.refMood.includes("editorial") || signals.refMood.includes("magazine")) scores.editorial += 2;

  // Default: typical hero + sections → SaaS/minimal
  if (signals.hasHero && signals.hasNav && signals.hasFooter) {
    scores.saas += 1;
    scores.minimal += 1;
  }

  // Pick winner; break ties with preference order
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (ranked[0][1] === 0) return "minimal"; // no signals → safe default
  return ranked[0][0] as DesignArchetype;
}

// ---------------------------------------------------------------------------
// Content type classification
// ---------------------------------------------------------------------------

function classifyContentType(signals: CanvasSignals): ContentType {
  const text = `${signals.allLabels} ${signals.allNotes} ${signals.contextTone}`;
  const scores: Record<ContentType, number> = {
    saas: 0,
    portfolio: 0,
    editorial: 0,
    product: 0,
    personal: 0,
    restaurant: 0,
    agency: 0,
    general: 0,
  };

  for (const [ct, keywords] of Object.entries(CONTENT_TYPE_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.includes(kw)) scores[ct as ContentType] += 1;
    }
  }

  if (signals.hasPortfolio) scores.portfolio += 2;
  if (signals.hasEcommerce) scores.product += 2;
  if (signals.hasForm && signals.hasFeaturesGrid) scores.saas += 1;

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (ranked[0][1] === 0) return "general";
  return ranked[0][0] as ContentType;
}

// ---------------------------------------------------------------------------
// Derived attributes
// ---------------------------------------------------------------------------

function resolveTypographyScale(arch: DesignArchetype, signals: CanvasSignals): TypographyScale {
  if (arch === "editorial" || arch === "gallery") return "dramatic";
  if (arch === "dashboard") return "compact";
  if (signals.whitespaceRatio > 0.5) return "dramatic";
  if (signals.shapeCount >= 8) return "compact";
  return "balanced";
}

function resolveAnimationLevel(arch: DesignArchetype, signals: CanvasSignals): AnimationLevel {
  const text = `${signals.allNotes} ${signals.refMood}`;
  if (text.includes("no animation") || text.includes("static")) return "none";
  if (text.includes("animated") || text.includes("gsap") || text.includes("motion")) return "expressive";
  if (arch === "gallery" || arch === "editorial") return "expressive";
  if (arch === "dashboard") return "none";
  return "subtle";
}

function resolveLayoutDensity(arch: DesignArchetype, signals: CanvasSignals): LayoutDensity {
  if (arch === "dashboard") return "dense";
  if (arch === "editorial" || arch === "gallery") return "spacious";
  if (signals.whitespaceRatio > 0.5) return "spacious";
  if (signals.whitespaceRatio < 0.2) return "dense";
  return "balanced";
}

// ---------------------------------------------------------------------------
// Token palette resolution
// ---------------------------------------------------------------------------

function resolveTokenPalette(
  archetype: DesignArchetype,
  context: StructuredContext | null,
  references: ReferenceItem[]
): ThemeTokens {
  // 1. Start from default preset
  let theme: ThemeTokens = { ...PRESETS[DEFAULT_PRESET] };

  // 2. Apply archetype-specific overrides
  const archetypeOverrides = ARCHETYPE_TOKENS[archetype];
  if (archetypeOverrides) {
    theme = { ...theme, ...archetypeOverrides };
  }

  // 3. Layer reference-extracted tokens (highest visual authority)
  const styleRefs = references.filter(
    (r) => r.status === "ready" && r.tag === "style" && r.extractedTokens
  );
  for (const ref of styleRefs) {
    theme = applyReferenceTokens(theme, ref.extractedTokens!);
  }

  // 4. Brand colors from structured context take final priority
  if (context?.colors?.length) {
    theme = applyBrandColors(theme, context.colors);
  }

  return theme;
}

// ---------------------------------------------------------------------------
// Convenience: serialize design direction for the AI prompt
// ---------------------------------------------------------------------------

export function serializeDesignDirection(dir: ResolvedDesignDirection): string {
  const lines: string[] = [
    `Design archetype: ${dir.archetype}`,
    `Content type: ${dir.contentType}`,
    `Typography scale: ${dir.typographyScale}`,
    `Animation level: ${dir.animationLevel}`,
    `Layout density: ${dir.layoutDensity}`,
    "",
    "Token palette (CSS custom properties):",
    dir.tokenPaletteCSS,
  ];
  return lines.join("\n");
}
