// ============================================================
// Spec Merge — compose parent + child shape specs at render time
// ============================================================
// When a child shape has parentId pointing to a parent shape,
// the child's spec is appended to the parent's children at
// render time without mutating the stored specs.
// ============================================================

import type { ComponentSpec } from "./types";
import { cloneSpec, findByKey } from "./operations";

interface ChildPosition {
  x: number;
  y: number;
}

/**
 * Merge child specs into a parent spec for rendering.
 * Looks for a node with key "content-area" in the parent tree
 * to insert children. Falls back to appending at root level.
 * Returns a new spec tree — originals are not mutated.
 *
 * When positions are provided, detects horizontal arrangement
 * (similar Y, different X) and wraps children in a row container.
 * For card parents with only interactive children, adds a spacer
 * to push them to the bottom.
 */
export function mergeChildSpecs(
  parentSpec: ComponentSpec,
  childSpecs: ComponentSpec[],
  positions?: ChildPosition[],
): ComponentSpec {
  if (childSpecs.length === 0) return parentSpec;

  const merged = cloneSpec(parentSpec);

  // Try to find a designated content-area node
  const contentArea = findByKey(merged, "content-area");
  const target = contentArea ?? merged;

  if (!target.children) target.children = [];

  // Detect horizontal arrangement from positions
  const isHorizontal = positions && positions.length >= 2 && (() => {
    const ys = positions.map(p => p.y);
    const yRange = Math.max(...ys) - Math.min(...ys);
    const xs = positions.map(p => p.x);
    const xRange = Math.max(...xs) - Math.min(...xs);
    return yRange < 20 && xRange > 20;
  })();

  const clonedChildren = childSpecs.map(c => cloneSpec(c));

  // Check if parent is a card-like component
  const isCard = merged.data?.component?.includes("card") ||
    merged.data?.component?.includes("Card") ||
    merged.layout.borderRadius !== undefined;

  // Separate content (text, dividers) from actions (buttons, inputs)
  // Content stays at top of card, actions get pushed to bottom
  const isActionChild = (c: ComponentSpec) =>
    !!c.interactive || c.data?.component === "button" ||
    (c.children && c.children.length > 0 && !c.text);
  const contentChildren = clonedChildren.filter(c => !isActionChild(c));
  const actionChildren = clonedChildren.filter(c => isActionChild(c));

  if (isHorizontal) {
    // Wrap children in a row container
    const rowWrapper: ComponentSpec = {
      key: "composed-row",
      tag: "div",
      layout: {
        display: "flex",
        direction: "row",
        gap: { token: "spacing.sm" },
        width: "100%",
        justify: "center",
        align: "center",
      },
      style: {},
      children: clonedChildren,
    };
    // Text at top, spacer, then row at bottom for cards
    if (isCard) {
      for (const tc of contentChildren) target.children.push(tc);
      target.children.push({
        key: "spacer",
        tag: "div",
        layout: { display: "flex", flexGrow: 1 },
        style: {},
      });
    }
    target.children.push(rowWrapper);
  } else {
    if (isCard) {
      // Text children at top
      for (const tc of contentChildren) target.children.push(tc);
      // Spacer pushes interactive children to bottom
      target.children.push({
        key: "spacer",
        tag: "div",
        layout: { display: "flex", flexGrow: 1 },
        style: {},
      });
      // Interactive children at bottom with 8px gap
      const buttonGroup: ComponentSpec = {
        key: "composed-buttons",
        tag: "div",
        layout: {
          display: "flex",
          direction: "column",
          gap: { token: "spacing.xs" },
          width: "100%",
        },
        style: {},
        children: actionChildren,
      };
      target.children.push(buttonGroup);
    } else {
      for (const child of clonedChildren) {
        target.children.push(child);
      }
    }
  }

  // Ensure composed children have vertical spacing
  if (!target.layout.gap) {
    target.layout.gap = { token: "spacing.xs" };
  }

  return merged;
}
