// Carousel — Horizontal scrolling content
// Variants: "full-width" | "peek" | "dots" | "progress-bar"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface CarouselProps extends UIComponentPropsBase {
  variant?: "full-width" | "peek" | "dots" | "progress-bar";
}

export function renderCarousel(props: Partial<CarouselProps> = {}): string {
  const variant = props.variant ?? "dots";
  const count = props.itemCount ?? 3;
  const peekClass = variant === "peek" ? " ui-carousel--peek" : "";

  const items = Array.from({ length: count }, (_, i) => `
    <div class="ui-carousel__item ${i === 0 ? "ui-carousel__item--active" : ""}">
      <span class="ui-carousel__icon">${ICONS.image}</span>
    </div>`).join("");

  let indicatorHtml = "";
  if (variant === "dots" || variant === "full-width") {
    indicatorHtml = `<div class="ui-carousel__dots">${Array.from({ length: count }, (_, i) => `<div class="ui-carousel__dot ${i === 0 ? "ui-carousel__dot--active" : ""}"></div>`).join("")}</div>`;
  } else if (variant === "progress-bar") {
    indicatorHtml = `<div class="ui-carousel__progress"><div class="ui-carousel__progress-fill" style="width:${100 / count}%"></div></div>`;
  }

  return `
<div class="ui-carousel${peekClass}" data-component="carousel">
  ${props.label ? `<div class="ui-section-header" style="padding:0 var(--spacing-md) var(--spacing-sm)"><h3 class="ui-section-header__label">${props.label}</h3></div>` : ""}
  <div class="ui-carousel__track">${items}</div>
  ${indicatorHtml}
</div>`;
}
