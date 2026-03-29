// ============================================================
// Button — Pixel-perfect from Figma 3.0
// ============================================================
// Figma source: Component Set with Color × Size × State axes
// All values: exact px from figma_get_component_for_development_deep
// Font: KH Teka Regular (weight 400), letter-spacing 0.02em
// Border radius: 32px (all sizes)
// ============================================================

import type { ComponentSpec, BorderSpec } from "../../spec/types";

type ButtonVariant =
  | "primary"       // red bg, white text
  | "secondary"     // black bg, white text
  | "secondary-white" // white bg, black text
  | "secondary-grey"  // grey bg, black text, grey border
  | "outlined"      // transparent bg, border, black text
  | "ghost"         // transparent bg, brand text
  | "green"         // green bg, white text
  | "destructive"   // red bg, white text (same as primary)
  | "icon-only"     // grey bg, black icon
  | "red"           // alias for primary
  | "white"         // alias for secondary-white
  | "black"         // alias for secondary
  | "dropdown"      // grey bg + border, used for selectors
  | "borderless";   // ghost alias

type ButtonSize = "xs" | "sm" | "md" | "lg";

interface VariantStyle {
  bg: string;
  textColor: string;
  border?: BorderSpec;
}

// Figma 3.0: exact hex values from component boundVariables (resolved)
const VARIANT_STYLES: Record<string, VariantStyle> = {
  primary:          { bg: "#E31B3B", textColor: "#FFFFFF" },
  secondary:        { bg: "#111111", textColor: "#FFFFFF" },
  "secondary-white": { bg: "#FFFFFF", textColor: "#111111" },
  "secondary-grey": { bg: "#F3F3F3", textColor: "#111111", border: { width: "1px", style: "solid", color: "#DCDCE1" } },
  outlined:         { bg: "transparent", textColor: "#2D2D32", border: { width: "1px", style: "solid", color: "#DCDCE1" } },
  ghost:            { bg: "transparent", textColor: "#E31B3B" },
  green:            { bg: "#09BC09", textColor: "#FFFFFF" },
  destructive:      { bg: "#E31B3B", textColor: "#FFFFFF" },
  "icon-only":      { bg: "#F3F3F3", textColor: "#111111" },
  red:              { bg: "#E31B3B", textColor: "#FFFFFF" },
  white:            { bg: "#FFFFFF", textColor: "#111111" },
  black:            { bg: "#111111", textColor: "#FFFFFF" },
  dropdown:         { bg: "#F3F3F3", textColor: "#111111", border: { width: "1px", style: "solid", color: "#DCDCE1" } },
  borderless:       { bg: "transparent", textColor: "#E31B3B" },
};

// Figma 3.0 exact heights: xs=32, sm=40, md=52, lg=64
const SIZE_HEIGHT: Record<ButtonSize, number> = {
  xs: 32,
  sm: 40,
  md: 52,
  lg: 64,
};

// Figma 3.0 exact font sizes per size: xs=14, sm=16, md=16, lg=20
const SIZE_FONT: Record<ButtonSize, { style: "label-sm" | "label-md" | "label-lg" | "label-xl"; size: number }> = {
  xs: { style: "label-sm", size: 14 },
  sm: { style: "label-md", size: 16 },
  md: { style: "label-md", size: 16 },
  lg: { style: "label-xl", size: 20 },
};

// Figma 3.0 exact horizontal padding per size
const SIZE_PADDING: Record<ButtonSize, number> = {
  xs: 16,
  sm: 24,
  md: 24,
  lg: 32,
};

export function buttonTemplate(props?: Record<string, unknown>): ComponentSpec {
  const variant = (props?.variant as string) ?? "primary";
  const size = ((props?.size as string) ?? "lg") as ButtonSize;
  const label = (props?.label as string) ?? (props?.text as string) ?? "Label";
  const fullWidth = props?.fullWidth !== false;
  const iconSvg = props?.iconSvg as string | undefined;
  const iconPosition = (props?.iconPosition as string) ?? "left";

  const vs = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
  const isIconOnly = variant === "icon-only";
  const h = SIZE_HEIGHT[size] ?? 64;
  const font = SIZE_FONT[size] ?? SIZE_FONT.lg;
  const px = SIZE_PADDING[size] ?? 32;

  const children: ComponentSpec[] = [];

  // Icon left
  if (iconSvg && iconPosition === "left" && !isIconOnly) {
    children.push({
      key: "btn-icon-left",
      tag: "div",
      layout: { display: "flex", align: "center", justify: "center", width: 24, height: 24, overflow: "hidden", flexShrink: 0 },
      style: {},
      data: { innerHTML: iconSvg },
    });
  }

  // Label or icon-only
  if (isIconOnly && iconSvg) {
    children.push({
      key: "btn-icon",
      tag: "div",
      layout: { display: "flex", align: "center", justify: "center", width: 24, height: 24, overflow: "hidden" },
      style: {},
      data: { innerHTML: iconSvg },
    });
  } else {
    children.push({
      key: "btn-label",
      tag: "span",
      layout: { display: "inline-flex" },
      style: { letterSpacing: "0.02em", lineHeight: `${font.size}px` },
      text: {
        content: label,
        style: font.style,
        weight: 400,
        color: vs.textColor,
        editable: true,
      },
    });
  }

  // Icon right
  if (iconSvg && iconPosition === "right" && !isIconOnly) {
    children.push({
      key: "btn-icon-right",
      tag: "div",
      layout: { display: "flex", align: "center", justify: "center", width: 24, height: 24, overflow: "hidden", flexShrink: 0 },
      style: {},
      data: { innerHTML: iconSvg },
    });
  }

  return {
    key: "button",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      gap: "8px",
      height: h,
      width: fullWidth ? "100%" : undefined,
      padding: isIconOnly
        ? { all: "8px" }
        : { left: `${px}px`, right: `${px}px` },
      borderRadius: "32px",
      boxSizing: "border-box",
    },
    style: {
      background: vs.bg,
      cursor: "pointer",
      border: vs.border,
      fontFamily: "'KH Teka'",
      fontSize: font.size,
      color: vs.textColor,
      letterSpacing: "0.02em",
      lineHeight: `${font.size}px`,
    },
    interactive: { type: "button" },
    data: { component: "button" },
    children,
  };
}
