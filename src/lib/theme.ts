// ============================================================
// APHANTASIA — Theme System
// ============================================================
// CSS custom property tokens + named presets.
// All section components reference these vars — no hardcoded values.
// ============================================================

export interface ThemeTokens {
  // Backgrounds
  "--background": string;
  "--surface": string;
  "--surface-alt": string;
  // Text
  "--foreground": string;
  "--muted-foreground": string;
  // Accent / brand
  "--accent": string;
  "--accent-foreground": string;
  // Borders
  "--border": string;
  "--border-opacity": string;
  // Shape
  "--radius": string;
  "--radius-sm": string;
  "--radius-lg": string;
  // Shadows (optional override from reference extraction)
  "--shadow-card"?: string;
  "--shadow-button"?: string;
  // Typography
  "--font-heading": string;
  "--font-body": string;
  "--font-mono": string;
  "--font-size-heading"?: string;
  "--font-size-body"?: string;
  "--letter-spacing-heading"?: string;
  // Blur / glass
  "--surface-blur": string;
  "--surface-opacity": string;
  // Spacing scale
  "--section-py": string;
  "--inner-max": string;
}

export const PRESETS: Record<string, ThemeTokens> = {
  "Light Minimal": {
    "--background": "#ffffff",
    "--surface": "#f8f8f8",
    "--surface-alt": "#f0f0f0",
    "--foreground": "#111111",
    "--muted-foreground": "#666666",
    "--accent": "#111111",
    "--accent-foreground": "#ffffff",
    "--border": "#e8e8e8",
    "--border-opacity": "1",
    "--radius": "8px",
    "--radius-sm": "4px",
    "--radius-lg": "16px",
    "--font-heading": "'Inter', system-ui, sans-serif",
    "--font-body": "'Inter', system-ui, sans-serif",
    "--font-mono": "'JetBrains Mono', monospace",
    "--surface-blur": "0px",
    "--surface-opacity": "1",
    "--section-py": "80px",
    "--inner-max": "1100px",
  },

  "Dark Glass": {
    "--background": "#0a0a0f",
    "--surface": "rgba(255,255,255,0.06)",
    "--surface-alt": "rgba(255,255,255,0.03)",
    "--foreground": "#f0f0f0",
    "--muted-foreground": "#888888",
    "--accent": "#7c3aed",
    "--accent-foreground": "#ffffff",
    "--border": "rgba(255,255,255,0.1)",
    "--border-opacity": "0.1",
    "--radius": "10px",
    "--radius-sm": "6px",
    "--radius-lg": "20px",
    "--font-heading": "'Inter', system-ui, sans-serif",
    "--font-body": "'Inter', system-ui, sans-serif",
    "--font-mono": "'JetBrains Mono', monospace",
    "--surface-blur": "12px",
    "--surface-opacity": "0.06",
    "--section-py": "96px",
    "--inner-max": "1100px",
  },

  "Bold Color": {
    "--background": "#fff7ed",
    "--surface": "#ffffff",
    "--surface-alt": "#fef3c7",
    "--foreground": "#1c1917",
    "--muted-foreground": "#78716c",
    "--accent": "#ea580c",
    "--accent-foreground": "#ffffff",
    "--border": "#e7e5e4",
    "--border-opacity": "1",
    "--radius": "12px",
    "--radius-sm": "6px",
    "--radius-lg": "24px",
    "--font-heading": "'Inter', system-ui, sans-serif",
    "--font-body": "'Inter', system-ui, sans-serif",
    "--font-mono": "'JetBrains Mono', monospace",
    "--surface-blur": "0px",
    "--surface-opacity": "1",
    "--section-py": "88px",
    "--inner-max": "1100px",
  },
};

export const DEFAULT_PRESET = "Light Minimal";

/** Convert a ThemeTokens map to an inline CSS :root block */
export function tokensToCSS(tokens: ThemeTokens): string {
  const entries = Object.entries(tokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root {\n${entries}\n}`;
}

/** Merge brand colors from StructuredContext into a base preset */
export function applyBrandColors(
  base: ThemeTokens,
  colors?: string[]
): ThemeTokens {
  if (!colors?.length) return base;
  return {
    ...base,
    "--accent": colors[0],
    ...(colors[1] ? { "--surface-alt": colors[1] } : {}),
  };
}

/** Merge AI-extracted reference tokens into a base preset.
 *  Maps component-level observations to CSS custom properties. */
export function applyReferenceTokens(
  base: ThemeTokens,
  tokens: import("@/types/reference").ExtractedStyleTokens
): ThemeTokens {
  const result = { ...base };

  // Colors
  if (tokens.background) result["--background"] = tokens.background;
  if (tokens.surface) result["--surface"] = tokens.surface;
  if (tokens.foreground) result["--foreground"] = tokens.foreground;
  if (tokens.mutedForeground) result["--muted-foreground"] = tokens.mutedForeground;
  if (tokens.accent) result["--accent"] = tokens.accent;
  // Fall back to first color in palette for accent if not explicitly set
  if (!tokens.accent && tokens.colors?.length) result["--accent"] = tokens.colors[0];

  // Typography
  if (tokens.fontHeading) result["--font-heading"] = tokens.fontHeading;
  if (tokens.fontBody) result["--font-body"] = tokens.fontBody;

  // Shape — map the most specific radius, fall back to card radius
  if (tokens.buttonRadius) {
    result["--radius-sm"] = tokens.buttonRadius;
  }
  if (tokens.cardRadius) {
    result["--radius"] = tokens.cardRadius;
    result["--radius-lg"] = tokens.cardRadius;
  }

  // Spacing
  if (tokens.sectionPadding) result["--section-py"] = tokens.sectionPadding;

  // Deeper extraction: shadows, font sizes, letter-spacing
  if (tokens.shadowCard) result["--shadow-card"] = tokens.shadowCard;
  if (tokens.shadowButton) result["--shadow-button"] = tokens.shadowButton;
  if (tokens.fontSizeHeading) result["--font-size-heading"] = tokens.fontSizeHeading;
  if (tokens.fontSizeBody) result["--font-size-body"] = tokens.fontSizeBody;
  if (tokens.letterSpacingHeading) result["--letter-spacing-heading"] = tokens.letterSpacingHeading;

  return result;
}
