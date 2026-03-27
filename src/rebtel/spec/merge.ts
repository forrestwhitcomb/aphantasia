// ============================================================
// Spec Merge — compose parent + child shape specs at render time
// ============================================================
// When a child shape has parentId pointing to a parent shape,
// the child's spec is appended to the parent's children at
// render time without mutating the stored specs.
// ============================================================

import type { ComponentSpec } from "./types";
import { cloneSpec, findByKey } from "./operations";

/**
 * Merge child specs into a parent spec for rendering.
 * Looks for a node with key "content-area" in the parent tree
 * to insert children. Falls back to appending at root level.
 * Returns a new spec tree — originals are not mutated.
 */
export function mergeChildSpecs(
  parentSpec: ComponentSpec,
  childSpecs: ComponentSpec[],
): ComponentSpec {
  if (childSpecs.length === 0) return parentSpec;

  const merged = cloneSpec(parentSpec);

  // Try to find a designated content-area node
  const contentArea = findByKey(merged, "content-area");
  const target = contentArea ?? merged;

  if (!target.children) target.children = [];

  for (const childSpec of childSpecs) {
    target.children.push(cloneSpec(childSpec));
  }

  return merged;
}
