"use client";

import { useEffect, useRef, useState } from "react";
import { canvasEngine } from "@/engine";
import { uiDesignStore } from "@/lib/UIDesignStore";
import { MOBILE_FRAME_WIDTH, MOBILE_FRAME_HEIGHT } from "@/engine/engines/CustomCanvasEngine";
import { renderMobileBlock, buildMobileDocument } from "@/render/mobileComponents";
import type { MobileShapeBlock } from "@/render/mobileComponents";

// ---------------------------------------------------------------------------
// UIPreviewPane
// ---------------------------------------------------------------------------

export function UIPreviewPane() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [srcDoc, setSrcDoc] = useState<string>("");

  // Height-based scaling — the key difference from PreviewPane (which is width-based)
  const [scale, setScale] = useState(1);
  const [actualFrameHeight, setActualFrameHeight] = useState(MOBILE_FRAME_HEIGHT);
  const isScrollable = actualFrameHeight > MOBILE_FRAME_HEIGHT;

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Subscribe to canvas changes + design store — Layer 1 only, no AI render
  useEffect(() => {
    doLayer1();

    const handleChange = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(doLayer1, 200);
    };

    canvasEngine.on("canvas:changed", handleChange);

    // Re-run layer 1 when design tokens change (e.g. after Extract)
    const unsubUI = uiDesignStore.subscribe(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(doLayer1, 200);
    });

    return () => {
      canvasEngine.off("canvas:changed", handleChange);
      unsubUI();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Layer 1: synchronous stock mobile components
  // ---------------------------------------------------------------------------

  function doLayer1() {
    const doc = canvasEngine.getDocument();
    const { extractedDesignSystem } = uiDesignStore.getState();

    const frameH = doc.frame.height;
    setActualFrameHeight(frameH);

    const frameShapes = doc.shapes
      .filter((s) => s.isInsideFrame && !s.meta?._consumed)
      .sort((a, b) => a.y - b.y);

    const blocks: MobileShapeBlock[] = frameShapes.map((s) => ({
      id: s.id,
      semanticTag: s.semanticTag ?? "section",
      label: s.label ?? s.content ?? "",
      y: s.y,
      height: s.height,
      isSticky: /sticky/i.test(s.label ?? "") || /sticky/i.test(s.contextNote ?? ""),
    }));

    const bodyHtml = blocks.map((b) => renderMobileBlock(b, extractedDesignSystem ?? undefined)).join("\n");
    const html = buildMobileDocument(bodyHtml, extractedDesignSystem ?? undefined);
    setSrcDoc(html);
  }

  // ---------------------------------------------------------------------------
  // Sizing math
  // ---------------------------------------------------------------------------

  const scaledWidth = MOBILE_FRAME_WIDTH * scale;
  // Outer container fills pane height; inner wrapper is exactly scaledWidth wide
  const iframeContainerHeight = isScrollable
    ? actualFrameHeight * scale  // taller than pane → enable scrolling
    : MOBILE_FRAME_HEIGHT * scale; // fits exactly

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        position: "relative",
        overflow: isScrollable ? "auto" : "hidden",
        background: "#F5F5F5",
      }}
    >
      {/* Scrollable area hint */}
      {isScrollable && (
        <div style={{
          position: "absolute",
          top: 8,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          fontSize: 10,
          fontWeight: 500,
          padding: "3px 8px",
          borderRadius: 6,
          zIndex: 10,
          pointerEvents: "none",
          fontFamily: "var(--font-poppins), sans-serif",
        }}>
          scrollable
        </div>
      )}

      {/* Phone chrome wrapper */}
      <div style={{
        width: scaledWidth,
        height: iframeContainerHeight,
        position: "relative",
        flexShrink: 0,
        borderRadius: scale * 16,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
      }}>
        {srcDoc ? (
          <iframe
            key="ui-preview"
            srcDoc={srcDoc}
            title="Mobile UI Preview"
            sandbox="allow-scripts"
            style={{
              width: MOBILE_FRAME_WIDTH,
              height: actualFrameHeight,
              border: "none",
              display: "block",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            gap: 10,
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2"/>
              <path d="M12 18h.01"/>
            </svg>
            <p style={{ fontSize: 12, color: "#bbb", fontFamily: "var(--font-poppins), sans-serif", margin: 0 }}>
              Draw shapes inside the frame
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
