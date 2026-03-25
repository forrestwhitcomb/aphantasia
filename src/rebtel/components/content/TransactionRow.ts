// TransactionRow — Transaction history item
// Variants: "topup" (green arrow up), "call" (phone icon), "payment" (card icon), "refund" (return arrow)

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface TransactionRowProps extends UIComponentPropsBase {
  title?: string;
  date?: string;
  amount?: string;
  status?: "completed" | "pending" | "failed";
  variant?: "topup" | "call" | "payment" | "refund";
}

const TX_PLACEHOLDERS: Record<string, { title: string; date: string; amount: string; status: "completed" | "pending" | "failed" }> = {
  topup: { title: "Top-up to Mexico", date: "Mar 21, 2026", amount: "$10.00", status: "completed" },
  call: { title: "Call to India", date: "Mar 20, 2026", amount: "$1.24", status: "completed" },
  payment: { title: "Credit purchase", date: "Mar 19, 2026", amount: "$25.00", status: "pending" },
  refund: { title: "Refund - Failed top-up", date: "Mar 18, 2026", amount: "$5.00", status: "completed" },
};

const TX_ICONS: Record<string, { svg: string; bg: string }> = {
  topup: {
    bg: "var(--rebtel-green-light, #E8F8F0)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-green, #2ECC71)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
  },
  call: {
    bg: "var(--rebtel-blue-light, #EBF5FB)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-blue, #3498DB)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  },
  payment: {
    bg: "var(--rebtel-orange-light, #FEF5E7)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-orange, #F39C12)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  },
  refund: {
    bg: "var(--rebtel-red-light, #FCEAEC)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-red, #E63946)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
  },
};

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  completed: { color: "var(--rebtel-green, #2ECC71)", label: "Completed" },
  pending: { color: "var(--rebtel-orange, #F39C12)", label: "Pending" },
  failed: { color: "var(--rebtel-red, #E63946)", label: "Failed" },
};

export function renderTransactionRow(props: Partial<TransactionRowProps> = {}, _index = 0): string {
  const variant = props.variant ?? "topup";
  const p = TX_PLACEHOLDERS[variant] ?? TX_PLACEHOLDERS.topup;
  const title = props.title ?? props.label ?? p.title;
  const date = props.date ?? p.date;
  const amount = props.amount ?? p.amount;
  const status = props.status ?? p.status;

  const icon = TX_ICONS[variant] ?? TX_ICONS.topup;
  const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.completed;

  const amountPrefix = variant === "refund" ? "+" : "-";
  const amountColor = variant === "refund" ? "var(--rebtel-green, #2ECC71)" : "var(--color-foreground)";

  return `
<div style="display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-md) var(--spacing-md);background:var(--color-surface);border-bottom:1px solid var(--color-border, rgba(0,0,0,0.06))" data-component="transactionRow">
  <div style="width:36px;height:36px;border-radius:50%;background:${icon.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0">
    ${icon.svg}
  </div>
  <div style="flex:1;min-width:0">
    <div style="font-size:var(--font-size-sm);font-weight:600;color:var(--color-foreground);font-family:var(--font-body-family)" data-text-editable>${title}</div>
    <div style="font-size:var(--font-size-xs);color:var(--color-muted);font-family:var(--font-body-family);margin-top:1px">${date}</div>
  </div>
  <div style="text-align:right;flex-shrink:0">
    <div style="font-size:var(--font-size-sm);font-weight:700;color:${amountColor};font-family:var(--font-body-family)" data-text-editable>${amountPrefix}${amount}</div>
    <div style="font-size:10px;font-weight:600;color:${statusStyle.color};font-family:var(--font-body-family);margin-top:1px">${statusStyle.label}</div>
  </div>
</div>`;
}
