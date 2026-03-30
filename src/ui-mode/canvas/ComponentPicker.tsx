"use client";

// ============================================================
// APHANTASIA — Component Picker
// ============================================================
// Popover listing all 32 UI components organized by category.
// Clicking a component creates a pre-tagged, pre-sized shape
// on the canvas. Dark mode to match toolbar styling.
//
// Dismiss: click outside (via useEffect document listener)
// ============================================================

import { useState, useEffect, useRef } from "react";
import { canvasEngine } from "@/engine";
import type { UIComponentType } from "../types";

interface ComponentEntry {
  type: UIComponentType;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
}

interface ComponentCategory {
  name: string;
  items: ComponentEntry[];
}

const CATEGORIES: ComponentCategory[] = [
  {
    name: "Navigation",
    items: [
      { type: "navBar", label: "NavBar", defaultWidth: 393, defaultHeight: 56 },
      { type: "tabBar", label: "TabBar", defaultWidth: 393, defaultHeight: 49 },
      { type: "searchBar", label: "SearchBar", defaultWidth: 353, defaultHeight: 44 },
      { type: "bottomSheet", label: "BottomSheet", defaultWidth: 393, defaultHeight: 300 },
    ],
  },
  {
    name: "Content",
    items: [
      { type: "card", label: "Card", defaultWidth: 353, defaultHeight: 160 },
      { type: "listGroup", label: "List", defaultWidth: 393, defaultHeight: 224 },
      { type: "sectionHeader", label: "Section Header", defaultWidth: 353, defaultHeight: 32 },
      { type: "avatar", label: "Avatar", defaultWidth: 48, defaultHeight: 48 },
      { type: "badge", label: "Badge", defaultWidth: 48, defaultHeight: 24 },
      { type: "tag", label: "Tag", defaultWidth: 80, defaultHeight: 32 },
      { type: "emptyState", label: "Empty State", defaultWidth: 353, defaultHeight: 200 },
    ],
  },
  {
    name: "Input",
    items: [
      { type: "button", label: "Button", defaultWidth: 353, defaultHeight: 44 },
      { type: "textInput", label: "Text Input", defaultWidth: 353, defaultHeight: 44 },
      { type: "toggle", label: "Toggle", defaultWidth: 51, defaultHeight: 31 },
      { type: "checkbox", label: "Checkbox", defaultWidth: 24, defaultHeight: 24 },
      { type: "segmentedControl", label: "Segmented", defaultWidth: 353, defaultHeight: 36 },
      { type: "slider", label: "Slider", defaultWidth: 353, defaultHeight: 40 },
      { type: "stepper", label: "Stepper", defaultWidth: 120, defaultHeight: 36 },
    ],
  },
  {
    name: "Text",
    items: [
      { type: "heroText", label: "Hero Text", defaultWidth: 358, defaultHeight: 48 },
      { type: "sectionText", label: "Section Text", defaultWidth: 358, defaultHeight: 32 },
      { type: "bodyText", label: "Text", defaultWidth: 358, defaultHeight: 24 },
    ],
  },
  {
    name: "Media",
    items: [
      { type: "imagePlaceholder", label: "Image", defaultWidth: 353, defaultHeight: 200 },
      { type: "carousel", label: "Carousel", defaultWidth: 393, defaultHeight: 220 },
      { type: "progressBar", label: "Progress", defaultWidth: 353, defaultHeight: 20 },
      { type: "divider", label: "Divider", defaultWidth: 393, defaultHeight: 1 },
    ],
  },
  {
    name: "Feedback",
    items: [
      { type: "alert", label: "Alert", defaultWidth: 353, defaultHeight: 56 },
      { type: "toast", label: "Toast", defaultWidth: 353, defaultHeight: 48 },
      { type: "modal", label: "Modal", defaultWidth: 300, defaultHeight: 200 },
      { type: "floatingActionButton", label: "FAB", defaultWidth: 56, defaultHeight: 56 },
    ],
  },
  {
    name: "Composite",
    items: [
      { type: "profileHeader", label: "Profile", defaultWidth: 393, defaultHeight: 200 },
      { type: "messageBubble", label: "Chat", defaultWidth: 393, defaultHeight: 200 },
      { type: "feedItem", label: "Feed Item", defaultWidth: 393, defaultHeight: 300 },
      { type: "settingsRow", label: "Settings Row", defaultWidth: 393, defaultHeight: 56 },
    ],
  },
];

interface ComponentPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComponentPicker({ isOpen, onClose }: ComponentPickerProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Dismiss on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Delay listener to avoid catching the opening click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (entry: ComponentEntry) => {
    const doc = canvasEngine.getDocument();
    const frameW = doc.frame.width;
    const frameH = doc.frame.height;
    const x = (frameW - entry.defaultWidth) / 2;
    const y = frameH * 0.3;

    canvasEngine.createShape({
      type: "rectangle",
      x,
      y,
      width: entry.defaultWidth,
      height: entry.defaultHeight,
      label: entry.label,
      isInsideFrame: true,
    });

    onClose();
  };

  return (
    <div
      ref={pickerRef}
      style={{
        position: "absolute",
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: 12,
        width: 320,
        maxHeight: 420,
        background: "rgba(26,26,26,0.95)",
        backdropFilter: "blur(16px)",
        borderRadius: 16,
        boxShadow: "0 12px 48px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 14px 8px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          fontSize: 13,
          fontWeight: 600,
          color: "rgba(255,255,255,0.9)",
        }}
      >
        Add Component
      </div>

      {/* Category tabs */}
      <div
        style={{
          display: "flex",
          gap: 2,
          padding: "6px 8px",
          overflowX: "auto",
          flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(i)}
            style={{
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: activeCategory === i ? 600 : 400,
              color: activeCategory === i ? "#818CF8" : "rgba(255,255,255,0.45)",
              background: activeCategory === i ? "rgba(99,102,241,0.15)" : "transparent",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Component grid */}
      <div style={{ padding: 8, overflowY: "auto", flex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 6,
          }}
        >
          {CATEGORIES[activeCategory].items.map((entry) => (
            <button
              key={entry.type}
              onClick={() => handleSelect(entry)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "10px 6px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.1s, border-color 0.1s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "rgba(99,102,241,0.15)";
                el.style.borderColor = "rgba(99,102,241,0.3)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "rgba(255,255,255,0.05)";
                el.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>
                {entry.label}
              </span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                {entry.defaultWidth}×{entry.defaultHeight}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { CATEGORIES };
