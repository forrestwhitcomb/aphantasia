// Success State — Full-page confirmation with icon, title, body, CTA
// Figma: 5405:107380 — 390×844

import type { ComponentSpec } from "../../spec/types";

export function successTemplate(props?: Record<string, unknown>): ComponentSpec {
  const title = (props?.title as string) ?? (props?.label as string) ?? "Your top-up is on the way!";
  const body = (props?.body as string) ?? "The top-up you're sending is taking a little longer than expected. We'll let you know as soon as it's been delivered. You can also check on this top-up's status in account activity.";
  const ctaLabel = (props?.ctaLabel as string) ?? "Go to living room";

  return {
    key: "success-state",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      align: "center",
      justify: "space-between",
      width: "100%",
      minHeight: 600,
      padding: { x: { token: "spacing.lg" }, top: { token: "spacing.xxxxl" }, bottom: { token: "spacing.xxl" } },
      boxSizing: "border-box",
    },
    style: { background: { token: "color.surface-primary" } },
    data: { component: "successState" },
    children: [
      // Top spacer
      { key: "spacer-top", tag: "div", layout: { display: "block", flex: "1" }, style: {} },
      // Content group
      {
        key: "content",
        tag: "div",
        layout: { display: "flex", direction: "column", align: "center", gap: { token: "spacing.lg" }, maxWidth: 320 },
        style: {},
        children: [
          // Circle icon
          {
            key: "icon-circle",
            tag: "div",
            layout: {
              display: "flex",
              align: "center",
              justify: "center",
              width: 120,
              height: 120,
              borderRadius: { token: "radius.full" },
            },
            style: {
              border: { width: "4px", style: "solid", color: { token: "color.grey-900" } },
            },
          },
          // Title
          { key: "title", tag: "div", layout: { display: "block" }, style: {}, text: { content: title, style: "headline-md", weight: 700, color: { token: "color.text-primary" }, align: "center", editable: true } },
          // Body
          { key: "body", tag: "div", layout: { display: "block" }, style: {}, text: { content: body, style: "paragraph-sm", color: { token: "color.text-secondary" }, align: "center", editable: true } },
        ],
      },
      // Bottom spacer
      { key: "spacer-bottom", tag: "div", layout: { display: "block", flex: "1" }, style: {} },
      // CTA
      {
        key: "cta",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "center", width: "100%", height: { token: "height.xl" }, borderRadius: { token: "radius.full" } },
        style: { background: { token: "color.grey-900" }, cursor: "pointer" },
        interactive: { type: "button" },
        text: { content: ctaLabel, style: "label-md", weight: 600, color: { token: "color.brand-white" }, align: "center", editable: true },
      },
    ],
  };
}
