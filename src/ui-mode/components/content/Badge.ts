// Badge — Small status indicator
// Variants: "default" | "destructive" | "outline" | "count"

import type { UIComponentPropsBase } from "../../types";

export interface BadgeProps extends UIComponentPropsBase {
  variant?: "default" | "destructive" | "outline" | "count";
  count?: number;
  fullWidth?: boolean;
}

export function renderBadge(props: Partial<BadgeProps> = {}): string {
  const variant = props.variant ?? "default";
  const label = props.label ?? (variant === "count" ? String(props.count ?? 3) : "New");
  const widthClass = props.fullWidth ? " ui-badge--full-width" : "";

  return `<span class="ui-badge ui-badge--${variant}${widthClass}" data-component="badge">${label}</span>`;
}
