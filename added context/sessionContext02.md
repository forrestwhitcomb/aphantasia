# Session Context 02 — 2026-03-16/17

> Covers work completed in the second extended session. This document captures every major feature built, architectural decisions made, plans created, current project state, and next steps.

---

## Session Overview

This session executed three major plans and added a standalone preview feature:

1. **Canvas-to-Output Rethink** — Systematic upgrade of the information flow from canvas to rendered output, closing five identified gaps against the SITE_GENERATION.md spec.
2. **Bespoke AI Render Pipeline** — Replaced the JSON-props-to-template Layer 2 pipeline with AI-generated complete HTML, enabling GSAP animations, custom typography, and Awwwards-level output quality.
3. **Per-Shape Tagging + Shadcn Component Library** — Extended the component system with 54 shadcn/ui primitives and per-shape tag controls on the canvas.
4. **Standalone Preview Page** — Added a "Preview" button that opens the rendered site in a new browser tab for full interaction.

---

## 1. Canvas-to-Output Rethink (5 Phases)

### Plan Reference

Plan file: `.cursor/plans/canvas-to-output_rethink_116aa0ad.plan.md`

Identified five gaps between the current implementation and the SITE_GENERATION.md vision:

| Gap | Problem | Solution |
|-----|---------|----------|
| No Design Direction Resolution | AI guessed the visual direction | Theme Resolution Engine classifies archetype before AI call |
| Flat Prompt Structure | Single user message, no system prompt | Structured system + user message with three blocks |
| Missing Canvas Signals | Serializer missed scratchpad, content type, layout archetype | Enhanced serializer with frame hierarchy and scratchpad |
| Wireframe-Quality Templates | Basic HTML, no animations or typography contrast | Elevated section templates with scroll reveals and dramatic typography |
| Props Don't Carry Design Intent | Only content fields, no design hints | Added SectionDesignHints (emphasis, animationHint, imageryDirection) |

### Phase 1: Theme Resolution Engine

**New file:** `src/render/themeResolver.ts`

Analyzes canvas composition + references + context to resolve a `ResolvedDesignDirection` BEFORE any AI call. This is the core of "Aphantasia decides, AI executes."

**Output interface:**
```typescript
interface ResolvedDesignDirection {
  archetype: "minimal" | "editorial" | "bold" | "gallery" | "dashboard" | "saas";
  contentType: "saas" | "portfolio" | "editorial" | "product" | "personal" | "restaurant" | "agency" | "general";
  tokenPalette: ThemeTokens;
  typographyScale: "dramatic" | "balanced" | "compact";
  animationLevel: "none" | "subtle" | "expressive";
  layoutDensity: "spacious" | "balanced" | "dense";
  tokenPaletteCSS: string;
}
```

**Signal analysis includes:**
- Shape count, density, whitespace ratio
- Semantic tag presence (hero, nav, footer, portfolio, etc.)
- Label and note keyword matching against archetype dictionaries
- Reference mood/layout tokens
- Context tone field

### Phase 2: Prompt Architecture Upgrade

Restructured `/api/render/route.ts` with:
- **System message**: World-class engineer persona with non-negotiable design rules, typography scale, animation level, layout density
- **User message**: Three structured blocks — Canvas Intent, Additional Context, Design Direction (with resolved token palette as CSS vars)
- Extended prop schemas with `SectionDesignHints` (emphasis, animationHint, imageryDirection)

### Phase 3: Canvas Serialization Upgrade

Enhanced `src/render/serializer.ts`:
- **Scratchpad extraction**: Collects text from unlinked notes outside the frame (highest-signal user intent)
- **Content type inference**: Classifies as saas/portfolio/editorial/product/etc.
- **Frame hierarchy**: Classifies shapes as primary/secondary/supporting
- **Image role classification**: logo, style-reference, design-reference, hero-imagery, etc.
- **Reference influence summary**: Natural language summary of global reference mood/tone

### Phase 4: Section Template Elevation

Upgraded all section renderers and extracted shared CSS:

**New file:** `src/render/sharedCSS.ts` — Single source of truth for BASE_CSS, ANIMATION_CSS, RESPONSIVE_CSS, SCROLL_REVEAL_SCRIPT. Eliminates duplication between WebRenderer and PreviewPane.

