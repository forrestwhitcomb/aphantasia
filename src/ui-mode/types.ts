// ============================================================
// APHANTASIA — UI Mode Type System
// ============================================================
// Authoritative type definitions for the UI experience.
// Based on D-UI-3 from aphantasia-ui-build-plan.md.
//
// Every component in src/ui-mode/components/ renders using
// a UIDesignSystem instance. All CSS values flow through
// themeInjector.ts → CSS custom properties → var(--*).
// ============================================================

// ── UIDesignSystem ──────────────────────────────────────────

export interface UIDesignSystem {
  // ── Typography ──
  fonts: {
    heading: { family: string; weight: number; letterSpacing: string };
    body: { family: string; weight: number; letterSpacing: string };
    caption: { family: string; weight: number };
    mono?: { family: string; weight: number };
  };
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };

  // ── Colors (16 semantic roles, shadcn-aligned) ──
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    border: string;
    input: string;
    ring: string;
    card: string;
    cardForeground: string;
  };

  // ── Spacing ──
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };

  // ── Border Radii ──
  radii: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
    button: string;
    card: string;
    input: string;
  };

  // ── Shadows ──
  shadows: {
    sm: string;
    md: string;
    lg: string;
    card: string;
    button: string;
    input: string;
  };

  // ── Component-Specific Tokens ──
  components: {
    navBar: { height: string; blur: string; borderBottom: string };
    card: { padding: string; gap: string };
    button: { height: string; paddingX: string; fontSize: string };
    input: { height: string; paddingX: string; fontSize: string };
    list: { itemHeight: string; divider: string };
    tabBar: { height: string; iconSize: string };
  };

  // ── Figma Component Registry (optional — populated by live Figma extraction) ──
  componentRegistry?: FigmaComponentEntry[];

  // ── Component Layout Map (optional — keyed by figmaComponentId) ──
  componentLayouts?: Record<string, ComponentLayoutCSS>;

  // ── Meta ──
  name: string;
  extractedFrom?: string; // base64 thumbnail of original reference
  confidence: number; // 0–1, how confident the extraction was
}

export interface FigmaComponentEntry {
  figmaId: string;          // Figma node ID (e.g. "123:456")
  figmaName: string;        // Full name (e.g. "Button/Primary/Large")
  baseName: string;         // Top-level segment (e.g. "Button")
  aphantasiaType: string;   // Rebtel component type (e.g. "topUpCard")
  hasVariants: boolean;
  variantMap?: FigmaVariantMap;
  defaultVariant?: string;
  thumbnail?: string | null; // Reserved for Phase 4, leave null
}

export interface FigmaVariantMap {
  [propertyName: string]: string[];
}

export interface ComponentLayoutCSS {
  display: 'flex' | 'block';
  flexDirection?: 'row' | 'column';
  gap?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  alignItems?: string;
  justifyContent?: string;
  width?: string;
  minWidth?: string;
}

// ── Component Types ─────────────────────────────────────────
// All 32 UI component types from the build plan.

export type UIComponentType =
  // Navigation & Structure
  | "statusBar"
  | "navBar"
  | "tabBar"
  | "bottomSheet"
  // Content & Data Display
  | "card"
  | "listItem"
  | "listGroup"
  | "sectionHeader"
  | "avatar"
  | "badge"
  | "tag"
  | "emptyState"
  // Inputs & Actions
  | "button"
  | "textInput"
  | "searchBar"
  | "toggle"
  | "checkbox"
  | "segmentedControl"
  | "slider"
  | "stepper"
  // Media & Visual
  | "imagePlaceholder"
  | "carousel"
  | "progressBar"
  | "divider"
  // Feedback & Overlay
  | "alert"
  | "toast"
  | "modal"
  | "floatingActionButton"
  // Composite
  | "profileHeader"
  | "messageBubble"
  | "feedItem"
  | "settingsRow"
  // Text
  | "header"
  | "heroText"
  | "sectionText"
  | "bodyText";

// ── Variant Maps ────────────────────────────────────────────
// Per-component variant options for the build plan's component inventory.

