// TextField — Underline-style text field matching Figma
// "E-mail" label above, "email address" placeholder, bottom-border-only
// Variants: "default" | "filled" | "dropdown"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface TextFieldProps extends UIComponentPropsBase {
  variant?: "default" | "filled" | "dropdown";
  fieldLabel?: string;
  placeholder?: string;
  value?: string;
}

const ICON_CHEVRON_UPDOWN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 10 12 6 17 10"/><polyline points="7 14 12 18 17 14"/></svg>`;

export function renderTextField(props: Partial<TextFieldProps> = {}): string {
  const variant = (props.variant as TextFieldProps["variant"]) ?? "default";
  const fieldLabel = props.fieldLabel ?? props.label ?? "E-mail";
  const placeholder = props.placeholder ?? "email address";
  const value = props.value;

  const displayText = value ?? placeholder;
  const textColor = value ? "var(--rebtel-text-primary)" : "var(--rebtel-text-tertiary)";

  const suffix = variant === "dropdown"
    ? `<span style="flex-shrink:0;display:flex;align-items:center">${ICON_CHEVRON_UPDOWN}</span>`
    : "";

  return `
<div data-component="textField" style="display:flex;flex-direction:column;gap:2px;padding:0 var(--rebtel-spacing-md);box-sizing:border-box" data-interactive="input">
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);line-height:var(--rebtel-paragraph-xs-lh);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)" data-text-editable>${fieldLabel}</span>
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);padding:var(--rebtel-spacing-xs) 0;border-bottom:1px solid var(--rebtel-border-default)">
    <span style="flex:1;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);color:${textColor};letter-spacing:var(--rebtel-ls)" data-text-editable>${displayText}</span>
    ${suffix}
  </div>
</div>`;
}