**Template improvements:**
- Dramatic typography scale (hero h1 at `clamp(48px, 8vw, 96px)`)
- Scroll-triggered reveal animations (`.aph-reveal`, `.aph-stagger`, `.aph-hover-lift`)
- Glassmorphism nav (backdrop-filter blur)
- Hero imagery placeholders with gradient mesh backgrounds
- Responsive breakpoints at 768px and 480px
- Card hover lift effects with box-shadow transitions

### Phase 5: Content Signal Enrichment

- Global reference influence passed as natural language in the prompt
- Image role classification provides context about what each image represents
- Scratchpad notes given highest priority in the prompt structure

---

## 2. Bespoke AI Render Pipeline

### Plan Reference

Plan file: `.cursor/plans/bespoke_ai_render_pipeline_6dea081f.plan.md`

This was the most significant architectural change — replacing the JSON-props-to-template approach with AI-generated complete HTML.

### Architecture

```
Canvas (framework: section types, order, content, context)
  ↓
Layer 1 (instant templates — unchanged, fires on every canvas change)
  ↓
[User hits Render]
  ↓
/api/render → Claude Sonnet (16384 max_tokens)
  ↓
AI generates complete <body> HTML with:
  - Embedded <style> with all CSS
  - Embedded <script> with GSAP animations
  - data-aph-id markers on every <section>
  ↓
PreviewPane parses into per-section fragments → bespokeRef
  ↓
[User edits canvas after render]
  ↓
Projection engine: merges bespoke fragments with L1 placeholders for new shapes
  ↓
[User hits Render again → full Layer 2 pass]
```

### New Files Created

| File | Purpose |
|------|---------|
| `src/render/promptSystem.ts` | System prompt builder with design principles, CDN library docs, animation patterns, typography guidance. User message builder using existing serializer + themeResolver. |
| `src/render/cdnCatalog.ts` | Structured CDN library catalog (GSAP, ScrollTrigger, Lenis, Three.js, SplitType) with URLs, usage snippets, and selection logic based on animationLevel. |
| `src/app/preview/page.tsx` | Standalone preview page — reads HTML from sessionStorage and renders full-screen without sandbox restrictions. |

### Key Changes

**`src/app/api/render/route.ts` (complete rewrite):**
- Uses `buildPrompt()` from promptSystem instead of inline prompt
- `max_tokens`: 4096 → 16384
- AI returns complete HTML body (not JSON props)
- SSE emits `{ done: true, html }` instead of `{ done: true, sections }`
- Validates output has `data-aph-id` markers

**`src/components/PreviewPane.tsx` (major rewrite):**
- `bespokeRef`: Map of shape ID → HTML fragment (parsed from AI output)
- `bespokeGlobalsRef`: Extracted `<style>` and `<script>` blocks
- `doLayer2()`: Handles `event.html`, parses fragments, builds bespoke document
- `projectCanvasChanges()`: Merges bespoke fragments with L1 placeholders for new shapes
- `buildBespokeDocument()`: Wraps AI body with `<head>` containing token CSS, CDN scripts, auto-detected Google Fonts
- New `BESPOKE` render phase
- Preview button opens `/preview` in new tab via `<a target="_blank">`

**`src/app/api/export/route.ts` (enhanced):**
- `injectExportMeta()`: Adds `<meta name="generator">`, Open Graph tags, Twitter card meta, `<title>` before pushing to GitHub
- Extracts description from hero section for OG metadata

### CDN Libraries Available to AI

| Library | Animation Level | CDN |
|---------|----------------|-----|
| GSAP core | subtle, expressive | cdnjs |
| ScrollTrigger | subtle, expressive | cdnjs |
| Lenis (smooth scroll) | expressive | unpkg |
| SplitType (text splitting) | expressive | unpkg |
| Three.js (shaders/3D) | expressive | esm.sh |

### Post-Render Canvas Editing (Projection)

