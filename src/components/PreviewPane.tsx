"use client";

import { useEffect, useRef, useState } from "react";
import { canvasEngine } from "@/engine";
import type { CanvasDocument } from "@/engine";
import { resolveSemantics } from "@/semantic/SemanticResolver";
import { WebRenderer } from "@/render/renderers/WebRenderer";
import { FRAME_WIDTH } from "@/engine/engines/CustomCanvasEngine";
import { contextStore } from "@/context/ContextStore";
import { referenceStore } from "@/reference/ReferenceStore";
import { tokensToCSS } from "@/lib/theme";
import { aiCallTracker } from "@/lib/aiCallTracker";
import { renderBlock, shapeToBlock } from "@/render/renderSection";
import { exportStore } from "@/lib/exportStore";
import { resolveDesignDirection } from "@/render/themeResolver";
import { getLibrariesForLevel, buildScriptTags } from "@/render/cdnCatalog";
import { BASE_CSS, RESPONSIVE_CSS } from "@/render/sharedCSS";

const renderer = new WebRenderer();

type RenderPhase = "IDLE" | "LAYER1" | "LAYER2_STREAMING" | "BESPOKE";

interface BespokeFragment {
  type: string;
  html: string;
}

// Parse bespoke HTML body into per-section fragments keyed by data-aph-id
function parseBespokeFragments(html: string): Map<string, BespokeFragment> {
  const map = new Map<string, BespokeFragment>();
  const regex = /<section\s[^>]*data-aph-id="([^"]+)"[^>]*data-aph-type="([^"]+)"[^>]*>[\s\S]*?<\/section>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    map.set(match[1], { type: match[2], html: match[0] });
  }

  // Also handle reverse attribute order: data-aph-type before data-aph-id
  const regex2 = /<section\s[^>]*data-aph-type="([^"]+)"[^>]*data-aph-id="([^"]+)"[^>]*>[\s\S]*?<\/section>/gi;
  while ((match = regex2.exec(html)) !== null) {
    if (!map.has(match[2])) {
      map.set(match[2], { type: match[1], html: match[0] });
    }
  }

  return map;
}

// Extract <style> and <script> blocks from bespoke HTML (they live outside sections)
function extractGlobalBlocks(html: string): { styles: string; scripts: string } {
  const styleMatches = html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
  const scriptMatches = html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];
  return {
    styles: styleMatches.join("\n"),
    scripts: scriptMatches.join("\n"),
  };
}

