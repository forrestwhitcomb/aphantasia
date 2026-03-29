// ============================================================
// Extraction Pipeline — Barrel Export
// ============================================================

export { figmaNodeToSpec } from "./figmaNodeToSpec";
export type { FigmaNode } from "./figmaNodeToSpec";
export {
  extractComponent,
  extractComponentSet,
  specToTemplateSource,
  variantSpecToTemplateSource,
  figmaNameToFunctionName,
} from "./extractionPipeline";
export type {
  ExtractionResult,
  VariantExtractionResult,
} from "./extractionPipeline";
export {
  FIGMA_VARIABLE_TO_TOKEN,
  figmaVarToTokenRef,
  resolveBoundVariable,
} from "./variableMap";
export { figmaTextToStyleToken } from "./textStyleMap";
