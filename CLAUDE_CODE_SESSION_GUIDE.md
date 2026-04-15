# How to Start a Claude Code Session for Aphantasia/System

## Step 1: Clean up

Before giving Claude Code any task, paste this as your first message:

---

```
Read CLAUDE.md completely. Then run:

chmod +x scripts/system-audit.sh scripts/system-clean-slate.sh
./scripts/system-audit.sh

If there are ERRORS, run:
./scripts/system-clean-slate.sh

Then re-run the audit until it passes.

Report what you found and fixed. Do not start any feature work yet.
```

---

## Step 2: Give the task

Once the audit passes, give your actual task. Always reference the specific work package:

---

### Example task prompts:

**For Sprint 1.1 (Undo/Redo):**
```
Read APHANTASIA_SYSTEM_IMPLEMENTATION_PLAN.md section 1.1 — Undo/Redo History Stack.

Implement it exactly as specified:
- Wrap editorReducer in a historyReducer in store.tsx
- Add UNDO and REDO to EditorAction in types.ts
- Add Cmd+Z / Cmd+Shift+Z keyboard shortcuts in Editor.tsx
- Add undo/redo buttons to the bottom toolbar in Editor.tsx
- Cap history at 50 entries
- Skip history for pan/zoom/selection/toggle actions

Run the audit script when done. Verify with npm run dev.
```

**For Sprint 1.3 (Inline Text Editing):**
```
Read APHANTASIA_SYSTEM_IMPLEMENTATION_PLAN.md section 1.3 — Inline Text Editing.

Implement it exactly as specified:
- Add editingNodeId and editingProp to EditorState in types.ts
- Add START_EDITING and STOP_EDITING actions to types.ts
- Handle these actions in the reducer in store.tsx
- In Renderer.tsx, make Text nodes respond to double-click with contentEditable
- Commit on blur, Escape, or Enter (for single-line)
- Dispatch UPDATE_NODE on commit

Do not create any new files. All changes go in types.ts, store.tsx, Renderer.tsx.
Run the audit script when done.
```

**For fixing bugs:**
```
Read CLAUDE.md first.

Bug: [describe the bug]

Fix it. Do not restructure files, do not add new files, do not refactor.
Change the minimum lines necessary to fix the bug.
Run the audit script when done.
```

---

## Step 3: Verify

After Claude Code says it's done:

```
Run ./scripts/system-audit.sh and show me the output.
Then run npm run dev and visit http://localhost:3000/system.
Tell me if there are any console errors.
```

---

## Rules for every session

1. **Never skip the audit.** The agent will drift if it doesn't run the audit first.
2. **One work package per session.** Don't ask for multiple features at once.
3. **Be explicit about file constraints.** Say "all changes go in X, Y, Z files" every time.
4. **Reference the plan.** Say "section 2.1" not "add AI." The plan has the details.
5. **End with verification.** Always ask for the audit + dev server check.
