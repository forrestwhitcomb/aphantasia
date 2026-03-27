// PaymentModule — Payment method selector + CTA button matching Figma
// Visa card row with chevron + "Start free trial" black pill button

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface PaymentModuleProps extends UIComponentPropsBase {
  variant?: "visa" | "empty";
  cardLast4?: string;
  ctaLabel?: string;
}

const VISA_LOGO = `<div style="background:#1A1F71;color:#FFFFFF;font-family:var(--rebtel-font-body);font-size:10px;font-weight:700;font-style:italic;padding:2px 6px;border-radius:3px;letter-spacing:0.05em">VISA</div>`;
const ICON_CHEVRON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

export function renderPaymentModule(props: Partial<PaymentModuleProps> = {}): string {
  const cardLast4 = props.cardLast4 ?? "1000";
  const ctaLabel = props.ctaLabel ?? props.label ?? "Start free trial";

  return `
<div data-component="paymentModule" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-md);padding:var(--rebtel-spacing-md);border-top:1px solid var(--rebtel-border-secondary);box-sizing:border-box;width:100%">
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm);padding:0 var(--rebtel-spacing-md);height:var(--rebtel-height-lg);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-full);cursor:pointer;background:var(--rebtel-surface-primary)" data-interactive="button">
    ${VISA_LOGO}
    <span style="flex:1;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>**** ${cardLast4}</span>
    ${ICON_CHEVRON}
  </div>
  <button style="width:100%;height:var(--rebtel-height-xl);border:none;border-radius:var(--rebtel-radius-full);background:var(--rebtel-grey-900);color:var(--rebtel-brand-white);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>${ctaLabel}</button>
</div>`;
}
