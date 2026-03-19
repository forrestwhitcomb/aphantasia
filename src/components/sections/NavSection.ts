import type { NavProps } from "@/types/render";
import { esc } from "./utils";

export function renderNav(props: NavProps, sectionId?: string): string {
  const logo = props.logo || "Brand";
  const links = props.links?.length ? props.links : ["Product", "Pricing", "Docs"];
  const cta = props.cta || "Get started";
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  const layout = props.layout || "standard";
  const navStyle = props.navStyle || "solid";

  const styleClass = navStyle === "glass" ? " aph-nav-glass"
    : navStyle === "transparent" ? " aph-nav-transparent"
    : "";

  const linkItems = links
    .map((l) => `<li><a href="#" class="aph-nav-link">${esc(l)}</a></li>`)
    .join("\n        ");

  const ctaBtn = `<a href="${esc(props.ctaHref || "#")}" class="aph-btn-accent aph-btn-sm">${esc(cta)}</a>`;

  // Hamburger icon for minimal layout and mobile
  const hamburger = `<button class="aph-nav-hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>`;

  switch (layout) {
    case "centered-logo":
      return `<nav class="aph-nav aph-nav-centered${styleClass}"${idAttr}>
  <div class="aph-inner aph-nav-inner" style="justify-content:center;gap:40px;">
    <ul class="aph-nav-links" style="margin-right:auto;">
      ${links.slice(0, Math.ceil(links.length / 2)).map((l) => `<li><a href="#" class="aph-nav-link">${esc(l)}</a></li>`).join("\n        ")}
    </ul>
    <a href="#" class="aph-logo">${esc(logo)}</a>
    <ul class="aph-nav-links" style="margin-left:auto;">
      ${links.slice(Math.ceil(links.length / 2)).map((l) => `<li><a href="#" class="aph-nav-link">${esc(l)}</a></li>`).join("\n        ")}
    </ul>
  </div>
</nav>`;

    case "minimal":
      return `<nav class="aph-nav aph-nav-minimal${styleClass}"${idAttr}>
  <div class="aph-inner aph-nav-inner">
    <a href="#" class="aph-logo">${esc(logo)}</a>
    ${hamburger}
  </div>
</nav>`;

    case "mega-menu":
      // Mega-menu renders like standard but with a wider container hint
      return `<nav class="aph-nav${styleClass}"${idAttr}>
  <div class="aph-inner aph-nav-inner">
    <a href="#" class="aph-logo">${esc(logo)}</a>
    <ul class="aph-nav-links">
      ${linkItems}
    </ul>
    ${ctaBtn}
  </div>
</nav>`;

    case "standard":
    default:
      return `<nav class="aph-nav${styleClass}"${idAttr}>
  <div class="aph-inner aph-nav-inner">
    <a href="#" class="aph-logo">${esc(logo)}</a>
    <ul class="aph-nav-links">
      ${linkItems}
    </ul>
    ${ctaBtn}
  </div>
</nav>`;
  }
}
