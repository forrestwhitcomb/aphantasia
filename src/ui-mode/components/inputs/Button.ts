// Button — Action button
// Variants: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "icon-only"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface ButtonProps extends UIComponentPropsBase {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "icon-only";
  fullWidth?: boolean;
}

export function renderButton(props: Partial<ButtonProps> = {}): string {
  const variant = props.variant ?? "primary";
  const label = props.label ?? (variant === "icon-only" ? "" : "Continue");
  const fullWidth = props.noteOverrides?.includes("full width") ?? false;
  const widthStyle = fullWidth ? "width:100%;" : "";

  if (variant === "icon-only") {
    return `
<div class="ui-btn-wrap" data-component="button">
  <button class="ui-btn ui-btn--icon-only">${ICONS.plus}</button>
</div>`;
  }

  return `
<div class="ui-btn-wrap" data-component="button">
  <button class="ui-btn ui-btn--${variant}" style="${widthStyle}">${label}</button>
</div>`;
}
