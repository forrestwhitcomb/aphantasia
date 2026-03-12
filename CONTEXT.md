# Aphantasia — Claude Code Context

> This file is read automatically by Claude Code at the start of every session.
> Last updated: Phase 1.5 — Custom canvas engine + splash/landing page complete.

---

## What is Aphantasia?

**Aphantasia** is a sketch-to-ship product builder. A freeform spatial canvas where simple shapes and text become real, deployable artifacts — websites, slide decks, and more.

Named after the condition of being unable to visualize mental images. The irony is intentional: a tool that turns abstract, unvisualizable thinking into polished, shippable output.

**North star copy:** *"Simple shapes and text become big ideas."*

---

## Origin: BozoBox

BozoBox (`https://bozobox.vercel.app`) is the existing prototype Aphantasia builds on. It proved:
- A dual-pane canvas (draw left, live render right) is immediately legible and delightful
- Primitive shapes can be translated into real UI components in real time using a prebuilt design system
- The shape → rendered component pipeline is the core technical foundation

---

## The Problem

| Tool | Strength | Gap |
|---|---|---|
| Lovable / v0 | AI-generated UI from prompts | Prompt-only; no spatial thinking; slow build phase |
| Figma | Precise, high-fidelity design | Requires expertise; not shippable code |
| Miro / FigJam | Great freeform whiteboarding | Zero output orientation |

**The gap Aphantasia owns:** the space between messy spatial thinking and a shippable artifact.

---

## Phase 0 — All Decisions Locked

### D0 — Product Name
**Aphantasia.** All repos, domains, and references use this name.

### D1 — Wedge Output
**Websites (landing pages) first. Slides second. Doodles third.**
- v1 ships `WebRenderer` only
- `SlideRenderer` is v1.5, `DoodleRenderer` is v2
- Output type selector (Site / Slides / Doodles) visible in UI from day one
- Canvas data model is output-agnostic — render layer is a pluggable, swappable module

### D2 — Target User (v1)
**Founders and makers who need a real web presence without design or dev skills.**
- Assume zero design vocabulary
- Canvas should suggest semantic labels, not require them
- Copy generation matters as much as layout
- Output must be publish-ready, not just export-ready

### D3 — Render Strategy
**Two-phase hybrid render. Lean towards Phase 2 wherever possible.**
- **Phase 1 (always on, instant):** Canvas state → rules engine → assemble prebuilt components → render. No AI, no latency.
- **Phase 2 (background, async):** Canvas state + context → AI → refines copy, layout, context-aware adjustments → streams into preview.
- The prebuilt component library is a core product asset and competitive moat.
- **Future (not v1):** Users edit directly in the render view. Architecture must not preclude this — render output should be a component tree, not raw unstructured HTML.

### D4 — Canvas Agent
**A persistent AI agent embedded in the canvas as a floating element.**
- Lives on the canvas itself (floating), not in a separate tool panel
- Full read access to: canvas state, global context, all outside-frame notes
- Generates structured content (copy, value propositions, section ideas) from raw user input
- Outputs drop directly onto the canvas as notes or sticky elements
- Example interactions:
  - *"Generate 3 value propositions based on my context"*
  - *"What sections am I missing for a SaaS landing page?"*
  - *"Write a hero headline for this product"*
- **The agent is NOT the render engine.** Agent builds context and content. Render engine turns that into visual output. They share the same context window.

### D5 — Onboarding Philosophy
**Empty canvas by default. No setup phase. No forms. No prompts before you start.**
- No welcome modal, no "tell us about your product" screen
- Canvas IS the onboarding — sketch and things appear
- Agent is available if you want it, never forced
- First-time UX: blank canvas + desktop frame + toolbar + agent icon — nothing more
- North star copy: *"Simple shapes and text become big ideas."*

### Q1 — Shippable Definition
**Full deployment targets. User brings their own accounts.**
- **Web:** Push to user's GitHub repo → deploy via user's Vercel account
- **Slides:** Download as `.pptx` or PDF
- Requires GitHub OAuth + Vercel API integration
- Export system built as pluggable adapters from day one
- **Future:** Aphantasia manages hosting as an upsell tier

