"use client";

// ============================================================
// APHANTASIA for REBTEL — Viewport Pane
// ============================================================
// Renders Rebtel components in a phone-frame viewport.
// Wired to the RebtelDesignStore instead of UIDesignStoreV2.
// Uses the Rebtel render engine wrapper for component dispatch.
// ============================================================

import { useEffect, useRef, useState, useCallback } from "react";
import { canvasEngine } from "@/engine";
import {
  MOBILE_FRAME_WIDTH,
  MOBILE_FRAME_HEIGHT,
  getCustomEngine,
} from "@/engine/engines/CustomCanvasEngine";
import { resolveRebtelComponents } from "../semantic/RebtelSemanticResolver";
import type { UIResolvedComponent, UILayer2Override, UIUserOverride } from "@/ui-mode/types";
import { PhoneChrome } from "@/ui-mode/viewport/PhoneChrome";
import { VariantPicker } from "@/ui-mode/viewport/VariantPicker";
import { rebtelRenderLayer1 } from "../render/rebtelRenderEngine";
import { useRebtelInteractionHandler } from "./RebtelInteractionHandler";
import { ScreenNavigator } from "./ScreenNavigator";
import { rebtelDesignStore } from "../store/RebtelDesignStore";

type RenderPhase = "idle" | "layer1" | "layer2" | "complete";

interface ComponentSelection {
  shapeId: string;
  componentType: string;
  currentVariant: string;
  bounds: { x: number; y: number; width: number; height: number };
}

