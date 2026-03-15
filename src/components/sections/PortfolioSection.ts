import type { PortfolioProps, PortfolioItem } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_ITEMS: PortfolioItem[] = [
  {
    title: "Project Alpha",
    description: "A brief description of the work and the impact it had.",
    tags: ["Design", "Strategy"],
  },
  {
    title: "Project Beta",
    description: "A brief description of the work and the impact it had.",
    tags: ["Engineering", "Product"],
  },
  {
    title: "Project Gamma",
    description: "A brief description of the work and the impact it had.",
    tags: ["Research", "UX"],
  },
];

export function renderPortfolio(props: PortfolioProps, sectionId?: string): string {
  const title = props.title || "Selected work";
  const subtitle = props.subtitle || "";
  const items = props.items?.length ? props.items : DEFAULT_ITEMS;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  const cards = items
    .map(
      (item) => `<div class="aph-portfolio-card">
      <div class="aph-portfolio-thumb"></div>
      <div class="aph-portfolio-info">
        <h3 class="aph-portfolio-title">${esc(item.title || "Project")}</h3>
        ${item.description ? `<p class="aph-portfolio-desc">${esc(item.description)}</p>` : ""}
        ${
          item.tags?.length
            ? `<div class="aph-portfolio-tags">
          ${item.tags.map((t) => `<span class="aph-badge">${esc(t)}</span>`).join("\n          ")}
        </div>`
            : ""
        }
      </div>
    </div>`
    )
    .join("\n    ");

  return `<section class="aph-portfolio"${idAttr}>
  <div class="aph-inner">
    <div class="aph-section-header">
      <h2 class="aph-section-title">${esc(title)}</h2>
      ${subtitle ? `<p class="aph-section-subtitle">${esc(subtitle)}</p>` : ""}
    </div>
    <div class="aph-portfolio-grid">
    ${cards}
    </div>
  </div>
</section>`;
}
