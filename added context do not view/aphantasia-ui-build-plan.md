# Aphantasia — UI Experience Build Plan

> For Claude Code sessions. This is the authoritative build plan for the UI experience.
> Produced 2026-03-21 after full codebase audit and product vision review.
> Supersedes the Sites-focused `aphantasia-v1-rebuild-plan.md` for UI work.

---

## What Is the UI Experience?

Aphantasia has three product modes: Sites, Slides, and **UI**. This plan covers the **UI experience** exclusively — a mode where users wireframe mobile app screens on a canvas and Aphantasia renders them in real-time using a design system extracted from a reference screenshot of the user's existing product.

**The pitch:** Upload a screenshot of your app. Sketch rectangles and text on a phone frame. Aphantasia instantly renders your sketches as if they were designed in Figma, matching your product's exact visual language — fonts, colors, spacing, radii, component styles. Attach notes to any element as mini-prompts ("animate on hover", "show 5 items") and the renderer obeys. Export as a high-res image to share with your team.

**Who it's for:** Founders, PMs, and CEOs who need to communicate product vision to their team. People who think in wireframes but can't design. People who want a shareable prototype that looks like their actual product, not a generic mockup.

---

## How UI Differs from Sites

| Dimension | Sites Experience | UI Experience |
|---|---|---|
| Frame | Desktop browser (1280×800) | Mobile device (iPhone 17: 393×852) |
| Atomic unit | Page sections (Hero, Features, CTA) | UI components (NavBar, Card, List, Input, Button) |
| Design source | Theme presets + mood docs | Extracted from user's reference screenshot |
| Rendering model | Sections assembled from position inference | Components rendered per-element at canvas resolution |
| AI role | Fill content + select variants | Interpret sketches as components, apply design system |
| Context | Global product description | Per-component notes (mini-prompts) |
| Export | Deployable HTML to GitHub/Vercel | High-res PNG/PDF image |
| Canvas interaction | Few large shapes = page sections | Many small shapes = individual UI elements |

This is not a reskin. The canvas engine and abstraction layer are reusable, but the semantic resolver, render pipeline, component library, and AI pipeline are entirely new for UI mode.

---

## Architecture: What to Keep, What to Build New

### Keep As-Is
- `src/engine/` — Custom canvas engine + CanvasEngine abstraction interface
- `src/engine/engines/CustomCanvasEngine.tsx` — Pan, zoom, draw, select, move, resize, labels
- `src/engine/engines/provider.ts` — Engine swap pattern
- `src/lib/anthropic.ts` — Anthropic client singleton
- `src/lib/utils.ts` — Utility functions
- `src/app/layout.tsx` — Root layout
- `src/app/globals.css` — Base styles + Tailwind
- Canvas data model types (`CanvasDocument`, `CanvasShape`)
- The architecture rules from CONTEXT.md (abstraction boundaries, no direct engine imports, etc.)

### Modify / Extend
- `src/app/page.tsx` — Needs UI mode layout (canvas + viewport side-by-side + reference panel)
- `src/components/Toolbar.tsx` — Needs UI-specific tools (rectangle, text, button, note, component picker)
- `src/components/PreviewPane.tsx` → rename/fork to `ViewportPane.tsx` for UI mode rendering
- `src/engine/CanvasEngine.ts` — May need extensions for note attachments and component tagging

### Build New
- `src/ui-mode/` — Entire UI experience module (new directory)
- `src/ui-mode/reference/` — Design reference extraction pipeline
- `src/ui-mode/components/` — Mobile UI component library (renderers)
- `src/ui-mode/semantic/` — UI-specific semantic resolver
- `src/ui-mode/render/` — UI-specific render engine
- `src/ui-mode/viewport/` — Live viewport renderer
- `src/ui-mode/notes/` — Contextual note system
- `src/app/api/ui-extract/` — Reference screenshot extraction API
- `src/app/api/ui-render/` — UI render API (Layer 2)

---

## Phase 0 — Decisions (Locked Before Building)

### D-UI-1: Frame Dimensions
**iPhone 17 Pro: 393×852 logical pixels.** This is the default frame. The canvas shows this frame prominently. Future: frame picker for other devices (iPad, Android, custom). Architecture supports any dimensions — frame is a `{ width, height }` config, not hardcoded.

### D-UI-2: Render Strategy
**Same two-phase hybrid as Sites, adapted for components:**
- **Layer 1 (instant, rules-based):** Canvas shapes → UI semantic resolver → map to UI components → render with extracted design system tokens. No AI, no latency. User sees a real-looking UI the moment they draw.
- **Layer 2 (background, async):** Canvas state + design system + per-component notes → AI → refines component choices, fills content, applies note instructions → streams updates into viewport.

### D-UI-3: Design System Token Schema
The extracted design system is stored as a `UIDesignSystem` interface — the single source of truth for all rendering:

```typescript
interface UIDesignSystem {
  // Typography
  fonts: {
    heading: { family: string; weight: number; letterSpacing: string }
    body: { family: string; weight: number; letterSpacing: string }
    caption: { family: string; weight: number }
    mono?: { family: string; weight: number }
  }
  fontSizes: {
    xs: string; sm: string; base: string; lg: string; xl: string; '2xl': string; '3xl': string
  }

  // Colors
  colors: {
    background: string
    foreground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    destructive: string
    border: string
    input: string
    ring: string
    card: string
    cardForeground: string
  }

  // Spacing
  spacing: {
    xs: string; sm: string; md: string; lg: string; xl: string; '2xl': string
  }

  // Radii
  radii: {
    none: string; sm: string; md: string; lg: string; xl: string; full: string
    button: string; card: string; input: string
  }

  // Shadows
  shadows: {
    sm: string; md: string; lg: string
    card: string; button: string; input: string
  }

  // Component-specific tokens
  components: {
    navBar: { height: string; blur: string; borderBottom: string }
    card: { padding: string; gap: string }
    button: { height: string; paddingX: string; fontSize: string }
    input: { height: string; paddingX: string; fontSize: string }
    list: { itemHeight: string; divider: string }
    tabBar: { height: string; iconSize: string }
  }

  // Meta
  name: string
  extractedFrom?: string   // base64 thumbnail of original reference
  confidence: number        // 0-1, how confident the extraction was
}
```

### D-UI-4: Note System
**Notes are first-class canvas elements that attach to other shapes via spatial proximity or explicit connection.**
- A note is a distinct shape type (sticky-note style, visually different from rectangles)
- Notes inside a frame that overlap or are adjacent to a component shape are treated as context for that component
- Notes outside the frame are global context (like scratchpad notes in Sites mode)
- Note content is plain text — no formatting, no markdown
- Notes flow into the AI pipeline as per-component instructions
- The renderer must obey note instructions for the specific component they're attached to

### D-UI-5: Component Tagging
**Users can optionally tag any rectangle with a specific component type.**
- Double-click a shape → label editing (existing feature)
- If the label matches a known component name (e.g., "dropdown", "nav", "input", "tabs"), the shape is force-resolved to that component type — overriding spatial inference
- This is the explicit path. The implicit path (spatial inference) should work well enough that tagging is rarely needed
- Component picker in the toolbar also lets users drop pre-tagged shapes

### D-UI-6: Export
**High-res PNG for v1.** The viewport renders at 2x or 3x resolution, then exports as a downloadable PNG.
- Future: PDF export (multi-frame document)
- Future: Figma push via MCP
- Architecture supports pluggable export adapters (same pattern as Sites)

### D-UI-7: Multiple Frames
**Users can create multiple phone frames on the canvas to wireframe multiple screens.**
- Each frame is an independent render context
- The viewport shows the currently selected frame's render
- Frame selector (tabs or thumbnail strip) lets users switch between frames
- All frames share the same design system
- Cross-frame notes (outside all frames) are global context

