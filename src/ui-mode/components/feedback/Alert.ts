// Alert / Banner — Status notification
// Variants: "info" | "success" | "warning" | "error"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface AlertProps extends UIComponentPropsBase {
  message?: string;
  variant?: "info" | "success" | "warning" | "error";
}

const ALERT_ICONS: Record<string, string> = {
  info: ICONS.info,
  success: ICONS.checkCircle,
  warning: ICONS.alertCircle,
  error: ICONS.alertCircle,
};

export function renderAlert(props: Partial<AlertProps> = {}): string {
  const variant = props.variant ?? "info";
  const message = props.label ?? props.message ?? "This is an important message.";
  const icon = ALERT_ICONS[variant] ?? ICONS.info;

  return `
<div class="ui-alert ui-alert--${variant}" data-component="alert">
  <span class="ui-alert__icon">${icon}</span>
  <span class="ui-alert__message">${message}</span>
</div>`;
}
