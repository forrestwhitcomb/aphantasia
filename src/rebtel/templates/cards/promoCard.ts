// ============================================================
// Promo Card — Pixel-perfect from Figma 3.0
// ============================================================
// Container: width 100%, radius 16px, padding 16px,
//   vertical flex, gap 12px
// May have gradient background or brand color
// Title: display or headline text
// Subtitle: paragraph text
// CTA button
// ============================================================

import type { ComponentSpec } from "../../spec/types";

export function promoCardTemplate(props?: Record<string, unknown>): ComponentSpec {
  const badge1 = (props?.badge1 as string) ?? "Welcome offer";
  const badge2 = (props?.badge2 as string) ?? "Subscription";
  const headline = (props?.headline as string) ?? (props?.label as string) ?? "Get started with 7 days of free unlimited calls to USA";
  const description = (props?.description as string) ?? "Then just $12/month. No contract, just connection. Cancel anytime.";
  const ctaLabel = (props?.ctaLabel as string) ?? "Start free trial";
  const bg = (props?.background as string) ?? "#111111";

  return {
    key: "promo-card",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: { token: "spacing.sm" },
      width: "100%",
      padding: { all: { token: "spacing.md" } },
      borderRadius: { token: "radius.lg" },
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
    },
    style: {
      background: bg,
      fontFamily: "'KH Teka'",
    },
    data: { component: "promoCard" },
    children: [
      // Badges row
      {
        key: "badges",
        tag: "div",
        layout: { display: "flex", gap: { token: "spacing.xs" } },
        style: {},
        children: [
          {
            key: "badge1",
            tag: "span",
            layout: {
              display: "inline-flex",
              padding: { top: "4px", bottom: "4px", left: "8px", right: "8px" },
              borderRadius: { token: "radius.xs" },
            },
            style: { background: "#2DD4BF" },
            text: {
              content: badge1,
              style: "label-xs",
              weight: 700,
              color: { token: "color.text-primary" },
              editable: true,
            },
          },
          {
            key: "badge2",
            tag: "span",
            layout: {
              display: "inline-flex",
              padding: { top: "4px", bottom: "4px", left: "8px", right: "8px" },
              borderRadius: { token: "radius.xs" },
            },
            style: { background: "#2D2D32" },
            text: {
              content: badge2,
              style: "label-xs",
              weight: 700,
              color: { token: "color.text-white-constant" },
              editable: true,
            },
          },
        ],
      },
      // Headline: KH Teka 20px weight 700, white
      {
        key: "headline",
        tag: "div",
        layout: { display: "block", maxWidth: "65%" },
        style: {
          fontFamily: "'KH Teka'",
          fontSize: 20,
          letterSpacing: "0.02em",
          lineHeight: "26px",
        },
        text: {
          content: headline,
          style: "headline-xs",
          weight: 700,
          color: { token: "color.text-white-constant" },
          editable: true,
        },
      },
      // Description: KH Teka 14px, grey-400
      {
        key: "description",
        tag: "div",
        layout: { display: "block", maxWidth: "60%" },
        style: {
          fontFamily: "'KH Teka'",
          fontSize: 14,
          letterSpacing: "0.02em",
          lineHeight: "18px",
        },
        text: {
          content: description,
          style: "paragraph-sm",
          weight: 400,
          color: { token: "color.text-tertiary" },
          editable: true,
        },
      },
      // CTA button: red bg, white text, pill shape
      {
        key: "cta",
        tag: "div",
        layout: {
          display: "inline-flex",
          align: "center",
          justify: "center",
          height: 40,
          padding: { left: { token: "spacing.xl" }, right: { token: "spacing.xl" } },
          borderRadius: { token: "radius.xxl" },
          boxSizing: "border-box",
        },
        style: { background: { token: "color.surface-button-primary" }, cursor: "pointer" },
        interactive: { type: "button" },
        children: [
          {
            key: "cta-label",
            tag: "span",
            layout: { display: "inline-flex" },
            style: {
              fontFamily: "'KH Teka'",
              fontSize: 14,
              letterSpacing: "0.02em",
              lineHeight: "16px",
            },
            text: {
              content: ctaLabel,
              style: "label-sm",
              weight: 400,
              color: { token: "color.text-white-constant" },
              editable: true,
            },
          },
        ],
      },
    ],
  };
}
