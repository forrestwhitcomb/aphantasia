// TopUpCard — Product cards matching Figma
// "Rebtel Credits to Sweden" with subscription/credits tabs, amount pills ($5/$10/$25),
// rate info, red "Buy now" CTA. Also carrier bundle cards.
// Variants: "amount-select" | "bundle" | "plan" | "confirmation"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface TopUpCardProps extends UIComponentPropsBase {
  carrier?: string;
  country?: string;
  flag?: string;
  recipient?: string;
  recipientPhone?: string;
  amounts?: string[];
  selectedAmount?: string;
  bundleName?: string;
  bundleData?: string;
  bundleMins?: string;
  bundleSMS?: string;
  bundleValidity?: string;
  bundlePrice?: string;
  planName?: string;
  planPrice?: string;
  planFeatures?: string[];
  total?: string;
  fee?: string;
  variant?: "amount-select" | "bundle" | "plan" | "confirmation";
}

const TOPUP_DEFAULTS = {
  carrier: "Telcel",
  country: "Sweden",
  flag: "\u{1F1F8}\u{1F1EA}",
  recipient: "Maria Garcia",
  recipientPhone: "+46 70 123 4567",
  amounts: ["$5", "$10", "$25"],
  selectedAmount: "$10",
  bundleName: "7GB Nigeria",
  bundleData: "7GB",
  bundleMins: "Unlimited calling",
  bundleSMS: "SMS",
  bundleValidity: "30 days",
  bundlePrice: "$3.21",
  planName: "Unlimited Mexico",
  planPrice: "$4.99/mo",
  planFeatures: ["Unlimited calls to Mexico", "No connection fee", "Auto-renew monthly"],
  total: "$10.00",
  fee: "$0.00",
};

