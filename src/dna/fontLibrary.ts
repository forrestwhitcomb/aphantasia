// ============================================================
// APHANTASIA — Curated Font Pairing Library
// ============================================================
// 20+ pairings selected for web design excellence.
// AI picks the best match for each project's personality.
// All available via Google Fonts or self-hosted.
// ============================================================

export interface FontPairing {
  id: string;
  heading: string;           // Display name
  headingGoogleName: string; // Google Fonts family name
  body: string;
  bodyGoogleName: string;
  headingWeight: number;
  headingLetterSpacing: string;
  character: string;         // One-line personality description
  bestFor: string[];         // Helps AI selection
}

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: "tech-forward",
    heading: "Clash Display",
    headingGoogleName: "Space Grotesk", // Clash Display not on GF; Space Grotesk is closest
    body: "Satoshi",
    bodyGoogleName: "DM Sans", // Satoshi not on GF; DM Sans is closest geometric sans
    headingWeight: 700,
    headingLetterSpacing: "-0.03em",
    character: "Geometric, modern, developer-friendly",
    bestFor: ["saas", "developer-tools", "ai", "tech", "startup"],
  },
  {
    id: "confident-saas",
    heading: "Cabinet Grotesk",
    headingGoogleName: "Plus Jakarta Sans",
    body: "General Sans",
    bodyGoogleName: "Inter",
    headingWeight: 700,
    headingLetterSpacing: "-0.02em",
    character: "Clean, trustworthy, enterprise-ready",
    bestFor: ["saas", "enterprise", "b2b", "platform", "fintech"],
  },
  {
    id: "editorial-luxury",
    heading: "Playfair Display",
    headingGoogleName: "Playfair Display",
    body: "Source Serif 4",
    bodyGoogleName: "Source Serif 4",
    headingWeight: 700,
    headingLetterSpacing: "-0.01em",
    character: "Refined, literary, premium feel",
    bestFor: ["editorial", "magazine", "luxury", "publishing", "wine", "fashion"],
  },
  {
    id: "warm-modern",
    heading: "Outfit",
    headingGoogleName: "Outfit",
    body: "DM Sans",
    bodyGoogleName: "DM Sans",
    headingWeight: 700,
    headingLetterSpacing: "-0.02em",
    character: "Friendly, approachable, startup-y",
    bestFor: ["consumer", "social", "health", "wellness", "education", "food"],
  },
  {
    id: "bold-statement",
    heading: "Syne",
    headingGoogleName: "Syne",
    body: "Inter",
    bodyGoogleName: "Inter",
    headingWeight: 800,
    headingLetterSpacing: "-0.04em",
    character: "Expressive, memorable, brand-forward",
    bestFor: ["agency", "creative", "brand", "music", "entertainment", "gaming"],
  },
  {
    id: "swiss-precision",
    heading: "Inter",
    headingGoogleName: "Inter",
    body: "Inter",
    bodyGoogleName: "Inter",
    headingWeight: 700,
    headingLetterSpacing: "-0.02em",
    character: "Minimal, Helvetica-lineage, Swiss school",
    bestFor: ["dashboard", "analytics", "data", "admin", "finance"],
  },
  {
    id: "creative-agency",
    heading: "Space Grotesk",
    headingGoogleName: "Space Grotesk",
    body: "Work Sans",
    bodyGoogleName: "Work Sans",
    headingWeight: 700,
    headingLetterSpacing: "-0.03em",
    character: "Geometric, creative, slightly playful",
    bestFor: ["agency", "design", "studio", "portfolio", "architecture"],
  },
  {
    id: "elegant-serif",
    heading: "Cormorant Garamond",
    headingGoogleName: "Cormorant Garamond",
    body: "Libre Franklin",
    bodyGoogleName: "Libre Franklin",
    headingWeight: 600,
    headingLetterSpacing: "0em",
    character: "Classic, editorial, timeless",
    bestFor: ["luxury", "hotel", "restaurant", "wedding", "jewelry", "art"],
  },
  {
    id: "monospace-tech",
    heading: "JetBrains Mono",
    headingGoogleName: "JetBrains Mono",
    body: "IBM Plex Sans",
    bodyGoogleName: "IBM Plex Sans",
    headingWeight: 700,
    headingLetterSpacing: "0em",
    character: "Technical, hacker culture, code-forward",
    bestFor: ["developer", "cli", "terminal", "api", "devops", "cybersecurity"],
  },
  {
    id: "friendly-rounded",
    heading: "Nunito",
    headingGoogleName: "Nunito",
    body: "Karla",
    bodyGoogleName: "Karla",
    headingWeight: 800,
    headingLetterSpacing: "-0.01em",
    character: "Soft, warm, consumer-friendly",
    bestFor: ["kids", "family", "nonprofit", "community", "pet", "childcare"],
  },
  {
    id: "high-fashion",
    heading: "Italiana",
    headingGoogleName: "Italiana",
    body: "Jost",
    bodyGoogleName: "Jost",
    headingWeight: 400,
    headingLetterSpacing: "0.05em",
    character: "Luxury, fashion, high-end",
    bestFor: ["fashion", "beauty", "cosmetics", "perfume", "haute-couture"],
  },
  {
    id: "retro-modern",
    heading: "Bricolage Grotesque",
    headingGoogleName: "Bricolage Grotesque",
    body: "Public Sans",
    bodyGoogleName: "Public Sans",
    headingWeight: 700,
    headingLetterSpacing: "-0.02em",
    character: "Personality, character, nostalgic-modern",
    bestFor: ["cafe", "brewery", "vintage", "lifestyle", "blog", "zine"],
  },
  {
    id: "brutalist",
    heading: "Darker Grotesque",
    headingGoogleName: "Darker Grotesque",
    body: "Darker Grotesque",
    bodyGoogleName: "Darker Grotesque",
    headingWeight: 900,
    headingLetterSpacing: "-0.04em",
    character: "Raw, direct, anti-design",
    bestFor: ["art", "gallery", "experimental", "activism", "underground"],
  },
  {
    id: "japanese-minimal",
    heading: "Zen Kaku Gothic New",
    headingGoogleName: "Zen Kaku Gothic New",
    body: "Noto Sans JP",
    bodyGoogleName: "Noto Sans JP",
    headingWeight: 700,
    headingLetterSpacing: "0.02em",
    character: "Clean, precise, Eastern-influenced",
    bestFor: ["japanese", "restaurant", "zen", "meditation", "tea", "minimalist"],
  },
  {
    id: "newspaper",
    heading: "Newsreader",
    headingGoogleName: "Newsreader",
    body: "Source Sans 3",
    bodyGoogleName: "Source Sans 3",
    headingWeight: 600,
    headingLetterSpacing: "-0.01em",
    character: "Authoritative, informational, trustworthy",
    bestFor: ["news", "journalism", "research", "academic", "government", "legal"],
  },
  {
    id: "variable-clean",
    heading: "Inter",
    headingGoogleName: "Inter",
    body: "Inter",
    bodyGoogleName: "Inter",
    headingWeight: 600,
    headingLetterSpacing: "-0.02em",
    character: "Versatile, system-like, neutral",
    bestFor: ["utility", "tool", "internal", "documentation"],
  },
  {
    id: "display-impact",
    heading: "Plus Jakarta Sans",
    headingGoogleName: "Plus Jakarta Sans",
    body: "Plus Jakarta Sans",
    bodyGoogleName: "Plus Jakarta Sans",
    headingWeight: 800,
    headingLetterSpacing: "-0.03em",
    character: "Bold, modern, Indonesian-influenced",
    bestFor: ["mobile-app", "social-media", "marketplace", "e-commerce"],
  },
  {
    id: "humanist-warmth",
    heading: "Figtree",
    headingGoogleName: "Figtree",
    body: "Atkinson Hyperlegible",
    bodyGoogleName: "Atkinson Hyperlegible",
    headingWeight: 700,
    headingLetterSpacing: "-0.01em",
    character: "Accessible, human, caring",
    bestFor: ["accessibility", "healthcare", "nonprofit", "senior", "education", "therapy"],
  },
  {
    id: "digital-craft",
    heading: "Geist",
    headingGoogleName: "Inter", // Geist is Vercel-hosted; Inter is the closest GF alternative
    body: "Geist Mono",
    bodyGoogleName: "JetBrains Mono", // Geist Mono not on GF
    headingWeight: 600,
    headingLetterSpacing: "-0.03em",
    character: "Vercel-adjacent, developer-tool aesthetic",
    bestFor: ["developer-tool", "vercel", "nextjs", "infrastructure", "cloud"],
  },
  {
    id: "art-deco",
    heading: "Poiret One",
    headingGoogleName: "Poiret One",
    body: "Questrial",
    bodyGoogleName: "Questrial",
    headingWeight: 400,
    headingLetterSpacing: "0.06em",
    character: "Decorative, vintage, theatrical",
    bestFor: ["event", "theatre", "film", "cocktail", "speakeasy", "gatsby"],
  },
];

