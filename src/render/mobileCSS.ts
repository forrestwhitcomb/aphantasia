// ============================================================
// APHANTASIA — Mobile Component CSS (Layer 1)
// ============================================================
// Class-based stylesheet for mobile UI components.
// All values reference CSS custom properties set from
// UIDesignSystem tokens, so re-skinning is instant.
// Pattern mirrors sharedCSS.ts for site mode.
// ============================================================

export { MOBILE_BASE_CSS };

const MOBILE_BASE_CSS = `
/* ── Reset & Base ──────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  width: 393px;
  overflow-x: hidden;
  background: var(--color-bg);
  font-family: var(--font-family);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
}
button { -webkit-tap-highlight-color: transparent; border: none; cursor: pointer; font-family: var(--font-family); }
input, textarea { appearance: none; -webkit-appearance: none; font-family: var(--font-family); }

/* ── Navigation Bar ────────────────────────────────────────── */
.mob-nav {
  position: relative;
  top: 0;
  z-index: 50;
  width: 100%;
  height: var(--nav-height, 56px);
  background: var(--color-nav-bg, var(--color-bg));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--section-padding, 20px);
}
.mob-nav--sticky { position: sticky; }
.mob-nav--shadow { box-shadow: 0 1px 0 var(--color-border); }
.mob-nav--border { border-bottom: var(--border-width, 1px) solid var(--color-border); }
.mob-nav__title {
  font-family: var(--font-family);
  font-size: var(--font-subheading, 18px);
  font-weight: var(--font-weight-heading, 700);
  color: var(--color-text);
  letter-spacing: var(--letter-spacing-heading, -0.3px);
}
.mob-nav__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 8px);
}
.mob-nav__icon {
  width: var(--icon-size, 24px);
  height: var(--icon-size, 24px);
  border-radius: var(--radius-base, 8px);
  background: var(--color-surface-alt);
  display: flex;
  align-items: center;
  justify-content: center;
}
.mob-nav__back {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

/* ── Hero / Header ─────────────────────────────────────────── */
.mob-hero {
  width: 100%;
  padding: var(--spacing-xl, 32px) var(--section-padding, 20px) var(--spacing-lg, 24px);
}
.mob-hero--gradient {
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, var(--color-bg)) 0%, var(--color-bg) 100%);
}
.mob-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  border-radius: 100px;
  font-size: var(--font-caption, 12px);
  font-weight: 600;
  margin-bottom: var(--spacing-sm, 12px);
}
.mob-hero__heading {
  font-family: var(--font-family);
  font-size: var(--font-heading, 28px);
  font-weight: var(--font-weight-heading, 700);
  color: var(--color-text);
  letter-spacing: var(--letter-spacing-heading, -0.5px);
  line-height: var(--line-height-heading, 1.2);
  margin: 0;
}
.mob-hero__sub {
  font-size: var(--font-body, 15px);
  color: var(--color-text-muted);
  line-height: var(--line-height-body, 1.6);
  margin-top: var(--spacing-sm, 8px);
}
.mob-hero__cta {
  margin-top: var(--spacing-lg, 20px);
}

/* ── Cards ─────────────────────────────────────────────────── */
.mob-cards {
  width: 100%;
  padding: var(--spacing-base, 16px) var(--section-padding, 20px);
}
.mob-cards__title {
  font-family: var(--font-family);
  font-size: var(--font-subheading, 20px);
  font-weight: var(--font-weight-heading, 700);
  color: var(--color-text);
  letter-spacing: var(--letter-spacing-heading, normal);
  margin: 0 0 var(--spacing-base, 16px) 0;
}
.mob-cards__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm, 12px);
}
.mob-card {
  background: var(--color-surface);
  border-radius: var(--radius-card, 16px);
  padding: var(--card-padding, 16px);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm, 10px);
}
.mob-card--shadow { box-shadow: var(--shadow-card); }
.mob-card--border { border: var(--border-width, 1px) solid var(--color-card-border, var(--color-border)); }
.mob-card--flat { /* no elevation */ }
.mob-card__icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-base, 10px);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
}
.mob-card__icon-inner {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--color-primary) 25%, transparent);
}
.mob-card__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
}
.mob-card__desc {
  font-size: var(--font-caption, 12px);
  color: var(--color-text-muted);
  line-height: 1.5;
}

/* ── Section ───────────────────────────────────────────────── */
.mob-section {
  width: 100%;
  padding: var(--spacing-base, 16px) var(--section-padding, 20px);
}
.mob-section__heading {
  font-family: var(--font-family);
  font-size: var(--font-subheading, 20px);
  font-weight: var(--font-weight-heading, 700);
  color: var(--color-text);
  letter-spacing: var(--letter-spacing-heading, normal);
  line-height: var(--line-height-heading, 1.3);
  margin: 0;
}
.mob-section__body {
  font-size: var(--font-body, 15px);
  color: var(--color-text-muted);
  line-height: var(--line-height-body, 1.6);
  margin-top: var(--spacing-xs, 6px);
}
.mob-section__placeholder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs, 6px);
}
.mob-skel {
  background: var(--color-surface-alt);
  border-radius: var(--radius-tag, 6px);
  height: 12px;
}
.mob-skel--sm { height: 10px; }
.mob-skel--lg { height: 16px; }
.mob-skel--w50 { width: 50%; }
.mob-skel--w65 { width: 65%; }
.mob-skel--w80 { width: 80%; }
.mob-skel--w90 { width: 90%; }

/* ── Form ──────────────────────────────────────────────────── */
.mob-form {
  width: 100%;
  padding: var(--spacing-base, 16px) var(--section-padding, 20px);
}
.mob-form__title {
  font-family: var(--font-family);
  font-size: var(--font-subheading, 20px);
  font-weight: var(--font-weight-heading, 700);
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg, 20px) 0;
}
.mob-form__fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base, 14px);
}
.mob-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs, 6px);
}
.mob-form__label {
  font-size: var(--font-label, 13px);
  font-weight: 500;
  color: var(--color-text-muted);
}
.mob-input {
  width: 100%;
  height: var(--input-height, 48px);
  border-radius: var(--radius-input, 10px);
  font-size: var(--font-body, 15px);
  padding: 0 var(--spacing-base, 14px);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s;
}
.mob-input--bordered {
  background: var(--color-bg);
  border: var(--border-width, 1px) solid var(--color-border);
}
.mob-input--filled {
  background: var(--color-surface-alt);
  border: none;
}
.mob-input::placeholder {
  color: var(--color-text-muted);
  opacity: 0.5;
}

/* ── Button ────────────────────────────────────────────────── */
.mob-btn-wrap {
  width: 100%;
  padding: var(--spacing-sm, 12px) var(--section-padding, 20px);
}
.mob-btn {
  width: 100%;
  height: var(--button-height, 52px);
  border-radius: var(--radius-button, 12px);
  font-size: var(--font-body, 15px);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s, transform 0.15s;
}
.mob-btn:active { transform: scale(0.98); }
.mob-btn--primary {
  background: var(--color-primary);
  color: var(--color-btn-text, #fff);
}
.mob-btn--primary-shadow { box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent); }
.mob-btn--ghost {
  background: transparent;
  border: var(--border-width, 1px) solid var(--color-border);
  color: var(--color-text);
}
.mob-btn--secondary {
  background: var(--color-surface);
  color: var(--color-text);
}
.mob-btn--pill { border-radius: 100px; }

/* ── Tab Bar / Footer ──────────────────────────────────────── */
.mob-tab-bar {
  position: relative;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: var(--tab-bar-height, 64px);
  background: var(--color-nav-bg, var(--color-bg));
  display: flex;
  align-items: stretch;
  padding-bottom: env(safe-area-inset-bottom, 4px);
}
.mob-tab-bar--sticky { position: sticky; }
.mob-tab-bar--shadow { box-shadow: 0 -1px 0 var(--color-border); }
.mob-tab-bar--border { border-top: var(--border-width, 1px) solid var(--color-border); }
.mob-tab-bar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
}
.mob-tab-bar__icon {
  width: var(--icon-size, 24px);
  height: var(--icon-size, 24px);
  border-radius: var(--radius-base, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.mob-tab-bar__icon--active {
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
}
.mob-tab-bar__icon--inactive {
  background: var(--color-surface-alt);
}
.mob-tab-bar__label {
  font-size: 10px;
  font-weight: 500;
}
.mob-tab-bar__label--active { color: var(--color-primary); }
.mob-tab-bar__label--inactive { color: var(--color-text-muted); }
.mob-tab-bar__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}
.mob-tab-bar__dot--active { background: var(--color-primary); }

/* ── Text Block ────────────────────────────────────────────── */
.mob-text {
  width: 100%;
  padding: var(--spacing-base, 16px) var(--section-padding, 20px);
}
.mob-text__body {
  font-family: var(--font-family);
  font-size: var(--font-body, 15px);
  font-weight: var(--font-weight-body, 400);
  color: var(--color-text-muted);
  line-height: var(--line-height-body, 1.6);
  margin: 0;
}

/* ── Image Placeholder ─────────────────────────────────────── */
.mob-image {
  width: 100%;
  padding: 0 var(--section-padding, 20px);
  margin-bottom: var(--spacing-sm, 8px);
}
.mob-image__placeholder {
  width: 100%;
  background: linear-gradient(135deg, var(--color-surface-alt), var(--color-surface));
  border-radius: var(--radius-card, 16px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.mob-image__icon {
  opacity: 0.25;
}

/* ── List Section ──────────────────────────────────────────── */
.mob-list {
  width: 100%;
}
.mob-list__heading {
  font-family: var(--font-family);
  font-size: var(--font-label, 13px);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: var(--spacing-base, 16px) var(--section-padding, 20px) var(--spacing-sm, 8px);
  margin: 0;
}
.mob-list__row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 12px);
  padding: 0 var(--section-padding, 20px);
  height: var(--list-item-height, 64px);
  border-bottom: var(--border-width, 1px) solid var(--color-divider, var(--color-border));
}
.mob-list__avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-avatar, 50%);
  background: var(--color-surface-alt);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mob-list__avatar-icon {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
}
.mob-list__content {
  flex: 1;
  min-width: 0;
}
.mob-list__title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.3;
}
.mob-list__sub {
  font-size: var(--font-caption, 12px);
  color: var(--color-text-muted);
  line-height: 1.4;
  margin-top: 2px;
}
.mob-list__chevron {
  flex-shrink: 0;
  opacity: 0.3;
}

/* ── Generic / Fallback ────────────────────────────────────── */
.mob-generic {
  width: 100%;
  padding: var(--spacing-base, 16px) var(--section-padding, 20px);
}
.mob-generic__text {
  font-family: var(--font-family);
  font-size: var(--font-body, 15px);
  font-weight: var(--font-weight-body, 400);
  color: var(--color-text-muted);
  line-height: var(--line-height-body, 1.6);
  margin: 0;
}

/* ── Utility ───────────────────────────────────────────────── */
.mob-gap-xs { gap: var(--spacing-xs, 4px); }
.mob-gap-sm { gap: var(--spacing-sm, 8px); }
.mob-gap-base { gap: var(--spacing-base, 16px); }
.mob-gap-lg { gap: var(--spacing-lg, 24px); }
.mob-mt-sm { margin-top: var(--spacing-sm, 8px); }
.mob-mt-base { margin-top: var(--spacing-base, 16px); }
.mob-mt-lg { margin-top: var(--spacing-lg, 24px); }
`;
