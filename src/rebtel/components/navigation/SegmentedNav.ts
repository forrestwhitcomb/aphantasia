// SegmentedNav — Button tabs matching Figma exactly
// Figma: Pill-shaped toggle tabs, active=black fill/white text, inactive=light grey/grey text
// Two sizes: large (52px) and small (40px)
// Variants: "large" | "small" | "underline"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface SegmentedNavProps extends UIComponentPropsBase {
  variant?: "large" | "small" | "underline";
  activeIndex?: number;
}

const DEFAULT_LABELS = ["Credits", "Bundles"];

export function renderSegmentedNav(props: Partial<SegmentedNavProps> = {}): string {
  const variant = (props.variant as SegmentedNavProps["variant"]) ?? "large";
  const labels = props.itemLabels ?? parseLabels(props.label) ?? DEFAULT_LABELS;
  const activeIndex = 0;

  if (variant === "underline") {
    const tabs = labels.map((label, i) => {
      const isActive = i === activeIndex;
      return `<button style="flex:1;padding:var(--rebtel-spacing-sm) 0;border:none;background:transparent;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);font-weight:${isActive ? "600" : "400"};color:${isActive ? "var(--rebtel-text-primary)" : "var(--rebtel-text-tertiary)"};cursor:pointer;position:relative;padding-bottom:var(--rebtel-spacing-sm);border-bottom:2px solid ${isActive ? "var(--rebtel-grey-900)" : "transparent"};transition:all 0.15s ease;letter-spacing:var(--rebtel-ls)" data-text-editable data-interactive="tab">${label}</button>`;
    }).join("");

    return `
<div data-component="segmentedNav" style="display:flex;align-items:stretch;border-bottom:1px solid var(--rebtel-border-secondary);margin:0 var(--rebtel-spacing-md)">
  ${tabs}
</div>`;
  }

  // Pill button tabs (large or small)
  const height = variant === "small" ? "40px" : "52px";
  const fontSize = variant === "small" ? "var(--rebtel-paragraph-sm-size)" : "var(--rebtel-paragraph-md-size)";

  const tabs = labels.map((label, i) => {
    const isActive = i === activeIndex;
    const bg = isActive ? "var(--rebtel-grey-900)" : "var(--rebtel-grey-50)";
    const color = isActive ? "var(--rebtel-brand-white)" : "var(--rebtel-text-tertiary)";
    const weight = isActive ? "600" : "400";

    return `<button style="flex:1;height:${height};border:none;border-radius:var(--rebtel-radius-full);font-family:var(--rebtel-font-body);font-size:${fontSize};font-weight:${weight};cursor:pointer;transition:all 0.15s ease;background:${bg};color:${color};letter-spacing:var(--rebtel-ls);display:flex;align-items:center;justify-content:center;gap:var(--rebtel-spacing-xs);padding:0 var(--rebtel-spacing-md)" data-text-editable data-interactive="tab">${label}</button>`;
  }).join("");

  return `
<div data-component="segmentedNav" style="display:inline-flex;align-items:center;gap:var(--rebtel-spacing-xs)">
  ${tabs}
</div>`;
}

function parseLabels(label?: string): string[] | null {
  if (!label) return null;
  const parts = label.split("|").map(s => s.trim()).filter(Boolean);
  return parts.length >= 2 ? parts : null;
}
