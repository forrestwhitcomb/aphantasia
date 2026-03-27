// BottomSheet — Bottom sheet matching Figma exactly
// Drag handle + title + 2x2 grid of selectable option cards
// Variants: "frequency" | "generic"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface BottomSheetProps extends UIComponentPropsBase {
  variant?: "frequency" | "generic";
  title?: string;
  options?: string[];
}

export function renderRebtelBottomSheet(props: Partial<BottomSheetProps> = {}): string {
  const title = props.title ?? props.label ?? "How often?";
  const options = props.options ?? ["7 days", "14 days", "21 days", "30 days"];

  const optionCards = options.map(opt => `
    <div style="flex:1;min-width:calc(50% - 4px);display:flex;align-items:center;justify-content:center;height:var(--rebtel-height-xl);background:var(--rebtel-surface-primary-light);border:1px solid var(--rebtel-border-secondary);border-radius:var(--rebtel-radius-sm);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>${opt}</div>
  `).join("");

  return `
<div data-component="rebtelBottomSheet" style="display:flex;flex-direction:column;align-items:center;background:var(--rebtel-surface-primary);border-radius:var(--rebtel-radius-lg) var(--rebtel-radius-lg) 0 0;padding:var(--rebtel-spacing-sm) var(--rebtel-spacing-md) var(--rebtel-spacing-xl);box-shadow:var(--rebtel-shadow-lg, 0 -4px 24px rgba(0,0,0,0.12));box-sizing:border-box;width:100%">
  <div style="width:40px;height:4px;background:var(--rebtel-grey-200);border-radius:var(--rebtel-radius-full);margin-bottom:var(--rebtel-spacing-md)"></div>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls);margin-bottom:var(--rebtel-spacing-md)" data-text-editable>${title}</span>
  <div style="display:flex;flex-wrap:wrap;gap:var(--rebtel-spacing-xs);width:100%">
    ${optionCards}
  </div>
</div>`;
}
