// PaymentForm — Full payment form matching Figma exactly
// Pano title, Card/Apple Pay toggle, underline text fields, country dropdown

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderPaymentForm(props: Partial<UIComponentPropsBase> = {}): string {
  const title = props.label ?? "Add payment method";

  const ICON_CARD = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`;
  const ICON_APPLE = `<svg width="14" height="16" viewBox="0 0 14 17" fill="currentColor"><path d="M13.2 5.7c-.1.1-2 1.2-2 3.6 0 2.8 2.4 3.8 2.5 3.8 0 0-.3 1.2-1.2 2.4-.7 1-1.5 2.1-2.7 2.1s-1.5-.7-2.9-.7c-1.3 0-1.8.7-2.9.7-1.1.1-2-1.2-2.8-2.2C.1 13.7-.6 11.2-.6 8.8c0-3.8 2.4-5.8 4.8-5.8 1.3 0 2.3.8 3.1.8.8 0 2-.9 3.5-.9.6 0 2 .1 2.4 1.8zM9.1 2c.5-.7.9-1.6.9-2.5 0-.1 0-.3 0-.4-.9 0-1.9.6-2.5 1.3-.5.6-1 1.5-1 2.5 0 .1 0 .3 0 .4.1 0 .1 0 .2 0 .8 0 1.8-.5 2.4-1.3z"/></svg>`;
  const ICON_LOCK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  const ICON_HELP = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  const ICON_CHEVRON_UPDOWN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 10 12 6 17 10"/><polyline points="7 14 12 18 17 14"/></svg>`;

  const field = (label: string, placeholder: string, suffix = "") => `
    <div style="display:flex;flex-direction:column;gap:2px">
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)">${label}</span>
      <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);padding:var(--rebtel-spacing-xs) 0;border-bottom:1px solid var(--rebtel-border-default)">
        <span style="flex:1;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)" data-text-editable>${placeholder}</span>
        ${suffix}
      </div>
    </div>`;

  const dropdownField = (label: string, value: string, prefix = "") => `
    <div style="display:flex;flex-direction:column;gap:2px">
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)">${label}</span>
      <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);padding:var(--rebtel-spacing-xs) 0;border-bottom:1px solid var(--rebtel-border-default)">
        ${prefix}
        <span style="flex:1;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${value}</span>
        ${ICON_CHEVRON_UPDOWN}
      </div>
    </div>`;

  return `
<div data-component="paymentForm" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-md);padding:var(--rebtel-spacing-xl) var(--rebtel-spacing-md);background:var(--rebtel-surface-primary);box-sizing:border-box;width:100%">
  <h2 style="margin:0;font-family:var(--rebtel-font-display);font-size:var(--rebtel-display-md-size);line-height:var(--rebtel-display-md-lh);font-weight:700;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls);text-align:center" data-text-editable>${title}</h2>
  <div style="display:flex;gap:0;margin:0 auto">
    <button style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);height:var(--rebtel-height-lg);padding:0 var(--rebtel-spacing-xl);border:none;border-radius:var(--rebtel-radius-full) 0 0 var(--rebtel-radius-full);background:var(--rebtel-grey-900);color:var(--rebtel-brand-white);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="tab">${ICON_CARD} Card</button>
    <button style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);height:var(--rebtel-height-lg);padding:0 var(--rebtel-spacing-xl);border:1px solid var(--rebtel-border-default);border-left:none;border-radius:0 var(--rebtel-radius-full) var(--rebtel-radius-full) 0;background:var(--rebtel-surface-primary);color:var(--rebtel-text-primary);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:500;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="tab">${ICON_APPLE} Apple pay</button>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;gap:var(--rebtel-spacing-xs)">
    ${ICON_LOCK}
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)">Secure payment</span>
  </div>
  ${field("Card number", "1234 5678 9012 3456")}
  <div style="display:flex;gap:var(--rebtel-spacing-md)">
    <div style="flex:1">
      ${field("Expiration date", "MM / YY")}
    </div>
    <div style="flex:1">
      ${field("Security code", "CVC/CVV", ICON_HELP)}
    </div>
  </div>
  ${field("Full name", "First name last name")}
  ${field("E-mail", "email address")}
  ${dropdownField("Country", "United states", `<span style="font-size:16px">🇺🇸</span>`)}
  ${field("Address", "full address")}
  ${field("City", "City")}
  ${dropdownField("State", "Alaska")}
  ${field("Zip code", "00000")}
</div>`;
}
