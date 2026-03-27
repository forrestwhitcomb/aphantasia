// Service Type Card — Icon + title + description button
// Figma: 5405:107036 — 358×120

import type { ComponentSpec } from "../../spec/types";

const ICON_CALLING = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-default)" stroke-width="1.5" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.07 8.63 2 2 0 0 1 5.11 2h3a2 2 0 0 1 2 1.72c.13.97.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.84.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

export function serviceTypeTemplate(props?: Record<string, unknown>): ComponentSpec {
  const title = (props?.title as string) ?? (props?.label as string) ?? "International calling";
  const ctaLabel = (props?.ctaLabel as string) ?? "Get started with international calling";
  const iconSvg = (props?.iconSvg as string) ?? ICON_CALLING;

  return {
    key: "service-type",
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
    style: { background: { token: "color.surface-primary" } },
    data: { component: "serviceType" },
    children: [
      // Icon + title row
      {
        key: "header",
        tag: "div",
        layout: { display: "flex", align: "center", gap: { token: "spacing.sm" } },
        style: {},
        children: [
          { key: "icon", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: iconSvg } },
          { key: "title", tag: "span", layout: { display: "block" }, style: {}, text: { content: title, style: "headline-xs", weight: 600, color: { token: "color.text-primary" }, editable: true } },
        ],
      },
      // CTA pill
      {
        key: "cta",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          width: "100%",
          height: { token: "height.md" },
          borderRadius: { token: "radius.full" },
        },
        style: {
          background: { token: "color.surface-light" },
          cursor: "pointer",
        },
        interactive: { type: "button" },
        text: { content: ctaLabel, style: "paragraph-sm", weight: 400, color: { token: "color.text-primary" }, align: "center", editable: true },
      },
    ],
  };
}
