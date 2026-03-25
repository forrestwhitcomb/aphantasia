// AmountSelector — "How often?" with grid pills matching Figma
// Figma: 7 days, 14 days, 21 days, 30 days. Clean bordered pills.
// Variants: "grid" | "slider" | "custom"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderAmountSelector(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "grid" | "slider" | "custom") ?? "grid";
  const label = props.label ?? "How often?";

  switch (variant) {
    case "grid": {
      const options = ["7 days", "14 days", "21 days", "30 days"];
      return `
<div data-component="amountSelector" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-md);width:100%;box-sizing:border-box">
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${label}</span>
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--rebtel-spacing-xs)">
    ${options.map((opt, i) => {
      const isSelected = i === 3;
      return `<div style="display:flex;align-items:center;justify-content:center;height:var(--rebtel-height-md);border-radius:var(--rebtel-radius-sm);border:1px solid ${isSelected ? "var(--rebtel-brand-red)" : "var(--rebtel-border-default)"};background:${isSelected ? "var(--rebtel-brand-red)" : "var(--rebtel-surface-primary)"};color:${isSelected ? "var(--rebtel-text-on-brand)" : "var(--rebtel-text-primary)"};font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);line-height:var(--rebtel-label-sm-lh);font-weight:500;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button" data-text-editable>${opt}</div>`;
    }).join("\n    ")}
  </div>
</div>`;
    }

    case "slider":
      return `
<div data-component="amountSelector" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-md);width:100%;box-sizing:border-box">
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${label}</span>
  <div style="text-align:center;padding:var(--rebtel-spacing-md) 0">
    <span style="font-family:var(--rebtel-font-display);font-size:var(--rebtel-display-lg-size);line-height:var(--rebtel-display-lg-lh);font-weight:700;color:var(--rebtel-brand-red);letter-spacing:var(--rebtel-ls)">$20</span>
  </div>
  <div style="position:relative;height:4px;background:var(--rebtel-grey-200);border-radius:2px;margin:var(--rebtel-spacing-xs) 0">
    <div style="position:absolute;left:0;top:0;width:40%;height:100%;background:var(--rebtel-brand-red);border-radius:2px"></div>
    <div style="position:absolute;left:40%;top:50%;transform:translate(-50%,-50%);width:20px;height:20px;background:var(--rebtel-brand-red);border-radius:50%;border:3px solid var(--rebtel-surface-primary);box-shadow:0 1px 4px rgba(0,0,0,0.15)"></div>
  </div>
  <div style="display:flex;justify-content:space-between;font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-xs-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)">
    <span>$5</span><span>$50</span>
  </div>
</div>`;

    case "custom":
      return `
<div data-component="amountSelector" style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-md);width:100%;box-sizing:border-box">
  <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-headline-xs-size);line-height:var(--rebtel-headline-xs-lh);font-weight:600;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>${label}</span>
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm);background:var(--rebtel-surface-primary);border:2px solid var(--rebtel-brand-red);border-radius:var(--rebtel-radius-md);padding:var(--rebtel-spacing-md) var(--rebtel-spacing-lg);height:var(--rebtel-height-xxl)" data-interactive="input">
    <span style="font-family:var(--rebtel-font-display);font-size:var(--rebtel-display-md-size);font-weight:700;color:var(--rebtel-brand-red);letter-spacing:var(--rebtel-ls)">$</span>
    <span style="font-family:var(--rebtel-font-display);font-size:var(--rebtel-display-md-size);font-weight:700;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)" data-text-editable>25.00</span>
  </div>
  <div style="display:flex;gap:var(--rebtel-spacing-xs);justify-content:center">
    ${["$5", "$10", "$25", "$50"].map((a, i) => {
      const sel = i === 2;
      return `<div style="display:flex;align-items:center;justify-content:center;height:var(--rebtel-height-sm);padding:0 var(--rebtel-spacing-md);border-radius:var(--rebtel-radius-xs);border:1px solid ${sel ? "var(--rebtel-brand-red)" : "var(--rebtel-border-default)"};background:${sel ? "var(--rebtel-brand-red)" : "var(--rebtel-surface-primary)"};color:${sel ? "var(--rebtel-text-on-brand)" : "var(--rebtel-text-primary)"};font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);font-weight:500;letter-spacing:var(--rebtel-ls);cursor:pointer" data-interactive="button">${a}</div>`;
    }).join("\n    ")}
  </div>
</div>`;

    default:
      return renderAmountSelector({ ...props, variant: "grid" });
  }
}
