// CountryRow — Country list item matching Figma exactly
// Flag (20px) + country name (16px medium) + "646 contacts here" grey + chevron
// No border-bottom dividers, 44px row height

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface CountryRowProps extends UIComponentPropsBase {
  country?: string;
  flag?: string;
  meta?: string;
  variant?: "simple" | "with-meta" | "with-rate";
}

const COUNTRY_PLACEHOLDERS = [
  { country: "Afghanistan", flag: "\u{1F1E6}\u{1F1EB}" },
  { country: "Argentina", flag: "\u{1F1E6}\u{1F1F7}" },
  { country: "Brasil", flag: "\u{1F1E7}\u{1F1F7}" },
  { country: "Colombia", flag: "\u{1F1E8}\u{1F1F4}" },
  { country: "India", flag: "\u{1F1EE}\u{1F1F3}" },
  { country: "Mexico", flag: "\u{1F1F2}\u{1F1FD}" },
  { country: "Philippines", flag: "\u{1F1F5}\u{1F1ED}" },
  { country: "China", flag: "\u{1F1E8}\u{1F1F3}" },
  { country: "Cuba", flag: "\u{1F1E8}\u{1F1FA}" },
  { country: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}" },
];

const ICON_CHEVRON_RIGHT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-grey-400)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

export function renderCountryRow(props: Partial<CountryRowProps> = {}, index = 0): string {
  const p = COUNTRY_PLACEHOLDERS[index % COUNTRY_PLACEHOLDERS.length];
  const country = props.country ?? props.label ?? p.country;
  const flag = props.flag ?? p.flag;
  const meta = props.meta ?? "646 contacts here";

  return `
<div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);padding:var(--rebtel-spacing-sm) 0;height:44px;box-sizing:border-box;cursor:pointer" data-component="countryRow" data-interactive="button">
  <span style="font-size:20px;flex-shrink:0;line-height:1">${flag}</span>
  <span style="flex:1;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${country}</span>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls);white-space:nowrap">${meta}</span>
  ${ICON_CHEVRON_RIGHT}
</div>`;
}
