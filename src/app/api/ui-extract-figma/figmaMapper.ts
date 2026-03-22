// Figma REST API response → UIDesignSystem mapper.
// Walks the full node tree to extract real colors, typography,
// shadows, and radii from the design — not just named variables.

import type { UIDesignSystem } from "@/ui-mode/types";
import { DEFAULT_UI_DESIGN_SYSTEM } from "@/ui-mode/defaultDesignSystem";
import { parseFigmaFileKey, parseFigmaNodeId } from "@/lib/figmaUrl";

export { parseFigmaFileKey, parseFigmaNodeId };

// ── Figma node document (rich — includes fills, effects, style) ──

export interface FigmaNodeDoc {
  id?: string;
  name?: string;
  type?: string;
  children?: FigmaNodeDoc[];
  fills?: FigmaPaint[];
  strokes?: FigmaPaint[];
  effects?: FigmaEffect[];
  cornerRadius?: number;
  rectangleCornerRadii?: [number, number, number, number];
  backgroundColor?: FigmaColor;
  style?: {
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: number;
    letterSpacing?: number;
    lineHeightPx?: number;
  };
  characters?: string;
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
}

interface FigmaPaint {
  type: "SOLID" | "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "IMAGE" | string;
  color?: FigmaColor;
  opacity?: number;
  visible?: boolean;
}

interface FigmaEffect {
  type: "DROP_SHADOW" | "INNER_SHADOW" | "LAYER_BLUR" | "BACKGROUND_BLUR" | string;
  color?: FigmaColor;
  offset?: { x: number; y: number };
  radius?: number;
  spread?: number;
  visible?: boolean;
}

interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** API response: GET /v1/files/{key}/nodes */
export interface FigmaNodesResponse {
  name?: string;
  nodes?: Record<string, { document?: FigmaNodeDoc }>;
}

/** GET /v1/images/{key} */
export interface FigmaImagesResponse {
  err?: string | null;
  images?: Record<string, string | null>;
}

// ── Figma API response types ────────────────────────────────

interface FigmaStyle {
  key: string;
  name: string;
  style_type: "FILL" | "TEXT" | "EFFECT" | "GRID";
  node_id: string;
  description?: string;
}

interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  valuesByMode: Record<string, unknown>;
}

interface FigmaVariableCollection {
  id: string;
  name: string;
  modes: { modeId: string; name: string }[];
}

export interface FigmaStylesResponse {
  meta?: { styles?: FigmaStyle[] };
  styles?: Record<string, FigmaStyle>;
}

export interface FigmaVariablesResponse {
  meta?: {
    variables?: Record<string, FigmaVariable>;
    variableCollections?: Record<string, FigmaVariableCollection>;
  };
}

export interface FigmaFileResponse {
  name?: string;
  document?: { children?: unknown[] };
}

// ── Color role mapping patterns ─────────────────────────────

const COLOR_ROLE_PATTERNS: [RegExp, keyof UIDesignSystem["colors"]][] = [
  [/(?:^|\/)(?:bg|background|surface)(?:\/|$|-|\.)/i, "background"],
  [/(?:^|\/)(?:fg|foreground|text|on-surface)(?:\/|$|-|\.)/i, "foreground"],
  [/(?:^|\/)(?:primary|brand|action)(?:\/|$|-|\.)/i, "primary"],
  [/(?:^|\/)(?:primary-foreground|on-primary)(?:\/|$|-|\.)/i, "primaryForeground"],
  [/(?:^|\/)(?:secondary)(?:\/|$|-|\.)/i, "secondary"],
  [/(?:^|\/)(?:secondary-foreground|on-secondary)(?:\/|$|-|\.)/i, "secondaryForeground"],
  [/(?:^|\/)(?:muted|subtle|disabled)(?:\/|$|-|\.)/i, "muted"],
  [/(?:^|\/)(?:muted-foreground|placeholder)(?:\/|$|-|\.)/i, "mutedForeground"],
  [/(?:^|\/)(?:accent|highlight)(?:\/|$|-|\.)/i, "accent"],
  [/(?:^|\/)(?:accent-foreground|on-accent)(?:\/|$|-|\.)/i, "accentForeground"],
  [/(?:^|\/)(?:destructive|error|danger|red)(?:\/|$|-|\.)/i, "destructive"],
  [/(?:^|\/)(?:border|divider|outline|separator)(?:\/|$|-|\.)/i, "border"],
  [/(?:^|\/)(?:input|field)(?:\/|$|-|\.)/i, "input"],
  [/(?:^|\/)(?:ring|focus)(?:\/|$|-|\.)/i, "ring"],
  [/(?:^|\/)(?:card|container|panel)(?:\/|$|-|\.)/i, "card"],
  [/(?:^|\/)(?:card-foreground|on-card)(?:\/|$|-|\.)/i, "cardForeground"],
];

