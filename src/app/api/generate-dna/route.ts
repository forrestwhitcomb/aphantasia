import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { FONT_PAIRINGS } from "@/dna/fontLibrary";

// ---------------------------------------------------------------------------
// POST /api/generate-dna
// ---------------------------------------------------------------------------
// Generates a unique DesignDNA from a product description + optional canvas
// signals. This is the most important AI call in the product — it must
// produce genuinely unique, beautiful, deployable design directions.
// ---------------------------------------------------------------------------

interface GenerateDNARequest {
  text: string;
  canvasSignals?: {
    shapeCount: number;
    hasHero: boolean;
    hasNav: boolean;
    imageCount: number;
    labels: string[];
    notes: string[];
  };
  seed?: number; // For "Try another" variety
}

export async function POST(req: NextRequest) {
  const body: GenerateDNARequest = await req.json();

  if (!body.text || typeof body.text !== "string" || body.text.trim().length === 0) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const client = getAnthropicClient();

  // Build the font library reference for the AI
  const fontLibraryRef = FONT_PAIRINGS.map(
    (p) =>
      `  - id: "${p.id}" | heading: "${p.heading}" (Google: "${p.headingGoogleName}") | body: "${p.body}" (Google: "${p.bodyGoogleName}") | weight: ${p.headingWeight} | letterSpacing: "${p.headingLetterSpacing}" | character: "${p.character}" | bestFor: [${p.bestFor.join(", ")}]`
  ).join("\n");

  const canvasContext = body.canvasSignals
    ? `\n\nCanvas state: ${body.canvasSignals.shapeCount} shapes drawn. ${body.canvasSignals.hasHero ? "Has hero section." : ""} ${body.canvasSignals.hasNav ? "Has navigation." : ""} ${body.canvasSignals.imageCount} images. Labels: [${body.canvasSignals.labels.join(", ")}]. Notes: [${body.canvasSignals.notes.join(", ")}].`
    : "";

  const seedInstruction = body.seed
    ? `\n\nIMPORTANT: This is a "Try another" request. Generate a COMPLETELY DIFFERENT design direction from what you might have generated before. Use a different accent color family, a different font pairing, a different decorative style. Be bold — surprise the user.`
    : "";

  const systemPrompt = `You are a world-class web designer with 15 years of experience creating award-winning websites featured on Awwwards, godly.website, and siteinspire. You generate unique design directions — never templates, never generic, never boring.

Your task: given a product/project description, generate a complete DesignDNA JSON that would make this product's website look like it was designed by a top agency charging $50,000+.

## RULES FOR PALETTE GENERATION

1. NEVER use generic grays or safe neutrals as accent colors. Every palette must have PERSONALITY.
2. Pull color inspiration from the product's INDUSTRY, AUDIENCE, and EMOTIONAL TONE:
   - Japanese restaurant → deep blacks + warm amber/gold
   - Gen Z fintech → electric neon coral/lime/purple
   - Luxury hotel → muted gold + charcoal + ivory
   - Privacy tool for journalists → dark navy + muted teal + almost-white
   - Children's education → warm cream + playful primary colors
   - Environmental nonprofit → sage green + warm earth + cream
3. Background is usually dark (#0A-#15 range) or light (#F5-#FF range). Match to the product's energy:
   - Tech/SaaS/developer → dark backgrounds
   - Lifestyle/health/food/wedding → light backgrounds
   - Luxury can go either way — dark for dramatic, light for airy
4. Ensure WCAG AA contrast: foreground on background must have 4.5:1+ ratio. accent-foreground on accent must have 4.5:1+ ratio.
5. muted should be a subtle shade of background (slightly lighter if dark bg, slightly darker if light bg).
6. card should be between background and muted — a distinct but harmonious surface.
7. border should be a semi-transparent version of foreground: rgba(fg, 0.06-0.12) for dark bg, rgba(0,0,0, 0.06-0.12) for light bg.

## FONT PAIRING LIBRARY

You MUST select from this library. Do NOT invent font names.

${fontLibraryRef}

Select the pairing whose "character" and "bestFor" best match the product. Use the heading/body names from the pairing (NOT the Google names — those are for loading).

## DECORATIVE STYLE OPTIONS

- "geometric": Angular patterns, SVG shapes, grid lines. Best for: tech, SaaS, data, architecture.
- "organic": Fluid gradients, soft blobs, natural shapes. Best for: wellness, food, environmental, health.
- "minimal": Clean whitespace, subtle dividers only. Best for: luxury, editorial, professional services.
- "editorial": Horizontal rules, typographic ornaments, drop caps. Best for: publishing, journalism, literary.
- "grid-overlay": Subtle dot or line grid behind content. Best for: design agencies, portfolios, developer tools.
- "gradient-blobs": Large soft gradient spheres (Stripe-like). Best for: fintech, modern SaaS, bold consumer apps.

Match decorative style to product personality. A law firm should NOT get gradient-blobs. A Gen Z app should NOT get editorial.

## MOTION OPTIONS

- level: "none" (static sites, serious/formal), "subtle" (most sites — professional with life), "expressive" (bold, playful, creative)
- entrance: "fade-up" (most common, elegant), "fade-in" (minimal), "slide-in" (dynamic), "scale-up" (impactful), "none"
- hover: "lift" (cards rise on hover), "glow" (accent-colored glow), "scale" (subtle scale up), "border-accent" (border highlights), "none"

## SURFACE OPTIONS

- hero: "flat" (clean), "gradient-mesh" (colorful gradient), "grain" (texture overlay), "accent-wash" (subtle accent tint), "radial-glow" (centered light)
- sections: "alternating" (bg alternates light/dark), "uniform" (same bg), "contrasting" (strong bg shifts)
- cards: "elevated" (shadow), "bordered" (outline), "glass" (blur/translucent), "flat" (no decoration), "accent-top" (colored top border)

## BUTTON OPTIONS

- radius: "0px" (sharp/brutalist), "4px" (subtle rounding), "8px" (balanced), "12px" (soft), "9999px" (pill — playful/modern)
- style: "solid" (filled), "outline" (border only), "ghost" (text only), "gradient" (gradient fill)
- size: "compact" (dense UIs), "standard" (most sites), "large" (bold CTAs)

## IMAGE OPTIONS

- radius: "0px" to "24px" — should harmonize with button radius
- treatment: "natural" (as-is), "duotone" (brand-colored), "grayscale" (editorial), "saturated" (vibrant)
- frame: "none", "browser" (browser chrome), "phone" (device frame), "shadow" (drop shadow)

## SPACING OPTIONS

- density: "spacious" (luxury, editorial — lots of breathing room), "balanced" (most sites), "tight" (data-dense, dashboards)
- sectionPadding: CSS clamp value, e.g. "clamp(60px, 8vw, 100px)" for tight to "clamp(100px, 14vw, 160px)" for spacious
- contentMaxWidth: "960px" (narrow/editorial) to "1280px" (wide/dashboard)
- cardPadding: "20px" to "40px"
- gridGap: "16px" to "32px"

## TYPOGRAPHY SCALE

- "dramatic": Large headings, strong hierarchy — for hero-driven, brand-forward sites
- "balanced": Standard hierarchy — for most content sites
- "compact": Tighter scale — for dashboards, data-dense layouts

## MOOD SLUG

Generate a descriptive slug for the overall mood, e.g.: "dark-minimal-saas", "warm-editorial-luxury", "electric-bold-fintech", "zen-organic-wellness"

## OUTPUT FORMAT

Return ONLY a valid JSON object matching this exact structure. No markdown, no explanation, no code fences.

{
  "palette": {
    "background": "#hex",
    "foreground": "#hex",
    "accent": "#hex",
    "accentForeground": "#hex",
    "muted": "#hex",
    "mutedForeground": "#hex",
    "card": "#hex",
    "cardForeground": "#hex",
    "border": "rgba(r,g,b,a)"
  },
  "typography": {
    "headingFamily": "Font Name from library",
    "bodyFamily": "Font Name from library",
    "headingWeight": number,
    "headingLetterSpacing": "string",
    "scale": "dramatic" | "balanced" | "compact"
  },
  "spacing": {
    "density": "spacious" | "balanced" | "tight",
    "sectionPadding": "clamp(...)",
    "contentMaxWidth": "string",
    "cardPadding": "string",
    "gridGap": "string"
  },
  "surfaces": {
    "hero": "flat" | "gradient-mesh" | "grain" | "accent-wash" | "radial-glow",
    "sections": "alternating" | "uniform" | "contrasting",
    "cards": "elevated" | "bordered" | "glass" | "flat" | "accent-top"
  },
  "decorative": {
    "style": "geometric" | "organic" | "minimal" | "editorial" | "grid-overlay" | "gradient-blobs",
    "intensity": "subtle" | "moderate" | "bold"
  },
  "motion": {
    "level": "none" | "subtle" | "expressive",
    "entrance": "fade-up" | "fade-in" | "slide-in" | "scale-up" | "none",
    "hover": "lift" | "glow" | "scale" | "border-accent" | "none",
    "staggerDelay": "string (e.g. 0.08s)",
    "duration": "string (e.g. 0.6s)"
  },
  "buttons": {
    "radius": "string (px value)",
    "style": "solid" | "outline" | "ghost" | "gradient",
    "size": "compact" | "standard" | "large"
  },
  "images": {
    "radius": "string (px value)",
    "treatment": "natural" | "duotone" | "grayscale" | "saturated",
    "frame": "none" | "browser" | "phone" | "shadow"
  },
  "moodSlug": "descriptive-slug"
}`;

  const userMessage = `Generate a unique DesignDNA for this product/project:

${body.text.trim()}${canvasContext}${seedInstruction}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      temperature: body.seed ? 1.0 : 0.9,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response from AI" },
        { status: 500 }
      );
    }

    // Strip markdown code fences if present
    const raw = content.text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");

    const dna = JSON.parse(raw);

    return NextResponse.json({
      dna,
      _tokenUsage: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens,
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[generate-dna] Error:", errorMessage);
    return NextResponse.json(
      { error: "Failed to generate DNA", detail: errorMessage },
      { status: 500 }
    );
  }
}