---

## Vertical 1: Design Reference Extraction (4–5 days)

This is the foundational capability. Without a design system, the viewport renders generic components. With a design system extracted from the user's real product, the viewport renders components that look like they belong in the user's app. This is the magic.

### The Reference Widget

A panel (collapsible, right side or floating) where the user:
1. Uploads a screenshot of their existing product (drag-drop or file picker)
2. Sees a thumbnail of the uploaded screenshot
3. Sees the extracted design system rendered as a visual summary (color swatches, typography samples, spacing/radius preview, component previews)
4. Can manually override any extracted token (click a color swatch → color picker, click a font → font selector)
5. Can upload additional screenshots to refine the extraction

### Extraction Pipeline

```
User uploads screenshot
  ↓
POST /api/ui-extract
  ↓
Claude Vision (Sonnet) analyzes the screenshot:
  - Identifies dominant colors and their roles (bg, fg, primary, accent, etc.)
  - Identifies typography (serif vs sans, approximate sizes, weights)
  - Identifies spacing patterns (padding, margins, gaps)
  - Identifies border radius patterns (sharp, slightly rounded, very rounded, pill)
  - Identifies shadow usage (flat, subtle elevation, dramatic shadows)
  - Identifies component conventions (card style, button style, input style, nav style)
  ↓
Returns UIDesignSystem JSON
  ↓
Stored in React state (and localStorage for persistence)
  ↓
Immediately applied to all viewport renders via CSS custom properties
```

### Extraction Prompt Design

The system prompt for extraction must be extremely specific. It's not asking Claude to "describe the design" — it's asking Claude to produce exact CSS values.

**System prompt structure:**
```
You are a design system extraction engine. You analyze screenshots of mobile applications and extract precise design tokens.

You MUST return a JSON object matching the UIDesignSystem schema. Every value must be a valid CSS value.

For colors: extract exact hex values. Map each color to its semantic role:
- background: the dominant background color of the app
- foreground: the primary text color
- primary: the main brand/action color (buttons, links, active states)
- secondary: a supporting color used for secondary actions
- muted: subdued background (used for disabled states, subtle containers)
- mutedForeground: subdued text color
- accent: highlight color for badges, pills, active tabs
- destructive: red/error color
- border: the color used for borders and dividers
- card: card/container background (often slightly different from main bg)

For typography: identify the font family category (geometric sans, humanist sans, serif, rounded, mono). Do NOT guess specific font names unless clearly identifiable — instead provide the closest Google Font match. Extract approximate sizes in px for the visible text hierarchy.

For spacing: measure pixel distances between elements. Provide a consistent scale (e.g., 4/8/12/16/24/32/48).

For border-radius: measure the actual px radius on buttons, cards, inputs. Note if the design uses consistent radii or varies them.

For shadows: describe the shadow style (none, subtle, medium, dramatic) and provide CSS box-shadow values.

For component conventions: note specific patterns:
- NavBar: height, has blur?, has border-bottom?, is translucent?
- Cards: padding, gap between elements, has border?, has shadow?
- Buttons: height, horizontal padding, font size, border-radius
- Inputs: height, border style, focus state
- Lists: item height, has divider?, divider style
- TabBar: height, icon size, has labels?

Confidence: rate 0-1 how confident you are in the extraction. Lower confidence if the screenshot is blurry, partial, or shows unusual UI patterns.
```

### Default Design System (when no reference is uploaded)

The viewport must look good even without a reference upload. Ship a polished default `UIDesignSystem` that matches a clean, modern iOS-style aesthetic:
- SF Pro–like sans-serif (use Inter or Geist as proxy)
- iOS system colors (blue primary, light gray backgrounds, dark text)
- iOS-standard spacing (16px margins, 12px internal padding)
- iOS-standard radii (12px cards, 10px buttons, 8px inputs)
- Subtle shadows on cards, no shadows on inputs

This default is the "blank canvas" starting point. Users can start sketching immediately and see iOS-quality renders without uploading anything. The reference upload then transforms the entire look to match their product.

### Token Override UI

After extraction, users see a compact "Design System" panel with:
- **Colors**: Grid of swatches (clickable → native color picker)
- **Typography**: Font name + preview text (clickable → font selector dropdown with Google Fonts)
- **Spacing**: Visual scale (clickable → number inputs)
- **Radii**: Preview rectangles at different radii (clickable → slider)
- **Components**: Mini-preview of a button, card, input at current tokens

Overrides are stored alongside the extracted system. The override always wins.

### Acceptance Criteria for Vertical 1

- [ ] Upload a screenshot of any mobile app → design system extracted in <8 seconds
- [ ] Extracted colors are visually accurate (compare swatches to original screenshot)
- [ ] Extracted typography category is correct (sans/serif/mono, approximate sizes)
- [ ] Extracted radii match the original (rounded app → rounded tokens, sharp app → sharp tokens)
- [ ] Without any upload, the default design system renders a clean iOS-style UI
- [ ] User can click any color swatch and override it → viewport updates instantly
- [ ] User can change font family → all text in viewport updates instantly
- [ ] Design system persists in localStorage across page refreshes
- [ ] Uploading a second screenshot refines/replaces the extraction

---

## Vertical 2: UI Component Library (7–8 days)

This is the core product asset. These components render inside the viewport to make wireframes look like real app screens. Every component must:

1. Accept a `UIDesignSystem` and render using its tokens exclusively (zero hardcoded values)
2. Look beautiful with zero props (smart defaults)
3. Accept content from canvas shape labels/text
4. Accept styling overrides from attached notes
5. Render as HTML strings for the viewport iframe

### The UI Component Inventory

#### Navigation & Structure

| # | Component | Inferred From | Key Variants |
|---|---|---|---|
| 1 | **StatusBar** | Always present at top of frame | `light` · `dark` (adapts to bg color) |
| 2 | **NavBar** | Rectangle at top of frame, narrow and wide | `standard` (title + back) · `large-title` (iOS-style collapsible) · `search` (with search field) · `segmented` (with segment control) |
| 3 | **TabBar** | Rectangle at bottom of frame, narrow and wide | `icon-only` · `icon-label` · `pill-active` (floating active indicator) |
| 4 | **BottomSheet** | Large rectangle at bottom, partial frame height | `handle` · `full` · `scrollable` |

#### Content & Data Display

| # | Component | Inferred From | Key Variants |
|---|---|---|---|
| 5 | **Card** | Rectangle inside frame, not at edges | `elevated` · `bordered` · `filled` · `image-top` |
| 6 | **ListItem** | Multiple narrow rectangles stacked vertically | `simple` (title only) · `subtitle` (title + subtitle) · `icon-left` · `chevron` (with disclosure arrow) · `toggle` (with switch) · `destructive` |
| 7 | **ListGroup** | Multiple ListItems with a containing rectangle | `inset` (grouped iOS-style) · `plain` · `separated` |
| 8 | **SectionHeader** | Small text element above a group of elements | `plain` · `with-action` (right-aligned button) |
| 9 | **Avatar** | Small square or circle | `circle` · `rounded` · `initials` |
| 10 | **Badge** | Very small rectangle or pill | `default` · `destructive` · `outline` · `count` |
| 11 | **Tag/Chip** | Small pill-shaped element | `default` · `selected` · `removable` |
| 12 | **EmptyState** | Large rectangle with centered text | `icon-top` · `illustration` · `minimal` |

#### Inputs & Actions

