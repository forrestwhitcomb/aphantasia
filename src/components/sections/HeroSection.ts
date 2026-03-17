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

  const h1Class =
    props.variant === "animated-headline" ? "aph-hero-h1 aph-hero-h1-animated" : "aph-hero-h1";

  const sectionClasses = ["aph-hero"];
  if (props.variant === "bundui-entrance") sectionClasses.push("aph-hero-bundui-entrance");

  const imagery = props.imageryDirection
    ? `<div class="aph-hero-imagery"><span class="aph-img-label">${esc(props.imageryDirection)}</span></div>`
    : "";

  return `<section class="${sectionClasses.join(" ")}"${idAttr}>
  <div class="aph-inner aph-hero-inner">
    ${badge ? `<div class="aph-badge aph-hero-badge aph-reveal">${esc(badge)}</div>` : ""}
    <h1 class="${h1Class} aph-reveal">${esc(headline)}</h1>
    <p class="aph-hero-sub aph-reveal aph-reveal-delay-1">${esc(sub)}</p>
    <div class="aph-hero-cta aph-reveal aph-reveal-delay-2">
      <a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent aph-btn-lg">${esc(cta)}</a>
      ${ctaSec ? `<a href="${esc(props.ctaSecondaryHref || "#")}" class="aph-btn-ghost aph-btn-lg">${esc(ctaSec)}</a>` : ""}
    </div>
    ${imagery}
  </div>
</section>`;
}
