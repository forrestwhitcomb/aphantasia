import type { FooterProps } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_COLUMNS = [
  { heading: "Product", links: ["Features", "Pricing", "Changelog"] },
  { heading: "Company", links: ["About", "Blog", "Careers"] },
  { heading: "Legal", links: ["Privacy", "Terms"] },
];

export function renderFooter(props: FooterProps, sectionId?: string): string {
  const logo = props.logo || "Brand";
  const tagline = props.tagline || "";
  const columns = props.columns?.length ? props.columns : DEFAULT_COLUMNS;
  const year = new Date().getFullYear();
  const copy = props.copyright || `\u00A9 ${year} ${logo}. All rights reserved.`;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  const layout = props.layout || "columns";
  const footerStyle = props.footerStyle || "bordered-top";

  const styleClass = footerStyle === "contrasting" ? " aph-footer-contrasting"
    : footerStyle === "subtle" ? " aph-footer-subtle"
    : "";

  const colsHtml = columns
    .map((col) =>
      `<div class="aph-footer-col">
        <h4 class="aph-footer-col-heading">${esc(col.heading)}</h4>
        <ul class="aph-footer-col-links">
          ${col.links.map((l) => `<li><a href="#">${esc(l)}</a></li>`).join("\n          ")}
        </ul>
      </div>`)
    .join("\n      ");

  switch (layout) {
    case "simple": {
      const linkList = columns.flatMap((c) => c.links).slice(0, 6);
      return `<footer class="aph-footer${styleClass}"${idAttr}>
  <div class="aph-inner">
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--spacing-xl);padding:var(--spacing-xl) 0;">
      <a href="#" class="aph-footer-logo">${esc(logo)}</a>
      <nav style="display:flex;gap:var(--spacing-xl);flex-wrap:wrap;">
        ${linkList.map((l) => `<a href="#" style="font-size:var(--text-base);color:var(--muted-foreground);transition:color 0.2s;">${esc(l)}</a>`).join("\n        ")}
      </nav>
      <span class="aph-footer-copy">${esc(copy)}</span>
    </div>
  </div>
</footer>`;
    }

    case "centered":
      return `<footer class="aph-footer${styleClass}"${idAttr}>
  <div class="aph-inner" style="text-align:center;">
    <a href="#" class="aph-footer-logo" style="display:block;margin-bottom:var(--spacing-lg);">${esc(logo)}</a>
    ${tagline ? `<p class="aph-footer-tagline" style="margin-bottom:var(--spacing-xl);">${esc(tagline)}</p>` : ""}
    <nav style="display:flex;justify-content:center;gap:var(--spacing-xl);flex-wrap:wrap;margin-bottom:var(--spacing-2xl);">
      ${columns.flatMap((c) => c.links).map((l) => `<a href="#" style="font-size:var(--text-base);color:var(--muted-foreground);transition:color 0.2s;">${esc(l)}</a>`).join("\n      ")}
    </nav>
    <div class="aph-footer-bottom" style="border-top:1px solid var(--border);padding-top:var(--spacing-xl);">
      <span class="aph-footer-copy">${esc(copy)}</span>
    </div>
  </div>
</footer>`;

    case "mega":
      return `<footer class="aph-footer${styleClass}"${idAttr}>
  <div class="aph-inner">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:var(--spacing-3xl);margin-bottom:var(--spacing-3xl);" class="aph-footer-mega-grid">
      <div>
        <a href="#" class="aph-footer-logo" style="display:block;margin-bottom:var(--spacing-md);">${esc(logo)}</a>
        ${tagline ? `<p class="aph-footer-tagline" style="margin-bottom:var(--spacing-xl);">${esc(tagline)}</p>` : ""}
        <div style="display:flex;gap:var(--spacing-sm);margin-top:var(--spacing-lg);">
          <div class="aph-input" style="flex:1;max-width:240px;" data-placeholder="Your email"></div>
          <button class="aph-btn-accent aph-btn-sm">Subscribe</button>
        </div>
      </div>
      ${colsHtml}
    </div>
    <div class="aph-footer-bottom" style="border-top:1px solid var(--border);padding-top:var(--spacing-xl);">
      <span class="aph-footer-copy">${esc(copy)}</span>
    </div>
  </div>
</footer>`;

    case "columns":
    default:
      return `<footer class="aph-footer${styleClass}"${idAttr}>
  <div class="aph-inner">
    <div class="aph-footer-top">
      <div class="aph-footer-brand">
        <a href="#" class="aph-footer-logo">${esc(logo)}</a>
        ${tagline ? `<p class="aph-footer-tagline">${esc(tagline)}</p>` : ""}
      </div>
      <div class="aph-footer-cols">
        ${colsHtml}
      </div>
    </div>
    <div class="aph-footer-bottom">
      <span class="aph-footer-copy">${esc(copy)}</span>
    </div>
  </div>
</footer>`;
  }
}
