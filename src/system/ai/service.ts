// ============================================================
// Aphantasia/System — AI Service (Client-side)
// ============================================================

import type { SpecNode, Screen } from "../types";

// ── Request / Response types ────────────────────────────────

export interface AIRequest {
  mode: "chat" | "annotation";
  message: string;
  context: {
    activeScreen: Screen;
    selectedNode?: SpecNode;
    tokens: Record<string, string>;
    registry: string[];
    projectScreenNames: string[];
  };
}

export interface AIResponse {
  explanation: string;
  patches: SpecNodePatch[];
}

export type SpecNodePatch =
  | { op: "add"; parentId: string; index: number; node: SpecNode }
  | { op: "replace"; nodeId: string; node: SpecNode }
  | { op: "update"; nodeId: string; props: Record<string, unknown> }
  | { op: "delete"; nodeId: string }
  | { op: "reorder"; nodeId: string; newIndex: number }
  | { op: "updateTokens"; tokens: Record<string, string> };

// ── Serialize a SpecNode tree for prompt context ────────────

interface SerializedNode {
  id: string;
  type: string;
  variant: string | null;
  props: Record<string, unknown>;
  children: SerializedNode[];
}

export function serializeSpecTree(node: SpecNode): SerializedNode {
  return {
    id: node.id,
    type: node.type,
    variant: node.variant,
    props: node.props,
    children: node.children.map(serializeSpecTree),
  };
}

// ── API call ────────────────────────────────────────────────

export async function callAI(request: AIRequest): Promise<AIResponse> {
  const res = await fetch("/system/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI request failed (${res.status}): ${err}`);
  }

  return res.json();
}
