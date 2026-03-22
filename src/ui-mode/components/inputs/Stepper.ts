// Stepper — Increment/decrement control
// Variants: "default" | "with-label"

import type { UIComponentPropsBase } from "../../types";

export interface StepperProps extends UIComponentPropsBase {
  value?: number;
  variant?: "default" | "with-label";
}

export function renderStepper(props: Partial<StepperProps> = {}): string {
  const variant = props.variant ?? "with-label";
  const label = props.label ?? "Quantity";
  const value = props.value ?? 1;

  const stepperHtml = `
<div class="ui-stepper">
  <button class="ui-stepper__btn">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/></svg>
  </button>
  <span class="ui-stepper__value">${value}</span>
  <button class="ui-stepper__btn ui-stepper__btn--plus">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
  </button>
</div>`;

  if (variant === "with-label") {
    return `
<div class="ui-stepper-row" data-component="stepper">
  <span class="ui-stepper-row__label">${label}</span>
  ${stepperHtml}
</div>`;
  }

  return `<div class="ui-stepper-wrap" data-component="stepper">${stepperHtml}</div>`;
}
