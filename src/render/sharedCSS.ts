// ============================================================
// APHANTASIA — Shared CSS for render output
// ============================================================
// Single source of truth for all output CSS: section styles,
// primitives, animations, responsive breakpoints.
// Consumed by WebRenderer (Layer 1) and PreviewPane (Layer 2).
// ============================================================

export { BASE_CSS, ANIMATION_CSS, RESPONSIVE_CSS, SCROLL_REVEAL_SCRIPT };

const BASE_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
body {
  font-family: var(--font-body);
  background: var(--background);
  color: var(--foreground);
  line-height: 1.6;
}
a { color: inherit; text-decoration: none; }

/* Layout */
.aph-inner {
  max-width: var(--inner-max);
  margin: 0 auto;
  padding: 0 40px;
}

/* Buttons */
.aph-btn-accent {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px;
  background: var(--accent);
  color: var(--accent-foreground);
  font-family: var(--font-body);
  font-size: var(--font-size-body, 14px);
  font-weight: 600;
  border-radius: var(--radius);
  border: none; cursor: pointer;
  transition: opacity 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: var(--shadow-button, none);
}
.aph-btn-accent:hover { opacity: 0.88; transform: translateY(-1px); }
.aph-btn-accent:active { transform: translateY(0); }
.aph-btn-accent.aph-btn-sm { padding: 8px 16px; font-size: 13px; }
.aph-btn-accent.aph-btn-lg { padding: 16px 32px; font-size: 16px; letter-spacing: -0.01em; }
.aph-btn-accent.aph-btn-full { width: 100%; justify-content: center; }

.aph-btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px;
  border: 1px solid var(--border);
  color: var(--foreground);
  font-family: var(--font-body);
  font-size: 14px; font-weight: 500;
  border-radius: var(--radius);
  background: transparent;
  cursor: pointer;
  transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
}
.aph-btn-ghost:hover { border-color: var(--muted-foreground); background: var(--surface); transform: translateY(-1px); }
.aph-btn-ghost:active { transform: translateY(0); }
.aph-btn-ghost.aph-btn-lg { padding: 16px 32px; font-size: 16px; }

/* Badge */
.aph-badge {
  display: inline-block;
  padding: 4px 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 12px; font-weight: 500;
  color: var(--muted-foreground);
}
.aph-badge-outline {
  background: transparent;
  border-color: var(--border);
}

/* Section header — contrast scale */
.aph-section-header { text-align: center; margin-bottom: 64px; }
.aph-section-title {
  font-family: var(--font-heading);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--foreground);
}
.aph-section-subtitle {
  margin-top: 16px;
  font-size: 18px;
  color: var(--muted-foreground);
  max-width: 560px;
  margin-left: auto; margin-right: auto;
  line-height: 1.7;
}

