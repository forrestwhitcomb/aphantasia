// Slider — Range input
// Variants: "default" | "with-labels" | "with-value"

import type { UIComponentPropsBase } from "../../types";

export interface SliderProps extends UIComponentPropsBase {
  min?: string;
  max?: string;
  value?: number;
  variant?: "default" | "with-labels" | "with-value";
}

export function renderSlider(props: Partial<SliderProps> = {}): string {
  const variant = props.variant ?? "default";
  const label = props.label ?? "Volume";
  const value = props.value ?? 60;
  const min = props.min ?? "0";
  const max = props.max ?? "100";

  const labelsHtml = variant === "with-labels"
    ? `<div class="ui-slider__labels"><span>${min}</span><span>${max}</span></div>`
    : "";

  const valueHtml = variant === "with-value"
    ? `<span class="ui-slider__value">${value}</span>`
    : "";

  return `
<div class="ui-slider-wrap" data-component="slider">
  <div class="ui-slider__header">
    <span class="ui-slider__label">${label}</span>
    ${valueHtml}
  </div>
  <div class="ui-slider">
    <div class="ui-slider__track">
      <div class="ui-slider__fill" style="width:${value}%"></div>
      <div class="ui-slider__thumb" style="left:${value}%"></div>
    </div>
  </div>
  ${labelsHtml}
</div>`;
}