export function PreviewPane() {
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [phase, setPhase] = useState<RenderPhase>("IDLE");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Bespoke HTML fragments from Layer 2 (keyed by shape ID)
  const bespokeRef = useRef<Map<string, BespokeFragment>>(new Map());
  // Global style/script blocks from the bespoke render
  const bespokeGlobalsRef = useRef<{ styles: string; scripts: string } | null>(null);

  // Scale the 1280px iframe to fit whatever width the pane has
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(w / FRAME_WIDTH);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Layer 1 render on mount + every canvas change + reference store changes
  useEffect(() => {
    doLayer1();
    canvasEngine.on("canvas:changed", handleChange);
    canvasEngine.on("render:requested", handleRenderRequest);
    const unsubRef = referenceStore.subscribe(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(doLayer1, 300);
    });
    return () => {
      canvasEngine.off("canvas:changed", handleChange);
      canvasEngine.off("render:requested", handleRenderRequest);
      unsubRef();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(doLayer1, 200);
  }

  function handleRenderRequest() {
    doLayer2();
  }

  // -----------------------------------------------------------------------
  // Layer 1 — instant, rules-based (with projection when bespoke exists)
  // -----------------------------------------------------------------------

  async function doLayer1() {
    const doc = canvasEngine.getDocument();
    const resolved = await resolveSemantics(doc);
    setPhase("LAYER1");

    if (bespokeRef.current.size > 0) {
      const html = projectCanvasChanges(resolved, bespokeRef.current, bespokeGlobalsRef.current);
      setSrcDoc(html);
      exportStore.setHTML(html);
      setPhase("BESPOKE");
    } else {
      const output = renderer.renderPhase1(resolved);
      setSrcDoc(output.html);
      exportStore.setHTML(output.html);
      setPhase("IDLE");
    }
  }

  // -----------------------------------------------------------------------
  // Layer 2 — AI bespoke HTML via /api/render
  // -----------------------------------------------------------------------

  async function doLayer2() {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPhase("LAYER2_STREAMING");

    const doc = canvasEngine.getDocument();
    const resolved = await resolveSemantics(doc);
    const context = contextStore.getContext();
    const rawText = contextStore.getRawText();
    const references = referenceStore.getReferences();

    try {
      aiCallTracker.trackRender();
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc: resolved, context, rawText, references }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        setPhase("IDLE");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6);
          try {
            const event = JSON.parse(json);
            if (event.done && event.html) {
              const bodyHtml = event.html as string;

              // Parse into per-section fragments for projection
              const fragments = parseBespokeFragments(bodyHtml);
              bespokeRef.current = fragments;

              // Extract global style/script blocks
              bespokeGlobalsRef.current = extractGlobalBlocks(bodyHtml);

              // Build the full document and display
              const fullDoc = buildBespokeDocument(bodyHtml, resolved);
              setSrcDoc(fullDoc);
              exportStore.setHTML(fullDoc);
              setPhase("BESPOKE");
            }
          } catch {
            // Partial JSON or streaming text delta — ignore
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setPhase("IDLE");
    }
  }

  const iframeHeight = scale > 0 ? `${100 / scale}%` : "100%";

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative">
      {/* Overlay controls */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Preview in new tab — <a> tag avoids popup blockers */}
        {srcDoc && phase !== "LAYER2_STREAMING" && (
          <a
            href="/preview"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              try { sessionStorage.setItem("aphantasia-preview", srcDoc); } catch { /* storage full */ }
            }}
            title="Open in new tab — interact with the full site"
            style={{
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.85)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.7)"; }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 8.5V14H2V2h5.5" />
              <path d="M10 1h5v5" />
              <path d="M7 9L15 1" />
            </svg>
            Preview
          </a>
        )}

        {/* Phase indicators */}
        {phase === "LAYER2_STREAMING" && (
          <div
            style={{
              background: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4ade80",
                animation: "pulse 1s infinite",
              }}
            />
            Generating bespoke design...
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
          </div>
        )}
        {phase === "BESPOKE" && (
          <div
            style={{
              background: "rgba(0,0,0,0.7)",
              color: "#4ade80",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Bespoke Design
          </div>
        )}
      </div>

      {srcDoc && (
        <iframe
          key="preview"
          srcDoc={srcDoc}
          title="Live Preview"
          sandbox="allow-scripts"
          style={{
            width: FRAME_WIDTH,
            height: iframeHeight,
            border: "none",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            display: "block",
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Projection engine: merge bespoke fragments with current canvas state
// ---------------------------------------------------------------------------

function projectCanvasChanges(
  doc: CanvasDocument,
  bespoke: Map<string, BespokeFragment>,
  globals: { styles: string; scripts: string } | null
): string {
  const inside = doc.shapes
    .filter(
      (s) =>
        s.isInsideFrame &&
        s.semanticTag !== "unknown" &&
        s.semanticTag !== "scratchpad" &&
        s.semanticTag !== "context-note" &&
        s.semanticTag !== "image" &&
        !s.meta?._consumed
    )
    .sort((a, b) => a.y - b.y);

  if (inside.length === 0) return "";

  const blocks = inside
    .map((s) => {
      const fragment = bespoke.get(s.id);
      if (fragment) return fragment.html;

      // New shape without bespoke fragment — render as Layer 1 placeholder
      const block = shapeToBlock(s);
      const placeholder = renderBlock(block);
      return `<!-- new-section -->\n<div style="position:relative;">\n<div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.6);color:#fbbf24;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:500;z-index:5;">New — hit Render to generate</div>\n${placeholder}\n</div>`;
    })
    .filter(Boolean)
    .join("\n");

  const stylesBlock = globals?.styles || "";
  const scriptsBlock = globals?.scripts || "";

  const body = `${stylesBlock}\n${blocks}\n${scriptsBlock}`;
  return buildBespokeDocument(body, doc);
}

// ---------------------------------------------------------------------------
// Build the full HTML document wrapping AI-generated body content
// ---------------------------------------------------------------------------

function buildBespokeDocument(body: string, doc: CanvasDocument): string {
  const ctx = contextStore.getContext();
  const refs = referenceStore.getReadyReferences();
  const direction = resolveDesignDirection(doc, ctx, refs);

  const rootCSS = tokensToCSS(direction.tokenPalette);
  const libs = getLibrariesForLevel(direction.animationLevel);
  const cdnScripts = buildScriptTags(libs);

  // Detect Google Fonts used in the AI's CSS (look for font-family declarations)
  const fontFamilies = extractGoogleFonts(body, direction);
  const fontLink = fontFamilies.length > 0
    ? `<link href="https://fonts.googleapis.com/css2?${fontFamilies.map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800;900`).join("&")}&display=swap" rel="stylesheet" />`
    : `<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,400&display=swap" rel="stylesheet" />`;

  // Minimal base reset — the AI handles section-level styles
  const baseReset = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background: var(--background);
  color: var(--foreground);
  line-height: 1.6;
  overflow-x: hidden;
}
a { color: inherit; text-decoration: none; }
img { max-width: 100%; height: auto; display: block; }
`;

  // Layer 1 placeholder styles (for projected new sections)
  const placeholderCSS = body.includes("<!-- new-section -->") ? `\n${BASE_CSS}\n${RESPONSIVE_CSS}` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  ${fontLink}
  ${cdnScripts}
  <style>
:root {
${rootCSS}
}
${baseReset}${placeholderCSS}
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

// Attempt to detect Google Font families referenced in the body CSS or token palette
function extractGoogleFonts(
  body: string,
  direction: ReturnType<typeof resolveDesignDirection>
): string[] {
  const fonts = new Set<string>();

  // From token palette
  const heading = direction.tokenPalette["--font-heading"] || "";
  const bodyFont = direction.tokenPalette["--font-body"] || "";
  for (const raw of [heading, bodyFont]) {
    const match = raw.match(/^'([^']+)'/);
    if (match && !["Georgia", "serif", "system-ui", "sans-serif", "monospace"].includes(match[1])) {
      fonts.add(match[1]);
    }
  }

  // Scan body for font-family declarations referencing Google Fonts
  const fontFamilyRegex = /font-family:\s*['"]([^'"]+)['"]/gi;
  let m;
  while ((m = fontFamilyRegex.exec(body)) !== null) {
    const name = m[1];
    if (name && !["inherit", "var", "system-ui", "sans-serif", "serif", "monospace"].some((k) => name.toLowerCase().includes(k))) {
      fonts.add(name);
    }
  }

  return Array.from(fonts);
}
