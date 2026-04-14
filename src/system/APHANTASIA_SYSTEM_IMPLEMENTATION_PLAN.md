# Aphantasia/System — Enterprise Implementation Plan

**Version:** 1.0  
**Date:** April 13, 2026  
**Target:** Claude Code agent-ready execution spec  
**Scope:** Transform the current 8-file proof-of-concept into an enterprise-grade design-to-code platform

---

## Executive Summary

Aphantasia/System currently has a working infinite canvas, multi-screen rendering, a SpecNode tree model, variant switching, token cascade, shape recognition, and stubbed AI/export. This plan transforms it into a shippable product across **6 phases** with **32 discrete work packages**. Each package is scoped to be completable in a single Claude Code session.

The architecture principle throughout: **the 8-file boundary is sacred.** We add new files only for genuinely new concerns (AI service, persistence layer, drag-drop engine). Existing files grow via targeted additions to the reducer, registry, renderer, and editor.

---

## Architecture Principles

1. **SpecNode tree is the single source of truth.** Every feature (AI, persistence, export, collaboration) reads from and writes to the same tree. No shadow state.
2. **Actions are the only mutation path.** Every state change goes through `EditorAction` dispatch. This gives us undo/redo for free once we wrap the reducer in a history middleware.
3. **Tokens are the contract layer.** Components never use hardcoded values. The token system is what makes "change brand color" cascade everywhere and what makes design system import/export meaningful.
4. **AI is a SpecNode factory.** The AI doesn't render UI — it produces SpecNode patches that flow through the same dispatch/render pipeline as manual edits. This is the key architectural insight that keeps the system deterministic.
5. **Progressive enhancement.** Every phase produces a usable product. Phase 1 alone makes the tool genuinely useful. Each subsequent phase widens the audience.

---

## File Architecture (Target State)

```
src/system/
├── types.ts              # EXISTING — extended with new types
├── tokens.ts             # EXISTING — extended with theme presets + dark mode
├── registry.ts           # EXISTING — extended with new components + archetype screens
├── store.tsx             # EXISTING — wrapped with history middleware, new actions
├── Renderer.tsx          # EXISTING — extended with drag-drop, inline editing
├── codegen.ts            # EXISTING — extended with full Next.js project generation
├── Editor.tsx            # EXISTING — extended with new panels, keyboard shortcuts
│
├── ai/
│   ├── service.ts        # NEW — Anthropic API client, spec tree serialization, prompt engineering
│   ├── prompts.ts        # NEW — System prompts, few-shot examples, output schemas
│   └── patches.ts        # NEW — SpecNodePatch application, conflict resolution, validation
│
├── persistence/
│   ├── storage.ts        # NEW — Project save/load (localStorage → IndexedDB → cloud)
│   ├── autosave.ts       # NEW — Debounced autosave, dirty tracking, recovery
│   └── migrations.ts     # NEW — Schema versioning for stored projects
│
├── dnd/
│   ├── engine.ts         # NEW — Drag-drop state machine, hit testing, insertion indicators
│   └── reorder.ts        # NEW — Tree reorder logic (sibling moves, cross-parent reparenting)
│
├── export/
│   ├── nextjs.ts         # NEW — Full Next.js project scaffold generation
│   ├── html.ts           # NEW — Static HTML/CSS export (no framework)
│   ├── figma.ts          # NEW — Figma REST API import + token extraction
│   └── deploy.ts         # NEW — GitHub push + Vercel deployment pipeline
│
├── collab/               # Phase 6 — future
│   ├── provider.ts       # Yjs + WebSocket provider
│   └── cursors.ts        # Multi-cursor awareness
│
src/app/system/
├── page.tsx              # EXISTING — entry point
└── api/
    ├── ai/route.ts       # NEW — Server-side Anthropic API proxy
    ├── deploy/route.ts   # NEW — Server-side GitHub/Vercel orchestration
    └── figma/route.ts    # NEW — Server-side Figma API proxy
```

---

## Phase 1: Core Editing Foundation

**Goal:** Make the editor feel like a real tool, not a demo. After this phase, someone can sit down and build a multi-screen project and not lose their work.

### 1.1 — Undo/Redo History Stack

**File changes:** `store.tsx`, `types.ts`, `Editor.tsx`

**Approach:** Wrap the existing `editorReducer` in a history middleware. This is the standard pattern — the middleware intercepts actions, pushes previous states onto a stack, and adds `UNDO`/`REDO` actions.

```typescript
// types.ts additions
type EditorAction =
  | ... existing ...
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SNAPSHOT" }  // Force a history checkpoint

// store.tsx additions
interface HistoryState {
  past: EditorState[];
  present: EditorState;
  future: EditorState[];
}

function historyReducer(history: HistoryState, action: EditorAction): HistoryState {
  if (action.type === "UNDO") {
    if (history.past.length === 0) return history;
    const prev = history.past[history.past.length - 1];
    return {
      past: history.past.slice(0, -1),
      present: prev,
      future: [history.present, ...history.future],
    };
  }
  if (action.type === "REDO") {
    if (history.future.length === 0) return history;
    const next = history.future[0];
    return {
      past: [...history.past, history.present],
      present: next,
      future: history.future.slice(1),
    };
  }

  const newPresent = editorReducer(history.present, action);
  if (newPresent === history.present) return history;

  // Coalesce rapid token/pan/zoom changes (don't pollute history)
  const skipHistory = ["SET_PAN", "SET_ZOOM", "SET_TOOL", "SELECT_NODE",
                       "TOGGLE_LIVE", "TOGGLE_CHAT", "TOGGLE_PALETTE", "SET_PANEL",
                       "SET_ACTIVE_SCREEN"].includes(action.type);
  if (skipHistory) return { ...history, present: newPresent };

  return {
    past: [...history.past.slice(-50), history.present], // cap at 50
    present: newPresent,
    future: [], // clear redo on new action
  };
}
```

