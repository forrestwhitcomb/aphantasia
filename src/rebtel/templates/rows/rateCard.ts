// ============================================================
// Rate Card Row — Built from spec (no standalone Figma component)
// ============================================================
// Flag + country name + per-min rate + chevron
// Height 52px, gap 12px, bottom border
// ============================================================

import type { ComponentSpec } from "../../spec/types";

const ICON_CHEVRON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B9B9BE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

export function rateCardTemplate(props?: Record<string, unknown>): ComponentSpec {
  const flag = (props?.flag as string) ?? "\u{1F1F3}\u{1F1EC}";
  const country = (props?.country as string) ?? (props?.label as string) ?? "Nigeria";
  const rate = (props?.rate as string) ?? "$0.02/min";

  return {
    key: "rate-card",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      height: 52,
      gap: { token: "spacing.sm" },
      width: "100%",
      boxSizing: "border-box",
    },
    style: {
      cursor: "pointer",
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
      borderBottom: { width: "1px", style: "solid", color: { token: "color.border-secondary" } },
    },
    interactive: { type: "button" },
    data: { component: "rateCard" },
    children: [
      // Flag
      {
        key: "flag",
        tag: "span",
        layout: { display: "inline-flex", flexShrink: 0 },
        style: { fontSize: "20px", lineHeight: "20px" },
        text: { content: flag, style: "label-lg" },
      },
      // Country name
      {
        key: "country",
        tag: "span",
        layout: { display: "block", flex: "1" },
        style: { letterSpacing: "0.02em", lineHeight: "20px" },
        text: { content: country, style: "paragraph-md", weight: 400, color: { token: "color.text-primary" }, editable: true },
      },
      // Rate
      {
        key: "rate",
        tag: "span",
        layout: { display: "inline-flex" },
        style: { letterSpacing: "0.02em", lineHeight: "18px" },
        text: { content: rate, style: "paragraph-sm", weight: 400, color: { token: "color.text-secondary" }, editable: true },
      },
      // Chevron
      {
        key: "chevron",
        tag: "div",
        layout: { display: "inline-flex", width: 16, height: 16, flexShrink: 0 },
        style: {},
        data: { innerHTML: ICON_CHEVRON },
      },
    ],
  };
}
