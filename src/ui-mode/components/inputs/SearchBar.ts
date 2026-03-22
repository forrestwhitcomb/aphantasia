// SearchBar — Search input field
// Variants: "default" | "with-cancel" | "with-filter"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface SearchBarProps extends UIComponentPropsBase {
  placeholder?: string;
  variant?: "default" | "with-cancel" | "with-filter";
}

export function renderSearchBar(props: Partial<SearchBarProps> = {}): string {
  const variant = props.variant ?? "default";
  const placeholder = props.label ?? props.placeholder ?? "Search";

  const cancelHtml = variant === "with-cancel"
    ? `<button class="ui-search__cancel">Cancel</button>`
    : "";

  const filterHtml = variant === "with-filter"
    ? `<button class="ui-search__filter">${ICONS.filter}</button>`
    : "";

  return `
<div class="ui-search" data-component="searchBar">
  <div class="ui-search__field">
    <span class="ui-search__icon">${ICONS.search}</span>
    <span class="ui-search__placeholder">${placeholder}</span>
  </div>
  ${cancelHtml}${filterHtml}
</div>`;
}