| # | Component | Inferred From | Key Variants |
|---|---|---|---|
| 13 | **Button** | Small rectangle with text, labeled "button" or "CTA" | `primary` · `secondary` · `outline` · `ghost` · `destructive` · `icon-only` |
| 14 | **TextInput** | Rectangle labeled "input", "field", "text field", "search" | `default` · `with-icon` · `with-label` · `multiline` |
| 15 | **SearchBar** | Wide rectangle at or near top with "search" label | `default` · `with-cancel` · `with-filter` |
| 16 | **Toggle/Switch** | Very small rectangle labeled "toggle" or "switch" | `default` · `with-label` |
| 17 | **Checkbox** | Very small square | `default` · `with-label` |
| 18 | **SegmentedControl** | Wide short rectangle with text divisions | `default` · `pill` |
| 19 | **Slider** | Wide, very thin rectangle | `default` · `with-labels` · `with-value` |
| 20 | **Stepper** | Small rectangle with +/- | `default` · `with-label` |

#### Media & Visual

| # | Component | Inferred From | Key Variants |
|---|---|---|---|
| 21 | **ImagePlaceholder** | Rectangle tagged "image" or with aspect ratio ≈16:9 or 1:1 | `rounded` · `sharp` · `circle` |
| 22 | **Carousel** | Wide rectangle with hint of multiple items | `full-width` · `peek` (shows edges of adjacent items) · `dots` · `progress-bar` |
| 23 | **ProgressBar** | Very wide, very thin rectangle | `linear` · `circular` · `steps` |
| 24 | **Divider** | Horizontal line or very thin rectangle | `full` · `inset` · `with-text` |

#### Feedback & Overlay

| # | Component | Inferred From | Key Variants |
|---|---|---|---|
| 25 | **Alert/Banner** | Rectangle near top, below nav | `info` · `success` · `warning` · `error` |
| 26 | **Toast** | Small floating rectangle, typically near bottom | `default` · `with-action` |
| 27 | **Modal/Dialog** | Rectangle centered in frame, with overlay hint | `alert` · `action-sheet` · `full-screen` |
| 28 | **FloatingActionButton** | Small circle or rounded square at bottom-right | `default` · `extended` (with label) |

#### Composite (built from atomic components)

| # | Component | Inferred From | Key Variants |
|---|---|---|---|
| 29 | **ProfileHeader** | Large area at top with circle + text | `centered` · `left-aligned` · `with-cover` |
| 30 | **MessageBubble** | Rounded rectangles alternating left/right | `sent` · `received` · `with-avatar` |
| 31 | **FeedItem** | Vertically stacked: avatar + text + image + actions | `social` · `news` · `minimal` |
| 32 | **SettingsRow** | List-like with icons and disclosure | `toggle` · `navigation` · `value` · `destructive` |

### Spatial Inference Rules for UI Mode

The UI semantic resolver works differently from Sites mode. Instead of position-on-page → section-type, it uses size, aspect-ratio, position, and containment:

**Position-based rules:**
- Narrow rectangle spanning full frame width at very top → `StatusBar` or `NavBar`
- Narrow rectangle spanning full frame width at very bottom → `TabBar`
- Large rectangle covering bottom 40–70% of frame → `BottomSheet`
- Small circle or square at bottom-right corner → `FloatingActionButton`

**Size-based rules:**
- Very small square (< 24×24 logical) → `Checkbox` or `Avatar`
- Small pill (width > 2× height, height < 36) → `Badge` or `Tag`
- Medium rectangle (width ~frame width, height 44–56) → `ListItem` or `TextInput`
- Wide rectangle, very thin (height < 8) → `Divider` or `ProgressBar`
- Wide rectangle, thin (height 36–44) → `Button` or `SegmentedControl`
- Rectangle with aspect ratio near 1:1, medium size → `Card` (square variant) or `ImagePlaceholder`
- Rectangle with aspect ratio near 16:9 → `ImagePlaceholder`

**Containment-based rules:**
- Multiple equal-height narrow rectangles stacked vertically inside a container → `ListGroup` containing `ListItem`s
- Small text element above a group of elements → `SectionHeader` + group
- Rectangle with centered text and no children → contextual (could be Card, Button, EmptyState — use size to disambiguate)

**Label-override rules (highest priority):**
These keywords in a shape's label force-resolve to a specific component:

| Keywords | Component |
|---|---|
| `nav`, `navbar`, `navigation`, `header` | NavBar |
| `tab`, `tabbar`, `tabs`, `bottom nav` | TabBar |
| `card` | Card |
| `list`, `menu` | ListGroup |
| `button`, `btn`, `cta`, `action` | Button |
| `input`, `field`, `text field`, `form` | TextInput |
| `search` | SearchBar |
| `toggle`, `switch` | Toggle |
| `image`, `photo`, `thumbnail`, `img` | ImagePlaceholder |
| `modal`, `dialog`, `popup`, `sheet` | Modal |
| `alert`, `banner`, `notification` | Alert |
| `avatar`, `profile pic` | Avatar |
| `badge`, `tag`, `chip`, `pill` | Badge/Tag |
| `carousel`, `slider`, `swiper` | Carousel |
| `fab`, `floating button` | FloatingActionButton |
| `dropdown`, `select`, `picker` | BottomSheet (rendered as picker) |
| `divider`, `separator`, `line` | Divider |
| `progress`, `loading` | ProgressBar |
| `empty`, `empty state`, `no data` | EmptyState |
| `settings`, `preferences` | SettingsRow |
| `message`, `chat`, `bubble` | MessageBubble |
| `profile`, `user header` | ProfileHeader |
| `feed`, `post` | FeedItem |
| `segment`, `segmented` | SegmentedControl |

### Component Implementation Pattern

Every UI component follows this pattern:

```typescript
// src/ui-mode/components/NavBar.ts

interface NavBarProps {
  // Content (from canvas labels/text)
  title?: string
  backLabel?: string
  rightAction?: string

  // Variants
  layout: 'standard' | 'large-title' | 'search' | 'segmented'

  // Note overrides (from attached notes)
  noteOverrides?: string  // raw note text, interpreted at render time
}

function renderNavBar(
  props: Partial<NavBarProps>,
  theme: UIDesignSystem
): string {
  // 1. Apply defaults for missing props
  const merged = {
    title: props.title ?? 'Screen Title',
    layout: props.layout ?? 'standard',
    ...props
  }

  // 2. Build HTML using theme tokens as CSS custom properties
  // 3. All colors, fonts, spacing, radii come from theme — ZERO hardcoded values
  // 4. Note overrides are applied last (e.g., "transparent background" → override bg)

  return `<div style="..." data-component="nav-bar">...</div>`
}
```

**Critical rule: Every CSS value comes from the theme.** If you're writing `#ffffff` or `16px` or `border-radius: 12px` anywhere in a component, it's wrong. Use `var(--color-background)`, `var(--spacing-md)`, `var(--radius-card)`.

### Build Order

**Group 1 — Theme Foundation (Day 1)**
- `UIDesignSystem` → CSS custom property injection for viewport iframe
- Default iOS-style design system constant
- Theme application wrapper that injects `:root { --color-background: ...; --spacing-md: ...; }` etc.
- Verify: changing any token value instantly updates viewport

**Group 2 — Navigation Shell (Day 2)**
- StatusBar, NavBar (4 layouts), TabBar (3 layouts)
- These create the "phone app" feeling immediately. A frame with just a NavBar and TabBar already looks like a real app.

**Group 3 — Lists & Cards (Days 3–4)**
- Card (4 variants), ListItem (6 variants), ListGroup (3 variants), SectionHeader, Divider
- These are the most common UI patterns. A screen with a NavBar + a list of items + a TabBar covers 60% of mobile app screens.

