// ============================================================
// Dialog — Pixel-perfect from Figma 3.0
// ============================================================
// White bg, 1px solid #DCDCE1 border, 16px radius
// Padding: 20px horizontal, 24px vertical, 32px gap
// Visualization: dark bg (#111111), 3:4 aspect ratio
// Headline: KH Teka 24px/36px, weight 400, center, #2D2D32
// Body: KH Teka 16px/24px, weight 400, center, #737378
// Buttons: vertical, 12px gap, primary + tertiary
// ============================================================

import type { ComponentSpec } from "../../spec/types";

export function dialogTemplate(props?: Record<string, unknown>): ComponentSpec {
  const title = (props?.title as string) ?? (props?.label as string) ?? "Confirm the 30-day NGN 7650 auto top-up for Buyaka";
  const body = (props?.body as string) ?? "Would you like to set up an auto top-up for Buyaka with NGN 7650 every 30 days? You can cancel anytime you want.";
  const primaryLabel = (props?.primaryLabel as string) ?? "Yes, activate";
  const secondaryLabel = (props?.secondaryLabel as string) ?? "No, cancel";
  const showVisualization = props?.showVisualization !== false;

  const contentChildren: ComponentSpec[] = [];

  // Visualization area — dark bg, 3:4 aspect ratio placeholder
  if (showVisualization) {
    contentChildren.push({
      key: "visualization",
      tag: "div",
      layout: {
        display: "flex",
        align: "center",
        justify: "center",
        width: "100%",
        height: 0,
        borderRadius: "12px",
        overflow: "hidden",
      },
      style: {
        background: "#111111",
      },
      // 3:4 aspect ratio via padding-bottom trick is handled by renderer;
      // providing the spec node for the area
    });
  }

  // Headline
  contentChildren.push({
    key: "title",
    tag: "div",
    layout: { display: "block", width: "100%" },
    style: {
      textAlign: "center",
      fontSize: 24,
      letterSpacing: "0.02em",
      lineHeight: "36px",
      fontFamily: "'KH Teka'",
    },
    text: {
      content: title,
      style: "headline-sm",
      weight: 400,
      color: { token: "color.text-primary" },
      align: "center",
      editable: true,
    },
  });

  // Body
  contentChildren.push({
    key: "body",
    tag: "div",
    layout: { display: "block", width: "100%" },
    style: {
      textAlign: "center",
      fontSize: 16,
      letterSpacing: "0.02em",
      lineHeight: "24px",
      fontFamily: "'KH Teka'",
    },
    text: {
      content: body,
      style: "paragraph-md",
      weight: 400,
      color: { token: "color.text-secondary" },
      align: "center",
      editable: true,
    },
  });

  // Button combo — vertical, 12px gap
  contentChildren.push({
    key: "button-combo",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: { token: "spacing.sm" },
      width: "100%",
    },
    style: {},
    children: [
      // Primary button — red bg, white text, lg
      {
        key: "btn-primary",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          width: "100%",
          height: 64,
          borderRadius: { token: "radius.xxl" },
          padding: { x: "32px" },
          boxSizing: "border-box",
        },
        style: {
          background: { token: "color.surface-button-primary" },
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
            text: { content: primaryLabel, style: "label-xl", weight: 400, color: { token: "color.text-white-constant" }, align: "center", editable: true },
          },
        ],
      },
      // Tertiary button — transparent bg, text only
      {
        key: "btn-tertiary",
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
          background: "transparent",
          cursor: "pointer",
          fontFamily: "'KH Teka'",
          fontSize: 16,
          letterSpacing: "0.02em",
          lineHeight: "16px",
        },
        interactive: { type: "button" },
        children: [
          {
            key: "ter-label",
            tag: "span",
            layout: { display: "inline-flex" },
            style: { letterSpacing: "0.02em", lineHeight: "16px" },
            text: { content: secondaryLabel, style: "label-md", weight: 400, color: { token: "color.text-primary" }, align: "center", editable: true },
          },
        ],
      },
    ],
  });

  return {
    key: "dialog",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      align: "center",
      gap: "32px",
      padding: { top: "24px", bottom: "24px", left: { token: "spacing.lg" }, right: { token: "spacing.lg" } },
      borderRadius: { token: "radius.lg" },
      maxWidth: 406,
      boxSizing: "border-box",
      overflow: "hidden",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
      fontFamily: "'KH Teka'",
    },
    data: { component: "dialog" },
    children: contentChildren,
  };
}
