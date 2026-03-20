import type { CanvasShape, SemanticTag } from "@/engine/CanvasEngine";

// ============================================================
// Mobile-specific semantic resolver
// ============================================================
// Tuned for 393×852 mobile frames. Detects app bars, tab bars,
// list groups, profile headers, search bars, etc.
// Called from UIPreviewPane — must stay synchronous and cheap.

export function resolveMobileSemanticTag(
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

  // Non-rectangle shape types
  if (type === "text") return "text-block";
  if (type === "note" || type === "sticky") return "context-note";
  if (type === "arrow") return "unknown";
  if (type === "oval") return "image";
  if (type === "image") return "image";
  if (type === "roundedRect") return "button";

  // Label hints — mobile-specific patterns checked first
  const firstLine = (label ?? "").split("\n")[0].toLowerCase();
  const hint = firstLine + " " + (shape.contextNote ?? "").toLowerCase();

  // ── Mobile-specific label patterns ──
  // IMPORTANT: More specific multi-word patterns MUST come before generic single-word ones
  // e.g. "section header" before "header", "bottom sheet" before "bottom", "media cell" before "media"

  // Compound patterns first (2+ words that would collide with generic rules)
  if (/\b(section[- ]?header|group[- ]?title|category[- ]?title)\b/.test(hint)) return "section-header";
  if (/\b(bottom[- ]?sheet|pull[- ]?up|drawer)\b/.test(hint)) return "bottom-sheet";
  if (/\b(tab[- ]?bar|bottom[- ]?nav)\b/.test(hint)) return "footer";
  if (/\b(media[- ]?cell|post[- ]?card|reel|thumbnail)\b/.test(hint)) return "media-cell";
  if (/\b(empty[- ]?state|no[- ]?results?|no[- ]?data|nothing[- ]?here)\b/.test(hint)) return "empty-state";
  if (/\b(floating[- ]?action|add[- ]?button)\b/.test(hint)) return "fab";
  if (/\b(filter[- ]?bar)\b/.test(hint)) return "segmented-control";

  // App bar / navigation bar
  if (/\b(app[- ]?bar|nav[- ]?bar|top[- ]?bar|nav|header|navigation)\b/.test(hint)) return "nav";

  // Search
  if (/\b(search|find)\b/.test(hint)) return "search-bar";

  // Profile / user header
  if (/\b(profile|account|avatar|bio)\b/.test(hint)) return "profile-header";

  // Stats / metrics
  if (/\b(stats?|metrics?|followers?|following)\b/.test(hint)) return "stats-row";

  // Segmented control
  if (/\b(segment|switcher)\b/.test(hint)) return "segmented-control";

  // Settings / list
  if (/\b(settings?|options?|preferences?|menu|list)\b/.test(hint)) return "split";

  // Feed / timeline
  if (/\b(feed|timeline|posts?|stories|activity)\b/.test(hint)) return "cards";

  // Chat / messages
  if (/\b(chat|messages?|conversation|inbox)\b/.test(hint)) return "split";

  // Hero / banner
  if (/\b(hero|banner|headline|welcome)\b/.test(hint)) return "hero";

  // Feature grid / cards
  if (/\b(features?|cards?|grid|tiles?|categories)\b/.test(hint)) return "cards";

  // Form / input
  if (/\b(form|login|sign[- ]?up|register|contact|input)\b/.test(hint)) return "form";

  // Modal / dialog
  if (/\b(modal|dialog|alert|confirm|popup)\b/.test(hint)) return "modal";

  // Toast / snackbar
  if (/\b(toast|snackbar|notification)\b/.test(hint)) return "toast";

  // FAB
  if (/\b(fab|compose)\b/.test(hint)) return "fab";

  // Button / CTA
  if (/\b(button|btn|cta|action|submit|continue|next)\b/.test(hint)) return "button";

  // Empty (single word)
  if (/\b(empty|placeholder)\b/.test(hint)) return "empty-state";

  // Footer (non-tab-bar)
  if (/\b(footer|copyright)\b/.test(hint)) return "footer";

  // Media / image
  if (/\b(media|video)\b/.test(hint)) return "media-cell";
  if (/\b(image|photo|img|screenshot|illustration)\b/.test(hint)) return "image";

  // Generic text
  if (/\b(text|copy|paragraph|body|content|about|description)\b/.test(hint)) return "section";

  // ── Geometric rules (mobile-tuned) ──
  const widthRatio  = width  / frameWidth;
  const heightRatio = height / frameHeight;
  const yRatio      = y      / frameHeight;

  const isFullWidth = widthRatio > 0.8;
  const isWide      = widthRatio > 0.55;
  const isThin      = heightRatio < 0.09;   // ~77px on 852px frame
  const isTall      = heightRatio > 0.25;
  const isSmall     = widthRatio < 0.35 && heightRatio < 0.08;
  const isAtTop     = yRatio < 0.05;        // top ~42px — only the very first shape
  const isAtBottom  = yRatio > 0.85;        // bottom ~128px
  const isNearTop   = yRatio < 0.25;

  // Small element → button
  if (isSmall) return "button";

  // Full-width thin bar at very top → nav / app bar
  if (isAtTop && isFullWidth && isThin) return "nav";

  // Full-width thin bar at very bottom → tab bar
  if (isAtBottom && isFullWidth && isThin) return "footer";

  // Full-width thin strip anywhere else → list item candidate
  // (must come BEFORE hero rule — thin strips are list items, not heroes)
  if (isFullWidth && isThin) return "split";

  // Large area near top → hero or profile header (only non-thin)
  if (isNearTop && isWide && isTall) return "hero";
  if (isNearTop && isWide) return "hero";

  // Wide section at bottom (but not thin) → generic section or form
  if (isAtBottom && isWide) return "section";

  // Full-width medium height → generic section
  if (isWide) return "section";

  // Roughly square → card
  const ar = width / height;
  if (ar > 0.6 && ar < 2.0) return "cards";

  return "section";
}

