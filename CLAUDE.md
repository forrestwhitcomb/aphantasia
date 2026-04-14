# CLAUDE.md — Aphantasia/System Agent Constitution

> **This file is law.** Read it completely before every task. Do not deviate.

---

## STOP — Before You Write Any Code

1. Run `./scripts/system-audit.sh` first. Fix anything it flags before starting your task.
2. Read `src/system/APHANTASIA_SYSTEM_CONTEXT.md` — it defines the architecture.
3. Read `src/system/APHANTASIA_SYSTEM_IMPLEMENTATION_PLAN.md` — it defines the roadmap.
4. Confirm which sprint/work-package you are executing. State it explicitly.

---

## The Golden Rule

**Aphantasia/System lives in exactly these files and NOWHERE ELSE:**

```
src/app/system/page.tsx          ← Route entry. ONLY wraps Editor in EditorProvider.
src/system/types.ts              ← ALL TypeScript types. Every type lives here.
src/system/tokens.ts             ← Token definitions + resolveToken(). Nothing else.
src/system/registry.ts           ← Component registry + makeSpec() factories + recognizeShape().
src/system/store.tsx             ← EditorProvider + useEditor + reducer. ALL state logic.
src/system/Renderer.tsx          ← LiveRenderer. Recursive SpecNode → React. ALL rendering.
src/system/codegen.ts            ← specToJSX() + generateScreenComponent(). ALL code gen.
src/system/Editor.tsx            ← The editor shell. Canvas, toolbar, all panels. ALL chrome.
```

New files are ONLY allowed in these subdirectories (created as needed per the implementation plan):
```
src/system/ai/                   ← AI service, prompts, patches
src/system/persistence/          ← Storage, autosave, migrations
src/system/dnd/                  ← Drag-drop engine and reorder logic
src/system/export/               ← Next.js gen, HTML gen, Figma import, deploy
src/app/system/api/              ← Next.js API routes (ai, deploy, figma)
```

**If a file doesn't appear above, it DOES NOT EXIST in this module.** Do not create random utility files, helper files, hook files, or component files. Everything goes in the 8 core files or the approved subdirectories.

---

## Files You Must NEVER Touch

These belong to other Aphantasia experiences. They are completely separate codebases that share a repo:

```
src/rebtel/          ← Aphantasia/Rebtel. DO NOT READ. DO NOT IMPORT. DO NOT MODIFY.
src/app/rebtel/      ← Rebtel routes. DO NOT TOUCH.
src/app/internal/    ← Internal tools. DO NOT TOUCH.
src/app/preview/     ← Preview routes. DO NOT TOUCH.
src/components/      ← Shared components from other experiences. DO NOT IMPORT.
src/lib/             ← Shared utilities from other experiences. DO NOT IMPORT.
src/styles/          ← Global styles. DO NOT MODIFY.
```

**Aphantasia/System has ZERO imports from outside `src/system/` and `src/app/system/`.** The only external imports are:
- `react` / `react-dom`
- `next` (for routing)
- `lucide-react` (for icons)
- `@anthropic-ai/sdk` (for AI, server-side only)

No other packages. No other internal imports. If you need a utility, write it inside the appropriate `src/system/` file.

---

## Architecture Rules

### 1. SpecNode Tree Is the Only Truth

Every component in every screen is a `SpecNode`. There is no other representation. No "element" type, no "widget" type, no "block" type. If you find yourself creating a new data structure to represent UI, STOP — it should be a SpecNode.

### 2. Actions Are the Only Mutation Path

Every state change goes through `dispatch(action)`. All actions are defined in the `EditorAction` union type in `types.ts`. If you need a new state change, add a new action type to the union and handle it in the reducer in `store.tsx`.

**Never:**
- Mutate state directly
- Use `useState` for data that should be in EditorState
- Create separate React contexts for editor state
- Use refs for mutable state that affects rendering

**Acceptable `useState`:** Local UI state that doesn't affect the document (hover states, animation states, dropdown open/close within the Renderer, input field values before commit).

### 3. Tokens Are the Contract

Components NEVER use hardcoded colors, spacing, or radius values. They use `resolveToken(tokenPath, tokens)`. If a component needs a value, it gets it from the token system.

### 4. The Registry Is the Component Vocabulary

Every component type must be registered in `REGISTRY` in `registry.ts`. Every variant must have a `makeSpec()` factory that produces a complete SpecNode subtree. If you add a component, it needs ALL of:
- Entry in `REGISTRY` (icon, cat, variants)
- Case in `makeSpec()` for each variant
- Rendering case in `Renderer.tsx`
- Shape recognition update in `recognizeShape()` if applicable

### 5. No CSS Files, No Tailwind Classes in System

The editor chrome uses inline styles with the `glass` and `darkGlass` style objects defined at the top of `Editor.tsx`. This matches the warm-gradient + glassmorphism design language. Components rendered by `Renderer.tsx` also use inline styles derived from tokens.

**Do not:**
- Create `.css` or `.module.css` files for system
- Use Tailwind utility classes in the editor or renderer
- Import global stylesheets
- Add `className` props to editor chrome elements

