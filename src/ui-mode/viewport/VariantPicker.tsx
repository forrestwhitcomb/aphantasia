"use client";

// ============================================================
// APHANTASIA — Variant Picker Popover
// ============================================================
// Floating popover that appears when a user clicks a component
// in the viewport iframe. Shows available variants for the
// component type and a dark mode toggle.
//
// Renders via a React portal to document.body so it is never
// clipped by parent overflow: hidden containers.
// Positioned using the iframe's screen rect + component bounds.
// ============================================================

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";

interface VariantPickerProps {
  shapeId: string;
  componentType: string;
  currentVariant: string;
  /** Component bounds relative to the iframe viewport (0,0 = top-left of iframe content) */
  bounds: { x: number; y: number; width: number; height: number };
  scale: number;
  /** Ref to the iframe element — used to compute screen position */
  iframeEl: HTMLIFrameElement | null;
  onVariantChange: (shapeId: string, variant: string) => void;
  onDarkModeToggle: (shapeId: string, darkMode: boolean) => void;
  onDismiss: () => void;
}

/** Available variants per component type */
const VARIANT_OPTIONS: Record<string, string[]> = {
  button: ["primary", "secondary", "outline", "ghost", "destructive", "icon-only"],
  navBar: ["standard", "large-title", "search", "segmented"],
  tabBar: ["icon-only", "icon-label", "pill-active"],
  card: ["elevated", "bordered", "filled", "image-top"],
  bottomSheet: ["handle", "full", "scrollable"],
  listItem: ["simple", "subtitle", "icon-left", "chevron", "toggle", "destructive"],
  listGroup: ["inset", "plain", "separated"],
  header: ["large", "medium", "small"],
  sectionHeader: ["plain", "with-action"],
  avatar: ["circle", "rounded", "initials"],
  badge: ["default", "destructive", "outline", "count"],
  tag: ["default", "selected", "removable"],
  emptyState: ["icon-top", "illustration", "minimal"],
  textInput: ["default", "with-icon", "with-label", "multiline"],
  searchBar: ["default", "with-cancel", "with-filter"],
  segmentedControl: ["default", "pill"],
  imagePlaceholder: ["rounded", "sharp", "circle"],
  carousel: ["full-width", "peek", "dots", "progress-bar"],
  progressBar: ["linear", "circular", "steps"],
  divider: ["full", "inset", "with-text"],
  alert: ["info", "success", "warning", "error"],
  toast: ["default", "with-action"],
  modal: ["alert", "action-sheet", "full-screen"],
  floatingActionButton: ["default", "extended"],
  profileHeader: ["centered", "left-aligned", "with-cover"],
  messageBubble: ["sent", "received", "with-avatar"],
  feedItem: ["social", "news", "minimal"],
  settingsRow: ["toggle", "navigation", "value", "destructive"],
};

export function VariantPicker({
  shapeId,
  componentType,
  currentVariant,
  bounds,
  scale,
  iframeEl,
  onVariantChange,
  onDarkModeToggle,
  onDismiss,
}: VariantPickerProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // Compute screen position from iframe rect + component bounds
  useEffect(() => {
    if (!iframeEl) return;
    const iframeRect = iframeEl.getBoundingClientRect();
    // Component bounds are in iframe-internal coordinates; scale them
    const compScreenX = iframeRect.left + bounds.x * scale;
    const compScreenY = iframeRect.top + bounds.y * scale;
    const popoverWidth = 152;
    // Try left side first; if it would go off-screen, use right side
    let x = compScreenX - popoverWidth - 8;
    if (x < 4) {
      x = compScreenX + bounds.width * scale + 8;
    }
    setPos({ x, y: compScreenY });
  }, [iframeEl, bounds, scale]);

  // Dismiss on click outside or Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onDismiss();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onDismiss]);

  const variants = VARIANT_OPTIONS[componentType] ?? [];

  const handleVariant = useCallback(
    (variant: string) => onVariantChange(shapeId, variant),
    [shapeId, onVariantChange]
  );

  const handleDark = useCallback(
    () => onDarkModeToggle(shapeId, true),
    [shapeId, onDarkModeToggle]
  );

  if (variants.length === 0 || !pos) return null;

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 10,
        padding: "8px 6px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 140,
        maxHeight: 320,
        overflowY: "auto",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
      }}
    >
      {/* Component type label */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          padding: "2px 6px",
        }}
      >
        {componentType}
      </div>

      {/* Variant chips */}
      {variants.map((v) => (
        <button
          key={v}
          onClick={() => handleVariant(v)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "5px 8px",
            borderRadius: 6,
            border: "none",
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "inherit",
            cursor: "pointer",
            background:
              v === currentVariant
                ? "rgba(99,102,241,0.25)"
                : "transparent",
            color:
              v === currentVariant
                ? "#a5b4fc"
                : "rgba(255,255,255,0.75)",
          }}
        >
          {v}
        </button>
      ))}

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.08)",
          margin: "2px 4px",
        }}
      />

      {/* Dark mode toggle */}
      <button
        onClick={handleDark}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          width: "100%",
          textAlign: "left",
          padding: "5px 8px",
          borderRadius: 6,
          border: "none",
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "inherit",
          cursor: "pointer",
          background: "transparent",
          color: "rgba(255,255,255,0.75)",
        }}
      >
        <span style={{ fontSize: 14 }}>&#9790;</span>
        Dark Mode
      </button>
    </div>,
    document.body
  );
}
