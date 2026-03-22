"use client";

// ============================================================
// APHANTASIA — UI Shape Tag Dropdown
// ============================================================
// Dropdown for tagging shapes with one of the 32 UI component
// types. Shown instead of ShapeTagDropdown when in UI mode.
// Reuses CATEGORIES data from ComponentPicker.
// ============================================================

import { useEffect, useRef } from "react";
import { CATEGORIES } from "./ComponentPicker";
import type { UIComponentType } from "../types";

interface UIShapeTagDropdownProps {
  open: boolean;
  onClose: () => void;
  anchorRect: { left: number; top: number; width: number; height: number } | null;
  onSelect: (type: UIComponentType, label: string) => void;
  currentType?: string;
}

export function UIShapeTagDropdown({
  open,
  onClose,
  anchorRect,
  onSelect,
  currentType,
}: UIShapeTagDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      const el = e.target as Node;
      if (panelRef.current?.contains(el)) return;
      if (
        anchorRect &&
        e.clientX >= anchorRect.left &&
        e.clientX <= anchorRect.left + anchorRect.width &&
        e.clientY >= anchorRect.top &&
        e.clientY <= anchorRect.top + anchorRect.height
      )
        return;
      onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onClose, anchorRect]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open, onClose]);

  if (!open || !anchorRect) return null;

  // Position: try above the anchor, fall back to below
  const dropdownHeight = 360;
  const fitsAbove = anchorRect.top - dropdownHeight - 4 > 0;
  const top = fitsAbove
    ? anchorRect.top - dropdownHeight - 4
    : anchorRect.top + anchorRect.height + 4;

  const style: React.CSSProperties = {
    position: "fixed",
    left: Math.min(anchorRect.left, window.innerWidth - 240),
    top,
    zIndex: 300,
    width: 230,
    maxHeight: dropdownHeight,
    overflowY: "auto",
    background: "rgba(26,26,26,0.98)",
    backdropFilter: "blur(16px)",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
    fontFamily: "var(--font-poppins), system-ui, sans-serif",
    padding: "6px 0",
  };

  return (
    <div ref={panelRef} style={style}>
      <div
        style={{
          padding: "6px 12px 4px",
          fontSize: 11,
          fontWeight: 600,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.02em",
        }}
      >
        Tag as Component
      </div>

      {CATEGORIES.map((cat) => (
        <div key={cat.name}>
          <div
            style={{
              padding: "8px 12px 3px",
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {cat.name}
          </div>
          {cat.items.map((entry) => {
            const isActive = currentType === entry.type;
            return (
              <button
                key={entry.type}
                type="button"
                onClick={() => onSelect(entry.type, entry.label)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "7px 14px",
                  textAlign: "left",
                  border: "none",
                  background: isActive ? "rgba(99,102,241,0.2)" : "transparent",
                  color: isActive ? "#818CF8" : "rgba(255,255,255,0.85)",
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActive ? "rgba(99,102,241,0.2)" : "transparent";
                }}
              >
                {entry.label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
