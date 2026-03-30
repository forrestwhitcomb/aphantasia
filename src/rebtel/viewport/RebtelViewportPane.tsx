"use client";

// ============================================================
// APHANTASIA for REBTEL — Viewport Pane (React Render Tree)
// ============================================================
// Renders Rebtel components directly as React elements inside
// a phone-frame viewport. Replaces the iframe + srcDoc pipeline
// with SpecRenderer for direct DOM rendering.
// ============================================================

import { useEffect, useRef, useState, useCallback } from "react";
import { canvasEngine } from "@/engine";
import {
  MOBILE_FRAME_WIDTH,
  MOBILE_FRAME_HEIGHT,
  getCustomEngine,
} from "@/engine/engines/CustomCanvasEngine";
import type { ComponentSpec } from "../spec/types";
import { drawnShapeToPrimitive } from "../spec/inference";
import { resolveTemplate } from "../templates";
import { editText, findByKey, replaceChildByKey } from "../spec/operations";
import { mergeChildSpecs } from "../spec/merge";
import { buildContainmentTree } from "@/spatial";
import { renderSpec } from "../spec/render";
import { REBTEL_EXTRA_CSS, REBTEL_VIEWPORT_CSS } from "../designSystem";
import { PhoneChrome } from "@/ui-mode/viewport/PhoneChrome";
import { CopyToFigmaButton } from "@/ui-mode/viewport/CopyToFigmaButton";
import { ScreenNavigator } from "./ScreenNavigator";
import { SpecRenderer } from "./SpecRenderer";
import { ComponentPopover } from "./ComponentPopover";
import { rebtelDesignStore } from "../store/RebtelDesignStore";

interface ShapeSpec {
  spec: ComponentSpec;
  primitive: string;
  template: string;
  shapeId: string;
  x: number;
  y: number;
}

interface ComponentSelection {
  shapeId: string;
  componentType: string;
  currentVariant: string;
  bounds: { x: number; y: number; width: number; height: number };
  spec: ComponentSpec;
  isSubComponent?: boolean;
  subNodeKey?: string;
}

/** Detect if a sub-node is a switchable component type */
function detectSubComponentType(spec: ComponentSpec): { primitive: string; template: string } | null {
  if (spec.data?.component === "button" || spec.interactive?.type === "button")
    return { primitive: "button", template: "primary" };
  if (spec.data?.component === "textField" || spec.interactive?.type === "input")
    return { primitive: "input", template: "text-field" };
  if (spec.data?.component === "divider")
    return { primitive: "divider", template: "default" };
  if (spec.style.cursor === "pointer" && spec.layout.borderRadius)
    return { primitive: "button", template: "primary" };
  if (spec.text && !spec.children?.length)
    return { primitive: "text", template: spec.text.style ?? "paragraph-md" };
  return null;
}

