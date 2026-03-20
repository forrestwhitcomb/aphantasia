// ============================================================
// APHANTASIA — Mobile Component CSS (Layer 1)
// ============================================================
// Class-based stylesheet for mobile UI components.
// All values reference CSS custom properties set from
// UIDesignSystem tokens, so re-skinning is instant.
// Variable names match designTokensCSS() in mobileComponents.ts.
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
/* Global section rhythm — shadcn-style spacing between blocks */
body > section + section,
body > div + section,
body > section + div {
  margin-top: var(--section-gap, 16px);
}
button { -webkit-tap-highlight-color: transparent; border: none; cursor: pointer; font-family: var(--font-family); }
input, textarea { appearance: none; -webkit-appearance: none; font-family: var(--font-family); }

/* ── Navigation Bar ────────────────────────────────────────── */
.mob-nav {
  position: relative;
  top: 0;
  z-index: 50;
  width: 100%;
  height: 56px;
  background: var(--nav-bg, var(--color-bg));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--screen-padding, 20px);
}
.mob-nav--sticky { position: sticky; }
.mob-nav--shadow { box-shadow: var(--shadow-nav, 0 1px 0 var(--color-separator)); }
.mob-nav--border { border-bottom: 1px solid var(--color-separator); }
.mob-nav__title {
  font-family: var(--font-family);
  font-size: var(--font-title3, 20px);
  font-weight: var(--nav-title-weight, 700);
  color: var(--color-text);
  letter-spacing: var(--tracking-heading, -0.3px);
}
.mob-nav__actions {
  display: flex;
  align-items: center;
  gap: var(--item-gap, 8px);
}
.mob-nav__icon {
  width: var(--icon-size, 24px);
  height: var(--icon-size, 24px);
  border-radius: var(--radius-sm, 8px);
  background: var(--color-bg-secondary);
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
/* Large-title nav (iOS-style) */
.mob-nav--large {
  flex-direction: column;
  align-items: stretch;
  height: auto;
  padding-bottom: var(--item-gap, 8px);
}
.mob-nav__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
}
.mob-nav__large-title {
  font-family: var(--font-family);
  font-size: var(--font-large-title, 34px);
  font-weight: var(--font-weight-large-title, 700);
  color: var(--color-text);
  letter-spacing: -0.4px;
  line-height: 1.1;
  margin: 0;
  padding: 0;
}

/* ── Hero / Header ─────────────────────────────────────────── */
.mob-hero {
  width: 100%;
  padding: var(--section-gap, 32px) var(--screen-padding, 20px) var(--inner-padding, 24px);
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
  border-radius: var(--radius-full, 100px);
  font-size: var(--font-caption, 12px);
  font-weight: 600;
  margin-bottom: var(--item-gap, 12px);
}
.mob-hero__heading {
  font-family: var(--font-family);
  font-size: var(--font-title1, 28px);
  font-weight: var(--font-weight-title1, 700);
  color: var(--color-text);
  letter-spacing: var(--tracking-heading, -0.5px);
  line-height: 1.2;
  margin: 0;
}
.mob-hero__sub {
  font-size: var(--font-body, 17px);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-top: var(--item-gap, 8px);
}
.mob-hero__cta {
  margin-top: var(--inner-padding, 20px);
}

/* ── Cards ─────────────────────────────────────────────────── */
.mob-cards {
  width: 100%;
  padding: var(--inner-padding, 16px) var(--screen-padding, 20px);
}
.mob-cards__title {
  font-family: var(--font-family);
  font-size: var(--font-title3, 20px);
  font-weight: var(--font-weight-title2, 700);
  color: var(--color-text);
  letter-spacing: var(--tracking-heading, normal);
  margin: 0 0 var(--inner-padding, 16px) 0;
}
.mob-cards__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--item-gap, 12px);
}
.mob-card {
  background: var(--color-surface);
  border-radius: var(--card-radius, 16px);
  padding: var(--card-padding, 16px);
  display: flex;
  flex-direction: column;
  gap: var(--item-gap, 10px);
  transition: box-shadow 0.2s, transform 0.2s;
}
.mob-card--shadow { box-shadow: var(--shadow-card, 0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)); }
.mob-card--border { border: 1px solid var(--color-separator); box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
.mob-card--flat { box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
.mob-card__icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md, 10px);
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
  font-size: var(--font-subhead, 15px);
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
}
.mob-card__desc {
  font-size: var(--font-caption, 12px);
  color: var(--color-text-muted);
  line-height: 1.5;
}

