# Aphantasia — Context Update
> Supplementary planning context from design session. Feed alongside CONTEXT.md and aphantasia-v1-spec.md.
> Topics marked [PENDING] require further planning before implementation.

---

## Tech Stack Decisions

### Design System: shadcn/ui
- shadcn is the component library for Aphantasia's prebuilt section components
- Chosen because it's a copy-into-your-project system — no library opinions, full ownership
- shadcn components are the prop schema targets: Claude fills props, shadcn components render them
- Exported repos (v1.5+) will contain shadcn-based components developers recognise and are comfortable extending
- For v1 static HTML export: components must compile to self-contained output with no shadcn runtime dependency — build step produces standalone HTML/CSS

### Theming: CSS Custom Properties
- All theme tokens expressed as CSS custom properties, not hardcoded values
- This applies in both the canvas preview and exported output
- Enables style extraction from screenshots: vision pass → ThemeTokens → CSS vars → instant visual update across all components
- Token set: `--background`, `--surface`, `--accent`, `--foreground`, `--muted`, `--radius`, `--font-heading`, `--font-body`, plus glass-specific tokens: `--surface-blur`, `--surface-opacity`, `--border-opacity`
- Named style presets (e.g. "Dark Glass", "Light Minimal", "Bold Color") that Claude selects and overrides rather than inventing token values from scratch — more reliable, faster, cheaper

---

## The Canvas-to-Output Brain [PENDING — full planning session needed]

This is the core technical architecture. High priority to plan in full before Phase 3 (component library) begins.

### The Two-Layer Render Pipeline

**Layer 1 — Rules Engine (synchronous, zero latency)**
- Fires on every canvas change, no debounce, no AI, no network
- Reads `CanvasDocument`, classifies shapes by position/size/aspect ratio/label/linked notes
- Assembles `RenderedPage` prop tree from prebuilt components
- Renders immediately into preview pane
- Notes linked to shapes are direct Layer 1 content — copy written in a note appears instantly, no AI needed
- Quality of Layer 1 is what makes the product feel magical. This is a core investment.

**Layer 2 — AI Enrichment Pass (async, debounced, streamed)**
- Triggers on 2–3s debounce after last canvas change, OR explicit Render button press
- Takes Layer 1 `RenderedPage` as scaffold — enriches it, never rebuilds from scratch
- Claude fills prop schema with real contextual content, streams into preview
- No layout jumps — structure user sees immediately is structure that gets filled
- When Layer 1 re-renders after Layer 2 enrichment, preserve enriched content for unchanged shapes

### The Context Pipeline

```
Screenshot(s) → [Vision extraction — Haiku] ─┐
Global text paste → [Extraction pass]          ├──→ StructuredContext (cached)
Canvas notes (outside frame) ──────────────────┘

Per-shape linked notes / context nodes ──────────→ shape.contextNote (per shape)
Canvas layout + semantic tags ───────────────────→ LayoutDocument (always fresh)

StructuredContext + shape.contextNote + LayoutDocument = ContextBundle → Claude
```

- `StructuredContext` computed once, cached, only recomputes if user edits context input or drops new screenshot
- `LayoutDocument` always fresh — zero AI cost, just serialised canvas state
- The only expensive call is Layer 2 Sonnet pass — runs a handful of times per session, not hundreds

### AI Call Strategy

| Trigger | Model | Cost |
|---|---|---|
| Canvas change | None | Free — Layer 1 rules engine |
| Screenshot dropped (outside frame) | Haiku vision | Cheap, one-time |
| Intent note detected | Haiku classification | Tiny, one-time |
| 2–3s debounce fires | Sonnet | Layer 2 prop filling |
| Render button pressed | Sonnet | Force Layer 2 |

### What Claude Actually Receives (Layer 2 Prompt Structure)

```
CONTEXT:
Product: [productName] — [description]
Tone: [tone]
Visual reference: [ThemeTokens from screenshot if present]

CANVAS LAYOUT:
Frame: 1440×900
Sections (in order):
  1. nav — ...
  2. hero — note: "headline: Build faster. CTA: Get started"
  3. featureGrid — note: "3 features: Speed, Simplicity, Power"
  ...

PROP SCHEMA: [typed interface per section]

OUTPUT: JSON matching prop schema. Populate content from context and notes.
Adjust ThemeTokens from visual reference and tone. Do not invent structure.
```

