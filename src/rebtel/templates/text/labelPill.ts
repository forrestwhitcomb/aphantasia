// ============================================================
// Label Pill — Figma-verified from node 165:19579
// ============================================================
// Variants: Purple, Red, Black, White
// Size: 24px height, hug width, padding 8px, gap 4px, radius 4px
// Font: KH Teka 14px regular, letter-spacing 0.02em, line-height 14px
// Icon: Optional 12×12 star
// ============================================================

import type { ComponentSpec, TokenRef, BorderSpec } from "../../spec/types";

const ICON_STAR_WHITE = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.545 3.13L11 4.635 8.5 7.07l.59 3.43L6 8.885 2.91 10.5l.59-3.43L1 4.635l3.455-.505L6 1z" fill="#FFFFFF"/></svg>`;
const ICON_STAR_GREY = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.545 3.13L11 4.635 8.5 7.07l.59 3.43L6 8.885 2.91 10.5l.59-3.43L1 4.635l3.455-.505L6 1z" fill="#737378"/></svg>`;

interface VariantStyle {
  bg: TokenRef | string;
  textColor: TokenRef | string;
  iconSvg: string;
  border?: BorderSpec;
}

const VARIANT_STYLES: Record<string, VariantStyle> = {
  purple: {
    bg: { token: "color.feedback-label-purple" },
    textColor: { token: "color.text-white-constant" },
    iconSvg: ICON_STAR_WHITE,
  },
  red: {
    bg: { token: "color.surface-button-primary" },
    textColor: { token: "color.text-white-constant" },
    iconSvg: ICON_STAR_WHITE,
  },
  dark: {
    bg: { token: "color.feedback-label-dark" },
    textColor: { token: "color.text-white-constant" },
    iconSvg: ICON_STAR_WHITE,
  },
  white: {
    bg: { token: "color.surface-primary" },
    textColor: { token: "color.text-secondary" },
    iconSvg: ICON_STAR_GREY,
    border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
  },
};

export function labelPillTemplate(props?: Record<string, unknown>): ComponentSpec {
  const label = (props?.label as string) ?? (props?.content as string) ?? "Label";
  const variant = (props?.variant as string) ?? "dark";
  const showIcon = (props?.showIcon as boolean) ?? false;

  const vs = VARIANT_STYLES[variant] ?? VARIANT_STYLES.dark;
  const children: ComponentSpec[] = [];

  if (showIcon) {
    children.push({
      key: "pill-icon",
      tag: "div",
      layout: { display: "flex", align: "center", justify: "center", width: 12, height: 12, flexShrink: 0 },
      style: {},
      data: { innerHTML: vs.iconSvg },
    });
  }

  children.push({
    key: "pill-label",
    tag: "span",
    layout: { display: "inline-flex" },
    style: { letterSpacing: "0.02em", lineHeight: "14px" },
    text: {
      content: label,
      style: "label-sm",
      weight: 400,
      color: vs.textColor,
      editable: true,
    },
  });

  return {
    key: "label-pill",
    tag: "div",
    layout: {
      display: "inline-flex",
      align: "center",
      justify: "center",
      height: 24,
      padding: { x: "8px" },
      gap: "4px",
      borderRadius: "4px",
      overflow: "hidden",
    },
    style: {
      background: vs.bg,
      border: vs.border,
      fontFamily: "'KH Teka'",
      fontSize: "14px",
      letterSpacing: "0.02em",
      lineHeight: "14px",
    },
    data: { component: "labelPill" },
    children,
  };
}
