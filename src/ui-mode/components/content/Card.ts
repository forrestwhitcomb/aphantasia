// Card — Content card container
// Variants: "elevated" | "bordered" | "filled" | "image-top"
// Supports nested children (toggle, text, etc.) and multi-line labels.

import type { UIComponentPropsBase, UIResolvedComponent } from "../../types";
import { ICONS } from "../icons";

export interface CardProps extends UIComponentPropsBase {
  title?: string;
  description?: string;
  variant?: "elevated" | "bordered" | "filled" | "image-top";
  children?: UIResolvedComponent[];
  /** Pre-rendered HTML for children above the card's main content */
  childrenHtmlTop?: string;
  /** Pre-rendered HTML for children below the card's main content */
  childrenHtmlBottom?: string;
  /** @deprecated Use childrenHtmlTop/childrenHtmlBottom */
  childrenHtml?: string;
}

const CARD_PLACEHOLDERS = [
  { title: "Quick Start", description: "Get up and running fast" },
  { title: "Analytics", description: "Track your performance" },
  { title: "Settings", description: "Customize your experience" },
  { title: "Support", description: "We're here to help" },
  { title: "Updates", description: "What's new this week" },
  { title: "Explore", description: "Discover new features" },
];

/**
 * Parse a multi-line label into title + description.
 * First line → title; remaining lines → description/paragraph.
 */
function parseMultiLineLabel(label: string): { title: string; description?: string } {
  const lines = label.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 1) return { title: lines[0] ?? label };
  return { title: lines[0], description: lines.slice(1).join("<br>") };
}

export function renderCard(props: Partial<CardProps> = {}, index = 0): string {
  const variant = props.variant ?? "elevated";
  const placeholder = CARD_PLACEHOLDERS[index % CARD_PLACEHOLDERS.length];
  const rawLabel = props.label ?? props.title ?? "";

  // Multi-line label parsing: first line = title, rest = description
  const parsed = rawLabel ? parseMultiLineLabel(rawLabel) : null;
  const title = parsed?.title ?? placeholder.title;
  const description = parsed?.description ?? props.description ?? placeholder.description;

  const topHtml = props.childrenHtmlTop ?? "";
  const bottomHtml = props.childrenHtmlBottom ?? props.childrenHtml ?? "";

  if (variant === "image-top") {
    return `
<div class="ui-card ui-card--image-top" data-component="card">
  <div class="ui-card__image">${ICONS.image}</div>
  <div class="ui-card__body">
    ${topHtml}
    <h4 class="ui-card__title" data-text-editable>${title}</h4>
    <p class="ui-card__description" data-text-editable>${description}</p>
    ${bottomHtml}
  </div>
</div>`;
  }

  return `
<div class="ui-card ui-card--${variant}" data-component="card">
  ${topHtml}
  <div class="ui-card__icon"></div>
  <h4 class="ui-card__title" data-text-editable>${title}</h4>
  <p class="ui-card__description" data-text-editable>${description}</p>
  ${bottomHtml}
</div>`;
}

/** Render a grid of cards */
export function renderCardGrid(props: Partial<CardProps & { itemCount?: number; itemLabels?: string[] }> = {}): string {
  const count = props.itemCount ?? 1;
  const variant = props.variant ?? "elevated";

  const labels = props.itemLabels ?? [];
  const cards = Array.from({ length: count }, (_, i) => {
    const cardLabel = labels[i] ?? (i === 0 ? props.label : undefined);
    return renderCard({
      ...props,
      label: cardLabel,
      variant,
      childrenHtmlTop: i === 0 ? props.childrenHtmlTop : undefined,
      childrenHtmlBottom: i === 0 ? props.childrenHtmlBottom : undefined,
      childrenHtml: i === 0 ? props.childrenHtml : undefined,
    }, i);
  }).join("");

  let gridClass = "ui-cards__grid";
  if (count <= 1) {
    gridClass += " ui-cards__grid--single";
  } else if (count === 3) {
    gridClass += " ui-cards__grid--three";
  }

  return `
<section class="ui-cards" data-component="card">
  <div class="${gridClass}">${cards}</div>
</section>`;
}
