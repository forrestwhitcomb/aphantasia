// HeroText — Hero text block matching Figma export CSS
// Headline: Pano 20px/32px, 400, left, #111 (text-primary), letter-spacing 0.02em
// Body: KH Teka 16px/24px, 400, left, #737378 (text-secondary), letter-spacing 0.02em
// No container padding

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface HeroTextProps extends UIComponentPropsBase {
  title?: string;
  subtitle?: string;
}

export function renderHeroText(props: Partial<HeroTextProps> = {}): string {
  const title = props.title ?? props.label ?? "Which country do you want to connect to?";
  const subtitle = props.subtitle ?? "Picking a region will help us find the best product for your needs. You can always find products for other regions later";

  return `
<div data-component="heroText" style="display:flex;flex-direction:column;align-items:flex-start;width:100%;box-sizing:border-box">
  <span style="display:block;width:100%;font-family:var(--rebtel-font-display);font-size:20px;line-height:32px;font-weight:400;color:var(--rebtel-text-primary);letter-spacing:0.02em;text-align:left" data-text-editable>${title}</span>
  <span style="display:block;width:100%;font-family:var(--rebtel-font-body);font-size:16px;line-height:24px;font-weight:400;color:var(--rebtel-text-secondary);letter-spacing:0.02em;text-align:left" data-text-editable>${subtitle}</span>
</div>`;
}
