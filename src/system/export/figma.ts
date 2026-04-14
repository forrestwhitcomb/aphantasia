// ============================================================
// Aphantasia/System — Figma Design System Import
// ============================================================

import { DEFAULT_TOKENS } from "../tokens";

// ── Types ───────────────────────────────────────────────────

export interface FigmaImportResult {
  tokens: Record<string, string>;
  unmapped: Array<{ name: string; value: string }>;
  source: {
    fileName: string;
    fileKey: string;
    variableCount: number;
    styleCount: number;
  };
}

// ── URL parsing ─────────────────────────────────────────────

export interface ParsedFigmaUrl {
  fileKey: string;
  nodeId: string | null;
}

export function parseFigmaUrl(url: string): ParsedFigmaUrl | null {
  // Handles:
  //   https://www.figma.com/file/KEY/name
  //   https://www.figma.com/design/KEY/name?node-id=123-456
  //   https://www.figma.com/design/KEY/name?node-id=123-456&m=dev
  const keyMatch = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
  if (!keyMatch) return null;
  const nodeMatch = url.match(/node-id=([0-9]+-[0-9]+)/);
  return { fileKey: keyMatch[1], nodeId: nodeMatch ? nodeMatch[1] : null };
}

/** @deprecated use parseFigmaUrl instead */
export function parseFigmaFileKey(url: string): string | null {
  const result = parseFigmaUrl(url);
  return result ? result.fileKey : null;
}

// ── Color conversion ────────────────────────────────────────

function rgbaToHex(r: number, g: number, b: number, a?: number): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0");
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a !== undefined && a < 1) return `${hex}${toHex(a)}`;
  return hex;
}

function normalizeFigmaColor(value: unknown): string | null {
  if (typeof value === "string") {
    if (value.startsWith("#")) return value;
    return value;
  }
  if (typeof value === "object" && value !== null) {
    const c = value as Record<string, number>;
    if ("r" in c && "g" in c && "b" in c) {
      return rgbaToHex(c.r, c.g, c.b, c.a);
    }
  }
  return null;
}