**Group 4 — Inputs & Actions (Day 5)**
- Button (6 variants), TextInput (4 variants), SearchBar, Toggle, Checkbox, SegmentedControl, Slider
- Form screens and action patterns.

**Group 5 — Media & Feedback (Day 6)**
- ImagePlaceholder, Carousel, ProgressBar, Badge, Tag, Avatar, Alert, Toast, EmptyState, FloatingActionButton

**Group 6 — Composite Components (Day 7)**
- ProfileHeader, MessageBubble, FeedItem, SettingsRow, BottomSheet, Modal
- These combine atomic components. Build them by composing Groups 2–5.

**Day 8 — Integration testing, spatial inference tuning, responsive within frame**

### Acceptance Criteria for Vertical 2

- [ ] Draw a single rectangle in a phone frame → renders as a Card with the extracted design system
- [ ] Draw a narrow rectangle at the top → renders as a NavBar
- [ ] Draw a narrow rectangle at the bottom → renders as a TabBar
- [ ] Draw 4 equal narrow rectangles stacked → renders as a ListGroup with 4 ListItems
- [ ] Label a rectangle "button" → renders as a Button
- [ ] Label a rectangle "search" → renders as a SearchBar
- [ ] Change the design system primary color → all components in viewport update instantly
- [ ] Upload a dark-mode reference screenshot → entire viewport renders in dark mode
- [ ] Upload a bright, rounded reference screenshot → components have larger radii, lighter colors
- [ ] Every component renders with zero props (smart defaults + design system)
- [ ] Layer 1 render time stays under 50ms
- [ ] All 32 component types render correctly with the default design system
- [ ] Component text from canvas labels flows into the rendered component (label "Settings" on a ListItem → "Settings" text in the viewport)

---

## Vertical 3: Note System & Per-Component Context (3–4 days)

Notes are the killer feature that separates Aphantasia UI from a static wireframing tool. A note attached to a component becomes a mini-prompt that the renderer obeys. This is where users communicate intent that spatial inference can't capture.

### Note Data Model

```typescript
interface CanvasNote {
  id: string
  type: 'note'                    // distinct from 'rectangle', 'text', etc.
  x: number
  y: number
  width: number
  height: number
  content: string                 // the note text
  attachedTo?: string             // ID of the shape this note is attached to (explicit link)
  // If attachedTo is not set, proximity-based attachment is used
}
```

### Note Attachment Logic

Notes attach to components via two mechanisms:

1. **Explicit connection:** User draws a line from the note to a shape (or drags the note onto a shape). Sets `attachedTo` to the shape's ID.
2. **Proximity inference:** If a note has no explicit `attachedTo`, find the nearest non-note shape within a threshold distance (e.g., 60px edge-to-edge). If found, treat the note as attached to that shape.
3. **Unattached notes:** Notes that don't match either rule are treated as global context for the entire frame.

### Note Visual Design on Canvas

Notes should be visually distinct from wireframe rectangles:
- Slightly different background (warm yellow or muted color, translucent)
- Subtle "sticky note" appearance (optional subtle fold corner or pin icon)
- Smaller default size than rectangles
- When attached, a subtle dotted line connects note to its target shape
- Note text is rendered in a different (smaller, italic) font than shape labels

### How Notes Flow into Rendering

**Layer 1 (rules-based, no AI):**
Notes have limited effect at Layer 1 — the rules engine can parse simple keywords:
- "primary" or "filled" → Button variant: `primary`
- "outline" or "bordered" → Button variant: `outline`
- "3 items" or "5 items" → ListGroup renders that many items
- "dark" or "dark mode" → inverts local color tokens for that component
- "disabled" or "inactive" → renders component in disabled state
- Numbered items ("1. Settings 2. Profile 3. Help") → populates list item labels

**Layer 2 (AI-powered):**
Notes are the most powerful at Layer 2. The AI receives each component's note text as direct instructions:

```json
{
  "componentId": "shape_abc",
  "type": "navBar",
  "label": "Home",
  "attachedNote": "transparent background, no border, white text — this sits on top of a hero image",
  "globalNotes": ["App is a meditation/wellness app", "Target audience: stressed professionals"]
}
```

The AI interprets the note and returns component-specific overrides:
```json
{
  "componentId": "shape_abc",
  "overrides": {
    "style": {
      "background": "transparent",
      "borderBottom": "none",
      "color": "#ffffff"
    },
    "layout": "standard"
  }
}
```

### Note Examples (What Users Will Actually Write)

| Note Text | Attached To | Effect |
|---|---|---|
| "3 buttons: Home, Search, Profile" | TabBar | TabBar renders with exactly 3 tabs labeled Home, Search, Profile |
| "Show 5 recent orders with status badges" | ListGroup | List renders 5 items, each with a status badge (Delivered, In Transit, etc.) |
| "Primary action, full width" | Button | Button renders as primary variant, width: 100% |
| "Animate on hover, scale up slightly" | Card | Layer 2 adds hover:scale(1.02) transition to the card |
| "This is a dark section — invert colors" | Container shape | Component and children render with inverted color tokens |
| "Glassmorphism effect, blur background" | Card | Card gets backdrop-filter: blur + semi-transparent bg |
| "Show user avatar, name, and 'Edit Profile' button" | ProfileHeader | Layer 2 fills the profile header with appropriate content |
| "Error state — show red border and error message below" | TextInput | Input renders in error variant with red border + error text |

### Build Plan for Vertical 3

| Phase | Est. | Deliverable |
|---|---|---|
| Note shape type + canvas interaction | 1d | New "note" tool in toolbar, note creation, note rendering on canvas, proximity attachment logic, dotted connection lines |
| Layer 1 keyword parsing | 1d | Rules engine parses common keywords from notes, applies variant/count/state changes to Layer 1 render |
| Layer 2 note ingestion | 1d | API accepts note text per component, AI returns style/content overrides, viewport merges overrides |
| Polish + testing | 0.5-1d | Edge cases, multiple notes per component, conflicting notes, empty notes |

### Acceptance Criteria for Vertical 3

- [ ] User can select the "Note" tool from toolbar and create notes on the canvas
- [ ] Notes are visually distinct from wireframe rectangles (different appearance)
- [ ] Dragging a note near a shape → dotted line appears connecting them
- [ ] Note saying "3 items" attached to a list → Layer 1 renders 3 list items
- [ ] Note saying "primary, full width" attached to a button → Layer 1 renders primary full-width button
- [ ] Note saying "transparent background, sits on hero image" attached to NavBar → Layer 2 renders transparent nav
- [ ] Notes outside all frames are treated as global context
- [ ] Note text is included in the Layer 2 AI prompt for the attached component
- [ ] Deleting a note → viewport updates (effect is removed)
- [ ] Multiple notes on the same component → all notes are concatenated and sent to AI

---

## Vertical 4: Viewport Renderer & AI Pipeline (4–5 days)

The viewport is where the magic is visible. It shows a phone-shaped preview that updates in real-time as the user sketches on the canvas.

### Viewport Architecture

```
Canvas onStateChange
  ↓ (debounced 200ms)
UISemanticResolver
  - For each shape in the active frame:
    - Apply label-override rules (highest priority)
    - Apply spatial inference rules (position, size, containment)
    - Attach notes (proximity + explicit)
    - Resolve to UIComponentType + variant hints
  ↓
UIRenderEngine.renderLayer1(resolvedComponents, designSystem)
  - For each resolved component:
    - Call component renderer with defaults + any label-derived content
    - Apply Layer 1 note keywords (variant, count, state overrides)
    - Return HTML string
  - Assemble into phone-frame layout (respecting z-order and containment)
  - Inject design system as CSS custom properties in <style>
  ↓
ViewportPane
  - Sets iframe srcDoc with complete HTML
  - Iframe is styled to look like a phone (device chrome optional)
  - Scaled to fit the viewport panel width
```

