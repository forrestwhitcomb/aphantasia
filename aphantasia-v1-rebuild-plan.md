# Aphantasia v1 — Rebuild Plan

> For Claude Code sessions. This is the authoritative build plan.
> Produced 2026-03-18 after full codebase audit.

---

## Diagnosis

Aphantasia has the right architecture and the wrong implementation priorities. The canvas engine works. The abstractions (CanvasEngine interface, RenderEngine, semantic resolver, context pipeline) are correct. What happened is lateral feature sprawl — 54 shadcn primitives, deploy modals, CTA scanners — before the vertical core was solid. (Note: the spatial analyzer and canvas engine are solid and stay as-is.)

Three systems are broken:

**1. The component library is the weakest link.**
The spec calls the prebuilt component library "a core product asset and competitive moat." In practice, each section is a 30–50 line HTML string template that produces a wireframe. HeroSection.ts is 36 lines. This is why Layer 1 looks generic — the components *are* generic. When these are beautiful, Layer 1 alone feels magical.

**2. The bespoke HTML pivot broke the architecture.**
The v1 spec says: "Claude outputs a prop schema JSON object — never raw HTML. Components handle all design decisions." Session 2 replaced this with Claude generating complete `<body>` HTML with embedded CSS and JS. This makes Aphantasia functionally identical to Lovable/v0 — an LLM writing a whole page from a prompt. The prop-schema approach was the correct call, but it needs one critical addition: **variant selection**. Claude must select design variants alongside content to avoid samey output. Fix the library with variant support, return to the architecture.

**3. Context extraction doesn't produce sharp AI input.**
The pipeline is wired (context panel → extraction → StructuredContext → serializer → prompt) but StructuredContext is shallow. The difference between "a SaaS landing page" and "a privacy-focused email client for journalists" should dramatically change the rendered output. Right now it barely changes anything because the context isn't decomposed into signals the renderer can act on.

---

## The Fix: Three Vertical Rebuilds

No rewrite. Keep the canvas engine, the engine abstraction, the semantic resolver, the spatial analyzer, the reference token system, the deploy pipeline. Rebuild three systems in order, each producing a testable end-to-end improvement.

---

## Vertical 1: Component Library + Variant System (7–10 days)

This is the highest-leverage work in the entire project. When these components are beautiful across their variant combinations, Layer 1 alone will make people say "holy shit."

### Freeform sketching is the primary input — not the component browser

The product promise is "sketch freely, Aphantasia figures it out." The component browser is a shortcut for users who want to skip sketching. But the core path is:

1. User draws a big rectangle at the top of the frame → Aphantasia infers it's a hero
2. User draws 3 equal rectangles inside a larger rectangle → SpatialAnalyzer detects a card grid → Feature Grid section renders
3. User draws a small rectangle at the bottom → inferred as footer
4. User labels a rectangle "Pricing" → label overrides spatial inference → Pricing Table renders

The existing `SpatialAnalyzer.ts` already handles nested containment detection (card grids, sections with headings). The existing `SemanticResolver.ts` already handles position/size-based tagging. **This pipeline must continue to work perfectly with the new components.** Every new section component must be reachable via both:

- **Freeform inference**: spatial position, size, containment patterns, and labels trigger the right section type
- **Component browser**: user picks explicitly from the catalog

The semantic resolver's `SemanticTag` enum needs expansion to cover the 8 new section types (pricing, testimonials, logoCloud, stats, newsletter, faq, team, comparison). Label-based matching should be generous — "pricing", "plans", "tiers" all resolve to pricing; "testimonials", "reviews", "quotes", "what people say" all resolve to testimonials.

### What "beautiful" means

The quality bar is Raycast's marketing site, Superhuman's landing page, Linear's homepage. Not Tailwind UI templates. Not shadcn defaults. These are bespoke, opinionated section designs with:

- Dramatic typography scale (hero h1 at `clamp(52px, 8vw, 96px)`, tight letter-spacing, heavy weight contrast)
- Intentional whitespace (120px+ section padding, breathing room between elements)
- Considered color usage (accent used sparingly, surface variations for depth, muted foregrounds for hierarchy)
- Micro-interactions baked in (hover lift on cards, smooth transitions, subtle scale on buttons)
- Responsive down to mobile with real layout changes (not just squishing)
- Real placeholder content (not lorem ipsum — contextually appropriate defaults)

### Why variants matter

A pure prop-schema approach with fixed layouts would produce samey sites. Every SaaS landing page would look identical to every portfolio. Sites on godly.website feel bespoke because of combinatorial variety across a handful of design dimensions:

- **Layout variant** within a section type (hero centered vs split-image vs full-bleed vs left-aligned)
- **Surface treatment** (gradient mesh, grain texture, glassmorphism, solid, accent wash)
- **Typography personality** (serif heading, oversized sans, tight letter-spacing, gradient text)
- **Card style** (elevated shadow, bordered, glass, flat, accent-top-border)
- **Density** (spacious, balanced, compact)

For Hero alone: 5 layouts × 5 surfaces × 4 headline styles × 3 densities = **300 distinct looks**. Across a full page with 5–7 sections, the combinatorial space is enormous — and every combination is pre-designed and guaranteed to look good.

### Shared Design Treatments (build first)

These are CSS utility classes available to ALL sections. Build these as the foundation before any individual section.

**Surface Treatments (`.aph-surface-`*)**


