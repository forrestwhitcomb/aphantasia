// ============================================================
// Product Credits Card — Pixel-perfect from Figma 3.0
// ============================================================
// Figma: 5405:106657 — 361×335
// White bg, radius 16px, 1px solid #DCDCE1, padding 24px
// Amount pills: 40px height, 12px radius, 12px horizontal padding
// Rate numbers: Pano 32px (700)
// Font: KH Teka Regular (400), Bold (700)
// Letter-spacing: 0.02em everywhere
// ============================================================

import type { ComponentSpec } from "../../spec/types";

function amountPill(key: string, amount: string, selected: boolean): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      height: 40,
      padding: { x: "12px" },
      borderRadius: { token: "radius.md" },
      boxSizing: "border-box",
    },
    style: {
      background: selected ? { token: "color.surface-button-secondary-black" } : { token: "color.surface-primary" },
      border: selected ? undefined : { width: "1px", style: "solid", color: { token: "color.border-default" } },
      cursor: "pointer",
      fontFamily: "'KH Teka'",
      fontSize: "16px",
      letterSpacing: "0.02em",
      lineHeight: "16px",
    },
    interactive: { type: "button" },
    text: { content: amount, style: "label-md", weight: 600, color: selected ? { token: "color.text-white-constant" } : { token: "color.text-primary" }, editable: true },
  };
}

function rateColumn(key: string, minutes: string, type: string, rate: string): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      align: "center",
      flex: "1",
      gap: "4px",
      padding: { y: "16px" },
    },
    style: {},
    children: [
      {
        key: `${key}-min`,
        tag: "span",
        layout: { display: "block" },
        style: {
          fontSize: "32px",
          fontFamily: "'Pano'",
          letterSpacing: "0.02em",
          lineHeight: "36px",
          textAlign: "center",
        },
        text: { content: minutes, style: "display-md", weight: 700, color: { token: "color.text-primary" }, align: "center", editable: true },
      },
      {
        key: `${key}-type`,
        tag: "span",
        layout: { display: "block" },
        style: { fontSize: "14px", letterSpacing: "0.02em", lineHeight: "18px", textAlign: "center" },
        text: { content: type, style: "paragraph-sm", color: { token: "color.text-secondary" }, align: "center" },
      },
      {
        key: `${key}-rate`,
        tag: "span",
        layout: { display: "block" },
        style: { fontSize: "12px", letterSpacing: "0.02em", lineHeight: "14px", textAlign: "center" },
        text: { content: rate, style: "paragraph-xs", color: { token: "color.text-tertiary" }, align: "center" },
      },
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
      padding: { all: { token: "spacing.xl" } },
      borderRadius: { token: "radius.lg" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    data: { component: "productCredits" },
    children: [
      // Subtitle
      {
        key: "subtitle",
        tag: "span",
        layout: { display: "block" },
        style: { fontSize: "12px", letterSpacing: "0.02em", lineHeight: "14px", textAlign: "center" },
        text: { content: "Pay as you go", style: "paragraph-xs", color: { token: "color.text-tertiary" }, align: "center" },
      },
      // Title
      {
        key: "title",
        tag: "div",
        layout: { display: "block" },
        style: { fontSize: "18px", letterSpacing: "0.02em", lineHeight: "22px", textAlign: "center" },
        text: { content: `Rebtel Credits to ${country}`, style: "headline-sm", weight: 700, color: { token: "color.text-primary" }, align: "center", editable: true },
      },
      // Description
      {
        key: "desc",
        tag: "span",
        layout: { display: "block" },
        style: { fontSize: "12px", letterSpacing: "0.02em", lineHeight: "14px", textAlign: "center" },
        text: { content: "Call any mobile or landline at the lowest rate", style: "paragraph-xs", color: { token: "color.text-tertiary" }, align: "center" },
      },
      // Amount pills
      {
        key: "amounts",
        tag: "div",
        layout: { display: "flex", gap: { token: "spacing.xs" }, justify: "center", padding: { y: "4px" } },
        style: {},
        children: amounts.map((a, i) => amountPill(`pill-${i}`, a, a === selected)),
      },
      // Rate display: 2-column with vertical divider
      {
        key: "rates",
        tag: "div",
        layout: { display: "flex", width: "100%" },
        style: {},
        children: [
          rateColumn("mobile", mobileMin, "Mobile", mobileRate),
          // Vertical divider: 1px wide, full height, #DCDCE1
          {
            key: "rate-divider",
            tag: "div",
            layout: { display: "block", width: 1 },
            style: { background: { token: "color.border-default" } },
          },
          rateColumn("landline", landlineMin, "Landline", landlineRate),
        ],
      },
      // Buy now button: full width, height 52px, red bg, white text
      {
        key: "cta",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          width: "100%",
          height: 52,
          borderRadius: { token: "radius.xxl" },
          boxSizing: "border-box",
        },
        style: {
          background: { token: "color.surface-button-primary" },
          cursor: "pointer",
          fontFamily: "'KH Teka'",
          fontSize: "16px",
          letterSpacing: "0.02em",
          lineHeight: "16px",
        },
        interactive: { type: "button" },
        text: { content: ctaLabel, style: "label-md", weight: 400, color: { token: "color.text-white-constant" }, align: "center", editable: true },
      },
    ],
  };
}
