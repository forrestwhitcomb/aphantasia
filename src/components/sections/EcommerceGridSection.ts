import type { EcommerceGridProps, ProductItem } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_PRODUCTS: ProductItem[] = [
  { name: "Product One", price: "$49", description: "Short product description." },
  { name: "Product Two", price: "$79", description: "Short product description." },
  { name: "Product Three", price: "$99", description: "Short product description.", badge: "Popular" },
  { name: "Product Four", price: "$29", description: "Short product description." },
];

export function renderEcommerceGrid(props: EcommerceGridProps, sectionId?: string): string {
  const title = props.title || "Shop";
  const subtitle = props.subtitle || "";
  const products = props.products?.length ? props.products : DEFAULT_PRODUCTS;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  const cards = products
    .map(
      (p) => `<div class="aph-product-card">
      <div class="aph-product-thumb">
        ${p.badge ? `<span class="aph-badge aph-product-badge">${esc(p.badge)}</span>` : ""}
      </div>
      <div class="aph-product-info">
        <h3 class="aph-product-name">${esc(p.name || "Product")}</h3>
        ${p.description ? `<p class="aph-product-desc">${esc(p.description)}</p>` : ""}
        <div class="aph-product-footer">
          <span class="aph-product-price">${esc(p.price || "–")}</span>
          <a href="#" class="aph-btn-accent aph-btn-sm">Add to cart</a>
        </div>
      </div>
    </div>`
    )
    .join("\n    ");

  return `<section class="aph-ecommerce"${idAttr}>
  <div class="aph-inner">
    <div class="aph-section-header">
      <h2 class="aph-section-title">${esc(title)}</h2>
      ${subtitle ? `<p class="aph-section-subtitle">${esc(subtitle)}</p>` : ""}
    </div>
    <div class="aph-product-grid">
    ${cards}
    </div>
  </div>
</section>`;
}
