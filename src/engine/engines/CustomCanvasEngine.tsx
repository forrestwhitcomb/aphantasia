"use client";

// ============================================================
// CUSTOM CANVAS ENGINE
// Lightweight DOM-based canvas — no external dependencies.
// Implements the CanvasEngine interface with pan, zoom, draw,
// select, move, resize, and inline label editing.
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import type {
  CanvasEngine,
  CanvasShape,
  CanvasDocument,
  CanvasFrame,
  CanvasEvent,
  CanvasEventHandler,
  CanvasEventType,
  ShapeType,
  CanvasTool,
} from "../CanvasEngine";
import { CanvasContextWidget } from "@/components/CanvasContextWidget";
import { CanvasReferenceWidget } from "@/components/CanvasReferenceWidget";
import { ReferencePanel } from "@/ui-mode/reference/ReferencePanel";
import { ShapeTagDropdown } from "@/components/ShapeTagDropdown";
import { UIShapeTagDropdown } from "@/ui-mode/canvas/UIShapeTagDropdown";
import type { ComponentCatalogEntry } from "@/lib/componentCatalogData";
import type { UIComponentType } from "@/ui-mode/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const FRAME_WIDTH = 1280;
export const FRAME_HEIGHT = 800;
const DESKTOP_FRAME_ID = "frame:desktop";
export const MOBILE_FRAME_WIDTH = 393;
export const MOBILE_FRAME_HEIGHT = 852;
const MOBILE_FRAME_ID = "frame:mobile-ui";
const MIN_SHAPE_SIZE = 10;
const MIN_RESIZE = 20;

/** Canvas note shapes: `sticky` is normalized to `note` on load — treated the same everywhere. */
function isNoteShape(t: string): boolean {
  return t === "note" || t === "sticky";
}

// ---------------------------------------------------------------------------
// Engine implementation
// ---------------------------------------------------------------------------

interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export class CustomCanvasEngine implements CanvasEngine {
  private shapes = new Map<string, CanvasShape>();
  private selectedIds = new Set<string>();
  private frames: CanvasFrame[] = [{
    id: DESKTOP_FRAME_ID,
    type: "desktop",
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    x: 0,
    y: 0,
  }];
  private activeFrameId: string = DESKTOP_FRAME_ID;
  private handlers = new Map<CanvasEventType, Set<CanvasEventHandler>>();
  private ver = 0;
  private _outputType: "site" | "slides" | "doodles" | "ui" = "site";
  private _tool: CanvasTool = "select";
  private _clipboard: CanvasShape[] = [];
  camera: Camera = { x: 0, y: 0, zoom: 1 };
  onStateChange: (() => void) | null = null;

  // -- Frame helpers (private) -----------------------------------------------

  private get activeFrame(): CanvasFrame {
    return this.frames.find((f) => f.id === this.activeFrameId) ?? this.frames[0];
  }

  // Legacy getter — returns active frame
  private get frame(): CanvasFrame {
    return this.activeFrame;
  }

  // -- Lifecycle ------------------------------------------------------------

  async initialize(_container: HTMLElement, doc?: CanvasDocument) {
    if (doc) this.loadDocument(doc);
  }

  destroy() {
    this.shapes.clear();
    this.selectedIds.clear();
    this.handlers.clear();
    this.onStateChange = null;
  }

  // -- Output type ----------------------------------------------------------

  setOutputType(type: "site" | "slides" | "doodles" | "ui") {
    this._outputType = type;
    this.changed();
  }

  /** Switch to UI mode: clear shapes, set iPhone 17 frame, re-center camera. */
  initMobileUIFrame() {
    this.shapes.clear();
    this.selectedIds.clear();
    this.selectedFrameId = null;
    this.frames = [{
      id: MOBILE_FRAME_ID,
      type: "mobile",
      width: MOBILE_FRAME_WIDTH,
      height: MOBILE_FRAME_HEIGHT,
      x: 0,
      y: 0,
    }];
    this.activeFrameId = MOBILE_FRAME_ID;
    this._outputType = "ui";
    this.zoomToFit();
    this.changed();
  }

  /** Restore default desktop frame when leaving UI mode. */
  restoreDesktopFrame() {
    this.shapes.clear();
    this.selectedIds.clear();
    this.selectedFrameId = null;
    this.frames = [{
      id: DESKTOP_FRAME_ID,
      type: "desktop",
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
      x: 0,
      y: 0,
    }];
    this.activeFrameId = DESKTOP_FRAME_ID;
    this._outputType = "site";
    this.zoomToFit();
    this.changed();
  }

  // -- Tool -----------------------------------------------------------------

  setTool(tool: CanvasTool) {
    this._tool = tool;
    this.onStateChange?.();
  }

  getTool(): CanvasTool {
    return this._tool;
  }

  requestRender(): void {
    this.emit({ type: "render:requested" });
  }

  requestDeepRender(): void {
    this.emit({ type: "render:deep-requested" });
  }

  // -- Copy / Paste --------------------------------------------------------

  copySelected() {
    this._clipboard = this.getSelectedShapes().map((s) => ({ ...s }));
  }

  paste() {
    if (this._clipboard.length === 0) return;
    const offset = 20;
    const newIds: string[] = [];
    for (const s of this._clipboard) {
      const created = this.createShape({
        ...s,
        x: s.x + offset,
        y: s.y + offset,
      });
      newIds.push(created.id);
    }
    // Select the pasted shapes
    this.selectedIds.clear();
    this.selectedFrameId = null;
    for (const id of newIds) this.selectedIds.add(id);
    // Update clipboard offset for repeated paste
    this._clipboard = this._clipboard.map((s) => ({ ...s, x: s.x + offset, y: s.y + offset }));
    this.onStateChange?.();
  }

  // -- Note linking --------------------------------------------------------

  linkNoteToShape(noteId: string, shapeId: string) {
    const note = this.shapes.get(noteId);
    const shape = this.shapes.get(shapeId);
    if (!note || !shape || !isNoteShape(note.type)) return;
    // Update note with linked shape
    this.shapes.set(noteId, { ...note, linkedShapeId: shapeId });
    // Update shape with linked note
    const existingNotes = shape.linkedNoteIds ?? [];
    if (!existingNotes.includes(noteId)) {
      this.shapes.set(shapeId, {
        ...shape,
        linkedNoteIds: [...existingNotes, noteId],
      });
    }
    this.refreshContextNotes();
    this.changed();
  }

  unlinkNoteFromShape(noteId: string) {
    const note = this.shapes.get(noteId);
    if (!note || !note.linkedShapeId) return;
    const oldTarget = this.shapes.get(note.linkedShapeId);
    if (oldTarget && oldTarget.linkedNoteIds) {
      this.shapes.set(note.linkedShapeId, {
        ...oldTarget,
        linkedNoteIds: oldTarget.linkedNoteIds.filter((id) => id !== noteId),
      });
    }
    this.shapes.set(noteId, { ...note, linkedShapeId: undefined });
    this.refreshContextNotes();
    this.changed();
  }

  linkImageToShape(imageId: string, shapeId: string) {
    const image = this.shapes.get(imageId);
    const shape = this.shapes.get(shapeId);
    if (!image || !shape || image.type !== "image") return;
    this.shapes.set(imageId, { ...image, linkedShapeId: shapeId });
    const existing = shape.linkedImageIds ?? [];
    if (!existing.includes(imageId)) {
      this.shapes.set(shapeId, {
        ...shape,
        linkedImageIds: [...existing, imageId],
      });
    }
    this.changed();
  }

  unlinkImageFromShape(imageId: string) {
    const image = this.shapes.get(imageId);
    if (!image || !image.linkedShapeId) return;
    const oldTarget = this.shapes.get(image.linkedShapeId);
    if (oldTarget && oldTarget.linkedImageIds) {
      this.shapes.set(image.linkedShapeId, {
        ...oldTarget,
        linkedImageIds: oldTarget.linkedImageIds.filter((id) => id !== imageId),
      });
    }
    this.shapes.set(imageId, { ...image, linkedShapeId: undefined });
    this.changed();
  }

  /** Rebuild contextNote for every shape that has linked notes */
  private refreshContextNotes() {
    for (const [id, shape] of this.shapes) {
      if (!shape.linkedNoteIds?.length) continue;
      const lines: string[] = [];
      for (const noteId of shape.linkedNoteIds) {
        const note = this.shapes.get(noteId);
        if (!note) continue;
        const text = note.label || note.content || "";
        if (text) lines.push(text);
      }
      const newContext = lines.join("\n");
      if (shape.contextNote !== newContext) {
        this.shapes.set(id, { ...shape, contextNote: newContext });
      }
    }
  }

  // -- Document operations --------------------------------------------------

  getDocument(): CanvasDocument {
    const af = this.activeFrame;
    const shapes: CanvasShape[] = [];
    for (const s of this.shapes.values()) {
      if (s.type === "frame") continue;
      const inside = this.isShapeInFrame(s, af);
      shapes.push({
        ...s,
        isInsideFrame: inside,
        // Normalize to active-frame-relative coords for semantic rules
        x: inside ? s.x - af.x : s.x,
        y: inside ? s.y - af.y : s.y,
      });
    }
    return {
      id: "default",
      version: this.ver,
      outputType: this._outputType,
      frame: { ...af },
      frames: this.frames.map((f) => ({ ...f })),
      activeFrameId: this.activeFrameId,
      shapes,
      globalContext: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  loadDocument(doc: CanvasDocument) {
    this.shapes.clear();
    this.selectedIds.clear();
    this.frames = doc.frames?.length ? doc.frames.map((f) => ({ ...f })) : [{ ...doc.frame }];
    this.activeFrameId = doc.activeFrameId ?? this.frames[0].id;
    for (const s of doc.shapes) {
      const normalized =
        s.type === "sticky"
          ? { ...s, type: "note" as ShapeType }
          : s;
      this.shapes.set(normalized.id, normalized);
    }
    this.changed();
  }

  clearCanvas() {
    this.shapes.clear();
    this.selectedIds.clear();
    this.changed();
  }

  // -- Shape queries --------------------------------------------------------

  getShapes(): CanvasShape[] {
    return Array.from(this.shapes.values()).map((s) => ({
      ...s,
      isInsideFrame: this.isInFrame(s),
    }));
  }

  getShape(id: string): CanvasShape | undefined {
    const s = this.shapes.get(id);
    return s ? { ...s, isInsideFrame: this.isInFrame(s) } : undefined;
  }

  getSelectedShapes(): CanvasShape[] {
    return Array.from(this.selectedIds)
      .map((id) => this.shapes.get(id))
      .filter(Boolean)
      .map((s) => ({ ...s!, isInsideFrame: this.isInFrame(s!) }));
  }

  // -- Shape mutations ------------------------------------------------------

  createShape(shape: Omit<CanvasShape, "id">): CanvasShape {
    const id = `shape:${crypto.randomUUID()}`;
    const created: CanvasShape = {
      ...shape,
      id,
      semanticTag: shape.semanticTag ?? "unknown",
      isInsideFrame: false, // computed lazily
    };
    this.shapes.set(id, created);
    this.emit({ type: "shape:created", shapeId: id, shape: created });
    this.changed();
    return created;
  }

  updateShape(id: string, updates: Partial<CanvasShape>) {
    const existing = this.shapes.get(id);
    if (!existing) return;
    const updated = { ...existing, ...updates, id };
    this.shapes.set(id, updated);
    // If a linked note's text changed, refresh the target shape's contextNote
    if (updated.linkedShapeId && (updates.label !== undefined || updates.content !== undefined)) {
      this.refreshContextNotes();
    }
    this.emit({ type: "shape:updated", shapeId: id, shape: updated });
    this.changed();
  }

  deleteShape(id: string) {
    if (!this.shapes.has(id)) return;
    this.shapes.delete(id);
    this.selectedIds.delete(id);
    this.emit({ type: "shape:deleted", shapeId: id });
    this.changed();
  }

  createShapesFromSemanticMap(shapes: Omit<CanvasShape, "id">[]): CanvasShape[] {
    return shapes.map((s) => this.createShape(s));
  }

  // -- Selection & viewport -------------------------------------------------

  selectShape(id: string) {
    this.selectedIds.clear();
    this.selectedFrameId = null;
    this.selectedIds.add(id);
    this.emit({ type: "shape:selected", shapeId: id });
    this.onStateChange?.();
  }

  deselectAll() {
    this.selectedIds.clear();
    this.selectedFrameId = null;
    this.emit({ type: "shape:deselected" });
    this.onStateChange?.();
  }

  zoomToFit() {
    // Compute bounding box including frame + context widget area
    let minX = Math.min(this.frame.x, -380); // context widget default x
    let minY = this.frame.y;
    let maxX = this.frame.x + this.frame.width;
    let maxY = this.frame.y + this.frame.height;
    for (const s of this.shapes.values()) {
      minX = Math.min(minX, s.x);
      minY = Math.min(minY, s.y);
      maxX = Math.max(maxX, s.x + s.width);
      maxY = Math.max(maxY, s.y + s.height);
    }
    const pad = 80;
    const bw = maxX - minX + pad * 2;
    const bh = maxY - minY + pad * 2;
    // We need the container size — approximate with window
    const cw = (typeof window !== "undefined" ? window.innerWidth * 2 / 3 : 900);
    const ch = (typeof window !== "undefined" ? window.innerHeight : 700);
    const zoom = Math.min(cw / bw, ch / bh, 2);
    this.camera = {
      x: cw / 2 - (minX + (maxX - minX) / 2) * zoom,
      y: ch / 2 - (minY + (maxY - minY) / 2) * zoom,
      zoom,
    };
    this.onStateChange?.();
  }

  zoomToShape(id: string) {
    const s = this.shapes.get(id);
    if (!s) return;
    const cw = (typeof window !== "undefined" ? window.innerWidth * 2 / 3 : 900);
    const ch = (typeof window !== "undefined" ? window.innerHeight : 700);
    const zoom = Math.min(cw / (s.width + 100), ch / (s.height + 100), 2);
    this.camera = {
      x: cw / 2 - (s.x + s.width / 2) * zoom,
      y: ch / 2 - (s.y + s.height / 2) * zoom,
      zoom,
    };
    this.selectShape(id);
    this.onStateChange?.();
  }

  setZoom(level: number) {
    this.camera.zoom = Math.min(5, Math.max(0.1, level));
    this.onStateChange?.();
  }

  // -- Events ---------------------------------------------------------------

  on(event: CanvasEventType, handler: CanvasEventHandler) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler);
  }

  off(event: CanvasEventType, handler: CanvasEventHandler) {
    this.handlers.get(event)?.delete(handler);
  }

  // -- Serialization --------------------------------------------------------

  serialize(): string {
    return JSON.stringify({
      frames: this.frames,
      activeFrameId: this.activeFrameId,
      shapes: Array.from(this.shapes.values()),
      version: this.ver,
    });
  }

  deserialize(data: string) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.frames?.length) {
        this.frames = parsed.frames;
        this.activeFrameId = parsed.activeFrameId ?? this.frames[0].id;
      } else if (parsed.frame) {
        this.frames = [parsed.frame];
        this.activeFrameId = parsed.frame.id;
      }
      this.shapes.clear();
      if (Array.isArray(parsed.shapes)) {
        for (const s of parsed.shapes) this.shapes.set(s.id, s);
      }
      this.ver = parsed.version ?? 0;
      this.changed();
    } catch {
      // invalid data
    }
  }

  // -- Helpers (public for React component) ---------------------------------

  getFrameRect() {
    return this.activeFrame;
  }

  getAllFrames(): CanvasFrame[] {
    return this.frames;
  }

  getActiveFrameId(): string {
    return this.activeFrameId;
  }

  setActiveFrame(frameId: string) {
    if (this.frames.some((f) => f.id === frameId)) {
      this.activeFrameId = frameId;
      this.selectedFrameId = null;
      this.changed();
    }
  }

  createFrame(x: number, y: number, width: number, height: number, label?: string): CanvasFrame {
    const id = `frame:${crypto.randomUUID()}`;
    const newFrame: CanvasFrame = {
      id,
      type: "desktop",
      width: Math.max(200, width),
      height: Math.max(200, height),
      x,
      y,
    };
    this.frames.push(newFrame);
    this.activeFrameId = id;
    this.selectedFrameId = null;
    this.changed();
    return newFrame;
  }

  deleteFrame(frameId: string) {
    if (this.frames.length <= 1) return; // always keep at least one
    this.frames = this.frames.filter((f) => f.id !== frameId);
    if (this.activeFrameId === frameId) {
      this.activeFrameId = this.frames[0].id;
    }
    if (this.selectedFrameId === frameId) {
      this.selectedFrameId = null;
    }
    this.changed();
  }

  isSelected(id: string) {
    return this.selectedIds.has(id) || (id === this.selectedFrameId);
  }

  // Frame selection/resize support
  private selectedFrameId: string | null = null;

  selectFrame(frameId?: string) {
    const fid = frameId ?? this.activeFrameId;
    this.selectedIds.clear();
    this.selectedFrameId = fid;
    // Also make it the active frame
    if (this.frames.some((f) => f.id === fid)) {
      this.activeFrameId = fid;
    }
    this.onStateChange?.();
  }

  deselectFrame() {
    this.selectedFrameId = null;
  }

  isFrameSelected(frameId?: string) {
    if (frameId) return this.selectedFrameId === frameId;
    return this.selectedFrameId !== null;
  }

  getSelectedFrameId(): string | null {
    return this.selectedFrameId;
  }

  updateFrame(updates: Partial<CanvasFrame>, frameId?: string) {
    const fid = frameId ?? this.activeFrameId;
    const idx = this.frames.findIndex((f) => f.id === fid);
    if (idx === -1) return;
    this.frames[idx] = { ...this.frames[idx], ...updates, id: fid };
    this.changed();
  }

  getInternalShapes(): CanvasShape[] {
    return Array.from(this.shapes.values());
  }

  // -- Private helpers ------------------------------------------------------

  /** Check if shape is in the active frame */
  isInFrame(s: CanvasShape): boolean {
    return this.isShapeInFrame(s, this.activeFrame);
  }

  /** Check if shape is in a specific frame */
  private isShapeInFrame(s: CanvasShape, f: CanvasFrame): boolean {
    const ox = Math.max(0, Math.min(s.x + s.width, f.x + f.width) - Math.max(s.x, f.x));
    const oy = Math.max(0, Math.min(s.y + s.height, f.y + f.height) - Math.max(s.y, f.y));
    const area = s.width * s.height;
    return area > 0 && (ox * oy) / area > 0.5;
  }

  /** Find which frame a point is inside of */
  frameAtPoint(wx: number, wy: number): CanvasFrame | null {
    // Check in reverse order so newer frames get priority
    for (let i = this.frames.length - 1; i >= 0; i--) {
      const f = this.frames[i];
      if (wx >= f.x && wx <= f.x + f.width && wy >= f.y && wy <= f.y + f.height) {
        return f;
      }
    }
    return null;
  }

  private emit(event: CanvasEvent) {
    this.handlers.get(event.type)?.forEach((h) => h(event));
  }

  private changed() {
    this.ver++;
    this.emit({ type: "canvas:changed" });
    this.onStateChange?.();
    // Auto-persist to localStorage
    this.persistToStorage();
  }

  /** Public method to re-emit canvas:changed (used after restore to notify late listeners) */
  emitChanged() {
    this.emit({ type: "canvas:changed" });
  }

  private _persistTimer: ReturnType<typeof setTimeout> | null = null;
  private persistToStorage() {
    if (this._persistTimer) clearTimeout(this._persistTimer);
    this._persistTimer = setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("aphantasia:canvas", this.serialize());
        }
      } catch { /* localStorage full or unavailable — silently skip */ }
    }, 300);
  }

  restoreFromStorage(): boolean {
    try {
      if (typeof window === "undefined") return false;
      const saved = window.localStorage.getItem("aphantasia:canvas");
      if (saved) {
        this.deserialize(saved);
        return true;
      }
    } catch { /* corrupt data — start fresh */ }
    return false;
  }
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let engineInstance: CustomCanvasEngine | null = null;

