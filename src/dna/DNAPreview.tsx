"use client";

import { useState, useEffect, useRef } from "react";
import type { DesignDNA } from "./DesignDNA";
import { buildGoogleFontsUrl, FONT_PAIRINGS } from "./fontLibrary";

// ============================================================
// DNAPreview — Design Direction Preview Card
// ============================================================
// Shows a generated DNA as a visual preview with palette swatches,
// font samples, and design attribute chips. Actions: Apply, Try
// another, Customize (Phase 4).
// ============================================================

interface Props {
  dna: DesignDNA;
  onApply: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
}

export default function DNAPreview({ dna, onApply, onRegenerate, isLoading }: Props) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const linkRef = useRef<HTMLLinkElement | null>(null);

  // Load Google Fonts for the DNA's font pairing
  useEffect(() => {
    setFontsLoaded(false);
    const href = buildGoogleFontsUrl(dna.typography.headingFamily, dna.typography.bodyFamily);

    // Remove previous link if any
    if (linkRef.current) {
      linkRef.current.remove();
      linkRef.current = null;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => setFontsLoaded(true);
    link.onerror = () => setFontsLoaded(true); // Don't block on font load failure
    document.head.appendChild(link);
    linkRef.current = link;

    return () => {
      if (linkRef.current) {
        linkRef.current.remove();
        linkRef.current = null;
      }
    };
  }, [dna.typography.headingFamily, dna.typography.bodyFamily]);

  // Resolve the Google Fonts family names for CSS
  const headingPairing = FONT_PAIRINGS.find(
    (p) => p.heading === dna.typography.headingFamily || p.headingGoogleName === dna.typography.headingFamily
  );
  const bodyPairing = FONT_PAIRINGS.find(
    (p) => p.body === dna.typography.bodyFamily || p.bodyGoogleName === dna.typography.bodyFamily
  );
  const headingCSS = headingPairing?.headingGoogleName ?? dna.typography.headingFamily;
  const bodyCSS = bodyPairing?.bodyGoogleName ?? dna.typography.bodyFamily;

  const paletteSwatches = [
    { color: dna.palette.background, label: "BG" },
    { color: dna.palette.foreground, label: "FG" },
    { color: dna.palette.accent, label: "Accent" },
    { color: dna.palette.muted, label: "Muted" },
    { color: dna.palette.card, label: "Card" },
    { color: dna.palette.border, label: "Border" },
  ];

  return (
    <div
      style={{
        background: "#111",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        animation: "dna-preview-in 0.3s ease-out",
      }}
    >
      <style>{`
        @keyframes dna-preview-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Mini preview swatch — shows how the DNA looks as a page */}
      <div
        style={{
          background: dna.palette.background,
          padding: "20px 16px 16px",
          borderBottom: `1px solid ${dna.palette.border}`,
        }}
      >
        {/* Heading sample */}
        <div
          style={{
            fontFamily: `'${headingCSS}', system-ui, sans-serif`,
            fontWeight: dna.typography.headingWeight,
            letterSpacing: dna.typography.headingLetterSpacing,
            fontSize: 18,
            color: dna.palette.foreground,
            lineHeight: 1.2,
            marginBottom: 6,
            opacity: fontsLoaded ? 1 : 0.6,
            transition: "opacity 0.3s",
          }}
        >
          Your Product
        </div>

        {/* Body sample */}
        <div
          style={{
            fontFamily: `'${bodyCSS}', system-ui, sans-serif`,
            fontWeight: 400,
            fontSize: 12,
            color: dna.palette.mutedForeground,
            lineHeight: 1.5,
            marginBottom: 12,
            opacity: fontsLoaded ? 1 : 0.6,
            transition: "opacity 0.3s",
          }}
        >
          Beautiful, deployable websites from simple shapes.
        </div>

        {/* Mini button sample */}
        <div
          style={{
            display: "inline-block",
            padding: "5px 14px",
            borderRadius: dna.buttons.radius,
            background: dna.buttons.style === "outline" || dna.buttons.style === "ghost"
              ? "transparent"
              : dna.palette.accent,
            color: dna.buttons.style === "outline" || dna.buttons.style === "ghost"
              ? dna.palette.accent
              : dna.palette.accentForeground,
            border: dna.buttons.style === "outline"
              ? `1.5px solid ${dna.palette.accent}`
              : "1.5px solid transparent",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: `'${bodyCSS}', system-ui, sans-serif`,
          }}
        >
          Get started
        </div>
      </div>

      {/* Palette swatches */}
      <div style={{ padding: "12px 16px 8px" }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 8,
          }}
        >
          Palette
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {paletteSwatches.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div
                title={`${s.label}: ${s.color}`}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: s.color,
                  border: "1px solid rgba(255,255,255,0.12)",
                  cursor: "default",
                }}
              />
              <span style={{ fontSize: 8, color: "#555", fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div style={{ padding: "4px 16px 8px" }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 6,
          }}
        >
          Typography
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Chip label={dna.typography.headingFamily} />
          <span style={{ color: "#444", fontSize: 11 }}>+</span>
          <Chip label={dna.typography.bodyFamily} />
        </div>
      </div>

      {/* Design attributes */}
      <div style={{ padding: "4px 16px 12px" }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 6,
          }}
        >
          Direction
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          <Chip label={dna.decorative.style} accent />
          <Chip label={`motion: ${dna.motion.level}`} />
          <Chip label={dna.spacing.density} />
          <Chip label={dna.surfaces.cards} />
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          padding: "8px 16px 14px",
          display: "flex",
          gap: 6,
        }}
      >
        <button
          onClick={onApply}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "8px 14px",
            background: dna.palette.accent,
            color: dna.palette.accentForeground,
            borderRadius: 8,
            border: "none",
            fontSize: 12,
            fontWeight: 600,
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.5 : 1,
            transition: "opacity 0.15s",
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
          }}
        >
          Apply
        </button>
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          style={{
            padding: "8px 14px",
            background: "transparent",
            color: "#888",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: 12,
            fontWeight: 500,
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.5 : 1,
            transition: "opacity 0.15s, color 0.15s",
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
          }}
          onMouseEnter={(e) => { if (!isLoading) (e.target as HTMLElement).style.color = "#ccc"; }}
          onMouseLeave={(e) => (e.target as HTMLElement).style.color = "#888"}
        >
          {isLoading ? <MiniSpinner /> : "Try another"}
        </button>
      </div>
    </div>
  );
}

// ---- Small helpers ----

function Chip({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 500,
        padding: "2px 7px",
        borderRadius: 4,
        background: accent ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
        color: accent ? "#ccc" : "#888",
        border: accent ? "1px solid rgba(255,255,255,0.1)" : "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function MiniSpinner() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.7s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