**Editor.tsx:** Add Cmd+Z / Cmd+Shift+Z keyboard shortcuts. Show undo/redo buttons in toolbar (dimmed when stack is empty). Badge showing undo depth on hover.

**Acceptance criteria:**
- Cmd+Z undoes the last structural change (add component, delete, swap variant, update props)
- Cmd+Shift+Z redoes
- Pan/zoom/selection changes don't create history entries
- History capped at 50 entries
- Undo/redo buttons in toolbar with disabled states

---

### 1.2 — Persistent Storage (localStorage → IndexedDB)

**New files:** `persistence/storage.ts`, `persistence/autosave.ts`, `persistence/migrations.ts`  
**File changes:** `store.tsx`, `Editor.tsx`, `types.ts`

**Storage layer:**

```typescript
// persistence/storage.ts
interface StoredProject {
  version: number;          // Schema version for migrations
  id: string;               // UUID
  name: string;
  updatedAt: string;        // ISO timestamp
  state: EditorState;       // Full serialized state
  thumbnail?: string;       // Canvas screenshot as data URL (for project picker)
}

// Two backends, same interface:
interface StorageBackend {
  listProjects(): Promise<StoredProject[]>;
  loadProject(id: string): Promise<StoredProject | null>;
  saveProject(project: StoredProject): Promise<void>;
  deleteProject(id: string): Promise<void>;
}

// Phase 1: localStorage (simple, works immediately)
// Phase 2: IndexedDB (larger quota, binary data, thumbnails)
// Phase 5: Cloud sync via Supabase/Clerk
```

**Autosave:** Debounce saves at 2 seconds after last structural change. Show a subtle "Saving..." → "Saved" indicator in the toolbar (like Google Docs). On page load, check for recovered state and prompt "Resume where you left off?"

**Project picker:** New screen shown when no project is loaded. Grid of project cards with thumbnails, name, last-modified. "New Project" and "Import" buttons. This replaces the hardcoded `createDemoProject()` — the demo project becomes a template option.

**Types additions:**

```typescript
// types.ts
interface ProjectMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

type EditorAction =
  | ... existing ...
  | { type: "LOAD_PROJECT"; state: EditorState }
  | { type: "NEW_PROJECT"; template?: "blank" | "landing" | "dashboard" | "mobile" }
  | { type: "RENAME_PROJECT"; name: string }
```

**Migrations:** Each stored project has a `version` number. On load, run through a migration chain. This is critical for not breaking users' saved work as the schema evolves.

```typescript
// persistence/migrations.ts
type Migration = (state: any) => any;

const MIGRATIONS: Record<number, Migration> = {
  1: (s) => s, // initial version
  2: (s) => ({ ...s, project: { ...s.project, arrows: s.project.arrows ?? [] } }),
  // future migrations here
};
const CURRENT_VERSION = 2;

export function migrate(stored: StoredProject): StoredProject {
  let { version, state } = stored;
  while (version < CURRENT_VERSION) {
    version++;
    state = MIGRATIONS[version](state);
  }
  return { ...stored, version, state };
}
```

**Acceptance criteria:**
- Projects persist across page refreshes
- Autosave with visual indicator
- Project picker on initial load
- "New Project" with template options (blank, landing page, dashboard, mobile app)
- Demo project available as "Landing Page" template
- Schema migration system prevents data loss on updates
- "Export Project" downloads JSON backup

---

### 1.3 — Inline Text Editing

**File changes:** `Renderer.tsx`, `store.tsx`, `types.ts`

**Interaction:** Double-click any Text node in design mode → text becomes a `contentEditable` span with a subtle blue outline. Type to edit. Click away or press Escape to commit. Press Enter in single-line contexts (headings, buttons, badges) to commit. Press Enter in paragraph/textarea contexts to add a newline.

**Implementation in Renderer.tsx:**

The Text node renderer needs a local `editing` state. When `editing === true`:
- Render a `contentEditable` div instead of a static span
- Auto-focus and select all text on mount
- On blur or Escape: dispatch `UPDATE_NODE` with new content, set `editing = false`
- Suppress the parent `onSelect` click handler during editing

For non-Text nodes with text props (Button `label`, Badge `label`, Input `placeholder`):
- Same double-click-to-edit pattern
- The editable field targets the specific prop (`label`, `placeholder`, etc.)

```typescript
// types.ts addition
type EditorAction =
  | ... existing ...
  | { type: "START_EDITING"; nodeId: string; prop: string }
  | { type: "STOP_EDITING" }

// In EditorState:
editingNodeId: string | null;
editingProp: string | null;
```

**Acceptance criteria:**
- Double-click any text to edit inline
- Cursor appears, text is editable
- Changes commit on blur, Escape, or Enter (single-line)
- Undo works on text edits (they create history entries)
- Works for Text content, Button labels, Badge labels, Input placeholders, Nav brand text

---

### 1.4 — Drag-to-Reorder Components

**New files:** `dnd/engine.ts`, `dnd/reorder.ts`  
**File changes:** `Renderer.tsx`, `store.tsx`, `types.ts`

