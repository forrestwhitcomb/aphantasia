"use client";

import { useEffect, useRef, useState } from "react";
import { canvasEngine } from "@/engine";
import { uiDesignStore } from "@/lib/UIDesignStore";
import { MOBILE_FRAME_WIDTH, MOBILE_FRAME_HEIGHT } from "@/engine/engines/CustomCanvasEngine";
import { renderMobileBlock, buildMobileDocument } from "@/render/mobileComponents";
import type { MobileShapeBlock } from "@/render/mobileComponents";
import { resolveMobileSemanticTag } from "@/semantic/rules";

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

    const fw = doc.frame.width;
    const fh = doc.frame.height;

    const frameShapes = doc.shapes
      .filter((s) => s.isInsideFrame && !s.meta?._consumed)
      .sort((a, b) => a.y - b.y);

    // Resolve tags and build raw blocks
    const rawBlocks: MobileShapeBlock[] = frameShapes.map((s) => ({
      id: s.id,
      semanticTag: resolveMobileSemanticTag(s, fw, fh),
      label: s.label ?? s.content ?? "",
      x: s.x,
      y: s.y,
      width: s.width,
      height: s.height,
      isSticky: /sticky/i.test(s.label ?? "") || /sticky/i.test(s.contextNote ?? ""),
    }));

    // Group adjacent blocks with the same groupable tag into one block with itemCount.
    // e.g. 4 adjacent "split" (list) blocks → 1 block with itemCount=4
    const blocks = groupAdjacentBlocks(rawBlocks, fh);

    const bodyHtml = blocks.map((b) => renderMobileBlock(b, extractedDesignSystem)).join("\n");
    const html = buildMobileDocument(bodyHtml, extractedDesignSystem);
    setSrcDoc(html);
  }

  // ---------------------------------------------------------------------------
  // Grouping: merge adjacent same-tagged shapes into one block with itemCount
  // ---------------------------------------------------------------------------

  function groupAdjacentBlocks(blocks: MobileShapeBlock[], frameHeight: number): MobileShapeBlock[] {
    if (blocks.length < 2) return blocks;

    // Tags that should be grouped when adjacent
    const groupableTags = new Set(["split", "cards"]);
    const GAP_THRESHOLD = frameHeight * 0.03; // ~25px gap tolerance

    const result: MobileShapeBlock[] = [];
    let i = 0;

    while (i < blocks.length) {
      const current = blocks[i];

      if (!groupableTags.has(current.semanticTag)) {
        result.push(current);
        i++;
        continue;
      }

      // Collect all adjacent blocks with the same tag
      const group = [current];
      let j = i + 1;
      while (j < blocks.length) {
        const next = blocks[j];
        const prevBottom = group[group.length - 1].y + group[group.length - 1].height;
        const gap = next.y - prevBottom;
        if (next.semanticTag === current.semanticTag && gap < GAP_THRESHOLD) {
          group.push(next);
          j++;
        } else {
          break;
        }
      }

      if (group.length > 1) {
        // Merge: use the first block as the representative, set itemCount
        const merged: MobileShapeBlock = {
          ...group[0],
          label: group[0].label || group.find(g => g.label)?.label || "",
          itemCount: group.length,
          consumedIds: group.slice(1).map(g => g.id),
          height: (group[group.length - 1].y + group[group.length - 1].height) - group[0].y,
        };
        result.push(merged);
      } else {
        result.push(current);
      }

      i = j;
    }

    return result;
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