| Class                       | Visual                                          | CSS approach                                                 |
| --------------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| `aph-surface-flat`          | Solid background color                          | Clean, no effects                                            |
| `aph-surface-gradient-mesh` | Soft multi-color gradient (accent tints)        | radial-gradient with 2–3 color stops, very low opacity       |
| `aph-surface-grain`         | Subtle noise/grain texture overlay              | ::after pseudo with SVG noise filter at 3–5% opacity         |
| `aph-surface-glass`         | Glassmorphism: frosted blur + border            | backdrop-filter: blur(16px), semi-transparent bg, 1px border |
| `aph-surface-accent-wash`   | Full accent color as background (inverted text) | var(--accent) bg, var(--accent-foreground) text              |


**Card Styles (`.aph-card-`*)**


| Class                 | Visual                                                   |
| --------------------- | -------------------------------------------------------- |
| `aph-card-elevated`   | White/surface bg, subtle box-shadow, no border           |
| `aph-card-bordered`   | Transparent bg, 1px border, no shadow                    |
| `aph-card-glass`      | Glassmorphism card: blur, semi-transparent, border       |
| `aph-card-flat`       | Surface bg, no shadow, no border (relies on bg contrast) |
| `aph-card-accent-top` | Flat card + 3px solid accent top border                  |


**Headline Styles (`.aph-headline-`*)**


| Class                    | Visual                                                                  |
| ------------------------ | ----------------------------------------------------------------------- |
| `aph-headline-oversized` | clamp(52px, 10vw, 120px), -0.04em tracking, 800 weight                  |
| `aph-headline-balanced`  | clamp(36px, 6vw, 72px), -0.02em tracking, 700 weight                    |
| `aph-headline-editorial` | serif font (Playfair Display), clamp(40px, 7vw, 84px), 400 weight       |
| `aph-headline-gradient`  | Same as oversized + background-clip text gradient (accent → foreground) |


**Animation Classes (`.aph-anim-`*)**


| Class            | Behaviour                                                   |
| ---------------- | ----------------------------------------------------------- |
| `aph-reveal`     | IntersectionObserver fade-up (opacity 0→1, translateY 30→0) |
| `aph-stagger`    | Same as reveal but children stagger 0.1s each               |
| `aph-hover-lift` | translateY(-4px) + shadow increase on hover                 |
| `aph-hover-glow` | box-shadow accent glow on hover                             |


### Theme Presets

Ship 3 named presets. These aren't just color swaps — they're mood shifts.


| Preset        | Character                                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Midnight**  | Near-black bg, white foreground, electric accent (blue or violet), Inter/Geist fonts, glass-morphism cards, spacious         |
| **Editorial** | Off-white bg, dark foreground, muted accent (terracotta or sage), serif heading font (Playfair Display), generous whitespace |
| **Vivid**     | Dark bg, light foreground, vibrant accent (coral, lime, or amber), bold sans heading font, tighter layout                    |


Reference token extraction should map screenshots to the closest preset, then override specific tokens.

### The 18 Section Components

#### Original 10


| #   | Section                | Layout Variants                                                             | Key Design Moves                                                                                                           |
| --- | ---------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Hero**               | centered · left-aligned · split-image-right · split-image-left · full-bleed | + surface, headlineStyle, density variants. Oversized headline with letter-spacing, badge pill, dual CTA with hover states |
| 2   | **Nav**                | standard · centered-logo · minimal · mega-menu                              | + style: transparent · solid · glass. Sticky, backdrop-blur, mobile hamburger                                              |
| 3   | **Feature Grid**       | card-grid · bento · icon-list · alternating-rows · numbered                 | + cardStyle, iconTreatment (accent-bg-circle · accent-text · outlined · none), columns (2/3/4)                             |
| 4   | **Text + Image Split** | image-right · image-left · image-overlap · image-full-bleed                 | + imageStyle: rounded · sharp · browser-frame · phone-frame                                                                |
| 5   | **CTA Section**        | centered · split · inline-bar                                               | + surface, intensity (bold · subtle). Inverted/accent bg                                                                   |
| 6   | **Footer**             | columns · simple · centered · mega                                          | + style: subtle · bordered-top · contrasting                                                                               |
| 7   | **Portfolio Showcase** | grid-uniform · grid-masonry · carousel · list-detailed                      | + hoverEffect: overlay-title · zoom · tilt · none                                                                          |
| 8   | **E-commerce Grid**    | card-grid · horizontal-scroll · featured-plus-grid                          | + cardStyle, priceStyle: bold · inline · badge                                                                             |
| 9   | **Event Signup**       | split-details-form · centered-card · banner                                 | + surface variants                                                                                                         |
| 10  | **Generic Section**    | centered-text · left-text · split                                           | + surface variants. Fallback for unrecognised shapes                                                                       |


#### 8 New Sections


| #   | Section               | Why                                             | Layout Variants                                                                                                                              |
| --- | --------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 11  | **Pricing Table**     | Critical for SaaS, most common missing section  | cards-row · cards-highlighted · comparison-table · toggle-annual. + cardStyle, highlightStyle (scale-up · accent-border · accent-bg · badge) |
| 12  | **Testimonials**      | Social proof — #1 conversion driver             | cards-grid · carousel · single-featured · avatar-wall. + cardStyle + quote-mark variant                                                      |
| 13  | **Logo Cloud**        | Partner/press logos — appears on most B2B sites | single-row · double-row · marquee-scroll · grid. + style: grayscale · color · monochrome                                                     |
| 14  | **Stats / Metrics**   | "10k+ users" type trust signals                 | big-numbers · icon-stats · inline-bar · cards                                                                                                |
| 15  | **Newsletter Signup** | Email capture                                   | inline-bar · centered-card · split-with-copy · minimal. + surface variants                                                                   |
| 16  | **FAQ / Accordion**   | Reduces bounce, answers objections              | accordion · two-column · cards · inline                                                                                                      |
| 17  | **Team Grid**         | Common on agency/startup sites                  | photo-grid · card-grid · list · minimal                                                                                                      |
| 18  | **Comparison Table**  | "Us vs them" — high-conversion pattern          | table · cards-side-by-side · checklist. + highlightStyle                                                                                     |


