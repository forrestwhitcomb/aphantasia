"use client";

import { useEffect, useRef, useState } from "react";
import { canvasEngine } from "@/engine";
import type { CanvasDocument } from "@/engine";
import { resolveSemantics } from "@/semantic/SemanticResolver";
import { WebRenderer } from "@/render/renderers/WebRenderer";
import { FRAME_WIDTH } from "@/engine/engines/CustomCanvasEngine";
import { contextStore } from "@/context/ContextStore";
import { referenceStore } from "@/reference/ReferenceStore";
import type { SectionContent } from "@/types/render";
import { PRESETS, DEFAULT_PRESET, tokensToCSS, applyBrandColors, applyReferenceTokens } from "@/lib/theme";
import { aiCallTracker } from "@/lib/aiCallTracker";
import { renderSection, shapeToSection } from "@/render/renderSection";
import { exportStore } from "@/lib/exportStore";

const renderer = new WebRenderer();

type RenderPhase = "IDLE" | "LAYER1" | "LAYER2_STREAMING" | "ENRICHED";

export function PreviewPane() {
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [phase, setPhase] = useState<RenderPhase>("IDLE");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Cache enriched sections keyed by shape ID so unchanged shapes keep their content
  const enrichedRef = useRef<Map<string, SectionContent>>(new Map());

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
      // Re-render when references change (e.g. new colors extracted)
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
  // Layer 1 — instant, rules-based
  // -----------------------------------------------------------------------

  async function doLayer1() {
    const doc = canvasEngine.getDocument();
    const resolved = await resolveSemantics(doc);
    setPhase("LAYER1");

    // If we have enriched content, render with it
    if (enrichedRef.current.size > 0) {
      const html = renderWithEnrichedContent(resolved, enrichedRef.current);
      setSrcDoc(html);
      exportStore.setHTML(html);
      setPhase("ENRICHED");
    } else {
      const output = renderer.renderPhase1(resolved);
      setSrcDoc(output.html);
      exportStore.setHTML(output.html);
      setPhase("IDLE");
    }
  }

  // -----------------------------------------------------------------------
  // Layer 2 — AI streaming via /api/render
  // -----------------------------------------------------------------------

  async function doLayer2() {
    // Cancel any in-flight request
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
            if (event.done && event.sections) {
              // Apply enriched sections
              const sections = event.sections as Array<{
                id: string;
                type: SectionContent["type"];
                props: Record<string, unknown>;
              }>;
              for (const s of sections) {
                enrichedRef.current.set(s.id, {
                  type: s.type,
                  props: s.props,
                } as SectionContent);
              }
              // Re-render with enriched content
              const html = renderWithEnrichedContent(resolved, enrichedRef.current);
              setSrcDoc(html);
              exportStore.setHTML(html);
              setPhase("ENRICHED");
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
      {/* Phase indicator */}
      {phase === "LAYER2_STREAMING" && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
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
          AI Rendering...
          <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
        </div>
      )}
      {phase === "ENRICHED" && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
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
// Render with enriched (AI-generated) section props
// ---------------------------------------------------------------------------

function renderWithEnrichedContent(
  doc: CanvasDocument,
  enriched: Map<string, SectionContent>
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
      const section = enriched.get(s.id);
      if (section) {
        // For compound sections, merge AI props with canvas-extracted data
        // (imageSrc, cta from spatial analysis must survive AI enrichment)
        if (s.meta?._spatialGroup && section.type === "feature-grid") {
          return renderEnrichedSection(
            mergeWithSpatialGroup(section, s.meta._spatialGroup as Record<string, unknown>)
          );
        }
        return renderEnrichedSection(section);
      }
      // Fall back to Layer 1 placeholder for unenriched shapes
      return renderFallbackBlock(s);
    })
    .filter(Boolean)
    .join("\n");

  // Re-use WebRenderer's wrapDocument by rendering via the renderer
  // We build the full HTML ourselves to avoid double-rendering
  return buildEnrichedDocument(blocks);
}

// Merge AI-enriched feature-grid props with canvas-extracted spatial data.
// AI provides: enhanced headings, body copy, icons, title, subtitle.
// Canvas provides: imageSrc, cta — these must survive AI enrichment.
function mergeWithSpatialGroup(
  section: SectionContent,
  spatialGroup: Record<string, unknown>
): SectionContent {
  if (section.type !== "feature-grid") return section;

  const aiProps = section.props as import("@/types/render").FeatureGridProps;
  const canvasFeatures = (spatialGroup.features ?? []) as Array<Record<string, unknown>>;
  const aiFeatures = aiProps.features ?? [];

  // Merge per-feature: AI copy wins, but canvas imageSrc and cta are preserved
  const mergedFeatures = aiFeatures.map((aiF, i) => {
    const canvasF = canvasFeatures[i];
    if (!canvasF) return aiF;
    return {
      ...aiF,
      // Preserve canvas-sourced data the AI can't generate
      imageSrc: (canvasF.imageSrc as string) || aiF.imageSrc,
      cta: aiF.cta || (canvasF.cta as string) || undefined,
    };
  });

  return {
    type: "feature-grid",
    props: {
      ...aiProps,
      features: mergedFeatures,
    },
  };
}

// Both renderEnrichedSection and renderFallbackBlock now delegate to shared modules
function renderEnrichedSection(section: SectionContent): string {
  return renderSection(section);
}

function renderFallbackBlock(shape: CanvasDocument["shapes"][number]): string {
  const section = shapeToSection(shape);
  return renderSection(section);
}

function buildEnrichedDocument(body: string): string {
  const ctx = contextStore.getContext();
  let theme = PRESETS[DEFAULT_PRESET];

  // Apply reference tokens first (style refs influence base theme)
  const readyRefs = referenceStore.getReadyReferences();
  const styleRefs = readyRefs.filter((r) => r.tag === "style" && r.extractedTokens);
  for (const ref of styleRefs) {
    theme = applyReferenceTokens(theme, ref.extractedTokens!);
  }

  // Explicit context colors override reference colors
  if (ctx?.colors?.length) {
    theme = applyBrandColors(theme, ctx.colors);
  }

  const rootCSS = tokensToCSS(theme);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,400&display=swap" rel="stylesheet" />
  <style>
${rootCSS}

${BASE_CSS_ENRICHED}
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

// Duplicate of WebRenderer's BASE_CSS — kept in sync. In a future refactor
// this should be extracted to a shared module.
const BASE_CSS_ENRICHED = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; }
body {
  font-family: var(--font-body);
  background: var(--background);
  color: var(--foreground);
  line-height: 1.6;
}
a { color: inherit; text-decoration: none; }
.aph-inner {
  max-width: var(--inner-max);
  margin: 0 auto;
  padding: 0 40px;
}
.aph-btn-accent {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 11px 22px;
  background: var(--accent);
  color: var(--accent-foreground);
  font-family: var(--font-body);
  font-size: 14px; font-weight: 600;
  border-radius: var(--radius);
  border: none; cursor: pointer;
  transition: opacity 0.15s;
}
.aph-btn-accent:hover { opacity: 0.85; }
.aph-btn-accent.aph-btn-sm { padding: 7px 14px; font-size: 13px; }
.aph-btn-accent.aph-btn-lg { padding: 14px 28px; font-size: 15px; }
.aph-btn-accent.aph-btn-full { width: 100%; justify-content: center; }
.aph-btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 11px 22px;
  border: 1px solid var(--border);
  color: var(--foreground);
  font-family: var(--font-body);
  font-size: 14px; font-weight: 500;
  border-radius: var(--radius);
  cursor: pointer;
  transition: border-color 0.15s;
}
.aph-btn-ghost:hover { border-color: var(--muted-foreground); }
.aph-btn-ghost.aph-btn-lg { padding: 14px 28px; font-size: 15px; }
.aph-badge {
  display: inline-block;
  padding: 3px 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 12px; font-weight: 500;
  color: var(--muted-foreground);
}
.aph-badge-outline {
  background: transparent;
  border-color: var(--border);
}
.aph-section-header { text-align: center; margin-bottom: 56px; }
.aph-section-title {
  font-family: var(--font-heading);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.aph-section-subtitle {
  margin-top: 12px;
  font-size: 17px;
  color: var(--muted-foreground);
  max-width: 560px;
  margin-left: auto; margin-right: auto;
}
.aph-nav {
  border-bottom: 1px solid var(--border);
  background: var(--background);
  position: sticky; top: 0; z-index: 10;
}
.aph-nav-inner {
  display: flex; align-items: center;
  justify-content: space-between;
  padding-top: 18px; padding-bottom: 18px;
}
.aph-logo {
  font-family: var(--font-heading);
  font-size: 17px; font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.aph-nav-links {
  list-style: none;
  display: flex; gap: 28px;
}
.aph-nav-link {
  font-size: 14px; font-weight: 500;
  color: var(--muted-foreground);
  transition: color 0.15s;
}
.aph-nav-link:hover { color: var(--foreground); }
.aph-hero { padding: var(--section-py) 0; }
.aph-hero-inner { max-width: var(--inner-max); margin: 0 auto; padding: 0 40px; }
.aph-hero-badge { margin-bottom: 24px; }
.aph-hero-h1 {
  font-family: var(--font-heading);
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  max-width: 760px;
  color: var(--foreground);
}
.aph-hero-sub {
  margin-top: 24px;
  font-size: 18px;
  color: var(--muted-foreground);
  line-height: 1.7;
  max-width: 560px;
}
.aph-hero-cta {
  margin-top: 40px;
  display: flex; gap: 12px; flex-wrap: wrap;
}
.aph-feature-grid {
  padding: var(--section-py) 0;
  background: var(--surface-alt);
}
.aph-feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
.aph-feature-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  transition: transform 0.2s;
}
.aph-feature-card:hover { transform: translateY(-2px); }
.aph-feature-icon {
  font-size: 22px; margin-bottom: 16px;
  color: var(--accent);
}
.aph-feature-heading {
  font-family: var(--font-heading);
  font-size: 17px; font-weight: 600;
  margin-bottom: 8px;
  color: var(--foreground);
}
.aph-feature-body {
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.65;
}
.aph-feature-image {
  margin: -28px -28px 16px -28px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow: hidden;
}
.aph-feature-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}
.aph-feature-card--has-image { padding-top: 0; }
.aph-split { padding: var(--section-py) 0; }
.aph-split-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.aph-split-flip { direction: rtl; }
.aph-split-flip > * { direction: ltr; }
.aph-split-heading {
  font-family: var(--font-heading);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  color: var(--foreground);
}
.aph-split-body {
  font-size: 16px;
  color: var(--muted-foreground);
  line-height: 1.7;
  margin-bottom: 28px;
}
.aph-split-cta { margin-top: 4px; }
.aph-split-placeholder {
  aspect-ratio: 4/3;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
}
.aph-split-placeholder-label {
  font-size: 12px;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.aph-cta {
  padding: var(--section-py) 0;
  background: var(--foreground);
}
.aph-cta-inner { text-align: center; }
.aph-cta-heading {
  font-family: var(--font-heading);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--background);
  margin-bottom: 16px;
}
.aph-cta-sub {
  font-size: 17px;
  color: color-mix(in srgb, var(--background) 70%, transparent);
  margin-bottom: 36px;
}
.aph-cta-actions {
  display: flex; gap: 12px;
  justify-content: center; flex-wrap: wrap;
}
.aph-cta .aph-btn-accent {
  background: var(--background);
  color: var(--foreground);
}
.aph-cta .aph-btn-ghost {
  border-color: rgba(255,255,255,0.25);
  color: var(--background);
}
.aph-portfolio { padding: var(--section-py) 0; }
.aph-portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
.aph-portfolio-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
  transition: transform 0.2s;
}
.aph-portfolio-card:hover { transform: translateY(-3px); }
.aph-portfolio-thumb {
  aspect-ratio: 16/9;
  background: var(--surface-alt);
  border-bottom: 1px solid var(--border);
}
.aph-portfolio-info { padding: 20px; }
.aph-portfolio-title {
  font-size: 16px; font-weight: 600;
  margin-bottom: 6px;
  color: var(--foreground);
}
.aph-portfolio-desc {
  font-size: 13px;
  color: var(--muted-foreground);
  margin-bottom: 12px;
  line-height: 1.5;
}
.aph-portfolio-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.aph-ecommerce { padding: var(--section-py) 0; }
.aph-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
.aph-product-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
}
.aph-product-thumb {
  aspect-ratio: 1;
  background: var(--surface-alt);
  border-bottom: 1px solid var(--border);
  position: relative;
}
.aph-product-badge {
  position: absolute; top: 12px; left: 12px;
  background: var(--accent);
  color: var(--accent-foreground);
  border: none;
}
.aph-product-info { padding: 16px; }
.aph-product-name {
  font-size: 15px; font-weight: 600;
  margin-bottom: 4px;
  color: var(--foreground);
}
.aph-product-desc {
  font-size: 13px;
  color: var(--muted-foreground);
  margin-bottom: 12px;
}
.aph-product-footer {
  display: flex; align-items: center;
  justify-content: space-between;
}
.aph-product-price {
  font-size: 16px; font-weight: 700;
  color: var(--foreground);
}
.aph-event { padding: var(--section-py) 0; }
.aph-event-inner {
  max-width: var(--inner-max); margin: 0 auto; padding: 0 40px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start;
}
.aph-event-meta { display: flex; gap: 8px; margin-bottom: 20px; }
.aph-event-title {
  font-family: var(--font-heading);
  font-size: clamp(24px, 3vw, 40px);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  color: var(--foreground);
}
.aph-event-desc {
  font-size: 16px;
  color: var(--muted-foreground);
  line-height: 1.7;
}
.aph-event-form {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  display: flex; flex-direction: column; gap: 12px;
}
.aph-event-form-heading {
  font-size: 16px; font-weight: 600;
  margin-bottom: 4px;
  color: var(--foreground);
}
.aph-generic { padding: var(--section-py) 0; }
.aph-generic-inner { max-width: 720px; }
.aph-generic-body {
  font-size: 17px;
  color: var(--muted-foreground);
  line-height: 1.75;
  margin-top: 16px; margin-bottom: 28px;
}
.aph-footer {
  border-top: 1px solid var(--border);
  padding: 48px 0 32px;
  background: var(--surface-alt);
}
.aph-footer-top {
  display: flex; gap: 64px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}
