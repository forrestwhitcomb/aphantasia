"use client";

// ============================================================
// APHANTASIA for REBTEL — Viewport Pane (React Render Tree)
// ============================================================
// Renders Rebtel components directly as React elements inside
// a phone-frame viewport. Replaces the iframe + srcDoc pipeline
// with SpecRenderer for direct DOM rendering.
// ============================================================

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { canvasEngine } from "@/engine";
import {
  MOBILE_FRAME_WIDTH,
  MOBILE_FRAME_HEIGHT,
  getCustomEngine,
} from "@/engine/engines/CustomCanvasEngine";
import type { ComponentSpec } from "../spec/types";
import { drawnShapeToPrimitive } from "../spec/inference";
import { resolveTemplate } from "../templates";
import { editText, findByKey, setStyle, setLayout, removeChild } from "../spec/operations";
import { mergeChildSpecs } from "../spec/merge";
import { renderSpec } from "../spec/render";
import { REBTEL_EXTRA_CSS, REBTEL_VIEWPORT_CSS } from "../designSystem";
import { PhoneChrome } from "@/ui-mode/viewport/PhoneChrome";
import { VariantPicker } from "@/ui-mode/viewport/VariantPicker";
import { CopyToFigmaButton } from "@/ui-mode/viewport/CopyToFigmaButton";
import { ScreenNavigator } from "./ScreenNavigator";
import { SpecRenderer } from "./SpecRenderer";
import { NodePropertyPanel } from "./NodePropertyPanel";
import { rebtelDesignStore } from "../store/RebtelDesignStore";

interface ShapeSpec {
  spec: ComponentSpec;
  primitive: string;
  template: string;
  shapeId: string;
  y: number;
}

interface ComponentSelection {
  shapeId: string;
  componentType: string;
  currentVariant: string;
  bounds: { x: number; y: number; width: number; height: number };
}

