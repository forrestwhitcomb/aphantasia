"use client";

import { useState, useEffect } from "react";
import { contextStore } from "./ContextStore";
import type { StructuredContext } from "@/types/context";
import { aiCallTracker } from "@/lib/aiCallTracker";
import { dnaStore } from "@/dna";
import { generateDNA, regenerateDNA } from "@/dna/generateDNA";
import type { DesignDNA } from "@/dna/DesignDNA";
import DNAPreview from "@/dna/DNAPreview";

// ContextPanel — global context input + extraction UI
// Opens as a slide-in overlay on the canvas panel.
// Triggered by the GlobalBroadcast button (top-left of canvas).

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContextPanel({ isOpen, onClose }: Props) {
  const [rawText, setRawText] = useState("");
  const [context, setContext] = useState<StructuredContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // DNA generation state
  const [generatedDNA, setGeneratedDNA] = useState<DesignDNA | null>(null);
  const [dnaLoading, setDnaLoading] = useState(false);
  const [dnaError, setDnaError] = useState<string | null>(null);
  const [dnaApplied, setDnaApplied] = useState(false);

  // Hydrate from store after mount (avoids SSR/client mismatch)
  useEffect(() => {
    setRawText(contextStore.getRawText());
    setContext(contextStore.getContext());
    return contextStore.subscribe((ctx) => {
      setContext(ctx);
    });
  }, []);

  // Auto-generate DNA after context extraction succeeds
  async function handleGenerateDNA(text: string) {
    setDnaLoading(true);
    setDnaError(null);
    setDnaApplied(false);
    try {
      const result = await generateDNA(text);
      if (result.tokenUsage) {
        aiCallTracker.addTokens(result.tokenUsage);
      }
      setGeneratedDNA(result.dna);
    } catch (e) {
      setDnaError(e instanceof Error ? e.message : "DNA generation failed");
    } finally {
      setDnaLoading(false);
    }
  }

  async function handleRegenerateDNA() {
    if (!rawText.trim()) return;
    setDnaLoading(true);
    setDnaError(null);
    setDnaApplied(false);
    try {
      const result = await regenerateDNA(rawText);
      if (result.tokenUsage) {
        aiCallTracker.addTokens(result.tokenUsage);
      }
      setGeneratedDNA(result.dna);
    } catch (e) {
      setDnaError(e instanceof Error ? e.message : "DNA generation failed");
    } finally {
      setDnaLoading(false);
    }
  }

  function handleApplyDNA() {
    if (!generatedDNA) return;
    dnaStore.setDNA(generatedDNA, "generated");
    setDnaApplied(true);
  }

  const isDirty = contextStore.isDirty(rawText);
  const hasContext = context !== null;

  async function handleExtract() {
    if (!rawText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      aiCallTracker.trackExtract();
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Extraction failed");
        return;
      }
      const structured = await res.json();
      if (structured._tokenUsage) {
        aiCallTracker.addTokens(structured._tokenUsage);
        delete structured._tokenUsage;
      }
      contextStore.setContext(structured as StructuredContext, rawText);
      // Auto-trigger DNA generation after successful context extraction
      handleGenerateDNA(rawText);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setRawText("");
    contextStore.clearContext();
  }

  return (
    <>
      {/* Backdrop — click outside to close */}
      {isOpen && (
        <div
          onClick={onClose}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 40,
            borderRadius: "inherit",
          }}
        />
      )}

      {/* Panel — stop propagation so canvas engine doesn't intercept mouse events */}
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 340,
          zIndex: 50,
          transform: isOpen ? "translateX(0)" : "translateX(-360px)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          background: "#fff",
          borderRight: "1px solid #e8e8e8",
          borderRadius: "16px 0 0 16px",
          boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "var(--font-poppins), sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Broadcast icon */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M6.3 6.3a8 8 0 0 0 0 11.4" />
                <path d="M17.7 6.3a8 8 0 0 1 0 11.4" />
                <path d="M3.5 3.5a14 14 0 0 0 0 17" />
                <path d="M20.5 3.5a14 14 0 0 1 0 17" />
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111", letterSpacing: "-0.01em" }}>
              Context
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#888",
              transition: "background 0.15s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 20px" }}>
          {/* Input area */}
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 8,
              }}
            >
              Product description
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your product description, notes, or brand info. The more context, the better the output.&#10;&#10;e.g. &quot;Focusly is a distraction-free to-do app for busy founders. Bold, minimal aesthetic. Primary color: #7C3AED&quot;"
              rows={6}
              style={{
                width: "100%",
                resize: "vertical",
                fontFamily: "inherit",
                fontSize: 13,
                lineHeight: 1.6,
                color: "#222",
                background: "#fafafa",
                border: "1px solid #e8e8e8",
                borderRadius: 10,
                padding: "10px 12px",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#aaa")}
              onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 12,
                fontSize: 12,
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          {/* Extract button */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button
              onClick={handleExtract}
              disabled={loading || !rawText.trim() || !isDirty}
              style={{
                flex: 1,
                padding: "9px 16px",
                background: rawText.trim() && isDirty ? "#111" : "#e0e0e0",
                color: rawText.trim() && isDirty ? "#fff" : "#999",
                borderRadius: 10,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: rawText.trim() && isDirty ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "background 0.15s",
                fontFamily: "inherit",
              }}
            >
              {loading ? (
                <>
                  <Spinner />
                  Extracting…
                </>
              ) : hasContext && !isDirty ? (
                <>
                  <CheckIcon />
                  Extracted
                </>
              ) : (
                "Extract context"
              )}
            </button>

            {hasContext && (
              <button
                onClick={handleClear}
                title="Clear context"
                style={{
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  border: "1px solid #e8e8e8",
                  background: "#fff",
                  cursor: "pointer",
                  color: "#888",
                  flexShrink: 0,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
            )}
          </div>

          {/* Extracted context display */}
          {context && (
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 12,
                }}
              >
                Extracted
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {context.productName && (
                  <ContextRow label="Product" value={context.productName} />
                )}
                {context.tagline && (
                  <ContextRow label="Tagline" value={context.tagline} />
                )}
                {context.description && (
                  <ContextRow label="Description" value={context.description} />
                )}
                {context.tone && (
                  <ContextRow label="Tone" value={typeof context.tone === "string" ? context.tone : [context.tone.energy, context.tone.formality, context.tone.personality].filter(Boolean).join(", ")} pill />
                )}
                {context.contentType && (
                  <ContextRow label="Type" value={context.contentType} pill />
                )}
                {context.pricing && (
                  <ContextRow label="Pricing" value={typeof context.pricing === "string" ? context.pricing : [context.pricing.model, context.pricing.tiers?.join(", ")].filter(Boolean).join(" — ")} />
                )}
                {context.colors && context.colors.length > 0 && (
                  <ContextRow
                    label="Colors"
                    value={context.colors.join(", ")}
                    colors={context.colors}
                  />
                )}
                {context.fonts && context.fonts.length > 0 && (
                  <ContextRow label="Fonts" value={context.fonts.join(", ")} />
                )}
                {context.products && context.products.length > 0 && (
                  <ContextRow label="Products" value={context.products.join(", ")} />
                )}
                {context.events && context.events.length > 0 && (
                  <ContextRow label="Events" value={context.events.join(", ")} />
                )}
                {context.team && context.team.length > 0 && (
                  <ContextRow label="Team" value={context.team.join(", ")} />
                )}
              </div>
            </div>
          )}

          {/* DNA Generation Section */}
          {context && (dnaLoading || generatedDNA || dnaError) && (
            <div style={{ marginTop: 16 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 10,
                }}
              >
                Design Direction
              </p>

              {/* DNA loading state */}
              {dnaLoading && !generatedDNA && (
                <div
                  style={{
                    background: "#111",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: "24px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Spinner />
                  <span style={{ fontSize: 12, color: "#888" }}>
                    Generating design direction…
                  </span>
                </div>
              )}

              {/* DNA error */}
              {dnaError && !dnaLoading && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 12,
                    color: "#b91c1c",
                    marginBottom: 8,
                  }}
                >
                  {dnaError}
                  <button
                    onClick={() => handleGenerateDNA(rawText)}
                    style={{
                      display: "block",
                      marginTop: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#b91c1c",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* DNA preview card */}
              {generatedDNA && (
                <>
                  <DNAPreview
                    dna={generatedDNA}
                    onApply={handleApplyDNA}
                    onRegenerate={handleRegenerateDNA}
                    isLoading={dnaLoading}
                  />
                  {dnaApplied && (
                    <div
                      style={{
                        marginTop: 8,
                        background: "#dcfce7",
                        border: "1px solid #bbf7d0",
                        borderRadius: 8,
                        padding: "6px 10px",
                        fontSize: 11,
                        fontWeight: 500,
                        color: "#166534",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <CheckIcon />
                      DNA applied — preview updating
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #f0f0f0",
            fontSize: 11,
            color: "#aaa",
            lineHeight: 1.5,
          }}
        >
          Context feeds every render. Re-extract when your description changes.
        </div>
      </div>
    </>
  );
}

// ---- Small UI helpers ----

function ContextRow({
  label,
  value,
  pill,
  colors,
}: {
  label: string;
  value: string;
  pill?: boolean;
  colors?: string[];
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        padding: "7px 10px",
        borderRadius: 8,
        background: "#f8f8f8",
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "#999",
          fontWeight: 600,
          letterSpacing: "0.02em",
          minWidth: 68,
          paddingTop: 1,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {colors && colors.map((c, i) => (
          <span
            key={i}
            title={c}
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: c,
              border: "1px solid rgba(0,0,0,0.1)",
              flexShrink: 0,
            }}
          />
        ))}
        <span
          style={{
            fontSize: 12,
            color: "#333",
            ...(pill && {
              background: "#111",
              color: "#fff",
              borderRadius: 20,
              padding: "2px 8px",
              fontSize: 11,
              fontWeight: 500,
            }),
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="13"
      height="13"
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

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
