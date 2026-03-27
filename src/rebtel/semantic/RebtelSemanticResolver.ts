// ============================================================
// APHANTASIA for REBTEL — Semantic Resolver
// ============================================================
// Wraps the base UISemanticResolver with Rebtel-specific label
// rules. Resolution order:
//   1. Manual override (meta.uiComponentType)
//   2. Figma registry lookup by shape label
//   3. Label regex rules
//   4. Base UI resolver fallback
// ============================================================

import type { CanvasShape } from "@/engine/CanvasEngine";
import type { UIResolvedComponent } from "@/ui-mode/types";
import { resolveUIComponents } from "@/ui-mode/semantic/UISemanticResolver";
import { resolveRebtelLabel } from "./rebtelRules";
import { isAllRebtelType } from "../types";
import { lookupByName } from "../figmaRegistry";
import { rebtelDesignStore } from "../store/RebtelDesignStore";

export function resolveRebtelComponents(
  shapes: CanvasShape[],
  frameWidth: number,
  frameHeight: number
): UIResolvedComponent[] {
  const resolved = resolveUIComponents(shapes, frameWidth, frameHeight);
  const registry = rebtelDesignStore.getRegistry();

  for (const comp of resolved) {
    const shape = shapes.find(s => s.id === comp.shapeId);

    // 1. Manual override via meta.uiComponentType
    //    This is how applyFlowToCanvas() sets components — always honoured.
    if (shape?.meta?.uiComponentType && isAllRebtelType(shape.meta.uiComponentType as string)) {
      comp.type = shape.meta.uiComponentType as any;
      // Attach registry entry if a figmaComponentId is also in meta
      if (shape.meta?.figmaComponentId && registry.length > 0) {
        const entry = registry.find(e => e.figmaId === shape.meta!.figmaComponentId);
        if (entry && !(shape.meta as any).figmaComponentEntry) {
          (shape.meta as any).figmaComponentEntry = entry;
        }
      }
      continue;
    }

    // 2. Figma registry lookup by shape label
    //    Catches drawn shapes whose label matches a real Figma component name.
    if (registry.length > 0 && comp.label) {
      const entry = lookupByName(registry, comp.label);
      if (entry && isAllRebtelType(entry.aphantasiaType)) {
        comp.type = entry.aphantasiaType as any;
        if (shape?.meta) {
          (shape.meta as any).figmaComponentId = entry.figmaId;
          (shape.meta as any).figmaComponentEntry = entry;
        }
        continue;
      }
    }

    // 3. Label regex rules (existing behaviour)
    if (comp.label) {
      const rebtelType = resolveRebtelLabel(comp.label);
      if (rebtelType) {
        comp.type = rebtelType as any;
      }
    }
  }

  return resolved;
}
