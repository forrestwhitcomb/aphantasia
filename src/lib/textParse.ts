// ============================================================
// Smart Text Parsing — multi-line text shape interpretation
// ============================================================
// Parses multi-line text from canvas shapes into structured parts.
// Rules:
//   Line 1                    → heading
//   Line 2 (no prefix)        → body / subheading
//   Any line "button: Label"  → CTA button text
//   Entire text = "button"    → CTA only
// ============================================================

export interface ParsedText {
  heading?: string;
  body?: string;
  cta?: string;
}

const BTN_LINE_RE = /^(?:button|btn|cta)[\s:]+(.+)$/i;
const BTN_SOLO_RE = /^(?:button|btn|cta)$/i;

/**
 * Parse a text shape's label into structured heading/body/cta.
 * Supports multi-line content (newline-separated).
 *
 *   "Welcome"                       → { heading: "Welcome" }
 *   "Welcome\nGreat product"        → { heading: "Welcome", body: "Great product" }
 *   "Welcome\nGreat\nbutton: Buy"   → { heading: "Welcome", body: "Great", cta: "Buy" }
 *   "Welcome\nGreat\nbutton"        → { heading: "Welcome", body: "Great", cta: "Get started" }
 *   "button: Sign up"               → { cta: "Sign up" }
 *   "button"  (single line only)    → { cta: "Button" }
 */
export function parseTextLabel(label: string | undefined): ParsedText {
  if (!label) return {};

  const raw = label.trim();
  if (!raw) return {};

  // Single-line only: entire text is a button keyword → standalone CTA
  if (BTN_SOLO_RE.test(raw)) {
    return { cta: "Button" };
  }
  // Single-line only: "button: Label" → standalone CTA with custom label
  const singleBtnMatch = raw.match(BTN_LINE_RE);
  if (singleBtnMatch && !raw.includes("\n")) {
    return { cta: singleBtnMatch[1].trim() };
  }

  // Multi-line: split and categorize each line
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return {};

  let heading: string | undefined;
  let cta: string | undefined;
  const bodyLines: string[] = [];

  for (const line of lines) {
    // "button" alone in a multi-line context → show a button with default label
    if (BTN_SOLO_RE.test(line)) {
      cta = "Get started";
      continue;
    }
    // "button: Label" → show a button with that label
    const btnMatch = line.match(BTN_LINE_RE);
    if (btnMatch) {
      cta = btnMatch[1].trim();
      continue;
    }

    // First non-button line → heading
    if (!heading) {
      heading = line;
    } else {
      // Subsequent non-button lines → body
      bodyLines.push(line);
    }
  }

  const body = bodyLines.length > 0 ? bodyLines.join(" ") : undefined;

  return { heading, body, cta };
}
