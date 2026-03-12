// ============================================================
// CANVAS ENGINE PROVIDER
// This is the only place you change to swap canvas engines.
// ============================================================

import {
  getCustomEngine,
  CustomCanvasView,
} from "./CustomCanvasEngine";

import type { CanvasEngine } from "../CanvasEngine";

export const canvasEngine: CanvasEngine = getCustomEngine();

export const CanvasView = CustomCanvasView;
