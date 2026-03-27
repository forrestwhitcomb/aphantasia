// DialogPopup — Confirmation dialog matching Figma exactly
// Rounded card, centered title + description, primary + secondary pill buttons

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface DialogPopupProps extends UIComponentPropsBase {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export function renderDialogPopup(props: Partial<DialogPopupProps> = {}): string {
  const title = props.title ?? props.label ?? "Confirm the 30-day NGN 7650 auto top-up for Buyaka";
  const description = props.description ?? "Would you like to set up an auto top-up for Buyaka with NGN 7650 every 30 days? You can cancel anytime you want.";
  const primaryLabel = props.primaryLabel ?? "Yes, activate";
  const secondaryLabel = props.secondaryLabel ?? "No, cancel";

  return `
<div data-component="dialogPopup" style="display:flex;flex-direction:column;align-items:center;background:var(--rebtel-surface-primary);border:1px solid var(--rebtel-border-secondary);border-radius:var(--rebtel-radius-xl);padding:var(--rebtel-spacing-xxl) var(--rebtel-spacing-xl);box-sizing:border-box;max-width:320px;margin:0 auto;box-shadow:0 8px 32px rgba(0,0,0,0.12)">
  <h2 style="margin:0 0 var(--rebtel-spacing-sm);font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-sm-size);line-height:var(--rebtel-headline-sm-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls);text-align:center" data-text-editable>${title}</h2>
  <p style="margin:0 0 var(--rebtel-spacing-xl);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls);text-align:center" data-text-editable>${description}</p>
  <button style="width:100%;height:var(--rebtel-height-xl);border:none;border-radius:var(--rebtel-radius-full);background:var(--rebtel-grey-900);color:var(--rebtel-brand-white);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer;margin-bottom:var(--rebtel-spacing-sm)" data-interactive="button" data-text-editable>${primaryLabel}</button>
  <button style="width:100%;height:var(--rebtel-height-xl);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-full);background:var(--rebtel-surface-primary);color:var(--rebtel-text-primary);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);font-weight:500;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>${secondaryLabel}</button>
</div>`;
}
