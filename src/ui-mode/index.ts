// ============================================================
// APHANTASIA — UI Mode Public API
// ============================================================
// Barrel exports for the UI experience module.
// All consumer code imports from "@/ui-mode" or "@/ui-mode/*".
// ============================================================

// ── Types ──
export type {
  UIDesignSystem,
  UIComponentType,
  UIVariantMap,
  UIResolvedComponent,
  UIComponentPropsBase,
  UILayer2Override,
} from "./types";

// ── Default Design System ──
export { DEFAULT_UI_DESIGN_SYSTEM } from "./defaultDesignSystem";

// ── Theme Injection ──
export {
  designSystemToCSS,
  googleFontImport,
  buildUIDocument,
} from "./themeInjector";

// ── Components ──
export { renderUIComponent, UI_COMPONENT_CSS } from "./components";

// ── Semantic Resolver ──
export { resolveUIComponents } from "./semantic/UISemanticResolver";
export { resolveFromLabel } from "./semantic/labelRules";
export { resolveFromSpatial } from "./semantic/spatialRules";
export { attachNotes } from "./semantic/noteAttachment";