/* Nav */
.aph-nav {
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--background) 90%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: sticky; top: 0; z-index: 10;
}
.aph-nav-inner {
  display: flex; align-items: center;
  justify-content: space-between;
  padding-top: 18px; padding-bottom: 18px;
}
.aph-logo {
  font-family: var(--font-heading);
  font-size: 18px; font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.aph-nav-links {
  list-style: none;
  display: flex; gap: 28px;
}
.aph-nav-link {
  font-size: 14px; font-weight: 500;
  color: var(--muted-foreground);
  transition: color 0.2s;
}
.aph-nav-link:hover { color: var(--foreground); }

/* Hero — dramatic typography scale */
.aph-hero { padding: calc(var(--section-py) * 1.2) 0 var(--section-py); }
.aph-hero-inner { max-width: var(--inner-max); margin: 0 auto; padding: 0 40px; }
.aph-hero-badge { margin-bottom: 28px; }
.aph-hero-h1 {
  font-family: var(--font-heading);
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.0;
  max-width: 820px;
  color: var(--foreground);
}
.aph-hero-sub {
  margin-top: 28px;
  font-size: 19px;
  color: var(--muted-foreground);
  line-height: 1.7;
  max-width: 540px;
}
.aph-hero-imagery {
  margin-top: 56px;
  width: 100%;
  aspect-ratio: 16/7;
  background: linear-gradient(135deg, var(--surface) 0%, color-mix(in srgb, var(--accent) 8%, var(--surface)) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
}
.aph-img-label {
  font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--muted-foreground); opacity: 0.6;
}
.aph-hero-h1-animated {
  background: linear-gradient(90deg, var(--foreground) 0%, var(--accent) 25%, var(--foreground) 50%, var(--accent) 75%, var(--foreground) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: aph-gradient-text 4s linear infinite;
}
@keyframes aph-gradient-text {
  to { background-position: 200% center; }
}
.aph-hero-bundui-entrance .aph-hero-inner {
  animation: aph-hero-entrance 0.6s ease-out;
}
@keyframes aph-hero-entrance {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.aph-feature-grid-bento .aph-feature-cards {
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 140px;
  gap: 16px;
}
.aph-feature-grid-bento .aph-feature-card:nth-child(1) {
  grid-column: span 2;
  grid-row: span 2;
}
.aph-hero-cta {
  margin-top: 44px;
  display: flex; gap: 16px; flex-wrap: wrap;
}

/* Feature grid */
.aph-feature-grid {
  padding: var(--section-py) 0;
  background: var(--surface-alt);
}
.aph-feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
.aph-feature-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px;
  display: flex; flex-direction: column;
  box-shadow: var(--shadow-card, none);
}
.aph-feature-icon {
  font-size: 24px; margin-bottom: 20px;
  color: var(--accent);
  width: 48px; height: 48px;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border-radius: var(--radius);
}
.aph-feature-heading {
  font-family: var(--font-heading);
  font-size: 18px; font-weight: 700;
  margin-bottom: 10px;
  color: var(--foreground);
  letter-spacing: -0.01em;
}
.aph-feature-body {
  font-size: 15px;
  color: var(--muted-foreground);
  line-height: 1.7;
}
.aph-feature-image {
  margin: -32px -32px 16px -32px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow: hidden;
}
.aph-feature-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}
.aph-feature-card--has-image { padding-top: 0; }

/* Split */
.aph-split { padding: var(--section-py) 0; }
.aph-split-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 72px;
  align-items: center;
}
.aph-split-flip { direction: rtl; }
.aph-split-flip > * { direction: ltr; }
.aph-split-heading {
  font-family: var(--font-heading);
  font-size: clamp(24px, 3.5vw, 40px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 20px;
  color: var(--foreground);
}
.aph-split-body {
  font-size: 16px;
  color: var(--muted-foreground);
  line-height: 1.7;
  margin-bottom: 28px;
}
.aph-split-cta { margin-top: 4px; }
.aph-split-image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: var(--radius-lg);
  display: block;
}
.aph-split-placeholder {
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, var(--surface) 0%, color-mix(in srgb, var(--accent) 5%, var(--surface)) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
}
.aph-split-placeholder-label {
  font-size: 12px;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* CTA — inverted dramatic section */
.aph-cta {
  padding: calc(var(--section-py) * 1.3) 0;
  background: var(--foreground);
  position: relative;
  overflow: hidden;
}
.aph-cta-inner { text-align: center; position: relative; z-index: 1; }
.aph-cta-heading {
  font-family: var(--font-heading);
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: var(--background);
  margin-bottom: 20px;
}
.aph-cta-sub {
  font-size: 18px;
  color: color-mix(in srgb, var(--background) 65%, transparent);
  margin-bottom: 40px;
  max-width: 480px; margin-left: auto; margin-right: auto;
  line-height: 1.7;
}
.aph-cta-actions {
  display: flex; gap: 16px;
  justify-content: center; flex-wrap: wrap;
}
.aph-cta .aph-btn-accent {
  background: var(--background);
  color: var(--foreground);
}
.aph-cta .aph-btn-ghost {
  border-color: color-mix(in srgb, var(--background) 25%, transparent);
  color: var(--background);
}
.aph-cta .aph-btn-ghost:hover {
  background: color-mix(in srgb, var(--background) 10%, transparent);
}

/* Portfolio */
.aph-portfolio { padding: var(--section-py) 0; }
.aph-portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
.aph-portfolio-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
}
.aph-portfolio-thumb {
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, var(--surface-alt) 0%, color-mix(in srgb, var(--accent) 5%, var(--surface-alt)) 100%);
  border-bottom: 1px solid var(--border);
}
.aph-portfolio-info { padding: 24px; }
.aph-portfolio-title {
  font-family: var(--font-heading);
  font-size: 17px; font-weight: 600;
  margin-bottom: 8px;
  color: var(--foreground);
}
.aph-portfolio-desc {
  font-size: 14px;
  color: var(--muted-foreground);
  margin-bottom: 14px;
  line-height: 1.6;
}
.aph-portfolio-tags { display: flex; gap: 6px; flex-wrap: wrap; }

