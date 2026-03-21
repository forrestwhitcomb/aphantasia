// ============================================================
// APHANTASIA — Design DNA Module
// ============================================================

// Types
export type {
  DesignDNA,
  DNAPalette,
  DNATypography,
  DNASpacing,
  DNASurfaces,
  DNADecorative,
  DNAMotion,
  DNAButtons,
  DNAImages,
  DNASource,
  DecorativeStyle,
  DecorativeIntensity,
  MotionLevel,
  EntranceAnimation,
  HoverAnimation,
  SurfaceStyle,
  CardSurface,
  ButtonStyle,
  ButtonSize,
  ImageTreatment,
  ImageFrame,
  SpacingDensity,
  SectionStyle,
} from "./DesignDNA";

export { DEFAULT_DNA } from "./DesignDNA";

// Store
export { dnaStore, DNA_CHANGED_EVENT } from "./DNAStore";

// CSS bridge
export {
  dnaToCSS,
  dnaToExtendedCSS,
  dnaToRootCSS,
  dnaToCSSmemo,
  dnaToRootCSSmemo,
} from "./dnaToCSS";
export type { ExtendedThemeTokens } from "./dnaToCSS";

// Font library
export {
  FONT_PAIRINGS,
  getFontPairing,
  buildGoogleFontsUrl,
  buildGoogleFontsLink,
  fontFamilyCSS,
} from "./fontLibrary";
export type { FontPairing } from "./fontLibrary";

// DNA generation
export { generateDNA, regenerateDNA } from "./generateDNA";
export type { CanvasSignals } from "./generateDNA";

// Decorative + motion CSS
export { generateDecorativeCSS } from "./decorativeCSS";
export { generateMotionCSS } from "./motionCSS";

// Canvas signals
export { extractCanvasSignals } from "./canvasSignals";
