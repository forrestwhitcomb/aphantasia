// SuccessScreen — Rebtel confirmation screen matching Figma
// Figma: "Confirm the 30-day NGN 7650" with description,
// "Yes, activate" red button, "No, cancel" outline button
// Variants: "topup" | "payment" | "generic"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderSuccessScreen(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "topup" | "payment" | "generic") ?? "generic";
  const label = props.label ?? "Confirm the 30-day NGN 7650";

  switch (variant) {
    case "topup":
      return `
<div data-component="successScreen" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--rebtel-spacing-lg);padding:var(--rebtel-spacing-xxxl) var(--rebtel-spacing-md);width:100%;min-height:320px;box-sizing:border-box;text-align:center">
  <div style="width:64px;height:64px;border-radius:50%;background:var(--rebtel-green-light);display:flex;align-items:center;justify-content:center">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  </div>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-sm-size);line-height:var(--rebtel-headline-sm-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>Top-Up Successful!</span>
  <div style="display:flex;flex-direction:column;align-items:center;gap:var(--rebtel-spacing-xxs)">
    <span style="font-family:var(--rebtel-font-display);font-size:var(--rebtel-display-md-size);line-height:var(--rebtel-display-md-lh);font-weight:700;color:var(--rebtel-green);letter-spacing:var(--rebtel-ls)">$20.00</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);color:var(--rebtel-text-secondary);max-width:280px;letter-spacing:var(--rebtel-ls)" data-text-editable>sent to +52 555 123 4567 (Mexico)</span>
  </div>
  <div style="width:100%;max-width:300px;padding:var(--rebtel-spacing-md);background:var(--rebtel-surface-primary-light);border-radius:var(--rebtel-radius-sm)">
    <div style="display:flex;justify-content:space-between;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">
      <span>Recipient receives</span><span style="color:var(--rebtel-text-primary);font-weight:600">MXN 345.00</span>
    </div>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;width:100%;max-width:300px;height:var(--rebtel-height-lg);background:var(--rebtel-button-primary);color:var(--rebtel-text-on-brand);border-radius:var(--rebtel-radius-md);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-md-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>Done</div>
</div>`;

    case "payment":
      return `
<div data-component="successScreen" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--rebtel-spacing-lg);padding:var(--rebtel-spacing-xxxl) var(--rebtel-spacing-md);width:100%;min-height:320px;box-sizing:border-box;text-align:center">
  <div style="width:64px;height:64px;border-radius:50%;background:var(--rebtel-green-light);display:flex;align-items:center;justify-content:center">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  </div>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-sm-size);line-height:var(--rebtel-headline-sm-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>Payment Confirmed</span>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);color:var(--rebtel-text-secondary);max-width:280px;letter-spacing:var(--rebtel-ls)" data-text-editable>Your payment of $20.00 was processed successfully.</span>
  <div style="width:100%;max-width:300px;display:flex;flex-direction:column;gap:var(--rebtel-spacing-xs);padding:var(--rebtel-spacing-md);background:var(--rebtel-surface-primary-light);border-radius:var(--rebtel-radius-sm)">
    <div style="display:flex;justify-content:space-between;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">
      <span>Transaction ID</span><span style="color:var(--rebtel-text-primary);font-weight:500">#RBT-2847291</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">
      <span>Payment method</span><span style="color:var(--rebtel-text-primary);font-weight:500">Visa ****4242</span>
    </div>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;width:100%;max-width:300px;height:var(--rebtel-height-lg);background:var(--rebtel-button-primary);color:var(--rebtel-text-on-brand);border-radius:var(--rebtel-radius-md);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-md-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>Done</div>
</div>`;

    case "generic":
      return `
<div data-component="successScreen" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--rebtel-spacing-lg);padding:var(--rebtel-spacing-xxxl) var(--rebtel-spacing-md);width:100%;min-height:400px;box-sizing:border-box;text-align:center">
  <div style="width:64px;height:64px;border-radius:50%;background:var(--rebtel-surface-primary-light);display:flex;align-items:center;justify-content:center">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-default)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
  </div>

  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-sm-size);line-height:var(--rebtel-headline-sm-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls);max-width:280px" data-text-editable>${label}</span>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);color:var(--rebtel-text-secondary);max-width:280px;letter-spacing:var(--rebtel-ls)" data-text-editable>Auto top-up for Buyaka</span>

  <div style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-xs);width:100%;max-width:300px">
    <div style="display:flex;align-items:center;justify-content:center;height:var(--rebtel-height-lg);background:var(--rebtel-button-primary);color:var(--rebtel-text-on-brand);border-radius:var(--rebtel-radius-md);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-md-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>Yes, activate</div>
    <div style="display:flex;align-items:center;justify-content:center;height:var(--rebtel-height-lg);background:var(--rebtel-surface-primary);color:var(--rebtel-text-primary);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-md);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-md-size);font-weight:500;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>No, cancel</div>
  </div>
</div>`;

    default:
      return renderSuccessScreen({ ...props, variant: "generic" });
  }
}