// ── Main mapper ─────────────────────────────────────────────

export interface MapFigmaOptions {
  frameName?: string;
  nodeDocument?: FigmaNodeDoc | null;
}

export function mapFigmaToDesignSystem(
  stylesData: FigmaStylesResponse | null,
  variablesData: FigmaVariablesResponse | null,
  fileData: FigmaFileResponse | null,
  options?: MapFigmaOptions
): UIDesignSystem {
  const ds: UIDesignSystem = JSON.parse(JSON.stringify(DEFAULT_UI_DESIGN_SYSTEM));

  if (options?.frameName?.trim()) {
    ds.name = options.frameName.trim();
  } else if (fileData?.name) {
    ds.name = fileData.name;
  }

  // 1. Variables (Enterprise plans — may be empty)
  applyVariables(variablesData, ds);

  // 2. Walk the node tree for real visual data (fills, text styles, effects, radii)
  if (options?.nodeDocument) {
    applyNodeTreeTokens(options.nodeDocument, ds);
  }

  ds.confidence = 1.0;
  return ds;
}

/** Collect COMPONENT / INSTANCE names for UI (reference panel). */
export function collectComponentNamesFromNode(node: FigmaNodeDoc | null | undefined): string[] {
  const seen = new Set<string>();
  function walk(n: FigmaNodeDoc | null | undefined): void {
    if (!n) return;
    const t = n.type;
    if ((t === "COMPONENT" || t === "INSTANCE" || t === "COMPONENT_SET") && n.name) {
      const name = n.name.trim();
      if (name && !seen.has(name)) seen.add(name);
    }
    if (Array.isArray(n.children)) {
      for (const c of n.children) walk(c);
    }
  }
  walk(node);
  return Array.from(seen).slice(0, 40);
}

// ── Node tree extraction ────────────────────────────────────
// Walks the full Figma node tree and extracts real visual tokens.
// Tracks parent fill context so text colors can be attributed to
// the surface they sit on (light vs dark backgrounds).

interface CollectedColor {
  hex: string;
  area: number;
  isText: boolean;
  nodeName: string;
  parentFillHex?: string;
}

