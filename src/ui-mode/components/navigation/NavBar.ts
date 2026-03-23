// NavBar — App navigation bar
// Variants: "standard" | "large-title" | "search" | "segmented"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface NavBarProps extends UIComponentPropsBase {
  title?: string;
  backLabel?: string;
  rightAction?: string;
  variant?: "standard" | "large-title" | "search" | "segmented";
  segments?: string[];
}

export function renderNavBar(props: Partial<NavBarProps> = {}): string {
  const title = props.label ?? props.title ?? "Screen Title";
  const variant = props.variant ?? "standard";

  switch (variant) {
    case "large-title":
      return `
<nav class="ui-navbar ui-navbar--large-title" data-component="navBar">
  <div class="ui-navbar__row">
    <span class="ui-navbar__back">${ICONS.back}</span>
    <div class="ui-navbar__actions">
      <div class="ui-navbar__icon">${ICONS.bell}</div>
    </div>
  </div>
  <h1 class="ui-navbar__large-heading" data-text-editable>${title}</h1>
</nav>`;

    case "search":
      return `
<nav class="ui-navbar ui-navbar--search" data-component="navBar">
  <div class="ui-navbar__row" style="display:flex;align-items:center;justify-content:space-between;height:var(--comp-navbar-height)">
    <span class="ui-navbar__back">${ICONS.back}</span>
    <span class="ui-navbar__title" data-text-editable style="font-family:var(--font-heading-family);font-size:var(--font-size-lg);font-weight:var(--font-heading-weight);letter-spacing:var(--font-heading-ls);color:var(--color-foreground)">${title}</span>
    <div class="ui-navbar__actions">
      <div class="ui-navbar__icon">${ICONS.bell}</div>
    </div>
  </div>
  <div class="ui-navbar__search-field">
    <span style="color:var(--color-muted-foreground)">${ICONS.search}</span>
    <span>Search</span>
  </div>
</nav>`;

    case "segmented": {
      const segments = props.segments ?? props.itemLabels ?? ["All", "Active", "Archived"];
      return `
<nav class="ui-navbar ui-navbar--segmented" data-component="navBar">
  <div class="ui-navbar__row" style="display:flex;align-items:center;justify-content:space-between;height:var(--comp-navbar-height)">
    <span class="ui-navbar__back">${ICONS.back}</span>
    <span class="ui-navbar__title" data-text-editable style="font-family:var(--font-heading-family);font-size:var(--font-size-lg);font-weight:var(--font-heading-weight);letter-spacing:var(--font-heading-ls);color:var(--color-foreground)">${title}</span>
    <div class="ui-navbar__actions">
      <div class="ui-navbar__icon">${ICONS.more}</div>
    </div>
  </div>
  <div style="display:flex;background:var(--color-secondary);border-radius:var(--radius-md);padding:var(--spacing-xs)">
    ${segments.map((s, i) => `<button style="flex:1;padding:var(--spacing-sm);border-radius:var(--radius-sm);border:none;font-size:var(--font-size-sm);font-weight:500;font-family:var(--font-body-family);cursor:pointer;${i === 0 ? "background:var(--color-background);box-shadow:var(--shadow-sm);color:var(--color-foreground)" : "background:transparent;color:var(--color-muted-foreground)"}">${s}</button>`).join("")}
  </div>
</nav>`;
    }

    default: // standard
      return `
<nav class="ui-navbar ui-navbar--standard" data-component="navBar">
  ${props.backLabel !== undefined
    ? `<span class="ui-navbar__back">${ICONS.back}</span>`
    : `<div style="width:var(--spacing-xl)"></div>`}
  <span class="ui-navbar__title" data-text-editable>${title}</span>
  <div class="ui-navbar__actions">
    <div class="ui-navbar__icon">${ICONS.bell}</div>
  </div>
</nav>`;
  }
}
