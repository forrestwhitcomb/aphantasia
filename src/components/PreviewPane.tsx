"use client";

import { useEffect, useRef, useState } from "react";
import { canvasEngine } from "@/engine";
import { resolveSemantics } from "@/semantic/SemanticResolver";
import { WebRenderer } from "@/render/renderers/WebRenderer";
import { FRAME_WIDTH } from "@/engine/engines/CustomCanvasEngine";

const renderer = new WebRenderer();

export function PreviewPane() {
  const [srcDoc, setSrcDoc] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scale the 1280px iframe to fit whatever width the pane has
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(w / FRAME_WIDTH);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Render immediately on mount, then on every canvas change
  useEffect(() => {
    doRender();
    canvasEngine.on("canvas:changed", handleChange);
    return () => {
      canvasEngine.off("canvas:changed", handleChange);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // Phase 1 is instant — 200ms debounce is just to avoid thrashing mid-drag
    debounceRef.current = setTimeout(doRender, 200);
  }

  async function doRender() {
    const doc = canvasEngine.getDocument();
    const resolved = await resolveSemantics(doc);
    const output = renderer.renderPhase1(resolved);
    setSrcDoc(output.html);
  }

  const iframeHeight = scale > 0 ? `${100 / scale}%` : "100%";

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      {srcDoc && (
        <iframe
          key="preview"
          srcDoc={srcDoc}
          title="Live Preview"
          sandbox="allow-scripts"
          style={{
            width: FRAME_WIDTH,
            height: iframeHeight,
            border: "none",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            display: "block",
          }}
        />
      )}
    </div>
  );
}