**Interaction model:** In design mode, drag a component's handle (left edge) to reorder it among siblings. A blue insertion line appears between components showing where it will land. Release to drop.

**Drag state machine (dnd/engine.ts):**

```
IDLE → (mousedown on handle) → PENDING → (mousemove > 5px) → DRAGGING → (mouseup) → IDLE
                                        → (mouseup < 5px) → IDLE (was a click, not drag)
```

During DRAGGING:
- The dragged component renders at 50% opacity in its original position
- A ghost preview follows the cursor
- Hit-test against sibling boundaries to compute insertion index
- Blue 2px line renders at the computed insertion point

**Tree reorder (dnd/reorder.ts):**

```typescript
// types.ts addition
type EditorAction =
  | ... existing ...
  | { type: "REORDER_NODE"; nodeId: string; targetParentId: string; insertIndex: number }

// store.tsx: The REORDER_NODE handler removes the node from its current parent
// and inserts it into the target parent at the given index.
// For Phase 1, only sibling reorder (same parent). Phase 3 adds cross-parent.
```

**Acceptance criteria:**
- Drag handle appears on hover (left edge, 4px wide, subtle grip dots)
- Smooth drag with ghost preview
- Blue insertion indicator between siblings
- Drop reorders within same parent
- Undo reverses reorder
- Cannot drag in live mode

---

### 1.5 — Screen Resize Handles

**File changes:** `Editor.tsx`, `store.tsx`, `types.ts`

**Interaction:** In select mode, the active screen shows resize handles on right edge and bottom edge. Drag to resize. Shift+drag to maintain aspect ratio. The viewport type auto-updates based on width:
- ≤ 428px → mobile
- ≤ 834px → tablet  
- > 834px → desktop

**New action:**

```typescript
type EditorAction =
  | ... existing ...
  | { type: "RESIZE_SCREEN"; id: string; w: number; h: number }
```

**Viewport presets:** Dropdown in toolbar near screen name with common sizes:
- iPhone 15 Pro (393 × 852)
- iPhone 15 Pro Max (430 × 932)
- iPad (834 × 1194)
- Desktop HD (1280 × 800)
- Desktop FHD (1440 × 900)
- Desktop 4K (1920 × 1080)

**Acceptance criteria:**
- Right and bottom resize handles on active screen
- Drag to resize with live preview
- Minimum size: 320 × 480
- Viewport type auto-classifies
- Viewport preset picker in toolbar
- Undo works on resize

---

## Phase 2: AI Integration

**Goal:** Wire the AI chat and annotation system to Anthropic's API. The AI becomes a SpecNode factory — it understands the component registry, token system, and current screen context, and produces structured patches.

### 2.1 — AI Service Layer

**New files:** `ai/service.ts`, `ai/prompts.ts`, `ai/patches.ts`  
**New API route:** `src/app/system/api/ai/route.ts`

**Architecture:** The browser sends a request to our Next.js API route (to keep the API key server-side). The route calls Anthropic's API and returns structured SpecNode data.

**ai/service.ts — Client-side orchestration:**

```typescript
interface AIRequest {
  mode: "chat" | "annotation";
  message: string;
  context: {
    activeScreen: Screen;                    // Current screen with full spec tree
    selectedNode?: SpecNode;                 // For annotation mode
    tokens: Record<string, string>;          // Active token set
    registry: string[];                      // Available component types
    projectScreenNames: string[];            // For cross-screen awareness
  };
}

interface AIResponse {
  explanation: string;                       // Natural language response for chat
  patches: SpecNodePatch[];                  // Structural changes to apply
}

type SpecNodePatch =
  | { op: "add"; parentId: string; index: number; node: SpecNode }
  | { op: "replace"; nodeId: string; node: SpecNode }
  | { op: "update"; nodeId: string; props: Record<string, unknown> }
  | { op: "delete"; nodeId: string }
  | { op: "reorder"; nodeId: string; newIndex: number }
  | { op: "updateTokens"; tokens: Record<string, string> }

async function callAI(request: AIRequest): Promise<AIResponse> {
  const res = await fetch("/system/api/ai", {
    method: "POST",
    body: JSON.stringify(request),
  });
  return res.json();
}
```

**ai/prompts.ts — System prompt engineering:**

The system prompt is the most critical piece. It must:
1. Define the SpecNode schema precisely (the AI must produce valid trees)
2. List all component types and their variants with concrete examples
3. Explain the token system and how components reference tokens
4. Provide few-shot examples of common operations
5. Constrain output to the JSON patch schema

```typescript
export function buildSystemPrompt(context: AIRequest["context"]): string {
  return `You are the AI engine inside Aphantasia, a design-to-code editor.
You output ONLY valid JSON matching the SpecNodePatch[] schema.

## Component Registry
${JSON.stringify(Object.keys(REGISTRY))}

## Available Variants
${Object.entries(REGISTRY).map(([type, def]) =>
  `${type}: ${Object.keys(def.variants).join(", ")}`
).join("\n")}

## Current Token Set
${JSON.stringify(context.tokens, null, 2)}

## Current Screen: "${context.activeScreen.name}"
${JSON.stringify(serializeSpecTree(context.activeScreen.root), null, 2)}

## Output Schema
Respond with JSON: { "explanation": "...", "patches": [...] }
Each patch: { "op": "add"|"replace"|"update"|"delete"|"reorder"|"updateTokens", ... }

