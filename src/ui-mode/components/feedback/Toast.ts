// Toast — Transient notification
// Variants: "default" | "with-action"

import type { UIComponentPropsBase } from "../../types";

export interface ToastProps extends UIComponentPropsBase {
  actionLabel?: string;
  variant?: "default" | "with-action";
}

export function renderToast(props: Partial<ToastProps> = {}): string {
  const variant = props.variant ?? "with-action";
  const message = props.label ?? "Action completed";
  const actionLabel = props.actionLabel ?? "Undo";

  return `
<div class="ui-toast" data-component="toast">
  <div class="ui-toast__inner">
    <span class="ui-toast__text">${message}</span>
    ${variant === "with-action" ? `<button class="ui-toast__action">${actionLabel}</button>` : ""}
  </div>
</div>`;
}