### Implementation approach

Each section component is a **self-contained module** that:

1. Takes typed props (content + variant selections)
2. Takes a `ThemeTokens` object for all color/typography/spacing values
3. Renders beautifully with *zero* props (smart defaults)
4. Renders beautifully with *partial* props (graceful degradation)
5. Renders beautifully with *full* props (the Layer 2 enriched state)
6. Uses CSS custom properties for all theme tokens — no hardcoded values
7. Implements all layout variants for its section type
8. Uses shared surface/card/headline CSS classes (not per-component duplication)
9. Exports a `render(props, theme): string` function for the iframe preview

### Build order

**Group 1 — Shared foundations (Day 1)**
Surfaces, card styles, headline styles, animation utilities, theme preset CSS.

**Group 2 — Core page sections (Days 2–4)**
Nav, Hero, Feature Grid, Text+Image Split, CTA, Footer.
These 6 cover the minimum viable landing page. Build 1 default layout per section first, then add remaining variants.

**Group 3 — Conversion sections (Days 5–7)**
Pricing, Testimonials, Logo Cloud, Stats, Newsletter Signup.
These make a site feel complete and conversion-ready.

**Group 4 — Supporting sections (Days 8–9)**
FAQ, Team Grid, Comparison Table, Portfolio, E-commerce, Event Signup, Generic.

**Day 10** — Integration testing, variant combinations, responsive sweep.

### Acceptance criteria for Vertical 1

- Place a single rectangle in the canvas → preview shows a beautiful hero section with smart defaults
- Place 5 rectangles arranged as a typical landing page (no labels, no component browser) → preview looks like a real site without any context or AI
- Draw 3 small rectangles inside a big rectangle → SpatialAnalyzer detects card grid → Feature Grid renders automatically
- Label a rectangle "Pricing" → Pricing Table section renders
- Change theme preset → entire preview updates instantly with a coherent new look
- Every section is responsive (resize the preview pane to verify)
- No hardcoded hex values anywhere in section components
- Layer 1 render time stays under 50ms
- Each section supports at least 3 layout variants that produce visually distinct results
- All 8 new section types (pricing, testimonials, etc.) are reachable via label matching — generous synonyms ("reviews" → testimonials, "plans" → pricing)

---

## Vertical 2: Variant-Aware AI Pipeline (4–5 days)

Return to the original architecture — Claude fills a typed prop schema — with one critical addition: Claude also **selects design variants** from a curated menu. Components implement every combination. The output space is large (hundreds of distinct looks) but every result is pre-designed and guaranteed to look good.

### The Three Render Tiers

**Layer 1 — Instant (0ms, no AI)**

Rules engine reads canvas shapes → resolves semantic tags → selects **default variants** based on layout signals → renders with beautiful placeholder content.

Default variant selection heuristics (no AI needed):

- Wide rectangle at top → Hero, layout: centered, surface: flat
- Small rectangle at top → Nav
- Grid of equal shapes → Feature Grid, layout: card-grid, columns: [count]
- Shape labeled "pricing" → Pricing, layout: cards-highlighted
- Shape at bottom → Footer

Layer 1 already looks good because the components are beautiful at their defaults. But it uses safe, predictable variants.

**Layer 2 — Variant + Content Fill (~3–5s, prop-schema AI)**

Claude receives canvas layout, StructuredContext, reference summary, and theme tokens. Claude returns a JSON object with:

1. A **coherenceStrategy** — page-wide surface, density, and animation level
2. Per-section **variant selections** + **content** filling the prop schema

```json
{
  "coherenceStrategy": {
    "surface": "grain-texture",
    "density": "spacious",
    "animationLevel": "subtle"
  },
  "sections": [
    {
      "id": "shape_abc",
      "type": "hero",
      "props": {
        "headline": "Private email that journalists trust",
        "subheadline": "End-to-end encrypted. Open source. No tracking.",
        "cta": "Start free trial",
        "badge": "Now with PGP support",
        "layout": "left-aligned",
        "surface": "grain-texture",
        "headlineStyle": "editorial-serif",
        "density": "spacious"
      }
    }
  ]
}
```

Layer 2 token usage: ~1500–3000 tokens. That's 2–5 seconds, not 15–20.

**Deep Render — Opt-in (~15–20s, bespoke HTML)**

Keep the existing bespoke pipeline as a premium "Deep Render ✦" action. Claude generates complete custom HTML/CSS/JS with GSAP, custom animations, and truly one-of-a-kind output.

Deep Render uses the **Layer 2 props as its brief** — Claude receives the already-filled prop schema as structured input, not raw canvas data. This means Deep Render benefits from all the context extraction work.

### Why variant-aware beats pure prop-schema AND bespoke HTML


|                    | Bespoke HTML (current) | Pure Prop-Schema      | Variant-Aware (target) |
| ------------------ | ---------------------- | --------------------- | ---------------------- |
| Output variety     | High but unpredictable | Low — samey sites     | High and controlled    |
| Output quality     | Unpredictable          | Consistent            | Consistent + varied    |
| Latency            | 10–20s                 | 2–5s                  | 2–5s                   |
| Token cost         | 16384 max_tokens       | ~2000–4000 tokens     | ~2000–4000 tokens      |
| Iterability        | Full re-generation     | Only changed sections | Only changed sections  |
| Debugging          | Inspect raw HTML       | Inspect JSON props    | Inspect JSON props     |
| Wireframe fidelity | Claude may deviate     | Always respected      | Always respected       |


