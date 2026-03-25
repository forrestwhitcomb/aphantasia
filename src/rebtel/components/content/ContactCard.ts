// ContactCard — Country list items matching Figma
// Figma: flag emoji + country name + "848 contacts here >" right-aligned
// Clean list rows with dividers
// Variants: "compact" | "detailed" | "recent"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface ContactCardProps extends UIComponentPropsBase {
  name?: string;
  phone?: string;
  country?: string;
  flag?: string;
  callTime?: string;
  initials?: string;
  contactCount?: string;
  variant?: "compact" | "detailed" | "recent";
}

const CONTACT_PLACEHOLDERS = [
  { name: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}", contactCount: "848", phone: "+234 80 1234 5678", initials: "NG", callTime: "2 min ago" },
  { name: "India", flag: "\u{1F1EE}\u{1F1F3}", contactCount: "1,204", phone: "+91 98765 43210", initials: "IN", callTime: "Yesterday" },
  { name: "Mexico", flag: "\u{1F1F2}\u{1F1FD}", contactCount: "392", phone: "+52 55 1234 5678", initials: "MX", callTime: "3 days ago" },
  { name: "Philippines", flag: "\u{1F1F5}\u{1F1ED}", contactCount: "267", phone: "+63 917 123 4567", initials: "PH", callTime: "Last week" },
];

const ICON_CHEVRON_RIGHT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

export function renderContactCard(props: Partial<ContactCardProps> = {}, index = 0): string {
  const variant = props.variant ?? "compact";
  const placeholder = CONTACT_PLACEHOLDERS[index % CONTACT_PLACEHOLDERS.length];
  const name = props.name ?? props.label ?? placeholder.name;
  const flag = props.flag ?? placeholder.flag;
  const contactCount = props.contactCount ?? placeholder.contactCount;
  const phone = props.phone ?? placeholder.phone;
  const callTime = props.callTime ?? placeholder.callTime;

  if (variant === "compact") {
    // Figma country list row: flag + country name + "848 contacts here >"
    return `
<div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-sm) var(--rebtel-spacing-md);min-height:var(--rebtel-height-xl);background:var(--rebtel-surface-primary);border-bottom:1px solid var(--rebtel-border-secondary);cursor:pointer;box-sizing:border-box" data-component="contactCard" data-interactive="button">
  <span style="font-size:24px;flex-shrink:0">${flag}</span>
  <span style="flex:1;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls);overflow:hidden;text-overflow:ellipsis;white-space:nowrap" data-text-editable>${name}</span>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls);white-space:nowrap" data-text-editable>${contactCount} contacts here</span>
  <span style="display:flex;align-items:center;flex-shrink:0">${ICON_CHEVRON_RIGHT}</span>
</div>`;
  }

  if (variant === "recent") {
    return `
<div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-sm) var(--rebtel-spacing-md);min-height:var(--rebtel-height-xl);background:var(--rebtel-surface-primary);border-bottom:1px solid var(--rebtel-border-secondary);box-sizing:border-box" data-component="contactCard" data-interactive="button">
  <span style="font-size:24px;flex-shrink:0">${flag}</span>
  <div style="flex:1;min-width:0">
    <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${name}</div>
    <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-xs-size);line-height:var(--rebtel-paragraph-xs-lh);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls);margin-top:var(--rebtel-spacing-xxxs)" data-text-editable>${callTime}</div>
  </div>
  <span style="display:flex;align-items:center;flex-shrink:0">${ICON_CHEVRON_RIGHT}</span>
</div>`;
  }

  // detailed (default)
  return `
<div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-md);background:var(--rebtel-surface-primary);border-bottom:1px solid var(--rebtel-border-secondary);box-sizing:border-box" data-component="contactCard" data-interactive="button">
  <span style="font-size:24px;flex-shrink:0">${flag}</span>
  <div style="flex:1;min-width:0">
    <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${name}</div>
    <div style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls);margin-top:var(--rebtel-spacing-xxxs)" data-text-editable>${phone}</div>
  </div>
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls);white-space:nowrap">${contactCount} contacts here</span>
  <span style="display:flex;align-items:center;flex-shrink:0">${ICON_CHEVRON_RIGHT}</span>
</div>`;
}