## Rules
- All component types must be from the registry
- All variants must be valid for their component type
- Use token paths (e.g., "brand.primary") in style-related props, not raw values
- When adding sections, include full children trees (don't add empty containers)
- Prefer existing patterns from the current screen when extending it
- For "make it better" type requests, focus on content quality and visual hierarchy

## Few-Shot Examples
...`;
}
```

**ai/patches.ts — Patch application + validation:**

```typescript
export function validatePatch(patch: SpecNodePatch, state: EditorState): ValidationResult {
  // Check node IDs exist for replace/update/delete/reorder
  // Check component types are in registry
  // Check variants are valid for component type
  // Check parent exists for add operations
}

export function applyPatches(patches: SpecNodePatch[]): EditorAction[] {
  // Convert patches to EditorActions
  // Order: deletes first (bottom-up), then reorders, then updates, then adds
  // Return array of actions to dispatch sequentially
}
```

**API route (src/app/system/api/ai/route.ts):**

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // uses ANTHROPIC_API_KEY env var

export async function POST(req: Request) {
  const body = await req.json();
  const systemPrompt = buildSystemPrompt(body.context);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: body.message }],
  });

  // Parse and validate the response
  const text = response.content
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("");

  const parsed = JSON.parse(text);
  return Response.json(parsed);
}
```

**Acceptance criteria:**
- AI calls go through server-side API route (key never exposed)
- System prompt includes full context (screen tree, tokens, registry)
- Response parsed into validated SpecNodePatch[]
- Invalid patches rejected with error message in chat
- Streaming support (explanation streams while patches are applied at end)

---

### 2.2 — AI Chat Integration

**File changes:** `Editor.tsx`, `store.tsx`

Wire the existing chat panel to the real AI service. The chat should feel like talking to a design partner who can directly manipulate the canvas.

**Chat flow:**
1. User types message in chat input
2. Show "thinking" indicator (animated dots)
3. Stream the explanation text into the chat
4. When patches arrive, apply them with a brief animation (new nodes fade in, deleted nodes fade out)
5. Show a summary below the AI message: "Added 3 components, updated 2 tokens"

**Context injection:** Before each message, the service serializes:
- The active screen's full SpecNode tree
- The selected node (if any) — so "make this bigger" has a target
- Token values
- Other screen names (for "add a link to the pricing page")

**Suggested prompts:** When chat is empty, show 4 tappable suggestion chips:
- "Add a hero section"
- "Create a pricing page"
- "Make the design more modern"
- "Add a contact form"

**Message types in chat:**
- User messages (dark bubble, right-aligned) — existing
- AI explanations (light bubble, left-aligned) — existing  
- Patch summaries (compact, icon-based) — NEW: "✓ Added Section (hero) · Updated 2 props"
- Error messages (red tint) — NEW: "I couldn't apply that change because..."

**Acceptance criteria:**
- Real AI responses from Anthropic API
- Streaming explanation text
- Patches applied to canvas after response
- Animated node additions/deletions
- Patch summary in chat
- Error handling with user-friendly messages
- 4 suggestion chips on empty chat

---

### 2.3 — Annotation AI ("Apply" Button)

**File changes:** `Editor.tsx`, `Renderer.tsx`

The annotation system already exists (gold 📌 badges on nodes). Now wire the "Apply" button to send the annotation text + targeted subtree to the AI.

**Flow:**
1. User selects a component, writes annotation: "Make this a dark-themed card with gradient background"
2. User clicks "Apply" (new button next to existing "Add")
3. The AI receives ONLY the annotated node's subtree + the annotation text
4. The AI returns a `replace` patch for that specific node
5. The patched subtree replaces the original
6. Annotation is marked as `applied: true` (gets a green checkmark instead of gold pin)

**Batch apply:** If multiple annotations exist on a node, "Apply All" sends them all as a single request with instructions to address each one.

**Annotation types become meaningful:**
- `ai` → Generates a patch when applied
- `note` → Informational, never applied (gray pin)
- `behavior` → Describes interaction behavior, included in code export as comments
- `requirement` → Included in AI context as constraints

**Acceptance criteria:**
- "Apply" button on each AI annotation
- Sends targeted subtree + annotation to AI
- Replaces node subtree with AI response
- Applied annotations show green checkmark
- "Apply All" for multiple annotations
- "Undo" reverses the AI application
- Annotation type selector (ai/note/behavior/requirement)

---

### 2.4 — AI-Powered Screen Generation

**File changes:** `Editor.tsx`, `ai/service.ts`

Beyond editing existing screens, the AI should generate entire new screens from descriptions.

**"New Screen from Description" flow:**
1. In the project picker or via a toolbar action, user types: "Create a dashboard with user stats, recent activity feed, and a sidebar nav"
2. AI generates a complete SpecNode tree for the screen
3. Screen appears on canvas with auto-positioned placement (to the right of existing screens)
4. User can edit normally from there

**Screen archetypes (registry.ts additions):**

Add factory functions for common screen patterns that the AI can use as starting points:

```typescript
export const SCREEN_ARCHETYPES = {
  "landing-page": { viewport: "desktop", w: 1280, h: 960, description: "Marketing landing page" },
  "dashboard":    { viewport: "desktop", w: 1440, h: 900, description: "Analytics dashboard" },
  "settings":     { viewport: "desktop", w: 1280, h: 800, description: "Settings page" },
  "auth":         { viewport: "mobile",  w: 393, h: 852,  description: "Login / signup" },
  "profile":      { viewport: "mobile",  w: 393, h: 852,  description: "User profile" },
  "feed":         { viewport: "mobile",  w: 393, h: 852,  description: "Content feed" },
  "checkout":     { viewport: "desktop", w: 1280, h: 800, description: "E-commerce checkout" },
  "pricing":      { viewport: "desktop", w: 1280, h: 800, description: "Pricing comparison" },
};
```

**Acceptance criteria:**
- "Generate Screen" option in new screen flow
- Text input for screen description
- AI generates complete SpecNode tree
- Screen auto-positioned on canvas
- Archetype templates available as starting points
- Generated screens editable immediately

---

## Phase 3: Design System Power

**Goal:** Make the token system production-grade. Import from Figma, export as code, support dark mode, and allow custom component creation.

### 3.1 — Theme Presets + Dark Mode

**File changes:** `tokens.ts`, `Editor.tsx`, `store.tsx`, `types.ts`

**Theme presets:** Bundle 6-8 curated token sets that users can switch between:

```typescript
export const THEME_PRESETS: Record<string, { name: string; tokens: Partial<Record<string, string>> }> = {
  default: { name: "Default Blue", tokens: DEFAULT_TOKENS },
  dark: { name: "Dark Mode", tokens: { "bg.page": "#0f172a", "bg.card": "#1e293b", ... } },
  warm: { name: "Warm Earth", tokens: { "brand.primary": "#d97706", ... } },
  minimal: { name: "Minimal Mono", tokens: { "brand.primary": "#18181b", ... } },
  vibrant: { name: "Vibrant Pop", tokens: { "brand.primary": "#7c3aed", ... } },
  corporate: { name: "Corporate Blue", tokens: { "brand.primary": "#1d4ed8", ... } },
  nature: { name: "Forest Green", tokens: { "brand.primary": "#059669", ... } },
  sunset: { name: "Sunset Gradient", tokens: { "brand.primary": "#e11d48", ... } },
};
```

**Dark mode architecture:**

Add a `colorScheme` field to `EditorState`:

```typescript
// types.ts
interface EditorState {
  ... existing ...
  colorScheme: "light" | "dark";
  darkTokens: Record<string, string>;  // Dark mode overrides
}
```

The `resolveToken` function checks `colorScheme` and uses `darkTokens` when in dark mode. The System panel gets a light/dark toggle. Users edit light and dark tokens separately.

**Theme panel redesign:** Replace the flat token editor with a themed panel:
- Top: theme preset grid (small cards with color swatches)
- Middle: light/dark mode toggle  
- Bottom: token editor grouped by category (existing, but now mode-aware)

**Acceptance criteria:**
- 8 theme presets with one-click switching
- Dark mode token set with toggle
- System panel shows light/dark mode toggle
- Token edits apply to current color scheme only
- Theme switcher shows live preview thumbnails
- "Reset to preset" option

---

### 3.2 — Expanded Component Registry

**File changes:** `registry.ts`, `Renderer.tsx`, `types.ts`

Add the components people actually need for real apps:

**New component types:**

| Component | Variants | Description |
|-----------|----------|-------------|
| Table | default, striped, compact | Data table with headers and rows |
| Modal | default, alert, form | Overlay dialog |
| Toast | success, error, warning, info | Notification banner |
| Progress | bar, circle, steps | Progress indicators |
| Breadcrumb | default, slash, arrow | Navigation breadcrumb |
| Sidebar | default, collapsed | App sidebar navigation |
| Footer | simple, links, newsletter | Page footer |
| Form | login, signup, contact, search | Complete form compositions |
| Chart | bar, line, pie, donut | Data visualization placeholders |
| Skeleton | card, text, avatar, table | Loading state placeholders |
| Accordion | default | Expandable content sections |
| Alert | info, success, warning, error | Inline alert banners |

**Each new component needs:**
1. `ComponentDef` in `REGISTRY` (icon, category, variants)
2. `makeSpec()` factory function (full subtree for each variant)
3. `NodeRenderer` case in `Renderer.tsx` (visual rendering + live interactivity)
4. Shape recognition heuristic updates if applicable

**Acceptance criteria:**
- All 12 new component types available in palette
- Each has at least 2 variants
- Full rendering in design and live mode
- Interactive where appropriate (Accordion collapses, Modal opens/closes in live mode)
- Code export produces correct JSX for all new types

---

### 3.3 — Figma Design System Import

**New files:** `export/figma.ts`  
**New API route:** `src/app/system/api/figma/route.ts`  
**File changes:** `Editor.tsx`, `tokens.ts`, `store.tsx`

**Flow:**
1. User clicks "Import Design System" in the System panel
2. Pastes a Figma file URL
3. Backend calls Figma REST API to extract:
   - Variables/tokens → maps to ADS token structure
   - Color styles → brand colors
   - Text styles → typography tokens
   - Component names → registry hints
4. Tokens merge into the editor state
5. Components retain ADS structure but use the imported tokens

**API route handles Figma API calls** (needs FIGMA_ACCESS_TOKEN env var):

```typescript
// src/app/system/api/figma/route.ts
export async function POST(req: Request) {
  const { fileKey } = await req.json();
  const headers = { "X-Figma-Token": process.env.FIGMA_ACCESS_TOKEN! };

  // 1. Get file variables
  const varsRes = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/variables/local`,
    { headers }
  );
  const vars = await varsRes.json();

  // 2. Get styles
  const stylesRes = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/styles`,
    { headers }
  );
  const styles = await stylesRes.json();

  // 3. Map to ADS token structure
  const tokens = mapFigmaToADS(vars, styles);
  return Response.json({ tokens });
}
```

**Token mapping strategy:** Use naming convention matching. Figma variables named `colors/primary` map to `brand.primary`. Variables named `spacing/md` map to `spacing.md`. Unknown variables get added as custom tokens with their original names.

**Acceptance criteria:**
- "Import from Figma" button in System panel
- Paste Figma URL → extracts tokens
- Preview of extracted tokens before applying
- Merge or replace option
- Works with Figma variable collections
- Handles color, spacing, radius, shadow tokens
- Error handling for invalid URLs or permissions

---

### 3.4 — Custom Token Creation

**File changes:** `tokens.ts`, `Editor.tsx`, `store.tsx`

Users should be able to add their own tokens beyond the defaults. This is critical for enterprise use where brand guidelines have specific values.

**Features:**
- "Add Token" button in each token group
- Custom token name input with path validation (`brand.accent`, `spacing.modal`, etc.)
- Token type selector (color, size, shadow, font)
- Delete custom tokens (built-in tokens can't be deleted, only reset)
- Token search/filter in the System panel

**Acceptance criteria:**
- Add custom tokens with name + value
- Custom tokens appear in their type group
- Components can reference custom tokens
- Export includes custom tokens
- Delete custom tokens
- Search/filter tokens by name

---

## Phase 4: Production Export

**Goal:** The code that ships is as important as the design that's created. This phase makes the export pipeline production-grade.

### 4.1 — Full Next.js Project Generation

**New file:** `export/nextjs.ts`  
**File changes:** `codegen.ts`, `Editor.tsx`

**Current state:** `codegen.ts` generates inline JSX. This is useful for preview but not shippable.

**Target:** Export a complete, runnable Next.js + Tailwind + shadcn/ui project:

```
exported-project/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with font imports + theme provider
│   │   ├── page.tsx             # Landing page (first screen)
│   │   ├── pricing/page.tsx     # One route per screen
│   │   └── globals.css          # Tailwind + token CSS variables
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components used by this project
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   └── sections/            # Generated section components
│   │       ├── HeroSection.tsx
│   │       ├── PricingSection.tsx
│   │       └── ...
│   └── lib/
│       └── tokens.ts            # Design tokens as TypeScript constants
├── tailwind.config.ts           # Token-derived Tailwind config
├── package.json
├── tsconfig.json
└── next.config.ts
```

**Code generation strategy:**

1. **Token → CSS Variables:** All ADS tokens become CSS custom properties in `globals.css`. Components use Tailwind classes that reference these variables.

2. **Component decomposition:** Sections become their own components. Repeated patterns get extracted (e.g., three identical cards become a mapped array with data).

3. **shadcn/ui alignment:** Button, Card, Badge, Input, Tabs, etc. map directly to shadcn/ui component imports. The generated code uses the real shadcn API, not custom HTML.

4. **Route structure:** Each screen becomes a Next.js route. Flow arrows become `<Link>` elements.

```typescript
// export/nextjs.ts
export interface ExportedProject {
  files: Record<string, string>;  // filepath → content
  dependencies: Record<string, string>;  // package.json deps
}

