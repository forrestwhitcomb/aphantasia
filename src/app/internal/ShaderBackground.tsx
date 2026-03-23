"use client";

// ============================================================
// ASCII Matrix Animated Background
// ============================================================
// Renders a grid of animated characters (0-9, A-Z, symbols)
// on a dark background. Characters change over time and are
// colored by flowing noise patterns — amber, green, blue, red
// accents on a mostly dim grey field.
//
// Uses Canvas 2D fillText for reliable character rendering.
// ============================================================

import { useRef, useEffect } from "react";

const CHARS = "0123456789ABCDEFGHKLMOPRSTUVXYZ#=!:.;?";
const CELL_W = 11;
const CELL_H = 15;
const FONT = `${CELL_H - 3}px monospace`;
const FPS = 24;

// Fast hash functions (sine-based, always returns 0..1)
function hash2(x: number, y: number): number {
  const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

function hash3(x: number, y: number, z: number): number {
  const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return v - Math.floor(v);
}

// Simple 3D value noise with smooth interpolation
function noise3(x: number, y: number, z: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const sz = fz * fz * (3 - 2 * fz);

  const n000 = hash3(ix, iy, iz);
  const n100 = hash3(ix + 1, iy, iz);
  const n010 = hash3(ix, iy + 1, iz);
  const n110 = hash3(ix + 1, iy + 1, iz);
  const n001 = hash3(ix, iy, iz + 1);
  const n101 = hash3(ix + 1, iy, iz + 1);
  const n011 = hash3(ix, iy + 1, iz + 1);
  const n111 = hash3(ix + 1, iy + 1, iz + 1);

  const nx00 = n000 + (n100 - n000) * sx;
  const nx10 = n010 + (n110 - n010) * sx;
  const nx01 = n001 + (n101 - n001) * sx;
  const nx11 = n011 + (n111 - n011) * sx;

  const nxy0 = nx00 + (nx10 - nx00) * sy;
  const nxy1 = nx01 + (nx11 - nx01) * sy;

  return nxy0 + (nxy1 - nxy0) * sz;
}

// Multi-octave noise
function fbm(x: number, y: number, z: number): number {
  return noise3(x, y, z) * 0.6 + noise3(x * 2, y * 2, z * 2) * 0.3 + noise3(x * 4, y * 4, z * 4) * 0.1;
}

// Color palettes: [dimR, dimG, dimB, brightR, brightG, brightB]
const PALETTES = [
  [0.22, 0.20, 0.28, 0.55, 0.50, 0.65],    // grey (most common)
  [0.20, 0.18, 0.25, 0.50, 0.45, 0.60],    // grey variant
  [0.40, 0.25, 0.08, 0.95, 0.65, 0.15],    // amber
  [0.10, 0.35, 0.20, 0.25, 0.90, 0.50],    // green
  [0.40, 0.15, 0.08, 0.95, 0.35, 0.18],    // red/orange
  [0.10, 0.18, 0.40, 0.30, 0.55, 0.95],    // blue
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;
    const interval = 1000 / FPS;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
    }

    resize();
    window.addEventListener("resize", resize);

    function draw(timestamp: number) {
      animId = requestAnimationFrame(draw);

      if (timestamp - lastTime < interval) return;
      lastTime = timestamp;

      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cols = Math.ceil(w / CELL_W);
      const rows = Math.ceil(h / CELL_H);
      const t = timestamp * 0.001; // seconds

      // Clear
      ctx!.fillStyle = "#06050b";
      ctx!.fillRect(0, 0, w, h);

      ctx!.font = FONT;
      ctx!.textBaseline = "top";

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * CELL_W;
          const y = row * CELL_H;

          // Character selection — changes every ~0.7s per cell, staggered
          const timeBucket = Math.floor(t * 1.4 + hash2(col, row) * 5);
          const charIdx = Math.floor(hash3(col, row, timeBucket) * CHARS.length);
          const ch = CHARS[charIdx];

          // Flow noise — drives brightness and color waves
          const noiseX = col * 0.12;
          const noiseY = row * 0.12;
          const flow = fbm(noiseX, noiseY, t * 0.18);

          const isBright = smoothstep(0.35, 0.6, flow);

          // Color selection — per cell, shifts slowly
          const colorBucket = Math.floor(t * 0.3 + hash2(col + 999, row + 777) * 8);
          const colorSeed = hash3(col, row, colorBucket);
          let palIdx: number;
          if (colorSeed < 0.45) palIdx = 0;       // grey
          else if (colorSeed < 0.55) palIdx = 1;   // grey variant
          else if (colorSeed < 0.65) palIdx = 2;   // amber
          else if (colorSeed < 0.75) palIdx = 3;   // green
          else if (colorSeed < 0.85) palIdx = 4;   // red
          else palIdx = 5;                          // blue

          const pal = PALETTES[palIdx];
          // Interpolate color between dim and bright based on flow
          const r = lerp(pal[0], pal[3], isBright);
          const g = lerp(pal[1], pal[4], isBright);
          const b = lerp(pal[2], pal[5], isBright);

          // Final color — direct RGB values, pal already in 0..1 range
          const fr = Math.round(Math.min(255, r * 255));
          const fg = Math.round(Math.min(255, g * 255));
          const fb = Math.round(Math.min(255, b * 255));

          ctx!.fillStyle = `rgb(${fr},${fg},${fb})`;
          ctx!.fillText(ch, x + 1, y + 2);
        }
      }
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        borderRadius: "inherit",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
