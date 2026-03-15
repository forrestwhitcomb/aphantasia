// ============================================================
// SPATIAL ANALYZER — Nested Component Hierarchy Detection
// ============================================================
// Detects containment relationships between shapes and
// recognizes compound patterns (card grids, sections with
// headings, etc.) from spatial layout alone — no AI needed.
// ============================================================

import type { CanvasShape } from "@/engine/CanvasEngine";
import type { FeatureGridProps, FeatureItem } from "@/types/render";
import { parseTextLabel } from "@/lib/textParse";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SpatialGroup {
  parentId: string;
  pattern: "card-grid" | "section-with-heading" | "none";
  extractedProps: Partial<FeatureGridProps>;
  consumedIds: Set<string>;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function analyzeHierarchy(
  shapes: CanvasShape[],
  _frameWidth: number,
  _frameHeight: number
): { groups: SpatialGroup[]; consumedIds: Set<string> } {
  // Only analyze layout-relevant shapes (not notes, arrows, stickies)
  const layoutTypes = new Set(["rectangle", "roundedRect", "text", "image"]);
  const layoutShapes = shapes.filter((s) => layoutTypes.has(s.type));

  if (layoutShapes.length < 2) {
    return { groups: [], consumedIds: new Set() };
  }

  // Step 1: Build containment tree
  const childrenMap = buildContainmentTree(layoutShapes);

  // Step 2: Recognize patterns
  const groups: SpatialGroup[] = [];
  const allConsumed = new Set<string>();

  for (const [parentId, childIds] of childrenMap) {
    const parent = layoutShapes.find((s) => s.id === parentId);
    if (!parent) continue;

    // Only rectangles can be container parents
    if (parent.type !== "rectangle") continue;

    const children = childIds
      .map((id) => layoutShapes.find((s) => s.id === id))
      .filter(Boolean) as CanvasShape[];

    const group = recognizePattern(parent, children, childrenMap, layoutShapes);
    if (group.pattern !== "none") {
      groups.push(group);
      for (const id of group.consumedIds) {
        allConsumed.add(id);
      }
    }
  }

  return { groups, consumedIds: allConsumed };
}

// ---------------------------------------------------------------------------
// Containment detection
// ---------------------------------------------------------------------------

function shapeArea(s: CanvasShape): number {
  return s.width * s.height;
}

function intersectionArea(a: CanvasShape, b: CanvasShape): number {
  const ox = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const oy = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return ox * oy;
}

export function buildContainmentTree(
  shapes: CanvasShape[]
): Map<string, string[]> {
  // Sort by area descending — largest shapes first (potential parents)
  const sorted = [...shapes].sort((a, b) => shapeArea(b) - shapeArea(a));

  // For each shape, find its most immediate (smallest) container
  const parentOf = new Map<string, string>(); // childId -> parentId

  for (let i = 0; i < sorted.length; i++) {
    const child = sorted[i];
    const childA = shapeArea(child);
    if (childA === 0) continue;

    let bestParent: CanvasShape | null = null;
    let bestParentArea = Infinity;

    for (let j = 0; j < sorted.length; j++) {
      if (i === j) continue;
      const candidate = sorted[j];
      const candidateA = shapeArea(candidate);

      // Parent must be substantially larger
      if (candidateA <= childA * 1.5) continue;

      // Check containment: > 50% of child area inside candidate
      const overlap = intersectionArea(candidate, child);
      if (overlap / childA > 0.5) {
        // Pick smallest qualifying container (most immediate parent)
        if (candidateA < bestParentArea) {
          bestParent = candidate;
          bestParentArea = candidateA;
        }
      }
    }

    if (bestParent) {
      parentOf.set(child.id, bestParent.id);
    }
  }

  // Invert: parentId -> childId[]
  const childrenMap = new Map<string, string[]>();
  for (const [childId, parentId] of parentOf) {
    if (!childrenMap.has(parentId)) {
      childrenMap.set(parentId, []);
    }
    childrenMap.get(parentId)!.push(childId);
  }

  return childrenMap;
}

// ---------------------------------------------------------------------------
// Pattern recognition
// ---------------------------------------------------------------------------

function recognizePattern(
  parent: CanvasShape,
  directChildren: CanvasShape[],
  childrenMap: Map<string, string[]>,
  allShapes: CanvasShape[]
): SpatialGroup {
  const noGroup: SpatialGroup = {
    parentId: parent.id,
    pattern: "none",
    extractedProps: {},
    consumedIds: new Set(),
  };

  // Find child rectangles that could be cards
  const childRects = directChildren.filter(
    (c) => c.type === "rectangle"
  );

  // Need at least 2 card-like rectangles for a card grid
  if (childRects.length < 2) return noGroup;

  // Check if child rects are roughly similar in size (within 2x of each other)
  const areas = childRects.map(shapeArea);
  const minArea = Math.min(...areas);
  const maxArea = Math.max(...areas);
  if (maxArea > minArea * 3) return noGroup; // Too different in size

  // Check if they're roughly horizontally aligned
  // (Y coordinates within 30% of average height)
  const avgHeight = childRects.reduce((sum, r) => sum + r.height, 0) / childRects.length;
  const yValues = childRects.map((r) => r.y);
  const ySpread = Math.max(...yValues) - Math.min(...yValues);
  if (ySpread > avgHeight * 0.5) return noGroup; // Not aligned enough

  // It's a card grid! Extract features from each card
  const consumed = new Set<string>();
  const features: FeatureItem[] = [];

  // Sort cards left to right
  const sortedCards = [...childRects].sort((a, b) => a.x - b.x);

  for (const card of sortedCards) {
    consumed.add(card.id);

    // Look at grandchildren (contents of each card)
    const grandchildIds = childrenMap.get(card.id) ?? [];
    const grandchildren = grandchildIds
      .map((id) => allShapes.find((s) => s.id === id))
      .filter(Boolean) as CanvasShape[];

    const feature = extractFeatureItem(grandchildren);

    // Consume grandchildren
    for (const gc of grandchildren) {
      consumed.add(gc.id);
    }

    features.push(feature);
  }

  // Check for heading text above the card row
  const cardMinY = Math.min(...sortedCards.map((c) => c.y));
  const textChildren = directChildren.filter(
    (c) => c.type === "text" && c.y + c.height <= cardMinY + 10 // text is above cards
  );

  let title: string | undefined;
  let pattern: SpatialGroup["pattern"] = "card-grid";

  if (textChildren.length > 0) {
    // Sort by Y to get topmost text as title
    const sorted = [...textChildren].sort((a, b) => a.y - b.y);
    title = sorted[0].label || sorted[0].content || undefined;
    consumed.add(sorted[0].id);
    pattern = "section-with-heading";

    // If there's a second text, use it as subtitle
    // (consumed either way)
    for (let i = 1; i < sorted.length; i++) {
      consumed.add(sorted[i].id);
    }
  }

  // Also consume any roundedRect children of the parent (buttons at section level)
  const buttonChildren = directChildren.filter((c) => c.type === "roundedRect");
  for (const btn of buttonChildren) {
    consumed.add(btn.id);
  }

  return {
    parentId: parent.id,
    pattern,
    extractedProps: {
      title: title || parent.label || undefined,
      features,
    },
    consumedIds: consumed,
  };
}

// ---------------------------------------------------------------------------
// Feature item extraction from card contents
// ---------------------------------------------------------------------------

function extractFeatureItem(children: CanvasShape[]): FeatureItem {
  // A roundedRect's presence alone means "this is a button" — label is optional
  const hasButton = children.some((c) => c.type === "roundedRect");
  const buttonLabel = children
    .filter((c) => c.type === "roundedRect")
    .map((c) => c.label || c.content || "")
    .find((t) => t.length > 0);

  // Extract image source from image children
  const imageChild = children.find((c) => c.type === "image" && c.meta?.src);
  const imageSrc = imageChild ? (imageChild.meta!.src as string) : undefined;

  // Parse text children using smart multi-line parsing
  // Each text child is parsed: first line → heading, rest → body, "button" → cta
  let heading: string | undefined;
  let body: string | undefined;
  let textCta: string | undefined;

  const textChildren = children.filter((c) => c.type === "text");
  for (const tc of textChildren) {
    const raw = tc.label || tc.content || "";
    const parsed = parseTextLabel(raw);

    // If this text is a CTA indicator ("button", "btn: Sign up", etc.)
    if (parsed.cta) {
      textCta = parsed.cta;
      continue;
    }

    // First text with a heading wins as the card heading
    if (parsed.heading && !heading) {
      heading = parsed.heading;
      // If this same text also had body lines, use them
      if (parsed.body && !body) {
        body = parsed.body;
      }
    } else if (parsed.heading && heading && !body) {
      // Second text becomes body
      body = parsed.heading + (parsed.body ? " " + parsed.body : "");
    }
  }

  // RoundedRect = button. Use its label if present, then text-derived cta, otherwise default.
  const cta = hasButton
    ? (buttonLabel || textCta || "Learn more")
    : textCta || undefined;

  return {
    heading: heading || "Card",
    body: body || undefined,
    cta,
    imageSrc,
  };
}
