import type { PortfolioProps, PortfolioItem } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_ITEMS: PortfolioItem[] = [
  { title: "Project Alpha", description: "A brief description of the work and the impact it had.", tags: ["Design", "Strategy"] },
  { title: "Project Beta", description: "A brief description of the work and the impact it had.", tags: ["Engineering", "Product"] },
  { title: "Project Gamma", description: "A brief description of the work and the impact it had.", tags: ["Research", "UX"] },
];

function renderThumb(item: PortfolioItem): string {
  if (item.imageSrc) {
    return `<img src="${esc(item.imageSrc)}" alt="${esc(item.title || "Project")}" style="width:100%;height:100%;object-fit:cover;display:block;" />`;
  }
  return "";
}

export function renderPortfolio(props: PortfolioProps, sectionId?: string): string {
  const title = props.title || "Selected work";
  const subtitle = props.subtitle || "";
  const items = props.items?.length ? props.items : DEFAULT_ITEMS;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";
  const layout = props.layout || "grid-uniform";
  const hoverEffect = props.hoverEffect || "overlay-title";

  const header = `<div class="aph-section-header aph-reveal">
      <h2 class="aph-section-title">${esc(title)}</h2>
      ${subtitle ? `<p class="aph-section-subtitle">${esc(subtitle)}</p>` : ""}
    </div>`;

  const hoverClass = hoverEffect === "none" ? "" : `aph-portfolio-hover-${hoverEffect}`;

  if (layout === "list-detailed") {
    const rows = items.map((item) => `<div class="${hoverClass}" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-3xl);align-items:center;padding:var(--spacing-3xl) 0;border-bottom:1px solid var(--border);">
      <div class="aph-portfolio-thumb" style="aspect-ratio:16/9;border-radius:var(--radius-lg);overflow:hidden;">
        ${renderThumb(item)}
      </div>
      <div>
        <h3 style="font-family:var(--font-heading);font-size:var(--text-3xl);font-weight:700;margin-bottom:var(--spacing-md);color:var(--foreground);">${esc(item.title || "Project")}</h3>
        ${item.description ? `<p style="font-size:var(--text-md);color:var(--muted-foreground);line-height:1.7;margin-bottom:var(--spacing-lg);">${esc(item.description)}</p>` : ""}
        ${item.tags?.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;">${item.tags.map((t) => `<span class="aph-badge">${esc(t)}</span>`).join("")}</div>` : ""}
      </div>
    </div>`).join("\n    ");

    return `<section class="aph-portfolio aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-stagger">${rows}</div>
  </div>
</section>`;
  }

  if (layout === "carousel") {
    const slides = items.map((item) => `<div style="min-width:320px;flex-shrink:0;scroll-snap-align:start;">
      <div class="aph-portfolio-card ${hoverClass}" style="border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;background:var(--surface);">
        <div class="aph-portfolio-thumb" style="aspect-ratio:16/9;">${renderThumb(item)}</div>
        <div style="padding:var(--spacing-xl);">
          <h3 style="font-size:var(--text-lg);font-weight:600;color:var(--foreground);margin-bottom:var(--spacing-sm);">${esc(item.title || "Project")}</h3>
          ${item.tags?.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;">${item.tags.map((t) => `<span class="aph-badge">${esc(t)}</span>`).join("")}</div>` : ""}
        </div>
      </div>
    </div>`).join("\n    ");

    return `<section class="aph-portfolio aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
  </div>
  <div style="display:flex;gap:var(--spacing-xl);overflow-x:auto;scroll-snap-type:x mandatory;padding:0 40px var(--spacing-lg);">
    ${slides}
  </div>
</section>`;
  }

  // grid-uniform / grid-masonry
  const isMasonry = layout === "grid-masonry";
  const cards = items.map((item, i) => {
    const aspect = isMasonry ? (i % 3 === 0 ? "4/5" : i % 3 === 1 ? "3/4" : "1/1") : "16/9";
    return `<div class="aph-portfolio-card ${hoverClass}" style="border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;background:var(--surface);">
      <div class="aph-portfolio-thumb" style="aspect-ratio:${aspect};">${renderThumb(item)}</div>
      <div class="aph-portfolio-info" style="padding:var(--spacing-xl);">
        <h3 class="aph-portfolio-title">${esc(item.title || "Project")}</h3>
        ${item.description ? `<p class="aph-portfolio-desc">${esc(item.description)}</p>` : ""}
        ${item.tags?.length ? `<div class="aph-portfolio-tags">${item.tags.map((t) => `<span class="aph-badge">${esc(t)}</span>`).join("")}</div>` : ""}
      </div>
    </div>`;
  }).join("\n    ");

  return `<section class="aph-portfolio aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-portfolio-grid aph-stagger">
    ${cards}
    </div>
  </div>
</section>`;
}