function applyNodeTreeTokens(root: FigmaNodeDoc, ds: UIDesignSystem): void {
  const colors: CollectedColor[] = [];
  const textStyles: { family: string; weight: number; size: number; letterSpacing: number; nodeName: string }[] = [];
  const shadows: FigmaEffect[] = [];
  const radii: number[] = [];

  function walk(n: FigmaNodeDoc, parentFillHex?: string): void {
    const name = n.name ?? "";
    const isText = n.type === "TEXT";

    // Determine this node's own fill (used as parent context for children)
    let ownFillHex = parentFillHex;
    const isContainer = n.type === "FRAME" || n.type === "COMPONENT" || n.type === "INSTANCE" || n.type === "GROUP";

    if (isContainer) {
      // Check explicit fills first, then backgroundColor
      const solidFill = n.fills?.find((f) => f.type === "SOLID" && f.color && f.visible !== false);
      if (solidFill?.color) {
        ownFillHex = figmaColorToHex(solidFill.color);
      } else if (n.backgroundColor && n.backgroundColor.a > 0.01) {
        ownFillHex = figmaColorToHex(n.backgroundColor);
      }
    }

    // Collect solid fill colors
    if (n.fills && Array.isArray(n.fills)) {
      for (const fill of n.fills) {
        if (fill.type === "SOLID" && fill.color && fill.visible !== false) {
          const hex = figmaColorToHex(fill.color);
          const bb = n.absoluteBoundingBox;
          const area = bb ? bb.width * bb.height : 0;
          colors.push({ hex, area, isText, nodeName: name, parentFillHex: isText ? ownFillHex : undefined });
        }
      }
    }

    // Background color on frames
    if (n.backgroundColor && isContainer) {
      const bg = n.backgroundColor;
      if (bg.a > 0.01) {
        const hex = figmaColorToHex(bg);
        const bb = n.absoluteBoundingBox;
        const area = bb ? bb.width * bb.height : 0;
        colors.push({ hex, area, isText: false, nodeName: name });
      }
    }

    // Collect text styles
    if (isText && n.style?.fontFamily) {
      textStyles.push({
        family: n.style.fontFamily,
        weight: n.style.fontWeight ?? 400,
        size: n.style.fontSize ?? 14,
        letterSpacing: n.style.letterSpacing ?? 0,
        nodeName: name,
      });
    }

    // Collect drop shadows
    if (n.effects && Array.isArray(n.effects)) {
      for (const eff of n.effects) {
        if ((eff.type === "DROP_SHADOW" || eff.type === "INNER_SHADOW") && eff.visible !== false) {
          shadows.push(eff);
        }
      }
    }

    // Collect corner radii
    if (typeof n.cornerRadius === "number" && n.cornerRadius > 0) {
      radii.push(n.cornerRadius);
    }

    if (Array.isArray(n.children)) {
      for (const c of n.children) walk(c, ownFillHex);
    }
  }

  walk(root);

  // ── Assign colors to semantic roles ──
  assignColorsToRoles(colors, ds);

  // ── Assign typography ──
  assignTypography(textStyles, ds);

  // ── Assign shadows ──
  assignShadows(shadows, ds);

  // ── Assign radii ──
  assignRadii(radii, ds);
}

// ── Color assignment ────────────────────────────────────────
// Two-pass strategy:
//   1. Name-based matching from node names (highest priority)
//   2. Context-aware heuristics: uses parentFillHex on text nodes
//      to distinguish "text on light bg" from "text on dark bg",
//      correctly assigning foreground, cardForeground, mutedForeground, etc.

