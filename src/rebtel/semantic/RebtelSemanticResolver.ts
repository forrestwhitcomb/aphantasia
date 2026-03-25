// ============================================================
// APHANTASIA for REBTEL — Semantic Resolver
// ============================================================
// Wraps the base UISemanticResolver with Rebtel-specific label
// rules. Rebtel rules run FIRST (highest priority), then the
// generic resolver handles remaining shapes.
// ============================================================

import type { CanvasShape } from "@/engine/CanvasEngine";
import type { UIResolvedComponent } from "@/ui-mode/types";
import { resolveUIComponents } from "@/ui-mode/semantic/UISemanticResolver";
import { resolveRebtelLabel } from "./rebtelRules";
import { isAllRebtelType } from "../types";

/**
 * Resolve canvas shapes into Rebtel components.
 * 1. Check shape.meta.uiComponentType for manual overrides
 * 2. Try Rebtel domain-specific label rules
 * 3. Fall back to generic UI semantic resolver
 */
export function resolveRebtelComponents(
  shapes: CanvasShape[],
  frameWidth: number,
  frameHeight: number
): UIResolvedComponent[] {
  // First pass: resolve all shapes using the base resolver
  const resolved = resolveUIComponents(shapes, frameWidth, frameHeight);

  // Second pass: apply Rebtel label rules on top
  // Only override if:
  //   - The shape has a label that matches a Rebtel domain rule
  //   - The shape wasn't manually tagged (meta.uiComponentType)
  for (const comp of resolved) {
    // Skip manually tagged components
    const shape = shapes.find(s => s.id === comp.shapeId);
    if (shape?.meta?.uiComponentType && isAllRebtelType(shape.meta.uiComponentType as string)) {
      // Manual override — use it directly
      comp.type = shape.meta.uiComponentType as any;
      continue;
    }

    // Try Rebtel label rules
    if (comp.label) {
      const rebtelType = resolveRebtelLabel(comp.label);
      if (rebtelType) {
        comp.type = rebtelType as any;
      }
    }
  }

  return resolved;
}
