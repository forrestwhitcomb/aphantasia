// ============================================================
// Button — Pixel-perfect from Figma 3.0
// ============================================================
// Figma source: Component Set with Color × Size × State axes
// All values: exact px from figma_get_component_for_development_deep
// Font: KH Teka Regular (weight 400), letter-spacing 0.02em
// Border radius: 32px (all sizes)
// ============================================================

import type { ComponentSpec, BorderSpec, TokenRef } from "../../spec/types";

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
  bg: TokenRef | string;
  textColor: TokenRef | string;
  border?: BorderSpec;
}

// Figma 3.0: token references from design system
const VARIANT_STYLES: Record<string, VariantStyle> = {
  primary:          { bg: { token: "color.surface-button-primary" }, textColor: { token: "color.text-white-constant" } },
  secondary:        { bg: { token: "color.surface-button-secondary-black" }, textColor: { token: "color.text-white-constant" } },
  "secondary-white": { bg: { token: "color.surface-button-secondary-white" }, textColor: { token: "color.text-primary" } },
  "secondary-grey": { bg: { token: "color.surface-button-secondary-grey" }, textColor: { token: "color.text-primary" }, border: { width: "1px", style: "solid", color: { token: "color.border-default" } } },
  outlined:         { bg: "transparent", textColor: { token: "color.text-primary" }, border: { width: "1px", style: "solid", color: { token: "color.border-default" } } },
  ghost:            { bg: "transparent", textColor: { token: "color.brand-red" } },
  green:            { bg: { token: "color.success" }, textColor: { token: "color.text-white-constant" } },
  destructive:      { bg: { token: "color.surface-button-primary" }, textColor: { token: "color.text-white-constant" } },
  "icon-only":      { bg: { token: "color.surface-button-secondary-grey" }, textColor: { token: "color.text-primary" } },
  red:              { bg: { token: "color.surface-button-primary" }, textColor: { token: "color.text-white-constant" } },
  white:            { bg: { token: "color.surface-button-secondary-white" }, textColor: { token: "color.text-primary" } },
  black:            { bg: { token: "color.surface-button-secondary-black" }, textColor: { token: "color.text-white-constant" } },
  dropdown:         { bg: { token: "color.surface-button-secondary-grey" }, textColor: { token: "color.text-primary" }, border: { width: "1px", style: "solid", color: { token: "color.border-default" } } },
  borderless:       { bg: "transparent", textColor: { token: "color.brand-red" } },
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

// Figma 3.0 horizontal padding per size — token refs
const SIZE_PADDING: Record<ButtonSize, TokenRef> = {
  xs: { token: "spacing.md" },
  sm: { token: "spacing.xl" },
  md: { token: "spacing.xl" },
  lg: { token: "spacing.xxl" },
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
  const px = SIZE_PADDING[size] ?? SIZE_PADDING.lg;

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
      gap: { token: "spacing.xs" },
      height: h,
      width: fullWidth ? "100%" : undefined,
      padding: isIconOnly
        ? { all: { token: "spacing.xs" } }
        : { left: px, right: px },
      borderRadius: { token: "radius.xxl" },
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
