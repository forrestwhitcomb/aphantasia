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
