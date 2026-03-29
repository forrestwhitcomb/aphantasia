// ============================================================
// APHANTASIA for REBTEL — Real Figma Design System Tokens
// ============================================================
// Hardcoded Rebtel design tokens from the actual Figma file.
// Uses Pano (display) and KH Teka (body/UI) font families
// with proper system fallbacks.
// ============================================================

import type { UIDesignSystem } from "@/ui-mode/types";

export const REBTEL_DESIGN_SYSTEM: UIDesignSystem = {
  fonts: {
    heading: {
      family: "'Pano', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      weight: 700,
      letterSpacing: "0.02em",
    },
    body: {
      family: "'KH Teka', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
      weight: 400,
      letterSpacing: "0.02em",
    },
    caption: {
      family: "'KH Teka', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
      weight: 400,
    },
    mono: {
      family: "'JetBrains Mono', 'SF Mono', monospace",
      weight: 400,
    },
  },
  fontSizes: {
    xs: "11px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
  },

  colors: {
    background: "#FFFFFF",                // surface/page/raised
    foreground: "#111111",                // content/primary (grey-900)
    primary: "#E31B3B",                   // color/brand/red
    primaryForeground: "#FFFFFF",         // content/inverse
    secondary: "#F3F3F3",                 // surface/page/default (grey-200)
    secondaryForeground: "#737378",       // content/secondary (grey-600)
    muted: "#F3F3F3",                     // surface/page/default
    mutedForeground: "#B9B9BE",           // content/tertiary (grey-400)
    accent: "#E31B3B",                    // brand/primary
    accentForeground: "#FFFFFF",          // content/inverse
    destructive: "#E31B3B",               // error/500
    border: "#DCDCE1",                    // border/default (grey-300)
    input: "#F3F3F3",                     // surface/page/default
    ring: "#E31B3B",                      // border/focus
    card: "#FFFFFF",                      // surface/page/raised
    cardForeground: "#111111",            // content/primary
  },

  spacing: {
    xs: "4px",       // spacing-xxs
    sm: "8px",       // spacing-xs
    md: "16px",      // spacing-md
    lg: "24px",      // spacing-xl
    xl: "32px",      // spacing-xxl
    "2xl": "52px",   // spacing-xxxl
  },

  radii: {
    none: "0px",
    sm: "4px",       // radius-xs
    md: "8px",       // radius-sm
    lg: "12px",      // radius-md
    xl: "16px",      // radius-lg
    full: "9999px",
    button: "12px",  // radius-md
    card: "16px",    // radius-lg
    input: "8px",    // radius-sm
  },

  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 12px rgba(0, 0, 0, 0.08)",
    lg: "0 8px 24px rgba(0, 0, 0, 0.12)",
    card: "0 2px 8px rgba(0, 0, 0, 0.06)",
    button: "0 1px 3px rgba(0, 0, 0, 0.08)",
    input: "0 1px 2px rgba(0, 0, 0, 0.04)",
  },

  components: {
    navBar: {
      height: "52px",   // object-height-xl
      blur: "saturate(180%) blur(20px)",
      borderBottom: "1px solid var(--color-border)",
    },
    card: { padding: "16px", gap: "12px" },
    button: { height: "48px", paddingX: "24px", fontSize: "16px" },  // object-height-lg
    input: { height: "48px", paddingX: "16px", fontSize: "16px" },   // object-height-lg
    list: { itemHeight: "52px", divider: "1px solid var(--color-border)" },  // object-height-xl
    tabBar: { height: "52px", iconSize: "24px" },  // object-height-xl
  },

  name: "Rebtel 3.0",
  confidence: 1.0,
};

// ── Extra Rebtel-Specific CSS Tokens ────────────────────────
// Full Figma design system tokens as CSS custom properties.
// Includes typography scale, spacing scale, colors, and
// semantic mapped tokens.

