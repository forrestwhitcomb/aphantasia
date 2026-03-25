// CountryRow — Country list item for picker
// Variants: "simple" (flag + name), "with-rate" (flag + name + rate), "with-flag" (larger flag)

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface CountryRowProps extends UIComponentPropsBase {
  country?: string;
  flag?: string;
  rate?: string;
  variant?: "simple" | "with-rate" | "with-flag";
}

const COUNTRY_PLACEHOLDERS = [
  { country: "Mexico", flag: "\u{1F1F2}\u{1F1FD}", rate: "$0.02/min" },
  { country: "India", flag: "\u{1F1EE}\u{1F1F3}", rate: "$0.01/min" },
  { country: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}", rate: "$0.04/min" },
  { country: "Philippines", flag: "\u{1F1F5}\u{1F1ED}", rate: "$0.03/min" },
  { country: "Colombia", flag: "\u{1F1E8}\u{1F1F4}", rate: "$0.03/min" },
  { country: "Pakistan", flag: "\u{1F1F5}\u{1F1F0}", rate: "$0.02/min" },
  { country: "Bangladesh", flag: "\u{1F1E7}\u{1F1E9}", rate: "$0.02/min" },
  { country: "Egypt", flag: "\u{1F1EA}\u{1F1EC}", rate: "$0.05/min" },
];

export function renderCountryRow(props: Partial<CountryRowProps> = {}, index = 0): string {
  const variant = props.variant ?? "simple";
  const p = COUNTRY_PLACEHOLDERS[index % COUNTRY_PLACEHOLDERS.length];
  const country = props.country ?? props.label ?? p.country;
  const flag = props.flag ?? p.flag;
  const rate = props.rate ?? p.rate;

  if (variant === "with-flag") {
    return `
<div style="display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-md);background:var(--color-surface);border-bottom:1px solid var(--color-border, rgba(0,0,0,0.06));cursor:pointer" data-component="countryRow">
  <span style="font-size:32px;line-height:1">${flag}</span>
  <span style="flex:1;font-size:var(--font-size-md);font-weight:500;color:var(--color-foreground);font-family:var(--font-body-family)" data-text-editable>${country}</span>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
</div>`;
  }

  if (variant === "with-rate") {
    return `
<div style="display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);background:var(--color-surface);border-bottom:1px solid var(--color-border, rgba(0,0,0,0.06));cursor:pointer" data-component="countryRow">
  <span style="font-size:20px;flex-shrink:0">${flag}</span>
  <span style="flex:1;font-size:var(--font-size-sm);font-weight:500;color:var(--color-foreground);font-family:var(--font-body-family)" data-text-editable>${country}</span>
  <span style="font-size:var(--font-size-sm);font-weight:600;color:var(--rebtel-green-dark, #27AE60);font-family:var(--font-body-family)" data-text-editable>${rate}</span>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
</div>`;
  }

  // simple (default)
  return `
<div style="display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm) var(--spacing-md);background:var(--color-surface);border-bottom:1px solid var(--color-border, rgba(0,0,0,0.06));cursor:pointer" data-component="countryRow">
  <span style="font-size:20px;flex-shrink:0">${flag}</span>
  <span style="flex:1;font-size:var(--font-size-sm);font-weight:500;color:var(--color-foreground);font-family:var(--font-body-family)" data-text-editable>${country}</span>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
</div>`;
}
