// ============================================================
// APHANTASIA — Canvas Signal Extraction (Rules-Based)
// ============================================================
// Extracts DNA deltas from canvas state in <5ms. No AI.
// Signal-refined DNA is TRANSIENT — used for rendering but
// never persisted to DNAStore.
// ============================================================

import type { CanvasDocument } from "@/engine/CanvasEngine";
import type { DesignDNA } from "./DesignDNA";

// Deep partial — allows partial nested objects (e.g. { palette: { accent: "#fff" } })
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DNADelta = DeepPartial<DesignDNA>;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Extracts DNA delta signals from the current canvas state.
 * Returns null if no actionable signals are detected.
 * Must execute in <5ms — pure rules, no AI.
 */
export function extractCanvasSignals(
  doc: CanvasDocument
): DNADelta | null {
  const inFrame = doc.shapes.filter(
    (s) =>
      s.isInsideFrame &&
      s.semanticTag !== "unknown" &&
      s.semanticTag !== "scratchpad" &&
      s.semanticTag !== "context-note" &&
      !s.meta?._consumed
  );

  const notes = doc.shapes.filter((s) => s.type === "note");
  const noteText = notes
    .map((s) => (s.label || s.content || "").toLowerCase())
    .join(" ");

  const labels = inFrame
    .map((s) => (s.label || s.content || "").toLowerCase())
    .join(" ");

  const allText = `${noteText} ${labels}`;

  const delta: DNADelta = {};
  let hasSignals = false;

  // -----------------------------------------------------------------------
  // Label-based signals
  // -----------------------------------------------------------------------

  if (matchesAny(allText, ["dark mode", "dark theme", "dark"])) {
    merge(delta, {
      palette: {
        background: "#0C0C0C",
        foreground: "#EBEBEB",
        muted: "#1A1A1A",
        card: "#111111",
        cardForeground: "#D4D4D4",
        mutedForeground: "#8A8A9A",
        border: "rgba(255,255,255,0.08)",
      },
    });
    hasSignals = true;
  }

  if (matchesAny(allText, ["light mode", "light theme", "light"])) {
    merge(delta, {
      palette: {
        background: "#FAFAFA",
        foreground: "#111111",
        muted: "#F0F0F0",
        card: "#FFFFFF",
        cardForeground: "#333333",
        mutedForeground: "#6B7280",
        border: "rgba(0,0,0,0.08)",
      },
    });
    hasSignals = true;
  }

  // Semantic tag signals — Pricing = SaaS
  const tags = new Set(inFrame.map((s) => s.semanticTag));
  if (tags.has("pricing") || matchesAny(labels, ["pricing"])) {
    merge(delta, { moodSlug: "dark-saas" });
    hasSignals = true;
  }

  // -----------------------------------------------------------------------
  // Note-based "like X" signals (brand reference)
  // -----------------------------------------------------------------------

  if (matchesAny(noteText, ["like linear", "linear style", "linear-style"])) {
    merge(delta, {
      decorative: { style: "geometric", intensity: "subtle" },
      palette: { background: "#0B0D11", accent: "#5E6AD2", foreground: "#E8E9ED" },
      motion: { level: "subtle", entrance: "fade-up", hover: "lift" },
      surfaces: { cards: "bordered" },
    });
    hasSignals = true;
  }

  if (matchesAny(noteText, ["like stripe", "stripe style", "stripe-style"])) {
    merge(delta, {
      decorative: { style: "gradient-blobs", intensity: "moderate" },
      palette: { accent: "#635BFF", background: "#0A2540", foreground: "#F6F9FC" },
      motion: { level: "expressive", entrance: "fade-up" },
    });
    hasSignals = true;
  }

  if (matchesAny(noteText, ["like vercel", "vercel style"])) {
    merge(delta, {
      decorative: { style: "minimal", intensity: "subtle" },
      palette: { background: "#000000", foreground: "#EDEDED", accent: "#FFFFFF" },
      motion: { level: "subtle" },
      typography: { headingFamily: "Geist", bodyFamily: "Geist" },
    });
    hasSignals = true;
  }

  if (matchesAny(noteText, ["like apple", "apple style"])) {
    merge(delta, {
      decorative: { style: "minimal", intensity: "subtle" },
      palette: { background: "#FBFBFD", foreground: "#1D1D1F", accent: "#0071E3" },
      spacing: { density: "spacious", sectionPadding: "clamp(80px, 12vw, 140px)" },
      motion: { level: "expressive", entrance: "scale-up" },
    });
    hasSignals = true;
  }

  if (matchesAny(noteText, ["like notion", "notion style"])) {
    merge(delta, {
      decorative: { style: "minimal", intensity: "subtle" },
      palette: { background: "#FFFFFF", foreground: "#37352F", accent: "#2383E2" },
      typography: { scale: "compact" },
      buttons: { radius: "4px", style: "solid" },
    });
    hasSignals = true;
  }

  // -----------------------------------------------------------------------
  // Mood/style keyword signals
  // -----------------------------------------------------------------------

  if (matchesAny(noteText, ["playful", "fun", "whimsical", "friendly"])) {
    merge(delta, {
      buttons: { radius: "9999px" },
      decorative: { style: "organic" },
      motion: { level: "expressive", hover: "scale" },
    });
    hasSignals = true;
  }

  if (matchesAny(noteText, ["minimal", "clean", "simple"])) {
    merge(delta, {
      decorative: { style: "minimal", intensity: "subtle" },
      motion: { level: "subtle" },
    });
    hasSignals = true;
  }

  if (matchesAny(noteText, ["bold", "vibrant", "loud", "energetic"])) {
    merge(delta, {
      decorative: { style: "gradient-blobs", intensity: "bold" },
      motion: { level: "expressive", entrance: "scale-up", hover: "glow" },
      typography: { scale: "dramatic", headingWeight: 800 },
    });
    hasSignals = true;
  }

  if (matchesAny(noteText, ["editorial", "magazine", "literary", "blog"])) {
    merge(delta, {
      decorative: { style: "editorial", intensity: "moderate" },
      typography: { scale: "dramatic" },
    });
    hasSignals = true;
  }

  if (matchesAny(noteText, ["brutalist", "raw", "punk"])) {
    merge(delta, {
      decorative: { style: "grid-overlay", intensity: "bold" },
      buttons: { radius: "0px" },
      images: { radius: "0px" },
      motion: { level: "none" },
    });
    hasSignals = true;
  }

  if (matchesAny(noteText, ["elegant", "luxury", "premium", "sophisticated"])) {
    merge(delta, {
      decorative: { style: "minimal", intensity: "subtle" },
      spacing: { density: "spacious", sectionPadding: "clamp(80px, 12vw, 140px)" },
      motion: { level: "subtle", entrance: "fade-in", hover: "glow" },
      typography: { headingLetterSpacing: "-0.04em" },
    });
    hasSignals = true;
  }

  // -----------------------------------------------------------------------
  // Structural signals (composition-based)
  // -----------------------------------------------------------------------

  const hasCards = tags.has("cards");
  if (inFrame.length > 6 && hasCards) {
    merge(delta, {
      spacing: { density: "tight", gridGap: "16px" },
    });
    hasSignals = true;
  }

  // Single hero only → spacious
  if (inFrame.length === 1 && tags.has("hero")) {
    merge(delta, {
      spacing: { density: "spacious", sectionPadding: "clamp(80px, 12vw, 140px)" },
    });
    hasSignals = true;
  }

  // Many images → natural treatment
  const imageCount = inFrame.filter(
    (s) => s.type === "image" || s.semanticTag === "image"
  ).length;
  if (imageCount > 2) {
    merge(delta, {
      images: { treatment: "natural" },
    });
    hasSignals = true;
  }

  // Portfolio tag → gallery-oriented
  if (tags.has("portfolio")) {
    merge(delta, {
      spacing: { density: "balanced" },
      images: { treatment: "natural", frame: "shadow" },
    });
    hasSignals = true;
  }

  return hasSignals ? delta : null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

/**
 * Deep-merge partial DNA overrides into an accumulating delta.
 * Only one level deep — matching DNAStore's merge pattern.
 */
function merge(target: DNADelta, source: DNADelta): void {
  for (const key of Object.keys(source)) {
    const val = (source as Record<string, unknown>)[key];
    if (val === undefined) continue;

    const existing = (target as Record<string, unknown>)[key];
    if (
      typeof val === "object" &&
      val !== null &&
      !Array.isArray(val) &&
      typeof existing === "object" &&
      existing !== null
    ) {
      // Merge nested objects
      (target as Record<string, unknown>)[key] = { ...(existing as Record<string, unknown>), ...(val as Record<string, unknown>) };
    } else {
      (target as Record<string, unknown>)[key] = val;
    }
  }
}
