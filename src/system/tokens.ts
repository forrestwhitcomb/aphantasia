// ============================================================
// Aphantasia/System — Design Tokens (ADS Defaults)
// ============================================================
// shadcn/ui-compatible token set. Every component renders using
// these tokens via CSS custom properties. Users customize from
// the System panel; changes cascade to all components instantly.
// ============================================================

export const DEFAULT_TOKENS: Record<string, string> = {
  // ── Brand ──
  "brand.primary":    "#2563eb",
  "brand.primary.fg": "#ffffff",
  "brand.secondary":  "#64748b",
  "brand.secondary.fg": "#ffffff",
  "brand.destructive": "#ef4444",
  "brand.success":    "#10b981",

  // ── Backgrounds ──
  "bg.page":   "#ffffff",
  "bg.card":   "#ffffff",
  "bg.muted":  "#f1f5f9",
  "bg.subtle": "#f8fafc",

  // ── Text ──
  "text.primary":   "#0f172a",
  "text.secondary": "#64748b",
  "text.tertiary":  "#94a3b8",
  "text.inverse":   "#ffffff",

  // ── Border ──
  "border.default": "#e2e8f0",
  "border.strong":  "#cbd5e1",
  "border.focus":   "#2563eb",

  // ── Radius ──
  "radius.sm":  "6px",
  "radius.md":  "8px",
  "radius.lg":  "12px",
  "radius.xl":  "16px",
  "radius.full": "9999px",

  // ── Shadows ──
  "shadow.sm": "0 1px 2px rgba(0,0,0,0.05)",
  "shadow.md": "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.06)",
  "shadow.lg": "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.05)",
  "shadow.xl": "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)",

  // ── Spacing ──
  "spacing.xs":  "4px",
  "spacing.sm":  "8px",
  "spacing.md":  "16px",
  "spacing.lg":  "24px",
  "spacing.xl":  "32px",
  "spacing.2xl": "48px",
  "spacing.3xl": "64px",

  // ── Typography ──
  "font.sans":    "'Inter', system-ui, -apple-system, sans-serif",
  "font.heading": "'Inter', system-ui, -apple-system, sans-serif",
  "font.mono":    "'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace",

  // ── Type Scale ──
  "text.xs":   "12px",
  "text.sm":   "14px",
  "text.base": "16px",
  "text.lg":   "18px",
  "text.xl":   "20px",
  "text.2xl":  "24px",
  "text.3xl":  "30px",
  "text.4xl":  "36px",
  "text.5xl":  "48px",

  // ── Font Weights ──
  "font.weight.normal":     "400",
  "font.weight.medium":     "500",
  "font.weight.semibold":   "600",
  "font.weight.bold":       "700",
  "font.weight.extrabold":  "800",

  // ── Line Heights ──
  "leading.tight":    "1.1",
  "leading.snug":     "1.25",
  "leading.normal":   "1.5",
  "leading.relaxed":  "1.65",
};

// ── Theme presets ───────────────────────────────────────────

