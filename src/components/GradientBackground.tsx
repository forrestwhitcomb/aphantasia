"use client";

import { useEffect, useRef } from "react";

/**
 * Full-viewport gradient background using exported image from Figma.
 * Image: /public/BackgroundAph.png (3456×4826)
 * Fallback: #F0EEE6 cream
 * Subtle parallax: image shifts at 0.03× scroll speed for a hint of depth.
 */
export function GradientBackground() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        img.style.transform = `translateY(${window.scrollY * -0.03}px)`;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        backgroundColor: "#F0EEE6",
      }}
    >
      <img
        ref={imgRef}
        src="/BackgroundAph.png"
        alt=""
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          willChange: "transform",
        }}
      />
    </div>
  );
}
