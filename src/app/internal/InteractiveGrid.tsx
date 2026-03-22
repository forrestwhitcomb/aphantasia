"use client";

import { useEffect, useRef, useCallback } from "react";

const GRID_SPACING = 40;
const CROSS_SIZE = 6;
const CROSS_COLOR = "#2a2a2a";
const CROSS_COLOR_HOVER = "#444";
const INFLUENCE_RADIUS = 120;
const MAX_DISPLACEMENT = 14;
const SPRING_STIFFNESS = 0.08;
const DAMPING = 0.85;

interface GridPoint {
  baseX: number;
  baseY: number;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
}

export function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<GridPoint[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const buildGrid = useCallback((w: number, h: number) => {
    const cols = Math.ceil(w / GRID_SPACING) + 2;
    const rows = Math.ceil(h / GRID_SPACING) + 2;
    const offsetX = ((w % GRID_SPACING) / 2) - GRID_SPACING;
    const offsetY = ((h % GRID_SPACING) / 2) - GRID_SPACING;
    const pts: GridPoint[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pts.push({
          baseX: offsetX + c * GRID_SPACING,
          baseY: offsetY + r * GRID_SPACING,
          dx: 0,
          dy: 0,
          vx: 0,
          vy: 0,
        });
      }
    }
    pointsRef.current = pts;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
      buildGrid(w, h);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const animate = () => {
      const { w, h } = sizeRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const pts = pointsRef.current;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const distX = (p.baseX + p.dx) - mx;
        const distY = (p.baseY + p.dy) - my;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < INFLUENCE_RADIUS && dist > 0) {
          const force = (1 - dist / INFLUENCE_RADIUS) * MAX_DISPLACEMENT;
          const angle = Math.atan2(distY, distX);
          p.vx += Math.cos(angle) * force * 0.06;
          p.vy += Math.sin(angle) * force * 0.06;
        }

        p.vx += (-p.dx * SPRING_STIFFNESS);
        p.vy += (-p.dy * SPRING_STIFFNESS);
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.dx += p.vx;
        p.dy += p.vy;

        const x = p.baseX + p.dx;
        const y = p.baseY + p.dy;

        const proximity = dist < INFLUENCE_RADIUS ? 1 - dist / INFLUENCE_RADIUS : 0;
        ctx.strokeStyle = proximity > 0
          ? lerpColor(CROSS_COLOR, CROSS_COLOR_HOVER, proximity)
          : CROSS_COLOR;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - CROSS_SIZE, y);
        ctx.lineTo(x + CROSS_SIZE, y);
        ctx.moveTo(x, y - CROSS_SIZE);
        ctx.lineTo(x, y + CROSS_SIZE);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [buildGrid]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        zIndex: 0,
      }}
    />
  );
}

function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    const v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  };
  const ca = parse(a);
  const cb = parse(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
