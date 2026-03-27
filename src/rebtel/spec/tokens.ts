// ============================================================
// Token Resolution — dot-path → CSS custom property
// ============================================================
// Maps ComponentSpec TokenRef values to the CSS custom
// properties defined in designSystem.ts REBTEL_EXTRA_CSS.
// ============================================================

import type { TextStyleToken, TokenRef } from "./types";
import { isTokenRef } from "./types";

// ── Token Map ────────────────────────────────────────────────

export const TOKEN_MAP: Record<string, string> = {
  // Spacing
  "spacing.xxxs": "var(--rebtel-spacing-xxxs)", // 2px
  "spacing.xxs": "var(--rebtel-spacing-xxs)", // 4px
  "spacing.xs": "var(--rebtel-spacing-xs)", // 8px
  "spacing.sm": "var(--rebtel-spacing-sm)", // 12px
  "spacing.md": "var(--rebtel-spacing-md)", // 16px
  "spacing.lg": "var(--rebtel-spacing-lg)", // 20px
  "spacing.xl": "var(--rebtel-spacing-xl)", // 24px
  "spacing.xxl": "var(--rebtel-spacing-xxl)", // 32px
  "spacing.xxxl": "var(--rebtel-spacing-xxxl)", // 52px
  "spacing.xxxxl": "var(--rebtel-spacing-xxxxl)", // 72px

  // Object Heights
  "height.xs": "var(--rebtel-height-xs)", // 24px
  "height.sm": "var(--rebtel-height-sm)", // 32px
  "height.md": "var(--rebtel-height-md)", // 40px
  "height.lg": "var(--rebtel-height-lg)", // 48px
  "height.xl": "var(--rebtel-height-xl)", // 52px
  "height.xxl": "var(--rebtel-height-xxl)", // 64px
  "height.xxxl": "var(--rebtel-height-xxxl)", // 72px

  // Border Radius
  "radius.xs": "var(--rebtel-radius-xs)", // 4px
  "radius.sm": "var(--rebtel-radius-sm)", // 8px
  "radius.md": "var(--rebtel-radius-md)", // 12px
  "radius.lg": "var(--rebtel-radius-lg)", // 16px
  "radius.xl": "var(--rebtel-radius-xl)", // 24px
  "radius.xxl": "var(--rebtel-radius-xxl)", // 32px
  "radius.full": "var(--rebtel-radius-full)", // 9999px

  // Surface Colors
  "color.surface-primary": "var(--rebtel-surface-primary)",
  "color.surface-elevated": "var(--rebtel-surface-primary-elevated)",
  "color.surface-inverse": "var(--rebtel-surface-primary-inverse)",
  "color.surface-neutral": "var(--rebtel-surface-primary-neutral)",
  "color.surface-light": "var(--rebtel-surface-primary-light)",
  "color.surface-lighter": "var(--rebtel-surface-primary-lighter)",
  "color.surface-brand": "var(--rebtel-surface-brand-red)",

  // Text Colors
  "color.text-primary": "var(--rebtel-text-primary)",
  "color.text-secondary": "var(--rebtel-text-secondary)",
  "color.text-tertiary": "var(--rebtel-text-tertiary)",
  "color.text-highlight": "var(--rebtel-text-highlight)",
  "color.text-brand-inverted": "var(--rebtel-text-brand-inverted)",
  "color.text-on-brand": "var(--rebtel-text-on-brand)",

  // Icon Colors
  "color.icon-default": "var(--rebtel-icon-default)",
  "color.icon-secondary": "var(--rebtel-icon-secondary)",
  "color.icon-disabled": "var(--rebtel-icon-disabled)",
  "color.icon-brand": "var(--rebtel-icon-brand)",

  // Brand Colors
  "color.brand-red": "var(--rebtel-brand-red)",
  "color.brand-black": "var(--rebtel-brand-black)",
  "color.brand-white": "var(--rebtel-brand-white)",

  // Border Colors
  "color.border-default": "var(--rebtel-border-default)",
  "color.border-secondary": "var(--rebtel-border-secondary)",
  "color.border-highlight": "var(--rebtel-border-highlight)",

  // Button Surface Colors
  "color.button-primary": "var(--rebtel-button-primary)",
  "color.button-secondary-white": "var(--rebtel-button-secondary-white)",
  "color.button-secondary-grey": "var(--rebtel-button-secondary-grey)",
  "color.button-disabled": "var(--rebtel-button-disabled)",
  "color.button-green": "var(--rebtel-button-green)",

  // Semantic Colors
  "color.green": "var(--rebtel-green)",
  "color.green-light": "var(--rebtel-green-light)",
  "color.success": "var(--rebtel-success)",
  "color.success-light": "var(--rebtel-success-light)",
  "color.warning": "var(--rebtel-warning)",
  "color.warning-light": "var(--rebtel-warning-light)",
  "color.red-light": "var(--rebtel-red-light)",
  "color.red-50": "var(--rebtel-red-50)",
  "color.purple": "var(--rebtel-purple)",

  // Grey Scale
  "color.grey-900": "var(--rebtel-grey-900)",
  "color.grey-800": "var(--rebtel-grey-800)",
  "color.grey-700": "var(--rebtel-grey-700)",
  "color.grey-600": "var(--rebtel-grey-600)",
  "color.grey-500": "var(--rebtel-grey-500)",
  "color.grey-400": "var(--rebtel-grey-400)",
  "color.grey-300": "var(--rebtel-grey-300)",
  "color.grey-200": "var(--rebtel-grey-200)",
  "color.grey-100": "var(--rebtel-grey-100)",
  "color.grey-50": "var(--rebtel-grey-50)",
  "color.grey-0": "var(--rebtel-grey-0)",

  // Figma 3.0 Surface Tokens (Mapped)
  "color.surface-canvas": "var(--rebtel-surface-canvas)",
  "color.surface-default": "var(--rebtel-surface-default)",
  "color.surface-raised": "var(--rebtel-surface-raised)",
  "color.surface-overlay": "var(--rebtel-surface-overlay)",
  "color.surface-sheet": "var(--rebtel-surface-sheet)",
  "color.surface-calling": "var(--rebtel-surface-calling)",
  "color.surface-mtu": "var(--rebtel-surface-mtu)",

  // Figma 3.0 Content Tokens (Mapped)
  "color.content-primary": "var(--rebtel-content-primary)",
  "color.content-secondary": "var(--rebtel-content-secondary)",
  "color.content-tertiary": "var(--rebtel-content-tertiary)",
  "color.content-disabled": "var(--rebtel-content-disabled)",
  "color.content-inverse": "var(--rebtel-content-inverse)",
  "color.content-brand": "var(--rebtel-content-brand)",
  "color.content-success": "var(--rebtel-content-success)",

  // Figma 3.0 Button Tokens (Component)
  "color.button-primary-bg": "var(--rebtel-button-primary-bg)",
  "color.button-primary-text": "var(--rebtel-button-primary-text)",
  "color.button-secondary-black-bg": "var(--rebtel-button-secondary-black-bg)",
  "color.button-secondary-black-text": "var(--rebtel-button-secondary-black-text)",
  "color.button-outlined-border": "var(--rebtel-button-outlined-border)",
  "color.button-outlined-text": "var(--rebtel-button-outlined-text)",

  // Shadows (Figma 3.0 audited)
  "shadow.sm": "0 1px 2px rgba(50,50,93,0.04)",
  "shadow.card": "4px 5px 10px 2px rgba(0,0,0,0.02)",
  "shadow.md": "0 4px 12px rgba(50,50,93,0.06)",
  "shadow.lg": "0 8px 24px rgba(50,50,93,0.08)",
  "shadow.button": "0 1px 3px rgba(50,50,93,0.06)",
};

