"use client";

// ============================================================
// NodePropertyPanel — Deep editing for any ComponentSpec node
// ============================================================
// Right-side panel that appears when any node in the spec tree
// is selected. Allows editing style, layout, and text properties
// using token-aware controls.
// ============================================================

import { useState, useCallback } from "react";
import type { ComponentSpec, TokenRef, StyleSpec, LayoutSpec, TextStyleToken } from "../spec/types";
import { TokenPalette } from "./TokenPalette";

interface NodePropertyPanelProps {
  shapeId: string;
  nodeKey: string;
  spec: ComponentSpec;
  onEdit: (shapeId: string, key: string, updates: {
    style?: Partial<StyleSpec>;
    layout?: Partial<LayoutSpec>;
    text?: Partial<NonNullable<ComponentSpec["text"]>>;
  }) => void;
  onDelete: (shapeId: string, key: string) => void;
  onClose: () => void;
  isRoot: boolean;
}

const TEXT_STYLE_OPTIONS: TextStyleToken[] = [
  "display-lg", "display-md", "display-sm", "display-xs",
  "headline-lg", "headline-md", "headline-sm", "headline-xs",
  "paragraph-xl", "paragraph-lg", "paragraph-md", "paragraph-sm", "paragraph-xs",
  "label-xl", "label-lg", "label-md", "label-sm", "label-xs",
];

const SPACING_TOKENS = [
  "spacing.none", "spacing.xxxs", "spacing.xxs", "spacing.xs",
  "spacing.sm", "spacing.md", "spacing.lg", "spacing.xl",
  "spacing.xxl", "spacing.xxxl", "spacing.xxxxl",
];

const RADIUS_TOKENS = [
  "radius.xs", "radius.sm", "radius.md", "radius.lg",
  "radius.xl", "radius.xxl", "radius.full",
];

const HEIGHT_TOKENS = [
  "height.xs", "height.sm", "height.md", "height.lg",
  "height.xl", "height.xxl", "height.xxxl",
];

function tokenDisplay(val: TokenRef | string | number | undefined): string {
  if (val === undefined) return "—";
  if (typeof val === "number") return `${val}px`;
  if (typeof val === "string") return val;
  return val.token;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 600,
      color: "rgba(255,255,255,0.5)",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginTop: 12,
      marginBottom: 6,
    }}>
      {children}
    </div>
  );
}

function TokenSelect({ value, tokens, onChange }: {
  value: TokenRef | string | number | undefined;
  tokens: string[];
  onChange: (val: TokenRef) => void;
}) {
  const current = typeof value === "object" && value !== null && "token" in value ? value.token : "";
  return (
    <select
      value={current}
      onChange={(e) => onChange({ token: e.target.value })}
      style={{
        flex: 1,
        padding: "3px 6px",
        fontSize: 11,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 4,
        color: "#fff",
        outline: "none",
      }}
    >
      <option value="">Custom</option>
      {tokens.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", minWidth: 60 }}>{label}</span>
      {children}
    </div>
  );
}

export function NodePropertyPanel({
  shapeId,
  nodeKey,
  spec,
  onEdit,
  onDelete,
  onClose,
  isRoot,
}: NodePropertyPanelProps) {
  const [showBgPalette, setShowBgPalette] = useState(false);
  const [showTextColorPalette, setShowTextColorPalette] = useState(false);

  const emit = useCallback((updates: Parameters<typeof onEdit>[2]) => {
    onEdit(shapeId, nodeKey, updates);
  }, [shapeId, nodeKey, onEdit]);

  return (
    <div
      style={{
        position: "absolute",
        right: 8,
        top: 40,
        width: 240,
        maxHeight: "calc(100% - 80px)",
        overflowY: "auto",
        background: "rgba(26,26,26,0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.1)",
        padding: 12,
        color: "#fff",
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
        fontSize: 12,
        zIndex: 50,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 11 }}>
          {spec.data?.figmaName ?? spec.key}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            fontSize: 14,
            padding: 0,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
        {spec.tag} · {spec.key}
      </div>

      {/* Text Section */}
      {spec.text && (
        <>
          <SectionHeader>Text</SectionHeader>
          <Row label="Content">
            <input
              type="text"
              value={spec.text.content}
              onChange={(e) => emit({ text: { content: e.target.value } })}
              style={{
                flex: 1,
                padding: "3px 6px",
                fontSize: 11,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 4,
                color: "#fff",
                outline: "none",
              }}
            />
          </Row>
          <Row label="Style">
            <select
              value={spec.text.style}
              onChange={(e) => emit({ text: { style: e.target.value as TextStyleToken } })}
              style={{
                flex: 1,
                padding: "3px 6px",
                fontSize: 11,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 4,
                color: "#fff",
                outline: "none",
              }}
            >
              {TEXT_STYLE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Row>
          <Row label="Color">
            <button
              onClick={() => setShowTextColorPalette(!showTextColorPalette)}
              style={{
                flex: 1,
                padding: "3px 6px",
                fontSize: 11,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 4,
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {tokenDisplay(spec.text.color)}
            </button>
          </Row>
          {showTextColorPalette && (
            <TokenPalette
              currentValue={spec.text.color}
              onSelect={(v) => {
                emit({ text: { color: v } });
                setShowTextColorPalette(false);
              }}
              filter="color.content-"
            />
          )}
          <Row label="Align">
            <div style={{ display: "flex", gap: 2 }}>
              {(["left", "center", "right"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => emit({ text: { align: a } })}
                  style={{
                    padding: "2px 8px",
                    fontSize: 10,
                    background: spec.text?.align === a ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 3,
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </Row>
        </>
      )}

      {/* Style Section */}
      <SectionHeader>Style</SectionHeader>
      <Row label="Background">
        <button
          onClick={() => setShowBgPalette(!showBgPalette)}
          style={{
            flex: 1,
            padding: "3px 6px",
            fontSize: 11,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 4,
            color: "#fff",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {tokenDisplay(spec.style.background)}
        </button>
      </Row>
      {showBgPalette && (
        <TokenPalette
          currentValue={spec.style.background}
          onSelect={(v) => {
            emit({ style: { background: v } });
            setShowBgPalette(false);
          }}
        />
      )}

      {/* Layout Section */}
      <SectionHeader>Layout</SectionHeader>
      <Row label="Direction">
        <div style={{ display: "flex", gap: 2 }}>
          {(["row", "column"] as const).map((d) => (
            <button
              key={d}
              onClick={() => emit({ layout: { direction: d } })}
              style={{
                padding: "2px 8px",
                fontSize: 10,
                background: spec.layout.direction === d ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 3,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </Row>
      <Row label="Gap">
        <TokenSelect value={spec.layout.gap} tokens={SPACING_TOKENS} onChange={(v) => emit({ layout: { gap: v } })} />
      </Row>
      <Row label="Radius">
        <TokenSelect value={spec.layout.borderRadius} tokens={RADIUS_TOKENS} onChange={(v) => emit({ layout: { borderRadius: v } })} />
      </Row>
      <Row label="Height">
        <TokenSelect value={spec.layout.height} tokens={HEIGHT_TOKENS} onChange={(v) => emit({ layout: { height: v } })} />
      </Row>

      {/* Actions */}
      {!isRoot && (
        <>
          <SectionHeader>Actions</SectionHeader>
          <button
            onClick={() => onDelete(shapeId, nodeKey)}
            style={{
              width: "100%",
              padding: "6px 12px",
              fontSize: 11,
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 6,
              color: "#EF4444",
              cursor: "pointer",
            }}
          >
            Delete node
          </button>
        </>
      )}
    </div>
  );
}
