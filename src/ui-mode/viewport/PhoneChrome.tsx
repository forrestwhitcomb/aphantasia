"use client";

// ============================================================
// PhoneChrome — CSS-only device bezel around the viewport iframe
// ============================================================
// Renders a rounded phone frame with:
//   - Device bezel (rounded corners, shadow)
//   - Dynamic island notch (top center)
//   - Home indicator bar (bottom center)
//
// All visual elements are CSS-only decorations AROUND the iframe,
// not inside it. The iframe content handles its own status bar
// and home indicator via the render engine.
// ============================================================

import { type ReactNode } from "react";

interface PhoneChromeProps {
  children: ReactNode;
  /** Scaled width of the phone content in px */
  width: number;
  /** Scaled height of the phone content in px */
  height: number;
  /** Current scale factor */
  scale: number;
}

export function PhoneChrome({ children, width, height, scale }: PhoneChromeProps) {
  const bezelRadius = 44 * scale;
  const notchWidth = 126 * scale;
  const notchHeight = 37 * scale;
  const notchRadius = 20 * scale;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        flexShrink: 0,
        borderRadius: bezelRadius,
        overflow: "hidden",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)",
        background: "#000",
      }}
    >
      {/* Dynamic Island notch */}
      <div
        style={{
          position: "absolute",
          top: 10 * scale,
          left: "50%",
          transform: "translateX(-50%)",
          width: notchWidth,
          height: notchHeight,
          borderRadius: notchRadius,
          background: "#000",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />

      {/* Content (iframe) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: bezelRadius,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