### Phone Frame in Viewport

The viewport should feel like looking at a real phone:
- The iframe is wrapped in a subtle phone-frame bezel (rounded corners, appropriate aspect ratio)
- Optional device chrome (notch/dynamic island, home indicator bar)
- The frame scales proportionally to fit the viewport panel width
- Status bar (time, battery, signal) renders automatically at the top — always present, adapts to light/dark

### Layer 2 Integration

When the user clicks "Render" (or it auto-triggers after a pause):

```
POST /api/ui-render
  Body: {
    components: ResolvedComponent[],       // from semantic resolver
    designSystem: UIDesignSystem,          // current design system
    globalNotes: string[],                 // unattached frame notes
    frameContext: { width, height, name }  // frame metadata
  }
  ↓
Claude Sonnet processes:
  - Interprets each component's note as a specific instruction
  - Fills content (placeholder text that makes sense for the app type)
  - Selects optimal variants based on component context + global notes
  - Returns per-component overrides
  ↓
Response: {
  components: [{
    id: string,
    contentOverrides: { ... },    // text, labels, item count
    styleOverrides: { ... },      // CSS overrides from notes
    variantOverrides: { ... }     // variant selections
  }]
}
  ↓
ViewportPane merges overrides into Layer 1 output
  - Each component re-renders with AI-provided content and overrides
  - Update is progressive (components update as AI response streams)
```

### Multi-Frame Support

When multiple frames exist on the canvas:
- The viewport shows the **selected frame** (clicked on canvas, or selected via frame tab)
- A frame selector strip below the viewport shows thumbnail previews of all frames
- Clicking a thumbnail switches the viewport to that frame
- The canvas highlights the active frame with a subtle border/glow

### Build Plan for Vertical 4

| Phase | Est. | Deliverable |
|---|---|---|
| UISemanticResolver | 1d | New resolver with UI-specific spatial rules, label matching, note attachment |
| UIRenderEngine + Layer 1 | 1d | Assembles resolved components into phone-frame HTML, CSS custom property injection |
| ViewportPane component | 1d | Phone-frame styled iframe, scaling, device chrome, status bar |
| Layer 2 API + integration | 1d | `/api/ui-render` endpoint, note-to-override pipeline, progressive merge |
| Multi-frame + polish | 0.5-1d | Frame selector, thumbnail strip, active frame highlighting |

### Acceptance Criteria for Vertical 4

- [ ] Drawing shapes on canvas → viewport updates in <300ms with Layer 1 render
- [ ] Viewport looks like a real phone (device frame, status bar, proper proportions)
- [ ] Phone status bar adapts to light/dark based on design system
- [ ] NavBar at top + content in middle + TabBar at bottom → viewport looks like a real app screen
- [ ] Clicking Render → Layer 2 fills in contextually appropriate content within 5 seconds
- [ ] Notes attached to components → Layer 2 produces overrides that match the note instructions
- [ ] Creating a second frame → frame selector appears, both frames independently renderable
- [ ] Viewport scales proportionally when the panel is resized
- [ ] Design system change → viewport re-renders with new tokens immediately

---

## Vertical 5: Canvas UX Overhaul & Tool Switching (2–3 days)

The current canvas always draws rectangles regardless of which tool is selected. The toolbar needs to actually work, and UI mode needs additional tools.

### UI Mode Toolbar

The toolbar for UI mode should contain:

| Tool | Icon | Behavior |
|---|---|---|
| **Select** (V) | Cursor arrow | Click to select, drag to move, handles to resize |
| **Rectangle** (R) | Square outline | Click+drag to draw a rectangle (inferred as UI component) |
| **Text** (T) | T icon | Click to place a text element (becomes label, heading, or body text) |
| **Button** (B) | Rounded rectangle | Click+drag to draw a pre-tagged button shape |
| **Note** (N) | Sticky note icon | Click+drag to create a note (distinct appearance from rectangles) |
| **Component Picker** | Grid/puzzle icon | Opens a dropdown/popover with the 32 component types — click one to place it as a pre-tagged, pre-sized shape |

Keyboard shortcuts: V (select), R (rectangle), T (text), B (button), N (note)

### Component Picker

A popover panel listing components organized by category:
- **Navigation:** NavBar, TabBar, BottomSheet
- **Content:** Card, ListItem, ListGroup, SectionHeader, Avatar, Badge
- **Input:** Button, TextInput, SearchBar, Toggle, Checkbox, SegmentedControl
- **Media:** Image, Carousel, ProgressBar, Divider
- **Feedback:** Alert, Toast, Modal, FAB
- **Composite:** ProfileHeader, MessageBubble, FeedItem, SettingsRow

Clicking a component from the picker:
1. Creates a shape on the canvas at a sensible default size for that component type
2. Pre-tags it with the component name (label is set)
3. User places it by clicking on the canvas
4. Shape renders in the viewport as the selected component immediately

### Canvas Improvements

- **Snap-to-grid:** Optional grid overlay (8px grid) with snap behavior for precise alignment
- **Smart guides:** When dragging a shape, show alignment guides when edges or centers align with other shapes
- **Frame creation:** UI mode starts with one phone frame. "Add Frame" button (+ icon) creates a new frame to the right of the existing one with appropriate spacing.
- **Zoom-to-fit:** Double-click the canvas background or press 0 → zoom to fit all frames in view

### Build Plan for Vertical 5

| Phase | Est. | Deliverable |
|---|---|---|
| Tool switching wiring | 1d | All toolbar tools actually work, keyboard shortcuts, tool state management |
| Note tool | 0.5d | Note creation, distinct visual, proximity attachment rendering |
| Component picker | 1d | Popover panel, categorized components, click-to-place, pre-tagged shapes |
| Canvas polish | 0.5d | Snap-to-grid toggle, smart guides, add frame button, zoom-to-fit |

### Acceptance Criteria for Vertical 5

- [ ] Press R → drawing creates rectangles; press T → creates text; press N → creates notes
- [ ] Press V → enter select mode, can click/move/resize shapes
- [ ] Component picker opens, user selects "SearchBar" → shape placed on canvas at correct default size, labeled "SearchBar", renders as SearchBar in viewport
- [ ] Keyboard shortcuts work (V, R, T, B, N)
- [ ] Smart guides appear when aligning shapes
- [ ] "Add Frame" creates a new phone frame to the right
- [ ] Zoom-to-fit (press 0 or double-click bg) shows all frames

---

## Vertical 6: Export & Polish (2–3 days)

### High-Res PNG Export

The viewport renders at 2x resolution and exports as PNG:

```
1. Render the viewport HTML at 2x scale (786×1704 for iPhone 17)
2. Use html2canvas or a server-side rendering approach
3. Optionally add device frame chrome to the export
4. Download as PNG file

Alternative: Use the browser's native print/screenshot capability
via a hidden high-res iframe.
```

### Export Options
- **Screen only:** Just the UI content, no device frame
- **With device frame:** Wrapped in a phone mockup bezel
- **All screens:** Multi-frame export as a horizontal strip or grid (for sharing a flow)

### Canvas Persistence

Serialize the entire workspace to localStorage:
- `CanvasDocument` (all shapes, frames, their positions)
- `UIDesignSystem` (extracted + overrides)
- Active frame selection
- Reference screenshot thumbnail

Restore on mount. Debounced save on every state change (500ms).

### Polish Items

