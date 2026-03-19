import type { ComparisonTableProps } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_US = { name: "Us", features: ["Unlimited projects", "Real-time collaboration", "Priority support", "Custom domains", "API access", "99.9% uptime SLA"] };
const DEFAULT_THEM = { name: "Others", features: ["5 project limit", "No collaboration", "Email support only", "No custom domains", "No API", "No SLA"] };

export function renderComparisonTable(props: ComparisonTableProps, sectionId?: string): string {
  const title = props.title || "How we compare";
  const subtitle = props.subtitle || "";
  const us = props.us || DEFAULT_US;
  const them = props.them || DEFAULT_THEM;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";
  const layout = props.layout || "table";
  const hs = props.highlightStyle || "column-accent";

  const header = `<div class="aph-section-header aph-reveal">
      <h2 class="aph-section-title">${esc(title)}</h2>
      ${subtitle ? `<p class="aph-section-subtitle">${esc(subtitle)}</p>` : ""}
    </div>`;

  const maxFeatures = Math.max((us.features || []).length, (them.features || []).length);

  if (layout === "cards-side-by-side") {
    function renderFeatureList(features: string[], isUs: boolean): string {
      return features.map((f) => `<li style="padding:var(--spacing-sm) 0;border-bottom:1px solid var(--border);font-size:var(--text-base);display:flex;align-items:center;gap:var(--spacing-sm);">
        <span style="color:${isUs ? "var(--accent)" : "var(--muted-foreground)"};">${isUs ? "✓" : "—"}</span>
        ${esc(f)}
      </li>`).join("\n");
    }

    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-stagger" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-xl);">
      <div class="aph-card-elevated" style="padding:var(--spacing-2xl);border:2px solid var(--accent);">
        <h3 style="font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:700;margin-bottom:var(--spacing-xl);color:var(--accent);">${esc(us.name || "Us")}</h3>
        <ul style="list-style:none;">${renderFeatureList(us.features || [], true)}</ul>
      </div>
      <div class="aph-card-bordered" style="padding:var(--spacing-2xl);opacity:0.7;">
        <h3 style="font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:700;margin-bottom:var(--spacing-xl);color:var(--muted-foreground);">${esc(them.name || "Others")}</h3>
        <ul style="list-style:none;">${renderFeatureList(them.features || [], false)}</ul>
      </div>
    </div>
  </div>
</section>`;
  }

  if (layout === "checklist") {
    const rows = Array.from({ length: maxFeatures }, (_, i) => {
      const usFeature = (us.features || [])[i] || "";
      const themFeature = (them.features || [])[i] || "";
      return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-xl);padding:var(--spacing-lg) 0;border-bottom:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:10px;font-size:var(--text-base);">
          <span style="color:var(--accent);font-weight:600;">✓</span>
          <span style="color:var(--foreground);">${esc(usFeature)}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;font-size:var(--text-base);">
          <span style="color:var(--muted-foreground);">✗</span>
          <span style="color:var(--muted-foreground);">${esc(themFeature)}</span>
        </div>
      </div>`;
    }).join("\n    ");

    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner" style="max-width:var(--max-w-lg);margin:0 auto;">
    ${header}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-xl);padding:var(--spacing-lg) 0;border-bottom:2px solid var(--border);margin-bottom:var(--spacing-sm);">
      <span style="font-size:var(--text-base);font-weight:700;color:var(--accent);">${esc(us.name || "Us")}</span>
      <span style="font-size:var(--text-base);font-weight:700;color:var(--muted-foreground);">${esc(them.name || "Others")}</span>
    </div>
    <div class="aph-stagger">
    ${rows}
    </div>
  </div>
</section>`;
  }

  // table (default)
  const accentCol = hs === "column-accent" ? `background:color-mix(in srgb,var(--accent) 5%,transparent);` : "";
  const headerRow = `<tr>
    <th class="aph-th">Feature</th>
    <th class="aph-th" style="text-align:center;${accentCol}font-weight:700;color:var(--accent);">${esc(us.name || "Us")}</th>
    <th class="aph-th" style="text-align:center;">${esc(them.name || "Others")}</th>
  </tr>`;
  const rows = Array.from({ length: maxFeatures }, (_, i) => {
    const usF = (us.features || [])[i] || "";
    const themF = (them.features || [])[i] || "";
    return `<tr>
      <td class="aph-td" style="font-size:var(--text-base);">${esc(usF || themF)}</td>
      <td class="aph-td" style="text-align:center;${accentCol}"><span style="color:var(--accent);font-weight:600;">✓</span></td>
      <td class="aph-td" style="text-align:center;"><span style="color:var(--muted-foreground);">${usF ? "✗" : "✓"}</span></td>
    </tr>`;
  }).join("\n    ");

  return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner" style="max-width:var(--max-w-lg);margin:0 auto;">
    ${header}
    <div style="overflow-x:auto;border:1px solid var(--border);border-radius:var(--radius-lg);">
      <table class="aph-table">
      ${headerRow}
      ${rows}
      </table>
    </div>
  </div>
</section>`;
}
