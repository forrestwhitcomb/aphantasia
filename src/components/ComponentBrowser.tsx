"use client";

import { useEffect, useState, useCallback } from "react";
import {
  COMPONENT_CATALOG,
  PRIMITIVE_CATALOG,
  CATEGORIES,
  placeComponent,
  type ComponentCategory,
  type ComponentCatalogEntry,
} from "@/lib/componentCatalog";

type TabKind = "sections" | "components";

// Section-only categories (exclude "ui" for the Sections tab)
const SECTION_CATEGORIES = CATEGORIES.filter((c) => c.id !== "ui");

// ---------------------------------------------------------------------------
// ComponentBrowser — overlay for browsing and inserting sections + primitives
// ---------------------------------------------------------------------------
// Opened via custom event "aphantasia:open-component-browser" dispatched by
// the Toolbar "+" button or the "/" keyboard shortcut.
// ---------------------------------------------------------------------------

export function ComponentBrowser() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKind>("sections");
  const [category, setCategory] = useState<ComponentCategory | "all">("all");

  // Listen for the open event
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("aphantasia:open-component-browser", handler);
    return () =>
      window.removeEventListener("aphantasia:open-component-browser", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [open]);

  const handleSelect = useCallback((entry: ComponentCatalogEntry) => {
    placeComponent(entry);
    setOpen(false);
    setCategory("all");
  }, []);

  if (!open) return null;

  const sectionFiltered =
    category === "all"
      ? COMPONENT_CATALOG
      : COMPONENT_CATALOG.filter((c) => c.category === category);
  const list = tab === "sections" ? sectionFiltered : PRIMITIVE_CATALOG;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 200,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 201,
          width: 500,
          maxHeight: "65vh",
          display: "flex",
          flexDirection: "column",
          background: "rgba(26,26,26,0.95)",
          backdropFilter: "blur(16px)",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          fontFamily: "var(--font-poppins), system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                letterSpacing: "0.01em",
              }}
            >
              Add Component
            </span>
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                background: "rgba(255,255,255,0.08)",
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              /
            </span>
          </div>

          {/* Tabs: Sections | Components */}
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            {(["sections", "components"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 8,
                  border: "none",
                  background: tab === t ? "rgba(255,255,255,0.15)" : "transparent",
                  color: tab === t ? "#fff" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {t === "sections" ? "Sections" : "Components"}
              </button>
            ))}
          </div>

          {/* Category pills (Sections tab only) */}
          {tab === "sections" && (
          <div style={{ display: "flex", gap: 6 }}>
            {SECTION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor:
                    category === cat.id
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(255,255,255,0.08)",
                  background:
                    category === cat.id
                      ? "rgba(255,255,255,0.12)"
                      : "transparent",
                  color:
                    category === cat.id
                      ? "#fff"
                      : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          )}
        </div>

        {/* Scrollable grid */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            alignContent: "start",
          }}
        >
          {list.map((entry) => (
            <ComponentCard
              key={entry.id}
              entry={entry}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// ComponentCard — single card in the browser grid
// ---------------------------------------------------------------------------

function ComponentCard({
  entry,
  onSelect,
}: {
  entry: ComponentCatalogEntry;
  onSelect: (entry: ComponentCatalogEntry) => void;
}) {
  return (
    <button
      onClick={() => onSelect(entry)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.04)",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s, border-color 0.15s",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={entry.iconPath} />
        </svg>
      </div>

      {/* Text */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            lineHeight: 1.3,
          }}
        >
          {entry.name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.4,
            marginTop: 2,
          }}
        >
          {entry.description}
        </div>
      </div>
    </button>
  );
}
