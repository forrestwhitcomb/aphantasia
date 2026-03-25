// RateCard — Product cards with tabs, pricing info, bundle details matching Figma
// Variants: "simple" | "promo" | "comparison"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface RateCardProps extends UIComponentPropsBase {
  country?: string;
  flag?: string;
  rate?: string;
  originalRate?: string;
  discount?: string;
  compareRate?: string;
  compareLabel?: string;
  variant?: "simple" | "promo" | "comparison";
}

const RATE_PLACEHOLDERS = [
  { country: "Mexico", flag: "\u{1F1F2}\u{1F1FD}", rate: "$0.02/min", originalRate: "$0.05/min", discount: "60% OFF", compareRate: "$0.12/min", compareLabel: "Carrier" },
  { country: "India", flag: "\u{1F1EE}\u{1F1F3}", rate: "$0.01/min", originalRate: "$0.03/min", discount: "67% OFF", compareRate: "$0.08/min", compareLabel: "Carrier" },
  { country: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}", rate: "$0.04/min", originalRate: "$0.10/min", discount: "60% OFF", compareRate: "$0.18/min", compareLabel: "Carrier" },
  { country: "Philippines", flag: "\u{1F1F5}\u{1F1ED}", rate: "$0.03/min", originalRate: "$0.07/min", discount: "57% OFF", compareRate: "$0.15/min", compareLabel: "Carrier" },
];

export function renderRateCard(props: Partial<RateCardProps> = {}, index = 0): string {
  const variant = props.variant ?? "simple";
  const p = RATE_PLACEHOLDERS[index % RATE_PLACEHOLDERS.length];
  const country = props.country ?? props.label ?? p.country;
  const flag = props.flag ?? p.flag;
  const rate = props.rate ?? p.rate;
  const originalRate = props.originalRate ?? p.originalRate;
  const discount = props.discount ?? p.discount;
  const compareRate = props.compareRate ?? p.compareRate;
  const compareLabel = props.compareLabel ?? p.compareLabel;

  const callBtn = `
    <div style="display:flex;align-items:center;justify-content:center;height:var(--rebtel-height-sm);padding:0 var(--rebtel-spacing-md);background:var(--rebtel-button-green);color:var(--rebtel-text-on-brand);border-radius:var(--rebtel-radius-sm);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer;white-space:nowrap" data-interactive="button">Call</div>`;

  if (variant === "promo") {
    return `
<div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-md);background:var(--rebtel-surface-primary);border-radius:var(--rebtel-radius-md);border-left:3px solid var(--rebtel-brand-red);border:1px solid var(--rebtel-border-secondary);box-sizing:border-box" data-component="rateCard">
  <span style="font-size:24px;flex-shrink:0">${flag}</span>
  <div style="flex:1;min-width:0">
    <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${country}</div>
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);margin-top:var(--rebtel-spacing-xxxs)">
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-lg-size);font-weight:700;color:var(--rebtel-brand-red);letter-spacing:var(--rebtel-ls)" data-text-editable>${rate}</span>
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);color:var(--rebtel-text-tertiary);text-decoration:line-through;letter-spacing:var(--rebtel-ls)">${originalRate}</span>
      <span style="background:var(--rebtel-brand-red);color:var(--rebtel-text-on-brand);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-xs-size);font-weight:700;padding:var(--rebtel-spacing-xxxs) var(--rebtel-spacing-xxs);border-radius:var(--rebtel-radius-xs);letter-spacing:var(--rebtel-ls)">${discount}</span>
    </div>
  </div>
  ${callBtn}
</div>`;
  }

  if (variant === "comparison") {
    return `
<div style="padding:var(--rebtel-spacing-md);background:var(--rebtel-surface-primary);border-radius:var(--rebtel-radius-md);border:1px solid var(--rebtel-border-secondary);box-sizing:border-box" data-component="rateCard">
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);margin-bottom:var(--rebtel-spacing-sm)">
    <span style="font-size:24px">${flag}</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${country}</span>
  </div>
  <div style="display:flex;gap:var(--rebtel-spacing-xs)">
    <div style="flex:1;padding:var(--rebtel-spacing-sm);background:var(--rebtel-green-light);border-radius:var(--rebtel-radius-sm);text-align:center">
      <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-xs-size);color:var(--rebtel-text-tertiary);font-weight:600;text-transform:uppercase;letter-spacing:0.04em">Rebtel</div>
      <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-lg-size);font-weight:700;color:var(--rebtel-green);margin-top:var(--rebtel-spacing-xxxs);letter-spacing:var(--rebtel-ls)" data-text-editable>${rate}</div>
    </div>
    <div style="flex:1;padding:var(--rebtel-spacing-sm);background:var(--rebtel-surface-primary-light);border-radius:var(--rebtel-radius-sm);text-align:center">
      <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-xs-size);color:var(--rebtel-text-tertiary);font-weight:600;text-transform:uppercase;letter-spacing:0.04em">${compareLabel}</div>
      <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-lg-size);font-weight:700;color:var(--rebtel-text-tertiary);margin-top:var(--rebtel-spacing-xxxs);letter-spacing:var(--rebtel-ls)" data-text-editable>${compareRate}</div>
    </div>
  </div>
  <div style="margin-top:var(--rebtel-spacing-sm);text-align:center">
    ${callBtn}
  </div>
</div>`;
  }

  // simple (default)
  return `
<div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-md);background:var(--rebtel-surface-primary);border-radius:var(--rebtel-radius-md);border:1px solid var(--rebtel-border-secondary);box-sizing:border-box" data-component="rateCard">
  <span style="font-size:24px;flex-shrink:0">${flag}</span>
  <div style="flex:1;min-width:0">
    <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${country}</div>
    <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);font-weight:700;color:var(--rebtel-green);margin-top:var(--rebtel-spacing-xxxs);letter-spacing:var(--rebtel-ls)" data-text-editable>${rate}</div>
  </div>
  ${callBtn}
</div>`;
}
