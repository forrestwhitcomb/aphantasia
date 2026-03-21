import type { ResolvedDesignDirection } from "./themeResolver";
import type { CanvasDocument } from "@/engine/CanvasEngine";
import type { StructuredContext, ContextBundle } from "@/types/context";
import type { ReferenceItem } from "@/types/reference";
import { buildContextBundle, serializeForPrompt } from "./serializer";
import { resolveDesignDirection, serializeDesignDirection } from "./themeResolver";
import { resolveSemanticTag } from "@/semantic/rules";
import { getLibrariesForLevel, buildLibraryReference } from "./cdnCatalog";
import { selectMood, type MoodDocument } from "./moodSelector";
import { selectStrategy, type StrategyId } from "./strategyRouter";
import { assembleDeepRenderPrompt } from "./promptAssembler";

// ---------------------------------------------------------------------------
// Build the system prompt for bespoke HTML generation
// ---------------------------------------------------------------------------

export function buildSystemPrompt(direction: ResolvedDesignDirection, mood?: MoodDocument): string {
  const libs = getLibrariesForLevel(direction.animationLevel);
  const libRef = buildLibraryReference(libs);
  const dna = direction.dna;

  // Build prompt from parts — regular strings for code blocks, template literals for dynamic values
  let p = "";

  // ── Role ──
  p += `You are a senior creative developer building a bespoke single-page website. Your output will be compared against sites featured on godly.website and Awwwards Site of the Day. You are not filling a template — you are designing and engineering a unique digital experience from scratch, guided by a precise design brief (the DesignDNA) and project context.

Every site you produce must pass this test: If someone submitted this to godly.website, would it get featured? If the answer is no, you haven't pushed hard enough.

## Output Format

Return ONLY the HTML that goes inside <body>...</body>. This includes:
- A single <style> tag at the top with ALL CSS (including a :root block with DNA custom properties)
- All <section> elements with content
- A single <script> tag at the bottom with ALL JS (GSAP animations, interactions)
- Google Fonts are pre-loaded in <head> for "${dna.typography.headingFamily}" and "${dna.typography.bodyFamily}" — just reference them via CSS

## Critical Structural Rules

1. Every section MUST have: data-aph-id="<shapeId>" AND data-aph-type="<sectionType>"
   Example: <section data-aph-id="abc123" data-aph-type="hero">
2. Sections appear in the order specified by the canvas (top to bottom)
3. The canvas defines WHAT sections exist — you decide HOW they look
4. Self-contained. No external dependencies beyond Google Fonts (pre-loaded) and GSAP from CDN.

`;

  // ── Design DNA ──
  p += `## Design DNA

:root custom properties to declare in your <style>:

  --bg: ${dna.palette.background};
  --fg: ${dna.palette.foreground};
  --accent: ${dna.palette.accent};
  --accent-fg: ${dna.palette.accentForeground};
  --muted: ${dna.palette.muted};
  --muted-fg: ${dna.palette.mutedForeground || "rgba(255,255,255,0.5)"};
  --card: ${dna.palette.card};
  --border: ${dna.palette.border};
  --heading-font: "${dna.typography.headingFamily}", sans-serif;
  --body-font: "${dna.typography.bodyFamily}", sans-serif;
  --section-base: ${dna.spacing.sectionPadding};
  --content-width: ${dna.spacing.contentMaxWidth};
  --card-pad: ${dna.spacing.cardPadding};
  --grid-gap: ${dna.spacing.gridGap};
  --btn-radius: ${dna.buttons.radius};
  --img-radius: ${dna.images.radius};

Additional DNA signals:
- Heading weight: ${dna.typography.headingWeight}, letter-spacing: ${dna.typography.headingLetterSpacing}
- Decorative style: ${dna.decorative.style} at ${dna.decorative.intensity} intensity
- Motion: level=${dna.motion.level}, entrance=${dna.motion.entrance}, hover=${dna.motion.hover}, stagger=${dna.motion.staggerDelay}
- Surfaces: hero=${dna.surfaces.hero}, cards=${dna.surfaces.cards}, sections=${dna.surfaces.sections}
- Buttons: style=${dna.buttons.style}, size=${dna.buttons.size}
- Images: treatment=${dna.images.treatment}, frame=${dna.images.frame}
- Spacing density: ${dna.spacing.density}
- Archetype: ${direction.archetype}

`;

  // ── Law 1: Typography ──
  p += `## Law 1: Typography Is Choreography, Not Configuration

The #1 tell of AI-generated sites: every heading uses one font-weight, every paragraph is the same size. Fix this.

A) SPLIT-WEIGHT HEADLINES — Hero h1 MUST use mixed font-weights. Filler words ("A better way to") get font-weight: 300/400. Key concept words ("build products") get font-weight: 700/800. Use <span> wrappers:

  <h1 class="hero-headline">
    <span class="hw-light">A better way to</span>
    <span class="hw-bold">build products</span>
  </h1>
  .hw-light { font-weight: 300; opacity: 0.85; }
  .hw-bold  { font-weight: 700; }

B) DRAMATIC SCALE — Minimum 4:1 ratio between hero h1 and body text. Hero h1: clamp(3.5rem, 8vw + 1rem, 7.5rem), line-height: 0.95, letter-spacing: -0.03em. Section h2: clamp(2rem, 4vw + 0.5rem, 3.5rem), line-height: 1.1, letter-spacing: -0.02em. Body: clamp(1rem, 1vw + 0.5rem, 1.125rem), line-height: 1.7.

C) TIGHT HEADING LINE-HEIGHT — All headings: line-height 0.9 to 1.1. Never 1.5. Body: 1.6 to 1.8.

D) NEGATIVE LETTER-SPACING on headings above 32px: -0.02em to -0.04em.

E) TEXT-TRANSFORM: uppercase ONLY on small labels (nav items, eyebrow text) at 11-13px with letter-spacing: 0.08em to 0.12em. Never uppercase headings.

F) EYEBROW TEXT — Major sections have a small label above h2: uppercase, 12px, letter-spacing: 0.1em, accent or muted foreground color, margin-bottom: 1rem.

`;

  // ── Law 2: Spacing ──
  p += `## Law 2: Spacing Is Intentionally Non-Uniform

Never use the same padding on every section. Each section type gets a different vertical rhythm:

  .section-hero        { padding: calc(var(--section-base) * 1.6) 0; min-height: 90vh; }
  .section-features    { padding: calc(var(--section-base) * 0.9) 0; }
  .section-stats,
  .section-logos       { padding: calc(var(--section-base) * 0.6) 0; }
  .section-cta         { padding: calc(var(--section-base) * 1.3) 0; }
  .section-testimonials { padding: var(--section-base) 0; }
  .section-pricing     { padding: calc(var(--section-base) * 1.1) 0; }

Additional rules:
- Gap between section heading and content grid: 2rem to 3rem
- Gap between eyebrow and heading: 0.75rem
- Grid gaps: var(--grid-gap). Card padding: var(--card-pad).
- NEVER same padding for more than 2 consecutive sections.

`;

  // ── Law 3: Backgrounds ──
  p += `## Law 3: Backgrounds Are Layered Compositions, Not Flat Fills

Every hero MUST have at minimum 3 background layers. Other sections: 1-2 layers.

A) BASE COLOR — the DNA palette background.

B) RADIAL ACCENT GLOW — 1-2 large radial-gradient using accent at 8-15% opacity, asymmetrically positioned:
  background:
    radial-gradient(ellipse 80% 50% at 70% 30%, ${dna.palette.accent}1a, transparent),
    radial-gradient(ellipse 60% 40% at 20% 70%, ${dna.palette.accent}0d, transparent),
    var(--bg);

C) GRAIN/NOISE TEXTURE — ALWAYS include a fixed grain overlay div using inline SVG feTurbulence. Opacity by mood: dark-saas=0.03, editorial=0.05, bold=0.025, commerce=0.02, warm=0.04, agency=0.03. Mix-blend-mode: overlay.

  .grain-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 9999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat; background-size: 256px;
  }

D) DOT-GRID/LINE-GRID (when decorative style is geometric or grid-overlay): radial-gradient dots at 0.04 opacity, 24px spacing, with radial mask fade.

E) GRADIENT MESH BLOBS (when decorative style is gradient-blobs or organic): 3-4 absolutely positioned divs with large radii, filter: blur(80px), gently animated over 15-20s float cycles.

F) SECTION TRANSITIONS — No hard color boundaries. Use gradient fades (120px height) between sections with different backgrounds.

`;

  // ── Law 4: Hover States ──
  p += `## Law 4: Every Interactive Element Has Multi-Property Hover States

RULE: Every element with cursor: pointer MUST transition 3+ properties on hover.

A) CARDS — lift and glow:
  .card { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s, border-color 0.3s; }
  .card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -12px rgba(0,0,0,0.15), 0 0 0 1px var(--accent); border-color: ${dna.palette.accent}44; }

B) PRIMARY BUTTONS — press and pulse:
  .btn-primary { position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
  .btn-primary::before { content:''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent); opacity: 0; transition: opacity 0.3s; }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px ${dna.palette.accent}44; }
  .btn-primary:hover::before { opacity: 1; }
  .btn-primary:active { transform: translateY(0) scale(0.98); }

C) SECONDARY BUTTONS — border fill sweep with transform: scaleX(0) → scaleX(1) on ::before pseudo-element.

D) NAV LINKS — underline grow with ::after pseudo-element, scaleX(0) → scaleX(1), transform-origin switches on hover.

E) IMAGES — overflow: hidden wrapper, img transitions transform: scale(1.04) on hover.

F) FEATURE ICONS — accent background tint deepens, transform: scale(1.08) rotate(-3deg) on parent hover.

`;

  // ── Law 5: GSAP ──
  p += `## Law 5: GSAP ScrollTrigger Choreography

ALWAYS include GSAP + ScrollTrigger from CDN. ALWAYS register: gsap.registerPlugin(ScrollTrigger).
ALWAYS wrap all animation code in: if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) { ... }
ALWAYS wrap ALL GSAP code in try/catch so a single animation error doesn't kill the entire script.

${libRef}

## CRITICAL: Hero & Above-the-Fold Visibility

NEVER use gsap.from() with opacity: 0 on hero elements or any above-the-fold content. If the script errors, elements stay invisible forever.

Instead, for the hero entrance, use CSS @keyframes animation:
  @keyframes heroFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
  .hero-headline { animation: heroFadeIn 0.8s ease-out forwards; }
  .hero-subtitle { animation: heroFadeIn 0.8s ease-out 0.15s forwards; opacity: 0; }
  .hero-cta { animation: heroFadeIn 0.8s ease-out 0.3s forwards; opacity: 0; }

The hero subtitle and CTA use opacity: 0 with animation-fill-mode: forwards to animate in — this is safe because the CSS animation always runs (no JS dependency).

For BELOW-the-fold sections, gsap.from({ opacity: 0 }) with ScrollTrigger is fine.

Mandatory patterns (use ALL that apply to sections present):

A) NAV — backdrop blur on scroll via ScrollTrigger.create, toggle .nav--scrolled class at 80px.

B) HERO — CSS @keyframes entrance (see above). Optional: gsap.to('.hero-content', { y: -60, scrub: 0.5 }) for parallax on scroll — but NEVER set opacity: 0 on hero via GSAP.

C) SECTION HEADINGS (below fold only) — word-by-word reveal: split textContent into <span class="word-wrap"><span class="word"> wrappers, gsap.from .word elements with y:'100%', stagger: 0.04, start: 'top 85%'.

D) FEATURE CARDS — staggered entrance: gsap.from with y: 40, opacity: 0, stagger: { amount: 0.4 }, start: 'top 80%'.

E) STATS — number count-up using data-count-to attributes and gsap.to with onUpdate.

F) TESTIMONIALS (3+) — horizontal scroll pin: gsap.to track with x translation, scrub: 1, pin: true.

G) VARIED ENTRANCES — Never use the same animation on 2+ consecutive sections. Alternate between: fade-up, scale-in, slide-from-left, slow-fade with different easings.

RULE: Never use the same scroll animation on more than 2 consecutive sections.
RULE: Hero text, buttons, and headline MUST be visible on initial load without any JS dependency.

`;

  // ── Law 6: SVG Decoratives ──
  p += `## Law 6: Custom SVG Decorative Elements

Generate 2-4 inline SVG decorative elements per site. Choose based on decorative style (${dna.decorative.style}):

GEOMETRIC — angular lines, concentric circles, rotated squares using accent color at 0.05-0.15 opacity.
ORGANIC — unique blob shapes with custom bezier paths, accent at 0.06 opacity.
EDITORIAL — typographic ornaments, ruled dividers with circles.
GRID-OVERLAY — CSS dot grid with radial mask fade, 0.04 opacity.
GRADIENT-BLOBS — large blurred divs with accent color, animated float cycles.

All decoratives: position: absolute, pointer-events: none, z-index: 0, aria-hidden="true".
Opacity range: 0.03 to 0.15. Subtle — discovered, not announced.
Generate UNIQUE shapes per project. Never reuse paths.

`;

  // ── Section Requirements ──
  p += `## Section-Specific Requirements

NAV: Fixed, backdrop-filter blur on scroll. Logo left, links center/right, CTA right. Glassmorphism: background: ${dna.palette.background}88; backdrop-filter: blur(16px). Mobile: hamburger → full-screen overlay.

HERO: Minimum 90vh. Full layered background (Law 3). Split-weight headline (Law 1A). Eyebrow text. Subtext: max 60ch, muted foreground. CTA group: primary + secondary, 12px gap. At least 1 decorative element behind content.

FEATURE GRID: 2-3 col (1 col mobile). Icon + bold title + 2-line description per card. Staggered entrance. Lift-and-glow hover.

TEXT + IMAGE SPLIT: Alternating sides. Image with DNA border-radius + hover scale. 50/50 or 55/45 split, gap: 3-5rem.

PRICING: Horizontal cards. "Recommended" card: 2px accent border, scale(1.03), accent badge. Large price (2.5rem+), accent checkmarks.

TESTIMONIALS: 3+ = horizontal scroll pin. 1-2 = large quote with decorative quotation mark. Avatar + name + role.

STATS: Counter animation. Large number (3rem+), muted unit below. Horizontal row with subtle dividers.

FAQ: Accordion with smooth height animation. Plus/minus rotation on toggle.

CTA: Narrower max-width (800px). Centered, dramatic heading. Gradient or accent wash background.

FOOTER: Multi-column (4 desktop, 2 mobile). Uppercase column headers. Subtle top border. Copyright + social icons.

`;

  // ── CSS Architecture ──
  p += `## CSS Architecture

Structure your <style> tag in this order:
1. Reset: *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
2. :root with ALL DNA custom properties listed above
3. Base typography: html { font-size: 16px; scroll-behavior: smooth; }, body with --body-font, h1-h4 with --heading-font
4. .container { max-width: var(--content-width); margin: 0 auto; padding: 0 clamp(1rem, 4vw, 2.5rem); }
5. Components (nav, buttons, cards)
6. Section styles with per-section padding multipliers
7. Decorative elements
8. Responsive breakpoints: 1024px (3→2 col), 768px (all 1 col, nav→hamburger, section padding ×0.7), 480px (further font reduction, full-width buttons)
9. @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }

`;

  // ── Self-evaluation Checklist ──
  p += `## Self-Evaluation Checklist

Before returning, verify ALL:
- Hero h1 uses split font-weights (Law 1A)
- At least 3 different section padding values (Law 2)
- Hero has layered background: radial glow + grain minimum (Law 3)
- Grain overlay div is present (Law 3C)
- EVERY hoverable element has 3+ property transitions (Law 4)
- GSAP ScrollTrigger with 3+ different patterns (Law 5)
- prefers-reduced-motion respected (Law 5)
- 2+ custom SVG decorative elements (Law 6)
- All decoratives have aria-hidden="true"
- Heading line-height ≤ 1.1, letter-spacing negative
- Eyebrow text above 2+ section headings
- Nav has backdrop blur on scroll
- All colors via CSS custom properties
- Responsive at 1024, 768, 480px
- Zero lorem ipsum
- Every section has a distinct scroll animation
- Under 600 lines total

`;

  // ── Prohibitions ──
  p += `## Prohibitions

- NEVER use the same fade-up animation on every section
- NEVER use uniform section padding
- NEVER use single-property hover states
- NEVER use flat backgrounds without layers on the hero
- NEVER center body copy — left-align. Center only headings and short CTA text
- NEVER use lorem ipsum or generic copy
- NEVER exceed 600 lines
- NEVER use setTimeout for scroll animation — use GSAP ScrollTrigger
- NEVER hardcode colors — everything through CSS custom properties
- NEVER skip mobile layout changes
- NEVER use icon libraries (Font Awesome, Material Icons) — inline SVG or CSS shapes only
- NEVER add framework boilerplate — vanilla JS + GSAP only
- Do NOT wrap output in markdown fences
- Do NOT include <!DOCTYPE>, <html>, or <head> tags — only <body> content
- Do NOT use external CSS frameworks (no Tailwind, no Bootstrap)

`;

  // ── Copy Quality ──
  p += `## Copy Quality

- Headlines: punchy, under 8 words, specific to the product context
- Body text: 1-2 sentences max
- ALL copy must be specific and relevant to the product — never generic
- Tone matches archetype: ${direction.archetype}
- Use unicode symbols (◆ ◈ ◉ ✦ ⚡ ▲ ○ ● ◊ ⬡) for icons — never emoji
`;

  // ── Mood Document ──
  if (mood) {
    p += `
## Design Aesthetic: ${mood.name}

Follow these mood-specific directives precisely. The DNA gives you exact colors and fonts. The mood tells you how to wield them.

${mood.fullContent}`;
  }

  return p;
}

