// Product MTU Card — Bundle product card with badges, data/calling/sms, price, CTA
// Figma: 5405:106610 — 358×220

import type { ComponentSpec } from "../../spec/types";

function featurePill(key: string, label: string): ComponentSpec {
  return {
    key,
    tag: "span",
    layout: { display: "inline-flex", padding: { y: "4px", x: { token: "spacing.xs" } }, borderRadius: { token: "radius.xs" } },
    style: { background: { token: "color.surface-light" } },
    text: { content: label, style: "label-xs", color: { token: "color.text-secondary" }, editable: true },
  };
}

export function productMtuTemplate(props?: Record<string, unknown>): ComponentSpec {
  const name = (props?.name as string) ?? (props?.label as string) ?? "7GB Nigeria";
  const badge1 = (props?.badge1 as string) ?? "Most popular";
  const badge2 = (props?.badge2 as string) ?? "Carrier Bonus";
  const features = (props?.features as string[]) ?? ["11 GB data", "Unlimited calling", "20 SMS"];
  const price = (props?.price as string) ?? "$3.21";
  const validity = (props?.validity as string) ?? "30 days";
  const ctaLabel = (props?.ctaLabel as string) ?? "Select product";

  return {
    key: "product-mtu",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: { token: "spacing.sm" },
      width: "100%",
      padding: { all: { token: "spacing.md" } },
      borderRadius: { token: "radius.lg" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-secondary" } },
    },
    data: { component: "productMtu" },
    children: [
      // Badges
      {
        key: "badges",
        tag: "div",
        layout: { display: "flex", gap: { token: "spacing.xs" } },
        style: {},
        children: [
          { key: "b1", tag: "span", layout: { display: "inline-flex", padding: { y: "4px", x: { token: "spacing.xs" } }, borderRadius: { token: "radius.xs" } }, style: { background: { token: "color.grey-900" } }, text: { content: `\u2605 ${badge1}`, style: "label-xs", weight: 600, color: { token: "color.brand-white" } } },
          { key: "b2", tag: "span", layout: { display: "inline-flex", padding: { y: "4px", x: { token: "spacing.xs" } }, borderRadius: { token: "radius.xs" } }, style: { background: { token: "color.brand-red" } }, text: { content: `\u2605 ${badge2}`, style: "label-xs", weight: 600, color: { token: "color.text-on-brand" } } },
        ],
      },
      // Name
      { key: "name", tag: "div", layout: { display: "block" }, style: {}, text: { content: name, style: "headline-xs", weight: 700, color: { token: "color.text-primary" }, editable: true } },
      // Feature pills
      {
        key: "features",
        tag: "div",
        layout: { display: "flex", gap: { token: "spacing.xs" }, flexWrap: "wrap" },
        style: {},
        children: features.map((f, i) => featurePill(`feat-${i}`, f)),
      },
      // Price row
      {
        key: "price-row",
        tag: "div",
        layout: { display: "flex", align: "end", justify: "space-between", padding: { top: { token: "spacing.xs" } } },
        style: {},
        children: [
          {
            key: "price-col",
            tag: "div",
            layout: { display: "flex", direction: "column" },
            style: {},
            children: [
              { key: "price-label", tag: "span", layout: { display: "block" }, style: {}, text: { content: "You pay", style: "paragraph-xs", color: { token: "color.text-tertiary" } } },
              { key: "price-value", tag: "span", layout: { display: "block" }, style: {}, text: { content: price, style: "headline-md", weight: 700, color: { token: "color.text-primary" }, editable: true } },
            ],
          },
          {
            key: "validity-col",
            tag: "div",
            layout: { display: "flex", direction: "column", align: "end" },
            style: {},
            children: [
              { key: "validity-label", tag: "span", layout: { display: "block" }, style: {}, text: { content: "Validity", style: "paragraph-xs", color: { token: "color.text-tertiary" }, align: "right" } },
              { key: "validity-value", tag: "span", layout: { display: "block" }, style: {}, text: { content: validity, style: "headline-md", weight: 700, color: { token: "color.text-primary" }, align: "right", editable: true } },
            ],
          },
        ],
      },
      // Bottom row: info + CTA
      {
        key: "action-row",
        tag: "div",
        layout: { display: "flex", align: "center", gap: { token: "spacing.sm" }, padding: { top: { token: "spacing.xs" } } },
        style: {},
        children: [
          // Info button (circle with i)
          {
            key: "info-btn",
            tag: "div",
            layout: { display: "flex", align: "center", justify: "center", width: 32, height: 32, borderRadius: { token: "radius.full" }, flexShrink: 0 },
            style: { background: { token: "color.surface-light" }, cursor: "pointer" },
            interactive: { type: "button" },
            text: { content: "i", style: "label-sm", weight: 400, color: { token: "color.text-secondary" }, align: "center" },
          },
          // CTA
          {
            key: "cta",
            tag: "div",
            layout: { display: "flex", align: "center", justify: "center", flex: "1", height: { token: "height.md" }, borderRadius: { token: "radius.full" } },
            style: { background: { token: "color.button-primary" }, cursor: "pointer" },
            interactive: { type: "button" },
            text: { content: ctaLabel, style: "label-md", weight: 600, color: { token: "color.text-on-brand" }, align: "center", editable: true },
          },
        ],
      },
    ],
  };
}
