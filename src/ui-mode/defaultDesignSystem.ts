// ============================================================
// APHANTASIA — Default UI Design System
// ============================================================
// A polished, modern iOS-style default that renders beautifully
// with zero configuration. This is what users see before they
// upload a reference screenshot. It must look like a real app.
//
// Font: Inter (closest Google Font to SF Pro)
// Palette: Clean light mode with indigo primary
// Spacing: iOS-standard (16px margins, 12px internal padding)
// Radii: Soft-rounded (12px cards, 10px buttons, 8px inputs)
// Shadows: Subtle elevation on cards, none on inputs
// ============================================================

import type { UIDesignSystem } from "./types";

export const DEFAULT_UI_DESIGN_SYSTEM: UIDesignSystem = {
  // ── Typography ──
  fonts: {
    heading: {
      family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      weight: 700,
      letterSpacing: "-0.02em",
    },
    body: {
      family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      weight: 400,
      letterSpacing: "-0.01em",
    },
    caption: {
      family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      weight: 400,
    },
    mono: {
      family: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      weight: 400,
    },
  },
  fontSizes: {
    xs: "11px",
    sm: "13px",
    base: "15px",
    lg: "17px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "34px",
  },

  // ── Colors ──
  colors: {
    background: "#FFFFFF",
    foreground: "#0F172A",
    primary: "#6366F1",
    primaryForeground: "#FFFFFF",
    secondary: "#F1F5F9",
    secondaryForeground: "#334155",
    muted: "#F1F5F9",
    mutedForeground: "#64748B",
    accent: "#6366F1",
    accentForeground: "#FFFFFF",
    destructive: "#EF4444",
    border: "#E2E8F0",
    input: "#E2E8F0",
    ring: "#6366F1",
    card: "#FFFFFF",
    cardForeground: "#0F172A",
  },

  // ── Spacing ──
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
  },

  // ── Border Radii ──
  radii: {
    none: "0px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
    button: "10px",
    card: "12px",
    input: "8px",
  },

  // ── Shadows ──
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 12px rgba(0, 0, 0, 0.08)",
    lg: "0 8px 24px rgba(0, 0, 0, 0.12)",
    card: "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
    button: "0 1px 3px rgba(0, 0, 0, 0.08)",
    input: "0 1px 2px rgba(0, 0, 0, 0.04)",
  },

  // ── Component-Specific Tokens ──
  components: {
    navBar: {
      height: "56px",
      blur: "saturate(180%) blur(20px)",
      borderBottom: "1px solid var(--color-border)",
    },
    card: {
      padding: "16px",
      gap: "12px",
    },
    button: {
      height: "44px",
      paddingX: "20px",
      fontSize: "15px",
    },
    input: {
      height: "44px",
      paddingX: "14px",
      fontSize: "15px",
    },
    list: {
      itemHeight: "56px",
      divider: "1px solid var(--color-border)",
    },
    tabBar: {
      height: "49px",
      iconSize: "24px",
    },
  },

  // ── Meta ──
  name: "Default iOS",
  confidence: 1.0,
};