export function RebtelViewportPane() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [scale, setScale] = useState(1);
  const [phase, setPhase] = useState<RenderPhase>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedRef = useRef<UIResolvedComponent[]>([]);
  const l2OverridesRef = useRef<UILayer2Override[]>([]);
  const userOverridesRef = useRef<Map<string, UIUserOverride>>(new Map());
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

  // Send mode to iframe — triggered by mode change, iframe ready signal, or iframe load
  const sendModeToIframe = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "rebtel:set-mode", mode: viewportMode },
      "*"
    );
  }, [viewportMode]);

  // When mode changes, send immediately (iframe may already be loaded)
  useEffect(() => {
    sendModeToIframe();
  }, [sendModeToIframe]);

  // Listen for iframe "ready" signal (most reliable — fires after iframe scripts execute)
  useEffect(() => {
    const handleReady = (e: MessageEvent) => {
      if (e.data?.type === "rebtel:iframe-ready") {
        sendModeToIframe();
      }
    };
    window.addEventListener("message", handleReady);
    return () => window.removeEventListener("message", handleReady);
  }, [sendModeToIframe]);

  // Fallback: also send on iframe load event
  const handleIframeLoad = useCallback(() => {
    // Small delay to ensure scripts have executed
    setTimeout(sendModeToIframe, 50);
  }, [sendModeToIframe]);

  // Scale to fit pane height
  const BUTTON_AREA_HEIGHT = 80; // extra room for mode toggle + screen nav
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      const h = entry.contentRect.height - BUTTON_AREA_HEIGHT;
      if (h > 0) setScale(h / MOBILE_FRAME_HEIGHT);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // postMessage listener for iframe interaction
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data?.type?.startsWith("aphantasia:")) return;

      switch (e.data.type) {
        case "aphantasia:text-edit": {
          const { shapeId, newText } = e.data;
          if (!shapeId || !newText) return;
          const existing: UIUserOverride = userOverridesRef.current.get(shapeId) ?? { shapeId };
          existing.textOverride = newText;
          userOverridesRef.current.set(shapeId, existing);
          break;
        }
        case "aphantasia:component-select": {
          const { shapeId, componentType, currentVariant, bounds } = e.data;
          if (!shapeId) return;
          setSelectedComponent({ shapeId, componentType, currentVariant, bounds });
          iframeRef.current?.contentWindow?.postMessage(
            { type: "aphantasia:highlight", shapeId },
            "*"
          );
          break;
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Subscribe to canvas changes — Layer 1 render
  useEffect(() => {
    doLayer1();

    const handleChange = () => {
      l2OverridesRef.current = [];
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(doLayer1, 200);
    };

    canvasEngine.on("canvas:changed", handleChange);

    return () => {
      canvasEngine.off("canvas:changed", handleChange);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Layer 1: synchronous render
  const doLayer1 = useCallback(() => {
    const doc = canvasEngine.getDocument();
    const fw = doc.frame.width;
    const fh = doc.frame.height;

    const resolved = resolveRebtelComponents(doc.shapes, fw, fh);
    resolvedRef.current = resolved;

    // Apply user overrides
    for (const comp of resolved) {
      const userOv = userOverridesRef.current.get(comp.shapeId);
      if (userOv) {
        if (userOv.textOverride !== undefined) comp.label = userOv.textOverride;
        if (userOv.variantOverride !== undefined) comp.variant = userOv.variantOverride;
        if (userOv.darkMode) comp._userDarkMode = true;
      }
    }

    // Pass shapes so the render engine can wire up data-navigate-to
    const html = rebtelRenderLayer1(
      resolved,
      l2OverridesRef.current.length > 0 ? l2OverridesRef.current : undefined,
      fh,
      doc.shapes
    );
    setSrcDoc(html);
    setPhase("layer1");
  }, []);

  // Screen navigation callback (after doLayer1 so it can reference it)
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
    // Trigger re-render of viewport content
    doLayer1();
  }, [doLayer1]);

  // Wire up rebtel:* postMessage handler
  useRebtelInteractionHandler(handleScreenNavigate);

  // Variant picker callbacks
  const handleVariantChange = useCallback((shapeId: string, variant: string) => {
    const existing: UIUserOverride = userOverridesRef.current.get(shapeId) ?? { shapeId };
    existing.variantOverride = variant;
    userOverridesRef.current.set(shapeId, existing);
    setSelectedComponent(null);
    iframeRef.current?.contentWindow?.postMessage(
      { type: "aphantasia:highlight", shapeId: null },
      "*"
    );
    doLayer1();
  }, [doLayer1]);

  const handleDarkModeToggle = useCallback((shapeId: string, darkMode: boolean) => {
    const existing: UIUserOverride = userOverridesRef.current.get(shapeId) ?? { shapeId };
    existing.darkMode = darkMode;
    userOverridesRef.current.set(shapeId, existing);
    doLayer1();
  }, [doLayer1]);

  const handlePickerDismiss = useCallback(() => {
    if (selectedComponent) {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "aphantasia:highlight", shapeId: null },
        "*"
      );
    }
    setSelectedComponent(null);
  }, [selectedComponent]);

  const scaledWidth = MOBILE_FRAME_WIDTH * scale;
  const scaledHeight = MOBILE_FRAME_HEIGHT * scale;

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
      {/* Phase indicator */}
      {phase === "layer2" && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(230,57,70,0.9)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 500,
            padding: "3px 10px",
            borderRadius: 6,
            zIndex: 20,
            pointerEvents: "none",
            fontFamily: "var(--font-poppins), sans-serif",
          }}
        >
          AI rendering...
        </div>
      )}

      {/* Phone wrapper */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <PhoneChrome width={scaledWidth} height={scaledHeight} scale={scale}>
          {srcDoc ? (
            <iframe
              ref={iframeRef}
              key="rebtel-viewport"
              srcDoc={srcDoc}
              title="Rebtel Viewport"
              sandbox="allow-scripts"
              onLoad={handleIframeLoad}
              style={{
                width: MOBILE_FRAME_WIDTH,
                height: MOBILE_FRAME_HEIGHT,
                border: "none",
                display: "block",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
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

        {/* Mode toggle + screen navigator below phone chrome */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 8 }}>
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
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                }}
              >
                {m === "design" ? "✏️ Design" : "▶ Preview"}
              </button>
            ))}
          </div>

          {/* Screen navigator */}
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
          iframeEl={iframeRef.current}
          onVariantChange={handleVariantChange}
          onDarkModeToggle={handleDarkModeToggle}
          onDismiss={handlePickerDismiss}
        />
      )}
    </div>
  );
}
