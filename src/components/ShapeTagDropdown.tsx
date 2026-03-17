"use client";

import { useEffect, useRef } from "react";
import {
  COMPONENT_CATALOG,
  PRIMITIVE_CATALOG,
  type ComponentCatalogEntry,
} from "@/lib/componentCatalogData";

interface ShapeTagDropdownProps {
  open: boolean;
  onClose: () => void;
  anchorRect: { left: number; top: number; width: number; height: number } | null;
  onSelect: (entry: ComponentCatalogEntry) => void;
}

export function ShapeTagDropdown({
  open,
  onClose,
  anchorRect,
  onSelect,
}: ShapeTagDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      const el = e.target as Node;
      if (panelRef.current?.contains(el)) return;
      if (anchorRect && e.clientX >= anchorRect.left && e.clientX <= anchorRect.left + anchorRect.width &&
          e.clientY >= anchorRect.top && e.clientY <= anchorRect.top + anchorRect.height) return;
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

  const style: React.CSSProperties = {
    position: "fixed",
    left: anchorRect.left,
    top: anchorRect.top + anchorRect.height + 4,
    zIndex: 300,
    minWidth: 220,
    maxHeight: 320,
    overflowY: "auto",
    background: "rgba(26,26,26,0.98)",
    backdropFilter: "blur(16px)",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
    fontFamily: "var(--font-poppins), system-ui, sans-serif",
    padding: "8px 0",
  };

  return (
    <div ref={panelRef} style={style}>
      <div style={{ padding: "6px 12px 4px", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Sections
      </div>
      {COMPONENT_CATALOG.map((entry) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => onSelect(entry)}
          style={{
            display: "block",
            width: "100%",
            padding: "8px 14px",
            textAlign: "left",
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.9)",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          {entry.name}
        </button>
      ))}
      <div style={{ padding: "8px 12px 4px", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Components
      </div>
      {PRIMITIVE_CATALOG.map((entry) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => onSelect(entry)}
          style={{
            display: "block",
            width: "100%",
            padding: "8px 14px",
            textAlign: "left",
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.9)",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          {entry.name}
        </button>
      ))}
    </div>
  );
}
