// ============================================================
// APHANTASIA — UI Semantic Resolver
// ============================================================
// Maps canvas shapes to UIResolvedComponent[] using four passes:
//   Pass 0: Manual override (meta.uiComponentType, highest priority)
//   Pass 1: Label override (keyword matching)
//   Pass 2: Spatial inference (position, size, aspect ratio)
//   Pass 3: Containment grouping (detect ListGroups from stacks)
//
// Input: CanvasShape[] + frame dimensions
// Output: UIResolvedComponent[]
// ============================================================

import type { UIComponentType, UIResolvedComponent } from "../types";
import { resolveFromLabel } from "./labelRules";
import { resolveFromSpatial } from "./spatialRules";
import { attachNotes } from "./noteAttachment";

// Valid UIComponentType set for Pass 0 validation
const VALID_UI_TYPES = new Set<string>([
  "statusBar", "navBar", "tabBar", "bottomSheet",
  "card", "listItem", "listGroup", "sectionHeader", "header", "avatar", "badge", "tag", "emptyState",
  "button", "textInput", "searchBar", "toggle", "checkbox", "segmentedControl", "slider", "stepper",
  "imagePlaceholder", "carousel", "progressBar", "divider",
  "alert", "toast", "modal", "floatingActionButton",
  "profileHeader", "messageBubble", "feedItem", "settingsRow",
]);

// Minimal shape interface — matches CanvasShape fields we need
interface InputShape {
  id: string;
  type: string; // "rectangle" | "text" | "note" | etc.
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  content?: string;
  linkedShapeId?: string;
  isInsideFrame: boolean;
  meta?: Record<string, unknown>;
}

/**
 * Resolve an array of canvas shapes into UI components.
 * Only processes shapes inside the active frame.
 * Notes are extracted and attached to their target components.
 */
export function resolveUIComponents(
  shapes: InputShape[],
  frameWidth: number,
  frameHeight: number
): UIResolvedComponent[] {
  // Filter to in-frame shapes, exclude consumed ones.
  // For notes: also include notes near the frame (within 120px)
  // or with an explicit linkedShapeId pointing into the frame.
  const NEAR_FRAME_MARGIN = 120;
  const inFrameIds = new Set(
    shapes.filter((s) => s.isInsideFrame).map((s) => s.id)
  );

  const frameShapes = shapes
    .filter((s) => {
      if (s.meta?._consumed) return false;
      if (s.isInsideFrame) return true;
      // Include notes near the frame or explicitly linked to in-frame shapes
      if (s.type === "note" || s.type === "sticky") {
        if (s.linkedShapeId && inFrameIds.has(s.linkedShapeId)) return true;
        // Check proximity to frame bounds (0,0 to frameWidth,frameHeight)
        const nearX = s.x + s.width >= -NEAR_FRAME_MARGIN && s.x <= frameWidth + NEAR_FRAME_MARGIN;
        const nearY = s.y + s.height >= -NEAR_FRAME_MARGIN && s.y <= frameHeight + NEAR_FRAME_MARGIN;
        return nearX && nearY;
      }
      return false;
    })
    .sort((a, b) => a.y - b.y);

  // Separate notes from drawable shapes
  const drawableShapes = frameShapes.filter((s) => s.type !== "note" && s.type !== "sticky");

  // attachNotes: explicit linkedShapeId wins; proximity only when unlinked (see noteAttachment.ts)
  const { attachedNotes, globalNotes } = attachNotes(frameShapes);

  // Resolve each drawable shape through Pass 0 → 1 → 2
  const resolved: UIResolvedComponent[] = [];
  const resolvedIds = new Set<string>();

  for (const shape of drawableShapes) {
    if (resolvedIds.has(shape.id)) continue;

    const label = shape.label ?? shape.content ?? "";
    const notes = attachedNotes.get(shape.id) ?? [];

    // Pass 0: Manual override (meta.uiComponentType from shape tag dropdown)
    const manualType = shape.meta?.uiComponentType as string | undefined;
    if (manualType && VALID_UI_TYPES.has(manualType)) {
      resolved.push({
        shapeId: shape.id,
        type: manualType as UIComponentType,
        label: label || undefined,
        notes,
        globalNotes,
        bounds: { x: shape.x, y: shape.y, width: shape.width, height: shape.height },
      });
      resolvedIds.add(shape.id);
      continue;
    }

    // Text tool → typography stack in the viewport (headline / subheader / body),
    // not a card from spatial rules.
    if (shape.type === "text") {
      resolved.push({
        shapeId: shape.id,
        type: "header",
        variant: "large",
        label: label || undefined,
        notes,
        globalNotes,
        bounds: { x: shape.x, y: shape.y, width: shape.width, height: shape.height },
      });
      resolvedIds.add(shape.id);
      continue;
    }

    // Pass 1: Label override
    const labelResult = resolveFromLabel(label);
    if (labelResult) {
      resolved.push({
        shapeId: shape.id,
        type: labelResult.type,
        variant: labelResult.variant,
        label: cleanLabel(label, labelResult.type),
        notes,
        globalNotes,
        bounds: { x: shape.x, y: shape.y, width: shape.width, height: shape.height },
      });
      resolvedIds.add(shape.id);
      continue;
    }

    // Pass 2: Spatial inference
    const spatialResult = resolveFromSpatial(
      { x: shape.x, y: shape.y, width: shape.width, height: shape.height },
      frameWidth,
      frameHeight
    );
    if (spatialResult) {
      resolved.push({
        shapeId: shape.id,
        type: spatialResult.type,
        variant: spatialResult.variant,
        label: label || undefined,
        notes,
        globalNotes,
        bounds: { x: shape.x, y: shape.y, width: shape.width, height: shape.height },
      });
      resolvedIds.add(shape.id);
      continue;
    }

    // Fallback: Card (safe default for unresolved shapes)
    resolved.push({
      shapeId: shape.id,
      type: "card",
      label: label || undefined,
      notes,
      globalNotes,
      bounds: { x: shape.x, y: shape.y, width: shape.width, height: shape.height },
    });
    resolvedIds.add(shape.id);
  }

  // Pass 3a: Containment — nest small shapes inside card shapes
  const afterContainment = resolveContainment(resolved);

  // Pass 3b: Grouping (list stacking, horizontal card rows)
  return groupAdjacentComponents(afterContainment, frameHeight);
}

