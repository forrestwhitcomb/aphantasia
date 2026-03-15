// ============================================================
// APHANTASIA — Layout Resolver
// ============================================================
// Takes a SlotBag (from SlotExtractor) and a SemanticTag and
// resolves it into a SectionContent discriminated union.
//
// Decision priority:
//   1. Feature grid  (spatial: similar horizontal children)
//   2. Text-image split (spatial: image present, no sub-items)
//   3. Semantic tag fallback
// ============================================================

import type { SectionContent, FeatureItem } from "@/types/render";
import type { SemanticTag } from "@/engine/CanvasEngine";
import type { SlotBag, ContentSlot } from "./SlotBag";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSlot(bag: SlotBag, role: ContentSlot["role"]): string | undefined {
  return bag.slots.find((s) => s.role === role)?.value;
}

function subItemToFeature(item: SlotBag): FeatureItem {
  return {
    heading: getSlot(item, "heading") || "Card",
    body: getSlot(item, "body"),
    cta: getSlot(item, "cta"),
    imageSrc: getSlot(item, "image"),
    icon: getSlot(item, "icon"),
  };
}

// ---------------------------------------------------------------------------
// Main resolver
// ---------------------------------------------------------------------------

export function resolveLayout(
  bag: SlotBag,
  semanticTag: SemanticTag,
): SectionContent {
  // ── 1. Feature grid ────────────────────────────────────────────────────
  if (
    bag.subItems.length >= 2 &&
    bag.hints.childrenAreSimilar &&
    bag.hints.childrenAreHorizontal
  ) {
    return {
      type: "feature-grid",
      props: {
        title: getSlot(bag, "heading"),
        subtitle: getSlot(bag, "body"),
        features: bag.subItems.map(subItemToFeature),
      },
    };
  }

  // ── 2. Text-image split ────────────────────────────────────────────────
  if (bag.hints.hasImage && bag.subItems.length === 0) {
    const imgSlot = bag.slots.find((s) => s.role === "image");
    const imgSrc = imgSlot?.value;
    // Image position: prefer hints (relative to sibling rects), fall back to
    // the slot's own position (relative to parent center)
    const imgPos = bag.hints.imagePosition || (imgSlot?.position as "left" | "right" | undefined);
    return {
      type: "text-image-split",
      props: {
        heading: getSlot(bag, "heading"),
        body: getSlot(bag, "body"),
        cta: getSlot(bag, "cta"),
        imageSrc: imgSrc,
        imageAlt: getSlot(bag, "heading") || "Visual",
        imagePosition: imgPos,
      },
    };
  }

  // ── 3. Semantic tag fallback ───────────────────────────────────────────
  switch (semanticTag) {
    case "hero":
      return {
        type: "hero",
        props: {
          headline: getSlot(bag, "heading"),
          subheadline: getSlot(bag, "body"),
          cta: getSlot(bag, "cta"),
        },
      };

    case "nav":
      return {
        type: "nav",
        props: {
          logo: getSlot(bag, "heading"),
        },
      };

    case "footer":
      return {
        type: "footer",
        props: {
          logo: getSlot(bag, "heading"),
        },
      };

    case "button":
      return {
        type: "cta",
        props: {
          cta: getSlot(bag, "cta") || getSlot(bag, "heading"),
        },
      };

    case "form":
      return {
        type: "event-signup",
        props: {
          eventName: getSlot(bag, "heading"),
        },
      };

    case "portfolio":
      return {
        type: "portfolio",
        props: {
          title: getSlot(bag, "heading"),
        },
      };

    case "ecommerce":
      return {
        type: "ecommerce-grid",
        props: {
          title: getSlot(bag, "heading"),
        },
      };

    case "cards":
      return {
        type: "feature-grid",
        props: {
          title: getSlot(bag, "heading"),
        },
      };

    case "split":
      return {
        type: "text-image-split",
        props: {
          heading: getSlot(bag, "heading"),
          body: getSlot(bag, "body"),
          cta: getSlot(bag, "cta"),
        },
      };

    case "section":
    case "text-block":
    default:
      return {
        type: "generic",
        props: {
          title: getSlot(bag, "heading"),
          body: getSlot(bag, "body"),
          cta: getSlot(bag, "cta"),
        },
      };
  }
}
