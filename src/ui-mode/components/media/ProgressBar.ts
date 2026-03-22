// ProgressBar — Progress indicator
// Variants: "linear" | "circular" | "steps"

import type { UIComponentPropsBase } from "../../types";

export interface ProgressBarProps extends UIComponentPropsBase {
  value?: number;
  steps?: number;
  currentStep?: number;
  variant?: "linear" | "circular" | "steps";
}

export function renderProgressBar(props: Partial<ProgressBarProps> = {}): string {
  const variant = props.variant ?? "linear";
  const value = props.value ?? 65;
  const label = props.label;

  if (variant === "steps") {
    const steps = props.steps ?? 4;
    const currentStep = props.currentStep ?? 2;
    return `
<div class="ui-progress ui-progress--steps" data-component="progressBar">
  ${label ? `<span class="ui-progress__label">${label}</span>` : ""}
  <div class="ui-progress__steps">
    ${Array.from({ length: steps }, (_, i) => `<div class="ui-progress__step ${i < currentStep ? "ui-progress__step--done" : i === currentStep ? "ui-progress__step--active" : ""}"></div>`).join("")}
  </div>
</div>`;
  }

  if (variant === "circular") {
    return `
<div class="ui-progress ui-progress--circular" data-component="progressBar">
  <svg class="ui-progress__ring" viewBox="0 0 36 36">
    <path class="ui-progress__ring-bg" d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="3"/>
    <path class="ui-progress__ring-fill" d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="3" stroke-dasharray="${value}, 100"/>
  </svg>
  <span class="ui-progress__percent">${value}%</span>
</div>`;
  }

  // linear
  return `
<div class="ui-progress" data-component="progressBar">
  ${label ? `<div class="ui-progress__header"><span class="ui-progress__label">${label}</span><span class="ui-progress__value">${value}%</span></div>` : ""}
  <div class="ui-progress__track">
    <div class="ui-progress__fill" style="width:${value}%"></div>
  </div>
</div>`;
}
