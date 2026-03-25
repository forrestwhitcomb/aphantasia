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
    background: "#FFFFFF",                // surface-primary
    foreground: "#1D1D1F",                // text-primary (grey-900)
    primary: "#E63946",                   // red-500 / brand-red
    primaryForeground: "#FFFFFF",         // text-on-brand
    secondary: "#F4F4F5",                 // grey-50 / surface-primary-light
    secondaryForeground: "#5E5E68",       // text-secondary (grey-600)
    muted: "#EBEBED",                     // grey-100 / surface-primary-neutral
    mutedForeground: "#808088",           // text-tertiary (grey-500)
    accent: "#E63946",                    // red-500
    accentForeground: "#FFFFFF",          // text-brand-inverted
    destructive: "#E63946",               // red-500
    border: "#D5D5D9",                    // border-default (grey-200)
    input: "#EBEBED",                     // grey-100
    ring: "#E63946",                      // red-500
    card: "#FFFFFF",                      // surface-primary
    cardForeground: "#1D1D1F",            // text-primary (grey-900)
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

    /* ── Brand Colors ── */
    --rebtel-brand-red: #E63946;
    --rebtel-brand-black: #1D1D1F;
    --rebtel-brand-white: #FFFFFF;

    /* ── Grey Scale ── */
    --rebtel-grey-900: #1D1D1F;
    --rebtel-grey-800: #2D2D32;
    --rebtel-grey-700: #474750;
    --rebtel-grey-600: #5E5E68;
    --rebtel-grey-500: #808088;
    --rebtel-grey-400: #9E9EA6;
    --rebtel-grey-300: #BFBFC4;
    --rebtel-grey-200: #D5D5D9;
    --rebtel-grey-100: #EBEBED;
    --rebtel-grey-50: #F4F4F5;
    --rebtel-grey-0: #FFFFFF;

    /* ── Red Scale ── */
    --rebtel-red-900: #661822;
    --rebtel-red-800: #8C1E2A;
    --rebtel-red-700: #B3263A;
    --rebtel-red-600: #D92D42;
    --rebtel-red-500: #E63946;
    --rebtel-red-400: #EB5E6E;
    --rebtel-red-300: #F08D98;
    --rebtel-red-200: #F5B2BA;
    --rebtel-red-100: #F9D4D8;
    --rebtel-red-50: #FDE9EB;

    /* ── Semantic Colors ── */
    --rebtel-warning: #F5A623;
    --rebtel-warning-light: #FDE8C8;
    --rebtel-warning-lighter: #FEF4E4;
    --rebtel-success: #2ECC71;
    --rebtel-success-light: #E8F8F0;
    --rebtel-green: #34C759;
    --rebtel-green-light: #E8F7ED;
    --rebtel-green-lighter: #C5F0D3;
    --rebtel-purple: #6366F1;

    /* ── Surface Mapped Tokens ── */
    --rebtel-surface-primary: #FFFFFF;
    --rebtel-surface-primary-elevated: #FFFFFF;
    --rebtel-surface-primary-inverse: #1D1D1F;
    --rebtel-surface-primary-neutral: #EBEBED;
    --rebtel-surface-primary-light: #F4F4F5;
    --rebtel-surface-primary-lighter: #FFFFFF;
    --rebtel-surface-brand-red: #E63946;

    /* ── Text Mapped Tokens ── */
    --rebtel-text-primary: #1D1D1F;
    --rebtel-text-secondary: #5E5E68;
    --rebtel-text-tertiary: #808088;
    --rebtel-text-highlight: #E63946;
    --rebtel-text-brand-inverted: #FFFFFF;
    --rebtel-text-on-brand: #FFFFFF;

    /* ── Icon Mapped Tokens ── */
    --rebtel-icon-default: #2D2D32;
    --rebtel-icon-secondary: #808088;
    --rebtel-icon-disabled: #BFBFC4;
    --rebtel-icon-brand: #E63946;

    /* ── Border Mapped Tokens ── */
    --rebtel-border-default: #D5D5D9;
    --rebtel-border-secondary: #EBEBED;
    --rebtel-border-highlight: #E63946;

    /* ── Button Surface Tokens ── */
    --rebtel-button-primary: #E63946;
    --rebtel-button-secondary-white: #FFFFFF;
    --rebtel-button-secondary-grey: #F4F4F5;
    --rebtel-button-disabled: #EBEBED;
    --rebtel-button-green: #34C759;

    /* ── Legacy Aliases (backwards compat) ── */
    --rebtel-red: #E63946;
    --rebtel-red-dark: #B3263A;
    --rebtel-red-light: #FDE9EB;
    --rebtel-green-dark: #27AE60;
    --rebtel-call-green: #2ECC71;
    --rebtel-call-red: #E63946;
    --rebtel-gradient-primary: linear-gradient(135deg, #E63946 0%, #D92D42 100%);
    --rebtel-gradient-success: linear-gradient(135deg, #34C759 0%, #2ECC71 100%);
  }
`;
