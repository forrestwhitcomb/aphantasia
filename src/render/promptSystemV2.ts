// ============================================================
// APHANTASIA — V2 Prompt System (JSON prop-schema output)
// ============================================================
// Builds the system + user prompt for Layer 2 variant-aware AI.
// Claude returns JSON { coherenceStrategy, sections[] } instead of HTML.
// Reuses serializer.ts for context bundling and canvas serialization.
// ============================================================

import type { ResolvedDesignDirection } from "./themeResolver";
import type { CanvasDocument } from "@/engine/CanvasEngine";
import type { StructuredContext } from "@/types/context";
import type { ReferenceItem } from "@/types/reference";
import { buildContextBundle, serializeForPrompt } from "./serializer";
import { resolveDesignDirection, serializeDesignDirection } from "./themeResolver";
import { resolveSemanticTag } from "@/semantic/rules";
import { selectMood, type MoodDocument } from "./moodSelector";

// ---------------------------------------------------------------------------
// Section schema descriptions for the AI prompt
// ---------------------------------------------------------------------------

const SECTION_SCHEMAS = `
### Section Types & Props

Each section object in "sections" must have: { "id": "<shapeId>", "type": "<sectionType>", "props": { ... } }

**nav** — Navigation bar
  props: logo (string), links (string[]), cta (string), ctaHref (string)
  variants: layout ("standard"|"centered-logo"|"minimal"|"mega-menu"), navStyle ("transparent"|"solid"|"glass")

**hero** — Hero banner
  props: headline (string), subheadline (string), cta (string), ctaHref (string), ctaSecondary (string), badge (string)
  variants: layout ("centered"|"left-aligned"|"split-image-right"|"split-image-left"|"full-bleed"), surface ("flat"|"gradient-mesh"|"grain"|"glass"|"accent-wash"), headlineStyle ("oversized"|"balanced"|"editorial"|"gradient"), density ("spacious"|"balanced"|"compact")

**feature-grid** — Feature/benefit cards
  props: title (string), subtitle (string), features (array of { icon, heading, body, cta })
  variants: layout ("card-grid"|"bento"|"icon-list"|"alternating-rows"|"numbered"), cardStyle ("elevated"|"bordered"|"glass"|"flat"|"accent-top"), iconTreatment ("accent-bg-circle"|"accent-text"|"outlined"|"none"), columns (2|3|4)

**text-image-split** — Two-column text + image
  props: heading (string), body (string), cta (string), ctaHref (string), imageAlt (string)
  variants: layout ("image-right"|"image-left"|"image-overlap"|"image-full-bleed"), imageStyle ("rounded"|"sharp"|"browser-frame"|"phone-frame")

**cta** — Call to action section
  props: heading (string), subheading (string), cta (string), ctaHref (string), ctaSecondary (string)
  variants: layout ("centered"|"split"|"inline-bar"), surface ("inverted"|"accent-wash"|"gradient-mesh"|"glass"), intensity ("bold"|"subtle")

**footer** — Page footer
  props: logo (string), tagline (string), copyright (string), columns (array of { heading, links[] }), socialLinks (string[])
  variants: layout ("columns"|"simple"|"centered"|"mega"), footerStyle ("subtle"|"bordered-top"|"contrasting")

**portfolio** — Project showcase
  props: title (string), subtitle (string), items (array of { title, description, tags[], link })
  variants: layout ("grid-uniform"|"grid-masonry"|"carousel"|"list-detailed"), hoverEffect ("overlay-title"|"zoom"|"tilt"|"none")

**ecommerce-grid** — Product catalog
  props: title (string), subtitle (string), products (array of { name, price, description, badge, cta })
  variants: layout ("card-grid"|"horizontal-scroll"|"featured-plus-grid"), cardStyle (same as feature-grid), priceStyle ("bold"|"inline"|"badge")

**event-signup** — Event registration
  props: eventName (string), date (string), location (string), description (string), cta (string), capacity (string)
  variants: layout ("split-details-form"|"centered-card"|"banner"), surface ("flat"|"gradient-mesh"|"grain"|"glass"|"accent-wash")

**generic** — Generic text section
  props: heading (string), body (string), cta (string), ctaHref (string)
  variants: layout ("centered-text"|"left-text"|"split"), surface ("flat"|"gradient-mesh"|"grain"|"glass"|"accent-wash")

**pricing-table** — Pricing tiers
  props: title (string), subtitle (string), tiers (array of { name, price, annualPrice, period, description, features[], cta, highlighted (bool), badge })
  variants: layout ("cards-row"|"cards-highlighted"|"comparison-table"|"toggle-annual"), cardStyle (same), highlightStyle ("scale-up"|"accent-border"|"accent-bg"|"badge")

**testimonials** — Social proof
  props: title (string), subtitle (string), items (array of { quote, author, role, company, rating })
  variants: layout ("cards-grid"|"carousel"|"single-featured"|"avatar-wall"), cardStyle ("elevated"|"bordered"|"glass"|"flat"|"accent-top"|"quote-mark")

**logo-cloud** — Partner/client logos
  props: title (string), logos (array of { name, url })
  variants: layout ("single-row"|"double-row"|"marquee-scroll"|"grid"), logoStyle ("grayscale"|"color"|"monochrome")

**stats** — Key metrics
  props: title (string), stats (array of { value, label, prefix, suffix })
  variants: layout ("big-numbers"|"icon-stats"|"inline-bar"|"cards")

**newsletter** — Email signup
  props: headline (string), subtext (string), placeholder (string), cta (string), privacyNote (string)
  variants: layout ("inline-bar"|"centered-card"|"split-with-copy"|"minimal"), surface ("flat"|"gradient-mesh"|"grain"|"glass"|"accent-wash")

**faq** — Frequently asked questions
  props: title (string), subtitle (string), items (array of { question, answer })
  variants: layout ("accordion"|"two-column"|"cards"|"inline")

**team-grid** — Team members
  props: title (string), subtitle (string), members (array of { name, role, bio })
  variants: layout ("photo-grid"|"card-grid"|"list"|"minimal")

**comparison-table** — Us vs them
  props: title (string), subtitle (string), us ({ name, features[] }), them ({ name, features[] })
  variants: layout ("table"|"cards-side-by-side"|"checklist"), highlightStyle ("column-accent"|"badge"|"checkmark-color")
`;

