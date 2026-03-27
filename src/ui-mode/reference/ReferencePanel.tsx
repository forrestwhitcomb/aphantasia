"use client";

// ============================================================
// APHANTASIA — Design System Reference (tabbed)
// ============================================================
// Three sources — Image, Website, Figma — merge with precedence:
// Figma > Website > Screenshot (see UIDesignStore).
// ============================================================

import { useState, useRef, useCallback, useEffect } from "react";
import { uiDesignStoreV2 } from "./UIDesignStore";
import type { FigmaReferenceMeta } from "./UIDesignStore";
import type { UIDesignSystem } from "../types";
import {
  parseFigmaFileKey,
  extractFigmaUrl,
  buildFigmaDesignUrl,
} from "@/lib/figmaUrl";
import { rebtelDesignStore } from "@/rebtel/store/RebtelDesignStore";

type TabId = "screenshot" | "website" | "figma";

export function ReferencePanel() {
  const [state, setState] = useState(uiDesignStoreV2.getState());
  const [activeTab, setActiveTab] = useState<TabId>("figma");
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [urlInput, setUrlInput] = useState("");
  const [figmaUrl, setFigmaUrl] = useState("");
  const [figmaToken, setFigmaToken] = useState("");

  // Restore Figma URL field from persisted metadata so Connect isn't stuck disabled
  // (token is in localStorage; URL was only in ephemeral React state before).
  useEffect(() => {
    const s = uiDesignStoreV2.getState();
    if (s.figmaMeta?.fileKey) {
      setFigmaUrl((prev) =>
        prev.trim()
          ? prev
          : buildFigmaDesignUrl(
              s.figmaMeta!.fileKey,
              s.figmaMeta!.fileName,
              s.figmaMeta!.nodeId
            )
      );
    }
  }, []);

  useEffect(() => {
    return uiDesignStoreV2.subscribe((next) => {
      setState(next);
      if (!next.sourceLayers.figma && !next.figmaMeta) {
        setFigmaUrl("");
      }
    });
  }, []);

  const layers = state.sourceLayers;
  const filled = {
    screenshot: !!layers.screenshot,
    website: !!layers.website,
    figma: !!layers.figma,
  };

  const ds = uiDesignStoreV2.getEffectiveDesignSystem();

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
      uiDesignStoreV2.clearOverrides();
      uiDesignStoreV2.setSourceLayer("screenshot", designSystem as UIDesignSystem);
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
      uiDesignStoreV2.clearOverrides();
      uiDesignStoreV2.setSourceLayer("website", designSystem as UIDesignSystem);
    } catch (err) {
      setError(err instanceof Error ? err.message : "URL extraction failed");
    } finally {
      setIsExtracting(false);
    }
  }, [urlInput]);

  const handleFigmaConnect = useCallback(async () => {
    if (!figmaUrl.trim() || !figmaToken.trim()) return;
    setError(null);
    setIsExtracting(true);

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

      const data = await res.json();
      const { designSystem, fileName, nodeId, nodeName, thumbnailUrl, componentHints } =
        data as {
          designSystem: UIDesignSystem;
          fileName?: string;
          nodeId?: string | null;
          nodeName?: string | null;
          thumbnailUrl?: string | null;
          componentHints?: string[];
        };

      uiDesignStoreV2.clearOverrides();
      uiDesignStoreV2.setSourceLayer("figma", designSystem);

      if (data.componentRegistry && data.componentLayouts) {
        rebtelDesignStore.setFigmaData(
          data.componentRegistry,
          data.componentLayouts
        );
      }

      const fk = parseFigmaFileKey(figmaUrl.trim()) || "";
      const meta: FigmaReferenceMeta = {
        fileKey: fk,
        fileName: fileName || "Figma file",
        nodeId: nodeId ?? null,
        nodeName: nodeName ?? null,
        thumbnailUrl: thumbnailUrl ?? null,
        componentHints: Array.isArray(componentHints) ? componentHints : [],
        syncedAt: Date.now(),
      };
      uiDesignStoreV2.setFigmaMeta(meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Figma extraction failed");
    } finally {
      setIsExtracting(false);
    }
  }, [figmaUrl, figmaToken]);

  const handleColorChange = (key: string, value: string) => {
    uiDesignStoreV2.setOverride(`colors.${key}`, value);
  };

  const clearFigmaConnection = () => {
    uiDesignStoreV2.clearSourceLayer("figma");
    uiDesignStoreV2.setFigmaMeta(null);
    setFigmaUrl("");
  };

  const mergeSummary = [
    filled.screenshot && "Image",
    filled.website && "Website",
    filled.figma && "Figma",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div style={styles.panel}>
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionIcon}>◎</span>
          <span style={styles.sectionTitle}>Design System Reference</span>
        </div>
        <p style={styles.mergeHint}>
          Merge order: <strong>Figma</strong> → Website → Image. Later sources override earlier for the same token.
        </p>

        {/* Tabs */}
        <div style={styles.tabRow}>
          <TabButton
            label="Image"
            icon="🖼"
            active={activeTab === "screenshot"}
            filled={filled.screenshot}
            onClick={() => setActiveTab("screenshot")}
          />
          <TabButton
            label="Website"
            icon="🔗"
            active={activeTab === "website"}
            filled={filled.website}
            onClick={() => setActiveTab("website")}
          />
          <TabButton
            label="Figma"
            icon="✦"
            active={activeTab === "figma"}
            filled={filled.figma}
            onClick={() => setActiveTab("figma")}
          />
        </div>

        {activeTab === "screenshot" && (
          <div style={styles.tabBody}>
            <div
              style={{
                ...styles.uploadArea,
                ...(isExtracting ? styles.uploadAreaExtracting : {}),
              }}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              {state.referenceImage ? (
                <img src={state.referenceImage} alt="Reference" style={styles.thumbnail} />
              ) : (
                <>
                  <span style={{ fontSize: 20 }}>🖼</span>
                  <span style={styles.uploadText}>
                    {isExtracting ? "Extracting…" : "Drop a screenshot of your app"}
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
            {filled.screenshot && (
              <button
                type="button"
                style={styles.clearSource}
                onClick={() => uiDesignStoreV2.clearSourceLayer("screenshot")}
              >
                Remove image source from merge
              </button>
            )}
          </div>
        )}

        {activeTab === "website" && (
          <div style={styles.tabBody}>
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
                type="button"
                onClick={handleUrlExtract}
                disabled={isExtracting || !urlInput.trim()}
                style={{
                  ...styles.extractBtn,
                  opacity: isExtracting || !urlInput.trim() ? 0.5 : 1,
                }}
              >
                Extract
              </button>
            </div>
            {filled.website && (
              <button
                type="button"
                style={styles.clearSource}
                onClick={() => uiDesignStoreV2.clearSourceLayer("website")}
              >
                Remove website source from merge
              </button>
            )}
          </div>
        )}

        {activeTab === "figma" && (
          <div style={styles.tabBody}>
            <p style={styles.figmaHelp}>
              Paste a file or <strong>frame</strong> link (include <code style={styles.code}>node-id</code> for a
              thumbnail + frame-scoped tokens).
            </p>
            <input
              type="text"
              placeholder="https://www.figma.com/design/… or paste copied Figma link"
              value={figmaUrl}
              onChange={(e) => {
                const raw = e.target.value;
                const extracted = extractFigmaUrl(raw);
                setFigmaUrl(extracted ?? raw);
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text");
                const extracted = extractFigmaUrl(pasted);
                if (extracted && extracted !== pasted) {
                  e.preventDefault();
                  setFigmaUrl(extracted);
                }
              }}
              disabled={isExtracting}
              style={{ ...styles.textInput, width: "100%", marginBottom: 6 }}
            />
            <div style={styles.inputRow}>
              <input
                type="password"
                placeholder="Enter figma access token"
                value={figmaToken}
                onChange={(e) => setFigmaToken(e.target.value)}
                disabled={isExtracting}
                style={styles.textInput}
              />
              <button
                type="button"
                onClick={handleFigmaConnect}
                disabled={isExtracting || !figmaUrl.trim() || !figmaToken.trim()}
                style={{
                  ...styles.extractBtn,
                  background: "#1e1e1e",
                  opacity: isExtracting || !figmaUrl.trim() || !figmaToken.trim() ? 0.5 : 1,
                }}
              >
                {isExtracting ? "…" : "Connect"}
              </button>
            </div>
            {(filled.figma || state.figmaMeta || figmaUrl.trim()) && (
              <div style={styles.figmaPreview}>
                {state.figmaMeta?.thumbnailUrl ? (
                  <img
                    src={state.figmaMeta.thumbnailUrl}
                    alt="Frame"
                    style={styles.figmaThumb}
                  />
                ) : (
                  <div style={styles.figmaThumbPlaceholder}>Figma</div>
                )}
                <div>
                  <div style={styles.figmaName}>
                    {state.figmaMeta?.nodeName || state.figmaMeta?.fileName || ds.name || "Captured Figma link"}
                  </div>
                  <div style={styles.figmaSub}>
                    {state.figmaMeta?.componentHints?.length
                      ? `${state.figmaMeta.componentHints.length} components detected`
                      : filled.figma
                        ? "Design system synced"
                        : "Synced"}
                  </div>
                  {figmaUrl.trim() && <div style={styles.figmaUrlLine}>{figmaUrl.trim()}</div>}
                </div>
              </div>
            )}
            {(filled.figma || figmaUrl.trim()) && (
              <button
                type="button"
                style={styles.clearSource}
                onClick={clearFigmaConnection}
              >
                Remove Figma link and source
              </button>
            )}
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        {(state.isExtracted || mergeSummary) && (
          <div style={styles.sourceTag}>
            <span style={styles.sourceLabel}>
              Active layers: {mergeSummary || "None"} · {ds.name}
              {typeof ds.confidence === "number" && (
                <span style={{ color: "#888" }}>
                  {" "}
                  · Confidence {Math.round(ds.confidence * 100)}%
                </span>
              )}
            </span>
            <button
              type="button"
              style={styles.resetBtn}
              onClick={() => {
                uiDesignStoreV2.reset();
                setFigmaUrl("");
                setUrlInput("");
              }}
            >
              Reset all
            </button>
          </div>
        )}
      </div>

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

function TabButton({
  label,
  icon,
  active,
  filled,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  filled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: "8px 4px",
        border: "none",
        borderBottom: active ? "2px solid #d97706" : "2px solid transparent",
        background: active ? "#fffbeb" : "transparent",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span
        style={{
          fontSize: 10,
          fontWeight: active ? 600 : 500,
          color: active ? "#b45309" : "#78716c",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
      {filled && !active && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#d97706",
            marginTop: 2,
          }}
        />
      )}
    </button>
  );
}

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
  mergeHint: {
    fontSize: 11,
    color: "#666",
    lineHeight: 1.5,
    marginBottom: 10,
  },
  tabRow: {
    display: "flex",
    borderBottom: "1px solid #eee",
    marginBottom: 10,
  },
  tabBody: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  },
  figmaHelp: {
    fontSize: 11,
    color: "#666",
    margin: 0,
    lineHeight: 1.45,
  },
  code: {
    background: "#f4f4f5",
    padding: "1px 4px",
    borderRadius: 4,
    fontSize: 10,
  },
  figmaPreview: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: 8,
    background: "#fafafa",
    borderRadius: 8,
    border: "1px solid #eee",
  },
  figmaThumb: {
    width: 72,
    height: 48,
    objectFit: "cover" as const,
    borderRadius: 6,
    border: "1px solid #e5e5e5",
  },
  figmaThumbPlaceholder: {
    width: 72,
    height: 48,
    borderRadius: 6,
    border: "1px dashed #d6d3d1",
    background: "#f5f5f4",
    color: "#78716c",
    fontSize: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
  },
  figmaName: { fontSize: 12, fontWeight: 600, color: "#1c1917" },
  figmaSub: { fontSize: 10, color: "#78716c", marginTop: 2 },
  figmaUrlLine: {
    fontSize: 10,
    color: "#57534e",
    marginTop: 4,
    maxWidth: 150,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  clearSource: {
    fontSize: 11,
    color: "#6366f1",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left" as const,
    padding: 0,
  },
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
    gap: 8,
    flexWrap: "wrap" as const,
  },
  sourceLabel: { flex: 1, minWidth: 0 },
  resetBtn: {
    fontSize: 11,
    color: "#6366F1",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    flexShrink: 0,
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
