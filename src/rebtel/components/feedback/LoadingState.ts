// LoadingState — Rebtel loading indicators
// Variants: "spinner" | "skeleton" | "progress"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderLoadingState(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "spinner" | "skeleton" | "progress") ?? "spinner";
  const label = props.label ?? "Loading...";

  const containerStyles = `display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--rebtel-spacing-md, var(--spacing-md));padding:var(--rebtel-spacing-xl, 48px) var(--rebtel-spacing-md, var(--spacing-md));width:100%;box-sizing:border-box`;

  switch (variant) {
    case "spinner":
      return `
<div data-component="loadingState" style="${containerStyles}">
  <div style="width:40px;height:40px;border:3px solid var(--rebtel-border, var(--color-border));border-top-color:var(--rebtel-red, #E63946);border-radius:50%;animation:rebtel-spin 0.8s linear infinite"></div>
  <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-muted, var(--color-muted-foreground))" data-text-editable>${label}</span>
  <style>@keyframes rebtel-spin{to{transform:rotate(360deg)}}</style>
</div>`;

    case "skeleton":
      return `
<div data-component="loadingState" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-md, var(--spacing-md));padding:var(--rebtel-spacing-md, var(--spacing-md));width:100%;box-sizing:border-box">
  ${Array.from({ length: 3 }, () => `
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-md, var(--spacing-md));padding:var(--rebtel-spacing-md, var(--spacing-md));background:var(--rebtel-surface, var(--color-background));border-radius:var(--rebtel-radius-md, var(--radius-md));border:1px solid var(--rebtel-border, var(--color-border))">
    <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(90deg,var(--rebtel-border, #e5e7eb) 25%,var(--rebtel-input-bg, #f3f4f6) 50%,var(--rebtel-border, #e5e7eb) 75%);background-size:200% 100%;animation:rebtel-shimmer 1.5s ease infinite;flex-shrink:0"></div>
    <div style="flex:1;display:flex;flex-direction:column;gap:8px">
      <div style="width:60%;height:14px;border-radius:4px;background:linear-gradient(90deg,var(--rebtel-border, #e5e7eb) 25%,var(--rebtel-input-bg, #f3f4f6) 50%,var(--rebtel-border, #e5e7eb) 75%);background-size:200% 100%;animation:rebtel-shimmer 1.5s ease infinite"></div>
      <div style="width:40%;height:10px;border-radius:4px;background:linear-gradient(90deg,var(--rebtel-border, #e5e7eb) 25%,var(--rebtel-input-bg, #f3f4f6) 50%,var(--rebtel-border, #e5e7eb) 75%);background-size:200% 100%;animation:rebtel-shimmer 1.5s ease infinite;animation-delay:0.15s"></div>
    </div>
    <div style="width:50px;height:14px;border-radius:4px;background:linear-gradient(90deg,var(--rebtel-border, #e5e7eb) 25%,var(--rebtel-input-bg, #f3f4f6) 50%,var(--rebtel-border, #e5e7eb) 75%);background-size:200% 100%;animation:rebtel-shimmer 1.5s ease infinite;animation-delay:0.3s;flex-shrink:0"></div>
  </div>`).join("")}
  <style>@keyframes rebtel-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}</style>
</div>`;

    case "progress":
      return `
<div data-component="loadingState" style="${containerStyles}">
  <div style="width:100%;max-width:280px;display:flex;flex-direction:column;gap:var(--rebtel-spacing-sm, var(--spacing-sm))">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:500;color:var(--rebtel-foreground, var(--color-foreground))" data-text-editable>${label}</span>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:600;color:var(--rebtel-red, #E63946)">68%</span>
    </div>
    <div style="width:100%;height:8px;background:var(--rebtel-border, var(--color-border));border-radius:4px;overflow:hidden">
      <div style="width:68%;height:100%;background:var(--rebtel-red, #E63946);border-radius:4px;transition:width 0.3s ease"></div>
    </div>
  </div>
</div>`;

    default:
      return renderLoadingState({ ...props, variant: "spinner" });
  }
}
