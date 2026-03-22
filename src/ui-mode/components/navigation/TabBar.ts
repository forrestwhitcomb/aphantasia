// TabBar — Bottom tab navigation
// Variants: "icon-only" | "icon-label" | "pill-active"

import type { UIComponentPropsBase } from "../../types";
import { TAB_ICONS, TAB_LABELS } from "../icons";

export interface TabBarProps extends UIComponentPropsBase {
  variant?: "icon-only" | "icon-label" | "pill-active";
  activeIndex?: number;
}

export function renderTabBar(props: Partial<TabBarProps> = {}): string {
  const variant = props.variant ?? "icon-label";
  const activeIndex = 0;
  const labels = props.itemLabels ?? TAB_LABELS;
  const count = props.itemCount ?? labels.length;
  const icons = TAB_ICONS;

  const tabs = Array.from({ length: Math.min(count, 5) }, (_, i) => {
    const isActive = i === activeIndex;
    const icon = icons[i % icons.length];
    const label = labels[i % labels.length];

    if (variant === "pill-active") {
      return `
    <div class="ui-tabbar__item ${isActive ? "ui-tabbar__item--active" : ""}">
      <div class="ui-tabbar__icon ${isActive ? "ui-tabbar__icon--active" : ""}">${icon}</div>
      ${isActive ? `<span class="ui-tabbar__label ui-tabbar__label--active">${label}</span>` : ""}
    </div>`;
    }

    return `
    <div class="ui-tabbar__item">
      <div class="ui-tabbar__icon ${isActive ? "ui-tabbar__icon--active" : ""}">${icon}</div>
      ${variant === "icon-label" ? `<span class="ui-tabbar__label ${isActive ? "ui-tabbar__label--active" : ""}">${label}</span>` : ""}
    </div>`;
  }).join("");

  return `
<nav class="ui-tabbar ${variant === "pill-active" ? "ui-tabbar--pill-active" : ""}" data-component="tabBar">
  ${tabs}
</nav>`;
}
