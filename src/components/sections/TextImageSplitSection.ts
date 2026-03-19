import type { TextImageSplitProps } from "@/types/render";
import { esc } from "./utils";

export function renderTextImageSplit(props: TextImageSplitProps, sectionId?: string): string {
  const heading = props.heading || "A better way to work";
  const body = props.body || "Streamline your workflow with tools designed to help you focus on what matters most. Less busywork, more impact.";
  const cta = props.cta;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  // Support both new layout prop and deprecated imagePosition
  const layout = props.layout || (props.imagePosition === "left" ? "image-left" : "image-right");
  const imageStyle = props.imageStyle || "rounded";
  const imageSrc = props.imageSrc;
  const imageAlt = props.imageAlt || "Feature image";

  const isLeft = layout === "image-left";
  const isOverlap = layout === "image-overlap";
  const isFullBleed = layout === "image-full-bleed";

  function renderImageContent(): string {
    const radiusStyle = imageStyle === "sharp" ? "border-radius:0;" : "border-radius:var(--radius-lg);";

    const imgTag = imageSrc
      ? `<img src="${esc(imageSrc)}" alt="${esc(imageAlt)}" style="width:100%;aspect-ratio:4/3;object-fit:cover;display:block;${radiusStyle}" />`
      : `<div class="aph-img-placeholder-gradient" style="width:100%;aspect-ratio:4/3;${radiusStyle}">
        <span class="aph-placeholder-label">Image</span>
      </div>`;

    if (imageStyle === "browser-frame") {
      return `<div class="aph-browser-frame">
        <div class="aph-browser-frame-bar">
          <div class="aph-browser-frame-dot"></div>
          <div class="aph-browser-frame-dot"></div>
          <div class="aph-browser-frame-dot"></div>
          <div class="aph-browser-frame-url"></div>
        </div>
        ${imageSrc
          ? `<img src="${esc(imageSrc)}" alt="${esc(imageAlt)}" style="width:100%;display:block;" />`
          : `<div class="aph-img-placeholder-gradient" style="width:100%;aspect-ratio:16/9;">
              <span class="aph-placeholder-label">Image</span>
            </div>`}
      </div>`;
    }

    if (imageStyle === "phone-frame") {
      return `<div class="aph-phone-frame" style="margin:0 auto;">
        ${imageSrc
          ? `<img src="${esc(imageSrc)}" alt="${esc(imageAlt)}" style="width:100%;aspect-ratio:9/19.5;object-fit:cover;display:block;" />`
          : `<div class="aph-img-placeholder-gradient" style="width:100%;aspect-ratio:9/19.5;">
              <span class="aph-placeholder-label">App</span>
            </div>`}
      </div>`;
    }

    return imgTag;
  }

  const textContent = `<div class="aph-split-text">
      <h2 class="aph-split-heading aph-reveal">${esc(heading)}</h2>
      <p class="aph-split-body aph-reveal aph-reveal-delay-1">${esc(body)}</p>
      ${cta ? `<div class="aph-split-cta aph-reveal aph-reveal-delay-2"><a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent">${esc(cta)}</a></div>` : ""}
    </div>`;

  const mediaContent = `<div class="aph-split-media aph-reveal aph-reveal-delay-1">
      ${renderImageContent()}
    </div>`;

  if (isOverlap) {
    return `<section class="aph-split"${idAttr} style="overflow:visible;">
  <div class="aph-inner">
    <div class="aph-split-inner" style="position:relative;">
      ${textContent}
      <div class="aph-split-media aph-reveal aph-reveal-delay-1" style="margin-right:-80px;">
        ${renderImageContent()}
      </div>
    </div>
  </div>
</section>`;
  }

  if (isFullBleed) {
    return `<section class="aph-split"${idAttr}>
  <div style="display:grid;grid-template-columns:1fr 1fr;min-height:500px;">
    <div style="display:flex;align-items:center;padding:0 var(--spacing-4xl);">
      ${textContent}
    </div>
    <div class="aph-reveal" style="overflow:hidden;">
      ${imageSrc
        ? `<img src="${esc(imageSrc)}" alt="${esc(imageAlt)}" style="width:100%;height:100%;object-fit:cover;display:block;" />`
        : `<div class="aph-img-placeholder-gradient" style="width:100%;height:100%;">
            <span class="aph-placeholder-label">Image</span>
          </div>`}
    </div>
  </div>
</section>`;
  }

  const flipClass = isLeft ? " aph-split-flip" : "";

  return `<section class="aph-split${flipClass}"${idAttr}>
  <div class="aph-inner">
    <div class="aph-split-inner">
      ${textContent}
      ${mediaContent}
    </div>
  </div>
</section>`;
}
