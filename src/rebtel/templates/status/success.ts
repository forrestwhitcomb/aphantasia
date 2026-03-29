// ============================================================
// Success State — Pixel-perfect from Figma 3.0
// ============================================================
// Container: flex column, align center, justify center,
//   padding 32px, gap 24px
// Checkmark circle: 64x64, green bg (#09BC09), white checkmark
// Title: KH Teka 24px weight 400, center, color #111111
// Subtitle: KH Teka 16px, center, color #737378
// Button: full width primary
// ============================================================

import type { ComponentSpec } from "../../spec/types";

const ICON_CHECK = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

export function successTemplate(props?: Record<string, unknown>): ComponentSpec {
  const title = (props?.title as string) ?? (props?.label as string) ?? "Your top-up is on the way!";
  const subtitle = (props?.subtitle as string) ?? (props?.body as string) ?? "The top-up you're sending is taking a little longer than expected. We'll let you know as soon as it's been delivered.";
  const ctaLabel = (props?.ctaLabel as string) ?? "Go to living room";

  return {
    key: "success-state",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      align: "center",
      justify: "center",
      width: "100%",
      padding: { all: "32px" },
      gap: "24px",
      boxSizing: "border-box",
    },
    style: {
      background: "#FFFFFF",
      fontFamily: "'KH Teka'",
    },
    data: { component: "successState" },
    children: [
      // Checkmark circle: 64x64, green bg, white check
      {
        key: "icon-circle",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          width: 64,
          height: 64,
          borderRadius: "50%",
          flexShrink: 0,
        },
        style: { background: "#09BC09" },
        children: [
          {
            key: "check-icon",
            tag: "div",
            layout: {
              display: "flex",
              align: "center",
              justify: "center",
              width: 28,
              height: 28,
            },
            style: {},
            data: { innerHTML: ICON_CHECK },
          },
        ],
      },
      // Title: KH Teka 24px/400, #111111, center
      {
        key: "title",
        tag: "div",
        layout: { display: "block", width: "100%" },
        style: {
          textAlign: "center",
          fontFamily: "'KH Teka'",
          fontSize: 24,
          letterSpacing: "0.02em",
          lineHeight: "30px",
        },
        text: {
          content: title,
          style: "headline-md",
          weight: 400,
          color: "#111111",
          align: "center",
          editable: true,
        },
      },
      // Subtitle: KH Teka 16px/400, #737378, center
      {
        key: "subtitle",
        tag: "div",
        layout: { display: "block", width: "100%" },
        style: {
          textAlign: "center",
          fontFamily: "'KH Teka'",
          fontSize: 16,
          letterSpacing: "0.02em",
          lineHeight: "22px",
        },
        text: {
          content: subtitle,
          style: "paragraph-md",
          weight: 400,
          color: "#737378",
          align: "center",
          editable: true,
        },
      },
      // CTA button: full width, primary red, 64px height, 32px radius
      {
        key: "cta",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          width: "100%",
          height: 64,
          borderRadius: "32px",
          boxSizing: "border-box",
        },
        style: { background: "#E31B3B", cursor: "pointer" },
        interactive: { type: "button" },
        children: [
          {
            key: "cta-label",
            tag: "span",
            layout: { display: "inline-flex" },
            style: {
              fontFamily: "'KH Teka'",
              letterSpacing: "0.02em",
              lineHeight: "20px",
            },
            text: {
              content: ctaLabel,
              style: "label-xl",
              weight: 400,
              color: "#FFFFFF",
              align: "center",
              editable: true,
            },
          },
        ],
      },
    ],
  };
}
