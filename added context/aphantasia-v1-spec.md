# APHANTASIA — v1 Product Specification

> *Simple shapes and text become big ideas.*

---

## What is v1?

Aphantasia v1 is a sketch-to-render product builder. A user brings context — pasted notes, a product description, a screenshot of their existing product — and a rough canvas sketch. Aphantasia produces a genuinely beautiful, high-fidelity rendered output they can download.

**North star:** A user can give Aphantasia context and a sketch and see something beautiful brought to life — whether that is a new screen for an existing product, or a landing page built from notes and shapes.

| | |
|---|---|
| **Core loop** | Sketch → context → AI render → download |
| **Primary user** | Founders and makers. Zero design or dev skills assumed. |
| **Output format** | Downloadable HTML zip |
| **Theme** | Bold, high-contrast (Raycast / Superhuman quality bar) |
| **AI model** | Claude Sonnet via Anthropic SDK |
| **Deploy** | Not v1. Canvas and render quality come first. |

---

## Principles

**The canvas is a sketchbook, not a template editor**
Users should feel free to explore, experiment, and place shapes without anything being forced on them. Rendering is a deliberate act — not an automatic consequence of drawing. Frames are inert by default. No setup phase. No welcome modal. Blank canvas and go.

**Think first, layout second**
Aphantasia is a thinking tool. Notes, context, and sketched intent matter as much as shape position. The AI reads all of it.

**Instant gratification, then depth**
Layer 1 renders something recognisable the moment a shape exists. Layer 2 makes it meaningful and beautiful. The gap between drawing and seeing something real should feel near-zero.

**Flexibility over control**
Users are not locked into archetypes or templates. Multi-frame canvases support experimentation. Components can be copied freely. Nothing is forced global unless the user chooses.

---

## Canvas

### Tools (Toolbar)

Six tools accessible from the floating bottom toolbar:

| Tool | Behaviour |
|---|---|
| **Select** | Click to select, move, resize shapes and frames |
| **Rectangle** | Click and drag to draw a rectangle |
| **Rounded rect** | Click and drag to draw a rounded rectangle |
| **Text** | Click to place a freestanding text element |
| **Note** | Double-click empty canvas or click toolbar to drop a sticky note |
| **AI Assistant** | Visible in toolbar, grayed out. Tooltipped "Coming soon". |

The **Render button** sits in the toolbar separated from drawing tools. Triggers Layer 2 AI render on the active frame.

### Interactions

| Interaction | How |
|---|---|
| Pan | Two-finger trackpad scroll or Space + drag |
| Zoom | Pinch or Ctrl/Cmd + scroll |
| Draw | Click + drag on empty canvas |
| Select | Click shape. Click empty space to deselect. |
| Move | Drag selected shape |
| Resize | 8 handles: corners + edges |
| Label | Double-click shape → inline contentEditable |
| Delete | Delete or Backspace key |
| Copy / Paste | Cmd+C / Cmd+V. Copies are fully independent. |
| Image drop | Drag image file onto canvas. Treated as visual context. |
| Note link | Drag a note onto a shape to link it |

### Frames

A frame is a viewport boundary — nothing more. It carries no semantic meaning until the user signals intent.

- Frames are inert by default — no globals applied, no render attempted
- Render is triggered explicitly via the Render button
- Only one frame is "active" in the preview pane at a time
- Clicking inside a frame makes it the active frame
- Outside-frame sketching does not affect the preview pane
- Frame borders are edge-only clickable — interior is click-through for shape interaction

### Notes

Notes are the thinking layer. They tell Aphantasia *why* a shape exists, not just what it is.

- Double-click empty canvas to drop a note anywhere
- Also accessible from the toolbar
- Drag a note onto a shape to link it — the note becomes context for that specific shape
- Linked notes are passed to the AI as per-shape context during Layer 2 render
- Notes outside frames are treated as global scratchpad context
- Notes containing intent language ("landing page", "portfolio", "sign-up page") trigger AI canvas suggestions

---

## AI Canvas Suggestions

When a note contains natural language intent rather than descriptive content, Aphantasia triggers a lightweight AI analysis pass. This is a single AI call — not a persistent agent.

> **Example trigger:** *"This is a landing page for my new productivity app"* → AI suggests missing sections as ghost shapes on the canvas.

### How it works

- User drops a note with intent language onto the canvas
- Aphantasia detects the intent signal and fires a single AI call
- AI returns suggested shapes with labels (e.g. "Testimonials", "Pricing")
- Suggestions appear as ghost outlines on the canvas with a subtle visual treatment
- User accepts (click to make real) or dismisses (click ×) each suggestion
- Accepted shapes become standard canvas elements with pre-filled labels

This is the only AI interaction that writes back to the canvas in v1. It is lightweight, triggered, and always user-controlled.

---

## Context Model

Context is how Aphantasia understands what a user is building. It flows through three layers, each narrowing intent.

