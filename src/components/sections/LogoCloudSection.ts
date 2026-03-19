import type { LogoCloudProps, LogoItem } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_LOGOS: LogoItem[] = [
  { name: "Acme" }, { name: "Globex" }, { name: "Initech" },
  { name: "Hooli" }, { name: "Pied Piper" }, { name: "Stark" },
];

export function renderLogoCloud(props: LogoCloudProps, sectionId?: string): string {
  const title = props.title || "Trusted by industry leaders";
  const logos = props.logos?.length ? props.logos : DEFAULT_LOGOS;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";
  const layout = props.layout || "single-row";
  const logoStyle = props.logoStyle || "monochrome";

  const filterCSS = logoStyle === "grayscale" ? "filter:grayscale(100%);opacity:0.6;" : logoStyle === "monochrome" ? "opacity:0.5;" : "";

  function renderLogo(logo: LogoItem): string {
    if (logo.imageSrc) {
      return `<div style="display:flex;align-items:center;justify-content:center;padding:var(--spacing-lg) var(--spacing-2xl);${filterCSS}">
        <img src="${esc(logo.imageSrc)}" alt="${esc(logo.name || "Logo")}" style="height:32px;max-width:120px;object-fit:contain;" />
      </div>`;
    }
    return `<div style="display:flex;align-items:center;justify-content:center;padding:var(--spacing-lg) var(--spacing-2xl);${filterCSS}">
      <span style="font-family:var(--font-heading);font-size:var(--text-xl);font-weight:700;letter-spacing:-0.02em;color:var(--foreground);white-space:nowrap;">${esc(logo.name || "Logo")}</span>
    </div>`;
  }

  const titleHtml = title ? `<p style="text-align:center;font-size:var(--text-sm);text-transform:uppercase;letter-spacing:0.08em;color:var(--muted-foreground);margin-bottom:var(--spacing-2xl);">${esc(title)}</p>` : "";

  if (layout === "marquee-scroll") {
    const items = logos.map(renderLogo).join("");
    return `<section style="padding:calc(var(--section-py) * 0.6) 0;overflow:hidden;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${titleHtml}
  </div>
  <div style="display:flex;animation:aph-marquee 20s linear infinite;width:max-content;">
    ${items}${items}
  </div>
</section>`;
  }

  if (layout === "grid") {
    const items = logos.map(renderLogo).join("\n    ");
    return `<section style="padding:calc(var(--section-py) * 0.6) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${titleHtml}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--spacing-sm);align-items:center;">
    ${items}
    </div>
  </div>
</section>`;
  }

  if (layout === "double-row") {
    const half = Math.ceil(logos.length / 2);
    const row1 = logos.slice(0, half).map(renderLogo).join("");
    const row2 = logos.slice(half).map(renderLogo).join("");
    return `<section style="padding:calc(var(--section-py) * 0.6) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${titleHtml}
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:var(--spacing-sm);">${row1}</div>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:var(--spacing-sm);margin-top:var(--spacing-sm);">${row2}</div>
  </div>
</section>`;
  }

  // single-row default
  const items = logos.map(renderLogo).join("");
  return `<section style="padding:calc(var(--section-py) * 0.6) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${titleHtml}
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:var(--spacing-sm);align-items:center;">
    ${items}
    </div>
  </div>
</section>`;
}
