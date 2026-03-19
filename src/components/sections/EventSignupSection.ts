import type { EventSignupProps } from "@/types/render";
import { esc } from "./utils";

export function renderEventSignup(props: EventSignupProps, sectionId?: string): string {
  const name = props.eventName || "Upcoming Event";
  const date = props.date || "TBA";
  const location = props.location || "Online";
  const description = props.description || "Join us for an event you won't want to miss. Register now to secure your spot.";
  const cta = props.cta || "Register now";
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";
  const layout = props.layout || "split-details-form";
  const surface = props.surface || "flat";
  const surfaceClass = surface !== "flat" ? ` aph-surface-${surface}` : "";

  const meta = `<div style="display:flex;gap:var(--spacing-sm);margin-bottom:var(--spacing-xl);flex-wrap:wrap;">
      <span class="aph-badge">${esc(date)}</span>
      <span class="aph-badge aph-badge-outline">${esc(location)}</span>
      ${props.capacity ? `<span class="aph-badge aph-badge-outline">${esc(props.capacity)} spots</span>` : ""}
    </div>`;

  const form = `<form class="aph-event-form" onsubmit="return false" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:var(--spacing-2xl);display:flex;flex-direction:column;gap:var(--spacing-lg);">
      <h3 style="font-size:var(--text-lg);font-weight:600;margin-bottom:var(--spacing-xs);color:var(--foreground);">Reserve your spot</h3>
      <input type="text" placeholder="Your name" class="aph-input" />
      <input type="email" placeholder="Email address" class="aph-input" />
      <button type="submit" class="aph-btn-accent aph-btn-full">${esc(cta)}</button>
    </form>`;

  if (layout === "centered-card") {
    return `<section style="padding:var(--section-py) 0;" class="aph-reveal${surfaceClass}"${idAttr}>
  <div class="aph-inner" style="max-width:var(--max-w-sm);margin:0 auto;">
    <div class="aph-card-elevated" style="padding:var(--spacing-3xl);text-align:center;">
      ${meta}
      <h2 style="font-family:var(--font-heading);font-size:clamp(24px,4vw,36px);font-weight:700;letter-spacing:-0.02em;margin-bottom:var(--spacing-lg);">${esc(name)}</h2>
      <p style="font-size:var(--text-lg);color:var(--muted-foreground);line-height:1.7;margin-bottom:var(--spacing-2xl);">${esc(description)}</p>
      <form onsubmit="return false" style="display:flex;flex-direction:column;gap:var(--spacing-md);max-width:320px;margin:0 auto;">
        <input type="text" placeholder="Your name" class="aph-input" />
        <input type="email" placeholder="Email address" class="aph-input" />
        <button type="submit" class="aph-btn-accent aph-btn-full">${esc(cta)}</button>
      </form>
    </div>
  </div>
</section>`;
  }

  if (layout === "banner") {
    return `<section style="padding:calc(var(--section-py) * 0.7) 0;background:var(--foreground);" class="aph-reveal"${idAttr}>
  <div class="aph-inner" style="display:flex;align-items:center;justify-content:space-between;gap:var(--spacing-2xl);flex-wrap:wrap;">
    <div>
      <div style="display:flex;gap:var(--spacing-sm);margin-bottom:var(--spacing-md);">
        <span class="aph-badge" style="background:color-mix(in srgb,var(--accent-foreground) 10%,transparent);color:var(--background);border-color:color-mix(in srgb,var(--accent-foreground) 20%,transparent);">${esc(date)}</span>
        <span class="aph-badge" style="background:transparent;color:var(--background);border-color:color-mix(in srgb,var(--accent-foreground) 20%,transparent);">${esc(location)}</span>
      </div>
      <h2 style="font-family:var(--font-heading);font-size:clamp(20px,3vw,32px);font-weight:700;color:var(--background);">${esc(name)}</h2>
    </div>
    <a href="#" class="aph-btn-accent aph-btn-lg" style="background:var(--background);color:var(--foreground);">${esc(cta)}</a>
  </div>
</section>`;
  }

  // split-details-form (default)
  return `<section class="aph-event aph-reveal${surfaceClass}"${idAttr}>
  <div class="aph-inner" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-4xl);align-items:start;">
    <div>
      ${meta}
      <h2 style="font-family:var(--font-heading);font-size:clamp(24px,3vw,40px);font-weight:700;letter-spacing:-0.02em;margin-bottom:var(--spacing-lg);color:var(--foreground);">${esc(name)}</h2>
      <p style="font-size:var(--text-lg);color:var(--muted-foreground);line-height:1.7;">${esc(description)}</p>
    </div>
    ${form}
  </div>
</section>`;
}
