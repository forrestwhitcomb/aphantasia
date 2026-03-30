// ============================================================
// Order Summary — Pixel-perfect from Figma 3.0
// ============================================================
// Figma: 5405:106725 — 350×246
// White bg, radius 16px, 1px solid #DCDCE1, padding 16px+20px
// Line items: flex row, space-between, 8px vertical padding
// Divider: 1px height, full width, #DCDCE1
// Total: KH Teka 16px weight 700
// Font: KH Teka Regular (400), Bold (700)
// Letter-spacing: 0.02em everywhere
// ============================================================

import type { ComponentSpec } from "../../spec/types";

const ICON_CHECK = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#09BC09" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

function lineItem(key: string, label: string, value: string, bold?: boolean): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: { display: "flex", justify: "space-between", align: "center", padding: { y: "8px" } },
    style: {},
    children: [
      {
        key: `${key}-label`,
        tag: "span",
        layout: { display: "block" },
        style: {
          fontSize: bold ? "16px" : "14px",
          fontFamily: "'KH Teka'",
          letterSpacing: "0.02em",
          lineHeight: bold ? "20px" : "18px",
        },
        text: {
          content: label,
          style: bold ? "paragraph-md" : "paragraph-sm",
          weight: bold ? 700 : 400,
          color: { token: "color.text-primary" },
          editable: true,
        },
      },
      {
        key: `${key}-value`,
        tag: "span",
        layout: { display: "block" },
        style: {
          fontSize: bold ? "16px" : "14px",
          fontFamily: "'KH Teka'",
          letterSpacing: "0.02em",
          lineHeight: bold ? "20px" : "18px",
          textAlign: "right",
        },
        text: {
          content: value,
          style: bold ? "paragraph-md" : "paragraph-sm",
          weight: bold ? 700 : 400,
          color: { token: "color.text-primary" },
          align: "right",
          editable: true,
        },
      },
    ],
  };
}

export function orderSummaryTemplate(props?: Record<string, unknown>): ComponentSpec {
  const items = (props?.items as Array<{ label: string; value: string }>) ?? [
    { label: "USA Unlimited", value: "$12/month" },
    { label: "7 days free trial", value: "$0" },
  ];
  const totalLabel = (props?.totalLabel as string) ?? "Pay now";
  const totalValue = (props?.totalValue as string) ?? "$0";
  const afterLabel = (props?.afterLabel as string) ?? "After trial";
  const afterValue = (props?.afterValue as string) ?? "$12/month";
  const footerText = (props?.footerText as string) ?? "Cancel anytime";

  return {
    key: "order-summary",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      width: "100%",
      padding: { top: { token: "spacing.md" }, right: { token: "spacing.lg" }, bottom: { token: "spacing.md" }, left: { token: "spacing.lg" } },
      borderRadius: { token: "radius.lg" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    data: { component: "orderSummary" },
    children: [
      // Line items
      ...items.map((item, i) => lineItem(`item-${i}`, item.label, item.value)),
      // Divider: 1px height, full width, #DCDCE1
      {
        key: "divider",
        tag: "div",
        layout: { display: "block", width: "100%", height: 1 },
        style: { background: { token: "color.border-default" } },
      },
      // Total row (bold)
      lineItem("total", totalLabel, totalValue, true),
      // After trial row
      lineItem("after", afterLabel, afterValue),
      // Footer: check icon + success text
      {
        key: "footer",
        tag: "div",
        layout: { display: "flex", align: "center", gap: { token: "spacing.xs" }, padding: { top: { token: "spacing.sm" } } },
        style: {},
        children: [
          {
            key: "check-icon",
            tag: "div",
            layout: { display: "inline-flex", width: 16, height: 16, flexShrink: 0 },
            style: {},
            data: { innerHTML: ICON_CHECK },
          },
          {
            key: "footer-text",
            tag: "span",
            layout: { display: "block" },
            style: { fontSize: "14px", letterSpacing: "0.02em", lineHeight: "18px" },
            text: { content: footerText, style: "paragraph-sm", color: { token: "color.success" }, editable: true },
          },
        ],
      },
    ],
  };
}