### Context → Variant Mapping

The same canvas layout with different contexts should produce different variant selections:


| Context               | Hero Layout       | Surface       | Headline        | Feature Layout   |
| --------------------- | ----------------- | ------------- | --------------- | ---------------- |
| SaaS productivity app | centered          | gradient-mesh | oversized       | card-grid        |
| Wedding photographer  | full-bleed        | flat          | editorial-serif | alternating-rows |
| Developer tools       | left-aligned      | flat          | balanced        | icon-list        |
| Fashion brand         | split-image-right | accent-wash   | gradient-text   | bento            |
| Restaurant            | full-bleed        | grain-texture | editorial-serif | icon-list        |


### Prompt Architecture

**System prompt** instructs Claude to:

1. Read context → understand product type, audience, tone
2. Select a coherenceStrategy FIRST (page-wide surface, density, animation)
3. Select per-section variants that match context and maintain cross-section coherence
4. Fill content that's specific to the product — generic copy is a failure
5. Respect linked notes verbatim
6. Output valid JSON matching the RenderResponse schema

**User prompt** provides:

1. Product context (name, type, audience, tone, value prop, features)
2. Visual direction (theme preset, reference mood if screenshot provided)
3. Canvas layout (section types, order, labels, spatial hints, linked notes)
4. Scratchpad notes (unlinked notes as global intent signals)

### PreviewPane Integration

- Layer 1 renders components with default variants → instant
- Layer 2 streams in → each section's variant props + content props merge into the component tree → preview updates progressively
- If user edits canvas after Layer 2: only new/changed shapes revert to Layer 1 defaults, unchanged shapes keep their enriched props
- Store enriched props in a `Map<shapeId, SectionProps>` ref
- Render button triggers Layer 2, "Deep Render ✦" triggers bespoke HTML pipeline

### Build plan for Vertical 2


| Phase                       | Est. | Deliverable                                                                              |
| --------------------------- | ---- | ---------------------------------------------------------------------------------------- |
| Schema + types              | 0.5d | RenderResponse type, CoherenceStrategy, variant enums for all 18 sections                |
| API rewrite                 | 1d   | `/api/render/route.ts` for JSON output, new system prompt, schema validation             |
| PreviewPane integration     | 1.5d | Layer 1 default variants, Layer 2 merge, progressive update, enriched state preservation |
| Deep Render opt-in          | 0.5d | Rename current Render to "Deep Render ✦", Layer 2 becomes default render path            |
| Coherence + variety testing | 0.5d | Test 5+ contexts, verify cross-section coherence, confirm variant variety                |


### Acceptance criteria for Vertical 2

- Same canvas layout + two different contexts → visibly different variant selections and content
- User wireframe is always respected: section types, order, item count, labels
- Linked notes appear verbatim in the rendered section
- Cross-section visual coherence: surface treatment consistent, density consistent
- Layer 2 round-trip under 5 seconds
- Layer 2 token usage under 4000 tokens per render
- Deep Render still available and uses Layer 2 props as input brief
- Adding a new shape after render → new shape shows Layer 1 defaults, existing shapes keep enriched content
- Any new variant added to a component is automatically available to Claude (enum expansion only)
- Preview button visible as soon as Layer 1 has content — opens full-screen in new tab, works without triggering Layer 2
- Preview works with pages containing images (no sessionStorage size limit issues)

---

## Design Mood Documents (Cross-Cutting, built during Verticals 2–3)

Inspired by typeui.sh's design skill files and Anthropic's `frontend-design` SKILL.md pattern: handcrafted markdown documents that give the AI extremely specific, opinionated aesthetic instructions. These replace the generic "make it beautiful" system prompt with targeted design briefs that produce genuinely distinctive output.

### The problem with the current system prompt

`promptSystem.ts` has one generic system prompt with parametric switches:

```
archetype: "minimal"
→ "Clean, centered. Massive headline, subtle subtext, single CTA."
```

That's one sentence describing an entire aesthetic philosophy. Claude fills in the gaps with safe defaults — which is why output looks "AI-generated." typeui.sh solves this by writing 200+ lines of specific instructions per aesthetic. Anthropic's frontend-design skill says things like "NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial)" and "Dominant colors with sharp accents outperform timid, evenly-distributed palettes." That specificity is what makes the output distinctive.

### What a mood document is

A mood document is a markdown file (~150–300 lines) that describes a complete aesthetic philosophy. It covers:

1. **Typography rules** — specific font pairing recommendations (not "use a nice font" but "pair a geometric sans display font like Satoshi or Cabinet Grotesk with a refined body font like General Sans"), sizing philosophy, weight contrast rules, letter-spacing approach
2. **Color strategy** — not just token values but *how* to use color: "accent appears only on CTAs and icon containers, never as section backgrounds", "use color-mix for subtle foreground opacity variations"
3. **Spacing philosophy** — "generous breathing room between sections, tight within cards" vs "content-dense, efficient, no wasted space"
4. **Surface & texture** — "subtle noise grain on hero backgrounds, clean flat surfaces everywhere else" vs "glassmorphism cards with blur, floating above a gradient mesh"
5. **Animation personality** — "minimal: hover transitions only, no scroll reveals" vs "expressive: GSAP scroll triggers on every section, staggered card reveals, parallax hero"
6. **Component conventions** — "cards have no borders, rely on elevation and bg contrast" vs "thin 1px borders on everything, no shadows, flat"
7. **Anti-patterns** — specific things to NEVER do for this aesthetic. "Never use rounded-full buttons", "Never use gradients on text", "Never use more than 2 font weights"
8. **Reference touchstones** — "Think Linear.app meets Raycast. Think Stripe's documentation. Think Notion's marketing site." These help Claude anchor to a real aesthetic memory.