export function generateNextJSProject(
  project: Project,
  tokens: Record<string, string>,
): ExportedProject {
  // 1. Generate globals.css from tokens
  // 2. Generate tailwind.config.ts from tokens
  // 3. For each screen → generate page component
  // 4. Extract shared components
  // 5. Generate layout.tsx with theme provider
  // 6. Generate package.json
  // 7. Return all files
}
```

**Acceptance criteria:**
- "Export Project" button generates a downloadable .zip
- Contains a runnable Next.js project
- `npm install && npm run dev` works out of the box
- Tokens are CSS variables, not hardcoded
- shadcn/ui components are used correctly
- Routes match screen structure
- Flow arrows become navigation links
- TypeScript throughout, no `any`

---

### 4.2 — Static HTML Export

**New file:** `export/html.ts`

For users who don't want a React project — generate a single HTML file with embedded CSS and no framework dependency.

**Output:** A single `index.html` per screen with:
- Inline `<style>` block derived from tokens
- Semantic HTML (not divs everywhere)
- Responsive CSS using the same breakpoints
- No JavaScript (pure HTML/CSS)

**Acceptance criteria:**
- "Export as HTML" option
- Single self-contained HTML file per screen
- Looks identical to the canvas preview
- Valid semantic HTML5
- Responsive via CSS media queries

---

### 4.3 — GitHub Push + Vercel Deploy

**New files:** `export/deploy.ts`  
**New API route:** `src/app/system/api/deploy/route.ts`

**Flow:**
1. User clicks "Deploy to Vercel" in the Code panel
2. First time: OAuth flow to connect GitHub + Vercel accounts
3. Aphantasia creates a GitHub repo (or pushes to existing)
4. Vercel auto-deploys from the repo
5. User gets a live URL in ~30 seconds

**Implementation:**
- GitHub API: Create repo → push generated Next.js project files
- Vercel API: Create project linked to repo → trigger deployment
- Store GitHub/Vercel tokens in user session (encrypted)

**OAuth flow:**
1. Open popup → GitHub OAuth → get code → exchange for token
2. Open popup → Vercel OAuth → same
3. Store tokens server-side, associated with user

**Subsequent deploys:** "Push Update" button pushes new commit → Vercel auto-redeploys.

**Acceptance criteria:**
- One-click deploy from editor
- GitHub repo created automatically
- Vercel deployment triggered
- Live URL displayed in editor
- Subsequent pushes update the deployment
- Error handling for auth failures
- "Disconnect" option to unlink accounts

---

## Phase 5: Enterprise Features

**Goal:** Features that make this a tool for teams and professional workflows.

### 5.1 — Authentication + Cloud Storage

**Implementation:** Clerk or NextAuth for authentication. Supabase for project storage.

**User model:**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "team";
  createdAt: string;
}

interface CloudProject extends StoredProject {
  userId: string;
  shared: boolean;
  collaborators: string[];  // user IDs
}
```

