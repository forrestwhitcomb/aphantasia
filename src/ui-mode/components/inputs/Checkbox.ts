// Checkbox — Boolean checkbox
// Variants: "default" | "with-label"

import type { UIComponentPropsBase } from "../../types";

export interface CheckboxProps extends UIComponentPropsBase {
  checked?: boolean;
  variant?: "default" | "with-label";
}

export function renderCheckbox(props: Partial<CheckboxProps> = {}): string {
  const variant = props.variant ?? "with-label";
  const checked = props.checked ?? true;
  const label = props.label ?? "I agree to the terms";

  const checkHtml = `
<div class="ui-checkbox ${checked ? "ui-checkbox--checked" : ""}">
  ${checked ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ""}
</div>`;

  if (variant === "with-label") {
    return `
<div class="ui-checkbox-row" data-component="checkbox">
  ${checkHtml}
  <span class="ui-checkbox-row__label">${label}</span>
</div>`;
  }

  return `<div class="ui-checkbox-wrap" data-component="checkbox">${checkHtml}</div>`;
}