function assignColorsToRoles(
  colors: CollectedColor[],
  ds: UIDesignSystem
): void {
  if (colors.length === 0) return;

  // First pass: try name-based matching
  for (const c of colors) {
    for (const [pattern, role] of COLOR_ROLE_PATTERNS) {
      if (pattern.test(c.nodeName)) {
        (ds.colors as Record<string, string>)[role] = c.hex;
      }
    }
  }

  // Deduplicate fills and text separately
  interface ColorBucket { hex: string; totalArea: number; count: number; isText: boolean }
  const fillBuckets = new Map<string, ColorBucket>();
  const textOnLightBuckets = new Map<string, ColorBucket>();
  const textOnDarkBuckets = new Map<string, ColorBucket>();
  const allTextBuckets = new Map<string, ColorBucket>();

  for (const c of colors) {
    const key = c.hex.toLowerCase();

    if (!c.isText) {
      const existing = fillBuckets.get(key);
      if (existing) { existing.totalArea += c.area; existing.count++; }
      else fillBuckets.set(key, { hex: c.hex, totalArea: c.area, count: 1, isText: false });
      continue;
    }

    // Text — bucket by parent background lightness
    const addTo = (map: Map<string, ColorBucket>) => {
      const ex = map.get(key);
      if (ex) { ex.count++; }
      else map.set(key, { hex: c.hex, totalArea: 0, count: 1, isText: true });
    };

    addTo(allTextBuckets);

    if (c.parentFillHex) {
      if (isLightColor(c.parentFillHex)) addTo(textOnLightBuckets);
      else addTo(textOnDarkBuckets);
    } else {
      addTo(textOnLightBuckets);
    }
  }

  const fillsSorted = Array.from(fillBuckets.values()).sort((a, b) => b.totalArea - a.totalArea);
  const textOnLight = Array.from(textOnLightBuckets.values()).sort((a, b) => b.count - a.count);
  const textOnDark = Array.from(textOnDarkBuckets.values()).sort((a, b) => b.count - a.count);
  const allText = Array.from(allTextBuckets.values()).sort((a, b) => b.count - a.count);

  // Background: largest area fill (usually white/light)
  if (fillsSorted.length > 0) {
    ds.colors.background = fillsSorted[0].hex;
  }

  // Card background: look for a dark fill that is NOT the main background
  // (dark cards like #111111 in Rebtel). If none found, card = background.
  const darkCardFill = fillsSorted.find((f) =>
    !isLightColor(f.hex) &&
    f.hex.toLowerCase() !== ds.colors.background.toLowerCase() &&
    f.totalArea > 0
  );
  const lightCardFill = fillsSorted.find((f) =>
    f.hex.toLowerCase() !== ds.colors.background.toLowerCase() &&
    isLightColor(f.hex)
  );
  ds.colors.card = darkCardFill?.hex ?? ds.colors.background;

  // Foreground: darkest / most common text on light backgrounds
  if (textOnLight.length > 0) {
    // Sort by darkness (lower luminance = darker = better for primary text)
    const byDarkness = [...textOnLight].sort((a, b) => hexLuminance(a.hex) - hexLuminance(b.hex));
    ds.colors.foreground = byDarkness[0].hex;
  } else if (allText.length > 0) {
    ds.colors.foreground = allText[0].hex;
  }

  // Card foreground: if we have a dark card, use text found on dark backgrounds
  if (darkCardFill && textOnDark.length > 0) {
    ds.colors.cardForeground = textOnDark[0].hex;
  } else {
    ds.colors.cardForeground = ds.colors.foreground;
  }

  // Muted foreground: secondary text on light backgrounds (lighter than foreground)
  // Find text colors that are lighter than the primary foreground
  const fgLum = hexLuminance(ds.colors.foreground);
  const mutedCandidates = textOnLight.filter((t) => {
    const lum = hexLuminance(t.hex);
    return lum > fgLum + 0.05 && lum < 0.85; // lighter than fg, but not near-white
  });
  if (mutedCandidates.length > 0) {
    // Pick the most common lighter text color
    ds.colors.mutedForeground = mutedCandidates[0].hex;
  } else if (textOnLight.length > 1) {
    ds.colors.mutedForeground = textOnLight[1].hex;
  }

  // Secondary foreground: same as foreground (primary text weight)
  ds.colors.secondaryForeground = ds.colors.foreground;

  // Primary: most saturated non-background fill
  const primaryCandidates = fillsSorted
    .filter((c) => {
      const sat = hexSaturation(c.hex);
      return sat > 0.2 && c.hex.toLowerCase() !== ds.colors.background.toLowerCase();
    })
    .sort((a, b) => hexSaturation(b.hex) * b.count - hexSaturation(a.hex) * a.count);

  if (primaryCandidates.length > 0) {
    ds.colors.primary = primaryCandidates[0].hex;
    ds.colors.ring = primaryCandidates[0].hex;
    ds.colors.primaryForeground = isLightColor(primaryCandidates[0].hex) ? "#000000" : "#FFFFFF";
  }

  // Accent: second most saturated, or same as primary
  if (primaryCandidates.length > 1) {
    ds.colors.accent = primaryCandidates[1].hex;
    ds.colors.accentForeground = isLightColor(primaryCandidates[1].hex) ? "#000000" : "#FFFFFF";
  } else {
    ds.colors.accent = ds.colors.primary;
    ds.colors.accentForeground = ds.colors.primaryForeground;
  }

  // Secondary fill: light neutral fill that isn't the main background
  if (lightCardFill) {
    ds.colors.secondary = lightCardFill.hex;
    ds.colors.muted = lightCardFill.hex;
  } else {
    const neutralFills = fillsSorted.filter((f) =>
      f.hex.toLowerCase() !== ds.colors.background.toLowerCase() &&
      hexSaturation(f.hex) < 0.15
    );
    if (neutralFills.length > 0) {
      ds.colors.secondary = neutralFills[0].hex;
      ds.colors.muted = neutralFills[0].hex;
    }
  }

  // Border: mid-luminance non-text fill
  const borderCandidates = fillsSorted.filter((c) => {
    const lum = hexLuminance(c.hex);
    return lum > 0.6 && lum < 0.95;
  });
  if (borderCandidates.length > 0) {
    ds.colors.border = borderCandidates[0].hex;
    ds.colors.input = borderCandidates[0].hex;
  }

  // Destructive: red-ish fills or text
  const allBuckets = [...fillsSorted, ...allText];
  const redCandidates = allBuckets.filter((c) => {
    const rgb = hexToRgb(c.hex);
    return rgb && rgb.r > 180 && rgb.g < 100 && rgb.b < 100;
  });
  if (redCandidates.length > 0) {
    ds.colors.destructive = redCandidates[0].hex;
  }

  // Contrast enforcement: ensure every fg/bg pair is readable
  ds.colors.foreground = ensureContrast(ds.colors.foreground, ds.colors.background);
  ds.colors.cardForeground = ensureContrast(ds.colors.cardForeground, ds.colors.card);
  ds.colors.primaryForeground = ensureContrast(ds.colors.primaryForeground, ds.colors.primary);
  ds.colors.secondaryForeground = ensureContrast(ds.colors.secondaryForeground, ds.colors.secondary);
  ds.colors.accentForeground = ensureContrast(ds.colors.accentForeground, ds.colors.accent);
  ds.colors.mutedForeground = ensureContrast(ds.colors.mutedForeground, ds.colors.muted, 2.5);
}

