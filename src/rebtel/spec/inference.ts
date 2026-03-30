// ============================================================
// Smart Inference — drawn shape → primitive type
// ============================================================
// When a user draws a rectangle on canvas, infer what primitive
// it should be based on position, size, and label.
// Uses DS_RULES for snapping drawn dimensions to token values.
// ============================================================

import type { PrimitiveType } from "./types";
import { DEFAULT_TEMPLATE } from "./primitives";
import { DS_RULES, snapToHeight, snapToSpacing, snapToRadius } from "../dsRules";

interface ShapeRect {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  type?: string;
}

/**
 * Infer a primitive type + template from a drawn shape's geometry and label.
 * Returns null if no confident inference can be made.
 */
export function drawnShapeToPrimitive(
  shape: ShapeRect,
  frameWidth: number,
  frameHeight: number,
  parentPrimitive?: string,
): { primitive: PrimitiveType; template: string } | null {
  const { x, y, width, height, label } = shape;
  const isFullWidth = width >= frameWidth * 0.8;
  const relY = y / frameHeight;

  // ── Text tool shapes → always text ─────────────────────────
  if (shape.type === "text")
    return { primitive: "text", template: "body-text" };

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

  // ── Nested inference (when inside a parent component) ──────
  if (parentPrimitive) {
    // Thin line → divider
    if (height <= 3 && width > 50)
      return { primitive: "divider", template: "default" };

    // Standard button height range
    if (height >= 32 && height <= 72 && width > 60)
      return { primitive: "button", template: "primary" };

    // Input-like (wider, medium height)
    if (height >= 40 && height <= 60 && width > 150)
      return { primitive: "input", template: "text-field" };

    // Small square → icon/media placeholder
    if (width < 60 && height < 60 && Math.abs(width - height) < 15)
      return { primitive: "media", template: "image" };

    // Default nested shape → button
    return { primitive: "button", template: "primary" };
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

// ── DS Rules Integration ──────────────────────────────────

type ComponentType = keyof typeof DS_RULES.componentDefaults;

/**
 * Get design system defaults for an inferred component type.
 * Returns token paths for height, radius, padding, gap, text style, etc.
 */
export function getComponentDefaults(primitive: PrimitiveType): typeof DS_RULES.componentDefaults[ComponentType] | null {
  const map: Partial<Record<PrimitiveType, ComponentType>> = {
    button: "button",
    card: "card",
    input: "input",
    sheet: "sheet",
    bar: "bar",
    divider: "divider",
    row: "row",
  };
  const key = map[primitive];
  return key ? DS_RULES.componentDefaults[key] : null;
}

/**
 * Snap a drawn shape's raw pixel dimensions to the nearest design system tokens.
 * Returns token-aware overrides that can be applied to a resolved template spec.
 */
export function snapShapeDimensions(shape: { width: number; height: number }): {
  height: { value: number; token: string };
  borderRadius: { value: number; token: string };
  paddingX: { value: number; token: string };
} {
  return {
    height: snapToHeight(shape.height),
    borderRadius: snapToRadius(Math.min(shape.height / 2, 32)),
    paddingX: snapToSpacing(Math.max(12, Math.round(shape.width * 0.08))),
  };
}