export function getCustomEngine(): CustomCanvasEngine {
  if (!engineInstance) {
    engineInstance = new CustomCanvasEngine();
  }
  return engineInstance;
}

// ---------------------------------------------------------------------------
// React component
// ---------------------------------------------------------------------------

type Mode = "idle" | "panning" | "drawing" | "moving" | "resizing" | "editing" | "dragging-note" | "connecting";
type HandleDir = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

const HANDLE_CURSORS: Record<HandleDir, string> = {
  nw: "nwse-resize", n: "ns-resize", ne: "nesw-resize", e: "ew-resize",
  se: "nwse-resize", s: "ns-resize", sw: "nesw-resize", w: "ew-resize",
};

export function CustomCanvasView() {
  const engineRef = useRef(getCustomEngine());
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setRenderTick] = useState(0);
  const rerender = useCallback(() => setRenderTick((t) => t + 1), []);

  // Interaction state
  const modeRef = useRef<Mode>("idle");
  const [mode, setModeState] = useState<Mode>("idle");
  const setMode = useCallback((m: Mode) => { modeRef.current = m; setModeState(m); }, []);
  const spaceRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const drawStartRef = useRef<{ x: number; y: number } | null>(null);
  const [drawRect, setDrawRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const moveOffsetRef = useRef({ dx: 0, dy: 0 });
  const movingIdRef = useRef<string | null>(null);
  const resizeRef = useRef<{ id: string; handle: HandleDir; origX: number; origY: number; origW: number; origH: number; isFrame?: boolean } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagDropdownShapeId, setTagDropdownShapeId] = useState<string | null>(null);
  const [tagDropdownAnchor, setTagDropdownAnchor] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const engine = engineRef.current;

  // Wire engine → React re-render + restore saved state
  useEffect(() => {
    engine.onStateChange = rerender;
    // Restore saved canvas state — use requestAnimationFrame to ensure
    // sibling components (PreviewPane) have mounted their event listeners
    const restored = engine.restoreFromStorage();
    engine.zoomToFit();
    if (restored) {
      rerender();
      // Re-emit changed after a tick so PreviewPane picks it up
      requestAnimationFrame(() => engine.emitChanged());
    }
    if (typeof window !== "undefined") {
      (window as any).__aphEngine = engine;
    }
    return () => { engine.onStateChange = null; };
  }, [engine, rerender]);

  // -- Coordinate helpers ---------------------------------------------------

  const screenToWorld = useCallback((sx: number, sy: number) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const cam = engine.camera;
    return {
      x: (sx - rect.left - cam.x) / cam.zoom,
      y: (sy - rect.top - cam.y) / cam.zoom,
    };
  }, [engine]);

  // -- Keyboard events ------------------------------------------------------

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Skip all canvas shortcuts when focus is in an input/textarea/contenteditable
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" ||
        (e.target as HTMLElement)?.isContentEditable;
      if (isTyping) return;

      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        spaceRef.current = true;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && modeRef.current !== "editing") {
        e.preventDefault();
        const selected = engine.getSelectedShapes();
        selected.forEach((s) => engine.deleteShape(s.id));
      }
      if (e.key === "Escape") {
        if (modeRef.current === "editing") {
          setEditingId(null);
          setMode("idle");
        }
        engine.deselectAll();
        engine.setTool("select");
      }
      // Copy: Cmd/Ctrl+C
      if ((e.metaKey || e.ctrlKey) && e.key === "c" && modeRef.current !== "editing") {
        e.preventDefault();
        engine.copySelected();
      }
      // Paste: Cmd/Ctrl+V
      if ((e.metaKey || e.ctrlKey) && e.key === "v" && modeRef.current !== "editing") {
        e.preventDefault();
        engine.paste();
      }
      // Tool shortcuts
      if (!e.metaKey && !e.ctrlKey && modeRef.current !== "editing") {
        if (e.key === "v" || e.key === "1") engine.setTool("select");
        if (e.key === "r" || e.key === "2") engine.setTool("rectangle");
        if (e.key === "u" || e.key === "3") engine.setTool("roundedRect");
        if (e.key === "t" || e.key === "4") engine.setTool("text");
        if (e.key === "n" || e.key === "5") engine.setTool("note");
        if (e.key === "f" || e.key === "6") engine.setTool("frame");
      }

      // "/" opens the component browser (when not editing text)
      if (e.key === "/" && modeRef.current !== "editing") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("aphantasia:open-component-browser"));
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") spaceRef.current = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [engine, setMode]);

  // -- Wheel (zoom + pan) ---------------------------------------------------

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = engine.camera;

      // Pinch-to-zoom (ctrlKey is set for trackpad pinch) or Cmd/Ctrl+scroll
      if (e.ctrlKey || e.metaKey) {
        const rect = el.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const factor = Math.pow(0.995, e.deltaY);
        const newZoom = Math.min(5, Math.max(0.1, cam.zoom * factor));
        const s = newZoom / cam.zoom;
        engine.camera = {
          x: cx - (cx - cam.x) * s,
          y: cy - (cy - cam.y) * s,
          zoom: newZoom,
        };
      } else {
        // Regular scroll / two-finger trackpad drag → pan
        engine.camera = {
          ...cam,
          x: cam.x - e.deltaX,
          y: cam.y - e.deltaY,
        };
      }
      rerender();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [engine, rerender]);

  // -- Mouse handlers -------------------------------------------------------

  // Track note dragging for linking
  const draggingNoteRef = useRef<{ id: string; overShapeId: string | null } | null>(null);

  // Track connection handle drag (notes or images)
  const connectingRef = useRef<{
    sourceId: string;
    sourceType: "note" | "image";
    cursorWorld: { x: number; y: number };
    overShapeId: string | null;
  } | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (modeRef.current === "editing") return;
    const target = e.target as HTMLElement;
    const tool = engine.getTool();

    // Connection handle on note or image? Start connecting mode
    const connectEl = target.closest("[data-connect-handle]") as HTMLElement | null;
    if (connectEl) {
      const sourceId = connectEl.dataset.sourceId!;
      const sourceType = (connectEl.dataset.sourceType as "note" | "image") || "note";
      const wp = screenToWorld(e.clientX, e.clientY);
      connectingRef.current = { sourceId, sourceType, cursorWorld: wp, overShapeId: null };
      setMode("connecting");
      return;
    }

    // Resize handle? (works for both shapes and frame) — always available
    const handleEl = target.closest("[data-handle]") as HTMLElement | null;
    if (handleEl) {
      const handle = handleEl.dataset.handle as HandleDir;
      const shapeId = handleEl.dataset.shapeId!;
      const frameMatch = engine.getAllFrames().find((f) => f.id === shapeId);
      if (frameMatch) {
        resizeRef.current = { id: shapeId, handle, origX: frameMatch.x, origY: frameMatch.y, origW: frameMatch.width, origH: frameMatch.height, isFrame: true };
      } else {
        const internal = engine.getInternalShapes().find((sh) => sh.id === shapeId);
        if (!internal) return;
        resizeRef.current = { id: shapeId, handle, origX: internal.x, origY: internal.y, origW: internal.width, origH: internal.height };
      }
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      setMode("resizing");
      return;
    }

    // Pan (space+click or middle button) — always available
    if (spaceRef.current || e.button === 1) {
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      setMode("panning");
      return;
    }

    // Click on shape — select & move (or start note drag for linking)
    const shapeEl = target.closest("[data-shape-id]") as HTMLElement | null;
    if (shapeEl) {
      const id = shapeEl.dataset.shapeId!;
      const shape = engine.getInternalShapes().find((s) => s.id === id);
      if (!shape) return;

      // Keep active frame in sync with the last selected shape so the
      // viewport always renders the frame the user is currently working in.
      const ownerFrame = engine.frameAtPoint(shape.x + shape.width / 2, shape.y + shape.height / 2);
      if (ownerFrame && ownerFrame.id !== engine.getActiveFrameId()) {
        engine.setActiveFrame(ownerFrame.id);
      }

      engine.selectShape(id);
      const wp = screenToWorld(e.clientX, e.clientY);
      moveOffsetRef.current = { dx: shape.x - wp.x, dy: shape.y - wp.y };
      movingIdRef.current = id;

      // If dragging a note, track for linking
      if (isNoteShape(shape.type)) {
        draggingNoteRef.current = { id, overShapeId: null };
        setMode("dragging-note");
      } else {
        setMode("moving");
      }
      return;
    }

    // Click on frame border?
    const frameEl = target.closest("[data-frame-id]") as HTMLElement | null;
    if (frameEl) {
      const fid = frameEl.dataset.frameId!;
      engine.selectFrame(fid);
      return;
    }

    // -- Tool-specific actions on empty space --

    // Text tool: click to place text element
    if (tool === "text") {
      const wp = screenToWorld(e.clientX, e.clientY);
      const created = engine.createShape({
        type: "text" as ShapeType,
        x: wp.x - 100,
        y: wp.y - 20,
        width: 200,
        height: 40,
        isInsideFrame: false,
        semanticTag: "unknown",
        label: "",
      });
      engine.selectShape(created.id);
      setEditingId(created.id);
      setMode("editing");
      return;
    }

    // Note tool: click to place a note
    if (tool === "note") {
      const wp = screenToWorld(e.clientX, e.clientY);
      const created = engine.createShape({
        type: "note" as ShapeType,
        x: wp.x - 80,
        y: wp.y - 60,
        width: 160,
        height: 120,
        isInsideFrame: false,
        semanticTag: "unknown",
        label: "",
      });
      engine.selectShape(created.id);
      setEditingId(created.id);
      setMode("editing");
      return;
    }

    // Select tool: click empty to deselect, activate frame if inside one
    if (tool === "select") {
      engine.deselectAll();
      const wp = screenToWorld(e.clientX, e.clientY);
      const hitFrame = engine.frameAtPoint(wp.x, wp.y);
      if (hitFrame && hitFrame.id !== engine.getActiveFrameId()) {
        engine.setActiveFrame(hitFrame.id);
      }
      return;
    }

    // Rectangle / Rounded rect / Frame: click+drag to draw
    engine.deselectAll();
    const wp = screenToWorld(e.clientX, e.clientY);
    drawStartRef.current = wp;
    setDrawRect(null);
    setMode("drawing");
  }, [engine, screenToWorld, setMode]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const m = modeRef.current;

    if (m === "panning") {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      engine.camera.x += dx;
      engine.camera.y += dy;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      rerender();
      return;
    }

    if (m === "drawing" && drawStartRef.current) {
      const wp = screenToWorld(e.clientX, e.clientY);
      const sx = drawStartRef.current;
      setDrawRect({
        x: Math.min(sx.x, wp.x),
        y: Math.min(sx.y, wp.y),
        w: Math.abs(wp.x - sx.x),
        h: Math.abs(wp.y - sx.y),
      });
      return;
    }

    if (m === "moving" && movingIdRef.current) {
      const wp = screenToWorld(e.clientX, e.clientY);
      engine.updateShape(movingIdRef.current, {
        x: wp.x + moveOffsetRef.current.dx,
        y: wp.y + moveOffsetRef.current.dy,
      });
      return;
    }

    if (m === "dragging-note" && movingIdRef.current) {
      const wp = screenToWorld(e.clientX, e.clientY);
      engine.updateShape(movingIdRef.current, {
        x: wp.x + moveOffsetRef.current.dx,
        y: wp.y + moveOffsetRef.current.dy,
      });
      return;
    }

    if (m === "connecting" && connectingRef.current) {
      const wp = screenToWorld(e.clientX, e.clientY);
      connectingRef.current.cursorWorld = wp;
      // Hit-test: is the cursor over a content shape (not note/image)?
      let foundTarget: string | null = null;
      for (const s of engine.getInternalShapes()) {
        if (s.id === connectingRef.current.sourceId || isNoteShape(s.type) || s.type === "image") continue;
        if (wp.x >= s.x && wp.x <= s.x + s.width && wp.y >= s.y && wp.y <= s.y + s.height) {
          foundTarget = s.id;
          break;
        }
      }
      connectingRef.current.overShapeId = foundTarget;
      rerender();
      return;
    }

    if (m === "resizing" && resizeRef.current) {
      const r = resizeRef.current;
      const cam = engine.camera;
      const dx = (e.clientX - lastPosRef.current.x) / cam.zoom;
      const dy = (e.clientY - lastPosRef.current.y) / cam.zoom;
      lastPosRef.current = { x: e.clientX, y: e.clientY };

      let { origX: nx, origY: ny, origW: nw, origH: nh } = r;
      const h = r.handle;
      if (h.includes("w")) { nx += dx; nw -= dx; r.origX = nx; r.origW = nw; }
      if (h.includes("e")) { nw += dx; r.origW = nw; }
      if (h.includes("n")) { ny += dy; nh -= dy; r.origY = ny; r.origH = nh; }
      if (h.includes("s")) { nh += dy; r.origH = nh; }

      const minSize = r.isFrame ? 200 : MIN_RESIZE;
      if (nw < minSize) { if (h.includes("w")) nx -= minSize - nw; nw = minSize; r.origX = nx; r.origW = nw; }
      if (nh < minSize) { if (h.includes("n")) ny -= minSize - nh; nh = minSize; r.origY = ny; r.origH = nh; }

      if (r.isFrame) {
        engine.updateFrame({ x: nx, y: ny, width: nw, height: nh }, r.id);
      } else {
        engine.updateShape(r.id, { x: nx, y: ny, width: nw, height: nh });
      }
      return;
    }
  }, [engine, screenToWorld, rerender]);

  const onMouseUp = useCallback(() => {
    const m = modeRef.current;
    const tool = engine.getTool();

    if (m === "drawing" && drawRect && drawRect.w >= MIN_SHAPE_SIZE && drawRect.h >= MIN_SHAPE_SIZE) {
      if (tool === "frame") {
        engine.createFrame(drawRect.x, drawRect.y, drawRect.w, drawRect.h);
        engine.setTool("select");
      } else {
        const shapeType: ShapeType = tool === "roundedRect" ? "roundedRect" : "rectangle";
        const created = engine.createShape({
          type: shapeType,
          x: drawRect.x,
          y: drawRect.y,
          width: drawRect.w,
          height: drawRect.h,
          isInsideFrame: false,
          semanticTag: "unknown",
        });
        engine.selectShape(created.id);
        engine.setTool("select");
      }
    }

    // Note drag — no auto-connect, just clean up
    if (m === "dragging-note" && draggingNoteRef.current) {
      draggingNoteRef.current = null;
    }

    // Connection handle drop
    if (m === "connecting" && connectingRef.current) {
      const { sourceId, sourceType, overShapeId } = connectingRef.current;
      if (overShapeId) {
        if (sourceType === "note") {
          const note = engine.getInternalShapes().find((s) => s.id === sourceId);
          if (note?.linkedShapeId && note.linkedShapeId !== overShapeId) {
            engine.unlinkNoteFromShape(sourceId);
          }
          engine.linkNoteToShape(sourceId, overShapeId);
        } else {
          const img = engine.getInternalShapes().find((s) => s.id === sourceId);
          if (img?.linkedShapeId && img.linkedShapeId !== overShapeId) {
            engine.unlinkImageFromShape(sourceId);
          }
          engine.linkImageToShape(sourceId, overShapeId);
        }
      }
      connectingRef.current = null;
    }

    drawStartRef.current = null;
    setDrawRect(null);
    movingIdRef.current = null;
    resizeRef.current = null;
    if (m !== "editing") setMode("idle");
  }, [engine, drawRect, setMode]);

  const onDoubleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const shapeEl = target.closest("[data-shape-id]") as HTMLElement | null;
    if (shapeEl) {
      const id = shapeEl.dataset.shapeId!;
      engine.selectShape(id);
      setEditingId(id);
      setMode("editing");
      return;
    }
    // Double-click on empty canvas → drop a note
    const frameEl = target.closest("[data-frame-id]") as HTMLElement | null;
    if (!frameEl) {
      const wp = screenToWorld(e.clientX, e.clientY);
      const created = engine.createShape({
        type: "note" as ShapeType,
        x: wp.x - 80,
        y: wp.y - 60,
        width: 160,
        height: 120,
        isInsideFrame: false,
        semanticTag: "unknown",
        label: "",
      });
      engine.selectShape(created.id);
      setEditingId(created.id);
      setMode("editing");
    }
  }, [engine, setMode, screenToWorld]);

  // -- Render ---------------------------------------------------------------

  const cam = engine.camera;
  const allFrames = engine.getAllFrames();
  const activeFrameId = engine.getActiveFrameId();
  const shapes = engine.getInternalShapes();

  // -- Image drop -----------------------------------------------------------

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;

    for (const file of files) {
      const wp = screenToWorld(e.clientX, e.clientY);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        engine.createShape({
          type: "image" as ShapeType,
          x: wp.x - 150,
          y: wp.y - 100,
          width: 300,
          height: 200,
          isInsideFrame: false,
          semanticTag: "unknown",
          label: file.name,
          meta: { src: dataUrl },
        });
      };
      reader.readAsDataURL(file);
    }
  }, [engine, screenToWorld]);

  const tool = engine.getTool();
  const cursorStyle =
    mode === "connecting" ? "crosshair" :
    mode === "panning" ? "grabbing" :
    spaceRef.current ? "grab" :
    mode === "drawing" ? "crosshair" :
    (tool === "text" || tool === "note") ? "crosshair" :
    (tool === "rectangle" || tool === "roundedRect" || tool === "frame") ? "crosshair" :
    "default";

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden outline-none"
      style={{ background: "#F5F5F5", cursor: cursorStyle }}
      tabIndex={0}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onDoubleClick={onDoubleClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <style>{`[data-shape-id]:hover [data-tag-trigger] { opacity: 1 !important; }`}</style>
      {/* World layer */}
      <div
        style={{
          position: "absolute",
          transformOrigin: "0 0",
          transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.zoom})`,
          willChange: "transform",
        }}
      >
        {/* UI mode: reference panel is rendered OUTSIDE the world layer (see below) */}
        {engine.getDocument().outputType === "ui" ? (
          <></>
        ) : (
          <>
            {/* Context widget — draggable, lives in world space */}
            <CanvasContextWidget zoom={cam.zoom} />
            {/* Reference widget — draggable, lives in world space */}
            <CanvasReferenceWidget zoom={cam.zoom} />
          </>
        )}

        {/* Frames — only border edges are clickable, interior is click-through */}
        {allFrames.map((f) => {
          const isActive = f.id === activeFrameId;
          const isSelected = engine.isFrameSelected(f.id);
          const borderWidth = Math.max(6, 8 / cam.zoom);
          const borderColor = isSelected ? "#3b82f6" : "#2D2D32";
          const borderStyle = isSelected ? "solid" : "dashed";
          return (
            <div key={f.id} style={{
              position: "absolute",
              left: f.x,
              top: f.y,
              width: f.width,
              height: f.height,
              pointerEvents: "none",
            }}>
              {/* Label */}
              <span style={{
                position: "absolute",
                top: -22,
                left: 0,
                fontSize: 12,
                color: isSelected ? "#3b82f6" : "#2D2D32",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}>
                {isActive ? "Page (active)" : "Page"} ({Math.round(f.width)} x {Math.round(f.height)})
              </span>
              {/* Background fill (non-interactive) */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "#FFFFFF",
                border: `1px ${borderStyle} ${borderColor}`,
                boxSizing: "border-box",
                borderRadius: 2,
              }} />
              {/* Top edge */}
              <div data-frame-id={f.id} style={{ position: "absolute", top: -borderWidth / 2, left: 0, width: "100%", height: borderWidth, cursor: "pointer", pointerEvents: "auto" }} />
              {/* Bottom edge */}
              <div data-frame-id={f.id} style={{ position: "absolute", bottom: -borderWidth / 2, left: 0, width: "100%", height: borderWidth, cursor: "pointer", pointerEvents: "auto" }} />
              {/* Left edge */}
              <div data-frame-id={f.id} style={{ position: "absolute", top: 0, left: -borderWidth / 2, width: borderWidth, height: "100%", cursor: "pointer", pointerEvents: "auto" }} />
              {/* Right edge */}
              <div data-frame-id={f.id} style={{ position: "absolute", top: 0, right: -borderWidth / 2, width: borderWidth, height: "100%", cursor: "pointer", pointerEvents: "auto" }} />
              {/* Resize handles */}
              {isSelected && (
                <div style={{ pointerEvents: "auto" }}>
                  <ResizeHandles shapeId={f.id} zoom={cam.zoom} />
                </div>
              )}
            </div>
          );
        })}

        {/* Shapes */}
        {shapes.map((s) => {
          const selected = engine.isSelected(s.id);
          const isEditing = editingId === s.id;
          const isNoteDropTarget = draggingNoteRef.current?.overShapeId === s.id || connectingRef.current?.overShapeId === s.id;
          const linkCount = (s.linkedNoteIds?.length ?? 0) + (s.linkedImageIds?.length ?? 0);
          const isLinked = linkCount > 0;
          const isNote = isNoteShape(s.type);
          const linkedTarget = s.linkedShapeId
            ? shapes.find((x) => x.id === s.linkedShapeId)
            : undefined;
          const linkedTargetLabel =
            (linkedTarget?.label as string | undefined) ||
            (linkedTarget?.meta?.uiComponentType as string | undefined) ||
            "element";

          // Shape-specific styles
          const shapeStyles = getShapeStyle(s, selected, engine.isInFrame(s), isNoteDropTarget);

          return (
            <div
              key={s.id}
              data-shape-id={s.id}
              style={{
                position: "absolute",
                left: s.x,
                top: s.y,
                width: s.width,
                height: s.height,
                cursor: mode === "idle" || mode === "dragging-note" ? "move" : undefined,
                userSelect: "none",
                boxSizing: "border-box",
                display: isNote ? "flex" : undefined,
                flexDirection: isNote ? "column" : undefined,
                ...shapeStyles,
              }}
            >
              {/* Link indicator */}
              {isLinked && !isNote && (
                <div style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  color: "#000",
                  fontWeight: 700,
                  pointerEvents: "none",
                  zIndex: 5,
                }}>
                  {linkCount}
                </div>
              )}

              {/* Tag as section/component — in-frame rectangles and roundedRects, visible on hover or selected */}
              {(s.type === "rectangle" || s.type === "roundedRect") && engine.isInFrame(s) ? (
                <div
                  data-tag-trigger
                  role="button"
                  tabIndex={0}
                  title="Tag as section or component"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setTagDropdownAnchor(rect);
                    setTagDropdownShapeId(s.id);
                  }}
                  style={{
                    position: "absolute",
                    bottom: 6,
                    right: 6,
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "#e8e7e3",
                    border: "1px solid #c8c7c3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                    pointerEvents: "auto",
                    opacity: selected ? 1 : 0,
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#d4d3cf"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#e8e7e3"; }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
                  </svg>
                </div>
              ) : null}

              {/* UI component type badge */}
              {engine.getDocument().outputType === "ui" && s.meta?.uiComponentType ? (
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    left: 4,
                    padding: "1px 6px",
                    borderRadius: 4,
                    background: "rgba(99,102,241,0.9)",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 600,
                    fontFamily: "var(--font-poppins), system-ui, sans-serif",
                    letterSpacing: "0.02em",
                    pointerEvents: "none",
                    zIndex: 6,
                    whiteSpace: "nowrap",
                    lineHeight: "16px",
                  }}
                >
                  {s.meta.uiComponentType as string}
                </div>
              ) : null}

              {/* Connection handle on notes and images — large hit target */}
              {(isNote || s.type === "image") && (
                <div
                  data-connect-handle="true"
                  data-source-id={s.id}
                  data-source-type={isNote ? "note" : "image"}
                  style={{
                    position: "absolute",
                    right: -18,
                    top: "50%",
                    marginTop: -22,
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "crosshair",
                    pointerEvents: "auto",
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    const dot = (e.currentTarget as HTMLElement).querySelector("[data-link-dot]") as HTMLElement;
                    if (dot) {
                      dot.style.opacity = "1";
                      dot.style.transform = "scale(1.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const dot = (e.currentTarget as HTMLElement).querySelector("[data-link-dot]") as HTMLElement;
                    if (dot) {
                      dot.style.opacity = s.linkedShapeId ? "1" : "0.45";
                      dot.style.transform = "scale(1)";
                    }
                  }}
                >
                  <div
                    data-link-dot
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: s.linkedShapeId ? "#d97706" : "#94a3b8",
                      border: "2px solid #fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                      opacity: s.linkedShapeId ? 1 : 0.45,
                      transition: "opacity 0.15s, transform 0.15s",
                    }}
                  />
                </div>
              )}

              {/* Image preview */}
              {s.type === "image" && typeof s.meta?.src === "string" && (
                <img
                  src={s.meta.src as string}
                  alt={s.label || ""}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "inherit",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Note card — header + body */}
              {isNote && !isEditing && (
                <>
                  <div
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 6,
                      padding: "6px 10px",
                      background: "linear-gradient(180deg, #fff4d6 0%, #ffe8bc 100%)",
                      borderBottom: "1px solid #e8d5b5",
                      fontFamily: "var(--font-poppins), sans-serif",
                      pointerEvents: "none",
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "#78350f" }}>
                      NOTE
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 500,
                        color: s.linkedShapeId ? "#15803d" : "#78716c",
                        maxWidth: "55%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={s.linkedShapeId ? `Linked to ${linkedTargetLabel}` : "Not wired — used as global context"}
                    >
                      {s.linkedShapeId ? `Linked · ${linkedTargetLabel}` : "Global"}
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minHeight: 0,
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "flex-start",
                      fontFamily: "var(--font-poppins), sans-serif",
                      pointerEvents: "none",
                    }}
                  >
                    {s.label ? (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#1c1917",
                          lineHeight: 1.45,
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {s.label}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: "#a8a29e", fontStyle: "italic" }}>
                        Add a prompt for this element…
                      </span>
                    )}
                  </div>
                </>
              )}

              {/* Label display — non-note */}
              {!isNote && s.label && !isEditing && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: s.type === "text" ? "flex-start" : "center",
                    fontSize: s.type === "text" ? 16 : 13,
                    color: s.type === "text" ? "#333" : "#666",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    padding: 8,
                    textAlign: s.type === "text" ? "left" : "center",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    pointerEvents: "none",
                    lineHeight: 1.4,
                  }}
                >
                  {s.label}
                </div>
              )}

              {/* Empty text placeholder */}
              {s.type === "text" && !s.label && !isEditing && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  color: "#999",
                  padding: 8,
                  pointerEvents: "none",
                  fontStyle: "italic",
                }}>
                  Type here...
                </div>
              )}

              {/* Inline editor */}
              {isEditing && (
                <EditOverlay
                  value={s.label ?? ""}
                  zoom={cam.zoom}
                  isNote={isNote}
                  onCommit={(text) => {
                    engine.updateShape(s.id, { label: text || undefined, content: text || undefined });
                    setEditingId(null);
                    setMode("idle");
                  }}
                  onCancel={() => { setEditingId(null); setMode("idle"); }}
                />
              )}

              {/* Resize handles */}
              {selected && !isEditing && (
                <ResizeHandles shapeId={s.id} zoom={cam.zoom} />
              )}
            </div>
          );
        })}

        {/* Draw preview */}
        {drawRect && (
          <div style={{
            position: "absolute",
            left: drawRect.x,
            top: drawRect.y,
            width: drawRect.w,
            height: drawRect.h,
            border: tool === "frame" ? "2px dashed #999" : "2px dashed #3b82f6",
            borderRadius: tool === "roundedRect" ? 12 : tool === "frame" ? 2 : 4,
            background: tool === "frame" ? "rgba(255,255,255,0.5)" : undefined,
            pointerEvents: "none",
          }} />
        )}

        {/* Connection lines — each rendered as its own positioned SVG */}
        {shapes
          .filter((s) => (isNoteShape(s.type) || s.type === "image") && !!s.linkedShapeId)
          .map((note) => {
            const target = shapes.find((s) => s.id === note.linkedShapeId);
            if (!target) return null;
            const x1 = note.x + note.width;
            const y1 = note.y + note.height * 0.33;
            const x2 = target.x;
            const y2 = target.y + target.height / 2;
            // Bounding box with padding for stroke + arrowhead
            const pad = 20;
            const minX = Math.min(x1, x2) - pad;
            const minY = Math.min(y1, y2) - pad;
            const w = Math.abs(x2 - x1) + pad * 2;
            const h = Math.abs(y2 - y1) + pad * 2;
            const midX = x1 + (x2 - x1) * 0.5;
            const d = `M ${x1 - minX} ${y1 - minY} C ${midX - minX} ${y1 - minY}, ${midX - minX} ${y2 - minY}, ${x2 - minX} ${y2 - minY}`;
            return (
              <svg
                key={`conn:${note.id}`}
                style={{
                  position: "absolute",
                  left: minX,
                  top: minY,
                  width: w,
                  height: h,
                  pointerEvents: "none",
                }}
              >
                <defs>
                  <marker
                    id={`arrow-${note.id}`}
                    viewBox="0 0 12 10"
                    refX="11"
                    refY="5"
                    markerWidth="10"
                    markerHeight="8"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 12 5 L 0 10 Z" fill="#b45309" />
                  </marker>
                </defs>
                <path
                  d={d}
                  fill="none"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  markerEnd={`url(#arrow-${note.id})`}
                />
              </svg>
            );
          })}

        {/* Temporary connection arrow while dragging */}
        {connectingRef.current && (() => {
          const note = shapes.find((s) => s.id === connectingRef.current!.sourceId);
          if (!note) return null;
          const x1 = note.x + note.width;
          const y1 = note.y + note.height * 0.33;
          const x2 = connectingRef.current!.cursorWorld.x;
          const y2 = connectingRef.current!.cursorWorld.y;
          const pad = 20;
          const minX = Math.min(x1, x2) - pad;
          const minY = Math.min(y1, y2) - pad;
          const w = Math.abs(x2 - x1) + pad * 2;
          const h = Math.abs(y2 - y1) + pad * 2;
          const midX = x1 + (x2 - x1) * 0.5;
          const d = `M ${x1 - minX} ${y1 - minY} C ${midX - minX} ${y1 - minY}, ${midX - minX} ${y2 - minY}, ${x2 - minX} ${y2 - minY}`;
          return (
            <svg
              style={{
                position: "absolute",
                left: minX,
                top: minY,
                width: w,
                height: h,
                pointerEvents: "none",
              }}
            >
              <defs>
                <marker
                  id="arrow-drag"
                  viewBox="0 0 12 10"
                  refX="11"
                  refY="5"
                  markerWidth="10"
                  markerHeight="8"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 12 5 L 0 10 Z" fill="#d97706" opacity={0.6} />
                </marker>
              </defs>
              <path
                d={d}
                fill="none"
                stroke="#d97706"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.55}
                markerEnd="url(#arrow-drag)"
              />
            </svg>
          );
        })()}
      </div>

      {/* UI mode: Reference panel — fixed sidebar, outside world transform */}
      {engine.getDocument().outputType === "ui" && (
        <div style={{
          position: "absolute",
          top: 56,
          left: 12,
          width: 280,
          maxHeight: "calc(100% - 120px)",
          overflowY: "auto",
          zIndex: 40,
          pointerEvents: "auto",
        }}>
          <ReferencePanel />
        </div>
      )}

      {/* Zoom indicator */}
      <div style={{
        position: "absolute",
        bottom: 12,
        right: 12,
        fontSize: 11,
        color: "#999",
        userSelect: "none",
        pointerEvents: "none",
      }}>
        {Math.round(cam.zoom * 100)}%
      </div>

      {/* Per-shape tag dropdown (portal to body) */}
      {typeof document !== "undefined" &&
        createPortal(
          <>{engine.getDocument().outputType === "ui" ? (
            <UIShapeTagDropdown
              open={!!tagDropdownShapeId}
              onClose={() => {
                setTagDropdownShapeId(null);
                setTagDropdownAnchor(null);
              }}
              anchorRect={tagDropdownAnchor}
              currentType={
                tagDropdownShapeId
                  ? (engine.getShape(tagDropdownShapeId)?.meta?.uiComponentType as string | undefined)
                  : undefined
              }
              onSelect={(type: UIComponentType, label: string) => {
                if (!tagDropdownShapeId) return;
                const shape = engine.getShape(tagDropdownShapeId);
                if (!shape) return;
                engine.updateShape(tagDropdownShapeId, {
                  label,
                  meta: { ...(shape.meta || {}), uiComponentType: type },
                });
                setTagDropdownShapeId(null);
                setTagDropdownAnchor(null);
              }}
            />
          ) : (
            <ShapeTagDropdown
              open={!!tagDropdownShapeId}
              onClose={() => {
                setTagDropdownShapeId(null);
                setTagDropdownAnchor(null);
              }}
              anchorRect={tagDropdownAnchor}
              onSelect={(entry: ComponentCatalogEntry) => {
                if (!tagDropdownShapeId) return;
                const shape = engine.getShape(tagDropdownShapeId);
                if (!shape) return;
                const nextMeta = { ...(shape.meta || {}) };
                if (entry.kind === "primitive") {
                  nextMeta.componentId = entry.id;
                  delete nextMeta.placementVariant;
                } else {
                  delete nextMeta.componentId;
                  if (entry.variant) nextMeta.placementVariant = entry.variant;
                  else delete nextMeta.placementVariant;
                }
                engine.updateShape(tagDropdownShapeId, {
                  semanticTag: entry.semanticTag,
                  label: entry.label,
                  meta: nextMeta,
                });
                setTagDropdownShapeId(null);
                setTagDropdownAnchor(null);
              }}
            />
          )}</>,
          document.body
        )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Shape style helper
// ---------------------------------------------------------------------------

function getShapeStyle(
  s: CanvasShape,
  selected: boolean,
  insideFrame: boolean,
  isDropTarget: boolean,
): React.CSSProperties {
  const base: React.CSSProperties = {};

  if (isDropTarget) {
    base.boxShadow = "0 0 0 3px #f59e0b";
  }

  switch (s.type) {
    case "rectangle":
      return {
        ...base,
        border: selected ? "2px solid #3b82f6" : "1px solid #D9D8D5",
        borderRadius: 4,
        background: "#FAF9F5",
      };
    case "roundedRect":
      return {
        ...base,
        border: selected ? "2px solid #3b82f6" : "1px solid #D9D8D5",
        borderRadius: 12,
        background: "#FAF9F5",
      };
    case "text":
      return {
        ...base,
        border: selected ? "2px solid #3b82f6" : "1px dashed #D9D8D5",
        borderRadius: 4,
        background: "transparent",
      };
    case "note":
    case "sticky":
      return {
        ...base,
        border: selected ? "2px solid #3b82f6" : "1px solid #d4b896",
        borderRadius: 10,
        background: "#fff8e8",
        padding: 0,
        overflow: "hidden",
        boxShadow: isDropTarget
          ? "0 0 0 3px rgba(217,119,6,0.45)"
          : s.linkedShapeId
            ? "0 4px 14px rgba(28,25,23,0.12), 0 0 0 1px rgba(217,119,6,0.25)"
            : "0 4px 12px rgba(28,25,23,0.08)",
      };
    case "image":
      return {
        ...base,
        border: selected ? "2px solid #3b82f6" : "1px solid #D9D8D5",
        borderRadius: 8,
        background: "#FAF9F5",
        overflow: "hidden",
      };
    default:
      return {
        ...base,
        border: selected ? "2px solid #3b82f6" : "1px solid #D9D8D5",
        borderRadius: 4,
        background: "#FAF9F5",
      };
  }
}

const HANDLES: HandleDir[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

function ResizeHandles({ shapeId, zoom }: { shapeId: string; zoom: number }) {
  const size = Math.max(6, 8 / zoom);
  const half = size / 2;
  const positions: Record<HandleDir, React.CSSProperties> = {
    nw: { top: -half, left: -half },
    n:  { top: -half, left: "50%", marginLeft: -half },
    ne: { top: -half, right: -half },
    e:  { top: "50%", right: -half, marginTop: -half },
    se: { bottom: -half, right: -half },
    s:  { bottom: -half, left: "50%", marginLeft: -half },
    sw: { bottom: -half, left: -half },
    w:  { top: "50%", left: -half, marginTop: -half },
  };

  return (
    <>
      {HANDLES.map((h) => (
        <div
          key={h}
          data-handle={h}
          data-shape-id={shapeId}
          style={{
            position: "absolute",
            width: size,
            height: size,
            background: "#3b82f6",
            border: "1px solid #fff",
            borderRadius: 2,
            cursor: HANDLE_CURSORS[h],
            zIndex: 10,
            ...positions[h],
          }}
        />
      ))}
    </>
  );
}

function EditOverlay({
  value,
  zoom,
  isNote,
  onCommit,
  onCancel,
}: {
  value: string;
  zoom: number;
  isNote?: boolean;
  onCommit: (text: string) => void;
  onCancel: () => void;
}) {
  void zoom;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = value.replace(/\n/g, "<br>");
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const btnBase: CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 6,
    border: "1px solid #d6d3d1",
    cursor: "pointer",
    fontFamily: "var(--font-poppins), sans-serif",
  };

  const committedRef = useRef(false);
  const safeCommit = useCallback(() => {
    if (committedRef.current) return;
    committedRef.current = true;
    const text = ref.current?.innerText?.trim() ?? "";
    onCommit(text);
  }, [onCommit]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        zIndex: 20,
        background: isNote ? "#fffdf9" : "rgba(255,255,255,0.97)",
        borderRadius: isNote ? 8 : undefined,
        overflow: "hidden",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const related = e.relatedTarget as HTMLElement | null;
          const staysInOverlay = related && e.currentTarget.parentElement?.contains(related);
          if (!staysInOverlay) safeCommit();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            safeCommit();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: isNote ? "flex-start" : "center",
          justifyContent: isNote ? "flex-start" : "center",
          fontSize: isNote ? 12 : 13,
          color: isNote ? "#1c1917" : "#333",
          outline: "none",
          padding: isNote ? "10px 10px 6px" : 8,
          textAlign: isNote ? "left" : "center",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          cursor: "text",
          lineHeight: 1.45,
        }}
      />
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          padding: "6px 8px",
          borderTop: isNote ? "1px solid #e8d5b5" : "1px solid #e7e5e4",
          background: isNote ? "#fff4e0" : "#fafaf9",
        }}
      >
        <button
          type="button"
          tabIndex={0}
          style={{ ...btnBase, background: "#fff", color: "#57534e" }}
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          tabIndex={0}
          style={{ ...btnBase, background: "#d97706", borderColor: "#b45309", color: "#fff" }}
          onClick={(e) => {
            e.stopPropagation();
            safeCommit();
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Connection type inference — determines what a context note contributes
// ---------------------------------------------------------------------------

function inferConnectionType(text: string): string {
  const t = text.toLowerCase();
  if (/headline:|heading:|body:|cta:|subheading:|copy:|title:|caption:|tagline:/.test(t)) {
    return "copy";
  }
  if (/should feel|should be|intent:|goal:|purpose:|this is|vibe:|tone:|aesthetic|mood/.test(t)) {
    return "structural";
  }
  if (/style:|color:|font:|look:|background:|theme:|palette:|design/.test(t)) {
    return "style";
  }
  return "copy";
}

