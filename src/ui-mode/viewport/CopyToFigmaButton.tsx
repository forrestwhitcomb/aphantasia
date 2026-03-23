"use client";

// ============================================================
// Copy to Figma Button
// ============================================================
// Sends viewport HTML to code.to.design clipboard API, then
// writes the Figma-pasteable clipboard data so the user can
// Cmd+V directly into Figma with real editable frames.
// ============================================================

import { useState, useCallback } from "react";

type CopyState = "idle" | "loading" | "copied" | "error";

interface CopyToFigmaButtonProps {
  /** Returns the current iframe srcDoc HTML */
  getSrcDoc: () => string;
}

/** Inline Figma logo SVG (simplified) */
function FigmaIcon() {
  return (
    <svg width="12" height="18" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

export function CopyToFigmaButton({ getSrcDoc }: CopyToFigmaButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCopy = useCallback(async () => {
    const srcDoc = getSrcDoc();
    if (!srcDoc) {
      setState("error");
      setErrorMsg("No content to copy — render a screen first");
      setTimeout(() => setState("idle"), 3000);
      return;
    }

    setState("loading");

    try {
      // 1. Send to our API route (proxies to code.to.design)
      const res = await fetch("/api/ui-copy-figma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: srcDoc }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          throw new Error(data.setup || "API key not configured");
        }
        throw new Error(data.error || `API error ${res.status}`);
      }

      const { clipboardHtml } = await res.json();

      if (!clipboardHtml) {
        throw new Error("Empty response from code.to.design");
      }

      // 2. Write to clipboard using the copy event pattern
      // (code.to.design clipboard data must be written as text/html)
      const copyHandler = (e: ClipboardEvent) => {
        if (e.clipboardData) {
          e.clipboardData.setData("text/html", clipboardHtml);
          e.preventDefault();
        }
      };

      document.addEventListener("copy", copyHandler);
      const success = document.execCommand("copy");
      document.removeEventListener("copy", copyHandler);

      if (!success) {
        // Fallback: try the modern Clipboard API
        try {
          const blob = new Blob([clipboardHtml], { type: "text/html" });
          await navigator.clipboard.write([
            new ClipboardItem({ "text/html": blob }),
          ]);
        } catch {
          throw new Error("Clipboard write failed — check browser permissions");
        }
      }

      // 3. Success!
      setState("copied");
      setTimeout(() => setState("idle"), 2500);
    } catch (err) {
      console.error("[CopyToFigma]", err);
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Copy failed");
      setTimeout(() => setState("idle"), 4000);
    }
  }, [getSrcDoc]);

  const isDisabled = state === "loading";

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <button
        onClick={handleCopy}
        disabled={isDisabled}
        title={
          state === "error"
            ? errorMsg
            : state === "copied"
            ? "Copied! Paste in Figma with Cmd+V"
            : "Copy as Figma frame"
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.12)",
          background:
            state === "copied"
              ? "rgba(16,185,129,0.2)"
              : state === "error"
              ? "rgba(239,68,68,0.2)"
              : "rgba(50,50,55,0.95)",
          color:
            state === "copied"
              ? "#10b981"
              : state === "error"
              ? "#ef4444"
              : "rgba(255,255,255,0.7)",
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "var(--font-poppins), sans-serif",
          cursor: isDisabled ? "wait" : "pointer",
          opacity: isDisabled ? 0.6 : 1,
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
        }}
      >
        {state === "loading" ? (
          <Spinner />
        ) : state === "copied" ? (
          <CheckIcon />
        ) : (
          <FigmaIcon />
        )}
        {state === "copied"
          ? "Copied!"
          : state === "error"
          ? "Failed"
          : state === "loading"
          ? "Converting..."
          : "Copy to Figma"}
      </button>

      {/* Error tooltip */}
      {state === "error" && errorMsg && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(30,30,30,0.95)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444",
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 6,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 30,
          }}
        >
          {errorMsg}
        </div>
      )}
    </div>
  );
}