export function renderTopUpCard(props: Partial<TopUpCardProps> = {}, _index = 0): string {
  const variant = props.variant ?? "amount-select";
  const d = TOPUP_DEFAULTS;
  const country = props.country ?? d.country;
  const flag = props.flag ?? d.flag;

  if (variant === "amount-select") {
    const amounts = props.amounts ?? d.amounts;
    const selected = props.selectedAmount ?? d.selectedAmount;

    const pillsHtml = amounts.map(amt => {
      const isSelected = amt === selected;
      return `<div style="display:flex;align-items:center;justify-content:center;height:var(--rebtel-height-md);padding:0 var(--rebtel-spacing-lg);border-radius:var(--rebtel-radius-full);border:1px solid ${isSelected ? "var(--rebtel-brand-red)" : "var(--rebtel-border-default)"};background:${isSelected ? "var(--rebtel-brand-red)" : "var(--rebtel-surface-primary)"};color:${isSelected ? "var(--rebtel-text-on-brand)" : "var(--rebtel-text-primary)"};font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-md-size);line-height:var(--rebtel-label-md-lh);font-weight:500;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>${amt}</div>`;
    }).join("");

    return `
<div style="background:var(--rebtel-surface-primary);border-radius:var(--rebtel-radius-lg);padding:var(--rebtel-spacing-lg);box-sizing:border-box" data-component="topUpCard">
  <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls);margin-bottom:var(--rebtel-spacing-md)" data-text-editable>Rebtel Credits to ${country}</div>

  <div style="display:flex;gap:0;margin-bottom:var(--rebtel-spacing-md);border-bottom:1px solid var(--rebtel-border-secondary)">
    <div style="flex:1;text-align:center;padding-bottom:var(--rebtel-spacing-xs);border-bottom:2px solid var(--rebtel-brand-red);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);font-weight:600;color:var(--rebtel-brand-red);letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="tab" data-text-editable>Subscription</div>
    <div style="flex:1;text-align:center;padding-bottom:var(--rebtel-spacing-xs);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);font-weight:500;color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="tab" data-text-editable>Credits</div>
  </div>

  <div style="display:flex;gap:var(--rebtel-spacing-xs);margin-bottom:var(--rebtel-spacing-lg)">
    ${pillsHtml}
  </div>

  <div style="display:flex;justify-content:space-between;margin-bottom:var(--rebtel-spacing-xxs)">
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)">Mobile</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>20600 min</span>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:var(--rebtel-spacing-lg)">
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)">Landline</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>2500 min</span>
  </div>

  <div style="display:flex;align-items:center;justify-content:center;height:var(--rebtel-height-lg);background:var(--rebtel-button-primary);color:var(--rebtel-text-on-brand);border-radius:var(--rebtel-radius-full);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-md-size);line-height:var(--rebtel-label-md-lh);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>Buy now</div>
</div>`;
  }

  if (variant === "bundle") {
    const bundleName = props.bundleName ?? d.bundleName;
    const bundleData = props.bundleData ?? d.bundleData;
    const bundleMins = props.bundleMins ?? d.bundleMins;
    const bundleSMS = props.bundleSMS ?? d.bundleSMS ?? "SMS";
    const bundlePrice = props.bundlePrice ?? d.bundlePrice;

    const ICON_CHECK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

    return `
<div style="background:var(--rebtel-surface-primary);border-radius:var(--rebtel-radius-lg);border:1px solid var(--rebtel-border-secondary);padding:var(--rebtel-spacing-lg);box-sizing:border-box" data-component="topUpCard">
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);margin-bottom:var(--rebtel-spacing-sm)">
    <span style="font-size:20px">${flag}</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${bundleName}</span>
  </div>

  <div style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-xs);margin-bottom:var(--rebtel-spacing-md)">
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs)">
      ${ICON_CHECK}
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)">${bundleData}</span>
    </div>
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs)">
      ${ICON_CHECK}
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)">${bundleMins}</span>
    </div>
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs)">
      ${ICON_CHECK}
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)">${bundleSMS}</span>
    </div>
  </div>

  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--rebtel-spacing-md)">
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-sm-size);line-height:var(--rebtel-headline-sm-lh);font-weight:700;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${bundlePrice}</span>
  </div>

  <div style="display:flex;align-items:center;justify-content:center;height:var(--rebtel-height-lg);background:var(--rebtel-surface-primary);color:var(--rebtel-text-primary);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-full);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-md-size);line-height:var(--rebtel-label-md-lh);font-weight:500;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>Select product</div>
</div>`;
  }

  if (variant === "plan") {
    const planName = props.planName ?? d.planName;
    const planPrice = props.planPrice ?? d.planPrice;
    const planFeatures = props.planFeatures ?? d.planFeatures;
    const ICON_CHECK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

    return `
<div style="background:var(--rebtel-surface-primary);border-radius:var(--rebtel-radius-lg);border:1px solid var(--rebtel-border-highlight);padding:var(--rebtel-spacing-lg);box-sizing:border-box" data-component="topUpCard">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--rebtel-spacing-sm)">
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${planName}</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:700;color:var(--rebtel-brand-red);letter-spacing:var(--rebtel-ls)" data-text-editable>${planPrice}</span>
  </div>
  <div style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-xs);margin-bottom:var(--rebtel-spacing-lg)">
    ${planFeatures.map(f => `
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs)">
      ${ICON_CHECK}
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)">${f}</span>
    </div>`).join("")}
  </div>
  <div style="display:flex;align-items:center;justify-content:center;height:var(--rebtel-height-lg);background:var(--rebtel-button-primary);color:var(--rebtel-text-on-brand);border-radius:var(--rebtel-radius-full);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-md-size);line-height:var(--rebtel-label-md-lh);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>Subscribe</div>
</div>`;
  }

  // confirmation (receipt)
  const recipient = props.recipient ?? d.recipient;
  const recipientPhone = props.recipientPhone ?? d.recipientPhone;
  const carrier = props.carrier ?? d.carrier;
  const total = props.total ?? d.total;
  const fee = props.fee ?? d.fee;

  return `
<div style="background:var(--rebtel-surface-primary);border-radius:var(--rebtel-radius-lg);padding:var(--rebtel-spacing-lg);box-sizing:border-box" data-component="topUpCard">
  <div style="text-align:center;margin-bottom:var(--rebtel-spacing-lg)">
    <div style="width:52px;height:52px;border-radius:50%;background:var(--rebtel-green-light);display:flex;align-items:center;justify-content:center;margin:0 auto var(--rebtel-spacing-sm)">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-sm-size);line-height:var(--rebtel-headline-sm-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)">Top-Up Sent!</div>
  </div>
  <div style="background:var(--rebtel-surface-primary-light);border-radius:var(--rebtel-radius-sm);padding:var(--rebtel-spacing-md);margin-bottom:var(--rebtel-spacing-sm)">
    <div style="display:flex;justify-content:space-between;margin-bottom:var(--rebtel-spacing-xs)">
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">Recipient</span>
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${recipient}</span>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:var(--rebtel-spacing-xs)">
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">Phone</span>
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)">${recipientPhone}</span>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:var(--rebtel-spacing-xs)">
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">Carrier</span>
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)">${carrier}</span>
    </div>
    <div style="height:1px;background:var(--rebtel-border-secondary);margin:var(--rebtel-spacing-xs) 0"></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:var(--rebtel-spacing-xs)">
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">Service fee</span>
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)">${fee}</span>
    </div>
    <div style="display:flex;justify-content:space-between">
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)">Total</span>
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);font-weight:700;color:var(--rebtel-green);letter-spacing:var(--rebtel-ls)" data-text-editable>${total}</span>
    </div>
  </div>
</div>`;
}
