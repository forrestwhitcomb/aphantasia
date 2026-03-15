"use client";

import { useState, useEffect } from "react";
import { aiCallTracker, type AICallStats } from "@/lib/aiCallTracker";

export function AICallCounter() {
  const [stats, setStats] = useState<AICallStats>(aiCallTracker.get());

  useEffect(() => {
    return aiCallTracker.subscribe(setStats);
  }, []);

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
        minWidth: 130,
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
        AI Calls
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Extract</span>
        <span style={{ fontWeight: 600, color: "#fff" }}>{stats.extract}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Render</span>
        <span style={{ fontWeight: 600, color: "#fff" }}>{stats.render}</span>
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
        <span>{stats.total}</span>
      </div>
    </div>
  );
}
