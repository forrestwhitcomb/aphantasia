// ============================================================
// Spec Operations — mutate stored ComponentSpec trees
// ============================================================
// All edit operations mutate the spec in place (since the spec
// is stored on the CanvasShape and is the source of truth).
// ============================================================

import type { ComponentSpec, LayoutSpec, StyleSpec } from "./types";

// ── Tree Search ──────────────────────────────────────────────

/** Find a node by key in a spec tree (depth-first) */
export function findByKey(
  spec: ComponentSpec,
  key: string,
): ComponentSpec | null {
  if (spec.key === key) return spec;
  if (spec.children) {
    for (const child of spec.children) {
      const found = findByKey(child, key);
      if (found) return found;
    }
  }
  return null;
}

/** Walk the tree, calling fn on each node */
export function walkTree(
  spec: ComponentSpec,
  fn: (node: ComponentSpec, parent: ComponentSpec | null) => void,
  parent: ComponentSpec | null = null,
): void {
  fn(spec, parent);
  if (spec.children) {
    for (const child of spec.children) {
      walkTree(child, fn, spec);
    }
  }
}

// ── Edit Operations ──────────────────────────────────────────

/** Change text content of a node by key */
export function editText(
  spec: ComponentSpec,
  key: string,
  newText: string,
): boolean {
  const node = findByKey(spec, key);
  if (node?.text) {
    node.text.content = newText;
    return true;
  }
  return false;
}

/** Remove a child node by key from anywhere in the tree */
export function removeChild(spec: ComponentSpec, childKey: string): boolean {
  let removed = false;
  walkTree(spec, (node) => {
    if (node.children) {
      const before = node.children.length;
      node.children = node.children.filter((c) => c.key !== childKey);
      if (node.children.length < before) removed = true;
    }
  });
  return removed;
}

/** Add a child node under a parent identified by key */
export function addChild(
  spec: ComponentSpec,
  parentKey: string,
  child: ComponentSpec,
  index?: number,
): boolean {
  const parent = findByKey(spec, parentKey);
  if (!parent) return false;
  if (!parent.children) parent.children = [];
  if (index !== undefined && index >= 0 && index <= parent.children.length) {
    parent.children.splice(index, 0, child);
  } else {
    parent.children.push(child);
  }
  return true;
}

/** Merge partial style updates onto a node */
export function setStyle(
  spec: ComponentSpec,
  key: string,
  updates: Partial<StyleSpec>,
): boolean {
  const node = findByKey(spec, key);
  if (!node) return false;
  Object.assign(node.style, updates);
  return true;
}

/** Merge partial layout updates onto a node */
export function setLayout(
  spec: ComponentSpec,
  key: string,
  updates: Partial<LayoutSpec>,
): boolean {
  const node = findByKey(spec, key);
  if (!node) return false;
  Object.assign(node.layout, updates);
  return true;
}

// ── Replace ─────────────────────────────────────────────────

/** Replace a child node by key with a new spec, preserving position in parent */
export function replaceChildByKey(
  root: ComponentSpec,
  targetKey: string,
  replacement: ComponentSpec,
): boolean {
  let replaced = false;
  walkTree(root, (node) => {
    if (node.children) {
      const idx = node.children.findIndex((c) => c.key === targetKey);
      if (idx !== -1) {
        replacement.key = targetKey;
        node.children[idx] = replacement;
        replaced = true;
      }
    }
  });
  return replaced;
}

// ── Clone ────────────────────────────────────────────────────

/** Deep clone a spec tree (for merge operations that shouldn't mutate originals) */
export function cloneSpec(spec: ComponentSpec): ComponentSpec {
  return JSON.parse(JSON.stringify(spec));
}
