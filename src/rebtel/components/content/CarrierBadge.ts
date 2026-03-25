// CarrierBadge — Mobile carrier tag
// Variants: "default" (neutral), "featured" (highlighted), "unavailable" (grayed)

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface CarrierBadgeProps extends UIComponentPropsBase {
  carrier?: string;
  variant?: "default" | "featured" | "unavailable";
}

const CARRIER_PLACEHOLDERS = [
  "Telcel",
  "Airtel",
  "MTN",
  "Globe",
  "Claro",
  "Movistar",
  "Vodafone",
  "Jio",
];

export function renderCarrierBadge(props: Partial<CarrierBadgeProps> = {}, index = 0): string {
  const variant = props.variant ?? "default";
  const carrier = props.carrier ?? props.label ?? CARRIER_PLACEHOLDERS[index % CARRIER_PLACEHOLDERS.length];

  if (variant === "featured") {
    return `
<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 12px;background:var(--rebtel-red-light, #FCEAEC);border:1px solid var(--rebtel-red, #E63946);border-radius:var(--radius-full, 999px);font-size:var(--font-size-xs);font-weight:600;color:var(--rebtel-red, #E63946);font-family:var(--font-body-family);white-space:nowrap" data-component="carrierBadge">
  <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--rebtel-red, #E63946)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  <span data-text-editable>${carrier}</span>
</span>`;
  }

  if (variant === "unavailable") {
    return `
<span style="display:inline-flex;align-items:center;padding:4px 12px;background:var(--color-background);border-radius:var(--radius-full, 999px);font-size:var(--font-size-xs);font-weight:500;color:var(--color-muted);font-family:var(--font-body-family);opacity:0.6;white-space:nowrap;text-decoration:line-through" data-component="carrierBadge">
  <span data-text-editable>${carrier}</span>
</span>`;
  }

  // default
  return `
<span style="display:inline-flex;align-items:center;padding:4px 12px;background:var(--rebtel-carrier-bg, #F1F3F5);border-radius:var(--radius-full, 999px);font-size:var(--font-size-xs);font-weight:600;color:var(--color-foreground);font-family:var(--font-body-family);white-space:nowrap" data-component="carrierBadge">
  <span data-text-editable>${carrier}</span>
</span>`;
}
