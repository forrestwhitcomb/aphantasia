// ============================================================
// Tab Bar — Bottom navigation, pixel-perfect from Figma 3.0
// ============================================================
// Container: width 100%, white bg, border-top 1px solid #F3F3F3,
// flex row, justify space-around, padding 8px 0 + safe area
// Each tab: flex column, align center, gap 4px
//   Icon: 24x24
//   Label: KH Teka 11px, #737378 (inactive) or #E31B3B (active)
// ============================================================

import type { ComponentSpec } from "../../spec/types";

// ── SVG Icons (24x24) ───────────────────────────────────────

const ICON_HOME_ACTIVE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#E31B3B" stroke="none"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z"/></svg>`;
const ICON_HOME_INACTIVE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#737378" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z"/></svg>`;
const ICON_SERVICES_ACTIVE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E31B3B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>`;
const ICON_SERVICES_INACTIVE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#737378" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>`;
const ICON_ACCOUNT_ACTIVE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E31B3B" stroke-width="1.5" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const ICON_ACCOUNT_INACTIVE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#737378" stroke-width="1.5" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

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
          color: active ? "#E31B3B" : "#737378",
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
      background: "#FFFFFF",
      borderTop: { width: "1px", style: "solid", color: "#F3F3F3" },
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
          padding: { top: "8px" },
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
          padding: { bottom: "8px" },
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
            style: { background: "#111111" },
          },
        ],
      },
    ],
  };
}
