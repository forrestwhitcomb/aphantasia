// ============================================================
// Phone Input — Pixel-perfect from Figma 3.0
// ============================================================
// Horizontal layout: country selector + divider + number input
// Container: height 52px, radius 8px, border 1px solid #DCDCE1,
//   white bg, flex row
// Country selector: flex row, align center, padding 12px, gap 8px,
//   flag (24x24) + code text + chevron
// Divider: 1px wide, height 100%, bg #DCDCE1
// Number input: flex 1, padding 12px, KH Teka 16px
// ============================================================

import type { ComponentSpec } from "../../spec/types";

const ICON_GLOBE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D2D32" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const ICON_CHEVRON_DOWN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D2D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

export function phoneInputTemplate(props?: Record<string, unknown>): ComponentSpec {
  const placeholder = (props?.placeholder as string) ?? "Enter phone number";
  const value = (props?.value as string) ?? "";
  const flag = (props?.flag as string) ?? "";
  const prefix = (props?.prefix as string) ?? "";
  const filled = !!value;

  // Country selector children
  const selectorChildren: ComponentSpec[] = [];

  if (flag) {
    selectorChildren.push({
      key: "flag",
      tag: "div",
      layout: { display: "flex", align: "center", justify: "center", width: 24, height: 24, overflow: "hidden", flexShrink: 0 },
      style: {},
      children: [{
        key: "flag-text",
        tag: "span",
        layout: { display: "inline-flex" },
        style: { fontSize: 18, lineHeight: "24px" },
        text: { content: flag, style: "label-md" },
      }],
    });
  } else {
    selectorChildren.push({
      key: "globe",
      tag: "div",
      layout: { display: "flex", align: "center", justify: "center", width: 24, height: 24, overflow: "hidden", flexShrink: 0 },
      style: {},
      data: { innerHTML: ICON_GLOBE },
    });
  }

  if (prefix) {
    selectorChildren.push({
      key: "prefix-text",
      tag: "span",
      layout: { display: "inline-flex" },
      style: { fontSize: 16, letterSpacing: "0.02em", lineHeight: "16px", fontFamily: "'KH Teka'" },
      text: { content: prefix, style: "label-md", weight: 400, color: "#111111" },
    });
  }

  selectorChildren.push({
    key: "chevron",
    tag: "div",
    layout: { display: "flex", align: "center", justify: "center", width: 16, height: 16, overflow: "hidden", flexShrink: 0 },
    style: {},
    data: { innerHTML: ICON_CHEVRON_DOWN },
  });

  return {
    key: "phone-input",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      width: "100%",
      height: 52,
      borderRadius: "8px",
      boxSizing: "border-box",
      overflow: "hidden",
    },
    style: {
      background: "#FFFFFF",
      border: { width: "1px", style: "solid", color: "#DCDCE1" },
      fontFamily: "'KH Teka'",
    },
    data: { component: "phoneInput" },
    children: [
      // Country selector
      {
        key: "country-prefix",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          gap: "8px",
          padding: { all: "12px" },
          flexShrink: 0,
        },
        style: { cursor: "pointer" },
        interactive: { type: "button" },
        children: selectorChildren,
      },
      // Divider
      {
        key: "divider",
        tag: "div",
        layout: { display: "block", width: 1, height: "100%" },
        style: { background: "#DCDCE1" },
      },
      // Phone number input
      {
        key: "phone-value",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          flex: "1",
          padding: { all: "12px" },
        },
        style: {
          fontSize: 16,
          letterSpacing: "0.02em",
          lineHeight: "16px",
          fontFamily: "'KH Teka'",
        },
        interactive: { type: "input" },
        text: {
          content: filled ? (prefix ? `${prefix} ${value}` : value) : placeholder,
          style: "paragraph-md",
          weight: 400,
          color: filled ? "#111111" : "#B9B9BE",
          editable: true,
        },
      },
    ],
  };
}
