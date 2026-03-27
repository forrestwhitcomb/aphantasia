// ContactCard — Home cards matching Figma exactly
// Figma shows two variants:
// - "calling": Green badge, avatar, name, minutes left, "Call again" black button
// - "topup": Grey badge, avatar, name, amount sent/received, "Products" + "Send again" buttons
// - "compact": Simple country list row (flag + name + contacts + chevron)

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface ContactCardProps extends UIComponentPropsBase {
  name?: string;
  phone?: string;
  flag?: string;
  callTime?: string;
  contactCount?: string;
  minutesLeft?: string;
  localTime?: string;
  amountSent?: string;
  theyReceived?: string;
  variant?: "calling" | "topup" | "compact";
}

const ICON_CHEVRON_RIGHT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-grey-400)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
const ICON_MORE = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>`;
const ICON_CALL = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const ICON_SEND = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 12l-4-4v8l4-4z"/></svg>`;

// Simple avatar placeholder
const AVATAR = `<div style="width:40px;height:40px;border-radius:var(--rebtel-radius-full);background:var(--rebtel-grey-100);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-grey-400)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`;

export function renderContactCard(props: Partial<ContactCardProps> = {}, _index = 0): string {
  const variant = props.variant ?? "calling";
  const name = props.name ?? props.label ?? "Emil Lee Ann Bergst...";
  const flag = props.flag ?? "\u{1F1F3}\u{1F1EC}";

  if (variant === "calling") {
    const minutesLeft = props.minutesLeft ?? "340 minutes left";
    const localTime = props.localTime ?? "Local time 2:30 PM";

    return `
<div data-component="contactCard" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-md);background:var(--rebtel-surface-primary);border-radius:var(--rebtel-radius-lg);border:1px solid var(--rebtel-border-secondary);box-sizing:border-box;box-shadow:var(--rebtel-shadow-card, 0 2px 8px rgba(0,0,0,0.06))">
  <div style="display:flex;align-items:center;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs)">
      <span style="display:inline-flex;align-items:center;padding:3px 8px;border-radius:var(--rebtel-radius-full);background:#34C759;font-family:var(--rebtel-font-body);font-size:10px;font-weight:600;color:#FFFFFF;letter-spacing:var(--rebtel-ls)">Calling</span>
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">10 minutes ago</span>
    </div>
    ${ICON_MORE}
  </div>
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm)">
    ${AVATAR}
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs)">
        <span style="font-size:16px">${flag}</span>
        <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);font-weight:700;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls);overflow:hidden;text-overflow:ellipsis;white-space:nowrap" data-text-editable>${name}</span>
      </div>
    </div>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between">
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);color:var(--rebtel-success);letter-spacing:var(--rebtel-ls)">●${minutesLeft}</span>
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">${localTime}</span>
  </div>
  <button style="display:flex;align-items:center;justify-content:center;gap:var(--rebtel-spacing-xs);width:100%;height:var(--rebtel-height-md);border:none;border-radius:var(--rebtel-radius-full);background:var(--rebtel-grey-900);color:var(--rebtel-brand-white);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:600;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button">${ICON_CALL} Call again</button>
</div>`;
  }

  if (variant === "topup") {
    const amountSent = props.amountSent ?? "UGX 10499";
    const theyReceived = props.theyReceived ?? "Monthly Youtube & Soc...";

    return `
<div data-component="contactCard" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-md);background:var(--rebtel-surface-primary);border-radius:var(--rebtel-radius-lg);border:1px solid var(--rebtel-border-secondary);box-sizing:border-box;box-shadow:var(--rebtel-shadow-card, 0 2px 8px rgba(0,0,0,0.06))">
  <div style="display:flex;align-items:center;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs)">
      <span style="display:inline-flex;align-items:center;padding:3px 8px;border-radius:var(--rebtel-radius-full);background:var(--rebtel-grey-100);font-family:var(--rebtel-font-body);font-size:10px;font-weight:600;color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)">Top-up</span>
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">10 minutes ago</span>
    </div>
    ${ICON_MORE}
  </div>
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm)">
    ${AVATAR}
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs)">
        <span style="font-size:16px">${flag}</span>
        <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);font-weight:700;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls);overflow:hidden;text-overflow:ellipsis;white-space:nowrap" data-text-editable>${name}</span>
      </div>
    </div>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between">
    <div>
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">You sent</span>
      <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${amountSent}</div>
    </div>
    <div style="text-align:right">
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">They received</span>
      <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls);overflow:hidden;text-overflow:ellipsis;white-space:nowrap" data-text-editable>${theyReceived}</div>
    </div>
  </div>
  <div style="display:flex;gap:var(--rebtel-spacing-xs)">
    <button style="flex:1;height:var(--rebtel-height-md);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-full);background:var(--rebtel-surface-primary);color:var(--rebtel-text-primary);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:500;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>Products</button>
    <button style="flex:1;display:flex;align-items:center;justify-content:center;gap:var(--rebtel-spacing-xxs);height:var(--rebtel-height-md);border:1px solid var(--rebtel-border-default);border-radius:var(--rebtel-radius-full);background:var(--rebtel-surface-primary);color:var(--rebtel-text-primary);font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:500;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button">${ICON_SEND} Send again</button>
  </div>
</div>`;
  }

  // compact (country list row)
  const contactCount = props.contactCount ?? "646";
  return `
<div data-component="contactCard" style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);padding:var(--rebtel-spacing-sm) 0;height:44px;box-sizing:border-box;cursor:pointer" data-interactive="button">
  <span style="font-size:20px;flex-shrink:0;line-height:1">${flag}</span>
  <span style="flex:1;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${name}</span>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls);white-space:nowrap">${contactCount} contacts here</span>
  ${ICON_CHEVRON_RIGHT}
</div>`;
}