### The library (ship 6 moods for v1)


| Mood                   | Character                                                                           | Touchstones                                          | When selected                                        |
| ---------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| **Dark Minimal SaaS**  | Near-black, electric accent, oversized mono headlines, clean, lots of air           | Linear, Raycast, Vercel                              | contentType: saas + tone: confident                  |
| **Editorial Elegance** | Off-white, serif headlines, generous whitespace, grain texture, photography-forward | Monocle, Cereal magazine, Aesop                      | contentType: portfolio/editorial + tone: calm/formal |
| **Bold Brand**         | Vibrant accent everywhere, oversized sans, tight spacing, high energy               | Notion marketing, Figma, Framer, godly.website picks | contentType: saas + tone: playful/urgent             |
| **Clean Commerce**     | Light bg, product-focused, clear CTAs, trust signals, tight grid                    | Allbirds, Glossier, Apple Store                      | contentType: ecommerce                               |
| **Warm Personal**      | Soft tones, rounded shapes, friendly typography, approachable                       | Personal sites, Substack, Patreon creators           | contentType: personal/nonprofit + tone: casual       |
| **Agency Showcase**    | Dark or high-contrast, dramatic animation, full-bleed imagery, experimental layout  | Award-winning agency sites, godly.website picks      | contentType: agency + tone: confident                |


### How moods flow through the pipeline

```
User context + scratchpad notes + reference screenshots
  ↓
Mood Selector (rules + optional AI classification)
  ↓
Selected mood document (markdown)
  ↓
┌────────────────────────────────┬─────────────────────────────────┐
│ Layer 2 (variant selection)    │ Deep Render (bespoke HTML)      │
│                                │                                 │
│ Mood doc excerpt injected as   │ Full mood doc injected as       │
│ "variant bias" in system       │ system prompt — Claude gets     │
│ prompt — guides which variants │ 200+ lines of specific design   │
│ Claude selects (surface,       │ instructions for this aesthetic  │
│ headline style, card style,    │                                 │
│ density, etc.)                 │                                 │
└────────────────────────────────┴─────────────────────────────────┘
```

### Mood selection logic

**Automatic (rules-based, instant):**

- `contentType: saas` + `tone.energy: confident` → Dark Minimal SaaS
- `contentType: portfolio` → Editorial Elegance
- `contentType: ecommerce` → Clean Commerce
- `contentType: personal` → Warm Personal
- `contentType: agency` → Agency Showcase

**Override from scratchpad notes:**
If unlinked notes mention brand names, override the auto-selection:

- "should feel like Linear" / "Vercel vibes" / "dark mode" → Dark Minimal SaaS
- "editorial" / "magazine" / "Aesop" / "minimal" → Editorial Elegance
- "bold" / "colorful" / "Notion" / "Figma" → Bold Brand
- "agency" / "awwwards" / "experimental" → Agency Showcase

**Override from reference screenshot:**
Vision API extracts mood signals from screenshots. Map to the closest mood document and inject reference-specific overrides (colors, fonts extracted from the screenshot).

### Example mood document (abbreviated)

```markdown
# Dark Minimal SaaS

## Typography
- Heading: geometric sans — Satoshi, Cabinet Grotesk, or General Sans. NEVER Inter.
- Body: same family at lighter weight, or a paired humanist sans.
- Hero headline: clamp(52px, 10vw, 120px). Weight 700-800. Letter-spacing -0.04em.
- Section titles: clamp(28px, 4vw, 48px). Weight 700. -0.03em.
- Body: 16-18px. Weight 400. Line-height 1.7. Color: var(--muted-foreground).
- Never use more than 2 weights on the same page (e.g., 400 + 700).

## Color Strategy
- Background is near-black (#0a0a0f or similar). Never pure black #000.
- Foreground is near-white (#f0f0f0). Never pure white #fff.
- Accent is a single electric color — blue (#3b82f6), violet (#7c3aed), or emerald (#10b981).
- Accent used ONLY on: primary CTA buttons, icon containers, badges, active states.
- Never use accent as a section background (that's for the accent-wash surface).
- Borders: rgba(255,255,255,0.08) — barely visible. Never opaque.
- Cards: rgba(255,255,255,0.04) background with 1px border at rgba(255,255,255,0.08).

## Spacing
- Section padding: 96-120px vertical. Content breathes.
- Inner max-width: 1100px. Never wider.
- Card padding: 32px. Grid gap: 24px.
- Hero has extra top padding (140px+).

## Surface & Texture
- Hero: flat or very subtle gradient mesh (accent at 3% opacity).
- Feature grid: flat, surface-alt background.
- CTA section: accent-wash or inverted.
- No grain textures — that's Editorial, not SaaS.
- Glassmorphism ONLY on nav (backdrop-filter blur) and optional card hover.

## Animation
- Subtle. Scroll-triggered fade-up reveals. 0.6s duration, ease-out.
- Stagger children 0.08s in grids.
- Hover: translateY(-2px) + shadow increase on cards, opacity change on buttons.
- No parallax. No text animation. No magnetic hover. Keep it controlled.

## Anti-Patterns (NEVER do these)
- Never use a light/white background.
- Never use serif fonts.
- Never use round-full (pill) buttons — use slightly rounded (8-12px radius).
- Never use emoji as icons — use unicode symbols or SVG.
- Never use gradient text on body copy (only acceptable on hero headline if subtle).
- Never add decorative borders thicker than 1px.

## Touchstones
Think: Linear.app, Raycast.com, Vercel.com/home. Clean, confident, dark, precise
Not: Dribbble trends, gradient overload
```

