"use client";

// ============================================================
// APHANTASIA for REBTEL — Canvas Workspace Page
// ============================================================
// Two-pane layout: Canvas (with floating chat) + Viewport
// Both sit on top of the warm gradient background.
// Chat floats as a glass panel on the left side of the canvas.
// ============================================================

import { useEffect, useState, Suspense } from "react";
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

  useEffect(() => {
    const engine = getCustomEngine();
    engine.initMobileUIFrame();
    engine.setOutputType("rebtel");
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      {/* Gradient background */}
      <div className="rebtel-bg">
        <div className="rebtel-bg__blob" />
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
                width: "100%",
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
