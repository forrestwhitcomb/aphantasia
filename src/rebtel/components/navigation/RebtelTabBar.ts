// RebtelTabBar — Bottom tab bar matching Figma
// Figma: 3 tabs — globe "Home", refresh "Recharges", person "Account"
// Active state has underline indicator. Clean, minimal.
// Variants: "icon-label" | "icon-only"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface RebtelTabBarProps extends UIComponentPropsBase {
  variant?: "icon-label" | "icon-only";
  activeIndex?: number;
}

const TAB_ICONS = [
  // Home (globe)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  // Recharges (refresh)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  // Account (person)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
];

const DEFAULT_LABELS = ["Home", "Recharges", "Account"];

export function renderRebtelTabBar(props: Partial<RebtelTabBarProps> = {}): string {
  const variant = (props.variant as RebtelTabBarProps["variant"]) ?? "icon-label";
  const activeIndex = 0;
  const labels = props.itemLabels ?? DEFAULT_LABELS;
  const count = props.itemCount ?? labels.length;

  const tabs = Array.from({ length: Math.min(count, 5) }, (_, i) => {
    const isActive = i === activeIndex;
    const icon = TAB_ICONS[i % TAB_ICONS.length];
    const label = labels[i % labels.length];
    const color = isActive
      ? "var(--rebtel-brand-red)"
      : "var(--rebtel-icon-secondary)";
    const textColor = isActive
      ? "var(--rebtel-brand-red)"
      : "var(--rebtel-text-tertiary)";
    const indicator = isActive
      ? `<div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:24px;height:2px;background:var(--rebtel-brand-red);border-radius:1px"></div>`
      : "";

    const labelHtml = variant === "icon-label"
      ? `<span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-xs-size);line-height:var(--rebtel-label-xs-lh);font-weight:${isActive ? "600" : "400"};color:${textColor};letter-spacing:var(--rebtel-ls)">${label}</span>`
      : "";

    return `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--rebtel-spacing-xxxs);cursor:pointer;color:${color};position:relative;padding:var(--rebtel-spacing-xs) 0" data-interactive="tab">
      <div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center">${icon}</div>
      ${labelHtml}
      ${indicator}
    </div>`;
  }).join("");

  return `
<nav data-component="rebtelTabBar" style="display:flex;align-items:center;height:var(--rebtel-height-xl);width:100%;background:var(--rebtel-surface-primary);border-top:1px solid var(--rebtel-border-secondary);box-sizing:border-box;position:relative">
  ${tabs}
</nav>`;
}
