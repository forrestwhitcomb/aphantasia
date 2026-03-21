"use client";

import { useEffect, useRef, useState } from "react";
import { canvasEngine } from "@/engine";
import type { CanvasDocument } from "@/engine";
import { resolveSemantics } from "@/semantic/SemanticResolver";
import { WebRenderer } from "@/render/renderers/WebRenderer";
import { FRAME_WIDTH } from "@/engine/engines/CustomCanvasEngine";
import { contextStore } from "@/context/ContextStore";
import { referenceStore } from "@/reference/ReferenceStore";
import { aiCallTracker } from "@/lib/aiCallTracker";
import { dnaStore, dnaToRootCSS, DNA_CHANGED_EVENT } from "@/dna";
import { buildGoogleFontsLink } from "@/dna/fontLibrary";
import { renderBlock, renderSection, shapeToBlock, shapeToSection } from "@/render/renderSection";
import { exportStore } from "@/lib/exportStore";
import { resolveDesignDirection } from "@/render/themeResolver";
import { getLibrariesForLevel, buildScriptTags } from "@/render/cdnCatalog";
import { BASE_CSS, RESPONSIVE_CSS, getAnimationCSS, getDecorativeCSS } from "@/render/sharedCSS";
import { applySectionProps } from "@/render/validateRenderResponse";
import type { SectionContent, CoherenceStrategy } from "@/types/render";

const renderer = new WebRenderer();

type RenderPhase =
  | "IDLE"
  | "LAYER1"
  | "LAYER2_PROPS_STREAMING"
  | "LAYER2_PROPS"
  | "DEEP_RENDER_STREAMING"
  | "DEEP_RENDER"
  | "ERROR";

interface BespokeFragment {
  type: string;
  html: string;
}