// ── Pass 3a: Containment ─────────────────────────────────────
// Detect shapes that are spatially inside a card and nest them
// as children. This lets users drop a toggle or text into a card
// and have it render as card content.

const CONTAINER_TYPES = new Set<UIComponentType>(["card", "bottomSheet", "modal"]);
const NESTABLE_TYPES = new Set<UIComponentType>([
  "toggle", "checkbox", "button", "textInput", "slider", "stepper",
  "segmentedControl", "divider", "badge", "tag", "progressBar",
  "listItem", "settingsRow", "header",
]);

function resolveContainment(components: UIResolvedComponent[]): UIResolvedComponent[] {
  if (components.length < 2) return components;

  const containers = components.filter((c) => CONTAINER_TYPES.has(c.type));
  if (containers.length === 0) return components;

  const consumed = new Set<string>();
  const containerChildren = new Map<string, UIResolvedComponent[]>();

  for (const container of containers) {
    const cb = container.bounds;
    const children: UIResolvedComponent[] = [];

    for (const comp of components) {
      if (comp.shapeId === container.shapeId) continue;
      if (consumed.has(comp.shapeId)) continue;
      if (!NESTABLE_TYPES.has(comp.type)) continue;

      const b = comp.bounds;
      // Check if comp is inside the container.
      // Prefer full-rect inclusion, but also allow center-point inclusion
      // so slightly misaligned badges/text near the edge still nest into cards.
      const tol = 4;
      const centerX = b.x + b.width / 2;
      const centerY = b.y + b.height / 2;
      const centerInside =
        centerX >= cb.x - tol &&
        centerX <= cb.x + cb.width + tol &&
        centerY >= cb.y - tol &&
        centerY <= cb.y + cb.height + tol;
      if (
        (
          b.x >= cb.x - tol &&
          b.y >= cb.y - tol &&
          b.x + b.width <= cb.x + cb.width + tol &&
          b.y + b.height <= cb.y + cb.height + tol
        ) ||
        centerInside
      ) {
        children.push(comp);
        consumed.add(comp.shapeId);
      }
    }

    if (children.length > 0) {
      children.sort((a, b) => a.bounds.y - b.bounds.y);
      containerChildren.set(container.shapeId, children);
    }
  }

  if (consumed.size === 0) return components;

  return components
    .filter((c) => !consumed.has(c.shapeId))
    .map((c) => {
      const kids = containerChildren.get(c.shapeId);
      if (kids) return { ...c, children: kids, consumedIds: [...(c.consumedIds ?? []), ...kids.map((k) => k.shapeId)] };
      return c;
    });
}

// ── Pass 3b: Containment Grouping ────────────────────────────
// Detect clusters of similarly-typed shapes and merge them:
//   - Vertically stacked listItems/settingsRows → ListGroup
//   - Horizontally adjacent cards → single card component with itemCount
//   - Vertically stacked cards → kept separate (each renders independently)

const LIST_GROUPABLE = new Set<UIComponentType>(["listItem", "settingsRow"]);
const GAP_FRACTION = 0.03; // ~25px gap tolerance at 852px frame

