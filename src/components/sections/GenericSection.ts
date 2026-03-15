import type { GenericSectionProps } from "@/types/render";
import { esc } from "./utils";

export function renderGenericSection(props: GenericSectionProps, sectionId?: string): string {
  const title = props.title || "Section";
  const body =
    props.body ||
    "This section will be populated based on your context. Add a note to this shape to guide the content.";
  const cta = props.cta;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  return `<section class="aph-generic"${idAttr}>
  <div class="aph-inner aph-generic-inner">
    <h2 class="aph-section-title">${esc(title)}</h2>
    <p class="aph-generic-body">${esc(body)}</p>
    ${cta ? `<a href="${esc(props.ctaHref || '#')}" class="aph-btn-accent">${esc(cta)}</a>` : ""}
  </div>
</section>`;
}
