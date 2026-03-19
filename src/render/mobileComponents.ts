// ============================================================
// APHANTASIA — Mobile Component Library (Layer 1)
// ============================================================
// Pure sync functions that return HTML strings using semantic
// CSS classes defined in mobileCSS.ts. All theming flows
// through CSS custom properties — when a design system is
// extracted, the tokens update and everything re-skins.
// ============================================================

import type { UIDesignSystem } from "@/types/uiDesign";
import { MOBILE_BASE_CSS } from "./mobileCSS";

export interface MobileShapeBlock {
  id: string;
  semanticTag: string;
  label: string;
  y: number;
  height: number;
  isSticky: boolean;
}

// ---------------------------------------------------------------------------
// Design system defaults
// ---------------------------------------------------------------------------

const DEFAULT_DS: UIDesignSystem = {
  primaryColor: "#6366F1",
  secondaryColor: "#4F46E5",
  backgroundColor: "#FFFFFF",
  surfaceColor: "#F8FAFC",
  surfaceAltColor: "#F1F5F9",
  textColor: "#0F172A",
  textMutedColor: "#64748B",
  accentColor: "#06B6D4",
  borderColor: "#E2E8F0",
  errorColor: "#EF4444",
  successColor: "#22C55E",
  warningColor: "#F59E0B",
  buttonTextColor: "#FFFFFF",
  navBackground: "#FFFFFF",
  cardBorderColor: "#F1F5F9",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  headingSize: "28px",
  subheadingSize: "20px",
  bodySize: "15px",
  captionSize: "12px",
  labelSize: "13px",
  headingWeight: "700",
  bodyWeight: "400",
  headingLineHeight: "1.2",
  bodyLineHeight: "1.6",
  headingLetterSpacing: "-0.5px",
  borderRadius: "10px",
  cardRadius: "16px",
  buttonRadius: "12px",
  inputRadius: "10px",
  avatarRadius: "50%",
  tagRadius: "6px",
  shadowSm: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowCard: "0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
  shadowLg: "0 12px 40px rgba(0,0,0,0.12)",
  spacingXs: "4px",
  spacingSm: "8px",
  spacingBase: "16px",
  spacingLg: "24px",
  spacingXl: "32px",
  sectionPadding: "20px",
  navHeight: "56px",
  tabBarHeight: "64px",
  buttonHeight: "52px",
  inputHeight: "48px",
  listItemHeight: "64px",
  cardPadding: "16px",
  iconSize: "24px",
  borderWidth: "1px",
  dividerColor: "#F1F5F9",
  mood: "clean modern minimal",
  density: "normal",
  iconStyle: "outlined",
  elevationStyle: "shadow",
};

function ds(design?: UIDesignSystem): UIDesignSystem & typeof DEFAULT_DS {
  if (!design) return DEFAULT_DS;
  return { ...DEFAULT_DS, ...design };
}

// ---------------------------------------------------------------------------
// SVG Icons (lightweight inline icons for components)
// ---------------------------------------------------------------------------

const ICONS = {
  back: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  more: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
  search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  bell: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  chevron: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  image: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  home: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
  compass: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  heart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  chat: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  user: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
};

const TAB_ICONS = [ICONS.home, ICONS.compass, ICONS.heart, ICONS.chat, ICONS.user];
const TAB_LABELS = ["Home", "Explore", "Saved", "Chat", "Profile"];

// ---------------------------------------------------------------------------
// Component renderers
// ---------------------------------------------------------------------------

function renderNav(block: MobileShapeBlock, design?: UIDesignSystem): string {
  const d = ds(design);
  const elevClass = d.elevationStyle === "shadow" ? "mob-nav--shadow" : "mob-nav--border";
  const stickyClass = block.isSticky ? "mob-nav--sticky" : "";
  return `
<section data-aph-id="${block.id}" data-aph-type="nav" class="mob-nav ${elevClass} ${stickyClass}">
  ${block.label
    ? `<span class="mob-nav__title">${block.label}</span>`
    : `<span class="mob-nav__back">${ICONS.back}</span><div class="mob-skel mob-skel--lg" style="width:80px"></div>`}
  <div class="mob-nav__actions">
    <div class="mob-nav__icon">${ICONS.bell}</div>
  </div>
</section>`;
}

