"use client";

// ============================================================
// APHANTASIA — Reference Panel
// ============================================================
// Design system extraction from 3 sources:
//   1. Screenshot upload (Claude Vision)
//   2. Website URL (CSS extraction + Claude)
//   3. Figma file (REST API + token mapping)
// ============================================================

import { useState, useRef, useCallback, useEffect } from "react";
import { uiDesignStoreV2 } from "./UIDesignStore";
import type { UIDesignSystem } from "../types";

type ExtractionSource = "screenshot" | "website" | "figma";

export function ReferencePanel() {
  const [state, setState] = useState(uiDesignStoreV2.getState());
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<ExtractionSource | null>(null);
  const [sourceName, setSourceName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL extraction state
  const [urlInput, setUrlInput] = useState("");

  // Figma state
  const [figmaUrl, setFigmaUrl] = useState("");
  const [figmaToken, setFigmaToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("aphantasia:figmaToken") || "";
    }
    return "";
  });

  useEffect(() => {
    return uiDesignStoreV2.subscribe(setState);
  }, []);

  const ds = state.designSystem;

  // ── Screenshot Upload ──
  const handleUpload = useCallback(async (file: File) => {
    setError(null);
    setIsExtracting(true);

    try {
      const dataUrl = await fileToDataUrl(file);
      uiDesignStoreV2.setReferenceImage(dataUrl);

      const res = await fetch("/api/ui-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: dataUrl }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Extraction failed");
      }

      const { designSystem } = await res.json();
      uiDesignStoreV2.setDesignSystem(designSystem);
      setSource("screenshot");
      setSourceName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed");
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) handleUpload(file);
    },
    [handleUpload]
  );

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  // ── URL Extraction ──
  const handleUrlExtract = useCallback(async () => {
    if (!urlInput.trim()) return;
    setError(null);
    setIsExtracting(true);

    try {
      const res = await fetch("/api/ui-extract-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "URL extraction failed");
      }

      const { designSystem } = await res.json();
      uiDesignStoreV2.setDesignSystem(designSystem);
      setSource("website");
      try {
        setSourceName(new URL(urlInput.trim()).hostname);
      } catch {
        setSourceName(urlInput.trim());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "URL extraction failed");
    } finally {
      setIsExtracting(false);
    }
  }, [urlInput]);

  // ── Figma Extraction ──
  const handleFigmaConnect = useCallback(async () => {
    if (!figmaUrl.trim() || !figmaToken.trim()) return;
    setError(null);
    setIsExtracting(true);

    // Persist token for future sessions
    localStorage.setItem("aphantasia:figmaToken", figmaToken);

    try {
      const res = await fetch("/api/ui-extract-figma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          figmaUrl: figmaUrl.trim(),
          accessToken: figmaToken.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Figma extraction failed");
      }

      const { designSystem, fileName } = await res.json();
      uiDesignStoreV2.setDesignSystem(designSystem);
      setSource("figma");
      setSourceName(fileName || "Figma file");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Figma extraction failed");
    } finally {
      setIsExtracting(false);
    }
  }, [figmaUrl, figmaToken]);

  // ── Color override ──
  const handleColorChange = (key: string, value: string) => {
    uiDesignStoreV2.setOverride(`colors.${key}`, value);
  };

  // ── Source label ──
  const sourceLabel = source === "screenshot"
    ? `Screenshot · Confidence: ${Math.round(ds.confidence * 100)}%`
    : source === "website"
      ? `Website (${sourceName}) · Confidence: ${Math.round(ds.confidence * 100)}%`
      : source === "figma"
        ? `Figma (${sourceName}) · Confidence: 100%`
        : null;

  return (
    <div style={styles.panel}>
      {/* Upload area */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionIcon}>◎</span>
          <span style={styles.sectionTitle}>Design System</span>
        </div>

        <div
          style={{
            ...styles.uploadArea,
            ...(isExtracting && !source ? styles.uploadAreaExtracting : {}),
          }}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          {state.referenceImage ? (
            <img
              src={state.referenceImage}
              alt="Reference"
              style={styles.thumbnail}
            />
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span style={styles.uploadText}>
                {isExtracting ? "Extracting..." : "Drop a screenshot of your app"}
              </span>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onFileSelect}
          />
        </div>

        {/* Website URL input */}
        <div style={{ marginTop: 8 }}>
          <div style={styles.inputRow}>
            <input
              type="url"
              placeholder="https://your-app.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlExtract()}
              disabled={isExtracting}
              style={styles.textInput}
            />
            <button
              onClick={handleUrlExtract}
              disabled={isExtracting || !urlInput.trim()}
              style={{
                ...styles.extractBtn,
                opacity: isExtracting || !urlInput.trim() ? 0.5 : 1,
              }}
            >
              {isExtracting && source === null ? "..." : "URL"}
            </button>
          </div>
        </div>

        {/* Figma connection */}
        <div style={{ marginTop: 6 }}>
          <div style={styles.inputRow}>
            <input
              type="url"
              placeholder="Figma file URL"
              value={figmaUrl}
              onChange={(e) => setFigmaUrl(e.target.value)}
              disabled={isExtracting}
              style={{ ...styles.textInput, flex: 1 }}
            />
          </div>
          <div style={{ ...styles.inputRow, marginTop: 4 }}>
            <input
              type="password"
              placeholder="Figma access token"
              value={figmaToken}
              onChange={(e) => setFigmaToken(e.target.value)}
              disabled={isExtracting}
              style={styles.textInput}
            />
            <button
              onClick={handleFigmaConnect}
              disabled={isExtracting || !figmaUrl.trim() || !figmaToken.trim()}
              style={{
                ...styles.extractBtn,
                opacity: isExtracting || !figmaUrl.trim() || !figmaToken.trim() ? 0.5 : 1,
                background: "#1e1e1e",
              }}
            >
              {isExtracting ? "..." : "Figma"}
            </button>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {(state.isExtracted || source) && sourceLabel && (
          <div style={styles.sourceTag}>
            <span style={styles.sourceLabel}>Source: {sourceLabel}</span>
            <button
              style={styles.resetBtn}
              onClick={() => {
                uiDesignStoreV2.reset();
                setSource(null);
                setSourceName("");
              }}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Color swatches */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Colors</span>
        </div>
        <div style={styles.colorGrid}>
          {COLOR_ROLES.map(({ key, label }) => (
            <div key={key} style={styles.colorItem}>
              <label style={styles.colorLabel}>{label}</label>
              <input
                type="color"
                value={(ds.colors as Record<string, string>)[key] || "#000000"}
                onChange={(e) => handleColorChange(key, e.target.value)}
                style={styles.colorInput}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Typography</span>
        </div>
        <div style={styles.typoPreview}>
          <span style={styles.typoFamily}>{extractFontName(ds.fonts.heading.family)}</span>
          <span style={styles.typoSizes}>
            {ds.fontSizes.sm} / {ds.fontSizes.base} / {ds.fontSizes.lg}
          </span>
        </div>
      </div>

      {/* Spacing & Radii */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Shape</span>
        </div>
        <div style={styles.shapeRow}>
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <div
              key={size}
              style={{
                ...styles.radiusPreview,
                borderRadius: ds.radii[size],
              }}
            >
              <span style={styles.radiusLabel}>{size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Constants ────────────────────────────────────────────────

const COLOR_ROLES = [
  { key: "background", label: "Bg" },
  { key: "foreground", label: "Fg" },
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "muted", label: "Muted" },
  { key: "accent", label: "Accent" },
  { key: "destructive", label: "Destructive" },
  { key: "border", label: "Border" },
  { key: "card", label: "Card" },
];

// ── Helpers ──────────────────────────────────────────────────

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function extractFontName(stack: string): string {
  const first = stack.split(",")[0].trim().replace(/^['"]|['"]$/g, "");
  return first;
}

// ── Styles ───────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 12,
    fontFamily: "var(--font-poppins), sans-serif",
    fontSize: 13,
    color: "#333",
    overflowY: "auto",
    height: "100%",
  },
  section: {
    background: "#fff",
    borderRadius: 12,
    padding: 12,
    border: "1px solid #eee",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  sectionIcon: { fontSize: 14, color: "#999" },
  sectionTitle: { fontWeight: 600, fontSize: 13 },
  uploadArea: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed" as const,
    borderColor: "#ddd",
    cursor: "pointer",
    minHeight: 80,
    transition: "border-color 0.15s",
  },
  uploadAreaExtracting: {
    borderColor: "#6366F1",
    opacity: 0.7,
  },
  uploadText: { fontSize: 12, color: "#999", textAlign: "center" as const },
  thumbnail: {
    width: "100%",
    maxHeight: 120,
    objectFit: "cover" as const,
    borderRadius: 8,
  },
  error: { color: "#EF4444", fontSize: 11, marginTop: 4 },
  sourceTag: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    fontSize: 11,
    color: "#666",
  },
  sourceLabel: {},
  resetBtn: {
    fontSize: 11,
    color: "#6366F1",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
  },
  inputRow: {
    display: "flex",
    gap: 4,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    padding: "6px 8px",
    fontSize: 11,
    borderRadius: 6,
    border: "1px solid #ddd",
    outline: "none",
    fontFamily: "inherit",
    background: "#fafafa",
  },
  extractBtn: {
    padding: "6px 10px",
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 6,
    border: "none",
    background: "#6366F1",
    color: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
  },
  colorItem: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 4,
  },
  colorLabel: { fontSize: 10, color: "#888" },
  colorInput: {
    width: 32,
    height: 32,
    border: "1px solid #eee",
    borderRadius: 8,
    cursor: "pointer",
    padding: 0,
  },
  typoPreview: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
  },
  typoFamily: { fontWeight: 600, fontSize: 13 },
  typoSizes: { fontSize: 11, color: "#888" },
  shapeRow: {
    display: "flex",
    gap: 8,
  },
  radiusPreview: {
    width: 36,
    height: 36,
    background: "#f0f0f0",
    border: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  radiusLabel: { fontSize: 10, color: "#888" },
};
