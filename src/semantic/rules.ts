import type { CanvasShape, SemanticTag } from "@/engine/CanvasEngine";

// Rules-based base semantic resolver — fast, deterministic, no AI
export function resolveSemanticTag(
  shape: CanvasShape,
  frameHeight: number
): SemanticTag {
  if (!shape.isInsideFrame) {
    return shape.label?.toLowerCase().includes("context")
      ? "context-note"
      : "scratchpad";
  }
  // TODO: implement full rules in Phase 1
  return "unknown";
}
