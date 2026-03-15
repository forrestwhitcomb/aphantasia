// ============================================================
// SLOT EXTRACTOR — Generic Content Extraction from Shapes
// ============================================================
// Takes a parent shape and its children (from the containment
// tree) and produces a SlotBag. Applies parseTextLabel()
// uniformly to ALL text children, solving the problem of text
// parsing only working in top-level sections.
//
// This replaces the pattern-specific extraction in
// SpatialAnalyzer.ts (recognizePattern + extractFeatureItem)
// with a single generic pass that works at any nesting depth.
// ============================================================

import type { CanvasShape } from "@/engine/CanvasEngine";
import type { ContentSlot, SlotBag, SpatialHints } from "./SlotBag";
import { parseTextLabel } from "@/lib/textParse";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shapeArea(s: CanvasShape): number {
  return s.width * s.height;
}

function centerX(s: CanvasShape): number {
  return s.x + s.width / 2;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Extract a SlotBag from a parent shape and its direct children.
 *
 * For child rectangles that themselves have children in the containment tree,
 * we recurse to build `subItems` (these become cards / nested sections).
 * For child rectangles with NO children, we skip them (structural rects).
 */
export function extractSlots(
  parent: CanvasShape,
  directChildren: CanvasShape[],
  childrenMap: Map<string, string[]>,
  allShapes: CanvasShape[]
): SlotBag {
  const slots: ContentSlot[] = [];
  const subItems: SlotBag[] = [];
  const consumedIds = new Set<string>();

  // Separate children by type
  const textChildren = directChildren.filter((c) => c.type === "text");
  const imageChildren = directChildren.filter(
    (c) => c.type === "image" && c.meta?.src
  );
  const buttonChildren = directChildren.filter(
    (c) => c.type === "roundedRect"
  );
  const rectChildren = directChildren.filter((c) => c.type === "rectangle");

  // -----------------------------------------------------------------------
  // Compute spatial hints from child rectangles
  // -----------------------------------------------------------------------
  const hints = computeHints(rectChildren, imageChildren);

  // -----------------------------------------------------------------------
  // Detect "section heading" text above card rows
  // -----------------------------------------------------------------------
  // If we have child rects (potential cards), text positioned above them
  // is treated as a section heading rather than a card-level slot.
  const cardMinY =
    rectChildren.length >= 2
      ? Math.min(...rectChildren.map((c) => c.y))
      : Infinity;

  const sectionTextChildren: CanvasShape[] = [];
  const cardLevelTextChildren: CanvasShape[] = [];

  for (const tc of textChildren) {
    if (
      rectChildren.length >= 2 &&
      tc.y + tc.height <= cardMinY + 10 // text is above the card row
    ) {
      sectionTextChildren.push(tc);
    } else {
      cardLevelTextChildren.push(tc);
    }
  }

  // Sort section-level text by Y (topmost first)
  sectionTextChildren.sort((a, b) => a.y - b.y);

  // The topmost section text becomes the section heading (parsed for button: lines)
  if (sectionTextChildren.length > 0) {
    const topText = sectionTextChildren[0];
    const raw = topText.label || topText.content || "";
    const parsed = parseTextLabel(raw);
    if (parsed.heading) {
      slots.push({ role: "heading", value: parsed.heading, shapeId: topText.id });
    }
    if (parsed.body) {
      slots.push({ role: "body", value: parsed.body, shapeId: topText.id });
    }
    if (parsed.cta) {
      slots.push({ role: "cta", value: parsed.cta, shapeId: topText.id });
    }
    consumedIds.add(topText.id);

    // Additional section-level text also parsed
    for (let i = 1; i < sectionTextChildren.length; i++) {
      const st = sectionTextChildren[i];
      const rawSt = st.label || st.content || "";
      const parsedSt = parseTextLabel(rawSt);
      consumedIds.add(st.id);

      if (parsedSt.cta && !parsedSt.heading) {
        slots.push({ role: "cta", value: parsedSt.cta, shapeId: st.id });
      } else if (parsedSt.heading) {
        slots.push({ role: "body", value: parsedSt.heading + (parsedSt.body ? " " + parsedSt.body : ""), shapeId: st.id });
        if (parsedSt.cta) {
          slots.push({ role: "cta", value: parsedSt.cta, shapeId: st.id });
        }
      }
    }
  }

  // -----------------------------------------------------------------------
  // Process card-level text children with parseTextLabel
  // -----------------------------------------------------------------------
  let headingFound = sectionTextChildren.length > 0; // already have heading?

  for (const tc of cardLevelTextChildren) {
    const raw = tc.label || tc.content || "";
    const parsed = parseTextLabel(raw);
    consumedIds.add(tc.id);

    // CTA-only text
    if (parsed.cta && !parsed.heading) {
      slots.push({
        role: "cta",
        value: parsed.cta,
        shapeId: tc.id,
      });
      continue;
    }

    // First heading wins as the primary heading
    if (parsed.heading && !headingFound) {
      slots.push({
        role: "heading",
        value: parsed.heading,
        shapeId: tc.id,
      });
      headingFound = true;

      if (parsed.body) {
        slots.push({
          role: "body",
          value: parsed.body,
          shapeId: tc.id,
        });
      }
    } else if (parsed.heading) {
      // Subsequent headings become body text
      const bodyValue = parsed.heading + (parsed.body ? " " + parsed.body : "");
      slots.push({
        role: "body",
        value: bodyValue,
        shapeId: tc.id,
      });
    }

    // If text had an inline CTA ("button: Label")
    if (parsed.cta) {
      slots.push({
        role: "cta",
        value: parsed.cta,
        shapeId: tc.id,
      });
    }
  }

  // -----------------------------------------------------------------------
  // Process image children
  // -----------------------------------------------------------------------
  const parentCenterX = centerX(parent);

  for (const img of imageChildren) {
    const imgCx = centerX(img);
    const position = imgCx < parentCenterX ? "left" : "right";

    slots.push({
      role: "image",
      value: img.meta!.src as string,
      position,
      shapeId: img.id,
    });
    consumedIds.add(img.id);
  }

  // -----------------------------------------------------------------------
  // Process roundedRect children (buttons at this level)
  // -----------------------------------------------------------------------
  for (const btn of buttonChildren) {
    const label = btn.label || btn.content || "";
    slots.push({
      role: "cta",
      value: label || "Learn more",
      shapeId: btn.id,
    });
    consumedIds.add(btn.id);
  }

  // -----------------------------------------------------------------------
  // Process child rectangles — recurse for those with children, skip others
  // -----------------------------------------------------------------------
  // Sort cards left to right for consistent ordering
  const sortedRects = [...rectChildren].sort((a, b) => a.x - b.x);

  for (const rect of sortedRects) {
    const grandchildIds = childrenMap.get(rect.id) ?? [];

    if (grandchildIds.length === 0) {
      // Empty card rectangle — still counts as a sub-item (placeholder card)
      const rectLabel = rect.label || rect.content;
      const parsed = rectLabel ? parseTextLabel(rectLabel) : { heading: undefined, body: undefined, cta: undefined };
      const emptyBag: SlotBag = {
        parentId: rect.id,
        semanticTag: rect.semanticTag,
        slots: [
          ...(parsed.heading ? [{ role: "heading" as const, value: parsed.heading, shapeId: rect.id }] : []),
          ...(parsed.body ? [{ role: "body" as const, value: parsed.body, shapeId: rect.id }] : []),
          ...(parsed.cta ? [{ role: "cta" as const, value: parsed.cta, shapeId: rect.id }] : []),
        ],
        subItems: [],
        consumedIds: new Set<string>(),
        hints: { hasImage: false, childCount: 0, childrenAreSimilar: false, childrenAreHorizontal: false },
      };
      subItems.push(emptyBag);
      consumedIds.add(rect.id);
      continue;
    }

    // This rect has children — recurse to extract a sub-SlotBag
    const grandchildren = grandchildIds
      .map((id) => allShapes.find((s) => s.id === id))
      .filter(Boolean) as CanvasShape[];

    const subBag = extractSlots(rect, grandchildren, childrenMap, allShapes);
    subItems.push(subBag);

    // Consume the rect and all its descendants
    consumedIds.add(rect.id);
    for (const id of subBag.consumedIds) {
      consumedIds.add(id);
    }
  }

  // -----------------------------------------------------------------------
  // If no heading was found from text, fall back to parent label (parsed)
  // -----------------------------------------------------------------------
  if (!slots.some((s) => s.role === "heading")) {
    const parentLabel = parent.label || parent.content;
    if (parentLabel) {
      const parsed = parseTextLabel(parentLabel);
      if (parsed.heading) {
        slots.push({ role: "heading", value: parsed.heading, shapeId: parent.id });
      }
      if (parsed.body && !slots.some((s) => s.role === "body")) {
        slots.push({ role: "body", value: parsed.body, shapeId: parent.id });
      }
      if (parsed.cta && !slots.some((s) => s.role === "cta")) {
        slots.push({ role: "cta", value: parsed.cta, shapeId: parent.id });
      }
    }
  }

  return {
    parentId: parent.id,
    semanticTag: parent.semanticTag,
    slots,
    subItems,
    consumedIds,
    hints,
  };
}

// ---------------------------------------------------------------------------
// Spatial hint computation
// ---------------------------------------------------------------------------

function computeHints(
  rectChildren: CanvasShape[],
  imageChildren: CanvasShape[]
): SpatialHints {
  const hasImage = imageChildren.length > 0;
  const childCount = rectChildren.length;

  // Image position hint (from first image relative to sibling rects)
  let imagePosition: "left" | "right" | undefined;
  if (hasImage && rectChildren.length > 0) {
    const imgCx = centerX(imageChildren[0]);
    const rectAvgCx =
      rectChildren.reduce((sum, r) => sum + centerX(r), 0) / rectChildren.length;
    imagePosition = imgCx < rectAvgCx ? "left" : "right";
  }

  // Children are similar in size? (within 3x area ratio)
  let childrenAreSimilar = false;
  if (rectChildren.length >= 2) {
    const areas = rectChildren.map(shapeArea);
    const minArea = Math.min(...areas);
    const maxArea = Math.max(...areas);
    childrenAreSimilar = minArea > 0 && maxArea <= minArea * 3;
  }

  // Children are horizontally aligned? (Y spread < 50% of avg height)
  let childrenAreHorizontal = false;
  if (rectChildren.length >= 2) {
    const avgHeight =
      rectChildren.reduce((sum, r) => sum + r.height, 0) / rectChildren.length;
    const yValues = rectChildren.map((r) => r.y);
    const ySpread = Math.max(...yValues) - Math.min(...yValues);
    childrenAreHorizontal = ySpread < avgHeight * 0.5;
  }

  return {
    hasImage,
    imagePosition,
    childCount,
    childrenAreSimilar,
    childrenAreHorizontal,
  };
}
