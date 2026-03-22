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
  "card", "listItem", "listGroup", "sectionHeader", "avatar", "badge", "tag", "emptyState",
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

  // Attach notes to shapes (includes both in-frame and near-frame notes)
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

  // Pass 3: Containment grouping
  return groupAdjacentComponents(resolved, frameHeight);
}

// ── Pass 3: Containment Grouping ────────────────────────────
// Detect clusters of similarly-typed shapes stacked vertically
// and merge them into ListGroups with itemCount.

const GROUPABLE_TYPES = new Set<UIComponentType>(["listItem", "settingsRow", "card"]);
const GAP_FRACTION = 0.03; // ~25px gap tolerance at 852px frame

function groupAdjacentComponents(
  components: UIResolvedComponent[],
  frameHeight: number
): UIResolvedComponent[] {
  if (components.length < 2) return components;

  const gapThreshold = frameHeight * GAP_FRACTION;
  const result: UIResolvedComponent[] = [];
  let i = 0;

  while (i < components.length) {
    const current = components[i];

    // Only group certain component types
    if (!GROUPABLE_TYPES.has(current.type)) {
      result.push(current);
      i++;
      continue;
    }

    // Collect adjacent components of the same type
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
      // Merge into a ListGroup
      const labels = group
        .map((c) => c.label)
        .filter((l): l is string => !!l);

      const lastBounds = group[group.length - 1].bounds;
      const mergedHeight = lastBounds.y + lastBounds.height - current.bounds.y;

      result.push({
        shapeId: current.shapeId,
        type: current.type === "card" ? "card" : "listGroup",
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
