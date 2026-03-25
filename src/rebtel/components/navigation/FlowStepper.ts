// FlowStepper — Multi-step flow indicator
// Variants: "horizontal" | "vertical"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export interface FlowStepperProps extends UIComponentPropsBase {
  variant?: "horizontal" | "vertical";
  activeStep?: number;
}

const DEFAULT_LABELS = ["Select", "Amount", "Payment", "Confirm"];

export function renderFlowStepper(props: Partial<FlowStepperProps> = {}): string {
  const variant = (props.variant as FlowStepperProps["variant"]) ?? "horizontal";
  const count = props.itemCount ?? 4;
  const labels = props.itemLabels ?? DEFAULT_LABELS;
  const activeStep = 0;

  if (variant === "vertical") {
    const steps = Array.from({ length: count }, (_, i) => {
      const isActive = i === activeStep;
      const isCompleted = i < activeStep;
      const isPending = i > activeStep;
      const label = labels[i % labels.length] ?? `Step ${i + 1}`;
      const isLast = i === count - 1;

      const circleStyle = isActive
        ? "background:var(--rebtel-red, #E63946);color:var(--rebtel-on-red, #FFFFFF);font-weight:700"
        : isCompleted
          ? "background:var(--rebtel-red, #E63946);color:var(--rebtel-on-red, #FFFFFF);font-weight:600"
          : "background:transparent;border:2px solid var(--rebtel-border, var(--color-border));color:var(--rebtel-muted, var(--color-muted-foreground));font-weight:400";

      const labelColor = isActive
        ? "var(--rebtel-foreground, var(--color-foreground))"
        : "var(--rebtel-muted, var(--color-muted-foreground))";

      const lineColor = isCompleted
        ? "var(--rebtel-red, #E63946)"
        : "var(--rebtel-border, var(--color-border))";

      return `
      <div style="display:flex;align-items:flex-start;gap:var(--rebtel-spacing-md, var(--spacing-md))">
        <div style="display:flex;flex-direction:column;align-items:center">
          <div style="width:28px;height:28px;border-radius:var(--rebtel-radius-full, 50%);display:flex;align-items:center;justify-content:center;font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));${circleStyle};box-sizing:border-box">${i + 1}</div>
          ${!isLast ? `<div style="width:2px;height:32px;background:${lineColor};margin:var(--rebtel-spacing-xs, 4px) 0"></div>` : ""}
        </div>
        <div style="padding-top:4px">
          <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:${isActive ? "600" : "400"};color:${labelColor}" data-text-editable>${label}</span>
        </div>
      </div>`;
    }).join("");

    return `
<div data-component="flowStepper" style="display:flex;flex-direction:column;padding:var(--rebtel-spacing-md, var(--spacing-md)) var(--rebtel-spacing-lg, var(--spacing-lg))">
  ${steps}
</div>`;
  }

  // horizontal variant (default)
  const steps = Array.from({ length: count }, (_, i) => {
    const isActive = i === activeStep;
    const isCompleted = i < activeStep;
    const label = labels[i % labels.length] ?? `Step ${i + 1}`;
    const isLast = i === count - 1;

    const circleStyle = isActive
      ? "background:var(--rebtel-red, #E63946);color:var(--rebtel-on-red, #FFFFFF);font-weight:700"
      : isCompleted
        ? "background:var(--rebtel-red, #E63946);color:var(--rebtel-on-red, #FFFFFF);font-weight:600"
        : "background:transparent;border:2px solid var(--rebtel-border, var(--color-border));color:var(--rebtel-muted, var(--color-muted-foreground));font-weight:400";

    const labelColor = isActive
      ? "var(--rebtel-foreground, var(--color-foreground))"
      : "var(--rebtel-muted, var(--color-muted-foreground))";

    const lineColor = isCompleted
      ? "var(--rebtel-red, #E63946)"
      : "var(--rebtel-border, var(--color-border))";

    const stepCircle = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:var(--rebtel-spacing-xs, 4px);min-width:48px">
        <div style="width:28px;height:28px;border-radius:var(--rebtel-radius-full, 50%);display:flex;align-items:center;justify-content:center;font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));${circleStyle};box-sizing:border-box">${i + 1}</div>
        <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-xs, 10px);font-weight:${isActive ? "600" : "400"};color:${labelColor};text-align:center;white-space:nowrap" data-text-editable>${label}</span>
      </div>`;

    const connector = !isLast
      ? `<div style="flex:1;height:2px;background:${lineColor};margin-top:14px;min-width:16px"></div>`
      : "";

    return stepCircle + connector;
  }).join("");

  return `
<div data-component="flowStepper" style="display:flex;align-items:flex-start;padding:var(--rebtel-spacing-md, var(--spacing-md)) var(--rebtel-spacing-lg, var(--spacing-lg))">
  ${steps}
</div>`;
}