/* E-commerce */
.aph-ecommerce { padding: var(--section-py) 0; }
.aph-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}
.aph-product-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
}
.aph-product-thumb {
  aspect-ratio: 1;
  background: linear-gradient(135deg, var(--surface-alt) 0%, color-mix(in srgb, var(--accent) 4%, var(--surface-alt)) 100%);
  border-bottom: 1px solid var(--border);
  position: relative;
}
.aph-product-badge {
  position: absolute; top: 12px; left: 12px;
  background: var(--accent);
  color: var(--accent-foreground);
  border: none;
}
.aph-product-info { padding: 20px; }
.aph-product-name {
  font-size: 15px; font-weight: 600;
  margin-bottom: 4px;
  color: var(--foreground);
}
.aph-product-desc {
  font-size: 13px;
  color: var(--muted-foreground);
  margin-bottom: 14px;
  line-height: 1.5;
}
.aph-product-footer {
  display: flex; align-items: center;
  justify-content: space-between;
}
.aph-product-price {
  font-size: 17px; font-weight: 700;
  color: var(--foreground);
  letter-spacing: -0.01em;
}

/* Event signup */
.aph-event { padding: var(--section-py) 0; }
.aph-event-inner {
  max-width: var(--inner-max); margin: 0 auto; padding: 0 40px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: start;
}
.aph-event-meta { display: flex; gap: 8px; margin-bottom: 20px; }
.aph-event-title {
  font-family: var(--font-heading);
  font-size: clamp(24px, 3vw, 40px);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  color: var(--foreground);
}
.aph-event-desc {
  font-size: 16px;
  color: var(--muted-foreground);
  line-height: 1.7;
}
.aph-event-form {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px;
  display: flex; flex-direction: column; gap: 14px;
}
.aph-event-form-heading {
  font-size: 16px; font-weight: 600;
  margin-bottom: 4px;
  color: var(--foreground);
}

/* Generic */
.aph-generic { padding: var(--section-py) 0; }
.aph-generic-inner { max-width: 720px; }
.aph-generic-body {
  font-size: 17px;
  color: var(--muted-foreground);
  line-height: 1.75;
  margin-top: 16px; margin-bottom: 28px;
}

/* Footer */
.aph-footer {
  border-top: 1px solid var(--border);
  padding: 56px 0 32px;
  background: var(--surface-alt);
}
.aph-footer-top {
  display: flex; gap: 64px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}
.aph-footer-brand { flex: 0 0 200px; }
.aph-footer-logo {
  font-family: var(--font-heading);
  font-size: 18px; font-weight: 700;
  color: var(--foreground);
  display: block; margin-bottom: 10px;
}
.aph-footer-tagline {
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
}
.aph-footer-cols {
  flex: 1;
  display: flex; gap: 48px; flex-wrap: wrap;
}
.aph-footer-col-heading {
  font-size: 12px; font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--foreground);
  margin-bottom: 14px;
}
.aph-footer-col-links {
  list-style: none;
  display: flex; flex-direction: column; gap: 10px;
}
.aph-footer-col-links a {
  font-size: 14px;
  color: var(--muted-foreground);
  transition: color 0.2s;
}
.aph-footer-col-links a:hover { color: var(--foreground); }
.aph-footer-bottom {
  border-top: 1px solid var(--border);
  padding-top: 24px;
}
.aph-footer-copy {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Form inputs */
.aph-input {
  font-family: var(--font-body);
  font-size: 14px;
  padding: 11px 14px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--foreground);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}
.aph-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 12%, transparent); }

