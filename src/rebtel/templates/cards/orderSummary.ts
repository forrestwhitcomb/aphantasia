// Order Summary / Receipt — Line items + total + cancel link
// Figma: 5405:106725 — 350×246

import type { ComponentSpec } from "../../spec/types";

function lineItem(key: string, label: string, value: string, bold?: boolean): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: { display: "flex", justify: "space-between", align: "center", padding: { y: { token: "spacing.xs" } } },
    style: {},
    children: [
      { key: `${key}-label`, tag: "span", layout: { display: "block" }, style: {}, text: { content: label, style: bold ? "paragraph-md" : "paragraph-sm", weight: bold ? 600 : 400, color: { token: "color.text-primary" }, editable: true } },
      { key: `${key}-value`, tag: "span", layout: { display: "block" }, style: {}, text: { content: value, style: bold ? "headline-sm" : "paragraph-sm", weight: bold ? 700 : 400, color: { token: "color.text-primary" }, align: "right", editable: true } },
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
      padding: { all: { token: "spacing.lg" } },
      borderRadius: { token: "radius.lg" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-secondary" } },
    },
    data: { component: "orderSummary" },
    children: [
      // Line items
      ...items.map((item, i) => lineItem(`item-${i}`, item.label, item.value)),
      // Divider
      { key: "divider", tag: "div", layout: { display: "block", width: "100%", height: 1 }, style: { background: { token: "color.border-secondary" } } },
      // Total
      lineItem("total", totalLabel, totalValue, true),
      // After trial
      lineItem("after", afterLabel, afterValue),
      // Footer
      {
        key: "footer",
        tag: "div",
        layout: { display: "flex", align: "center", gap: { token: "spacing.xs" }, padding: { top: { token: "spacing.sm" } } },
        style: {},
        children: [
          { key: "check-icon", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: "\u2705", style: "label-sm" } },
          { key: "footer-text", tag: "span", layout: { display: "block" }, style: {}, text: { content: footerText, style: "paragraph-sm", color: { token: "color.success" }, editable: true } },
        ],
      },
    ],
  };
}
