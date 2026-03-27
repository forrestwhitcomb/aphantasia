// Text Field — Standard text input with label + placeholder
// Figma: 5405:106162 — 358×51, label above, underline border

import type { ComponentSpec } from "../../spec/types";

export function textFieldTemplate(props?: Record<string, unknown>): ComponentSpec {
  const label = (props?.label as string) ?? "Full name";
  const placeholder = (props?.placeholder as string) ?? "First name last name";
  const value = (props?.value as string) ?? "";
  const state = (props?.state as string) ?? "default";

  const borderColor = state === "error" ? { token: "color.brand-red" } :
    state === "focused" ? { token: "color.grey-900" } : { token: "color.border-default" };

  return {
    key: "text-field",
    tag: "div",
    layout: { display: "flex", direction: "column", gap: "4px", width: "100%", boxSizing: "border-box" },
    style: {},
    data: { component: "textField" },
    children: [
      {
        key: "tf-label",
        tag: "span",
        layout: { display: "block" },
        style: {},
        text: { content: label, style: "paragraph-xs", color: { token: "color.text-tertiary" }, editable: true },
      },
      {
        key: "tf-value",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          width: "100%",
          height: { token: "height.md" },
          padding: { bottom: { token: "spacing.xs" } },
          boxSizing: "border-box",
        },
        style: {
          border: { width: "0 0 1px 0", style: "solid", color: borderColor },
        },
        interactive: { type: "input" },
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
