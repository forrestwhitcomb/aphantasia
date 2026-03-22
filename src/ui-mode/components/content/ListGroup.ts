// ListGroup — Grouped list of items
// Variants: "inset" | "plain" | "separated"

import type { UIComponentPropsBase } from "../../types";
import { renderListItem, LIST_PLACEHOLDERS } from "./ListItem";

export interface ListGroupProps extends UIComponentPropsBase {
  title?: string;
  variant?: "inset" | "plain" | "separated";
}

export function renderListGroup(props: Partial<ListGroupProps> = {}): string {
  const variant = props.variant ?? "inset";
  const count = props.itemCount ?? 4;
  const title = props.label ?? props.title;

  // Parse item labels from note-style input: "1. Home 2. Search 3. Profile"
  const labels = props.itemLabels ?? [];

  const items = Array.from({ length: count }, (_, i) => {
    const label = labels[i] ?? undefined;
    const isLast = i === count - 1;
    return renderListItem(
      {
        title: label,
        variant: "chevron",
        showDivider: !isLast && variant !== "separated",
      },
      i
    );
  }).join("");

  const headingHtml = title
    ? `<div class="ui-list-group__heading">${title}</div>`
    : "";

  return `
<section class="ui-list-group ui-list-group--${variant}" data-component="listGroup">
  ${headingHtml}
  <div class="ui-list-group__items">
    ${items}
  </div>
</section>`;
}
