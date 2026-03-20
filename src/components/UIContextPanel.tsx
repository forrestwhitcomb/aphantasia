"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { uiDesignStore } from "@/lib/UIDesignStore";
import type { UIDesignSystem, UIInspiration, InspirationRole } from "@/types/uiDesign";

// Default position: to the left of the mobile frame (frame starts at 0,0)
const DEFAULT_X = -380;
const DEFAULT_Y = 0;
const WIDGET_WIDTH = 340;

interface Props {
  zoom: number;
}

export function UIContextPanel({ zoom }: Props) {
  const [pos, setPos] = useState({ x: DEFAULT_X, y: DEFAULT_Y });
  const posRef = useRef(pos);
  posRef.current = pos;
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const draggingRef = useRef(false);
  const dragStartRef = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  // Store state
  const [screenContext, setScreenContextLocal] = useState("");
  const [designContextImage, setDesignContextImageLocal] = useState<string | null>(null);
  const [designSystem, setDesignSystem] = useState<UIDesignSystem | null>(null);
  const [inspirations, setInspirations] = useState<UIInspiration[]>([]);

  // UI state
  const [contextCollapsed, setContextCollapsed] = useState(false);
  const [designCollapsed, setDesignCollapsed] = useState(false);
  const [inspCollapsed, setInspCollapsed] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<InspirationRole>("design style");

  useEffect(() => {
    uiDesignStore.rehydrate();
    const state = uiDesignStore.getState();
    setScreenContextLocal(state.screenContext);
    setDesignContextImageLocal(state.designContextImage);
    setDesignSystem(state.extractedDesignSystem);
    setInspirations(state.inspirations);
    return uiDesignStore.subscribe((s) => {
      setScreenContextLocal(s.screenContext);
      setDesignContextImageLocal(s.designContextImage);
      setDesignSystem(s.extractedDesignSystem);
      setInspirations(s.inspirations);
    });
  }, []);

  // -- Drag handling -----------------------------------------------------------

  const onWindowMove = useCallback((ev: MouseEvent) => {
    if (!draggingRef.current) return;
    const dx = (ev.clientX - dragStartRef.current.mx) / zoomRef.current;
    const dy = (ev.clientY - dragStartRef.current.my) / zoomRef.current;
    setPos({ x: dragStartRef.current.ox + dx, y: dragStartRef.current.oy + dy });
  }, []);

  const onWindowUp = useCallback(() => {
    draggingRef.current = false;
    window.removeEventListener("mousemove", onWindowMove);
    window.removeEventListener("mouseup", onWindowUp);
  }, [onWindowMove]);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest("[data-drag]")) return;
    e.stopPropagation();
    e.preventDefault();
    draggingRef.current = true;
    dragStartRef.current = { mx: e.clientX, my: e.clientY, ox: posRef.current.x, oy: posRef.current.y };
    window.addEventListener("mousemove", onWindowMove);
    window.addEventListener("mouseup", onWindowUp);
  }, [onWindowMove, onWindowUp]);

  // -- Handlers ----------------------------------------------------------------

  function handleContextChange(text: string) {
    setScreenContextLocal(text);
    uiDesignStore.setScreenContext(text);
  }

  function handleImageFile(file: File) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setDesignContextImageLocal(dataUrl);
      uiDesignStore.setDesignContextImage(dataUrl);
      uiDesignStore.setExtractedDesignSystem(null); // reset on new image
    };
    reader.readAsDataURL(file);
  }

  async function handleExtractDesign() {
    if (!designContextImage) return;
    setExtracting(true);
    setExtractError(null);
    try {
      const res = await fetch("/api/ui/extract-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: designContextImage }),
      });
      if (!res.ok) {
        const err = await res.json();
        setExtractError(err.error ?? "Extraction failed");
        return;
      }
      const ds: UIDesignSystem = await res.json();
      uiDesignStore.setExtractedDesignSystem(ds);
    } catch (e) {
      setExtractError(e instanceof Error ? e.message : "Network error");
    } finally {
      setExtracting(false);
    }
  }

  function handleClearDesign() {
    uiDesignStore.setDesignContextImage(null);
    uiDesignStore.setExtractedDesignSystem(null);
  }

  function handleInspFile(file: File) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const insp: UIInspiration = {
        id: `insp:${crypto.randomUUID()}`,
        role: activeRole,
        source: dataUrl,
        label: file.name.replace(/\.[^.]+$/, ""),
      };
      uiDesignStore.addInspiration(insp);
    };
    reader.readAsDataURL(file);
  }

  function handleInspDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleInspFile(file);
  }

  function handleDesignDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleImageFile(file);
  }

  const stopAll = {
    onMouseDown: (e: React.MouseEvent) => { e.stopPropagation(); onDragStart(e); },
    onMouseMove: (e: React.MouseEvent) => e.stopPropagation(),
    onMouseUp: (e: React.MouseEvent) => { e.stopPropagation(); if (draggingRef.current) onWindowUp(); },
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    onDoubleClick: (e: React.MouseEvent) => e.stopPropagation(),
    onWheel: (e: React.WheelEvent) => e.stopPropagation(),
  };

  return (
    <div
      {...stopAll}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: WIDGET_WIDTH,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 5,
        fontFamily: "var(--font-poppins), sans-serif",
        fontSize: 13,
      }}
    >
      {/* ── Card 1: Context ──────────────────────────────── */}
      <Card>
        <CardHeader
          icon={<ContextIcon />}
          label="Context"
          collapsed={contextCollapsed}
          onToggle={() => setContextCollapsed((c) => !c)}
          accent={screenContext.length > 0 ? "#22c55e" : undefined}
        />
        {!contextCollapsed && (
          <div style={{ padding: "10px 14px 14px" }}>
            <textarea
              value={screenContext}
              onChange={(e) => handleContextChange(e.target.value)}
              placeholder={"Describe the screen or flow you're designing.\n\ne.g. \"Home screen for Bozobox — a task manager for busy founders.\""}
              rows={4}
              style={textareaStyle}
              onFocus={(e) => (e.target.style.borderColor = "#aaa")}
              onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
            />
          </div>
        )}
      </Card>

      {/* ── Card 2: Design System ────────────────────────── */}
      <Card>
        <CardHeader
          icon={<PaletteIcon />}
          label="Design System"
          collapsed={designCollapsed}
          onToggle={() => setDesignCollapsed((c) => !c)}
          accent={designSystem ? "#22c55e" : undefined}
          badge={designSystem ? "extracted" : undefined}
        />
        {!designCollapsed && (
          <div style={{ padding: "10px 14px 14px" }}>
            {!designContextImage ? (
              /* Drop zone */
              <label
                style={dropZoneStyle}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={handleDesignDrop}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 6 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span style={{ fontSize: 12, color: "#999", textAlign: "center", lineHeight: 1.5 }}>Drop a screenshot of your app<br/>or click to select</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
                />
              </label>
            ) : (
              /* Image preview + extract */
              <div>
                <div style={{ position: "relative", marginBottom: 10 }}>
                  <img
                    src={designContextImage}
                    alt="Design reference"
                    style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, display: "block", border: "1px solid #e8e8e8" }}
                  />
                  <button
                    onClick={handleClearDesign}
                    title="Remove"
                    style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>

                {extractError && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "6px 10px", marginBottom: 8, fontSize: 11, color: "#b91c1c" }}>
                    {extractError}
                  </div>
                )}

                {!designSystem ? (
                  <button
                    onClick={handleExtractDesign}
                    disabled={extracting}
                    style={{ ...primaryBtnStyle, opacity: extracting ? 0.7 : 1, cursor: extracting ? "not-allowed" : "pointer" }}
                  >
                    {extracting ? <><Spinner /> Extracting tokens...</> : <><SparkleIconInline /> Extract design system</>}
                  </button>
                ) : (
                  <div>
                    {/* Token preview */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                      {[
                        { label: "Accent", color: designSystem.colors.accent },
                        { label: "BG", color: designSystem.colors.background },
                        { label: "Surface", color: designSystem.colors.surface },
                        { label: "Text", color: designSystem.colors.foreground },
                        { label: "Muted", color: designSystem.colors.foregroundSecondary },
                      ].map(({ label, color }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 4, background: "#f8f8f8", borderRadius: 6, padding: "3px 7px" }}>
                          <span style={{ width: 10, height: 10, borderRadius: 3, background: color, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                          <span style={{ fontSize: 10, color: "#666" }}>{label}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: "#555", flex: 1 }}>
                        <b style={{ color: "#111" }}>{designSystem.typography.fontFamily.split(",")[0].replace(/'/g, "")}</b> · r{designSystem.shape.radiusMedium} · {designSystem.platform}
                      </span>
                      <button
                        onClick={() => uiDesignStore.setExtractedDesignSystem(null)}
                        style={{ fontSize: 11, color: "#999", background: "none", border: "none", cursor: "pointer", padding: "2px 4px", textDecoration: "underline" }}
                      >
                        re-extract
                      </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#f0fdf4", borderRadius: 8, padding: "6px 10px" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 500 }}>Design system active</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* ── Card 3: Inspirations ─────────────────────────── */}
      <Card>
        <CardHeader
          icon={<InspoIcon />}
          label="Inspirations"
          collapsed={inspCollapsed}
          onToggle={() => setInspCollapsed((c) => !c)}
          badge={inspirations.length > 0 ? `${inspirations.length}` : undefined}
        />
        {!inspCollapsed && (
          <div style={{ padding: "10px 14px 14px" }}>
            {/* Role selector */}
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {(["content", "layout", "design style"] as InspirationRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  style={{
                    flex: 1,
                    padding: "5px 4px",
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 600,
                    border: "1.5px solid",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.1s",
                    borderColor: activeRole === role ? "#111" : "#e0e0e0",
                    background: activeRole === role ? "#111" : "#fff",
                    color: activeRole === role ? "#fff" : "#666",
                    textTransform: "capitalize" as const,
                  }}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Drop zone */}
            <label
              style={{ ...dropZoneStyle, minHeight: 64, padding: "12px" }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={handleInspDrop}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 4 }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              <span style={{ fontSize: 11, color: "#bbb" }}>Drop image · {activeRole}</span>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleInspFile(f); }} />
            </label>

            {/* Inspirations list */}
            {inspirations.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {inspirations.map((insp) => (
                  <div
                    key={insp.id}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8f8f8", borderRadius: 8, padding: "6px 8px" }}
                  >
                    {insp.source.startsWith("data:") && (
                      <img src={insp.source} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 5, flexShrink: 0, border: "1px solid #e8e8e8" }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#222", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{insp.label || insp.role}</p>
                      <RoleBadge role={insp.role} />
                    </div>
                    <button
                      onClick={() => uiDesignStore.removeInspiration(insp.id)}
                      style={{ width: 20, height: 20, borderRadius: 4, background: "none", border: "none", cursor: "pointer", color: "#bbb", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #e0e0e0",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      overflow: "hidden",
    }}>
      {children}
    </div>
  );
}

function CardHeader({
  icon,
  label,
  collapsed,
  onToggle,
  accent,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  onToggle: () => void;
  accent?: string;
  badge?: string;
}) {
  return (
    <div
      data-drag
      style={{
        padding: "11px 14px",
        borderBottom: collapsed ? "none" : "1px solid #f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 24, height: 24, borderRadius: "50%",
          background: accent ? "#dcfce7" : "#f0f0f0",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{label}</span>
        {accent && <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />}
        {badge && (
          <span style={{ fontSize: 10, fontWeight: 600, background: "#111", color: "#fff", borderRadius: 10, padding: "1px 6px" }}>{badge}</span>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#888" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
}

function RoleBadge({ role }: { role: InspirationRole }) {
  const colors: Record<InspirationRole, { bg: string; text: string }> = {
    content: { bg: "#dbeafe", text: "#1d4ed8" },
    layout: { bg: "#fce7f3", text: "#be185d" },
    "design style": { bg: "#ede9fe", text: "#7c3aed" },
  };
  const c = colors[role];
  return (
    <span style={{ fontSize: 9, fontWeight: 600, background: c.bg, color: c.text, borderRadius: 4, padding: "1px 5px", textTransform: "uppercase" as const, letterSpacing: "0.03em" }}>
      {role}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const textareaStyle: React.CSSProperties = {
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
  boxSizing: "border-box",
};

const dropZoneStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: 80,
  border: "1.5px dashed #ddd",
  borderRadius: 8,
  background: "#fafafa",
  cursor: "pointer",
  padding: "16px",
  boxSizing: "border-box",
  transition: "border-color 0.1s, background 0.1s",
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  background: "#111",
  color: "#fff",
  borderRadius: 8,
  border: "none",
  fontSize: 12,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

// ---------------------------------------------------------------------------
// Small icons
// ---------------------------------------------------------------------------

function ContextIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/>
      <circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  );
}

function InspoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}

function SparkleIconInline() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "ui-spin 0.7s linear infinite" }}>
      <style>{`@keyframes ui-spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