function renderHero(block: MobileShapeBlock, design?: UIDesignSystem): string {
  return `
<section data-aph-id="${block.id}" data-aph-type="hero" class="mob-hero mob-hero--gradient">
  ${block.label
    ? `<h1 class="mob-hero__heading">${block.label}</h1>`
    : `<div class="mob-section__placeholder">
        <div class="mob-skel mob-skel--lg mob-skel--w65"></div>
        <div class="mob-skel mob-skel--sm mob-skel--w50" style="margin-top:8px"></div>
      </div>`}
</section>`;
}

function renderCards(block: MobileShapeBlock, design?: UIDesignSystem): string {
  const d = ds(design);
  const elevClass = d.elevationStyle === "shadow" ? "mob-card--shadow"
    : d.elevationStyle === "border" ? "mob-card--border" : "mob-card--flat";
  const cards = [0, 1, 2, 3].map(() => `
    <div class="mob-card ${elevClass}">
      <div class="mob-card__icon"><div class="mob-card__icon-inner"></div></div>
      <div class="mob-skel" style="width:70%"></div>
      <div class="mob-skel mob-skel--sm" style="width:50%"></div>
    </div>`).join("");
  return `
<section data-aph-id="${block.id}" data-aph-type="cards" class="mob-cards">
  ${block.label ? `<h2 class="mob-cards__title">${block.label}</h2>` : ""}
  <div class="mob-cards__grid">${cards}</div>
</section>`;
}

function renderSection(block: MobileShapeBlock): string {
  return `
<section data-aph-id="${block.id}" data-aph-type="section" class="mob-section">
  ${block.label
    ? `<h2 class="mob-section__heading">${block.label}</h2>`
    : `<div class="mob-section__placeholder">
        <div class="mob-skel mob-skel--lg mob-skel--w50"></div>
        <div class="mob-skel mob-skel--sm mob-skel--w90" style="margin-top:6px"></div>
      </div>`}
</section>`;
}

function renderForm(block: MobileShapeBlock, design?: UIDesignSystem): string {
  const d = ds(design);
  const inputClass = d.elevationStyle === "flat" ? "mob-input mob-input--filled" : "mob-input mob-input--bordered";
  return `
<section data-aph-id="${block.id}" data-aph-type="form" class="mob-form">
  ${block.label ? `<h2 class="mob-form__title">${block.label}</h2>` : ""}
  <div class="mob-form__fields">
    <div class="mob-form__field">
      <label class="mob-form__label">Email</label>
      <input type="email" class="${inputClass}" placeholder="you@example.com" readonly />
    </div>
    <div class="mob-form__field">
      <label class="mob-form__label">Password</label>
      <input type="password" class="${inputClass}" placeholder="••••••••" readonly />
    </div>
    <button class="mob-btn mob-btn--primary mob-mt-sm">Continue</button>
  </div>
</section>`;
}

function renderButton(block: MobileShapeBlock): string {
  return `
<section data-aph-id="${block.id}" data-aph-type="button" class="mob-btn-wrap">
  <button class="mob-btn mob-btn--primary mob-btn--primary-shadow">${block.label || "Continue"}</button>
</section>`;
}

function renderTabBar(block: MobileShapeBlock, design?: UIDesignSystem): string {
  const d = ds(design);
  const isSticky = block.isSticky || block.y > 400;
  const elevClass = d.elevationStyle === "shadow" ? "mob-tab-bar--shadow" : "mob-tab-bar--border";
  const stickyClass = isSticky ? "mob-tab-bar--sticky" : "";
  const tabs = TAB_ICONS.map((icon, i) => `
    <div class="mob-tab-bar__item">
      <div class="mob-tab-bar__icon ${i === 0 ? "mob-tab-bar__icon--active" : "mob-tab-bar__icon--inactive"}">${icon}</div>
      <span class="mob-tab-bar__label ${i === 0 ? "mob-tab-bar__label--active" : "mob-tab-bar__label--inactive"}">${TAB_LABELS[i]}</span>
    </div>`).join("");
  return `
<section data-aph-id="${block.id}" data-aph-type="footer" class="mob-tab-bar ${elevClass} ${stickyClass}">${tabs}</section>`;
}

