// Divider — Visual separator
// Variants: "full" | "inset" | "with-text"

import type { UIComponentPropsBase } from "../../types";

export interface DividerProps extends UIComponentPropsBase {
  text?: string;
  variant?: "full" | "inset" | "with-text";
}

export function renderDivider(props: Partial<DividerProps> = {}): string {
  const variant = props.variant ?? "full";
  const text = props.label ?? props.text ?? "or";

  if (variant === "with-text") {
    return `
<div class="ui-divider ui-divider--with-text" data-component="divider">
  <span class="ui-divider__text">${text}</span>
</div>`;
  }

  return `<div class="ui-divider ${variant === "inset" ? "ui-divider--inset" : ""}" data-component="divider"></div>`;
}