**Features:**
- Sign up / sign in (Google, GitHub, email)
- Projects saved to cloud automatically
- Project sharing via link (read-only or edit)
- User settings (default theme, preferred viewport)

**Acceptance criteria:**
- Auth with Google + GitHub + email
- Projects persist in cloud
- Accessible from any device
- Share project via link
- User settings page

---

### 5.2 — Responsive Breakpoints

**File changes:** `Renderer.tsx`, `Editor.tsx`, `store.tsx`, `types.ts`

**Concept:** Same SpecNode tree, multiple viewport renderings. Users edit at one breakpoint and see the result at others.

**Implementation:**
- Each screen can have multiple viewport widths defined
- The canvas shows the primary viewport
- A "Responsive Preview" toggle shows the screen at all defined breakpoints side by side
- Components have responsive props: `{ mobile: "stack", desktop: "row" }` for layout direction

**Acceptance criteria:**
- Define multiple breakpoints per screen
- Side-by-side responsive preview
- Components can have per-breakpoint prop overrides
- Code export includes media queries

---

### 5.3 — Edit Propagation System

**File changes:** `store.tsx`, `types.ts`, `Editor.tsx`

**Concept:** When you edit a Button's color, you can scope the change:
- **This instance** — only this button
- **This group** — all buttons in this card/section
- **Global** — all buttons of this variant across all screens

