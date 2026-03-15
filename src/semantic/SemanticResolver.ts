import type { CanvasDocument, CanvasShape, SemanticTag } from "@/engine/CanvasEngine";
import type { SectionContent, TextImageSplitProps } from "@/types/render";
import { resolveSemanticTag } from "./rules";
import { buildContainmentTree, extractSlots, resolveLayout } from "@/spatial";
import { parseTextLabel } from "@/lib/textParse";

// Hybrid resolver: rules first (Phase 1), SlotBag extraction + layout
// resolution (Phase 1b), proximity grouping (Phase 1c), then AI (Phase 2+)

export async function resolveSemantics(doc: CanvasDocument): Promise<CanvasDocument> {
  // Phase 1: per-shape semantic tagging
  const resolvedShapes = doc.shapes.map((shape) => ({
    ...shape,
    semanticTag: resolveSemanticTag(shape, doc.frame.width, doc.frame.height),
  }));

  // Phase 1b: spatial hierarchy via SlotBag system
  const layoutTypes = new Set(["rectangle", "roundedRect", "text", "image"]);
  const inFrame = resolvedShapes.filter(
    (s) => s.isInsideFrame && layoutTypes.has(s.type)
  );

  if (inFrame.length < 2) {
    return { ...doc, shapes: resolvedShapes };
  }

  // Build containment tree
  const childrenMap = buildContainmentTree(inFrame);

  // For each parent with children: extract slots → resolve layout
  const allConsumed = new Set<string>();
  const resolvedLayouts = new Map<string, SectionContent>();

  for (const [parentId, childIds] of childrenMap) {
    const parent = inFrame.find((s) => s.id === parentId);
    if (!parent) continue;

    // Only rectangles can be container parents
    if (parent.type !== "rectangle") continue;

    const children = childIds
      .map((id) => inFrame.find((s) => s.id === id))
      .filter(Boolean) as CanvasShape[];

    // Extract generic slots from spatial relationships
    const bag = extractSlots(parent, children, childrenMap, inFrame);

    // Only resolve layout if we found meaningful content
    if (bag.slots.length === 0 && bag.subItems.length === 0) continue;

    // Resolve the best layout from the slot data
    const semanticTag = parent.semanticTag || "section";
    const layout = resolveLayout(bag, semanticTag);

    resolvedLayouts.set(parentId, layout);

    // Mark all consumed children
    for (const id of bag.consumedIds) {
      allConsumed.add(id);
    }
  }

  // ── Phase 1c: Proximity grouping ──────────────────────────────────────
  // Find orphan images (not consumed, not inside any container) and merge
  // them into the nearest adjacent section. This handles the pattern where
  // a user places an image NEXT TO a section rather than inside it.
  proximityGroupImages(inFrame, allConsumed, resolvedLayouts);

  // Apply results to shapes
  const finalShapes = resolvedShapes.map((s) => {
    // Mark consumed children so renderers skip them
    if (allConsumed.has(s.id)) {
      return { ...s, meta: { ...s.meta, _consumed: true } };
    }

    // Mark group parents with resolved layout
    const layout = resolvedLayouts.get(s.id);
    if (layout) {
      // Determine semantic tag from layout type
      let newTag: SemanticTag = s.semanticTag || "section";
      if (layout.type === "feature-grid") newTag = "cards";
      else if (layout.type === "text-image-split") newTag = "split";

      return {
        ...s,
        semanticTag: newTag,
        meta: {
          ...s.meta,
          _resolvedLayout: layout,
          // Keep _spatialGroup for backward compat with AI merge in PreviewPane
          _spatialGroup: layout.type === "feature-grid" ? layout.props : undefined,
        },
      };
    }

    return s;
  });

  return { ...doc, shapes: finalShapes };
}

// ---------------------------------------------------------------------------
// Proximity grouping: orphan images → nearest section
// ---------------------------------------------------------------------------
// An "orphan image" is an image shape not consumed by containment.
// A "section" is a rectangle that has a resolved layout OR at least some text.
// If they're on the same horizontal band and close together, merge.
// ---------------------------------------------------------------------------

