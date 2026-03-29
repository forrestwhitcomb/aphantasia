// ============================================================
// renderSpec() — Single recursive render function
// ============================================================
// Walks a ComponentSpec tree and produces an HTML string.
// Replaces all 46 per-component HTML renderers.
// ============================================================

import type { ComponentSpec, PaddingSpec, SizeValue } from "./types";
import { isTokenRef } from "./types";
import { resolveToken, resolveTextStyle } from "./tokens";

// ── Size Resolution ──────────────────────────────────────────

function resolveSizeValue(v: SizeValue): string {
  if (typeof v === "number") return `${v}px`;
  if (typeof v === "string") return v;
  if (isTokenRef(v)) return resolveToken(v);
  return "auto";
}

// ── Padding Resolution ───────────────────────────────────────

function resolvePadding(p: PaddingSpec): string {
  // Shorthand: all
  if (p.all) {
    const v = resolveToken(p.all);
    return `padding:${v};`;
  }
  const parts: string[] = [];
  // Shorthand: x/y
  if (p.y) {
    const v = resolveToken(p.y);
    parts.push(`padding-top:${v}`, `padding-bottom:${v}`);
  }
  if (p.x) {
    const v = resolveToken(p.x);
    parts.push(`padding-left:${v}`, `padding-right:${v}`);
  }
  // Per-side overrides
  if (p.top) parts.push(`padding-top:${resolveToken(p.top)}`);
  if (p.right) parts.push(`padding-right:${resolveToken(p.right)}`);
  if (p.bottom) parts.push(`padding-bottom:${resolveToken(p.bottom)}`);
  if (p.left) parts.push(`padding-left:${resolveToken(p.left)}`);
  return parts.map((s) => s + ";").join("");
}

// ── Style Builder ────────────────────────────────────────────

function buildStyles(spec: ComponentSpec): string {
  const s: string[] = [];
  const { layout, style } = spec;

  // Layout
  s.push(`display:${layout.display}`);
  if (layout.direction) s.push(`flex-direction:${layout.direction}`);
  if (layout.align) {
    s.push(
      layout.display === "flex" || layout.display === "inline-flex"
        ? `align-items:${layout.align}`
        : `align-items:${layout.align}`,
    );
  }
  if (layout.justify) {
    s.push(`justify-content:${layout.justify}`);
  }
  if (layout.gap) s.push(`gap:${resolveToken(layout.gap)}`);
  if (layout.padding) s.push(resolvePadding(layout.padding).replace(/;$/, ""));
  if (layout.width !== undefined) s.push(`width:${resolveSizeValue(layout.width)}`);
  if (layout.height !== undefined) s.push(`height:${resolveSizeValue(layout.height)}`);
  if (layout.minHeight !== undefined) s.push(`min-height:${resolveSizeValue(layout.minHeight)}`);
  if (layout.minWidth !== undefined) s.push(`min-width:${resolveSizeValue(layout.minWidth)}`);
  if (layout.maxWidth !== undefined) s.push(`max-width:${resolveSizeValue(layout.maxWidth)}`);
  if (layout.flex) s.push(`flex:${layout.flex}`);
  if (layout.overflow) s.push(`overflow:${layout.overflow}`);
  if (layout.position) s.push(`position:${layout.position}`);
  if (layout.borderRadius) s.push(`border-radius:${resolveToken(layout.borderRadius)}`);
  if (layout.flexShrink !== undefined) s.push(`flex-shrink:${layout.flexShrink}`);
  if (layout.flexGrow !== undefined) s.push(`flex-grow:${layout.flexGrow}`);
  if (layout.flexWrap) s.push(`flex-wrap:${layout.flexWrap}`);
  if (layout.boxSizing) s.push(`box-sizing:${layout.boxSizing}`);
  if (layout.alignSelf) s.push(`align-self:${layout.alignSelf}`);
  if (layout.top !== undefined) s.push(`top:${resolveSizeValue(layout.top)}`);
  if (layout.right !== undefined) s.push(`right:${resolveSizeValue(layout.right)}`);
  if (layout.bottom !== undefined) s.push(`bottom:${resolveSizeValue(layout.bottom)}`);
  if (layout.left !== undefined) s.push(`left:${resolveSizeValue(layout.left)}`);

  // Style
  if (style.background) s.push(`background:${resolveToken(style.background)}`);
  if (style.color) s.push(`color:${resolveToken(style.color)}`);
  if (style.border) {
    const b = style.border;
    const bw = b.width ?? "1px";
    const bs = b.style ?? "solid";
    const bc = b.color ? resolveToken(b.color) : "transparent";
    s.push(`border:${bw} ${bs} ${bc}`);
  }
  if (style.borderTop) {
    const b = style.borderTop;
    s.push(`border-top:${b.width ?? "1px"} ${b.style ?? "solid"} ${b.color ? resolveToken(b.color) : "transparent"}`);
  }
  if (style.borderBottom) {
    const b = style.borderBottom;
    s.push(`border-bottom:${b.width ?? "1px"} ${b.style ?? "solid"} ${b.color ? resolveToken(b.color) : "transparent"}`);
  }
  if (style.shadow) s.push(`box-shadow:${resolveToken(style.shadow)}`);
  if (style.opacity !== undefined) s.push(`opacity:${style.opacity}`);
  if (style.cursor) s.push(`cursor:${style.cursor}`);
  if (style.textOverflow) s.push(`text-overflow:${style.textOverflow}`);
  if (style.whiteSpace) s.push(`white-space:${style.whiteSpace}`);
  if (style.overflowText) s.push(`overflow:${style.overflowText}`);
  if (style.textAlign) s.push(`text-align:${style.textAlign}`);
  if (style.fontSize) s.push(`font-size:${typeof style.fontSize === "number" ? `${style.fontSize}px` : style.fontSize}`);
  if (style.fontFamily) s.push(`font-family:${style.fontFamily}`);
  if (style.letterSpacing) s.push(`letter-spacing:${style.letterSpacing}`);
  if (style.lineHeight) s.push(`line-height:${typeof style.lineHeight === "number" ? `${style.lineHeight}px` : style.lineHeight}`);

  return s.join(";");
}

