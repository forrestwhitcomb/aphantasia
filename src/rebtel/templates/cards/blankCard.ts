// ============================================================
// Blank Card — Empty card shell, Figma pixel-perfect
// ============================================================
// Figma: 5405:106588 — 358×122
// White bg, radius 16px, 1px solid #DCDCE1, padding 16px
// Shadow: 4px 5px 10px 2px rgba(0,0,0,0.02)
// ============================================================

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
      padding: { all: "16px" },
      borderRadius: "16px",
      boxSizing: "border-box",
    },
    style: {
      background: "#FFFFFF",
      border: { width: "1px", style: "solid", color: "#DCDCE1" },
      shadow: "4px 5px 10px 2px rgba(0,0,0,0.02)",
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    data: { component: "blankCard", "content-area": "true" },
  };
}
