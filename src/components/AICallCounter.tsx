"use client";

import { useState, useEffect } from "react";
import { aiCallTracker, type AICallStats } from "@/lib/aiCallTracker";

function formatTokens(n: number | undefined): string {
  if (n == null || isNaN(n)) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function AICallCounter() {
  const [stats, setStats] = useState<AICallStats>(aiCallTracker.get());

  useEffect(() => {
    return aiCallTracker.subscribe(setStats);
  }, []);

  const totalTokens = stats.tokensIn + stats.tokensOut;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        left: 12,
        zIndex: 50,
        background: "rgba(26,26,26,0.85)",
        backdropFilter: "blur(8px)",
        borderRadius: 10,
        padding: "8px 14px",
        border: "1px solid rgba(255,255,255,0.08)",
        fontFamily: "var(--font-poppins), sans-serif",
        fontSize: 11,
        color: "rgba(255,255,255,0.7)",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        minWidth: 140,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.4)",
          marginBottom: 2,
        }}
      >
        AI Usage
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Calls</span>
        <span style={{ fontWeight: 600, color: "#fff" }}>{stats.total}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Tokens in</span>
        <span style={{ fontWeight: 600, color: "#fff" }}>{formatTokens(stats.tokensIn)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Tokens out</span>
        <span style={{ fontWeight: 600, color: "#fff" }}>{formatTokens(stats.tokensOut)}</span>
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          marginTop: 3,
          paddingTop: 4,
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 600,
          color: "#fff",
        }}
      >
        <span>Total</span>
        <span>{formatTokens(totalTokens)}</span>
      </div>
    </div>
  );
}
