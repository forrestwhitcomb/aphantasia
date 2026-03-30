"use client";

// ============================================================
// APHANTASIA for REBTEL — Landing Page
// ============================================================
// First screen: prompt input or "Just let me start drawing".
// Submitting a prompt navigates to /rebtel/canvas?prompt=...
// Drawing button navigates to /rebtel/canvas (empty canvas).
// Gradient blob gently follows the mouse cursor.
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import opentype, { type Glyph } from "opentype.js";
import "./rebtel.css";

gsap.registerPlugin(MorphSVGPlugin);

const SUGGESTIONS = [
  "Create a new flow for sending an MTU to Cuba",
  "Design an onboarding experience",
];

export default function RebtelLandingPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [projectFile, setProjectFile] = useState<{ name: string; content: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgHeadingRef = useRef<SVGSVGElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0.7, y: 0.3 }); // normalized 0-1 (default top-right)
  const currentRef = useRef({ x: 0.7, y: 0.3 });
  const rafRef = useRef<number>(0);

  // Smooth blob animation loop — lerps toward mouse position
  const animate = useCallback(() => {
    const lerp = 0.03; // lower = smoother/slower
    const cur = currentRef.current;
    const tgt = targetRef.current;

    cur.x += (tgt.x - cur.x) * lerp;
    cur.y += (tgt.y - cur.y) * lerp;

    if (blobRef.current) {
      // Map normalized coords to blob position (offset so blob center follows)
      const bx = cur.x * 100 - 20;
      const by = cur.y * 100 - 20;
      blobRef.current.style.right = `${-bx + 50}%`;
      blobRef.current.style.top = `${by - 10}%`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // Track mouse position (normalized 0-1)
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

  // GSAP morph-from-shapes: opentype.js extracts real glyph paths, MorphSVGPlugin morphs from random shapes
  useEffect(() => {
    const svg = svgHeadingRef.current;
    if (!svg) return;

    // Random geometric shapes characters morph FROM
    const shapes = [
      "M0,0 L16,0 L16,16 L0,16 Z",                              // square
      "M8,0 L16,16 L0,16 Z",                                     // triangle up
      "M8,0 L16,8 L8,16 L0,8 Z",                                 // diamond
      "M8,0 A8,8 0 1,1 8,16 A8,8 0 1,1 8,0 Z",                  // circle
      "M0,0 L16,0 L12,16 L4,16 Z",                               // trapezoid
      "M4,0 L12,0 L16,8 L12,16 L4,16 L0,8 Z",                   // hexagon
      "M0,16 L8,0 L16,16 Z",                                     // triangle down
      "M0,8 L8,0 L16,8 L8,16 Z",                                 // rotated square
    ];

    const line1 = "What do you want to make";
    const line2 = "today, Rebby?";
    const fontSize = 38;

    async function runMorph() {
      // Load font with opentype.js to get real glyph outlines
      const font = await opentype.load("/fonts/rebtel/KHTeka-Bold.ttf");

      // Clear SVG
      const svgEl = svg!;
      while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

      // Get line widths for centering (opentype measures in font units, scale to fontSize)
      const scale = fontSize / font.unitsPerEm;
      const line1Glyphs = font.stringToGlyphs(line1);
      const line2Glyphs = font.stringToGlyphs(line2);

      const measureLine = (glyphs: Glyph[]) =>
        glyphs.reduce((w, g) => w + (g.advanceWidth || 0) * scale, 0);

      const line1Width = measureLine(line1Glyphs);
      const line2Width = measureLine(line2Glyphs);

      const baselineY1 = 36;
      const baselineY2 = 80;

      let globalIdx = 0;

      const layoutLine = (
        text: string,
        glyphs: Glyph[],
        lineWidth: number,
        baselineY: number,
      ) => {
        let x = 340 - lineWidth / 2;

        for (let i = 0; i < glyphs.length; i++) {
          const glyph = glyphs[i];
          const char = text[i];
          const advW = (glyph.advanceWidth || 0) * scale;

          if (char === " ") {
            x += advW;
            continue;
          }

          // Get SVG path data from glyph — opentype y-axis is flipped (up = positive)
          const glyphPath = glyph.getPath(x, baselineY, fontSize);
          const pathData = glyphPath.toPathData(2);

          if (!pathData || pathData.trim() === "") {
            x += advW;
            continue;
          }

          // Create the SVG path for the final letter
          const letterPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
          letterPath.setAttribute("d", pathData);
          letterPath.setAttribute("fill", "#1a1a2e");
          svgEl.appendChild(letterPath);

          // Build a random start shape aligned to the baseline
          const bbox = letterPath.getBBox();
          const cx2 = bbox.x + bbox.width / 2;
          // Anchor vertically to a consistent line (baseline - half cap height)
          const cy2 = baselineY - fontSize * 0.35;
          const s = 10; // uniform size for all shapes

          // Generate shape path translated to character position
          const shapeTemplates = [
            `M${cx2-s},${cy2-s} L${cx2+s},${cy2-s} L${cx2+s},${cy2+s} L${cx2-s},${cy2+s} Z`,  // square
            `M${cx2},${cy2-s} L${cx2+s},${cy2+s} L${cx2-s},${cy2+s} Z`,                          // triangle
            `M${cx2},${cy2-s} L${cx2+s},${cy2} L${cx2},${cy2+s} L${cx2-s},${cy2} Z`,            // diamond
            `M${cx2-s*0.6},${cy2-s} L${cx2+s*0.6},${cy2-s} L${cx2+s},${cy2} L${cx2+s*0.6},${cy2+s} L${cx2-s*0.6},${cy2+s} L${cx2-s},${cy2} Z`, // hexagon
          ];
          const randomShape = shapeTemplates[Math.floor(Math.random() * shapeTemplates.length)];

          // Morph from shape to letter
          gsap.set(letterPath, {
            morphSVG: randomShape,
            opacity: 1,
          });

          gsap.to(letterPath, {
            morphSVG: pathData,
            opacity: 1,
            duration: 1.0,
            ease: "power2.inOut",
            delay: 0.3 + globalIdx * 0.025,
          });

          globalIdx++;
          x += advW;
        }
      };

      layoutLine(line1, line1Glyphs, line1Width, baselineY1);
      layoutLine(line2, line2Glyphs, line2Width, baselineY2);
    }

    runMorph();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
    }
  }, [prompt]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".md") && !file.name.endsWith(".txt") && !file.name.endsWith(".markdown")) {
      alert("Please upload a .md or .txt file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) setProjectFile({ name: file.name, content });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    // Store project context in sessionStorage for the canvas page to pick up
    if (projectFile) {
      sessionStorage.setItem("rebtel:projectContext", projectFile.content);
      sessionStorage.setItem("rebtel:projectFileName", projectFile.name);
    }
    router.push(`/rebtel/canvas?prompt=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(prompt);
    }
  };

  return (
    <>
      {/* Gradient background with mouse-following blob + grain */}
      <div className="rebtel-bg">
        <div ref={blobRef} className="rebtel-bg__blob" />
        <svg className="rebtel-bg__grain" width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      <div className="rebtel-landing">
        <div className="rebtel-landing__content">
          <img
            src="/character.png"
            alt=""
            width={80}
            height={80}
            style={{ objectFit: "contain", marginBottom: -12 }}
          />
          <div className="rebtel-landing__heading" style={{ minHeight: "2.4em" }}>
            <svg
              ref={svgHeadingRef}
              viewBox="0 0 680 92"
              width="680"
              height="92"
              style={{ overflow: "visible" }}
            />
          </div>

          {/* Suggestion chips */}
          <div className="rebtel-landing__chips">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="rebtel-landing__chip"
                onClick={() => handleSubmit(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input card */}
          <div className="rebtel-landing__input-card">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.txt,.markdown"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />

            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Start writing..."
              className="rebtel-landing__textarea"
              rows={3}
            />

            {/* File indicator */}
            {projectFile && (
              <div className="rebtel-landing__file-indicator">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{projectFile.name}</span>
                <button
                  onClick={() => setProjectFile(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit", opacity: 0.5, fontSize: 16, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            )}

            <div className="rebtel-landing__input-footer">
              {/* Upload button */}
              <button
                className="rebtel-landing__upload-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Upload project brief (.md)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <div style={{ flex: 1 }} />
              <button
                className="rebtel-landing__send-btn"
                onClick={() => handleSubmit(prompt)}
                disabled={!prompt.trim()}
                title="Generate flow (Cmd+Enter)"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          {/* Skip to canvas */}
          <button
            className="rebtel-landing__draw-btn"
            onClick={() => router.push("/rebtel/canvas")}
          >
            You wouldn&apos;t get it, bot
          </button>
        </div>
      </div>
    </>
  );
}
