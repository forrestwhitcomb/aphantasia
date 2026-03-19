"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { contextStore } from "@/context/ContextStore";
import type { StructuredContext } from "@/types/context";
import { aiCallTracker } from "@/lib/aiCallTracker";
import { SparkleIcon } from "@/components/SparkleIcon";

// Default position: to the left of the first frame (frame starts at 0,0)
const DEFAULT_X = -380;
const DEFAULT_Y = 0;
const WIDGET_WIDTH = 340;

interface Props {
  zoom: number;
}

export function CanvasContextWidget({ zoom }: Props) {
  const [pos, setPos] = useState({ x: DEFAULT_X, y: DEFAULT_Y });
  const posRef = useRef(pos);
  posRef.current = pos;
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const [rawText, setRawText] = useState("");
  const [context, setContext] = useState<StructuredContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  useEffect(() => {
    // Re-sync singleton with localStorage (handles HMR / cache survival)
    contextStore.rehydrate();
    setRawText(contextStore.getRawText());
    setContext(contextStore.getContext());
    return contextStore.subscribe((ctx) => setContext(ctx));
  }, []);

  const isDirty = contextStore.isDirty(rawText);
  const hasContext = context !== null;

  async function handleExtract() {
    if (!rawText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      aiCallTracker.trackExtract();
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Extraction failed");
        return;
      }
      const structured = await res.json();
      if (structured._tokenUsage) {
        aiCallTracker.addTokens(structured._tokenUsage);
        delete structured._tokenUsage;
      }
      contextStore.setContext(structured as StructuredContext, rawText);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setRawText("");
    contextStore.clearContext();
  }

  // -- Drag handling (ref-based, no stale closures) --

  // Stable handlers that read from refs — never go stale
  const onWindowMove = useCallback((ev: MouseEvent) => {
    if (!draggingRef.current) return;
    const dx = (ev.clientX - dragStartRef.current.mx) / zoomRef.current;
    const dy = (ev.clientY - dragStartRef.current.my) / zoomRef.current;
    setPos({
      x: dragStartRef.current.ox + dx,
      y: dragStartRef.current.oy + dy,
    });
  }, []);

  const onWindowUp = useCallback(() => {
    draggingRef.current = false;
    window.removeEventListener("mousemove", onWindowMove);
    window.removeEventListener("mouseup", onWindowUp);
  }, [onWindowMove]);

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-ctx-drag]")) return;
      e.stopPropagation();
      e.preventDefault();
      draggingRef.current = true;
      dragStartRef.current = {
        mx: e.clientX,
        my: e.clientY,
        ox: posRef.current.x,
        oy: posRef.current.y,
      };
      window.addEventListener("mousemove", onWindowMove);
      window.addEventListener("mouseup", onWindowUp);
    },
    [onWindowMove, onWindowUp]
  );

  return (
    <div
      onMouseDown={(e) => {
        e.stopPropagation();
        onDragStart(e);
      }}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={(e) => {
        e.stopPropagation();
        if (draggingRef.current) onWindowUp();
      }}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: WIDGET_WIDTH,
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e0e0e0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        fontFamily: "var(--font-poppins), sans-serif",
        fontSize: 13,
        overflow: "hidden",
        zIndex: 5,
      }}
    >
      {/* Drag header */}
      <div
        data-ctx-drag
        style={{
          padding: "12px 16px",
          borderBottom: collapsed ? "none" : "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "grab",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: hasContext ? "#dcfce7" : "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke={hasContext ? "#16a34a" : "#888"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M6.3 6.3a8 8 0 0 0 0 11.4" />
              <path d="M17.7 6.3a8 8 0 0 1 0 11.4" />
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>
            Context
          </span>
          {hasContext && (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
          )}
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#888",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              transform: collapsed ? "rotate(180deg)" : "none",
              transition: "transform 0.15s",
            }}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      {/* Collapsible body */}
      {!collapsed && (
        <div style={{ padding: "12px 16px 16px" }}>
          {/* Textarea */}
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={"Paste product description, notes, or brand info.\n\ne.g. \"Focusly is a to-do app for founders. Bold, minimal. Color: #7C3AED\""}
            rows={4}
            style={{
              width: "100%",
              resize: "vertical",
              fontFamily: "inherit",
              fontSize: 12,
              lineHeight: 1.6,
              color: "#222",
              background: "#fafafa",
              border: "1px solid #e8e8e8",
              borderRadius: 8,
              padding: "8px 10px",
              outline: "none",
              marginBottom: 10,
            }}
            onFocus={(e) => (e.target.style.borderColor = "#aaa")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
          />

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 6,
                padding: "6px 10px",
                marginBottom: 10,
                fontSize: 11,
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 6, marginBottom: hasContext ? 14 : 0 }}>
            <button
              onClick={handleExtract}
              disabled={loading || !rawText.trim() || !isDirty}
              style={{
                flex: 1,
                padding: "7px 12px",
                background: rawText.trim() && isDirty ? "#111" : "#e0e0e0",
                color: rawText.trim() && isDirty ? "#fff" : "#999",
                borderRadius: 8,
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: rawText.trim() && isDirty ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                fontFamily: "inherit",
              }}
            >
              {loading ? (
                <>
                  <Spinner /> Extracting...
                </>
              ) : hasContext && !isDirty ? (
                <>
                  <CheckIcon /> Extracted
                </>
              ) : (
                <>
                  <SparkleIcon size={12} /> Extract context
                </>
              )}
            </button>

            {hasContext && (
              <button
                onClick={handleClear}
                title="Clear context"
                style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  border: "1px solid #e8e8e8",
                  background: "#fff",
                  cursor: "pointer",
                  color: "#888",
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
            )}
          </div>

          {/* Extracted fields */}
          {context && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {context.productName && <Row label="Product" value={context.productName} />}
              {context.tagline && <Row label="Tagline" value={context.tagline} />}
              {context.description && <Row label="Desc" value={context.description} />}
              {context.tone && <Row label="Tone" value={typeof context.tone === "string" ? context.tone : [context.tone.energy, context.tone.formality, context.tone.personality].filter(Boolean).join(", ")} pill />}
              {context.contentType && <Row label="Type" value={context.contentType} pill />}
              {context.pricing && <Row label="Pricing" value={typeof context.pricing === "string" ? context.pricing : [context.pricing.model, context.pricing.tiers?.join(", ")].filter(Boolean).join(" — ")} />}
              {context.colors && context.colors.length > 0 && (
                <Row label="Colors" value={context.colors.join(", ")} colors={context.colors} />
              )}
              {context.fonts && context.fonts.length > 0 && (
                <Row label="Fonts" value={context.fonts.join(", ")} />
              )}
              {context.products && context.products.length > 0 && (
                <Row label="Products" value={context.products.join(", ")} />
              )}
              {context.events && context.events.length > 0 && (
                <Row label="Events" value={context.events.join(", ")} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// -- Helpers --

function Row({
  label,
  value,
  pill,
  colors,
}: {
  label: string;
  value: string;
  pill?: boolean;
  colors?: string[];
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        alignItems: "flex-start",
        padding: "5px 8px",
        borderRadius: 6,
        background: "#f8f8f8",
      }}
    >
      <span
        style={{
          fontSize: 10,
          color: "#999",
          fontWeight: 600,
          letterSpacing: "0.02em",
          minWidth: 52,
          paddingTop: 1,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
        {colors?.map((c, i) => (
          <span
            key={i}
            title={c}
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              background: c,
              border: "1px solid rgba(0,0,0,0.1)",
              flexShrink: 0,
            }}
          />
        ))}
        <span
          style={{
            fontSize: 11,
            color: "#333",
            lineHeight: 1.4,
            ...(pill && {
              background: "#111",
              color: "#fff",
              borderRadius: 20,
              padding: "1px 7px",
              fontSize: 10,
              fontWeight: 500,
            }),
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.7s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