export const THEME_PRESETS: Record<string, { name: string; tokens: Record<string, string> }> = {
  default: { name: "Default Blue", tokens: { ...DEFAULT_TOKENS } },
  dark: { name: "Dark Mode", tokens: {
    ...DEFAULT_TOKENS,
    "brand.primary": "#3b82f6", "brand.primary.fg": "#ffffff",
    "brand.secondary": "#475569", "brand.secondary.fg": "#ffffff",
    "brand.destructive": "#f87171", "brand.success": "#34d399",
    "bg.page": "#0f172a", "bg.card": "#1e293b", "bg.muted": "#1e293b", "bg.subtle": "#0f172a",
    "text.primary": "#f8fafc", "text.secondary": "#94a3b8", "text.tertiary": "#64748b", "text.inverse": "#0f172a",
    "border.default": "#334155", "border.strong": "#475569", "border.focus": "#3b82f6",
    "shadow.sm": "0 1px 2px rgba(0,0,0,0.3)", "shadow.md": "0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3)",
    "shadow.lg": "0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -4px rgba(0,0,0,0.3)",
    "shadow.xl": "0 20px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.4)",
  }},
  warm: { name: "Warm Earth", tokens: {
    ...DEFAULT_TOKENS,
    "brand.primary": "#d97706", "brand.primary.fg": "#ffffff",
    "brand.secondary": "#78716c", "brand.secondary.fg": "#ffffff",
    "brand.destructive": "#dc2626", "brand.success": "#16a34a",
    "bg.page": "#fefce8", "bg.card": "#ffffff", "bg.muted": "#fef3c7", "bg.subtle": "#fffbeb",
    "text.primary": "#292524", "text.secondary": "#78716c", "text.tertiary": "#a8a29e",
    "border.default": "#e7e5e4", "border.strong": "#d6d3d1", "border.focus": "#d97706",
  }},
  minimal: { name: "Minimal Mono", tokens: {
    ...DEFAULT_TOKENS,
    "brand.primary": "#18181b", "brand.primary.fg": "#ffffff",
    "brand.secondary": "#71717a", "brand.secondary.fg": "#ffffff",
    "brand.destructive": "#dc2626", "brand.success": "#16a34a",
    "bg.page": "#fafafa", "bg.card": "#ffffff", "bg.muted": "#f4f4f5", "bg.subtle": "#fafafa",
    "text.primary": "#09090b", "text.secondary": "#71717a", "text.tertiary": "#a1a1aa",
    "border.default": "#e4e4e7", "border.strong": "#d4d4d8", "border.focus": "#18181b",
  }},
  vibrant: { name: "Vibrant Pop", tokens: {
    ...DEFAULT_TOKENS,
    "brand.primary": "#7c3aed", "brand.primary.fg": "#ffffff",
    "brand.secondary": "#6366f1", "brand.secondary.fg": "#ffffff",
    "brand.destructive": "#f43f5e", "brand.success": "#10b981",
    "bg.page": "#faf5ff", "bg.card": "#ffffff", "bg.muted": "#f3e8ff", "bg.subtle": "#faf5ff",
    "text.primary": "#1e1b4b", "text.secondary": "#6366f1", "text.tertiary": "#a78bfa",
    "border.default": "#e9d5ff", "border.strong": "#c4b5fd", "border.focus": "#7c3aed",
  }},
  corporate: { name: "Corporate Blue", tokens: {
    ...DEFAULT_TOKENS,
    "brand.primary": "#1d4ed8", "brand.primary.fg": "#ffffff",
    "brand.secondary": "#475569", "brand.secondary.fg": "#ffffff",
    "brand.destructive": "#dc2626", "brand.success": "#059669",
    "bg.page": "#f8fafc", "bg.card": "#ffffff", "bg.muted": "#f1f5f9", "bg.subtle": "#f8fafc",
    "text.primary": "#0f172a", "text.secondary": "#475569", "text.tertiary": "#94a3b8",
    "border.default": "#e2e8f0", "border.strong": "#cbd5e1", "border.focus": "#1d4ed8",
  }},
  nature: { name: "Forest Green", tokens: {
    ...DEFAULT_TOKENS,
    "brand.primary": "#059669", "brand.primary.fg": "#ffffff",
    "brand.secondary": "#65a30d", "brand.secondary.fg": "#ffffff",
    "brand.destructive": "#dc2626", "brand.success": "#059669",
    "bg.page": "#f0fdf4", "bg.card": "#ffffff", "bg.muted": "#dcfce7", "bg.subtle": "#f0fdf4",
    "text.primary": "#14532d", "text.secondary": "#4d7c0f", "text.tertiary": "#86efac",
    "border.default": "#bbf7d0", "border.strong": "#86efac", "border.focus": "#059669",
  }},
  sunset: { name: "Sunset Rose", tokens: {
    ...DEFAULT_TOKENS,
    "brand.primary": "#e11d48", "brand.primary.fg": "#ffffff",
    "brand.secondary": "#f97316", "brand.secondary.fg": "#ffffff",
    "brand.destructive": "#b91c1c", "brand.success": "#059669",
    "bg.page": "#fff1f2", "bg.card": "#ffffff", "bg.muted": "#fce7f3", "bg.subtle": "#fff1f2",
    "text.primary": "#4c0519", "text.secondary": "#be123c", "text.tertiary": "#fda4af",
    "border.default": "#fecdd3", "border.strong": "#fda4af", "border.focus": "#e11d48",
  }},
};

/** Token groups for the system panel UI */
export const TOKEN_GROUPS = [
  {
    title: "Brand",
    keys: ["brand.primary", "brand.secondary", "brand.destructive", "brand.success"],
    type: "color" as const,
  },
  {
    title: "Backgrounds",
    keys: ["bg.page", "bg.card", "bg.muted", "bg.subtle"],
    type: "color" as const,
  },
  {
    title: "Text",
    keys: ["text.primary", "text.secondary", "text.tertiary"],
    type: "color" as const,
  },
  {
    title: "Border",
    keys: ["border.default", "border.strong", "border.focus"],
    type: "color" as const,
  },
  {
    title: "Typography",
    keys: ["font.sans", "font.heading", "font.mono"],
    type: "text" as const,
  },
  {
    title: "Type Scale",
    keys: ["text.xs", "text.sm", "text.base", "text.lg", "text.xl", "text.2xl", "text.3xl", "text.4xl", "text.5xl"],
    type: "text" as const,
  },
  {
    title: "Spacing",
    keys: ["spacing.xs", "spacing.sm", "spacing.md", "spacing.lg", "spacing.xl"],
    type: "text" as const,
  },
  {
    title: "Radius",
    keys: ["radius.sm", "radius.md", "radius.lg", "radius.xl"],
    type: "text" as const,
  },
];

/** Set of all built-in token keys — used to distinguish from custom tokens */
export const BUILT_IN_KEYS = new Set(Object.keys(DEFAULT_TOKENS));

/** Validate a custom token key: non-empty, contains dot, lowercase alphanumeric + dots only */
export function validateTokenKey(key: string): { valid: boolean; error?: string } {
  if (!key) return { valid: false, error: "Key is required" };
  if (!/^[a-z0-9]+(\.[a-z0-9]+)+$/.test(key)) return { valid: false, error: "Must be lowercase dot-path (e.g. brand.accent)" };
  return { valid: true };
}

/** Resolve a token path to its value */
export function resolveToken(
  value: unknown,
  tokens: Record<string, string>,
): string | undefined {
  if (typeof value !== "string") return undefined;
  if (tokens[value] !== undefined) return tokens[value];
  return value;
}