**Implementation:**

```typescript
interface PropagationRule {
  scope: "instance" | "group" | "global";
  componentType: ComponentType;
  variant: string | null;
  prop: string;
  value: unknown;
  containerId?: string;  // For "group" scope
}
```

The reducer checks propagation rules when applying `UPDATE_NODE`. If scope is "global", it walks all screens and updates matching nodes.

**Acceptance criteria:**
- Scope selector appears when editing props
- "This instance" (default), "This group", "Global"
- Global changes cascade across all screens
- Group changes cascade within parent container
- Undo reverses propagated changes as a single action

---

### 5.4 — Component Composition (Drag Into)

**File changes:** `dnd/engine.ts`, `dnd/reorder.ts`, `Renderer.tsx`

**Extends Phase 1.4 drag-drop to support reparenting.** Dragging a component over a container (Card, Section) highlights the container. Dropping into it adds the component as a child.

**Visual indicators:**
- Blue insertion line = sibling reorder (same as Phase 1.4)
- Blue container highlight = reparenting into that container

**Acceptance criteria:**
- Drag component into a Card → becomes child of that Card
- Drag component out of a Card → becomes sibling
- Visual distinction between reorder and reparent
- Works with nested containers
- Undo reverses reparenting

---

### 5.5 — Navigation & Flow Wiring

**File changes:** `Editor.tsx`, `Renderer.tsx`, `store.tsx`, `types.ts`

**Concept:** Flow arrows between screens become real navigation in live mode and code export.

**Implementation:**
- Click a Button/Nav item in design mode → "Link to Screen" option in props panel
- Select target screen from dropdown
- In live mode, clicking the linked element navigates to that screen (viewport scrolls)
- In code export, generates `<Link href="/route">` with correct Next.js routing

**Flow arrow improvements:**
- Draw arrows by dragging from one screen to another
- Label arrows with the trigger (e.g., "Click 'Get Started'")
- Arrows update when screens move

**Acceptance criteria:**
- "Link to Screen" in button/nav props
- Live mode navigation works
- Code export generates Next.js Links
- Flow arrows drawable and editable
- Arrows follow screen positions

---

## Phase 6: Collaboration & Scale

**Goal:** Multi-user real-time editing. This is the long-term moat.

### 6.1 — Real-Time Collaboration (Yjs)

**New files:** `collab/provider.ts`, `collab/cursors.ts`

**Stack:** Yjs for CRDT, WebSocket server for sync, cursor awareness.

**Implementation outline:**
- EditorState stored as a Yjs `Y.Map`
- SpecNode tree stored as nested `Y.Map`/`Y.Array`
- Changes sync via WebSocket to all connected clients
- Cursor positions broadcast via awareness protocol
- Conflict resolution: last-write-wins for props, CRDT merge for tree structure

This is a significant architectural change — the reducer pattern needs to be adapted to work with Yjs's mutation model. The recommended approach is to keep the reducer as the local API but have it apply changes to the Yjs doc, which then syncs.

### 6.2 — Comments & Threads

Add Figma-style threaded comments pinned to specific nodes. Different from annotations — comments are for team discussion, annotations are for AI instructions.

### 6.3 — Version History

Git-like version history for projects. Branch, compare, restore previous versions. Builds on the migration system from Phase 1.2.

---

## Execution Priority Matrix

