import type { TeamGridProps, TeamMember } from "@/types/render";
import { esc } from "./utils";

const DEFAULT_MEMBERS: TeamMember[] = [
  { name: "Alex Chen", role: "CEO & Co-founder", bio: "Previously at Stripe. Loves building products that people actually use." },
  { name: "Jordan Taylor", role: "CTO", bio: "10 years in distributed systems. Believes in shipping fast and iterating." },
  { name: "Sam Patel", role: "Head of Design", bio: "Ex-Figma. Obsessed with making complex things feel simple." },
  { name: "Riley Kim", role: "Engineering Lead", bio: "Full-stack polyglot. Turns coffee into features." },
];

function renderInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function renderAvatar(member: TeamMember, size: number): string {
  if (member.avatar) {
    return `<img src="${esc(member.avatar)}" alt="${esc(member.name || "")}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;display:block;" />`;
  }
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 20%,var(--surface)),color-mix(in srgb,var(--accent) 8%,var(--surface)));display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * 0.35)}px;font-weight:700;color:var(--accent);flex-shrink:0;">${renderInitials(member.name || "?")}</div>`;
}

export function renderTeamGrid(props: TeamGridProps, sectionId?: string): string {
  const title = props.title || "Meet the team";
  const subtitle = props.subtitle || "";
  const members = props.members?.length ? props.members : DEFAULT_MEMBERS;
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";
  const layout = props.layout || "card-grid";

  const header = `<div class="aph-section-header aph-reveal">
      <h2 class="aph-section-title">${esc(title)}</h2>
      ${subtitle ? `<p class="aph-section-subtitle">${esc(subtitle)}</p>` : ""}
    </div>`;

  if (layout === "photo-grid") {
    const cards = members.map((m) => `<div class="aph-hover-lift" style="position:relative;overflow:hidden;border-radius:var(--radius-lg);aspect-ratio:3/4;background:var(--surface);">
      ${m.avatar ? `<img src="${esc(m.avatar)}" alt="${esc(m.name || "")}" style="width:100%;height:100%;object-fit:cover;display:block;" />` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 15%,var(--surface)),var(--surface));display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:700;color:var(--accent);opacity:0.5;">${renderInitials(m.name || "?")}</div>`}
      <div style="position:absolute;bottom:0;left:0;right:0;padding:var(--spacing-xl);background:linear-gradient(transparent,color-mix(in srgb,var(--background) 80%,transparent));">
        <div style="font-size:var(--text-lg);font-weight:600;color:var(--foreground);">${esc(m.name || "Team Member")}</div>
        <div style="font-size:var(--text-sm);color:var(--muted-foreground);">${esc(m.role || "")}</div>
      </div>
    </div>`).join("\n    ");

    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-stagger" style="display:grid;grid-template-columns:repeat(${Math.min(members.length, 4)},1fr);gap:var(--spacing-xl);">
    ${cards}
    </div>
  </div>
</section>`;
  }

  if (layout === "list") {
    const rows = members.map((m) => `<div class="aph-hover-lift" style="display:flex;gap:var(--spacing-xl);align-items:center;padding:var(--spacing-xl) 0;border-bottom:1px solid var(--border);">
      ${renderAvatar(m, 56)}
      <div style="flex:1;">
        <div style="font-size:var(--text-lg);font-weight:600;color:var(--foreground);">${esc(m.name || "Team Member")}</div>
        <div style="font-size:var(--text-base);color:var(--accent);margin-top:2px;">${esc(m.role || "")}</div>
      </div>
      ${m.bio ? `<p style="font-size:var(--text-base);color:var(--muted-foreground);max-width:360px;line-height:1.6;">${esc(m.bio)}</p>` : ""}
    </div>`).join("\n    ");

    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner" style="max-width:var(--max-w-lg);margin:0 auto;">
    ${header}
    <div class="aph-stagger" style="border-top:1px solid var(--border);">
    ${rows}
    </div>
  </div>
</section>`;
  }

  if (layout === "minimal") {
    const items = members.map((m) => `<div style="text-align:center;padding:var(--spacing-lg);">
      <div style="font-size:var(--text-lg);font-weight:600;color:var(--foreground);">${esc(m.name || "Team Member")}</div>
      <div style="font-size:var(--text-base);color:var(--muted-foreground);margin-top:var(--spacing-xs);">${esc(m.role || "")}</div>
    </div>`).join("\n    ");

    return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-stagger" style="display:flex;flex-wrap:wrap;justify-content:center;gap:var(--spacing-2xl);">
    ${items}
    </div>
  </div>
</section>`;
  }

  // card-grid (default)
  const cards = members.map((m) => `<div class="aph-card-elevated aph-hover-lift" style="padding:var(--spacing-2xl);text-align:center;">
      <div style="margin-bottom:var(--spacing-lg);display:flex;justify-content:center;">${renderAvatar(m, 72)}</div>
      <div style="font-size:var(--text-lg);font-weight:600;color:var(--foreground);">${esc(m.name || "Team Member")}</div>
      <div style="font-size:var(--text-base);color:var(--accent);margin:var(--spacing-xs) 0 var(--spacing-md);">${esc(m.role || "")}</div>
      ${m.bio ? `<p style="font-size:var(--text-base);color:var(--muted-foreground);line-height:1.6;">${esc(m.bio)}</p>` : ""}
    </div>`).join("\n    ");

  return `<section style="padding:var(--section-py) 0;" class="aph-reveal"${idAttr}>
  <div class="aph-inner">
    ${header}
    <div class="aph-stagger" style="display:grid;grid-template-columns:repeat(${Math.min(members.length, 4)},1fr);gap:var(--spacing-xl);">
    ${cards}
    </div>
  </div>
</section>`;
}