function renderTextBlock(block: MobileShapeBlock): string {
  return `
<section data-aph-id="${block.id}" data-aph-type="text-block" class="mob-text">
  ${block.label
    ? `<p class="mob-text__body">${block.label}</p>`
    : `<div class="mob-section__placeholder">
        <div class="mob-skel mob-skel--w90"></div>
        <div class="mob-skel mob-skel--sm mob-skel--w65"></div>
      </div>`}
</section>`;
}

function renderImage(block: MobileShapeBlock): string {
  const h = Math.max(block.height, 160);
  return `
<section data-aph-id="${block.id}" data-aph-type="image" class="mob-image">
  <div class="mob-image__placeholder" style="height:${h}px">
    <span class="mob-image__icon">${ICONS.image}</span>
  </div>
</section>`;
}

function renderListSection(block: MobileShapeBlock): string {
  const rows = [0, 1, 2].map(() => `
    <div class="mob-list__row">
      <div class="mob-list__avatar"><div class="mob-list__avatar-icon"></div></div>
      <div class="mob-list__content">
        <div class="mob-skel" style="width:55%"></div>
        <div class="mob-skel mob-skel--sm" style="width:35%;margin-top:4px"></div>
      </div>
      <span class="mob-list__chevron">${ICONS.chevron}</span>
    </div>`).join("");
  return `
<section data-aph-id="${block.id}" data-aph-type="section" class="mob-list">
  ${block.label ? `<h3 class="mob-list__heading">${block.label}</h3>` : ""}
  ${rows}
</section>`;
}

function renderGeneric(block: MobileShapeBlock): string {
  const minH = Math.max(block.height, 60);
  return `
<section data-aph-id="${block.id}" data-aph-type="${block.semanticTag}" class="mob-generic" style="min-height:${minH}px">
  ${block.label
    ? `<p class="mob-generic__text">${block.label}</p>`
    : `<div class="mob-skel mob-skel--w50"></div>`}
</section>`;
}

// ---------------------------------------------------------------------------
// Main dispatcher
// ---------------------------------------------------------------------------

export function renderMobileBlock(block: MobileShapeBlock, design?: UIDesignSystem): string {
  switch (block.semanticTag) {
    case "nav":       return renderNav(block, design);
    case "hero":      return renderHero(block, design);
    case "cards":     return renderCards(block, design);
    case "section":   return renderSection(block);
    case "form":      return renderForm(block, design);
    case "button":    return renderButton(block);
    case "footer":    return renderTabBar(block, design);
    case "text-block": return renderTextBlock(block);
    case "image":     return renderImage(block);
    case "split":     return renderListSection(block);
    default:          return renderGeneric(block);
  }
}

// ---------------------------------------------------------------------------
// Document wrapper
// ---------------------------------------------------------------------------