- Claude's job is narrow: content and theme filler, not layout decision-maker
- Claude never generates HTML — fills a prop schema. Components handle all design decisions.

### Preview Pane State Machine

```
IDLE → user draws → LAYER1_RENDERING (instant) → WAITING (debounce)
WAITING → user draws again → reset WAITING
WAITING → debounce fires → LAYER2_STREAMING
LAYER2_STREAMING → complete → ENRICHED
ENRICHED → user draws → LAYER1_RENDERING (preserve enriched content for unchanged shapes)
```

### Backend Endpoints (lean — three routes only for v1)

- `/api/render` — Layer 2. Receives `ContextBundle + LayoutDocument`, streams `RenderedPage` JSON props
- `/api/extract` — Context extraction. Receives raw text + optional screenshot, returns `StructuredContext`
- `/api/suggest` — Canvas suggestions. Receives intent note + canvas state, returns suggested shapes

---

## Output Artifact Strategy

### v1 — Static HTML
- Self-contained HTML/CSS/JS zip and GitHub repo
- No framework dependency in the download
- Deploys on Vercel with zero configuration
- Target audience: non-technical founders, mass market appeal

### v1.5 — Next.js Repo Export
Output repo structure:
```
aphantasia-[project]/
├── app/
│   ├── page.tsx          ← generated from canvas
│   ├── layout.tsx        ← nav + footer globals
│   └── globals.css       ← theme tokens as CSS vars
├── components/
│   ├── Hero.tsx          ← each section as own component
│   ├── FeatureGrid.tsx
│   └── ...
├── lib/
│   └── content.ts        ← ALL copy as a plain data object (editable without touching components)
├── public/assets/
├── tailwind.config.ts    ← theme tokens baked in
└── README.md             ← "generated by Aphantasia"
```

Key principle: **content separated from components.** All Claude-generated copy lives in `lib/content.ts`. Developers can edit content without touching component code. Strong handoff story.

Component library options (v1.5 decision point):
- **Option A (recommended for v1.5):** Ship components as files in the repo. User owns everything, no Aphantasia dependency post-export.
- **Option B (v2+):** Publish `@aphantasia/ui` npm package. Enables component update upsell, but adds maintenance overhead.

### Future Output Types
The render layer is pluggable. The fork happens at the renderer, not before:
```
Canvas (shared) → Semantic Resolver (shared core) → Output Type Router
                                                      ↓         ↓        ↓
                                                  WebRenderer SlideRenderer AppRenderer
```

**Slides (v1.5):** PPTX / Reveal.js. Relatively straightforward — well-understood format.

**App Screen Prototypes (v2):** Frames become screens. Navigation flows between frames matter — need inter-frame connection concept in data model. Renderer outputs a phone-frame preview as linked HTML files. Not React Native — responsive HTML mimicking mobile viewport is right for demo/handoff use case.

**Data model note:** Add `connections` field to `CanvasDocument` to support inter-frame navigation links eventually. Don't design frame UI in a way that makes this hard to add.

**Semantic resolver audit needed:** Anywhere web-specific assumptions exist in the semantic layer (not renderer), flag and generalise. "Primary navigation element" not "nav". "Page terminus" not "footer".

---

## GitHub + Vercel Deployment (v1)

### Flow
```
User hits Export/Deploy
  → GitHub OAuth (one-time, repo scope)
  → Aphantasia creates aphantasia-[project-name] repo in user's GitHub
  → Subsequent exports commit to same repo (version history of iterations)
  → Files pushed via GitHub Contents API — pure REST, no git CLI
  → Export config card shown (see below)
  → Vercel instruction card with deep link
```

### Vercel Instruction Card
```
Step 1 → Go to vercel.com/new  [opens link]
Step 2 → Click "Import Git Repository"
Step 3 → Select "[exact repo name shown]"
Step 4 → Click Deploy — no settings to change
          Live in ~30 seconds
```
Deep link format: `vercel.com/new/import?s=https://github.com/[user]/[repo]` — skips steps 2 and 3.

