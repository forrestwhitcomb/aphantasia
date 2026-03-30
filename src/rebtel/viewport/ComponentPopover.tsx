"use client";

// ============================================================
// ComponentPopover — Unified 3-state component editing popover
// ============================================================
// Single popover replacing VariantPicker + NodePropertyPanel.
// Three views:
//   "variants" — pick a variant (primary, secondary, etc.)
//   "change"   — swap component type (button → text, etc.)
//   "modify"   — change text style (text XL, text L, label)
// ============================================================

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import type { ComponentSpec, TextStyleToken } from "../spec/types";
import { getTemplatesForPrimitive } from "../templates";
import { REBTEL_COMPONENTS } from "../canvas/RebtelComponentPicker";
import type { RebtelPickerEntry } from "../canvas/RebtelComponentPicker";

type View = "variants" | "change" | "modify";

interface ComponentPopoverProps {
  shapeId: string;
  componentType: string;
  currentVariant: string;
  spec: ComponentSpec;
  bounds: { x: number; y: number; width: number; height: number };
  scale: number;
  iframeEl: HTMLDivElement | null;
  isSubComponent?: boolean;
  subNodeKey?: string;
  onVariantChange: (shapeId: string, variant: string) => void;
  onSwapComponent?: (shapeId: string, nodeKey: string, primitive: string, template: string) => void;
  onTextStyleChange?: (shapeId: string, nodeKey: string, style: TextStyleToken) => void;
  onDismiss: () => void;
}

// Categories for the "Change" view — derived from REBTEL_COMPONENTS
const CHANGE_CATEGORIES = [
  { name: "Buttons", filter: (e: RebtelPickerEntry) => e.primitive === "button" },
  { name: "Text & Media", filter: (e: RebtelPickerEntry) => ["text", "divider", "media"].includes(e.primitive) },
  { name: "Inputs", filter: (e: RebtelPickerEntry) => e.primitive === "input" },
  { name: "Cards", filter: (e: RebtelPickerEntry) => e.primitive === "card" },
  { name: "Navigation", filter: (e: RebtelPickerEntry) => e.primitive === "bar" },
  { name: "Sheets", filter: (e: RebtelPickerEntry) => e.primitive === "sheet" },
  { name: "Other", filter: (e: RebtelPickerEntry) => ["selector", "status", "row"].includes(e.primitive) },
];

// Text style options for "Modify" view
const TEXT_STYLES: { label: string; token: TextStyleToken }[] = [
  { label: "text XL", token: "paragraph-xl" },
  { label: "text L", token: "paragraph-lg" },
  { label: "text M", token: "paragraph-md" },
  { label: "label", token: "label-md" },
  { label: "headline", token: "headline-sm" },
];

