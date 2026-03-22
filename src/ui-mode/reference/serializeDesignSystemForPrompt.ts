import type { UIDesignSystem } from "../types";

/**
 * Compact JSON description of the effective design system for Layer 2 —
 * enough for the model to respect tokens when applying note-driven overrides.
 */
export function serializeDesignSystemForPrompt(ds: UIDesignSystem): string {
  const payload = {
    name: ds.name,
    confidence: ds.confidence,
    fonts: ds.fonts,
    fontSizes: ds.fontSizes,
    colors: ds.colors,
    spacing: ds.spacing,
    radii: ds.radii,
    shadows: ds.shadows,
    components: ds.components,
  };
  return JSON.stringify(payload, null, 0);
}
