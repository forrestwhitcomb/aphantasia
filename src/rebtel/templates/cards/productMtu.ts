// ============================================================
// Product MTU Card — Pixel-perfect from Figma 3.0
// ============================================================
// Figma: 5405:106610 — 358×220
// White bg, radius 16px, 1px solid #DCDCE1, padding 16px
// Font: KH Teka Regular (400), Bold (700)
// Letter-spacing: 0.02em everywhere
// ============================================================

import type { ComponentSpec } from "../../spec/types";

function featurePill(key: string, label: string): ComponentSpec {
  return {
    key,
    tag: "span",
    layout: {
      display: "inline-flex",
      padding: { y: "4px", x: "8px" },
      borderRadius: "4px",
    },
    style: {
      background: "#F3F3F3",
      fontFamily: "'KH Teka'",
      fontSize: "11px",
      letterSpacing: "0.02em",
      lineHeight: "11px",
    },
    text: { content: label, style: "label-xs", color: "#737378", editable: true },
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
      gap: "12px",
      width: "100%",
      padding: { all: "16px" },
      borderRadius: "16px",
      boxSizing: "border-box",
    },
    style: {
      background: "#FFFFFF",
      border: { width: "1px", style: "solid", color: "#DCDCE1" },
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    data: { component: "productMtu" },
    children: [
      // Badges row
      {
        key: "badges",
        tag: "div",
        layout: { display: "flex", gap: "8px" },
        style: {},
        children: [
          {
            key: "b1",
            tag: "span",
            layout: { display: "inline-flex", padding: { y: "4px", x: "8px" }, borderRadius: "4px" },
            style: {
              background: "#111111",
              fontFamily: "'KH Teka'",
              fontSize: "11px",
              letterSpacing: "0.02em",
              lineHeight: "11px",
            },
            text: { content: `\u2605 ${badge1}`, style: "label-xs", weight: 600, color: "#FFFFFF" },
          },
          {
            key: "b2",
            tag: "span",
            layout: { display: "inline-flex", padding: { y: "4px", x: "8px" }, borderRadius: "4px" },
            style: {
              background: "#E31B3B",
              fontFamily: "'KH Teka'",
              fontSize: "11px",
              letterSpacing: "0.02em",
              lineHeight: "11px",
            },
            text: { content: `\u2605 ${badge2}`, style: "label-xs", weight: 600, color: "#FFFFFF" },
          },
        ],
      },
      // Product name: KH Teka 16px weight 400, #111111
      {
        key: "name",
        tag: "div",
        layout: { display: "block" },
        style: { fontSize: "16px", letterSpacing: "0.02em", lineHeight: "20px" },
        text: { content: name, style: "paragraph-md", weight: 400, color: "#111111", editable: true },
      },
      // Feature pills
      {
        key: "features",
        tag: "div",
        layout: { display: "flex", gap: "8px", flexWrap: "wrap" },
        style: {},
        children: features.map((f, i) => featurePill(`feat-${i}`, f)),
      },
      // Price row: flex row, space-between
      {
        key: "price-row",
        tag: "div",
        layout: { display: "flex", align: "end", justify: "space-between", padding: { top: "4px" } },
        style: {},
        children: [
          {
            key: "price-col",
            tag: "div",
            layout: { display: "flex", direction: "column", gap: "2px" },
            style: {},
            children: [
              {
                key: "price-label",
                tag: "span",
                layout: { display: "block" },
                style: { letterSpacing: "0.02em", lineHeight: "14px" },
                text: { content: "You pay", style: "paragraph-xs", color: "#737378" },
              },
              {
                key: "price-value",
                tag: "span",
                layout: { display: "block" },
                style: { fontSize: "20px", letterSpacing: "0.02em", lineHeight: "24px" },
                text: { content: price, style: "headline-md", weight: 700, color: "#111111", editable: true },
              },
            ],
          },
          {
            key: "validity-col",
            tag: "div",
            layout: { display: "flex", direction: "column", align: "end", gap: "2px" },
            style: {},
            children: [
              {
                key: "validity-label",
                tag: "span",
                layout: { display: "block" },
                style: { letterSpacing: "0.02em", lineHeight: "14px", textAlign: "right" },
                text: { content: "Validity", style: "paragraph-xs", color: "#737378", align: "right" },
              },
              {
                key: "validity-value",
                tag: "span",
                layout: { display: "block" },
                style: { fontSize: "14px", letterSpacing: "0.02em", lineHeight: "18px", textAlign: "right" },
                text: { content: validity, style: "paragraph-sm", weight: 400, color: "#737378", align: "right", editable: true },
              },
            ],
          },
        ],
      },
      // Bottom row: info circle + Select CTA
      {
        key: "action-row",
        tag: "div",
        layout: { display: "flex", align: "center", gap: "12px", padding: { top: "4px" } },
        style: {},
        children: [
          // Info button (32×32 circle)
          {
            key: "info-btn",
            tag: "div",
            layout: {
              display: "flex",
              align: "center",
              justify: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              flexShrink: 0,
            },
            style: { background: "#F3F3F3", cursor: "pointer" },
            interactive: { type: "button" },
            text: { content: "i", style: "label-sm", weight: 400, color: "#737378", align: "center" },
          },
          // CTA: Select button, flex 1, height 40px, red bg, white text
          {
            key: "cta",
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
              background: "#E31B3B",
              cursor: "pointer",
              fontFamily: "'KH Teka'",
              fontSize: "16px",
              letterSpacing: "0.02em",
              lineHeight: "16px",
            },
            interactive: { type: "button" },
            text: { content: ctaLabel, style: "label-md", weight: 400, color: "#FFFFFF", align: "center", editable: true },
          },
        ],
      },
    ],
  };
}
