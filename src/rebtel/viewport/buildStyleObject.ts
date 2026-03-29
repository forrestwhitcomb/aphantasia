// ============================================================
// buildStyleObject — ComponentSpec → React.CSSProperties
// ============================================================
// Port of buildStyles() from spec/render.ts that returns a
// CSSProperties object instead of an inline CSS string.
// Used by SpecRenderer for React-based viewport rendering.
// ============================================================

import type { CSSProperties } from "react";
import type { ComponentSpec, PaddingSpec, SizeValue, TextSpec, BorderSpec } from "../spec/types";
import { isTokenRef } from "../spec/types";
import { resolveToken, resolveTextStyle } from "../spec/tokens";

// ── Size Resolution ──────────────────────────────────────────

function resolveSizeValue(v: SizeValue): string {
  if (typeof v === "number") return `${v}px`;
  if (typeof v === "string") return v;
  if (isTokenRef(v)) return resolveToken(v);
  return "auto";
}

// ── Padding Resolution ───────────────────────────────────────

function resolvePadding(p: PaddingSpec): CSSProperties {
  const style: CSSProperties = {};

  if (p.all) {
    style.padding = resolveToken(p.all);
    return style;
  }

  if (p.y) {
    const v = resolveToken(p.y);
    style.paddingTop = v;
    style.paddingBottom = v;
  }
  if (p.x) {
    const v = resolveToken(p.x);
    style.paddingLeft = v;
    style.paddingRight = v;
  }

  // Per-side overrides
  if (p.top) style.paddingTop = resolveToken(p.top);
  if (p.right) style.paddingRight = resolveToken(p.right);
  if (p.bottom) style.paddingBottom = resolveToken(p.bottom);
  if (p.left) style.paddingLeft = resolveToken(p.left);

  return style;
}

// ── Border Resolution ────────────────────────────────────────

function resolveBorder(b: BorderSpec): string {
  const bw = b.width ?? "1px";
  const bs = b.style ?? "solid";
  const bc = b.color ? resolveToken(b.color) : "transparent";
  return `${bw} ${bs} ${bc}`;
}

// ── Style Builder ────────────────────────────────────────────

export function buildStyleObject(spec: ComponentSpec): CSSProperties {
  const style: CSSProperties = {};
  const { layout, style: s } = spec;

  // Layout
  style.display = layout.display;
  if (layout.direction) style.flexDirection = layout.direction;
  if (layout.align) style.alignItems = layout.align;
  if (layout.justify) style.justifyContent = layout.justify;
  if (layout.gap) style.gap = resolveToken(layout.gap);
  if (layout.padding) Object.assign(style, resolvePadding(layout.padding));
  if (layout.width !== undefined) style.width = resolveSizeValue(layout.width);
  if (layout.height !== undefined) style.height = resolveSizeValue(layout.height);
  if (layout.minHeight !== undefined) style.minHeight = resolveSizeValue(layout.minHeight);
  if (layout.minWidth !== undefined) style.minWidth = resolveSizeValue(layout.minWidth);
  if (layout.maxWidth !== undefined) style.maxWidth = resolveSizeValue(layout.maxWidth);
  if (layout.flex) style.flex = layout.flex;
  if (layout.overflow) style.overflow = layout.overflow;
  if (layout.position) style.position = layout.position;
  if (layout.top !== undefined) style.top = resolveSizeValue(layout.top);
  if (layout.right !== undefined) style.right = resolveSizeValue(layout.right);
  if (layout.bottom !== undefined) style.bottom = resolveSizeValue(layout.bottom);
  if (layout.left !== undefined) style.left = resolveSizeValue(layout.left);
  if (layout.borderRadius) style.borderRadius = resolveToken(layout.borderRadius);
  if (layout.flexShrink !== undefined) style.flexShrink = layout.flexShrink;
  if (layout.flexGrow !== undefined) style.flexGrow = layout.flexGrow;
  if (layout.flexWrap) style.flexWrap = layout.flexWrap;
  if (layout.boxSizing) style.boxSizing = layout.boxSizing;
  if (layout.alignSelf) style.alignSelf = layout.alignSelf;

  // Style
  if (s.background) style.background = resolveToken(s.background);
  if (s.color) style.color = resolveToken(s.color);
  if (s.border) style.border = resolveBorder(s.border);
  if (s.borderTop) style.borderTop = resolveBorder(s.borderTop);
  if (s.borderBottom) style.borderBottom = resolveBorder(s.borderBottom);
  if (s.shadow) style.boxShadow = resolveToken(s.shadow);
  if (s.opacity !== undefined) style.opacity = s.opacity;
  if (s.cursor) style.cursor = s.cursor;
  if (s.textOverflow) style.textOverflow = s.textOverflow;
  if (s.whiteSpace) style.whiteSpace = s.whiteSpace;
  if (s.overflowText) style.overflow = s.overflowText;
  if (s.textAlign) style.textAlign = s.textAlign;
  if (s.fontSize) style.fontSize = typeof s.fontSize === "number" ? `${s.fontSize}px` : s.fontSize;
  if (s.fontFamily) style.fontFamily = s.fontFamily;
  if (s.letterSpacing) style.letterSpacing = s.letterSpacing;
  if (s.lineHeight) style.lineHeight = typeof s.lineHeight === "number" ? `${s.lineHeight}px` : s.lineHeight;

  return style;
}

// ── Text Style Builder ───────────────────────────────────────

export function buildTextStyle(text: TextSpec): CSSProperties {
  const ts = resolveTextStyle(text.style);
  const style: CSSProperties = {
    fontFamily: ts.family,
    fontSize: ts.size,
    lineHeight: ts.lh,
    fontWeight: text.weight ?? ts.weight,
    letterSpacing: ts.ls,
  };
  if (text.color) style.color = resolveToken(text.color);
  if (text.align) style.textAlign = text.align;
  return style;
}
