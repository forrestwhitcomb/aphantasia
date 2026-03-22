// ============================================================
// APHANTASIA — Snap Grid
// ============================================================
// 8px grid snap for precise shape alignment.
// Exports snap function and grid overlay SVG generator.
// ============================================================

const DEFAULT_GRID_SIZE = 8;

/**
 * Snap a coordinate to the nearest grid point.
 */
export function snapToGrid(
  value: number,
  gridSize: number = DEFAULT_GRID_SIZE
): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap x,y coordinates to the nearest grid point.
 */
export function snapPointToGrid(
  x: number,
  y: number,
  gridSize: number = DEFAULT_GRID_SIZE
): { x: number; y: number } {
  return {
    x: snapToGrid(x, gridSize),
    y: snapToGrid(y, gridSize),
  };
}

/**
 * Generate a CSS background pattern for the grid overlay.
 * Renders as a subtle dot grid when enabled.
 */
export function gridOverlayCSS(
  gridSize: number = DEFAULT_GRID_SIZE,
  color: string = "rgba(0,0,0,0.06)"
): string {
  return `
    background-image: radial-gradient(circle, ${color} 1px, transparent 1px);
    background-size: ${gridSize}px ${gridSize}px;
  `;
}
