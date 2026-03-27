// OrderSummary — Order/pricing summary card matching Figma
// Line items, divider, bold total, "Cancel anytime" with green checkmark

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface OrderSummaryProps extends UIComponentPropsBase {
  planName?: string;
  planPrice?: string;
  trialText?: string;
  trialPrice?: string;
  payNow?: string;
  afterTrial?: string;
}

const ICON_CHECK_GREEN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#34C759"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function renderOrderSummary(props: Partial<OrderSummaryProps> = {}): string {
  const planName = props.planName ?? props.label ?? "USA Unlimited";
  const planPrice = props.planPrice ?? "$12/month";
  const trialText = props.trialText ?? "7 days free trial";
  const trialPrice = props.trialPrice ?? "$0";
  const payNow = props.payNow ?? "$0";
  const afterTrial = props.afterTrial ?? "$12/month";

  return `
<div data-component="orderSummary" style="display:flex;flex-direction:column;background:var(--rebtel-surface-primary-light);border-radius:var(--rebtel-radius-lg);padding:var(--rebtel-spacing-md) var(--rebtel-spacing-md);box-sizing:border-box;width:100%">
  <div style="display:flex;justify-content:space-between;align-items:baseline;padding:var(--rebtel-spacing-xs) 0">
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${planName}</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${planPrice}</span>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:baseline;padding:var(--rebtel-spacing-xs) 0">
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)" data-text-editable>${trialText}</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)" data-text-editable>${trialPrice}</span>
  </div>
  <div style="height:1px;background:var(--rebtel-border-secondary);margin:var(--rebtel-spacing-xs) 0"></div>
  <div style="display:flex;justify-content:space-between;align-items:baseline;padding:var(--rebtel-spacing-xs) 0">
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-sm-size);font-weight:700;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>Pay now</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-sm-size);font-weight:700;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${payNow}</span>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:baseline;padding:var(--rebtel-spacing-xs) 0">
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)" data-text-editable>After trial</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)" data-text-editable>${afterTrial}</span>
  </div>
  <div style="height:1px;background:var(--rebtel-border-secondary);margin:var(--rebtel-spacing-xs) 0"></div>
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);padding:var(--rebtel-spacing-xs) 0">
    ${ICON_CHECK_GREEN}
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-success);letter-spacing:var(--rebtel-ls)">Cancel anytime</span>
  </div>
</div>`;
}
