// ============================================================
// APHANTASIA for REBTEL — Screen Navigator (Phase 4)
// ============================================================
// Renders screen navigation controls below the phone chrome.
// Shows left/right arrows with current screen title + index.
// ============================================================

"use client";

import React from "react";

interface ScreenEntry {
  screenId: string;
  title: string;
}

interface ScreenNavigatorProps {
  screens: ScreenEntry[];
  activeScreenId: string;
  onNavigate: (screenId: string) => void;
}

export function ScreenNavigator({ screens, activeScreenId, onNavigate }: ScreenNavigatorProps) {
  if (screens.length <= 1) return null;

  const currentIndex = screens.findIndex((s) => s.screenId === activeScreenId);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const isFirst = safeIndex === 0;
  const isLast = safeIndex === screens.length - 1;
  const currentScreen = screens[safeIndex];

  const goPrev = () => {
    if (!isFirst) onNavigate(screens[safeIndex - 1].screenId);
  };

  const goNext = () => {
    if (!isLast) onNavigate(screens[safeIndex + 1].screenId);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        height: 36,
        maxHeight: 36,
        flexShrink: 0,
        fontFamily: "var(--font-poppins), sans-serif",
        userSelect: "none",
      }}
    >
      {/* Left arrow */}
      <button
        onClick={goPrev}
        disabled={isFirst}
        aria-label="Previous screen"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.15)",
          background: isFirst ? "rgba(255,255,255,0.05)" : "rgba(230,57,70,0.2)",
          color: isFirst ? "rgba(255,255,255,0.25)" : "#E63946",
          cursor: isFirst ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          fontSize: 14,
          lineHeight: 1,
          transition: "background 0.15s, color 0.15s",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Screen label */}
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "rgba(255,255,255,0.7)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 200,
        }}
      >
        <span style={{ color: "#E63946", fontWeight: 600 }}>
          {safeIndex + 1}
        </span>
        <span style={{ opacity: 0.5 }}> of {screens.length}</span>
        {currentScreen?.title && (
          <span style={{ marginLeft: 6 }}>
            : {currentScreen.title}
          </span>
        )}
      </span>

      {/* Right arrow */}
      <button
        onClick={goNext}
        disabled={isLast}
        aria-label="Next screen"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.15)",
          background: isLast ? "rgba(255,255,255,0.05)" : "rgba(230,57,70,0.2)",
          color: isLast ? "rgba(255,255,255,0.25)" : "#E63946",
          cursor: isLast ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          fontSize: 14,
          lineHeight: 1,
          transition: "background 0.15s, color 0.15s",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