function groupAdjacentComponents(
  components: UIResolvedComponent[],
  frameHeight: number
): UIResolvedComponent[] {
  if (components.length < 2) return groupHorizontalCards(components);

  const gapThreshold = frameHeight * GAP_FRACTION;
  const result: UIResolvedComponent[] = [];
  let i = 0;

  while (i < components.length) {
    const current = components[i];

    if (!LIST_GROUPABLE.has(current.type)) {
      result.push(current);
      i++;
      continue;
    }

    const group = [current];
    let j = i + 1;

    while (j < components.length) {
      const next = components[j];
      if (next.type !== current.type) break;

      const prevBottom = group[group.length - 1].bounds.y + group[group.length - 1].bounds.height;
      const gap = next.bounds.y - prevBottom;
      if (gap > gapThreshold) break;

      group.push(next);
      j++;
    }

    if (group.length > 1) {
      const labels = group
        .map((c) => c.label)
        .filter((l): l is string => !!l);

      const lastBounds = group[group.length - 1].bounds;
      const mergedHeight = lastBounds.y + lastBounds.height - current.bounds.y;

      result.push({
        shapeId: current.shapeId,
        type: "listGroup",
        label: current.label,
        notes: group.flatMap((c) => c.notes),
        globalNotes: current.globalNotes,
        bounds: {
          x: current.bounds.x,
          y: current.bounds.y,
          width: current.bounds.width,
          height: mergedHeight,
        },
        itemCount: group.length,
        itemLabels: labels.length > 0 ? labels : undefined,
        consumedIds: group.slice(1).map((c) => c.shapeId),
      });
    } else {
      result.push(current);
    }

    i = j;
  }

  return groupHorizontalCards(result);
}

/**
 * Group cards that sit on the same horizontal row into a single
 * card component with itemCount = number of cards in that row.
 * A "row" means overlapping Y ranges and sorted left-to-right.
 */
function groupHorizontalCards(
  components: UIResolvedComponent[]
): UIResolvedComponent[] {
  const result: UIResolvedComponent[] = [];
  const consumed = new Set<string>();

  for (let i = 0; i < components.length; i++) {
    const c = components[i];
    if (consumed.has(c.shapeId)) continue;

    if (c.type !== "card") {
      result.push(c);
      continue;
    }

    // Find other cards on the same horizontal row
    const row = [c];
    const cMidY = c.bounds.y + c.bounds.height / 2;
    const yTolerance = c.bounds.height * 0.5;

    for (let j = i + 1; j < components.length; j++) {
      const other = components[j];
      if (consumed.has(other.shapeId) || other.type !== "card") continue;

      const otherMidY = other.bounds.y + other.bounds.height / 2;
      if (Math.abs(otherMidY - cMidY) <= yTolerance) {
        row.push(other);
      }
    }

    if (row.length === 1) {
      result.push(c);
      continue;
    }

    // Sort left-to-right
    row.sort((a, b) => a.bounds.x - b.bounds.x);

    const labels = row.map((r) => r.label).filter((l): l is string => !!l);
    const minX = Math.min(...row.map((r) => r.bounds.x));
    const maxRight = Math.max(...row.map((r) => r.bounds.x + r.bounds.width));
    const minY = Math.min(...row.map((r) => r.bounds.y));
    const maxBottom = Math.max(...row.map((r) => r.bounds.y + r.bounds.height));

    result.push({
      shapeId: row[0].shapeId,
      type: "card",
      label: row[0].label,
      notes: row.flatMap((r) => r.notes),
      globalNotes: row[0].globalNotes,
      bounds: {
        x: minX,
        y: minY,
        width: maxRight - minX,
        height: maxBottom - minY,
      },
      itemCount: row.length,
      itemLabels: labels.length > 0 ? labels : undefined,
      consumedIds: row.slice(1).map((r) => r.shapeId),
    });

    for (const r of row.slice(1)) consumed.add(r.shapeId);
  }

  return result;
}

// ── Helpers ──────────────────────────────────────────────────

/**
 * Clean label text by removing the keyword that triggered the
 * label rule (e.g., "nav Home" → "Home", "button Submit" → "Submit").
 * If the label IS just the keyword, return undefined.
 */
function cleanLabel(label: string, type: UIComponentType): string | undefined {
  const cleaned = label
    .replace(/\b(nav|navbar|navigation|header|tabbar|tabs|bottom\s*nav|card|list|menu|button|btn|cta|input|field|search|toggle|switch|image|photo|modal|dialog|alert|badge|tag|chip|fab|divider|progress|empty|settings|profile|feed|post|message|chat|carousel|slider|stepper|checkbox)\b/gi, "")
    .trim();
  return cleaned || undefined;
}
