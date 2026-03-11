// ============================================================
// CANVAS ENGINE PROVIDER
// This is the only place you change to swap canvas engines.
// Uncomment the engine you want to use.
// ============================================================

// import { TldrawCanvasEngine } from "./TldrawCanvasEngine";
// import { KonvaCanvasEngine } from "./KonvaCanvasEngine";
// import { ExcalidrawCanvasEngine } from "./ExcalidrawCanvasEngine";

// TODO: Replace with real implementation once tldraw license confirmed
import type { CanvasEngine } from "../CanvasEngine";

class StubCanvasEngine implements CanvasEngine {
  async initialize() {}
  destroy() {}
  getDocument(): any { return null; }
  loadDocument() {}
  clearCanvas() {}
  getShapes() { return []; }
  getShape() { return undefined; }
  createShape(s: any) { return { ...s, id: crypto.randomUUID() }; }
  updateShape() {}
  deleteShape() {}
  getSelectedShapes() { return []; }
  selectShape() {}
  deselectAll() {}
  zoomToFit() {}
  zoomToShape() {}
  setZoom() {}
  createShapesFromSemanticMap(shapes: any[]) { return shapes.map(s => ({ ...s, id: crypto.randomUUID() })); }
  on() {}
  off() {}
  serialize() { return "{}"; }
  deserialize() {}
}

export const canvasEngine: CanvasEngine = new StubCanvasEngine();
