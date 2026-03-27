// Product Calling Credits — Amount pills + rate display + Buy now CTA
// Figma: 5405:106657 — 361×335

import type { ComponentSpec } from "../../spec/types";

function amountPill(key: string, amount: string, selected: boolean): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      height: { token: "height.lg" },
      padding: { x: { token: "spacing.lg" } },
      borderRadius: { token: "radius.full" },
    },
    style: {
      background: selected ? { token: "color.grey-900" } : { token: "color.surface-primary" },
      border: selected ? undefined : { width: "1px", style: "solid", color: { token: "color.border-default" } },
      cursor: "pointer",
    },
    interactive: { type: "button" },
    text: { content: amount, style: "label-md", weight: 600, color: selected ? { token: "color.brand-white" } : { token: "color.text-primary" }, editable: true },
  };
}

function rateColumn(key: string, minutes: string, type: string, rate: string): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: { display: "flex", direction: "column", align: "center", flex: "1", gap: "4px", padding: { y: { token: "spacing.md" } } },
    style: {},
    children: [
      { key: `${key}-min`, tag: "span", layout: { display: "block" }, style: {}, text: { content: minutes, style: "headline-lg", weight: 700, color: { token: "color.text-primary" }, align: "center", editable: true } },
      { key: `${key}-type`, tag: "span", layout: { display: "block" }, style: {}, text: { content: type, style: "paragraph-sm", color: { token: "color.text-secondary" }, align: "center" } },
      { key: `${key}-rate`, tag: "span", layout: { display: "block" }, style: {}, text: { content: rate, style: "paragraph-xs", color: { token: "color.text-tertiary" }, align: "center" } },
    ],
  };
}

export function productCreditsTemplate(props?: Record<string, unknown>): ComponentSpec {
  const country = (props?.country as string) ?? "Sweden";
  const amounts = (props?.amounts as string[]) ?? ["$5", "$10", "$25"];
  const selected = (props?.selected as string) ?? "$5";
  const mobileMin = (props?.mobileMin as string) ?? "20500 min";
  const mobileRate = (props?.mobileRate as string) ?? "\u00A22.0/min";
  const landlineMin = (props?.landlineMin as string) ?? "2500 min";
  const landlineRate = (props?.landlineRate as string) ?? "\u00A21.0/min";
  const ctaLabel = (props?.ctaLabel as string) ?? "Buy now";

  return {
    key: "product-credits",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      align: "center",
      gap: { token: "spacing.sm" },
      width: "100%",
      padding: { all: { token: "spacing.lg" } },
      borderRadius: { token: "radius.lg" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-secondary" } },
    },
    data: { component: "productCredits" },
    children: [
      // Subtitle
      { key: "subtitle", tag: "span", layout: { display: "block" }, style: {}, text: { content: "Pay as you go", style: "paragraph-xs", color: { token: "color.text-tertiary" }, align: "center" } },
      // Title
      { key: "title", tag: "div", layout: { display: "block" }, style: {}, text: { content: `Rebtel Credits to ${country}`, style: "headline-sm", weight: 700, color: { token: "color.text-primary" }, align: "center", editable: true } },
      // Description
      { key: "desc", tag: "span", layout: { display: "block" }, style: {}, text: { content: "Call any mobile or landline at the lowest rate", style: "paragraph-xs", color: { token: "color.text-tertiary" }, align: "center" } },
      // Amount pills
      {
        key: "amounts",
        tag: "div",
        layout: { display: "flex", gap: { token: "spacing.xs" }, justify: "center", padding: { y: { token: "spacing.xs" } } },
        style: {},
        children: amounts.map((a, i) => amountPill(`pill-${i}`, a, a === selected)),
      },
      // Rate display
      {
        key: "rates",
        tag: "div",
        layout: { display: "flex", width: "100%" },
        style: { border: { width: "0 0 0 0", style: "none", color: "transparent" } },
        children: [
          rateColumn("mobile", mobileMin, "Mobile", mobileRate),
          // Vertical divider
          { key: "rate-divider", tag: "div", layout: { display: "block", width: 1 }, style: { background: { token: "color.border-secondary" } } },
          rateColumn("landline", landlineMin, "Landline", landlineRate),
        ],
      },
      // Buy now button
      {
        key: "cta",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "center", width: "100%", height: { token: "height.lg" }, borderRadius: { token: "radius.full" } },
        style: { background: { token: "color.button-primary" }, cursor: "pointer" },
        interactive: { type: "button" },
        text: { content: ctaLabel, style: "label-md", weight: 600, color: { token: "color.text-on-brand" }, align: "center", editable: true },
      },
    ],
  };
}
