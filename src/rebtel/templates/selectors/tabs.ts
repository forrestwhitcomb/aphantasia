// ============================================================
// Tabs — Segmented control, pixel-perfect from Figma 3.0
// ============================================================
// Container: flex row, width 100%, border-bottom 1px solid #DCDCE1
// Each tab: flex 1, height 40px, center aligned text
//   Active: KH Teka 14px weight 400, color #111111,
//           border-bottom 2px solid #E31B3B
//   Inactive: color #737378, no bottom border
// ============================================================

import type { ComponentSpec } from "../../spec/types";

function tabSegment(key: string, label: string, active: boolean): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      flex: "1",
      height: 40,
      boxSizing: "border-box",
    },
    style: {
      cursor: "pointer",
      fontFamily: "'KH Teka'",
      fontSize: 14,
      letterSpacing: "0.02em",
      lineHeight: "18px",
      borderBottom: active
        ? { width: "2px", style: "solid", color: "#E31B3B" }
        : undefined,
    },
    interactive: { type: "tab" },
    children: [
      {
        key: `${key}-label`,
        tag: "span",
        layout: { display: "inline-flex" },
        style: {
          fontFamily: "'KH Teka'",
          letterSpacing: "0.02em",
          lineHeight: "18px",
        },
        text: {
          content: label,
          style: "label-sm",
          weight: 400,
          color: active ? "#111111" : "#737378",
          editable: true,
        },
      },
    ],
  };
}

export function tabsTemplate(props?: Record<string, unknown>): ComponentSpec {
  const items = (props?.items as string[]) ?? ["Calls", "Top-ups"];
  const activeIndex = (props?.activeIndex as number) ?? 0;

  return {
    key: "tabs",
    tag: "div",
    layout: {
      display: "flex",
      width: "100%",
      boxSizing: "border-box",
    },
    style: {
      borderBottom: { width: "1px", style: "solid", color: "#DCDCE1" },
      fontFamily: "'KH Teka'",
    },
    data: { component: "tabs" },
    children: items.map((label, i) =>
      tabSegment(`tab-${i}`, label, i === activeIndex),
    ),
  };
}