### Q2 — Semantic Layer
**Hybrid rules + AI. Canvas is loose and freeform.**
- Rules fire instantly for base interpretation
- AI refines when context is present or labels are ambiguous
- **Two zones:**
  - **Inside the frame** → renders to output
  - **Outside the frame** → scratchpad, context notes, future pages
- Outside-frame elements are never ignored — captured as page candidates, context, or notes
- Canvas data model stores ALL elements regardless of frame position
- **Philosophy: Aphantasia is a thinking tool first, a layout tool second**

### Q3 — Shape-to-Component Vocabulary (Draft — stress-test in Phase 2)

| Shape / Position | Inferred Label | Rendered Component |
|---|---|---|
| Wide rectangle, top of frame | Hero / Header | Full-width hero with headline + CTA |
| Narrow rectangle, top | Nav | Navigation bar with logo + links |
| Grid of equal rectangles | Cards | Card grid (features, pricing, team) |
| Wide rectangle, full width | Section | Content section |
| Pill / small rounded rectangle | Button / CTA | Button component |
| Rectangle with image icon | Image | Image or media block |
| Narrow rectangle, bottom | Footer | Footer with links + copyright |
| Rectangle with lines inside | Text Block | Body copy / rich text section |
| Two-column layout | Split | Two-column feature/content split |
| Form-like stack | Form | Contact or signup form |

### Q4 — Context Model
**Global context in v1. Data model supports per-element from day one.**
- Global context panel: user pastes product description, tone, brand info
- Per-element context UI: v1.5 (data model slot ready in CanvasShape.contextNote)
- Outside-frame canvas notes treated as implicit per-element context

### Q5 — Context Input Types
**Text paste for v1. URL scraping is v1.5. Image upload is v2.**
- Canvas freeform notes (outside frame) are also context inputs
- Canvas Agent generates structured context from raw pasted data

### Q6 — Frame Model
**Desktop browser frame for v1. Responsive output always.**
- Frame is a **preview viewport**, not an output constraint
- Generated HTML/CSS is always responsive under the hood
- Future: breakpoint toggle (desktop / tablet / mobile) — UI change only

---

## Phase 1 — All Decisions Locked

### 1.1 — Canvas Engine: Custom DOM-Based Canvas
**tldraw was replaced with a lightweight custom canvas engine (zero external dependencies).**
- tldraw was too heavy (~162 packages, ProseMirror, yjs, etc.) for what Aphantasia needs
- Previous tldraw implementation saved at commit `6c19758` for reference
- Custom engine at `src/engine/engines/CustomCanvasEngine.tsx` (~850 lines)
- DOM-based: positioned `<div>` elements inside a CSS-transformed "world" div
- Full feature set: pan (trackpad/Space+drag), zoom (pinch/Ctrl+scroll), draw rectangles, select, move, resize (8 handles), inline label editing via `contentEditable`, delete
- Frame selection + resize with edge-only clickable borders (interior is click-through for shape interaction)
- Singleton pattern via `getCustomEngine()` — shared between CanvasView and PreviewPane
- Event bridge: engine `onStateChange` callback triggers React re-render
- Coordinate normalization in `getDocument()`: inside-frame shapes get frame-relative coords for semantic rules
- Frame containment: geometric overlap (>50% of shape area inside frame)

### 1.2 — Canvas Abstraction Layer
**The canvas engine is never called directly in product code (except provider.ts).**

All canvas interactions go through the `CanvasEngine` interface at `src/engine/CanvasEngine.ts` (24 methods).
To swap engines: implement `CanvasEngine`, change one import in `src/engine/engines/provider.ts`. Nothing else changes.
Currently wired to `CustomCanvasEngine`. The `CanvasView` React component is also exported from the provider.

### 1.3 — AI Inference Pipeline
**Debounced on change. Streaming output. Claude Sonnet.**
- AI render triggers automatically after 1.5–2 second debounce when user stops drawing
- Phase 1 (instant, rules-based) always runs first — user never sees a blank preview
- Phase 2 (AI refinement) runs in background, streams output into preview as tokens arrive
- Model: Claude Sonnet — fast enough for streaming, smart enough for layout + copy
- Streaming turns AI latency into a feature — the page builds itself visibly

### 1.4 — Tech Stack

