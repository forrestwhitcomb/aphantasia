// PinInput — Rebtel PIN/OTP verification input
// Variants: "4-digit" | "6-digit" | "with-resend"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderPinInput(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "4-digit" | "6-digit" | "with-resend") ?? "4-digit";
  const label = props.label ?? "Enter verification code";

  const containerStyles = `display:flex;flex-direction:column;align-items:center;gap:var(--rebtel-spacing-lg, var(--spacing-lg));padding:var(--rebtel-spacing-lg, var(--spacing-lg)) var(--rebtel-spacing-md, var(--spacing-md));width:100%;box-sizing:border-box`;
  const boxBase = `width:48px;height:56px;display:flex;align-items:center;justify-content:center;border-radius:var(--rebtel-radius-md, var(--radius-md));font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:24px;font-weight:700;color:var(--rebtel-foreground, var(--color-foreground))`;
  const boxFilled = `background:var(--rebtel-surface, var(--color-background));border:2px solid var(--rebtel-red, #E63946)`;
  const boxEmpty = `background:var(--rebtel-input-bg, var(--color-secondary));border:1.5px solid var(--rebtel-border, var(--color-border))`;

  const renderBoxes = (count: number) => {
    return Array.from({ length: count }, (_, i) =>
      `<div style="${boxBase};${i === 0 ? boxFilled : boxEmpty}" data-interactive="input">${i === 0 ? "4" : ""}</div>`
    ).join("\n      ");
  };

  switch (variant) {
    case "4-digit":
      return `
<div data-component="pinInput" style="${containerStyles}">
  <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:500;color:var(--rebtel-foreground, var(--color-foreground));text-align:center" data-text-editable>${label}</span>
  <div style="display:flex;gap:var(--rebtel-spacing-md, var(--spacing-md))">
    ${renderBoxes(4)}
  </div>
</div>`;

    case "6-digit":
      return `
<div data-component="pinInput" style="${containerStyles}">
  <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:500;color:var(--rebtel-foreground, var(--color-foreground));text-align:center" data-text-editable>${label}</span>
  <div style="display:flex;gap:var(--rebtel-spacing-sm, var(--spacing-sm))">
    ${renderBoxes(6)}
  </div>
</div>`;

    case "with-resend":
      return `
<div data-component="pinInput" style="${containerStyles}">
  <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:500;color:var(--rebtel-foreground, var(--color-foreground));text-align:center" data-text-editable>${label}</span>
  <div style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-muted, var(--color-muted-foreground));text-align:center" data-text-editable>We sent a code to +1 (555) 234-5678</div>
  <div style="display:flex;gap:var(--rebtel-spacing-md, var(--spacing-md))">
    ${renderBoxes(4)}
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:var(--rebtel-spacing-xs, var(--spacing-xs))">
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-muted, var(--color-muted-foreground))" data-text-editable>Resend code in 0:30</span>
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-red, #E63946);opacity:0.4;font-weight:500" data-interactive="button">Resend Code</span>
  </div>
</div>`;

    default:
      return renderPinInput({ ...props, variant: "4-digit" });
  }
}