- [ ] Empty state: when canvas is blank, show a subtle prompt ("Draw a rectangle to start, or upload a reference screenshot")
- [ ] Viewport loading state: when Layer 2 is processing, show a subtle shimmer/skeleton on components being updated
- [ ] Error handling: if AI extraction or rendering fails, show a toast, don't break the viewport
- [ ] Performance: Layer 1 must stay under 50ms even with 30+ components
- [ ] Responsive layout: canvas and viewport panels resize gracefully

### Acceptance Criteria for Vertical 6

- [ ] User clicks "Export" → downloads a high-res PNG of the current viewport
- [ ] Export with device frame → PNG includes phone bezel
- [ ] Multi-frame export → all screens in one image
- [ ] Close and reopen the app → canvas state, design system, and shapes all restored
- [ ] Empty canvas shows helpful onboarding prompt
- [ ] Layer 2 processing shows shimmer on updating components

---

## Build Order & Timeline

```
Week 1: Vertical 1 + Vertical 2 Start
├── Days 1–2: Reference extraction pipeline (/api/ui-extract, UIDesignSystem schema, default system)
├── Days 3–4: Reference Widget UI (upload, preview, token override panel)
├── Day 5: Theme foundation (CSS custom property injection, default system, verify)
├── Days 6–7: Navigation components (StatusBar, NavBar, TabBar) + Cards

Week 2: Vertical 2 Continued + Vertical 3
├── Days 1–2: Lists, inputs, buttons — the most-used components
├── Days 3–4: Remaining components (media, feedback, composite)
├── Days 5–6: Note system (canvas interaction, Layer 1 keyword parsing)
├── Day 7: Note → Layer 2 integration

Week 3: Vertical 4 + Vertical 5
├── Days 1–2: UISemanticResolver + UIRenderEngine + ViewportPane
├── Day 3: Layer 2 API + progressive merge
├── Days 4–5: Toolbar overhaul, tool switching, component picker
├── Days 6–7: Multi-frame support, canvas polish

Week 4: Vertical 6 + End-to-End Polish
├── Days 1–2: Export (PNG, device frame, multi-frame)
├── Day 3: Canvas persistence
├── Days 4–5: End-to-end testing, performance tuning, polish
```

**Total: ~22–25 focused days.**

---

## Critical Non-Negotiables

1. **Layer 1 must feel magical without AI.** Drawing 5 shapes in a phone frame should produce something that looks like a real app screen, instantly, with zero AI calls. This is the first impression.

2. **The design system is the moat.** A rectangle on the canvas should look completely different depending on whether the reference is a banking app, a social media app, or a fitness app. Same wireframe, totally different rendered output. The design system extraction quality determines product quality.

3. **Notes are the power-user unlock.** Spatial inference handles the 80% case. Notes handle the other 20%. A user who learns to use notes effectively can produce pixel-precise prototypes without touching a design tool.

4. **Zero hardcoded values in components.** If a single component has a hardcoded color, spacing, or radius, the design system extraction is useless for that component. This is a religious rule.

5. **The viewport must feel alive.** Instant Layer 1 response when shapes change. Progressive Layer 2 updates streaming in. The viewport should never feel "loading" — it should feel like it's thinking while always showing something beautiful.

---

## Claude Code Session Instructions

When starting a Claude Code session for UI mode work, provide:

1. **This plan** (as the primary instruction set)
2. **CONTEXT.md** (for architecture rules, file structure, and engine docs)
3. **The specific vertical/phase** you're targeting this session

### Per-session scope

Each session should target ONE component group or ONE pipeline piece:

- "Build the UIDesignSystem type, the default iOS design system constant, and the CSS custom property injection function that converts a UIDesignSystem into a :root style block."
- "Build the NavBar component (all 4 layout variants) using the UIDesignSystem tokens. Must render beautifully at zero props."
- "Build the UI semantic resolver. Takes an array of canvas shapes inside a phone frame and resolves each to a UIComponentType using the spatial inference rules and label-override rules from the plan."
- "Build the Note tool for the canvas — new shape type, distinct visual, proximity-based attachment with dotted connection lines."
- "Build the reference extraction API endpoint (/api/ui-extract). Takes a base64 screenshot, sends to Claude Vision, returns UIDesignSystem JSON."

### Quality checks after each session

1. Does the viewport look like a real app screen? (Visual quality check)
2. Are all CSS values coming from design system tokens? (Zero hardcoded values)
3. Does the component render well with zero props? (Default quality check)
4. Does changing a token update the component? (Theme reactivity check)
5. Is the Layer 1 render under 50ms? (Performance check)

---

## What NOT to Build for UI v1

- ❌ Figma MCP integration — v1.5, fully mapped out below in "v1.5: Figma MCP Integration"
- ❌ Real-time collaboration — solo tool for now
- ❌ Animation previews in viewport — static renders only for v1
- ❌ Component property inspector panel — notes are the override mechanism
- ❌ Design system import from JSON/Figma tokens — screenshot extraction for v1, Figma MCP for v1.5
- ❌ Interactive prototyping (tap targets, screen transitions) — v2
- ❌ Code export (React/SwiftUI/Flutter) — v2
- ❌ Sites or Slides rendering — UI mode only
- ❌ Custom component creation — use the 32 built-in components
- ❌ Version history / undo beyond browser undo

---

## v1.5: Figma MCP Integration (Mapped Out, Built After v1)

This is the upgrade path from "screenshot extraction" to "source-of-truth extraction." In v1, users upload a screenshot and Claude Vision approximates the design system. In v1.5, users connect their Figma file and Aphantasia extracts **exact** tokens, component specs, and rendered images directly from Figma via MCP.

### Why This Changes Everything

| Dimension | v1 (Screenshot) | v1.5 (Figma MCP) |
|---|---|---|
| Color accuracy | ~90% (Vision approximation) | 100% (exact hex from variables) |
| Font identification | Category guess + Google Font proxy | Exact font family, weight, size |
| Spacing values | Pixel measurement from image | Exact values from design tokens |
| Border radii | Approximation | Exact px values |
| Component variants | N/A — Aphantasia guesses | Full variant data (states, sizes, types) |
| Dark mode | User must upload separate screenshot | Automatic via Figma variable modes |
| Design system updates | Re-upload screenshot manually | Re-sync from Figma in one click |
| Component rendering | Aphantasia's built-in components styled to match | Rendered images of actual Figma components available as reference |

Screenshot extraction is a good v1 because it has zero setup friction — no Figma account needed, no auth flow, just drag-drop. But Figma MCP is the endgame because it gives Aphantasia the exact same data a developer sees in Figma Dev Mode.

### Available Figma MCP Tools (What We Have)

Based on the connected Figma MCP server (`figma-console`), these tools are available:

**Design System Extraction (the core pipeline):**
- `figma_get_design_system_kit` — **The primary tool.** Returns tokens, components, and styles in a single call. Supports `full`, `summary`, and `compact` formats. Includes component visual specs (exact colors, padding, typography, layout), rendered screenshots, token values per mode (light/dark), and resolved style values.
- `figma_get_variables` — Design tokens/variables with CSS/Tailwind/TypeScript export. Supports filtering by collection, mode, name pattern. Handles multi-mode variables (Light/Dark). Supports `resolveAliases` to get final hex values instead of alias references.
- `figma_get_styles` — Color, text, effect, and grid styles with optional code export (CSS/Sass/Tailwind/TypeScript).

**Component Discovery & Inspection:**
- `figma_search_components` — Search by name, category, or description. Supports cross-file library search.
- `figma_get_component_details` — Full details for a specific component including all variants, properties, and keys.
- `figma_get_component` — Single component metadata or reconstruction spec. `enrich=true` adds token coverage analysis.
- `figma_get_component_for_development` — Component data optimized for implementation: layout, typography, visual properties + rendered image. **This is the key tool for mapping Figma components → Aphantasia components.**
- `figma_get_library_components` — Discover published components from shared/team library files.

