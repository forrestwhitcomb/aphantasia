// PaymentMethod — Rebtel payment method matching Figma
// Figma: credit card icon + "**** 1000" + dropdown chevron
// Red "Start free trial" CTA button below
// Variants: "card-select" | "add-new" | "saved"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderPaymentMethod(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "card-select" | "add-new" | "saved") ?? "card-select";
  const label = props.label ?? "Payment method";

  const ICON_CARD = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-default)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`;
  const ICON_CHEVRON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const ICON_PLUS = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-brand)" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

  switch (variant) {
    case "card-select":
      return `
<div data-component="paymentMethod" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-md);padding:var(--rebtel-spacing-md);width:100%;box-sizing:border-box">
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${label}</span>

  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm);padding:0 var(--rebtel-spacing-md);height:var(--rebtel-height-lg);background:var(--rebtel-surface-primary);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-sm);cursor:pointer" data-interactive="button">
    <span style="display:flex;align-items:center;flex-shrink:0">${ICON_CARD}</span>
    <span style="flex:1;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>**** 1000</span>
    <span style="display:flex;align-items:center;flex-shrink:0">${ICON_CHEVRON}</span>
  </div>

  <div style="display:flex;align-items:center;justify-content:center;height:var(--rebtel-height-lg);background:var(--rebtel-button-primary);color:var(--rebtel-text-on-brand);border-radius:var(--rebtel-radius-md);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-md-size);line-height:var(--rebtel-label-md-lh);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>Start free trial</div>
</div>`;

    case "add-new":
      return `
<div data-component="paymentMethod" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-md);padding:var(--rebtel-spacing-md);width:100%;box-sizing:border-box">
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${label}</span>

  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm);padding:0 var(--rebtel-spacing-md);height:var(--rebtel-height-lg);background:var(--rebtel-surface-primary);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-sm);cursor:pointer" data-interactive="button">
    <span style="display:flex;align-items:center;flex-shrink:0">${ICON_CARD}</span>
    <span style="flex:1;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>**** 1000</span>
    <span style="display:flex;align-items:center;flex-shrink:0">${ICON_CHEVRON}</span>
  </div>

  <div style="display:flex;align-items:center;justify-content:center;gap:var(--rebtel-spacing-xs);height:var(--rebtel-height-lg);border:1px dashed var(--rebtel-border-default);border-radius:var(--rebtel-radius-sm);cursor:pointer" data-interactive="button">
    ${ICON_PLUS}
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-md-size);font-weight:500;color:var(--rebtel-brand-red);letter-spacing:var(--rebtel-ls)" data-text-editable>Add payment method</span>
  </div>
</div>`;

    case "saved":
      return `
<div data-component="paymentMethod" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-md);padding:var(--rebtel-spacing-md);width:100%;box-sizing:border-box">
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${label}</span>

  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm);padding:0 var(--rebtel-spacing-md);height:var(--rebtel-height-lg);background:var(--rebtel-surface-primary);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-sm)">
    <span style="display:flex;align-items:center;flex-shrink:0">${ICON_CARD}</span>
    <span style="flex:1;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>**** 1000</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);color:var(--rebtel-brand-red);font-weight:500;cursor:pointer;letter-spacing:var(--rebtel-ls)" data-text-editable data-interactive="button">Change</span>
  </div>
</div>`;

    default:
      return renderPaymentMethod({ ...props, variant: "card-select" });
  }
}
