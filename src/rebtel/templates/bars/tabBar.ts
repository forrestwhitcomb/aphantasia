// ============================================================
// Tab Bar — Bottom navigation, pixel-perfect from Figma 3.0
// ============================================================
// Figma: 4915:89899 (Version=Home)
// Container: width 100%, #FAFAFC bg (surface-canvas),
//   border-top 1px solid border-default
// Each tab: flex column, align center, gap 4px
//   Icon: 24x24
//   Label: KH Teka 11px, #737378 (inactive) or #E31B3B (active)
// Home active label uses text-primary (#111111) per Figma
// ============================================================

import type { ComponentSpec } from "../../spec/types";

// ── SVG Icons (24x24) — Figma-accurate ─────────────────────
// Home: Heart icon — filled circle w/ heart for active, outline for inactive
const ICON_HOME_ACTIVE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#111111"/><path d="M12 17.5C12 17.5 6.5 14.5 6.5 10.5C6.5 9.17 7.57 8 9 8C9.97 8 10.84 8.56 11.32 9.36L12 10.5L12.68 9.36C13.16 8.56 14.03 8 15 8C16.43 8 17.5 9.17 17.5 10.5C17.5 14.5 12 17.5 12 17.5Z" fill="white"/></svg>`;
const ICON_HOME_INACTIVE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11.25" stroke="#737378" stroke-width="1.5"/><path d="M12 17.5C12 17.5 6.5 14.5 6.5 10.5C6.5 9.17 7.57 8 9 8C9.97 8 10.84 8.56 11.32 9.36L12 10.5L12.68 9.36C13.16 8.56 14.03 8 15 8C16.43 8 17.5 9.17 17.5 10.5C17.5 14.5 12 17.5 12 17.5Z" stroke="#737378" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Services: Rebtel "R" emblem in rounded square — stroked for inactive, filled for active
const ICON_SERVICES_ACTIVE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="5" stroke="#E31B3B" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="12" fill="#E31B3B">R</text></svg>`;
const ICON_SERVICES_INACTIVE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="5" stroke="#737378" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="12" fill="#737378">R</text></svg>`;

// Account: Person icon in circle
const ICON_ACCOUNT_ACTIVE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11.25" stroke="#E31B3B" stroke-width="1.5"/><circle cx="12" cy="10" r="3" stroke="#E31B3B" stroke-width="1.2"/><path d="M6.5 19.5C6.5 16.5 8.96 14 12 14C15.04 14 17.5 16.5 17.5 19.5" stroke="#E31B3B" stroke-width="1.2" stroke-linecap="round"/></svg>`;
const ICON_ACCOUNT_INACTIVE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11.25" stroke="#737378" stroke-width="1.5"/><circle cx="12" cy="10" r="3" stroke="#737378" stroke-width="1.2"/><path d="M6.5 19.5C6.5 16.5 8.96 14 12 14C15.04 14 17.5 16.5 17.5 19.5" stroke="#737378" stroke-width="1.2" stroke-linecap="round"/></svg>`;

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  home: { active: ICON_HOME_ACTIVE, inactive: ICON_HOME_INACTIVE },
  services: { active: ICON_SERVICES_ACTIVE, inactive: ICON_SERVICES_INACTIVE },
  account: { active: ICON_ACCOUNT_ACTIVE, inactive: ICON_ACCOUNT_INACTIVE },
};

// ── Tab Item ─────────────────────────────────────────────────

function tabItem(key: string, label: string, tabKey: string, active: boolean): ComponentSpec {
  const icons = TAB_ICONS[tabKey] ?? TAB_ICONS.home;
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      align: "center",
      gap: "4px",
      flex: "1",
    },
    style: { cursor: "pointer" },
    interactive: { type: "tab" },
    children: [
      // Icon: 24x24
      {
        key: `${key}-icon`,
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          width: 24,
          height: 24,
          flexShrink: 0,
        },
        style: {},
        data: { innerHTML: active ? icons.active : icons.inactive },
      },
      // Label: 11px KH Teka, letter-spacing 0.02em
      {
        key: `${key}-label`,
        tag: "span",
        layout: { display: "block" },
        style: {
          fontFamily: "'KH Teka'",
          fontSize: 11,
          letterSpacing: "0.02em",
          lineHeight: "14px",
        },
        text: {
          content: label,
          style: "label-xs",
          weight: 400,
          color: active
            ? tabKey === "home"
              ? { token: "color.text-primary" }
              : { token: "color.brand-red" }
            : { token: "color.text-secondary" },
          editable: true,
        },
      },
    ],
  };
}

// ── Template Factory ─────────────────────────────────────────

export function tabBarTemplate(props?: Record<string, unknown>): ComponentSpec {
  const activeTab = (props?.activeTab as string) ?? "home";
  const tabs = (props?.tabs as string[]) ?? ["home", "services", "account"];
  const labels = (props?.labels as string[]) ?? ["Home", "Services", "Account"];

  return {
    key: "tab-bar",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      width: "100%",
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-canvas" },
      borderTop: { width: "1px", style: "solid", color: { token: "color.border-default" } },
      fontFamily: "'KH Teka'",
    },
    data: { component: "tabBar" },
    children: [
      // Tab items row
      {
        key: "tabs-row",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "space-around",
          height: 52,
          width: "100%",
          padding: { top: { token: "spacing.xs" } },
          boxSizing: "border-box",
        },
        style: {},
        children: tabs.map((tabKey, i) =>
          tabItem(`tab-${tabKey}`, labels[i] ?? tabKey, tabKey, tabKey === activeTab),
        ),
      },
      // Safe area spacer (home indicator area)
      {
        key: "safe-area",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          height: 34,
          padding: { bottom: { token: "spacing.xs" } },
        },
        style: {},
        children: [
          {
            key: "indicator-bar",
            tag: "div",
            layout: {
              display: "block",
              width: 134,
              height: 5,
              borderRadius: "100px",
            },
            style: { background: { token: "color.text-primary" } },
          },
        ],
      },
    ],
  };
}
