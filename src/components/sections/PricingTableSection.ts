import type { PricingTableProps, PricingTier } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_TIERS: PricingTier[] = [
  { name: "Starter", price: "$0", annualPrice: "$0", period: "/mo", description: "For individuals getting started.", features: ["1 project", "Basic analytics", "Community support"], cta: "Get started" },
  { name: "Pro", price: "$29", annualPrice: "$23", period: "/mo", description: "For growing teams.", features: ["Unlimited projects", "Advanced analytics", "Priority support", "Custom domains"], cta: "Start free trial", highlighted: true, badge: "Popular" },
  { name: "Enterprise", price: "Custom", annualPrice: "Custom", period: "", description: "For large organizations.", features: ["Everything in Pro", "SSO & SAML", "Dedicated support", "SLA guarantee", "Custom integrations"], cta: "Contact sales" },
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

export function renderPricingTable(props: PricingTableProps, sectionId?: string): string {
  const title = props.title || "Simple, transparent pricing";
  const subtitle = props.subtitle || "Choose the plan that works for you.";
  const tiers = props.tiers?.length ? props.tiers : DEFAULT_TIERS;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";
  const layout = props.layout || "cards-highlighted";
  const cs = props.cardStyle || "elevated";
  const hs = props.highlightStyle || "scale-up";

  const header = `<div class="aph-section-header aph-reveal">
      <h2 class="aph-section-title">${esc(title)}</h2>
      <p class="aph-section-subtitle">${esc(subtitle)}</p>
    </div>`;

  function highlightCSS(tier: PricingTier): string {
    if (!tier.highlighted) return "";
    switch (hs) {
      case "accent-border": return "border:2px solid var(--accent);";
      case "accent-bg": return "background:var(--accent);color:var(--accent-foreground);";
      case "badge": return "";
      case "scale-up":
      default: return "transform:scale(1.05);z-index:1;";
    }
  }

  const cards = tiers.map((t) => {
    const features = (t.features || []).map((f) => `<li style="padding:var(--spacing-sm) 0;border-bottom:1px solid var(--border);font-size:var(--text-base);color:var(--muted-foreground);">✓ ${esc(f)}</li>`).join("\n");
    const badgeHtml = t.badge ? `<span class="aph-badge" style="position:absolute;top:16px;right:16px;">${esc(t.badge)}</span>` : "";
    return `<div class="${cardClass(cs)} aph-hover-lift" style="padding:var(--spacing-2xl);display:flex;flex-direction:column;position:relative;${highlightCSS(t)}">
      ${badgeHtml}
      <h3 style="font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:700;margin-bottom:var(--spacing-sm);">${esc(t.name || "Plan")}</h3>
      <div style="margin-bottom:var(--spacing-lg);">
        <span style="font-family:var(--font-heading);font-size:clamp(32px,4vw,48px);font-weight:800;letter-spacing:-0.03em;">${esc(t.price || "$0")}</span>
        <span style="font-size:var(--text-base);color:var(--muted-foreground);">${esc(t.period || "")}</span>
      </div>
      ${t.description ? `<p style="font-size:var(--text-base);color:var(--muted-foreground);margin-bottom:var(--spacing-xl);line-height:1.6;">${esc(t.description)}</p>` : ""}
      <ul style="list-style:none;margin-bottom:var(--spacing-2xl);flex:1;">${features}</ul>
      <a href="#" class="aph-btn-accent aph-btn-full">${esc(t.cta || "Get started")}</a>
    </div>`;
  }).join("\n    ");

  if (layout === "cards-row") {
    // Equal cards in a row — no highlight treatment, clean and uniform
    const rowCards = tiers.map((t) => {
      const features = (t.features || []).map((f) => `<li style="padding:var(--spacing-sm) 0;border-bottom:1px solid var(--border);font-size:var(--text-base);color:var(--muted-foreground);">✓ ${esc(f)}</li>`).join("\n");
      return `<div class="${cardClass(cs)} aph-hover-lift" style="padding:var(--spacing-2xl);display:flex;flex-direction:column;">
      <h3 style="font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:700;margin-bottom:var(--spacing-sm);">${esc(t.name || "Plan")}</h3>
      <div style="margin-bottom:var(--spacing-lg);">
        <span style="font-family:var(--font-heading);font-size:clamp(32px,4vw,48px);font-weight:800;letter-spacing:-0.03em;">${esc(t.price || "$0")}</span>
        <span style="font-size:var(--text-base);color:var(--muted-foreground);">${esc(t.period || "")}</span>
      </div>
      ${t.description ? `<p style="font-size:var(--text-base);color:var(--muted-foreground);margin-bottom:var(--spacing-xl);line-height:1.6;">${esc(t.description)}</p>` : ""}
      <ul style="list-style:none;margin-bottom:var(--spacing-2xl);flex:1;">${features}</ul>
      <a href="#" class="aph-btn-accent aph-btn-full">${esc(t.cta || "Get started")}</a>
    </div>`;
    }).join("\n    ");
    return `<section class="aph-pricing aph-reveal" style="padding:var(--section-py) 0;"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-stagger" style="display:grid;grid-template-columns:repeat(${tiers.length},1fr);gap:var(--spacing-xl);align-items:stretch;">
    ${rowCards}
    </div>
  </div>
</section>`;
  }

  if (layout === "toggle-annual") {
    // Cards with a monthly/annual toggle — CSS-only using radio inputs + sibling selectors
    const toggleId = `pricing-toggle-${Math.random().toString(36).slice(2, 8)}`;
    const monthlyCards = tiers.map((t, i) => {
      const features = (t.features || []).map((f) => `<li style="padding:var(--spacing-sm) 0;border-bottom:1px solid var(--border);font-size:var(--text-base);color:var(--muted-foreground);">✓ ${esc(f)}</li>`).join("\n");
      const badgeHtml = t.badge ? `<span class="aph-badge" style="position:absolute;top:16px;right:16px;">${esc(t.badge)}</span>` : "";
      return `<div class="${cardClass(cs)} aph-hover-lift" style="padding:var(--spacing-2xl);display:flex;flex-direction:column;position:relative;${highlightCSS(t)}">
      ${badgeHtml}
      <h3 style="font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:700;margin-bottom:var(--spacing-sm);">${esc(t.name || "Plan")}</h3>
      <div style="margin-bottom:var(--spacing-lg);">
        <span class="aph-price-monthly" style="font-family:var(--font-heading);font-size:clamp(32px,4vw,48px);font-weight:800;letter-spacing:-0.03em;">${esc(t.price || "$0")}</span>
        <span class="aph-price-annual" style="font-family:var(--font-heading);font-size:clamp(32px,4vw,48px);font-weight:800;letter-spacing:-0.03em;display:none;">${esc(t.annualPrice || t.price || "$0")}</span>
        <span style="font-size:var(--text-base);color:var(--muted-foreground);">${esc(t.period || "/mo")}</span>
      </div>
      ${t.description ? `<p style="font-size:var(--text-base);color:var(--muted-foreground);margin-bottom:var(--spacing-xl);line-height:1.6;">${esc(t.description)}</p>` : ""}
      <ul style="list-style:none;margin-bottom:var(--spacing-2xl);flex:1;">${features}</ul>
      <a href="#" class="aph-btn-accent aph-btn-full">${esc(t.cta || "Get started")}</a>
    </div>`;
    }).join("\n    ");

    return `<section class="aph-pricing aph-reveal" style="padding:var(--section-py) 0;"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div style="display:flex;justify-content:center;margin-bottom:var(--spacing-3xl);">
      <div id="${toggleId}" style="display:inline-flex;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:var(--spacing-xs);gap:var(--spacing-xs);">
        <button type="button" class="aph-toggle-btn aph-toggle-active" onclick="(function(el){var p=el.parentElement;p.querySelectorAll('.aph-toggle-btn').forEach(function(b){b.classList.remove('aph-toggle-active')});el.classList.add('aph-toggle-active');var s=el.closest('section');s.querySelectorAll('.aph-price-monthly').forEach(function(e){e.style.display=''});s.querySelectorAll('.aph-price-annual').forEach(function(e){e.style.display='none'});s.querySelectorAll('.aph-period-label').forEach(function(e){e.textContent='/mo'})})(this)" style="padding:var(--spacing-sm) var(--spacing-xl);border-radius:calc(var(--radius) - 2px);font-size:var(--text-base);font-weight:600;border:none;cursor:pointer;background:transparent;color:var(--foreground);transition:background 0.2s,color 0.2s;">Monthly</button>
        <button type="button" class="aph-toggle-btn" onclick="(function(el){var p=el.parentElement;p.querySelectorAll('.aph-toggle-btn').forEach(function(b){b.classList.remove('aph-toggle-active')});el.classList.add('aph-toggle-active');var s=el.closest('section');s.querySelectorAll('.aph-price-monthly').forEach(function(e){e.style.display='none'});s.querySelectorAll('.aph-price-annual').forEach(function(e){e.style.display=''});s.querySelectorAll('.aph-period-label').forEach(function(e){e.textContent='/yr'})})(this)" style="padding:var(--spacing-sm) var(--spacing-xl);border-radius:calc(var(--radius) - 2px);font-size:var(--text-base);font-weight:600;border:none;cursor:pointer;background:transparent;color:var(--foreground);transition:background 0.2s,color 0.2s;">Annual <span style="font-size:11px;color:var(--accent);font-weight:700;">Save 20%</span></button>
      </div>
    </div>
    <style>.aph-toggle-active{background:var(--accent)!important;color:var(--accent-foreground)!important;}</style>
    <div class="aph-stagger" style="display:grid;grid-template-columns:repeat(${tiers.length},1fr);gap:var(--spacing-xl);align-items:start;">
    ${monthlyCards}
    </div>
  </div>
</section>`;
  }

  if (layout === "comparison-table") {
    const allFeatures = [...new Set(tiers.flatMap((t) => t.features || []))];
    const headerRow = `<tr><th class="aph-th">Feature</th>${tiers.map((t) => `<th class="aph-th" style="text-align:center;">${esc(t.name || "Plan")}<br><strong>${esc(t.price || "")}</strong></th>`).join("")}</tr>`;
    const rows = allFeatures.map((f) => `<tr><td class="aph-td">${esc(f)}</td>${tiers.map((t) => `<td class="aph-td" style="text-align:center;">${(t.features || []).includes(f) ? "✓" : "—"}</td>`).join("")}</tr>`).join("\n");
    return `<section class="aph-pricing aph-reveal" style="padding:var(--section-py) 0;"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div style="overflow-x:auto;">
      <table class="aph-table" style="min-width:600px;">${headerRow}${rows}</table>
    </div>
  </div>
</section>`;
  }

  return `<section class="aph-pricing aph-reveal" style="padding:var(--section-py) 0;"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-stagger" style="display:grid;grid-template-columns:repeat(${tiers.length},1fr);gap:var(--spacing-xl);align-items:start;">
    ${cards}
    </div>
  </div>
</section>`;
}
