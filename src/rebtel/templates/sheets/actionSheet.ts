// ============================================================
// Action Sheet — Pixel-perfect from Figma 3.0
// ============================================================
// Bottom sheet with handle, title, optional subtitle, and 1-2 buttons
// Container: white bg, border-radius 24px top, padding 16px horizontal,
//   8px top, 20px gap between content and buttons
// Title: KH Teka 20px/32px, weight 400, #2D2D32, center, 0.02em
// Buttons: radius 32px, height 64px (lg)
// ============================================================

import type { ComponentSpec } from "../../spec/types";

const ICON_MINUTES = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D2D32" stroke-width="1.5" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.07 8.63 2 2 0 0 1 5.11 2h3a2 2 0 0 1 2 1.72c.13.97.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.84.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

function sheetHandle(): ComponentSpec {
  return {
    key: "handle",
    tag: "div",
    layout: { display: "flex", justify: "center", padding: { y: "8px" } },
    style: {},
    children: [{
      key: "handle-bar",
      tag: "div",
      layout: { display: "block", width: 36, height: 4, borderRadius: "9999px" },
      style: { background: "#DCDCE1" },
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
      gap: "12px",
      padding: { all: "16px" },
      borderRadius: "12px",
      boxSizing: "border-box",
      width: "100%",
    },
    style: {
      background: "#FAFAFC",
    },
    children: [
      {
        key: "info-icon",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "center", width: 24, height: 24, flexShrink: 0, overflow: "hidden" },
        style: {},
        data: { innerHTML: ICON_MINUTES },
      },
      {
        key: "info-text",
        tag: "div",
        layout: { display: "flex", direction: "column", flex: "1", gap: "2px" },
        style: {},
        children: [
          {
            key: "info-title",
            tag: "span",
            layout: { display: "block" },
            style: { letterSpacing: "0.02em", lineHeight: "20px" },
            text: { content: title, style: "paragraph-sm", weight: 400, color: "#2D2D32", editable: true },
          },
          {
            key: "info-subtitle",
            tag: "span",
            layout: { display: "block" },
            style: { letterSpacing: "0.02em", lineHeight: "16px" },
            text: { content: subtitle, style: "paragraph-xs", weight: 400, color: "#737378", editable: true },
          },
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
      layout: { display: "flex", justify: "center", width: "100%" },
      style: { textAlign: "center", letterSpacing: "0.02em", lineHeight: "32px" },
      text: {
        content: title,
        style: "label-xl",
        weight: 400,
        color: "#2D2D32",
        align: "center",
        editable: true,
      },
    },
    // Info card
    infoCard(infoTitle, infoSubtitle),
    // Primary button — black bg, white text, lg size
    {
      key: "btn-primary",
      tag: "div",
      layout: {
        display: "flex",
        align: "center",
        justify: "center",
        width: "100%",
        height: 64,
        borderRadius: "32px",
        padding: { x: "32px" },
        boxSizing: "border-box",
      },
      style: {
        background: "#111111",
        cursor: "pointer",
        fontFamily: "'KH Teka'",
        fontSize: 20,
        letterSpacing: "0.02em",
        lineHeight: "20px",
      },
      interactive: { type: "button" },
      children: [
        {
          key: "pri-label",
          tag: "span",
          layout: { display: "inline-flex" },
          style: { letterSpacing: "0.02em", lineHeight: "20px" },
          text: { content: primaryLabel, style: "label-xl", weight: 400, color: "#FFFFFF", align: "center", editable: true },
        },
      ],
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
        gap: "8px",
        width: "100%",
        height: 64,
        borderRadius: "32px",
        padding: { x: "32px" },
        boxSizing: "border-box",
      },
      style: {
        background: "#FFFFFF",
        border: { width: "1px", style: "solid", color: "#DCDCE1" },
        cursor: "pointer",
        fontFamily: "'KH Teka'",
        fontSize: 20,
        letterSpacing: "0.02em",
        lineHeight: "20px",
      },
      interactive: { type: "button" },
      children: [
        {
          key: "sec-icon",
          tag: "div",
          layout: { display: "flex", align: "center", justify: "center", width: 24, height: 24, overflow: "hidden", flexShrink: 0 },
          style: {},
          data: { innerHTML: ICON_MINUTES },
        },
        {
          key: "sec-label",
          tag: "span",
          layout: { display: "inline-flex" },
          style: { letterSpacing: "0.02em", lineHeight: "20px" },
          text: { content: secondaryLabel, style: "label-xl", weight: 400, color: "#2D2D32", editable: true },
        },
      ],
    });
  }

  // Home indicator
  children.push({
    key: "home-indicator",
    tag: "div",
    layout: { display: "flex", justify: "center", padding: { y: "8px" } },
    style: {},
    children: [{
      key: "indicator-bar",
      tag: "div",
      layout: { display: "block", width: 134, height: 5, borderRadius: "9999px" },
      style: { background: "#111111" },
    }],
  });

  return {
    key: "action-sheet",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: "20px",
      width: "100%",
      padding: { left: "16px", right: "16px", top: "8px", bottom: "8px" },
      borderRadius: "24px",
      boxSizing: "border-box",
    },
    style: {
      background: "#FFFFFF",
      fontFamily: "'KH Teka'",
    },
    data: { component: "actionSheet" },
    children,
  };
}
