// FloatingActionButton — FAB
// Variants: "default" | "extended"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface FABProps extends UIComponentPropsBase {
  variant?: "default" | "extended";
}

export function renderFAB(props: Partial<FABProps> = {}): string {
  const variant = props.variant ?? (props.label && props.label.length > 1 ? "extended" : "default");
  const label = props.label;

  return `
<div class="ui-fab ${variant === "extended" ? "ui-fab--extended" : ""}" data-component="floatingActionButton">
  <button class="ui-fab__btn">
    ${ICONS.plus}
    ${variant === "extended" && label ? `<span class="ui-fab__label">${label}</span>` : ""}
  </button>
</div>`;
}
