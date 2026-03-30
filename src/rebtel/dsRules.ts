// ============================================================
// Design System Rules — Governs how drawn shapes become components
// ============================================================
// Used by inference.ts when converting freehand-drawn rectangles
// into component specs. Ensures drawn components use the same
// token system as toolbar-dropped ones.
// ============================================================

export const DS_RULES = {
  // ── Spacing ───────────────────────────────────────────────
  // All spacing in Aphantasia snaps to the Rebtel spacing scale.
  // When a user draws a gap or padding, round to nearest token.
  spacingScale: [0, 2, 4, 8, 12, 16, 20, 24, 32, 52, 72],
  spacingTokens: {
    0: "spacing.none",
    2: "spacing.xxxs",
    4: "spacing.xxs",
    8: "spacing.xs",
    12: "spacing.sm",
    16: "spacing.md",
    20: "spacing.lg",
    24: "spacing.xl",
    32: "spacing.xxl",
    52: "spacing.xxxl",
    72: "spacing.xxxxl",
  },

  // ── Heights ───────────────────────────────────────────────
  // Standard object heights. Drawn shapes snap to these.
  heightScale: [24, 32, 40, 48, 52, 64, 72],
  heightTokens: {
    24: "height.xs",
    32: "height.sm",
    40: "height.md",
    48: "height.lg",
    52: "height.xl",
    64: "height.xxl",
    72: "height.xxxl",
  },

  // ── Border Radius ─────────────────────────────────────────
  radiusScale: [0, 4, 8, 12, 16, 24, 32, 9999],
  radiusTokens: {
    0: "radius.none",
    4: "radius.xs",
    8: "radius.sm",
    12: "radius.md",
    16: "radius.lg",
    24: "radius.xl",
    32: "radius.xxl",
    9999: "radius.full",
  },

  // ── Component Inference Rules ─────────────────────────────
  // When a user draws a shape, use these rules to determine
  // which tokens to apply based on inferred component type.
  componentDefaults: {
    button: {
      height: "height.xxl",       // 64px (lg default)
      borderRadius: "radius.xxl", // 32px (pill)
      paddingX: "spacing.xxl",    // 32px
      gap: "spacing.xs",          // 8px
      textStyle: "label-xl" as const,
      fullWidth: true,
    },
    card: {
      borderRadius: "radius.lg",  // 16px
      padding: "spacing.md",      // 16px
      gap: "spacing.sm",          // 12px
      border: "color.border-default",
      background: "color.surface-primary",
    },
    input: {
      height: "height.xl",        // 52px
      borderRadius: "radius.sm",  // 8px
      padding: "spacing.sm",      // 12px
      border: "color.border-default",
      background: "color.surface-primary",
      textStyle: "paragraph-md" as const,
      labelStyle: "label-sm" as const,
    },
    sheet: {
      borderRadius: "radius.xl",  // 24px (top corners only)
      padding: "spacing.lg",      // 20px
      background: "color.surface-primary",
      handleWidth: 36,
      handleHeight: 4,
    },
    bar: {
      height: "height.lg",        // 48px (nav row)
      paddingX: "spacing.md",     // 16px
      background: "color.surface-primary",
    },
    divider: {
      height: 1,
      background: "color.border-default",
    },
    row: {
      height: "height.xl",        // 52px
      paddingX: "spacing.md",     // 16px
      border: "color.border-default",
    },
  },

  // ── Typography Rules ──────────────────────────────────────
  // Which text style to use based on context
  textStyleRules: {
    buttonLabel: { xs: "label-sm", sm: "label-md", md: "label-md", lg: "label-xl" } as const,
    cardTitle: "headline-xs" as const,
    cardBody: "paragraph-sm" as const,
    inputLabel: "label-sm" as const,
    inputPlaceholder: "paragraph-md" as const,
    navTitle: "label-lg" as const,
    sheetTitle: "headline-sm" as const,
    price: "display-md" as const,
  },

  // ── Colour Assignment Rules ───────────────────────────────
  // When a drawn shape becomes a component, assign colours
  colorRules: {
    primaryAction: "color.surface-button-primary",
    secondaryAction: "color.surface-button-secondary-black",
    surface: "color.surface-primary",
    surfaceSubtle: "color.surface-neutral",
    textPrimary: "color.text-primary",
    textSecondary: "color.text-secondary",
    textTertiary: "color.text-tertiary",
    textOnPrimary: "color.text-white-constant",
    border: "color.border-default",
    success: "color.success",
    error: "color.brand-red",
  },
} as const;

// ── Snap Helpers ──────────────────────────────────────────

/** Snap a pixel value to the nearest spacing token */
export function snapToSpacing(px: number): { value: number; token: string } {
  const scale = DS_RULES.spacingScale as readonly number[];
  let closest = scale[0];
  for (const s of scale) {
    if (Math.abs(s - px) < Math.abs(closest - px)) closest = s;
  }
  return {
    value: closest,
    token: (DS_RULES.spacingTokens as Record<number, string>)[closest] ?? `${closest}px`,
  };
}

/** Snap a pixel value to the nearest height token */
export function snapToHeight(px: number): { value: number; token: string } {
  const scale = DS_RULES.heightScale as readonly number[];
  let closest = scale[0];
  for (const s of scale) {
    if (Math.abs(s - px) < Math.abs(closest - px)) closest = s;
  }
  return {
    value: closest,
    token: (DS_RULES.heightTokens as Record<number, string>)[closest] ?? `${closest}px`,
  };
}

/** Snap a pixel value to the nearest radius token */
export function snapToRadius(px: number): { value: number; token: string } {
  const scale = DS_RULES.radiusScale as readonly number[];
  let closest = scale[0];
  for (const s of scale) {
    if (Math.abs(s - px) < Math.abs(closest - px)) closest = s;
  }
  return {
    value: closest,
    token: (DS_RULES.radiusTokens as Record<number, string>)[closest] ?? `${closest}px`,
  };
}
