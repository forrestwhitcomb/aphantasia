"use client";

// ============================================================
// APHANTASIA for REBTEL — Component Picker (v2)
// ============================================================
// Flat single-section list matching all titled Figma components.
// No tabs, no categories. Components generate ComponentSpec on drop.
// ============================================================

import { useEffect, useRef } from "react";
import { canvasEngine } from "@/engine";
import { resolveTemplate } from "../templates";
import { getLegacyMapping } from "../spec/primitives";

interface PickerEntry {
  /** Display name matching Figma title */
  label: string;
  /** Legacy type for meta.uiComponentType (keeps semantic resolver working) */
  legacyType: string;
  /** Primitive + template for ComponentSpec generation */
  primitive: string;
  template: string;
  /** Default canvas dimensions */
  w: number;
  h: number;
  /** Optional props passed to template factory */
  props?: Record<string, unknown>;
}

// All 33 Figma components — flat list, ordered by usage frequency
const COMPONENTS: PickerEntry[] = [
  // Navigation
  { label: "App Bar", legacyType: "appBar", primitive: "bar", template: "app-bar", w: 393, h: 76 },
  { label: "Tab Bar", legacyType: "rebtelTabBar", primitive: "bar", template: "tab-bar", w: 393, h: 90 },
  { label: "Section Header", legacyType: "appBar", primitive: "bar", template: "app-bar", w: 393, h: 48, props: { variant: "back" } },

  // Cards
  { label: "Card / Calling", legacyType: "contactCard", primitive: "card", template: "contact-calling", w: 358, h: 170 },
  { label: "Card / Top-up", legacyType: "contactCard", primitive: "card", template: "contact-topup", w: 358, h: 185, props: { variant: "topup" } },
  { label: "Card / Empty", legacyType: "contactCard", primitive: "card", template: "blank", w: 358, h: 122 },
  { label: "Card / Promo", legacyType: "promoCard", primitive: "card", template: "promo", w: 358, h: 220 },
  { label: "Card / Product MTU", legacyType: "productCard", primitive: "card", template: "product-mtu", w: 358, h: 220 },
  { label: "Card / Calling Credits", legacyType: "topUpCard", primitive: "card", template: "product-credits", w: 361, h: 335 },
  { label: "Card / Order Summary", legacyType: "orderSummary", primitive: "card", template: "order-summary", w: 350, h: 246 },
  { label: "Card / Service Type", legacyType: "productCard", primitive: "card", template: "service-type", w: 358, h: 120 },
  { label: "Card / Info w Icon", legacyType: "label", primitive: "card", template: "info-icon", w: 360, h: 74 },
  { label: "Card / Info", legacyType: "label", primitive: "card", template: "info", w: 360, h: 74, props: { showIcon: false } },
  { label: "Rebtel Credits", legacyType: "balanceWidget", primitive: "card", template: "credits-collapsed", w: 358, h: 56 },
  { label: "Credits Expanded", legacyType: "balanceWidget", primitive: "card", template: "credits-expanded", w: 358, h: 296 },

  // Inputs
  { label: "Text Field", legacyType: "textField", primitive: "input", template: "text-field", w: 358, h: 51 },
  { label: "PIN Input", legacyType: "pinInput", primitive: "input", template: "pin", w: 358, h: 75 },
  { label: "Search Bar", legacyType: "searchBar", primitive: "input", template: "search", w: 350, h: 52 },
  { label: "Phone Input", legacyType: "phoneInput", primitive: "input", template: "phone", w: 358, h: 52 },

  // Rows
  { label: "Country Row", legacyType: "countryRow", primitive: "row", template: "country", w: 390, h: 44 },
  { label: "Contact Row", legacyType: "contactCard", primitive: "row", template: "contact", w: 358, h: 72, props: { variant: "compact" } },

  // Sheets
  { label: "Bottom Sheet (2 btn)", legacyType: "rebtelBottomSheet", primitive: "sheet", template: "action-sheet", w: 390, h: 361 },
  { label: "Bottom Sheet (1 btn)", legacyType: "rebtelBottomSheet", primitive: "sheet", template: "action-sheet-single", w: 390, h: 285, props: { variant: "one-button" } },
  { label: "Bottom Sheet Empty", legacyType: "rebtelBottomSheet", primitive: "sheet", template: "blank", w: 390, h: 117 },
  { label: "Payment Sheet", legacyType: "paymentMethod", primitive: "sheet", template: "payment", w: 390, h: 248 },
  { label: "Dialog", legacyType: "dialogPopup", primitive: "sheet", template: "dialog", w: 406, h: 344 },

  // Selectors
  { label: "Tabs", legacyType: "segmentedNav", primitive: "selector", template: "tabs", w: 244, h: 52 },

  // Status
  { label: "Success State", legacyType: "successScreen", primitive: "status", template: "success", w: 390, h: 844 },
  { label: "Loading State", legacyType: "loadingState", primitive: "status", template: "loading", w: 120, h: 96 },

  // Buttons
  { label: "Button Primary", legacyType: "button", primitive: "button", template: "primary", w: 358, h: 64 },
  { label: "Button Outlined", legacyType: "button", primitive: "button", template: "outlined", w: 358, h: 64, props: { variant: "secondary-white" } },
  { label: "Button Red", legacyType: "button", primitive: "button", template: "red", w: 358, h: 64, props: { variant: "primary" } },
  { label: "Button Ghost", legacyType: "button", primitive: "button", template: "borderless", w: 358, h: 64, props: { variant: "ghost" } },

  // Text + Media
  { label: "Text Block", legacyType: "sectionText", primitive: "text", template: "paragraph-md", w: 353, h: 40 },
  { label: "Divider", legacyType: "divider", primitive: "divider", template: "default", w: 393, h: 1 },
];

interface RebtelComponentPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RebtelComponentPicker({ isOpen, onClose }: RebtelComponentPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (entry: PickerEntry) => {
    const doc = canvasEngine.getDocument();
    const frameW = doc.frame.width;
    const x = (frameW - entry.w) / 2;
    const y = doc.frame.height * 0.3;

    // Generate ComponentSpec from template
    const spec = resolveTemplate(entry.primitive, entry.template, entry.props);

    canvasEngine.createShape({
      type: "rectangle",
      x,
      y,
      width: entry.w,
      height: entry.h,
      label: entry.label,
      isInsideFrame: true,
      primitive: entry.primitive,
      template: entry.template,
      spec,
      meta: {
        uiComponentType: entry.legacyType,
        variant: entry.props?.variant,
      },
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
        maxHeight: 480,
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
        <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
          {COMPONENTS.length}
        </span>
      </div>

      {/* Component grid — flat, no tabs */}
      <div style={{ padding: 8, overflowY: "auto", flex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 6,
          }}
        >
          {COMPONENTS.map((entry) => (
            <button
              key={`${entry.primitive}-${entry.template}`}
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
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.85)", textAlign: "center", lineHeight: 1.3 }}>
                {entry.label}
              </span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                {entry.w}×{entry.h}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Keep export for backwards compat
export const REBTEL_CATEGORIES = [] as { name: string; items: { type: string; label: string; defaultWidth: number; defaultHeight: number }[] }[];
