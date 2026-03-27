// Search Bar — Search input with icon, pill shape
// Figma: 5405:106293 (empty), 5405:106294 (filled)

import type { ComponentSpec } from "../../spec/types";

const ICON_SEARCH = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-grey-400)" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

export function searchBarTemplate(props?: Record<string, unknown>): ComponentSpec {
  const placeholder = (props?.placeholder as string) ?? "Search country";
  const value = (props?.value as string) ?? "";

  return {
    key: "search-bar",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      gap: { token: "spacing.xs" },
      width: "100%",
      height: { token: "height.xl" },
      padding: { x: { token: "spacing.md" } },
      borderRadius: { token: "radius.full" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-light" },
      border: { width: "1px", style: "solid", color: { token: "color.border-secondary" } },
    },
    interactive: { type: "input" },
    data: { component: "searchBar" },
    children: [
      { key: "search-icon", tag: "div", layout: { display: "inline-flex", flexShrink: 0 }, style: {}, data: { innerHTML: ICON_SEARCH } },
      {
        key: "search-text",
        tag: "span",
        layout: { display: "block", flex: "1" },
        style: {},
        text: {
          content: value || placeholder,
          style: "paragraph-md",
          color: value ? { token: "color.text-primary" } : { token: "color.text-tertiary" },
          editable: true,
        },
      },
    ],
  };
}
