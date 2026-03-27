// PhoneInput — Rebtel phone number input with country code
// Matches Figma: pill-shaped input, globe icon + flag dropdown + "Enter phone number"
// Variants: "empty" | "filled" | "with-contacts"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderPhoneInput(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "empty" | "filled" | "with-contacts") ?? "empty";
  const label = props.label ?? "Enter phone number";

  const ICON_GLOBE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
  const ICON_CHEVRON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

  // Nigeria flag as two vertical bars (green-white-green)
  const FLAG_NG = `<div style="display:flex;width:20px;height:14px;border-radius:2px;overflow:hidden"><div style="flex:1;background:#008751"></div><div style="flex:1;background:#fff"></div><div style="flex:1;background:#008751"></div></div>`;

  if (variant === "filled") {
    return `
<div data-component="phoneInput" style="display:flex;align-items:center;background:var(--rebtel-surface-primary);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-full);height:var(--rebtel-height-lg);overflow:hidden;margin:0 var(--rebtel-spacing-md);box-sizing:border-box" data-interactive="input">
  <div style="display:flex;align-items:center;gap:6px;padding:0 var(--rebtel-spacing-sm) 0 var(--rebtel-spacing-md);height:100%;border-right:1px solid var(--rebtel-border-secondary);cursor:pointer;flex-shrink:0" data-interactive="button">
    ${FLAG_NG}
    ${ICON_CHEVRON}
  </div>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);letter-spacing:var(--rebtel-ls);color:var(--rebtel-text-primary);padding:0 var(--rebtel-spacing-md);flex:1;font-weight:400" data-text-editable>+234 4783432466</span>
</div>`;
  }

  if (variant === "with-contacts") {
    return `
<div data-component="phoneInput" style="display:flex;align-items:center;background:var(--rebtel-surface-primary);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-full);height:var(--rebtel-height-lg);overflow:hidden;margin:0 var(--rebtel-spacing-md);box-sizing:border-box" data-interactive="input">
  <div style="display:flex;align-items:center;gap:6px;padding:0 var(--rebtel-spacing-sm) 0 var(--rebtel-spacing-md);height:100%;border-right:1px solid var(--rebtel-border-secondary);cursor:pointer;flex-shrink:0" data-interactive="button">
    ${ICON_GLOBE}
    ${ICON_CHEVRON}
  </div>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);letter-spacing:var(--rebtel-ls);color:var(--rebtel-text-tertiary);padding:0 var(--rebtel-spacing-md);flex:1" data-text-editable>${label}</span>
</div>`;
  }

  // empty (default) — globe icon + chevron + placeholder
  return `
<div data-component="phoneInput" style="display:flex;align-items:center;background:var(--rebtel-surface-primary);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-full);height:var(--rebtel-height-lg);overflow:hidden;margin:0 var(--rebtel-spacing-md);box-sizing:border-box" data-interactive="input">
  <div style="display:flex;align-items:center;gap:6px;padding:0 var(--rebtel-spacing-sm) 0 var(--rebtel-spacing-md);height:100%;border-right:1px solid var(--rebtel-border-secondary);cursor:pointer;flex-shrink:0" data-interactive="button">
    ${ICON_GLOBE}
    ${ICON_CHEVRON}
  </div>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);letter-spacing:var(--rebtel-ls);color:var(--rebtel-text-tertiary);padding:0 var(--rebtel-spacing-md);flex:1" data-text-editable>${label}</span>
</div>`;
}