export function RebtelViewportPane() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shapeSpecs, setShapeSpecs] = useState<ShapeSpec[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentSelection | null>(null);
  const [selectedNode, setSelectedNode] = useState<{
    shapeId: string;
    nodeKey: string;
    spec: ComponentSpec;
  } | null>(null);
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

    for (const shape of doc.shapes) {
      // If shape already has a stored spec, use it
      if (shape.spec) {
        allSpecs.push({
          spec: shape.spec as ComponentSpec,
          primitive: (shape.primitive as string) ?? "card",
          template: (shape.template as string) ?? "blank",
          shapeId: shape.id,
          y: shape.y,
        });
        continue;
      }

      // Infer from geometry/label
      const inferred = drawnShapeToPrimitive(shape, fw, fh);
      if (inferred) {
        const spec = resolveTemplate(inferred.primitive, inferred.template);
        // Persist spec to shape so it survives re-renders
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
          y: shape.y,
        });
      }
    }

    // Composition: partition into parent and child shapes
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

    // Merge children into parents
    const merged = topLevel.map((parent) => {
      const children = childMap.get(parent.shapeId);
      if (children && children.length > 0) {
        // Sort children by y
        children.sort((a, b) => a.y - b.y);
        return {
          ...parent,
          spec: mergeChildSpecs(
            parent.spec,
            children.map((c) => c.spec),
          ),
        };
      }
      return parent;
    });

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
  const handleSelect = useCallback((shapeId: string, key: string, spec: ComponentSpec) => {
    setSelectedKey(key);
    setSelectedNode({ shapeId, nodeKey: key, spec });

    // Only show VariantPicker for top-level shape selection
    const ownerShape = shapeSpecs.find(ss => ss.shapeId === shapeId);
    if (ownerShape && ownerShape.spec.key === key) {
      setSelectedComponent({
        shapeId: ownerShape.shapeId,
        componentType: ownerShape.primitive,
        currentVariant: ownerShape.template,
        bounds: {
          x: 0,
          y: ownerShape.y,
          width: MOBILE_FRAME_WIDTH,
          height: 100,
        },
      });
    } else {
      // Deep node selected — hide variant picker
      setSelectedComponent(null);
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

  // Node property editing (Phase 4)
  const handleNodeEdit = useCallback((shapeId: string, key: string, updates: {
    style?: Partial<ComponentSpec["style"]>;
    layout?: Partial<ComponentSpec["layout"]>;
    text?: Partial<NonNullable<ComponentSpec["text"]>>;
  }) => {
    const ss = shapeSpecs.find(s => s.shapeId === shapeId);
    if (!ss) return;

    if (updates.style) setStyle(ss.spec, key, updates.style);
    if (updates.layout) setLayout(ss.spec, key, updates.layout);
    if (updates.text) {
      const node = findByKey(ss.spec, key);
      if (node?.text) Object.assign(node.text, updates.text);
    }

    canvasEngine.updateShape(shapeId, { spec: ss.spec as unknown } as any);
    buildSpecs();
  }, [shapeSpecs, buildSpecs]);

  // Delete a deep node
  const handleNodeDelete = useCallback((shapeId: string, key: string) => {
    const ss = shapeSpecs.find(s => s.shapeId === shapeId);
    if (!ss) return;
    // Don't delete the root node
    if (ss.spec.key === key) return;
    removeChild(ss.spec, key);
    canvasEngine.updateShape(shapeId, { spec: ss.spec as unknown } as any);
    setSelectedNode(null);
    setSelectedKey(null);
    buildSpecs();
  }, [shapeSpecs, buildSpecs]);

  // Keyboard shortcuts for deep editing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedNode) return;
      if (e.key === "Escape") {
        setSelectedNode(null);
        setSelectedKey(null);
        setSelectedComponent(null);
      }
      if ((e.key === "Delete" || e.key === "Backspace") && !e.metaKey) {
        // Only delete if not editing text
        const active = document.activeElement;
        if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || (active as HTMLElement).contentEditable === "true")) return;
        handleNodeDelete(selectedNode.shapeId, selectedNode.nodeKey);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNode, handleNodeDelete]);

  // Variant picker callbacks
  const handleVariantChange = useCallback((shapeId: string, variant: string) => {
    // Re-resolve the template with the new variant
    const ss = shapeSpecs.find(s => s.shapeId === shapeId);
    if (ss) {
      const newSpec = resolveTemplate(ss.primitive, variant);
      canvasEngine.updateShape(shapeId, {
        spec: newSpec as unknown,
        template: variant,
      } as any);
    }
    setSelectedComponent(null);
    setSelectedKey(null);
    buildSpecs();
  }, [shapeSpecs, buildSpecs]);

  const handleDarkModeToggle = useCallback((_shapeId: string, _darkMode: boolean) => {
    // Dark mode toggle — future enhancement
  }, []);

  const handlePickerDismiss = useCallback(() => {
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

      {/* Variant picker popover */}
      {selectedComponent && (
        <VariantPicker
          shapeId={selectedComponent.shapeId}
          componentType={selectedComponent.componentType}
          currentVariant={selectedComponent.currentVariant}
          bounds={selectedComponent.bounds}
          scale={scale}
          iframeEl={viewportRef.current as any}
          onVariantChange={handleVariantChange}
          onDarkModeToggle={handleDarkModeToggle}
          onDismiss={handlePickerDismiss}
          figmaEntry={
            (canvasEngine.getDocument().shapes
              .find(s => s.id === selectedComponent.shapeId)
              ?.meta as any)?.figmaComponentEntry ?? null
          }
        />
      )}

      {/* Node property panel (deep editing) */}
      {selectedNode && viewportMode === "design" && !selectedComponent && (
        <NodePropertyPanel
          shapeId={selectedNode.shapeId}
          nodeKey={selectedNode.nodeKey}
          spec={selectedNode.spec}
          onEdit={handleNodeEdit}
          onDelete={handleNodeDelete}
          onClose={() => {
            setSelectedNode(null);
            setSelectedKey(null);
          }}
          isRoot={shapeSpecs.some(ss => ss.spec.key === selectedNode.nodeKey)}
        />
      )}
    </div>
  );
}