When a user edits the canvas after a Layer 2 render:
1. `doLayer1()` fires (debounced 200ms), detects `bespokeRef` has content
2. Calls `projectCanvasChanges()`:
   - For each canvas shape (sorted by y): use bespoke fragment if it exists
   - New shapes: rendered as Layer 1 placeholders with a "New — hit Render to generate" badge
   - Removed shapes: their fragments are simply not included
3. Result is wrapped with `buildBespokeDocument()` using stored design direction

### Framework Decision: Vite for Future Export

**Vite over Next.js** for generated site export:
- Generated sites are static (landing pages, portfolios) — no SSR needed
- Vite builds faster, lighter output
- GSAP/Three.js work natively with client-side Vite
- SITE_GENERATION.md explicitly specifies "React + Vite + TypeScript + Tailwind CSS + shadcn/ui"
- This session ships bespoke HTML directly (v1). React + Vite scaffold is v1.5.

---

## 3. Per-Shape Tagging + Shadcn Component Library

### Per-Shape Tag Control

**New file:** `src/components/ShapeTagDropdown.tsx`

Added a grid-icon button (bottom-right) on rectangle and roundedRect shapes inside the frame. Clicking opens a dropdown (rendered via React Portal) that lets users tag any shape with a specific section type or shadcn component.

**Changes to `src/engine/engines/CustomCanvasEngine.tsx`:**
- Added state for `tagDropdownShapeId` and `tagDropdownAnchor`
- Grid icon button with hover visibility on parent shape
- Portal-based dropdown positioning

### 54 Shadcn/UI Primitives

**New file:** `src/lib/componentCatalogData.ts` — Holds all static catalog data (COMPONENT_CATALOG, PRIMITIVE_CATALOG, ALL_CATALOG_ENTRIES) to avoid circular dependency.

**New file:** `src/components/primitives/index.ts` — 59 `renderPrimitive` functions for all shadcn components, each returning static HTML representations.

**Components added:** Accordion, Alert, AlertDialog, AspectRatio, Avatar, Badge, Breadcrumb, Button, ButtonGroup, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Combobox, Command, ContextMenu, DataTable, DatePicker, Dialog, Drawer, DropdownMenu, EmptyState, Form/Field, HoverCard, Input, InputGroup, InputOTP, Item, Kbd, Label, Menubar, NativeSelect, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Toast, Toggle, ToggleGroup, Tooltip, Typography

**Changes to `src/types/render.ts`:** Added prop interfaces for all 54 new primitives.

**Changes to `src/render/renderSection.ts`:** Extended `shapeToBlock` switch statement to handle all new component IDs.

---

## 4. Standalone Preview Page

**New file:** `src/app/preview/page.tsx`

A dedicated Next.js page at `/preview` that:
- Reads rendered HTML from `sessionStorage`
- Renders it in a full-screen iframe with NO sandbox restrictions
- All scripts, animations, scrolling, and interactions work fully
- Uses `position: fixed; inset: 0` to cover the entire viewport

**Preview button in PreviewPane:**
- `<a>` tag with `href="/preview"` and `target="_blank"` (browsers never block anchor navigation)
- On click, stores current `srcDoc` to `sessionStorage` synchronously
- Appears when there's rendered content and AI isn't streaming

---

## Current Project State

### Phase Status (Updated)

| Phase | Status |
|-------|--------|
| Phase 0 — Architecture | ✅ Complete |
| Phase 1 — Canvas + semantic rules + Layer 1 | ✅ Complete |
| Phase 2 — Context layer + context nodes | ✅ Complete |
| Phase 3 — Component library (shadcn/ui + 54 primitives) | ✅ Complete |
| Phase 4 — Layer 2 AI render (bespoke HTML pipeline) | ✅ Complete |
| Phase 5 — AI canvas suggestions | ❌ Deprioritised |
| Phase 6 — Export (GitHub → Vercel) | ⚠️ Partial (code complete, GitHub OAuth not configured) |
| Canvas-to-Output Rethink | ✅ Complete (5 phases) |
| Bespoke AI Render Pipeline | ✅ Complete (5 phases) |

### Key Architectural Decisions

1. **Bespoke HTML over JSON props**: The AI generates complete HTML with its own CSS and JS, giving it full creative freedom within the canvas framework. This removes the template quality ceiling.

