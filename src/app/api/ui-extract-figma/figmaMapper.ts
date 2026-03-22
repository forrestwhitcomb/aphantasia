// Figma REST API response → UIDesignSystem mapper.
// Handles common variable/style naming conventions.

import type { UIDesignSystem } from "@/ui-mode/types";
import { DEFAULT_UI_DESIGN_SYSTEM } from "@/ui-mode/defaultDesignSystem";

/** Parse a Figma file key from various URL formats. */
export function parseFigmaFileKey(url: string): string | null {
  const match = url.match(/figma\.com\/(?:design|file|proto)\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
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

// ── Figma API response types (minimal) ──────────────────────

interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

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

// ── Main mapper ─────────────────────────────────────────────

export function mapFigmaToDesignSystem(
  stylesData: FigmaStylesResponse | null,
  variablesData: FigmaVariablesResponse | null,
  fileData: FigmaFileResponse | null
): UIDesignSystem {
  const ds: UIDesignSystem = JSON.parse(JSON.stringify(DEFAULT_UI_DESIGN_SYSTEM));

  // Set file name
  if (fileData?.name) {
    ds.name = fileData.name;
  }

  // Map variables (if available — requires Enterprise plan)
  if (variablesData?.meta?.variables) {
    const vars = Object.values(variablesData.meta.variables);
    const collections = variablesData.meta.variableCollections
      ? Object.values(variablesData.meta.variableCollections)
      : [];

    // Find the first mode ID (usually "Light" or default)
    const defaultModeId = collections[0]?.modes?.[0]?.modeId;

    for (const v of vars) {
      const modeValue = defaultModeId ? v.valuesByMode[defaultModeId] : Object.values(v.valuesByMode)[0];
      if (!modeValue) continue;

      if (v.resolvedType === "COLOR" && typeof modeValue === "object" && modeValue !== null) {
        const hex = figmaColorToHex(modeValue as FigmaColor);
        mapColorVariable(v.name, hex, ds);
      }

      if (v.resolvedType === "FLOAT" && typeof modeValue === "number") {
        mapNumericVariable(v.name, modeValue, ds);
      }
    }
  }

  // Map styles (always available)
  if (stylesData?.meta?.styles) {
    for (const style of stylesData.meta.styles) {
      if (style.style_type === "FILL") {
        // Color styles — name pattern matching
        for (const [pattern, role] of COLOR_ROLE_PATTERNS) {
          if (pattern.test(style.name)) {
            // We can't get the actual color value from the styles endpoint alone
            // (need to fetch node data). Mark as needing resolution.
            break;
          }
        }
      }
      if (style.style_type === "TEXT") {
        mapTextStyle(style.name, ds);
      }
    }
  }

  ds.confidence = 1.0;
  return ds;
}

// ── Helper functions ────────────────────────────────────────

function figmaColorToHex(color: FigmaColor): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function mapColorVariable(name: string, hex: string, ds: UIDesignSystem): void {
  for (const [pattern, role] of COLOR_ROLE_PATTERNS) {
    if (pattern.test(name)) {
      (ds.colors as Record<string, string>)[role] = hex;
      return;
    }
  }
}

function mapNumericVariable(name: string, value: number, ds: UIDesignSystem): void {
  const lower = name.toLowerCase();
  const px = `${Math.round(value)}px`;

  // Spacing
  if (/spacing|space|gap/i.test(lower)) {
    if (value <= 6) ds.spacing.xs = px;
    else if (value <= 10) ds.spacing.sm = px;
    else if (value <= 18) ds.spacing.md = px;
    else if (value <= 28) ds.spacing.lg = px;
    else if (value <= 40) ds.spacing.xl = px;
    else ds.spacing["2xl"] = px;
  }

  // Radii
  if (/radius|corner|rounded/i.test(lower)) {
    if (value <= 4) ds.radii.sm = px;
    else if (value <= 10) ds.radii.md = px;
    else if (value <= 16) ds.radii.lg = px;
    else if (value <= 24) ds.radii.xl = px;

    // Component-specific
    if (/button/i.test(lower)) ds.radii.button = px;
    if (/card/i.test(lower)) ds.radii.card = px;
    if (/input|field/i.test(lower)) ds.radii.input = px;
  }
}

function mapTextStyle(name: string, ds: UIDesignSystem): void {
  const lower = name.toLowerCase();
  // Identify heading vs body vs caption from style name
  if (/heading|title|display|h1|h2|h3/i.test(lower)) {
    // We know it's a heading style but can't extract font details from styles endpoint alone
    // This would require fetching the node data
  }
}
