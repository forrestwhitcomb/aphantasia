// ============================================================
// Tab Bar — Bottom navigation (Figma 3.0 audited: 5405:106124)
// ============================================================
// 390×90, 3 items: Home/Services/Account
// Active: filled icon #111111 + label #111111
// Inactive: outlined icon + label #B9B9BE (grey-400)
// Icon containers: 40×40, label: 11px KH Teka Regular
// Home indicator: 134×5 bar, #111111, radius full
// ============================================================

import type { ComponentSpec } from "../../spec/types";

// Figma-audited icons (40×40 viewbox to match icon containers, strokes match Figma)
const ICON_HOME_ACTIVE = `<svg width="32" height="24" viewBox="0 0 32 24" fill="#111111" stroke="none"><path d="M16 0L0 11.5V22a2 2 0 0 0 2 2h9V14h10v10h9a2 2 0 0 0 2-2V11.5L16 0z"/></svg>`;
const ICON_HOME_INACTIVE = `<svg width="32" height="24" viewBox="0 0 32 24" fill="none" stroke="#B9B9BE" stroke-width="1.8"><path d="M2 11.5L16 2l14 9.5V22a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V11.5z"/><path d="M11 24V14h10v10"/></svg>`;
const ICON_SERVICES_INACTIVE = `<svg width="32" height="24" viewBox="0 0 32 24" fill="none" stroke="#B9B9BE" stroke-width="2"><rect x="4" y="0" width="24" height="24" rx="4" stroke-opacity="1"/><path d="M12 12h8M12 8h8M12 16h5" stroke-linecap="round"/></svg>`;
const ICON_ACCOUNT_INACTIVE = `<svg width="32" height="24" viewBox="0 0 32 24" fill="none" stroke="#B9B9BE" stroke-width="1.8" stroke-linecap="round"><path d="M24 21v-2a4 4 0 0 0-4-4h-8a4 4 0 0 0-4 4v2"/><circle cx="16" cy="7" r="4"/></svg>`;

function tabItem(key: string, label: string, iconSvg: string, active: boolean): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      align: "center",
      gap: "0px",
      flex: "1",
    },
    style: { cursor: "pointer" },
    interactive: { type: "tab" },
    children: [
      // Icon container: 40×40
      {
        key: `${key}-icon`,
        tag: "div",
        layout: { display: "flex", align: "center", justify: "center", width: 40, height: 40 },
        style: {},
        data: { innerHTML: iconSvg },
      },
      // Label: 11px KH Teka Regular
      {
        key: `${key}-label`,
        tag: "span",
        layout: { display: "block" },
        style: {},
        text: {
          content: label,
          style: "label-xs", // 11px
          weight: 400,
          color: active ? { token: "color.content-primary" } : { token: "color.grey-400" },
          editable: true,
        },
      },
    ],
  };
}

export function tabBarTemplate(props?: Record<string, unknown>): ComponentSpec {
  const activeTab = (props?.activeTab as string) ?? "home";

  return {
    key: "tab-bar",
    tag: "div",
    layout: { display: "flex", direction: "column", width: "100%", boxSizing: "border-box" },
    style: { background: { token: "color.surface-canvas" } }, // #FAFAFC
    data: { component: "tabBar" },
    children: [
      // Tab items row: height 56px
      {
        key: "tabs-row",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "space-around",
          height: 56,
          padding: { x: { token: "spacing.lg" } },
        },
        style: {},
        children: [
          tabItem("tab-home", "Home", activeTab === "home" ? ICON_HOME_ACTIVE : ICON_HOME_INACTIVE, activeTab === "home"),
          tabItem("tab-services", "Services", ICON_SERVICES_INACTIVE, activeTab === "services"),
          tabItem("tab-account", "Account", ICON_ACCOUNT_INACTIVE, activeTab === "account"),
        ],
      },
      // Home indicator: 134×5, radius full, bg #111111
      {
        key: "home-indicator",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "center", height: 34, padding: { bottom: "8px" } },
        style: {},
        children: [{
          key: "indicator-bar",
          tag: "div",
          layout: { display: "block", width: 134, height: 5, borderRadius: { token: "radius.full" } },
          style: { background: { token: "color.content-primary" } }, // #111111
        }],
      },
    ],
  };
}