| Concern | Decision |
|---|---|
| Framework | Next.js 16.1.6 (TypeScript, React 19) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss`) |
| Canvas Engine | Custom DOM-based (behind CanvasEngine abstraction) |
| Font | Poppins (via `next/font/google`) for UI, Geist for code |
| AI Provider | Anthropic Claude Sonnet via `@anthropic-ai/sdk` |
| AI Trigger | Debounced on canvas change (1.5–2s) |
| AI Output | Streaming into preview pane |
| Persistence | localStorage for v1 — Supabase in v1.5 |
| Auth | None for v1 — GitHub OAuth for export flow only |
| Deployment | Vercel |
| Export targets | GitHub (OAuth), Vercel (API), HTML zip, PDF, PPTX |

**Tailwind v4 caveat:** Color utilities like `text-white`, `bg-white/10`, and positioning utilities like `bottom-4` do not reliably generate CSS in this project's Tailwind v4 setup. Use **inline styles** for colors and positioning. Tailwind layout utilities (`flex`, `h-screen`, `relative`, etc.) work fine.

---

## Architecture Rules — Claude Code Must Always Follow These

1. **Never import the canvas engine directly** outside of `src/engine/engines/provider.ts` — use `canvasEngine` and `CanvasView` from `@/engine`
2. **Never import a specific renderer directly** — always use `RenderEngine` interface
3. **Never import a specific export adapter directly** — always use `ExportAdapter` interface
4. **All AI calls go through `src/lib/anthropic.ts`** — never instantiate Anthropic client inline
5. **Canvas data model (`CanvasDocument`, `CanvasShape`) is the single source of truth**
6. **All canvas interactions go through `src/engine/CanvasEngine.ts` interface** — never call engine internals directly
7. **All canvas elements are stored** — nothing discarded based on frame position
8. **Use inline styles for colors and positioning** — Tailwind v4 color/positioning utilities are unreliable in this project

---

## Project File Structure

```
aphantasia/
├── .claude/context.md              # This file
├── src/
│   ├── app/                        # Next.js app directory
│   │   ├── page.tsx                # Scrollable page: SplashHero + floating editor panels
│   │   ├── layout.tsx              # Root layout with Poppins + Geist fonts
│   │   ├── globals.css             # Tailwind + gradient keyframes + .splash-gradient
│   │   └── api/                    # render/, agent/, export/
│   ├── engine/                     # Canvas abstraction layer
│   │   ├── CanvasEngine.ts         # THE interface (24 methods, types, events)
│   │   ├── index.ts                # Re-exports canvasEngine + CanvasView from provider
│   │   └── engines/
│   │       ├── CustomCanvasEngine.tsx  # Active engine (~850 lines) + CanvasView component
│   │       └── provider.ts         # One-line engine swap
│   ├── semantic/                   # Shape → component semantic layer
│   │   ├── SemanticResolver.ts
│   │   └── rules.ts               # Rules-based semantic tag resolver (position/size/label)
│   ├── render/                     # Two-phase render pipeline
│   │   ├── RenderEngine.ts
│   │   └── renderers/
│   │       └── WebRenderer.ts      # Phase 1: semantic tags → HTML components
│   ├── components/                 # UI components
│   │   ├── SplashHero.tsx          # Landing splash: branding, tagline, headline
│   │   ├── OutputToggle.tsx        # Site/Slides/Doodles pill toggle (floats in canvas)
│   │   ├── Toolbar.tsx             # Bottom toolbar: tool buttons + Deploy (floats in canvas)
│   │   ├── PreviewPane.tsx         # Live HTML preview in scaled iframe
│   │   └── EditorLayout.tsx        # Two-pane layout (canvas + preview) — not currently used by page.tsx
│   ├── agent/                      # Canvas Agent (future)
│   ├── export/                     # Pluggable export adapters (future)
│   └── lib/
│       ├── anthropic.ts            # Anthropic singleton — use this everywhere
│       └── utils.ts
└── .env.example
```

---

## Current UI Architecture (Phase 1.5)

### Page Structure
The app is a **single scrollable page** with two zones:

1. **Splash zone** (first 100vh): Animated gradient background (warm peach/coral/orange/rose, CSS keyframes on `background-position`). Contains "APHANTASIA" branding, tagline "From small shapes come big ideas", headline "Build something with Aphantasia", and a scroll-hint arrow.

2. **Editor zone** (second 100vh, pulled up 25vh with negative margin so it peeks below the fold): Two **floating panels** with rounded corners and shadows on top of the gradient:
   - **Canvas panel** (flex: 2): Dark `#090909` rounded card containing `CanvasView`, the `OutputToggle` at top-center, and the `Toolbar` at bottom-center
   - **Preview panel** (flex: 1): Dark `#0d0d0d` rounded card containing `PreviewPane` (live HTML preview in scaled iframe)

