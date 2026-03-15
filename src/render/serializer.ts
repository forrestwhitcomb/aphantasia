import type { CanvasDocument } from "@/engine/CanvasEngine";
import type { StructuredContext, ContextBundle, ImageRef } from "@/types/context";
import type { ReferenceItem } from "@/types/reference";

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
    if (shape.meta?._consumed) continue; // Skip shapes absorbed into compound groups
    if (!shape.linkedNoteIds?.length && !shape.contextNote && !shape.linkedImageIds?.length) continue;

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

    // Gather styleRef from linked images
    let styleRef: ImageRef | undefined;
    if (shape.linkedImageIds?.length) {
      const linkedImage = doc.shapes.find(
        (s) => s.type === "image" && shape.linkedImageIds?.includes(s.id)
      );
      if (linkedImage?.meta?.src) {
        styleRef = {
          dataUrl: linkedImage.meta.src as string,
          description: linkedImage.label || undefined,
        };
      }
    }

    if (copyLines.length || structuralLines.length || styleRef) {
      bundle.shapeContexts[shape.id] = {
        copy: copyLines,
        structural: structuralLines,
        styleRef,
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
  bundle: ContextBundle,
  references?: ReferenceItem[]
): string {
  const insideFrame = doc.shapes.filter(
    (s) =>
      s.isInsideFrame &&
      s.semanticTag !== "unknown" &&
      s.semanticTag !== "scratchpad" &&
      s.semanticTag !== "context-note" &&
      s.semanticTag !== "image" &&
      !s.meta?._consumed
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
    if (shapeCtx?.styleRef) notes += `\n    style-ref: [image attached]`;
    // Annotate compound groups detected by spatial analyzer
    if (s.meta?._spatialGroup) {
      const gp = s.meta._spatialGroup as Record<string, unknown>;
      const features = gp.features as Array<Record<string, unknown>> | undefined;
      if (features?.length) {
        notes += `\n    compound: ${features.length} cards detected`;
      }
    }
    return `  - ${tag}${label} (${dims})${notes}`;
  });

  // Build reference section if any ready references exist
  const readyRefs = (references ?? []).filter(
    (r) => r.status === "ready" && r.extractedTokens
  );
  let refSection = "";
  if (readyRefs.length > 0) {
    const refLines = readyRefs.map((r) => {
      const t = r.extractedTokens!;
      const parts: string[] = [`  - [${r.tag.toUpperCase()}]`];
      if (t.colors?.length) parts.push(`colors: ${t.colors.join(", ")}`);
      if (t.background) parts.push(`bg: ${t.background}`);
      if (t.foreground) parts.push(`fg: ${t.foreground}`);
      if (t.accent) parts.push(`accent: ${t.accent}`);
      if (t.fontHeading) parts.push(`heading font: ${t.fontHeading}`);
      if (t.fontBody) parts.push(`body font: ${t.fontBody}`);
      if (t.headingWeight) parts.push(`heading weight: ${t.headingWeight}`);
      if (t.buttonRadius) parts.push(`button radius: ${t.buttonRadius}`);
      if (t.cardRadius) parts.push(`card radius: ${t.cardRadius}`);
      if (t.sectionPadding) parts.push(`section padding: ${t.sectionPadding}`);
      if (t.buttonStyle) parts.push(`button style: ${t.buttonStyle}`);
      if (t.cardStyle) parts.push(`card style: ${t.cardStyle}`);
      if (t.mood) parts.push(`mood: ${t.mood}`);
      if (t.layout) parts.push(`layout: ${t.layout}`);
      if (t.toneOfVoice) parts.push(`tone of voice: ${t.toneOfVoice}`);
      if (r.type === "image") parts.push("[image attached]");
      return parts.join(" | ");
    });
    refSection = `\n\nSTYLE REFERENCES:\n${refLines.join("\n")}`;
  }

  return `CONTEXT:
${contextLines.length ? contextLines.join("\n") : "(none provided)"}

CANVAS LAYOUT:
Frame: ${doc.frame.width}x${doc.frame.height} (${doc.frame.type})
Sections:
${sectionLines.join("\n")}${refSection}`;
}

// Legacy helper — kept for backward compatibility with existing callers
export function serializeCanvasToPrompt(doc: CanvasDocument, globalContext: string): string {
  return serializeForPrompt(doc, {
    global: {},
    rawText: globalContext,
    shapeContexts: {},
  });
}
