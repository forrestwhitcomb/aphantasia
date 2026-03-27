// ============================================================
// ComponentSpec — Declarative component tree model
// ============================================================
// Replaces per-component HTML string renderers with a single
// data structure. One renderSpec() function walks the tree.
// ============================================================

// ── Primitives ───────────────────────────────────────────────

export type PrimitiveType =
  | "screen"
  | "bar"
  | "card"
  | "row"
  | "button"
  | "input"
  | "sheet"
  | "text"
  | "status"
  | "selector"
  | "media"
  | "divider";

// ── Token Reference ──────────────────────────────────────────

/** Wraps a dot-path token reference, e.g. { token: 'spacing.md' } */
export interface TokenRef {
  token: string;
}

export function isTokenRef(v: unknown): v is TokenRef {
  return typeof v === "object" && v !== null && "token" in v;
}

// ── Size Value ───────────────────────────────────────────────

export type SizeValue = TokenRef | string | number;

// ── Layout ───────────────────────────────────────────────────

export interface PaddingSpec {
  top?: TokenRef | string;
  right?: TokenRef | string;
  bottom?: TokenRef | string;
  left?: TokenRef | string;
  /** Shorthand: sets all four */
  all?: TokenRef | string;
  /** Shorthand: sets horizontal (left+right) */
  x?: TokenRef | string;
  /** Shorthand: sets vertical (top+bottom) */
  y?: TokenRef | string;
}

export interface LayoutSpec {
  display: "flex" | "grid" | "block" | "inline-flex";
  direction?: "row" | "column";
  align?: "start" | "center" | "end" | "stretch" | "space-between";
  justify?: "start" | "center" | "end" | "space-between" | "space-around";
  gap?: TokenRef | string;
  padding?: PaddingSpec;
  width?: SizeValue;
  height?: SizeValue;
  minHeight?: SizeValue;
  minWidth?: SizeValue;
  maxWidth?: SizeValue;
  flex?: string;
  overflow?: "hidden" | "auto" | "visible";
  position?: "relative" | "absolute" | "sticky";
  borderRadius?: TokenRef | string;
  flexShrink?: number;
  flexWrap?: "wrap" | "nowrap";
  boxSizing?: "border-box" | "content-box";
}

// ── Style ────────────────────────────────────────────────────

export interface BorderSpec {
  width?: string;
  style?: string;
  color?: TokenRef | string;
}

export interface StyleSpec {
  background?: TokenRef | string;
  color?: TokenRef | string;
  border?: BorderSpec;
  shadow?: TokenRef | string;
  opacity?: number;
  cursor?: string;
  textOverflow?: "ellipsis";
  whiteSpace?: "nowrap" | "normal";
  overflowText?: "hidden";
}

// ── Text ─────────────────────────────────────────────────────

export type TextStyleToken =
  | "display-lg"
  | "display-md"
  | "display-sm"
  | "display-xs"
  | "headline-lg"
  | "headline-md"
  | "headline-sm"
  | "headline-xs"
  | "paragraph-xl"
  | "paragraph-lg"
  | "paragraph-md"
  | "paragraph-sm"
  | "paragraph-xs"
  | "label-xl"
  | "label-lg"
  | "label-md"
  | "label-sm"
  | "label-xs";

export interface TextSpec {
  content: string;
  style: TextStyleToken;
  weight?: number;
  color?: TokenRef | string;
  align?: "left" | "center" | "right";
  editable?: boolean;
}

// ── Interactivity ────────────────────────────────────────────

export interface InteractiveSpec {
  type: "button" | "input" | "toggle" | "tab" | "link";
  navigateTo?: string;
}

// ── The Spec ─────────────────────────────────────────────────

export interface ComponentSpec {
  /** Unique key within this spec tree (for targeting edits) */
  key: string;
  /** HTML element to render */
  tag: "div" | "span" | "input" | "svg" | "img" | "button" | "nav";
  /** Layout model for this node */
  layout: LayoutSpec;
  /** Visual styling via design token references */
  style: StyleSpec;
  /** Child nodes (composition!) */
  children?: ComponentSpec[];
  /** Text content (leaf nodes) */
  text?: TextSpec;
  /** Interactivity markers */
  interactive?: InteractiveSpec;
  /** Data attributes + innerHTML for SVG injection */
  data?: Record<string, string>;
}

// ── Template Factory ─────────────────────────────────────────

export type TemplateFactory = (
  props?: Record<string, unknown>,
) => ComponentSpec;
