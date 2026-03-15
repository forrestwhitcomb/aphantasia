"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { referenceStore } from "@/reference/ReferenceStore";
import type { ReferenceItem, ExtractedStyleTokens } from "@/types/reference";
import { aiCallTracker } from "@/lib/aiCallTracker";
import { SparkleIcon } from "@/components/SparkleIcon";

const DEFAULT_X = -380;
const DEFAULT_Y = 420;
const WIDGET_WIDTH = 340;

interface Props {
  zoom: number;
}

export function CanvasReferenceWidget({ zoom }: Props) {
  const [pos, setPos] = useState({ x: DEFAULT_X, y: DEFAULT_Y });
  const posRef = useRef(pos);
  posRef.current = pos;
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const [references, setReferences] = useState<ReferenceItem[]>([]);
  const [collapsed, setCollapsed] = useState(true);
  const [activeTag, setActiveTag] = useState<"style" | "tone" | "content">("style");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  useEffect(() => {
    referenceStore.rehydrate();
    setReferences(referenceStore.getReferences());
    return referenceStore.subscribe((refs) => setReferences(refs));
  }, []);

  const hasReady = references.some((r) => r.status === "ready");

  // -- Image upload --
  function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Create thumbnail (resize to 120px width)
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = 120 / img.width;
        canvas.width = 120;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL("image/jpeg", 0.7);

        const item: ReferenceItem = {
          id: crypto.randomUUID(),
          type: "image",
          tag: activeTag,
          source: dataUrl,
          thumbnail,
          status: "pending",
        };
        referenceStore.addReference(item);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  function handleAddUrl() {
    if (!urlInput.trim()) return;
    const item: ReferenceItem = {
      id: crypto.randomUUID(),
      type: "url",
      tag: activeTag,
      source: urlInput.trim(),
      status: "pending",
    };
    referenceStore.addReference(item);
    setUrlInput("");
  }

  async function handleExtract(refId: string) {
    const ref = references.find((r) => r.id === refId);
    if (!ref || ref.status === "extracting") return;

    referenceStore.updateReference(refId, { status: "extracting", error: undefined });
    aiCallTracker.trackExtract();

    try {
      const body: Record<string, string> = { tag: ref.tag };
      if (ref.type === "image") {
        body.imageData = ref.source;
      } else {
        body.url = ref.source;
      }

      const res = await fetch("/api/extract-reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        referenceStore.updateReference(refId, {
          status: "error",
          error: err.error ?? "Extraction failed",
        });
        return;
      }

      const tokens: ExtractedStyleTokens = await res.json();
      referenceStore.updateReference(refId, {
        status: "ready",
        extractedTokens: tokens,
      });
    } catch (e) {
      referenceStore.updateReference(refId, {
        status: "error",
        error: e instanceof Error ? e.message : "Network error",
      });
    }
  }

  function handleDelete(refId: string) {
    referenceStore.removeReference(refId);
  }

  // -- Drag handling (same pattern as CanvasContextWidget) --
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
      if (!(e.target as HTMLElement).closest("[data-ref-drag]")) return;
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
      onMouseDown={(e) => { e.stopPropagation(); onDragStart(e); }}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={(e) => { e.stopPropagation(); if (draggingRef.current) onWindowUp(); }}
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
        data-ref-drag
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
              background: hasReady ? "#dbeafe" : "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={hasReady ? "#2563eb" : "#888"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>Reference</span>
          {hasReady && (
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
          )}
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{
            width: 24, height: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 6, border: "none", background: "transparent",
            cursor: "pointer", color: "#888",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      {/* Collapsible body */}
      {!collapsed && (
        <div style={{ padding: "12px 16px 16px" }}>
          {/* Tag selector */}
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {(["style", "tone", "content"] as const).map((t) => (
              <button
                key={t}
                onClick={() => t !== "content" && setActiveTag(t)}
                style={{
                  flex: 1,
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: activeTag === t ? "1px solid #111" : "1px solid #e0e0e0",
                  background: activeTag === t ? "#111" : "#fff",
                  color: activeTag === t ? "#fff" : t === "content" ? "#ccc" : "#555",
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: t === "content" ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  opacity: t === "content" ? 0.5 : 1,
                }}
              >
                {t === "style" ? "Style" : t === "tone" ? "Tone" : "Content"}
              </button>
            ))}
          </div>

          {/* Image upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = "";
            }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files[0];
              if (file) handleFileSelect(file);
            }}
            style={{
              border: "1px dashed #d0d0d0",
              borderRadius: 8,
              padding: "14px 10px",
              textAlign: "center",
              cursor: "pointer",
              marginBottom: 8,
              background: "#fafafa",
              fontSize: 11,
              color: "#888",
              lineHeight: 1.5,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto 4px" }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Drop screenshot or click to upload
          </div>

          {/* URL input */}
          <div style={{ display: "flex", gap: 4, marginBottom: references.length > 0 ? 12 : 0 }}>
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddUrl(); }}
              placeholder="Or paste a URL..."
              style={{
                flex: 1,
                padding: "7px 10px",
                fontSize: 11,
                fontFamily: "inherit",
                border: "1px solid #e8e8e8",
                borderRadius: 8,
                background: "#fafafa",
                outline: "none",
                color: "#222",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#aaa")}
              onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
            />
            <button
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
              style={{
                padding: "7px 10px",
                borderRadius: 8,
                border: "none",
                background: urlInput.trim() ? "#111" : "#e0e0e0",
                color: urlInput.trim() ? "#fff" : "#999",
                fontSize: 11,
                fontWeight: 600,
                cursor: urlInput.trim() ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              Add
            </button>
          </div>

          {/* Reference list */}
          {references.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 300, overflowY: "auto" }}>
              {references.map((ref) => (
                <ReferenceCard
                  key={ref.id}
                  item={ref}
                  onExtract={() => handleExtract(ref.id)}
                  onDelete={() => handleDelete(ref.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// -- Reference Card --

function ReferenceCard({
  item,
  onExtract,
  onDelete,
}: {
  item: ReferenceItem;
  onExtract: () => void;
  onDelete: () => void;
}) {
  const tagColors: Record<string, { bg: string; text: string }> = {
    style: { bg: "#dbeafe", text: "#1e40af" },
    tone: { bg: "#fef3c7", text: "#92400e" },
    content: { bg: "#e0e7ff", text: "#3730a3" },
  };
  const tc = tagColors[item.tag] || tagColors.style;

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 8,
        background: "#f8f8f8",
        alignItems: "flex-start",
      }}
    >
      {/* Thumbnail */}
      {item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt="ref"
          style={{
            width: 48,
            height: 36,
            objectFit: "cover",
            borderRadius: 4,
            flexShrink: 0,
            border: "1px solid #e0e0e0",
          }}
        />
      ) : (
        <div
          style={{
            width: 48,
            height: 36,
            borderRadius: 4,
            background: "#e8e8e8",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
      )}

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              padding: "1px 6px",
              borderRadius: 10,
              background: tc.bg,
              color: tc.text,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {item.tag}
          </span>
          <StatusBadge status={item.status} />
        </div>

        {/* Source preview */}
        {item.type === "url" && (
          <div style={{ fontSize: 10, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {item.source}
          </div>
        )}

        {/* Error */}
        {item.error && (
          <div style={{ fontSize: 10, color: "#dc2626", marginTop: 2 }}>{item.error}</div>
        )}

        {/* Extracted tokens preview */}
        {item.extractedTokens && (
          <TokenPreview tokens={item.extractedTokens} />
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
          {(item.status === "pending" || item.status === "error") && (
            <button
              onClick={onExtract}
              style={{
                padding: "3px 8px",
                fontSize: 10,
                fontWeight: 600,
                borderRadius: 5,
                border: "none",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <SparkleIcon size={10} /> Extract
            </button>
          )}
          {item.status === "extracting" && (
            <span style={{ fontSize: 10, color: "#888", display: "flex", alignItems: "center", gap: 3 }}>
              <Spinner /> Extracting...
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        title="Remove reference"
        style={{
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#bbb",
          flexShrink: 0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// -- Helpers --

function StatusBadge({ status }: { status: ReferenceItem["status"] }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: "#f5f5f5", color: "#999", label: "pending" },
    extracting: { bg: "#fef3c7", color: "#d97706", label: "extracting" },
    ready: { bg: "#dcfce7", color: "#16a34a", label: "ready" },
    error: { bg: "#fef2f2", color: "#dc2626", label: "error" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{ fontSize: 9, fontWeight: 500, padding: "1px 5px", borderRadius: 8, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function TokenPreview({ tokens }: { tokens: ExtractedStyleTokens }) {
  return (
    <div style={{ marginTop: 3 }}>
      {tokens.colors && tokens.colors.length > 0 && (
        <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
          {tokens.colors.slice(0, 6).map((c, i) => (
            <span
              key={i}
              title={c}
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: c,
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            />
          ))}
        </div>
      )}
      {tokens.mood && (
        <div style={{ fontSize: 10, color: "#666", fontStyle: "italic" }}>{tokens.mood}</div>
      )}
      {tokens.toneOfVoice && (
        <div style={{ fontSize: 10, color: "#666", fontStyle: "italic" }}>{tokens.toneOfVoice}</div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.7s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
