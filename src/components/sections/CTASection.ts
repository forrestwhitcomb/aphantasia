import type { CTAProps } from "@/types/render";
import { esc } from "./utils";

export function renderCTA(props: CTAProps, sectionId?: string): string {
  const heading = props.heading || "Ready to get started?";
  const sub =
    props.subheading ||
    "Join thousands of people who are already doing it.";
  const cta = props.cta || "Get started for free";
  const ctaSec = props.ctaSecondary;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  return `<section class="aph-cta"${idAttr}>
  <div class="aph-inner aph-cta-inner">
    <h2 class="aph-cta-heading">${esc(heading)}</h2>
    <p class="aph-cta-sub">${esc(sub)}</p>
    <div class="aph-cta-actions">
      <a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent aph-btn-lg">${esc(cta)}</a>
      ${ctaSec ? `<a href="${esc(props.ctaSecondaryHref || "#")}" class="aph-btn-ghost aph-btn-lg">${esc(ctaSec)}</a>` : ""}
    </div>
  </div>
</section>`;
}
