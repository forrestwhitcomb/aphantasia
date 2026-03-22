// Tag / Chip — Selectable label
// Variants: "default" | "selected" | "removable"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface TagProps extends UIComponentPropsBase {
  variant?: "default" | "selected" | "removable";
}

export function renderTag(props: Partial<TagProps> = {}): string {
  const variant = props.variant ?? "default";
  const label = props.label ?? "Tag";
  const removeBtn = variant === "removable"
    ? `<span class="ui-tag__remove">${ICONS.close}</span>`
    : "";

  return `<span class="ui-tag ui-tag--${variant}" data-component="tag">${label}${removeBtn}</span>`;
}
