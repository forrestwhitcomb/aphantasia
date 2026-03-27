// ============================================================
// Button — ComponentSpec template factory
// ============================================================
// All button variants: primary, secondary-white, secondary-grey,
// ghost, green, destructive, icon-only
// Sizes: sm (32px), md (40px), lg (48px)
// ============================================================

import type { ComponentSpec, TokenRef } from "../../spec/types";

type ButtonVariant =
  | "primary"
  | "secondary-white"
  | "secondary-grey"
  | "ghost"
  | "green"
  | "destructive"
  | "icon-only";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonStyleDef {
  bg: TokenRef | string;
  textColor: TokenRef | string;
  border?: { width: string; style: string; color: TokenRef | string };
}

const VARIANT_STYLES: Record<ButtonVariant, ButtonStyleDef> = {
  primary: {
    bg: { token: "color.button-primary" },
    textColor: { token: "color.text-on-brand" },
  },
  destructive: {
    bg: { token: "color.button-primary" },
    textColor: { token: "color.text-on-brand" },
  },
  "secondary-white": {
    bg: { token: "color.button-secondary-white" },
    textColor: { token: "color.text-primary" },
    border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
  },
  "secondary-grey": {
    bg: { token: "color.button-secondary-grey" },
    textColor: { token: "color.text-primary" },
  },
  ghost: {
    bg: "transparent",
    textColor: { token: "color.brand-red" },
  },
  green: {
    bg: { token: "color.button-green" },
    textColor: { token: "color.text-on-brand" },
  },
  "icon-only": {
    bg: { token: "color.surface-light" },
    textColor: { token: "color.icon-default" },
  },
};

const SIZE_HEIGHT: Record<ButtonSize, TokenRef> = {
  sm: { token: "height.sm" },
  md: { token: "height.md" },
  lg: { token: "height.lg" },
};

export function buttonTemplate(props?: Record<string, unknown>): ComponentSpec {
  const variant = ((props?.variant as string) ?? "primary") as ButtonVariant;
  const size = ((props?.size as string) ?? "lg") as ButtonSize;
  const label = (props?.label as string) ?? (props?.text as string) ?? "Button";
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
        style: size === "sm" ? "label-sm" : "label-md",
        weight: 600,
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
        : { x: { token: "spacing.xl" } },
      borderRadius: { token: "radius.full" },
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
