import type { CanvasDocument } from "@/engine/CanvasEngine";
import { resolveSemanticTag } from "./rules";

// Hybrid resolver: rules first (Phase 1), AI refines (Phase 2+)
export async function resolveSemantics(doc: CanvasDocument): Promise<CanvasDocument> {
  const resolvedShapes = doc.shapes.map((shape) => ({
    ...shape,
    semanticTag: resolveSemanticTag(shape, doc.frame.width, doc.frame.height),
  }));
  // TODO: Phase 3 — pass ambiguous shapes to AI for refinement
  return { ...doc, shapes: resolvedShapes };
}
