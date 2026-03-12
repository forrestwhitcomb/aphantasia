"use client";

// ============================================================
// TLDRAW CANVAS ENGINE
// This is the ONLY file in the product that imports tldraw.
// Architecture rule: never import tldraw outside this file.
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { Tldraw, Editor, createShapeId, createTLStore, defaultShapeUtils } from "tldraw";
import "tldraw/tldraw.css";
import type {
  CanvasEngine,
  CanvasShape,
  CanvasDocument,
  CanvasFrame,
  CanvasEvent,
  CanvasEventHandler,
  CanvasEventType,
  ShapeType,
} from "../CanvasEngine";

// ---------------------------------------------------------------------------
// Constants — exported so consumers can reference the frame without touching tldraw
// ---------------------------------------------------------------------------

export const DESKTOP_FRAME_ID = createShapeId("desktop-frame");
export const FRAME_WIDTH = 1280;
export const FRAME_HEIGHT = 800;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract plain text from a tldraw v4 ProseMirror richText doc. */
function extractRichText(richText: any): string | undefined {
  if (!richText || typeof richText !== "object") return undefined;
  const parts: string[] = [];
  function walk(node: any) {
    if (node.text) parts.push(node.text);
    if (Array.isArray(node.content)) node.content.forEach(walk);
  }
  walk(richText);
  const result = parts.join("").trim();
  return result.length > 0 ? result : undefined;
}

// ---------------------------------------------------------------------------
// Engine implementation
// ---------------------------------------------------------------------------

export class TldrawCanvasEngine implements CanvasEngine {
  private editor: Editor | null = null;
  private handlers = new Map<CanvasEventType, Set<CanvasEventHandler>>();
  private storeCleanup: (() => void) | null = null;

  setEditor(editor: Editor) {
    this.editor = editor;
    this.initializeCanvas();
    this.wireStoreEvents();
  }

  async initialize(_container: HTMLElement, _document?: CanvasDocument) {
    // tldraw manages its own DOM via the <Tldraw /> React component.
    // The editor instance is set via setEditor() when tldraw mounts.
  }

  destroy() {
    this.storeCleanup?.();
    this.storeCleanup = null;
    this.editor = null;
    this.handlers.clear();
  }

