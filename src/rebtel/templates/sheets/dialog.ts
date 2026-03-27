// Dialog Popup — Centered card with title, body, primary + secondary buttons
// Figma: 5405:106106 — 406×344

import type { ComponentSpec } from "../../spec/types";

export function dialogTemplate(props?: Record<string, unknown>): ComponentSpec {
  const title = (props?.title as string) ?? (props?.label as string) ?? "Confirm the 30-day NGN 7650 auto top-up for Buyaka";
  const body = (props?.body as string) ?? "Would you like to set up an auto top-up for Buyaka with NGN 7650 every 30 days? You can cancel anytime you want.";
  const primaryLabel = (props?.primaryLabel as string) ?? "Yes, activate";
  const secondaryLabel = (props?.secondaryLabel as string) ?? "No, cancel";

  return {
    key: "dialog",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      align: "center",
      gap: { token: "spacing.lg" },
      padding: { all: { token: "spacing.xxl" } },
      borderRadius: { token: "radius.xl" },
      maxWidth: 406,
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      shadow: { token: "shadow.lg" },
    },
    data: { component: "dialog" },
    children: [
      // Title
      {
        key: "title",
        tag: "div",
        layout: { display: "block", width: "100%" },
        style: {},
        text: { content: title, style: "headline-sm", weight: 700, color: { token: "color.text-primary" }, align: "center", editable: true },
      },
      // Body
      {
        key: "body",
        tag: "div",
        layout: { display: "block", width: "100%" },
        style: {},
        text: { content: body, style: "paragraph-sm", color: { token: "color.text-secondary" }, align: "center", editable: true },
      },
      // Primary button
      {
        key: "btn-primary",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "center", width: "100%", height: { token: "height.lg" }, borderRadius: { token: "radius.full" } },
        style: { background: { token: "color.grey-900" }, cursor: "pointer" },
        interactive: { type: "button" },
        text: { content: primaryLabel, style: "label-md", weight: 600, color: { token: "color.brand-white" }, align: "center", editable: true },
      },
      // Secondary button (text only)
      {
        key: "btn-secondary",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "center", width: "100%", height: { token: "height.md" } },
        style: { cursor: "pointer" },
        interactive: { type: "button" },
        text: { content: secondaryLabel, style: "paragraph-sm", weight: 500, color: { token: "color.text-primary" }, align: "center", editable: true },
      },
    ],
  };
}
