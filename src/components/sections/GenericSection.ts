import type { GenericSectionProps } from "@/types/render";
import { esc } from "./utils";

export function renderGenericSection(props: GenericSectionProps, sectionId?: string): string {
  const title = props.title || "Section";
  const body = props.body || "This section will be populated based on your context. Add a note to this shape to guide the content.";
  const cta = props.cta;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";
  const layout = props.layout || "centered-text";
  const surface = props.surface || "flat";
  const surfaceClass = surface !== "flat" ? ` aph-surface-${surface}` : "";

  if (layout === "left-text") {
    return `<section class="aph-generic aph-reveal${surfaceClass}"${idAttr}>
  <div class="aph-inner" style="max-width:var(--max-w-md);">
    <h2 class="aph-section-title" style="text-align:left;">${esc(title)}</h2>
    <p class="aph-generic-body" style="text-align:left;">${esc(body)}</p>
    ${cta ? `<a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent">${esc(cta)}</a>` : ""}
  </div>
</section>`;
  }

  if (layout === "split") {
    return `<section class="aph-generic aph-reveal${surfaceClass}"${idAttr}>
  <div class="aph-inner" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-4xl);align-items:center;">
    <div>
      <h2 class="aph-section-title" style="text-align:left;">${esc(title)}</h2>
    </div>
    <div>
      <p class="aph-generic-body" style="text-align:left;margin-top:0;">${esc(body)}</p>
      ${cta ? `<a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent">${esc(cta)}</a>` : ""}
    </div>
  </div>
</section>`;
  }

  // centered-text (default)
  return `<section class="aph-generic aph-reveal${surfaceClass}"${idAttr}>
  <div class="aph-inner aph-generic-inner" style="text-align:center;max-width:var(--max-w-md);margin:0 auto;">
    <h2 class="aph-section-title">${esc(title)}</h2>
    <p class="aph-generic-body">${esc(body)}</p>
    ${cta ? `<a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent">${esc(cta)}</a>` : ""}
  </div>
</section>`;
}
