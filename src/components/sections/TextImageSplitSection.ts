import type { TextImageSplitProps } from "@/types/render";
import { esc } from "./utils";

export function renderTextImageSplit(props: TextImageSplitProps, sectionId?: string): string {
  const heading = props.heading || "A different way to think about it";
  const body =
    props.body ||
    "Describe the key insight or capability in one or two focused sentences. Lead with the outcome, not the mechanism.";
  const cta = props.cta;
  const flip = props.imagePosition === "left";
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  const textCol = `<div class="aph-split-text aph-reveal">
      <h2 class="aph-split-heading">${esc(heading)}</h2>
      <p class="aph-split-body">${esc(body)}</p>
      ${cta ? `<a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent aph-split-cta">${esc(cta)}</a>` : ""}
    </div>`;

  const imgLabel = props.imageryDirection || props.imageAlt || "Visual";
  const imageCol = props.imageSrc
    ? `<div class="aph-split-visual aph-reveal aph-reveal-delay-1">
      <img src="${esc(props.imageSrc)}" alt="${esc(props.imageAlt || heading)}" class="aph-split-image" />
    </div>`
    : `<div class="aph-split-visual aph-reveal aph-reveal-delay-1">
      <div class="aph-split-placeholder">
        <span class="aph-split-placeholder-label">${esc(imgLabel)}</span>
      </div>
    </div>`;

  return `<section class="aph-split"${idAttr}>
  <div class="aph-inner aph-split-inner${flip ? " aph-split-flip" : ""}">
    ${flip ? imageCol + "\n    " + textCol : textCol + "\n    " + imageCol}
  </div>
</section>`;
}