The ONLY place Tailwind classes appear is in code generation output (`codegen.ts`) where we generate Tailwind-based code for the user's exported project.

### 6. The Editor Is One Component

`Editor.tsx` is the entire editor UI — canvas, toolbar, panels, chat. It is intentionally a single large component because:
- All panels need access to the same editor state
- The toolbar controls multiple panels
- Keyboard shortcuts are global

**Do not** break Editor.tsx into sub-components unless explicitly called for in the implementation plan. If the file grows beyond ~400 lines, discuss before splitting.

---

## Code Style — Match the Existing Patterns

### Inline Styles Pattern
```typescript
// YES — matches existing code
<div style={{
  padding: "12px 16px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.5)",
}}>

// NO — do not use Tailwind in the editor
<div className="p-4 rounded-xl bg-white/70 backdrop-blur-xl border border-white/50">
```

### Glass Style Objects
```typescript
// These exist at the top of Editor.tsx. USE THEM.
const glass = { background:"rgba(255,255,255,0.72)", backdropFilter:"blur(24px)", ... };
const darkGlass = { background:"rgba(26,26,46,0.92)", backdropFilter:"blur(12px)", ... };

// YES
<div style={{ ...glass, borderRadius: 16, padding: "12px 16px" }}>

// NO — do not redefine these inline
<div style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(24px)" }}>
```

### Color Language
```
Dark navy:     #1a1a2e (text, dark surfaces)
Warm cream:    #E2E0E0 (canvas background)
Glass white:   rgba(255,255,255,0.72) (panels)
Glass dark:    rgba(26,26,46,0.92) (toolbar)
Subtle text:   rgba(26,26,46,0.4) (secondary labels)
Active accent: brand.primary token (default #2563eb)
```

### Icons — lucide-react Only
```typescript
// YES
import { MousePointer2, Square, Hand, Plus, Trash2 } from "lucide-react";
<Plus size={18} />

// NO — no other icon libraries
import { FiPlus } from "react-icons/fi";  // WRONG
```

### ID Generation
```typescript
// YES — use uid() from registry.ts
import { uid } from "./registry";
const id = uid();

// NO — do not use crypto.randomUUID(), nanoid(), etc.
```

### TypeScript Strictness
- No `any` types. Use `unknown` and narrow.
- All new types go in `types.ts`. No inline type definitions in other files.
- All action types go in the `EditorAction` union in `types.ts`.
- Props interfaces for Renderer sub-components can live in `Renderer.tsx` (they're internal).

---

## Before You Commit: Pre-Flight Checklist

Run these checks before considering any task complete:

```bash
# 1. TypeScript compiles
npx tsc --noEmit

# 2. No imports from outside src/system/ (except react, next, lucide-react)
grep -r "from ['\"]\.\./" src/system/ --include="*.ts" --include="*.tsx" | grep -v "node_modules"
# Should return NOTHING

# 3. No stale files outside the approved structure
find src/system/ -name "*.ts" -o -name "*.tsx" | sort
# Should match the 8 core files + approved subdirectory files ONLY

# 4. No Tailwind classes in editor chrome
grep -r "className=" src/system/Editor.tsx src/system/Renderer.tsx
# Should return NOTHING (or only in code generation strings)

# 5. All actions are in the EditorAction union
grep "type:" src/system/store.tsx | grep "case" | sort
# Every case should have a corresponding entry in types.ts EditorAction

# 6. Dev server runs without errors
npm run dev
# Visit http://localhost:3000/system — verify no console errors
```

---

## How to Handle Ambiguity

If the implementation plan doesn't specify something:
1. **Check the system context doc** — it may have the answer
2. **Match the existing pattern** — look at how similar things are done in the 8 files
3. **Choose the simplest option** — no over-engineering
4. **State your assumption** in the commit message

If something in the implementation plan conflicts with this CLAUDE.md, **this CLAUDE.md wins**. The architecture constraints are absolute.

---

## Common Mistakes to Avoid

1. **Creating a `utils.ts` or `helpers.ts`** — No. Put helpers in the file that uses them.
2. **Creating a `hooks/` directory** — No. `useEditor()` lives in `store.tsx`. Any new hooks go in the file that defines them.
3. **Importing from `src/components/`** — No. System has zero external component dependencies.
4. **Adding `clsx`, `cn()`, or class-merging utilities** — No. We use inline styles.
5. **Creating a separate `theme.ts`** — No. Themes live in `tokens.ts`.
6. **Splitting Editor.tsx prematurely** — No. It's one file until the plan says otherwise.
7. **Using `useState` for document state** — No. All document state goes through the reducer.
8. **Adding npm dependencies** — Not without explicit approval. The system uses React, Next.js, lucide-react, and @anthropic-ai/sdk. That's it.
9. **Modifying files outside src/system/ and src/app/system/** — Never.
10. **Leaving console.log statements** — Remove them before commit.
11. **Creating `.env.example` or config files in src/system/** — No. Env vars are documented in the implementation plan.
12. **Writing tests** — Not yet. Manual testing via `npm run dev` is the current approach. Tests come later.
