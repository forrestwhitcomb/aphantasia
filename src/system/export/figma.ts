// ============================================================
// Aphantasia/System — Figma Design System Import
// ============================================================

import { DEFAULT_TOKENS } from "../tokens";

// ── Types ───────────────────────────────────────────────────

export interface FigmaImportResult {
  tokens: Record<string, string>;
  unmapped: Array<{ name: string; value: string }>;
  source: {
    fileName: string;
    fileKey: string;
    variableCount: number;
    styleCount: number;
    walkedNodeCount?: number;
  };
}

// ── URL parsing ─────────────────────────────────────────────

export interface ParsedFigmaUrl {
  fileKey: string;
  nodeId: string | null;
}

export function parseFigmaUrl(url: string): ParsedFigmaUrl | null {
  // Handles:
  //   https://www.figma.com/file/KEY/name
  //   https://www.figma.com/design/KEY/name?node-id=123-456
  //   https://www.figma.com/design/KEY/name?node-id=123-456&m=dev
  const keyMatch = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
  if (!keyMatch) return null;
  const nodeMatch = url.match(/node-id=([0-9]+-[0-9]+)/);
  return { fileKey: keyMatch[1], nodeId: nodeMatch ? nodeMatch[1] : null };
}

/** @deprecated use parseFigmaUrl instead */
export function parseFigmaFileKey(url: string): string | null {
  const result = parseFigmaUrl(url);
  return result ? result.fileKey : null;
}

// ── Color conversion ────────────────────────────────────────

function rgbaToHex(r: number, g: number, b: number, a?: number): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0");
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a !== undefined && a < 1) return `${hex}${toHex(a)}`;
  return hex;
}

function normalizeFigmaColor(value: unknown): string | null {
  if (typeof value === "string") {
    if (value.startsWith("#")) return value;
    return value;
  }
  if (typeof value === "object" && value !== null) {
    const c = value as Record<string, number>;
    if ("r" in c && "g" in c && "b" in c) {
      return rgbaToHex(c.r, c.g, c.b, c.a);
    }
  }
  return null;
}