### Where to store mood documents

New directory: `src/render/moods/`

- `dark-minimal-saas.md`
- `editorial-elegance.md`
- `bold-brand.md`
- `clean-commerce.md`
- `warm-personal.md`
- `agency-showcase.md`

These are loaded at build time as string constants (imported as raw text). No runtime file reads needed.

### How this changes promptSystem.ts

The `buildSystemPrompt()` function currently constructs one monolithic prompt with parametric switches. Refactor to:

1. Load the selected mood document
2. Inject the full document into the system prompt for Deep Render
3. Inject an excerpt (variant bias section only) into the system prompt for Layer 2
4. Keep the structural rules (data-aph-id markers, output format, CSS variable usage) as a shared base that every mood inherits

```typescript
function buildSystemPrompt(direction: ResolvedDesignDirection, mood: MoodDocument): string {
  const base = STRUCTURAL_RULES;  // data-aph-id, output format, CSS vars
  const moodInstructions = mood.fullContent;  // the entire mood document
  return `${base}\n\n## Design Aesthetic\n\n${moodInstructions}`;
}

function buildLayer2SystemPrompt(direction: ResolvedDesignDirection, mood: MoodDocument): string {
  const base = LAYER2_STRUCTURAL_RULES;  // JSON output, variant selection rules
  const variantBias = mood.variantBiasSection;  // just the variant preferences
  return `${base}\n\n## Variant Selection Bias\n\n${variantBias}`;
}
```

### Build effort

- Writing 6 mood documents: ~1.5 days (this is creative writing + design thinking, not code)
- Mood selector logic: 0.5 day (rules-based mapping from StructuredContext, scratchpad keyword matching)
- Integrating into promptSystem.ts: 0.5 day (refactor to compose base + mood)
- Total: ~2.5 days, parallelizable with Vertical 3 context work

### Acceptance criteria

- Same canvas layout, same context, two different mood selections → visibly different Deep Render output (different typography, different color usage, different spacing)
- Scratchpad note "should feel like Linear" → Dark Minimal SaaS mood auto-selected
- Mood document anti-patterns are respected — Deep Render NEVER produces output violating the "NEVER do" list
- Layer 2 variant selections are biased by the mood — Dark Minimal SaaS mood → flat surfaces, oversized headlines, icon-list features preferred

---

## Vertical 3: Context Pipeline (2–3 days)

Make context extraction produce sharp, actionable signals that change how both Layer 1 and Layer 2 behave.

### The problem with the current extraction

Currently `StructuredContext` has fields like `productName`, `tagline`, `description`, `tone`. These are too generic. Telling Claude "tone: professional" doesn't meaningfully change the output. The extraction needs to produce signals that map directly to rendering decisions.

### Redesigned StructuredContext

```typescript
interface StructuredContext {
  // Identity
  productName: string
  tagline?: string
  description: string

  // Classification
  contentType: 'saas' | 'portfolio' | 'editorial' | 'ecommerce' | 'event' | 'personal' | 'agency' | 'restaurant' | 'nonprofit' | 'general'
  audience: string              // "developers", "enterprise buyers", "parents", etc.

  // Voice
  tone: {
    formality: 'casual' | 'neutral' | 'formal'
    energy: 'calm' | 'confident' | 'urgent' | 'playful'
    personality: string         // 2-3 word descriptor: "bold and direct", "warm and approachable"
  }

  // Content signals
  valueProp?: string            // one-sentence core value proposition
  features?: string[]           // key features/benefits (max 6)
  socialProof?: string          // "10k users", "YC-backed", "featured in TechCrunch"
  pricing?: {
    model: 'free' | 'freemium' | 'paid' | 'enterprise' | 'custom'
    tiers?: string[]
  }
  cta: {
    primary: string             // "Get started", "Book a demo", "View portfolio"
    secondary?: string          // "Learn more", "See pricing"
  }

