// ============================================================
// APHANTASIA — CanvasEngine Abstraction Layer
// ============================================================
// NOTHING in the product imports tldraw directly.
// All canvas interactions go through this interface.
// To swap canvas engines: implement this interface, change
// one import in provider.ts. Everything else is untouched.
// ============================================================

export type ShapeType =
  | "rectangle"
  | "roundedRect"
  | "text"
  | "note"
  | "image"
  | "oval"
  | "arrow"
  | "sticky"
  | "agent"
  | "frame";

export type CanvasTool = "select" | "rectangle" | "roundedRect" | "text" | "note" | "frame";

export type SemanticTag =
  | "hero"
  | "nav"
  | "section"
  | "cards"
  | "button"
  | "image"
  | "footer"
  | "text-block"
  | "split"
  | "form"
  | "portfolio"
  | "ecommerce"
  | "pricing"
  | "testimonials"
  | "logo-cloud"
  | "stats"
  | "newsletter"
  | "faq"
  | "team"
  | "comparison"
  // ── Mobile-specific tags ──
  | "search-bar"
  | "section-header"
  | "profile-header"
  | "stats-row"
  | "segmented-control"
  | "fab"
  | "bottom-sheet"
  | "modal"
  | "toast"
  | "media-cell"
  | "empty-state"
  | "status-bar"
  | "home-indicator"
  // ── Meta tags ──
  | "scratchpad"
  | "context-note"
  | "page-candidate"
  | "unknown";

export interface CanvasShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  content?: string;
  semanticTag?: SemanticTag;
  isInsideFrame: boolean;
  contextNote?: string;
  linkedNoteIds?: string[];
  linkedImageIds?: string[];
  linkedShapeId?: string;
  isSuggestion?: boolean;
  meta?: Record<string, unknown>;
}

export interface CanvasFrame {
  id: string;
  type: "desktop" | "mobile" | "tablet" | "slide";
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface CanvasDocument {
  id: string;
  version: number;
  outputType: "site" | "slides" | "doodles" | "ui";
  frame: CanvasFrame;
  frames: CanvasFrame[];
  activeFrameId: string;
  shapes: CanvasShape[];
  globalContext: string;
  createdAt: string;
  updatedAt: string;
}

export type CanvasEventType =
  | "shape:created"
  | "shape:updated"
  | "shape:deleted"
  | "shape:selected"
  | "shape:deselected"
  | "canvas:changed"
  | "canvas:saved"
  | "render:requested"
  | "render:deep-requested";

export interface CanvasEvent {
  type: CanvasEventType;
  shapeId?: string;
  shape?: CanvasShape;
}

export type CanvasEventHandler = (event: CanvasEvent) => void;

export interface CanvasEngine {
  initialize(container: HTMLElement, document?: CanvasDocument): Promise<void>;
  destroy(): void;
  getDocument(): CanvasDocument;
  loadDocument(doc: CanvasDocument): void;
  clearCanvas(): void;
  getShapes(): CanvasShape[];
  getShape(id: string): CanvasShape | undefined;
  createShape(shape: Omit<CanvasShape, "id">): CanvasShape;
  updateShape(id: string, updates: Partial<CanvasShape>): void;
  deleteShape(id: string): void;
  getSelectedShapes(): CanvasShape[];
  selectShape(id: string): void;
  deselectAll(): void;
  zoomToFit(): void;
  zoomToShape(id: string): void;
  setZoom(level: number): void;
  createShapesFromSemanticMap(shapes: Omit<CanvasShape, "id">[]): CanvasShape[];
  on(event: CanvasEventType, handler: CanvasEventHandler): void;
  off(event: CanvasEventType, handler: CanvasEventHandler): void;
  serialize(): string;
  deserialize(data: string): void;
  setTool(tool: CanvasTool): void;
  getTool(): CanvasTool;
  requestRender(): void;
  requestDeepRender(): void;
}
