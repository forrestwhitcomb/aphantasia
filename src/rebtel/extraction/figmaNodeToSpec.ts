// ============================================================
// figmaNodeToSpec — Figma REST API node → ComponentSpec
// ============================================================
// Recursively converts a Figma node tree (from
// figma_get_component_for_development) into a ComponentSpec
// tree. Every padding, gap, color, font size, and radius
// comes directly from the Figma data.
// ============================================================

import type {
  ComponentSpec,
  LayoutSpec,
  StyleSpec,
  PaddingSpec,
  TextSpec,
  TokenRef,
  SizeValue,
} from "../spec/types";
import { resolveBoundVariable } from "./variableMap";
import { figmaTextToStyleToken } from "./textStyleMap";

// ── Figma Node Types ─────────────────────────────────────────

interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface FigmaFill {
  type: string;
  color?: FigmaColor;
  visible?: boolean;
  boundVariables?: Record<string, unknown>;
}

interface FigmaStroke {
  type: string;
  color?: FigmaColor;
  visible?: boolean;
  boundVariables?: Record<string, unknown>;
}

interface FigmaTextStyle {
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  letterSpacing?: number;
  lineHeightPx?: number;
  textAlignHorizontal?: string;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  layoutMode?: string;
  primaryAxisSizingMode?: string;
  counterAxisSizingMode?: string;
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  layoutSizingHorizontal?: string;
  layoutSizingVertical?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  layoutWrap?: string;
  fills?: FigmaFill[];
  strokes?: FigmaStroke[];
  strokeWeight?: number;
  cornerRadius?: number;
  rectangleCornerRadii?: number[];
  effects?: unknown[];
  children?: FigmaNode[];
  characters?: string;
  style?: FigmaTextStyle;
  boundVariables?: Record<string, unknown>;
  componentId?: string;
  mainComponent?: { id: string; name: string };
}

// ── Helpers ──────────────────────────────────────────────────

