// ============================================================
// APHANTASIA — UI Spatial Rules
// ============================================================
// Position, size, and aspect-ratio rules for inferring component
// types from canvas shape geometry. Applied when label rules
// don't match.
//
// Source: aphantasia-ui-build-plan.md, Spatial Inference Rules
// ============================================================

import type { UIComponentType } from "../types";

interface ShapeGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SpatialResult {
  type: UIComponentType;
  variant?: string;
  confidence: number; // 0–1, higher = more certain
}

/**
 * Infer component type from shape position and size relative
 * to the phone frame. Rules are tried in priority order.
 */
export function resolveFromSpatial(
  shape: ShapeGeometry,
  frameWidth: number,
  frameHeight: number
): SpatialResult | null {
  const { x, y, width, height } = shape;
  const relX = x / frameWidth;
  const relY = y / frameHeight;
  const relW = width / frameWidth;
  const relH = height / frameHeight;
  const relBottom = (y + height) / frameHeight;
  const aspectRatio = width / Math.max(height, 1);

  // ── Position-based rules (highest priority) ──

  // Narrow rectangle spanning full width at very top → StatusBar or NavBar
  if (relY < 0.07 && relW > 0.8 && relH < 0.08) {
    // Very thin at top → StatusBar
    if (relH < 0.04) {
      return { type: "statusBar", confidence: 0.8 };
    }
    return { type: "navBar", confidence: 0.85 };
  }

  // Narrow rectangle spanning full width at very bottom → TabBar
  if (relBottom > 0.9 && relW > 0.8 && relH < 0.1) {
    return { type: "tabBar", confidence: 0.85 };
  }

  // Large rectangle covering bottom 40–70% of frame → BottomSheet
  if (relBottom > 0.85 && relH > 0.3 && relH < 0.75 && relW > 0.8) {
    return { type: "bottomSheet", confidence: 0.7 };
  }

  // Small circle or square at bottom-right corner → FAB
  if (relX > 0.7 && relBottom > 0.8 && relW < 0.2 && relH < 0.1) {
    const isSquarish = aspectRatio > 0.7 && aspectRatio < 1.5;
    if (isSquarish) {
      return { type: "floatingActionButton", confidence: 0.75 };
    }
  }

  // ── Size-based rules ──

  // Very small square (< ~24×24 logical relative to frame)
  if (width < frameWidth * 0.1 && height < frameHeight * 0.04) {
    const isSquarish = aspectRatio > 0.7 && aspectRatio < 1.5;
    if (isSquarish) {
      if (width < frameWidth * 0.06) {
        return { type: "checkbox", confidence: 0.5 };
      }
      return { type: "avatar", confidence: 0.5 };
    }
  }

  // Small pill (width > 2× height, height small)
  if (aspectRatio > 2 && relH < 0.05) {
    if (relW < 0.3) {
      return { type: "badge", confidence: 0.6 };
    }
    if (relW < 0.5) {
      return { type: "tag", confidence: 0.55 };
    }
  }

  // Wide rectangle, very thin (height < ~8px relative) → Divider or ProgressBar
  if (relW > 0.7 && relH < 0.015) {
    return { type: "divider", confidence: 0.7 };
  }

  // Wide rectangle, thin (height ~36–44px) → Button or SegmentedControl
  if (relW > 0.6 && relH > 0.04 && relH < 0.065) {
    // If nearly full width, likely a button
    if (relW > 0.85) {
      return { type: "button", confidence: 0.65 };
    }
    return { type: "segmentedControl", confidence: 0.55 };
  }

  // Medium rectangle (roughly frame width, height ~44–56px) → ListItem or TextInput
  if (relW > 0.8 && relH > 0.05 && relH < 0.08) {
    // If it's in the middle of the screen, more likely an input
    if (relY > 0.3 && relY < 0.7) {
      return { type: "textInput", confidence: 0.5 };
    }
    return { type: "listItem", confidence: 0.5 };
  }

  // Wide + medium-tall at top (below nav area) → SearchBar
  if (relY < 0.18 && relY > 0.05 && relW > 0.8 && relH > 0.04 && relH < 0.08) {
    return { type: "searchBar", confidence: 0.7 };
  }

  // ── Aspect ratio rules ──

  // Rectangle with aspect ratio near 16:9 → ImagePlaceholder
  if (aspectRatio > 1.5 && aspectRatio < 2.0 && relW > 0.6) {
    return { type: "imagePlaceholder", confidence: 0.6 };
  }

  // Rectangle with aspect ratio near 1:1, medium size → Card
  if (aspectRatio > 0.7 && aspectRatio < 1.5 && relW > 0.3 && relW < 0.6 && relH > 0.1) {
    return { type: "card", confidence: 0.55 };
  }

  // Large rectangle (significant area, not at edges) → Card
  if (relW > 0.7 && relH > 0.1 && relH < 0.35 && relY > 0.1 && relBottom < 0.9) {
    return { type: "card", confidence: 0.5 };
  }

  // Medium centered rectangle → Modal
  if (relX > 0.1 && relX + relW < 0.9 && relY > 0.2 && relBottom < 0.8 && relH > 0.15) {
    return { type: "modal", confidence: 0.4 };
  }

  // Fallback: wide rectangle in content area → Card
  if (relW > 0.5 && relH > 0.08) {
    return { type: "card", confidence: 0.3 };
  }

  return null;
}
