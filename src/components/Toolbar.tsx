"use client";

import { useState, useEffect, useCallback } from "react";
import { canvasEngine } from "@/engine";
import type { CanvasTool } from "@/engine";
import { SparkleIcon } from "@/components/SparkleIcon";
import { DNAToolbarPill } from "@/dna/DNAToolbarPill";
import { DNAEditor } from "@/dna/DNAEditor";

type ToolDef = {
  id: CanvasTool;
  label: string;
  shortcut: string;
};

const TOOLS: ToolDef[] = [
  { id: "select", label: "Select", shortcut: "V" },
  { id: "rectangle", label: "Rectangle", shortcut: "R" },
  { id: "roundedRect", label: "Rounded", shortcut: "U" },
  { id: "text", label: "Text", shortcut: "T" },
  { id: "note", label: "Note", shortcut: "N" },
  { id: "frame", label: "Frame", shortcut: "F" },
];

function ToolIcon({ tool }: { tool: CanvasTool }) {
  switch (tool) {
    case "select":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        </svg>
      );
    case "rectangle":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="0" />
        </svg>
      );
    case "roundedRect":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
        </svg>
      );
    case "text":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7V4h16v3" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="8" y1="20" x2="16" y2="20" />
        </svg>
      );
    case "note":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="12" y2="17" />
        </svg>
      );
    case "frame":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="0" strokeDasharray="4 2" />
          <line x1="2" y1="6" x2="22" y2="6" />
        </svg>
      );
  }
}

export function Toolbar({ outputType }: { outputType?: string }) {
  const [activeTool, setActiveTool] = useState<CanvasTool>(canvasEngine.getTool());

  // Poll tool state from engine (syncs with keyboard shortcuts)
  useEffect(() => {
    const handler = () => setActiveTool(canvasEngine.getTool());
    canvasEngine.on("canvas:changed", handler);
    // Also check periodically for tool changes that don't emit canvas:changed
    const interval = setInterval(handler, 100);
    return () => {
      canvasEngine.off("canvas:changed", handler);
      clearInterval(interval);
    };
  }, []);

  const selectTool = useCallback((t: CanvasTool) => {
    canvasEngine.setTool(t);
    setActiveTool(t);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: "rgba(26,26,26,0.92)",
        backdropFilter: "blur(12px)",
        borderRadius: "1rem",
        padding: "6px 12px",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        fontFamily: "var(--font-poppins)",
      }}
    >
      {TOOLS.map((t) => (
        <button
          key={t.id}
          onClick={() => selectTool(t.id)}
          title={`${t.label} (${t.shortcut})`}
          style={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
            background: activeTool === t.id ? "rgba(255,255,255,0.15)" : "transparent",
            color: activeTool === t.id ? "#fff" : "rgba(255,255,255,0.5)",
          }}
        >
          <ToolIcon tool={t.id} />
        </button>
      ))}

      {/* Add Component button */}
      <button
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent("aphantasia:open-component-browser")
          )
        }
        title="Add Component (/)"
        style={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          transition: "background 0.15s, color 0.15s",
          background: "transparent",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* AI button — grayed out, coming soon */}
      <button
        title="AI Assistant (Coming soon)"
        disabled
        style={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          border: "none",
          cursor: "not-allowed",
          background: "transparent",
          color: "rgba(255,255,255,0.2)",
          opacity: 0.5,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
        </svg>
      </button>

      {outputType !== "ui" && (
        <>
          {/* Separator */}
          <div style={{ width: 1, height: 24, background: "#333", margin: "0 8px" }} />

          {/* DNA Pill */}
          <DNAToolbarPill />

          {/* Separator */}
          <div style={{ width: 1, height: 24, background: "#333", margin: "0 8px" }} />

          {/* Render button */}
          <button
            onClick={() => canvasEngine.requestRender()}
            style={{
              padding: "8px 20px",
              background: "#fff",
              color: "#000",
              borderRadius: "0.75rem",
              border: "none",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-poppins)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <SparkleIcon size={16} />
            Render
          </button>

          {/* Deep Render button */}
          <button
            onClick={() => canvasEngine.requestDeepRender()}
            title="Deep Render — bespoke AI-generated HTML"
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
              borderRadius: "0.75rem",
              border: "1px solid rgba(255,255,255,0.12)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-poppins)",
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "border-color 0.15s, color 0.15s",
            }}
          >
            <span style={{ fontSize: 14 }}>✦</span>
            Deep
          </button>

          {/* Deploy button */}
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("aphantasia:open-deploy-modal")
              )
            }
            title="Deploy to GitHub"
            style={{
              padding: "8px 20px",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              borderRadius: "0.75rem",
              border: "1px solid rgba(255,255,255,0.15)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-poppins)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "border-color 0.15s, color 0.15s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14l8-8 8 8" />
              <path d="M12 6v14" />
            </svg>
            Deploy
          </button>
        </>
      )}
      {/* DNA Editor panel (slides out on demand) */}
      <DNAEditor />
    </div>
  );
}
