import type { CanvasShape, SemanticTag } from "@/engine/CanvasEngine";

// Rules-based base semantic resolver — fast, deterministic, no AI.
// Called on every canvas change. Must stay synchronous and cheap.
export function resolveSemanticTag(
  shape: CanvasShape,
  frameWidth: number,
  frameHeight: number
): SemanticTag {
  if (!shape.isInsideFrame) {
    return shape.label?.toLowerCase().includes("context")
      ? "context-note"
      : "scratchpad";
  }

  const { width, height, type, label, y } = shape;

  // Non-rectangle shape types map directly
  if (type === "text" || type === "sticky") return "text-block";
  if (type === "arrow") return "unknown";
  if (type === "oval") return "image";

  // Label hints take precedence over geometric rules
  const hint = label?.toLowerCase() ?? "";
  if (hint.includes("nav") || hint.includes("header") || hint.includes("menu")) return "nav";
  if (hint.includes("hero") || hint.includes("banner")) return "hero";
  if (hint.includes("footer")) return "footer";
  if (hint.includes("card") || hint.includes("feature") || hint.includes("pricing")) return "cards";
  if (hint.includes("form") || hint.includes("contact") || hint.includes("signup")) return "form";
  if (hint.includes("button") || hint.includes("cta")) return "button";
  if (hint.includes("image") || hint.includes("photo") || hint.includes("img")) return "image";
  if (hint.includes("split") || hint.includes("two-col")) return "split";
  if (hint.includes("text") || hint.includes("copy") || hint.includes("paragraph")) return "text-block";

  // Geometric rules — ratios relative to frame dimensions
  const widthRatio  = width  / frameWidth;
  const heightRatio = height / frameHeight;
  const yRatio      = y      / frameHeight;

  const isWide    = widthRatio  > 0.55;
  const isShort   = heightRatio < 0.08;
  const isTall    = heightRatio > 0.22;
  const isSmall   = widthRatio  < 0.25 && heightRatio < 0.1;
  const isAtTop   = yRatio      < 0.25;
  const isAtBottom = yRatio     > 0.72;

  if (isSmall) return "button";
  if (isAtTop && isWide && isShort) return "nav";
  if (isAtTop && isWide && isTall) return "hero";
  if (isAtTop && isWide) return "hero";
  if (isAtBottom && isWide) return "footer";
  if (isWide) return "section";

  // Roughly square, not too large → card candidate
  const ar = width / height;
  if (ar > 0.6 && ar < 2.0) return "cards";

  return "section";
}
