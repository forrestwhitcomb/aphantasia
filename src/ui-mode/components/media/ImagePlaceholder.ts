// ImagePlaceholder — Image placeholder
// Variants: "rounded" | "sharp" | "circle"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface ImagePlaceholderProps extends UIComponentPropsBase {
  aspectRatio?: string;
  variant?: "rounded" | "sharp" | "circle";
}

export function renderImagePlaceholder(props: Partial<ImagePlaceholderProps> = {}): string {
  const variant = props.variant ?? "rounded";
  const aspectRatio = props.aspectRatio ?? "16/9";

  return `
<div class="ui-image ui-image--${variant}" style="aspect-ratio:${aspectRatio}" data-component="imagePlaceholder">
  <span class="ui-image__icon">${ICONS.image}</span>
  ${props.label ? `<span class="ui-image__label">${props.label}</span>` : ""}
</div>`;
}
