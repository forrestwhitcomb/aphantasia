# Aphantasia/System — Development Context
## Compiled April 2026

---

## What Is Aphantasia/System

Aphantasia/System is a new sub-experience within the Aphantasia product (`/system` route) that reimagines the design tool for an AI world. It's a general-purpose design editor where users sketch on an infinite canvas, get real components backed by a design system, and ship production code.

**Core thesis:** The infinite canvas is the world. Screens are islands of structure floating in it. Inside a screen, everything is a real component with real token bindings. Outside screens, you're in freeform ideation space — sketches, annotations, flow arrows.

**Market position:** Figma's spatial thinking + Subframe's structural rigor + creative freedom to sketch before committing. Unlike Subframe (everything forced into auto-layout), Aphantasia lets you think loosely on the canvas and progressively materialize ideas into structured components.

---

## Relationship to Aphantasia/Rebtel

Aphantasia/Rebtel (`/rebtel` route) is an **internal Rebtel tool** with:
- Rebtel's exact Figma design system (KH Teka + Pano fonts, `#E31B3B` red, 312 tokens)
- 33 domain-specific component templates (contactCard, rateCard, topUpCard, phoneInput, etc.)
- A 73K `CustomCanvasEngine.tsx` driving a tldraw-derived canvas
- Chat → `RebtelFlow` → `chatToCanvas.ts` → canvas shapes → inference → spec pipeline

**Aphantasia/System is NOT an evolution of Rebtel.** It's a clean-room architecture with:
- Stock shadcn/ui-based design system (generic blue accent, Inter font)
- Generic component types (Card, Section, Button — not contactCard, paymentModule)
- New state management (React context + useReducer)
- No dependency on the canvas engine, extraction pipeline, or Figma bridge

**What carries over from Rebtel:** The *editor chrome* — the visual language of the site itself:
- Bottom-center dark floating toolbar (`rgba(26,26,46,0.92)` + backdrop blur, pill shape)
- Warm `#E2E0E0` gradient canvas with mouse-following gradient blob + SVG grain overlay
- Glass-morphism floating panels (`rgba(255,255,255,0.72)` + `blur(24px)`)
- Color language: dark navy `#1a1a2e`, warm cream `#E2E0E0`, soft `rgba(26,26,46,x)` transparency
- No top bar — everything floats over an uninterrupted canvas

---

## Architecture

### 8 Files, All in `src/system/` + `src/app/system/`

```
src/app/system/page.tsx     — Next.js route entry point (wraps Editor in EditorProvider)
src/system/types.ts         — All TypeScript types (SpecNode, Screen, EditorState, EditorAction, etc.)
src/system/tokens.ts        — ADS token system (DEFAULT_TOKENS, TOKEN_GROUPS, resolveToken helper)
src/system/registry.ts      — Component registry + variant factories + shape recognition heuristics
src/system/store.tsx         — React context + useReducer (EditorProvider, useEditor hook)
src/system/Renderer.tsx      — Recursive live component renderer (SpecNode tree → React elements)
src/system/codegen.ts        — SpecNode tree → React JSX code generator
src/system/Editor.tsx        — Main editor shell (canvas, toolbar, all floating panels)
```

### Data Model

**SpecNode** — the atomic unit. Every component in a screen is a SpecNode:
```typescript
interface SpecNode {
  id: string;
  type: ComponentType;        // "Card" | "Button" | "Text" | "Section" | etc.
  variant: string | null;     // "info" | "pricing" | "primary" | etc.
  props: Record<string, unknown>;
  children: SpecNode[];
  annotations: Annotation[];  // AI annotations pinned to this node
}
```

**Screen** — a positioned frame on the infinite canvas containing a SpecNode tree:
```typescript
interface Screen {
  id: string;
  name: string;
  x: number; y: number;      // Position on canvas
  w: number; h: number;      // Dimensions
  viewport: "mobile" | "tablet" | "desktop";
  root: SpecNode;            // The component tree
}
```

**Project** — screens + freeform sketches + flow arrows:
```typescript
interface Project {
  screens: Screen[];
  sketches: CanvasSketch[];   // Freeform rectangles/notes on canvas
  arrows: FlowArrow[];       // Connections between screens
}
```

### State Management

