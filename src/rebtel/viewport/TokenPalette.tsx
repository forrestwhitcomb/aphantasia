"use client";

// ============================================================
// TokenPalette — Token-aware color picker
// ============================================================
// Shows design token swatches grouped by semantic category.
// Each swatch maps to a TokenRef for use in ComponentSpec.
// ============================================================

import { useState } from "react";
import type { TokenRef } from "../spec/types";
import { TOKEN_MAP } from "../spec/tokens";

interface TokenPaletteProps {
  currentValue: TokenRef | string | undefined;
  onSelect: (value: TokenRef | string) => void;
  filter?: string;
}

// Group color tokens by prefix
const COLOR_GROUPS: { label: string; prefix: string }[] = [
  { label: "Surface", prefix: "color.surface-" },
  { label: "Content", prefix: "color.content-" },
  { label: "Brand", prefix: "color.brand-" },
  { label: "Button", prefix: "color.button-primary" },
  { label: "Border", prefix: "color.border-" },
  { label: "Icon", prefix: "color.icon-" },
  { label: "Grey", prefix: "color.grey-" },
  { label: "Red", prefix: "color.red-" },
  { label: "Blue", prefix: "color.blue-" },
  { label: "Green", prefix: "color.green-" },
  { label: "Semantic", prefix: "color.label-" },
];

function getGroupedTokens(filter?: string) {
  const all = Object.keys(TOKEN_MAP).filter(
    (k) => k.startsWith("color.") && (!filter || k.startsWith(filter)),
  );

  const groups: { label: string; tokens: string[] }[] = [];
  const used = new Set<string>();

  for (const group of COLOR_GROUPS) {
    const matching = all.filter((k) => k.startsWith(group.prefix) && !used.has(k));
    if (matching.length > 0) {
      groups.push({ label: group.label, tokens: matching });
      matching.forEach((k) => used.add(k));
    }
  }

  // Remainder
  const rest = all.filter((k) => !used.has(k));
  if (rest.length > 0) {
    groups.push({ label: "Other", tokens: rest });
  }

  return groups;
}

export function TokenPalette({ currentValue, onSelect, filter }: TokenPaletteProps) {
  const [customHex, setCustomHex] = useState("");
  const groups = getGroupedTokens(filter);

  const currentToken =
    currentValue && typeof currentValue === "object" && "token" in currentValue
      ? currentValue.token
      : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 240, overflowY: "auto" }}>
      {groups.map((group) => (
        <div key={group.label}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 4,
            }}
          >
            {group.label}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {group.tokens.map((tokenPath) => {
              const cssValue = TOKEN_MAP[tokenPath];
              const isActive = currentToken === tokenPath;
              return (
                <button
                  key={tokenPath}
                  title={tokenPath}
                  onClick={() => onSelect({ token: tokenPath })}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: isActive ? "2px solid #3B82F6" : "1px solid rgba(255,255,255,0.15)",
                    background: cssValue,
                    cursor: "pointer",
                    padding: 0,
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Custom hex input */}
      <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 4 }}>
        <input
          type="text"
          placeholder="#FFFFFF"
          value={customHex}
          onChange={(e) => setCustomHex(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customHex.match(/^#[0-9a-fA-F]{3,8}$/)) {
              onSelect(customHex);
              setCustomHex("");
            }
          }}
          style={{
            flex: 1,
            padding: "4px 8px",
            fontSize: 11,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 4,
            color: "#fff",
            outline: "none",
            fontFamily: "monospace",
          }}
        />
      </div>
    </div>
  );
}