  // Visual signals
  brandColors?: string[]
  visualDirection?: string      // "minimal", "bold", "editorial", "dark mode", etc.
  references?: string[]         // mentioned competitors or inspirations
}
```

### Implementation

**1. Rewrite the extraction prompt** (`/api/extract/route.ts`)

The extraction prompt should be specific: "Given this product description, extract the following structured fields. Be specific — 'professional' is not a useful tone descriptor; 'confident and direct, like Stripe's marketing copy' is."

**2. Connect StructuredContext to Layer 1 rendering decisions**

Content type should influence Layer 1 defaults:

- `saas` → feature grid defaults to "Speed / Security / Scale" placeholders
- `portfolio` → feature grid becomes project showcase
- `restaurant` → feature grid becomes menu highlights
- `event` → hero default copy includes date/location

Tone should influence default variant selection:

- `casual + playful` → default surface: gradient-mesh, card style: elevated
- `formal + calm` → default surface: flat, headline: editorial-serif, density: spacious
- `confident + urgent` → default surface: accent-wash for CTA, headline: oversized

**3. Connect StructuredContext to Layer 2 variant selection**

The redesigned StructuredContext gives Claude enough signal to select meaningfully different variants. Claude knows the audience, the tone personality, the value prop, and the social proof — enough to pick variants that feel appropriate for the product AND write copy that sounds like the product.

**4. Reference image extraction → preset mapping**

When a user drops a screenshot:

1. Vision API extracts: dominant colors, typography style (serif/sans/mono), layout density, contrast level
2. Map to the closest theme preset (Midnight/Editorial/Vivid)
3. Override specific tokens (accent color, heading font) from the extraction
4. Apply immediately — preview updates in <2s

### Acceptance criteria for Vertical 3

- Paste "Notion-like productivity app for remote teams" into context → extraction produces specific contentType, audience, tone, valueProp, features
- Change context to "Wedding photographer portfolio" → Layer 1 defaults visibly change (different placeholder content, different default variants)
- Drop a screenshot of Linear's site → theme shifts to match (dark bg, accent color, clean typography)
- Layer 2 render with context produces copy that sounds specific to the product, not generic

---

## Build Order and Dependencies

```
Week 1: Vertical 1 — Component Library + Variants
├── Day 1: Shared foundations (surfaces, cards, headlines, animations, presets)
├── Days 2–4: Core page sections (Nav, Hero, Feature Grid, Split, CTA, Footer)
│   Build default layout first per section, then add remaining variants
├── Days 5–7: Conversion sections (Pricing, Testimonials, Logo Cloud, Stats, Newsletter)
├── Days 8–9: Supporting sections (FAQ, Team, Comparison, Portfolio, Ecommerce, Event, Generic)
├── Day 10: Integration testing, variant combinations, responsive sweep

Week 2: Vertical 2 — Variant-Aware AI Pipeline
├── Day 1: Schema + types (RenderResponse, CoherenceStrategy, variant enums)
├── Days 2–3: API rewrite + PreviewPane integration + preview viewer fix
├── Day 4: Deep Render opt-in + coherence testing

Week 3: Design Mood Documents + Vertical 3 — Context Pipeline
├── Days 1–2: Write 6 mood documents (creative writing + design thinking)
├── Day 3: Mood selector logic + promptSystem.ts refactor
├── Days 4–5: StructuredContext redesign + extraction prompt
├── Day 6: Layer 1 context-aware defaults + reference → mood mapping

Week 4: Image Support + Polish
├── Days 1–2: Image pipeline (content images in sections, export with assets to GitHub)
├── Days 3–4: End-to-end testing + canvas persistence + bug fixes
├── Day 5: GitHub OAuth configuration + deploy testing
```

**Total: ~25 focused days.**

---

## Critical Fixes to Include (Not Part of Verticals)

These should be fixed during or immediately after the vertical rebuilds:

### Canvas Persistence (1 day, do during Vertical 1)

Serialize `CanvasDocument` to localStorage on every state change. Restore on mount. This is a dealbreaker for any real usage.

### Tool Switching (0.5 day, do during Vertical 1)

The toolbar buttons are visual-only. Wire them to the canvas engine. Select, rectangle, rounded rect, text, and note tools all need to work.

### GitHub OAuth Configuration (0.5 day, do after Vertical 3)

Register the OAuth app, add credentials. The deploy pipeline code is already written.

---

## What NOT to Build for v1

- ❌ AI canvas suggestions (ghost shapes) — nice-to-have, not core
- ❌ Connection type inference UI (midpoint radial picker) — polish, not core
- ❌ Global broadcast visual indicator (halo) — polish, not core
- ❌ Multi-page support — single page is fine for v1
- ❌ URL scraping as context — text paste + image drop is enough
- ❌ Slides or Doodles renderers — website only
- ❌ React + Vite export scaffold — HTML zip is fine for v1
- ❌ Supabase persistence — localStorage is fine for v1
- ❌ Additional shadcn primitives beyond the 18 sections — the 54 primitives already added are unnecessary baggage

---

## Image Support (Cross-Cutting, ~2 days)

Images are critical for portfolios, product showcases, and real sites. "Asset pipeline" was listed as do-not-build in an earlier draft — that was wrong. Images need to work end-to-end.

### The pipeline

```
User drops image onto canvas → stored as base64 in shape.meta.src
  ↓
Image shape inside frame → rendered as <img> in preview (base64 src)
  ↓
Image linked to a section shape → becomes content image for that section
  (e.g., image linked to a split section → renders in the image slot)
  ↓
Image NOT linked to any shape → spatial inference determines role
  (e.g., image inside a portfolio grid card → card thumbnail)
  ↓
On export → images extracted, pushed to repo as public/assets/[filename]
  → HTML <img> src attributes rewritten from data:... to /assets/[filename]
  → Vercel serves images statically