/* Image placeholder */
.aph-img-placeholder {
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, var(--surface) 0%, color-mix(in srgb, var(--accent) 5%, var(--surface)) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  margin: 20px 0;
}
.aph-img-placeholder span {
  font-size: 13px;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Primitive wrapper + separator */
.aph-primitive-wrap {
  padding: var(--section-py, 24px) 0;
  max-width: var(--inner-max);
  margin: 0 auto;
  padding-left: 40px;
  padding-right: 40px;
}
.aph-separator-h {
  height: 1px;
  background: var(--border);
  width: 100%;
}

/* Empty state */
.aph-empty {
  height: 100vh;
  display: flex; align-items: center; justify-content: center;
}
.aph-empty p {
  font-size: 14px;
  color: var(--muted-foreground);
}

/* ================================================================
   SHADCN PRIMITIVES — Full component CSS
   ================================================================ */

.aph-muted { font-size: 13px; color: var(--muted-foreground); }
.aph-label-text { font-size: 14px; font-weight: 500; color: var(--foreground); display: block; margin-bottom: 6px; }

.aph-accordion { border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.aph-accordion-item { border-bottom: 1px solid var(--border); }
.aph-accordion-item:last-child { border-bottom: none; }
.aph-accordion-trigger { display: flex; justify-content: space-between; align-items: center; padding: 16px; font-size: 14px; font-weight: 500; color: var(--foreground); cursor: pointer; transition: background 0.15s; }
.aph-accordion-trigger:hover { background: var(--surface); }
.aph-accordion-chevron { font-size: 16px; color: var(--muted-foreground); }
.aph-accordion-content { padding: 0 16px 16px; font-size: 14px; color: var(--muted-foreground); line-height: 1.6; }

.aph-alert { display: flex; gap: 12px; padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-lg); }
.aph-alert-destructive { border-color: #ef4444; }
.aph-alert-destructive .aph-alert-title { color: #ef4444; }
.aph-alert-icon { font-size: 18px; flex-shrink: 0; }
.aph-alert-title { font-size: 14px; font-weight: 600; color: var(--foreground); margin-bottom: 4px; }
.aph-alert-desc { font-size: 13px; color: var(--muted-foreground); line-height: 1.5; }

.aph-dialog-card, .aph-sheet-card, .aph-drawer-card { background: var(--background); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; max-width: 420px; }
.aph-dialog-header { margin-bottom: 20px; }
.aph-dialog-title { font-size: 18px; font-weight: 600; color: var(--foreground); margin-bottom: 8px; }
.aph-dialog-desc { font-size: 14px; color: var(--muted-foreground); line-height: 1.5; }
.aph-dialog-body { margin-bottom: 20px; }
.aph-dialog-footer { display: flex; justify-content: flex-end; gap: 8px; }

.aph-drawer-handle { width: 48px; height: 4px; background: var(--border); border-radius: 2px; margin: 0 auto 16px; }
.aph-drawer-card { max-width: 100%; border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
.aph-sheet-card { border-radius: 0 var(--radius-lg) var(--radius-lg) 0; min-height: 200px; }

.aph-aspect-ratio { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; }
.aph-aspect-label { font-size: 12px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.08em; }

.aph-avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; background: var(--surface); border: 1px solid var(--border); flex-shrink: 0; }
.aph-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.aph-avatar-fallback { font-size: 14px; font-weight: 600; color: var(--foreground); }

.aph-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.aph-breadcrumb-link { color: var(--muted-foreground); cursor: pointer; transition: color 0.15s; }
.aph-breadcrumb-link:hover { color: var(--foreground); }
.aph-breadcrumb-sep { color: var(--muted-foreground); }
.aph-breadcrumb-current { color: var(--foreground); font-weight: 500; }

.aph-button-group { display: inline-flex; gap: 0; }
.aph-button-group > button { border-radius: 0; }
.aph-button-group > button:first-child { border-radius: var(--radius) 0 0 var(--radius); }
.aph-button-group > button:last-child { border-radius: 0 var(--radius) var(--radius) 0; }

.aph-calendar { border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; background: var(--background); display: inline-block; }
.aph-cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.aph-cal-month { font-size: 14px; font-weight: 500; color: var(--foreground); }
.aph-cal-nav { background: none; border: 1px solid var(--border); border-radius: var(--radius); width: 28px; height: 28px; cursor: pointer; color: var(--foreground); display: flex; align-items: center; justify-content: center; }
.aph-cal-grid { display: grid; grid-template-columns: repeat(7, 36px); gap: 2px; }
.aph-cal-day-label { font-size: 11px; color: var(--muted-foreground); text-align: center; padding: 4px; }
.aph-cal-cell { font-size: 13px; text-align: center; padding: 6px; border-radius: var(--radius); color: var(--foreground); cursor: pointer; transition: background 0.15s; }
.aph-cal-cell:hover { background: var(--surface); }
.aph-cal-today { background: var(--accent); color: var(--accent-foreground); font-weight: 600; }

.aph-carousel { display: flex; align-items: center; gap: 8px; }
.aph-carousel-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); background: var(--background); cursor: pointer; color: var(--foreground); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; transition: background 0.15s; }
.aph-carousel-btn:hover { background: var(--surface); }
.aph-carousel-track { display: flex; gap: 12px; overflow: hidden; flex: 1; }
.aph-carousel-slide { min-width: 100%; border-radius: var(--radius-lg); background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; height: 180px; font-size: 14px; color: var(--muted-foreground); }
.aph-carousel-active { display: flex; }
.aph-carousel-slide:not(.aph-carousel-active) { display: none; }

.aph-chart { border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; background: var(--background); }
.aph-chart-title { font-size: 14px; font-weight: 600; color: var(--foreground); margin-bottom: 16px; }
.aph-chart-area { display: flex; align-items: flex-end; gap: 8px; height: 160px; }
.aph-chart-bar { flex: 1; background: var(--accent); border-radius: var(--radius) var(--radius) 0 0; min-width: 24px; transition: opacity 0.15s; }
.aph-chart-bar:hover { opacity: 0.8; }

.aph-checkbox-label { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--foreground); cursor: pointer; }
.aph-checkbox { width: 18px; height: 18px; border-radius: 4px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
.aph-checkbox-checked { background: var(--accent); color: var(--accent-foreground); border-color: var(--accent); }

.aph-collapsible { border: 1px solid var(--border); border-radius: var(--radius-lg); }
.aph-collapsible-trigger { padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 500; color: var(--foreground); cursor: pointer; }
.aph-collapsible-icon { color: var(--muted-foreground); }
.aph-collapsible-content { padding: 0 16px 14px; font-size: 13px; color: var(--muted-foreground); border-top: 1px solid var(--border); padding-top: 14px; }

.aph-combobox { display: inline-block; min-width: 200px; }
.aph-combobox-trigger { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius); font-size: 14px; color: var(--muted-foreground); cursor: pointer; background: var(--background); }
.aph-combobox-chevron { font-size: 12px; }
.aph-combobox-list { border: 1px solid var(--border); border-radius: var(--radius); margin-top: 4px; background: var(--background); overflow: hidden; }
.aph-combobox-item { padding: 8px 14px; font-size: 14px; color: var(--foreground); cursor: pointer; transition: background 0.1s; }
.aph-combobox-item:hover { background: var(--surface); }

