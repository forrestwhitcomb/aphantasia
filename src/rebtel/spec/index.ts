// ── Spec System — barrel exports ──────────────────────────────

export type {
  ComponentSpec,
  LayoutSpec,
  PaddingSpec,
  StyleSpec,
  BorderSpec,
  TextSpec,
  TextStyleToken,
  InteractiveSpec,
  TokenRef,
  PrimitiveType,
  SizeValue,
  TemplateFactory,
} from "./types";
export { isTokenRef } from "./types";
export { TOKEN_MAP, TEXT_STYLE_MAP, resolveToken, resolveTextStyle } from "./tokens";
export { renderSpec } from "./render";
export { findByKey, walkTree, editText, removeChild, addChild, setStyle, setLayout, cloneSpec } from "./operations";
export { mergeChildSpecs } from "./merge";
export { drawnShapeToPrimitive } from "./inference";
export { DEFAULT_TEMPLATE, LEGACY_TO_PRIMITIVE, hasLegacyMapping, getLegacyMapping } from "./primitives";