// ── Text Rendering ───────────────────────────────────────────

function renderText(spec: ComponentSpec): string {
  if (!spec.text) return "";
  const ts = resolveTextStyle(spec.text.style);
  const parts: string[] = [
    `font-family:${ts.family}`,
    `font-size:${ts.size}`,
    `line-height:${ts.lh}`,
    `font-weight:${spec.text.weight ?? ts.weight}`,
    `letter-spacing:${ts.ls}`,
  ];
  if (spec.text.color) parts.push(`color:${resolveToken(spec.text.color)}`);
  if (spec.text.align) parts.push(`text-align:${spec.text.align}`);
  const editable = spec.text.editable ? " data-text-editable" : "";
  return `<span style="${parts.join(";")}"${editable}>${escapeHtml(spec.text.content)}</span>`;
}

// ── Data Attributes ──────────────────────────────────────────

function buildDataAttrs(spec: ComponentSpec): string {
  const attrs: string[] = [];
  if (spec.data) {
    for (const [k, v] of Object.entries(spec.data)) {
      if (k === "innerHTML") continue; // handled separately
      attrs.push(`data-${k}="${escapeAttr(v)}"`);
    }
  }
  if (spec.interactive) {
    attrs.push(`data-interactive="${spec.interactive.type}"`);
    if (spec.interactive.navigateTo) {
      attrs.push(`data-navigate-to="${escapeAttr(spec.interactive.navigateTo)}"`);
    }
  }
  return attrs.join(" ");
}

// ── Main Render Function ─────────────────────────────────────

export function renderSpec(spec: ComponentSpec): string {
  const style = buildStyles(spec);
  const dataAttrs = buildDataAttrs(spec);
  const tag = spec.tag;

  let inner = "";

  // SVG innerHTML injection (for icons)
  if (spec.data?.innerHTML) {
    inner += spec.data.innerHTML;
  }

  // Text content
  if (spec.text) {
    inner += renderText(spec);
  }

  // Children
  if (spec.children) {
    for (const child of spec.children) {
      inner += renderSpec(child);
    }
  }

  const attrStr = dataAttrs ? ` ${dataAttrs}` : "";
  return `<${tag} style="${style}"${attrStr}>${inner}</${tag}>`;
}

// ── Utilities ────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;").replace(/&/g, "&amp;");
}
