// Modal / Dialog — Overlay content
// Variants: "alert" | "action-sheet" | "full-screen"

import type { UIComponentPropsBase } from "../../types";

export interface ModalProps extends UIComponentPropsBase {
  title?: string;
  body?: string;
  variant?: "alert" | "action-sheet" | "full-screen";
}

export function renderModal(props: Partial<ModalProps> = {}): string {
  const variant = props.variant ?? "alert";
  const title = props.label ?? props.title ?? "Confirm";
  const body = props.body ?? "Are you sure you want to continue?";

  if (variant === "action-sheet") {
    return `
<div class="ui-modal ui-modal--sheet" data-component="modal">
  <div class="ui-modal__scrim"></div>
  <div class="ui-modal__sheet">
    <div class="ui-modal__handle"></div>
    <h3 class="ui-modal__title">${title}</h3>
    <button class="ui-btn ui-btn--primary" style="width:100%">${title}</button>
    <button class="ui-btn ui-btn--ghost" style="width:100%">Cancel</button>
  </div>
</div>`;
  }

  if (variant === "full-screen") {
    return `
<div class="ui-modal ui-modal--fullscreen" data-component="modal">
  <div class="ui-modal__fullscreen-card">
    <h3 class="ui-modal__title">${title}</h3>
    <p class="ui-modal__body">${body}</p>
    <div class="ui-modal__actions">
      <button class="ui-btn ui-btn--primary" style="flex:1">Done</button>
    </div>
  </div>
</div>`;
  }

  // alert
  return `
<div class="ui-modal" data-component="modal">
  <div class="ui-modal__scrim"></div>
  <div class="ui-modal__card">
    <h3 class="ui-modal__title">${title}</h3>
    <p class="ui-modal__body">${body}</p>
    <div class="ui-modal__actions">
      <button class="ui-btn ui-btn--ghost" style="flex:1">Cancel</button>
      <button class="ui-btn ui-btn--primary" style="flex:1">OK</button>
    </div>
  </div>
</div>`;
}
