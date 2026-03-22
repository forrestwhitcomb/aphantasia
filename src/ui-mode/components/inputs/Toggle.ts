// Toggle / Switch — Boolean toggle
// Variants: "default" | "with-label"

import type { UIComponentPropsBase } from "../../types";

export interface ToggleProps extends UIComponentPropsBase {
  on?: boolean;
  variant?: "default" | "with-label";
}

export function renderToggle(props: Partial<ToggleProps> = {}): string {
  const variant = props.variant ?? "with-label";
  const on = props.on ?? true;
  const label = props.label ?? "Enable notifications";

  const toggleHtml = `
<div class="ui-toggle ${on ? "ui-toggle--on" : ""}">
  <div class="ui-toggle__thumb"></div>
</div>`;

  if (variant === "with-label") {
    return `
<div class="ui-toggle-row" data-component="toggle">
  <span class="ui-toggle-row__label">${label}</span>
  ${toggleHtml}
</div>`;
  }

  return `<div class="ui-toggle-wrap" data-component="toggle">${toggleHtml}</div>`;
}
