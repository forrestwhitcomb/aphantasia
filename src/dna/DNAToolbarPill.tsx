"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { dnaStore } from "./DNAStore";
import { DEFAULT_DNA } from "./DesignDNA";
import type { DesignDNA } from "./DesignDNA";
import { regenerateDNA } from "./generateDNA";
import { contextStore } from "@/context/ContextStore";

// ---------------------------------------------------------------------------
// DNAToolbarPill — compact palette indicator + DNA actions dropdown
// ---------------------------------------------------------------------------

export function DNAToolbarPill() {
  // Initialize with DEFAULT_DNA to match server render, then sync from store after hydration
  const [dna, setDna] = useState<DesignDNA>(DEFAULT_DNA);
  const [expanded, setExpanded] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync from localStorage-backed store after hydration
    setDna(dnaStore.getDNA());
    const unsub = dnaStore.subscribe((d) => setDna(d));
    return unsub;
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  const handleRegenerate = useCallback(async () => {
    const ctx = contextStore.getContext();
    const text = ctx?.productName || ctx?.description || ctx?.tagline || "";
    if (!text) return;
    setRegenerating(true);
    try {
      const result = await regenerateDNA(text);
      dnaStore.setDNA(result.dna, "generated");
    } catch {
      // silent — DNA stays as-is
    } finally {
      setRegenerating(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    dnaStore.resetToDefault();
    setExpanded(false);
  }, []);

  const handleOpenEditor = useCallback(() => {
    setExpanded(false);
    window.dispatchEvent(new CustomEvent("aphantasia:open-dna-editor"));
  }, []);

  const source = dnaStore.getSource();

  return (
    <div ref={pillRef} style={{ position: "relative" }}>
      {/* Compact pill — 3 color circles */}
      <button
        onClick={() => setExpanded(!expanded)}
        title="Design DNA"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          padding: "4px 8px",
          background: expanded ? "rgba(255,255,255,0.12)" : "transparent",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          transition: "background 0.15s",
          height: 32,
        }}
      >
        {[dna.palette.background, dna.palette.accent, dna.palette.foreground].map(
          (color, i) => (
            <span
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: color,
                border: "1px solid rgba(255,255,255,0.2)",
                display: "block",
              }}
            />
          )
        )}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{
            marginLeft: 2,
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        >
          <path d="M2 4l3 3 3-3" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Expanded dropdown */}
      {expanded && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: 280,
            background: "rgba(20,20,20,0.96)",
            backdropFilter: "blur(16px)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            padding: 16,
            zIndex: 100,
            fontFamily: "var(--font-poppins)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Design DNA
            </span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
              {source}
            </span>
          </div>

          {/* Palette swatches */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {([
              ["bg", dna.palette.background],
              ["fg", dna.palette.foreground],
              ["accent", dna.palette.accent],
              ["muted", dna.palette.muted],
              ["card", dna.palette.card],
              ["border", dna.palette.border],
            ] as [string, string][]).map(([label, color]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: color,
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  title={`${label}: ${color}`}
                />
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Typography */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
              Typography
            </div>
            <div style={{ fontSize: 12, color: "#fff" }}>
              {dna.typography.headingFamily} + {dna.typography.bodyFamily}
            </div>
          </div>

          {/* Chips row */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            <Chip label={dna.decorative.style} />
            <Chip label={`motion: ${dna.motion.level}`} />
            <Chip label={dna.spacing.density} />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 6 }}>
            <PillButton
              label="Customize"
              onClick={handleOpenEditor}
            />
            <PillButton
              label={regenerating ? "..." : "Regenerate"}
              onClick={handleRegenerate}
              disabled={regenerating}
            />
            <PillButton
              label="Reset"
              onClick={handleReset}
              subtle
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Chip({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: 10,
        color: "rgba(255,255,255,0.6)",
        background: "rgba(255,255,255,0.06)",
        borderRadius: 4,
        padding: "2px 8px",
      }}
    >
      {label}
    </span>
  );
}

function PillButton({
  label,
  onClick,
  disabled,
  subtle,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  subtle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        padding: "6px 0",
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 6,
        border: "1px solid rgba(255,255,255,0.1)",
        background: subtle ? "transparent" : "rgba(255,255,255,0.08)",
        color: subtle ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.7)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "inherit",
        transition: "background 0.15s",
      }}
    >
      {label}
    </button>
  );
}