// ── Text Style Map ───────────────────────────────────────────

export interface TextStyleDef {
  family: string;
  size: string;
  lh: string;
  weight: number;
  ls: string;
}

export const TEXT_STYLE_MAP: Record<TextStyleToken, TextStyleDef> = {
  // Display (Pano)
  "display-lg": {
    family: "var(--rebtel-font-display)",
    size: "var(--rebtel-display-lg-size)",
    lh: "var(--rebtel-display-lg-lh)",
    weight: 700,
    ls: "var(--rebtel-ls)",
  },
  "display-md": {
    family: "var(--rebtel-font-display)",
    size: "var(--rebtel-display-md-size)",
    lh: "var(--rebtel-display-md-lh)",
    weight: 700,
    ls: "var(--rebtel-ls)",
  },
  "display-sm": {
    family: "var(--rebtel-font-display)",
    size: "var(--rebtel-display-sm-size)",
    lh: "var(--rebtel-display-sm-lh)",
    weight: 700,
    ls: "var(--rebtel-ls)",
  },
  "display-xs": {
    family: "var(--rebtel-font-display)",
    size: "var(--rebtel-display-xs-size)",
    lh: "var(--rebtel-display-xs-lh)",
    weight: 700,
    ls: "var(--rebtel-ls)",
  },

  // Headline (KH Teka)
  "headline-lg": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-headline-lg-size)",
    lh: "var(--rebtel-headline-lg-lh)",
    weight: 700,
    ls: "var(--rebtel-ls)",
  },
  "headline-md": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-headline-md-size)",
    lh: "var(--rebtel-headline-md-lh)",
    weight: 700,
    ls: "var(--rebtel-ls)",
  },
  "headline-sm": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-headline-sm-size)",
    lh: "var(--rebtel-headline-sm-lh)",
    weight: 600,
    ls: "var(--rebtel-ls)",
  },
  "headline-xs": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-headline-xs-size)",
    lh: "var(--rebtel-headline-xs-lh)",
    weight: 600,
    ls: "var(--rebtel-ls)",
  },

  // Paragraph (KH Teka)
  "paragraph-xl": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-paragraph-xl-size)",
    lh: "var(--rebtel-paragraph-xl-lh)",
    weight: 400,
    ls: "var(--rebtel-ls)",
  },
  "paragraph-lg": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-paragraph-lg-size)",
    lh: "var(--rebtel-paragraph-lg-lh)",
    weight: 400,
    ls: "var(--rebtel-ls)",
  },
  "paragraph-md": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-paragraph-md-size)",
    lh: "var(--rebtel-paragraph-md-lh)",
    weight: 400,
    ls: "var(--rebtel-ls)",
  },
  "paragraph-sm": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-paragraph-sm-size)",
    lh: "var(--rebtel-paragraph-sm-lh)",
    weight: 400,
    ls: "var(--rebtel-ls)",
  },
  "paragraph-xs": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-paragraph-xs-size)",
    lh: "var(--rebtel-paragraph-xs-lh)",
    weight: 400,
    ls: "var(--rebtel-ls)",
  },

  // Label (KH Teka)
  "label-xl": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-label-xl-size)",
    lh: "var(--rebtel-label-xl-lh)",
    weight: 500,
    ls: "var(--rebtel-ls)",
  },
  "label-lg": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-label-lg-size)",
    lh: "var(--rebtel-label-lg-lh)",
    weight: 500,
    ls: "var(--rebtel-ls)",
  },
  "label-md": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-label-md-size)",
    lh: "var(--rebtel-label-md-lh)",
    weight: 500,
    ls: "var(--rebtel-ls)",
  },
  "label-sm": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-label-sm-size)",
    lh: "var(--rebtel-label-sm-lh)",
    weight: 500,
    ls: "var(--rebtel-ls)",
  },
  "label-xs": {
    family: "var(--rebtel-font-body)",
    size: "var(--rebtel-label-xs-size)",
    lh: "var(--rebtel-label-xs-lh)",
    weight: 500,
    ls: "var(--rebtel-ls)",
  },
};

// ── Resolution Functions ─────────────────────────────────────

/**
 * Resolve a TokenRef or literal string to a CSS value.
 * TokenRef objects are looked up in TOKEN_MAP.
 * Literal strings and numbers are passed through.
 */
export function resolveToken(ref: TokenRef | string | number): string {
  if (typeof ref === "number") return `${ref}px`;
  if (typeof ref === "string") return ref;
  if (isTokenRef(ref)) {
    const val = TOKEN_MAP[ref.token];
    if (!val) {
      console.warn(`[spec/tokens] Unknown token: "${ref.token}"`);
      return "0px";
    }
    return val;
  }
  return "0px";
}

/** Resolve a TextStyleToken to its CSS properties */
export function resolveTextStyle(style: TextStyleToken): TextStyleDef {
  return TEXT_STYLE_MAP[style];
}