function googleFontImport(fontFamily: string): string {
  const knownFonts: Record<string, string> = {
    inter: "Inter:wght@400;500;600;700",
    "plus jakarta sans": "Plus+Jakarta+Sans:wght@400;500;600;700",
    nunito: "Nunito:wght@400;500;600;700",
    poppins: "Poppins:wght@400;500;600;700",
    raleway: "Raleway:wght@400;500;600;700",
    "dm sans": "DM+Sans:wght@400;500;600;700",
    manrope: "Manrope:wght@400;500;600;700",
    geist: "Geist:wght@400;500;600;700",
    outfit: "Outfit:wght@400;500;600;700",
    sora: "Sora:wght@400;500;600;700",
    "sf pro": "Inter:wght@400;500;600;700",
    "sf pro display": "Inter:wght@400;500;600;700",
    roboto: "Roboto:wght@400;500;600;700",
    lato: "Lato:wght@400;700",
    "open sans": "Open+Sans:wght@400;500;600;700",
    montserrat: "Montserrat:wght@400;500;600;700",
    "work sans": "Work+Sans:wght@400;500;600;700",
    figtree: "Figtree:wght@400;500;600;700",
    "space grotesk": "Space+Grotesk:wght@400;500;600;700",
  };
  const key = fontFamily.toLowerCase().replace(/['"]/g, "").split(",")[0].trim();
  const found = Object.entries(knownFonts).find(([k]) => key.includes(k));
  if (!found) return "";
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=${found[1]}&display=swap" rel="stylesheet">`;
}

function designTokensCSS(design?: UIDesignSystem): string {
  const d = ds(design);
  return `:root {
  /* Palette */
  --color-primary: ${d.primaryColor};
  --color-secondary: ${d.secondaryColor};
  --color-bg: ${d.backgroundColor};
  --color-surface: ${d.surfaceColor};
  --color-surface-alt: ${d.surfaceAltColor};
  --color-text: ${d.textColor};
  --color-text-muted: ${d.textMutedColor};
  --color-accent: ${d.accentColor};
  --color-border: ${d.borderColor};
  --color-error: ${d.errorColor || "#EF4444"};
  --color-success: ${d.successColor || "#22C55E"};
  --color-warning: ${d.warningColor || "#F59E0B"};
  --color-btn-text: ${d.buttonTextColor || "#FFFFFF"};
  --color-nav-bg: ${d.navBackground || d.backgroundColor};
  --color-card-border: ${d.cardBorderColor || d.borderColor};
  --color-divider: ${d.dividerColor || d.borderColor};
  /* Typography */
  --font-family: ${d.fontFamily};
  --font-heading: ${d.headingSize};
  --font-subheading: ${d.subheadingSize || "20px"};
  --font-body: ${d.bodySize};
  --font-caption: ${d.captionSize};
  --font-label: ${d.labelSize || d.captionSize};
  --font-weight-heading: ${d.headingWeight};
  --font-weight-body: ${d.bodyWeight || "400"};
  --line-height-heading: ${d.headingLineHeight || "1.2"};
  --line-height-body: ${d.bodyLineHeight || "1.6"};
  --letter-spacing-heading: ${d.headingLetterSpacing || "-0.5px"};
  /* Radii */
  --radius-base: ${d.borderRadius};
  --radius-card: ${d.cardRadius};
  --radius-button: ${d.buttonRadius};
  --radius-input: ${d.inputRadius};
  --radius-avatar: ${d.avatarRadius || "50%"};
  --radius-tag: ${d.tagRadius || "6px"};
  /* Shadows */
  --shadow-sm: ${d.shadowSm};
  --shadow-card: ${d.shadowCard};
  --shadow-lg: ${d.shadowLg || "0 12px 40px rgba(0,0,0,0.12)"};
  /* Spacing */
  --spacing-xs: ${d.spacingXs || "4px"};
  --spacing-sm: ${d.spacingSm || "8px"};
  --spacing-base: ${d.spacingBase};
  --spacing-lg: ${d.spacingLg};
  --spacing-xl: ${d.spacingXl || "32px"};
  --section-padding: ${d.sectionPadding || "20px"};
  /* Component dims */
  --nav-height: ${d.navHeight || "56px"};
  --tab-bar-height: ${d.tabBarHeight || "64px"};
  --button-height: ${d.buttonHeight || "52px"};
  --input-height: ${d.inputHeight || "48px"};
  --list-item-height: ${d.listItemHeight || "64px"};
  --card-padding: ${d.cardPadding || "16px"};
  --icon-size: ${d.iconSize || "24px"};
  --border-width: ${d.borderWidth || "1px"};
}`;
}

export function buildMobileDocument(body: string, design?: UIDesignSystem): string {
  const d = ds(design);
  const fontImport = googleFontImport(d.fontFamily);
  const tokens = designTokensCSS(design);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=393, initial-scale=1, user-scalable=no">
${fontImport}
<style>
${tokens}
${MOBILE_BASE_CSS}
</style>
</head>
<body>
${body}
</body>
</html>`;
}
