// HomeScreen — Rebtel home screen template
// Variants: "new-user" | "active-user" | "power-user"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderHomeScreen(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "new-user" | "active-user" | "power-user") ?? "active-user";
  const label = props.label ?? "Home";

  const containerStyles = `display:flex;flex-direction:column;gap:var(--rebtel-spacing-md, var(--spacing-md));width:100%;box-sizing:border-box;padding-bottom:var(--rebtel-spacing-lg, var(--spacing-lg))`;
  const sectionLabel = `font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:600;color:var(--rebtel-foreground, var(--color-foreground));padding:0 var(--rebtel-spacing-md, var(--spacing-md))`;
  const quickActionBtn = `display:flex;flex-direction:column;align-items:center;gap:var(--rebtel-spacing-xs, var(--spacing-xs));flex:1;padding:var(--rebtel-spacing-md, var(--spacing-md));background:var(--rebtel-surface, var(--color-background));border:1px solid var(--rebtel-border, var(--color-border));border-radius:var(--rebtel-radius-lg, var(--radius-lg));cursor:pointer" data-interactive="button`;
  const quickActionIcon = `width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px`;
  const quickActionLabel = `font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:500;color:var(--rebtel-foreground, var(--color-foreground))`;

  const balanceWidget = `
  <div style="margin:0 var(--rebtel-spacing-md, var(--spacing-md));padding:var(--rebtel-spacing-lg, var(--spacing-lg));background:linear-gradient(135deg, var(--rebtel-red, #E63946), #FF6B6B);border-radius:var(--rebtel-radius-lg, var(--radius-lg));color:#fff;display:flex;flex-direction:column;gap:var(--rebtel-spacing-xs, var(--spacing-xs));box-shadow:0 4px 16px rgba(230,57,70,0.25)">
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));opacity:0.85">Your balance</span>
    <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:32px;font-weight:700">$12.50</span>
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-xs, var(--font-size-xs));opacity:0.7">~624 min to Cuba</span>
  </div>`;

  const quickActions = `
  <div style="display:flex;gap:var(--rebtel-spacing-sm, var(--spacing-sm));padding:0 var(--rebtel-spacing-md, var(--spacing-md))">
    <div style="${quickActionBtn}">
      <div style="${quickActionIcon};background:var(--rebtel-red-light, #FCEAEC)">\u{1F4B8}</div>
      <span style="${quickActionLabel}">Top Up</span>
    </div>
    <div style="${quickActionBtn}">
      <div style="${quickActionIcon};background:#ECFDF5">\u{1F4DE}</div>
      <span style="${quickActionLabel}">Call</span>
    </div>
    <div style="${quickActionBtn}">
      <div style="${quickActionIcon};background:#EEF2FF">\u{1F4CB}</div>
      <span style="${quickActionLabel}">History</span>
    </div>
  </div>`;

  const activityRow = (icon: string, title: string, subtitle: string, amount: string, color: string) => `
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-md, var(--spacing-md));padding:var(--rebtel-spacing-sm, var(--spacing-sm)) var(--rebtel-spacing-md, var(--spacing-md))">
      <div style="width:40px;height:40px;border-radius:50%;background:var(--rebtel-input-bg, var(--color-secondary));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${icon}</div>
      <div style="flex:1;display:flex;flex-direction:column;gap:2px">
        <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:500;color:var(--rebtel-foreground, var(--color-foreground))">${title}</span>
        <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-xs, var(--font-size-xs));color:var(--rebtel-muted, var(--color-muted-foreground))">${subtitle}</span>
      </div>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:600;color:${color};flex-shrink:0">${amount}</span>
    </div>`;

  switch (variant) {
    case "new-user":
      return `
<div data-component="homeScreen" style="${containerStyles}">
  ${balanceWidget}
  ${quickActions}
  <div style="margin:0 var(--rebtel-spacing-md, var(--spacing-md));padding:var(--rebtel-spacing-lg, var(--spacing-lg));background:var(--rebtel-input-bg, var(--color-secondary));border-radius:var(--rebtel-radius-lg, var(--radius-lg));display:flex;flex-direction:column;align-items:center;gap:var(--rebtel-spacing-md, var(--spacing-md));text-align:center">
    <span style="font-size:40px">\u{1F389}</span>
    <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:var(--rebtel-font-size-lg, var(--font-size-lg));font-weight:700;color:var(--rebtel-foreground, var(--color-foreground))" data-text-editable>Send your first top-up!</span>
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-muted, var(--color-muted-foreground));max-width:260px;line-height:1.4" data-text-editable>Help your family and friends stay connected. Send a mobile top-up in seconds.</span>
    <div style="display:flex;align-items:center;justify-content:center;height:44px;padding:0 24px;background:var(--rebtel-red, #E63946);color:#fff;border-radius:var(--rebtel-radius-full, var(--radius-full));font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:600;cursor:pointer" data-text-editable data-interactive="button">Send Top-Up</div>
  </div>
</div>`;

    case "active-user":
      return `
<div data-component="homeScreen" style="${containerStyles}">
  ${balanceWidget}
  ${quickActions}
  <span style="${sectionLabel}" data-text-editable>Recent Activity</span>
  ${activityRow("\u{1F4B8}", "Top-up to Maria", "Mexico \u00b7 Today 2:30 PM", "-$15.00", "var(--rebtel-foreground, var(--color-foreground))")}
  ${activityRow("\u{1F4DE}", "Call to Cuba", "12 min \u00b7 Yesterday", "-$0.24", "var(--rebtel-foreground, var(--color-foreground))")}
  ${activityRow("\u{1F4B3}", "Added credit", "Visa ****4242 \u00b7 Mar 20", "+$20.00", "var(--rebtel-green, #2ECC71)")}
</div>`;

    case "power-user":
      return `
<div data-component="homeScreen" style="${containerStyles}">
  ${balanceWidget}
  ${quickActions}
  <span style="${sectionLabel}" data-text-editable>Quick Send</span>
  <div style="display:flex;gap:var(--rebtel-spacing-md, var(--spacing-md));padding:0 var(--rebtel-spacing-md, var(--spacing-md));overflow-x:auto">
    ${[
      { name: "Maria", flag: "\u{1F1F2}\u{1F1FD}" },
      { name: "Abuelo", flag: "\u{1F1E8}\u{1F1FA}" },
      { name: "Priya", flag: "\u{1F1EE}\u{1F1F3}" },
      { name: "Carlos", flag: "\u{1F1F5}\u{1F1ED}" },
    ].map(c => `
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex-shrink:0;cursor:pointer" data-interactive="button">
      <div style="width:48px;height:48px;border-radius:50%;background:var(--rebtel-input-bg, var(--color-secondary));display:flex;align-items:center;justify-content:center;font-size:22px;border:2px solid var(--rebtel-border, var(--color-border))">${c.flag}</div>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-xs, var(--font-size-xs));color:var(--rebtel-foreground, var(--color-foreground))">${c.name}</span>
    </div>`).join("")}
  </div>
  <span style="${sectionLabel}" data-text-editable>Manage</span>
  <div style="display:flex;flex-direction:column;padding:0 var(--rebtel-spacing-md, var(--spacing-md))">
    ${[
      { icon: "\u{1F504}", label: "Auto-Recharge", value: "Active" },
      { icon: "\u{1F4CA}", label: "Usage Report", value: "This month" },
      { icon: "\u{2B50}", label: "Refer a Friend", value: "Earn $5" },
    ].map(m => `
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-md, var(--spacing-md));padding:var(--rebtel-spacing-sm, var(--spacing-sm)) 0;border-bottom:1px solid var(--rebtel-border, var(--color-border));cursor:pointer" data-interactive="button">
      <span style="font-size:18px">${m.icon}</span>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:500;color:var(--rebtel-foreground, var(--color-foreground));flex:1">${m.label}</span>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-xs, var(--font-size-xs));color:var(--rebtel-muted, var(--color-muted-foreground))">${m.value}</span>
    </div>`).join("")}
  </div>
</div>`;

    default:
      return renderHomeScreen({ ...props, variant: "active-user" });
  }
}
