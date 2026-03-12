// ============================================================
// CANVAS ENGINE PROVIDER
// This is the only place you change to swap canvas engines.
// Uncomment the engine you want to use.
// ============================================================

import {
  getTldrawEngine,
  TldrawCanvasView,
} from "./TldrawCanvasEngine";
// import { KonvaCanvasEngine } from "./KonvaCanvasEngine";
// import { ExcalidrawCanvasEngine } from "./ExcalidrawCanvasEngine";

import type { CanvasEngine } from "../CanvasEngine";

export const canvasEngine: CanvasEngine = getTldrawEngine();

export const CanvasView = TldrawCanvasView;
