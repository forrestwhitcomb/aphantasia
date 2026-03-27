// PromoCard — Promotional offer card matching Figma
// Figma: Dark card with image, "Welcome offer" / "Subscription" tabs,
// white text, "Start free trial" red pill CTA
// Variants: "offer" | "banner" | "inline"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface PromoCardProps extends UIComponentPropsBase {
  headline?: string;
  description?: string;
  ctaText?: string;
  tabs?: string[];
  variant?: "offer" | "banner" | "inline";
}

export function renderPromoCard(props: Partial<PromoCardProps> = {}, _index = 0): string {
  const variant = props.variant ?? "offer";
  const headline = props.headline ?? props.label ?? "Get started with 7 days of free unlimited calls to USA";
  const description = props.description ?? "Then just $12/month. No contract, just connection. Cancel anytime.";
  const ctaText = props.ctaText ?? "Start free trial";
  const tabs = props.tabs ?? ["Welcome offer", "Subscription"];

  if (variant === "offer") {
    // Dark card matching Figma exactly
    const tabsHtml = tabs.map((tab, i) => {
      const isActive = i === 0;
      return `<span style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:var(--rebtel-radius-full);background:${isActive ? "var(--rebtel-success)" : "rgba(255,255,255,0.15)"};color:${isActive ? "#FFFFFF" : "rgba(255,255,255,0.8)"};font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-xs-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer;white-space:nowrap" data-interactive="tab">${isActive ? "★ " : ""}${tab}</span>`;
    }).join("");

    return `
<div data-component="promoCard" style="position:relative;display:flex;flex-direction:column;justify-content:flex-end;min-height:240px;background:var(--rebtel-grey-900);border-radius:var(--rebtel-radius-lg);padding:var(--rebtel-spacing-md);box-sizing:border-box;overflow:hidden">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)"></div>
  <div style="position:relative;z-index:1;display:flex;flex-direction:column;gap:var(--rebtel-spacing-sm)">
    <div style="display:flex;gap:var(--rebtel-spacing-xs)">${tabsHtml}</div>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:#FFFFFF;letter-spacing:var(--rebtel-ls)" data-text-editable>${headline}</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);line-height:var(--rebtel-paragraph-xs-lh);color:rgba(255,255,255,0.7);letter-spacing:var(--rebtel-ls)" data-text-editable>${description}</span>
    <button style="align-self:flex-start;height:var(--rebtel-height-sm);padding:0 var(--rebtel-spacing-md);border:none;border-radius:var(--rebtel-radius-full);background:var(--rebtel-brand-red);color:#FFFFFF;font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>${ctaText}</button>
  </div>
</div>`;
  }

  if (variant === "banner") {
    return `
<div data-component="promoCard" style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-sm) var(--rebtel-spacing-md);background:var(--rebtel-red-50);border-radius:var(--rebtel-radius-md);box-sizing:border-box">
  <div style="flex:1;min-width:0">
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:700;color:var(--rebtel-brand-red);letter-spacing:var(--rebtel-ls)" data-text-editable>${headline}</span>
  </div>
  <button style="padding:var(--rebtel-spacing-xs) var(--rebtel-spacing-md);background:var(--rebtel-brand-red);color:#FFFFFF;border:none;border-radius:var(--rebtel-radius-full);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-xs-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer;white-space:nowrap" data-interactive="button" data-text-editable>${ctaText}</button>
</div>`;
  }

  // inline (default)
  return `
<div data-component="promoCard" style="padding:var(--rebtel-spacing-md);background:var(--rebtel-surface-primary);border-radius:var(--rebtel-radius-lg);border:1px solid var(--rebtel-border-secondary);box-sizing:border-box">
  <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);font-weight:700;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls);line-height:1.3" data-text-editable>${headline}</div>
  <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls);margin-top:var(--rebtel-spacing-xs);line-height:1.4" data-text-editable>${description}</div>
  <button style="margin-top:var(--rebtel-spacing-md);padding:var(--rebtel-spacing-xs) var(--rebtel-spacing-lg);background:var(--rebtel-brand-red);color:#FFFFFF;border:none;border-radius:var(--rebtel-radius-full);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>${ctaText}</button>
</div>`;
}
