# Context Nodes — The Concept

The mental model shift is small but important. Right now notes and screenshots are canvas elements that happen to be linkable. With context nodes, they become context inputs that are visually connected to their targets. The canvas stays a sketchbook. The context layer becomes legible.

A user should be able to glance at their canvas and immediately read: "that screenshot is feeding style context into this frame, that note is feeding copy intent into that hero shape, and that global context panel is broadcasting to everything."

That's the whole goal. Not a pipeline editor. Just visible, meaningful connections.

---

## The Three Node Types

Keep it to exactly three. Any more and it starts feeling like a system to learn.

### 1. Text Context Node
*Replaces/extends the current note*

- Freeform text, dropped anywhere on canvas
- Can float unattached (scratchpad thought) or connect to a shape/frame
- Connected version feeds `contextNote` on the target shape
- Visual: sticky-note aesthetic, warm colour, handwritten-style font to reinforce "thinking layer"

### 2. Image Context Node
*For screenshots and reference images*

- Dropped onto canvas, displays as a thumbnail
- Connection to a frame = style reference
- Connection to a specific shape = visual reference for that component
- Visual: slightly darker card, image preview with a subtle border

### 3. Global Broadcast Node
*The context panel*

- One per canvas, always present
- Doesn't connect via lines — it's ambient
- Visual treatment: a soft halo or highlighted border on frames that are inheriting it
- Expanding it opens the global context panel (product description, tone, brand)

---

## The Connection Interaction

Three gestures, nothing more complex:

1. **Hover a context node** → A small "connect" handle appears on its edge (subtle, not always visible)
2. **Drag from that handle toward a shape or frame** → A bezier curve follows the drag; target shape highlights as you approach it
3. **Release on target** → Connection snaps in; line persists at rest (subtle), brightens on hover; a small type indicator appears on the line midpoint (`copy` / `style` / `structure`)

### Type Inference

The type indicator on the line is inferred from node content:

| Node content | Inferred type |
|---|---|
| Text containing copy ("headline:", "subhead:", CTAs) | `copy` |
| Text containing intent ("landing page for...", "this section should feel...") | `structural` |
| Image node connected to frame | `style` |
| Image node connected to shape | `visual reference` |

User can tap the midpoint indicator to override. Small radial picker with four options. That's the full extent of "configuration."

---

## What This Looks Like on Canvas

```
┌─────────────────────────────────────────────────┐
│  [Global Context]  "Productivity app, bold tone" │ ← ambient, no lines
└─────────────────────────────────────────────────┘

     [📸 competitor.png] ─────────────────style──→ ┌─────────────┐
                                                    │    FRAME    │
     [📝 "hero headline:              ──copy──────→ │  [Hero   ]  │
          Build faster.               ]             │  [Grid   ]  │
                                                    │  [CTA    ]  │
     [📝 "3 features: Speed,         ──copy──────→  │             │
          Simplicity, Power"]                       └─────────────┘

     [📝 "this whole page should     (unattached — scratchpad)
          feel like Linear"]
```

The unattached note is just a thought. It doesn't feed anything yet. The user can connect it later or leave it as scratchpad. No pressure.

---

## How This Changes the AI Pipeline

Right now Claude receives a flat `contextNote` per shape. With typed connections, Claude receives a structured context object per shape:

```typescript
interface ShapeContext {
  copy: string[]           // from connected text nodes typed 'copy'
  structural: string[]     // from connected text nodes typed 'structural'
  styleRef?: ImageRef      // from connected image node
  global: StructuredContext // always present
}
```

Claude's prompt becomes more precise:

```
Hero section:
  Copy inputs: "headline: Build faster" / "subhead: The canvas for makers"
  Style reference: [image attached]
  Global tone: bold, direct

Fill the Hero prop schema using copy inputs verbatim where provided.
Match visual style from the style reference.
```

The result is more accurate, more predictable, and cheaper — Claude isn't inferring intent from a blob of mixed text, it's receiving pre-sorted context by type.

---

## What Stays Simple

A few things to explicitly *not* do:

- **No typed ports on shapes.** Shapes don't have input/output ports. Context nodes connect to them freely.
- **No execution order.** There's no "run this pipeline" — connections are just context signals, Layer 2 reads them all at render time.
- **No node chaining.** A note feeding another note feeding a shape is not a supported pattern. One hop only: context node → target.
- **No required connections.** Everything still works with zero connections. Unattached notes still feed global scratchpad context. The system degrades gracefully.

The canvas stays a sketchbook. Context nodes make the thinking layer visible without making it feel like engineering.

---

## Implementation Status

### Text Context Node — ✅ Complete

Implemented as `type: "note"` shapes in `CustomCanvasEngine.tsx`.

**Connection Handle (FigJam-style):**
- Blue circle (14px) positioned at right edge, 33% from top of note
- Always visible (opacity 0.4 when unlinked, 1.0 when linked)
- `cursor: crosshair` on hover
- Attributes: `data-connect-handle` + `data-note-id` for hit detection

**Connection Interaction:**
- Click-drag from the handle enters `"connecting"` mode (new mode added to engine)
- `connectingRef` tracks: `noteId`, `cursorWorld` position, `overShapeId` (hover target)
- During drag: AABB hit-test against non-note shapes using cursor position
- Target shape highlights with orange glow on hover
- On release: `engine.linkNoteToShape(noteId, targetId)` creates the connection
- Re-targeting: dragging handle to a new shape calls `unlinkNoteFromShape()` first, then links to new target

**No auto-connect:** Dragging a note body only moves it — no proximity-based auto-linking. Connections are always explicit via the handle.