  getDocument(): CanvasDocument {
    return {
      id: "default",
      version: 1,
      outputType: "site",
      frame: this.getFrame(),
      // Exclude the frame shape itself — it's the viewport, not a user shape
      shapes: this.getShapes().filter((s) => s.type !== "frame"),
      globalContext: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  loadDocument(_doc: CanvasDocument) {
    // TODO: deserialize CanvasDocument shapes into tldraw shapes
  }

  clearCanvas() {
    if (!this.editor) return;
    // Clear everything except the desktop frame
    const ids = [...this.editor.getCurrentPageShapeIds()].filter(
      (id) => id !== DESKTOP_FRAME_ID
    );
    if (ids.length > 0) {
      this.editor.deleteShapes(ids as any[]);
    }
  }

  getShapes(): CanvasShape[] {
    if (!this.editor) return [];
    return this.editor.getCurrentPageShapes().map((s) => this.toCanvasShape(s));
  }

  getShape(id: string): CanvasShape | undefined {
    if (!this.editor) return undefined;
    const shape = this.editor.getShape(id as any);
    return shape ? this.toCanvasShape(shape) : undefined;
  }

  createShape(shape: Omit<CanvasShape, "id">): CanvasShape {
    if (!this.editor) {
      return { ...shape, id: crypto.randomUUID() };
    }
    const id = `shape:${crypto.randomUUID()}`;
    this.editor.createShape({
      id: id as any,
      type: this.toTldrawType(shape.type) as any,
      parentId: shape.isInsideFrame ? DESKTOP_FRAME_ID : undefined,
      x: shape.x,
      y: shape.y,
      props: { w: shape.width, h: shape.height },
    });
    return { ...shape, id };
  }

  updateShape(id: string, updates: Partial<CanvasShape>) {
    if (!this.editor) return;
    const props: Record<string, unknown> = {};
    if (updates.width !== undefined) props.w = updates.width;
    if (updates.height !== undefined) props.h = updates.height;
    this.editor.updateShape({
      id: id as any,
      type: (this.editor.getShape(id as any)?.type ?? "geo") as any,
      x: updates.x,
      y: updates.y,
      props: Object.keys(props).length > 0 ? props : undefined,
    });
  }

  deleteShape(id: string) {
    if (!this.editor) return;
    this.editor.deleteShapes([id as any]);
  }

  getSelectedShapes(): CanvasShape[] {
    if (!this.editor) return [];
    return this.editor.getSelectedShapes().map((s) => this.toCanvasShape(s));
  }

  selectShape(id: string) {
    if (!this.editor) return;
    this.editor.select(id as any);
  }

  deselectAll() {
    if (!this.editor) return;
    this.editor.selectNone();
  }

  zoomToFit() {
    if (!this.editor) return;
    this.editor.zoomToFit();
  }

  zoomToShape(id: string) {
    if (!this.editor) return;
    const shape = this.editor.getShape(id as any);
    if (shape) {
      this.editor.select(id as any);
      this.editor.zoomToSelection();
    }
  }

  setZoom(level: number) {
    if (!this.editor) return;
    const { x, y } = this.editor.getCamera();
    this.editor.setCamera({ x, y, z: level } as any);
  }

  createShapesFromSemanticMap(shapes: Omit<CanvasShape, "id">[]): CanvasShape[] {
    return shapes.map((s) => this.createShape(s));
  }

  on(event: CanvasEventType, handler: CanvasEventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: CanvasEventType, handler: CanvasEventHandler) {
    this.handlers.get(event)?.delete(handler);
  }

  serialize(): string {
    if (!this.editor) return "{}";
    return JSON.stringify((this.editor.store as any).getSnapshot());
  }

  deserialize(data: string) {
    if (!this.editor) return;
    try {
      const snapshot = JSON.parse(data);
      (this.editor.store as any).loadSnapshot(snapshot);
    } catch {
      // invalid data — ignore
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /** Drop the desktop viewport frame on a fresh canvas, then zoom to fit. */
  private initializeCanvas() {
    if (!this.editor) return;
    if (this.editor.getCurrentPageShapes().length > 0) return;

    this.editor.createShape({
      id: DESKTOP_FRAME_ID,
      type: "frame",
      x: 0,
      y: 0,
      props: { w: FRAME_WIDTH, h: FRAME_HEIGHT, name: "Page" },
    });

    requestAnimationFrame(() => {
      this.editor?.zoomToFit({ animation: { duration: 200 } });
    });
  }

  /** Subscribe to document changes (shapes only, not camera/selection). */
  private wireStoreEvents() {
    if (!this.editor) return;
    const cleanup = this.editor.store.listen(
      () => this.emit({ type: "canvas:changed" }),
      { scope: "document" }
    );
    this.storeCleanup = cleanup;
  }

  private emit(event: CanvasEvent) {
    this.handlers.get(event.type)?.forEach((h) => h(event));
  }

  private getFrame(): CanvasFrame {
    const shape = this.editor?.getShape(DESKTOP_FRAME_ID);
    if (!shape) return this.getDefaultFrame();
    return {
      id: String(DESKTOP_FRAME_ID),
      type: "desktop",
      width: (shape.props as any).w ?? FRAME_WIDTH,
      height: (shape.props as any).h ?? FRAME_HEIGHT,
      x: shape.x,
      y: shape.y,
    };
  }

  private getDefaultFrame(): CanvasFrame {
    return {
      id: String(DESKTOP_FRAME_ID),
      type: "desktop",
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
      x: 0,
      y: 0,
    };
  }

  private toCanvasShape(shape: any): CanvasShape {
    const bounds = this.editor?.getShapeGeometry(shape)?.bounds;
    // tldraw v4: geo/note shapes store text as richText (ProseMirror doc)
    const text = extractRichText(shape.props?.richText)
      ?? shape.props?.text
      ?? shape.props?.name
      ?? undefined;
    return {
      id: shape.id,
      type: this.fromTldrawType(shape.type),
      x: shape.x ?? 0,
      y: shape.y ?? 0,
      width: bounds?.width ?? shape.props?.w ?? 100,
      height: bounds?.height ?? shape.props?.h ?? 100,
      label: text,
      content: text,
      semanticTag: "unknown",
      // A shape is inside the frame when tldraw makes the frame its parent
      isInsideFrame: shape.parentId === DESKTOP_FRAME_ID,
      meta: shape.meta,
    };
  }

  private toTldrawType(type: ShapeType): string {
    switch (type) {
      case "rectangle": return "geo";
      case "oval":      return "geo";
      case "text":      return "text";
      case "arrow":     return "arrow";
      case "sticky":    return "note";
      case "frame":     return "frame";
      default:          return "geo";
    }
  }

  private fromTldrawType(type: string): ShapeType {
    switch (type) {
      case "geo":   return "rectangle";
      case "text":  return "text";
      case "arrow": return "arrow";
      case "note":  return "sticky";
      case "frame": return "frame";
      default:      return "rectangle";
    }
  }
}

// ---------------------------------------------------------------------------
// Singleton engine instance
// ---------------------------------------------------------------------------

let engineInstance: TldrawCanvasEngine | null = null;

export function getTldrawEngine(): TldrawCanvasEngine {
  if (!engineInstance) {
    engineInstance = new TldrawCanvasEngine();
  }
  return engineInstance;
}

// ---------------------------------------------------------------------------
// React component — renders the tldraw canvas and wires up the engine
// ---------------------------------------------------------------------------

export function TldrawCanvasView() {
  const engineRef = useRef(getTldrawEngine());

  const handleMount = useCallback((editor: Editor) => {
    engineRef.current.setEditor(editor);
    // Dev helper: exposes engine for console testing
    if (typeof window !== "undefined") {
      (window as any).__aphEngine = engineRef.current;
      (window as any).__tldrawEditor = editor;
    }
  }, []);

  useEffect(() => {
    return () => {
      engineRef.current.destroy();
    };
  }, []);

  // Fresh in-memory store on every mount — no built-in persistence.
  // Aphantasia manages its own persistence (localStorage v1, Supabase v1.5).
  const [store] = useState(() => createTLStore({ shapeUtils: defaultShapeUtils }));

  return (
    <div className="w-full h-full">
      <Tldraw
        licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
        store={store}
        onMount={handleMount}
        autoFocus
      />
    </div>
  );
}
