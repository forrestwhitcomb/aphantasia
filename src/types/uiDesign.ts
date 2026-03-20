// ============================================================
// APHANTASIA — UI Mode Types
// ============================================================
// Nested design system extracted from reference screenshots.
// Covers identity, colors, typography scale, shape, elevation,
// spacing, component patterns, and iconography — everything
// needed to render mobile UI that matches the user's product.
// ============================================================

// ── Typography Scale Entry ────────────────────────────────────

export interface TypographyScaleEntry {
  size: string;     // e.g. "34px"
  weight: string;   // e.g. "700"
  tracking: string; // letter-spacing, e.g. "-0.4px" or "normal"
}

// ── UIDesignSystem ────────────────────────────────────────────

export interface UIDesignSystem {
  // ── Identity ──
  productName?: string;
  platform: "ios" | "android" | "cross-platform";

  // ── Color System ──
  colors: {
    background: string;            // screen background
    backgroundSecondary: string;   // grouped table bg, secondary surfaces
    foreground: string;            // primary text
    foregroundSecondary: string;   // secondary/muted text
    foregroundTertiary: string;    // placeholder text, disabled
    accent: string;                // tint color, interactive elements
    accentForeground: string;      // text on accent backgrounds
    separator: string;             // divider lines
    destructive: string;           // delete, error states
    surface: string;               // card/cell background
    surfaceElevated: string;       // modal/sheet background
    overlay: string;               // scrim behind modals
  };

  // ── Typography ──
  typography: {
    fontFamily: string;            // e.g. "SF Pro Display" or "Inter"
    fontFamilyMono?: string;       // code/mono font if visible
    scale: {
      largeTitle: TypographyScaleEntry;
      title1: TypographyScaleEntry;
      title2: TypographyScaleEntry;
      title3: TypographyScaleEntry;
      headline: TypographyScaleEntry;
      body: TypographyScaleEntry;
      callout: TypographyScaleEntry;
      subhead: TypographyScaleEntry;
      footnote: TypographyScaleEntry;
      caption: TypographyScaleEntry;
    };
  };

  // ── Shape System ──
  shape: {
    radiusSmall: string;           // chips, badges — e.g. "6px"
    radiusMedium: string;          // cards, inputs — e.g. "12px"
    radiusLarge: string;           // modals, sheets — e.g. "16px"
    radiusFull: string;            // pills, avatars — e.g. "999px"
  };

  // ── Elevation / Shadow ──
  elevation: {
    model: "flat" | "subtle-shadow" | "material" | "glass";
    cardShadow: string;            // CSS box-shadow
    sheetShadow: string;           // bottom sheet shadow
    navShadow: string;             // app bar shadow (often "none" on iOS)
  };

  // ── Spacing ──
  spacing: {
    screenPadding: string;         // horizontal screen margins — "16px" or "20px"
    sectionGap: string;            // gap between content groups
    itemGap: string;               // gap between list items
    innerPadding: string;          // card/cell internal padding
    iconSize: string;              // standard icon size — "24px"
    avatarSize: string;            // standard avatar — "40px"
  };

  // ── Component Patterns ──
  components: {
    navBar: {
      style: "large-title" | "inline-title" | "transparent" | "colored";
      background: string;
      titleWeight: string;
      hasDivider: boolean;
    };
    tabBar: {
      style: "icon-label" | "icon-only" | "label-only" | "floating";
      background: string;
      activeColor: string;
      inactiveColor: string;
      hasDivider: boolean;
    };
    listItem: {
      height: string;              // e.g. "44px", "56px", "72px"
      style: "plain" | "inset-grouped" | "grouped" | "card";
      hasChevron: boolean;
      hasDivider: boolean;
      dividerInset: string;        // left inset — "16px", "52px"
    };
    card: {
      style: "elevated" | "bordered" | "filled" | "glass";
      padding: string;
      radius: string;
    };
    button: {
      primaryStyle: "filled" | "tinted" | "outlined";
      radius: string;
      height: string;              // e.g. "50px", "44px"
      textWeight: string;
    };
    input: {
      style: "underline" | "bordered" | "filled" | "floating-label";
      radius: string;
      height: string;
    };
    statusBar: "light" | "dark";
  };

  // ── Iconography ──
  iconography: {
    style: "sf-symbols" | "material" | "outlined" | "filled" | "custom";
    weight: "light" | "regular" | "medium" | "semibold";
    size: string;
  };
}

// ── Inspiration Types ─────────────────────────────────────────

export type InspirationRole = "content" | "layout" | "design style";

export interface UIInspiration {
  id: string;
  role: InspirationRole;
  source: string;    // base64 dataUrl or external URL
  label?: string;    // user-supplied description
}

export interface UIDesignStoreState {
  screenContext: string;
  designContextImage: string | null;          // base64 dataUrl of reference screenshot
  extractedDesignSystem: UIDesignSystem | null;
  inspirations: UIInspiration[];
}
