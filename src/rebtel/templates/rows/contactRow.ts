// Contact List Item — Avatar + name + phone + free minutes badge
// Figma: 5405:106364 — 358×72

import type { ComponentSpec } from "../../spec/types";

const ICON_USER = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-grey-400)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

export function contactRowTemplate(props?: Record<string, unknown>): ComponentSpec {
  const name = (props?.name as string) ?? (props?.label as string) ?? "Leslie Alexander";
  const phone = (props?.phone as string) ?? "+234787332454";
  const flag = (props?.flag as string) ?? "\u{1F1F3}\u{1F1EC}";
  const badge = (props?.badge as string) ?? "3 free minutes";

  return {
    key: "contact-row",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      gap: { token: "spacing.sm" },
      width: "100%",
      height: 72,
      padding: { x: { token: "spacing.md" } },
      boxSizing: "border-box",
    },
    style: { cursor: "pointer" },
    interactive: { type: "button" },
    data: { component: "contactRow" },
    children: [
      // Avatar
      {
        key: "avatar",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "center", width: 40, height: 40, borderRadius: { token: "radius.full" }, flexShrink: 0, overflow: "hidden" },
        style: { background: { token: "color.grey-100" } },
        data: { innerHTML: ICON_USER },
      },
      // Name + phone
      {
        key: "info",
        tag: "div",
        layout: { display: "flex", direction: "column", flex: "1", minWidth: 0, gap: "2px" },
        style: {},
        children: [
          {
            key: "name",
            tag: "span",
            layout: { display: "block" },
            style: {},
            text: { content: name, style: "paragraph-md", weight: 500, color: { token: "color.text-primary" }, editable: true },
          },
          {
            key: "phone",
            tag: "div",
            layout: { display: "flex", align: "center", gap: "4px" },
            style: {},
            children: [
              { key: "phone-flag", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: flag, style: "label-xs" } },
              { key: "phone-num", tag: "span", layout: { display: "block" }, style: {}, text: { content: phone, style: "paragraph-xs", color: { token: "color.text-secondary" }, editable: true } },
            ],
          },
        ],
      },
      // Badge
      {
        key: "badge",
        tag: "span",
        layout: { display: "inline-flex", flexShrink: 0 },
        style: {},
        text: { content: badge, style: "paragraph-sm", color: { token: "color.text-tertiary" }, editable: true },
      },
    ],
  };
}