.aph-command { border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--background); overflow: hidden; }
.aph-command-input { display: flex; align-items: center; gap: 8px; padding: 12px 16px; }
.aph-command-input .aph-input { border: none; padding: 0; }
.aph-command-search-icon { font-size: 16px; color: var(--muted-foreground); }
.aph-command-group { padding: 8px 0; }
.aph-command-heading { padding: 8px 16px; font-size: 12px; font-weight: 600; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.05em; }
.aph-command-item { padding: 8px 16px; font-size: 14px; color: var(--foreground); cursor: pointer; transition: background 0.1s; }
.aph-command-item:hover { background: var(--surface); }

.aph-context-menu { border: 1px solid var(--border); border-radius: var(--radius); background: var(--background); padding: 4px 0; min-width: 160px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.aph-menu-item { padding: 8px 14px; font-size: 14px; color: var(--foreground); cursor: pointer; transition: background 0.1s; }
.aph-menu-item:hover { background: var(--surface); }

.aph-data-table { border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.aph-data-table-toolbar { padding: 12px 16px; }
.aph-data-table-footer { padding: 12px 16px; display: flex; justify-content: space-between; }

.aph-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.aph-th { text-align: left; padding: 12px 16px; font-weight: 500; color: var(--muted-foreground); border-bottom: 1px solid var(--border); background: var(--surface); }
.aph-td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--foreground); }

.aph-date-picker { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--background); cursor: pointer; font-size: 14px; }
.aph-date-picker-icon { font-size: 16px; }

.aph-dropdown-wrap { display: inline-flex; flex-direction: column; gap: 4px; }

.aph-empty-state { text-align: center; padding: 40px 20px; }
.aph-empty-icon { font-size: 48px; margin-bottom: 12px; }
.aph-empty-title { font-size: 16px; font-weight: 600; color: var(--foreground); margin-bottom: 8px; }

.aph-direction { display: flex; align-items: center; gap: 8px; }

.aph-field { display: flex; flex-direction: column; gap: 6px; }
.aph-field-desc { font-size: 13px; color: var(--muted-foreground); }

