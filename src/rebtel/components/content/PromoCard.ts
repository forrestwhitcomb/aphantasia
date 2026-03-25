// PromoCard — Promotional banner
// Variants: "banner" (compact), "inline" (card-style), "full-bleed" (full width gradient)

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface PromoCardProps extends UIComponentPropsBase {
  headline?: string;
  description?: string;
  ctaText?: string;
  variant?: "banner" | "inline" | "full-bleed";
}

const PROMO_PLACEHOLDERS = [
  { headline: "50% Off Mexico Calls", description: "Limited time offer. Call Mexico for just $0.01/min.", ctaText: "Claim Offer" },
  { headline: "Free First Call", description: "Try Rebtel free. Your first international call is on us.", ctaText: "Start Calling" },
  { headline: "Send Top-Ups Instantly", description: "Send mobile credit to family abroad in seconds.", ctaText: "Send Now" },
  { headline: "Unlimited Plan $4.99/mo", description: "Unlimited calls to 50+ countries. No hidden fees.", ctaText: "Get Plan" },
];

export function renderPromoCard(props: Partial<PromoCardProps> = {}, index = 0): string {
  const variant = props.variant ?? "inline";
  const p = PROMO_PLACEHOLDERS[index % PROMO_PLACEHOLDERS.length];
  const headline = props.headline ?? props.label ?? p.headline;
  const description = props.description ?? p.description;
  const ctaText = props.ctaText ?? p.ctaText;

  if (variant === "banner") {
    return `
<div style="display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);background:var(--rebtel-red-light, #FCEAEC);border-radius:var(--radius-md)" data-component="promoCard">
  <div style="flex:1;min-width:0">
    <span style="font-size:var(--font-size-sm);font-weight:700;color:var(--rebtel-red, #E63946);font-family:var(--font-body-family)" data-text-editable>${headline}</span>
    <span style="font-size:var(--font-size-xs);color:var(--rebtel-red-dark, #C62B38);font-family:var(--font-body-family);margin-left:var(--spacing-xs)" data-text-editable>${description}</span>
  </div>
  <div style="padding:var(--spacing-xs) var(--spacing-md);background:var(--rebtel-red, #E63946);color:#fff;border-radius:var(--radius-full, 999px);font-size:var(--font-size-xs);font-weight:600;font-family:var(--font-body-family);cursor:pointer;white-space:nowrap" data-text-editable data-interactive="button">${ctaText}</div>
</div>`;
  }

  if (variant === "full-bleed") {
    return `
<div style="padding:var(--spacing-lg) var(--spacing-md);background:var(--rebtel-promo-gradient, linear-gradient(135deg, #E63946 0%, #FF6B6B 100%));border-radius:var(--radius-lg);text-align:center;position:relative;overflow:hidden" data-component="promoCard">
  <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.1)"></div>
  <div style="position:absolute;bottom:-30px;left:-10px;width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,0.08)"></div>
  <div style="position:relative;z-index:1">
    <div style="font-size:var(--font-size-xl, 20px);font-weight:800;color:#fff;font-family:var(--font-body-family);line-height:1.2" data-text-editable>${headline}</div>
    <div style="font-size:var(--font-size-sm);color:rgba(255,255,255,0.9);font-family:var(--font-body-family);margin-top:var(--spacing-xs);line-height:1.4" data-text-editable>${description}</div>
    <div style="display:inline-block;margin-top:var(--spacing-md);padding:var(--spacing-sm) var(--spacing-xl, 24px);background:#fff;color:var(--rebtel-red, #E63946);border-radius:var(--radius-full, 999px);font-size:var(--font-size-md);font-weight:700;font-family:var(--font-body-family);cursor:pointer" data-text-editable data-interactive="button">${ctaText}</div>
  </div>
</div>`;
  }

  // inline (default)
  return `
<div style="padding:var(--spacing-md);background:var(--color-surface);border-radius:var(--radius-lg);box-shadow:0 1px 3px rgba(0,0,0,0.06);border-left:4px solid var(--rebtel-red, #E63946)" data-component="promoCard">
  <div style="font-size:var(--font-size-md);font-weight:700;color:var(--color-foreground);font-family:var(--font-body-family);line-height:1.3" data-text-editable>${headline}</div>
  <div style="font-size:var(--font-size-sm);color:var(--color-muted);font-family:var(--font-body-family);margin-top:var(--spacing-xs);line-height:1.4" data-text-editable>${description}</div>
  <div style="margin-top:var(--spacing-md)">
    <div style="display:inline-block;padding:var(--spacing-xs) var(--spacing-lg);background:var(--rebtel-gradient-primary, #E63946);color:#fff;border-radius:var(--radius-full, 999px);font-size:var(--font-size-sm);font-weight:600;font-family:var(--font-body-family);cursor:pointer" data-text-editable data-interactive="button">${ctaText}</div>
  </div>
</div>`;
}
