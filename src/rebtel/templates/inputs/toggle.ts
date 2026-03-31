// ============================================================
// Toggle Switch — Figma-verified from Payment module inline
// ============================================================
// Track: 46×24, radius 12 (full round)
// Thumb: 20px circle, white, 2px inset
// On: brand-black track. Off: border-default (#DCDCE1) track
// Optional label prop renders as label + toggle row
// ============================================================

import type { ComponentSpec } from "../../spec/types";

export function toggleTemplate(props?: Record<string, unknown>): ComponentSpec {
  const isOn = (props?.isOn as boolean) ?? false;
  const label = props?.label as string | undefined;

  const toggle: ComponentSpec = {
    key: "toggle",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      width: 46,
      height: 24,
      borderRadius: "12px",
      padding: { all: "2px" },
      boxSizing: "border-box",
      flexShrink: 0,
    },
    style: {
      background: isOn ? { token: "color.brand-black" } : { token: "color.border-default" },
      cursor: "pointer",
    },
    interactive: { type: "toggle" },
    data: { component: "toggle" },
    children: [
      // Spacer for "on" state pushes thumb right
      ...(isOn
        ? [
            {
              key: "toggle-spacer",
              tag: "div" as const,
              layout: { display: "block" as const, flex: "1" },
              style: {},
            },
          ]
        : []),
      // Thumb
      {
        key: "toggle-thumb",
        tag: "div",
        layout: {
          display: "block",
          width: 20,
          height: 20,
          borderRadius: "50%",
          flexShrink: 0,
        },
        style: { background: "#FFFFFF" },
      },
    ],
  };

  // If label provided, wrap in a row
  if (label) {
    return {
      key: "toggle-row",
      tag: "div",
      layout: {
        display: "flex",
        align: "center",
        justify: "space-between",
        width: "100%",
        gap: { token: "spacing.xs" },
      },
      style: {
        fontFamily: "'KH Teka'",
        letterSpacing: "0.02em",
      },
      data: { component: "toggleRow" },
      children: [
        {
          key: "toggle-label",
          tag: "span",
          layout: { display: "block", flex: "1" },
          style: { letterSpacing: "0.02em", lineHeight: "16px" },
          text: {
            content: label,
            style: "paragraph-md",
            weight: 400,
            color: { token: "color.text-secondary" },
            editable: true,
          },
        },
        toggle,
      ],
    };
  }

  return toggle;
}
