// ============================================================
// SLOT BAG — Neutral Intermediate Representation
// ============================================================
// A SlotBag captures the detected content within a section
// as generic "slots" (heading, body, cta, image, icon) without
// committing to any specific HTML/component output. Downstream
// renderers consume SlotBags to produce actual markup.
// ============================================================

import type { SemanticTag } from "@/engine/CanvasEngine";

export interface ContentSlot {
  role: "heading" | "body" | "cta" | "image" | "icon";
  value: string;           // text content or image src
  position?: "left" | "right" | "top" | "bottom" | "center";
  shapeId: string;
}

export interface SpatialHints {
  hasImage: boolean;
  imagePosition?: "left" | "right";
  childCount: number;
  childrenAreSimilar: boolean;   // same-ish size (card grid signal)
  childrenAreHorizontal: boolean; // roughly same Y (row signal)
}

export interface SlotBag {
  parentId: string;
  semanticTag?: SemanticTag;     // parent's resolved tag
  slots: ContentSlot[];
  subItems: SlotBag[];           // child cards/items within this section
  consumedIds: Set<string>;
  hints: SpatialHints;
}
