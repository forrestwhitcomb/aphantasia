// ============================================================
// Loading State — Pixel-perfect from Figma 3.0
// ============================================================
// Container: flex column, align center, justify center,
//   padding 32px, gap 16px
// Spinner: 48x48, CSS border trick (animated circle)
// Text: KH Teka 16px, center, color #737378
// ============================================================

import type { ComponentSpec } from "../../spec/types";

// CSS spinner via border trick: 48x48 circle with 3px border
// Top border is #E31B3B (brand red), rest is #F3F3F3
const SPINNER_SVG = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="#F3F3F3" stroke-width="3"/><path d="M44 24c0-11.046-8.954-20-20-20" stroke="#E31B3B" stroke-width="3" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="1s" repeatCount="indefinite"/></path></svg>`;

export function loadingTemplate(props?: Record<string, unknown>): ComponentSpec {
  const text = (props?.text as string) ?? (props?.label as string) ?? "";

  const children: ComponentSpec[] = [
    // Spinner: 48x48
    {
      key: "spinner",
      tag: "div",
      layout: {
        display: "flex",
        align: "center",
        justify: "center",
        width: 48,
        height: 48,
        flexShrink: 0,
      },
      style: {},
      data: { innerHTML: SPINNER_SVG },
    },
  ];

  // Optional text label
  if (text) {
    children.push({
      key: "loading-text",
      tag: "span",
      layout: { display: "block" },
      style: {
        textAlign: "center",
        fontFamily: "'KH Teka'",
        fontSize: 16,
        letterSpacing: "0.02em",
        lineHeight: "22px",
      },
      text: {
        content: text,
        style: "paragraph-md",
        weight: 400,
        color: { token: "color.text-secondary" },
        align: "center",
        editable: true,
      },
    });
  }

  return {
    key: "loading-state",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      align: "center",
      justify: "center",
      width: "100%",
      padding: { all: { token: "spacing.xxl" } },
      gap: { token: "spacing.md" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      fontFamily: "'KH Teka'",
    },
    data: { component: "loadingState" },
    children,
  };
}
