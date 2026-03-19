import type { HeroProps } from "@/types/render";
import { esc } from "./utils";

export function renderHero(props: HeroProps, sectionId?: string): string {
  const headline = props.headline || "Build something that matters";
  const sub = props.subheadline || "A clear, compelling description of what you do and why it makes life better for the people who need it.";
  const cta = props.cta || "Get started";
  const ctaSec = props.ctaSecondary;
  const badge = props.badge;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  const layout = props.layout || "centered";
  const surface = props.surface || "flat";
  const headlineStyle = props.headlineStyle || "oversized";
  const density = props.density || "spacious";

  const surfaceClass = surface !== "flat" ? ` aph-surface-${surface}` : "";
  const densityClass = density !== "balanced" ? ` aph-density-${density}` : "";
  const headlineClass = `aph-headline-${headlineStyle}`;

  const badgeHtml = badge ? `<div class="aph-badge aph-hero-badge aph-reveal">${esc(badge)}</div>` : "";
  const ctaHtml = `<div class="aph-hero-cta aph-reveal aph-reveal-delay-2">
      <a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent aph-btn-lg">${esc(cta)}</a>
      ${ctaSec ? `<a href="${esc(props.ctaSecondaryHref || "#")}" class="aph-btn-ghost aph-btn-lg">${esc(ctaSec)}</a>` : ""}
    </div>`;

  const imageSrc = props.imageSrc;
  const imageAlt = props.imageAlt || "Hero image";

  function renderImage(aspectRatio: string = "16/9"): string {
    if (imageSrc) {
      return `<img src="${esc(imageSrc)}" alt="${esc(imageAlt)}" class="aph-hero-media" style="width:100%;aspect-ratio:${aspectRatio};object-fit:cover;border-radius:var(--radius-lg);display:block;" />`;
    }
    return `<div class="aph-img-placeholder-gradient" style="width:100%;aspect-ratio:${aspectRatio};border-radius:var(--radius-lg);">
      <span class="aph-placeholder-label">Image</span>
    </div>`;
  }

  switch (layout) {
    case "left-aligned":
      return `<section class="aph-hero aph-hero-left${surfaceClass}${densityClass}"${idAttr}>
  <div class="aph-inner aph-hero-inner" style="text-align:left;">
    ${badgeHtml}
    <h1 class="${headlineClass} aph-reveal" style="max-width:var(--max-w-md);">${esc(headline)}</h1>
    <p class="aph-hero-sub aph-reveal aph-reveal-delay-1">${esc(sub)}</p>
    ${ctaHtml}
  </div>
</section>`;

    case "split-image-right":
      return `<section class="aph-hero aph-hero-split${surfaceClass}${densityClass}"${idAttr}>
  <div class="aph-inner">
    <div class="aph-hero-split-grid">
      <div class="aph-hero-split-text">
        ${badgeHtml}
        <h1 class="${headlineClass} aph-reveal">${esc(headline)}</h1>
        <p class="aph-hero-sub aph-reveal aph-reveal-delay-1">${esc(sub)}</p>
        ${ctaHtml}
      </div>
      <div class="aph-hero-split-media aph-reveal aph-reveal-delay-1">
        ${renderImage("4/3")}
      </div>
    </div>
  </div>
</section>`;

    case "split-image-left":
      return `<section class="aph-hero aph-hero-split aph-hero-split-reverse${surfaceClass}${densityClass}"${idAttr}>
  <div class="aph-inner">
    <div class="aph-hero-split-grid" style="direction:rtl;">
      <div class="aph-hero-split-text" style="direction:ltr;">
        ${badgeHtml}
        <h1 class="${headlineClass} aph-reveal">${esc(headline)}</h1>
        <p class="aph-hero-sub aph-reveal aph-reveal-delay-1">${esc(sub)}</p>
        ${ctaHtml}
      </div>
      <div class="aph-hero-split-media aph-reveal aph-reveal-delay-1" style="direction:ltr;">
        ${renderImage("4/3")}
      </div>
    </div>
  </div>
</section>`;

    case "full-bleed":
      return `<section class="aph-hero aph-hero-full-bleed aph-surface-gradient-mesh${densityClass}"${idAttr} style="text-align:center;padding:calc(var(--section-py) * 2) 0 calc(var(--section-py) * 1.5);">
  <div class="aph-inner" style="position:relative;z-index:1;">
    ${badgeHtml}
    <h1 class="${headlineClass} aph-reveal" style="margin:0 auto;max-width:900px;">${esc(headline)}</h1>
    <p class="aph-hero-sub aph-reveal aph-reveal-delay-1" style="margin:var(--spacing-xl) auto 0;max-width:var(--max-w-sm);">${esc(sub)}</p>
    <div class="aph-hero-cta aph-reveal aph-reveal-delay-2" style="justify-content:center;">
      <a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent aph-btn-lg">${esc(cta)}</a>
      ${ctaSec ? `<a href="${esc(props.ctaSecondaryHref || "#")}" class="aph-btn-ghost aph-btn-lg">${esc(ctaSec)}</a>` : ""}
    </div>
  </div>
</section>`;

    case "centered":
    default:
      return `<section class="aph-hero aph-hero-centered${surfaceClass}${densityClass}"${idAttr} style="text-align:center;">
  <div class="aph-inner aph-hero-inner" style="display:flex;flex-direction:column;align-items:center;">
    ${badgeHtml}
    <h1 class="${headlineClass} aph-reveal" style="max-width:900px;">${esc(headline)}</h1>
    <p class="aph-hero-sub aph-reveal aph-reveal-delay-1" style="margin:var(--spacing-xl) auto 0;max-width:var(--max-w-sm);">${esc(sub)}</p>
    <div class="aph-hero-cta aph-reveal aph-reveal-delay-2" style="justify-content:center;">
      <a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent aph-btn-lg">${esc(cta)}</a>
      ${ctaSec ? `<a href="${esc(props.ctaSecondaryHref || "#")}" class="aph-btn-ghost aph-btn-lg">${esc(ctaSec)}</a>` : ""}
    </div>
  </div>
</section>`;
  }
}