```

### What already works

- Image shapes exist (`type: "image"`) with base64 in `meta.src`
- Drag-drop onto canvas creates image shapes
- Image context nodes can link to frames/shapes for style reference
- `CanvasAsset` interface is already specced in the context docs

### What needs building

**1. Content images vs context images**

Currently all images on canvas are treated as context references (style extraction). Add a distinction:

- **Context image**: linked to a frame/shape via the connection handle → feeds style context to AI
- **Content image**: placed inside a frame as a regular element → renders as actual content in the section

The distinction is spatial: an image *inside the frame* is content. An image *outside the frame* connected via a line is context. This aligns with the existing "inside frame = renders, outside frame = scratchpad/context" philosophy.

**2. Section components accept imageSrc props**

Several sections already have `imageSrc` fields in their prop types (Hero, Text+Image Split, Portfolio, E-commerce). These need to:

- Render the actual image when `imageSrc` is a base64 data URL (preview mode)
- Render a beautiful gradient placeholder when `imageSrc` is absent
- Accept a relative path `/assets/filename.jpg` for export mode

**3. Export pushes images to GitHub repo**

Extend `/api/export/route.ts`:

- Accept `assets: Array<{ filename: string, base64: string }>` alongside `html`
- Push each asset to `public/assets/[filename]` via GitHub Contents API (separate PUT per file)
- Rewrite `<img src="data:...">` to `<img src="/assets/[filename]">` in the HTML before pushing
- Respect limits: 5MB per file, 25MB per project total. Reject over-limit with a clear error.

**4. Canvas → section image mapping**

When an image shape is inside a frame:

- If it's spatially inside another shape (e.g., inside a card rectangle in a portfolio grid) → it becomes that card's `imageSrc`
- If it's at the top of the frame, wide → it becomes the hero media
- If it's next to a text block → it becomes the split section's image
- SpatialAnalyzer should detect these patterns alongside the existing card-grid detection

### Constraints

- No CDN, no Supabase storage — images live in the GitHub repo for v1
- No image editing (crop, resize) — that's v1.5
- No image generation — users bring their own images
- GitHub Contents API has a ~100MB repo limit and individual file base64 encoding adds ~33% overhead. The 5MB/file, 25MB/project limits keep this safe.

---

## Preview Viewer (0.5 day, do during Vertical 2)

A user must be able to open their rendered site as a standalone page in a new browser tab — full-screen, fully interactive, no iframe sandbox restrictions. This is how users actually evaluate whether their site looks good.

### Current state

The feature exists (`/preview` page + button in PreviewPane) but is fragile. It uses `sessionStorage` to pass HTML between tabs, which has a ~5MB limit and breaks with large base64 images. The button only appears when `srcDoc` is truthy, which may not always fire.

### What to fix during rebuild

1. **Preview button always visible** once any content is in the frame — Layer 1 output is enough, user shouldn't need to trigger Layer 2 first
2. **Replace sessionStorage with a server-side cache** — POST the HTML to a lightweight `/api/preview` endpoint that stores it in memory (or a temp file), returns a token, then the `/preview/[token]` page fetches it. Avoids the 5MB sessionStorage limit entirely. The token can be a simple random ID, no auth needed, auto-expires after 10 minutes.
3. **Preserve the `<a target="_blank">` pattern** — browsers never block anchor-triggered new tabs, unlike `window.open()`
4. **Full-screen, no chrome** — the preview page renders the HTML directly, no Aphantasia UI, no iframe nesting. The user sees exactly what would deploy.
5. **Back-to-editor link** — small floating "← Back to editor" button in the corner of the preview page so users can easily return

---

## Claude Code Session Instructions

When starting a Claude Code session for this rebuild, provide:

1. This plan (as the primary instruction set)
2. `CONTEXT.md` (for architecture rules and file structure)
3. `aphantasia-v1-spec.md` (for data model reference)
4. `aphantasia-component-matrix.md` (for section variant details — during Vertical 1)

Do NOT provide the session context files (sessionContext.md, sessionContext02.md) — they document past decisions that this plan supersedes.

### Per-session scope

Each Claude Code session should target ONE section component or ONE pipeline step. Don't try to do a full vertical in one session. Example session scopes:

- "Build the shared design system foundations: surface treatments, card styles, headline styles, animation utilities, and the 3 theme presets. All as CSS in sharedCSS.ts."
- "Build the Hero section component with all 5 layout variants, using the shared surface and headline CSS classes. Must render beautifully with zero props."
- "Write the Dark Minimal SaaS mood document. 200+ lines covering typography, color strategy, spacing, surface, animation, component conventions, anti-patterns, and touchstones. Store at src/render/moods/dark-minimal-saas.md."
- "Rewrite /api/render to use the variant-aware prop-schema approach. Claude outputs JSON matching the RenderResponse schema with coherenceStrategy + per-section variant selections + content."
- "Add canvas persistence. Serialize CanvasDocument to localStorage on every state change via the engine's onStateChange callback. Restore on mount."

### Quality checks after each session

After each session, verify:

1. Does the preview look beautiful without any AI involvement? (Layer 1 quality check)
2. Does the new code use CSS custom properties exclusively? (No hardcoded values)
3. Is the component responsive? (Resize the preview pane)
4. Does the existing pipeline still work? (Draw shapes → preview updates)
5. Do variant switches produce visibly different results?

---

## Success Criteria for v1 Launch

v1 is ready to share when:

1. **A user can sketch 5 shapes (no labels, no component browser) and see a beautiful site in the preview with zero context and zero AI** — spatial inference figures out what's what, Layer 1 renders it beautifully
2. **Drawing 3 small rectangles inside a large rectangle automatically produces a feature grid** — freeform sketching works, the user never needs to touch the component browser
3. **Adding context and hitting Render produces a site with specific, relevant copy AND appropriate variant selections that match the product** — this is Layer 2 proving its value
4. **The same canvas with different context produces a visibly different-looking site** — different variants, different feel, not just different words
5. **Dropping a screenshot and re-rendering shifts the entire visual style** — this is the reference system proving its value
6. **A user can drop images onto the canvas and they appear in the rendered site** — real content, not just placeholders
7. **A user can open a full-screen preview of their site in a new tab** — fully interactive, no iframe restrictions, works with Layer 1 output (no AI required)
8. **The output HTML is clean enough that a developer could extend it** — no AI slop, no inline styles, proper semantic HTML
9. **Canvas state survives a page refresh** — basic persistence
10. **A user can export to GitHub (with images in the repo) and deploy on Vercel** — the full loop

If those ten things work, ship it.

---

*Aphantasia v1 Rebuild Plan — 2026-03-18*