import type { CanvasShape, SemanticTag } from "@/engine/CanvasEngine";

// Rules-based base semantic resolver — fast, deterministic, no AI.
// Called on every canvas change. Must stay synchronous and cheap.
export function resolveSemanticTag(
  shape: CanvasShape,
  frameWidth: number,
  frameHeight: number
): SemanticTag {
  if (!shape.isInsideFrame) {
    return shape.label?.toLowerCase().includes("context")
      ? "context-note"
      : "scratchpad";
  }

  const { width, height, type, label, y } = shape;

  // Non-rectangle shape types map directly
  if (type === "text") return "text-block";
  if (type === "note" || type === "sticky") return "context-note";
  if (type === "arrow") return "unknown";
  if (type === "oval") return "image";
  if (type === "image") return "image";
  if (type === "roundedRect") return "button";

  // Label hints take precedence over geometric rules.
  // Users can write anything — we match generously.
  // For hint matching, use only the FIRST line of the label (subsequent lines
  // are sub-content like body text or "button: Label" — they shouldn't change
  // the section type).
  const firstLine = (label ?? "").split("\n")[0].toLowerCase();
  const hint = firstLine + " " + (shape.contextNote ?? "").toLowerCase();

  // Nav / header
  if (/\b(nav|header|menu|navigation|topbar)\b/.test(hint)) return "nav";

  // Hero / banner
  if (/\b(hero|banner|jumbotron|headline|above[- ]fold)\b/.test(hint)) return "hero";

  // Feature grid / cards / pricing
  if (/\b(features?|cards?|grid|pricing|benefits?|capabilities|highlights?)\b/.test(hint)) return "cards";

  // Split / two-column
  if (/\b(split|two[- ]col|side[- ]by[- ]side|text[- ]image|image[- ]text)\b/.test(hint)) return "split";

  // CTA / call to action
  if (/\b(cta|call[- ]to[- ]action|get[- ]started|try[- ]it|sign[- ]up[- ]cta)\b/.test(hint)) return "button";

  // Portfolio / work / case studies
  if (/\b(portfolio|projects?|work|case[- ]stud|showcase|gallery)\b/.test(hint)) return "portfolio";

  // E-commerce / products / shop
  if (/\b(shop|products?|store|ecommerce|e-commerce|catalog|buy|merchandise)\b/.test(hint)) return "ecommerce";

  // Event signup / registration / RSVP
  if (/\b(event|rsvp|register|registration|conference|meetup|webinar|workshop|ticket)\b/.test(hint)) return "form";

  // Form / contact
  if (/\b(form|contact|signup|sign[- ]up|subscribe|newsletter|email[- ]capture)\b/.test(hint)) return "form";

  // Footer
  if (/\b(footer|bottom|copyright)\b/.test(hint)) return "footer";

  // Image / photo / media
  if (/\b(image|photo|img|screenshot|illustration|video|media)\b/.test(hint)) return "image";

  // Button (standalone)
  if (/\b(button|btn)\b/.test(hint)) return "button";

  // Generic text / copy
  if (/\b(text|copy|paragraph|body|content|about|description|story)\b/.test(hint)) return "section";

  // Geometric rules — ratios relative to frame dimensions
  const widthRatio  = width  / frameWidth;
  const heightRatio = height / frameHeight;
  const yRatio      = y      / frameHeight;

  const isWide     = widthRatio  > 0.55;
  const isShort    = heightRatio < 0.08;
  const isTall     = heightRatio > 0.22;
  const isSmall    = widthRatio  < 0.25 && heightRatio < 0.1;
  const isAtTop    = yRatio      < 0.25;
  const isAtBottom = yRatio      > 0.72;

  // roundedRect is already handled above (line 24), so only check isSmall for rects
  if (isSmall) return "button";
  if (isAtTop && isWide && isShort) return "nav";
  if (isAtTop && isWide && isTall) return "hero";
  if (isAtTop && isWide) return "hero";
  if (isAtBottom && isWide) return "footer";
  if (isWide) return "section";

  // Roughly square, not too large → card candidate
  const ar = width / height;
  if (ar > 0.6 && ar < 2.0) return "cards";

  return "section";
}