Single `useReducer` with `EditorState` + `EditorAction` pattern. Actions include:
- `SET_TOOL`, `SET_ZOOM`, `SET_PAN` — canvas controls
- `SELECT_NODE`, `UPDATE_NODE`, `SWAP_VARIANT` — component editing
- `ADD_COMPONENT`, `DELETE_NODE` — tree mutations
- `ADD_ANNOTATION` — AI annotations on nodes
- `ADD_SKETCH`, `ADD_SCREEN` — canvas-level additions
- `UPDATE_TOKEN` — design system token changes (cascade to all components)
- `TOGGLE_LIVE`, `TOGGLE_CHAT` — mode switches

### Component Registry

Each component type has named **variants** that map to factory functions producing full SpecNode subtrees:

| Component | Variants |
|-----------|----------|
| Card | info, pricing, image, stat, profile |
| Section | hero, features, cta, split, stats |
| Button | primary, secondary, outline, ghost, destructive |
| Text | h1, h2, h3, p, caption, label |
| Input | text, email, password, search, textarea |
| Badge | default, secondary, outline, destructive |
| Avatar | circle, square |
| Dropdown | default |
| Tabs | default, pills |
| Toggle | default |
| Image | default, rounded |
| Separator | default |
| Nav | top, sidebar |

Switching a Card from "info" to "pricing" replaces the entire children array (not just a style change). This is how Figma component variants work, but with real shippable component trees.

### Shape Recognition

When users draw inside a screen frame, heuristics map rectangle dimensions to component types:
- Height < 44px → Button
- Height < 56px, width > 140px → Input
- Aspect ratio > 4 → Separator
- Width < 80, height < 80 → Avatar
- Height > 250 → Section (hero)
- Default → Card (info)

Drawing **outside** any screen frame creates a freeform canvas sketch (ideation artifact).

### Live Renderer

`Renderer.tsx` walks the SpecNode tree recursively and renders each node as a real React element styled via design tokens. Two modes:
- **Design mode:** Components show selection outlines, hover highlights, annotation badges. Clicking selects.
- **Live mode:** Selection UI hidden. Interactive components work: Dropdowns open/close, Toggles slide, Tabs switch, Buttons press with scale animation.

### Code Generator

`codegen.ts` walks the SpecNode tree and produces React JSX. Annotations export as code comments. The output is a direct projection of the document — no AI involved, no lossy conversion.

### Token Cascade

All components render using `resolveToken()` which maps token paths (e.g., `"brand.primary"`) to values from the active token set. Changing a token in the System panel updates all components across all screens instantly. This is the core value proposition: the design system is live, structural, and shippable.

---

## What's Working in the Current Build

1. **Infinite canvas** — pan (drag/scroll), zoom (pinch/ctrl+scroll/+/-), warm gradient background with mouse-following blob, grain overlay
2. **Multiple screens** — Desktop Landing (1280×960 with Nav+Hero+Stats+Features+CTA), Desktop Pricing (1280×680 with 3 pricing cards), Mobile Home (393×852 with cards). Flow arrows between screens.
3. **Drawing** — Press R for draw mode. Inside a screen → recognized as component. Outside → canvas sketch. Press V to return.
4. **Component palette** — pops up from + button in bottom toolbar. Click to add any component type to active screen.
5. **Live mode** — Toggle in toolbar. Dropdowns, Toggles, Tabs, Buttons all interactive.
6. **Variant switching** — Select component → Variants tab → click to swap entire subtree.
7. **Property editing** — Select component → Props tab → edit text content, labels, placeholders inline.
8. **AI annotations** — Select component → add annotation text. Gold 📌 badges appear on annotated nodes.
9. **Code export** — Code tab shows React JSX from active screen. Copy button. Deploy to Vercel button (stubbed).
10. **Design system** — System tab with color pickers and value editors for all tokens. Changes cascade instantly.
11. **AI chat** — Glass panel top-left. Conversational stub (responses explain what production AI would do).
12. **Keyboard shortcuts** — V (select), R (draw), H (hand), Delete (remove component).

---

## What's NOT Built Yet

### High Priority (MVP)
- **Real AI integration** — Chat should call Anthropic API with spec tree context and generate SpecNodes directly. Annotation "Apply" should send targeted subtree + instruction to AI and return a SpecNodePatch.
- **Drag-to-reorder** — Components within a screen can't be reordered by dragging yet.
- **Inline text editing** — Double-click to edit text content directly in the viewport (currently only via property panel).
- **Undo/redo** — No history stack yet. Need action-level undo.
- **Screen resize handles** — Screens have fixed dimensions, can't be resized by dragging.
- **Responsive breakpoints** — Same spec tree rendered at different viewport widths.
- **Persistent storage** — Everything resets on refresh. Need project save/load.

