// Payment Sheet — Credits toggle, payment method selector, pay button
// Figma: 5405:106267 — 390×248

import type { ComponentSpec } from "../../spec/types";

const ICON_INFO = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
const ICON_CHEVRON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-grey-400)" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`;

export function paymentSheetTemplate(props?: Record<string, unknown>): ComponentSpec {
  const amount = (props?.amount as string) ?? "$5";
  const credits = (props?.credits as string) ?? "$1.24";
  const cardLast4 = (props?.cardLast4 as string) ?? "1000";

  return {
    key: "payment-sheet",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: { token: "spacing.md" },
      width: "100%",
      padding: { all: { token: "spacing.lg" } },
      boxSizing: "border-box",
    },
    style: { background: { token: "color.surface-primary" } },
    data: { component: "paymentSheet" },
    children: [
      // Credits toggle row
      {
        key: "credits-row",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "space-between" },
        style: {},
        children: [
          { key: "credits-label", tag: "span", layout: { display: "block" }, style: {}, text: { content: "Use Rebtel Credits", style: "paragraph-md", weight: 400, color: { token: "color.text-primary" }, editable: true } },
          {
            key: "credits-right",
            tag: "div",
            layout: { display: "flex", align: "center", gap: { token: "spacing.xs" } },
            style: {},
            children: [
              { key: "credits-amount", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: credits, style: "paragraph-md", color: { token: "color.text-primary" } } },
              // Toggle
              {
                key: "toggle",
                tag: "div",
                layout: { display: "flex", align: "center", width: 44, height: 24, borderRadius: { token: "radius.full" }, padding: { all: "2px" }, boxSizing: "border-box" },
                style: { background: { token: "color.grey-200" }, cursor: "pointer" },
                interactive: { type: "toggle" },
                children: [{
                  key: "toggle-thumb",
                  tag: "div",
                  layout: { display: "block", width: 20, height: 20, borderRadius: { token: "radius.full" } },
                  style: { background: { token: "color.brand-white" }, shadow: { token: "shadow.sm" } },
                }],
              },
              { key: "info-icon", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_INFO } },
            ],
          },
        ],
      },
      // Payment method selector
      {
        key: "payment-method",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          gap: { token: "spacing.sm" },
          width: "100%",
          height: { token: "height.lg" },
          padding: { x: { token: "spacing.md" } },
          borderRadius: { token: "radius.sm" },
          boxSizing: "border-box",
        },
        style: {
          background: { token: "color.surface-primary" },
          border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
          cursor: "pointer",
        },
        interactive: { type: "button" },
        children: [
          // Card icon placeholder
          {
            key: "card-icon",
            tag: "div",
            layout: { display: "flex", align: "center", justify: "center", width: 32, height: 20, borderRadius: { token: "radius.xs" }, flexShrink: 0 },
            style: { background: "#1A1F71" },
            children: [{ key: "visa-text", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: "VISA", style: "label-xs", weight: 700, color: { token: "color.brand-white" } } }],
          },
          { key: "card-number", tag: "span", layout: { display: "block", flex: "1" }, style: {}, text: { content: `**** ${cardLast4}`, style: "paragraph-md", color: { token: "color.text-primary" }, editable: true } },
          { key: "card-chevron", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_CHEVRON } },
        ],
      },
      // Pay button
      {
        key: "pay-btn",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "center", width: "100%", height: { token: "height.xl" }, borderRadius: { token: "radius.full" } },
        style: { background: { token: "color.button-primary" }, cursor: "pointer" },
        interactive: { type: "button" },
        text: { content: `Pay ${amount}`, style: "label-lg", weight: 600, color: { token: "color.text-on-brand" }, align: "center", editable: true },
      },
    ],
  };
}