**Visual Reference:**
- `figma_get_component_image` — Render any component as PNG/SVG at up to 4x scale. Returns a URL valid for 30 days.
- `figma_capture_screenshot` — Screenshot via plugin API (current state, not cloud cache). Better for validating live changes.
- `figma_take_screenshot` — Page or node screenshot via REST API.

**Context & Navigation:**
- `figma_get_selection` — Get what the user currently has selected in Figma (node IDs, names, types, dimensions).
- `figma_get_design_system_summary` — Compact overview: categories, component counts, token collection names. Low token usage, good for initial exploration.
- `figma_get_file_data` — Full file structure and document tree.

### Integration Architecture

```
┌──────────────────────────────────────────────────────────┐
│  Aphantasia Reference Panel (v1.5)                       │
│                                                          │
│  ┌──────────────┐  ┌──────────────────────────────────┐  │
│  │ Screenshot   │  │ Figma Connection                 │  │
│  │ Upload       │  │                                  │  │
│  │ (v1 path)    │  │ Connect Figma File  [paste URL]  │  │
│  │              │  │                                  │  │
│  │ ● Active     │  │ Status: Connected ✓              │  │
│  │ ○ Inactive   │  │ File: MyApp Design System        │  │
│  │              │  │ Last synced: 2 min ago            │  │
│  │              │  │                                  │  │
│  │              │  │ [Re-sync]  [Select Frame ▾]      │  │
│  └──────────────┘  └──────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Extracted Design System                            │  │
│  │ (identical panel whether from screenshot or Figma) │  │
│  │                                                    │  │
│  │ Colors: ██ ██ ██ ██ ██ ██ ██                      │  │
│  │ Typography: SF Pro Display / 17px / 590            │  │
│  │ Spacing: 4 · 8 · 12 · 16 · 24 · 32               │  │
│  │ Radii: 8 · 12 · 16 · 24 · full                    │  │
│  │                                                    │  │
│  │ Source: Figma (exact) | Confidence: 100%           │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

The key architectural insight: **the output is the same `UIDesignSystem` interface regardless of input source.** Whether tokens come from screenshot extraction (v1) or Figma MCP (v1.5), the downstream pipeline (components, renderer, viewport) doesn't care. The reference panel is the only thing that changes.

### Figma → UIDesignSystem Mapping Pipeline

This is the core extraction logic for v1.5. It replaces the Claude Vision call with direct Figma API calls:

```
Step 1: User pastes Figma file URL or selects connected file
  ↓
Step 2: Call figma_get_design_system_kit({ format: 'full', include: ['tokens', 'styles'] })
  → Returns all variables (organized by collection) + all styles + component specs
  ↓
