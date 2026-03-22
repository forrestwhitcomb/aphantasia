// BottomSheet — Sliding panel from bottom
// Variants: "handle" | "full" | "scrollable"

import type { UIComponentPropsBase } from "../../types";

export interface BottomSheetProps extends UIComponentPropsBase {
  title?: string;
  variant?: "handle" | "full" | "scrollable";
}

export function renderBottomSheet(props: Partial<BottomSheetProps> = {}): string {
  const variant = props.variant ?? "handle";
  const title = props.label ?? props.title;

  return `
<div class="ui-sheet ui-sheet--${variant}" data-component="bottomSheet">
  ${variant !== "full" ? `<div class="ui-sheet__handle"></div>` : ""}
  ${title ? `<h3 class="ui-sheet__title">${title}</h3>` : ""}
  <div class="ui-sheet__content">
    <div class="ui-skel ui-skel--w90"></div>
    <div class="ui-skel ui-skel--sm ui-skel--w65" style="margin-top:var(--spacing-sm)"></div>
    <div class="ui-skel ui-skel--sm ui-skel--w50" style="margin-top:var(--spacing-sm)"></div>
  </div>
</div>`;
}