| Phase | Package | Impact | Complexity | Dependencies |
|-------|---------|--------|------------|--------------|
| 1 | 1.1 Undo/Redo | Critical | Low | None |
| 1 | 1.2 Persistence | Critical | Medium | None |
| 1 | 1.3 Inline Text Edit | High | Low | None |
| 1 | 1.4 Drag Reorder | High | Medium | None |
| 1 | 1.5 Screen Resize | Medium | Low | None |
| 2 | 2.1 AI Service | Critical | High | None |
| 2 | 2.2 AI Chat | Critical | Medium | 2.1 |
| 2 | 2.3 Annotation Apply | High | Medium | 2.1 |
| 2 | 2.4 Screen Generation | High | Medium | 2.1 |
| 3 | 3.1 Themes + Dark Mode | High | Medium | None |
| 3 | 3.2 Expanded Registry | High | High | None |
| 3 | 3.3 Figma Import | Medium | High | None |
| 3 | 3.4 Custom Tokens | Medium | Low | None |
| 4 | 4.1 Next.js Export | Critical | High | None |
| 4 | 4.2 HTML Export | Medium | Medium | None |
| 4 | 4.3 GitHub/Vercel Deploy | High | High | 4.1, 5.1 |
| 5 | 5.1 Auth + Cloud | Critical | High | None |
| 5 | 5.2 Responsive | High | Medium | None |
| 5 | 5.3 Edit Propagation | Medium | Medium | None |
| 5 | 5.4 Composition DnD | Medium | Medium | 1.4 |
| 5 | 5.5 Navigation Wiring | Medium | Low | None |
| 6 | 6.1 Collaboration | High | Very High | 5.1 |
| 6 | 6.2 Comments | Medium | Medium | 6.1 |
| 6 | 6.3 Version History | Medium | High | 5.1 |

---

## Recommended Build Order for Claude Code

Execute in this order. Each step produces a shippable increment.

### Sprint 1 (Foundation)
1. **1.1 Undo/Redo** — Wrap reducer in history middleware
2. **1.3 Inline Text Editing** — Double-click to edit
3. **1.5 Screen Resize** — Resize handles + viewport presets

### Sprint 2 (Persistence)
4. **1.2 Persistence** — Save/load/autosave/project picker
5. **1.4 Drag Reorder** — Drag-to-reorder within siblings

### Sprint 3 (AI Core)
6. **2.1 AI Service** — API route + prompt engineering + patch system
7. **2.2 AI Chat** — Wire chat panel to real AI

### Sprint 4 (AI Extension)
8. **2.3 Annotation Apply** — Wire annotation system to AI
9. **2.4 Screen Generation** — AI-generated new screens
10. **3.1 Themes + Dark Mode** — Theme presets + dark mode

### Sprint 5 (Design System)
11. **3.2 Expanded Registry** — 12 new component types
12. **3.4 Custom Tokens** — User-defined tokens

### Sprint 6 (Export)
13. **4.1 Next.js Export** — Full project generation
14. **4.2 HTML Export** — Static HTML output

### Sprint 7 (Enterprise)
15. **5.1 Auth + Cloud** — User accounts + cloud storage
16. **3.3 Figma Import** — Design system extraction

### Sprint 8 (Polish)
17. **5.2 Responsive Breakpoints** — Multi-viewport preview
18. **5.3 Edit Propagation** — Instance/group/global scope
19. **5.4 Composition DnD** — Drag into containers
20. **5.5 Navigation Wiring** — Screen-to-screen links
21. **4.3 GitHub/Vercel Deploy** — One-click deployment

### Sprint 9+ (Scale)
22. **6.1-6.3 Collaboration** — Real-time multi-user

---

## Claude Code Session Guidelines

Each work package should be executed as follows:

1. **Read the current state** of the file(s) being modified
2. **Implement the feature** with full TypeScript types, no `any`
3. **Update types.ts** if new types/actions are needed
4. **Update the reducer** in `store.tsx` for new actions
5. **Update Editor.tsx** for any new UI (panels, buttons, shortcuts)
6. **Test locally** with `npm run dev` — verify no TypeScript errors, no runtime crashes
7. **Commit** with a descriptive message: `feat(system): add undo/redo history stack`

**Code style rules:**
- Match existing patterns (inline styles with the `glass`/`darkGlass` objects, lucide-react icons)
- No new dependencies unless absolutely necessary (list and justify any additions)
- Keep the single-file-per-concern architecture clean
- All new types go in `types.ts`, all new actions in the `EditorAction` union
- Use `uid()` from `registry.ts` for all new IDs
- Error boundaries around all new async operations

**Testing approach:**
- Manual testing in browser is primary (this is a visual editor)
- TypeScript compiler is the first gate (`npx tsc --noEmit`)
- For AI integration: test with real API calls, log request/response for debugging
- For persistence: verify data survives page refresh, verify migration from v1 → v2

---

## Environment Variables Required

```env
# AI Integration (Phase 2)
ANTHROPIC_API_KEY=sk-ant-...

# Figma Import (Phase 3)
FIGMA_ACCESS_TOKEN=figd_...

# GitHub Deploy (Phase 4)
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Vercel Deploy (Phase 4)
VERCEL_TOKEN=...

# Auth (Phase 5)
CLERK_SECRET_KEY=...        # or NEXTAUTH_SECRET
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...

# Database (Phase 5)
DATABASE_URL=postgresql://...  # Supabase
```

---

## Success Metrics

After Phase 2 completion:
- A user can build a 5-screen web app from scratch using chat + canvas in under 30 minutes
- Generated code is valid, runnable Next.js
- Design system changes cascade correctly to all components

After Phase 4 completion:
- Exported project runs with zero modifications needed
- Deploy to Vercel produces a live site

After Phase 5 completion:
- Projects persist across sessions and devices
- Team members can view shared projects

---

*This document is the complete specification for transforming Aphantasia/System from a proof-of-concept into an enterprise product. Each work package is self-contained and Claude Code-executable. Start with Sprint 1.*
