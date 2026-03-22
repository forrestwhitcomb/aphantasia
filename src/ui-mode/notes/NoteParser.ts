// ============================================================
// APHANTASIA — Note Parser (Layer 1)
// ============================================================
// Parses note text for keywords that can be applied at Layer 1
// (no AI, synchronous). Extracts:
//   - Item counts: "3 items", "5 rows"
//   - Variants: "primary", "outline", "ghost", "destructive"
//   - States: "disabled", "error", "loading"
//   - Labeled items: "1. Home 2. Search 3. Profile"
//   - Boolean flags: "full width", "dark mode", "no border"
// ============================================================

export interface NoteParseResult {
  itemCount?: number;
  variant?: string;
  state?: string;
  itemLabels?: string[];
  flags: Set<string>;
  /** Raw text after keyword extraction (still useful for Layer 2) */
  rawText: string;
}

const VARIANT_KEYWORDS = new Set([
  "primary", "secondary", "outline", "ghost", "destructive",
  "elevated", "bordered", "filled", "image-top",
  "simple", "subtitle", "icon-left", "chevron", "toggle",
  "inset", "plain", "separated",
  "icon-only", "icon-label", "pill-active",
  "large-title", "standard", "search", "segmented",
  "with-action", "with-label", "with-icon", "with-cancel", "with-filter",
  "with-value", "with-labels", "with-avatar", "with-cover",
  "full-width", "peek", "dots", "progress-bar",
  "linear", "circular", "steps",
  "info", "success", "warning", "error",
  "alert", "action-sheet", "full-screen",
  "centered", "left-aligned",
  "sent", "received",
  "social", "news", "minimal",
  "navigation", "value",
  "light", "dark",
]);

const STATE_KEYWORDS = new Set([
  "disabled", "inactive", "error", "loading", "selected", "active",
]);

const FLAG_PATTERNS: [RegExp, string][] = [
  [/\bfull\s*width\b/i, "fullWidth"],
  [/\bdark\s*mode\b/i, "darkMode"],
  [/\bno\s*border\b/i, "noBorder"],
  [/\bno\s*shadow\b/i, "noShadow"],
  [/\btransparent\b/i, "transparent"],
  [/\bblur\b/i, "blur"],
  [/\bsticky\b/i, "sticky"],
  [/\bhidden\b/i, "hidden"],
];

/**
 * Parse note text for Layer 1 keywords.
 * Returns structured data that the render engine can apply
 * without any AI involvement.
 */
export function parseNote(noteText: string): NoteParseResult {
  const flags = new Set<string>();
  let text = noteText.trim();

  // Extract item count: "3 items", "5 rows", "4 tabs"
  let itemCount: number | undefined;
  const countMatch = text.match(/\b(\d+)\s*(?:items?|rows?|tabs?|cards?|entries?)\b/i);
  if (countMatch) {
    itemCount = parseInt(countMatch[1], 10);
  }

  // Extract numbered item labels: "1. Home 2. Search 3. Profile"
  let itemLabels: string[] | undefined;
  const numberedMatch = text.match(/\d+\.\s*\S+/g);
  if (numberedMatch && numberedMatch.length >= 2) {
    itemLabels = numberedMatch.map((m) => m.replace(/^\d+\.\s*/, "").trim());
    if (!itemCount) itemCount = itemLabels.length;
  }

  // Extract comma/pipe separated labels: "Home, Search, Profile" or "Home | Search | Profile"
  if (!itemLabels) {
    const parts = text.split(/[,|]/).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2 && parts.every((p) => p.length < 30)) {
      itemLabels = parts;
      if (!itemCount) itemCount = itemLabels.length;
    }
  }

  // Extract variant keyword
  let variant: string | undefined;
  const words = text.toLowerCase().split(/[\s,]+/);
  for (const word of words) {
    if (VARIANT_KEYWORDS.has(word)) {
      variant = word;
      break;
    }
  }

  // Extract state keyword
  let state: string | undefined;
  for (const word of words) {
    if (STATE_KEYWORDS.has(word)) {
      state = word;
      break;
    }
  }

  // Extract flags
  for (const [pattern, flag] of FLAG_PATTERNS) {
    if (pattern.test(text)) {
      flags.add(flag);
    }
  }

  return {
    itemCount,
    variant,
    state,
    itemLabels,
    flags,
    rawText: text,
  };
}

/**
 * Parse multiple notes and merge results.
 * Later notes override earlier ones for single-value fields.
 */
export function parseNotes(notes: string[]): NoteParseResult {
  if (notes.length === 0) {
    return { flags: new Set(), rawText: "" };
  }
  if (notes.length === 1) {
    return parseNote(notes[0]);
  }

  const merged: NoteParseResult = { flags: new Set(), rawText: "" };
  for (const note of notes) {
    const parsed = parseNote(note);
    if (parsed.itemCount !== undefined) merged.itemCount = parsed.itemCount;
    if (parsed.variant) merged.variant = parsed.variant;
    if (parsed.state) merged.state = parsed.state;
    if (parsed.itemLabels) merged.itemLabels = parsed.itemLabels;
    for (const flag of parsed.flags) merged.flags.add(flag);
    merged.rawText += (merged.rawText ? "\n" : "") + parsed.rawText;
  }
  return merged;
}
