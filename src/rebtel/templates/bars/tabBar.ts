// Tab Bar — Bottom navigation (Home, Services, Account) + home indicator
// Figma: 5405:106124 — 390×90, 3 items with icons + labels

import type { ComponentSpec } from "../../spec/types";

const ICON_HOME = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 22V12h6v10"/></svg>`;
const ICON_HOME_FILLED = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1V9.5z"/></svg>`;
const ICON_SERVICES = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.97.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.84.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const ICON_ACCOUNT = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

function tabItem(key: string, label: string, iconSvg: string, active: boolean): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: { display: "flex", direction: "column", align: "center", gap: "2px", flex: "1" },
    style: { cursor: "pointer", color: active ? "var(--rebtel-grey-900)" : "var(--rebtel-grey-400)" },
    interactive: { type: "tab" },
    children: [
      { key: `${key}-icon`, tag: "div", layout: { display: "flex", align: "center", justify: "center", width: 24, height: 24 }, style: {}, data: { innerHTML: iconSvg } },
      { key: `${key}-label`, tag: "span", layout: { display: "block" }, style: {}, text: { content: label, style: "label-xs", color: active ? { token: "color.grey-900" } : { token: "color.grey-400" }, editable: true } },
    ],
  };
}

export function tabBarTemplate(props?: Record<string, unknown>): ComponentSpec {
  const activeTab = (props?.activeTab as string) ?? "home";
  return {
    key: "tab-bar",
    tag: "div",
    layout: { display: "flex", direction: "column", width: "100%", boxSizing: "border-box" },
    style: { background: { token: "color.surface-primary" } },
    data: { component: "tabBar" },
    children: [
      {
        key: "tabs-row",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "space-around", height: { token: "height.xl" }, padding: { x: { token: "spacing.lg" } } },
        style: {},
        children: [
          tabItem("tab-home", "Home", activeTab === "home" ? ICON_HOME_FILLED : ICON_HOME, activeTab === "home"),
          tabItem("tab-services", "Services", ICON_SERVICES, activeTab === "services"),
          tabItem("tab-account", "Account", ICON_ACCOUNT, activeTab === "account"),
        ],
      },
      {
        key: "home-indicator",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "center", height: 34, padding: { bottom: "8px" } },
        style: {},
        children: [{
          key: "indicator-bar",
          tag: "div",
          layout: { display: "block", width: 134, height: 5, borderRadius: { token: "radius.full" } },
          style: { background: { token: "color.grey-900" } },
        }],
      },
    ],
  };
}