// ============================================================
// Desktop/Site semantic resolver
// ============================================================
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

  // Pricing table (check before general cards/features)
  if (/\b(pricing|plans?|tiers?|subscription)\b/.test(hint)) return "pricing";

  // Testimonials / social proof
  if (/\b(testimonials?|reviews?|quotes?|what people say|social[- ]proof)\b/.test(hint)) return "testimonials";

  // Logo cloud / partners
  if (/\b(logos?|partners?|clients?|trusted[- ]by|press|as[- ]seen)\b/.test(hint)) return "logo-cloud";

  // Stats / metrics
  if (/\b(stats?|metrics?|numbers?|by[- ]the[- ]numbers?|counter)\b/.test(hint)) return "stats";

  // FAQ
  if (/\b(faq|frequently[- ]asked|questions?|q[- ]?&[- ]?a)\b/.test(hint)) return "faq";

  // Team
  if (/\b(team|people|our[- ]team|who[- ]we[- ]are|staff|members?)\b/.test(hint)) return "team";

  // Comparison
  if (/\b(comparison|compare|vs|us[- ]vs[- ]them|versus)\b/.test(hint)) return "comparison";

  // Feature grid / cards
  if (/\b(features?|cards?|grid|benefits?|capabilities|highlights?)\b/.test(hint)) return "cards";

  // Split / two-column
  if (/\b(split|two[- ]col|side[- ]by[- ]side|text[- ]image|image[- ]text)\b/.test(hint)) return "split";

  // CTA / call to action
  if (/\b(cta|call[- ]to[- ]action|get[- ]started|try[- ]it|sign[- ]up[- ]cta)\b/.test(hint)) return "button";

  // Portfolio / work / case studies
  if (/\b(portfolio|projects?|work|case[- ]stud|showcase|gallery)\b/.test(hint)) return "portfolio";

  // E-commerce / products / shop
  if (/\b(shop|products?|store|ecommerce|e-commerce|catalog|buy|merchandise)\b/.test(hint)) return "ecommerce";

  // Newsletter / email capture
  if (/\b(newsletter|subscribe|stay[- ]updated|join[- ]us|email[- ]capture|mailing[- ]list)\b/.test(hint)) return "newsletter";

  // Event signup / registration / RSVP
  if (/\b(event|rsvp|register|registration|conference|meetup|webinar|workshop|ticket)\b/.test(hint)) return "form";

  // Form / contact
  if (/\b(form|contact|signup|sign[- ]up)\b/.test(hint)) return "form";

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