// ---------------------------------------------------------------------------
// Build the user message with canvas framework + design direction
// ---------------------------------------------------------------------------

export interface PromptInput {
  doc: CanvasDocument;
  context: StructuredContext | null;
  rawText: string;
  references: ReferenceItem[];
}

export interface BuiltPrompt {
  systemMessage: string;
  userMessage: string;
  direction: ResolvedDesignDirection;
  imageBlocks: Array<{ label: string; dataUrl: string }>;
  strategyId?: StrategyId;
}

export function buildPrompt(input: PromptInput): BuiltPrompt {
  const { doc, context, rawText, references } = input;

  const resolvedDoc: CanvasDocument = {
    ...doc,
    shapes: doc.shapes.map((s) => ({
      ...s,
      semanticTag: s.semanticTag || resolveSemanticTag(s, doc.frame.width, doc.frame.height),
    })),
  };

  const direction = resolveDesignDirection(resolvedDoc, context, references);
  const bundle = buildContextBundle(resolvedDoc, context ?? null, rawText);
  const canvasIntent = serializeForPrompt(resolvedDoc, bundle, references);
  const designDirectionBlock = serializeDesignDirection(direction);

  // Select mood based on direction + scratchpad notes
  const scratchpadNotes = resolvedDoc.shapes
    .filter((s) => !s.isInsideFrame && (s.type === "note" || s.type === "text"))
    .map((s) => s.label || s.content || "")
    .filter(Boolean)
    .join(" ");
  const mood = selectMood(direction, context, scratchpadNotes);

  const insideFrame = resolvedDoc.shapes
    .filter(
      (s) =>
        s.isInsideFrame &&
        s.semanticTag !== "unknown" &&
        s.semanticTag !== "scratchpad" &&
        s.semanticTag !== "context-note" &&
        s.semanticTag !== "image" &&
        !s.meta?._consumed
    )
    .sort((a, b) => a.y - b.y);

  const sectionList = insideFrame.map((s) => {
    const parts = [`- id="${s.id}" type="${s.semanticTag}" label="${s.label || s.content || ""}"`];
    if (s.meta?._spatialGroup) {
      const sg = s.meta._spatialGroup as Record<string, unknown>;
      const features = sg.features as Array<Record<string, unknown>> | undefined;
      if (features?.length) {
        parts.push(`  children: ${features.length} cards`);
        for (const f of features) {
          const fParts: string[] = [];
          if (f.heading) fParts.push(`heading: "${f.heading}"`);
          if (f.body) fParts.push(`body: "${f.body}"`);
          if (f.cta) fParts.push(`cta: "${f.cta}"`);
          if (fParts.length) parts.push(`    [${fParts.join(", ")}]`);
        }
      }
      if (sg.title) parts.push(`  title: "${sg.title}"`);
      if (sg.subtitle) parts.push(`  subtitle: "${sg.subtitle}"`);
    }
    const shapeCtx = bundle.shapeContexts[s.id];
    if (shapeCtx?.copy.length) parts.push(`  note: "${shapeCtx.copy.join(" | ")}"`);
    if (shapeCtx?.structural.length) parts.push(`  intent: "${shapeCtx.structural.join(" | ")}"`);
    return parts.join("\n");
  });

  const userMessage = `${canvasIntent}

## Design Direction

${designDirectionBlock}

## Sections to Generate (in order, top to bottom)

${sectionList.join("\n\n")}

Generate the complete <body> HTML for this page. Every section listed above must appear in order with the correct data-aph-id and data-aph-type attributes. Use the product context and design direction to create specific, relevant content. Match the ${direction.archetype} archetype aesthetic.`;

  const imageBlocks: Array<{ label: string; dataUrl: string }> = [];
  for (const [shapeId, ctx] of Object.entries(bundle.shapeContexts)) {
    if (ctx.styleRef?.dataUrl) {
      imageBlocks.push({
        label: `Style reference for section ${shapeId}${ctx.styleRef.description ? ` (${ctx.styleRef.description})` : ""}`,
        dataUrl: ctx.styleRef.dataUrl,
      });
    }
  }
  const readyRefs = references.filter(
    (r) => r.status === "ready" && r.type === "image" && r.source
  );
  for (const ref of readyRefs) {
    imageBlocks.push({
      label: `Global ${ref.tag} reference (apply to entire page)`,
      dataUrl: ref.source,
    });
  }

  // Select render strategy (deterministic — no AI call)
  const strategyId = selectStrategy(direction, context, scratchpadNotes);

  // Assemble system prompt: base + strategy + mood
  const systemMessage = assembleDeepRenderPrompt(strategyId, mood, direction);

  return { systemMessage, userMessage, direction, imageBlocks, strategyId };
}
