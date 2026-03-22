// SegmentedControl — Tabbed segment picker
// Variants: "default" | "pill"

import type { UIComponentPropsBase } from "../../types";

export interface SegmentedControlProps extends UIComponentPropsBase {
  segments?: string[];
  activeIndex?: number;
  variant?: "default" | "pill";
}

export function renderSegmentedControl(props: Partial<SegmentedControlProps> = {}): string {
  const variant = props.variant ?? "default";
  const segments = props.segments
    ?? props.itemLabels
    ?? (props.label ? props.label.split(/[,|\/]/).map(s => s.trim()) : ["All", "Active", "Archived"]);
  const activeIndex = 0;

  const pillClass = variant === "pill" ? " ui-segments--pill" : "";

  return `
<div class="ui-segments${pillClass}" data-component="segmentedControl">
  <div class="ui-segments__track">
    ${segments.map((s, i) => `<button class="ui-segments__item ${i === activeIndex ? "ui-segments__item--active" : ""}">${s}</button>`).join("")}
  </div>
</div>`;
}
