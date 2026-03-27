// Phone Input — Country code prefix + phone number
// Figma: 5405:106319 (empty), 5405:106320 (filled)

import type { ComponentSpec } from "../../spec/types";

const ICON_GLOBE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const ICON_CHEVRON_DOWN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

export function phoneInputTemplate(props?: Record<string, unknown>): ComponentSpec {
  const placeholder = (props?.placeholder as string) ?? "Enter phone number";
  const value = (props?.value as string) ?? "";
  const flag = (props?.flag as string) ?? "";
  const prefix = (props?.prefix as string) ?? "";
  const filled = !!value;

  return {
    key: "phone-input",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      gap: { token: "spacing.xs" },
      width: "100%",
      height: { token: "height.xl" },
      padding: { x: { token: "spacing.md" } },
      borderRadius: { token: "radius.sm" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
    },
    data: { component: "phoneInput" },
    children: [
      // Country selector
      {
        key: "country-prefix",
        tag: "div",
        layout: { display: "flex", align: "center", gap: "4px", flexShrink: 0 },
        style: { cursor: "pointer" },
        interactive: { type: "button" },
        children: [
          flag ? {
            key: "flag",
            tag: "span",
            layout: { display: "inline-flex" },
            style: {},
            text: { content: flag, style: "label-md" },
          } : {
            key: "globe",
            tag: "div",
            layout: { display: "inline-flex" },
            style: {},
            data: { innerHTML: ICON_GLOBE },
          },
          { key: "chevron", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_CHEVRON_DOWN } },
        ],
      },
      // Divider
      {
        key: "divider",
        tag: "div",
        layout: { display: "block", width: 1, height: 24 },
        style: { background: { token: "color.border-default" } },
      },
      // Phone number
      {
        key: "phone-value",
        tag: "span",
        layout: { display: "block", flex: "1" },
        style: {},
        interactive: { type: "input" },
        text: {
          content: filled ? (prefix ? `${prefix} ${value}` : value) : placeholder,
          style: "paragraph-md",
          color: filled ? { token: "color.text-primary" } : { token: "color.text-tertiary" },
          editable: true,
        },
      },
    ],
  };
}