export interface UIVariantMap {
  statusBar: "light" | "dark";
  navBar: "standard" | "large-title" | "search" | "segmented";
  tabBar: "icon-only" | "icon-label" | "pill-active";
  bottomSheet: "handle" | "full" | "scrollable";
  card: "elevated" | "bordered" | "filled" | "image-top";
  listItem:
    | "simple"
    | "subtitle"
    | "icon-left"
    | "chevron"
    | "toggle"
    | "destructive";
  listGroup: "inset" | "plain" | "separated";
  sectionHeader: "plain" | "with-action";
  avatar: "circle" | "rounded" | "initials";
  badge: "default" | "destructive" | "outline" | "count";
  tag: "default" | "selected" | "removable";
  emptyState: "icon-top" | "illustration" | "minimal";
  button:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "icon-only";
  textInput: "default" | "with-icon" | "with-label" | "multiline";
  searchBar: "default" | "with-cancel" | "with-filter";
  toggle: "default" | "with-label";
  checkbox: "default" | "with-label";
  segmentedControl: "default" | "pill";
  slider: "default" | "with-labels" | "with-value";
  stepper: "default" | "with-label";
  imagePlaceholder: "rounded" | "sharp" | "circle";
  carousel: "full-width" | "peek" | "dots" | "progress-bar";
  progressBar: "linear" | "circular" | "steps";
  divider: "full" | "inset" | "with-text";
  alert: "info" | "success" | "warning" | "error";
  toast: "default" | "with-action";
  modal: "alert" | "action-sheet" | "full-screen";
  floatingActionButton: "default" | "extended";
  profileHeader: "centered" | "left-aligned" | "with-cover";
  messageBubble: "sent" | "received" | "with-avatar";
  feedItem: "social" | "news" | "minimal";
  settingsRow: "toggle" | "navigation" | "value" | "destructive";
  header: "large" | "medium" | "small";
}

// ── Resolved Component ──────────────────────────────────────
// Output of the UISemanticResolver — a shape mapped to a
// specific component type with variant hints and note context.

export interface UIResolvedComponent {
  /** Original shape ID */
  shapeId: string;
  /** Resolved component type */
  type: UIComponentType;
  /** Variant hint (from label keywords, spatial context, or notes) */
  variant?: string;
  /** Shape label text — flows into the component as content */
  label?: string;
  /** Attached note texts (from proximity or explicit linking) */
  notes: string[];
  /** Global notes (outside all frames) */
  globalNotes?: string[];
  /** Original shape bounds (for positioning within the phone frame) */
  bounds: { x: number; y: number; width: number; height: number };
  /** Number of items (for list groups, tab bars, etc.) */
  itemCount?: number;
  /** Per-item labels (parsed from notes like "1. Home 2. Search 3. Profile") */
  itemLabels?: string[];
  /** IDs of shapes consumed into this group */
  consumedIds?: string[];
  /** Nested child components (e.g. toggle or text inside a card) */
  children?: UIResolvedComponent[];
  /** User-applied dark mode override from in-viewport editing */
  _userDarkMode?: boolean;
}

// ── Component Props Base ────────────────────────────────────
// Base interface for all component render functions.

export interface UIComponentPropsBase {
  /** Shape label → component content text */
  label?: string;
  /** Variant selection */
  variant?: string;
  /** Raw note override text (interpreted at render time) */
  noteOverrides?: string;
  /** Width hint for components that can switch between content-fit and full-width. */
  fullWidth?: boolean;
  /** Number of items (for lists, tabs, etc.) */
  itemCount?: number;
  /** Per-item labels */
  itemLabels?: string[];
}

// ── Layer 2 Override ────────────────────────────────────────
// AI-generated per-component overrides from Layer 2 rendering.

export interface UILayer2Override {
  /** Target component shape ID */
  componentId: string;
  /** Content overrides (text, labels, item count) */
  contentOverrides?: Record<string, unknown>;
  /** CSS style overrides from notes */
  styleOverrides?: Record<string, string>;
  /** Variant selection override */
  variantOverride?: string;
}

// ── User Override ──────────────────────────────────────────
// User-initiated overrides from in-viewport editing (text edits,
// variant switching, dark mode toggle). Merged into the render
// pipeline the same way Layer 2 overrides are.

export interface UIUserOverride {
  shapeId: string;
  /** Edited label text from double-click inline editing */
  textOverride?: string;
  /** User-picked variant from the variant picker popover */
  variantOverride?: string;
  /** Dark mode toggle for individual components */
  darkMode?: boolean;
}
