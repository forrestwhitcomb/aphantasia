// ============================================================
// Balance Widget — Built from spec
// ============================================================
// Credits balance card for services/home screen
// "Rebtel credits" label + large balance + add credits button
// + two icon cards (International Calling, Mobile Top-up)
// ============================================================

import type { ComponentSpec } from "../../spec/types";

const ICON_PHONE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.21.34 2 .57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const ICON_SEND = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

function iconCard(key: string, iconSvg: string, label: string): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      flex: "1",
      gap: { token: "spacing.sm" },
      padding: { all: { token: "spacing.sm" } },
      borderRadius: { token: "radius.md" },
      boxSizing: "border-box",
    },
    style: {
      border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
      cursor: "pointer",
    },
    interactive: { type: "button" },
    children: [
      // Icon circle
      {
        key: `${key}-icon`,
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          width: 40,
          height: 40,
          borderRadius: "50%",
        },
        style: { background: { token: "color.surface-light" } },
        data: { innerHTML: iconSvg },
      },
      // Label
      {
        key: `${key}-label`,
        tag: "span",
        layout: { display: "block" },
        style: { letterSpacing: "0.02em", lineHeight: "14px" },
        text: { content: label, style: "label-sm", weight: 400, color: { token: "color.text-primary" } },
      },
    ],
  };
}

export function balanceWidgetTemplate(props?: Record<string, unknown>): ComponentSpec {
  const balance = (props?.balance as string) ?? (props?.label as string) ?? "$24.00";
  const showCards = (props?.showCards as boolean) ?? true;

  const children: ComponentSpec[] = [
    // Credits label
    {
      key: "credits-label",
      tag: "span",
      layout: { display: "block" },
      style: { letterSpacing: "0.02em", lineHeight: "14px" },
      text: { content: "Rebtel credits", style: "label-sm", weight: 400, color: { token: "color.text-secondary" } },
    },
    // Balance amount
    {
      key: "balance-amount",
      tag: "div",
      layout: { display: "block" },
      style: {
        fontFamily: "'KH Teka'",
        fontSize: "32px",
        lineHeight: "36px",
        letterSpacing: "0.02em",
      },
      text: {
        content: balance,
        style: "display-md",
        weight: 700,
        color: { token: "color.text-primary" },
        editable: true,
      },
    },
    // Add credits button (ghost style)
    {
      key: "add-credits",
      tag: "div",
      layout: {
        display: "flex",
        align: "center",
        justify: "center",
        height: 40,
        width: "100%",
        borderRadius: "24px",
        boxSizing: "border-box",
      },
      style: {
        background: "transparent",
        cursor: "pointer",
        fontFamily: "'KH Teka'",
        fontSize: "14px",
        letterSpacing: "0.02em",
        lineHeight: "14px",
      },
      interactive: { type: "button" },
      text: { content: "Add credits", style: "label-sm", weight: 400, color: { token: "color.brand-red" }, editable: true },
    },
  ];

  // Icon cards row
  if (showCards) {
    children.push({
      key: "service-cards",
      tag: "div",
      layout: { display: "flex", gap: { token: "spacing.xs" } },
      style: {},
      children: [
        iconCard("card-calling", ICON_PHONE, "International Calling"),
        iconCard("card-topup", ICON_SEND, "Mobile Top-up"),
      ],
    });
  }

  return {
    key: "balance-widget",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: { token: "spacing.sm" },
      width: "100%",
    },
    style: {
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    data: { component: "balanceWidget" },
    children,
  };
}
