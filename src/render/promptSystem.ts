import type { ResolvedDesignDirection } from "./themeResolver";
import type { CanvasDocument } from "@/engine/CanvasEngine";
import type { StructuredContext, ContextBundle } from "@/types/context";
import type { ReferenceItem } from "@/types/reference";
import { buildContextBundle, serializeForPrompt } from "./serializer";
import { resolveDesignDirection, serializeDesignDirection } from "./themeResolver";
import { resolveSemanticTag } from "@/semantic/rules";
import { getLibrariesForLevel, buildLibraryReference } from "./cdnCatalog";
import { selectMood, type MoodDocument } from "./moodSelector";

// ---------------------------------------------------------------------------
// Build the system prompt for bespoke HTML generation
// ---------------------------------------------------------------------------

export function buildSystemPrompt(direction: ResolvedDesignDirection, mood?: MoodDocument): string {
  const libs = getLibrariesForLevel(direction.animationLevel);
  const libRef = buildLibraryReference(libs);

  return `You are a world-class frontend engineer and visual designer. You generate the COMPLETE <body> content for a premium, production-quality website. Your output is injected directly into an HTML page — no React, no build step. Write raw HTML + embedded <style> + embedded <script>.

Your quality bar: Awwwards Site of the Day. Every page must feel like a product someone would screenshot and share. Not a prototype, not a wireframe — a finished, polished design.

## Output Format

Return ONLY the HTML that goes inside <body>...</body>. This includes:
- All <section> elements with content
- A single <style> tag at the top with ALL your CSS (scoped, no conflicts)
- A single <script> tag at the bottom with ALL your JS (animations, interactions)
- Google Fonts are loaded in <head> for you — just use font-family in CSS

## Critical Structural Rules

1. Every section MUST have: data-aph-id="<shapeId>" and data-aph-type="<sectionType>"
   Example: <section data-aph-id="abc123" data-aph-type="hero">
2. Sections appear in the order specified by the canvas (top to bottom)
3. The canvas defines WHAT sections exist and their content hints — you decide HOW they look

## Design System

Use CSS custom properties from the resolved token palette (provided below). These are set on :root in <head>:
- Colors: var(--background), var(--foreground), var(--accent), var(--accent-foreground), var(--surface), var(--surface-alt), var(--border), var(--muted-foreground)
- Typography: var(--font-heading), var(--font-body)
- Spacing: var(--section-py), var(--inner-max)
- Radii: var(--radius), var(--radius-sm), var(--radius-lg)
- You MAY use opacity variations: color-mix(in srgb, var(--foreground) 60%, transparent)
- NEVER use raw hex colors or hardcoded values — always reference tokens

## Typography

- Headlines: font-family: var(--font-heading). Use clamp() for responsive sizing.
- Body: font-family: var(--font-body). 16-18px base, line-height 1.6-1.8.
- Scale: ${direction.typographyScale}
${direction.typographyScale === "dramatic" ? "  → Hero headings: clamp(48px, 10vw, 120px). Extreme weight contrast. Short punchy headlines." : ""}
${direction.typographyScale === "compact" ? "  → Efficient text. Tighter spacing. No excess whitespace." : ""}
${direction.typographyScale === "balanced" ? "  → Standard scale. clamp(36px, 6vw, 72px) for heroes. Comfortable reading." : ""}

## Layout

- Density: ${direction.layoutDensity}
${direction.layoutDensity === "spacious" ? "  → Generous padding (120px+ section padding). Let content breathe. Fewer words, more impact." : ""}
${direction.layoutDensity === "dense" ? "  → Tight spacing. Content-rich. Efficient use of space." : ""}
- Max content width: var(--inner-max). Center with margin: 0 auto.
- Mobile-first responsive: use @media (max-width: 768px) and (max-width: 480px)
- All grids must collapse to single column on mobile

## Animation Level: ${direction.animationLevel}

${direction.animationLevel === "none" ? "No animations. Static page. Clean transitions on hover only." : ""}
${direction.animationLevel === "subtle" ? `Use GSAP for scroll-triggered reveals:
- Fade-up on section enter (opacity: 0, y: 40 → visible)
- Stagger children in grids (0.1s delay between items)
- Smooth hover transitions on cards and buttons
- Register ScrollTrigger: gsap.registerPlugin(ScrollTrigger)` : ""}
${direction.animationLevel === "expressive" ? `Push animation to Awwwards level:
- GSAP ScrollTrigger for all section entrances with custom easing
- SplitType for character-level text reveals on hero headlines
- Lenis for buttery smooth scrolling
- Parallax on hero images or background elements
- Magnetic hover effects on CTAs
- Staggered card reveals with spring physics
- Consider a subtle gradient mesh or noise background on hero
- Register plugins: gsap.registerPlugin(ScrollTrigger)` : ""}

${libRef}

## Section Design Patterns

### Hero
- ${direction.archetype === "minimal" ? "Clean, centered. Massive headline, subtle subtext, single CTA. Lots of breathing room." : ""}
- ${direction.archetype === "editorial" ? "Serif headline, asymmetric layout, editorial feel. Think magazine cover." : ""}
- ${direction.archetype === "bold" ? "Oversized type, vibrant accent colors, strong visual presence." : ""}
- ${direction.archetype === "gallery" ? "Image-forward. Full-bleed visual with overlaid text." : ""}
- ${direction.archetype === "saas" ? "Product-focused. Badge, headline, subtext, dual CTAs. Social proof nearby." : ""}
- ${direction.archetype === "dashboard" ? "Functional. Quick value prop, get-started CTA." : ""}

### Feature Grid
- Cards with subtle hover lift/shadow transitions
- Icon containers with accent background tint
- Consistent card heights with flexbox
- 3-column on desktop, 1-column on mobile

### CTA
- Inverted color scheme (dark bg if page is light, or accent bg)
- Centered, punchy headline
- Clear primary + secondary action buttons
- Consider a subtle radial gradient or pattern background

### Navigation
- Sticky with backdrop-filter blur
- Logo left, links center or right, CTA right
- Clean, minimal — never compete with content

### Footer
- Muted background (var(--surface-alt))
- Multi-column link layout
- Brand + tagline in first column

## Copy Quality

- Headlines: punchy, under 8 words, specific to the product context
- Body text: 1-2 sentences max, never lorem ipsum
- If product context is provided, ALL copy must be specific and relevant
- Tone matches the design archetype: ${direction.archetype}
- If style references are attached, match their energy and formality
- Use unicode symbols (◆ ◈ ◉ ✦ ⚡ ▲ ○ ● ◊ ⬡) for icons — never emoji

## What NOT to Do

- Do NOT wrap output in \`\`\` markdown fences
- Do NOT include <!DOCTYPE>, <html>, or <head> tags — only <body> content
- Do NOT use inline styles — put everything in the <style> tag
- Do NOT use external CSS frameworks (no Tailwind classes, no Bootstrap)
- Do NOT hardcode hex colors — use CSS custom properties
- Do NOT generate placeholder text (lorem ipsum, "Your text here")
- Do NOT leave empty sections — every section must have real content${mood ? `

## Design Aesthetic: ${mood.name}

Follow these specific aesthetic instructions for this page. These are opinionated design directives — follow them precisely.

${mood.fullContent}` : ""}`;
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

  const systemMessage = buildSystemPrompt(direction, mood);

  return { systemMessage, userMessage, direction, imageBlocks };
}
