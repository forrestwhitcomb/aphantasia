// SectionHeader — Section title with optional action
// Variants: "plain" | "with-action"

import type { UIComponentPropsBase } from "../../types";

export interface SectionHeaderProps extends UIComponentPropsBase {
  title?: string;
  actionLabel?: string;
  variant?: "plain" | "with-action";
}

export function renderSectionHeader(props: Partial<SectionHeaderProps> = {}): string {
  const title = props.label ?? props.title ?? "Section";
  const variant = props.variant ?? "with-action";
  const actionLabel = props.actionLabel ?? "See All";

  return `
<div class="ui-section-header" data-component="sectionHeader">
  <h3 class="ui-section-header__label" data-text-editable>${title}</h3>
  ${variant === "with-action" ? `<span class="ui-section-header__action">${actionLabel}</span>` : ""}
</div>`;
}