Step 3: Map Figma variables → UIDesignSystem tokens

  Figma variable collections typically follow patterns like:
  ├── Primitives (raw values: colors/blue/500 = #3B82F6)
  ├── Semantic (mapped: color/primary = {Primitives.colors/blue/500})
  └── Component (specific: button/background = {Semantic.color/primary})

  Mapping rules:
  ├── Find the "semantic" collection (names containing: semantic, theme, alias, tokens)
  │   └── Map each variable to UIDesignSystem by name pattern:
  │       ├── */background, */bg, */surface  →  colors.background
  │       ├── */foreground, */text, */on-*    →  colors.foreground
  │       ├── */primary, */brand, */action    →  colors.primary
  │       ├── */secondary                     →  colors.secondary
  │       ├── */muted, */subtle, */disabled   →  colors.muted
  │       ├── */accent, */highlight           →  colors.accent
  │       ├── */destructive, */error, */danger→  colors.destructive
  │       ├── */border, */divider, */outline  →  colors.border
  │       ├── */card, */container, */surface-* → colors.card
  │       └── */ring, */focus                 →  colors.ring
  │
  ├── Find spacing variables:
  │   └── */spacing/*, */space/*, size/* → spacing.xs through spacing.2xl
  │       (sort by value, map to scale positions)
  │
  ├── Find radius variables:
  │   └── */radius/*, */rounded/*, */corner/* → radii.sm through radii.full
  │       (sort by value, map to scale positions)
  │
  └── Find typography styles:
      └── Call figma_get_styles({ enrich: true, export_formats: ['css'] })
          ├── Heading text styles → fonts.heading (family, weight, letterSpacing)
          ├── Body text styles → fonts.body
          ├── Caption text styles → fonts.caption
          └── Size scale → fontSizes.xs through fontSizes.3xl

  ↓
Step 4: For multi-mode variables (Light/Dark), extract both modes:
  Call figma_get_variables({ format: 'filtered', mode: 'Light', resolveAliases: true })
  Call figma_get_variables({ format: 'filtered', mode: 'Dark', resolveAliases: true })
  → Store as UIDesignSystem[] (one per mode)
  → User can toggle between modes in the reference panel
  → Viewport instantly switches light/dark

  ↓
Step 5: Component-specific token extraction
  Call figma_search_components({ query: 'Button' })
  Call figma_get_component_for_development({ nodeId: buttonNodeId })
  → Extract: height, paddingX, fontSize, borderRadius → components.button
  Repeat for: NavBar, Card, Input, ListItem, TabBar
  → Each populates the relevant components.* section of UIDesignSystem

  ↓
Step 6: Store UIDesignSystem in state
  → Identical downstream path as screenshot extraction
  → All components render with exact Figma tokens
  → Confidence: 1.0 (source of truth, not approximation)
```

### Figma Component → Aphantasia Component Mapping

Beyond just extracting tokens, v1.5 can map Figma components to Aphantasia's 32 UI components. This means when a user wireframes a screen, the viewport can render using the actual Figma component's visual spec — not just a generic component styled with the right tokens.

```
Step 1: Call figma_get_design_system_kit({ include: ['components'], includeImages: true })
  → Returns all published components with:
     - Name, description, category
     - Variant properties (e.g., Button has Size: sm/md/lg, Style: primary/secondary/ghost)
     - Visual specs per variant (exact colors, padding, typography)
     - Rendered PNG images per variant

Step 2: AI-assisted mapping
  For each Figma component, Claude maps it to the closest Aphantasia component:
  
  Figma "Button" → Aphantasia Button
    Figma variants (Primary, Secondary, Ghost, Destructive) → Aphantasia variants
    Figma Size (sm, md, lg) → Aphantasia note override ("small", "large")

  Figma "Card" → Aphantasia Card
  Figma "TextField" → Aphantasia TextInput
  Figma "NavigationBar" → Aphantasia NavBar
  etc.

Step 3: Store component mapping
  {
    figmaComponentKey: "abc123",
    figmaName: "Button",
    aphantasiaComponent: "button",
    variantMapping: {
      "Style=Primary": { variant: "primary" },
      "Style=Secondary": { variant: "secondary" },
      "Style=Ghost": { variant: "ghost" },
      "Size=Small": { noteHint: "small" },
      "Size=Large": { noteHint: "large" }
    },
    referenceImage: "https://figma-image-url..."   // rendered PNG from Figma
  }

Step 4: Enhanced viewport rendering
  When rendering a Button in the viewport:
  1. Use UIDesignSystem tokens for colors, spacing, radii (already works from v1)
  2. Additionally show the Figma-rendered reference image as a "ghost overlay"
     or side-by-side comparison so the user can verify fidelity
  3. Component picker in toolbar can show Figma component names alongside
     Aphantasia generic names (e.g., "Button (matches your DS: ActionButton)")
```

### Frame Selection: "Connect a Screen to Wireframe Against"

A powerful v1.5 feature: instead of uploading a generic screenshot, users can connect a specific Figma frame:

1. User pastes Figma URL or uses `figma_get_selection` to grab the currently selected frame
2. Aphantasia renders a thumbnail of that frame in the reference panel
3. The frame's components are analyzed — Aphantasia maps them to understand the layout vocabulary
4. User wireframes a new screen → Aphantasia renders it matching that specific frame's patterns

This is the "make something new that looks like it belongs in my existing product" flow. The reference frame provides both token extraction AND layout/component pattern context.

### "Sync Back to Figma" (v1.5 Stretch Goal)

Once the Figma MCP connection exists, the reverse direction becomes possible:

1. User wireframes a screen in Aphantasia
2. User clicks "Push to Figma"
3. Aphantasia creates a new frame in the connected Figma file using `figma_instantiate_component` for each resolved component
4. Each component is placed at the correct position with the correct variant and overrides
5. The result is a real Figma frame using the team's actual design system components

This replaces the PNG export with a native Figma output. The user goes from whiteboard sketch → design system–compliant Figma frame in seconds.

**Tools required:**
- `figma_instantiate_component` — Place component instances with variant + override props
- `figma_create_child` — Create container frames for layout
- `figma_move_node` — Position nodes within frames
- `figma_resize_node` — Size nodes to match wireframe proportions
- `figma_set_text` — Fill text content from Layer 2 AI output

### Build Plan for Figma MCP Integration

| Phase | Est. | Deliverable |
|---|---|---|
| **Connection UI** | 1d | Figma URL input in reference panel, connection status indicator, file metadata display |
| **Token extraction pipeline** | 2d | `figma_get_design_system_kit` → variable mapping → `UIDesignSystem` output. Multi-mode (light/dark) support. |
| **Style extraction** | 1d | `figma_get_styles` → typography mapping, shadow mapping, component-specific tokens |
| **Component mapping** | 2d | `figma_search_components` + `figma_get_component_for_development` → Aphantasia component mapping table, reference images |
| **Frame selection** | 1d | `figma_get_selection` + `figma_take_screenshot` → specific frame reference, layout analysis |
| **Re-sync & multi-mode** | 1d | One-click re-sync, light/dark mode toggle in reference panel, incremental updates |
| **Push to Figma (stretch)** | 3d | Reverse pipeline: resolved components → `figma_instantiate_component` → Figma frame |
| **Polish & testing** | 1d | Edge cases (missing variables, unpublished libraries, enterprise plan fallbacks), error handling |

**Total: ~9–12 days** (excluding Push to Figma stretch goal: ~8 days)

### Figma Variable Naming Convention Handling

Real-world Figma files use wildly inconsistent variable naming. The mapping pipeline must handle common patterns:

```
Pattern 1 — Slash-separated semantic:
  color/primary, color/background, spacing/md, radius/lg
  → Split on '/' → last segment is the semantic name

Pattern 2 — Dot-separated:
  colors.primary, colors.bg.default, space.4, radius.md
  → Split on '.' → navigate hierarchy

Pattern 3 — Kebab-case:
  color-primary, bg-default, spacing-md, radius-lg
  → Split on '-' → match against known semantic terms

Pattern 4 — Grouped with prefixes:
  brand/blue-500, neutral/gray-100, ui/bg-primary
  → Use AI classification when pattern matching fails:
    "Given these variable names and values, map each to the UIDesignSystem role"

Fallback — AI classification:
  If pattern matching can't confidently map >60% of variables,
  send the full variable list to Claude with the UIDesignSystem schema
  and let it figure out the mapping. This handles bespoke naming
  conventions that don't follow any standard pattern.
```

### Acceptance Criteria for Figma MCP v1.5

- [ ] User pastes a Figma file URL → tokens extracted in <10 seconds, `UIDesignSystem` populated with exact values
- [ ] Extracted colors are 100% accurate (hex values match Figma, not approximations)
- [ ] Typography extraction includes exact font family names (not proxies)
- [ ] Multi-mode support: toggling light/dark in reference panel → viewport switches instantly
- [ ] Component mapping: Aphantasia correctly maps at least 80% of common Figma components (Button, Card, Input, Nav) to its built-in components
- [ ] Re-sync: changing a variable in Figma, then clicking re-sync → viewport reflects the change
- [ ] Reference panel shows "Source: Figma (exact)" with confidence 1.0
- [ ] The downstream pipeline (components, renderer, viewport) works identically whether tokens come from screenshot or Figma
- [ ] Frame selection: user selects a frame in Figma → thumbnail appears in reference panel
- [ ] Graceful fallback: if Figma connection fails or variables aren't available (non-Enterprise plan), falls back to screenshot extraction with clear messaging
- [ ] **(Stretch)** Push to Figma: wireframe → real Figma frame with correct component instances, positioned correctly

### Migration Path: v1 → v1.5

The integration is additive, not a rewrite:

1. **Reference panel** gets a second tab: "Screenshot" (existing) and "Figma" (new)
2. **UIDesignSystem** interface stays identical — no changes to components or renderer
3. **Figma extraction** is a new pipeline that produces the same output type
4. **Users can mix**: extract from Figma, then manually override individual tokens via the existing override UI
5. **Screenshot path never goes away** — it's the zero-friction entry point for users without Figma

---

## Success Criteria for UI v1 Launch

UI v1 is ready to share when:

1. **Upload a screenshot of any mobile app → the design system is extracted and previewed in <10 seconds.** Colors, typography, spacing, and radii are visually accurate.

2. **Draw 5 shapes in a phone frame (no labels, no component picker) → viewport shows a recognizable app screen instantly.** Spatial inference correctly identifies a NavBar at top, cards in the middle, TabBar at bottom.

3. **The same 5 shapes + two different reference screenshots → two completely different-looking app screens.** Banking app reference → formal, blue, sharp corners. Social app reference → playful, colorful, rounded.

4. **Attach a note saying "3 items: Home, Search, Profile" to a TabBar shape → viewport renders a 3-tab bar with those labels.** Notes work as mini-prompts.

5. **Layer 2 render fills in contextually appropriate content based on global notes within 5 seconds.** If global notes say "fitness tracking app", list items become "Today's Workout", "Weekly Progress", etc.

6. **User can create 3 phone frames, wireframe 3 screens, and export all as a combined image.** A complete screen flow in one shareable artifact.

7. **Canvas state survives a page refresh.** Design system, shapes, notes, frames — all persisted.

8. **The entire experience feels responsive and alive.** Layer 1 updates under 300ms. No blank states. No loading spinners blocking the viewport.

If those eight things work, ship it.

---

## Success Criteria for UI v1.5 (Figma MCP)

v1.5 is ready when, in addition to everything in v1:

1. **Paste a Figma file URL → design system extracted with exact hex values, exact font names, exact spacing.** No approximation, no proxies. The reference panel shows "Source: Figma (exact)."

2. **Toggle light/dark mode in the reference panel → entire viewport switches themes instantly.** Both modes extracted from Figma variable modes in a single connection.

3. **The same wireframe renders identically whether tokens came from a Figma file or a carefully overridden screenshot extraction.** The downstream pipeline is source-agnostic.

4. **Connect Figma file, draw 5 shapes → viewport components match the connected design system closer than screenshot extraction ever could.** Exact button radii, exact card padding, exact text sizes.

5. **(Stretch) Click "Push to Figma" → a real Figma frame appears in the connected file, using actual design system component instances positioned to match the wireframe.** The loop is closed: sketch in Aphantasia, land in Figma.

---

*Aphantasia UI Experience Build Plan — 2026-03-21*
