// ============================================================
// APHANTASIA — Component Catalog
// ============================================================
// Static catalog of insertable section components.
// Each entry maps 1:1 to an existing section renderer.
// Used by ComponentBrowser to let users insert pre-configured
// shapes onto the canvas.
// ============================================================

import type { SemanticTag } from "@/engine/CanvasEngine";
import { canvasEngine } from "@/engine";
import { FRAME_WIDTH } from "@/engine/engines/CustomCanvasEngine";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ComponentCategory = "layout" | "content" | "commerce" | "utility";

export interface ComponentCatalogEntry {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  semanticTag: SemanticTag;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
  iconPath: string; // SVG path data (24x24 viewBox)
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export const COMPONENT_CATALOG: ComponentCatalogEntry[] = [
  {
    id: "nav",
    name: "Navigation",
    description: "Header bar with logo, links & CTA",
    category: "layout",
    semanticTag: "nav",
    label: "Nav",
    defaultWidth: FRAME_WIDTH,
    defaultHeight: 64,
    iconPath: "M3 6h18M3 12h18M3 18h18", // hamburger/menu
  },
  {
    id: "hero",
    name: "Hero Banner",
    description: "Large headline section with call to action",
    category: "layout",
    semanticTag: "hero",
    label: "Hero",
    defaultWidth: FRAME_WIDTH,
    defaultHeight: 400,
    iconPath: "M4 4h16v12H4zM8 20h8", // monitor/banner
  },
  {
    id: "feature-grid",
    name: "Feature Grid",
    description: "Card grid showcasing features or benefits",
    category: "content",
    semanticTag: "cards",
    label: "Features",
    defaultWidth: FRAME_WIDTH,
    defaultHeight: 360,
    iconPath: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z", // grid
  },
  {
    id: "text-image",
    name: "Text + Image",
    description: "Two-column split with text and image",
    category: "content",
    semanticTag: "split",
    label: "Split",
    defaultWidth: FRAME_WIDTH,
    defaultHeight: 320,
    iconPath: "M4 4h7v16H4zM13 4h7v16h-7z", // two columns
  },
  {
    id: "cta",
    name: "Call to Action",
    description: "Prominent CTA section with dark background",
    category: "content",
    semanticTag: "button",
    label: "CTA",
    defaultWidth: FRAME_WIDTH,
    defaultHeight: 200,
    iconPath: "M5 12h14M12 5l7 7-7 7", // arrow right
  },
  {
    id: "generic",
    name: "Text Section",
    description: "Simple text block with optional button",
    category: "content",
    semanticTag: "section",
    label: "Section",
    defaultWidth: FRAME_WIDTH,
    defaultHeight: 240,
    iconPath: "M4 6h16M4 10h12M4 14h14M4 18h10", // text lines
  },
  {
    id: "footer",
    name: "Footer",
    description: "Page footer with links and copyright",
    category: "layout",
    semanticTag: "footer",
    label: "Footer",
    defaultWidth: FRAME_WIDTH,
    defaultHeight: 160,
    iconPath: "M4 20h16M4 16h16M8 12h8", // bottom-aligned lines
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Project showcase grid with thumbnails",
    category: "content",
    semanticTag: "portfolio",
    label: "Portfolio",
    defaultWidth: FRAME_WIDTH,
    defaultHeight: 360,
    iconPath: "M4 4h16v10H4zM4 16h5v4H4zM11 16h5v4h-5z", // gallery
  },
  {
    id: "ecommerce",
    name: "Product Grid",
    description: "E-commerce product catalog with prices",
    category: "commerce",
    semanticTag: "ecommerce",
    label: "Shop",
    defaultWidth: FRAME_WIDTH,
    defaultHeight: 360,
    iconPath: "M6 2L3 8v12a1 1 0 001 1h16a1 1 0 001-1V8l-3-6H6zM3 8h18M16 12a4 4 0 01-8 0", // shopping bag
  },
  {
    id: "event-signup",
    name: "Event Signup",
    description: "Event details with registration form",
    category: "utility",
    semanticTag: "form",
    label: "Event",
    defaultWidth: FRAME_WIDTH,
    defaultHeight: 300,
    iconPath: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z", // calendar
  },
];

// ---------------------------------------------------------------------------
// Categories for the filter UI
// ---------------------------------------------------------------------------

export const CATEGORIES: { id: ComponentCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "layout", label: "Layout" },
  { id: "content", label: "Content" },
  { id: "commerce", label: "Commerce" },
  { id: "utility", label: "Utility" },
];

// ---------------------------------------------------------------------------
// placeComponent — creates a shape on the canvas from a catalog entry
// ---------------------------------------------------------------------------

export function placeComponent(entry: ComponentCatalogEntry): void {
  const shapes = canvasEngine.getShapes().filter((s) => s.isInsideFrame);

  // Find the bottom edge of the lowest existing shape
  let nextY = 0;
  for (const s of shapes) {
    const bottom = s.y + s.height;
    if (bottom > nextY) nextY = bottom;
  }
  // Add a gap below the last shape (or start at 0 for empty frame)
  if (shapes.length > 0) nextY += 16;

  const created = canvasEngine.createShape({
    type: "rectangle",
    x: 0,
    y: nextY,
    width: entry.defaultWidth,
    height: entry.defaultHeight,
    label: entry.label,
    semanticTag: entry.semanticTag,
    isInsideFrame: true,
  });

  canvasEngine.deselectAll();
  canvasEngine.selectShape(created.id);
  canvasEngine.setTool("select");
}