function normalizeSpacing(value: unknown): string | null {
  if (typeof value === "number") return `${value}px`;
  if (typeof value === "string") {
    if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`;
    return value;
  }
  return null;
}

// ── Token name mapping ──────────────────────────────────────

const TOKEN_MAP: Array<{ patterns: RegExp[]; adsKey: string }> = [
  // Brand colors
  { patterns: [/^colou?rs?[-\/.]primary$/i, /^brand[-\/.]primary$/i], adsKey: "brand.primary" },
  { patterns: [/^colou?rs?[-\/.]primary[-\/.]fg$/i, /^brand[-\/.]primary[-\/.]fg$/i, /^colou?rs?[-\/.]on.?primary$/i], adsKey: "brand.primary.fg" },
  { patterns: [/^colou?rs?[-\/.]secondary$/i, /^brand[-\/.]secondary$/i], adsKey: "brand.secondary" },
  { patterns: [/^colou?rs?[-\/.]secondary[-\/.]fg$/i, /^brand[-\/.]secondary[-\/.]fg$/i], adsKey: "brand.secondary.fg" },
  { patterns: [/^colou?rs?[-\/.](?:destructive|error|danger)$/i], adsKey: "brand.destructive" },
  { patterns: [/^colou?rs?[-\/.]success$/i], adsKey: "brand.success" },

  // Backgrounds
  { patterns: [/^(?:colou?rs?|bg|background)[-\/.](?:page|default|background|surface)$/i], adsKey: "bg.page" },
  { patterns: [/^(?:colou?rs?|bg|background)[-\/.]card$/i], adsKey: "bg.card" },
  { patterns: [/^(?:colou?rs?|bg|background)[-\/.]muted$/i], adsKey: "bg.muted" },
  { patterns: [/^(?:colou?rs?|bg|background)[-\/.]subtle$/i], adsKey: "bg.subtle" },

  // Text
  { patterns: [/^(?:text|foreground)[-\/.](?:primary|default)$/i], adsKey: "text.primary" },
  { patterns: [/^(?:text|foreground)[-\/.](?:secondary|muted)$/i], adsKey: "text.secondary" },
  { patterns: [/^(?:text|foreground)[-\/.](?:tertiary|subtle|disabled)$/i], adsKey: "text.tertiary" },
  { patterns: [/^(?:text|foreground)[-\/.]inverse$/i], adsKey: "text.inverse" },

  // Border
  { patterns: [/^(?:border|stroke)[-\/.](?:default|primary)$/i], adsKey: "border.default" },
  { patterns: [/^(?:border|stroke)[-\/.](?:strong|secondary)$/i], adsKey: "border.strong" },
  { patterns: [/^(?:border|stroke)[-\/.]focus$/i], adsKey: "border.focus" },

  // Spacing
  { patterns: [/^spacing[-\/.](?:2?xs|extra.?small)$/i], adsKey: "spacing.xs" },
  { patterns: [/^spacing[-\/.](?:sm|small)$/i], adsKey: "spacing.sm" },
  { patterns: [/^spacing[-\/.](?:md|medium|base)$/i], adsKey: "spacing.md" },
  { patterns: [/^spacing[-\/.](?:lg|large)$/i], adsKey: "spacing.lg" },
  { patterns: [/^spacing[-\/.](?:xl|extra.?large)$/i], adsKey: "spacing.xl" },
  { patterns: [/^spacing[-\/.](?:2xl|xxl)$/i], adsKey: "spacing.2xl" },
  { patterns: [/^spacing[-\/.](?:3xl|xxxl)$/i], adsKey: "spacing.3xl" },

  // Radius
  { patterns: [/^radius[-\/.](?:sm|small)$/i], adsKey: "radius.sm" },
  { patterns: [/^radius[-\/.](?:md|medium|base|default)$/i], adsKey: "radius.md" },
  { patterns: [/^radius[-\/.](?:lg|large)$/i], adsKey: "radius.lg" },
  { patterns: [/^radius[-\/.](?:xl|extra.?large)$/i], adsKey: "radius.xl" },
  { patterns: [/^radius[-\/.](?:full|pill|round)$/i], adsKey: "radius.full" },

  // Material / M3 surface synonyms for background slots
  { patterns: [/^surface[-\/.](?:primary|default|background)$/i], adsKey: "bg.page" },
  { patterns: [/^surface[-\/.](?:container|elevated)$/i], adsKey: "bg.card" },
  { patterns: [/^surface[-\/.](?:muted|variant)$/i], adsKey: "bg.muted" },
  { patterns: [/^on.?surface$/i, /^on.?background$/i], adsKey: "text.primary" },

  // Shadow / elevation styles (fills shadow.* token category)
  { patterns: [/^(?:shadow|elevation)[-\/.](?:xs|1)$/i], adsKey: "shadow.sm" },
  { patterns: [/^(?:shadow|elevation)[-\/.](?:sm|2)$/i], adsKey: "shadow.sm" },
  { patterns: [/^(?:shadow|elevation)[-\/.](?:md|3)$/i], adsKey: "shadow.md" },
  { patterns: [/^(?:shadow|elevation)[-\/.](?:lg|4)$/i], adsKey: "shadow.lg" },
  { patterns: [/^(?:shadow|elevation)[-\/.](?:xl|5)$/i], adsKey: "shadow.xl" },

  // Corner as a synonym for radius
  { patterns: [/^corner[-\/.](?:sm|small)$/i], adsKey: "radius.sm" },
  { patterns: [/^corner[-\/.](?:md|medium)$/i], adsKey: "radius.md" },
  { patterns: [/^corner[-\/.](?:lg|large)$/i], adsKey: "radius.lg" },
  { patterns: [/^corner[-\/.](?:xl|xlarge|extra.?large)$/i], adsKey: "radius.xl" },
  { patterns: [/^corner[-\/.](?:full|round|pill)$/i], adsKey: "radius.full" },

  // Font family synonyms
  { patterns: [/^(?:font|typography)[-\/.](?:family|sans)$/i], adsKey: "font.sans" },
  { patterns: [/^(?:font|typography)[-\/.]mono$/i], adsKey: "font.mono" },
];

function matchTokenName(figmaName: string): string | null {
  const normalized = figmaName.replace(/\//g, ".");
  for (const entry of TOKEN_MAP) {
    for (const pattern of entry.patterns) {
      if (pattern.test(figmaName) || pattern.test(normalized)) {
        return entry.adsKey;
      }
    }
  }
  return null;
}

// ── Fallback heuristic mapping ──────────────────────────────
// Real Figma files use diverse naming ("Surface/Primary", "Neutral/900",
// "Brand/Blue") that the regex pass won't match. After the regex pass runs,
// scan unmapped entries and fill in the most important missing tokens using
// color math (saturation + lightness) and loose name matching for radius.

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.match(/^#([\da-f]{6})([\da-f]{2})?$/i);
  if (!m) return null;
  const h = m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function colorStats(hex: string): { lightness: number; saturation: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;
  const denom = 1 - Math.abs(2 * lightness - 1);
  const saturation = denom === 0 ? 0 : delta / denom;
  return { lightness, saturation };
}

// Hue in degrees (0-360). Returns null for pure grayscale input.
function hueFromHex(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return null;
  let h: number;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h *= 60;
  if (h < 0) h += 360;
  return h;
}

// Shortest angular distance between two hues (0-180).
function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

// Naive hex midpoint — 50/50 blend.
function blendHex(a: string, b: string): string | null {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return null;
  const mix = [0, 1, 2].map((i) => Math.round((ra[i] * 0.6 + rb[i] * 0.4)));
  return `#${mix.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}


function applyFallbackMapping(
  tokens: Record<string, string>,
  unmapped: Array<{ name: string; value: string }>,
): void {
  type ColorItem = { name: string; value: string; stats: { lightness: number; saturation: number } };
  const colorItems: ColorItem[] = [];
  for (const u of unmapped) {
    if (!u.value.startsWith("#")) continue;
    const stats = colorStats(u.value);
    if (stats) colorItems.push({ name: u.name, value: u.value, stats });
  }

  // brand.primary — highest saturation, avoiding pure black/white
  if (!tokens["brand.primary"]) {
    const candidates = colorItems
      .filter((c) => c.stats.saturation > 0.2 && c.stats.lightness > 0.2 && c.stats.lightness < 0.8)
      .sort((a, b) => b.stats.saturation - a.stats.saturation);
    if (candidates.length > 0) tokens["brand.primary"] = candidates[0].value;
  }

  // bg.page — lightest color (only if meaningfully light)
  if (!tokens["bg.page"]) {
    const sorted = colorItems.slice().sort((a, b) => b.stats.lightness - a.stats.lightness);
    if (sorted.length > 0 && sorted[0].stats.lightness > 0.85) {
      tokens["bg.page"] = sorted[0].value;
    }
  }

  // text.primary — darkest color (only if meaningfully dark)
  if (!tokens["text.primary"]) {
    const sorted = colorItems.slice().sort((a, b) => a.stats.lightness - b.stats.lightness);
    if (sorted.length > 0 && sorted[0].stats.lightness < 0.3) {
      tokens["text.primary"] = sorted[0].value;
    }
  }

  // radius.md — any unmapped float with radius/corner/rounded in the name
  if (!tokens["radius.md"]) {
    const radiusItem = unmapped.find(
      (u) => /(radius|corner|rounded)/i.test(u.name) && /^\d+(\.\d+)?px$/i.test(u.value),
    );
    if (radiusItem) tokens["radius.md"] = radiusItem.value;
  }

  // ── Extended heuristics ──

  // Numeric neutral scales: Neutral/50..Neutral/900, Gray/..., Slate/..., etc.
  const neutralScale: Array<{ bucket: number; value: string; lightness: number }> = [];
  for (const u of unmapped) {
    if (!u.value.startsWith("#")) continue;
    const m = u.name.match(/^(?:neutral|gray|grey|slate|zinc|stone)[-\/.](\d{1,3})$/i);
    if (!m) continue;
    const stats = colorStats(u.value);
    if (!stats) continue;
    neutralScale.push({ bucket: parseInt(m[1], 10), value: u.value, lightness: stats.lightness });
  }
  if (neutralScale.length > 0) {
    neutralScale.sort((a, b) => a.bucket - b.bucket);
    const lowest = neutralScale[0];
    const highest = neutralScale[neutralScale.length - 1];
    const pickMid = (lo: number, hi: number) =>
      neutralScale.find((n) => n.bucket >= lo && n.bucket <= hi);
    if (!tokens["bg.page"] && lowest && lowest.lightness > 0.9) tokens["bg.page"] = lowest.value;
    if (!tokens["bg.muted"]) {
      const n = pickMid(100, 200);
      if (n) tokens["bg.muted"] = n.value;
    }
    if (!tokens["border.default"]) {
      const n = pickMid(200, 300);
      if (n) tokens["border.default"] = n.value;
    }
    if (!tokens["border.strong"]) {
      const n = pickMid(300, 400);
      if (n) tokens["border.strong"] = n.value;
    }
    if (!tokens["text.tertiary"]) {
      const n = pickMid(400, 500);
      if (n) tokens["text.tertiary"] = n.value;
    }
    if (!tokens["text.secondary"]) {
      const n = pickMid(600, 700);
      if (n) tokens["text.secondary"] = n.value;
    }
    if (!tokens["text.primary"] && highest && highest.lightness < 0.2) {
      tokens["text.primary"] = highest.value;
    }
  }

  // Hue-named colors: Brand/Blue, Accent/Red, etc.
  // If brand.primary is still empty, prefer the hue closest to the default (blue ≈ 220°)
  if (!tokens["brand.primary"]) {
    const candidates = colorItems
      .map((c) => {
        const m = c.name.match(/^(?:brand|accent|primary)[-\/.](blue|red|green|purple|orange|yellow|pink|cyan|teal)$/i);
        if (!m) return null;
        const hue = hueFromHex(c.value);
        if (hue === null) return null;
        return { value: c.value, hue, name: m[1].toLowerCase() };
      })
      .filter((c): c is { value: string; hue: number; name: string } => c !== null);
    if (candidates.length > 0) {
      // Prefer an exact "Blue" since our default is bluish; otherwise pick closest to 220°
      const blue = candidates.find((c) => c.name === "blue");
      const chosen = blue ?? candidates.sort((a, b) => hueDistance(a.hue, 220) - hueDistance(b.hue, 220))[0];
      tokens["brand.primary"] = chosen.value;
    }
  }

  // brand.destructive — red-ish hue-named color if empty
  if (!tokens["brand.destructive"]) {
    const red = colorItems.find((c) => {
      const hue = hueFromHex(c.value);
      if (hue === null) return false;
      return /(destructive|danger|error|red)/i.test(c.name) && (hueDistance(hue, 0) < 25 || hueDistance(hue, 360) < 25);
    });
    if (red) tokens["brand.destructive"] = red.value;
  }

  // brand.success — green-ish hue-named
  if (!tokens["brand.success"]) {
    const green = colorItems.find((c) => {
      const hue = hueFromHex(c.value);
      if (hue === null) return false;
      return /(success|positive|ok|green)/i.test(c.name) && hueDistance(hue, 130) < 35;
    });
    if (green) tokens["brand.success"] = green.value;
  }

  // brand.secondary — highest saturation color NOT within 20° of primary
  if (!tokens["brand.secondary"] && tokens["brand.primary"]) {
    const primaryHue = hueFromHex(tokens["brand.primary"]);
    const candidates = colorItems
      .filter((c) => c.stats.saturation > 0.2 && c.stats.lightness > 0.2 && c.stats.lightness < 0.8)
      .filter((c) => {
        if (primaryHue === null) return true;
        const h = hueFromHex(c.value);
        return h !== null && hueDistance(h, primaryHue) >= 20;
      })
      .sort((a, b) => b.stats.saturation - a.stats.saturation);
    if (candidates.length > 0) tokens["brand.secondary"] = candidates[0].value;
  }

  // Fill-ins for bg.card / text.secondary when their parents are filled
  if (!tokens["bg.card"] && tokens["bg.page"]) tokens["bg.card"] = tokens["bg.page"];
  if (!tokens["text.secondary"] && tokens["text.primary"] && tokens["bg.page"]) {
    const blended = blendHex(tokens["text.primary"], tokens["bg.page"]);
    if (blended) tokens["text.secondary"] = blended;
  }

  // Foreground colors for brand slots: default to white if not set
  if (!tokens["brand.primary.fg"] && tokens["brand.primary"]) tokens["brand.primary.fg"] = "#ffffff";
  if (!tokens["brand.secondary.fg"] && tokens["brand.secondary"]) tokens["brand.secondary.fg"] = "#ffffff";
}

// ── Effect → CSS box-shadow ─────────────────────────────────
// Compose DROP_SHADOW / INNER_SHADOW entries from a Figma effects array into
// a single CSS box-shadow string. LAYER_BLUR / BACKGROUND_BLUR are skipped
// (no token slot for those).

function effectsToCssShadow(effects: Array<Record<string, unknown>>): string | null {
  const parts: string[] = [];
  for (const e of effects) {
    if (!e || typeof e !== "object") continue;
    if (e.visible === false) continue;
    const type = e.type as string | undefined;
    if (type !== "DROP_SHADOW" && type !== "INNER_SHADOW") continue;

    const off = (e.offset ?? {}) as { x?: number; y?: number };
    const ox = typeof off.x === "number" ? off.x : 0;
    const oy = typeof off.y === "number" ? off.y : 0;
    const radius = typeof e.radius === "number" ? e.radius : 0;
    const spread = typeof e.spread === "number" ? e.spread : 0;

    const c = (e.color ?? {}) as { r?: number; g?: number; b?: number; a?: number };
    const r = typeof c.r === "number" ? Math.round(c.r * 255) : 0;
    const g = typeof c.g === "number" ? Math.round(c.g * 255) : 0;
    const b = typeof c.b === "number" ? Math.round(c.b * 255) : 0;
    const a = typeof c.a === "number" ? c.a : 1;
    const rgba = `rgba(${r},${g},${b},${a})`;

    const inset = type === "INNER_SHADOW" ? "inset " : "";
    parts.push(`${inset}${ox}px ${oy}px ${radius}px ${spread}px ${rgba}`);
  }
  return parts.length > 0 ? parts.join(", ") : null;
}

// ── Node tree harvest ───────────────────────────────────────
// Walk the pinned subtree and collect autolayout padding/gap and cornerRadius
// values. After the walk, use frequency analysis to fill any still-empty
// spacing.* and radius.* token slots.

function harvestNodeTree(
  root: unknown,
  tokens: Record<string, string>,
  unmapped: Array<{ name: string; value: string }>,
): number {
  const MAX_DEPTH = 6;
  const MAX_NODES = 2000;
  const spacingVals: number[] = [];
  const radiusByHint: Array<{ value: number; hint: string }> = [];
  const harvestedColors = new Map<string, { hex: string; hint: string }>(); // name -> color
  let count = 0;

  function nodeName(n: Record<string, unknown>): string {
    return typeof n.name === "string" ? n.name : "";
  }

  function walk(n: unknown, depth: number, ancestorHint: string): void {
    if (!n || typeof n !== "object" || count >= MAX_NODES) return;
    count++;
    const node = n as Record<string, unknown>;
    const name = nodeName(node);
    const hint = /button|card|section|badge|input|nav/i.test(name) ? name.toLowerCase() : ancestorHint;

    const layout = node.layoutMode as string | undefined;
    if (layout === "HORIZONTAL" || layout === "VERTICAL") {
      for (const k of ["itemSpacing", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
        const v = node[k];
        if (typeof v === "number" && v > 0 && v < 200) spacingVals.push(Math.round(v));
      }
    }

    const cornerRadius = node.cornerRadius;
    if (typeof cornerRadius === "number" && cornerRadius >= 0 && cornerRadius < 1000) {
      // Figma stores cornerRadius as float — snap to nearest integer to avoid
      // ugly values like 4.599999904632568px
      radiusByHint.push({ value: Math.round(cornerRadius), hint });
    }

    // Harvest solid fills from named frames/components/instances. These can
    // back out to brand/bg/text/border tokens when Figma variables aren't
    // accessible (e.g., non-Enterprise plans).
    const nodeType = node.type as string | undefined;
    if (nodeType && /^(FRAME|COMPONENT|COMPONENT_SET|INSTANCE|RECTANGLE|ELLIPSE)$/.test(nodeType) && name) {
      const fills = node.fills as Array<Record<string, unknown>> | undefined;
      if (fills && fills.length > 0) {
        const solid = fills.find((f) => f && f.type === "SOLID" && f.visible !== false);
        if (solid) {
          const hex = normalizeFigmaColor(solid.color);
          if (hex && !harvestedColors.has(name)) {
            harvestedColors.set(name, { hex, hint });
          }
        }
      }
    }

    if (depth < MAX_DEPTH && Array.isArray(node.children)) {
      for (const child of node.children as unknown[]) walk(child, depth + 1, hint);
    }
  }

  // Some API responses wrap the node tree under { document: {...} }
  const rootNode = (root && typeof root === "object" && "document" in (root as Record<string, unknown>))
    ? (root as Record<string, unknown>).document
    : root;
  walk(rootNode, 0, "");

  // Spacing rungs: the 5 most common distinct values in ascending order map
  // to xs/sm/md/lg/xl (skipping any slot already filled by variables/styles)
  if (spacingVals.length > 0) {
    const freq = new Map<number, number>();
    for (const s of spacingVals) freq.set(s, (freq.get(s) ?? 0) + 1);
    const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map((e) => e[0]);
    const rungs = ranked.sort((a, b) => a - b).slice(0, 5);
    const slots = ["spacing.xs", "spacing.sm", "spacing.md", "spacing.lg", "spacing.xl"];
    for (let i = 0; i < rungs.length && i < slots.length; i++) {
      if (!tokens[slots[i]]) tokens[slots[i]] = `${rungs[i]}px`;
    }
  }

  // Corner radii: bucket values into sm/md/lg/xl/full and pick each bucket's
  // most-common value. Bias by hint (Button→radius.md, Card→radius.lg) on ties.
  if (radiusByHint.length > 0) {
    const buckets: Record<"sm" | "md" | "lg" | "xl" | "full", Map<number, { c: number; hints: string[] }>> = {
      sm: new Map(), md: new Map(), lg: new Map(), xl: new Map(), full: new Map(),
    };
    for (const r of radiusByHint) {
      let bucket: keyof typeof buckets;
      if (r.value >= 999) bucket = "full";
      else if (r.value <= 4) bucket = "sm";
      else if (r.value <= 9) bucket = "md";
      else if (r.value <= 14) bucket = "lg";
      else bucket = "xl";
      const entry = buckets[bucket].get(r.value) ?? { c: 0, hints: [] };
      entry.c++;
      if (r.hint) entry.hints.push(r.hint);
      buckets[bucket].set(r.value, entry);
    }
    const pickFromBucket = (b: Map<number, { c: number; hints: string[] }>): number | undefined => {
      if (b.size === 0) return undefined;
      return [...b.entries()].sort((a, b) => b[1].c - a[1].c)[0][0];
    };
    const tokenFor: Record<string, string> = {
      sm: "radius.sm", md: "radius.md", lg: "radius.lg", xl: "radius.xl", full: "radius.full",
    };
    for (const b of Object.keys(buckets) as Array<keyof typeof buckets>) {
      const v = pickFromBucket(buckets[b]);
      if (v !== undefined) {
        const slot = tokenFor[b];
        if (!tokens[slot]) tokens[slot] = b === "full" ? "9999px" : `${v}px`;
      }
    }
  }

  // Push harvested colors into unmapped so `applyFallbackMapping` can use
  // them (neutral scale matching, hue matching, saturation picking). Also
  // try a direct regex match on the frame name first.
  for (const [name, { hex }] of harvestedColors) {
    const adsKey = matchTokenName(name);
    if (adsKey && !tokens[adsKey]) {
      tokens[adsKey] = hex;
    } else {
      unmapped.push({ name, value: hex });
    }
  }

  // Also surface a small summary in unmapped so the user can see the walk ran
  if (count > 0) {
    unmapped.push({
      name: `(walked ${count} nodes)`,
      value: `${spacingVals.length} spacing, ${radiusByHint.length} radii, ${harvestedColors.size} colors`,
    });
  }
  return count;
}

// ── Main mapping function ───────────────────────────────────

interface FigmaVariable {
  name: string;
  resolvedType: string;
  valuesByMode: Record<string, unknown>;
  variableCollectionId?: string;
}

interface FigmaStyle {
  name: string;
  style_type: string;
  node_id?: string;
  description?: string;
}

export function mapFigmaToADS(
  variablesData: unknown,
  stylesData: unknown,
  fileName: string,
  fileKey: string,
  styleNodeData?: Record<string, unknown>,
  nodeTreeRoot?: unknown,
): FigmaImportResult {
  const tokens: Record<string, string> = {};
  const unmapped: Array<{ name: string; value: string }> = [];
  let variableCount = 0;
  let styleCount = 0;

  // Process variables — prefer each collection's declared default mode over
  // "whatever comes first in the object"
  const varsObj = variablesData as Record<string, Record<string, unknown>>;
  const metaVars = varsObj?.meta?.variables ?? varsObj?.variables ?? {};
  const variables = metaVars as Record<string, FigmaVariable>;
  const variableList = typeof variables === "object" ? Object.values(variables) : [];

  const collections = (varsObj?.meta?.variableCollections ?? varsObj?.variableCollections ?? {}) as Record<
    string,
    { defaultModeId?: string }
  >;
  const defaultModeByCollection: Record<string, string> = {};
  for (const [cid, coll] of Object.entries(collections || {})) {
    if (coll && typeof coll === "object" && typeof coll.defaultModeId === "string") {
      defaultModeByCollection[cid] = coll.defaultModeId;
    }
  }

  for (const v of variableList) {
    if (!v || !v.name) continue;
    variableCount++;

    const modeValues = v.valuesByMode ?? {};
    const defaultMode = v.variableCollectionId ? defaultModeByCollection[v.variableCollectionId] : undefined;
    const preferred = defaultMode !== undefined ? modeValues[defaultMode] : undefined;
    const firstModeValue = preferred !== undefined ? preferred : Object.values(modeValues)[0];
    if (firstModeValue === undefined) continue;

    const adsKey = matchTokenName(v.name);
    const isColor = v.resolvedType === "COLOR";
    const isFloat = v.resolvedType === "FLOAT";
    const isString = v.resolvedType === "STRING";
    const isBoolean = v.resolvedType === "BOOLEAN";

    // BOOLEAN variables don't map to tokens and shouldn't clutter unmapped
    if (isBoolean) continue;

    let normalized: string | null = null;
    if (isColor) normalized = normalizeFigmaColor(firstModeValue);
    else if (isFloat) normalized = normalizeSpacing(firstModeValue);
    else if (isString && typeof firstModeValue === "string" && firstModeValue.length > 0) {
      normalized = firstModeValue;
      // First STRING variable that looks like a font family fills font.sans
      if (!adsKey && /font[-\/.]?(?:family|sans)?/i.test(v.name) && !tokens["font.sans"]) {
        tokens["font.sans"] = normalized;
      }
    } else if (typeof firstModeValue === "string") normalized = firstModeValue;

    if (normalized === null) continue;

    if (adsKey) {
      tokens[adsKey] = normalized;
    } else {
      unmapped.push({ name: v.name, value: normalized });
    }
  }

  // Process styles — use style node data to extract actual fill colors
  const stylesObj = stylesData as Record<string, Record<string, unknown>>;
  const rawStyles = stylesObj?.meta?.styles ?? stylesObj?.styles ?? [];
  const styleArray = (Array.isArray(rawStyles) ? rawStyles : Object.values(rawStyles)) as FigmaStyle[];

  for (const s of styleArray) {
    if (!s || typeof s !== "object") continue;
    const style = s as FigmaStyle;
    if (!style.name) continue;
    styleCount++;

    if (style.style_type === "FILL" && style.node_id && styleNodeData) {
      // Extract color from the node's fills array
      const nodeEntry = styleNodeData[style.node_id] as Record<string, unknown> | undefined;
      const doc = (nodeEntry?.document ?? nodeEntry) as Record<string, unknown> | undefined;
      const fills = doc?.fills as Array<Record<string, unknown>> | undefined;
      if (fills && fills.length > 0) {
        const fill = fills[0];
        if (fill.type === "SOLID" && fill.color) {
          const color = normalizeFigmaColor(fill.color);
          if (color) {
            const adsKey = matchTokenName(style.name);
            if (adsKey && !tokens[adsKey]) {
              tokens[adsKey] = color;
            } else if (!adsKey) {
              unmapped.push({ name: style.name, value: color });
            }
          }
        }
      }
    } else if (style.style_type === "TEXT" && style.node_id && styleNodeData) {
      // Extract typography from the text node's style block
      const nodeEntry = styleNodeData[style.node_id] as Record<string, unknown> | undefined;
      const doc = (nodeEntry?.document ?? nodeEntry) as Record<string, unknown> | undefined;
      const styleObj = doc?.style as Record<string, unknown> | undefined;
      if (styleObj) {
        const fontFamily = styleObj.fontFamily as string | undefined;
        const fontWeight = styleObj.fontWeight as number | undefined;
        const fontSize = styleObj.fontSize as number | undefined;
        // First text style with a fontFamily wins the font.sans slot
        if (fontFamily && !tokens["font.sans"]) {
          tokens["font.sans"] = fontFamily;
        }
        // Weight + size don't have stable slots yet — surface them as unmapped
        // for user visibility and future manual mapping
        if (fontWeight !== undefined) {
          unmapped.push({ name: `${style.name} (weight)`, value: String(fontWeight) });
        }
        if (fontSize !== undefined) {
          unmapped.push({ name: `${style.name} (size)`, value: `${fontSize}px` });
        }
      }
    } else if (style.style_type === "EFFECT" && style.node_id && styleNodeData) {
      // Extract drop shadows (DROP_SHADOW / INNER_SHADOW) from the node's effects
      // array and compose a CSS box-shadow string
      const nodeEntry = styleNodeData[style.node_id] as Record<string, unknown> | undefined;
      const doc = (nodeEntry?.document ?? nodeEntry) as Record<string, unknown> | undefined;
      const effects = doc?.effects as Array<Record<string, unknown>> | undefined;
      if (effects && effects.length > 0) {
        const cssShadow = effectsToCssShadow(effects);
        if (cssShadow) {
          const adsKey = matchTokenName(style.name);
          if (adsKey && !tokens[adsKey]) {
            tokens[adsKey] = cssShadow;
          } else if (!adsKey) {
            unmapped.push({ name: style.name, value: cssShadow });
          }
        }
      }
    }
  }

  // Walk the pinned subtree (if any) for autolayout spacing and cornerRadius
  let walkedNodeCount: number | undefined;
  if (nodeTreeRoot) {
    walkedNodeCount = harvestNodeTree(nodeTreeRoot, tokens, unmapped);
  }

  // After the regex pass and node harvest, fill in any still-missing core
  // tokens using color-math heuristics
  applyFallbackMapping(tokens, unmapped);

  return {
    tokens,
    unmapped,
    source: { fileName, fileKey, variableCount, styleCount, ...(walkedNodeCount !== undefined ? { walkedNodeCount } : {}) },
  };
}
