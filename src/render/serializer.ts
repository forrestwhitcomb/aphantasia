import type { CanvasDocument } from "@/engine/CanvasEngine";
import type { StructuredContext, ContextBundle } from "@/types/context";

// ---------------------------------------------------------------------------
// buildContextBundle
// Assembles the full ContextBundle from the canvas document + extracted context.
// Called by the Layer 2 render pipeline before sending to Claude.
// ---------------------------------------------------------------------------

export function buildContextBundle(
  doc: CanvasDocument,
  structuredContext: StructuredContext | null,
  rawText: string
): ContextBundle {
  const bundle: ContextBundle = {
    global: structuredContext ?? {},
    rawText,
    shapeContexts: {},
  };

  // Build per-shape context from linkedNoteIds
  for (const shape of doc.shapes) {
    if (!shape.isInsideFrame) continue;
    if (!shape.linkedNoteIds?.length && !shape.contextNote) continue;

    // Gather text from all linked notes
    const linkedNotes = doc.shapes.filter(
      (s) => s.type === "note" && shape.linkedNoteIds?.includes(s.id)
    );

    const copyLines: string[] = [];
    const structuralLines: string[] = [];

    for (const note of linkedNotes) {
      const text = note.label || note.content || "";
      if (!text) continue;
      const t = text.toLowerCase();
      if (/should feel|should be|intent:|goal:|purpose:|vibe:|tone:|aesthetic|mood/.test(t)) {
        structuralLines.push(text);
      } else {
        copyLines.push(text);
      }
    }

    // Also include direct contextNote if set (flattened from linked notes)
    if (shape.contextNote && !copyLines.length && !structuralLines.length) {
      copyLines.push(shape.contextNote);
    }

    if (copyLines.length || structuralLines.length) {
      bundle.shapeContexts[shape.id] = {
        copy: copyLines,
        structural: structuralLines,
        global: bundle.global,
      };
    }
  }

  return bundle;
}

// ---------------------------------------------------------------------------
// serializeForPrompt
// Converts a ContextBundle + CanvasDocument into the text prompt sent to Claude.
// ---------------------------------------------------------------------------

export function serializeForPrompt(
  doc: CanvasDocument,
  bundle: ContextBundle
): string {
  const insideFrame = doc.shapes.filter(
    (s) =>
      s.isInsideFrame &&
      s.semanticTag !== "unknown" &&
      s.semanticTag !== "scratchpad" &&
      s.semanticTag !== "context-note"
  ).sort((a, b) => a.y - b.y);

  const ctx = bundle.global;

  const contextLines: string[] = [];
  if (ctx.productName) contextLines.push(`Product: ${ctx.productName}`);
  if (ctx.tagline) contextLines.push(`Tagline: ${ctx.tagline}`);
  if (ctx.description) contextLines.push(`Description: ${ctx.description}`);
  if (ctx.tone) contextLines.push(`Tone: ${ctx.tone}`);
  if (ctx.pricing) contextLines.push(`Pricing: ${ctx.pricing}`);
  if (ctx.colors?.length) contextLines.push(`Brand colors: ${ctx.colors.join(", ")}`);
  if (ctx.fonts?.length) contextLines.push(`Fonts: ${ctx.fonts.join(", ")}`);

  const sectionLines = insideFrame.map((s) => {
    const tag = s.semanticTag?.toUpperCase() ?? "UNKNOWN";
    const label = s.label ? ` "${s.label}"` : "";
    const dims = `${Math.round(s.width)}x${Math.round(s.height)}`;
    const shapeCtx = bundle.shapeContexts[s.id];
    let notes = "";
    if (shapeCtx?.copy.length) notes += `\n    copy: ${shapeCtx.copy.join(" | ")}`;
    if (shapeCtx?.structural.length) notes += `\n    intent: ${shapeCtx.structural.join(" | ")}`;
    return `  - ${tag}${label} (${dims})${notes}`;
  });

  return `CONTEXT:
${contextLines.length ? contextLines.join("\n") : "(none provided)"}

CANVAS LAYOUT:
Frame: ${doc.frame.width}x${doc.frame.height} (${doc.frame.type})
Sections:
${sectionLines.join("\n")}`;
}

// Legacy helper — kept for backward compatibility with existing callers
export function serializeCanvasToPrompt(doc: CanvasDocument, globalContext: string): string {
  return serializeForPrompt(doc, {
    global: {},
    rawText: globalContext,
    shapeContexts: {},
  });
}
