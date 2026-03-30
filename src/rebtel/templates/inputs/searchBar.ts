// ============================================================
// Search Bar — Pixel-perfect from Figma 3.0
// ============================================================
// Pill shape (radius 24px), height 52px, white bg
// Border: 1px solid #DCDCE1, padding 16px horizontal + 8px vertical
// Icon: 24x24, stroke #2D2D32
// Placeholder: KH Teka 18px, #B9B9BE, 0.02em, line-height 18px
// Gap: 4px between icon and text
// ============================================================

import type { ComponentSpec } from "../../spec/types";

const ICON_SEARCH = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D2D32" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

export function searchBarTemplate(props?: Record<string, unknown>): ComponentSpec {
  const placeholder = (props?.placeholder as string) ?? "Search country";
  const value = (props?.value as string) ?? "";

  return {
    key: "search-bar",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      gap: "4px",
      width: "100%",
      height: 52,
      padding: { left: { token: "spacing.md" }, right: { token: "spacing.md" }, top: { token: "spacing.xs" }, bottom: { token: "spacing.xs" } },
      borderRadius: "24px",
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
      fontFamily: "'KH Teka'",
    },
    interactive: { type: "input" },
    data: { component: "searchBar" },
    children: [
      {
        key: "search-icon",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          width: 24,
          height: 24,
          flexShrink: 0,
          overflow: "hidden",
        },
        style: {},
        data: { innerHTML: ICON_SEARCH },
      },
      {
        key: "search-text",
        tag: "span",
        layout: { display: "block", flex: "1" },
        style: {
          fontSize: 18,
          letterSpacing: "0.02em",
          lineHeight: "18px",
          fontFamily: "'KH Teka'",
        },
        text: {
          content: value || placeholder,
          style: "paragraph-md",
          weight: 400,
          color: value ? { token: "color.text-primary" } : { token: "color.text-tertiary" },
          editable: true,
        },
      },
    ],
  };
}
