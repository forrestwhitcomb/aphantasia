"use client";

import { useEffect, useState } from "react";
import { CanvasView } from "@/engine";
import { ViewportPane } from "@/ui-mode/viewport/ViewportPane";
import { Toolbar } from "@/components/Toolbar";
import { AICallCounter } from "@/components/AICallCounter";
import { getCustomEngine } from "@/engine/engines/CustomCanvasEngine";
import { ShaderBackground } from "./ShaderBackground";
import "./internal.css";

export default function InternalPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const engine = getCustomEngine();
    engine.initMobileUIFrame();
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div
      data-internal-dark
      style={{
        position: "fixed",
        inset: 0,
        background: "#1a1a1a",
        display: "flex",
        overflow: "hidden",
        fontFamily: "var(--font-poppins), sans-serif",
      }}
    >
      {/* Floating nav — transparent, sits above canvas */}
      <nav
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 52,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          zIndex: 200,
          background: "transparent",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontSize: 17,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.01em",
          }}
        >
          <img
            src="/logo_white.png"
            alt="Aphantasia logo"
            style={{ width: 26, height: 26 }}
          />
          Aphantasia
        </span>
      </nav>

      {/* Canvas panel — fills full height, bleeds behind nav */}
      <div
        style={{
          flex: 3,
          position: "relative",
          background: "#1a1a1a",
        }}
      >
        {/* Sites / Slides / UI pill — floats at top-center of canvas */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 150,
            display: "flex",
            borderRadius: "1rem",
            padding: "5px 10px",
            gap: 2,
            background: "rgba(26,26,26,0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {(["Sites", "Slides", "UI"] as const).map((label) => {
            const isActive = label === "UI";
            return (
              <span
                key={label}
                style={{
                  padding: "5px 18px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: isActive ? "default" : "not-allowed",
                  background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.35)",
                  userSelect: "none",
                  fontFamily: "var(--font-poppins), sans-serif",
                }}
                title={!isActive ? "Disabled for internal UI testing" : undefined}
              >
                {label}
              </span>
            );
          })}
        </div>

        <CanvasView />
        <Toolbar outputType="ui" />
        <AICallCounter />
      </div>

      {/* Viewport panel — shader background + phone */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <ShaderBackground />
        {/* Inset wrapper — gives the phone 10% breathing room on all sides */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            padding: "5% 8%",
            boxSizing: "border-box",
          }}
        >
          <ViewportPane />
        </div>
      </div>
    </div>
  );
}