.aph-footer-brand { flex: 0 0 200px; }
.aph-footer-logo {
  font-family: var(--font-heading);
  font-size: 17px; font-weight: 700;
  color: var(--foreground);
  display: block; margin-bottom: 8px;
}
.aph-footer-tagline {
  font-size: 13px;
  color: var(--muted-foreground);
  line-height: 1.5;
}
.aph-footer-cols {
  flex: 1;
  display: flex; gap: 40px; flex-wrap: wrap;
}
.aph-footer-col-heading {
  font-size: 12px; font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--foreground);
  margin-bottom: 12px;
}
.aph-footer-col-links {
  list-style: none;
  display: flex; flex-direction: column; gap: 8px;
}
.aph-footer-col-links a {
  font-size: 13px;
  color: var(--muted-foreground);
  transition: color 0.15s;
}
.aph-footer-col-links a:hover { color: var(--foreground); }
.aph-footer-bottom {
  border-top: 1px solid var(--border);
  padding-top: 24px;
}
.aph-footer-copy {
  font-size: 12px;
  color: var(--muted-foreground);
}
.aph-input {
  font-family: var(--font-body);
  font-size: 14px;
  padding: 10px 14px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--foreground);
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}
.aph-input:focus { border-color: var(--muted-foreground); }
.aph-img-placeholder {
  aspect-ratio: 16/9;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  margin: 20px 0;
}
.aph-img-placeholder span {
  font-size: 13px;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.aph-empty {
  height: 100vh;
  display: flex; align-items: center; justify-content: center;
}
.aph-empty p {
  font-size: 14px;
  color: var(--muted-foreground);
}
`;
