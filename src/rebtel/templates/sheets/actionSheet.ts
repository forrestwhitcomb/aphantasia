// Action Sheet — Bottom sheet with handle, title, info card, buttons
// Figma: 5405:106195 (2 buttons), 5405:106196 (1 button)
// Variants: "two-button" | "one-button"

import type { ComponentSpec } from "../../spec/types";

const ICON_MINUTES = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.07 8.63 2 2 0 0 1 5.11 2h3a2 2 0 0 1 2 1.72c.13.97.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.84.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

function sheetHandle(): ComponentSpec {
  return {
    key: "handle",
    tag: "div",
    layout: { display: "flex", justify: "center", padding: { y: { token: "spacing.xs" } } },
    style: {},
    children: [{
      key: "handle-bar",
      tag: "div",
      layout: { display: "block", width: 36, height: 4, borderRadius: { token: "radius.full" } },
      style: { background: { token: "color.grey-200" } },
    }],
  };
}

function infoCard(title: string, subtitle: string): ComponentSpec {
  return {
    key: "info-card",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      gap: { token: "spacing.sm" },
      padding: { all: { token: "spacing.md" } },
      borderRadius: { token: "radius.md" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-light" },
    },
    children: [
      { key: "info-icon", tag: "div", layout: { display: "flex", flexShrink: 0 }, style: {}, data: { innerHTML: ICON_MINUTES } },
      {
        key: "info-text",
        tag: "div",
        layout: { display: "flex", direction: "column", flex: "1", gap: "2px" },
        style: {},
        children: [
          { key: "info-title", tag: "span", layout: { display: "block" }, style: {}, text: { content: title, style: "paragraph-sm", weight: 500, color: { token: "color.text-primary" }, editable: true } },
          { key: "info-subtitle", tag: "span", layout: { display: "block" }, style: {}, text: { content: subtitle, style: "paragraph-xs", color: { token: "color.text-tertiary" }, editable: true } },
        ],
      },
    ],
  };
}

export function actionSheetTemplate(props?: Record<string, unknown>): ComponentSpec {
  const variant = (props?.variant as string) ?? "two-button";
  const title = (props?.title as string) ?? (props?.label as string) ?? (variant === "two-button" ? "You're low on minutes" : "You're out of minutes");
  const infoTitle = (props?.infoTitle as string) ?? (variant === "two-button" ? "Minutes left: 3 minutes" : "Minutes left: 0 minutes");
  const infoSubtitle = (props?.infoSubtitle as string) ?? "Your minutes include your plans and credits";
  const primaryLabel = (props?.primaryLabel as string) ?? "Add minutes";
  const secondaryLabel = (props?.secondaryLabel as string) ?? "Call anyway";

  const children: ComponentSpec[] = [
    sheetHandle(),
    // Title
    {
      key: "title",
      tag: "div",
      layout: { display: "flex", justify: "center", padding: { y: { token: "spacing.md" } } },
      style: {},
      text: { content: title, style: "headline-sm", weight: 600, color: { token: "color.text-primary" }, align: "center", editable: true },
    },
    // Info card
    infoCard(infoTitle, infoSubtitle),
    // Primary button
    {
      key: "btn-primary",
      tag: "div",
      layout: {
        display: "flex",
        align: "center",
        justify: "center",
        width: "100%",
        height: { token: "height.lg" },
        borderRadius: { token: "radius.full" },
        boxSizing: "border-box",
      },
      style: { background: { token: "color.grey-900" }, cursor: "pointer" },
      interactive: { type: "button" },
      text: { content: primaryLabel, style: "label-md", weight: 600, color: { token: "color.brand-white" }, align: "center", editable: true },
    },
  ];

  // Secondary button (only for two-button variant)
  if (variant === "two-button") {
    children.push({
      key: "btn-secondary",
      tag: "div",
      layout: {
        display: "flex",
        align: "center",
        justify: "center",
        gap: { token: "spacing.xs" },
        width: "100%",
        height: { token: "height.lg" },
        borderRadius: { token: "radius.full" },
        boxSizing: "border-box",
      },
      style: {
        background: { token: "color.surface-primary" },
        border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
        cursor: "pointer",
      },
      interactive: { type: "button" },
      children: [
        { key: "sec-icon", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_MINUTES } },
        { key: "sec-label", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: secondaryLabel, style: "label-md", weight: 500, color: { token: "color.text-primary" }, editable: true } },
      ],
    });
  }

  // Home indicator
  children.push({
    key: "home-indicator",
    tag: "div",
    layout: { display: "flex", justify: "center", padding: { y: { token: "spacing.xs" } } },
    style: {},
    children: [{
      key: "indicator-bar",
      tag: "div",
      layout: { display: "block", width: 134, height: 5, borderRadius: { token: "radius.full" } },
      style: { background: { token: "color.grey-900" } },
    }],
  });

  return {
    key: "action-sheet",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: { token: "spacing.sm" },
      width: "100%",
      padding: { x: { token: "spacing.lg" }, top: { token: "spacing.xs" }, bottom: { token: "spacing.xs" } },
      borderRadius: { token: "radius.xl" },
      boxSizing: "border-box",
    },
    style: { background: { token: "color.surface-primary" } },
    data: { component: "actionSheet" },
    children,
  };
}