// ---------------------------------------------------------------------------
// Font pairing lookup
// ---------------------------------------------------------------------------

const PAIRING_MAP = new Map(FONT_PAIRINGS.map((p) => [p.id, p]));

export function getFontPairing(id: string): FontPairing | undefined {
  return PAIRING_MAP.get(id);
}

// ---------------------------------------------------------------------------
// Google Fonts URL builder
// ---------------------------------------------------------------------------

/**
 * Builds a Google Fonts `<link>` href for the given heading and body families.
 * Deduplicates if both are the same family.
 */
export function buildGoogleFontsUrl(
  headingFamily: string,
  bodyFamily: string,
  weights: number[] = [400, 500, 600, 700, 800]
): string {
  // Resolve to Google Fonts names via the library
  const headingPairing = FONT_PAIRINGS.find(
    (p) => p.heading === headingFamily || p.headingGoogleName === headingFamily
  );
  const bodyPairing = FONT_PAIRINGS.find(
    (p) => p.body === bodyFamily || p.bodyGoogleName === bodyFamily
  );

  const headingGF = headingPairing?.headingGoogleName ?? headingFamily;
  const bodyGF = bodyPairing?.bodyGoogleName ?? bodyFamily;

  const weightStr = weights.join(";");
  const families: string[] = [];

  const encode = (family: string) => family.replace(/ /g, "+");

  families.push(`family=${encode(headingGF)}:wght@${weightStr}`);

  // Only add body if it's a different family
  if (bodyGF !== headingGF) {
    families.push(`family=${encode(bodyGF)}:wght@${weightStr}`);
  }

  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

/**
 * Returns a ready-to-use `<link>` tag string for embedding in rendered HTML.
 */
export function buildGoogleFontsLink(
  headingFamily: string,
  bodyFamily: string
): string {
  const href = buildGoogleFontsUrl(headingFamily, bodyFamily);
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${href}" rel="stylesheet">`;
}

/**
 * Returns a CSS font-family string with fallbacks for a given family name.
 */
export function fontFamilyCSS(family: string): string {
  // Detect if it's a serif, mono, or sans-serif font for fallback
  const serifFamilies = [
    "Playfair Display", "Source Serif 4", "Cormorant Garamond",
    "Newsreader", "Italiana", "Poiret One",
  ];
  const monoFamilies = [
    "JetBrains Mono", "IBM Plex Mono", "Geist Mono",
  ];

  if (monoFamilies.some((f) => family.includes(f))) {
    return `'${family}', 'Menlo', monospace`;
  }
  if (serifFamilies.some((f) => family.includes(f))) {
    return `'${family}', 'Georgia', serif`;
  }
  return `'${family}', system-ui, sans-serif`;
}
