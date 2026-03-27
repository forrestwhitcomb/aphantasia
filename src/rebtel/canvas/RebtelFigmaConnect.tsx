"use client";

// ============================================================
// APHANTASIA for REBTEL — Figma Connect Widget
// ============================================================
// Compact floating widget for connecting a Figma file to the
// Rebtel canvas. Populates the component registry and layout
// map in RebtelDesignStore.
// ============================================================

import { useState, useCallback, useEffect } from "react";
import { rebtelDesignStore } from "../store/RebtelDesignStore";
import { extractFigmaUrl } from "@/lib/figmaUrl";

export function RebtelFigmaConnect() {
  const [expanded, setExpanded] = useState(false);
  const [figmaUrl, setFigmaUrl] = useState("");
  const [figmaToken, setFigmaToken] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [registryCount, setRegistryCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("aphantasia:figmaToken");
    if (saved) setFigmaToken(saved);
  }, []);

  useEffect(() => {
    const unsub = rebtelDesignStore.subscribe(() => {
      setConnected(rebtelDesignStore.isFigmaConnected());
      setRegistryCount(rebtelDesignStore.getRegistry().length);
    });
    setConnected(rebtelDesignStore.isFigmaConnected());
    setRegistryCount(rebtelDesignStore.getRegistry().length);
    return unsub;
  }, []);

  const handleConnect = useCallback(async () => {
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
        signal: AbortSignal.timeout(60000),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Figma extraction failed");
      }

      const data = await res.json();

      if (data.componentRegistry && data.componentLayouts) {
        rebtelDesignStore.setFigmaData(
          data.componentRegistry,
          data.componentLayouts
        );
      }

      setExpanded(false);
    } catch (err) {
      if (err instanceof DOMException && err.name === "TimeoutError") {
        setError("Figma took too long to respond. Try a URL with a specific node-id, or try again.");
      } else {
        setError(err instanceof Error ? err.message : "Connection failed");
      }
    } finally {
      setIsExtracting(false);
    }
  }, [figmaUrl, figmaToken]);

  const handleDisconnect = useCallback(() => {
    rebtelDesignStore.clearFigmaData();
    setFigmaUrl("");
  }, []);

  // Collapsed state: small Figma icon button
  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        title={connected ? `Figma connected (${registryCount} components)` : "Connect Figma"}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 100,
          width: 44,
          height: 44,
          borderRadius: 14,
          background: connected ? "rgba(230,57,70,0.15)" : "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: connected ? "1px solid rgba(230,57,70,0.3)" : "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          color: connected ? "#E63946" : "#1a1a2e",
          fontSize: 18,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 38 57" fill="currentColor">
          <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
          <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z"/>
          <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z"/>
          <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
          <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
        </svg>
        {connected && (
          <span style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#22c55e",
            border: "2px solid white",
          }} />
        )}
      </button>
    );
  }

  // Expanded state: connection form
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 68,
        zIndex: 100,
        width: 300,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        padding: 14,
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
          <span style={{ color: "#E63946" }}>Figma</span> Connect
        </span>
        <button
          onClick={() => setExpanded(false)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            color: "rgba(0,0,0,0.4)",
            padding: "2px 6px",
          }}
        >
          &times;
        </button>
      </div>

      {connected ? (
        <div>
          <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 500, marginBottom: 8 }}>
            Connected — {registryCount} components loaded
          </div>
          <button
            onClick={handleDisconnect}
            style={{
              width: "100%",
              padding: "7px 12px",
              fontSize: 12,
              fontWeight: 500,
              background: "rgba(230,57,70,0.1)",
              color: "#E63946",
              border: "1px solid rgba(230,57,70,0.2)",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Figma URL (design/…?node-id=…)"
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
            style={{
              width: "100%",
              padding: "7px 10px",
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "white",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: 6,
            }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="password"
              placeholder="Access token"
              value={figmaToken}
              onChange={(e) => setFigmaToken(e.target.value)}
              disabled={isExtracting}
              style={{
                flex: 1,
                padding: "7px 10px",
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "white",
                outline: "none",
              }}
            />
            <button
              onClick={handleConnect}
              disabled={isExtracting || !figmaUrl.trim() || !figmaToken.trim()}
              style={{
                padding: "7px 14px",
                fontSize: 12,
                fontWeight: 600,
                background: "#1a1a2e",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                opacity: isExtracting || !figmaUrl.trim() || !figmaToken.trim() ? 0.5 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {isExtracting ? "…" : "Connect"}
            </button>
          </div>
          {error && (
            <div style={{ fontSize: 11, color: "#E63946", marginTop: 6 }}>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
