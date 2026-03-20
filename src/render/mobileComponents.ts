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
  x: number;
  y: number;
  width: number;
  height: number;
  isSticky: boolean;
  /** For grouped components (list items, cards): how many items in the group */
  itemCount?: number;
  /** IDs of shapes consumed into this group (so they aren't rendered individually) */
  consumedIds?: string[];
}

// ---------------------------------------------------------------------------
// Design system defaults (nested structure)
// ---------------------------------------------------------------------------

const DEFAULT_DS: UIDesignSystem = {
  platform: "ios",
  colors: {
    background: "#FFFFFF",
    backgroundSecondary: "#F8FAFC",
    foreground: "#0F172A",
    foregroundSecondary: "#64748B",
    foregroundTertiary: "#94A3B8",
    accent: "#6366F1",
    accentForeground: "#FFFFFF",
    separator: "#E2E8F0",
    destructive: "#EF4444",
    surface: "#F8FAFC",
    surfaceElevated: "#FFFFFF",
    overlay: "rgba(0,0,0,0.4)",
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    scale: {
      largeTitle: { size: "34px", weight: "700", tracking: "-0.4px" },
      title1: { size: "28px", weight: "700", tracking: "-0.4px" },
      title2: { size: "22px", weight: "700", tracking: "-0.3px" },
      title3: { size: "20px", weight: "600", tracking: "-0.2px" },
      headline: { size: "17px", weight: "600", tracking: "-0.2px" },
      body: { size: "17px", weight: "400", tracking: "-0.2px" },
      callout: { size: "16px", weight: "400", tracking: "-0.2px" },
      subhead: { size: "15px", weight: "400", tracking: "-0.1px" },
      footnote: { size: "13px", weight: "400", tracking: "0px" },
      caption: { size: "12px", weight: "400", tracking: "0px" },
    },
  },
  shape: {
    radiusSmall: "6px",
    radiusMedium: "12px",
    radiusLarge: "16px",
    radiusFull: "999px",
  },
  elevation: {
    model: "subtle-shadow",
    cardShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
    sheetShadow: "0 -4px 24px rgba(0,0,0,0.12)",
    navShadow: "none",
  },
  spacing: {
    screenPadding: "20px",
    sectionGap: "24px",
    itemGap: "8px",
    innerPadding: "16px",
    iconSize: "24px",
    avatarSize: "40px",
  },
  components: {
    navBar: {
      style: "inline-title",
      background: "#FFFFFF",
      titleWeight: "700",
      hasDivider: true,
    },
    tabBar: {
      style: "icon-label",
      background: "#FFFFFF",
      activeColor: "#6366F1",
      inactiveColor: "#94A3B8",
      hasDivider: true,
    },
    listItem: {
      height: "56px",
      style: "plain",
      hasChevron: true,
      hasDivider: true,
      dividerInset: "16px",
    },
    card: {
      style: "elevated",
      padding: "16px",
      radius: "16px",
    },
    button: {
      primaryStyle: "filled",
      radius: "12px",
      height: "52px",
      textWeight: "600",
    },
    input: {
      style: "bordered",
      radius: "10px",
      height: "48px",
    },
    statusBar: "dark",
  },
  iconography: {
    style: "sf-symbols",
    weight: "regular",
    size: "24px",
  },
};

