// Breadcrumb — Simple breadcrumb navigation
// Variants: "simple" | "with-back"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface BreadcrumbProps extends UIComponentPropsBase {
  variant?: "simple" | "with-back";
}

const ICON_BACK = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const ICON_CHEVRON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;

export function renderBreadcrumb(props: Partial<BreadcrumbProps> = {}): string {
  const variant = (props.variant as BreadcrumbProps["variant"]) ?? "simple";
  const currentPage = props.label ?? "Account";
  const crumbs = props.itemLabels ?? ["Home", "Settings"];

  const separator = `<span style="color:var(--rebtel-muted, var(--color-muted-foreground));display:flex;align-items:center;margin:0 var(--rebtel-spacing-xs, 2px)">${ICON_CHEVRON}</span>`;

  const crumbItems = crumbs.map(crumb =>
    `<a style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-muted, var(--color-muted-foreground));text-decoration:none;cursor:pointer;transition:color 0.15s ease" data-interactive="button">${crumb}</a>`
  );

  const activeCrumb = `<span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-foreground, var(--color-foreground));font-weight:600" data-text-editable>${currentPage}</span>`;

  const allCrumbs = [...crumbItems, activeCrumb].join(separator);

  if (variant === "with-back") {
    return `
<nav data-component="breadcrumb" style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm, var(--spacing-sm));padding:var(--rebtel-spacing-sm, var(--spacing-sm)) var(--rebtel-spacing-md, var(--spacing-md))">
  <div style="width:28px;height:28px;border-radius:var(--rebtel-radius-md, var(--radius-md));background:var(--rebtel-input-bg, var(--color-secondary));display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--rebtel-foreground, var(--color-foreground))" data-interactive="button">${ICON_BACK}</div>
  <div style="display:flex;align-items:center;flex-wrap:wrap">
    ${allCrumbs}
  </div>
</nav>`;
  }

  // simple variant (default)
  return `
<nav data-component="breadcrumb" style="display:flex;align-items:center;padding:var(--rebtel-spacing-sm, var(--spacing-sm)) var(--rebtel-spacing-md, var(--spacing-md))">
  <div style="display:flex;align-items:center;flex-wrap:wrap">
    ${allCrumbs}
  </div>
</nav>`;
}
