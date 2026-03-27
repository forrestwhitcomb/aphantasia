// RebtelTabBar — Bottom tab bar matching Figma exactly
// Figma: 3 tabs — globe "Home", contacts "Services", person "Account"
// Active state = black icon + bold label (NOT red). Home indicator bar at bottom.

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface RebtelTabBarProps extends UIComponentPropsBase {
  variant?: "icon-label" | "icon-only";
  activeIndex?: number;
}

const TAB_ICONS = [
  // Home (globe) — matching Figma exactly
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  // Services (contact card) — matching Figma
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M14 9h4M14 12h3M5 17.5c0-1.5 1.8-2.7 4-2.7s4 1.2 4 2.7"/></svg>`,
  // Account (person) — matching Figma
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
];

const DEFAULT_LABELS = ["Home", "Services", "Account"];

export function renderRebtelTabBar(props: Partial<RebtelTabBarProps> = {}): string {
  const variant = (props.variant as RebtelTabBarProps["variant"]) ?? "icon-label";
  const activeIndex = props.activeIndex ?? 0;
  const labels = props.itemLabels ?? DEFAULT_LABELS;
  const count = props.itemCount ?? labels.length;

  const tabs = Array.from({ length: Math.min(count, 5) }, (_, i) => {
    const isActive = i === activeIndex;
    const icon = TAB_ICONS[i % TAB_ICONS.length];
    const label = labels[i % labels.length];
    // Figma: active = black, inactive = grey (NOT red)
    const color = isActive ? "var(--rebtel-grey-900)" : "var(--rebtel-grey-400)";

    const labelHtml = variant === "icon-label"
      ? `<span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-xs-size);line-height:var(--rebtel-label-xs-lh);font-weight:${isActive ? "600" : "400"};color:${color};letter-spacing:var(--rebtel-ls)">${label}</span>`
      : "";

    return `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--rebtel-spacing-xxxs);cursor:pointer;color:${color};position:relative;padding:var(--rebtel-spacing-xs) 0" data-interactive="tab">
      <div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center">${icon}</div>
      ${labelHtml}
    </div>`;
  }).join("");

  // iOS home indicator bar — 134px wide, 5px tall, black, centered at bottom
  const homeIndicator = `<div style="width:134px;height:5px;background:var(--rebtel-grey-900);border-radius:var(--rebtel-radius-full);margin:var(--rebtel-spacing-xs) auto var(--rebtel-spacing-xxs)"></div>`;

  return `
<nav data-component="rebtelTabBar" style="display:flex;flex-direction:column;width:100%;background:var(--rebtel-surface-primary);border-top:1px solid var(--rebtel-border-secondary);box-sizing:border-box">
  <div style="display:flex;align-items:center;height:var(--rebtel-height-xl)">
    ${tabs}
  </div>
  ${homeIndicator}
</nav>`;
}
