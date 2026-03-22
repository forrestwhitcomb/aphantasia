/** Parse a Figma file key from various URL formats. */
export function parseFigmaFileKey(url: string): string | null {
  const match = url.match(/figma\.com\/(?:design|file|proto)\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

/**
 * Parse node-id from a Figma URL query (?node-id=143-2205 → 143:2205).
 */
export function parseFigmaNodeId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const raw = u.searchParams.get("node-id");
    if (!raw) return null;
    return decodeURIComponent(raw).replace(/-/g, ":");
  } catch {
    const q = url.match(/[?&]node-id=([^&]+)/);
    if (!q) return null;
    return decodeURIComponent(q[1]).replace(/-/g, ":");
  }
}

/**
 * Extract a Figma URL from arbitrary text. Users often paste content like:
 *   "Implement this design from Figma.\n@https://www.figma.com/design/abc123/..."
 * This finds the first figma.com URL in the string.
 * Returns the cleaned URL or null if none found.
 */
export function extractFigmaUrl(text: string): string | null {
  const match = text.match(/https?:\/\/(?:www\.)?figma\.com\/[^\s)>\]"']+/i);
  return match ? match[0] : null;
}
