// RebtelProfileHeader — Rebtel user profile display
// Variants: "minimal" | "with-balance" | "with-stats"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderRebtelProfileHeader(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "minimal" | "with-balance" | "with-stats") ?? "minimal";
  const label = props.label ?? "John Smith";

  const containerStyles = `display:flex;flex-direction:column;align-items:center;gap:var(--rebtel-spacing-md, var(--spacing-md));padding:var(--rebtel-spacing-lg, var(--spacing-lg)) var(--rebtel-spacing-md, var(--spacing-md));width:100%;box-sizing:border-box`;
  const avatarStyles = `width:72px;height:72px;border-radius:50%;background:var(--rebtel-red, #E63946);display:flex;align-items:center;justify-content:center;font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:28px;font-weight:700;color:#fff`;
  const nameStyles = `font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:var(--rebtel-font-size-xl, var(--font-size-xl));font-weight:700;color:var(--rebtel-foreground, var(--color-foreground))`;
  const phoneStyles = `font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-muted, var(--color-muted-foreground))`;

  const initials = label.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  switch (variant) {
    case "minimal":
      return `
<div data-component="rebtelProfileHeader" style="${containerStyles}">
  <div style="${avatarStyles}">${initials}</div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
    <span style="${nameStyles}" data-text-editable>${label}</span>
    <span style="${phoneStyles}" data-text-editable>+1 (555) 234-5678</span>
  </div>
</div>`;

    case "with-balance":
      return `
<div data-component="rebtelProfileHeader" style="${containerStyles}">
  <div style="${avatarStyles}">${initials}</div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
    <span style="${nameStyles}" data-text-editable>${label}</span>
    <span style="${phoneStyles}" data-text-editable>+1 (555) 234-5678</span>
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:var(--rebtel-spacing-md, var(--spacing-md));background:var(--rebtel-input-bg, var(--color-secondary));border-radius:var(--rebtel-radius-lg, var(--radius-lg));width:100%;max-width:280px">
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-xs, var(--font-size-xs));font-weight:500;text-transform:uppercase;letter-spacing:0.06em;color:var(--rebtel-muted, var(--color-muted-foreground))">Credit Balance</span>
    <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:28px;font-weight:700;color:var(--rebtel-green, #2ECC71)">$12.50</span>
  </div>
</div>`;

    case "with-stats":
      return `
<div data-component="rebtelProfileHeader" style="${containerStyles}">
  <div style="${avatarStyles}">${initials}</div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
    <span style="${nameStyles}" data-text-editable>${label}</span>
    <span style="${phoneStyles}" data-text-editable>+1 (555) 234-5678</span>
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:var(--rebtel-spacing-md, var(--spacing-md));background:var(--rebtel-input-bg, var(--color-secondary));border-radius:var(--rebtel-radius-lg, var(--radius-lg));width:100%;max-width:280px">
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-xs, var(--font-size-xs));font-weight:500;text-transform:uppercase;letter-spacing:0.06em;color:var(--rebtel-muted, var(--color-muted-foreground))">Credit Balance</span>
    <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:28px;font-weight:700;color:var(--rebtel-green, #2ECC71)">$12.50</span>
  </div>
  <div style="display:flex;gap:var(--rebtel-spacing-md, var(--spacing-md));width:100%;max-width:320px">
    ${[
      { value: "47", unit: "Calls made" },
      { value: "12", unit: "Top-ups sent" },
      { value: "5", unit: "Countries" },
    ].map(s => `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:var(--rebtel-spacing-sm, var(--spacing-sm));background:var(--rebtel-surface, var(--color-background));border:1px solid var(--rebtel-border, var(--color-border));border-radius:var(--rebtel-radius-md, var(--radius-md))">
      <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:var(--rebtel-font-size-lg, var(--font-size-lg));font-weight:700;color:var(--rebtel-foreground, var(--color-foreground))">${s.value}</span>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:10px;color:var(--rebtel-muted, var(--color-muted-foreground));text-align:center">${s.unit}</span>
    </div>`).join("")}
  </div>
</div>`;

    default:
      return renderRebtelProfileHeader({ ...props, variant: "minimal" });
  }
}