export function ComponentPopover({
  shapeId,
  componentType,
  currentVariant,
  spec,
  bounds,
  scale,
  iframeEl,
  isSubComponent,
  subNodeKey,
  onVariantChange,
  onSwapComponent,
  onTextStyleChange,
  onDismiss,
}: ComponentPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("variants");
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // Compute screen position from viewport ref rect + component bounds
  useEffect(() => {
    if (!iframeEl) return;
    const rect = iframeEl.getBoundingClientRect();
    const compScreenX = rect.left + bounds.x * scale;
    const compScreenY = rect.top + bounds.y * scale;
    const popoverWidth = 160;
    let x = compScreenX - popoverWidth - 8;
    if (x < 4) {
      x = compScreenX + bounds.width * scale + 8;
    }
    setPos({ x, y: compScreenY });
  }, [iframeEl, bounds, scale]);

  // Reset view when component changes
  useEffect(() => {
    setView("variants");
  }, [shapeId, componentType]);

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

  const variants = useMemo(
    () => getTemplatesForPrimitive(componentType),
    [componentType],
  );

  const hasText = !!spec.text;

  const handleVariant = useCallback(
    (variant: string) => onVariantChange(shapeId, variant),
    [shapeId, onVariantChange],
  );

  const handleSwap = useCallback(
    (entry: RebtelPickerEntry) => {
      const key = subNodeKey ?? spec.key;
      onSwapComponent?.(shapeId, key, entry.primitive, entry.template);
      onDismiss();
    },
    [shapeId, subNodeKey, spec.key, onSwapComponent, onDismiss],
  );

  const handleTextStyle = useCallback(
    (token: TextStyleToken) => {
      const key = subNodeKey ?? spec.key;
      onTextStyleChange?.(shapeId, key, token);
    },
    [shapeId, subNodeKey, spec.key, onTextStyleChange],
  );

  if (!pos) return null;

  const popoverStyle: React.CSSProperties = {
    position: "fixed",
    left: pos.x,
    top: pos.y,
    zIndex: 9999,
    background: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: "8px 6px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: 148,
    maxHeight: 360,
    overflowY: "auto",
    boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
    fontFamily: "var(--font-poppins), system-ui, sans-serif",
  };

  const itemStyle = (active: boolean): React.CSSProperties => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "6px 10px",
    borderRadius: 7,
    border: "none",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
    background: active ? "rgba(99,102,241,0.25)" : "transparent",
    color: active ? "#a5b4fc" : "rgba(255,255,255,0.75)",
  });

  const backHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 6px 6px",
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontFamily: "inherit",
    width: "100%",
    textAlign: "left",
  };

  // ── Variants view (default) ────────────────────────────────
  if (view === "variants") {
    return createPortal(
      <div ref={popoverRef} style={popoverStyle}>
        {/* Header: type label + action icons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "2px 6px 4px",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              flex: 1,
            }}
          >
            {componentType}
          </span>

          {/* Swap icon (change component type) */}
          {onSwapComponent && (
            <button
              onClick={() => setView("change")}
              title="Change component type"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 2,
                color: "rgba(255,255,255,0.4)",
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4m0 0L3 8m4-4l4 4" />
                <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          )}

          {/* Edit icon (modify text style) */}
          {hasText && onTextStyleChange && (
            <button
              onClick={() => setView("modify")}
              title="Modify text style"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 2,
                color: "rgba(255,255,255,0.4)",
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </button>
          )}
        </div>

        {/* Variant list */}
        {variants.map((v) => (
          <button
            key={v}
            onClick={() => handleVariant(v)}
            style={itemStyle(v === currentVariant)}
          >
            {v}
          </button>
        ))}
      </div>,
      document.body,
    );
  }

  // ── Change view (swap component type) ──────────────────────
  if (view === "change") {
    return createPortal(
      <div ref={popoverRef} style={{ ...popoverStyle, maxHeight: 420, width: 180 }}>
        <button onClick={() => setView("variants")} style={backHeaderStyle}>
          <span style={{ fontSize: 13 }}>‹</span> CHANGE
        </button>

        {CHANGE_CATEGORIES.map((cat) => {
          const items = REBTEL_COMPONENTS.filter(cat.filter);
          if (items.length === 0) return null;
          return (
            <div key={cat.name}>
              <div style={{
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "6px 10px 2px",
              }}>
                {cat.name}
              </div>
              {items.map((entry) => (
                <button
                  key={`${entry.primitive}-${entry.template}-${entry.label}`}
                  onClick={() => handleSwap(entry)}
                  style={itemStyle(
                    entry.primitive === componentType && entry.template === currentVariant
                  )}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          );
        })}
      </div>,
      document.body,
    );
  }

  // ── Modify view (text style) ───────────────────────────────
  if (view === "modify") {
    return createPortal(
      <div ref={popoverRef} style={popoverStyle}>
        <button onClick={() => setView("variants")} style={backHeaderStyle}>
          <span style={{ fontSize: 13 }}>‹</span> Modify
        </button>

        {TEXT_STYLES.map((ts) => (
          <button
            key={ts.token}
            onClick={() => handleTextStyle(ts.token)}
            style={itemStyle(spec.text?.style === ts.token)}
          >
            {ts.label}
          </button>
        ))}
      </div>,
      document.body,
    );
  }

  return null;
}
