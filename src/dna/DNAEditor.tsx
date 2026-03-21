"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { dnaStore } from "./DNAStore";
import { FONT_PAIRINGS } from "./fontLibrary";
import type { DesignDNA, DecorativeStyle, MotionLevel, SpacingDensity, ButtonStyle } from "./DesignDNA";

// ---------------------------------------------------------------------------
// DNAEditor — slide-out panel for manual DNA customization
// ---------------------------------------------------------------------------

export function DNAEditor() {
  const [open, setOpen] = useState(false);
  const [dna, setDna] = useState<DesignDNA>(dnaStore.getDNA());

  // Listen for open event from DNAToolbarPill
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("aphantasia:open-dna-editor", handler);
    return () => window.removeEventListener("aphantasia:open-dna-editor", handler);
  }, []);

  // Sync DNA state
  useEffect(() => {
    const unsub = dnaStore.subscribe((d) => setDna(d));
    return unsub;
  }, []);

  const updatePalette = useCallback((field: string, value: string) => {
    dnaStore.merge({ palette: { [field]: value } });
  }, []);

  const updateTypography = useCallback((pairingId: string) => {
    const pairing = FONT_PAIRINGS.find((p) => p.id === pairingId);
    if (!pairing) return;
    dnaStore.merge({
      typography: {
        headingFamily: pairing.heading,
        bodyFamily: pairing.body,
        headingWeight: pairing.headingWeight,
        headingLetterSpacing: pairing.headingLetterSpacing,
      },
    });
  }, []);

  if (!open) return null;

  // Render via portal to escape toolbar's stacking context
  const content = (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 199,
        }}
      />
      {/* Centered modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 420,
          maxHeight: "80vh",
          background: "rgba(14,14,14,0.98)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          zIndex: 200,
          overflowY: "auto",
          fontFamily: "var(--font-poppins)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            position: "sticky",
            top: 0,
            background: "rgba(14,14,14,0.98)",
            borderRadius: "16px 16px 0 0",
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
            DNA Editor
          </span>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: 14,
              lineHeight: 1,
              padding: "4px 8px",
              borderRadius: 6,
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ padding: "16px 24px" }}>
        {/* Palette Section */}
        <SectionLabel>Palette</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {([
            ["background", "Background"],
            ["foreground", "Foreground"],
            ["accent", "Accent"],
            ["accentForeground", "Accent FG"],
            ["muted", "Muted"],
            ["card", "Card"],
          ] as [keyof DesignDNA["palette"], string][]).map(([field, label]) => {
            const val = dna.palette[field];
            // Convert rgba to hex-ish for color picker
            const isHex = val.startsWith("#");
            return (
              <div key={field}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                  {label}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="color"
                    value={isHex ? val.substring(0, 7) : "#888888"}
                    onChange={(e) => updatePalette(field, e.target.value)}
                    style={{
                      width: 28,
                      height: 28,
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 4,
                      padding: 0,
                      background: "none",
                      cursor: "pointer",
                    }}
                  />
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => updatePalette(field, e.target.value)}
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 4,
                      color: "#fff",
                      fontSize: 10,
                      padding: "4px 6px",
                      fontFamily: "monospace",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Typography Section */}
        <SectionLabel>Typography</SectionLabel>
        <select
          value={FONT_PAIRINGS.find(
            (p) => p.heading === dna.typography.headingFamily
          )?.id || "tech-forward"}
          onChange={(e) => updateTypography(e.target.value)}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            color: "#fff",
            fontSize: 12,
            padding: "8px 10px",
            marginBottom: 6,
            fontFamily: "inherit",
          }}
        >
          {FONT_PAIRINGS.map((p) => (
            <option key={p.id} value={p.id} style={{ background: "#1a1a1a" }}>
              {p.heading} + {p.body} — {p.character}
            </option>
          ))}
        </select>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
          Current: {dna.typography.headingFamily} + {dna.typography.bodyFamily}
        </div>

        {/* Decorative Style */}
        <SectionLabel>Decorative Style</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 20 }}>
          {(["geometric", "organic", "minimal", "editorial", "grid-overlay", "gradient-blobs"] as DecorativeStyle[]).map(
            (style) => (
              <ToggleChip
                key={style}
                label={style}
                active={dna.decorative.style === style}
                onClick={() => dnaStore.merge({ decorative: { style } })}
              />
            )
          )}
        </div>

        {/* Decorative Intensity */}
        <SectionLabel>Decorative Intensity</SectionLabel>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {(["subtle", "moderate", "bold"] as const).map((intensity) => (
            <ToggleChip
              key={intensity}
              label={intensity}
              active={dna.decorative.intensity === intensity}
              onClick={() => dnaStore.merge({ decorative: { intensity } })}
            />
          ))}
        </div>

        {/* Motion Level */}
        <SectionLabel>Motion</SectionLabel>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {(["none", "subtle", "expressive"] as MotionLevel[]).map((level) => (
            <ToggleChip
              key={level}
              label={level}
              active={dna.motion.level === level}
              onClick={() => dnaStore.merge({ motion: { level } })}
            />
          ))}
        </div>

        {/* Button Radius */}
        <SectionLabel>Button Radius</SectionLabel>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {[
            ["0px", "Sharp"],
            ["4px", "4"],
            ["8px", "8"],
            ["12px", "12"],
            ["9999px", "Pill"],
          ].map(([val, label]) => (
            <ToggleChip
              key={val}
              label={label}
              active={dna.buttons.radius === val}
              onClick={() => dnaStore.merge({ buttons: { radius: val } })}
            />
          ))}
        </div>
        {/* Preview button sample */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 24px",
              borderRadius: dna.buttons.radius,
              background:
                dna.buttons.style === "solid" || dna.buttons.style === "gradient"
                  ? dna.palette.accent
                  : "transparent",
              color:
                dna.buttons.style === "solid" || dna.buttons.style === "gradient"
                  ? dna.palette.accentForeground
                  : dna.palette.accent,
              border:
                dna.buttons.style === "outline"
                  ? `1px solid ${dna.palette.accent}`
                  : "1px solid transparent",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Sample Button
          </div>
        </div>

        {/* Button Style */}
        <SectionLabel>Button Style</SectionLabel>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {(["solid", "outline", "ghost", "gradient"] as ButtonStyle[]).map((style) => (
            <ToggleChip
              key={style}
              label={style}
              active={dna.buttons.style === style}
              onClick={() => dnaStore.merge({ buttons: { style } })}
            />
          ))}
        </div>

        {/* Spacing Density */}
        <SectionLabel>Spacing</SectionLabel>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {(["spacious", "balanced", "tight"] as SpacingDensity[]).map((density) => (
            <ToggleChip
              key={density}
              label={density}
              active={dna.spacing.density === density}
              onClick={() => {
                const paddings: Record<SpacingDensity, string> = {
                  spacious: "clamp(80px, 12vw, 140px)",
                  balanced: "clamp(60px, 8vw, 100px)",
                  tight: "clamp(40px, 6vw, 72px)",
                };
                dnaStore.merge({
                  spacing: {
                    density,
                    sectionPadding: paddings[density],
                  },
                });
              }}
            />
          ))}
        </div>

        {/* Surfaces */}
        <SectionLabel>Card Surface</SectionLabel>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {(["elevated", "bordered", "glass", "flat", "accent-top"] as const).map(
            (cards) => (
              <ToggleChip
                key={cards}
                label={cards}
                active={dna.surfaces.cards === cards}
                onClick={() => dnaStore.merge({ surfaces: { cards } })}
              />
            )
          )}
        </div>
      </div>
    </div>
    </>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        color: "rgba(255,255,255,0.5)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function ToggleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "5px 0",
        fontSize: 10,
        fontWeight: active ? 600 : 400,
        borderRadius: 5,
        border: active
          ? "1px solid rgba(255,255,255,0.2)"
          : "1px solid rgba(255,255,255,0.06)",
        background: active ? "rgba(255,255,255,0.1)" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.45)",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.12s",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