/* ── Section (card-style by default — shadcn pattern) ──────── */
.mob-section {
  width: calc(100% - var(--screen-padding, 20px) * 2);
  margin-left: var(--screen-padding, 20px);
  margin-right: var(--screen-padding, 20px);
  padding: var(--inner-padding, 20px);
  background: var(--color-surface, #fff);
  border-radius: var(--card-radius, 16px);
  box-shadow: var(--shadow-card, 0 2px 12px rgba(0,0,0,0.06));
}
.mob-section--flat {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  width: 100%;
  margin-left: 0;
  margin-right: 0;
  padding: var(--inner-padding, 16px) var(--screen-padding, 20px);
}
.mob-section__heading {
  font-family: var(--font-family);
  font-size: var(--font-title3, 20px);
  font-weight: var(--font-weight-title2, 700);
  color: var(--color-text);
  letter-spacing: var(--tracking-heading, normal);
  line-height: 1.3;
  margin: 0;
  text-align: center;
}
.mob-section__body {
  font-size: var(--font-subhead, 15px);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-top: 6px;
  text-align: center;
}
.mob-section__cta {
  margin-top: var(--inner-padding, 16px);
}
.mob-section__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  width: calc(100% - var(--screen-padding, 20px) * 2);
  margin: 0 auto;
  padding: var(--item-gap, 8px) 0;
}
.mob-section__divider::before,
.mob-section__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-separator);
}
.mob-section__divider-text {
  font-size: var(--font-footnote, 13px);
  color: var(--color-text-muted);
}
.mob-section__placeholder {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mob-skel {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm, 6px);
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
  padding: var(--inner-padding, 16px) var(--screen-padding, 20px);
}
.mob-form__title {
  font-family: var(--font-family);
  font-size: var(--font-title3, 20px);
  font-weight: var(--font-weight-title2, 700);
  color: var(--color-text);
  margin: 0 0 var(--inner-padding, 20px) 0;
}
.mob-form__fields {
  display: flex;
  flex-direction: column;
  gap: var(--inner-padding, 14px);
}
.mob-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mob-form__label {
  font-size: var(--font-footnote, 13px);
  font-weight: 500;
  color: var(--color-text-muted);
}
.mob-input {
  width: 100%;
  height: var(--input-height, 48px);
  border-radius: var(--input-radius, 10px);
  font-size: var(--font-callout, 16px);
  padding: 0 var(--inner-padding, 14px);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s;
}
.mob-input--bordered {
  background: var(--color-bg);
  border: 1px solid var(--color-separator);
}
.mob-input--filled {
  background: var(--color-bg-secondary);
  border: none;
}
.mob-input::placeholder {
  color: var(--color-text-tertiary);
  opacity: 1;
}

/* ── Button ────────────────────────────────────────────────── */
.mob-btn-wrap {
  width: 100%;
  padding: var(--item-gap, 12px) var(--screen-padding, 20px);
}
.mob-btn {
  width: 100%;
  height: var(--btn-height, 52px);
  border-radius: var(--btn-radius, 12px);
  font-size: var(--font-body, 17px);
  font-weight: var(--btn-weight, 600);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s, transform 0.15s;
}
.mob-btn:active { transform: scale(0.98); }
.mob-btn--primary {
  background: var(--color-primary);
  color: var(--color-primary-fg, #fff);
}
.mob-btn--primary-shadow { box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent); }
.mob-btn--tinted {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
}
.mob-btn--ghost {
  background: transparent;
  border: 1px solid var(--color-separator);
  color: var(--color-text);
}
.mob-btn--secondary {
  background: var(--color-surface);
  color: var(--color-text);
}
.mob-btn--pill { border-radius: var(--radius-full, 100px); }

