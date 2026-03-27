// ============================================================
// Button — ComponentSpec template factory (Figma 3.0 audited)
// ============================================================
// Variants from Figma: primary (red), secondary (black),
// secondary-white, secondary-grey (outlined), ghost, icon-only
// Sizes: xs (32px), sm (40px), md (48px), lg (64px)
// Figma spec: KH Teka Regular for labels, radius.xxl (32px)
// ============================================================

import type { ComponentSpec, TokenRef } from "../../spec/types";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "secondary-white"
  | "secondary-grey"
  | "ghost"
  | "green"
  | "destructive"
  | "icon-only";

type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonStyleDef {
  bg: TokenRef | string;
  textColor: TokenRef | string;
  border?: { width: string; style: string; color: TokenRef | string };
}

// Figma 3.0 audited: 4·Component → color/button/
const VARIANT_STYLES: Record<ButtonVariant, ButtonStyleDef> = {
  primary: {
    bg: { token: "color.button-primary-bg" },
    textColor: { token: "color.content-inverse" },
  },
  secondary: {
    bg: { token: "color.button-secondary-black-bg" },
    textColor: { token: "color.content-inverse" },
  },
  "secondary-white": {
    bg: { token: "color.surface-raised" },
    textColor: { token: "color.content-primary" },
  },
  "secondary-grey": {
    bg: "transparent",
    textColor: { token: "color.content-primary" },
    border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
  },
  ghost: {
    bg: "transparent",
    textColor: { token: "color.content-brand" },
  },
  green: {
    bg: { token: "color.button-green" },
    textColor: { token: "color.content-inverse" },
  },
  destructive: {
    bg: { token: "color.button-primary-bg" },
    textColor: { token: "color.content-inverse" },
  },
  "icon-only": {
    bg: { token: "color.surface-default" },
    textColor: { token: "color.content-primary" },
  },
};

// Figma 3.0: button heights — lg=64px, md=48px, sm=40px, xs=32px
const SIZE_HEIGHT: Record<ButtonSize, TokenRef> = {
  xs: { token: "height.sm" },  // 32px
  sm: { token: "height.md" },  // 40px
  md: { token: "height.lg" },  // 48px
  lg: { token: "height.xxl" }, // 64px
};

// Figma 3.0: label text style per size — KH Teka Regular (weight 400)
const SIZE_TEXT_STYLE: Record<ButtonSize, "label-xs" | "label-sm" | "label-md" | "label-lg" | "label-xl"> = {
  xs: "label-sm",  // 14px
  sm: "label-md",  // 16px
  md: "label-lg",  // 18px
  lg: "label-xl",  // 20px
};

export function buttonTemplate(props?: Record<string, unknown>): ComponentSpec {
  const variant = ((props?.variant as string) ?? "primary") as ButtonVariant;
  const size = ((props?.size as string) ?? "lg") as ButtonSize;
  const label = (props?.label as string) ?? (props?.text as string) ?? "Label";
  const fullWidth = props?.fullWidth !== false;
  const iconSvg = props?.iconSvg as string | undefined;
  const iconPosition = (props?.iconPosition as string) ?? "left";

  const vs = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
  const isIconOnly = variant === "icon-only";

  const children: ComponentSpec[] = [];

  // Icon left
  if (iconSvg && iconPosition === "left" && !isIconOnly) {
    children.push({
      key: "btn-icon-left",
      tag: "div",
      layout: { display: "inline-flex" },
      style: {},
      data: { innerHTML: iconSvg },
    });
  }

  // Label or icon-only
  if (isIconOnly && iconSvg) {
    children.push({
      key: "btn-icon",
      tag: "div",
      layout: { display: "inline-flex" },
      style: {},
      data: { innerHTML: iconSvg },
    });
  } else {
    children.push({
      key: "btn-label",
      tag: "span",
      layout: { display: "inline-flex" },
      style: {},
      text: {
        content: label,
        style: SIZE_TEXT_STYLE[size],
        weight: 400, // Figma: KH Teka Regular
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
      layout: { display: "inline-flex" },
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
      height: SIZE_HEIGHT[size],
      width: fullWidth ? "100%" : undefined,
      padding: isIconOnly
        ? { all: { token: "spacing.xs" } }
        : { x: { token: "spacing.xxl" } },
      borderRadius: { token: "radius.xxl" }, // Figma: 32px
      boxSizing: "border-box",
    },
    style: {
      background: vs.bg,
      cursor: "pointer",
      border: vs.border,
    },
    interactive: { type: "button" },
    data: { component: "button" },
    children,
  };
}
