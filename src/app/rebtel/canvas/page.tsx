"use client";

// ============================================================
// APHANTASIA for REBTEL — Canvas Workspace Page
// ============================================================
// Two-pane layout: Canvas (with floating chat) + Viewport
// Both sit on top of the warm gradient background.
// Chat floats as a glass panel on the left side of the canvas.
// ============================================================

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CanvasView } from "@/engine";
import { Toolbar } from "@/components/Toolbar";
import { getCustomEngine } from "@/engine/engines/CustomCanvasEngine";
import { RebtelViewportPane } from "@/rebtel/viewport/RebtelViewportPane";
import { ChatPanel } from "@/rebtel/chat/ChatPanel";
import { RebtelFigmaConnect } from "@/rebtel/canvas/RebtelFigmaConnect";
import "../rebtel.css";

function CanvasWorkspaceInner() {
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const initialPrompt = searchParams.get("prompt") || "";
  const blobRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0.7, y: 0.3 });
  const currentRef = useRef({ x: 0.7, y: 0.3 });
  const rafRef = useRef<number>(0);

  // Smooth blob animation loop — lerps toward mouse position
  const animateBlob = useCallback(() => {
    const lerp = 0.03;
    const cur = currentRef.current;
    const tgt = targetRef.current;
    cur.x += (tgt.x - cur.x) * lerp;
    cur.y += (tgt.y - cur.y) * lerp;
    if (blobRef.current) {
      const bx = cur.x * 100 - 20;
      const by = cur.y * 100 - 20;
      blobRef.current.style.right = `${-bx + 50}%`;
      blobRef.current.style.top = `${by - 10}%`;
    }
    rafRef.current = requestAnimationFrame(animateBlob);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animateBlob);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animateBlob]);

  // Track mouse position
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      targetRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const engine = getCustomEngine();
    engine.initMobileUIFrame();
    engine.setOutputType("rebtel");
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      {/* Gradient background + grain */}
      <div className="rebtel-bg">
        <div ref={blobRef} className="rebtel-bg__blob" />
        <svg className="rebtel-bg__grain" width="100%" height="100%">
          <filter id="grain-canvas">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-canvas)" />
        </svg>
      </div>

      <div className="rebtel-workspace-layout">
        <div className="rebtel-workspace">
          {/* Left: Canvas with floating chat overlay */}
          <div className="rebtel-canvas-pane">
            <CanvasView />
            <Toolbar outputType="rebtel" />

            {/* Figma connect widget — top-left */}
            <RebtelFigmaConnect />

            {/* Floating chat panel — bottom-left */}
            <RebtelChatFloat initialPrompt={initialPrompt} />
          </div>

          {/* Right: Viewport */}
          <div className="rebtel-viewport-pane">
            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: 360,
                maxWidth: 360,
                height: "100%",
                padding: "3% 0",
                boxSizing: "border-box",
              }}
            >
              <RebtelViewportPane />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** Collapsible floating chat panel */
function RebtelChatFloat({ initialPrompt }: { initialPrompt: string }) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        title="Open chat"
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 100,
          width: 44,
          height: 44,
          borderRadius: 14,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="rebtel-chat-float">
      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(true)}
        title="Minimize chat"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "rgba(0,0,0,0.05)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(26,26,46,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <ChatPanel initialPrompt={initialPrompt} />
    </div>
  );
}

export default function CanvasWorkspacePage() {
  return (
    <Suspense fallback={null}>
      <CanvasWorkspaceInner />
    </Suspense>
  );
}
