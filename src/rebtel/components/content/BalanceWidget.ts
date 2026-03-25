// BalanceWidget — Credit/plan balance display
// Variants: "credits" (simple balance), "plan-remaining" (with bar indicator), "multi" (credits + plan side by side)

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface BalanceWidgetProps extends UIComponentPropsBase {
  balance?: string;
  currency?: string;
  planName?: string;
  planRemaining?: string;
  planTotal?: string;
  percentUsed?: number;
  credits?: string;
  lowBalance?: boolean;
  variant?: "credits" | "plan-remaining" | "multi";
}

const BALANCE_DEFAULTS = {
  balance: "$12.50",
  currency: "USD",
  planName: "Unlimited Mexico",
  planRemaining: "18 days left",
  planTotal: "30 days",
  percentUsed: 40,
  credits: "$12.50",
  lowBalance: false,
};

export function renderBalanceWidget(props: Partial<BalanceWidgetProps> = {}, _index = 0): string {
  const variant = props.variant ?? "credits";
  const d = BALANCE_DEFAULTS;
  const balance = props.balance ?? props.label ?? d.balance;
  const currency = props.currency ?? d.currency;
  const lowBalance = props.lowBalance ?? d.lowBalance;

  const lowBadge = lowBalance
    ? `<div style="display:inline-flex;align-items:center;gap:4px;margin-top:var(--spacing-xs);padding:2px 8px;background:var(--rebtel-red-light, #FCEAEC);border-radius:var(--radius-sm)">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-red, #E63946)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span style="font-size:11px;font-weight:600;color:var(--rebtel-red, #E63946);font-family:var(--font-body-family)">Low balance</span>
      </div>`
    : "";

  if (variant === "credits") {
    return `
<div style="padding:var(--spacing-lg) var(--spacing-md);background:var(--color-surface);border-radius:var(--radius-lg);box-shadow:0 1px 3px rgba(0,0,0,0.06);text-align:center" data-component="balanceWidget">
  <div style="font-size:var(--font-size-xs);font-weight:600;color:var(--color-muted);font-family:var(--font-body-family);text-transform:uppercase;letter-spacing:0.05em">Your Balance</div>
  <div style="font-size:32px;font-weight:800;color:var(--color-foreground);font-family:var(--font-body-family);margin-top:var(--spacing-xs)" data-text-editable>${balance}</div>
  <div style="font-size:var(--font-size-xs);color:var(--color-muted);font-family:var(--font-body-family);margin-top:2px">${currency}</div>
  ${lowBadge}
  <div style="margin-top:var(--spacing-md)">
    <div style="display:inline-block;padding:var(--spacing-xs) var(--spacing-lg);background:var(--rebtel-gradient-primary, #E63946);color:#fff;border-radius:var(--radius-full, 999px);font-size:var(--font-size-sm);font-weight:600;font-family:var(--font-body-family);cursor:pointer" data-interactive="button">Add Credit</div>
  </div>
</div>`;
  }

  if (variant === "plan-remaining") {
    const planName = props.planName ?? d.planName;
    const planRemaining = props.planRemaining ?? d.planRemaining;
    const pct = props.percentUsed ?? d.percentUsed;
    const barColor = pct > 80 ? "var(--rebtel-red, #E63946)" : "var(--rebtel-green, #2ECC71)";

    return `
<div style="padding:var(--spacing-md);background:var(--color-surface);border-radius:var(--radius-lg);box-shadow:0 1px 3px rgba(0,0,0,0.06)" data-component="balanceWidget">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--spacing-sm)">
    <div style="font-size:var(--font-size-md);font-weight:700;color:var(--color-foreground);font-family:var(--font-body-family)" data-text-editable>${planName}</div>
    <div style="font-size:var(--font-size-xs);font-weight:600;color:var(--color-muted);font-family:var(--font-body-family)">${planRemaining}</div>
  </div>
  <div style="width:100%;height:8px;background:var(--color-background);border-radius:4px;overflow:hidden">
    <div style="width:${100 - pct}%;height:100%;background:${barColor};border-radius:4px;transition:width 0.3s ease"></div>
  </div>
  <div style="display:flex;justify-content:space-between;margin-top:var(--spacing-xs)">
    <span style="font-size:var(--font-size-xs);color:var(--color-muted);font-family:var(--font-body-family)">${pct}% used</span>
    <span style="font-size:var(--font-size-xs);color:var(--color-muted);font-family:var(--font-body-family)" data-text-editable>${planRemaining}</span>
  </div>
  ${lowBadge}
</div>`;
  }

  // multi
  const credits = props.credits ?? props.balance ?? d.credits;
  const planName = props.planName ?? d.planName;
  const planRemaining = props.planRemaining ?? d.planRemaining;
  const pct = props.percentUsed ?? d.percentUsed;

  return `
<div style="display:flex;gap:var(--spacing-sm);padding:var(--spacing-md)" data-component="balanceWidget">
  <div style="flex:1;padding:var(--spacing-md);background:var(--color-surface);border-radius:var(--radius-lg);box-shadow:0 1px 3px rgba(0,0,0,0.06);text-align:center">
    <div style="font-size:var(--font-size-xs);font-weight:600;color:var(--color-muted);font-family:var(--font-body-family);text-transform:uppercase;letter-spacing:0.03em">Credits</div>
    <div style="font-size:24px;font-weight:800;color:var(--color-foreground);font-family:var(--font-body-family);margin-top:var(--spacing-xs)" data-text-editable>${credits}</div>
    <div style="font-size:var(--font-size-xs);color:var(--color-muted);font-family:var(--font-body-family);margin-top:2px">${currency}</div>
    ${lowBadge}
  </div>
  <div style="flex:1;padding:var(--spacing-md);background:var(--color-surface);border-radius:var(--radius-lg);box-shadow:0 1px 3px rgba(0,0,0,0.06)">
    <div style="font-size:var(--font-size-xs);font-weight:600;color:var(--color-muted);font-family:var(--font-body-family);text-transform:uppercase;letter-spacing:0.03em">Plan</div>
    <div style="font-size:var(--font-size-sm);font-weight:700;color:var(--color-foreground);font-family:var(--font-body-family);margin-top:var(--spacing-xs)" data-text-editable>${planName}</div>
    <div style="width:100%;height:6px;background:var(--color-background);border-radius:3px;overflow:hidden;margin-top:var(--spacing-sm)">
      <div style="width:${100 - pct}%;height:100%;background:var(--rebtel-green, #2ECC71);border-radius:3px"></div>
    </div>
    <div style="font-size:var(--font-size-xs);color:var(--color-muted);font-family:var(--font-body-family);margin-top:4px">${planRemaining}</div>
  </div>
</div>`;
}