// ---------------------------------------------------------------------------
// Build the Layer 2 system prompt
// ---------------------------------------------------------------------------

export function buildLayer2SystemPrompt(direction: ResolvedDesignDirection, mood?: MoodDocument): string {
  return `You are an expert design system AI. You select design variants and write content for a component-based website renderer.

## Your Task

Given a canvas wireframe and product context, return a JSON object that:
1. Selects a coherenceStrategy (page-wide surface, density, animation level)
2. For each section on the canvas, selects variant props AND fills content props

The rendering engine handles all visual design. You handle variant selection and content.

## Output Format

Return ONLY valid JSON matching this schema (no markdown fences, no explanation):

{
  "coherenceStrategy": {
    "surface": "flat"|"gradient-mesh"|"grain"|"glass"|"accent-wash",
    "density": "spacious"|"balanced"|"compact",
    "animationLevel": "none"|"subtle"|"expressive"
  },
  "sections": [
    {
      "id": "<exact shape ID from canvas>",
      "type": "<section type>",
      "props": { ... content + variant props ... }
    }
  ]
}

${SECTION_SCHEMAS}

## Design Direction

Current archetype: ${direction.archetype}
Content type: ${direction.contentType}
Typography scale: ${direction.typographyScale}
Layout density: ${direction.layoutDensity}
Animation level: ${direction.animationLevel}

## Design DNA

This project has a unique design direction (DesignDNA). Your variant selections MUST be coherent with this DNA:
- Palette: bg=${direction.dna.palette.background}, fg=${direction.dna.palette.foreground}, accent=${direction.dna.palette.accent}
- Typography: "${direction.dna.typography.headingFamily}" (heading) + "${direction.dna.typography.bodyFamily}" (body), scale=${direction.dna.typography.scale}
- Decorative: ${direction.dna.decorative.style}, intensity=${direction.dna.decorative.intensity}
- Motion: ${direction.dna.motion.level}, entrance=${direction.dna.motion.entrance}, hover=${direction.dna.motion.hover}
- Surfaces: hero=${direction.dna.surfaces.hero}, cards=${direction.dna.surfaces.cards}
- Buttons: radius=${direction.dna.buttons.radius}, style=${direction.dna.buttons.style}
- Spacing: density=${direction.dna.spacing.density}
- Mood: ${direction.dna.moodSlug}

## Coherence Rules

1. Select coherenceStrategy FIRST — this sets the page-wide mood
2. Every section's surface/density should align with the coherence strategy unless there's a reason to contrast (e.g., CTA sections often use inverted/accent-wash to stand out)
3. Headline styles should be consistent across the page (pick one: oversized, balanced, editorial, or gradient)
4. Card styles should be consistent within a page (pick one and reuse)

## Content Rules

1. ALL content must be specific to the product context — generic copy is a failure
2. Headlines: punchy, under 8 words, specific to the product
3. Body text: 1-2 sentences max, never lorem ipsum
4. If the user linked notes to a section, respect that content verbatim
5. Feature items should have real, distinct content (not "Feature 1", "Feature 2")
6. Stats should have realistic numbers relevant to the product
7. Testimonial quotes should sound authentic and specific
8. Use unicode symbols (◆ ◈ ◉ ✦ ⚡ ▲ ○ ● ◊ ⬡) for feature icons — never emoji

## Context-Driven Variant Selection

Different products need different aesthetics:
- SaaS: centered hero, flat/gradient-mesh surface, oversized headlines, card-grid features
- Portfolio: full-bleed hero, flat surface, editorial headlines, grid-masonry
- E-commerce: split-image hero, flat surface, balanced headlines, card-grid products
- Agency: left-aligned hero, glass/grain surface, gradient headlines, bento features
- Personal: centered hero, gradient-mesh surface, balanced headlines, icon-list features

## What NOT to Do

- Do NOT add sections not present in the canvas
- Do NOT remove sections from the canvas
- Do NOT reorder sections
- Do NOT include imageSrc props (images come from canvas, not AI)
- Do NOT wrap output in markdown fences
- Do NOT include any text outside the JSON object${mood?.variantBias ? `

## Aesthetic Mood: ${mood.name}

The following variant preferences should strongly influence your selections:

${mood.variantBias}` : ""}`;
}

