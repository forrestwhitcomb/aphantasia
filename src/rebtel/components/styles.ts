// ============================================================
// APHANTASIA for REBTEL — Component CSS
// ============================================================
// Comprehensive Rebtel component styles using real Figma tokens.
// All values reference CSS custom properties from designSystem.ts.
// ============================================================

export const REBTEL_COMPONENT_CSS = `
/* ── Rebtel Typography Classes ─────────────────────────── */

.rebtel-display-lg {
  font-family: var(--rebtel-font-display);
  font-size: var(--rebtel-display-lg-size);
  line-height: var(--rebtel-display-lg-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 700;
}
.rebtel-display-md {
  font-family: var(--rebtel-font-display);
  font-size: var(--rebtel-display-md-size);
  line-height: var(--rebtel-display-md-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 700;
}
.rebtel-display-sm {
  font-family: var(--rebtel-font-display);
  font-size: var(--rebtel-display-sm-size);
  line-height: var(--rebtel-display-sm-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 700;
}
.rebtel-display-xs {
  font-family: var(--rebtel-font-display);
  font-size: var(--rebtel-display-xs-size);
  line-height: var(--rebtel-display-xs-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 700;
}

.rebtel-headline-lg {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-headline-lg-size);
  line-height: var(--rebtel-headline-lg-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 700;
}
.rebtel-headline-md {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-headline-md-size);
  line-height: var(--rebtel-headline-md-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 700;
}
.rebtel-headline-sm {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-headline-sm-size);
  line-height: var(--rebtel-headline-sm-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 600;
}
.rebtel-headline-xs {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-headline-xs-size);
  line-height: var(--rebtel-headline-xs-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 600;
}

.rebtel-paragraph-xl {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-paragraph-xl-size);
  line-height: var(--rebtel-paragraph-xl-lh);
  letter-spacing: var(--rebtel-ls);
}
.rebtel-paragraph-lg {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-paragraph-lg-size);
  line-height: var(--rebtel-paragraph-lg-lh);
  letter-spacing: var(--rebtel-ls);
}
.rebtel-paragraph-md {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-paragraph-md-size);
  line-height: var(--rebtel-paragraph-md-lh);
  letter-spacing: var(--rebtel-ls);
}
.rebtel-paragraph-sm {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-paragraph-sm-size);
  line-height: var(--rebtel-paragraph-sm-lh);
  letter-spacing: var(--rebtel-ls);
}
.rebtel-paragraph-xs {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-paragraph-xs-size);
  line-height: var(--rebtel-paragraph-xs-lh);
  letter-spacing: var(--rebtel-ls);
}

.rebtel-label-xl {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-label-xl-size);
  line-height: var(--rebtel-label-xl-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 500;
}
.rebtel-label-lg {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-label-lg-size);
  line-height: var(--rebtel-label-lg-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 500;
}
.rebtel-label-md {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-label-md-size);
  line-height: var(--rebtel-label-md-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 500;
}
.rebtel-label-sm {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-label-sm-size);
  line-height: var(--rebtel-label-sm-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 500;
}
.rebtel-label-xs {
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-label-xs-size);
  line-height: var(--rebtel-label-xs-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 500;
}

/* ── Rebtel Button Styles ──────────────────────────────── */

.rebtel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-label-md-size);
  line-height: var(--rebtel-label-md-lh);
  letter-spacing: var(--rebtel-ls);
  font-weight: 500;
  border-radius: var(--rebtel-radius-md);
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;
  box-sizing: border-box;
  border: none;
  outline: none;
  text-decoration: none;
}
.rebtel-btn:active {
  transform: scale(0.97);
}

.rebtel-btn--primary {
  background: var(--rebtel-button-primary);
  color: var(--rebtel-text-on-brand);
  height: var(--rebtel-height-lg);
  padding: 0 var(--rebtel-spacing-xl);
}

.rebtel-btn--secondary-white {
  background: var(--rebtel-button-secondary-white);
  color: var(--rebtel-text-primary);
  border: 1px solid var(--rebtel-border-default);
  height: var(--rebtel-height-lg);
  padding: 0 var(--rebtel-spacing-xl);
}

.rebtel-btn--secondary-grey {
  background: var(--rebtel-button-secondary-grey);
  color: var(--rebtel-text-primary);
  height: var(--rebtel-height-lg);
  padding: 0 var(--rebtel-spacing-xl);
}

.rebtel-btn--green {
  background: var(--rebtel-button-green);
  color: var(--rebtel-text-on-brand);
  height: var(--rebtel-height-lg);
  padding: 0 var(--rebtel-spacing-xl);
}

.rebtel-btn--disabled {
  background: var(--rebtel-button-disabled);
  color: var(--rebtel-text-tertiary);
  height: var(--rebtel-height-lg);
  padding: 0 var(--rebtel-spacing-xl);
  pointer-events: none;
}

.rebtel-btn--sm {
  height: var(--rebtel-height-sm);
  padding: 0 var(--rebtel-spacing-md);
  font-size: var(--rebtel-label-sm-size);
  border-radius: var(--rebtel-radius-sm);
}

.rebtel-btn--lg {
  height: var(--rebtel-height-xl);
  padding: 0 var(--rebtel-spacing-xxl);
  font-size: var(--rebtel-label-lg-size);
}

.rebtel-btn--full {
  width: 100%;
}

/* ── Rebtel Input Styles ───────────────────────────────── */

.rebtel-input {
  display: flex;
  align-items: center;
  height: var(--rebtel-height-lg);
  padding: 0 var(--rebtel-spacing-md);
  background: var(--rebtel-surface-primary);
  border: 1px solid var(--rebtel-border-default);
  border-radius: var(--rebtel-radius-sm);
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-paragraph-md-size);
  line-height: var(--rebtel-paragraph-md-lh);
  letter-spacing: var(--rebtel-ls);
  color: var(--rebtel-text-primary);
  box-sizing: border-box;
  transition: border-color 0.15s ease;
}
.rebtel-input--focused {
  border-color: var(--rebtel-border-highlight);
}

/* ── Rebtel Card Styles ────────────────────────────────── */

.rebtel-card {
  background: var(--rebtel-surface-primary);
  border-radius: var(--rebtel-radius-lg);
  padding: var(--rebtel-spacing-md);
  box-sizing: border-box;
}
.rebtel-card--elevated {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.rebtel-card--bordered {
  border: 1px solid var(--rebtel-border-secondary);
}

/* ── Rebtel List/Row Styles ────────────────────────────── */

.rebtel-row {
  display: flex;
  align-items: center;
  gap: var(--rebtel-spacing-sm);
  padding: var(--rebtel-spacing-sm) var(--rebtel-spacing-md);
  min-height: var(--rebtel-height-xl);
  box-sizing: border-box;
}
.rebtel-row--divider {
  border-bottom: 1px solid var(--rebtel-border-secondary);
}

/* ── Rebtel Status Bar ─────────────────────────────────── */

.rebtel-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--rebtel-height-xs);
  padding: 0 var(--rebtel-spacing-md);
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-label-xs-size);
  font-weight: 600;
  color: var(--rebtel-text-primary);
  box-sizing: border-box;
}

/* ── Rebtel Tab Bar ────────────────────────────────────── */

.rebtel-tab-bar {
  display: flex;
  align-items: center;
  height: var(--rebtel-height-xl);
  background: var(--rebtel-surface-primary);
  border-top: 1px solid var(--rebtel-border-secondary);
  box-sizing: border-box;
}
.rebtel-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--rebtel-spacing-xxxs);
  cursor: pointer;
  position: relative;
  padding: var(--rebtel-spacing-xs) 0;
}
.rebtel-tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 2px;
  background: var(--rebtel-brand-red);
  border-radius: 1px;
}

/* ── Rebtel Pill/Chip ──────────────────────────────────── */

.rebtel-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--rebtel-height-md);
  padding: 0 var(--rebtel-spacing-md);
  border-radius: var(--rebtel-radius-sm);
  border: 1px solid var(--rebtel-border-default);
  font-family: var(--rebtel-font-body);
  font-size: var(--rebtel-label-sm-size);
  font-weight: 500;
  letter-spacing: var(--rebtel-ls);
  color: var(--rebtel-text-primary);
  background: var(--rebtel-surface-primary);
  cursor: pointer;
  transition: all 0.15s ease;
  box-sizing: border-box;
}
.rebtel-pill--selected {
  background: var(--rebtel-brand-red);
  color: var(--rebtel-text-on-brand);
  border-color: var(--rebtel-brand-red);
}

/* ── Transitions ───────────────────────────────────────── */

[data-component^="rebtel"],
[data-component="appBar"],
[data-component="contactCard"],
[data-component="rateCard"],
[data-component="topUpCard"],
[data-component="phoneInput"],
[data-component="amountSelector"],
[data-component="countryPicker"],
[data-component="paymentMethod"],
[data-component="successScreen"],
[data-component="rebtelTabBar"] {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
`;
