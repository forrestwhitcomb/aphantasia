// EmptyState — No content placeholder
// Variants: "icon-top" | "illustration" | "minimal"

import type { UIComponentPropsBase } from "../../types";

export interface EmptyStateProps extends UIComponentPropsBase {
  title?: string;
  description?: string;
  variant?: "icon-top" | "illustration" | "minimal";
}

export function renderEmptyState(props: Partial<EmptyStateProps> = {}): string {
  const variant = props.variant ?? "icon-top";
  const title = props.label ?? props.title ?? "Nothing here yet";
  const description = props.description ?? "Start by adding some content";

  const iconHtml = variant !== "minimal"
    ? `<div class="ui-empty__icon">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 14l2 2 4-4"/></svg>
  </div>`
    : "";

  return `
<div class="ui-empty" data-component="emptyState">
  ${iconHtml}
  <h3 class="ui-empty__title">${title}</h3>
  <p class="ui-empty__description">${description}</p>
</div>`;
}
