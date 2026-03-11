import type { CanvasDocument } from "@/engine/CanvasEngine";

// Converts canvas state into a structured prompt for the AI render pipeline
export function serializeCanvasToPrompt(doc: CanvasDocument, globalContext: string): string {
  const insideFrame = doc.shapes.filter((s) => s.isInsideFrame);
  const outsideFrame = doc.shapes.filter((s) => !s.isInsideFrame);

  return `
OUTPUT TYPE: ${doc.outputType}
FRAME: ${doc.frame.type} (${doc.frame.width}x${doc.frame.height})

SECTIONS (inside frame):
${insideFrame.map((s) => `- ${s.semanticTag?.toUpperCase() ?? "UNKNOWN"}: "${s.label ?? ""}" (${s.width}x${s.height} at ${s.x},${s.y})`).join("\n")}

CONTEXT NOTES (outside frame):
${outsideFrame.map((s) => `- ${s.content ?? s.label ?? ""}`).join("\n")}

GLOBAL CONTEXT:
${globalContext}
  `.trim();
}
