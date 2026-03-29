// ============================================================
// Text Field — Pixel-perfect from Figma 3.0
// ============================================================
// Vertical layout: label + input container
// Label: KH Teka 14px/14px, #737378, 0.02em, margin-bottom 8px
// Input box: height 52px, radius 8px, 1px solid #DCDCE1, white bg,
//   padding 12px, KH Teka 16px, color #111111 (or #B9B9BE placeholder)
// ============================================================

import type { ComponentSpec } from "../../spec/types";

export function textFieldTemplate(props?: Record<string, unknown>): ComponentSpec {
  const label = (props?.label as string) ?? "Full name";
  const placeholder = (props?.placeholder as string) ?? "First name last name";
  const value = (props?.value as string) ?? "";
  const state = (props?.state as string) ?? "default";

  const borderColor = state === "error" ? "#E31B3B" :
    state === "focused" ? "#111111" : "#DCDCE1";

  return {
    key: "text-field",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      width: "100%",
      boxSizing: "border-box",
    },
    style: {
      fontFamily: "'KH Teka'",
    },
    data: { component: "textField" },
    children: [
      // Label
      {
        key: "tf-label",
        tag: "span",
        layout: { display: "block", padding: { bottom: "8px" } },
        style: {
          fontSize: 14,
          letterSpacing: "0.02em",
          lineHeight: "14px",
          fontFamily: "'KH Teka'",
        },
        text: {
          content: label,
          style: "label-sm",
          weight: 400,
          color: "#737378",
          editable: true,
        },
      },
      // Input box
      {
        key: "tf-input",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          width: "100%",
          height: 52,
          borderRadius: "8px",
          padding: { all: "12px" },
          boxSizing: "border-box",
        },
        style: {
          background: "#FFFFFF",
          border: { width: "1px", style: "solid", color: borderColor },
          fontSize: 16,
          letterSpacing: "0.02em",
          lineHeight: "16px",
          fontFamily: "'KH Teka'",
          color: value ? "#111111" : "#B9B9BE",
        },
        interactive: { type: "input" },
        text: {
          content: value || placeholder,
          style: "paragraph-md",
          weight: 400,
          color: value ? "#111111" : "#B9B9BE",
          editable: true,
        },
      },
    ],
  };
}
