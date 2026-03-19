import type { NewsletterProps } from "@/types/render";
import { esc } from "./utils";

export function renderNewsletter(props: NewsletterProps, sectionId?: string): string {
  const headline = props.headline || "Stay in the loop";
  const subtext = props.subtext || "Get the latest updates delivered straight to your inbox. No spam, ever.";
  const placeholder = props.placeholder || "Enter your email";
  const cta = props.cta || "Subscribe";
  const privacy = props.privacyNote || "We respect your privacy. Unsubscribe at any time.";
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";
  const layout = props.layout || "centered-card";
  const surface = props.surface || "flat";
  const surfaceClass = surface !== "flat" ? ` aph-surface-${surface}` : "";

  const inputRow = `<form onsubmit="return false" style="display:flex;gap:var(--spacing-md);flex-wrap:wrap;">
      <input type="email" placeholder="${esc(placeholder)}" class="aph-input" style="flex:1;min-width:200px;" />
      <button type="submit" class="aph-btn-accent">${esc(cta)}</button>
    </form>
    <p style="font-size:var(--text-xs);color:var(--muted-foreground);margin-top:var(--spacing-md);">${esc(privacy)}</p>`;

  if (layout === "inline-bar") {
    return `<section style="padding:calc(var(--section-py) * 0.5) 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);" class="aph-reveal${surfaceClass}"${idAttr}>
  <div class="aph-inner" style="display:flex;align-items:center;justify-content:space-between;gap:var(--spacing-2xl);flex-wrap:wrap;">
    <div>
      <h2 style="font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:700;letter-spacing:-0.02em;">${esc(headline)}</h2>
    </div>
    <form onsubmit="return false" style="display:flex;gap:var(--spacing-md);">
      <input type="email" placeholder="${esc(placeholder)}" class="aph-input" style="min-width:240px;" />
      <button type="submit" class="aph-btn-accent">${esc(cta)}</button>
    </form>
  </div>
</section>`;
  }

  if (layout === "split-with-copy") {
    return `<section style="padding:var(--section-py) 0;" class="aph-reveal${surfaceClass}"${idAttr}>
  <div class="aph-inner" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-4xl);align-items:center;">
    <div>
      <h2 style="font-family:var(--font-heading);font-size:clamp(28px,4vw,44px);font-weight:700;letter-spacing:-0.02em;line-height:1.1;margin-bottom:var(--spacing-lg);">${esc(headline)}</h2>
      <p style="font-size:var(--text-lg);color:var(--muted-foreground);line-height:1.7;">${esc(subtext)}</p>
    </div>
    <div>
      ${inputRow}
    </div>
  </div>
</section>`;
  }

  if (layout === "minimal") {
    return `<section style="padding:calc(var(--section-py) * 0.4) 0;" class="aph-reveal${surfaceClass}"${idAttr}>
  <div class="aph-inner" style="max-width:480px;margin:0 auto;">
    <form onsubmit="return false" style="display:flex;gap:var(--spacing-sm);">
      <input type="email" placeholder="${esc(placeholder)}" class="aph-input" style="flex:1;" />
      <button type="submit" class="aph-btn-accent aph-btn-sm">${esc(cta)}</button>
    </form>
  </div>
</section>`;
  }

  // centered-card
  return `<section style="padding:var(--section-py) 0;" class="aph-reveal${surfaceClass}"${idAttr}>
  <div class="aph-inner" style="max-width:var(--max-w-sm);margin:0 auto;text-align:center;">
    <h2 style="font-family:var(--font-heading);font-size:clamp(24px,4vw,36px);font-weight:700;letter-spacing:-0.02em;margin-bottom:var(--spacing-md);">${esc(headline)}</h2>
    <p style="font-size:var(--text-lg);color:var(--muted-foreground);line-height:1.7;margin-bottom:var(--spacing-2xl);">${esc(subtext)}</p>
    ${inputRow}
  </div>
</section>`;
}
