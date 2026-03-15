import type { HeroProps } from "@/types/render";
import { esc } from "./utils";

export function renderHero(props: HeroProps, sectionId?: string): string {
  const headline = props.headline || "Build something that matters";
  const sub =
    props.subheadline ||
    "A clear, compelling description of what you do and why it makes life better for the people who need it.";
  const cta = props.cta || "Get started";
  const ctaSec = props.ctaSecondary;
  const badge = props.badge;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  return `<section class="aph-hero"${idAttr}>
  <div class="aph-inner aph-hero-inner">
    ${badge ? `<div class="aph-badge aph-hero-badge">${esc(badge)}</div>` : ""}
    <h1 class="aph-hero-h1">${esc(headline)}</h1>
    <p class="aph-hero-sub">${esc(sub)}</p>
    <div class="aph-hero-cta">
      <a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent">${esc(cta)}</a>
      ${ctaSec ? `<a href="${esc(props.ctaSecondaryHref || "#")}" class="aph-btn-ghost">${esc(ctaSec)}</a>` : ""}
    </div>
  </div>
</section>`;
}