// ── Typography assignment ───────────────────────────────────

function assignTypography(
  textStyles: { family: string; weight: number; size: number; letterSpacing: number; nodeName: string }[],
  ds: UIDesignSystem
): void {
  if (textStyles.length === 0) return;

  // Sort by font size descending — largest is heading, most common is body
  const bySize = [...textStyles].sort((a, b) => b.size - a.size);

  // Heading: largest text or named heading/title
  const headingCandidate = bySize.find((t) =>
    /title|heading|h1|h2|display|header/i.test(t.nodeName)
  ) ?? bySize[0];

  if (headingCandidate) {
    const fam = wrapFontFamily(headingCandidate.family);
    ds.fonts.heading = {
      family: fam,
      weight: headingCandidate.weight,
      letterSpacing: headingCandidate.letterSpacing ? `${headingCandidate.letterSpacing}px` : "-0.02em",
    };
  }

  // Body: most common font family (by count)
  const familyCounts = new Map<string, { family: string; weight: number; letterSpacing: number; count: number; avgSize: number }>();
  for (const t of textStyles) {
    const key = t.family.toLowerCase();
    const existing = familyCounts.get(key);
    if (existing) {
      existing.count++;
      existing.avgSize = (existing.avgSize * (existing.count - 1) + t.size) / existing.count;
    } else {
      familyCounts.set(key, { family: t.family, weight: t.weight, letterSpacing: t.letterSpacing, count: 1, avgSize: t.size });
    }
  }

  const mostCommon = Array.from(familyCounts.values()).sort((a, b) => b.count - a.count)[0];
  if (mostCommon) {
    const fam = wrapFontFamily(mostCommon.family);
    ds.fonts.body = {
      family: fam,
      weight: mostCommon.weight,
      letterSpacing: mostCommon.letterSpacing ? `${mostCommon.letterSpacing}px` : "-0.01em",
    };
    ds.fonts.caption = { family: fam, weight: mostCommon.weight };
  }

  // Build font size scale from actual sizes found
  const sizes = textStyles.map((t) => t.size).sort((a, b) => a - b);
  const unique = [...new Set(sizes)];
  if (unique.length >= 3) {
    const scale = buildFontSizeScale(unique);
    ds.fontSizes = scale;
  }
}