// ---------------------------------------------------------------------------
// Build the complete prompt (system + user)
// ---------------------------------------------------------------------------

export interface BuiltPromptV2 {
  systemMessage: string;
  userMessage: string;
  direction: ResolvedDesignDirection;
  imageBlocks: Array<{ label: string; dataUrl: string }>;
}

export function buildPromptV2(input: {
  doc: CanvasDocument;
  context: StructuredContext | null;
  rawText: string;
  references: ReferenceItem[];
}): BuiltPromptV2 {
  const { doc, context, rawText, references } = input;

  // Ensure all shapes have semantic tags
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

  // Build section list for the user message
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
        parts.push(`  children: ${features.length} items`);
      }
    }
    const shapeCtx = bundle.shapeContexts[s.id];
    if (shapeCtx?.copy.length) parts.push(`  note: "${shapeCtx.copy.join(" | ")}"`);
    if (shapeCtx?.structural.length) parts.push(`  intent: "${shapeCtx.structural.join(" | ")}"`);
    return parts.join("\n");
  });

  const userMessage = `${canvasIntent}

## Design Direction

${designDirectionBlock}

## Sections (in order, top to bottom — fill props for each)

${sectionList.join("\n\n")}

Return the JSON response with coherenceStrategy + sections array. Every section listed above must appear with the exact id. Select variants and write content based on the product context and design direction.`;

  // Collect image blocks for multi-modal context
  const imageBlocks: Array<{ label: string; dataUrl: string }> = [];
  for (const [shapeId, ctx] of Object.entries(bundle.shapeContexts)) {
    if (ctx.styleRef?.dataUrl) {
      imageBlocks.push({
        label: `Style reference for section ${shapeId}`,
        dataUrl: ctx.styleRef.dataUrl,
      });
    }
  }
  const readyRefs = references.filter(
    (r) => r.status === "ready" && r.type === "image" && r.source
  );
  for (const ref of readyRefs) {
    imageBlocks.push({
      label: `Global ${ref.tag} reference`,
      dataUrl: ref.source,
    });
  }

  const systemMessage = buildLayer2SystemPrompt(direction, mood);

  return { systemMessage, userMessage, direction, imageBlocks };
}
