// ============================================================
// Amount Pill Selector — Built from spec
// ============================================================
// CSS grid 3-col, gap 8px
// Each pill: 52px height, full radius, KH Teka 16px
// Active: black bg + white text. Inactive: white bg + border
// Below: "About Rebtel Credits" link
// ============================================================

import type { ComponentSpec } from "../../spec/types";

export function amountPillsTemplate(props?: Record<string, unknown>): ComponentSpec {
  const amounts = (props?.amounts as string[]) ?? ["$5", "$10", "$25"];
  const activeIndex = (props?.activeIndex as number) ?? 0;

  const pills: ComponentSpec[] = amounts.map((amount, i) => {
    const isActive = i === activeIndex;
    return {
      key: `pill-${i}`,
      tag: "div",
      layout: {
        display: "flex",
        flex: "1",
        align: "center",
        justify: "center",
        height: 52,
        borderRadius: { token: "radius.full" },
        boxSizing: "border-box",
      },
      style: {
        background: isActive
          ? { token: "color.surface-button-secondary-black" }
          : { token: "color.surface-primary" },
        border: isActive
          ? undefined
          : { width: "1px", style: "solid", color: { token: "color.border-default" } },
        cursor: "pointer",
        fontFamily: "'KH Teka'",
        fontSize: "16px",
        letterSpacing: "0.02em",
        lineHeight: "16px",
      },
      interactive: { type: "button" },
      text: {
        content: amount,
        style: "paragraph-md",
        weight: 400,
        color: isActive
          ? { token: "color.text-white-constant" }
          : { token: "color.text-primary" },
        editable: true,
      },
    };
  });

  return {
    key: "amount-pills",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: { token: "spacing.sm" },
      width: "100%",
    },
    style: {},
    data: { component: "amountPills" },
    children: [
      // Grid (flex wrap, 3 equal columns)
      {
        key: "pills-grid",
        tag: "div",
        layout: {
          display: "flex",
          gap: { token: "spacing.xs" },
          width: "100%",
          flexWrap: "wrap",
        },
        style: {},
        children: pills,
      },
      // Info link
      {
        key: "credits-link",
        tag: "div",
        layout: { display: "flex", justify: "center", padding: { top: { token: "spacing.xs" } } },
        style: {},
        children: [
          {
            key: "credits-link-text",
            tag: "span",
            layout: { display: "inline-flex" },
            style: { letterSpacing: "0.02em", lineHeight: "14px", cursor: "pointer" },
            interactive: { type: "link" },
            text: { content: "About Rebtel Credits", style: "label-sm", weight: 400, color: { token: "color.brand-red" } },
          },
        ],
      },
    ],
  };
}