.aph-hover-card-wrap { display: inline-flex; flex-direction: column; gap: 8px; }
.aph-hover-trigger { color: var(--accent); text-decoration: underline; cursor: pointer; font-size: 14px; }
.aph-hover-card-content { border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; background: var(--background); font-size: 14px; color: var(--muted-foreground); line-height: 1.5; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

.aph-input-group { display: inline-flex; align-items: stretch; }
.aph-input-addon { display: flex; align-items: center; padding: 0 12px; background: var(--surface); border: 1px solid var(--border); font-size: 14px; color: var(--muted-foreground); }
.aph-input-addon:first-child { border-radius: var(--radius) 0 0 var(--radius); border-right: none; }
.aph-input-addon:last-child { border-radius: 0 var(--radius) var(--radius) 0; border-left: none; }
.aph-input-grouped { border-radius: 0; }

.aph-input-otp { display: inline-flex; align-items: center; gap: 6px; }
.aph-otp-slot { width: 40px; height: 48px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--background); }
.aph-otp-separator { color: var(--muted-foreground); font-size: 18px; }

.aph-item { padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius); }
.aph-item-title { font-size: 14px; font-weight: 500; color: var(--foreground); }

.aph-kbd { display: inline-flex; align-items: center; justify-content: center; padding: 2px 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; font-size: 12px; font-family: monospace; color: var(--foreground); min-width: 22px; box-shadow: 0 1px 0 var(--border); }
.aph-kbd-group { display: inline-flex; gap: 3px; }

.aph-menubar { display: inline-flex; border: 1px solid var(--border); border-radius: var(--radius); background: var(--background); padding: 4px; gap: 2px; }
.aph-menubar-item { padding: 6px 12px; font-size: 14px; font-weight: 500; color: var(--foreground); border-radius: var(--radius); cursor: pointer; transition: background 0.15s; }
.aph-menubar-item:hover { background: var(--surface); }

.aph-native-select { font-family: var(--font-body); font-size: 14px; padding: 10px 14px; background: var(--background); border: 1px solid var(--border); border-radius: var(--radius); color: var(--foreground); width: 100%; appearance: auto; }

.aph-nav-menu { display: flex; gap: 4px; }
.aph-nav-menu-link { padding: 8px 14px; font-size: 14px; font-weight: 500; color: var(--foreground); border-radius: var(--radius); cursor: pointer; transition: background 0.15s; }
.aph-nav-menu-link:hover { background: var(--surface); }

.aph-pagination { display: flex; align-items: center; gap: 4px; }
.aph-page-btn { padding: 6px 10px; font-size: 14px; border: 1px solid var(--border); border-radius: var(--radius); color: var(--foreground); cursor: pointer; background: var(--background); transition: background 0.15s; }
.aph-page-btn:hover { background: var(--surface); }
.aph-page-active { background: var(--accent); color: var(--accent-foreground); border-color: var(--accent); }

.aph-popover-wrap { display: inline-flex; flex-direction: column; gap: 8px; }
.aph-popover-content { border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; background: var(--background); font-size: 14px; color: var(--muted-foreground); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

.aph-progress { height: 8px; background: var(--surface); border-radius: 100px; overflow: hidden; width: 100%; }
.aph-progress-bar { height: 100%; background: var(--accent); border-radius: 100px; transition: width 0.3s; }

.aph-radio-group { display: flex; flex-direction: column; gap: 10px; }
.aph-radio-label { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--foreground); cursor: pointer; }
.aph-radio { width: 18px; height: 18px; border-radius: 50%; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.aph-radio-checked { border-color: var(--accent); }
.aph-radio-dot { width: 10px; height: 10px; border-radius: 50%; }
.aph-radio-checked .aph-radio-dot { background: var(--accent); }

.aph-resizable { display: flex; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; min-height: 160px; }
.aph-resizable-v { flex-direction: column; }
.aph-resizable-pane { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--muted-foreground); background: var(--background); padding: 20px; }
.aph-resizable-handle { width: 12px; background: var(--surface); display: flex; align-items: center; justify-content: center; color: var(--muted-foreground); font-size: 14px; cursor: col-resize; flex-shrink: 0; }
.aph-resizable-v .aph-resizable-handle { width: auto; height: 12px; cursor: row-resize; }

