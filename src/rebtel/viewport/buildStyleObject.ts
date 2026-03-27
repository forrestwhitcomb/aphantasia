// ============================================================
// buildStyleObject — ComponentSpec → React.CSSProperties
// ============================================================
// Port of buildStyles() from spec/render.ts that returns a
// CSSProperties object instead of an inline CSS string.
// Used by SpecRenderer for React-based viewport rendering.
// ============================================================

import type { CSSProperties } from "react";
import type { ComponentSpec, PaddingSpec, SizeValue, TextSpec } from "../spec/types";
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
  if (layout.borderRadius) style.borderRadius = resolveToken(layout.borderRadius);
  if (layout.flexShrink !== undefined) style.flexShrink = layout.flexShrink;
  if (layout.flexWrap) style.flexWrap = layout.flexWrap;
  if (layout.boxSizing) style.boxSizing = layout.boxSizing;

  // Style
  if (s.background) style.background = resolveToken(s.background);
  if (s.color) style.color = resolveToken(s.color);
  if (s.border) {
    const bw = s.border.width ?? "1px";
    const bs = s.border.style ?? "solid";
    const bc = s.border.color ? resolveToken(s.border.color) : "transparent";
    style.border = `${bw} ${bs} ${bc}`;
  }
  if (s.shadow) style.boxShadow = resolveToken(s.shadow);
  if (s.opacity !== undefined) style.opacity = s.opacity;
  if (s.cursor) style.cursor = s.cursor;
  if (s.textOverflow) style.textOverflow = s.textOverflow;
  if (s.whiteSpace) style.whiteSpace = s.whiteSpace;
  if (s.overflowText) style.overflow = s.overflowText;

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
