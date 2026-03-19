// ============================================================
// APHANTASIA — UI Mode Types
// ============================================================
// Comprehensive design system extracted from reference
// screenshots. Covers palette, typography hierarchy,
// component dimensions, spacing scale, borders, shadows,
// and visual personality — everything needed to render
// polished mobile UI from canvas shapes.
// ============================================================

export interface UIDesignSystem {
  // ── Core palette ──────────────────────────────────────────
  primaryColor: string;           // dominant brand/action color
  secondaryColor: string;         // secondary brand color
  backgroundColor: string;        // main screen background
  surfaceColor: string;           // card / elevated surface bg
  surfaceAltColor: string;        // subtle alternate surface
  textColor: string;              // primary text
  textMutedColor: string;         // secondary / caption text
  accentColor: string;            // highlight or success accent
  borderColor: string;            // dividers, strokes

  // ── Extended palette (optional, fallback to core) ─────────
  errorColor?: string;            // destructive actions / alerts
  successColor?: string;          // confirmation / positive
  warningColor?: string;          // caution states
  buttonTextColor?: string;       // text on primary buttons (often #fff)
  navBackground?: string;         // nav bar bg if differs from backgroundColor
  primaryGradient?: string;       // CSS gradient for hero/CTA areas
  cardBorderColor?: string;       // card-specific border (may be transparent)

  // ── Typography ────────────────────────────────────────────
  fontFamily: string;             // CSS font stack
  headingSize: string;            // largest heading (e.g. "28px")
  subheadingSize?: string;        // section heading (e.g. "20px")
  bodySize: string;               // body text (e.g. "15px")
  captionSize: string;            // small text (e.g. "12px")
  labelSize?: string;             // form labels, badges (e.g. "13px")
  headingWeight: string;          // heading font weight
  bodyWeight?: string;            // body font weight (e.g. "400")
  headingLineHeight?: string;     // e.g. "1.2"
  bodyLineHeight?: string;        // e.g. "1.6"
  headingLetterSpacing?: string;  // e.g. "-0.5px"

  // ── Shape tokens ──────────────────────────────────────────
  borderRadius: string;           // base element radius
  cardRadius: string;             // card radius (usually larger)
  buttonRadius: string;           // button radius
  inputRadius: string;            // input field radius
  avatarRadius?: string;          // "50%" or px value
  tagRadius?: string;             // chip / badge radius

  // ── Shadows ───────────────────────────────────────────────
  shadowSm: string;               // subtle small shadow
  shadowCard: string;             // card / panel shadow
  shadowLg?: string;              // modal / elevated shadow

  // ── Spacing scale ─────────────────────────────────────────
  spacingXs?: string;             // tight spacing (e.g. "4px")
  spacingSm?: string;             // small spacing (e.g. "8px")
  spacingBase: string;            // standard unit (e.g. "16px")
  spacingLg: string;              // larger unit (e.g. "24px")
  spacingXl?: string;             // section-level (e.g. "32px")
  sectionPadding?: string;        // horizontal page padding (e.g. "20px")

  // ── Component dimensions ──────────────────────────────────
  navHeight?: string;             // top nav bar height (e.g. "56px")
  tabBarHeight?: string;          // bottom tab bar height (e.g. "64px")
  buttonHeight?: string;          // primary button height (e.g. "52px")
  inputHeight?: string;           // text input height (e.g. "48px")
  listItemHeight?: string;        // list row height (e.g. "64px")
  cardPadding?: string;           // internal card padding (e.g. "16px")
  iconSize?: string;              // standard icon size (e.g. "24px")

  // ── Borders ───────────────────────────────────────────────
  borderWidth?: string;           // standard stroke width (e.g. "1px")
  dividerColor?: string;          // list / section divider color

  // ── Visual personality ────────────────────────────────────
  mood?: string;                  // e.g. "clean minimal fintech"
  density?: "compact" | "normal" | "spacious";
  iconStyle?: "outlined" | "filled" | "duotone";
  elevationStyle?: "shadow" | "border" | "flat"; // how cards/surfaces are elevated
}

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