// Parse bespoke HTML body into per-section fragments keyed by data-aph-id
// Uses DOMParser for robustness — handles any element type and attribute order
function parseBespokeFragments(html: string): Map<string, BespokeFragment> {
  const map = new Map<string, BespokeFragment>();
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const elements = doc.querySelectorAll("[data-aph-id]");
    for (const el of elements) {
      const id = el.getAttribute("data-aph-id");
      const type = el.getAttribute("data-aph-type");
      if (id && type) {
        map.set(id, { type, html: el.outerHTML });
      }
    }
  } catch {
    // DOMParser unavailable — map stays empty, bespoke projection disabled
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
  const [renderError, setRenderError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Bespoke HTML fragments from Deep Render (keyed by shape ID)
  const bespokeRef = useRef<Map<string, BespokeFragment>>(new Map());
  // Global style/script blocks from the bespoke render
  const bespokeGlobalsRef = useRef<{ styles: string; scripts: string } | null>(null);

  // V2: Enriched section props from Layer 2 JSON AI (keyed by shape ID)
  const enrichedPropsRef = useRef<Map<string, SectionContent>>(new Map());
  const coherenceRef = useRef<CoherenceStrategy | null>(null);

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

  // Layer 1 render on mount + every canvas change + reference store changes + DNA changes
  useEffect(() => {
    doLayer1();
    canvasEngine.on("canvas:changed", handleChange);
    canvasEngine.on("render:requested", handleLayer2PropsRequest);
    canvasEngine.on("render:deep-requested", handleDeepRenderRequest);
    const unsubRef = referenceStore.subscribe(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(doLayer1, 300);
    });
    // Re-render when DNA changes (e.g. user applies a new design direction)
    const unsubDNA = dnaStore.subscribe(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(doLayer1, 100);
    });
    return () => {
      canvasEngine.off("canvas:changed", handleChange);
      canvasEngine.off("render:requested", handleLayer2PropsRequest);
      canvasEngine.off("render:deep-requested", handleDeepRenderRequest);
      unsubRef();
      unsubDNA();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(doLayer1, 200);
  }

  function handleLayer2PropsRequest() {
    doLayer2Props();
  }

  function handleDeepRenderRequest() {
    doDeepRender();
  }

  // -----------------------------------------------------------------------
  // Layer 1 — instant, rules-based (with projection when bespoke exists)
  // -----------------------------------------------------------------------

  async function doLayer1() {
    const doc = canvasEngine.getDocument();
    const resolved = await resolveSemantics(doc);
    setPhase("LAYER1");

    // Priority 1: Deep Render bespoke fragments (if available)
    if (bespokeRef.current.size > 0) {
      const html = projectCanvasChanges(resolved, bespokeRef.current, bespokeGlobalsRef.current);
      if (html) {
        setSrcDoc(html);
        exportStore.setHTML(html);
        setPhase("DEEP_RENDER");
        return;
      }
      console.warn("[doLayer1] Bespoke projection produced empty HTML, falling back");
    }

    // Priority 2: Layer 2 enriched props (if available) — render through component library
    if (enrichedPropsRef.current.size > 0) {
      const html = renderWithEnrichedProps(resolved, enrichedPropsRef.current);
      if (html) {
        setSrcDoc(html);
        exportStore.setHTML(html);
        setPhase("LAYER2_PROPS");
        return;
      }
      // Enriched render produced empty output — fall through to Layer 1
      console.warn("[doLayer1] Enriched render produced empty HTML, falling back to Layer 1");
    }

    // Default: pure Layer 1
    const output = renderer.renderPhase1(resolved);
    setSrcDoc(output.html);
    exportStore.setHTML(output.html);
    setPhase("IDLE");
  }

  // -----------------------------------------------------------------------
  // Layer 2 — Variant-aware JSON prop-schema via /api/render-v2
  // -----------------------------------------------------------------------

  async function doLayer2Props() {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPhase("LAYER2_PROPS_STREAMING");
    setRenderError(null);

    const doc = canvasEngine.getDocument();
    const resolved = await resolveSemantics(doc);
    const context = contextStore.getContext();
    const rawText = contextStore.getRawText();
    const references = referenceStore.getReferences();

    try {
      aiCallTracker.trackRender();
      const res = await fetch("/api/render-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc: resolved, context, rawText, references }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        console.error("[render-v2] HTTP error:", res.status, res.statusText);
        setRenderError(`Render failed (${res.status}). Try again.`);
        setPhase("ERROR");
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
            if (event.done && event.sections) {
              // Report token usage
              if (event.tokenUsage) {
                aiCallTracker.addTokens(event.tokenUsage);
              }

              // Store enriched props
              const newMap = new Map<string, SectionContent>();
              for (const s of event.sections as Array<{ id: string; section: SectionContent }>) {
                if (s.id && s.section) {
                  newMap.set(s.id, s.section);
                }
              }
              enrichedPropsRef.current = newMap;
              if (event.coherenceStrategy) {
                coherenceRef.current = event.coherenceStrategy;
              }

              // Clear any bespoke fragments (Layer 2 props take priority over stale Deep Render)
              bespokeRef.current = new Map();
              bespokeGlobalsRef.current = null;

              // Re-render with enriched props
              doLayer1();
              return;
            }
            if (event.done && event.error) {
              console.error("[render-v2] AI error:", event.error);
              setRenderError("AI couldn't generate design. Try again.");
              setPhase("ERROR");
              return;
            }
          } catch {
            // Ignore incomplete SSE fragments (expected during streaming)
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("[render-v2] Unexpected error:", err);
      setRenderError("Render failed unexpectedly. Try again.");
      setPhase("ERROR");
    }
  }

  // -----------------------------------------------------------------------
  // Deep Render — AI bespoke HTML via /api/render (original pipeline)
  // -----------------------------------------------------------------------

  async function doDeepRender() {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPhase("DEEP_RENDER_STREAMING");
    setRenderError(null);

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
        console.error("[deep-render] HTTP error:", res.status, res.statusText);
        setRenderError(`Deep Render failed (${res.status}). Try again.`);
        setPhase("ERROR");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let receivedDone = false;

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
              receivedDone = true;
              // Report token usage
              if (event.tokenUsage) {
                aiCallTracker.addTokens(event.tokenUsage);
              }

              // Strip <body> tags if Claude included them despite instructions
              let bodyHtml = (event.html as string)
                .replace(/^\s*<body[^>]*>/i, "")
                .replace(/<\/body>\s*$/i, "")
                .trim();

              // Parse into per-section fragments for projection
              const fragments = parseBespokeFragments(bodyHtml);
              bespokeRef.current = fragments;

              // Clear enriched props (Deep Render takes priority)
              enrichedPropsRef.current = new Map();
              coherenceRef.current = null;

              // Extract global style/script blocks
              bespokeGlobalsRef.current = extractGlobalBlocks(bodyHtml);

              // Build the full document and display
              const fullDoc = buildBespokeDocument(bodyHtml, resolved);
              setSrcDoc(fullDoc);
              exportStore.setHTML(fullDoc);
              setPhase("DEEP_RENDER");
            }
          } catch {
            // Partial JSON or streaming text delta — ignore
          }
        }
      }

      // Process any remaining data in the buffer after stream ends
      if (!receivedDone && buffer.trim()) {
        // Flush the TextDecoder
        buffer += decoder.decode();
        const remaining = buffer.trim();
        if (remaining.startsWith("data: ")) {
          const json = remaining.slice(6);
          try {
            const event = JSON.parse(json);
            if (event.done && event.html) {
              receivedDone = true;
              if (event.tokenUsage) {
                aiCallTracker.addTokens(event.tokenUsage);
              }
              let bodyHtml = (event.html as string)
                .replace(/^\s*<body[^>]*>/i, "")
                .replace(/<\/body>\s*$/i, "")
                .trim();
              const fragments = parseBespokeFragments(bodyHtml);
              bespokeRef.current = fragments;
              enrichedPropsRef.current = new Map();
              coherenceRef.current = null;
              bespokeGlobalsRef.current = extractGlobalBlocks(bodyHtml);
              const fullDoc = buildBespokeDocument(bodyHtml, resolved);
              setSrcDoc(fullDoc);
              exportStore.setHTML(fullDoc);
              setPhase("DEEP_RENDER");
            }
          } catch (parseErr) {
            console.error("[deep-render] Failed to parse final SSE event from buffer:", parseErr);
          }
        }
      }

      // Safety net: if stream ended without a done event, surface the error
      if (!receivedDone) {
        console.error("[deep-render] Stream ended without receiving done event");
        setRenderError("Deep Render stream ended unexpectedly. Try again.");
        setPhase("ERROR");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("[deep-render] Unexpected error:", err);
      setRenderError("Deep Render failed unexpectedly. Try again.");
      setPhase("ERROR");
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
        {srcDoc && phase !== "LAYER2_PROPS_STREAMING" && phase !== "DEEP_RENDER_STREAMING" && (
          <a
            href="/preview"
            target="_blank"
            rel="noopener noreferrer"
            onClick={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch("/api/preview", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ html: srcDoc }),
                });
                const { token } = await res.json();
                if (token) window.open(`/api/preview?token=${token}`, "_blank");
              } catch {
                // Fallback to sessionStorage if API fails
                try { sessionStorage.setItem("aphantasia-preview", srcDoc); } catch { /* */ }
                window.open("/preview", "_blank");
              }
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
        {phase === "LAYER2_PROPS_STREAMING" && (
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
            Enhancing design...
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
          </div>
        )}
        {phase === "LAYER2_PROPS" && (
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
            AI Enhanced
          </div>
        )}
        {phase === "DEEP_RENDER_STREAMING" && (
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
                background: "#a78bfa",
                animation: "pulse 1s infinite",
              }}
            />
            Generating bespoke design...
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
          </div>
        )}
        {phase === "DEEP_RENDER" && (
          <div
            style={{
              background: "rgba(0,0,0,0.7)",
              color: "#a78bfa",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            ✦ Bespoke Design
          </div>
        )}
        {phase === "ERROR" && renderError && (
          <div
            style={{
              background: "rgba(220,38,38,0.9)",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
            onClick={() => {
              setRenderError(null);
              setPhase("IDLE");
            }}
            title="Click to dismiss"
          >
            {renderError}
            <span style={{ opacity: 0.6, fontSize: 10 }}>✕</span>
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
// V2: Render with enriched AI props through the component library
// ---------------------------------------------------------------------------

function renderWithEnrichedProps(
  doc: CanvasDocument,
  enriched: Map<string, SectionContent>
): string {
  const inside = doc.shapes
    .filter(
      (s) =>
        s.isInsideFrame &&
        s.semanticTag !== "scratchpad" &&
        s.semanticTag !== "context-note" &&
        s.semanticTag !== "image" &&
        !s.meta?._consumed
    )
    .sort((a, b) => a.y - b.y);

  // No shapes to render — signal caller to fall back to Layer 1
  if (inside.length === 0) {
    console.warn("[renderWithEnrichedProps] No shapes inside frame, returning empty");
    return "";
  }

  // Log matching stats for debugging
  let matchCount = 0;
  const blocks = inside
    .map((s) => {
      // Check enriched props first
      const enrichedSection = enriched.get(s.id);
      if (enrichedSection) {
        matchCount++;
        return renderSection(enrichedSection, s.id);
      }

      // Fallback to Layer 1 default with "New" badge
      const block = shapeToBlock(s);
      const html = renderBlock(block, s.id);
      return `<div style="position:relative;">\n<div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.6);color:#fbbf24;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:500;z-index:5;">New — hit Render</div>\n${html}\n</div>`;
    })
    .filter(Boolean)
    .join("\n");

  if (matchCount === 0) {
    console.warn("[renderWithEnrichedProps] No enriched props matched any shapes — AI response IDs may not match canvas");
    return ""; // Trigger clean Layer 1 fallback — badge flood is worse UX than plain Layer 1
  }

  // If blocks are empty after rendering, signal failure
  if (!blocks.trim()) {
    console.warn("[renderWithEnrichedProps] All blocks rendered empty");
    return "";
  }

  // Wrap in full HTML document using Layer 1's wrapDocument approach
  try {
    const output = renderer.renderPhase1(doc);
    // Replace the body content but keep the same document wrapper (head, styles, fonts)
    const bodyStart = output.html.indexOf("<body>");
    const bodyEnd = output.html.indexOf("</body>");
    if (bodyStart !== -1 && bodyEnd !== -1) {
      return output.html.slice(0, bodyStart + 6) + "\n" + blocks + "\n" + output.html.slice(bodyEnd);
    }
    // Body tags not found — return the full phase1 output as fallback
    console.warn("[renderWithEnrichedProps] Could not find <body> tags in wrapper, using standard render");
    return output.html;
  } catch (err) {
    console.error("[renderWithEnrichedProps] Wrapper generation failed:", err);
    return "";
  }
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
      const placeholder = renderBlock(block, s.id);
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
  const dna = direction.dna;

  // Use DNA-derived CSS custom properties
  const rootCSS = dnaToRootCSS(dna);
  const libs = getLibrariesForLevel(direction.animationLevel);
  const cdnScripts = buildScriptTags(libs);

  // Use DNA font pairing for primary fonts, plus scan body for any AI-added fonts
  const dnaFontLinks = buildGoogleFontsLink(dna.typography.headingFamily, dna.typography.bodyFamily);

  // Also detect any extra fonts the AI used in its bespoke output
  const extraFonts = extractExtraFonts(body, dna.typography.headingFamily, dna.typography.bodyFamily);
  const extraFontLink = extraFonts.length > 0
    ? `<link href="https://fonts.googleapis.com/css2?${extraFonts.map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800;900`).join("&")}&display=swap" rel="stylesheet" />`
    : "";

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

  // DNA-driven decorative + motion CSS
  const motionCSS = getAnimationCSS(dna);
  const decorativeCSS = getDecorativeCSS(dna);

  // Safety net: recover from GSAP animations that leave elements invisible.
  // Claude's gsap.from({ opacity: 0 }) sets inline opacity: 0 immediately;
  // if ANY JS error halts execution, those elements stay invisible forever.
  const gsapSafetyScript = `<script>
(function(){
  // Wait for GSAP animations to initialize, then check for stuck invisible elements
  setTimeout(function(){
    var els = document.querySelectorAll('[data-aph-type] h1, [data-aph-type] h2, [data-aph-type] p, [data-aph-type] a, [data-aph-type] button, [data-aph-type] .hero-headline, [data-aph-type] .hero-content, [data-aph-type] .word');
    for(var i=0;i<els.length;i++){
      var s=window.getComputedStyle(els[i]);
      if(s.opacity==='0'||s.visibility==='hidden'){
        els[i].style.opacity='1';
        els[i].style.visibility='visible';
        els[i].style.transform='none';
      }
    }
  }, 3000);
})();
</script>`;

  return `<!DOCTYPE html>
<html lang="en" data-deco="${dna.decorative.style}" data-motion="${dna.motion.level}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${dnaFontLinks}
  ${extraFontLink}
  ${cdnScripts}
  <style>
${rootCSS}
${baseReset}${placeholderCSS}
${motionCSS}
${decorativeCSS}
  </style>
</head>
<body>
${body}
${gsapSafetyScript}
</body>
</html>`;
}

/** Detect extra Google Font families the AI may have used beyond the DNA fonts */
function extractExtraFonts(body: string, headingFamily: string, bodyFamily: string): string[] {
  const known = new Set([headingFamily.toLowerCase(), bodyFamily.toLowerCase()]);
  const skip = new Set(["inherit", "var", "system-ui", "sans-serif", "serif", "monospace", "georgia", "menlo"]);
  const fonts = new Set<string>();

  const fontFamilyRegex = /font-family:\s*['"]([^'"]+)['"]/gi;
  let m;
  while ((m = fontFamilyRegex.exec(body)) !== null) {
    const name = m[1];
    if (name && !skip.has(name.toLowerCase()) && !known.has(name.toLowerCase())) {
      fonts.add(name);
    }
  }

  return Array.from(fonts);
}