| Layer | Source |
|---|---|
| **Global context** | Product description, tone, brand info — pasted into the context panel |
| **Frame context** | Notes outside the frame but near it. What is this frame trying to do? |
| **Shape context** | Notes linked directly to a shape. Specific instructions for that element. |

### Context Extraction

When a user provides global context, a single AI extraction pass runs and produces a `StructuredContext` object. This is cached and reused for every render — no AI call per canvas update.

| | |
|---|---|
| **Extracted fields** | productName, tagline, description, tone, pricing, events, products, portfolio, team, colors, fonts |
| **Image context** | Screenshots dropped on canvas are passed as visual context to the AI render pass |
| **Re-extraction** | Only re-runs if the user edits their context input |
| **v1 input types** | Text paste + image drop. URL scraping is v1.5. |

---

## Render Pipeline

### Layer 1 — Instant (0ms)

Rules engine reads canvas shapes and assembles prebuilt React components. Fires the moment a shape exists. No AI, no latency. Always on.

- Shape position and size determine semantic tag (hero, nav, feature grid, etc.)
- Shape label overrides inferred tag if present
- Components render with beautiful placeholder content by default
- Output is always recognisable and well-structured, even with no context

### Layer 2 — AI Refinement (1–3s)

Triggered by the Render button or automatically after a debounce when context is present. Claude receives the Layer 1 output plus all context and fills component props with real, contextual content.

- Claude's output is a structured JSON object: a page of typed section props
- Claude populates content props (headings, body, CTAs, items) from StructuredContext
- Claude populates theme tokens from brand colors or screenshot if provided
- Claude reads per-shape context notes for specific element instructions
- Streams into the preview pane as props resolve
- Claude does not generate HTML — it fills a prop schema. The component handles design.

> **Key principle:** The prebuilt component library is the design moat. Claude populates it. The faster and richer the component library, the less Claude needs to do — and the faster and more beautiful the output.

---

## Component Library

### 10 Section Components

All components are React component trees with typed props. Each is self-contained, takes a `ThemeTokens` object, and renders beautifully with placeholder content when props are partially filled.

| Component | Notes |
|---|---|
| **Nav** | Logo, links, CTA button |
| **Hero** | Badge, heading, subheading, CTA, media |
| **Feature grid** | Heading, 3/6/9 items with icon + body |
| **Text + image split** | Heading, body, CTA, media, imagePosition L/R |
| **CTA section** | Heading, subheading, primary + secondary CTA |
| **Footer** | Logo, links, copyright, social |
| **Portfolio showcase** | Grid of items with media, title, category, meta |
| **E-commerce grid** | Product cards with image, name, price, CTA |
| **Event signup** | Heading, date/location/capacity, signup CTA |
| **Generic section** | Flexible fallback for unrecognised shapes |

### 5 Page Archetypes

Archetypes are compositions of sections. The semantic resolver picks an archetype based on canvas layout. Claude can override if context suggests a better fit.

| Archetype | Composition |
|---|---|
| **SaaS landing** | Nav → Hero → Feature grid → Text+image → CTA → Footer |
| **Portfolio** | Nav → Hero → Portfolio showcase → Text+image → Footer |
| **E-commerce** | Nav → Hero → E-commerce grid → CTA → Footer |
| **Event / waitlist** | Nav → Hero → Event signup → Footer |
| **Generic landing** | Nav → Hero → Feature grid → CTA → Footer |

### Theme

One theme ships with v1: bold, high-contrast. Quality bar is Raycast / Superhuman. Claude adjusts theme tokens based on user context or dropped screenshot.

| Token | Description |
|---|---|
| `background` | Near-black surface |
| `surface` | Slightly lighter card/panel backgrounds |
| `accent` | Primary brand color — AI extracts from context |
| `foreground` | Primary text |
| `muted` | Secondary / supporting text |
| `radius` | none \| sm \| md \| lg \| full |
| `font.heading` | Display font family |
| `font.body` | Body font family |

---

## Data Model

### CanvasDocument

The single source of truth. All elements are stored regardless of frame position.

```typescript
interface CanvasDocument {
  globals: {
    context?: StructuredContext   // extracted once from user input
    theme?: ThemeTokens           // default theme, AI-adjustable
    nav?: NavComponent            // promoted explicitly by user (v1.5)
    footer?: FooterComponent      // promoted explicitly by user (v1.5)
  }
  frames: Frame[]
  scratchpad: CanvasShape[]       // outside-frame shapes, notes, dropped images
}
```

### Frame

```typescript
interface Frame {
  id: string
  label?: string
  shapes: CanvasShape[]
  intent?: 'sketch' | 'page' | 'component' | 'exploration'
  renderEnabled: boolean          // false by default
  inheritGlobals: boolean         // false by default — opt-in to global nav/footer/theme
  overrides?: Partial<globals>
}
```

### CanvasShape

