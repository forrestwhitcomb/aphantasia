import type { FeatureGridProps, FeatureItem } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    icon: "◆",
    heading: "First capability",
    body: "A short, outcome-focused description of what makes this valuable.",
  },
  {
    icon: "◈",
    heading: "Second capability",
    body: "A short, outcome-focused description of what makes this valuable.",
  },
  {
    icon: "◉",
    heading: "Third capability",
    body: "A short, outcome-focused description of what makes this valuable.",
  },
];

export function renderFeatureGrid(props: FeatureGridProps, sectionId?: string): string {
  const title = props.title || "Why it works";
  const subtitle = props.subtitle || "Everything you need, nothing you don't.";
  const features = props.features?.length ? props.features : DEFAULT_FEATURES;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  const cards = features
    .map((f) => {
      const visual = f.imageSrc
        ? `<div class="aph-feature-image"><img src="${esc(f.imageSrc)}" alt="${esc(f.heading || "Feature image")}" /></div>`
        : `<div class="aph-feature-icon">${esc(f.icon || "◆")}</div>`;
      const ctaHtml = f.cta
        ? `\n      <a href="${esc(f.ctaHref || "#")}" class="aph-btn-accent aph-btn-sm" style="margin-top:auto;padding-top:12px;">${esc(f.cta)}</a>`
        : "";
      return `<div class="aph-feature-card aph-hover-lift${f.imageSrc ? " aph-feature-card--has-image" : ""}">
      ${visual}
      <h3 class="aph-feature-heading">${esc(f.heading || "Feature")}</h3>
      <p class="aph-feature-body">${esc(f.body || "A short, focused description of this capability.")}</p>${ctaHtml}
    </div>`;
    })
    .join("\n    ");

  const sectionClass =
    props.variant === "bundui-bento" ? "aph-feature-grid aph-feature-grid-bento" : "aph-feature-grid";

  return `<section class="${sectionClass} aph-reveal"${idAttr}>
  <div class="aph-inner">
    <div class="aph-section-header">
      <h2 class="aph-section-title">${esc(title)}</h2>
      <p class="aph-section-subtitle">${esc(subtitle)}</p>
    </div>
    <div class="aph-feature-cards aph-stagger">
    ${cards}
    </div>
  </div>
</section>`;
}