/* ── Tab Bar / Footer ──────────────────────────────────────── */
.mob-tab-bar {
  position: relative;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 64px;
  background: var(--tab-bg, var(--color-bg));
  display: flex;
  align-items: stretch;
  padding-bottom: env(safe-area-inset-bottom, 4px);
}
.mob-tab-bar--sticky { position: sticky; }
.mob-tab-bar--shadow { box-shadow: 0 -1px 0 var(--color-separator); }
.mob-tab-bar--border { border-top: 1px solid var(--color-separator); }
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
  border-radius: var(--radius-sm, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.mob-tab-bar__icon--active {
  color: var(--tab-active, var(--color-primary));
}
.mob-tab-bar__icon--inactive {
  color: var(--tab-inactive, var(--color-text-tertiary));
}
.mob-tab-bar__label {
  font-size: 10px;
  font-weight: 500;
}
.mob-tab-bar__label--active { color: var(--tab-active, var(--color-primary)); }
.mob-tab-bar__label--inactive { color: var(--tab-inactive, var(--color-text-tertiary)); }
.mob-tab-bar__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}
.mob-tab-bar__dot--active { background: var(--tab-active, var(--color-primary)); }

/* ── Text Block ────────────────────────────────────────────── */
.mob-text {
  width: 100%;
  padding: var(--inner-padding, 16px) var(--screen-padding, 20px);
}
.mob-text__body {
  font-family: var(--font-family);
  font-size: var(--font-body, 17px);
  font-weight: var(--font-weight-body, 400);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

/* ── Image Placeholder ─────────────────────────────────────── */
.mob-image {
  width: 100%;
  padding: 0 var(--screen-padding, 20px);
  margin-bottom: var(--item-gap, 8px);
}
.mob-image__placeholder {
  width: 100%;
  background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-surface));
  border-radius: var(--card-radius, 16px);
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
  font-size: var(--font-footnote, 13px);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: var(--inner-padding, 16px) var(--screen-padding, 20px) var(--item-gap, 8px);
  margin: 0;
}
.mob-list__row {
  display: flex;
  align-items: center;
  gap: var(--item-gap, 12px);
  padding: 0 var(--screen-padding, 20px);
  height: var(--list-item-height, 56px);
  border-bottom: 1px solid var(--color-separator);
}
.mob-list__avatar {
  width: var(--avatar-size, 40px);
  height: var(--avatar-size, 40px);
  border-radius: var(--radius-full, 50%);
  background: var(--color-bg-secondary);
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
  font-size: var(--font-subhead, 15px);
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
.mob-list__divider {
  height: 0.5px;
  background: var(--color-separator);
}
/* Inset-grouped list (iOS Settings style) */
.mob-list--inset { padding: 0 var(--screen-padding, 20px); }
.mob-list--inset .mob-list__heading {
  padding-left: 0;
  padding-right: 0;
}
.mob-list__group {
  background: var(--color-surface);
  border-radius: var(--radius-md, 12px);
  overflow: hidden;
}
.mob-list--inset .mob-list__row {
  padding: 0 var(--inner-padding, 16px);
  border-bottom: none;
}
/* Card-style list items */
.mob-list__row--card {
  background: var(--color-surface);
  border-radius: var(--radius-md, 12px);
  margin: 0 var(--screen-padding, 20px) var(--item-gap, 8px);
  padding: 0 var(--inner-padding, 16px);
  border-bottom: none;
  box-shadow: var(--shadow-card);
}

/* ── Generic / Fallback (card-style) ──────────────────────── */
.mob-generic {
  width: calc(100% - var(--screen-padding, 20px) * 2);
  margin-left: var(--screen-padding, 20px);
  margin-right: var(--screen-padding, 20px);
  padding: var(--inner-padding, 20px);
  background: var(--color-surface, #fff);
  border-radius: var(--card-radius, 16px);
  box-shadow: var(--shadow-card, 0 2px 12px rgba(0,0,0,0.06));
}
.mob-generic__text {
  font-family: var(--font-family);
  font-size: var(--font-body, 17px);
  font-weight: var(--font-weight-body, 400);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

/* ── Status Bar ────────────────────────────────────────────── */
.mob-status-bar {
  width: 100%;
  height: 54px;
  padding: 14px var(--screen-padding, 20px) 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-family);
  letter-spacing: 0.2px;
}
.mob-status-bar__time { line-height: 1; }
.mob-status-bar__right { display: flex; align-items: center; gap: 6px; }
.mob-status-bar__battery { display: flex; align-items: center; gap: 1px; }
.mob-status-bar__battery-body {
  width: 22px; height: 11px;
  border: 1.5px solid currentColor;
  border-radius: 2.5px;
  padding: 1px;
}
.mob-status-bar__battery-fill {
  width: 75%; height: 100%;
  background: currentColor;
  border-radius: 1px;
}
.mob-status-bar__battery-cap {
  width: 1.5px; height: 5px;
  background: currentColor;
  border-radius: 0 1px 1px 0;
  opacity: 0.5;
}

/* ── Home Indicator ────────────────────────────────────────── */
.mob-home-indicator {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
}
.mob-home-indicator__bar {
  width: 134px;
  height: 5px;
  border-radius: 100px;
  opacity: 0.2;
}

/* ── Search Bar ────────────────────────────────────────────── */
.mob-search {
  width: 100%;
  padding: var(--item-gap, 8px) var(--screen-padding, 20px);
}
.mob-search__inner {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border-radius: var(--radius-md, 10px);
}
.mob-search--filled .mob-search__inner { background: var(--color-bg-secondary); }
.mob-search--bordered .mob-search__inner { background: var(--color-bg); border: 1px solid var(--color-separator); }
.mob-search__icon { color: var(--color-text-tertiary); flex-shrink: 0; }
.mob-search__placeholder { color: var(--color-text-tertiary); font-size: var(--font-callout, 16px); }

/* ── Section Header ────────────────────────────────────────── */
.mob-section-header {
  width: 100%;
  padding: var(--inner-padding, 16px) var(--screen-padding, 20px) var(--item-gap, 8px);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mob-section-header__label {
  font-family: var(--font-family);
  font-size: var(--font-title3, 20px);
  font-weight: var(--font-weight-title2, 700);
  color: var(--color-text);
  margin: 0;
}
.mob-section-header__action {
  font-size: var(--font-subhead, 15px);
  font-weight: 500;
  color: var(--color-primary);
}

/* ── Profile Header ────────────────────────────────────────── */
.mob-profile {
  width: 100%;
  padding: var(--section-gap, 24px) var(--screen-padding, 20px) var(--inner-padding, 16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.mob-profile__avatar {
  width: 80px; height: 80px;
  border-radius: var(--radius-full, 50%);
  background: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--item-gap, 12px);
}
.mob-profile__avatar-inner { color: var(--color-text-tertiary); }
.mob-profile__name {
  font-family: var(--font-family);
  font-size: var(--font-title2, 22px);
  font-weight: var(--font-weight-title2, 700);
  color: var(--color-text);
  margin: 0;
}
.mob-profile__bio {
  font-size: var(--font-subhead, 15px);
  color: var(--color-text-muted);
  margin: 4px 0 0;
  line-height: 1.4;
}
.mob-profile__actions {
  display: flex;
  gap: var(--item-gap, 8px);
  width: 100%;
  margin-top: var(--inner-padding, 16px);
}

/* ── Stats Row ─────────────────────────────────────────────── */
.mob-stats {
  width: 100%;
  display: flex;
  padding: var(--item-gap, 8px) var(--screen-padding, 20px);
  border-top: 1px solid var(--color-separator);
  border-bottom: 1px solid var(--color-separator);
}
.mob-stats__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--item-gap, 8px) 0;
}
.mob-stats__value {
  font-family: var(--font-family);
  font-size: var(--font-headline, 17px);
  font-weight: var(--font-weight-heading, 600);
  color: var(--color-text);
}
.mob-stats__label {
  font-size: var(--font-caption, 12px);
  color: var(--color-text-muted);
}

/* ── Segmented Control ─────────────────────────────────────── */
.mob-segments {
  width: 100%;
  padding: var(--item-gap, 8px) var(--screen-padding, 20px);
}
.mob-segments__track {
  display: flex;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md, 10px);
  padding: 2px;
}
.mob-segments__item {
  flex: 1;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  font-size: var(--font-footnote, 13px);
  font-weight: 500;
  color: var(--color-text-muted);
  border-radius: calc(var(--radius-md, 10px) - 2px);
  background: transparent;
  transition: all 0.2s;
}
.mob-segments__item--active {
  background: var(--color-surface-elevated, #fff);
  color: var(--color-text);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

/* ── FAB ───────────────────────────────────────────────────── */
.mob-fab {
  position: relative;
  width: 100%;
  height: 0;
  pointer-events: none;
}
.mob-fab__btn {
  position: absolute;
  right: var(--screen-padding, 20px);
  bottom: 16px;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg, 16px);
  background: var(--color-primary);
  color: var(--color-primary-fg, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 35%, transparent);
  pointer-events: auto;
}
.mob-fab--extended .mob-fab__btn {
  width: auto;
  padding: 0 20px;
  border-radius: var(--radius-full, 100px);
}
.mob-fab__label {
  font-family: var(--font-family);
  font-size: var(--font-subhead, 15px);
  font-weight: 600;
}

/* ── Bottom Sheet ──────────────────────────────────────────── */
.mob-sheet {
  width: 100%;
  background: var(--color-surface-elevated, #fff);
  border-radius: var(--radius-lg, 16px) var(--radius-lg, 16px) 0 0;
  padding: 8px var(--screen-padding, 20px) var(--inner-padding, 16px);
  box-shadow: var(--shadow-sheet, 0 -4px 24px rgba(0,0,0,0.12));
  margin-top: auto;
}
.mob-sheet__handle {
  width: 36px; height: 5px;
  border-radius: 100px;
  background: var(--color-separator);
  margin: 0 auto 12px;
}
.mob-sheet__title {
  font-family: var(--font-family);
  font-size: var(--font-headline, 17px);
  font-weight: var(--font-weight-heading, 600);
  color: var(--color-text);
  margin: 0 0 12px;
}
.mob-sheet__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* ── Modal / Dialog ────────────────────────────────────────── */
.mob-modal {
  width: 100%;
  padding: var(--section-gap, 24px) var(--screen-padding, 20px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.mob-modal__card {
  width: 100%;
  max-width: 280px;
  background: var(--color-surface-elevated, #fff);
  border-radius: var(--radius-lg, 16px);
  padding: var(--inner-padding, 20px);
  box-shadow: var(--shadow-sheet, 0 12px 40px rgba(0,0,0,0.15));
  text-align: center;
}
.mob-modal__title {
  font-family: var(--font-family);
  font-size: var(--font-headline, 17px);
  font-weight: var(--font-weight-heading, 600);
  color: var(--color-text);
  margin: 0 0 8px;
}
.mob-modal__body {
  font-size: var(--font-footnote, 13px);
  color: var(--color-text-muted);
  margin: 0 0 16px;
  line-height: 1.5;
}
.mob-modal__actions {
  display: flex;
  gap: var(--item-gap, 8px);
}

/* ── Toast / Snackbar ──────────────────────────────────────── */
.mob-toast {
  width: 100%;
  padding: var(--item-gap, 8px) var(--screen-padding, 20px);
}
.mob-toast__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-text, #1a1a1a);
  border-radius: var(--radius-md, 12px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.mob-toast__text {
  font-family: var(--font-family);
  font-size: var(--font-subhead, 15px);
  color: var(--color-bg, #fff);
}
.mob-toast__action {
  font-family: var(--font-family);
  font-size: var(--font-subhead, 15px);
  font-weight: 600;
  color: var(--color-primary);
  background: none;
  padding: 0;
}

/* ── Media Cell ────────────────────────────────────────────── */
.mob-media {
  width: 100%;
  position: relative;
}
.mob-media__image {
  width: 100%;
  background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-surface));
  display: flex;
  align-items: center;
  justify-content: center;
}
.mob-media__icon { opacity: 0.2; }
.mob-media__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px var(--screen-padding, 20px);
  background: linear-gradient(transparent, rgba(0,0,0,0.5));
}
.mob-media__meta { display: flex; flex-direction: column; gap: 4px; }

/* ── Empty State ───────────────────────────────────────────── */
.mob-empty {
  width: 100%;
  padding: var(--section-gap, 48px) var(--screen-padding, 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.mob-empty__icon {
  color: var(--color-text-tertiary);
  margin-bottom: var(--inner-padding, 16px);
}
.mob-empty__title {
  font-family: var(--font-family);
  font-size: var(--font-headline, 17px);
  font-weight: var(--font-weight-heading, 600);
  color: var(--color-text);
  margin: 0 0 4px;
}
.mob-empty__body {
  font-size: var(--font-subhead, 15px);
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.5;
}

/* ── Utility ───────────────────────────────────────────────── */
.mob-gap-xs { gap: 4px; }
.mob-gap-sm { gap: var(--item-gap, 8px); }
.mob-gap-base { gap: var(--inner-padding, 16px); }
.mob-gap-lg { gap: var(--section-gap, 24px); }
.mob-mt-sm { margin-top: var(--item-gap, 8px); }
.mob-mt-base { margin-top: var(--inner-padding, 16px); }
.mob-mt-lg { margin-top: var(--section-gap, 24px); }
`;