function normalizeSpacing(value: unknown): string | null {
  if (typeof value === "number") return `${value}px`;
  if (typeof value === "string") {
    if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`;
    return value;
  }
  return null;
}

// ── Token name mapping ──────────────────────────────────────

const TOKEN_MAP: Array<{ patterns: RegExp[]; adsKey: string }> = [
  // Brand colors
  { patterns: [/^colou?rs?[\/.]primary$/i, /^brand[\/.]primary$/i], adsKey: "brand.primary" },
  { patterns: [/^colou?rs?[\/.]primary[\/.]fg$/i, /^brand[\/.]primary[\/.]fg$/i, /^colou?rs?[\/.]on.?primary$/i], adsKey: "brand.primary.fg" },
  { patterns: [/^colou?rs?[\/.]secondary$/i, /^brand[\/.]secondary$/i], adsKey: "brand.secondary" },
  { patterns: [/^colou?rs?[\/.]secondary[\/.]fg$/i, /^brand[\/.]secondary[\/.]fg$/i], adsKey: "brand.secondary.fg" },
  { patterns: [/^colou?rs?[\/.](?:destructive|error|danger)$/i], adsKey: "brand.destructive" },
  { patterns: [/^colou?rs?[\/.]success$/i], adsKey: "brand.success" },

  // Backgrounds
  { patterns: [/^(?:colou?rs?|bg|background)[\/.](?:page|default|background|surface)$/i], adsKey: "bg.page" },
  { patterns: [/^(?:colou?rs?|bg|background)[\/.]card$/i], adsKey: "bg.card" },
  { patterns: [/^(?:colou?rs?|bg|background)[\/.]muted$/i], adsKey: "bg.muted" },
  { patterns: [/^(?:colou?rs?|bg|background)[\/.]subtle$/i], adsKey: "bg.subtle" },

  // Text
  { patterns: [/^(?:text|foreground)[\/.](?:primary|default)$/i], adsKey: "text.primary" },
  { patterns: [/^(?:text|foreground)[\/.](?:secondary|muted)$/i], adsKey: "text.secondary" },
  { patterns: [/^(?:text|foreground)[\/.](?:tertiary|subtle|disabled)$/i], adsKey: "text.tertiary" },
  { patterns: [/^(?:text|foreground)[\/.]inverse$/i], adsKey: "text.inverse" },

  // Border
  { patterns: [/^(?:border|stroke)[\/.](?:default|primary)$/i], adsKey: "border.default" },
  { patterns: [/^(?:border|stroke)[\/.](?:strong|secondary)$/i], adsKey: "border.strong" },
  { patterns: [/^(?:border|stroke)[\/.]focus$/i], adsKey: "border.focus" },

  // Spacing
  { patterns: [/^spacing[\/.](?:2?xs|extra.?small)$/i], adsKey: "spacing.xs" },
  { patterns: [/^spacing[\/.](?:sm|small)$/i], adsKey: "spacing.sm" },
  { patterns: [/^spacing[\/.](?:md|medium|base)$/i], adsKey: "spacing.md" },
  { patterns: [/^spacing[\/.](?:lg|large)$/i], adsKey: "spacing.lg" },
  { patterns: [/^spacing[\/.](?:xl|extra.?large)$/i], adsKey: "spacing.xl" },
  { patterns: [/^spacing[\/.](?:2xl|xxl)$/i], adsKey: "spacing.2xl" },
  { patterns: [/^spacing[\/.](?:3xl|xxxl)$/i], adsKey: "spacing.3xl" },

  // Radius
  { patterns: [/^radius[\/.](?:sm|small)$/i], adsKey: "radius.sm" },
  { patterns: [/^radius[\/.](?:md|medium|base|default)$/i], adsKey: "radius.md" },
  { patterns: [/^radius[\/.](?:lg|large)$/i], adsKey: "radius.lg" },
  { patterns: [/^radius[\/.](?:xl|extra.?large)$/i], adsKey: "radius.xl" },
  { patterns: [/^radius[\/.](?:full|pill|round)$/i], adsKey: "radius.full" },
];

function matchTokenName(figmaName: string): string | null {
  const normalized = figmaName.replace(/\//g, ".");
  for (const entry of TOKEN_MAP) {
    for (const pattern of entry.patterns) {
      if (pattern.test(figmaName) || pattern.test(normalized)) {
        return entry.adsKey;
      }
    }
  }
  return null;
}

// ── Main mapping function ───────────────────────────────────

interface FigmaVariable {
  name: string;
  resolvedType: string;
  valuesByMode: Record<string, unknown>;
}

interface FigmaStyle {
  name: string;
  style_type: string;
  node_id?: string;
  description?: string;
}

export function mapFigmaToADS(
  variablesData: unknown,
  stylesData: unknown,
  fileName: string,
  fileKey: string,
  styleNodeData?: Record<string, unknown>,
): FigmaImportResult {
  const tokens: Record<string, string> = {};
  const unmapped: Array<{ name: string; value: string }> = [];
  let variableCount = 0;
  let styleCount = 0;

  // Process variables
  const varsObj = variablesData as Record<string, Record<string, unknown>>;
  const metaVars = varsObj?.meta?.variables ?? varsObj?.variables ?? {};
  const variables = metaVars as Record<string, FigmaVariable>;
  const variableList = typeof variables === "object" ? Object.values(variables) : [];

  for (const v of variableList) {
    if (!v || !v.name) continue;
    variableCount++;

    const modeValues = v.valuesByMode ?? {};
    const firstModeValue = Object.values(modeValues)[0];
    if (firstModeValue === undefined) continue;

    const adsKey = matchTokenName(v.name);
    const isColor = v.resolvedType === "COLOR";
    const isFloat = v.resolvedType === "FLOAT";

    let normalized: string | null = null;
    if (isColor) normalized = normalizeFigmaColor(firstModeValue);
    else if (isFloat) normalized = normalizeSpacing(firstModeValue);
    else if (typeof firstModeValue === "string") normalized = firstModeValue;

    if (normalized === null) continue;

    if (adsKey) {
      tokens[adsKey] = normalized;
    } else {
      unmapped.push({ name: v.name, value: normalized });
    }
  }

  // Process styles — use style node data to extract actual fill colors
  const stylesObj = stylesData as Record<string, Record<string, unknown>>;
  const rawStyles = stylesObj?.meta?.styles ?? stylesObj?.styles ?? [];
  const styleArray = (Array.isArray(rawStyles) ? rawStyles : Object.values(rawStyles)) as FigmaStyle[];

  for (const s of styleArray) {
    if (!s || typeof s !== "object") continue;
    const style = s as FigmaStyle;
    if (!style.name) continue;
    styleCount++;

    if (style.style_type === "FILL" && style.node_id && styleNodeData) {
      // Extract color from the node's fills array
      const nodeEntry = styleNodeData[style.node_id] as Record<string, unknown> | undefined;
      const doc = (nodeEntry?.document ?? nodeEntry) as Record<string, unknown> | undefined;
      const fills = doc?.fills as Array<Record<string, unknown>> | undefined;
      if (fills && fills.length > 0) {
        const fill = fills[0];
        if (fill.type === "SOLID" && fill.color) {
          const color = normalizeFigmaColor(fill.color);
          if (color) {
            const adsKey = matchTokenName(style.name);
            if (adsKey && !tokens[adsKey]) {
              tokens[adsKey] = color;
            } else if (!adsKey) {
              unmapped.push({ name: style.name, value: color });
            }
          }
        }
      }
    } else if (style.style_type === "TEXT") {
      // Text styles could map to typography tokens in the future
      styleCount; // counted above
    }
  }

  return {
    tokens,
    unmapped,
    source: { fileName, fileKey, variableCount, styleCount },
  };
}
