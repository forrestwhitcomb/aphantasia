// Rebtel Credits Card — Collapsed (balance + add button) or expanded (tabs + amount grid)
// Figma: 5405:106809 (collapsed), 5405:106771 (expanded)

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
      height: { token: "height.xl" },
      borderRadius: { token: "radius.md" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-secondary" } },
      cursor: "pointer",
    },
    interactive: { type: "button" },
    text: { content: amount, style: "headline-xs", weight: 600, color: { token: "color.text-primary" }, align: "center", editable: true },
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
        padding: { y: { token: "spacing.sm" } },
        boxSizing: "border-box",
      },
      style: {},
      data: { component: "creditsCard" },
      children: [
        {
          key: "left",
          tag: "div",
          layout: { display: "flex", direction: "column" },
          style: {},
          children: [
            { key: "label", tag: "span", layout: { display: "block" }, style: {}, text: { content: "Rebtel credits", style: "paragraph-xs", color: { token: "color.text-tertiary" } } },
            { key: "balance", tag: "span", layout: { display: "block" }, style: {}, text: { content: balance, style: "headline-md", weight: 700, color: { token: "color.text-primary" }, editable: true } },
          ],
        },
        {
          key: "add-btn",
          tag: "div",
          layout: { display: "flex", align: "center", justify: "center", height: { token: "height.sm" }, padding: { x: { token: "spacing.md" } }, borderRadius: { token: "radius.full" } },
          style: { background: { token: "color.button-primary" }, cursor: "pointer" },
          interactive: { type: "button" },
          text: { content: "Add credits", style: "label-sm", weight: 600, color: { token: "color.text-on-brand" }, editable: true },
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
      layout: { display: "flex", gap: { token: "spacing.xs" } },
      style: {},
      children: [
        amountCell(`amt-${i}`, amounts[i]),
        i + 1 < amounts.length ? amountCell(`amt-${i + 1}`, amounts[i + 1]) : { key: `empty-${i}`, tag: "div", layout: { display: "block", flex: "1" }, style: {} },
      ],
    });
  }

  return {
    key: "credits-card",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: { token: "spacing.xs" },
      width: "100%",
      boxSizing: "border-box",
    },
    style: {},
    data: { component: "creditsCard" },
    children: [
      // Tabs
      {
        key: "tabs",
        tag: "div",
        layout: { display: "flex", gap: { token: "spacing.xxs" }, padding: { bottom: { token: "spacing.xs" } } },
        style: {},
        children: [
          {
            key: "tab-buy",
            tag: "div",
            layout: { display: "flex", align: "center", justify: "center", flex: "1", height: { token: "height.md" }, borderRadius: { token: "radius.full" } },
            style: { background: { token: "color.grey-900" }, cursor: "pointer" },
            interactive: { type: "tab" },
            text: { content: "Buy Credits", style: "label-sm", weight: 600, color: { token: "color.brand-white" }, align: "center", editable: true },
          },
          {
            key: "tab-activity",
            tag: "div",
            layout: { display: "flex", align: "center", justify: "center", flex: "1", height: { token: "height.md" }, borderRadius: { token: "radius.full" } },
            style: { background: { token: "color.surface-light" }, cursor: "pointer" },
            interactive: { type: "tab" },
            text: { content: "Activity", style: "label-sm", weight: 500, color: { token: "color.text-primary" }, align: "center", editable: true },
          },
        ],
      },
      // Amount grid
      ...rows,
    ],
  };
}
