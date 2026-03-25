// SegmentedNav — In-page segment picker
// Variants: "underline" | "pill"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface SegmentedNavProps extends UIComponentPropsBase {
  variant?: "underline" | "pill";
  activeIndex?: number;
}

const DEFAULT_LABELS = ["Credits", "Bundles", "Plans"];

export function renderSegmentedNav(props: Partial<SegmentedNavProps> = {}): string {
  const variant = (props.variant as SegmentedNavProps["variant"]) ?? "underline";
  const labels = props.itemLabels ?? parseLabels(props.label) ?? DEFAULT_LABELS;
  const activeIndex = 0;

  if (variant === "pill") {
    const tabs = labels.map((label, i) => {
      const isActive = i === activeIndex;
      return `<button style="flex:1;padding:var(--rebtel-spacing-sm, var(--spacing-sm)) var(--rebtel-spacing-md, var(--spacing-md));border:none;border-radius:var(--rebtel-radius-full, var(--radius-full));font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:${isActive ? "600" : "400"};cursor:pointer;transition:all 0.2s ease;${isActive ? "background:var(--rebtel-red, #E63946);color:var(--rebtel-on-red, #FFFFFF);box-shadow:0 2px 8px rgba(230,57,70,0.25)" : "background:transparent;color:var(--rebtel-muted, var(--color-muted-foreground))"}" data-text-editable data-interactive="tab">${label}</button>`;
    }).join("");

    return `
<div data-component="segmentedNav" style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs, 4px);padding:var(--rebtel-spacing-xs, 4px);background:var(--rebtel-input-bg, var(--color-secondary));border-radius:var(--rebtel-radius-full, var(--radius-full));margin:0 var(--rebtel-spacing-md, var(--spacing-md))">
  ${tabs}
</div>`;
  }

  // underline variant (default)
  const tabs = labels.map((label, i) => {
    const isActive = i === activeIndex;
    return `<button style="flex:1;padding:var(--rebtel-spacing-sm, var(--spacing-sm)) 0;border:none;background:transparent;font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:${isActive ? "600" : "400"};color:${isActive ? "var(--rebtel-red, #E63946)" : "var(--rebtel-muted, var(--color-muted-foreground))"};cursor:pointer;position:relative;padding-bottom:var(--rebtel-spacing-sm, var(--spacing-sm));border-bottom:2px solid ${isActive ? "var(--rebtel-red, #E63946)" : "transparent"};transition:all 0.2s ease" data-text-editable data-interactive="tab">${label}</button>`;
  }).join("");

  return `
<div data-component="segmentedNav" style="display:flex;align-items:stretch;border-bottom:1px solid var(--rebtel-border, var(--color-border));margin:0 var(--rebtel-spacing-md, var(--spacing-md))">
  ${tabs}
</div>`;
}

/** Parse pipe-separated labels from a label string, e.g. "Credits | Bundles | Plans" */
function parseLabels(label?: string): string[] | null {
  if (!label) return null;
  const parts = label.split("|").map(s => s.trim()).filter(Boolean);
  return parts.length >= 2 ? parts : null;
}
