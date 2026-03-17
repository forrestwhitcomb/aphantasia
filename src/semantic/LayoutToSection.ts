// ============================================================
// APHANTASIA — Layout-to-Section Inference
// ============================================================
// Context-based inference: given ordered in-frame shapes,
// suggest section type when tag is generic or unknown.
// Reduces hard-coding "tag → section" by using position and size.
// ============================================================

import type { CanvasShape } from "@/engine/CanvasEngine";
import type { SectionContent } from "@/types/render";

export type InferredSectionType = SectionContent["type"];

/**
 * Infer section type from layout context (order, position, size).
 * Only suggests when semanticTag is "section" or "unknown".
 * Returns a map of shapeId → suggested section type.
 */
export function inferSectionFromContext(
  orderedShapes: CanvasShape[],
  frameWidth: number,
  frameHeight: number
): Map<string, InferredSectionType> {
  const result = new Map<string, InferredSectionType>();
  if (orderedShapes.length === 0) return result;

  for (let i = 0; i < orderedShapes.length; i++) {
    const s = orderedShapes[i];
    const tag = s.semanticTag ?? "unknown";
    if (tag !== "section" && tag !== "unknown") continue;
    if (s.meta?._consumed) continue;

    const isFirst = i === 0;
    const isLast = i === orderedShapes.length - 1;
    const widthRatio = s.width / frameWidth;
    const heightRatio = s.height / frameHeight;
    const yRatio = s.y / frameHeight;
    const isWide = widthRatio > 0.5;
    const isShort = heightRatio < 0.12;
    const isTall = heightRatio > 0.2;

    // First block, wide, and reasonably tall → likely hero (unless very short = nav)
    if (isFirst && isWide) {
      if (isShort) result.set(s.id, "nav");
      else result.set(s.id, "hero");
      continue;
    }

    // Last block, wide → likely footer
    if (isLast && isWide) {
      result.set(s.id, "footer");
      continue;
    }

    // Second block after a hero-sized first → often CTA or feature grid; leave as generic or keep section
    // Bottom 25% of frame, wide → CTA
    if (yRatio > 0.65 && isWide && isTall) {
      result.set(s.id, "cta");
      continue;
    }

    // Default: leave as generic (no entry in map, shapeToSection will use "generic")
  }

  return result;
}