The gradient background continues behind both panels — visible at edges and corners.

### Key UI Components
- **OutputToggle** (`src/components/OutputToggle.tsx`): Pill-style toggle for Site/Slides/Doodles. Floats absolute top-center of canvas panel. Calls `getCustomEngine().setOutputType()`.
- **Toolbar** (`src/components/Toolbar.tsx`): Dark glass-effect pill floating absolute bottom-center of canvas panel. Contains 5 tool buttons (cursor, rectangle, rounded-rect, text, AI sparkle) + separator + Deploy button. Tool switching UI works (active highlight) but tool-switching logic not yet wired to canvas — canvas always draws rectangles.
- **SplashHero** (`src/components/SplashHero.tsx`): Just text content, no background (parent provides gradient).
- **PreviewPane** (`src/components/PreviewPane.tsx`): Listens to `canvas:changed` events, runs `resolveSemantics()` + `WebRenderer.renderPhase1()`, sets iframe `srcDoc`. 200ms debounce.

### Render Pipeline (working end-to-end)
```
Canvas shapes → getDocument() (normalize coords) → resolveSemantics() (rules.ts) → WebRenderer.renderPhase1() → HTML string → PreviewPane iframe
```
- Shapes inside frame get semantic tags based on position/size/label (nav, hero, section, cards, footer, etc.)
- Phase 1 is instant, rules-based, no AI
- Phase 2 (AI refinement) is architectured but not yet implemented

### Canvas Engine Interaction
- **Pan**: Two-finger trackpad scroll or Space+drag
- **Zoom**: Pinch (Ctrl/Cmd+scroll)
- **Draw**: Click+drag on empty space creates rectangle
- **Select**: Click shape, click empty to deselect
- **Move**: Drag selected shape
- **Resize**: Drag handles (8: corners + edges), also works on frame
- **Label**: Double-click shape → contentEditable overlay
- **Delete**: Delete/Backspace key
- **Frame**: Edge-only clickable (interior is click-through), resizable

### What's Not Yet Implemented
- Tool switching (toolbar buttons are visual-only, canvas always draws rectangles)
- Phase 2 AI render (streaming refinement)
- Canvas Agent (AI floating on canvas)
- Export/Deploy pipeline
- Persistence (save/load)
- Slides and Doodles renderers

---

## Future Features (Captured, Not Scheduled)

### Style Extraction + Sketch-to-Prototype
Two related use cases targeting CEOs, PMs, and investors who want to communicate product vision to their teams:

**Use Case 1 — Style Extraction + Sketch**
- User drops a screenshot of their existing product onto the canvas
- Aphantasia extracts the design language: colors, typography, spacing, component styles
- User sketches a new feature or page on the canvas
- Render output matches their existing product's visual style — looks like it belongs in their product, not a generic template
- Output is a shareable prototype in the style of their actual product

**Use Case 2 — Vision Translation**
- User drops in their current product screenshot + a reference screenshot (competitor feature, inspiration, napkin sketch)
- Aphantasia uses both as inputs: "make something like this reference, but in the style of my product"
- Bridges the gap between "here's what I want" and "here's what it should look like for us"

**Why this matters:**
- Direct evolution of BozoBox's design system extraction concept — generalised to any product
- Solves a real pain point for non-technical stakeholders who need to communicate vision
- Output is a genuine shareable prototype, not a generic wireframe
- Connects to Q5 context inputs — image upload unlocks this (planned for v2)

---

## Links
- **BozoBox prototype:** https://bozobox.vercel.app
- **BozoBox GitHub:** https://github.com/forrestwhitcomb/bozobox
- **Aphantasia GitHub:** https://github.com/forrestwhitcomb/aphantasia