**Visual Connection Lines:**
- Thick (3.5px) dark (#4b4b4b) S-curve bezier arrows from handle to target shape left edge
- SVG `<marker>` arrowheads with `orient="auto-start-reverse"`
- Each connection rendered as its own sized SVG (avoids overflow:hidden clipping from parent containers)
- Cubic bezier: `M start C midX,startY midX,endY end` for smooth S-curves

**Temporary Arrow During Drag:**
- Blue dashed bezier line from handle to cursor during `"connecting"` mode
- Small circle at cursor endpoint

**Data Model:**
- Note shape has `linkedShapeId?: string` pointing to its target
- Target shape has `linkedNoteIds: string[]` listing connected notes
- Connection propagates note text as `contextNote` on the target shape via `refreshContextNotes()`

### Image Context Node — ✅ Complete

Implemented as `type: "image"` shapes in `CustomCanvasEngine.tsx`.

**Image Creation:**
- Drag-drop image files onto canvas creates image shapes with base64 in `meta.src`
- Thumbnail rendered via `<img>` with `object-fit: cover`

**Connection Handle:**
- Same blue circle as notes: 14px, right edge at 33% from top
- `data-source-id` + `data-source-type="image"` attributes
- Shared `"connecting"` mode with notes via generalized `connectingRef` (`sourceId` + `sourceType`)

**Linking:**
- `linkImageToShape(imageId, shapeId)` / `unlinkImageFromShape(imageId)` mirror note methods
- Image gets `linkedShapeId`, target gets `linkedImageIds: string[]`
- Hit-test skips both note and image types (context inputs aren't valid drop targets)

**Pipeline Integration:**
- `buildContextBundle()` gathers `styleRef: ImageRef` from linked images
- `serializeForPrompt()` adds `style-ref: [image attached]` marker per section
- `/api/render/route.ts` converts `styleRef` images to vision content blocks (base64) sent to Claude
- Prompt includes rule: "match visual aesthetic: color palette, typography feel, spacing, and overall mood"
- Image shapes excluded from section list (`semanticTag !== "image"` filters)

### Global Broadcast Node — ⚠️ Partial

The **Global Context Panel** (`CanvasContextWidget.tsx`) is fully implemented:
- Persisted to localStorage via `ContextStore` singleton
- Structured context (product description, tone, brand) parsed and available
- Broadcasts to all shapes via the render pipeline

Still needs:
- Visual "ambient" indicator on shapes inheriting global context (soft halo / highlighted border)
- Canvas-level visual representation of the broadcast node itself

### Type Inference on Connection Lines — ❌ Not Started

The midpoint type indicator (`copy` / `style` / `structural` / `visual reference`) and the radial picker override are not yet implemented. Currently all text note connections are treated uniformly as `contextNote`.

---

## Remaining Project Work

### Phase 6 — Export (GitHub → Vercel)
All export adapters are stubs:
- `HTMLAdapter.ts` — static HTML export
- `GitHubAdapter.ts` — push to repo
- `VercelAdapter.ts` — deploy to Vercel

### Canvas Persistence
Canvas shapes are not saved/restored on page reload. Only the global context is persisted via localStorage. Need to add CanvasDocument serialization to localStorage (or similar).

### AI Semantic Refinement (Phase 3 in resolver)
`SemanticResolver.ts` has a TODO for passing ambiguous shapes to AI for better tagging. Currently all tagging is rules-based only.

---

## Spatial Hierarchy Detection — ✅ Complete

Automatic nested component recognition from canvas layout. No AI — pure spatial analysis.

### How It Works

A large rectangle containing smaller rectangles is detected as a compound section (e.g., a feature grid with cards). Text and button children inside each card are extracted as structured props. A heading text above the card row becomes the section title.

**Files:**
- `src/spatial/SpatialAnalyzer.ts` — Core containment detection + pattern recognition
- `src/spatial/index.ts` — Barrel export
- `src/semantic/SemanticResolver.ts` — Calls `analyzeHierarchy()` after per-shape tagging

### Detection Pipeline

1. **Containment Tree** (`buildContainmentTree`): O(n²) AABB overlap — each shape finds its smallest qualifying parent (overlap > 50% of child area, parent area > 1.5× child area)
2. **Pattern Recognition** (`recognizePattern`): Parent rectangles with 2+ similar-sized child rectangles horizontally aligned → **card-grid**. If a text child sits above the card row → **section-with-heading**.
3. **Feature Extraction** (`extractFeatureItem`): For each card, text children sorted by length (shortest → heading, longest → body), roundedRect children → CTA buttons.

### Data Flow

- **Consumed shapes**: Children absorbed into a group get `meta._consumed: true` — filtered out by all renderers (`WebRenderer`, `PreviewPane`, `serializer`, `/api/render`)
- **Group parents**: Container rectangle gets `semanticTag: "cards"` and `meta._spatialGroup: { title, features[] }` — renderers call `renderFeatureGrid()` with extracted props
- **No interface changes**: Uses `meta` field on `CanvasShape` to avoid modifying the interface

### Supported Patterns

| Pattern | Detection Rule | Result |
|---|---|---|
| **Card Grid** | Parent rect + 2+ similar child rects, horizontally aligned (Y spread < 50% avg height) | Single feature grid with extracted card content |
| **Section with Heading** | Card grid + text child above the card row | Feature grid with title from heading text |

### Example

Canvas shapes:
- Large rectangle (900×400) labeled "Why it works"
- 3 smaller rectangles (250×250 each) side-by-side inside
- Text shapes "Speed", "Simplicity", "Power" inside each card
- RoundedRect "Learn more" buttons inside each card
- Heading text "Headline about how good our product is" at top

**Result**: ONE feature grid section with title "Headline about how good our product is" and 3 cards (Speed/Simplicity/Power), each with "Learn more" body text. All 10 child shapes consumed; only the container renders.