### Medium Priority
- **Edit propagation** — Instance/Group/Global scoping (per the spec: "all buttons in cards use secondary"). PropagationRule system.
- **Figma import** — Extract components from a connected Figma file into the registry.
- **GitHub/Vercel deployment** — Wire up the export pipeline to actually push code and deploy.
- **React export** — Full Next.js project generation from spec trees.
- **Dark mode** — Token set for dark mode, toggle in preview.
- **Navigation links** — Wire screen-to-screen navigation in preview mode.
- **Component composition** — Drag components into other components (e.g., button into card).

### Lower Priority
- **Custom variant creation** — Users define new variants from existing components.
- **System promotion** — Export accumulated customizations as a standalone design system.
- **MCP server** — Expose spec tree via MCP for external agents (Claude Code, Cursor).
- **Multiplayer** — Real-time collaboration.
- **Animation export** — CSS animation hints from behavior annotations.
- **Screen archetypes** — Templates for common screen patterns (dashboard, settings, auth flow).

---

## Dependencies

The system module uses only what's already in the Aphantasia repo:
- **React 19** + **Next.js 16** (existing)
- **lucide-react** (existing — icons for toolbar)
- **TypeScript** (existing)
- **Tailwind** (available but Editor uses inline styles to match Rebtel's glass-morphism approach)

No new dependencies needed. The `@anthropic-ai/sdk` is already in package.json for when AI integration is wired up.

---

## File Locations

All files live cleanly within the existing repo structure:
```
aphantasia/
├── src/
│   ├── app/
│   │   ├── system/
│   │   │   └── page.tsx              ← NEW: /system route
│   │   ├── rebtel/                   ← EXISTING: untouched
│   │   └── ...
│   ├── system/                       ← NEW: all system module code
│   │   ├── types.ts
│   │   ├── tokens.ts
│   │   ├── registry.ts
│   │   ├── store.tsx
│   │   ├── Renderer.tsx
│   │   ├── codegen.ts
│   │   └── Editor.tsx
│   ├── rebtel/                       ← EXISTING: untouched
│   └── ...
```

No existing files were modified. The system module is entirely additive.

---

## Design Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Canvas vs viewport-first | Infinite canvas with screen frames | User wants spatial thinking + ability to sketch outside screens |
| Canvas engine | Custom (no tldraw dependency) | Pan/zoom/draw is simple enough; avoids 73K engine complexity |
| Component library | Stock shadcn/ui (generic) | General-purpose tool, not Rebtel-specific |
| State management | React context + useReducer | Simple, no external deps, action-based for future undo |
| Editor chrome | Rebtel visual language | Bottom dark toolbar, warm gradient, glass panels — carries brand forward |
| Variant system | Full subtree replacement | Not just style changes — a pricing card has different children than an info card |
| Token cascade | In-memory resolution | `resolveToken()` at render time, no CSS variable injection yet |
| AI model | Explicit invocation (turbo button) | No background calls, no invisible costs, tool works without AI |
| Code generation | Direct tree walk | Pure function of document, no AI involved in export |

---

## To Run

```bash
cd aphantasia
npm run dev
# Visit http://localhost:3000/system
```

All existing routes (`/`, `/rebtel`, `/rebtel/canvas`, `/internal`, `/preview`) continue working unchanged.

---

## Key Insight for Next Steps

The spec document (APHANTASIA_IMPLEMENTATION_SPEC.md) describes an 8-sprint MVP plan. The current /system build covers roughly **Sprint 1** (token system + component rendering) and parts of **Sprint 2** (SpecNode tree + dual authoring via canvas drawing and palette) and **Sprint 3** (property panel + variant editing). The next logical steps are:

1. **Wire real AI** — The chat and annotation infrastructure is built. Need to connect to Anthropic API with spec tree serialization as context, have the AI return SpecNode patches.
2. **Undo/redo** — Before users do real work, they need to be able to undo.
3. **Persistent storage** — Save/load projects (localStorage initially, then backend).
4. **Drag-to-reorder** — Critical for the "viewport as primary authoring surface" vision.
5. **Inline text editing** — Double-click to edit, the most natural interaction.

The architecture is clean and extensible. Each of these is a focused addition, not a rewrite.
