// AppBar — Rebtel app bar matching Figma
// Figma: back chevron (<) + "Section header" centered + settings icon
// Status bar with time "9:41" and signal/wifi/battery icons
// Variants: "home" | "back" | "close" | "search"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface AppBarProps extends UIComponentPropsBase {
  variant?: "home" | "back" | "close" | "search";
}

const ICON_BACK = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-default)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const ICON_CLOSE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-default)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ICON_SETTINGS = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-default)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
const ICON_SEARCH = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

const STATUS_BAR = `
<div style="display:flex;align-items:center;justify-content:space-between;height:var(--rebtel-height-xs);padding:0 var(--rebtel-spacing-md);box-sizing:border-box">
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)">9:41</span>
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xxs)">
    <svg width="16" height="12" viewBox="0 0 16 12" fill="var(--rebtel-icon-default)"><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/><rect x="9" y="1" width="3" height="11" rx="1"/><rect x="13" y="0" width="3" height="12" rx="1"/></svg>
    <svg width="16" height="12" viewBox="0 0 16 12" fill="var(--rebtel-icon-default)"><path d="M8 3C5.8 3 3.8 3.8 2.3 5.2L0.5 3.4C2.5 1.5 5.1 0.3 8 0.3c2.9 0 5.5 1.2 7.5 3.1L13.7 5.2C12.2 3.8 10.2 3 8 3zM8 6.5c-1.5 0-2.8 0.6-3.8 1.5L2.5 6.2C4 4.8 5.9 4 8 4s4 0.8 5.5 2.2L11.8 8C10.8 7.1 9.5 6.5 8 6.5zM8 10c-0.7 0-1.3 0.3-1.8 0.7L8 12.8l1.8-2.1C9.3 10.3 8.7 10 8 10z"/></svg>
    <svg width="25" height="12" viewBox="0 0 25 12" fill="var(--rebtel-icon-default)"><rect x="0" y="1" width="21" height="10" rx="2" fill="none" stroke="var(--rebtel-icon-default)" stroke-width="1"/><rect x="22" y="4" width="2" height="4" rx="0.5"/><rect x="1.5" y="2.5" width="16" height="7" rx="1"/></svg>
  </div>
</div>`;

export function renderAppBar(props: Partial<AppBarProps> = {}): string {
  const variant = (props.variant as AppBarProps["variant"]) ?? "back";
  const title = props.label ?? "Section header";

  switch (variant) {
    case "home":
      return `
<div data-component="appBar" style="width:100%;background:var(--rebtel-surface-primary);box-sizing:border-box">
  ${STATUS_BAR}
  <nav style="display:flex;align-items:center;justify-content:center;height:var(--rebtel-height-xl);width:100%;padding:0 var(--rebtel-spacing-md);box-sizing:border-box;position:relative">
    <span style="font-family:var(--rebtel-font-display);font-size:var(--rebtel-display-xs-size);line-height:var(--rebtel-display-xs-lh);font-weight:700;color:var(--rebtel-brand-red);letter-spacing:var(--rebtel-ls)" data-text-editable>Rebtel</span>
  </nav>
</div>`;

    case "back":
      return `
<div data-component="appBar" style="width:100%;background:var(--rebtel-surface-primary);box-sizing:border-box">
  ${STATUS_BAR}
  <nav style="display:flex;align-items:center;height:var(--rebtel-height-xl);width:100%;padding:0 var(--rebtel-spacing-xs);box-sizing:border-box;position:relative">
    <div style="width:var(--rebtel-height-md);height:var(--rebtel-height-md);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0" data-interactive="button">${ICON_BACK}</div>
    <span style="flex:1;text-align:center;font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${title}</span>
    <div style="width:var(--rebtel-height-md);height:var(--rebtel-height-md);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0" data-interactive="button">${ICON_SETTINGS}</div>
  </nav>
</div>`;

    case "close":
      return `
<div data-component="appBar" style="width:100%;background:var(--rebtel-surface-primary);box-sizing:border-box">
  ${STATUS_BAR}
  <nav style="display:flex;align-items:center;height:var(--rebtel-height-xl);width:100%;padding:0 var(--rebtel-spacing-xs);box-sizing:border-box;position:relative">
    <div style="width:var(--rebtel-height-md);height:var(--rebtel-height-md);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0" data-interactive="button">${ICON_CLOSE}</div>
    <span style="flex:1;text-align:center;font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${title}</span>
    <div style="width:var(--rebtel-height-md)"></div>
  </nav>
</div>`;

    case "search":
      return `
<div data-component="appBar" style="width:100%;background:var(--rebtel-surface-primary);box-sizing:border-box">
  ${STATUS_BAR}
  <nav style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);height:var(--rebtel-height-xl);width:100%;padding:0 var(--rebtel-spacing-md);box-sizing:border-box">
    <div style="width:var(--rebtel-height-sm);height:var(--rebtel-height-sm);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0" data-interactive="button">${ICON_BACK}</div>
    <div style="flex:1;display:flex;align-items:center;gap:var(--rebtel-spacing-xs);background:var(--rebtel-surface-primary-light);border-radius:var(--rebtel-radius-sm);padding:0 var(--rebtel-spacing-sm);height:var(--rebtel-height-sm)" data-interactive="input">
      ${ICON_SEARCH}
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)" data-text-editable>Search contacts, countries...</span>
    </div>
  </nav>
</div>`;

    default:
      return renderAppBar({ ...props, variant: "back" });
  }
}
