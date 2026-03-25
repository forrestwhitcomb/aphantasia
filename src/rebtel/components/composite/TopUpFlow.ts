// TopUpFlow — Rebtel complete top-up form
// Variants: "standard" | "auto-recharge" | "bundle"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderTopUpFlow(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "standard" | "auto-recharge" | "bundle") ?? "standard";
  const label = props.label ?? "Send Top-Up";

  const containerStyles = `display:flex;flex-direction:column;gap:var(--rebtel-spacing-md, var(--spacing-md));width:100%;box-sizing:border-box`;
  const sectionLabel = `font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:600;color:var(--rebtel-foreground, var(--color-foreground));padding:0 var(--rebtel-spacing-md, var(--spacing-md))`;
  const buttonStyles = `display:flex;align-items:center;justify-content:center;height:52px;margin:0 var(--rebtel-spacing-md, var(--spacing-md));background:var(--rebtel-red, #E63946);color:#fff;border-radius:var(--rebtel-radius-full, var(--radius-full));font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:600;cursor:pointer;box-shadow:0 2px 8px rgba(230,57,70,0.3)" data-interactive="button`;
  const inputRow = `display:flex;align-items:center;gap:var(--rebtel-spacing-sm, var(--spacing-sm));margin:0 var(--rebtel-spacing-md, var(--spacing-md));background:var(--rebtel-input-bg, var(--color-secondary));border:1.5px solid var(--rebtel-border, var(--color-border));border-radius:var(--rebtel-radius-md, var(--radius-md));padding:0 var(--rebtel-spacing-md, var(--spacing-md));height:52px`;
  const pillBase = `display:flex;align-items:center;justify-content:center;height:44px;border-radius:var(--rebtel-radius-md, var(--radius-md));font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:600;cursor:pointer`;
  const pillSelected = `background:var(--rebtel-red, #E63946);color:#fff;border:2px solid var(--rebtel-red, #E63946)`;
  const pillDefault = `background:var(--rebtel-surface, var(--color-background));color:var(--rebtel-foreground, var(--color-foreground));border:1.5px solid var(--rebtel-border, var(--color-border))`;
  const cardRowStyles = `display:flex;align-items:center;gap:var(--rebtel-spacing-md, var(--spacing-md));margin:0 var(--rebtel-spacing-md, var(--spacing-md));padding:var(--rebtel-spacing-md, var(--spacing-md));border-radius:var(--rebtel-radius-md, var(--radius-md));border:2px solid var(--rebtel-red, #E63946);background:var(--rebtel-surface, var(--color-background))`;

  const phoneInput = `
  <div style="${inputRow}" data-interactive="input">
    <div style="display:flex;align-items:center;gap:4px;padding-right:var(--rebtel-spacing-sm, var(--spacing-sm));border-right:1px solid var(--rebtel-border, var(--color-border));flex-shrink:0">
      <span style="font-size:18px">\u{1F1F2}\u{1F1FD}</span>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:500;color:var(--rebtel-foreground, var(--color-foreground))">+52</span>
    </div>
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));color:var(--rebtel-foreground, var(--color-foreground))" data-text-editable>555 123 4567</span>
  </div>`;

  const paymentRow = `
  <div style="${cardRowStyles}">
    <div style="width:20px;height:20px;border-radius:50%;border:2px solid var(--rebtel-red, #E63946);display:flex;align-items:center;justify-content:center;flex-shrink:0"><div style="width:10px;height:10px;border-radius:50%;background:var(--rebtel-red, #E63946)"></div></div>
    <div style="width:36px;height:24px;background:linear-gradient(135deg,#1A1F71,#2B4FCF);border-radius:3px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:serif;font-size:10px;font-weight:700;color:#fff;font-style:italic">VISA</span></div>
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-foreground, var(--color-foreground));flex:1">Visa ****4242</span>
  </div>`;

  switch (variant) {
    case "standard":
      return `
<div data-component="topUpFlow" style="${containerStyles}">
  <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:var(--rebtel-font-size-xl, var(--font-size-xl));font-weight:700;color:var(--rebtel-foreground, var(--color-foreground));padding:var(--rebtel-spacing-md, var(--spacing-md)) var(--rebtel-spacing-md, var(--spacing-md)) 0" data-text-editable>${label}</span>
  <span style="${sectionLabel}" data-text-editable>Recipient</span>
  ${phoneInput}
  <span style="${sectionLabel}" data-text-editable>Amount</span>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--rebtel-spacing-sm, var(--spacing-sm));padding:0 var(--rebtel-spacing-md, var(--spacing-md))">
    ${["$5", "$10", "$15", "$20", "$30", "$50"].map((a, i) => `<div style="${pillBase};${i === 2 ? pillSelected : pillDefault}" data-interactive="button">${a}</div>`).join("\n    ")}
  </div>
  <span style="${sectionLabel}" data-text-editable>Payment</span>
  ${paymentRow}
  <div style="height:var(--rebtel-spacing-sm, var(--spacing-sm))"></div>
  <div style="${buttonStyles}" data-text-editable>Send $15.00</div>
</div>`;

    case "auto-recharge":
      return `
<div data-component="topUpFlow" style="${containerStyles}">
  <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:var(--rebtel-font-size-xl, var(--font-size-xl));font-weight:700;color:var(--rebtel-foreground, var(--color-foreground));padding:var(--rebtel-spacing-md, var(--spacing-md)) var(--rebtel-spacing-md, var(--spacing-md)) 0" data-text-editable>Auto Recharge</span>
  <span style="${sectionLabel}" data-text-editable>Recipient</span>
  ${phoneInput}
  <span style="${sectionLabel}" data-text-editable>Recharge amount</span>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--rebtel-spacing-sm, var(--spacing-sm));padding:0 var(--rebtel-spacing-md, var(--spacing-md))">
    ${["$10", "$20", "$30"].map((a, i) => `<div style="${pillBase};${i === 1 ? pillSelected : pillDefault}" data-interactive="button">${a}</div>`).join("\n    ")}
  </div>
  <span style="${sectionLabel}" data-text-editable>Schedule</span>
  <div style="display:flex;gap:var(--rebtel-spacing-sm, var(--spacing-sm));padding:0 var(--rebtel-spacing-md, var(--spacing-md))">
    ${["Weekly", "Bi-weekly", "Monthly"].map((s, i) => `<div style="${pillBase};${i === 2 ? pillSelected : pillDefault};padding:0 16px;height:36px;font-size:var(--rebtel-font-size-sm, var(--font-size-sm))" data-interactive="button">${s}</div>`).join("\n    ")}
  </div>
  <span style="${sectionLabel}" data-text-editable>Payment</span>
  ${paymentRow}
  <div style="height:var(--rebtel-spacing-sm, var(--spacing-sm))"></div>
  <div style="${buttonStyles}" data-text-editable>Enable Auto Recharge</div>
</div>`;

    case "bundle":
      return `
<div data-component="topUpFlow" style="${containerStyles}">
  <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:var(--rebtel-font-size-xl, var(--font-size-xl));font-weight:700;color:var(--rebtel-foreground, var(--color-foreground));padding:var(--rebtel-spacing-md, var(--spacing-md)) var(--rebtel-spacing-md, var(--spacing-md)) 0" data-text-editable>Select Bundle</span>
  <span style="${sectionLabel}" data-text-editable>Recipient</span>
  ${phoneInput}
  <span style="${sectionLabel}" data-text-editable>Available bundles</span>
  ${[
    { name: "Data 1GB", desc: "1 GB data, 7 days", price: "$8.99" },
    { name: "Combo Pack", desc: "500MB + 30 min calls, 15 days", price: "$14.99", selected: true },
    { name: "Unlimited Talk", desc: "Unlimited calls, 30 days", price: "$24.99" },
  ].map(b => `
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-md, var(--spacing-md));margin:0 var(--rebtel-spacing-md, var(--spacing-md));padding:var(--rebtel-spacing-md, var(--spacing-md));border-radius:var(--rebtel-radius-md, var(--radius-md));border:${b.selected ? "2px solid var(--rebtel-red, #E63946)" : "1.5px solid var(--rebtel-border, var(--color-border))"};background:var(--rebtel-surface, var(--color-background));cursor:pointer" data-interactive="button">
    <div style="width:20px;height:20px;border-radius:50%;border:2px solid ${b.selected ? "var(--rebtel-red, #E63946)" : "var(--rebtel-border, var(--color-border))"};display:flex;align-items:center;justify-content:center;flex-shrink:0">${b.selected ? '<div style="width:10px;height:10px;border-radius:50%;background:var(--rebtel-red, #E63946)"></div>' : ""}</div>
    <div style="flex:1;display:flex;flex-direction:column;gap:2px">
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:600;color:var(--rebtel-foreground, var(--color-foreground))">${b.name}</span>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-muted, var(--color-muted-foreground))">${b.desc}</span>
    </div>
    <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:700;color:var(--rebtel-red, #E63946);flex-shrink:0">${b.price}</span>
  </div>`).join("")}
  <div style="height:var(--rebtel-spacing-sm, var(--spacing-sm))"></div>
  <div style="${buttonStyles}" data-text-editable>Buy Combo Pack - $14.99</div>
</div>`;

    default:
      return renderTopUpFlow({ ...props, variant: "standard" });
  }
}
