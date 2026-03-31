// ============================================================
// Payment Module — Figma-verified from node 191:6210
// ============================================================
// Default variant: 390×248, vertical flex, gap 10
// Padding: top 24, left 16, bottom 52, right 16
// Credits row: "Use Rebtel Credits" + inline toggle (46×24)
// Payment dropdown: Visa icon + "**** 1000" + chevron (52px)
// CTA: Primary button 64px red "Pay $5"
// ============================================================

import type { ComponentSpec } from "../../spec/types";

const ICON_CHEVRON_RIGHT = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#2D2D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_INFO_SM = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#B9B9BE" stroke-width="1.2"/><line x1="12" y1="10" x2="12" y2="16" stroke="#B9B9BE" stroke-width="1.2" stroke-linecap="round"/><circle cx="12" cy="7.5" r="0.5" fill="#B9B9BE"/></svg>`;
const ICON_VISA = `<svg width="28" height="18" viewBox="0 0 28 18" fill="none"><rect width="28" height="18" rx="2" fill="#1434CB"/><text x="14" y="12" text-anchor="middle" font-size="7" font-weight="700" fill="#FFFFFF" font-family="sans-serif">VISA</text></svg>`;

function inlineToggle(key: string, isOn: boolean): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      width: 46,
      height: 24,
      borderRadius: "12px",
      padding: { all: "2px" },
      boxSizing: "border-box",
      flexShrink: 0,
    },
    style: {
      background: isOn ? { token: "color.brand-black" } : { token: "color.border-default" },
      cursor: "pointer",
    },
    interactive: { type: "toggle" },
    children: [
      ...(isOn
        ? [{
            key: `${key}-spacer`,
            tag: "div" as const,
            layout: { display: "block" as const, flex: "1" },
            style: {},
          }]
        : []),
      {
        key: `${key}-thumb`,
        tag: "div",
        layout: { display: "block", width: 20, height: 20, borderRadius: "50%", flexShrink: 0 },
        style: { background: { token: "color.surface-light" } },
      },
    ],
  };
}

export function paymentModuleTemplate(props?: Record<string, unknown>): ComponentSpec {
  const cardLast4 = (props?.cardLast4 as string) ?? "1000";
  const cardType = (props?.cardType as string) ?? "Visa";
  const creditsBalance = (props?.creditsBalance as string) ?? "$1.24";
  const ctaLabel = (props?.ctaLabel as string) ?? (props?.label as string) ?? "Pay $5";
  const useCredits = (props?.useCredits as boolean) ?? false;

  return {
    key: "payment-module",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: "10px",
      padding: { top: "24px", left: "16px", bottom: "52px", right: "16px" },
      boxSizing: "border-box",
      width: "100%",
    },
    style: {
      background: { token: "color.surface-primary" },
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    data: { component: "paymentModule" },
    children: [
      // Inner content frame
      {
        key: "pm-content",
        tag: "div",
        layout: { display: "flex", direction: "column", gap: { token: "spacing.md" } },
        style: {},
        children: [
          // Credits toggle row
          {
            key: "credits-row",
            tag: "div",
            layout: { display: "flex", align: "center", justify: "space-between", gap: { token: "spacing.xs" } },
            style: {},
            children: [
              {
                key: "credits-label",
                tag: "span",
                layout: { display: "block" },
                style: { letterSpacing: "0.02em", lineHeight: "16px" },
                text: { content: "Use Rebtel Credits", style: "paragraph-md", weight: 400, color: { token: "color.text-secondary" } },
              },
              {
                key: "credits-right",
                tag: "div",
                layout: { display: "flex", align: "center", gap: { token: "spacing.xs" } },
                style: {},
                children: [
                  {
                    key: "credits-amount",
                    tag: "span",
                    layout: { display: "inline-flex" },
                    style: { letterSpacing: "0.02em", lineHeight: "16px" },
                    text: { content: creditsBalance, style: "paragraph-md", weight: 400, color: { token: "color.text-secondary" } },
                  },
                  inlineToggle("credits-toggle", useCredits),
                  {
                    key: "credits-info",
                    tag: "div",
                    layout: { display: "flex", align: "center", justify: "center", width: 24, height: 24, flexShrink: 0 },
                    style: {},
                    data: { innerHTML: ICON_INFO_SM },
                  },
                ],
              },
            ],
          },
          // Payment dropdown
          {
            key: "payment-dropdown",
            tag: "div",
            layout: {
              display: "flex",
              align: "center",
              height: 52,
              gap: { token: "spacing.sm" },
              width: "100%",
              padding: { left: { token: "spacing.sm" }, right: { token: "spacing.sm" } },
              borderRadius: { token: "radius.md" },
              boxSizing: "border-box",
            },
            style: {
              background: { token: "color.surface-light" },
              cursor: "pointer",
            },
            interactive: { type: "button" },
            children: [
              // Card icon
              {
                key: "card-icon",
                tag: "div",
                layout: { display: "flex", align: "center", justify: "center", width: 32, height: 32, flexShrink: 0 },
                style: {},
                data: { innerHTML: ICON_VISA },
              },
              // Card number
              {
                key: "card-number",
                tag: "span",
                layout: { display: "block", flex: "1" },
                style: { letterSpacing: "0.02em", lineHeight: "16px" },
                text: { content: `**** ${cardLast4}`, style: "paragraph-md", weight: 400, color: { token: "color.text-primary" }, editable: true },
              },
              // Chevron
              {
                key: "card-chevron",
                tag: "div",
                layout: { display: "flex", align: "center", justify: "center", width: 24, height: 24, flexShrink: 0 },
                style: {},
                data: { innerHTML: ICON_CHEVRON_RIGHT },
              },
            ],
          },
          // Pay CTA
          {
            key: "pay-btn",
            tag: "button",
            layout: {
              display: "flex",
              align: "center",
              justify: "center",
              height: 64,
              width: "100%",
              borderRadius: "24px",
              boxSizing: "border-box",
            },
            style: {
              background: { token: "color.surface-button-primary" },
              cursor: "pointer",
              border: { width: "0", style: "none", color: "transparent" },
              fontFamily: "'KH Teka'",
              fontSize: "20px",
              letterSpacing: "0.02em",
              lineHeight: "20px",
            },
            interactive: { type: "button" },
            text: { content: ctaLabel, style: "label-xl", weight: 400, color: { token: "color.text-white-constant" }, editable: true },
          },
        ],
      },
    ],
  };
}
