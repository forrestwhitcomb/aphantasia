import type { EcommerceGridProps, ProductItem } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_PRODUCTS: ProductItem[] = [
  { name: "Product One", price: "$49", description: "Short product description." },
  { name: "Product Two", price: "$79", description: "Short product description." },
  { name: "Product Three", price: "$99", description: "Short product description.", badge: "Popular" },
  { name: "Product Four", price: "$29", description: "Short product description." },
];

function cardClass(style: string): string {
  switch (style) {
    case "bordered": return "aph-card-bordered";
    case "glass": return "aph-card-glass";
    case "flat": return "aph-card-flat";
    case "accent-top": return "aph-card-accent-top";
    default: return "aph-card-elevated";
  }
}

export function renderEcommerceGrid(props: EcommerceGridProps, sectionId?: string): string {
  const title = props.title || "Shop";
  const subtitle = props.subtitle || "";
  const products = props.products?.length ? props.products : DEFAULT_PRODUCTS;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";
  const layout = props.layout || "card-grid";
  const cs = props.cardStyle || "elevated";
  const priceStyle = props.priceStyle || "bold";

  const header = `<div class="aph-section-header aph-reveal">
      <h2 class="aph-section-title">${esc(title)}</h2>
      ${subtitle ? `<p class="aph-section-subtitle">${esc(subtitle)}</p>` : ""}
    </div>`;

  function renderPrice(price: string): string {
    if (priceStyle === "badge") return `<span class="aph-badge">${esc(price)}</span>`;
    if (priceStyle === "inline") return `<span style="font-size:var(--text-base);color:var(--muted-foreground);">${esc(price)}</span>`;
    return `<span style="font-size:var(--text-xl);font-weight:700;letter-spacing:-0.01em;color:var(--foreground);">${esc(price)}</span>`;
  }

  function renderProductCard(p: ProductItem, isFeatured: boolean = false): string {
    const thumb = p.imageSrc
      ? `<img src="${esc(p.imageSrc)}" alt="${esc(p.name || "Product")}" style="width:100%;aspect-ratio:${isFeatured ? "16/9" : "1/1"};object-fit:cover;display:block;" />`
      : `<div class="aph-img-placeholder-gradient" style="width:100%;aspect-ratio:${isFeatured ? "16/9" : "1/1"};"></div>`;

    return `<div class="${cardClass(cs)} aph-hover-lift" style="overflow:hidden;">
      <div style="position:relative;border-bottom:1px solid var(--border);">
        ${thumb}
        ${p.badge ? `<span class="aph-badge" style="position:absolute;top:12px;left:12px;background:var(--accent);color:var(--accent-foreground);border:none;">${esc(p.badge)}</span>` : ""}
      </div>
      <div style="padding:var(--spacing-xl);">
        <h3 style="font-size:var(--text-md);font-weight:600;color:var(--foreground);margin-bottom:var(--spacing-xs);">${esc(p.name || "Product")}</h3>
        ${p.description ? `<p style="font-size:var(--text-sm);color:var(--muted-foreground);margin-bottom:var(--spacing-lg);line-height:1.5;">${esc(p.description)}</p>` : ""}
        <div style="display:flex;align-items:center;justify-content:space-between;">
          ${renderPrice(p.price || "$0")}
          <a href="#" class="aph-btn-accent aph-btn-sm">${esc(p.cta || "Add to cart")}</a>
        </div>
      </div>
    </div>`;
  }

  if (layout === "featured-plus-grid") {
    const featured = products[0];
    const rest = products.slice(1);
    return `<section class="aph-ecommerce aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div style="margin-bottom:var(--spacing-xl);">
      ${renderProductCard(featured, true)}
    </div>
    <div class="aph-stagger" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:var(--spacing-xl);">
      ${rest.map((p) => renderProductCard(p)).join("\n      ")}
    </div>
  </div>
</section>`;
  }

  if (layout === "horizontal-scroll") {
    const cards = products.map((p) => `<div style="min-width:280px;flex-shrink:0;scroll-snap-align:start;">${renderProductCard(p)}</div>`).join("\n    ");
    return `<section class="aph-ecommerce aph-reveal"${idAttr}>
  <div class="aph-inner">${header}</div>
  <div style="display:flex;gap:var(--spacing-xl);overflow-x:auto;scroll-snap-type:x mandatory;padding:0 40px var(--spacing-lg);">
    ${cards}
  </div>
</section>`;
  }

  // card-grid
  const cards = products.map((p) => renderProductCard(p)).join("\n    ");
  return `<section class="aph-ecommerce aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-product-grid aph-stagger">
    ${cards}
    </div>
  </div>
</section>`;
}