function buildFontSizeScale(sizes: number[]): UIDesignSystem["fontSizes"] {
  const sorted = [...sizes].sort((a, b) => a - b);
  const len = sorted.length;

  const pick = (fraction: number) => `${Math.round(sorted[Math.min(Math.floor(fraction * len), len - 1)])}px`;

  return {
    xs: pick(0),
    sm: pick(0.15),
    base: pick(0.35),
    lg: pick(0.55),
    xl: pick(0.7),
    "2xl": pick(0.85),
    "3xl": pick(1 - 1 / len),
  };
}

// ── Shadow assignment ───────────────────────────────────────

function assignShadows(effects: FigmaEffect[], ds: UIDesignSystem): void {
  if (effects.length === 0) return;

  const cssShadows = effects
    .filter((e) => e.offset && e.color)
    .map((e) => {
      const x = e.offset!.x;
      const y = e.offset!.y;
      const blur = e.radius ?? 0;
      const spread = e.spread ?? 0;
      const c = e.color!;
      const rgba = `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${+(c.a ?? 0.2).toFixed(2)})`;
      return `${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
    });

  if (cssShadows.length === 0) return;

  // Sort by blur radius ascending
  const sorted = [...cssShadows].sort((a, b) => {
    const blurA = parseFloat(a.split(" ")[2]);
    const blurB = parseFloat(b.split(" ")[2]);
    return blurA - blurB;
  });

  ds.shadows.sm = sorted[0];
  ds.shadows.button = sorted[0];
  ds.shadows.input = sorted[0];

  if (sorted.length >= 2) {
    ds.shadows.md = sorted[Math.floor(sorted.length / 2)];
    ds.shadows.card = sorted[Math.floor(sorted.length / 2)];
  }

  if (sorted.length >= 3) {
    ds.shadows.lg = sorted[sorted.length - 1];
  }
}

// ── Radii assignment ────────────────────────────────────────
// Uses the median of the top quartile for card/button (captures the
// "feel" of the design's roundness), and builds a scale from unique values.

function assignRadii(radii: number[], ds: UIDesignSystem): void {
  if (radii.length === 0) return;

  const sorted = [...radii].sort((a, b) => a - b);
  const unique = [...new Set(sorted)].sort((a, b) => a - b);
  const px = (v: number) => `${Math.round(v)}px`;

  // Component defaults: use the upper-median radius (75th percentile)
  // This captures the "feel" — designs with 20px cards shouldn't get 8px
  const p75 = sorted[Math.floor(sorted.length * 0.75)];
  const maxR = sorted[sorted.length - 1];

  ds.radii.card = px(Math.max(p75, 8));
  ds.radii.button = px(Math.max(Math.min(p75, maxR), 8));
  ds.radii.input = px(Math.max(Math.round(p75 * 0.7), 4));

  // Build scale from unique values
  if (unique.length >= 3) {
    ds.radii.sm = px(unique[0]);
    ds.radii.md = px(unique[Math.floor(unique.length * 0.3)]);
    ds.radii.lg = px(unique[Math.floor(unique.length * 0.6)]);
    ds.radii.xl = px(unique[unique.length - 1]);
  } else if (unique.length === 2) {
    ds.radii.sm = px(unique[0]);
    ds.radii.md = px(Math.round((unique[0] + unique[1]) / 2));
    ds.radii.lg = px(unique[1]);
    ds.radii.xl = px(Math.round(unique[1] * 1.3));
  } else {
    const base = unique[0];
    ds.radii.sm = px(Math.max(Math.round(base * 0.5), 2));
    ds.radii.md = px(base);
    ds.radii.lg = px(Math.round(base * 1.5));
    ds.radii.xl = px(Math.round(base * 2));
  }
}

// ── Variable extraction (Enterprise) ────────────────────────

function applyVariables(variablesData: FigmaVariablesResponse | null, ds: UIDesignSystem): void {
  if (!variablesData?.meta?.variables) return;

  const vars = Object.values(variablesData.meta.variables);
  const collections = variablesData.meta.variableCollections
    ? Object.values(variablesData.meta.variableCollections)
    : [];

  const defaultModeId = collections[0]?.modes?.[0]?.modeId;

  for (const v of vars) {
    const modeValue = defaultModeId ? v.valuesByMode[defaultModeId] : Object.values(v.valuesByMode)[0];
    if (!modeValue) continue;

    if (v.resolvedType === "COLOR" && typeof modeValue === "object" && modeValue !== null) {
      const hex = figmaColorToHex(modeValue as FigmaColor);
      for (const [pattern, role] of COLOR_ROLE_PATTERNS) {
        if (pattern.test(v.name)) {
          (ds.colors as Record<string, string>)[role] = hex;
          break;
        }
      }
    }

    if (v.resolvedType === "FLOAT" && typeof modeValue === "number") {
      const lower = v.name.toLowerCase();
      const px = `${Math.round(modeValue)}px`;

      if (/spacing|space|gap/i.test(lower)) {
        if (modeValue <= 6) ds.spacing.xs = px;
        else if (modeValue <= 10) ds.spacing.sm = px;
        else if (modeValue <= 18) ds.spacing.md = px;
        else if (modeValue <= 28) ds.spacing.lg = px;
        else if (modeValue <= 40) ds.spacing.xl = px;
        else ds.spacing["2xl"] = px;
      }

      if (/radius|corner|rounded/i.test(lower)) {
        if (modeValue <= 4) ds.radii.sm = px;
        else if (modeValue <= 10) ds.radii.md = px;
        else if (modeValue <= 16) ds.radii.lg = px;
        else if (modeValue <= 24) ds.radii.xl = px;
        if (/button/i.test(lower)) ds.radii.button = px;
        if (/card/i.test(lower)) ds.radii.card = px;
        if (/input|field/i.test(lower)) ds.radii.input = px;
      }
    }
  }
}

// ── Utility functions ───────────────────────────────────────

function figmaColorToHex(color: FigmaColor): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function hexSaturation(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

function hexLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

function isLightColor(hex: string): boolean {
  return hexLuminance(hex) > 0.6;
}

function wrapFontFamily(family: string): string {
  if (family.includes(",")) return family;
  const clean = family.replace(/['"]/g, "");
  return `'${clean}', -apple-system, BlinkMacSystemFont, sans-serif`;
}

/** WCAG relative luminance for contrast calculation */
function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function ensureContrast(fg: string, bg: string, minRatio = 3.5): string {
  if (contrastRatio(fg, bg) >= minRatio) return fg;
  const withBlack = contrastRatio("#000000", bg);
  const withWhite = contrastRatio("#FFFFFF", bg);
  return withBlack > withWhite ? "#000000" : "#FFFFFF";
}
