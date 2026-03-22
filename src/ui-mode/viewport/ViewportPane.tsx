"use client";

// ============================================================
// APHANTASIA — UI Viewport Pane
// ============================================================
// Replaces UIPreviewPane.tsx. Renders the new 32-component
// system using the UI semantic resolver and render engine.
//
// Layer 1: canvas shapes → resolveUIComponents() → renderLayer1()
//          → iframe srcDoc (instant, <50ms)
// Layer 2: resolved components → /api/ui-render → overrides
//          → merged into Layer 1 (progressive, streaming)
//
// Subscribes to canvas changes and design store for live updates.
// Layer 2 triggered by "render:requested" event from the Render button.
// ============================================================

import { useEffect, useRef, useState, useCallback } from "react";
import { canvasEngine } from "@/engine";
import {
  MOBILE_FRAME_WIDTH,
  MOBILE_FRAME_HEIGHT,
} from "@/engine/engines/CustomCanvasEngine";
import { resolveUIComponents } from "../semantic/UISemanticResolver";
import { renderLayer1 } from "../render/UIRenderEngine";
import { uiDesignStoreV2 } from "../reference/UIDesignStore";
import type { UIResolvedComponent, UILayer2Override } from "../types";
import { PhoneChrome } from "./PhoneChrome";

type RenderPhase = "idle" | "layer1" | "layer2" | "complete";

export function ViewportPane() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [scale, setScale] = useState(1);
  const [phase, setPhase] = useState<RenderPhase>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedRef = useRef<UIResolvedComponent[]>([]);
  const l2OverridesRef = useRef<UILayer2Override[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  // Scale to fit pane height
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      const h = entry.contentRect.height;
      if (h > 0) setScale(h / MOBILE_FRAME_HEIGHT);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Subscribe to canvas changes + design store — Layer 1 render
  useEffect(() => {
    doLayer1();

    const handleChange = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(doLayer1, 200);
    };

    canvasEngine.on("canvas:changed", handleChange);

    // Re-render when design system changes
    const unsubDS = uiDesignStoreV2.subscribe(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(doLayer1, 100);
    });

    // Layer 2 trigger — "Render" button in toolbar
    const handleRenderRequest = () => doLayer2();
    canvasEngine.on("render:requested", handleRenderRequest);

    return () => {
      canvasEngine.off("canvas:changed", handleChange);
      canvasEngine.off("render:requested", handleRenderRequest);
      unsubDS();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Layer 1: synchronous render ─────────────────────────────
  const doLayer1 = useCallback(() => {
    const doc = canvasEngine.getDocument();
    const ds = uiDesignStoreV2.getEffectiveDesignSystem();
    const fw = doc.frame.width;
    const fh = doc.frame.height;

    // Resolve canvas shapes → UIResolvedComponent[]
    const resolved = resolveUIComponents(doc.shapes, fw, fh);
    resolvedRef.current = resolved;

    // Render with any existing Layer 2 overrides
    const html = renderLayer1(resolved, ds, l2OverridesRef.current.length > 0 ? l2OverridesRef.current : undefined);
    setSrcDoc(html);
    setPhase("layer1");
  }, []);

  // ── Layer 2: async AI render ────────────────────────────────
  const doLayer2 = useCallback(async () => {
    const resolved = resolvedRef.current;
    if (resolved.length === 0) return;

    // Abort any in-flight Layer 2 request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPhase("layer2");

    const ds = uiDesignStoreV2.getEffectiveDesignSystem();
    const doc = canvasEngine.getDocument();
    const globalNotes = resolved[0]?.globalNotes ?? [];

    try {
      const res = await fetch("/api/ui-render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          components: resolved,
          designSystem: ds,
          globalNotes,
          frameContext: {
            width: doc.frame.width,
            height: doc.frame.height,
            name: doc.frame.id,
          },
        }),
      });

      if (!res.ok || !res.body) {
        setPhase("layer1");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.done && data.overrides) {
              // Final: merge overrides and re-render
              l2OverridesRef.current = data.overrides;
              const html = renderLayer1(resolvedRef.current, ds, data.overrides);
              setSrcDoc(html);
              setPhase("complete");
            }
          } catch {
            // Ignore parse errors on delta chunks
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("[ViewportPane] Layer 2 error:", err);
      }
      setPhase("layer1");
    }
  }, []);

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
            background: "rgba(99,102,241,0.9)",
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

      <PhoneChrome width={scaledWidth} height={scaledHeight} scale={scale}>
        {srcDoc ? (
          <iframe
            key="ui-viewport"
            srcDoc={srcDoc}
            title="UI Viewport"
            sandbox="allow-scripts"
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
              stroke="#ccc"
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
                color: "#bbb",
                fontFamily: "var(--font-poppins), sans-serif",
                margin: 0,
              }}
            >
              Draw shapes inside the frame
            </p>
          </div>
        )}
      </PhoneChrome>
    </div>
  );
}