### v1.5 Upgrade
Same GitHub push → add Vercel API call → return live URL automatically. Same underlying architecture, one more API call.

---

## Export Config Card

Shown after GitHub push. Single place where all real-world connections are resolved.

```
┌─────────────────────────────────────────┐
│  Almost ready to deploy                 │
│                                         │
│  Forms                                  │
│  ☐ Waitlist form  →  [Connect endpoint] │
│                                         │
│  Buttons                                │
│  ☐ "Get Started"  →  [Add destination] │
│  ✓ "Join Waitlist" →  linked to form   │
│                                         │
│  Files                                  │
│  ☐ Menu PDF       →  [Upload or paste] │
│                                         │
│  [Skip for now]    [Push to GitHub →]   │
└─────────────────────────────────────────┘
```

- "Skip for now" always available — site is always deployable
- Unconfigured items surfaced next time user opens project
- Mental model: Aphantasia generates structure and intent, config card resolves real-world connections

---

## Functional Components (v1)

### Form / Email Capture
- Semantic resolver detects form intent: label/note containing "waitlist", "signup", "subscribe", "contact", "RSVP"
- Surfaces a functional `FormComponent` in Layer 1, not a visual mockup
- **Option B approach:** User picks their service, Aphantasia shows tailored setup instructions, user pastes back endpoint URL, Aphantasia re-injects into HTML and re-pushes to GitHub
- Supported services v1: Formspree, Basin, Loops, Resend
- In preview pane: form is visual, submissions intercepted with toast "In preview mode"
- Component has `mode` prop: `preview` | `live`

### Buttons and Links

| Type | Implementation |
|---|---|
| Anchor / scroll | `href="#section-id"` — Aphantasia auto-generates section IDs |
| External link | User provides URL via linked note or export config card |
| Download | Links to uploaded asset in `/public/assets/` |
| Form trigger | Auto-wired to nearest form component |
| Email mailto | `mailto:` — user provides email |

Unconfigured buttons flagged in export card: "3 buttons need destinations."

### Lite File Uploads
- **Limits:** 5MB per file, 25MB per project total
- **Supported types:** PDF, PNG, JPG, SVG, MP4 (short), MP3, WEBP
- **Repo location:** `/public/assets/[filename]` — Vercel serves automatically, no config
- **Two entry points:** Drop onto canvas shape/button, or upload via export config card
- **Over-limit:** Redirect to "paste a link instead" — no edge cases

**Three hosting options (v1 uses 1 + 2):**
1. External link — user pastes Google Drive / Dropbox / Notion URL. Zero infrastructure.
2. GitHub repo asset — files included in repo commit via GitHub Contents API (base64). Vercel serves statically. Right for PDFs, menus, one-pagers under 5MB.
3. Supabase Storage (v1.5) — proper CDN, updatable without re-deploy.

**Asset registry in CanvasDocument:**
```typescript
interface CanvasAsset {
  id: string
  filename: string
  mimeType: string
  sizeBytes: number
  localUrl: string         // blob URL for canvas preview
  base64?: string          // populated at export time only
  linkedShapeIds: string[]
}
```
`base64` only populated at export time — not stored in localStorage throughout session.

**v1.5 migration:** `localUrl` becomes Supabase CDN URL. GitHub commit step skipped for assets. One field change, same downstream behaviour.

---

## Context Nodes (Visual Context Layer)

### Concept
Notes and screenshots become **context inputs** with visible connections to their targets. Canvas stays a sketchbook. Context layer becomes legible at a glance.

Not a node editor. Not a pipeline tool. Visible, meaningful connections with simple drag gestures.

### Three Node Types Only

**1. Text Context Node** (replaces/extends current note)
- Freeform text, floats anywhere
- Unattached = scratchpad. Connected = feeds `contextNote` on target.
- Visual: sticky-note aesthetic, warm colour, handwritten-style font

**2. Image Context Node** (screenshots and references)
- Displays as thumbnail on canvas
- Connected to frame = style reference
- Connected to shape = visual reference for that component
- Visual: darker card, image preview with subtle border

**3. Global Broadcast Node** (the context panel)
- One per canvas, always present
- No connection lines — ambient broadcast
- Visual: soft halo on frames inheriting it
- Expanding it opens global context panel

