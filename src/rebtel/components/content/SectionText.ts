// SectionText — Section title + description matching Figma export CSS
// Title: KH Teka 16px/16px, 400, left, #2D2D32 (grey-800), letter-spacing 0.02em
// Description: KH Teka 14px/20px, 400, left, #737378 (text-secondary), letter-spacing 0.02em
// Container: justify-content center, no padding

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface SectionTextProps extends UIComponentPropsBase {
  title?: string;
  description?: string;
}

export function renderSectionText(props: Partial<SectionTextProps> = {}): string {
  const title = props.title ?? props.label ?? "Plans";
  const description = props.description ?? "Short Product description about Plans";

  return `
<div data-component="sectionText" style="display:flex;flex-direction:column;align-items:flex-start;justify-content:center;width:100%;box-sizing:border-box;font-family:var(--rebtel-font-body);font-size:16px;color:var(--rebtel-grey-800);text-align:left">
  <span style="align-self:stretch;letter-spacing:0.02em;line-height:16px" data-text-editable>${title}</span>
  <span style="align-self:stretch;font-size:14px;letter-spacing:0.02em;line-height:20px;color:var(--rebtel-text-secondary)" data-text-editable>${description}</span>
</div>`;
}