function proximityGroupImages(
  shapes: CanvasShape[],
  consumed: Set<string>,
  layouts: Map<string, SectionContent>,
) {
  const orphanImages = shapes.filter(
    (s) => s.type === "image" && s.meta?.src && !consumed.has(s.id)
  );

  if (orphanImages.length === 0) return;

  // Candidate sections: rectangles not consumed, that are actual layout sections
  const sectionCandidates = shapes.filter(
    (s) =>
      s.type === "rectangle" &&
      !consumed.has(s.id) &&
      s.semanticTag !== "unknown" &&
      s.semanticTag !== "scratchpad" &&
      s.semanticTag !== "context-note"
  );

  for (const img of orphanImages) {
    const imgCx = img.x + img.width / 2;
    const imgCy = img.y + img.height / 2;
    const imgTop = img.y;
    const imgBottom = img.y + img.height;

    let bestSection: CanvasShape | null = null;
    let bestDist = Infinity;

    for (const sec of sectionCandidates) {
      const secTop = sec.y;
      const secBottom = sec.y + sec.height;

      // Must share a vertical band — at least 30% of the image's height
      // overlaps with the section's Y range
      const overlapTop = Math.max(imgTop, secTop);
      const overlapBottom = Math.min(imgBottom, secBottom);
      const overlap = overlapBottom - overlapTop;
      if (overlap < img.height * 0.3) continue;

      // Horizontal distance: gap between edges
      const secLeft = sec.x;
      const secRight = sec.x + sec.width;
      const imgLeft = img.x;
      const imgRight = img.x + img.width;

      let hDist: number;
      if (imgRight <= secLeft) {
        hDist = secLeft - imgRight; // image is left of section
      } else if (imgLeft >= secRight) {
        hDist = imgLeft - secRight; // image is right of section
      } else {
        hDist = 0; // overlapping horizontally (shouldn't happen for non-contained)
      }

      // Max gap: 200px or 20% of section width
      const maxGap = Math.max(200, sec.width * 0.2);
      if (hDist > maxGap) continue;

      if (hDist < bestDist) {
        bestDist = hDist;
        bestSection = sec;
      }
    }

    if (!bestSection) continue;

    // Determine image position relative to section
    const secCx = bestSection.x + bestSection.width / 2;
    const imagePosition: "left" | "right" = imgCx < secCx ? "left" : "right";
    const imageSrc = img.meta!.src as string;

    // Consume the image
    consumed.add(img.id);

    // Merge into the section's resolved layout
    const existingLayout = layouts.get(bestSection.id);

    if (existingLayout) {
      // Section already has a layout — upgrade it to include the image
      if (existingLayout.type === "text-image-split") {
        // Already a split — just add the image
        const props = existingLayout.props as TextImageSplitProps;
        props.imageSrc = imageSrc;
        props.imagePosition = imagePosition;
      } else if (
        existingLayout.type === "hero" ||
        existingLayout.type === "generic"
      ) {
        // Upgrade hero or generic section to text-image-split
        const p = existingLayout.props as Record<string, unknown>;
        layouts.set(bestSection.id, {
          type: "text-image-split",
          props: {
            heading: (p.headline as string) || (p.title as string) || undefined,
            body: (p.subheadline as string) || (p.body as string) || undefined,
            cta: p.cta as string | undefined,
            imageSrc,
            imagePosition,
          },
        });
      }
      // For feature-grid and other complex types, don't merge (keep as-is)
    } else {
      // Section has no resolved layout yet — create a text-image-split from scratch
      const text = bestSection.label || bestSection.content || "";
      const parsed = parseTextLabel(text);
      layouts.set(bestSection.id, {
        type: "text-image-split",
        props: {
          heading: parsed.heading || undefined,
          body: parsed.body || undefined,
          cta: parsed.cta || undefined,
          imageSrc,
          imagePosition,
        },
      });
    }
  }
}
