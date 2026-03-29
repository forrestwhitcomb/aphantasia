// ============================================================
// Figma Text Properties → TextStyleToken Mapper
// ============================================================
// Maps Figma TEXT node font properties to the 19 TextStyleToken
// values used in ComponentSpec. Uses TEXT_STYLE_MAP definitions
// as reference for size/weight thresholds.
// ============================================================

import type { TextStyleToken } from "../spec/types";

// Font family detection: Pano = display, KH Teka = body/headline/label
const DISPLAY_FAMILIES = ["Pano", "pano"];
const BODY_FAMILIES = ["KH Teka", "kh teka", "KHTeka"];

function isDisplayFont(fontFamily: string): boolean {
  return DISPLAY_FAMILIES.some((f) =>
    fontFamily.toLowerCase().includes(f.toLowerCase()),
  );
}

/**
 * Map Figma TEXT node font properties to a TextStyleToken.
 *
 * Decision tree:
 * 1. Pano font → display-{lg|md|sm|xs} by fontSize
 * 2. KH Teka weight >= 600 → headline-{lg|md|sm|xs} by fontSize
 * 3. KH Teka weight >= 500 → label-{xl|lg|md|sm|xs} by fontSize
 * 4. KH Teka weight < 500 → paragraph-{xl|lg|md|sm|xs} by fontSize
 */
export function figmaTextToStyleToken(
  fontFamily: string,
  fontSize: number,
  fontWeight: number,
): TextStyleToken {
  // Display tokens (Pano font)
  if (isDisplayFont(fontFamily)) {
    if (fontSize >= 28) return "display-lg"; // 32px
    if (fontSize >= 22) return "display-md"; // 24px
    if (fontSize >= 18) return "display-sm"; // 20px
    return "display-xs"; // 16px
  }

  // Headline tokens (bold KH Teka: weight 600-700)
  if (fontWeight >= 600) {
    if (fontSize >= 28) return "headline-lg"; // 32px
    if (fontSize >= 22) return "headline-md"; // 24px
    if (fontSize >= 18) return "headline-sm"; // 20px
    return "headline-xs"; // 16px
  }

  // Label tokens (medium KH Teka: weight 500)
  if (fontWeight >= 500) {
    if (fontSize >= 19) return "label-xl"; // 20px
    if (fontSize >= 17) return "label-lg"; // 18px
    if (fontSize >= 15) return "label-md"; // 16px
    if (fontSize >= 13) return "label-sm"; // 14px
    return "label-xs"; // 11px
  }

  // Paragraph tokens (regular KH Teka: weight 400)
  if (fontSize >= 19) return "paragraph-xl"; // 20px
  if (fontSize >= 17) return "paragraph-lg"; // 18px
  if (fontSize >= 15) return "paragraph-md"; // 16px
  if (fontSize >= 13) return "paragraph-sm"; // 14px
  return "paragraph-xs"; // 12px
}
