// Welcome Promo Card — Dark card with badges, headline, description, CTA, image
// Figma: 5405:106590 — 358×220

import type { ComponentSpec } from "../../spec/types";

export function promoCardTemplate(props?: Record<string, unknown>): ComponentSpec {
  const badge1 = (props?.badge1 as string) ?? "Welcome offer";
  const badge2 = (props?.badge2 as string) ?? "Subscription";
  const headline = (props?.headline as string) ?? (props?.label as string) ?? "Get started with 7 days of free unlimited calls to USA";
  const description = (props?.description as string) ?? "Then just $12/month. No contract, just connection. Cancel anytime.";
  const ctaLabel = (props?.ctaLabel as string) ?? "Start free trial";

  return {
    key: "promo-card",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: { token: "spacing.sm" },
      width: "100%",
      minHeight: 220,
      padding: { all: { token: "spacing.lg" } },
      borderRadius: { token: "radius.lg" },
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
    },
    style: { background: { token: "color.surface-inverse" } },
    data: { component: "promoCard" },
    children: [
      // Badges
      {
        key: "badges",
        tag: "div",
        layout: { display: "flex", gap: { token: "spacing.xs" } },
        style: {},
        children: [
          {
            key: "badge1",
            tag: "span",
            layout: { display: "inline-flex", padding: { y: "4px", x: { token: "spacing.xs" } }, borderRadius: { token: "radius.xs" } },
            style: { background: "#2DD4BF" },
            text: { content: badge1, style: "label-xs", weight: 600, color: { token: "color.grey-900" }, editable: true },
          },
          {
            key: "badge2",
            tag: "span",
            layout: { display: "inline-flex", padding: { y: "4px", x: { token: "spacing.xs" } }, borderRadius: { token: "radius.xs" } },
            style: { background: { token: "color.grey-700" } },
            text: { content: badge2, style: "label-xs", weight: 600, color: { token: "color.brand-white" }, editable: true },
          },
        ],
      },
      // Headline
      {
        key: "headline",
        tag: "div",
        layout: { display: "block", maxWidth: "65%" },
        style: {},
        text: { content: headline, style: "headline-xs", weight: 700, color: { token: "color.brand-white" }, editable: true },
      },
      // Description
      {
        key: "description",
        tag: "div",
        layout: { display: "block", maxWidth: "60%" },
        style: {},
        text: { content: description, style: "paragraph-xs", color: { token: "color.grey-400" }, editable: true },
      },
      // CTA
      {
        key: "cta",
        tag: "div",
        layout: {
          display: "inline-flex",
          align: "center",
          justify: "center",
          height: { token: "height.sm" },
          padding: { x: { token: "spacing.md" } },
          borderRadius: { token: "radius.full" },
        },
        style: { background: { token: "color.button-primary" }, cursor: "pointer" },
        interactive: { type: "button" },
        text: { content: ctaLabel, style: "label-sm", weight: 600, color: { token: "color.text-on-brand" }, editable: true },
      },
    ],
  };
}
