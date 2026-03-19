import type { StatsProps, StatItem } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_STATS: StatItem[] = [
  { value: "10k", suffix: "+", label: "Active users" },
  { value: "99.9", suffix: "%", label: "Uptime" },
  { value: "50", suffix: "ms", label: "Avg response" },
  { value: "4.9", suffix: "/5", label: "User rating" },
];

export function renderStats(props: StatsProps, sectionId?: string): string {
  const title = props.title || "";
  const stats = props.stats?.length ? props.stats : DEFAULT_STATS;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";
  const layout = props.layout || "big-numbers";

  const titleHtml = title ? `<div class="aph-section-header aph-reveal" style="margin-bottom:var(--spacing-3xl);">
      <h2 class="aph-section-title">${esc(title)}</h2>
    </div>` : "";

  if (layout === "big-numbers") {
    const items = stats.map((s) => `<div class="aph-reveal" style="text-align:center;padding:var(--spacing-xl);">
      <div style="font-family:var(--font-heading);font-size:clamp(40px,8vw,80px);font-weight:800;letter-spacing:-0.04em;line-height:1;color:var(--foreground);">
        ${s.prefix ? `<span>${esc(s.prefix)}</span>` : ""}${esc(s.value || "0")}${s.suffix ? `<span style="color:var(--accent);">${esc(s.suffix)}</span>` : ""}
      </div>
      <div style="font-size:var(--text-base);color:var(--muted-foreground);margin-top:var(--spacing-md);text-transform:uppercase;letter-spacing:0.06em;">${esc(s.label || "Metric")}</div>
    </div>`).join("\n    ");

    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${titleHtml}
    <div style="display:grid;grid-template-columns:repeat(${stats.length},1fr);gap:var(--spacing-xl);">
    ${items}
    </div>
  </div>
</section>`;
  }

  if (layout === "cards") {
    const items = stats.map((s) => `<div class="aph-card-elevated aph-hover-lift" style="padding:var(--spacing-2xl);text-align:center;">
      <div style="font-family:var(--font-heading);font-size:clamp(28px,4vw,48px);font-weight:800;letter-spacing:-0.03em;color:var(--foreground);">
        ${s.prefix ? esc(s.prefix) : ""}${esc(s.value || "0")}${s.suffix ? `<span style="color:var(--accent);">${esc(s.suffix)}</span>` : ""}
      </div>
      <div style="font-size:var(--text-base);color:var(--muted-foreground);margin-top:var(--spacing-sm);">${esc(s.label || "Metric")}</div>
    </div>`).join("\n    ");

    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${titleHtml}
    <div class="aph-stagger" style="display:grid;grid-template-columns:repeat(${Math.min(stats.length, 4)},1fr);gap:var(--spacing-xl);">
    ${items}
    </div>
  </div>
</section>`;
  }

  if (layout === "inline-bar") {
    const items = stats.map((s) => `<div style="display:flex;align-items:baseline;gap:var(--spacing-sm);">
      <span style="font-family:var(--font-heading);font-size:28px;font-weight:800;letter-spacing:-0.02em;">${s.prefix ? esc(s.prefix) : ""}${esc(s.value || "0")}${s.suffix ? esc(s.suffix) : ""}</span>
      <span style="font-size:var(--text-base);color:var(--muted-foreground);">${esc(s.label || "")}</span>
    </div>`).join("\n    ");

    return `<section style="padding:calc(var(--section-py) * 0.5) 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);" class="aph-reveal"${idAttr}>
  <div class="aph-inner" style="display:flex;justify-content:space-around;flex-wrap:wrap;gap:var(--spacing-2xl);">
    ${items}
  </div>
</section>`;
  }

  // icon-stats
  const items = stats.map((s) => `<div class="aph-reveal" style="display:flex;align-items:center;gap:var(--spacing-lg);padding:var(--spacing-lg);">
      <div class="aph-icon-accent-bg" style="font-size:var(--text-xl);">#</div>
      <div>
        <div style="font-family:var(--font-heading);font-size:var(--text-3xl);font-weight:800;letter-spacing:-0.02em;">${s.prefix ? esc(s.prefix) : ""}${esc(s.value || "0")}${s.suffix ? esc(s.suffix) : ""}</div>
        <div style="font-size:var(--text-sm);color:var(--muted-foreground);">${esc(s.label || "Metric")}</div>
      </div>
    </div>`).join("\n    ");

  return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${titleHtml}
    <div class="aph-stagger" style="display:grid;grid-template-columns:repeat(${Math.min(stats.length, 4)},1fr);gap:var(--spacing-xl);">
    ${items}
    </div>
  </div>
</section>`;
}