export const REBTEL_EXTRA_CSS = `
  @font-face {
    font-family: 'Pano';
    src: url('/fonts/rebtel/Pano-Regular.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'KH Teka';
    src: url('/fonts/rebtel/KHTeka-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'KH Teka';
    src: url('/fonts/rebtel/KHTeka-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'KH Teka';
    src: url('/fonts/rebtel/KHTeka-RegularItalic.ttf') format('truetype');
    font-weight: 400;
    font-style: italic;
    font-display: swap;
  }

  :root {
    /* ── Font Families ── */
    --rebtel-font-display: 'Pano', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
    --rebtel-font-body: 'KH Teka', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;

    /* ── Display Type Scale (Pano) ── */
    --rebtel-display-lg-size: 32px;
    --rebtel-display-lg-lh: 40px;
    --rebtel-display-md-size: 24px;
    --rebtel-display-md-lh: 32px;
    --rebtel-display-sm-size: 20px;
    --rebtel-display-sm-lh: 32px;
    --rebtel-display-xs-size: 16px;
    --rebtel-display-xs-lh: 24px;

    /* ── Headline Type Scale (KH Teka) ── */
    --rebtel-headline-lg-size: 32px;
    --rebtel-headline-lg-lh: 40px;
    --rebtel-headline-md-size: 24px;
    --rebtel-headline-md-lh: 36px;
    --rebtel-headline-sm-size: 20px;
    --rebtel-headline-sm-lh: 32px;
    --rebtel-headline-xs-size: 16px;
    --rebtel-headline-xs-lh: 24px;

    /* ── Paragraph Type Scale (KH Teka) ── */
    --rebtel-paragraph-xl-size: 20px;
    --rebtel-paragraph-xl-lh: 32px;
    --rebtel-paragraph-lg-size: 18px;
    --rebtel-paragraph-lg-lh: 28px;
    --rebtel-paragraph-md-size: 16px;
    --rebtel-paragraph-md-lh: 24px;
    --rebtel-paragraph-sm-size: 14px;
    --rebtel-paragraph-sm-lh: 20px;
    --rebtel-paragraph-xs-size: 12px;
    --rebtel-paragraph-xs-lh: 18px;

    /* ── Label Type Scale (KH Teka) ── */
    --rebtel-label-xl-size: 20px;
    --rebtel-label-xl-lh: 20px;
    --rebtel-label-lg-size: 18px;
    --rebtel-label-lg-lh: 18px;
    --rebtel-label-md-size: 16px;
    --rebtel-label-md-lh: 16px;
    --rebtel-label-sm-size: 14px;
    --rebtel-label-sm-lh: 14px;
    --rebtel-label-xs-size: 11px;
    --rebtel-label-xs-lh: 11px;

    /* ── Letter Spacing ── */
    --rebtel-ls: 0.02em;

    /* ── Spacing Scale ── */
    --rebtel-spacing-xxxs: 2px;
    --rebtel-spacing-xxs: 4px;
    --rebtel-spacing-xs: 8px;
    --rebtel-spacing-sm: 12px;
    --rebtel-spacing-md: 16px;
    --rebtel-spacing-lg: 20px;
    --rebtel-spacing-xl: 24px;
    --rebtel-spacing-xxl: 32px;
    --rebtel-spacing-xxxl: 52px;
    --rebtel-spacing-xxxxl: 72px;

    /* ── Object Height Scale ── */
    --rebtel-height-xs: 24px;
    --rebtel-height-sm: 32px;
    --rebtel-height-md: 40px;
    --rebtel-height-lg: 48px;
    --rebtel-height-xl: 52px;
    --rebtel-height-xxl: 64px;
    --rebtel-height-xxxl: 72px;

    /* ── Border Radius ── */
    --rebtel-radius-xs: 4px;
    --rebtel-radius-sm: 8px;
    --rebtel-radius-md: 12px;
    --rebtel-radius-lg: 16px;
    --rebtel-radius-xl: 24px;
    --rebtel-radius-xxl: 32px;
    --rebtel-radius-full: 9999px;

    /* ── Brand Colors (Figma 3.0: 1·Primitives) ── */
    --rebtel-brand-red: #E31B3B;
    --rebtel-brand-black: #111111;
    --rebtel-brand-white: #FFFFFF;

    /* ── Grey Scale (Figma 3.0: 1·Primitives → color/grey) ── */
    --rebtel-grey-900: #111111;
    --rebtel-grey-800: #2D2D32;
    --rebtel-grey-700: #505055;
    --rebtel-grey-600: #737378;
    --rebtel-grey-500: #96969B;
    --rebtel-grey-400: #B9B9BE;
    --rebtel-grey-300: #DCDCE1;
    --rebtel-grey-200: #F3F3F3;
    --rebtel-grey-100: #FAFAFC;
    --rebtel-grey-50: #FAFAFC;
    --rebtel-grey-0: #FFFFFF;

    /* ── Red Scale (Figma 3.0: 1·Primitives → color/red) ── */
    --rebtel-red-900: #5B0B18;
    --rebtel-red-800: #5B0B18;
    --rebtel-red-700: #881023;
    --rebtel-red-600: #B6162F;
    --rebtel-red-500: #E31B3B;
    --rebtel-red-400: #E94962;
    --rebtel-red-300: #EE7689;
    --rebtel-red-200: #F4A4B1;
    --rebtel-red-100: #FCE8EB;
    --rebtel-red-50: #FCE8EB;

    /* ── Semantic Colors (Figma 3.0: 3·Mapped) ── */
    --rebtel-warning: #F06E1D;
    --rebtel-warning-light: #FBDBC6;
    --rebtel-warning-lighter: #FBDBC6;
    --rebtel-success: #047804;
    --rebtel-success-light: #D1F3C5;
    --rebtel-green: #09BC09;
    --rebtel-green-light: #D1F3C5;
    --rebtel-green-lighter: #A4E68B;
    --rebtel-purple: #4200FF;

    /* ── Surface Mapped Tokens (Figma 3.0: 3·Mapped → surface/) ── */
    --rebtel-surface-primary: #FFFFFF;
    --rebtel-surface-primary-elevated: #FFFFFF;
    --rebtel-surface-primary-inverse: #111111;
    --rebtel-surface-primary-neutral: #F3F3F3;
    --rebtel-surface-primary-light: #F3F3F3;
    --rebtel-surface-primary-lighter: #FAFAFC;
    --rebtel-surface-brand-red: #E31B3B;
    --rebtel-surface-canvas: #FAFAFC;
    --rebtel-surface-default: #F3F3F3;
    --rebtel-surface-raised: #FFFFFF;
    --rebtel-surface-overlay: #111111;
    --rebtel-surface-sheet: #FFFFFF;
    --rebtel-surface-calling: #EDEADD;
    --rebtel-surface-mtu: #DAE2F4;

    /* ── Text/Content Mapped Tokens (Figma 3.0: 3·Mapped → content/) ── */
    --rebtel-text-primary: #111111;
    --rebtel-text-secondary: #737378;
    --rebtel-text-tertiary: #B9B9BE;
    --rebtel-text-highlight: #E31B3B;
    --rebtel-text-brand-inverted: #FFFFFF;
    --rebtel-text-on-brand: #FFFFFF;
    --rebtel-content-primary: #111111;
    --rebtel-content-secondary: #737378;
    --rebtel-content-tertiary: #B9B9BE;
    --rebtel-content-disabled: #B9B9BE;
    --rebtel-content-inverse: #FFFFFF;
    --rebtel-content-brand: #E31B3B;
    --rebtel-content-success: #09BC09;

    /* ── Icon Mapped Tokens (Figma 3.0: 3·Mapped → icon/) ── */
    --rebtel-icon-default: #111111;
    --rebtel-icon-secondary: #737378;
    --rebtel-icon-disabled: #B9B9BE;
    --rebtel-icon-brand: #E31B3B;

    /* ── Border Mapped Tokens (Figma 3.0: 3·Mapped → border/) ── */
    --rebtel-border-default: #DCDCE1;
    --rebtel-border-secondary: #F3F3F3;
    --rebtel-border-highlight: #E31B3B;

    /* ── Button Surface Tokens (Figma 3.0: 4·Component) ── */
    --rebtel-button-primary: #E31B3B;
    --rebtel-button-primary-bg: #E31B3B;
    --rebtel-button-primary-text: #FFFFFF;
    --rebtel-button-secondary-black-bg: #111111;
    --rebtel-button-secondary-black-text: #FFFFFF;
    --rebtel-button-secondary-white: #FFFFFF;
    --rebtel-button-secondary-grey: #F3F3F3;
    --rebtel-button-outlined-border: #DCDCE1;
    --rebtel-button-outlined-text: #111111;
    --rebtel-button-disabled: #F3F3F3;
    --rebtel-button-green: #09BC09;

    /* ── Grey Alpha Variants ── */
    --rebtel-grey-900-a40: #11111166;
    --rebtel-grey-900-a60: #11111199;
    --rebtel-grey-900-a80: #111111CC;
    --rebtel-grey-100-a0: #FAFAFC00;
    --rebtel-grey-800-a0: #2D2D3200;

    /* ── Blue / Accent Scale (Figma 3.0: 1·Primitives → color/blue) ── */
    --rebtel-blue-100: #D6F8FA;
    --rebtel-blue-200: #B8F3F7;
    --rebtel-blue-300: #7DE8EE;
    --rebtel-blue-400: #55DCE6;
    --rebtel-blue-500: #2DD4E1;
    --rebtel-blue-600: #24A9B4;
    --rebtel-blue-700: #1A7E87;

    /* ── Green Scale (Figma 3.0: 1·Primitives → color/green) ── */
    --rebtel-green-100: #D1F3C5;
    --rebtel-green-200: #A4E68B;
    --rebtel-green-300: #49CD18;
    --rebtel-green-400: #09BC09;
    --rebtel-green-500: #047804;

    /* ── Orange / Warning Scale (Figma 3.0: 1·Primitives → color/orange) ── */
    --rebtel-orange-100: #FBDBC6;
    --rebtel-orange-200: #F7B68E;
    --rebtel-orange-300: #F06E1D;

    /* ── Additional Primitives ── */
    --rebtel-purple-500: #4200FF;
    --rebtel-shadow-500: #32325D;
    --rebtel-sand-100: #EDEADD;
    --rebtel-cornflower-100: #DAE2F4;

    /* ── Mapped: Full Surface Tokens ── */
    --rebtel-surface-page-canvas: #FAFAFC;
    --rebtel-surface-page-default: #F3F3F3;
    --rebtel-surface-page-raised: #FFFFFF;
    --rebtel-surface-page-overlay: #111111;
    --rebtel-surface-brand-primary: #E31B3B;
    --rebtel-surface-brand-pressed: #881023;
    --rebtel-surface-brand-subtle: #FCE8EB;
    --rebtel-surface-accent-primary: #2DD4E1;
    --rebtel-surface-accent-subtle: #D6F8FA;
    --rebtel-surface-feedback-error: #E31B3B;
    --rebtel-surface-feedback-error-subtle: #FCE8EB;
    --rebtel-surface-feedback-warning: #F06E1D;
    --rebtel-surface-feedback-warning-subtle: #FBDBC6;
    --rebtel-surface-feedback-success: #047804;
    --rebtel-surface-feedback-success-subtle: #D1F3C5;
    --rebtel-surface-overlay-scrim: #11111166;
    --rebtel-surface-overlay-scrim-strong: #11111199;
    --rebtel-surface-overlay-transparent: #FAFAFC00;
    --rebtel-surface-feature-calling: #EDEADD;
    --rebtel-surface-feature-mtu: #DAE2F4;

    /* ── Mapped: Extended Content/Border/Icon ── */
    --rebtel-content-accent: #2DD4E1;
    --rebtel-content-warning: #F06E1D;
    --rebtel-content-error: #E31B3B;
    --rebtel-border-strong: #111111;
    --rebtel-border-subtle: #F3F3F3;
    --rebtel-border-focus: #E31B3B;
    --rebtel-border-brand: #E31B3B;
    --rebtel-border-accent: #2DD4E1;
    --rebtel-border-error: #E31B3B;
    --rebtel-border-success: #09BC09;
    --rebtel-border-warning: #F06E1D;
    --rebtel-icon-primary: #111111;
    --rebtel-icon-tertiary: #B9B9BE;
    --rebtel-icon-inverse: #FFFFFF;
    --rebtel-icon-accent: #2DD4E1;
    --rebtel-icon-success: #09BC09;
    --rebtel-icon-warning: #F06E1D;
    --rebtel-icon-error: #E31B3B;
    --rebtel-feedback-label-purple: #4200FF;
    --rebtel-feedback-label-dark: #2D2D32;

    /* ── Component: Button Tokens (all variants + states) ── */
    --rebtel-button-primary-bg-pressed: #881023;
    --rebtel-button-primary-bg-disabled: #F3F3F3;
    --rebtel-button-primary-bg-focus: #E31B3B;
    --rebtel-button-primary-border: #FAFAFC00;
    --rebtel-button-primary-border-disabled: #F3F3F3;
    --rebtel-button-primary-border-focus: #E31B3B;
    --rebtel-button-primary-text-disabled: #B9B9BE;
    --rebtel-button-primary-icon: #FFFFFF;
    --rebtel-button-primary-icon-disabled: #B9B9BE;
    --rebtel-button-secondary-black-bg-pressed: #111111;
    --rebtel-button-secondary-black-bg-disabled: #F3F3F3;
    --rebtel-button-secondary-black-bg-focus: #111111;
    --rebtel-button-secondary-black-border: #FAFAFC00;
    --rebtel-button-secondary-black-border-disabled: #F3F3F3;
    --rebtel-button-secondary-black-border-focus: #E31B3B;
    --rebtel-button-secondary-black-icon: #FFFFFF;
    --rebtel-button-secondary-black-icon-disabled: #B9B9BE;
    --rebtel-button-secondary-white-bg: #FFFFFF;
    --rebtel-button-secondary-white-bg-pressed: #F3F3F3;
    --rebtel-button-secondary-white-bg-disabled: #F3F3F3;
    --rebtel-button-secondary-white-bg-focus: #FFFFFF;
    --rebtel-button-secondary-white-border: #FAFAFC00;
    --rebtel-button-secondary-white-border-disabled: #F3F3F3;
    --rebtel-button-secondary-white-border-focus: #E31B3B;
    --rebtel-button-secondary-white-text: #111111;
    --rebtel-button-secondary-white-text-disabled: #B9B9BE;
    --rebtel-button-secondary-white-icon: #111111;
    --rebtel-button-secondary-white-icon-disabled: #B9B9BE;
    --rebtel-button-secondary-grey-bg: #F3F3F3;
    --rebtel-button-secondary-grey-bg-pressed: #FAFAFC;
    --rebtel-button-secondary-grey-bg-disabled: #F3F3F3;
    --rebtel-button-secondary-grey-bg-focus: #F3F3F3;
    --rebtel-button-secondary-grey-border: #DCDCE1;
    --rebtel-button-secondary-grey-border-disabled: #F3F3F3;
    --rebtel-button-secondary-grey-border-focus: #E31B3B;
    --rebtel-button-secondary-grey-text: #111111;
    --rebtel-button-secondary-grey-text-disabled: #B9B9BE;
    --rebtel-button-secondary-grey-icon: #111111;
    --rebtel-button-secondary-grey-icon-disabled: #B9B9BE;
    --rebtel-button-ghost-bg: #FAFAFC00;
    --rebtel-button-ghost-bg-pressed: #F3F3F3;
    --rebtel-button-ghost-bg-disabled: #FAFAFC00;
    --rebtel-button-ghost-bg-focus: #FAFAFC00;
    --rebtel-button-ghost-border: #FAFAFC00;
    --rebtel-button-ghost-border-disabled: #FAFAFC00;
    --rebtel-button-ghost-border-focus: #E31B3B;
    --rebtel-button-ghost-text: #E31B3B;
    --rebtel-button-ghost-text-disabled: #B9B9BE;
    --rebtel-button-ghost-icon: #E31B3B;
    --rebtel-button-ghost-icon-disabled: #B9B9BE;

    /* ── Component: Input Tokens ── */
    --rebtel-input-bg: #FFFFFF;
    --rebtel-input-bg-focus: #FFFFFF;
    --rebtel-input-bg-disabled: #F3F3F3;
    --rebtel-input-bg-error: #FFFFFF;
    --rebtel-input-border: #DCDCE1;
    --rebtel-input-border-focus: #E31B3B;
    --rebtel-input-border-disabled: #F3F3F3;
    --rebtel-input-border-error: #E31B3B;
    --rebtel-input-text: #111111;
    --rebtel-input-text-placeholder: #B9B9BE;
    --rebtel-input-text-disabled: #B9B9BE;
    --rebtel-input-label: #737378;
    --rebtel-input-label-focus: #E31B3B;
    --rebtel-input-label-error: #E31B3B;
    --rebtel-input-icon: #737378;
    --rebtel-input-icon-focus: #E31B3B;
    --rebtel-input-icon-disabled: #B9B9BE;
    --rebtel-input-icon-error: #E31B3B;

    /* ── Component: Card Tokens ── */
    --rebtel-card-bg: #FFFFFF;
    --rebtel-card-bg-pressed: #F3F3F3;
    --rebtel-card-border: #DCDCE1;
    --rebtel-card-border-pressed: #111111;
    --rebtel-card-elevated-bg: #FFFFFF;
    --rebtel-card-elevated-border: #FAFAFC00;

    /* ── Component: Label Tokens ── */
    --rebtel-label-neutral-bg: #F3F3F3;
    --rebtel-label-neutral-border: #DCDCE1;
    --rebtel-label-neutral-text: #737378;
    --rebtel-label-brand-bg: #E31B3B;
    --rebtel-label-brand-border: #E31B3B;
    --rebtel-label-brand-text: #FFFFFF;
    --rebtel-label-accent-bg: #2DD4E1;
    --rebtel-label-accent-border: #2DD4E1;
    --rebtel-label-accent-text: #2DD4E1;
    --rebtel-label-success-bg: #D1F3C5;
    --rebtel-label-success-border: #09BC09;
    --rebtel-label-success-text: #09BC09;
    --rebtel-label-warning-bg: #FBDBC6;
    --rebtel-label-warning-border: #F06E1D;
    --rebtel-label-warning-text: #F06E1D;
    --rebtel-label-error-bg: #FCE8EB;
    --rebtel-label-error-border: #E31B3B;
    --rebtel-label-error-text: #E31B3B;
    --rebtel-label-purple-bg: #4200FF;
    --rebtel-label-purple-border: #4200FF;
    --rebtel-label-purple-text: #FFFFFF;

    /* ── Component: Tab Tokens ── */
    --rebtel-tab-bg: #FAFAFC00;
    --rebtel-tab-bg-active: #FAFAFC00;
    --rebtel-tab-border: #FAFAFC00;
    --rebtel-tab-border-active: #E31B3B;
    --rebtel-tab-text: #737378;
    --rebtel-tab-text-active: #111111;
    --rebtel-tab-text-disabled: #B9B9BE;
    --rebtel-tab-icon: #737378;
    --rebtel-tab-icon-active: #E31B3B;
    --rebtel-tab-icon-disabled: #B9B9BE;
    --rebtel-tab-indicator-active: #E31B3B;

    /* ── Component: Navigation Tokens ── */
    --rebtel-nav-bar-bg: #FFFFFF;
    --rebtel-nav-bar-border: #F3F3F3;
    --rebtel-nav-bar-icon: #737378;
    --rebtel-nav-bar-icon-active: #E31B3B;
    --rebtel-nav-bar-text: #737378;
    --rebtel-nav-bar-text-active: #111111;

    /* ── Component: Home Card Tokens ── */
    --rebtel-home-card-calling-bg: #EDEADD;
    --rebtel-home-card-mtu-bg: #DAE2F4;

    /* ── Scale: Icon Size ── */
    --rebtel-icon-size-xxs: 12px;
    --rebtel-icon-size-xs: 16px;
    --rebtel-icon-size-sm: 20px;
    --rebtel-icon-size-md: 24px;
    --rebtel-icon-size-lg: 32px;
    --rebtel-icon-size-xl: 40px;
    --rebtel-icon-size-xxl: 48px;

    /* ── Scale: Stroke ── */
    --rebtel-stroke-md: 1px;
    --rebtel-stroke-lg: 2px;
    --rebtel-stroke-xl: 3px;
    --rebtel-stroke-xxl: 4px;

    /* ── Scale: Spacing None ── */
    --rebtel-spacing-none: 0px;

    /* ── Legacy Aliases ── */
    --rebtel-red: #E31B3B;
    --rebtel-red-dark: #881023;
    --rebtel-red-light: #FCE8EB;
    --rebtel-green-dark: #047804;
    --rebtel-call-green: #09BC09;
    --rebtel-call-red: #E31B3B;
    --rebtel-gradient-primary: linear-gradient(135deg, #E31B3B 0%, #B6162F 100%);
    --rebtel-gradient-success: linear-gradient(135deg, #09BC09 0%, #047804 100%);
  }
`;

// ── Viewport-only CSS (no @font-face — fonts loaded in globals.css) ──
// Used by the React viewport div instead of the iframe.
export const REBTEL_VIEWPORT_CSS = REBTEL_EXTRA_CSS.replace(
  /@font-face\s*\{[^}]*\}\s*/g,
  ""
);
