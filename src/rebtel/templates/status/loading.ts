// Loading State — Dot spinner animation
// Figma: 5405:107051 — 120×96, 4 dots (1 red, 3 black)

import type { ComponentSpec } from "../../spec/types";

export function loadingTemplate(props?: Record<string, unknown>): ComponentSpec {
  const dotSize = 12;
  return {
    key: "loading-state",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      gap: { token: "spacing.xs" },
      width: "100%",
      minHeight: 96,
      padding: { all: { token: "spacing.lg" } },
      boxSizing: "border-box",
    },
    style: { background: { token: "color.surface-primary" } },
    data: { component: "loadingState" },
    children: [
      { key: "dot-1", tag: "div", layout: { display: "block", width: dotSize, height: dotSize, borderRadius: { token: "radius.full" } }, style: { background: { token: "color.brand-red" } } },
      { key: "dot-2", tag: "div", layout: { display: "block", width: dotSize, height: dotSize, borderRadius: { token: "radius.full" } }, style: { background: { token: "color.grey-900" } } },
      { key: "dot-3", tag: "div", layout: { display: "block", width: dotSize, height: dotSize, borderRadius: { token: "radius.full" } }, style: { background: { token: "color.grey-900" } } },
      { key: "dot-4", tag: "div", layout: { display: "block", width: dotSize, height: dotSize, borderRadius: { token: "radius.full" } }, style: { background: { token: "color.grey-900" } } },
    ],
  };
}
