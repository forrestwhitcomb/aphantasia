// PhoneInput — Rebtel phone number input with country code
// Matches Figma: globe icon + flag dropdown + "Enter phone number" field
// Variants: "with-country" | "simple" | "with-contacts"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderPhoneInput(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "with-country" | "simple" | "with-contacts") ?? "with-country";
  const label = props.label ?? "Phone number";

  const ICON_GLOBE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
  const ICON_CHEVRON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const ICON_CONTACTS = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-brand)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;

  switch (variant) {
    case "with-country":
      return `
<div data-component="phoneInput" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-xs);padding:var(--rebtel-spacing-md);width:100%;box-sizing:border-box">
  <label style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);line-height:var(--rebtel-label-sm-lh);font-weight:500;color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)" data-text-editable>${label}</label>
  <div style="display:flex;align-items:center;background:var(--rebtel-surface-primary);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-sm);height:var(--rebtel-height-lg);overflow:hidden" data-interactive="input">
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);padding:0 var(--rebtel-spacing-sm);height:100%;border-right:1px solid var(--rebtel-border-secondary);cursor:pointer;flex-shrink:0" data-interactive="button">
      ${ICON_GLOBE}
      <span style="font-size:20px">&#127474;&#127485;</span>
      ${ICON_CHEVRON}
    </div>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);letter-spacing:var(--rebtel-ls);color:var(--rebtel-text-tertiary);padding:0 var(--rebtel-spacing-md);flex:1" data-text-editable>Enter phone number</span>
  </div>
</div>`;

    case "simple":
      return `
<div data-component="phoneInput" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-xs);padding:var(--rebtel-spacing-md);width:100%;box-sizing:border-box">
  <label style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);line-height:var(--rebtel-label-sm-lh);font-weight:500;color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)" data-text-editable>${label}</label>
  <div style="display:flex;align-items:center;background:var(--rebtel-surface-primary);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-sm);height:var(--rebtel-height-lg);padding:0 var(--rebtel-spacing-md)" data-interactive="input">
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);letter-spacing:var(--rebtel-ls);color:var(--rebtel-text-tertiary);flex:1" data-text-editable>+1 (555) 000-0000</span>
  </div>
</div>`;

    case "with-contacts":
      return `
<div data-component="phoneInput" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-xs);padding:var(--rebtel-spacing-md);width:100%;box-sizing:border-box">
  <label style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);line-height:var(--rebtel-label-sm-lh);font-weight:500;color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)" data-text-editable>${label}</label>
  <div style="display:flex;align-items:center;background:var(--rebtel-surface-primary);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-sm);height:var(--rebtel-height-lg);overflow:hidden" data-interactive="input">
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);padding:0 var(--rebtel-spacing-sm);height:100%;border-right:1px solid var(--rebtel-border-secondary);cursor:pointer;flex-shrink:0" data-interactive="button">
      ${ICON_GLOBE}
      <span style="font-size:20px">&#127482;&#127480;</span>
      ${ICON_CHEVRON}
    </div>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);letter-spacing:var(--rebtel-ls);color:var(--rebtel-text-tertiary);padding:0 var(--rebtel-spacing-md);flex:1" data-text-editable>Enter phone number</span>
    <div style="width:var(--rebtel-height-md);height:var(--rebtel-height-md);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;margin-right:var(--rebtel-spacing-xs)" data-interactive="button">${ICON_CONTACTS}</div>
  </div>
</div>`;

    default:
      return renderPhoneInput({ ...props, variant: "with-country" });
  }
}
