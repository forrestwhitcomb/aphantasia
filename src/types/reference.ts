// ============================================================
// APHANTASIA — Reference Types
// ============================================================
// Types for the Reference Window — visual style/tone references
// that influence how the site renders.
// ============================================================

/** Component-level style tokens extracted by AI from a visual reference */
export interface ExtractedStyleTokens {
  // Global palette
  colors?: string[];              // hex codes, ordered by prominence (up to 6)
  background?: string;            // hex — page background color
  foreground?: string;            // hex — primary text color
  mutedForeground?: string;       // hex — secondary/muted text color
  accent?: string;                // hex — primary accent / CTA color
  surface?: string;               // hex — card/section surface color

  // Typography (actual values, not descriptions)
  fontHeading?: string;           // e.g. "Georgia, serif" or "Inter, sans-serif"
  fontBody?: string;              // e.g. "system-ui, sans-serif"
  headingWeight?: string;         // e.g. "700", "900", "400"
  bodyLineHeight?: string;        // e.g. "1.6", "1.8"

  // Shape & corners
  buttonRadius?: string;          // e.g. "4px", "8px", "999px" (pill)
  cardRadius?: string;            // e.g. "0px", "12px", "24px"
  inputRadius?: string;           // e.g. "4px", "8px"

  // Spacing
  sectionPadding?: string;        // e.g. "64px", "96px", "120px"
  cardPadding?: string;           // e.g. "16px", "24px", "32px"

  // Component observations
  buttonStyle?: string;           // e.g. "solid filled", "outlined", "ghost", "pill"
  cardStyle?: string;             // e.g. "flat", "elevated shadow", "bordered", "glass"
  navStyle?: string;              // e.g. "minimal sticky", "transparent overlay", "solid bar"

  // Overall feel (descriptive — used in AI prompt, not CSS)
  mood?: string;                  // e.g. "minimal and elegant"
  toneOfVoice?: string;           // e.g. "professional and authoritative"
  layout?: string;                // e.g. "centered symmetric", "asymmetric editorial"
}

/** A single reference added by the user */
export interface ReferenceItem {
  id: string;
  type: "image" | "url";
  tag: "style" | "tone" | "content";
  source: string;                           // dataUrl (image) or URL string
  thumbnail?: string;                       // small preview dataUrl
  extractedTokens?: ExtractedStyleTokens;
  status: "pending" | "extracting" | "ready" | "error";
  error?: string;
}