.aph-scroll-area { border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; position: relative; max-height: 200px; overflow: hidden; }
.aph-scroll-heading { font-size: 14px; font-weight: 600; color: var(--foreground); margin-bottom: 12px; }
.aph-scroll-item { padding: 6px 0; font-size: 14px; color: var(--foreground); border-bottom: 1px solid var(--border); }
.aph-scroll-track { position: absolute; top: 8px; right: 4px; bottom: 8px; width: 6px; background: var(--surface); border-radius: 3px; }
.aph-scroll-thumb { width: 100%; height: 40%; background: var(--muted-foreground); border-radius: 3px; opacity: 0.4; }

.aph-sidebar { border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; background: var(--background); min-width: 200px; }
.aph-sidebar-title { font-size: 14px; font-weight: 600; color: var(--foreground); margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.aph-sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
.aph-sidebar-link { padding: 8px 12px; font-size: 14px; color: var(--muted-foreground); border-radius: var(--radius); cursor: pointer; transition: background 0.15s; }
.aph-sidebar-link:hover { background: var(--surface); color: var(--foreground); }
.aph-sidebar-active { background: var(--surface); color: var(--foreground); font-weight: 500; }

.aph-skeleton { display: flex; flex-direction: column; gap: 12px; }
.aph-skeleton-line { height: 16px; background: var(--surface); border-radius: var(--radius); animation: aph-skeleton-pulse 1.5s ease-in-out infinite; }
.aph-skeleton-circle { width: 48px; height: 48px; border-radius: 50%; background: var(--surface); animation: aph-skeleton-pulse 1.5s ease-in-out infinite; }
@keyframes aph-skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.aph-slider { padding: 8px 0; }
.aph-slider-track { position: relative; height: 8px; background: var(--surface); border-radius: 100px; }
.aph-slider-fill { position: absolute; top: 0; left: 0; height: 100%; background: var(--accent); border-radius: 100px; }
.aph-slider-thumb { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; background: var(--background); border: 2px solid var(--accent); border-radius: 50%; cursor: pointer; }

.aph-sonner, .aph-toast { border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; background: var(--background); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.aph-sonner-title, .aph-toast-title { font-size: 14px; font-weight: 500; color: var(--foreground); margin-bottom: 4px; }
.aph-sonner-success { border-color: #22c55e; }
.aph-sonner-error { border-color: #ef4444; }
.aph-toast-destructive { border-color: #ef4444; }
.aph-toast-destructive .aph-toast-title { color: #ef4444; }

.aph-spinner { border: 3px solid var(--surface); border-top-color: var(--accent); border-radius: 50%; animation: aph-spin 0.8s linear infinite; }
@keyframes aph-spin { to { transform: rotate(360deg); } }

.aph-switch-label { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--foreground); cursor: pointer; }
.aph-switch { width: 44px; height: 24px; border-radius: 12px; background: var(--surface); border: 1px solid var(--border); position: relative; transition: background 0.2s; flex-shrink: 0; }
.aph-switch-checked { background: var(--accent); border-color: var(--accent); }
.aph-switch-thumb { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: var(--background); transition: transform 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
.aph-switch-checked .aph-switch-thumb { transform: translateX(20px); }

.aph-tabs { border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.aph-tab-list { display: flex; background: var(--surface); border-bottom: 1px solid var(--border); padding: 4px; gap: 2px; }
.aph-tab-btn { padding: 8px 16px; font-size: 14px; font-weight: 500; color: var(--muted-foreground); border-radius: var(--radius); cursor: pointer; background: transparent; border: none; transition: background 0.15s; }
.aph-tab-active { background: var(--background); color: var(--foreground); box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
.aph-tab-content { padding: 20px; font-size: 14px; color: var(--muted-foreground); line-height: 1.6; }

.aph-textarea { font-family: var(--font-body); font-size: 14px; padding: 10px 14px; background: var(--background); border: 1px solid var(--border); border-radius: var(--radius); color: var(--foreground); outline: none; width: 100%; resize: vertical; line-height: 1.5; transition: border-color 0.2s; }
.aph-textarea:focus { border-color: var(--accent); }

.aph-toggle { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--background); color: var(--muted-foreground); font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.aph-toggle:hover { background: var(--surface); }
.aph-toggle-pressed { background: var(--surface); color: var(--foreground); }
.aph-toggle-group { display: inline-flex; gap: 0; }
.aph-toggle-group .aph-toggle { border-radius: 0; margin-left: -1px; }
.aph-toggle-group .aph-toggle:first-child { border-radius: var(--radius) 0 0 var(--radius); margin-left: 0; }
.aph-toggle-group .aph-toggle:last-child { border-radius: 0 var(--radius) var(--radius) 0; }

.aph-tooltip-wrap { display: inline-flex; flex-direction: column; align-items: center; gap: 8px; }
.aph-tooltip-bubble { background: var(--foreground); color: var(--background); padding: 6px 12px; border-radius: var(--radius); font-size: 13px; white-space: nowrap; }

.aph-typo-h1 { font-family: var(--font-heading); font-size: 36px; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); line-height: 1.1; }
.aph-typo-h2 { font-family: var(--font-heading); font-size: 30px; font-weight: 700; letter-spacing: -0.02em; color: var(--foreground); line-height: 1.15; }
.aph-typo-h3 { font-family: var(--font-heading); font-size: 24px; font-weight: 600; color: var(--foreground); line-height: 1.2; }
.aph-typo-h4 { font-family: var(--font-heading); font-size: 20px; font-weight: 600; color: var(--foreground); line-height: 1.25; }
.aph-typo-p { font-size: 16px; color: var(--foreground); line-height: 1.7; }
.aph-typo-lead { font-size: 20px; color: var(--muted-foreground); line-height: 1.7; }
.aph-typo-large { font-size: 18px; font-weight: 600; color: var(--foreground); }
.aph-typo-small { font-size: 14px; color: var(--muted-foreground); line-height: 1.5; }
.aph-typo-muted { font-size: 14px; color: var(--muted-foreground); }
`;

const ANIMATION_CSS = `
.aph-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.aph-reveal.aph-visible {
  opacity: 1;
  transform: translateY(0);
}
.aph-reveal-delay-1 { transition-delay: 0.1s; }
.aph-reveal-delay-2 { transition-delay: 0.2s; }
.aph-reveal-delay-3 { transition-delay: 0.3s; }
.aph-reveal-delay-4 { transition-delay: 0.4s; }

.aph-stagger > * {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.aph-stagger.aph-visible > *:nth-child(1) { transition-delay: 0.05s; opacity: 1; transform: translateY(0); }
.aph-stagger.aph-visible > *:nth-child(2) { transition-delay: 0.12s; opacity: 1; transform: translateY(0); }
.aph-stagger.aph-visible > *:nth-child(3) { transition-delay: 0.15s; opacity: 1; transform: translateY(0); }
.aph-stagger.aph-visible > *:nth-child(4) { transition-delay: 0.22s; opacity: 1; transform: translateY(0); }
.aph-stagger.aph-visible > *:nth-child(5) { transition-delay: 0.29s; opacity: 1; transform: translateY(0); }
.aph-stagger.aph-visible > *:nth-child(6) { transition-delay: 0.36s; opacity: 1; transform: translateY(0); }

.aph-hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.aph-hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); }
`;

const RESPONSIVE_CSS = `
@media (max-width: 768px) {
  :root { --section-py: 56px; --inner-max: 100%; }
  .aph-hero-h1 { font-size: clamp(28px, 8vw, 48px); }
  .aph-hero-sub { font-size: 16px; }
  .aph-split-inner { grid-template-columns: 1fr; gap: 32px; }
  .aph-split-flip { direction: ltr; }
  .aph-feature-cards { grid-template-columns: 1fr; }
  .aph-product-grid { grid-template-columns: 1fr; }
  .aph-portfolio-grid { grid-template-columns: 1fr; }
  .aph-nav-links { display: none; }
  .aph-footer-top { flex-direction: column; gap: 32px; }
  .aph-footer-cols { flex-direction: column; }
  .aph-event-inner { grid-template-columns: 1fr; gap: 32px; }
  .aph-hero-cta { flex-direction: column; }
  .aph-hero-cta .aph-btn-accent, .aph-hero-cta .aph-btn-ghost { width: 100%; justify-content: center; }
  .aph-inner { padding: 0 20px; }
  .aph-primitive-wrap { padding-left: 20px; padding-right: 20px; }
}
@media (max-width: 480px) {
  :root { --section-py: 40px; }
  .aph-hero-h1 { font-size: clamp(24px, 7vw, 36px); }
  .aph-section-title { font-size: clamp(20px, 5vw, 28px); }
}
`;

const SCROLL_REVEAL_SCRIPT = `
<script>
(function(){
  var els = document.querySelectorAll('.aph-reveal, .aph-stagger');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(function(el){ el.classList.add('aph-visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('aph-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function(el){ io.observe(el); });
})();
</script>
`;
