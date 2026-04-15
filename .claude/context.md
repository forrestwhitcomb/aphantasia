# Aphantasia — Claude Code Context

> This file is read automatically at the start of every Claude Code session.
> It sets expectations for how work is done in this repo, regardless of which module you're touching.

---

## What This Repo Is

Aphantasia is a design-to-code product. Users sketch on a spatial canvas, get real UI components backed by a design system, and ship production code. The repo contains multiple independent modules that share a Next.js application shell but have **separate codebases, separate architectures, and separate rules.**

**Tech stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Anthropic Claude API.

---

## Modules

| Module | Path | Purpose | Status |
|---|---|---|---|
| **System** | `src/system/`, `src/app/system/` | General-purpose design-to-code editor at `/system`. The primary product. | Active development |
| **Rebtel** | `src/rebtel/`, `src/app/rebtel/` | Internal Rebtel design tool fork. Separate codebase. | Maintained separately |
| **Sites (v0)** | `src/engine/`, `src/render/`, `src/semantic/`, `src/spatial/`, `src/dna/`, `src/components/`, `src/agent/` | Original canvas-to-website prototype. Legacy architecture. | Frozen — do not modify without explicit instruction |
| **UI Mode** | `src/ui-mode/` | Mobile UI design mode. | Frozen |
| **Internal** | `src/app/internal/` | Internal tools and demos. | Low priority |

**These modules do not share code.** Do not import across module boundaries. Each module has its own types, state management, and rendering pipeline.

---

## Module-Specific Rules

### System (`src/system/`)

**Read `CLAUDE.md` at the repo root before touching any System file.** It is the constitution for this module — file boundaries, style rules, approved subdirectories, anti-patterns. Everything in CLAUDE.md overrides anything in this file if they conflict.

Key constraints:
- **8 sacred core files** + approved subdirectories only. No new files without explicit approval.
- **Inline styles only** — no Tailwind in editor chrome or renderer. Glass/darkGlass style objects.
- **All state through dispatch** — no useState for document state, no separate contexts.
- **Zero external imports** — only react, next, lucide-react, @anthropic-ai/sdk.

Detailed implementation plan: `src/system/APHANTASIA_SYSTEM_IMPLEMENTATION_PLAN.md`
Architecture context: `src/system/APHANTASIA_SYSTEM_CONTEXT.md`

### Rebtel (`src/rebtel/`)

Do not modify Rebtel files during a System session. Do not import from Rebtel into System or vice versa. If a session targets Rebtel, treat it as an entirely separate codebase that happens to share a repo.

### Legacy modules

`src/engine/`, `src/render/`, `src/semantic/`, `src/spatial/`, `src/dna/`, `src/components/`, `src/agent/`, `src/export/`, `src/context/`, `src/reference/`, `src/lib/`, `src/types/`, `src/ui-mode/` — these are from earlier iterations. **Do not modify, refactor, or "clean up" these files** unless the session explicitly targets them. They are not dead code; they serve the original Sites experience and may be revisited.

---

## Engineering Standards

These apply to all work in every module.

### Before you start
1. **Understand the scope.** Confirm which module and which specific task you are working on. State it explicitly before writing code.
2. **Read the relevant docs.** System has CLAUDE.md and an implementation plan. Other modules may have their own context files. Check before assuming.
3. **Run the audit.** If working on System, run `./scripts/system-audit.sh` before and after. Fix anything it flags before starting new work.

### While you work
4. **One task per session.** Complete one well-defined piece of work. Do not scope-creep into adjacent features, refactors, or "while I'm here" improvements.
5. **Match existing patterns.** Before introducing a new pattern, check how similar things are already done in the file you're editing. Consistency beats novelty.
6. **No speculative abstractions.** Do not create utility files, helper modules, shared hooks, or abstraction layers that aren't called for by the task. Put helpers in the file that uses them.
7. **No dependency additions** without explicit approval. The dependency list is intentional.
8. **TypeScript strictness.** No `any` types. No inline type definitions outside the designated types file. Narrow with `unknown` instead.
9. **Clean up after yourself.** No `console.log` statements. No commented-out code blocks. No TODO comments without a tracking reference.

### Before you finish
10. **Verify it compiles.** Run `npx tsc --noEmit` and fix all errors.
11. **Verify it runs.** Run `npm run dev` and manually check the relevant route.
12. **Run the audit again** if one exists for your module.
13. **State what you changed.** List every file modified, every type/action added, and any assumptions you made.

---

## Environment

```
ANTHROPIC_API_KEY=sk-ant-...           # AI features (System + Sites)
FIGMA_ACCESS_TOKEN=figd_...            # Figma import (System)
CODE_TO_DESIGN_API_KEY=zpka_...        # Figma export via code.to.design (System)
```

---

## Repository Layout

```
aphantasia/
├── .claude/context.md          ← This file (read automatically)
├── CLAUDE.md                   ← System module constitution (read before System work)
├── scripts/
│   ├── system-audit.sh         ← Architecture linter for System
│   └── system-clean-slate.sh   ← Nuclear reset for System (use with caution)
├── src/
│   ├── system/                 ← System module (active)
│   ├── app/system/             ← System routes + API
│   ├── rebtel/                 ← Rebtel module (separate)
│   ├── app/rebtel/             ← Rebtel routes
│   ├── engine/                 ← Legacy canvas engine
│   ├── render/                 ← Legacy render pipeline
│   ├── semantic/               ← Legacy semantic resolver
│   ├── spatial/                ← Legacy spatial analysis
│   ├── dna/                    ← Legacy design DNA system
│   ├── components/             ← Legacy shared components
│   ├── ui-mode/                ← Legacy UI mode
│   └── app/                    ← Next.js app directory (routes, API, layout)
└── public/                     ← Static assets
```

---

## What Not To Do

- **Do not "unify" or "consolidate" modules.** They are separate on purpose.
- **Do not refactor files you weren't asked to touch.** Scope discipline is more important than code elegance.
- **Do not create new top-level directories** under `src/` without explicit instruction.
- **Do not update this context file** without explicit instruction. It is maintained by hand.
- **Do not treat frozen modules as tech debt.** They are parked, not broken.