2. **Section markers for projection**: AI output includes `data-aph-id` and `data-aph-type` attributes on every `<section>`, enabling post-render canvas editing by surgically inserting/removing/reordering fragments.

3. **CDN-loaded animation libraries**: GSAP, ScrollTrigger, Lenis, SplitType, Three.js loaded via CDN `<script>` tags in `<head>`. No npm dependencies needed in the generated output.

4. **16384 max_tokens**: Bespoke HTML needs significantly more token budget than JSON props. 16384 supports 5-7 section pages with full CSS and JS.

5. **sessionStorage for preview**: Preview page reads HTML from sessionStorage, avoiding popup blockers and blob URL issues. The `<a target="_blank">` approach guarantees the new tab opens.

6. **Vite for future export**: Static site output doesn't need SSR, so Next.js is overkill. Vite builds faster, outputs lighter bundles, and matches the SITE_GENERATION.md spec.

---

## New Files Created This Session

```
src/render/themeResolver.ts          — Theme Resolution Engine
src/render/sharedCSS.ts              — Shared CSS constants (extracted from WebRenderer + PreviewPane)
src/render/promptSystem.ts           — Bespoke HTML prompt builder
src/render/cdnCatalog.ts             — CDN library catalog
src/semantic/LayoutToSection.ts      — Holistic canvas-to-section inference
src/components/ShapeTagDropdown.tsx   — Per-shape tag dropdown
src/components/primitives/index.ts   — 59 shadcn primitive renderers
src/lib/componentCatalogData.ts      — Static catalog data (breaks circular dep)
src/app/preview/page.tsx             — Standalone preview page
added context/SITE_GENERATION.md     — Design philosophy and generation spec
added context/context-nodes.md       — Context node documentation
added context/sessionContext.md      — Session 1 context
```

## Modified Files This Session

```
src/app/api/render/route.ts          — Complete rewrite: bespoke HTML pipeline
src/app/api/export/route.ts          — OG meta tags, generator meta injection
src/app/api/extract-reference/route.ts — URL analysis + deeper style extraction
src/components/PreviewPane.tsx        — Bespoke render + projection engine + preview button
src/components/ComponentBrowser.tsx   — Updated imports for new catalog data
src/components/sections/*.ts          — All 10 section renderers elevated (animations, typography)
src/engine/engines/CustomCanvasEngine.tsx — Per-shape tag control
src/lib/componentCatalog.ts          — Refactored imports from componentCatalogData
src/lib/theme.ts                     — Extended ThemeTokens, new applyReferenceTokens
src/render/renderSection.ts          — Extended for 54 new primitives
src/render/renderers/WebRenderer.ts  — Uses themeResolver + sharedCSS imports
src/render/serializer.ts             — Scratchpad, content type, frame hierarchy
src/semantic/SemanticResolver.ts     — Integrated LayoutToSection inference
src/types/reference.ts               — Extended ExtractedStyleTokens
src/types/render.ts                  — 54 new primitive prop types + SectionDesignHints
```

---

## Potential Next Steps

### High Priority

1. **Test bespoke render end-to-end** — Create a canvas with sections and context, hit Render, verify GSAP animations and bespoke design quality in the preview tab.

2. **Configure GitHub OAuth** — Register a GitHub OAuth App, add credentials to `.env.local`, test the full deploy flow.

3. **Canvas persistence** — Serialize CanvasDocument to localStorage on change, restore on mount.

### Medium Priority

4. **React + Vite export (v1.5)** — Scaffold a proper React + Vite + Tailwind + shadcn project from the bespoke HTML. Decompose into components.

5. **Streaming progress** — Show partial HTML render in the preview as the AI streams (progressive rendering).

6. **Auto Layer 2 debounce** — Optionally trigger Layer 2 automatically on canvas idle (2-3s debounce) instead of requiring explicit Render button press.

### Lower Priority

7. **Multi-page support** — Multiple frames on canvas, each rendering a separate page.

8. **Asset pipeline** — Image uploads, hosting, proper image references in generated output.

9. **AI semantic refinement** — Use AI for ambiguous shape tagging when rules-based is insufficient.

---

*Last updated: 2026-03-17*
