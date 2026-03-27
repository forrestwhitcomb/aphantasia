// Country Row — Flag + country name + chevron
// Figma: 5405:106352 — 390×44

import type { ComponentSpec } from "../../spec/types";

const ICON_CHEVRON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-grey-400)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

export function countryRowTemplate(props?: Record<string, unknown>): ComponentSpec {
  const name = (props?.name as string) ?? (props?.label as string) ?? "Afghanistan";
  const flag = (props?.flag as string) ?? "\u{1F1E6}\u{1F1EB}";

  return {
    key: "country-row",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      gap: { token: "spacing.sm" },
      width: "100%",
      height: 44,
      padding: { x: { token: "spacing.md" } },
      boxSizing: "border-box",
    },
    style: { cursor: "pointer" },
    interactive: { type: "button" },
    data: { component: "countryRow" },
    children: [
      { key: "flag", tag: "span", layout: { display: "inline-flex", flexShrink: 0 }, style: {}, text: { content: flag, style: "label-lg" } },
      {
        key: "name",
        tag: "span",
        layout: { display: "block", flex: "1" },
        style: {},
        text: { content: name, style: "paragraph-md", weight: 400, color: { token: "color.text-primary" }, editable: true },
      },
      { key: "chevron", tag: "div", layout: { display: "inline-flex", flexShrink: 0 }, style: {}, data: { innerHTML: ICON_CHEVRON } },
    ],
  };
}
