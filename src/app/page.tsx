"use client";

import { useState } from "react";
import { SplashHero } from "@/components/SplashHero";
import { GradientBackground } from "@/components/GradientBackground";
import { CanvasView } from "@/engine";
import { PreviewPane } from "@/components/PreviewPane";
import { UIPreviewPane } from "@/components/UIPreviewPane";
import { Toolbar } from "@/components/Toolbar";
import { OutputToggle } from "@/components/OutputToggle";
import type { OutputType } from "@/components/OutputToggle";
import { AICallCounter } from "@/components/AICallCounter";
import { ComponentBrowser } from "@/components/ComponentBrowser";
import { DeployModal } from "@/components/DeployModal";
import { getCustomEngine } from "@/engine/engines/CustomCanvasEngine";

export default function Home() {
  const [outputType, setOutputType] = useState<OutputType>("site");

  function handleOutputChange(type: OutputType) {
    const engine = getCustomEngine();
    if (type === "ui") {
      engine.initMobileUIFrame();
    } else {
      if (outputType === "ui") {
        // Leaving UI mode — restore desktop frame
        engine.restoreDesktopFrame();
      } else {
        engine.setOutputType(type);
      }
    }
    setOutputType(type);
  }

  return (
    <div style={{ minHeight: "calc(175vh - 100px)", position: "relative" }}>
      {/* Gradient background — fixed, behind everything */}
      <GradientBackground />

      {/* Sticky nav bar — persists on scroll */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          height: 113,
          display: "flex",
          alignItems: "center",
          padding: "0 54px",
          zIndex: 100,
          fontFamily: "var(--font-poppins), sans-serif",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 24,
            fontWeight: 700,
            color: "#000000",
            letterSpacing: "0.02em",
          }}
        >
          <img
            src="/logo_black.png"
            alt="Aphantasia logo"
            style={{ width: 36, height: 36 }}
          />
          Aphantasia
        </span>
      </nav>

      {/* Content layer */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Splash content — centered in first viewport */}
        <SplashHero />

        {/* Editor panels — floating cards on gradient with visible gutters */}
        <div
          style={{
            marginTop: "calc(-25vh - 100px)",
            height: "100vh",
            position: "relative",
            padding: "0 54px 24px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              gap: 16,
            }}
          >
            {/* Canvas panel */}
            <div
              className="relative overflow-hidden"
              style={{
                flex: 2,
                borderRadius: 16,
                background: "#F5F5F5",
                boxShadow: "0 4px 22.4px rgba(155,155,155,0.25)",
              }}
            >
              {/* Output type toggle — top center of canvas */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 50,
                }}
              >
                <OutputToggle value={outputType} onChange={handleOutputChange} />
              </div>

              <CanvasView />
              <Toolbar outputType={outputType} />
              <AICallCounter />
              <ComponentBrowser />
              <DeployModal />
            </div>

            {/* Preview panel */}
            <div
              className="overflow-hidden"
              style={{
                flex: 1,
                borderRadius: 16,
                background: outputType === "ui" ? "#F0F0F0" : "#FFFFFF",
                boxShadow: "0 4px 22.4px rgba(155,155,155,0.25)",
              }}
            >
              {outputType === "ui" ? <UIPreviewPane /> : <PreviewPane />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
