// Empty Card — White rounded rect, just a container
// Figma: 5405:106588 — 358×122

import type { ComponentSpec } from "../../spec/types";

export function blankCardTemplate(props?: Record<string, unknown>): ComponentSpec {
  const height = (props?.height as number) ?? 122;
  return {
    key: "blank-card",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      width: "100%",
      minHeight: height,
      padding: { all: { token: "spacing.md" } },
      borderRadius: { token: "radius.lg" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-secondary" } },
    },
    data: { component: "blankCard", "content-area": "true" },
  };
}
