# Aphantasia — Claude Code Context

TODO: Paste the full CONTEXT.md content from the Claude ideation session here.
This file is read automatically by Claude Code at the start of every session.

Key rules:
- Never import tldraw directly — use src/engine/CanvasEngine.ts interface
- Never import a specific renderer directly — use src/render/RenderEngine.ts interface
- Never import a specific export adapter directly — use src/export/ExportAdapter.ts interface
- All AI calls go through src/lib/anthropic.ts
- Canvas data model (CanvasDocument, CanvasShape) is the single source of truth
