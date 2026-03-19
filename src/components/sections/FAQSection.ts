import type { FAQProps, FAQItem } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_ITEMS: FAQItem[] = [
  { question: "How does it work?", answer: "Simply draw shapes on the canvas and we automatically turn them into a real, polished website. No coding required." },
  { question: "Is there a free plan?", answer: "Yes! You can get started for free with our Starter plan. No credit card required." },
  { question: "Can I export my site?", answer: "Absolutely. Export as a clean HTML zip file or deploy directly to Vercel with one click." },
  { question: "How is this different from other builders?", answer: "We start from your sketch — not a template. The result looks bespoke because it's built from your spatial thinking, not a one-size-fits-all layout." },
];

export function renderFAQ(props: FAQProps, sectionId?: string): string {
  const title = props.title || "Frequently asked questions";
  const subtitle = props.subtitle || "";
  const items = props.items?.length ? props.items : DEFAULT_ITEMS;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";
  const layout = props.layout || "accordion";

  const header = `<div class="aph-section-header aph-reveal" style="margin-bottom:var(--spacing-3xl);">
      <h2 class="aph-section-title">${esc(title)}</h2>
      ${subtitle ? `<p class="aph-section-subtitle">${esc(subtitle)}</p>` : ""}
    </div>`;

  if (layout === "accordion") {
    const rows = items.map((item) => `<details style="border-bottom:1px solid var(--border);">
      <summary style="padding:var(--spacing-xl) 0;font-size:var(--text-lg);font-weight:600;color:var(--foreground);cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;">
        ${esc(item.question || "Question?")}
        <span style="font-size:var(--text-2xl);color:var(--muted-foreground);transition:transform 0.2s;">+</span>
      </summary>
      <div class="aph-faq-answer"><div style="padding:0 0 var(--spacing-xl);font-size:var(--text-md);color:var(--muted-foreground);line-height:1.7;">${esc(item.answer || "")}</div></div>
    </details>`).join("\n    ");

    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner" style="max-width:var(--max-w-md);margin:0 auto;">
    ${header}
    <div class="aph-stagger" style="border-top:1px solid var(--border);">
    ${rows}
    </div>
  </div>
</section>`;
  }

  if (layout === "two-column") {
    const half = Math.ceil(items.length / 2);
    function renderCol(subset: FAQItem[]): string {
      return subset.map((item) => `<div style="margin-bottom:var(--spacing-2xl);">
        <h3 style="font-size:var(--text-lg);font-weight:600;color:var(--foreground);margin-bottom:var(--spacing-sm);">${esc(item.question || "Question?")}</h3>
        <p style="font-size:var(--text-md);color:var(--muted-foreground);line-height:1.7;">${esc(item.answer || "")}</p>
      </div>`).join("\n      ");
    }
    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-stagger" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-3xl);">
      <div>${renderCol(items.slice(0, half))}</div>
      <div>${renderCol(items.slice(half))}</div>
    </div>
  </div>
</section>`;
  }

  if (layout === "cards") {
    const cards = items.map((item) => `<div class="aph-card-elevated aph-hover-lift" style="padding:var(--spacing-2xl);">
      <h3 style="font-size:var(--text-lg);font-weight:600;color:var(--foreground);margin-bottom:var(--spacing-sm);">${esc(item.question || "Question?")}</h3>
      <p style="font-size:var(--text-base);color:var(--muted-foreground);line-height:1.7;">${esc(item.answer || "")}</p>
    </div>`).join("\n    ");

    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-stagger" style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--spacing-xl);">
    ${cards}
    </div>
  </div>
</section>`;
  }

  // inline
  const rows = items.map((item) => `<div style="margin-bottom:var(--spacing-2xl);">
      <h3 style="font-size:var(--text-lg);font-weight:700;color:var(--foreground);margin-bottom:var(--spacing-sm);">${esc(item.question || "Question?")}</h3>
      <p style="font-size:var(--text-md);color:var(--muted-foreground);line-height:1.7;">${esc(item.answer || "")}</p>
    </div>`).join("\n    ");

  return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner" style="max-width:var(--max-w-md);margin:0 auto;">
    ${header}
    <div class="aph-stagger">
    ${rows}
    </div>
  </div>
</section>`;
}
