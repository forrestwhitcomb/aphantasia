// ============================================================
// Smart Inference — drawn shape → primitive type
// ============================================================
// When a user draws a rectangle on canvas, infer what primitive
// it should be based on position, size, and label.
// ============================================================

import type { PrimitiveType } from "./types";
import { DEFAULT_TEMPLATE } from "./primitives";

interface ShapeRect {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

/**
 * Infer a primitive type + template from a drawn shape's geometry and label.
 * Returns null if no confident inference can be made.
 */
export function drawnShapeToPrimitive(
  shape: ShapeRect,
  frameWidth: number,
  frameHeight: number,
): { primitive: PrimitiveType; template: string } | null {
  const { x, y, width, height, label } = shape;
  const isFullWidth = width >= frameWidth * 0.8;
  const relY = y / frameHeight;

  // ── Label-based inference (highest priority) ───────────────
  if (label) {
    const l = label.toLowerCase().trim();

    // Navigation
    if (/^(app\s*bar|header|nav\s*bar)$/i.test(l))
      return { primitive: "bar", template: "app-bar" };
    if (/^(tab\s*bar|bottom\s*nav)$/i.test(l))
      return { primitive: "bar", template: "tab-bar" };
    if (/^(step|stepper|progress)$/i.test(l))
      return { primitive: "bar", template: "stepper" };

    // Inputs
    if (/^(search|search\s*bar)$/i.test(l))
      return { primitive: "input", template: "search" };
    if (/^(phone|phone\s*input)$/i.test(l))
      return { primitive: "input", template: "phone" };
    if (/^(pin|otp|code)$/i.test(l))
      return { primitive: "input", template: "pin" };
    if (/^(input|text\s*field|form)$/i.test(l))
      return { primitive: "input", template: "text-field" };

    // Buttons
    if (/^(button|btn|cta)$/i.test(l))
      return { primitive: "button", template: "primary" };

    // Selectors
    if (/^(tabs?|segment|selector)$/i.test(l))
      return { primitive: "selector", template: "segmented" };

    // Feedback
    if (/^(success|done|confirmed)$/i.test(l))
      return { primitive: "status", template: "success" };
    if (/^(error|alert|warning)$/i.test(l))
      return { primitive: "status", template: "error-banner" };
    if (/^(loading|skeleton)$/i.test(l))
      return { primitive: "status", template: "loading" };

    // Sheets
    if (/^(sheet|bottom\s*sheet|modal|dialog)$/i.test(l))
      return { primitive: "sheet", template: "action-sheet" };

    // Text
    if (/^(text|title|heading|label)$/i.test(l))
      return { primitive: "text", template: "paragraph-md" };

    // Divider
    if (/^(divider|separator|line|hr)$/i.test(l))
      return { primitive: "divider", template: "default" };
  }

  // ── Geometry-based inference ────────────────────────────────

  // Hairline → divider
  if (isFullWidth && height <= 2) {
    return { primitive: "divider", template: "default" };
  }

  // Wide strip at top → app bar
  if (isFullWidth && relY < 0.12 && height < 60) {
    return { primitive: "bar", template: "app-bar" };
  }

  // Wide strip at bottom → tab bar
  if (isFullWidth && relY > 0.85 && height < 80) {
    return { primitive: "bar", template: "tab-bar" };
  }

  // Small pill (button-like)
  if (height >= 32 && height <= 56 && width < frameWidth * 0.6 && width > 60) {
    return { primitive: "button", template: "primary" };
  }

  // Full-width medium strip → row
  if (isFullWidth && height >= 40 && height <= 64) {
    return { primitive: "row", template: "simple" };
  }

  // Full-width, bottom-anchored, tall → sheet
  if (isFullWidth && relY > 0.6 && height > 150) {
    return { primitive: "sheet", template: "action-sheet" };
  }

  // Small square-ish → media
  if (width < 80 && height < 80 && Math.abs(width - height) < 20) {
    return { primitive: "media", template: "image" };
  }

  // Full-width tall → card
  if (isFullWidth && height > 100) {
    return { primitive: "card", template: "blank" };
  }

  // Default: card
  if (width > 100 && height > 60) {
    return { primitive: "card", template: "blank" };
  }

  return null;
}
