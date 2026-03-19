import type { FeatureGridProps, FeatureItem } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_FEATURES: FeatureItem[] = [
  { icon: "◆", heading: "Lightning fast", body: "Built for speed from the ground up. Every interaction feels instant." },
  { icon: "◈", heading: "Beautifully simple", body: "A clean, focused interface that gets out of your way and lets you work." },
  { icon: "◉", heading: "Secure by default", body: "Enterprise-grade security without the enterprise complexity." },
];

function renderIcon(icon: string, treatment: string): string {
  switch (treatment) {
    case "accent-text":
      return `<div class="aph-icon-accent-text">${esc(icon)}</div>`;
    case "outlined":
      return `<div class="aph-icon-outlined">${esc(icon)}</div>`;
    case "none":
      return "";
    case "accent-bg-circle":
    default:
      return `<div class="aph-icon-accent-bg">${esc(icon)}</div>`;
  }
}

function cardClasses(cardStyle: string): string {
  switch (cardStyle) {
    case "bordered": return "aph-card-bordered";
    case "glass": return "aph-card-glass";
    case "flat": return "aph-card-flat";
    case "accent-top": return "aph-card-accent-top";
    case "elevated":
    default: return "aph-card-elevated";
  }
}

export function renderFeatureGrid(props: FeatureGridProps, sectionId?: string): string {
  const title = props.title || "Why it works";
  const subtitle = props.subtitle || "Everything you need, nothing you don't.";
  const features = props.features?.length ? props.features : DEFAULT_FEATURES;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  const layout = props.layout || props.variant === "bundui-bento" ? "bento" : (props.layout || "card-grid");
  const cardStyle = props.cardStyle || "elevated";
  const iconTreatment = props.iconTreatment || "accent-bg-circle";
  const columns = props.columns || 3;

  const header = `<div class="aph-section-header aph-reveal">
      <h2 class="aph-section-title">${esc(title)}</h2>
      <p class="aph-section-subtitle">${esc(subtitle)}</p>
    </div>`;

  switch (layout) {
    case "bento": {
      const cards = features.map((f, i) => {
        const visual = f.imageSrc
          ? `<div class="aph-feature-image"><img src="${esc(f.imageSrc)}" alt="${esc(f.heading || "")}" /></div>`
          : renderIcon(f.icon || "◆", iconTreatment);
        const spanClass = i === 0 ? ' style="grid-column:span 2;grid-row:span 2;"' : "";
        return `<div class="${cardClasses(cardStyle)} aph-feature-card aph-hover-lift"${spanClass}>
      ${f.imageSrc ? visual : `<div style="margin-bottom:var(--spacing-xl);">${visual}</div>`}
      <h3 class="aph-feature-heading">${esc(f.heading || "Feature")}</h3>
      <p class="aph-feature-body">${esc(f.body || "A short, focused description.")}</p>
    </div>`;
      }).join("\n    ");

      return `<section class="aph-feature-grid aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-feature-cards aph-stagger" style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-xl);">
    ${cards}
    </div>
  </div>
</section>`;
    }

    case "icon-list": {
      const items = features.map((f) => {
        const visual = renderIcon(f.icon || "◆", iconTreatment);
        return `<div class="aph-feature-list-item aph-hover-lift" style="display:flex;gap:var(--spacing-xl);align-items:flex-start;padding:var(--spacing-2xl) 0;border-bottom:1px solid var(--border);">
      ${visual ? `<div style="flex-shrink:0;">${visual}</div>` : ""}
      <div>
        <h3 class="aph-feature-heading">${esc(f.heading || "Feature")}</h3>
        <p class="aph-feature-body">${esc(f.body || "A short, focused description.")}</p>
      </div>
    </div>`;
      }).join("\n    ");

      return `<section class="aph-feature-grid aph-reveal"${idAttr}>
  <div class="aph-inner" style="max-width:var(--max-w-md);margin:0 auto;">
    ${header}
    <div class="aph-stagger">
    ${items}
    </div>
  </div>
</section>`;
    }

    case "alternating-rows": {
      const rows = features.map((f, i) => {
        const visual = renderIcon(f.icon || "◆", iconTreatment);
        const isReversed = i % 2 === 1;
        return `<div class="aph-hover-lift" style="display:flex;gap:var(--spacing-3xl);align-items:center;padding:var(--spacing-3xl) 0;border-bottom:1px solid var(--border);${isReversed ? "flex-direction:row-reverse;" : ""}">
      ${visual ? `<div style="flex-shrink:0;">${visual}</div>` : ""}
      <div>
        <h3 class="aph-feature-heading">${esc(f.heading || "Feature")}</h3>
        <p class="aph-feature-body">${esc(f.body || "A short, focused description.")}</p>
      </div>
    </div>`;
      }).join("\n    ");

      return `<section class="aph-feature-grid aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-stagger">
    ${rows}
    </div>
  </div>
</section>`;
    }

    case "numbered": {
      const items = features.map((f, i) => {
        const num = String(i + 1).padStart(2, "0");
        return `<div class="aph-hover-lift" style="display:flex;gap:var(--spacing-2xl);align-items:flex-start;padding:var(--spacing-2xl) 0;border-bottom:1px solid var(--border);">
      <span style="font-family:var(--font-heading);font-size:clamp(36px,5vw,64px);font-weight:800;letter-spacing:-0.04em;color:var(--accent);opacity:0.3;line-height:1;flex-shrink:0;">${num}</span>
      <div>
        <h3 class="aph-feature-heading">${esc(f.heading || "Feature")}</h3>
        <p class="aph-feature-body">${esc(f.body || "A short, focused description.")}</p>
      </div>
    </div>`;
      }).join("\n    ");

      return `<section class="aph-feature-grid aph-reveal"${idAttr}>
  <div class="aph-inner" style="max-width:var(--max-w-md);margin:0 auto;">
    ${header}
    <div class="aph-stagger">
    ${items}
    </div>
  </div>
</section>`;
    }

    case "card-grid":
    default: {
      const cards = features.map((f) => {
        const visual = f.imageSrc
          ? `<div class="aph-feature-image"><img src="${esc(f.imageSrc)}" alt="${esc(f.heading || "")}" /></div>`
          : renderIcon(f.icon || "◆", iconTreatment);
        const ctaHtml = f.cta
          ? `\n      <a href="${esc(f.ctaHref || "#")}" class="aph-btn-accent aph-btn-sm" style="margin-top:auto;padding-top:var(--spacing-md);">${esc(f.cta)}</a>`
          : "";
        return `<div class="${cardClasses(cardStyle)} aph-feature-card aph-hover-lift" style="padding:var(--spacing-2xl);display:flex;flex-direction:column;">
      ${f.imageSrc ? visual : `<div style="margin-bottom:var(--spacing-xl);">${visual}</div>`}
      <h3 class="aph-feature-heading">${esc(f.heading || "Feature")}</h3>
      <p class="aph-feature-body">${esc(f.body || "A short, focused description.")}</p>${ctaHtml}
    </div>`;
      }).join("\n    ");

      return `<section class="aph-feature-grid aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-feature-cards aph-stagger" style="display:grid;grid-template-columns:repeat(${columns},1fr);gap:var(--spacing-xl);">
    ${cards}
    </div>
  </div>
</section>`;
    }
  }
}
