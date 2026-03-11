import type { SemanticTag, ShapeType } from "@/engine/CanvasEngine";

// Shape-to-component mapping table
// Rules engine reads this to assign semantic tags
export const vocabularyRules: {
  conditions: { type?: ShapeType; aspectRatio?: string; position?: string };
  tag: SemanticTag;
}[] = [
  { conditions: { type: "rectangle", position: "top", aspectRatio: "wide" }, tag: "hero" },
  { conditions: { type: "rectangle", position: "top", aspectRatio: "narrow-height" }, tag: "nav" },
  { conditions: { type: "rectangle", position: "bottom" }, tag: "footer" },
  { conditions: { type: "oval" }, tag: "image" },
  // TODO: expand with full vocabulary in Phase 1
];