### Connection Interaction (three gestures only)
```
Hover context node → connect handle appears on edge
Drag handle toward shape/frame → bezier curve follows, target highlights
Release on target → connection snaps, line persists subtly, type indicator on midpoint
```

Type indicator on line midpoint: `copy` | `style` | `structural` | `visual reference`
- Aphantasia infers type from node content
- User can tap midpoint to override — small radial picker, four options

### Connection Types Inferred
- Text with copy ("headline:", CTAs) → `copy`
- Text with intent ("this should feel like...") → `structural`
- Image → frame → `style`
- Image → shape → `visual reference`

### What This Changes in the AI Pipeline
Claude receives structured context per shape instead of flat text blob:

```typescript
interface ShapeContext {
  copy: string[]           // from text nodes typed 'copy'
  structural: string[]     // from text nodes typed 'structural'
  styleRef?: ImageRef      // from connected image node
  global: StructuredContext
}
```

Result: more accurate, more predictable, cheaper AI calls.

### Hard Limits (what NOT to build)
- No typed ports on shapes
- No execution order / pipeline running
- No node chaining (one hop only: context node → target)
- No required connections — everything works with zero connections
- Unattached notes still feed global scratchpad context

---

## AI Model Strategy

| Operation | Model | Rationale |
|---|---|---|
| Layer 1 render | None | Rules engine, zero cost |
| Intent detection in notes | Haiku | Tiny classification |
| Context extraction | Haiku or Sonnet | One-time per session |
| AI canvas suggestions | Haiku | Simple shape list |
| Screenshot style extraction | Haiku vision | One-time, small output |
| Layer 2 prop filling | Sonnet | Quality matters here |
| Theme extraction from screenshot | Sonnet | Vision + reasoning |

User-facing model toggle (v1.5): "Fast / Quality" maps to Haiku vs Sonnet for Layer 2.

Key cost controls:
- `StructuredContext` cached — extraction runs once per edit, not per canvas change
- Layer 2 only re-runs on explicit Render button press (not automatically)
- Aggressive debounce (2–3s)
- Context nodes reduce noise in Claude's prompt → fewer tokens, better output

---

## Supabase (v1.5)

Tables:
- `canvas_documents` — one row per canvas, `CanvasDocument` as JSONB
- `users` — Supabase Auth
- `context_cache` — `StructuredContext` persists across page reloads
- `assets` — Supabase Storage for file uploads

Row-level security on all user data from day one.

**Abstract persistence behind an interface now** even though v1 uses localStorage. Clean swap to Supabase in v1.5 with no product code changes.

---

## Production Test Environment [CAPTURED — not critical for v1]

Before v1.5 launch, Aphantasia needs a production-like environment to:
- Pressure test form endpoint integrations (Formspree, Loops, Basin, etc.)
- Test the full GitHub OAuth → push → Vercel deploy flow end-to-end
- Test sign-up, auth, and persistence flows when Supabase is added
- Test file uploads through the full pipeline (canvas → GitHub commit → Vercel serving)
- Validate export config card UX with real third-party accounts

This is separate from the dev environment — needs real OAuth apps, real third-party accounts, real deployments. Plan this before v1.5 work begins.

---

## Architecture Rules (Additions to Existing)

These supplement the rules in CONTEXT.md:

- **Prop schema is canonical output of Layer 2.** Never let Claude generate HTML or markup directly. The prop schema is what makes format-swapping (static HTML → Next.js → slides) possible.
- **Build v1 HTML components as if they will become React components.** Clear section boundaries, CSS custom properties for theme tokens, content separated from structure in template strings.
- **Persist an interface for the persistence layer.** localStorage today, Supabase v1.5 — no product code should reference localStorage directly.
- **Semantic resolver must stay output-agnostic.** No web-specific vocabulary in the resolver layer. "Primary navigation element" not "nav". Renderers handle output-specific vocabulary.
- **Context nodes are one hop only.** No chaining. Context node → target shape/frame. Nothing more complex.
- **Asset base64 encoding happens at export time only.** Never store large base64 strings in localStorage during session.

---

*Context update from planning session — supplements CONTEXT.md and aphantasia-v1-spec.md*
