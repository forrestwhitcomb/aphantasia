// ============================================================
// Credits Card — Pixel-perfect from Figma 3.0
// ============================================================
// Figma: 5405:106809 (collapsed), 5405:106771 (expanded)
// Collapsed: balance + add credits button
// Expanded: tabs + amount grid
// Font: KH Teka Regular (400), Bold (700)
// Letter-spacing: 0.02em everywhere
// ============================================================

import type { ComponentSpec } from "../../spec/types";

function amountCell(key: string, amount: string): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      flex: "1",
      height: 56,
      borderRadius: "12px",
      boxSizing: "border-box",
    },
    style: {
      background: "#FFFFFF",
      border: { width: "1px", style: "solid", color: "#DCDCE1" },
      cursor: "pointer",
      fontFamily: "'KH Teka'",
      fontSize: "16px",
      letterSpacing: "0.02em",
      lineHeight: "20px",
    },
    interactive: { type: "button" },
    text: { content: amount, style: "paragraph-md", weight: 700, color: "#111111", align: "center", editable: true },
  };
}

export function creditsCardTemplate(props?: Record<string, unknown>): ComponentSpec {
  const variant = (props?.variant as string) ?? "collapsed";
  const balance = (props?.balance as string) ?? "$24.24";

  if (variant === "collapsed") {
    return {
      key: "credits-card",
      tag: "div",
      layout: {
        display: "flex",
        align: "center",
        justify: "space-between",
        width: "100%",
        padding: { y: "12px" },
        boxSizing: "border-box",
      },
      style: {
        fontFamily: "'KH Teka'",
        letterSpacing: "0.02em",
      },
      data: { component: "creditsCard" },
      children: [
        {
          key: "left",
          tag: "div",
          layout: { display: "flex", direction: "column", gap: "2px" },
          style: {},
          children: [
            {
              key: "label",
              tag: "span",
              layout: { display: "block" },
              style: { fontSize: "12px", letterSpacing: "0.02em", lineHeight: "14px" },
              text: { content: "Rebtel credits", style: "paragraph-xs", color: "#B9B9BE" },
            },
            {
              key: "balance",
              tag: "span",
              layout: { display: "block" },
              style: { fontSize: "20px", letterSpacing: "0.02em", lineHeight: "24px" },
              text: { content: balance, style: "headline-md", weight: 700, color: "#111111", editable: true },
            },
          ],
        },
        {
          key: "add-btn",
          tag: "div",
          layout: {
            display: "flex",
            align: "center",
            justify: "center",
            height: 40,
            padding: { x: "16px" },
            borderRadius: "32px",
            boxSizing: "border-box",
          },
          style: {
            background: "#E31B3B",
            cursor: "pointer",
            fontFamily: "'KH Teka'",
            fontSize: "14px",
            letterSpacing: "0.02em",
            lineHeight: "14px",
          },
          interactive: { type: "button" },
          text: { content: "Add credits", style: "label-sm", weight: 400, color: "#FFFFFF", editable: true },
        },
      ],
    };
  }

  // Expanded variant
  const amounts = (props?.amounts as string[]) ?? ["$5", "$10", "$25", "$50", "$100", "$150"];
  const rows: ComponentSpec[] = [];
  for (let i = 0; i < amounts.length; i += 2) {
    rows.push({
      key: `row-${i}`,
      tag: "div",
      layout: { display: "flex", gap: "8px" },
      style: {},
      children: [
        amountCell(`amt-${i}`, amounts[i]),
        i + 1 < amounts.length
          ? amountCell(`amt-${i + 1}`, amounts[i + 1])
          : { key: `empty-${i}`, tag: "div", layout: { display: "block", flex: "1" }, style: {} },
      ],
    });
  }

  return {
    key: "credits-card",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: "8px",
      width: "100%",
      boxSizing: "border-box",
    },
    style: {
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    data: { component: "creditsCard" },
    children: [
      // Tabs row
      {
        key: "tabs",
        tag: "div",
        layout: { display: "flex", gap: "4px", padding: { bottom: "8px" } },
        style: {},
        children: [
          {
            key: "tab-buy",
            tag: "div",
            layout: {
              display: "flex",
              align: "center",
              justify: "center",
              flex: "1",
              height: 40,
              borderRadius: "32px",
              boxSizing: "border-box",
            },
            style: {
              background: "#111111",
              cursor: "pointer",
              fontFamily: "'KH Teka'",
              fontSize: "14px",
              letterSpacing: "0.02em",
              lineHeight: "14px",
            },
            interactive: { type: "tab" },
            text: { content: "Buy Credits", style: "label-sm", weight: 600, color: "#FFFFFF", align: "center", editable: true },
          },
          {
            key: "tab-activity",
            tag: "div",
            layout: {
              display: "flex",
              align: "center",
              justify: "center",
              flex: "1",
              height: 40,
              borderRadius: "32px",
              boxSizing: "border-box",
            },
            style: {
              background: "#F3F3F3",
              cursor: "pointer",
              fontFamily: "'KH Teka'",
              fontSize: "14px",
              letterSpacing: "0.02em",
              lineHeight: "14px",
            },
            interactive: { type: "tab" },
            text: { content: "Activity", style: "label-sm", weight: 500, color: "#111111", align: "center", editable: true },
          },
        ],
      },
      // Amount grid (2 per row)
      ...rows,
    ],
  };
}