```typescript
interface CanvasShape {
  id: string
  type: 'rect' | 'roundedRect' | 'text' | 'note' | 'image'
  x: number
  y: number
  width: number
  height: number
  label?: string                  // overrides semantic inference
  semanticTag?: SemanticTag       // hero | nav | featureGrid | cta | footer | etc.
  linkedNoteIds: string[]
  contextNote?: string            // flattened text from linked notes — passed to AI
  sourceId?: string               // reserved for v1.5 fork feature
  isSuggestion?: boolean          // true for AI ghost suggestions
}
```

### CanvasNote

```typescript
interface CanvasNote {
  id: string
  text: string
  x: number
  y: number
  linkedShapeId?: string
  isIntentSignal?: boolean        // true if contains intent language — triggers AI suggestions
}
```

### Prop Schema (Layer 2 AI output)

```typescript
// What Claude outputs — the renderer maps this to React components
interface RenderedPage {
  theme: ThemeTokens
  sections: Array<{
    type: 'nav' | 'hero' | 'featureGrid' | 'textImageSplit' |
          'portfolio' | 'eventSignup' | 'ecommerce' | 'cta' | 'footer' | 'generic'
    content: SectionContent       // typed union per section
    layout: LayoutHints           // canvas-derived structural hints
  }>
}

interface LayoutHints {
  weight?: 'hero' | 'supporting' | 'minimal'
  itemCount?: number              // e.g. grid of 4 rects → 4 cards
  imagePosition?: 'left' | 'right' | 'top' | 'background'
  density?: 'spacious' | 'compact'
}
```

---

## v1 Scope

### In — v1

| Feature | Notes |
|---|---|
| Canvas tool switching | Select, rect, rounded rect, text, note |
| Copy / paste | Independent copies, Cmd+C/V |
| Image drop to canvas | Visual context for AI render |
| Multi-frame canvas | Inert by default, render is deliberate |
| Notes + shape linking | Drag note to shape to link context |
| AI canvas suggestions | Intent notes trigger ghost shape suggestions |
| Global context panel | Paste product description, tone, brand info |
| Context extraction pass | Single AI call → StructuredContext cached |
| Layer 1 render | Instant rules-based component assembly |
| Layer 2 AI render | Claude fills prop schema from context (~1–3s) |
| 10 section components | Bold/high-contrast theme, Raycast quality bar |
| 5 page archetypes | Auto-selected by semantic resolver |
| Theme token adjustment | AI adjusts from screenshot or brand context |
| HTML zip download | No auth, no deploy complexity |
| localStorage persistence | Save/restore canvas state |
| AI Assistant toolbar icon | Visual placeholder, grayed out, "Coming soon" tooltip |

### Out — v1.5+

| Feature | Target |
|---|---|
| Global nav/footer promotion | v1.5 |
| Component forking / linking | v1.5 |
| Canvas Agent | v1.5 |
| URL scraping as context | v1.5 |
| Supabase persistence | v1.5 |
| Breakpoint toggle | v1.5 |
| Slides renderer | v1.5 |
| GitHub + Vercel deploy | v1.5 |
| Screenshot style extraction | v2 |
| Doodles renderer | v2 |
| Per-element context UI | v2 |
| Image upload as context input | v2 |

---

## Recommended Build Order

Each phase produces something testable. Never more than one week between a working end-to-end loop.

| Phase | Est. Time | Deliverable |
|---|---|---|
| **1 — Canvas primitives** | 3–5 days | Tool switching wired, notes + linking, image drop, copy/paste, multi-frame |
| **2 — Context layer** | 2–3 days | Context panel UI, extraction pass → StructuredContext, per-shape contextNote |
| **3 — Component library** | 3–5 days | 10 sections at Raycast quality, ThemeTokens, prop schema locked |
| **4 — Layer 2 AI render** | 2–3 days | Prop-filling prompt + pipeline, streaming into preview, theme adjustment |
| **5 — AI canvas suggestions** | 1–2 days | Intent detection, ghost shapes, accept/dismiss |
| **6 — Export** | 1 day | HTML zip download, localStorage persistence |

**Total estimated solo build time: 12–18 focused days.**

---

## Architecture Rules

These rules must be followed throughout the build. They are locked.

- Never import the canvas engine directly outside of `src/engine/engines/provider.ts`
- Never import a specific renderer directly — always use the `RenderEngine` interface
- All AI calls go through `src/lib/anthropic.ts` — never instantiate Anthropic client inline
- `CanvasDocument` and `CanvasShape` are the single source of truth
- All canvas interactions go through the `CanvasEngine` interface
- All canvas elements are stored — nothing discarded based on frame position
- Use inline styles for colors and positioning — Tailwind v4 color/positioning utilities are unreliable
- Claude outputs a prop schema JSON object — never raw HTML
- Components handle all design decisions — Claude handles all content decisions

---

*Aphantasia v1 Spec — Locked*
