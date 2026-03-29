// ============================================================
// Country Row — Pixel-perfect from Figma 3.0
// ============================================================
// Container: width 100%, height 44px, flex row, align center,
//   padding 0 16px, gap 12px
// Flag icon: 24x24
// Country name: KH Teka 16px, color #111111, flex 1
// Dial code: KH Teka 16px, color #737378
// ============================================================

import type { ComponentSpec } from "../../spec/types";

export function countryRowTemplate(props?: Record<string, unknown>): ComponentSpec {
  const name = (props?.name as string) ?? (props?.label as string) ?? "Afghanistan";
  const flag = (props?.flag as string) ?? "\u{1F1E6}\u{1F1EB}";
  const dialCode = (props?.dialCode as string) ?? (props?.code as string) ?? "+93";

  return {
    key: "country-row",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      gap: "12px",
      width: "100%",
      height: 44,
      padding: { left: "16px", right: "16px" },
      boxSizing: "border-box",
    },
    style: {
      cursor: "pointer",
      fontFamily: "'KH Teka'",
    },
    interactive: { type: "button" },
    data: { component: "countryRow" },
    children: [
      // Flag: 24x24 container
      {
        key: "flag",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          width: 24,
          height: 24,
          flexShrink: 0,
        },
        style: { fontSize: 20, lineHeight: "24px" },
        children: [
          {
            key: "flag-emoji",
            tag: "span",
            layout: { display: "inline-flex" },
            style: {},
            text: { content: flag, style: "label-lg" },
          },
        ],
      },
      // Country name: KH Teka 16px, #111111, flex 1
      {
        key: "name",
        tag: "span",
        layout: { display: "block", flex: "1" },
        style: {
          fontFamily: "'KH Teka'",
          fontSize: 16,
          letterSpacing: "0.02em",
          lineHeight: "22px",
        },
        text: {
          content: name,
          style: "paragraph-md",
          weight: 400,
          color: "#111111",
          editable: true,
        },
      },
      // Dial code: KH Teka 16px, #737378
      {
        key: "dial-code",
        tag: "span",
        layout: { display: "inline-flex", flexShrink: 0 },
        style: {
          fontFamily: "'KH Teka'",
          fontSize: 16,
          letterSpacing: "0.02em",
          lineHeight: "22px",
        },
        text: {
          content: dialCode,
          style: "paragraph-md",
          weight: 400,
          color: "#737378",
        },
      },
    ],
  };
}
