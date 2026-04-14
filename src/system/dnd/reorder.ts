// ============================================================
// Aphantasia/System — Drag Reorder Logic
// ============================================================

import type { SpecNode } from "../types";

/**
 * Given the cursor Y position and an array of sibling bounding rects,
 * compute the insertion index for the dragged item.
 * Uses midpoint comparison — if cursor is above a sibling's midpoint,
 * insertion goes before that sibling.
 */
export function computeInsertIndex(
  cursorY: number,
  siblingRects: DOMRect[],
  draggedIndex: number,
): number {
  for (let i = 0; i < siblingRects.length; i++) {
    if (i === draggedIndex) continue;
    const rect = siblingRects[i];
    const midY = rect.top + rect.height / 2;
    if (cursorY < midY) {
      return i <= draggedIndex ? i : i;
    }
  }
  return siblingRects.length;
}

/**
 * Produce a new children array with the node at fromIndex moved to toIndex.
 * Returns a new array (immutable).
 */
export function reorderChildren(
  children: SpecNode[],
  fromIndex: number,
  toIndex: number,
): SpecNode[] {
  if (fromIndex === toIndex) return children;
  const result = [...children];
  const [item] = result.splice(fromIndex, 1);
  const adjustedTo = toIndex > fromIndex ? toIndex - 1 : toIndex;
  result.splice(adjustedTo, 0, item);
  return result;
}

/**
 * Check if nodeId is a descendant of ancestorId in the tree.
 * Used for cycle prevention during reparenting.
 */
export function isDescendant(root: SpecNode, nodeId: string, ancestorId: string): boolean {
  const ancestor = findNode(root, ancestorId);
  if (!ancestor) return false;
  return hasDescendant(ancestor, nodeId);
}

function hasDescendant(node: SpecNode, targetId: string): boolean {
  for (const child of node.children) {
    if (child.id === targetId) return true;
    if (hasDescendant(child, targetId)) return true;
  }
  return false;
}

function findNode(node: SpecNode, id: string): SpecNode | null {
  if (node.id === id) return node;
  for (const c of node.children) {
    const found = findNode(c, id);
    if (found) return found;
  }
  return null;
}

/**
 * Find the parent of a given node in the tree.
 * Returns the parent node or null if not found.
 */
export function findParent(root: SpecNode, targetId: string): SpecNode | null {
  for (const child of root.children) {
    if (child.id === targetId) return root;
    const found = findParent(child, targetId);
    if (found) return found;
  }
  return null;
}
