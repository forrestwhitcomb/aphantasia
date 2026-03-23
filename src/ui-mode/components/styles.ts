// ============================================================
// APHANTASIA — UI Mode Component Stylesheet
// ============================================================
// Class-based CSS for all 32 UI components.
// CRITICAL RULE: Every value reads from a CSS custom property.
// No hardcoded hex colors, no hardcoded pixel values.
// If you write "#fff" or "16px" anywhere here, it's wrong.
// Use var(--color-*), var(--spacing-*), var(--radius-*), etc.
// ============================================================

export const UI_COMPONENT_CSS = `
/* ── Reset & Base ─────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  width: 393px;
  overflow-x: hidden;
  background: var(--color-background);
  font-family: var(--font-body-family);
  font-weight: var(--font-body-weight);
  color: var(--color-foreground);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
  letter-spacing: var(--font-body-ls);
  font-size: var(--font-size-base);
}
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
button { -webkit-tap-highlight-color: transparent; border: none; cursor: pointer; font-family: var(--font-body-family); }
input, textarea { appearance: none; -webkit-appearance: none; font-family: var(--font-body-family); }

/* Section rhythm — tight vertical flow, no double-padding */
body > * + * { margin-top: var(--spacing-sm); }
body > .ui-status-bar + * { margin-top: 0; }
body > .ui-navbar + * { margin-top: 0; }
body > .ui-tabbar { margin-top: auto; }
body > .ui-tabbar ~ .ui-home-indicator { margin-top: 0; }
body > .ui-home-indicator { margin-top: auto; }

/* ── Status Bar ───────────────────────────────────────────── */
.ui-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-xs) var(--spacing-lg);
  height: 44px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  background: var(--color-background);
  color: var(--color-foreground);
}
.ui-status-bar--dark { color: var(--color-foreground); }
.ui-status-bar--light { color: var(--color-background); }
.ui-status-bar__time { font-variant-numeric: tabular-nums; }
.ui-status-bar__right { display: flex; align-items: center; gap: var(--spacing-xs); }
.ui-status-bar__battery { display: flex; align-items: center; gap: 1px; }
.ui-status-bar__battery-body {
  width: 22px; height: 11px;
  border: 1.5px solid currentColor;
  border-radius: 2px;
  padding: 1px;
  position: relative;
}
.ui-status-bar__battery-fill {
  width: 75%;
  height: 100%;
  background: currentColor;
  border-radius: 1px;
}
.ui-status-bar__battery-cap {
  width: 2px; height: 5px;
  background: currentColor;
  border-radius: 0 1px 1px 0;
  opacity: 0.5;
}

/* ── NavBar ───────────────────────────────────────────────── */
.ui-navbar {
  position: relative;
  top: 0;
  z-index: 50;
  width: 100%;
  height: var(--comp-navbar-height);
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-md);
  border-bottom: var(--comp-navbar-border-bottom);
}
.ui-navbar--standard .ui-navbar__title {
  font-family: var(--font-heading-family);
  font-size: var(--font-size-lg);
  font-weight: var(--font-heading-weight);
  letter-spacing: var(--font-heading-ls);
  color: var(--color-foreground);
}
.ui-navbar__actions { display: flex; align-items: center; gap: var(--spacing-sm); }
.ui-navbar__icon {
  width: var(--spacing-xl);
  height: var(--spacing-xl);
  border-radius: var(--radius-sm);
  background: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-foreground);
}
.ui-navbar__back {
  width: var(--spacing-xl);
  height: var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

/* NavBar: large-title */
.ui-navbar--large-title {
  height: auto;
  flex-direction: column;
  align-items: stretch;
  padding-bottom: var(--spacing-sm);
}
.ui-navbar--large-title .ui-navbar__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--comp-navbar-height);
}
.ui-navbar--large-title .ui-navbar__large-heading {
  font-family: var(--font-heading-family);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-heading-weight);
  letter-spacing: var(--font-heading-ls);
  color: var(--color-foreground);
  padding: 0 var(--spacing-xs);
}

/* NavBar: search */
.ui-navbar--search { height: auto; flex-direction: column; align-items: stretch; gap: var(--spacing-sm); padding-bottom: var(--spacing-sm); }
.ui-navbar--search .ui-navbar__search-field {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-secondary);
  border-radius: var(--radius-input);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-muted-foreground);
  font-size: var(--font-size-base);
}

/* NavBar: segmented */
.ui-navbar--segmented { height: auto; flex-direction: column; align-items: stretch; gap: var(--spacing-sm); padding-bottom: var(--spacing-sm); }

/* ── TabBar ───────────────────────────────────────────────── */
.ui-tabbar {
  position: relative;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: var(--comp-tabbar-height);
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 var(--spacing-sm);
  border-top: var(--comp-navbar-border-bottom);
}
.ui-tabbar--sticky { position: sticky; }
.ui-tabbar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  padding: var(--spacing-xs) 0;
}
.ui-tabbar__icon {
  width: var(--comp-tabbar-icon-size);
  height: var(--comp-tabbar-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted-foreground);
}
.ui-tabbar__icon--active { color: var(--color-primary); }
.ui-tabbar__label {
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
  font-weight: 500;
}
.ui-tabbar__label--active { color: var(--color-primary); }

/* TabBar: pill-active */
.ui-tabbar--pill-active .ui-tabbar__item--active {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-md);
  flex-direction: row;
  gap: var(--spacing-xs);
}
.ui-tabbar--pill-active .ui-tabbar__item--active .ui-tabbar__icon { color: var(--color-primary-foreground); }
.ui-tabbar--pill-active .ui-tabbar__item--active .ui-tabbar__label { color: var(--color-primary-foreground); }

/* ── Card ─────────────────────────────────────────────────── */
.ui-card {
  background: var(--color-card);
  color: var(--color-card-foreground);
  border-radius: var(--radius-card);
  padding: var(--comp-card-padding);
  display: flex;
  flex-direction: column;
  gap: var(--comp-card-gap);
}
.ui-card--elevated { box-shadow: var(--shadow-card); }
.ui-card--bordered { border: 1px solid var(--color-border); }
.ui-card--filled { background: var(--color-secondary); }
.ui-card--image-top { padding: 0; overflow: hidden; }
.ui-card--image-top .ui-card__image {
  width: 100%;
  aspect-ratio: 16/9;
  background: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted-foreground);
}
.ui-card--image-top .ui-card__body { padding: var(--comp-card-padding); display: flex; flex-direction: column; gap: var(--comp-card-gap); }
.ui-card__icon {
  width: var(--spacing-xl);
  height: var(--spacing-xl);
  border-radius: var(--radius-md);
  background: var(--color-primary);
  opacity: 0.15;
  position: relative;
}
.ui-card__icon::after {
  content: '';
  position: absolute;
  inset: 25%;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
}
.ui-card__title {
  font-family: var(--font-heading-family);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-card-foreground);
  letter-spacing: var(--font-heading-ls);
}
.ui-card__description {
  font-size: var(--font-size-sm);
  color: var(--color-muted-foreground);
  line-height: 1.5;
}

/* In-card text and buttons should align to card content width */
.ui-card > .ui-header,
.ui-card__body > .ui-header {
  width: 100%;
  padding: 0;
}
.ui-card > .ui-btn-wrap,
.ui-card__body > .ui-btn-wrap {
  width: 100%;
  padding: 0;
}
.ui-card > .ui-btn-wrap .ui-btn,
.ui-card__body > .ui-btn-wrap .ui-btn {
  width: 100%;
}

/* Two buttons on same row inside card */
.ui-card__actions-row {
  display: flex;
  gap: var(--spacing-sm);
  width: 100%;
}
.ui-card__actions-col {
  flex: 1;
  min-width: 0;
}
.ui-card__actions-col .ui-btn-wrap {
  width: 100%;
  padding: 0;
}
.ui-card__actions-col .ui-btn {
  width: 100%;
}

/* Cards container */
.ui-cards { padding: 0 var(--spacing-md); }
.ui-cards__title {
  font-family: var(--font-heading-family);
  font-size: var(--font-size-xl);
  font-weight: var(--font-heading-weight);
  color: var(--color-foreground);
  letter-spacing: var(--font-heading-ls);
  margin-bottom: var(--spacing-md);
}
.ui-cards__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}
.ui-cards__grid--single { grid-template-columns: 1fr; }
.ui-cards__grid--three { grid-template-columns: repeat(3, 1fr); }

/* ── Header ──────────────────────────────────────────────── */
.ui-header {
  padding: 0 var(--spacing-md);
}
.ui-header__text {
  font-family: var(--font-heading-family);
  font-weight: var(--font-heading-weight);
  letter-spacing: var(--font-heading-ls);
  color: var(--color-foreground);
  line-height: 1.2;
}
.ui-header--large .ui-header__text { font-size: var(--font-size-3xl); }
.ui-header--medium .ui-header__text { font-size: var(--font-size-xl); }
.ui-header--small .ui-header__text { font-size: var(--font-size-lg); font-weight: 600; }

/* Multi-line canvas text: headline + subheader + paragraphs */
.ui-text-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: stretch;
}
.ui-text-stack > .ui-header--large,
.ui-text-stack > .ui-header--medium {
  padding: 0;
}
.ui-text-block__p {
  font-family: var(--font-body-family);
  font-size: var(--font-size-base);
  font-weight: 400;
  color: var(--color-muted-foreground);
  line-height: 1.55;
  margin: 0;
  padding: 0;
}

/* ── ListItem ─────────────────────────────────────────────── */
.ui-list-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  min-height: var(--comp-list-item-height);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-card);
  color: var(--color-foreground);
}
.ui-list-item__icon {
  width: var(--spacing-xl);
  height: var(--spacing-xl);
  border-radius: var(--radius-md);
  background: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-primary);
}
.ui-list-item__content { flex: 1; min-width: 0; }
.ui-list-item__title {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-foreground);
  line-height: 1.3;
}
.ui-list-item__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-muted-foreground);
  line-height: 1.3;
}
.ui-list-item__trailing {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: var(--color-muted-foreground);
}
.ui-list-item__value {
  font-size: var(--font-size-sm);
  color: var(--color-muted-foreground);
}
.ui-list-item--destructive .ui-list-item__title { color: var(--color-destructive); }
.ui-list-item--destructive .ui-list-item__icon { color: var(--color-destructive); background: none; }

/* ── ListGroup ────────────────────────────────────────────── */
.ui-list-group { }
.ui-list-group__heading {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--spacing-sm) var(--spacing-md);
}
.ui-list-group--inset .ui-list-group__items {
  margin: 0 var(--spacing-md);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-card);
}
.ui-list-group--plain .ui-list-group__items { background: var(--color-card); }
.ui-list-group--separated .ui-list-group__items { display: flex; flex-direction: column; gap: var(--spacing-sm); padding: 0 var(--spacing-md); }
.ui-list-group--separated .ui-list-item {
  border-radius: var(--radius-lg);
  background: var(--color-card);
  border: 1px solid var(--color-border);
}
.ui-list-divider {
  height: 1px;
  background: var(--color-border);
  margin-left: var(--spacing-md);
}
.ui-list-group--inset .ui-list-divider { margin-left: calc(var(--spacing-xl) + var(--spacing-md) + var(--spacing-md)); }

/* ── SectionHeader ────────────────────────────────────────── */
.ui-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
}
.ui-section-header__label {
  font-family: var(--font-heading-family);
  font-size: var(--font-size-xl);
  font-weight: var(--font-heading-weight);
  color: var(--color-foreground);
  letter-spacing: var(--font-heading-ls);
}
.ui-section-header__action {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-primary);
}

/* ── Divider ──────────────────────────────────────────────── */
.ui-divider {
  height: 1px;
  background: var(--color-border);
}
.ui-divider--inset { margin-left: var(--spacing-md); margin-right: var(--spacing-md); }
.ui-divider--with-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: none;
  height: auto;
  padding: 0 var(--spacing-md);
}
.ui-divider--with-text::before,
.ui-divider--with-text::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}
.ui-divider__text {
  font-size: var(--font-size-sm);
  color: var(--color-muted-foreground);
  white-space: nowrap;
}

/* ── Toggle (used in list items) ──────────────────────────── */
.ui-toggle {
  width: 51px;
  height: 31px;
  border-radius: var(--radius-full);
  background: var(--color-muted);
  position: relative;
  transition: background 0.2s;
}
.ui-toggle--on { background: var(--color-primary); }
.ui-toggle__thumb {
  width: 27px;
  height: 27px;
  border-radius: var(--radius-full);
  background: var(--color-background);
  box-shadow: var(--shadow-sm);
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}
.ui-toggle--on .ui-toggle__thumb { transform: translateX(20px); }

/* ── Skeleton / Placeholder ───────────────────────────────── */
.ui-skel {
  height: var(--spacing-md);
  background: var(--color-muted);
  border-radius: var(--radius-sm);
  width: 100%;
}
.ui-skel--sm { height: var(--spacing-sm); }
.ui-skel--w50 { width: 50%; }
.ui-skel--w65 { width: 65%; }
.ui-skel--w80 { width: 80%; }
.ui-skel--w90 { width: 90%; }

/* ── Home Indicator ───────────────────────────────────────── */
.ui-home-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--spacing-xl);
  padding-bottom: var(--spacing-sm);
}
.ui-home-indicator__bar {
  width: 134px;
  height: 5px;
  border-radius: var(--radius-full);
  background: var(--color-foreground);
  opacity: 0.2;
}

/* ── Button ───────────────────────────────────────────────── */
.ui-btn-wrap { padding: 0 var(--spacing-md); }
.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  height: var(--comp-button-height);
  padding: 0 var(--comp-button-padding-x);
  font-size: var(--comp-button-font-size);
  font-weight: 600;
  font-family: var(--font-body-family);
  border: none;
  border-radius: var(--radius-button);
  cursor: pointer;
  transition: opacity 0.15s;
  width: 100%;
}
.ui-btn--primary {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  box-shadow: var(--shadow-button);
}
.ui-btn--secondary {
  background: var(--color-secondary);
  color: var(--color-secondary-foreground);
}
.ui-btn--outline {
  background: transparent;
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
}
.ui-btn--ghost {
  background: transparent;
  color: var(--color-foreground);
}
.ui-btn--destructive {
  background: var(--color-destructive);
  color: var(--color-primary-foreground);
}
.ui-btn--icon-only {
  width: var(--comp-button-height);
  height: var(--comp-button-height);
  padding: 0;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

/* ── TextInput ────────────────────────────────────────────── */
.ui-input-wrap { padding: 0 var(--spacing-md); }
.ui-input__label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-foreground);
  margin-bottom: var(--spacing-xs);
}
.ui-input {
  display: flex;
  align-items: center;
  height: var(--comp-input-height);
  padding: 0 var(--comp-input-padding-x);
  font-size: var(--comp-input-font-size);
  font-family: var(--font-body-family);
  background: var(--color-background);
  border: 1px solid var(--color-input);
  border-radius: var(--radius-input);
  color: var(--color-foreground);
  box-shadow: var(--shadow-input);
}
.ui-input--with-icon { gap: var(--spacing-sm); }
.ui-input__icon { color: var(--color-muted-foreground); flex-shrink: 0; }
.ui-input__placeholder { color: var(--color-muted-foreground); }
.ui-textarea {
  min-height: calc(var(--comp-input-height) * 2.5);
  padding: var(--spacing-sm) var(--comp-input-padding-x);
  font-size: var(--comp-input-font-size);
  font-family: var(--font-body-family);
  background: var(--color-background);
  border: 1px solid var(--color-input);
  border-radius: var(--radius-input);
  box-shadow: var(--shadow-input);
}
.ui-textarea__placeholder { color: var(--color-muted-foreground); }

/* ── SearchBar ────────────────────────────────────────────── */
.ui-search {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
}
.ui-search__field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-secondary);
  border-radius: var(--radius-input);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-muted-foreground);
  font-size: var(--font-size-base);
}
.ui-search__icon { flex-shrink: 0; color: var(--color-muted-foreground); }
.ui-search__placeholder { color: var(--color-muted-foreground); }
.ui-search__cancel {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-primary);
  background: none;
  padding: 0;
}
.ui-search__filter {
  width: var(--spacing-xl);
  height: var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-secondary);
  border-radius: var(--radius-md);
  color: var(--color-foreground);
}

/* ── Toggle row ───────────────────────────────────────────── */
.ui-toggle-wrap { padding: 0 var(--spacing-md); }
.ui-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
}
.ui-toggle-row__label {
  font-size: var(--font-size-base);
  color: var(--color-foreground);
}

/* ── Checkbox ─────────────────────────────────────────────── */
.ui-checkbox-wrap { padding: 0 var(--spacing-md); }
.ui-checkbox-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
}
.ui-checkbox-row__label {
  font-size: var(--font-size-base);
  color: var(--color-foreground);
}
.ui-checkbox {
  width: var(--spacing-lg);
  height: var(--spacing-lg);
  border: 1px solid var(--color-input);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-background);
}
.ui-checkbox--checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

/* ── SegmentedControl ─────────────────────────────────────── */
.ui-segments { padding: 0 var(--spacing-md); }
.ui-segments__track {
  display: flex;
  background: var(--color-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
}
.ui-segments__item {
  flex: 1;
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  border: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  font-family: var(--font-body-family);
  cursor: pointer;
  background: transparent;
  color: var(--color-muted-foreground);
  transition: all 0.15s;
}
.ui-segments__item--active {
  background: var(--color-background);
  color: var(--color-foreground);
  box-shadow: var(--shadow-sm);
}
.ui-segments--pill .ui-segments__track { border-radius: var(--radius-full); }
.ui-segments--pill .ui-segments__item { border-radius: var(--radius-full); }
.ui-segments--pill .ui-segments__item--active {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

/* ── Slider ───────────────────────────────────────────────── */
.ui-slider-wrap { padding: 0 var(--spacing-md); }
.ui-slider__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}
.ui-slider__label {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-foreground);
}
.ui-slider__value {
  font-size: var(--font-size-sm);
  color: var(--color-muted-foreground);
  font-variant-numeric: tabular-nums;
}
.ui-slider__track {
  position: relative;
  height: var(--spacing-xs);
  background: var(--color-muted);
  border-radius: var(--radius-full);
}
.ui-slider__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
}
.ui-slider__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: var(--spacing-lg);
  height: var(--spacing-lg);
  background: var(--color-background);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
}
.ui-slider__labels {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-muted-foreground);
}

/* ── Stepper ──────────────────────────────────────────────── */
.ui-stepper-wrap { padding: 0 var(--spacing-md); }
.ui-stepper-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
}
.ui-stepper-row__label {
  font-size: var(--font-size-base);
  color: var(--color-foreground);
}
.ui-stepper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
}
.ui-stepper__btn {
  width: var(--spacing-xl);
  height: var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  border-radius: var(--radius-sm);
  color: var(--color-foreground);
  box-shadow: var(--shadow-sm);
}
.ui-stepper__value {
  min-width: var(--spacing-xl);
  text-align: center;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-foreground);
  font-variant-numeric: tabular-nums;
}

/* ── Avatar ───────────────────────────────────────────────── */
.ui-avatar {
  width: var(--spacing-2xl);
  height: var(--spacing-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-secondary);
  color: var(--color-muted-foreground);
  overflow: hidden;
  flex-shrink: 0;
}
.ui-avatar--circle { border-radius: var(--radius-full); }
.ui-avatar--rounded { border-radius: var(--radius-lg); }
.ui-avatar--initials {
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}
.ui-avatar__text {
  font-size: var(--font-size-lg);
  font-weight: 600;
  font-family: var(--font-heading-family);
}
.ui-avatar__icon { color: var(--color-muted-foreground); }

/* ── Badge ────────────────────────────────────────────────── */
.ui-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  line-height: 1;
}
.ui-badge--default { background: var(--color-primary); color: var(--color-primary-foreground); }
.ui-badge--destructive { background: var(--color-destructive); color: var(--color-primary-foreground); }
.ui-badge--outline { background: transparent; border: 1px solid var(--color-border); color: var(--color-foreground); }
.ui-badge--count {
  min-width: var(--spacing-lg);
  justify-content: center;
  background: var(--color-destructive);
  color: var(--color-primary-foreground);
}
.ui-badge--full-width {
  display: flex;
  width: 100%;
  justify-content: center;
  box-sizing: border-box;
}

/* In card stacks, badges should hug text unless explicitly marked full-width */
.ui-card > .ui-badge:not(.ui-badge--full-width),
.ui-card__body > .ui-badge:not(.ui-badge--full-width) {
  align-self: flex-start;
  width: auto;
}

/* Top-level badge layout (outside cards): keep viewport margins */
.ui-badge-wrap {
  padding: 0 var(--spacing-md);
}
.ui-badge-wrap--fit {
  display: flex;
  justify-content: flex-start;
}
.ui-badge-wrap--full .ui-badge {
  display: flex;
  width: 100%;
  justify-content: center;
  box-sizing: border-box;
}

/* ── Tag / Chip ───────────────────────────────────────────── */
.ui-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  background: var(--color-secondary);
  color: var(--color-secondary-foreground);
}
.ui-tag--selected { background: var(--color-primary); color: var(--color-primary-foreground); }
.ui-tag--removable { padding-right: var(--spacing-sm); }
.ui-tag__remove {
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 0.6;
}

/* ── EmptyState ───────────────────────────────────────────── */
.ui-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-md);
  text-align: center;
}
.ui-empty__icon {
  color: var(--color-muted-foreground);
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}
.ui-empty__title {
  font-family: var(--font-heading-family);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-foreground);
  margin-bottom: var(--spacing-xs);
}
.ui-empty__description {
  font-size: var(--font-size-sm);
  color: var(--color-muted-foreground);
}

/* ── ImagePlaceholder ─────────────────────────────────────── */
.ui-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  background: var(--color-muted);
  color: var(--color-muted-foreground);
  margin: 0 var(--spacing-md);
  overflow: hidden;
}
.ui-image--rounded { border-radius: var(--radius-lg); }
.ui-image--sharp { border-radius: var(--radius-none); }
.ui-image--circle { border-radius: var(--radius-full); }
.ui-image__label { font-size: var(--font-size-sm); color: var(--color-muted-foreground); }

/* ── Carousel ─────────────────────────────────────────────── */
.ui-carousel { overflow: hidden; }
.ui-carousel__track {
  display: flex;
  gap: var(--spacing-md);
  padding: 0 var(--spacing-md);
}
.ui-carousel--peek .ui-carousel__track { padding-right: var(--spacing-2xl); }
.ui-carousel__item {
  min-width: 100%;
  aspect-ratio: 16/9;
  background: var(--color-muted);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted-foreground);
  flex-shrink: 0;
}
.ui-carousel--peek .ui-carousel__item { min-width: 85%; }
.ui-carousel__dots {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) 0;
}
.ui-carousel__dot {
  width: var(--spacing-sm);
  height: var(--spacing-sm);
  border-radius: var(--radius-full);
  background: var(--color-muted);
}
.ui-carousel__dot--active { background: var(--color-primary); width: var(--spacing-lg); }
.ui-carousel__progress {
  margin: var(--spacing-md) var(--spacing-md) 0;
  height: var(--spacing-xs);
  background: var(--color-muted);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.ui-carousel__progress-fill { height: 100%; background: var(--color-primary); border-radius: var(--radius-full); }

/* ── ProgressBar ──────────────────────────────────────────── */
.ui-progress { padding: var(--spacing-sm) var(--spacing-md); }
.ui-progress__header { display: flex; justify-content: space-between; margin-bottom: var(--spacing-xs); }
.ui-progress__label { font-size: var(--font-size-sm); font-weight: 500; color: var(--color-foreground); }
.ui-progress__value { font-size: var(--font-size-sm); color: var(--color-muted-foreground); font-variant-numeric: tabular-nums; }
.ui-progress__track {
  height: var(--spacing-sm);
  background: var(--color-muted);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.ui-progress__fill { height: 100%; background: var(--color-primary); border-radius: var(--radius-full); transition: width 0.3s; }
.ui-progress--steps .ui-progress__steps { display: flex; gap: var(--spacing-xs); }
.ui-progress__step {
  flex: 1;
  height: var(--spacing-sm);
  background: var(--color-muted);
  border-radius: var(--radius-full);
}
.ui-progress__step--done { background: var(--color-primary); }
.ui-progress__step--active { background: var(--color-primary); opacity: 0.5; }
.ui-progress--circular {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.ui-progress__ring { width: var(--spacing-2xl); height: var(--spacing-2xl); transform: rotate(-90deg); }
.ui-progress__ring-bg { stroke: var(--color-muted); }
.ui-progress__ring-fill { stroke: var(--color-primary); stroke-linecap: round; }
.ui-progress__percent {
  position: absolute;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-foreground);
}

/* ── Alert / Banner ───────────────────────────────────────── */
.ui-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  margin: 0 var(--spacing-md);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
}
.ui-alert--info { background: var(--color-secondary); color: var(--color-foreground); }
.ui-alert--success { background: var(--color-secondary); color: var(--color-foreground); }
.ui-alert--warning { background: var(--color-secondary); color: var(--color-foreground); }
.ui-alert--error { background: var(--color-secondary); color: var(--color-destructive); }
.ui-alert__icon { flex-shrink: 0; margin-top: 1px; }
.ui-alert--info .ui-alert__icon { color: var(--color-primary); }
.ui-alert--success .ui-alert__icon { color: var(--color-primary); }
.ui-alert--warning .ui-alert__icon { color: var(--color-accent); }
.ui-alert--error .ui-alert__icon { color: var(--color-destructive); }
.ui-alert__message { flex: 1; line-height: 1.4; }

/* ── Toast ────────────────────────────────────────────────── */
.ui-toast {
  position: relative;
  padding: var(--spacing-sm) var(--spacing-md);
}
.ui-toast__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-foreground);
  color: var(--color-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
.ui-toast__text { font-size: var(--font-size-sm); font-weight: 500; }
.ui-toast__action {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-primary);
  background: none;
  padding: 0;
}

/* ── Modal ────────────────────────────────────────────────── */
.ui-modal {
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ui-modal__scrim {
  position: absolute;
  inset: 0;
  background: var(--color-foreground);
  opacity: 0.3;
  border-radius: var(--radius-lg);
}
.ui-modal__card {
  position: relative;
  background: var(--color-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin: var(--spacing-md);
  width: 85%;
  box-shadow: var(--shadow-lg);
}
.ui-modal__title {
  font-family: var(--font-heading-family);
  font-size: var(--font-size-lg);
  font-weight: var(--font-heading-weight);
  color: var(--color-foreground);
  margin-bottom: var(--spacing-sm);
  text-align: center;
}
.ui-modal__body {
  font-size: var(--font-size-sm);
  color: var(--color-muted-foreground);
  text-align: center;
  margin-bottom: var(--spacing-md);
}
.ui-modal__actions { display: flex; gap: var(--spacing-sm); }
.ui-modal--sheet {
  align-items: flex-end;
}
.ui-modal__sheet {
  position: relative;
  width: 100%;
  background: var(--color-card);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
.ui-modal__handle {
  width: 36px;
  height: 5px;
  background: var(--color-muted);
  border-radius: var(--radius-full);
  margin: 0 auto var(--spacing-sm);
}
.ui-modal--fullscreen { min-height: 300px; }
.ui-modal__fullscreen-card {
  position: relative;
  background: var(--color-card);
  width: 100%;
  height: 100%;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* ── FAB ──────────────────────────────────────────────────── */
.ui-fab {
  position: relative;
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-md);
}
.ui-fab__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: var(--spacing-2xl);
  height: var(--spacing-2xl);
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  box-shadow: var(--shadow-lg);
}
.ui-fab--extended .ui-fab__btn {
  width: auto;
  padding: 0 var(--spacing-lg);
  border-radius: var(--radius-button);
}
.ui-fab__label {
  font-size: var(--font-size-base);
  font-weight: 600;
}

/* ── BottomSheet ──────────────────────────────────────────── */
.ui-sheet {
  background: var(--color-card);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-lg);
}
.ui-sheet__handle {
  width: 36px;
  height: 5px;
  background: var(--color-muted);
  border-radius: var(--radius-full);
  margin: 0 auto var(--spacing-md);
}
.ui-sheet__title {
  font-family: var(--font-heading-family);
  font-size: var(--font-size-lg);
  font-weight: var(--font-heading-weight);
  color: var(--color-foreground);
  margin-bottom: var(--spacing-md);
}
.ui-sheet__content { display: flex; flex-direction: column; gap: var(--spacing-sm); }

/* ── ProfileHeader ────────────────────────────────────────── */
.ui-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-md);
  gap: var(--spacing-sm);
}
.ui-profile--left { align-items: flex-start; }
.ui-profile__cover {
  width: 100%;
  height: 120px;
  background: var(--color-muted);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-sm);
}
.ui-profile__cover-icon { color: var(--color-muted-foreground); }
.ui-profile__avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ui-profile__avatar-icon { color: var(--color-muted-foreground); }
.ui-profile__name {
  font-family: var(--font-heading-family);
  font-size: var(--font-size-xl);
  font-weight: var(--font-heading-weight);
  color: var(--color-foreground);
}
.ui-profile__bio { font-size: var(--font-size-sm); color: var(--color-muted-foreground); }
.ui-profile__actions {
  display: flex;
  gap: var(--spacing-sm);
  width: 100%;
  margin-top: var(--spacing-sm);
}

/* ── MessageBubble ────────────────────────────────────────── */
.ui-msg-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
}
.ui-msg {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-sm);
  max-width: 80%;
}
.ui-msg--sent { align-self: flex-end; }
.ui-msg--received { align-self: flex-start; }
.ui-msg__avatar {
  width: var(--spacing-lg);
  height: var(--spacing-lg);
  border-radius: var(--radius-full);
  background: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-muted-foreground);
}
.ui-msg__bubble {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}
.ui-msg--sent .ui-msg__bubble {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border-bottom-right-radius: var(--radius-sm);
}
.ui-msg--received .ui-msg__bubble {
  background: var(--color-secondary);
  color: var(--color-secondary-foreground);
  border-bottom-left-radius: var(--radius-sm);
}

/* ── FeedItem ─────────────────────────────────────────────── */
.ui-feed { padding: var(--spacing-md); border-bottom: 1px solid var(--color-border); }
.ui-feed__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}
.ui-feed__user { flex: 1; }
.ui-feed__username { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-foreground); }
.ui-feed__time { font-size: var(--font-size-xs); color: var(--color-muted-foreground); margin-left: var(--spacing-xs); }
.ui-feed__more { color: var(--color-muted-foreground); }
.ui-feed__image {
  aspect-ratio: 4/3;
  background: var(--color-muted);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted-foreground);
  overflow: hidden;
}
.ui-feed__image--full { border-radius: 0; margin: 0 calc(var(--spacing-md) * -1); aspect-ratio: 1/1; }
.ui-feed__image-icon { color: var(--color-muted-foreground); }
.ui-feed__actions {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
  color: var(--color-foreground);
}
.ui-feed__caption { font-size: var(--font-size-sm); color: var(--color-foreground); line-height: 1.4; }
.ui-feed__category {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.ui-feed__title {
  font-family: var(--font-heading-family);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-foreground);
  margin: var(--spacing-xs) 0;
}
.ui-feed__meta { font-size: var(--font-size-xs); color: var(--color-muted-foreground); }
.ui-feed__excerpt { margin: var(--spacing-xs) 0; }
.ui-feed--news { display: flex; gap: var(--spacing-md); border-bottom: 1px solid var(--color-border); }
.ui-feed--news .ui-feed__image { width: 100px; min-height: 80px; aspect-ratio: auto; flex-shrink: 0; }
.ui-feed--news .ui-feed__body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.ui-feed--minimal { border-bottom: 1px solid var(--color-border); }

/* ── SettingsRow ──────────────────────────────────────────── */
.ui-settings-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: var(--comp-list-item-height);
}
.ui-settings-row__icon {
  width: var(--spacing-xl);
  height: var(--spacing-xl);
  border-radius: var(--radius-md);
  background: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ui-settings-row__title {
  flex: 1;
  font-size: var(--font-size-base);
  color: var(--color-foreground);
}
.ui-settings-row__trailing {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-muted-foreground);
}
.ui-settings-row__value {
  font-size: var(--font-size-sm);
  color: var(--color-muted-foreground);
}
.ui-settings-row__chevron { color: var(--color-muted-foreground); }
.ui-settings-row--destructive .ui-settings-row__title { color: var(--color-destructive); }
.ui-settings-row--destructive .ui-settings-row__icon { color: var(--color-destructive); background: none; }
`;
