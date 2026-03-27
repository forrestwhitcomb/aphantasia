// SectionText — Section title + description matching Figma
// Bold title (KH Teka) + optional description text

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface SectionTextProps extends UIComponentPropsBase {
  title?: string;
  description?: string;
}

export function renderSectionText(props: Partial<SectionTextProps> = {}): string {
  const title = props.title ?? props.label ?? "Plans";
  const description = props.description ?? "Best Product description about Plans";

  return `
<div data-component="sectionText" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-xxs);padding:var(--rebtel-spacing-md);box-sizing:border-box">
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:700;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${title}</span>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)" data-text-editable>${description}</span>
</div>`;
}
