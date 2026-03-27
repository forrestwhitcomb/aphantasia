// ProductCard — Product card matching Figma exactly
// Tags row + title + feature pills + price/validity + CTA button
// Variants: "standard" | "popular"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface ProductCardProps extends UIComponentPropsBase {
  variant?: "standard" | "popular";
  title?: string;
  tags?: string[];
  features?: string[];
  price?: string;
  validity?: string;
  ctaLabel?: string;
}

const ICON_INFO = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

export function renderProductCard(props: Partial<ProductCardProps> = {}): string {
  const title = props.title ?? props.label ?? "7GB Nigeria";
  const tags = props.tags ?? ["Most popular", "Carrier Bonus"];
  const features = props.features ?? ["11 GB data", "Unlimited calling", "20 SMS"];
  const price = props.price ?? "$3.21";
  const validity = props.validity ?? "30 days";
  const ctaLabel = props.ctaLabel ?? "Select product";

  const tagsHtml = tags.map(tag => `
    <span style="display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-xs);font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-xs-size);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls);white-space:nowrap">
      <span style="color:var(--rebtel-brand-red);font-size:10px">★</span> ${tag}
    </span>
  `).join("");

  const featuresHtml = features.map(f => `
    <span style="display:inline-flex;padding:4px 8px;border:1px solid var(--rebtel-border-secondary);border-radius:var(--rebtel-radius-xs);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls);white-space:nowrap">${f}</span>
  `).join("");

  return `
<div data-component="productCard" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-md);background:var(--rebtel-surface-primary);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-lg);box-sizing:border-box;width:100%">
  <div style="display:flex;flex-wrap:wrap;gap:var(--rebtel-spacing-xs)">${tagsHtml}</div>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-sm-size);line-height:var(--rebtel-headline-sm-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${title}</span>
  <div style="display:flex;flex-wrap:wrap;gap:var(--rebtel-spacing-xxs)">${featuresHtml}</div>
  <div style="display:flex;align-items:baseline;justify-content:space-between;margin-top:var(--rebtel-spacing-xs)">
    <div>
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">You pay</span>
      <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-sm-size);font-weight:700;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${price}</div>
    </div>
    <div style="text-align:right">
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">Validity</span>
      <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-sm-size);font-weight:700;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${validity}</div>
    </div>
  </div>
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);margin-top:var(--rebtel-spacing-xs)">
    <div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-full);cursor:pointer" data-interactive="button">${ICON_INFO}</div>
    <button style="flex:1;height:var(--rebtel-height-lg);border:1.5px solid var(--rebtel-brand-red);border-radius:var(--rebtel-radius-full);background:transparent;color:var(--rebtel-brand-red);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>${ctaLabel}</button>
  </div>
</div>`;
}
