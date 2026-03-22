// Badge — Small status indicator
// Variants: "default" | "destructive" | "outline" | "count"

import type { UIComponentPropsBase } from "../../types";

export interface BadgeProps extends UIComponentPropsBase {
  variant?: "default" | "destructive" | "outline" | "count";
  count?: number;
}

export function renderBadge(props: Partial<BadgeProps> = {}): string {
  const variant = props.variant ?? "default";
  const label = props.label ?? (variant === "count" ? String(props.count ?? 3) : "New");

  return `<span class="ui-badge ui-badge--${variant}" data-component="badge">${label}</span>`;
}
