// ============================================================
// Aphantasia/System — AI Patch Validation & Application
// ============================================================

import type { EditorState, EditorAction, SpecNode } from "../types";
import { REGISTRY } from "../registry";
import type { SpecNodePatch } from "./service";

// ── Validation ──────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function findNodeInState(state: EditorState, nodeId: string): SpecNode | null {
  for (const screen of state.project.screens) {
    const found = findInNode(screen.root, nodeId);
    if (found) return found;
  }
  return null;
}

function findInNode(node: SpecNode, id: string): SpecNode | null {
  if (node.id === id) return node;
  for (const c of node.children) {
    const found = findInNode(c, id);
    if (found) return found;
  }
  return null;
}

function validateSpecNode(node: SpecNode, errors: string[]): void {
  if (node.type !== "__root" && node.type !== "__row") {
    if (!REGISTRY[node.type]) {
      errors.push(`Unknown component type: ${node.type}`);
    } else if (node.variant && !REGISTRY[node.type].variants[node.variant]) {
      errors.push(`Invalid variant "${node.variant}" for type "${node.type}"`);
    }
  }
  for (const child of node.children) {
    validateSpecNode(child, errors);
  }
}

export function validatePatch(patch: SpecNodePatch, state: EditorState): ValidationResult {
  const errors: string[] = [];

  switch (patch.op) {
    case "add": {
      if (!findNodeInState(state, patch.parentId)) {
        errors.push(`Parent node "${patch.parentId}" not found`);
      }
      validateSpecNode(patch.node, errors);
      break;
    }
    case "replace": {
      if (!findNodeInState(state, patch.nodeId)) {
        errors.push(`Node "${patch.nodeId}" not found for replace`);
      }
      validateSpecNode(patch.node, errors);
      break;
    }
    case "update": {
      if (!findNodeInState(state, patch.nodeId)) {
        errors.push(`Node "${patch.nodeId}" not found for update`);
      }
      break;
    }
    case "delete": {
      if (!findNodeInState(state, patch.nodeId)) {
        errors.push(`Node "${patch.nodeId}" not found for delete`);
      }
      break;
    }
    case "reorder": {
      if (!findNodeInState(state, patch.nodeId)) {
        errors.push(`Node "${patch.nodeId}" not found for reorder`);
      }
      break;
    }
    case "updateTokens":
      break;
  }

  return { valid: errors.length === 0, errors };
}

// ── Apply patches → EditorActions ───────────────────────────

export function applyPatches(
  patches: SpecNodePatch[],
  state: EditorState,
): { actions: EditorAction[]; errors: string[] } {
  const actions: EditorAction[] = [];
  const errors: string[] = [];

  // Sort: deletes first (to avoid stale refs), then reorders, then updates, then adds
  const sorted = [...patches].sort((a, b) => {
    const order: Record<SpecNodePatch["op"], number> = {
      delete: 0,
      reorder: 1,
      update: 2,
      updateTokens: 3,
      replace: 4,
      add: 5,
    };
    return order[a.op] - order[b.op];
  });

  for (const patch of sorted) {
    const result = validatePatch(patch, state);
    if (!result.valid) {
      errors.push(...result.errors);
      continue;
    }

    switch (patch.op) {
      case "add":
        actions.push({
          type: "ADD_COMPONENT",
          screenId: state.activeScreenId,
          node: patch.node,
        });
        break;

      case "replace": {
        // Delete old, then add replacement — but for simplicity, use UPDATE_NODE
        // to replace the entire node's props and children via the tree updater.
        // Actually, the simplest approach: delete then re-add won't preserve position.
        // Use UPDATE_NODE for props, then handle children separately.
        // For now: map to UPDATE_NODE with the new node's props.
        // A full "replace" could be a SWAP_VARIANT + UPDATE_NODE combo.
        const existing = findNodeInState(state, patch.nodeId);
        if (existing && patch.node.variant !== existing.variant) {
          actions.push({ type: "SWAP_VARIANT", id: patch.nodeId, variant: patch.node.variant ?? "" });
        }
        actions.push({
          type: "UPDATE_NODE",
          id: patch.nodeId,
          props: patch.node.props,
        });
        break;
      }

      case "update":
        actions.push({
          type: "UPDATE_NODE",
          id: patch.nodeId,
          props: patch.props,
        });
        break;

      case "delete":
        actions.push({ type: "DELETE_NODE", id: patch.nodeId });
        break;

      case "reorder": {
        // Find the node's parent to get targetParentId
        const parentId = findParentId(state, patch.nodeId);
        if (parentId) {
          actions.push({
            type: "REORDER_NODE",
            nodeId: patch.nodeId,
            targetParentId: parentId,
            insertIndex: patch.newIndex,
          });
        } else {
          errors.push(`Could not find parent for node "${patch.nodeId}"`);
        }
        break;
      }

      case "updateTokens":
        actions.push({ type: "SET_TOKENS", tokens: { ...state.tokens, ...patch.tokens } });
        break;
    }
  }

  return { actions, errors };
}

// ── Helpers ─────────────────────────────────────────────────

function findParentId(state: EditorState, nodeId: string): string | null {
  for (const screen of state.project.screens) {
    const parentId = findParentInNode(screen.root, nodeId);
    if (parentId) return parentId;
  }
  return null;
}

function findParentInNode(node: SpecNode, targetId: string): string | null {
  for (const child of node.children) {
    if (child.id === targetId) return node.id;
    const found = findParentInNode(child, targetId);
    if (found) return found;
  }
  return null;
}
