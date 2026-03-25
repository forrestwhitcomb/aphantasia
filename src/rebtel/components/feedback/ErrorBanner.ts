// ErrorBanner — Rebtel error display banner
// Variants: "inline" | "full-width" | "dismissible"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderErrorBanner(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "inline" | "full-width" | "dismissible") ?? "inline";
  const label = props.label ?? "Something went wrong. Please try again.";

  const ICON_ALERT = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  const ICON_CLOSE = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  const textStyles = `font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-error-text, #991B1B);line-height:1.4`;
  const actionStyles = `font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:600;color:var(--rebtel-error-text, #991B1B);cursor:pointer;text-decoration:underline;flex-shrink:0" data-interactive="button`;

  switch (variant) {
    case "inline":
      return `
<div data-component="errorBanner" style="display:flex;align-items:flex-start;gap:var(--rebtel-spacing-sm, var(--spacing-sm));padding:var(--rebtel-spacing-sm, var(--spacing-sm)) var(--rebtel-spacing-md, var(--spacing-md));margin:0 var(--rebtel-spacing-md, var(--spacing-md));background:var(--rebtel-error-bg, #FEF2F2);border:1px solid var(--rebtel-error-border, #FECACA);border-radius:var(--rebtel-radius-md, var(--radius-md))">
  <span style="color:var(--rebtel-error-icon, #DC2626);display:flex;align-items:center;flex-shrink:0;margin-top:1px">${ICON_ALERT}</span>
  <span style="${textStyles};flex:1" data-text-editable>${label}</span>
  <span style="${actionStyles}" data-text-editable>Try again</span>
</div>`;

    case "full-width":
      return `
<div data-component="errorBanner" style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm, var(--spacing-sm));padding:var(--rebtel-spacing-md, var(--spacing-md));width:100%;box-sizing:border-box;background:var(--rebtel-error-bg, #FEF2F2);border-top:1px solid var(--rebtel-error-border, #FECACA);border-bottom:1px solid var(--rebtel-error-border, #FECACA)">
  <span style="color:var(--rebtel-error-icon, #DC2626);display:flex;align-items:center;flex-shrink:0">${ICON_ALERT}</span>
  <span style="${textStyles};flex:1" data-text-editable>${label}</span>
  <span style="${actionStyles}" data-text-editable>Try again</span>
</div>`;

    case "dismissible":
      return `
<div data-component="errorBanner" style="display:flex;align-items:flex-start;gap:var(--rebtel-spacing-sm, var(--spacing-sm));padding:var(--rebtel-spacing-md, var(--spacing-md));margin:0 var(--rebtel-spacing-md, var(--spacing-md));background:var(--rebtel-error-bg, #FEF2F2);border:1px solid var(--rebtel-error-border, #FECACA);border-radius:var(--rebtel-radius-md, var(--radius-md))">
  <span style="color:var(--rebtel-error-icon, #DC2626);display:flex;align-items:center;flex-shrink:0;margin-top:1px">${ICON_ALERT}</span>
  <div style="flex:1;display:flex;flex-direction:column;gap:var(--rebtel-spacing-xs, var(--spacing-xs))">
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:600;color:var(--rebtel-error-text, #991B1B)" data-text-editable>Payment failed</span>
    <span style="${textStyles}" data-text-editable>${label}</span>
    <span style="${actionStyles}" data-text-editable>Try again</span>
  </div>
  <div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--rebtel-error-icon, #DC2626);opacity:0.6;flex-shrink:0" data-interactive="button">${ICON_CLOSE}</div>
</div>`;

    default:
      return renderErrorBanner({ ...props, variant: "inline" });
  }
}
