"use client";

import { useState } from "react";
import { getCustomEngine } from "@/engine/engines/CustomCanvasEngine";

type OutputType = "site" | "slides" | "doodles";

export function OutputToggle() {
  const [active, setActive] = useState<OutputType>("site");

  const options: { label: string; value: OutputType }[] = [
    { label: "Site", value: "site" },
    { label: "Slides", value: "slides" },
    { label: "Doodles", value: "doodles" },
  ];

  return (
    <div
      style={{
        display: "flex",
        borderRadius: "1rem",
        padding: "6px 12px",
        gap: 4,
        background: "rgba(26,26,26,0.92)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        fontFamily: "var(--font-poppins)",
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => {
            setActive(opt.value);
            getCustomEngine().setOutputType(opt.value);
          }}
          style={{
            padding: "6px 18px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
            fontFamily: "var(--font-poppins)",
            ...(active === opt.value
              ? { background: "rgba(255,255,255,0.15)", color: "#fff" }
              : { background: "transparent", color: "rgba(255,255,255,0.5)" }),
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
