// SettingsGroup — Rebtel grouped settings rows
// Variants: "account" | "preferences" | "support"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderSettingsGroup(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "account" | "preferences" | "support") ?? "account";
  const label = props.label ?? "";

  const ICON_CHEVRON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

  const containerStyles = `display:flex;flex-direction:column;width:100%;box-sizing:border-box`;
  const headerStyles = `font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-xs, var(--font-size-xs));font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--rebtel-muted, var(--color-muted-foreground));padding:var(--rebtel-spacing-md, var(--spacing-md)) var(--rebtel-spacing-md, var(--spacing-md)) var(--rebtel-spacing-xs, var(--spacing-xs))`;
  const rowStyles = `display:flex;align-items:center;gap:var(--rebtel-spacing-md, var(--spacing-md));padding:var(--rebtel-spacing-md, var(--spacing-md));border-bottom:1px solid var(--rebtel-border, var(--color-border));cursor:pointer;background:var(--rebtel-surface, var(--color-background))`;
  const iconCircle = `width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px`;
  const rowLabel = `font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:500;color:var(--rebtel-foreground, var(--color-foreground));flex:1`;
  const rowValue = `font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-muted, var(--color-muted-foreground))`;

  const toggleOn = `<div style="width:44px;height:24px;border-radius:12px;background:var(--rebtel-green, #2ECC71);position:relative;flex-shrink:0" data-interactive="toggle"><div style="width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:2px;right:2px;box-shadow:0 1px 3px rgba(0,0,0,0.15)"></div></div>`;
  const toggleOff = `<div style="width:44px;height:24px;border-radius:12px;background:var(--rebtel-border, var(--color-border));position:relative;flex-shrink:0" data-interactive="toggle"><div style="width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;box-shadow:0 1px 3px rgba(0,0,0,0.15)"></div></div>`;

  interface SettingsRow {
    icon: string;
    bg: string;
    label: string;
    value?: string;
    toggle?: "on" | "off";
  }

  const renderRow = (r: SettingsRow) => `
    <div style="${rowStyles}" data-interactive="button">
      <div style="${iconCircle};background:${r.bg}">${r.icon}</div>
      <span style="${rowLabel}">${r.label}</span>
      ${r.toggle ? (r.toggle === "on" ? toggleOn : toggleOff) : `<span style="${rowValue}">${r.value || ""}</span><span style="color:var(--rebtel-muted, var(--color-muted-foreground));display:flex;align-items:center">${ICON_CHEVRON}</span>`}
    </div>`;

  const sections: Record<string, { title: string; rows: SettingsRow[] }> = {
    account: {
      title: label || "Account",
      rows: [
        { icon: "\u{1F464}", bg: "var(--rebtel-red-light, #FCEAEC)", label: "Profile", value: "John Smith" },
        { icon: "\u{1F4B3}", bg: "#EEF2FF", label: "Payment Methods", value: "2 cards" },
        { icon: "\u{1F310}", bg: "#ECFDF5", label: "Language", value: "English" },
        { icon: "\u{1F512}", bg: "#FFF7ED", label: "Security", value: "" },
      ],
    },
    preferences: {
      title: label || "Preferences",
      rows: [
        { icon: "\u{1F514}", bg: "var(--rebtel-red-light, #FCEAEC)", label: "Notifications", toggle: "on" },
        { icon: "\u{1F3A7}", bg: "#EEF2FF", label: "Calling Quality", value: "HD Voice" },
        { icon: "\u{1F504}", bg: "#ECFDF5", label: "Auto-Recharge", toggle: "off" },
        { icon: "\u{1F319}", bg: "#F5F3FF", label: "Dark Mode", toggle: "off" },
      ],
    },
    support: {
      title: label || "Help & Support",
      rows: [
        { icon: "\u{2753}", bg: "#EEF2FF", label: "FAQ", value: "" },
        { icon: "\u{1F4AC}", bg: "var(--rebtel-red-light, #FCEAEC)", label: "Contact Us", value: "" },
        { icon: "\u{2B50}", bg: "#FFF7ED", label: "Rate App", value: "" },
        { icon: "\u{1F4C4}", bg: "#ECFDF5", label: "Terms & Privacy", value: "" },
      ],
    },
  };

  const section = sections[variant] || sections.account;

  return `
<div data-component="settingsGroup" style="${containerStyles}">
  <span style="${headerStyles}" data-text-editable>${section.title}</span>
  ${section.rows.map(renderRow).join("")}
</div>`;
}