export function RebtelViewportPane() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shapeSpecs, setShapeSpecs] = useState<ShapeSpec[]>([]);
  // Maps composed child spec key → canvas child shapeId
  // so sub-component edits update the child shape, not the parent's merged spec
  const composedChildMapRef = useRef<Map<string, string>>(new Map());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentSelection | null>(null);
  const [viewportMode, setViewportMode] = useState<"design" | "preview">("design");
  const [screens, setScreens] = useState(rebtelDesignStore.getScreens());
  const [activeScreenId, setActiveScreenId] = useState(rebtelDesignStore.getActiveScreenId());

  // Subscribe to rebtelDesignStore screen changes
  useEffect(() => {
    const unsub = rebtelDesignStore.subscribe(() => {
      setScreens(rebtelDesignStore.getScreens());
      setActiveScreenId(rebtelDesignStore.getActiveScreenId());
    });
    return unsub;
  }, []);

  // Scale to fit pane height
  const BUTTON_AREA_HEIGHT = 90;
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      const h = entry.contentRect.height - BUTTON_AREA_HEIGHT;
      if (h > 0) setScale(h / MOBILE_FRAME_HEIGHT);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Build specs from canvas shapes (with composition support)
  const buildSpecs = useCallback(() => {
    const doc = canvasEngine.getDocument();
    const fw = doc.frame.width;
    const fh = doc.frame.height;
    const allSpecs: ShapeSpec[] = [];

    // ── Containment detection (shared spatial primitive) ──────
    const childrenMap = buildContainmentTree(doc.shapes);
    const childToParent = new Map<string, string>();
    for (const [parentId, childIds] of childrenMap) {
      for (const childId of childIds) {
        const shape = doc.shapes.find((s: { id: string }) => s.id === childId);
        if (shape && !(shape as any).parentId) {
          (shape as any).parentId = parentId;
        }
        childToParent.set(childId, parentId);
      }
    }

    // ── Pass 1: Infer top-level shapes (no parent) ───────────
    for (const shape of doc.shapes) {
      if (childToParent.has(shape.id)) continue; // skip children for now

      if (shape.spec) {
        allSpecs.push({
          spec: shape.spec as ComponentSpec,
          primitive: (shape.primitive as string) ?? "card",
          template: (shape.template as string) ?? "blank",
          shapeId: shape.id,
          x: shape.x,
          y: shape.y,
        });
        continue;
      }

      const inferred = drawnShapeToPrimitive(shape, fw, fh);
      if (inferred) {
        const spec = resolveTemplate(inferred.primitive, inferred.template);
        canvasEngine.updateShape(shape.id, {
          spec: spec as unknown,
          primitive: inferred.primitive,
          template: inferred.template,
        } as any);
        allSpecs.push({
          spec,
          primitive: inferred.primitive,
          template: inferred.template,
          shapeId: shape.id,
          x: shape.x,
          y: shape.y,
        });
      }
    }

    // ── Pass 2: Infer child shapes (with parent context) ─────
    // Primitives that are only valid at top-level — if a shape was
    // previously inferred as one of these but is now detected as a
    // child, re-infer it with parent context.
    const TOP_LEVEL_PRIMITIVES = new Set(["card", "sheet", "bar", "row"]);

    for (const shape of doc.shapes) {
      if (!childToParent.has(shape.id)) continue; // only children

      const parentId = childToParent.get(shape.id)!;
      const parentSS = allSpecs.find((s) => s.shapeId === parentId);
      const storedPrimitive = shape.primitive as string | undefined;

      // Use cached spec only if it was already inferred as a child type
      if (shape.spec && storedPrimitive && !TOP_LEVEL_PRIMITIVES.has(storedPrimitive)) {
        allSpecs.push({
          spec: shape.spec as ComponentSpec,
          primitive: storedPrimitive ?? "button",
          template: (shape.template as string) ?? "primary",
          shapeId: shape.id,
          x: shape.x,
          y: shape.y,
        });
        continue;
      }

      // (Re-)infer with parent context
      const inferred = drawnShapeToPrimitive(shape, fw, fh, parentSS?.primitive);
      if (inferred) {
        const spec = resolveTemplate(inferred.primitive, inferred.template);
        canvasEngine.updateShape(shape.id, {
          spec: spec as unknown,
          primitive: inferred.primitive,
          template: inferred.template,
        } as any);
        allSpecs.push({
          spec,
          primitive: inferred.primitive,
          template: inferred.template,
          shapeId: shape.id,
          x: shape.x,
          y: shape.y,
        });
      }
    }

    // ── Composition: partition into parent and child shapes ───
    const childMap = new Map<string, ShapeSpec[]>();
    const topLevel: ShapeSpec[] = [];

    for (const ss of allSpecs) {
      const shape = doc.shapes.find((s: { id: string }) => s.id === ss.shapeId);
      const parentId = shape?.parentId as string | undefined;
      if (parentId) {
        const existing = childMap.get(parentId) ?? [];
        existing.push(ss);
        childMap.set(parentId, existing);
      } else {
        topLevel.push(ss);
      }
    }

    // Build composed child map: spec key → canvas child shapeId
    const newChildMap = new Map<string, string>();

    // Merge children into parents
    const merged = topLevel.map((parent) => {
      const children = childMap.get(parent.shapeId);
      if (children && children.length > 0) {
        // Only compose canvas children into "blank" template parents.
        // Non-blank templates already define their own children — merging
        // canvas shapes on top of them would create duplicates.
        // For blank templates, always regenerate from a fresh base spec so that
        // stale merged specs stored by previous edit operations don't accumulate.
        if (parent.template !== "blank") return parent;

        // Track which spec keys map to which canvas child shapes
        for (const child of children) {
          newChildMap.set(child.spec.key, child.shapeId);
        }

        const freshBase = resolveTemplate(parent.primitive, parent.template);
        children.sort((a, b) => a.y - b.y);
        return {
          ...parent,
          spec: mergeChildSpecs(
            freshBase,
            children.map((c) => c.spec),
            children.map((c) => ({ x: c.x, y: c.y })),
          ),
        };
      }
      return parent;
    });

    composedChildMapRef.current = newChildMap;

    // Sort by y-position (top to bottom)
    merged.sort((a, b) => a.y - b.y);
    setShapeSpecs(merged);
  }, []);

  // Subscribe to canvas changes
  useEffect(() => {
    buildSpecs();

    const handleChange = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(buildSpecs, 200);
    };

    canvasEngine.on("canvas:changed", handleChange);

    return () => {
      canvasEngine.off("canvas:changed", handleChange);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Screen navigation
  const handleScreenNavigate = useCallback((screenId: string) => {
    rebtelDesignStore.setActiveScreen(screenId);
    const screen = rebtelDesignStore.getScreens().find(s => s.screenId === screenId);
    if (screen) {
      try {
        getCustomEngine().setActiveFrame(screen.frameId);
      } catch {
        // Frame may not exist yet
      }
    }
    buildSpecs();
  }, [buildSpecs]);

  // Deep component selection in design mode (includes shapeId)
  const handleSelect = useCallback((shapeId: string, key: string, nodeSpec: ComponentSpec) => {
    setSelectedKey(key);

    const ownerShape = shapeSpecs.find(ss => ss.shapeId === shapeId);
    if (!ownerShape) return;

    if (ownerShape.spec.key === key) {
      // Top-level selection — show popover for whole component
      setSelectedComponent({
        shapeId: ownerShape.shapeId,
        componentType: ownerShape.primitive,
        currentVariant: ownerShape.template,
        spec: nodeSpec,
        bounds: {
          x: 0,
          y: ownerShape.y,
          width: MOBILE_FRAME_WIDTH,
          height: 100,
        },
      });
    } else {
      // Sub-node — detect if it's a switchable component
      const subType = detectSubComponentType(nodeSpec);
      setSelectedComponent({
        shapeId: ownerShape.shapeId,
        componentType: subType?.primitive ?? ownerShape.primitive,
        currentVariant: subType?.template ?? ownerShape.template,
        spec: nodeSpec,
        bounds: {
          x: 0,
          y: ownerShape.y,
          width: MOBILE_FRAME_WIDTH,
          height: 100,
        },
        isSubComponent: true,
        subNodeKey: key,
      });
    }
  }, [shapeSpecs]);

  // Text editing in design mode (includes shapeId)
  const handleTextChange = useCallback((shapeId: string, key: string, newText: string) => {
    const ss = shapeSpecs.find(s => s.shapeId === shapeId);
    if (ss && editText(ss.spec, key, newText)) {
      canvasEngine.updateShape(ss.shapeId, {
        spec: ss.spec as unknown,
      } as any);
    }
  }, [shapeSpecs]);


  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedComponent) return;
      if (e.key === "Escape") {
        setSelectedKey(null);
        setSelectedComponent(null);
      }
      if ((e.key === "Delete" || e.key === "Backspace") && !e.metaKey) {
        // Don't delete if user is editing text
        const active = document.activeElement;
        if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || (active as HTMLElement).contentEditable === "true")) return;

        // Delete the selected shape from canvas
        const isRoot = shapeSpecs.some(ss => ss.spec.key === (selectedComponent.subNodeKey ?? selectedComponent.spec.key) && ss.shapeId === selectedComponent.shapeId);
        if (isRoot || !selectedComponent.isSubComponent) {
          // Top-level: remove the canvas shape entirely
          canvasEngine.deleteShape(selectedComponent.shapeId);
        } else if (selectedComponent.subNodeKey) {
          // Sub-component: check if it's a composed canvas child
          const childShapeId = composedChildMapRef.current.get(selectedComponent.subNodeKey);
          if (childShapeId) {
            canvasEngine.deleteShape(childShapeId);
          }
        }
        setSelectedKey(null);
        setSelectedComponent(null);
        buildSpecs();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedComponent, shapeSpecs, buildSpecs]);

  // Variant picker callbacks
  const handleVariantChange = useCallback((shapeId: string, variant: string) => {
    const ss = shapeSpecs.find(s => s.shapeId === shapeId);
    if (!ss) return;

    if (selectedComponent?.isSubComponent && selectedComponent?.subNodeKey) {
      // Check if this sub-node is a composed canvas child
      const childShapeId = composedChildMapRef.current.get(selectedComponent.subNodeKey);
      if (childShapeId) {
        // Update the canvas child shape directly (so fresh composition picks it up)
        const newSubSpec = resolveTemplate(selectedComponent.componentType, variant);
        canvasEngine.updateShape(childShapeId, {
          spec: newSubSpec as unknown,
          primitive: selectedComponent.componentType,
          template: variant,
        } as any);
      } else {
        // Non-composed sub-component: replace in parent spec tree
        const newSubSpec = resolveTemplate(selectedComponent.componentType, variant);
        replaceChildByKey(ss.spec, selectedComponent.subNodeKey, newSubSpec);
        canvasEngine.updateShape(shapeId, { spec: ss.spec as unknown } as any);
      }
    } else {
      // Top-level: replace entire component
      const newSpec = resolveTemplate(ss.primitive, variant);
      canvasEngine.updateShape(shapeId, {
        spec: newSpec as unknown,
        template: variant,
      } as any);
    }

    setSelectedComponent(null);
    setSelectedKey(null);
    buildSpecs();
  }, [shapeSpecs, selectedComponent, buildSpecs]);

  // Text style change from ComponentPopover "Modify" view
  const handleTextStyleChange = useCallback((shapeId: string, nodeKey: string, style: string) => {
    // Check if this is a composed canvas child
    const childShapeId = composedChildMapRef.current.get(nodeKey);
    if (childShapeId) {
      // Update the canvas child shape's spec directly
      const doc = canvasEngine.getDocument();
      const childShape = doc.shapes.find((s: { id: string }) => s.id === childShapeId);
      if (childShape?.spec) {
        const spec = childShape.spec as ComponentSpec;
        if (spec.text) {
          spec.text.style = style as any;
          canvasEngine.updateShape(childShapeId, { spec: spec as unknown } as any);
        }
      }
    } else {
      const ss = shapeSpecs.find(s => s.shapeId === shapeId);
      if (!ss) return;
      const node = findByKey(ss.spec, nodeKey);
      if (node?.text) {
        node.text.style = style as any;
        canvasEngine.updateShape(shapeId, { spec: ss.spec as unknown } as any);
      }
    }
    buildSpecs();
  }, [shapeSpecs, buildSpecs]);

  // Swap component type from ComponentPopover "Change" view
  const handleSwapComponent = useCallback((shapeId: string, nodeKey: string, primitive: string, template: string) => {
    const newSubSpec = resolveTemplate(primitive, template);

    // Check if this is a composed canvas child
    const childShapeId = composedChildMapRef.current.get(nodeKey);
    if (childShapeId) {
      // Update the canvas child shape directly
      canvasEngine.updateShape(childShapeId, {
        spec: newSubSpec as unknown,
        primitive,
        template,
      } as any);
    } else {
      const ss = shapeSpecs.find(s => s.shapeId === shapeId);
      if (!ss) return;
      if (ss.spec.key === nodeKey) {
        // Top-level swap: replace entire spec
        canvasEngine.updateShape(shapeId, {
          spec: newSubSpec as unknown,
          primitive,
          template,
        } as any);
      } else {
        replaceChildByKey(ss.spec, nodeKey, newSubSpec);
        canvasEngine.updateShape(shapeId, { spec: ss.spec as unknown } as any);
      }
    }
    setSelectedComponent(null);
    setSelectedKey(null);
    buildSpecs();
  }, [shapeSpecs, buildSpecs]);

  const handlePopoverDismiss = useCallback(() => {
    setSelectedComponent(null);
    setSelectedKey(null);
  }, []);

  // Generate HTML for CopyToFigma
  const getCurrentScreenSrcDoc = useCallback((): string => {
    if (shapeSpecs.length === 0) return "";
    const bodyHtml = shapeSpecs.map(ss => renderSpec(ss.spec)).join("\n");
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${REBTEL_EXTRA_CSS}</style>
</head><body style="margin:0;padding:0;background:#fff;width:${MOBILE_FRAME_WIDTH}px;min-height:${MOBILE_FRAME_HEIGHT}px;overflow-x:hidden">
${bodyHtml}
</body></html>`;
  }, [shapeSpecs]);

  const scaledWidth = MOBILE_FRAME_WIDTH * scale;
  const scaledHeight = MOBILE_FRAME_HEIGHT * scale;

  const hasContent = shapeSpecs.length > 0;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      {/* Design / Preview toggle */}
      <div
        style={{
          display: "flex",
          background: "rgba(26,26,26,0.92)",
          borderRadius: 10,
          padding: 3,
          gap: 2,
          border: "1px solid rgba(255,255,255,0.08)",
          fontFamily: "var(--font-poppins), system-ui, sans-serif",
          marginBottom: 8,
          flexShrink: 0,
        }}
      >
        {(["design", "preview"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setViewportMode(m)}
            style={{
              padding: "4px 14px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: viewportMode === m ? 600 : 400,
              color: viewportMode === m ? "#fff" : "rgba(255,255,255,0.45)",
              background: viewportMode === m
                ? m === "preview" ? "rgba(230,57,70,0.8)" : "rgba(255,255,255,0.15)"
                : "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize" as const,
              transition: "all 0.15s",
            }}
          >
            {m === "design" ? "\u270F\uFE0F Design" : "\u25B6 Preview"}
          </button>
        ))}
      </div>

      {/* Phone wrapper */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <PhoneChrome width={scaledWidth} height={scaledHeight} scale={scale}>
          {hasContent ? (
            <div
              ref={viewportRef}
              className="rebtel-viewport-screen"
              style={{
                width: MOBILE_FRAME_WIDTH,
                height: MOBILE_FRAME_HEIGHT,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                background: "#FAFAFC",
                boxSizing: "border-box",
                position: "relative",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
              onClick={() => {
                // Click on empty space deselects
                if (viewportMode === "design") {
                  setSelectedKey(null);
                  setSelectedComponent(null);
                }
              }}
            >
              {/* Inject Rebtel CSS custom properties */}
              <style dangerouslySetInnerHTML={{ __html: REBTEL_VIEWPORT_CSS }} />

              {/* Dynamic island safe-area spacer — 59px keeps content below the notch */}
              <div style={{ width: "100%", height: 59, flexShrink: 0 }} />

              {/* App bar — pinned to top, full width (no side padding) */}
              {shapeSpecs.filter(ss => ss.primitive === "bar" && ss.template === "app-bar").map((ss) => (
                <div key={ss.shapeId} style={{ width: "100%", flexShrink: 0, zIndex: 10 }}>
                  <SpecRenderer
                    spec={ss.spec}
                    shapeId={ss.shapeId}
                    selectedKey={selectedKey}
                    onSelect={handleSelect}
                    onTextChange={handleTextChange}
                    onNavigate={handleScreenNavigate}
                    isDesignMode={viewportMode === "design"}
                  />
                </div>
              ))}

              {/* Scrollable content area (everything except app bar and tab bar) */}
              <div style={{ flex: 1, overflowY: "auto", paddingLeft: 16, paddingRight: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                {shapeSpecs.filter(ss => !(ss.primitive === "bar" && (ss.template === "tab-bar" || ss.template === "app-bar"))).map((ss) => (
                  <SpecRenderer
                    key={ss.shapeId}
                    spec={ss.spec}
                    shapeId={ss.shapeId}
                    selectedKey={selectedKey}
                    onSelect={handleSelect}
                    onTextChange={handleTextChange}
                    onNavigate={handleScreenNavigate}
                    isDesignMode={viewportMode === "design"}
                  />
                ))}
              </div>

              {/* Tab bar — pinned to bottom, full width (no side padding) */}
              {shapeSpecs.filter(ss => ss.primitive === "bar" && ss.template === "tab-bar").map((ss) => (
                <div key={ss.shapeId} style={{ width: "100%", flexShrink: 0, zIndex: 10 }}>
                  <SpecRenderer
                    spec={ss.spec}
                    shapeId={ss.shapeId}
                    selectedKey={selectedKey}
                    onSelect={handleSelect}
                    onTextChange={handleTextChange}
                    onNavigate={handleScreenNavigate}
                    isDesignMode={viewportMode === "design"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#FAFAFC",
                gap: 10,
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E63946"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <path d="M12 18h.01" />
              </svg>
              <p
                style={{
                  fontSize: 12,
                  color: "#999",
                  fontFamily: "var(--font-poppins), sans-serif",
                  margin: 0,
                }}
              >
                Draw shapes or use chat to start
              </p>
            </div>
          )}
        </PhoneChrome>

        {/* Copy to Figma + screen navigator below phone chrome */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 8 }}>
          <CopyToFigmaButton getSrcDoc={getCurrentScreenSrcDoc} />
          <ScreenNavigator
            screens={screens.map(s => ({ screenId: s.screenId, title: s.title }))}
            activeScreenId={activeScreenId}
            onNavigate={handleScreenNavigate}
          />
        </div>
      </div>

      {/* Unified component popover */}
      {selectedComponent && viewportMode === "design" && (
        <ComponentPopover
          shapeId={selectedComponent.shapeId}
          componentType={selectedComponent.componentType}
          currentVariant={selectedComponent.currentVariant}
          spec={selectedComponent.spec}
          bounds={selectedComponent.bounds}
          scale={scale}
          iframeEl={viewportRef.current}
          isSubComponent={selectedComponent.isSubComponent}
          subNodeKey={selectedComponent.subNodeKey}
          onVariantChange={handleVariantChange}
          onSwapComponent={handleSwapComponent}
          onTextStyleChange={handleTextStyleChange}
          onDismiss={handlePopoverDismiss}
        />
      )}
    </div>
  );
}
