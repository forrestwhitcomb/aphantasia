// ============================================================
// APHANTASIA — Context Types
// ============================================================

/** Structured context extracted by AI from raw user input */
export interface StructuredContext {
  productName?: string;
  tagline?: string;
  description?: string;
  tone?: string;
  pricing?: string;
  events?: string[];
  products?: string[];
  portfolio?: string[];
  team?: string[];
  colors?: string[];
  fonts?: string[];
}

/** Visual reference attached to a shape or frame */
export interface ImageRef {
  dataUrl: string;        // base64 data URL for canvas preview
  description?: string;   // optional hint from AI vision pass
}

/** Per-shape context assembled by the context pipeline before Layer 2 */
export interface ShapeContext {
  copy: string[];          // from text nodes typed 'copy'
  structural: string[];    // from text nodes typed 'structural'
  styleRef?: ImageRef;     // from connected image node
  global: StructuredContext;
}

/** Full context bundle sent to Layer 2 render */
export interface ContextBundle {
  global: StructuredContext;
  rawText: string;
  shapeContexts: Record<string, ShapeContext>; // keyed by shapeId
}
