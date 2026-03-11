import type { CanvasDocument } from "@/engine/CanvasEngine";

export interface RenderOutput {
  html: string;
  css: string;
  js?: string;
}

// All renderers implement this interface
export interface RenderEngine {
  render(doc: CanvasDocument, context: string): Promise<RenderOutput>;
  renderPhase1(doc: CanvasDocument): RenderOutput; // Instant, no AI
  renderPhase2(doc: CanvasDocument, context: string): Promise<RenderOutput>; // AI refined
}
