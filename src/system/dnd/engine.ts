// ============================================================
// Aphantasia/System — Drag State Machine
// ============================================================
// State machine: IDLE → PENDING (mousedown) → DRAGGING (move > threshold) → IDLE (mouseup)
// If mouseup before threshold, treat as click not drag.

export type DragPhase = "idle" | "pending" | "dragging";

export type DragTarget =
  | { type: "reorder"; parentId: string; insertIndex: number }
  | { type: "reparent"; containerId: string; insertIndex: number };

export interface DragState {
  phase: DragPhase;
  nodeId: string | null;
  parentId: string | null;
  startX: number;
  startY: number;
  originIndex: number;
  insertIndex: number;
}

export const INITIAL_DRAG: DragState = {
  phase: "idle",
  nodeId: null,
  parentId: null,
  startX: 0,
  startY: 0,
  originIndex: -1,
  insertIndex: -1,
};

export const DRAG_THRESHOLD = 5;

export function shouldStartDrag(dx: number, dy: number): boolean {
  return Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD;
}

/** Component types that are valid drop containers for reparenting */
export const CONTAINER_TYPES = new Set([
  "Card", "Section", "Form", "Modal", "Nav", "Sidebar", "Footer", "__root", "__row",
]);

export function isContainerType(type: string): boolean {
  return CONTAINER_TYPES.has(type);
}
