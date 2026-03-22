// Header — Simple page-section title
// Variants: "large" | "medium" | "small"

import type { UIComponentPropsBase } from "../../types";

export interface HeaderProps extends UIComponentPropsBase {
  variant?: "large" | "medium" | "small";
}

const SIZE_MAP: Record<string, { className: string; tag: string }> = {
  large: { className: "ui-header--large", tag: "h1" },
  medium: { className: "ui-header--medium", tag: "h2" },
  small: { className: "ui-header--small", tag: "h3" },
};

export function renderHeader(props: Partial<HeaderProps> = {}): string {
  const variant = props.variant ?? "medium";
  const title = props.label ?? "Title";
  const { className, tag } = SIZE_MAP[variant] ?? SIZE_MAP.medium;

  return `
<div class="ui-header ${className}" data-component="header">
  <${tag} class="ui-header__text">${title}</${tag}>
</div>`;
}