function rgbaToHex(c: FigmaColor): string {
  const r = Math.round(c.r * 255)
    .toString(16)
    .padStart(2, "0");
  const g = Math.round(c.g * 255)
    .toString(16)
    .padStart(2, "0");
  const b = Math.round(c.b * 255)
    .toString(16)
    .padStart(2, "0");
  if (c.a < 1) {
    const a = Math.round(c.a * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${r}${g}${b}${a}`.toUpperCase();
  }
  return `#${r}${g}${b}`.toUpperCase();
}

function sanitizeKey(name: string, id: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `node-${id.replace(":", "-")}`;
}

function resolveSpacing(
  value: number | undefined,
  boundVar: unknown,
): TokenRef | string | undefined {
  if (value === undefined || value === 0) return undefined;
  const ref = resolveBoundVariable(boundVar);
  if (ref) return ref;
  return `${value}px`;
}

function resolveFillColor(
  fills: FigmaFill[] | undefined,
  boundVars: Record<string, unknown> | undefined,
): TokenRef | string | undefined {
  if (!fills?.length) return undefined;
  const fill = fills.find((f) => f.type === "SOLID" && f.visible !== false);
  if (!fill) return undefined;

  // Check bound variables on the fills array
  const fillBv = boundVars?.fills;
  if (Array.isArray(fillBv) && fillBv[0]) {
    const ref = resolveBoundVariable(fillBv[0]);
    if (ref) return ref;
  }
  // Check individual fill's bound variable
  if (fill.boundVariables?.color) {
    const ref = resolveBoundVariable(fill.boundVariables.color);
    if (ref) return ref;
  }

  if (fill.color) return rgbaToHex(fill.color);
  return undefined;
}

function mapAlign(
  figmaValue?: string,
): LayoutSpec["align"] {
  switch (figmaValue) {
    case "CENTER":
      return "center";
    case "MAX":
      return "end";
    case "MIN":
      return "start";
    case "SPACE_BETWEEN":
      return "space-between";
    default:
      return undefined;
  }
}

function mapJustify(
  figmaValue?: string,
): LayoutSpec["justify"] {
  switch (figmaValue) {
    case "CENTER":
      return "center";
    case "MAX":
      return "end";
    case "MIN":
      return "start";
    case "SPACE_BETWEEN":
      return "space-between";
    case "SPACE_AROUND":
      return "space-around";
    default:
      return undefined;
  }
}

// ── Container Node Converter ─────────────────────────────────

function convertContainerNode(
  node: FigmaNode,
  depth: number,
): ComponentSpec {
  const bv = node.boundVariables ?? {};
  const bb = node.absoluteBoundingBox;

  // Layout
  const hasAutoLayout =
    node.layoutMode && node.layoutMode !== "NONE";
  const layout: LayoutSpec = {
    display: hasAutoLayout ? "flex" : "block",
  };

  if (node.layoutMode === "VERTICAL") layout.direction = "column";
  if (node.layoutMode === "HORIZONTAL") layout.direction = "row";

  // Sizing
  if (node.layoutSizingHorizontal === "FILL") {
    layout.width = "100%";
  } else if (
    node.layoutSizingHorizontal === "FIXED" &&
    bb
  ) {
    layout.width = bb.width;
  }
  if (node.layoutSizingVertical === "FIXED" && bb) {
    layout.height = bb.height;
  }

  // Alignment
  layout.align = mapAlign(node.counterAxisAlignItems);
  layout.justify = mapJustify(node.primaryAxisAlignItems);

  // Gap
  if (node.itemSpacing && node.itemSpacing > 0) {
    layout.gap = resolveSpacing(node.itemSpacing, bv.itemSpacing);
  }

  // Padding
  const pT = node.paddingTop ?? 0;
  const pR = node.paddingRight ?? 0;
  const pB = node.paddingBottom ?? 0;
  const pL = node.paddingLeft ?? 0;
  if (pT || pR || pB || pL) {
    if (pT === pR && pR === pB && pB === pL && pT > 0) {
      layout.padding = {
        all: resolveSpacing(pT, bv.paddingTop),
      };
    } else {
      const padding: PaddingSpec = {};
      if (pT > 0) padding.top = resolveSpacing(pT, bv.paddingTop);
      if (pR > 0) padding.right = resolveSpacing(pR, bv.paddingRight);
      if (pB > 0) padding.bottom = resolveSpacing(pB, bv.paddingBottom);
      if (pL > 0) padding.left = resolveSpacing(pL, bv.paddingLeft);
      layout.padding = padding;
    }
  }

  // Border radius
  if (node.cornerRadius && node.cornerRadius > 0) {
    const radiusBv =
      bv.topLeftRadius ?? bv.cornerRadius;
    layout.borderRadius = resolveSpacing(node.cornerRadius, radiusBv);
  }

  layout.boxSizing = "border-box";

  // Flex wrap
  if (node.layoutWrap === "WRAP") {
    layout.flexWrap = "wrap";
  }

  // Overflow
  if (
    (node as unknown as Record<string, unknown>).clipsContent
  ) {
    layout.overflow = "hidden";
  }

  // Style
  const style: StyleSpec = {};

  // Background
  const bg = resolveFillColor(node.fills, bv);
  if (bg) style.background = bg;

  // Strokes → border
  if (node.strokes?.length && node.strokeWeight) {
    const stroke = node.strokes.find(
      (s) => s.type === "SOLID" && s.visible !== false,
    );
    if (stroke) {
      let strokeColor: TokenRef | string | undefined;
      if (bv.strokes && Array.isArray(bv.strokes) && bv.strokes[0]) {
        strokeColor = resolveBoundVariable(bv.strokes[0]) ?? undefined;
      }
      if (!strokeColor && stroke.boundVariables?.color) {
        strokeColor = resolveBoundVariable(stroke.boundVariables.color) ?? undefined;
      }
      if (!strokeColor && stroke.color) {
        strokeColor = rgbaToHex(stroke.color);
      }
      if (strokeColor) {
        style.border = {
          width: `${node.strokeWeight}px`,
          style: "solid",
          color: strokeColor,
        };
      }
    }
  }

  // Build spec
  const spec: ComponentSpec = {
    key: sanitizeKey(node.name, node.id),
    tag: "div",
    layout,
    style,
    data: { figmaName: node.name, figmaId: node.id },
  };

  // Store component ID for instances
  if (node.type === "INSTANCE" && node.componentId) {
    spec.data!.figmaComponentId = node.componentId;
  }

  // Children
  if (node.children?.length) {
    const childSpecs: ComponentSpec[] = [];
    for (const child of node.children) {
      const childSpec = figmaNodeToSpec(child, depth + 1);
      if (childSpec) childSpecs.push(childSpec);
    }
    if (childSpecs.length > 0) {
      spec.children = childSpecs;
    }
  }

  return spec;
}

// ── Text Node Converter ──────────────────────────────────────

function convertTextNode(node: FigmaNode): ComponentSpec {
  const bv = node.boundVariables ?? {};
  const ts = node.style ?? {};
  const bb = node.absoluteBoundingBox;

  const textStyle = figmaTextToStyleToken(
    ts.fontFamily ?? "KH Teka",
    ts.fontSize ?? 16,
    ts.fontWeight ?? 400,
  );

  // Text color
  let textColor: TokenRef | string | undefined;
  const fillBv = bv.fills;
  if (Array.isArray(fillBv) && fillBv[0]) {
    textColor = resolveBoundVariable(fillBv[0]) ?? undefined;
  }
  if (!textColor && node.fills?.length) {
    const fill = node.fills[0];
    if (fill?.type === "SOLID" && fill.color) {
      textColor = rgbaToHex(fill.color);
    }
  }

  const text: TextSpec = {
    content: node.characters ?? "",
    style: textStyle,
    weight: ts.fontWeight,
    editable: (node.characters?.length ?? 0) > 1,
  };

  if (textColor) text.color = textColor;

  if (ts.textAlignHorizontal === "CENTER") text.align = "center";
  if (ts.textAlignHorizontal === "RIGHT") text.align = "right";

  const layout: LayoutSpec = { display: "inline-flex" };
  if (bb) {
    if (
      node.layoutSizingHorizontal === "FILL" ||
      (node as unknown as Record<string, unknown>).layoutAlign === "STRETCH"
    ) {
      layout.width = "100%";
    }
  }

  return {
    key: sanitizeKey(node.name, node.id),
    tag: "span",
    layout,
    style: {},
    text,
    data: { figmaName: node.name, figmaId: node.id },
  };
}

// ── Vector/Icon Placeholder ──────────────────────────────────

function convertVectorNode(node: FigmaNode): ComponentSpec {
  const bb = node.absoluteBoundingBox;
  const w = bb?.width ?? 24;
  const h = bb?.height ?? 24;

  // Check for fill color on icon
  let iconColor: TokenRef | string | undefined;
  const bv = node.boundVariables ?? {};
  const fillBv = bv.fills;
  if (Array.isArray(fillBv) && fillBv[0]) {
    iconColor = resolveBoundVariable(fillBv[0]) ?? undefined;
  }
  if (!iconColor && node.fills?.length) {
    const fill = node.fills[0];
    if (fill?.type === "SOLID" && fill.color) {
      iconColor = rgbaToHex(fill.color);
    }
  }

  const style: StyleSpec = {};
  if (iconColor) style.color = iconColor;

  return {
    key: sanitizeKey(node.name, node.id),
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      width: w,
      height: h,
      flexShrink: 0,
    },
    style,
    data: {
      figmaName: node.name,
      figmaId: node.id,
      figmaType: node.type,
      component: "icon",
      iconName: node.name,
    },
  };
}

// ── Main Entry Point ─────────────────────────────────────────

const VECTOR_TYPES = new Set([
  "VECTOR",
  "STAR",
  "LINE",
  "BOOLEAN_OPERATION",
  "REGULAR_POLYGON",
]);

const CONTAINER_TYPES = new Set([
  "FRAME",
  "COMPONENT",
  "COMPONENT_SET",
  "INSTANCE",
  "GROUP",
  "SECTION",
]);

/**
 * Recursively convert a Figma REST API node tree to a ComponentSpec.
 * Returns null for invisible or unsupported nodes.
 */
export function figmaNodeToSpec(
  node: FigmaNode,
  depth = 0,
): ComponentSpec | null {
  // Skip invisible
  if (node.visible === false) return null;

  // Cap recursion
  if (depth > 12) return null;

  // Ellipse → icon placeholder
  if (node.type === "ELLIPSE") {
    return convertVectorNode(node);
  }

  // Vector/shape → icon placeholder
  if (VECTOR_TYPES.has(node.type)) {
    return convertVectorNode(node);
  }

  // Text → text leaf
  if (node.type === "TEXT") {
    return convertTextNode(node);
  }

  // Container (FRAME, COMPONENT, INSTANCE, GROUP, SECTION)
  if (CONTAINER_TYPES.has(node.type)) {
    return convertContainerNode(node, depth);
  }

  // Rectangle → simple box
  if (node.type === "RECTANGLE") {
    return convertContainerNode(node, depth);
  }

  // Unknown type → attempt container conversion
  return convertContainerNode(node, depth);
}
