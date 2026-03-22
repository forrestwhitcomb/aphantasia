// Card — Content card container
// Variants: "elevated" | "bordered" | "filled" | "image-top"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface CardProps extends UIComponentPropsBase {
  title?: string;
  description?: string;
  variant?: "elevated" | "bordered" | "filled" | "image-top";
}

const CARD_PLACEHOLDERS = [
  { title: "Quick Start", description: "Get up and running fast" },
  { title: "Analytics", description: "Track your performance" },
  { title: "Settings", description: "Customize your experience" },
  { title: "Support", description: "We're here to help" },
  { title: "Updates", description: "What's new this week" },
  { title: "Explore", description: "Discover new features" },
];

export function renderCard(props: Partial<CardProps> = {}, index = 0): string {
  const variant = props.variant ?? "elevated";
  const placeholder = CARD_PLACEHOLDERS[index % CARD_PLACEHOLDERS.length];
  const title = props.label ?? props.title ?? placeholder.title;
  const description = props.description ?? placeholder.description;

  if (variant === "image-top") {
    return `
<div class="ui-card ui-card--image-top" data-component="card">
  <div class="ui-card__image">${ICONS.image}</div>
  <div class="ui-card__body">
    <h4 class="ui-card__title">${title}</h4>
    <p class="ui-card__description">${description}</p>
  </div>
</div>`;
  }

  return `
<div class="ui-card ui-card--${variant}" data-component="card">
  <div class="ui-card__icon"></div>
  <h4 class="ui-card__title">${title}</h4>
  <p class="ui-card__description">${description}</p>
</div>`;
}

/** Render a grid of cards */
export function renderCardGrid(props: Partial<CardProps & { itemCount?: number }> = {}): string {
  const count = props.itemCount ?? 4;
  const variant = props.variant ?? "elevated";
  const gridClass = count <= 1 ? "ui-cards__grid ui-cards__grid--single" : "ui-cards__grid";

  const cards = Array.from({ length: count }, (_, i) =>
    renderCard({ ...props, variant }, i)
  ).join("");

  return `
<section class="ui-cards" data-component="card">
  ${props.label ? `<h2 class="ui-cards__title">${props.label}</h2>` : ""}
  <div class="${gridClass}">${cards}</div>
</section>`;
}
