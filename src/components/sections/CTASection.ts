import type { CTAProps } from "@/types/render";
import { esc } from "./utils";

export function renderCTA(props: CTAProps, sectionId?: string): string {
  const heading = props.heading || "Ready to get started?";
  const sub = props.subheading || "Join thousands of people who are already doing it.";
  const cta = props.cta || "Get started for free";
  const ctaSec = props.ctaSecondary;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  const layout = props.layout || "centered";
  const surface = props.surface || "inverted";
  const intensity = props.intensity || "bold";

  const isSubtle = intensity === "subtle";
  const paddingScale = isSubtle ? "1" : "1.3";
  const headingSize = isSubtle ? "clamp(24px, 4vw, 40px)" : "clamp(32px, 5vw, 56px)";

  // Surface class mapping
  const surfaceClass = surface === "accent-wash" ? " aph-surface-accent-wash"
    : surface === "gradient-mesh" ? " aph-surface-gradient-mesh"
    : surface === "glass" ? " aph-surface-glass"
    : " aph-cta-inverted";

  const isInverted = surface === "inverted";

  const ctaPrimary = `<a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent aph-btn-lg">${esc(cta)}</a>`;
  const ctaSecondaryHtml = ctaSec ? `<a href="${esc(props.ctaSecondaryHref || "#")}" class="aph-btn-ghost aph-btn-lg">${esc(ctaSec)}</a>` : "";

  switch (layout) {
    case "split":
      return `<section class="aph-cta${surfaceClass} aph-reveal"${idAttr} style="padding:calc(var(--section-py) * ${paddingScale}) 0;">
  <div class="aph-inner" style="display:flex;align-items:center;justify-content:space-between;gap:var(--spacing-3xl);flex-wrap:wrap;">
    <div style="flex:1;min-width:280px;">
      <h2 style="font-family:var(--font-heading);font-size:${headingSize};font-weight:800;letter-spacing:-0.04em;line-height:1.05;${isInverted ? "color:var(--background);" : ""}">${esc(heading)}</h2>
      <p style="margin-top:var(--spacing-md);font-size:var(--text-xl);${isInverted ? "color:color-mix(in srgb,var(--background) 65%,transparent);" : "color:var(--muted-foreground);"}line-height:1.7;">${esc(sub)}</p>
    </div>
    <div style="display:flex;gap:var(--spacing-lg);flex-wrap:wrap;">
      ${ctaPrimary}
      ${ctaSecondaryHtml}
    </div>
  </div>
</section>`;

    case "inline-bar":
      return `<section class="aph-cta${surfaceClass} aph-reveal"${idAttr} style="padding:calc(var(--section-py) * 0.6) 0;">
  <div class="aph-inner" style="display:flex;align-items:center;justify-content:space-between;gap:var(--spacing-xl);flex-wrap:wrap;">
    <div>
      <h2 style="font-family:var(--font-heading);font-size:clamp(18px,3vw,28px);font-weight:700;letter-spacing:-0.02em;${isInverted ? "color:var(--background);" : ""}">${esc(heading)}</h2>
    </div>
    <div style="display:flex;gap:var(--spacing-md);flex-wrap:wrap;">
      ${ctaPrimary}
    </div>
  </div>
</section>`;

    case "centered":
    default:
      return `<section class="aph-cta${surfaceClass} aph-reveal"${idAttr} style="padding:calc(var(--section-py) * ${paddingScale}) 0;${isInverted ? "" : ""}">
  <div class="aph-inner" style="text-align:center;position:relative;z-index:1;">
    <h2 style="font-family:var(--font-heading);font-size:${headingSize};font-weight:800;letter-spacing:-0.04em;line-height:1.05;${isInverted ? "color:var(--background);" : ""}margin-bottom:var(--spacing-xl);">${esc(heading)}</h2>
    <p style="font-size:var(--text-xl);${isInverted ? "color:color-mix(in srgb,var(--background) 65%,transparent);" : "color:var(--muted-foreground);"}margin-bottom:var(--spacing-3xl);max-width:480px;margin-left:auto;margin-right:auto;line-height:1.7;">${esc(sub)}</p>
    <div style="display:flex;gap:var(--spacing-lg);justify-content:center;flex-wrap:wrap;">
      ${ctaPrimary}
      ${ctaSecondaryHtml}
    </div>
  </div>
</section>`;
  }
}
