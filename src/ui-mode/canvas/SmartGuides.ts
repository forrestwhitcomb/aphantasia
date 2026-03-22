// ============================================================
// APHANTASIA — Smart Guides
// ============================================================
// Detects alignment between a dragging shape and all other
// shapes. Returns guide line positions for rendering.
// ============================================================

interface ShapeBounds {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GuideLine {
  /** "horizontal" or "vertical" */
  orientation: "horizontal" | "vertical";
  /** Position in canvas coordinates */
  position: number;
  /** Start of the guide line */
  start: number;
  /** End of the guide line */
  end: number;
}

const SNAP_THRESHOLD = 6; // px distance to trigger a guide

/**
 * Detect alignment guides between the dragging shape and
 * all other shapes on the canvas.
 *
 * Checks: left, center-x, right, top, center-y, bottom edges.
 * Returns guide lines and optional snap-to positions.
 */
export function detectGuides(
  dragging: ShapeBounds,
  others: ShapeBounds[]
): { guides: GuideLine[]; snapX?: number; snapY?: number } {
  const guides: GuideLine[] = [];
  let snapX: number | undefined;
  let snapY: number | undefined;

  const dragLeft = dragging.x;
  const dragCenterX = dragging.x + dragging.width / 2;
  const dragRight = dragging.x + dragging.width;
  const dragTop = dragging.y;
  const dragCenterY = dragging.y + dragging.height / 2;
  const dragBottom = dragging.y + dragging.height;

  for (const other of others) {
    if (other.id === dragging.id) continue;

    const otherLeft = other.x;
    const otherCenterX = other.x + other.width / 2;
    const otherRight = other.x + other.width;
    const otherTop = other.y;
    const otherCenterY = other.y + other.height / 2;
    const otherBottom = other.y + other.height;

    // Vertical guides (x-axis alignment)
    const xChecks = [
      { drag: dragLeft, other: otherLeft, label: "left-left" },
      { drag: dragLeft, other: otherRight, label: "left-right" },
      { drag: dragCenterX, other: otherCenterX, label: "cx-cx" },
      { drag: dragRight, other: otherLeft, label: "right-left" },
      { drag: dragRight, other: otherRight, label: "right-right" },
    ];

    for (const check of xChecks) {
      const dist = Math.abs(check.drag - check.other);
      if (dist < SNAP_THRESHOLD) {
        const minY = Math.min(dragTop, otherTop);
        const maxY = Math.max(dragBottom, otherBottom);
        guides.push({
          orientation: "vertical",
          position: check.other,
          start: minY,
          end: maxY,
        });
        if (snapX === undefined) {
          // Adjust dragging position to snap
          snapX = dragging.x + (check.other - check.drag);
        }
      }
    }

    // Horizontal guides (y-axis alignment)
    const yChecks = [
      { drag: dragTop, other: otherTop, label: "top-top" },
      { drag: dragTop, other: otherBottom, label: "top-bottom" },
      { drag: dragCenterY, other: otherCenterY, label: "cy-cy" },
      { drag: dragBottom, other: otherTop, label: "bottom-top" },
      { drag: dragBottom, other: otherBottom, label: "bottom-bottom" },
    ];

    for (const check of yChecks) {
      const dist = Math.abs(check.drag - check.other);
      if (dist < SNAP_THRESHOLD) {
        const minX = Math.min(dragLeft, otherLeft);
        const maxX = Math.max(dragRight, otherRight);
        guides.push({
          orientation: "horizontal",
          position: check.other,
          start: minX,
          end: maxX,
        });
        if (snapY === undefined) {
          snapY = dragging.y + (check.other - check.drag);
        }
      }
    }
  }

  return { guides, snapX, snapY };
}
