import type { TestimonialsProps, TestimonialItem } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_ITEMS: TestimonialItem[] = [
  { quote: "This completely changed how we work. The speed and simplicity are unmatched.", author: "Sarah Chen", role: "Head of Product", company: "Acme Inc" },
  { quote: "We shipped our redesign in half the time. The team couldn't believe how fast it was.", author: "Marcus Rivera", role: "CTO", company: "StartupCo" },
  { quote: "Finally a tool that gets out of your way and lets you focus on what matters.", author: "Emily Watson", role: "Design Lead", company: "DesignLab" },
];

function cardClass(style: string): string {
  switch (style) {
    case "bordered": return "aph-card-bordered";
    case "glass": return "aph-card-glass";
    case "flat": return "aph-card-flat";
    case "accent-top": return "aph-card-accent-top";
    case "quote-mark": return "aph-card-elevated";
    default: return "aph-card-elevated";
  }
}

export function renderTestimonials(props: TestimonialsProps, sectionId?: string): string {
  const title = props.title || "What people say";
  const subtitle = props.subtitle || "";
  const items = props.items?.length ? props.items : DEFAULT_ITEMS;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";
  const layout = props.layout || "cards-grid";
  const cs = props.cardStyle || "elevated";
  const isQuoteMark = cs === "quote-mark";

  const header = `<div class="aph-section-header aph-reveal">
      <h2 class="aph-section-title">${esc(title)}</h2>
      ${subtitle ? `<p class="aph-section-subtitle">${esc(subtitle)}</p>` : ""}
    </div>`;

  function renderCard(item: TestimonialItem): string {
    const quoteMark = isQuoteMark ? `<span style="font-size:48px;line-height:1;color:var(--accent);opacity:0.3;font-family:Georgia,serif;">\u201C</span>` : "";
    return `<div class="${cardClass(cs)} aph-hover-lift" style="padding:var(--spacing-2xl);display:flex;flex-direction:column;">
      ${quoteMark}
      <p style="font-size:var(--text-lg);line-height:1.7;color:var(--foreground);flex:1;${isQuoteMark ? "margin-top:var(--spacing-sm);" : ""}font-style:italic;">\u201C${esc(item.quote || "Great product!")}\u201D</p>
      <div style="margin-top:var(--spacing-xl);display:flex;align-items:center;gap:var(--spacing-md);">
        <div style="width:40px;height:40px;border-radius:50%;background:color-mix(in srgb,var(--accent) 15%,var(--surface));display:flex;align-items:center;justify-content:center;font-size:var(--text-base);font-weight:600;color:var(--accent);">${esc((item.author || "A")[0])}</div>
        <div>
          <div style="font-size:var(--text-base);font-weight:600;color:var(--foreground);">${esc(item.author || "Customer")}</div>
          <div style="font-size:var(--text-sm);color:var(--muted-foreground);">${esc(item.role || "")}${item.company ? `, ${esc(item.company)}` : ""}</div>
        </div>
      </div>
    </div>`;
  }

  if (layout === "single-featured") {
    const item = items[0];
    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner" style="max-width:var(--max-w-md);margin:0 auto;text-align:center;">
    <span style="font-size:64px;line-height:1;color:var(--accent);opacity:0.25;font-family:Georgia,serif;">\u201C</span>
    <p style="font-size:clamp(20px,3vw,28px);line-height:1.6;color:var(--foreground);font-style:italic;margin:var(--spacing-lg) 0 var(--spacing-2xl);">${esc(item.quote || "Great product!")}</p>
    <div style="font-size:var(--text-lg);font-weight:600;color:var(--foreground);">${esc(item.author || "Customer")}</div>
    <div style="font-size:var(--text-base);color:var(--muted-foreground);">${esc(item.role || "")}${item.company ? `, ${esc(item.company)}` : ""}</div>
  </div>
</section>`;
  }

  if (layout === "carousel") {
    const carouselCards = items.map((item) => `<div style="min-width:340px;max-width:400px;scroll-snap-align:start;flex-shrink:0;">
      ${renderCard(item)}
    </div>`).join("\n    ");

    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div style="display:flex;gap:var(--spacing-xl);overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:var(--spacing-lg);-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:var(--border) transparent;">
    ${carouselCards}
    </div>
  </div>
</section>`;
  }

  if (layout === "avatar-wall") {
    const avatars = items.map((item) => `<div class="aph-hover-lift" style="text-align:center;padding:var(--spacing-lg);">
      <div style="width:64px;height:64px;border-radius:50%;background:color-mix(in srgb,var(--accent) 15%,var(--surface));margin:0 auto var(--spacing-md);display:flex;align-items:center;justify-content:center;font-size:var(--text-2xl);font-weight:700;color:var(--accent);">${esc((item.author || "A")[0])}</div>
      <div style="font-size:var(--text-sm);font-weight:600;color:var(--foreground);">${esc(item.author || "Customer")}</div>
      <div style="font-size:var(--text-xs);color:var(--muted-foreground);">${esc(item.role || "")}</div>
    </div>`).join("\n    ");

    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-stagger" style="display:flex;flex-wrap:wrap;justify-content:center;gap:var(--spacing-lg);">
    ${avatars}
    </div>
  </div>
</section>`;
  }

  const cards = items.map((item) => renderCard(item)).join("\n    ");
  const cols = items.length <= 2 ? items.length : 3;

  return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-stagger" style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:var(--spacing-xl);">
    ${cards}
    </div>
  </div>
</section>`;
}
