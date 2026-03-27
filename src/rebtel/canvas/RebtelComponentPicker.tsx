"use client";

// ============================================================
// APHANTASIA for REBTEL — Component Picker
// ============================================================
// Domain-organized component picker for Rebtel prototyping.
// Categories match Rebtel product domains rather than generic
// UI component categories.
// ============================================================

import { useState, useEffect, useRef } from "react";
import { canvasEngine } from "@/engine";
import type { AllRebtelComponentType } from "../types";
import { rebtelDesignStore } from "../store/RebtelDesignStore";
import type { FigmaComponentEntry } from "@/ui-mode/types";

interface RebtelComponentEntry {
  type: AllRebtelComponentType;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
}

interface RebtelCategory {
  name: string;
  items: RebtelComponentEntry[];
}

const REBTEL_CATEGORIES: RebtelCategory[] = [
  {
    name: "Top Up",
    items: [
      { type: "topUpCard", label: "Calling Card", defaultWidth: 353, defaultHeight: 340 },
      { type: "productCard", label: "Product Card", defaultWidth: 353, defaultHeight: 280 },
      { type: "amountSelector", label: "Amount Selector", defaultWidth: 353, defaultHeight: 220 },
      { type: "countryPicker", label: "Country Picker", defaultWidth: 393, defaultHeight: 400 },
      { type: "paymentModule", label: "Payment Module", defaultWidth: 353, defaultHeight: 160 },
      { type: "orderSummary", label: "Order Summary", defaultWidth: 353, defaultHeight: 280 },
      { type: "topUpFlow", label: "Top-Up Flow", defaultWidth: 393, defaultHeight: 600 },
    ],
  },
  {
    name: "Calling",
    items: [
      { type: "contactCard", label: "Home Card", defaultWidth: 353, defaultHeight: 220 },
      { type: "rateCard", label: "Rate Card", defaultWidth: 353, defaultHeight: 72 },
      { type: "phoneInput", label: "Phone Input", defaultWidth: 353, defaultHeight: 48 },
      { type: "callStatus", label: "Call Status", defaultWidth: 393, defaultHeight: 400 },
      { type: "callingFlow", label: "Calling Flow", defaultWidth: 393, defaultHeight: 600 },
    ],
  },
  {
    name: "Home & Nav",
    items: [
      { type: "appBar", label: "App Bar", defaultWidth: 393, defaultHeight: 76 },
      { type: "rebtelTabBar", label: "Bottom Nav", defaultWidth: 393, defaultHeight: 80 },
      { type: "segmentedNav", label: "Button Tabs", defaultWidth: 240, defaultHeight: 52 },
      { type: "promoCard", label: "Offer Card", defaultWidth: 353, defaultHeight: 240 },
      { type: "balanceWidget", label: "Balance Widget", defaultWidth: 353, defaultHeight: 120 },
      { type: "homeScreen", label: "Home Screen", defaultWidth: 393, defaultHeight: 600 },
    ],
  },
  {
    name: "Forms",
    items: [
      { type: "textField", label: "Text Field", defaultWidth: 353, defaultHeight: 56 },
      { type: "paymentForm", label: "Payment Form", defaultWidth: 393, defaultHeight: 700 },
      { type: "paymentMethod", label: "Payment Select", defaultWidth: 353, defaultHeight: 80 },
      { type: "pinInput", label: "PIN Input", defaultWidth: 353, defaultHeight: 80 },
    ],
  },
  {
    name: "Content",
    items: [
      { type: "heroText", label: "Hero Text", defaultWidth: 353, defaultHeight: 120 },
      { type: "sectionText", label: "Section Text", defaultWidth: 353, defaultHeight: 60 },
      { type: "countryRow", label: "Country Row", defaultWidth: 393, defaultHeight: 44 },
      { type: "label", label: "Label / Tag", defaultWidth: 67, defaultHeight: 24 },
      { type: "transactionRow", label: "Transaction Row", defaultWidth: 393, defaultHeight: 72 },
      { type: "carrierBadge", label: "Carrier Badge", defaultWidth: 120, defaultHeight: 32 },
    ],
  },
  {
    name: "Overlays",
    items: [
      { type: "rebtelBottomSheet", label: "Bottom Sheet", defaultWidth: 393, defaultHeight: 240 },
      { type: "dialogPopup", label: "Dialog Popup", defaultWidth: 320, defaultHeight: 320 },
      { type: "successScreen", label: "Success Screen", defaultWidth: 393, defaultHeight: 500 },
      { type: "errorBanner", label: "Error Banner", defaultWidth: 353, defaultHeight: 56 },
      { type: "loadingState", label: "Loading State", defaultWidth: 353, defaultHeight: 200 },
      { type: "alert", label: "Alert", defaultWidth: 353, defaultHeight: 56 },
      { type: "toast", label: "Toast", defaultWidth: 353, defaultHeight: 48 },
    ],
  },
  {
    name: "Shared",
    items: [
      { type: "button", label: "Button", defaultWidth: 353, defaultHeight: 48 },
      { type: "textInput", label: "Text Input", defaultWidth: 353, defaultHeight: 48 },
      { type: "toggle", label: "Toggle", defaultWidth: 51, defaultHeight: 31 },
      { type: "searchBar", label: "Search Bar", defaultWidth: 353, defaultHeight: 44 },
      { type: "bottomSheet", label: "Bottom Sheet", defaultWidth: 393, defaultHeight: 300 },
      { type: "divider", label: "Divider", defaultWidth: 393, defaultHeight: 1 },
      { type: "emptyState", label: "Empty State", defaultWidth: 353, defaultHeight: 200 },
    ],
  },
];

