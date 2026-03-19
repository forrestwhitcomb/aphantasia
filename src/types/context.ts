// ============================================================
// APHANTASIA — Context Types
// ============================================================

/** Structured context extracted by AI from raw user input */
export interface StructuredContext {
  // Identity
  productName?: string;
  tagline?: string;
  description?: string;

  // Classification (V3 — feeds mood selection + Layer 1 defaults)
  contentType?: "saas" | "portfolio" | "editorial" | "ecommerce" | "event" | "personal" | "agency" | "restaurant" | "nonprofit" | "general";
  audience?: string;

  // Voice (V3 — structured tone replaces flat string)
  tone?: string | {
    formality?: "casual" | "neutral" | "formal";
    energy?: "calm" | "confident" | "urgent" | "playful";
    personality?: string;
  };

  // Content signals (V3)
  valueProp?: string;
  features?: string[];
  socialProof?: string;
  pricing?: string | {
    model?: "free" | "freemium" | "paid" | "enterprise" | "custom";
    tiers?: string[];
  };
  cta?: {
    primary?: string;
    secondary?: string;
  };

  // Visual signals
  brandColors?: string[];
  visualDirection?: string;
  references?: string[];

  // Legacy fields (backward compat — old extraction may still produce these)
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
