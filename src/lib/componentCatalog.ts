// ============================================================
// APHANTASIA — Component Catalog
// ============================================================
// Re-exports catalog data (no engine) + placeComponent (uses engine).
// UI that doesn't need placeComponent should import from ./componentCatalogData
// to avoid circular dependency with engine.
// ============================================================

import { canvasEngine } from "@/engine";
import type { ComponentCatalogEntry } from "./componentCatalogData";

export type { ComponentCatalogEntry, ComponentKind, ComponentCategory } from "./componentCatalogData";
export {
  COMPONENT_CATALOG,
  PRIMITIVE_CATALOG,
  ALL_CATALOG_ENTRIES,
  PRIMITIVE_IDS,
  CATEGORIES,
} from "./componentCatalogData";

export function placeComponent(entry: ComponentCatalogEntry): void {
  const shapes = canvasEngine.getShapes().filter((s) => s.isInsideFrame);
  let nextY = 0;
  for (const s of shapes) {
    const bottom = s.y + s.height;
    if (bottom > nextY) nextY = bottom;
  }
  if (shapes.length > 0) nextY += 16;

  const shapeType = entry.canvasType === "roundedRect" ? "roundedRect" : "rectangle";
  const meta: Record<string, unknown> | undefined =
    entry.kind === "primitive"
      ? { componentId: entry.id }
      : entry.variant
        ? { placementVariant: entry.variant }
        : undefined;
  const created = canvasEngine.createShape({
    type: shapeType,
    x: 0,
    y: nextY,
    width: entry.defaultWidth,
    height: entry.defaultHeight,
    label: entry.label,
    semanticTag: entry.semanticTag,
    isInsideFrame: true,
    meta,
  });

  canvasEngine.deselectAll();
  canvasEngine.selectShape(created.id);
  canvasEngine.setTool("select");
}
