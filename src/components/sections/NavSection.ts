import type { NavProps } from "@/types/render";
import { esc } from "./utils";

export function renderNav(props: NavProps, sectionId?: string): string {
  const logo = props.logo || "Brand";
  const links = props.links?.length
    ? props.links
    : ["Product", "Pricing", "Docs"];
  const cta = props.cta || "Get started";
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  const linkItems = links
    .map((l) => `<li><a href="#" class="aph-nav-link">${esc(l)}</a></li>`)
    .join("\n      ");

  return `<nav class="aph-nav"${idAttr}>
  <div class="aph-inner aph-nav-inner">
    <a href="#" class="aph-logo">${esc(logo)}</a>
    <ul class="aph-nav-links">
      ${linkItems}
    </ul>
    <a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent aph-btn-sm">${esc(cta)}</a>
  </div>
</nav>`;
}
