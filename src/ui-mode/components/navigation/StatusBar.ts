// StatusBar — iOS-style status bar (time, signal, wifi, battery)
// Variants: "light" (dark text on light bg) | "dark" (light text on dark bg)

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface StatusBarProps extends UIComponentPropsBase {
  variant?: "light" | "dark";
}

export function renderStatusBar(props: Partial<StatusBarProps> = {}): string {
  const variant = props.variant ?? "light";
  return `
<div class="ui-status-bar ui-status-bar--${variant}" data-component="statusBar">
  <span class="ui-status-bar__time">9:41</span>
  <div class="ui-status-bar__right">
    ${ICONS.signal}
    ${ICONS.wifi}
    <div class="ui-status-bar__battery">
      <div class="ui-status-bar__battery-body"><div class="ui-status-bar__battery-fill"></div></div>
      <div class="ui-status-bar__battery-cap"></div>
    </div>
  </div>
</div>`;
}
