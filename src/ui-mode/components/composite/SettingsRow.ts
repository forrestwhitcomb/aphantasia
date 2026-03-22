// SettingsRow — Settings list item with specialized trailing elements
// Variants: "toggle" | "navigation" | "value" | "destructive"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface SettingsRowProps extends UIComponentPropsBase {
  title?: string;
  value?: string;
  variant?: "toggle" | "navigation" | "value" | "destructive";
  toggleOn?: boolean;
}

export function renderSettingsRow(props: Partial<SettingsRowProps> = {}): string {
  const variant = props.variant ?? "navigation";
  const title = props.label ?? props.title ?? "Setting";
  const destructiveClass = variant === "destructive" ? " ui-settings-row--destructive" : "";

  let trailingHtml = "";
  switch (variant) {
    case "toggle":
      trailingHtml = `<div class="ui-toggle ${props.toggleOn !== false ? "ui-toggle--on" : ""}"><div class="ui-toggle__thumb"></div></div>`;
      break;
    case "navigation":
      trailingHtml = `<span class="ui-settings-row__chevron">${ICONS.chevron}</span>`;
      break;
    case "value":
      trailingHtml = `<span class="ui-settings-row__value">${props.value ?? "Value"}</span>${ICONS.chevron}`;
      break;
    case "destructive":
      trailingHtml = "";
      break;
  }

  return `
<div class="ui-settings-row${destructiveClass}" data-component="settingsRow">
  <div class="ui-settings-row__icon"><div style="width:60%;height:60%;border-radius:var(--radius-sm);background:var(--color-primary);opacity:0.6"></div></div>
  <span class="ui-settings-row__title">${title}</span>
  <div class="ui-settings-row__trailing">${trailingHtml}</div>
</div>`;
}
