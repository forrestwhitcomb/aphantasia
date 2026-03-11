// Hybrid resolver: rules first, AI refines when needed
import type { CanvasShape, CanvasDocument } from "@/engine/CanvasEngine";
import { resolveSemanticTag } from "./rules";

export async function resolveSemantics(doc: CanvasDocument): Promise<CanvasDocument> {
  const resolvedShapes = doc.shapes.map((shape) => ({
    ...shape,
    semanticTag: resolveSemanticTag(shape, doc.frame.height),
  }));
  // TODO: Phase 3 — pass ambiguous shapes to AI for refinement
  return { ...doc, shapes: resolvedShapes };
}
