// Label — Small pill tag matching Figma
// Variants: "teal" | "red" | "dark" | "light"
// 24px height, 4px border-radius, 11px font-size, 600 weight

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface LabelProps extends UIComponentPropsBase {
  variant?: "teal" | "red" | "dark" | "light";
}

const VARIANT_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  teal: { bg: "#0C8489", color: "#FFFFFF", border: "none" },
  red: { bg: "#E41A3B", color: "#FFFFFF", border: "none" },
  dark: { bg: "#111111", color: "#FFFFFF", border: "none" },
  light: { bg: "#FFFFFF", color: "var(--rebtel-text-primary)", border: "1px solid var(--rebtel-border-default)" },
};

export function renderLabel(props: Partial<LabelProps> = {}): string {
  const variant = (props.variant as LabelProps["variant"]) ?? "dark";
  const label = props.label ?? "Label";
  const s = VARIANT_STYLES[variant] ?? VARIANT_STYLES.dark;

  return `
<span data-component="label" style="display:inline-flex;align-items:center;justify-content:center;height:24px;padding:0 var(--rebtel-spacing-xs);border-radius:var(--rebtel-radius-xs);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-xs-size);line-height:var(--rebtel-label-xs-lh);font-weight:600;letter-spacing:var(--rebtel-ls);background:${s.bg};color:${s.color};border:${s.border};white-space:nowrap" data-text-editable>${label}</span>`;
}
