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
  const copy = props.copyright || `© ${year} ${logo}. All rights reserved.`;

  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  const colsHtml = columns
    .map(
      (col) =>
        `<div class="aph-footer-col">
        <h4 class="aph-footer-col-heading">${esc(col.heading)}</h4>
        <ul class="aph-footer-col-links">
          ${col.links
            .map((l) => `<li><a href="#">${esc(l)}</a></li>`)
            .join("\n          ")}
        </ul>
      </div>`
    )
    .join("\n      ");

  return `<footer class="aph-footer"${idAttr}>
  <div class="aph-inner">
    <div class="aph-footer-top">
      <div class="aph-footer-brand">
        <span class="aph-footer-logo">${esc(logo)}</span>
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
