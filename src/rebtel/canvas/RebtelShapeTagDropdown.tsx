"use client";

// ============================================================
// Rebtel Shape Tag Dropdown — Tag shapes as Rebtel components
// ============================================================
// Shown when user clicks "Tag as component" on a canvas shape
// in Rebtel mode. Uses the same REBTEL_COMPONENTS list as the
// component picker. On selection, sets primitive/template/spec
// so the viewport renders the actual Rebtel component.
// ============================================================

import { useEffect, useRef } from "react";
import { REBTEL_COMPONENTS } from "./RebtelComponentPicker";
import type { RebtelPickerEntry } from "./RebtelComponentPicker";

// Derive categories from flat list for organized display
const CATEGORIES = [
  { name: "Navigation", filter: (e: RebtelPickerEntry) => e.primitive === "bar" },
  { name: "Cards", filter: (e: RebtelPickerEntry) => e.primitive === "card" },
  { name: "Inputs", filter: (e: RebtelPickerEntry) => e.primitive === "input" },
  { name: "Rows", filter: (e: RebtelPickerEntry) => e.primitive === "row" },
  { name: "Sheets", filter: (e: RebtelPickerEntry) => e.primitive === "sheet" },
  { name: "Buttons", filter: (e: RebtelPickerEntry) => e.primitive === "button" },
  { name: "Text & Media", filter: (e: RebtelPickerEntry) => ["text", "divider", "media"].includes(e.primitive) },
  { name: "Other", filter: (e: RebtelPickerEntry) => ["selector", "status"].includes(e.primitive) },
];

interface RebtelShapeTagDropdownProps {
  open: boolean;
  onClose: () => void;
  anchorRect: { left: number; top: number; width: number; height: number } | null;
  onSelect: (entry: RebtelPickerEntry) => void;
  currentPrimitive?: string;
  currentTemplate?: string;
}

export function RebtelShapeTagDropdown({
  open,
  onClose,
  anchorRect,
  onSelect,
  currentPrimitive,
  currentTemplate,
}: RebtelShapeTagDropdownProps) {
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

  const dropdownHeight = 400;
  const fitsAbove = anchorRect.top - dropdownHeight - 4 > 0;
  const top = fitsAbove
    ? anchorRect.top - dropdownHeight - 4
    : anchorRect.top + anchorRect.height + 4;

  const style: React.CSSProperties = {
    position: "fixed",
    left: Math.min(anchorRect.left, window.innerWidth - 250),
    top,
    zIndex: 300,
    width: 240,
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
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ color: "#E63946" }}>Rebtel</span> Component
      </div>

      {CATEGORIES.map((cat) => {
        const items = REBTEL_COMPONENTS.filter(cat.filter);
        if (items.length === 0) return null;
        return (
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
            {items.map((entry) => {
              const isActive =
                currentPrimitive === entry.primitive &&
                currentTemplate === entry.template;
              return (
                <button
                  key={`${entry.primitive}-${entry.template}-${entry.label}`}
                  type="button"
                  onClick={() => onSelect(entry)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "7px 14px",
                    textAlign: "left",
                    border: "none",
                    background: isActive ? "rgba(230,57,70,0.2)" : "transparent",
                    color: isActive ? "#E63946" : "rgba(255,255,255,0.85)",
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isActive
                      ? "rgba(230,57,70,0.2)"
                      : "transparent";
                  }}
                >
                  {entry.label}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
