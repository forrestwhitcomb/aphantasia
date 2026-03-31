// ============================================================
// Product Card — Figma-verified from node 165:30949
// ============================================================
// Variant: Collapsed / No Discount (default for AI generation)
// Container: White fill, 1px border, 12px radius, 16px padding, 12px gap
// Tags: Label/Black pill instances with star icon
// Features: Label/White pill instances without icon
// CTA: info icon button + Primary sm button
// ============================================================

import type { ComponentSpec } from "../../spec/types";

const ICON_INFO = `<svg width="7" height="14" viewBox="0 0 7 14" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="3.5" cy="3" r="0.5"/><line x1="3.5" y1="6" x2="3.5" y2="11"/></svg>`;

// Inline label pill helper — avoids circular import
function tagPill(key: string, text: string, variant: "dark" | "white"): ComponentSpec {
  const isDark = variant === "dark";
  return {
    key,
    tag: "div",
    layout: {
      display: "inline-flex",
      align: "center",
      justify: "center",
      height: 24,
      padding: { x: "8px" },
      gap: "4px",
      borderRadius: "4px",
      overflow: "hidden",
    },
    style: {
      background: isDark ? { token: "color.feedback-label-dark" } : { token: "color.surface-primary" },
      border: isDark ? undefined : { width: "1px", style: "solid", color: { token: "color.border-default" } },
      fontFamily: "'KH Teka'",
      fontSize: "14px",
      letterSpacing: "0.02em",
      lineHeight: "14px",
    },
    children: [
      ...(isDark
        ? [
            {
              key: `${key}-icon`,
              tag: "div" as const,
              layout: { display: "flex" as const, align: "center" as const, justify: "center" as const, width: 12, height: 12, flexShrink: 0 },
              style: {},
              data: { innerHTML: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.545 3.13L11 4.635 8.5 7.07l.59 3.43L6 8.885 2.91 10.5l.59-3.43L1 4.635l3.455-.505L6 1z" fill="#FFFFFF"/></svg>` },
            },
          ]
        : []),
      {
        key: `${key}-text`,
        tag: "span",
        layout: { display: "inline-flex" },
        style: { letterSpacing: "0.02em", lineHeight: "14px" },
        text: {
          content: text,
          style: "label-sm" as const,
          weight: 400,
          color: isDark ? { token: "color.text-white-constant" } : { token: "color.text-secondary" },
        },
      },
    ],
  };
}

export function productCardTemplate(props?: Record<string, unknown>): ComponentSpec {
  const title = (props?.title as string) ?? (props?.label as string) ?? "7GB Nigeria";
  const tags = (props?.tags as string[]) ?? ["Most popular", "Carrier Bonus"];
  const features = (props?.features as string[]) ?? ["11 GB data", "Unlimited calling", "20 SMS"];
  const price = (props?.price as string) ?? "$3.21";
  const validity = (props?.validity as string) ?? "30 days";
  const ctaLabel = (props?.ctaLabel as string) ?? "Continue";

  return {
    key: "product-card",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: { token: "spacing.sm" },
      padding: { all: { token: "spacing.md" } },
      borderRadius: { token: "radius.md" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    data: { component: "productCard" },
    children: [
      // Properties section
      {
        key: "properties",
        tag: "div",
        layout: { display: "flex", direction: "column", gap: { token: "spacing.xs" } },
        style: {},
        children: [
          // Tags row
          {
            key: "tags-row",
            tag: "div",
            layout: { display: "flex", gap: "4px", flexWrap: "wrap" },
            style: {},
            children: tags.map((t, i) => tagPill(`tag-${i}`, t, "dark")),
          },
          // Title + features frame
          {
            key: "title-frame",
            tag: "div",
            layout: { display: "flex", direction: "column", gap: "2px" },
            style: {},
            children: [
              {
                key: "title",
                tag: "div",
                layout: { display: "block", width: "100%" },
                style: { fontSize: "18px", lineHeight: "28px", letterSpacing: "0.02em" },
                text: {
                  content: title,
                  style: "paragraph-lg",
                  weight: 400,
                  color: { token: "color.text-primary" },
                  editable: true,
                },
              },
              // Features row
              {
                key: "features-row",
                tag: "div",
                layout: { display: "flex", gap: "4px", flexWrap: "wrap" },
                style: {},
                children: features.map((f, i) => tagPill(`feature-${i}`, f, "white")),
              },
            ],
          },
        ],
      },
      // Price section
      {
        key: "price-section",
        tag: "div",
        layout: { display: "flex", direction: "column", gap: { token: "spacing.xs" } },
        style: {},
        children: [
          // Price + validity row
          {
            key: "price-row",
            tag: "div",
            layout: { display: "flex", justify: "space-between" },
            style: {},
            children: [
              // Left: You pay + price
              {
                key: "price-left",
                tag: "div",
                layout: { display: "flex", direction: "column", flex: "1" },
                style: {},
                children: [
                  {
                    key: "you-pay",
                    tag: "span",
                    layout: { display: "block" },
                    style: { letterSpacing: "0.02em", lineHeight: "14px" },
                    text: { content: "You pay", style: "label-sm", weight: 400, color: { token: "color.text-secondary" } },
                  },
                  {
                    key: "price-value",
                    tag: "div",
                    layout: { display: "block" },
                    style: { fontSize: "18px", lineHeight: "28px", letterSpacing: "0.02em" },
                    text: { content: price, style: "paragraph-lg", weight: 400, color: { token: "color.text-primary" }, editable: true },
                  },
                ],
              },
              // Right: Validity
              {
                key: "price-right",
                tag: "div",
                layout: { display: "flex", direction: "column", align: "end", flex: "1" },
                style: {},
                children: [
                  {
                    key: "validity-label",
                    tag: "span",
                    layout: { display: "block" },
                    style: { letterSpacing: "0.02em", lineHeight: "14px", textAlign: "right" },
                    text: { content: "Validity", style: "label-sm", weight: 400, color: { token: "color.text-secondary" }, align: "right" },
                  },
                  {
                    key: "validity-value",
                    tag: "div",
                    layout: { display: "block" },
                    style: { fontSize: "18px", lineHeight: "28px", letterSpacing: "0.02em", textAlign: "right" },
                    text: { content: validity, style: "paragraph-lg", weight: 400, color: { token: "color.text-primary" }, align: "right", editable: true },
                  },
                ],
              },
            ],
          },
          // CTA row
          {
            key: "cta-row",
            tag: "div",
            layout: { display: "flex", gap: { token: "spacing.xs" }, align: "center" },
            style: {},
            children: [
              // Info icon button
              {
                key: "info-btn",
                tag: "div",
                layout: {
                  display: "flex",
                  align: "center",
                  justify: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "24px",
                  flexShrink: 0,
                },
                style: {
                  background: { token: "color.surface-primary" },
                  border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
                  cursor: "pointer",
                },
                interactive: { type: "button" },
                data: { innerHTML: ICON_INFO },
              },
              // Primary CTA
              {
                key: "cta-btn",
                tag: "button",
                layout: {
                  display: "flex",
                  flex: "1",
                  align: "center",
                  justify: "center",
                  height: 40,
                  borderRadius: "24px",
                  boxSizing: "border-box",
                },
                style: {
                  background: { token: "color.surface-button-primary" },
                  cursor: "pointer",
                  border: { width: "0", style: "none", color: "transparent" },
                  fontFamily: "'KH Teka'",
                  fontSize: "14px",
                  letterSpacing: "0.02em",
                  lineHeight: "14px",
                },
                interactive: { type: "button" },
                text: { content: ctaLabel, style: "label-sm", weight: 400, color: { token: "color.text-white-constant" }, editable: true },
              },
            ],
          },
        ],
      },
    ],
  };
}