interface RebtelComponentPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RebtelComponentPicker({ isOpen, onClose }: RebtelComponentPickerProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [figmaComponents, setFigmaComponents] = useState<FigmaComponentEntry[]>([]);

  useEffect(() => {
    const unsub = rebtelDesignStore.subscribe(() => {
      setFigmaComponents(rebtelDesignStore.getRegistry());
    });
    setFigmaComponents(rebtelDesignStore.getRegistry());
    return unsub;
  }, []);

  // Dismiss on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (entry: RebtelComponentEntry) => {
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
        width: 340,
        maxHeight: 440,
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
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ color: "#E63946" }}>Rebtel</span>
        Components
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
        {REBTEL_CATEGORIES.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(i)}
            style={{
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: activeCategory === i ? 600 : 400,
              color: activeCategory === i ? "#E63946" : "rgba(255,255,255,0.45)",
              background: activeCategory === i ? "rgba(230,57,70,0.15)" : "transparent",
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
        {figmaComponents.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 4px 6px" }}>
              From Figma
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
              {figmaComponents.map(entry => (
                <button
                  key={entry.figmaId}
                  onClick={() => {
                    const doc = canvasEngine.getDocument();
                    const frameW = doc.frame.width;
                    const x = (frameW - 353) / 2;
                    const y = doc.frame.height * 0.3;
                    canvasEngine.createShape({
                      type: "rectangle",
                      x,
                      y,
                      width: 353,
                      height: 160,
                      label: entry.baseName,
                      isInsideFrame: true,
                    });
                    onClose();
                  }}
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
                    el.style.background = "rgba(230,57,70,0.15)";
                    el.style.borderColor = "rgba(230,57,70,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(255,255,255,0.05)";
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>
                    {entry.baseName}
                    {entry.hasVariants && (
                      <span style={{ opacity: 0.5, fontSize: "0.8em", marginLeft: 4 }}>
                        {Object.keys(entry.variantMap ?? {}).length}v
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 6,
          }}
        >
          {REBTEL_CATEGORIES[activeCategory].items.map((entry) => (
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
                el.style.background = "rgba(230,57,70,0.15)";
                el.style.borderColor = "rgba(230,57,70,0.3)";
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

export { REBTEL_CATEGORIES };
