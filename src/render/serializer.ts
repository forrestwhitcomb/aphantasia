import type { CanvasDocument, CanvasShape } from "@/engine/CanvasEngine";
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

  for (const shape of doc.shapes) {
    if (!shape.isInsideFrame) continue;
    if (shape.meta?._consumed) continue;
    if (!shape.linkedNoteIds?.length && !shape.contextNote && !shape.linkedImageIds?.length) continue;

    const linkedNotes = doc.shapes.filter(
      (s) => s.type === "note" && shape.linkedNoteIds?.includes(s.id)
    );

    const copyLines: string[] = [];
    const structuralLines: string[] = [];

    for (const note of linkedNotes) {
      const text = note.label || note.content || "";
      if (!text) continue;
      classifyNoteText(text, copyLines, structuralLines);
    }

    if (shape.contextNote && !copyLines.length && !structuralLines.length) {
      copyLines.push(shape.contextNote);
    }

    let styleRef: ImageRef | undefined;
    if (shape.linkedImageIds?.length) {
      const linkedImage = doc.shapes.find(
        (s) => s.type === "image" && shape.linkedImageIds?.includes(s.id)
      );
      if (linkedImage?.meta?.src) {
        const role = classifyImageRole(linkedImage, shape);
        styleRef = {
          dataUrl: linkedImage.meta.src as string,
          description: role + (linkedImage.label ? `: ${linkedImage.label}` : ""),
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
// Image role classification — context for the AI about what an image represents
// ---------------------------------------------------------------------------

function classifyImageRole(
  image: CanvasShape,
  parentShape: CanvasShape
): string {
  const label = (image.label || "").toLowerCase();
  const parentTag = parentShape.semanticTag || "";

  if (label.includes("logo")) return "logo";
  if (label.includes("style") || label.includes("reference") || label.includes("inspo")) return "style-reference";
  if (label.includes("screenshot") || label.includes("mockup")) return "design-reference";
  if (parentTag === "hero") return "hero-imagery";
  if (parentTag === "portfolio") return "portfolio-imagery";
  if (parentTag === "ecommerce") return "product-imagery";
  return "content-image";
}

// ---------------------------------------------------------------------------
// Note classification — richer than the original regex
// ---------------------------------------------------------------------------

const STRUCTURAL_PATTERNS = [
  /should feel|should be|should look/,
  /intent:|goal:|purpose:|vibe:|tone:|aesthetic|mood/,
  /make it|keep it|style:|layout:/,
  /like\s+(a|an)\s+/,
  /inspired by|reference:|similar to/,
  /dark mode|light mode|glassmorphism|neumorphism|brutalist/,
];

function classifyNoteText(text: string, copyOut: string[], structuralOut: string[]): void {
  const t = text.toLowerCase();
  for (const pat of STRUCTURAL_PATTERNS) {
    if (pat.test(t)) {
      structuralOut.push(text);
      return;
    }
  }
  copyOut.push(text);
}

// ---------------------------------------------------------------------------
// Scratchpad extraction — unlinked notes outside the frame
// ---------------------------------------------------------------------------

export function extractScratchpad(doc: CanvasDocument): string[] {
  return doc.shapes
    .filter((s) => {
      if (s.type !== "note") return false;
      if (s.linkedShapeId) return false;
      if (s.isInsideFrame) return false;
      const text = s.label || s.content || "";
      return text.trim().length > 0;
    })
    .map((s) => (s.label || s.content || "").trim());
}

// ---------------------------------------------------------------------------
// Frame hierarchy classification
// ---------------------------------------------------------------------------

type FrameRole = "primary" | "secondary" | "supporting";

function classifyFrameRole(
  shape: CanvasShape,
  index: number,
  total: number,
  frameHeight: number
): FrameRole {
  const heightRatio = shape.height / frameHeight;
  if (index === 0 && heightRatio > 0.25) return "primary";
  if (shape.semanticTag === "hero") return "primary";
  if (shape.semanticTag === "nav" || shape.semanticTag === "footer") return "supporting";
  if (heightRatio < 0.08) return "supporting";
  if (index <= 1) return "primary";
  return "secondary";
}

// ---------------------------------------------------------------------------
// serializeForPrompt — SITE_GENERATION.md format
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
  const scratchpad = extractScratchpad(doc);

  // --- CONTEXT block ---
  const contextLines: string[] = [];
  if (ctx.productName) contextLines.push(`Product: ${ctx.productName}`);
  if (ctx.tagline) contextLines.push(`Tagline: ${ctx.tagline}`);
  if (ctx.description) contextLines.push(`Description: ${ctx.description}`);
  if (ctx.tone) contextLines.push(`Tone: ${ctx.tone}`);
  if (ctx.pricing) contextLines.push(`Pricing: ${ctx.pricing}`);
  if (ctx.colors?.length) contextLines.push(`Brand colors: ${ctx.colors.join(", ")}`);
  if (ctx.fonts?.length) contextLines.push(`Fonts: ${ctx.fonts.join(", ")}`);

  // --- CANVAS LAYOUT block — structured per SITE_GENERATION.md ---
  const sectionLines = insideFrame.map((s, i) => {
    const tag = s.semanticTag?.toUpperCase() ?? "SECTION";
    const label = s.label || s.content || "";
    const role = classifyFrameRole(s, i, insideFrame.length, doc.frame.height);
    const shapeCtx = bundle.shapeContexts[s.id];

    let block = `Frame: "${label || tag}"`;
    block += `\n  Type: ${s.semanticTag || "section"}`;
    block += `\n  Role: ${role}`;
    block += `\n  Size: ${Math.round(s.width)}x${Math.round(s.height)}`;

    if (shapeCtx?.copy.length) {
      block += `\n  Note: "${shapeCtx.copy.join(" | ")}"`;
    }
    if (shapeCtx?.structural.length) {
      block += `\n  Intent: "${shapeCtx.structural.join(" | ")}"`;
    }
    if (shapeCtx?.styleRef) {
      block += `\n  Style-ref: [image attached]`;
    }

    if (s.meta?._resolvedLayout) {
      block += `\n  Resolved: compound layout (pre-analyzed)`;
    }
    if (s.meta?._spatialGroup) {
      const gp = s.meta._spatialGroup as Record<string, unknown>;
      const features = gp.features as Array<Record<string, unknown>> | undefined;
      if (features?.length) {
        block += `\n  Children: [${features.length} cards detected]`;
      }
    }

    return block;
  });

  // --- STYLE REFERENCES block (global + per-shape) ---
  const readyRefs = (references ?? []).filter(
    (r) => r.status === "ready" && r.extractedTokens
  );
  let refSection = "";
  if (readyRefs.length > 0) {
    const refLines = readyRefs.map((r) => {
      const t = r.extractedTokens!;
      const parts: string[] = [`  [${r.tag.toUpperCase()}]`];
      if (t.mood) parts.push(`mood: ${t.mood}`);
      if (t.toneOfVoice) parts.push(`tone of voice: ${t.toneOfVoice}`);
      if (t.layout) parts.push(`layout: ${t.layout}`);
      if (t.colors?.length) parts.push(`colors: ${t.colors.join(", ")}`);
      if (t.fontHeading) parts.push(`heading font: ${t.fontHeading}`);
      if (t.fontBody) parts.push(`body font: ${t.fontBody}`);
      if (t.headingWeight) parts.push(`heading weight: ${t.headingWeight}`);
      if (t.buttonStyle) parts.push(`button style: ${t.buttonStyle}`);
      if (t.cardStyle) parts.push(`card style: ${t.cardStyle}`);
      if (t.navStyle) parts.push(`nav style: ${t.navStyle}`);
      if (r.type === "image") parts.push("[image attached]");
      return parts.join(" | ");
    });
    refSection = `\nStyle references:\n${refLines.join("\n")}`;

    // Summarize the global reference influence for the AI
    const summaryParts: string[] = [];
    for (const r of readyRefs) {
      const t = r.extractedTokens!;
      if (t.mood) summaryParts.push(t.mood);
      if (t.toneOfVoice) summaryParts.push(t.toneOfVoice);
    }
    if (summaryParts.length) {
      refSection += `\nReference influence: The user referenced ${readyRefs.length === 1 ? "a site/image" : `${readyRefs.length} sites/images`} with ${summaryParts.join(", ")} feel. Match this energy in all copy and visual direction.`;
    }
  }

  // --- SCRATCHPAD (highest-signal user intent) ---
  let scratchpadSection = "";
  if (scratchpad.length > 0) {
    scratchpadSection = `\n\nScratchpad (direct user notes — highest priority):\n${scratchpad.map((n) => `  - "${n}"`).join("\n")}`;
  }

  return `## Additional Context

${contextLines.length ? contextLines.join("\n") : "(none provided)"}

## Canvas Intent

Frame: ${doc.frame.width}x${doc.frame.height} (${doc.frame.type})
Sections (in visual order, top to bottom):

${sectionLines.join("\n\n")}${refSection}${scratchpadSection}`;
}

// Legacy helper — backward compatibility
export function serializeCanvasToPrompt(doc: CanvasDocument, globalContext: string): string {
  return serializeForPrompt(doc, {
    global: {},
    rawText: globalContext,
    shapeContexts: {},
  });
}
