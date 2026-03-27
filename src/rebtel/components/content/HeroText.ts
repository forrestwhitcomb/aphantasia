// HeroText — Hero text block matching Figma
// Pano bold heading + KH Teka grey subtitle

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface HeroTextProps extends UIComponentPropsBase {
  title?: string;
  subtitle?: string;
}

export function renderHeroText(props: Partial<HeroTextProps> = {}): string {
  const title = props.title ?? props.label ?? "Which country do you want to connect to?";
  const subtitle = props.subtitle ?? "Picking a region will help us find you the best product for your needs. You can always find products for other regions later";

  return `
<div data-component="heroText" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-md);box-sizing:border-box">
  <h1 style="margin:0;font-family:var(--rebtel-font-display);font-size:var(--rebtel-display-md-size);line-height:var(--rebtel-display-md-lh);font-weight:700;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${title}</h1>
  <p style="margin:0;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)" data-text-editable>${subtitle}</p>
</div>`;
}
