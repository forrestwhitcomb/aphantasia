// Avatar — User avatar display
// Variants: "circle" | "rounded" | "initials"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface AvatarProps extends UIComponentPropsBase {
  initials?: string;
  variant?: "circle" | "rounded" | "initials";
}

export function renderAvatar(props: Partial<AvatarProps> = {}): string {
  const variant = props.variant ?? "circle";
  const initials = props.initials ?? (props.label ? props.label.slice(0, 2).toUpperCase() : "JD");

  if (variant === "initials") {
    return `
<div class="ui-avatar ui-avatar--initials" data-component="avatar">
  <span class="ui-avatar__text">${initials}</span>
</div>`;
  }

  return `
<div class="ui-avatar ui-avatar--${variant}" data-component="avatar">
  <span class="ui-avatar__icon">${ICONS.user}</span>
</div>`;
}