/** Deep-merge a partial design system over defaults. */
function ds(design?: UIDesignSystem | null): UIDesignSystem {
  if (!design) return DEFAULT_DS;
  return {
    productName: design.productName ?? DEFAULT_DS.productName,
    platform: design.platform ?? DEFAULT_DS.platform,
    colors: { ...DEFAULT_DS.colors, ...design.colors },
    typography: {
      fontFamily: design.typography?.fontFamily ?? DEFAULT_DS.typography.fontFamily,
      fontFamilyMono: design.typography?.fontFamilyMono ?? DEFAULT_DS.typography.fontFamilyMono,
      scale: {
        largeTitle: { ...DEFAULT_DS.typography.scale.largeTitle, ...design.typography?.scale?.largeTitle },
        title1: { ...DEFAULT_DS.typography.scale.title1, ...design.typography?.scale?.title1 },
        title2: { ...DEFAULT_DS.typography.scale.title2, ...design.typography?.scale?.title2 },
        title3: { ...DEFAULT_DS.typography.scale.title3, ...design.typography?.scale?.title3 },
        headline: { ...DEFAULT_DS.typography.scale.headline, ...design.typography?.scale?.headline },
        body: { ...DEFAULT_DS.typography.scale.body, ...design.typography?.scale?.body },
        callout: { ...DEFAULT_DS.typography.scale.callout, ...design.typography?.scale?.callout },
        subhead: { ...DEFAULT_DS.typography.scale.subhead, ...design.typography?.scale?.subhead },
        footnote: { ...DEFAULT_DS.typography.scale.footnote, ...design.typography?.scale?.footnote },
        caption: { ...DEFAULT_DS.typography.scale.caption, ...design.typography?.scale?.caption },
      },
    },
    shape: { ...DEFAULT_DS.shape, ...design.shape },
    elevation: { ...DEFAULT_DS.elevation, ...design.elevation },
    spacing: { ...DEFAULT_DS.spacing, ...design.spacing },
    components: {
      navBar: { ...DEFAULT_DS.components.navBar, ...design.components?.navBar },
      tabBar: { ...DEFAULT_DS.components.tabBar, ...design.components?.tabBar },
      listItem: { ...DEFAULT_DS.components.listItem, ...design.components?.listItem },
      card: { ...DEFAULT_DS.components.card, ...design.components?.card },
      button: { ...DEFAULT_DS.components.button, ...design.components?.button },
      input: { ...DEFAULT_DS.components.input, ...design.components?.input },
      statusBar: design.components?.statusBar ?? DEFAULT_DS.components.statusBar,
    },
    iconography: { ...DEFAULT_DS.iconography, ...design.iconography },
  };
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

function renderNav(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const navStyle = d.components.navBar.style;
  const divider = d.components.navBar.hasDivider;
  const elevClass = divider ? "mob-nav--border" : "";
  const stickyClass = block.isSticky ? "mob-nav--sticky" : "";
  const isLargeTitle = navStyle === "large-title";
  const isColored = navStyle === "colored";
  const coloredStyle = isColored ? `background:${d.components.navBar.background};` : "";

  if (isLargeTitle) {
    return `
<section data-aph-id="${block.id}" data-aph-type="nav" class="mob-nav mob-nav--large ${elevClass} ${stickyClass}">
  <div class="mob-nav__row">
    <span class="mob-nav__back">${ICONS.back}</span>
    <div class="mob-nav__actions"><div class="mob-nav__icon">${ICONS.bell}</div></div>
  </div>
  <h1 class="mob-nav__large-title">${block.label || "Title"}</h1>
</section>`;
  }

  return `
<section data-aph-id="${block.id}" data-aph-type="nav" class="mob-nav ${elevClass} ${stickyClass}"${coloredStyle ? ` style="${coloredStyle}"` : ""}>
  ${block.label
    ? `<span class="mob-nav__title">${block.label}</span>`
    : `<span class="mob-nav__back">${ICONS.back}</span><div class="mob-skel mob-skel--lg" style="width:80px"></div>`}
  <div class="mob-nav__actions">
    <div class="mob-nav__icon">${ICONS.bell}</div>
  </div>
</section>`;
}

function renderHero(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const title = block.label || "Welcome back";
  return `
<section data-aph-id="${block.id}" data-aph-type="hero" class="mob-hero mob-hero--gradient">
  <h1 class="mob-hero__heading">${title}</h1>
  <p class="mob-hero__sub">Discover what's new today</p>
  <div class="mob-hero__cta">
    <button class="mob-btn mob-btn--primary mob-btn--primary-shadow" style="width:auto;padding:0 24px;height:44px;font-size:var(--font-subhead,15px)">${d.productName ? "Get started" : "Explore"}</button>
  </div>
</section>`;
}

function renderCards(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const cardStyle = d.components.card.style;
  const elevClass = cardStyle === "elevated" ? "mob-card--shadow"
    : cardStyle === "bordered" ? "mob-card--border" : "mob-card--flat";
  const count = block.itemCount ?? 4;
  const placeholders = [
    { title: "Quick Start", sub: "Get up and running fast" },
    { title: "Analytics", sub: "Track your performance" },
    { title: "Settings", sub: "Customize your experience" },
    { title: "Support", sub: "We're here to help" },
    { title: "Updates", sub: "What's new this week" },
    { title: "Explore", sub: "Discover new features" },
  ];
  const cards = Array.from({ length: count }, (_, i) => {
    const p = placeholders[i % placeholders.length];
    return `
    <div class="mob-card ${elevClass}">
      <div class="mob-card__icon"><div class="mob-card__icon-inner"></div></div>
      <h4 class="mob-card__title">${p.title}</h4>
      <p class="mob-card__desc">${p.sub}</p>
    </div>`;
  }).join("");
  return `
<section data-aph-id="${block.id}" data-aph-type="cards" class="mob-cards">
  ${block.label ? `<h2 class="mob-cards__title">${block.label}</h2>` : ""}
  <div class="mob-cards__grid">${cards}</div>
</section>`;
}

function renderSection(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const title = block.label || "Section";
  // Detect if label suggests an actionable section (CTA card pattern)
  const actionWords = ["start", "call", "get", "try", "begin", "buy", "order", "subscribe", "join", "sign"];
  const hasAction = actionWords.some(w => title.toLowerCase().includes(w));
  const ctaLabel = hasAction ? title : "";
  const heading = hasAction ? title : title;
  const body = hasAction
    ? "Want to try our service? Get started in just a few taps."
    : "Explore the latest updates and features available for you.";
  return `
<section data-aph-id="${block.id}" data-aph-type="section" class="mob-section">
  <h2 class="mob-section__heading">${heading}</h2>
  <p class="mob-section__body">${body}</p>
  ${hasAction ? `<div class="mob-section__cta"><button class="mob-btn mob-btn--primary mob-btn--primary-shadow mob-btn--pill" style="width:100%">${ctaLabel}</button></div>` : ""}
</section>`;
}

function renderForm(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const inputStyle = d.components.input.style;
  const inputClass = inputStyle === "filled" ? "mob-input mob-input--filled" : "mob-input mob-input--bordered";
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

function renderButton(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const style = d.components.button.primaryStyle;
  const btnClass = style === "tinted" ? "mob-btn--tinted"
    : style === "outlined" ? "mob-btn--ghost"
    : "mob-btn--primary mob-btn--primary-shadow";
  return `
<section data-aph-id="${block.id}" data-aph-type="button" class="mob-btn-wrap">
  <button class="mob-btn ${btnClass}">${block.label || "Continue"}</button>
</section>`;
}

function renderTabBar(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const isSticky = block.isSticky || block.y > 400;
  const hasDivider = d.components.tabBar.hasDivider;
  const elevClass = hasDivider ? "mob-tab-bar--border" : "";
  const stickyClass = isSticky ? "mob-tab-bar--sticky" : "";
  const tabStyle = d.components.tabBar.style;
  const tabs = TAB_ICONS.map((icon, i) => `
    <div class="mob-tab-bar__item">
      <div class="mob-tab-bar__icon ${i === 0 ? "mob-tab-bar__icon--active" : "mob-tab-bar__icon--inactive"}">${icon}</div>
      ${tabStyle !== "icon-only" ? `<span class="mob-tab-bar__label ${i === 0 ? "mob-tab-bar__label--active" : "mob-tab-bar__label--inactive"}">${TAB_LABELS[i]}</span>` : ""}
    </div>`).join("");
  return `
<section data-aph-id="${block.id}" data-aph-type="footer" class="mob-tab-bar ${elevClass} ${stickyClass}">${tabs}</section>`;
}

function renderTextBlock(block: MobileShapeBlock): string {
  const text = block.label || "Your content goes here. Add a label to this shape to customize the text.";
  return `
<section data-aph-id="${block.id}" data-aph-type="text-block" class="mob-text">
  <p class="mob-text__body">${text}</p>
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

function renderListSection(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const li = d.components.listItem;
  const count = block.itemCount ?? 3;
  const listStyle = li.style;
  const isInsetGrouped = listStyle === "inset-grouped" || listStyle === "grouped";
  const isCardStyle = listStyle === "card";

  const listPlaceholders = [
    { title: "Account Settings", sub: "Manage your profile" },
    { title: "Notifications", sub: "Stay up to date" },
    { title: "Privacy & Security", sub: "Control your data" },
    { title: "Appearance", sub: "Customize the look" },
    { title: "Help Center", sub: "Get support" },
    { title: "About", sub: "Version info" },
    { title: "Language", sub: "English" },
    { title: "Storage", sub: "Manage space" },
  ];
  const rows = Array.from({ length: count }, (_, i) => {
    const p = listPlaceholders[i % listPlaceholders.length];
    const divider = li.hasDivider && i < count - 1
      ? `<div class="mob-list__divider" style="margin-left:${li.dividerInset}"></div>`
      : "";
    return `
    <div class="mob-list__row${isCardStyle ? " mob-list__row--card" : ""}">
      <div class="mob-list__avatar"><div class="mob-list__avatar-icon"></div></div>
      <div class="mob-list__content">
        <span class="mob-list__title">${p.title}</span>
        <span class="mob-list__sub">${p.sub}</span>
      </div>
      ${li.hasChevron ? `<span class="mob-list__chevron">${ICONS.chevron}</span>` : ""}
    </div>${divider}`;
  }).join("");

  const wrapClass = isInsetGrouped ? "mob-list mob-list--inset" : "mob-list";
  return `
<section data-aph-id="${block.id}" data-aph-type="section" class="${wrapClass}">
  ${block.label ? `<h3 class="mob-list__heading">${block.label}</h3>` : ""}
  ${isInsetGrouped ? `<div class="mob-list__group">${rows}</div>` : rows}
</section>`;
}

// ---------------------------------------------------------------------------
// New mobile components (Phase 3)
// ---------------------------------------------------------------------------

function renderStatusBar(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const isDark = d.components.statusBar === "dark";
  const textColor = isDark ? d.colors.foreground : "#FFFFFF";
  return `
<section data-aph-id="${block.id}" data-aph-type="status-bar" class="mob-status-bar" style="color:${textColor}">
  <span class="mob-status-bar__time">9:41</span>
  <div class="mob-status-bar__right">
    <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="4" width="3" height="8" rx="0.5" fill="currentColor" opacity="0.4"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5" fill="currentColor" opacity="0.6"/><rect x="9" y="0.5" width="3" height="11.5" rx="0.5" fill="currentColor" opacity="0.8"/><rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill="currentColor"/></svg>
    <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 3.5C9.5 3.5 11.3 4.3 12.6 5.6L14 4.2C12.3 2.5 10 1.5 7.5 1.5S2.7 2.5 1 4.2L2.4 5.6C3.7 4.3 5.5 3.5 7.5 3.5Z" fill="currentColor" opacity="0.4"/><path d="M7.5 6.5C8.8 6.5 10 7 10.9 7.9L12.3 6.5C11 5.2 9.3 4.5 7.5 4.5S4 5.2 2.7 6.5L4.1 7.9C5 7 6.2 6.5 7.5 6.5Z" fill="currentColor" opacity="0.7"/><circle cx="7.5" cy="9.5" r="1.5" fill="currentColor"/></svg>
    <div class="mob-status-bar__battery">
      <div class="mob-status-bar__battery-body"><div class="mob-status-bar__battery-fill"></div></div>
      <div class="mob-status-bar__battery-cap"></div>
    </div>
  </div>
</section>`;
}

function renderHomeIndicator(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const color = d.components.statusBar === "dark" ? d.colors.foreground : "#FFFFFF";
  return `
<section data-aph-id="${block.id}" data-aph-type="home-indicator" class="mob-home-indicator">
  <div class="mob-home-indicator__bar" style="background:${color}"></div>
</section>`;
}

function renderSearchBar(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const inputStyle = d.components.input.style;
  const bgClass = inputStyle === "filled" ? "mob-search--filled" : "mob-search--bordered";
  return `
<section data-aph-id="${block.id}" data-aph-type="search-bar" class="mob-search ${bgClass}">
  <div class="mob-search__inner">
    <span class="mob-search__icon">${ICONS.search}</span>
    <span class="mob-search__placeholder">${block.label || "Search"}</span>
  </div>
</section>`;
}

function renderSectionHeader(block: MobileShapeBlock): string {
  return `
<section data-aph-id="${block.id}" data-aph-type="section-header" class="mob-section-header">
  <h3 class="mob-section-header__label">${block.label || "Section"}</h3>
  <span class="mob-section-header__action">See All</span>
</section>`;
}

function renderProfileHeader(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  return `
<section data-aph-id="${block.id}" data-aph-type="profile-header" class="mob-profile">
  <div class="mob-profile__avatar">
    <div class="mob-profile__avatar-inner">${ICONS.user}</div>
  </div>
  <h2 class="mob-profile__name">${block.label || "User Name"}</h2>
  <p class="mob-profile__bio">
    <span class="mob-skel mob-skel--w65" style="display:inline-block"></span>
  </p>
  <div class="mob-profile__actions">
    <button class="mob-btn mob-btn--primary" style="flex:1;height:40px;font-size:var(--font-subhead,15px)">Follow</button>
    <button class="mob-btn mob-btn--ghost" style="flex:1;height:40px;font-size:var(--font-subhead,15px)">Message</button>
  </div>
</section>`;
}

function renderStatsRow(block: MobileShapeBlock): string {
  const items = [
    { value: "128", label: "Posts" },
    { value: "14.2k", label: "Followers" },
    { value: "892", label: "Following" },
  ];
  return `
<section data-aph-id="${block.id}" data-aph-type="stats-row" class="mob-stats">
  ${items.map(i => `
    <div class="mob-stats__item">
      <span class="mob-stats__value">${i.value}</span>
      <span class="mob-stats__label">${i.label}</span>
    </div>`).join("")}
</section>`;
}

function renderSegmentedControl(block: MobileShapeBlock): string {
  const segments = block.label
    ? block.label.split(/[,|\/]/).map(s => s.trim())
    : ["All", "Active", "Archived"];
  return `
<section data-aph-id="${block.id}" data-aph-type="segmented-control" class="mob-segments">
  <div class="mob-segments__track">
    ${segments.map((s, i) => `<button class="mob-segments__item ${i === 0 ? "mob-segments__item--active" : ""}">${s}</button>`).join("")}
  </div>
</section>`;
}

function renderFAB(block: MobileShapeBlock): string {
  const isExtended = block.label && block.label.length > 1;
  return `
<section data-aph-id="${block.id}" data-aph-type="fab" class="mob-fab ${isExtended ? "mob-fab--extended" : ""}">
  <button class="mob-fab__btn">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
    ${isExtended ? `<span class="mob-fab__label">${block.label}</span>` : ""}
  </button>
</section>`;
}

function renderBottomSheet(block: MobileShapeBlock): string {
  return `
<section data-aph-id="${block.id}" data-aph-type="bottom-sheet" class="mob-sheet">
  <div class="mob-sheet__handle"></div>
  ${block.label ? `<h3 class="mob-sheet__title">${block.label}</h3>` : ""}
  <div class="mob-sheet__content">
    <div class="mob-skel mob-skel--w90"></div>
    <div class="mob-skel mob-skel--sm mob-skel--w65" style="margin-top:8px"></div>
    <div class="mob-skel mob-skel--sm mob-skel--w50" style="margin-top:8px"></div>
  </div>
</section>`;
}

function renderModal(block: MobileShapeBlock): string {
  return `
<section data-aph-id="${block.id}" data-aph-type="modal" class="mob-modal">
  <div class="mob-modal__card">
    <h3 class="mob-modal__title">${block.label || "Confirm"}</h3>
    <p class="mob-modal__body"><span class="mob-skel mob-skel--w80" style="display:inline-block"></span></p>
    <div class="mob-modal__actions">
      <button class="mob-btn mob-btn--ghost" style="flex:1;height:44px">Cancel</button>
      <button class="mob-btn mob-btn--primary" style="flex:1;height:44px">OK</button>
    </div>
  </div>
</section>`;
}

function renderToast(block: MobileShapeBlock): string {
  return `
<section data-aph-id="${block.id}" data-aph-type="toast" class="mob-toast">
  <div class="mob-toast__inner">
    <span class="mob-toast__text">${block.label || "Action completed"}</span>
    <button class="mob-toast__action">Undo</button>
  </div>
</section>`;
}

function renderMediaCell(block: MobileShapeBlock): string {
  const h = Math.max(block.height, 200);
  return `
<section data-aph-id="${block.id}" data-aph-type="media-cell" class="mob-media">
  <div class="mob-media__image" style="height:${h}px">
    <span class="mob-media__icon">${ICONS.image}</span>
  </div>
  <div class="mob-media__overlay">
    <div class="mob-media__meta">
      <div class="mob-skel mob-skel--sm" style="width:40%;background:rgba(255,255,255,0.3)"></div>
    </div>
  </div>
</section>`;
}

function renderEmptyState(block: MobileShapeBlock): string {
  return `
<section data-aph-id="${block.id}" data-aph-type="empty-state" class="mob-empty">
  <div class="mob-empty__icon">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 14l2 2 4-4"/></svg>
  </div>
  <h3 class="mob-empty__title">${block.label || "Nothing here yet"}</h3>
  <p class="mob-empty__body">Start by adding some content</p>
</section>`;
}

function renderGeneric(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const minH = Math.max(block.height, 60);
  const title = block.label || "Content";
  return `
<section data-aph-id="${block.id}" data-aph-type="${block.semanticTag}" class="mob-generic" style="min-height:${minH}px">
  <p class="mob-generic__text">${title}</p>
</section>`;
}

// ---------------------------------------------------------------------------
// Main dispatcher
// ---------------------------------------------------------------------------

export function renderMobileBlock(block: MobileShapeBlock, design?: UIDesignSystem | null): string {
  switch (block.semanticTag) {
    case "nav":                return renderNav(block, design);
    case "hero":               return renderHero(block, design);
    case "cards":              return renderCards(block, design);
    case "section":            return renderSection(block, design);
    case "form":               return renderForm(block, design);
    case "button":             return renderButton(block, design);
    case "footer":             return renderTabBar(block, design);
    case "text-block":         return renderTextBlock(block);
    case "image":              return renderImage(block);
    case "split":              return renderListSection(block, design);
    // New mobile components
    case "status-bar":         return renderStatusBar(block, design);
    case "home-indicator":     return renderHomeIndicator(block, design);
    case "search-bar":         return renderSearchBar(block, design);
    case "section-header":     return renderSectionHeader(block);
    case "profile-header":     return renderProfileHeader(block, design);
    case "stats-row":          return renderStatsRow(block);
    case "segmented-control":  return renderSegmentedControl(block);
    case "fab":                return renderFAB(block);
    case "bottom-sheet":       return renderBottomSheet(block);
    case "modal":              return renderModal(block);
    case "toast":              return renderToast(block);
    case "media-cell":         return renderMediaCell(block);
    case "empty-state":        return renderEmptyState(block);
    default:                   return renderGeneric(block, design);
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

function designTokensCSS(design?: UIDesignSystem | null): string {
  const d = ds(design);
  return `:root {
  /* Palette */
  --color-bg: ${d.colors.background};
  --color-bg-secondary: ${d.colors.backgroundSecondary};
  --color-text: ${d.colors.foreground};
  --color-text-muted: ${d.colors.foregroundSecondary};
  --color-text-tertiary: ${d.colors.foregroundTertiary};
  --color-primary: ${d.colors.accent};
  --color-primary-fg: ${d.colors.accentForeground};
  --color-separator: ${d.colors.separator};
  --color-destructive: ${d.colors.destructive};
  --color-surface: ${d.colors.surface};
  --color-surface-elevated: ${d.colors.surfaceElevated};
  --color-overlay: ${d.colors.overlay};
  /* Typography */
  --font-family: ${d.typography.fontFamily};
  --font-large-title: ${d.typography.scale.largeTitle.size};
  --font-title1: ${d.typography.scale.title1.size};
  --font-title2: ${d.typography.scale.title2.size};
  --font-title3: ${d.typography.scale.title3.size};
  --font-headline: ${d.typography.scale.headline.size};
  --font-body: ${d.typography.scale.body.size};
  --font-callout: ${d.typography.scale.callout.size};
  --font-subhead: ${d.typography.scale.subhead.size};
  --font-footnote: ${d.typography.scale.footnote.size};
  --font-caption: ${d.typography.scale.caption.size};
  --font-weight-large-title: ${d.typography.scale.largeTitle.weight};
  --font-weight-title1: ${d.typography.scale.title1.weight};
  --font-weight-title2: ${d.typography.scale.title2.weight};
  --font-weight-heading: ${d.typography.scale.headline.weight};
  --font-weight-body: ${d.typography.scale.body.weight};
  --tracking-heading: ${d.typography.scale.headline.tracking};
  --tracking-body: ${d.typography.scale.body.tracking};
  /* Radii */
  --radius-sm: ${d.shape.radiusSmall};
  --radius-md: ${d.shape.radiusMedium};
  --radius-lg: ${d.shape.radiusLarge};
  --radius-full: ${d.shape.radiusFull};
  /* Elevation */
  --shadow-card: ${d.elevation.cardShadow};
  --shadow-sheet: ${d.elevation.sheetShadow};
  --shadow-nav: ${d.elevation.navShadow};
  /* Spacing */
  --screen-padding: ${d.spacing.screenPadding};
  --section-gap: ${d.spacing.sectionGap};
  --item-gap: ${d.spacing.itemGap};
  --inner-padding: ${d.spacing.innerPadding};
  --icon-size: ${d.spacing.iconSize};
  --avatar-size: ${d.spacing.avatarSize};
  /* Component: Nav */
  --nav-bg: ${d.components.navBar.background};
  --nav-title-weight: ${d.components.navBar.titleWeight};
  /* Component: Tab Bar */
  --tab-bg: ${d.components.tabBar.background};
  --tab-active: ${d.components.tabBar.activeColor};
  --tab-inactive: ${d.components.tabBar.inactiveColor};
  /* Component: List Item */
  --list-item-height: ${d.components.listItem.height};
  --list-divider-inset: ${d.components.listItem.dividerInset};
  /* Component: Card */
  --card-padding: ${d.components.card.padding};
  --card-radius: ${d.components.card.radius};
  /* Component: Button */
  --btn-radius: ${d.components.button.radius};
  --btn-height: ${d.components.button.height};
  --btn-weight: ${d.components.button.textWeight};
  /* Component: Input */
  --input-radius: ${d.components.input.radius};
  --input-height: ${d.components.input.height};
}`;
}

export function buildMobileDocument(body: string, design?: UIDesignSystem | null): string {
  const d = ds(design);
  const fontImport = googleFontImport(d.typography.fontFamily);
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
