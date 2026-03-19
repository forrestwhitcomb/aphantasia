// ============================================================
// APHANTASIA — V2 Render Response Validation
// ============================================================
// Validates AI JSON output against the RenderResponse schema.
// Strips unknown fields, clamps enums, falls back gracefully.
// ============================================================

import type {
  RenderResponse,
  RenderResponseSection,
  CoherenceStrategy,
  SectionContent,
} from "@/types/render";
import { SECTION_TYPE_SET } from "@/types/render";

// ---------------------------------------------------------------------------
// Valid enum values per variant prop (for runtime clamping)
// ---------------------------------------------------------------------------

const SURFACE_VALUES = new Set(["flat", "gradient-mesh", "grain", "glass", "accent-wash"]);
const DENSITY_VALUES = new Set(["spacious", "balanced", "compact"]);
const ANIMATION_VALUES = new Set(["none", "subtle", "expressive"]);

const HERO_LAYOUTS = new Set(["centered", "left-aligned", "split-image-right", "split-image-left", "full-bleed"]);
const HERO_HEADLINES = new Set(["oversized", "balanced", "editorial", "gradient"]);
const FEATURE_LAYOUTS = new Set(["card-grid", "bento", "icon-list", "alternating-rows", "numbered"]);
const CARD_STYLES = new Set(["elevated", "bordered", "glass", "flat", "accent-top"]);
const ICON_TREATMENTS = new Set(["accent-bg-circle", "accent-text", "outlined", "none"]);
const SPLIT_LAYOUTS = new Set(["image-right", "image-left", "image-overlap", "image-full-bleed"]);
const IMAGE_STYLES = new Set(["rounded", "sharp", "browser-frame", "phone-frame"]);
const CTA_LAYOUTS = new Set(["centered", "split", "inline-bar"]);
const CTA_SURFACES = new Set(["inverted", "accent-wash", "gradient-mesh", "glass"]);
const CTA_INTENSITIES = new Set(["bold", "subtle"]);
const FOOTER_LAYOUTS = new Set(["columns", "simple", "centered", "mega"]);
const FOOTER_STYLES = new Set(["subtle", "bordered-top", "contrasting"]);
const NAV_LAYOUTS = new Set(["standard", "centered-logo", "minimal", "mega-menu"]);
const NAV_STYLES = new Set(["transparent", "solid", "glass"]);
const PORTFOLIO_LAYOUTS = new Set(["grid-uniform", "grid-masonry", "carousel", "list-detailed"]);
const PORTFOLIO_HOVERS = new Set(["overlay-title", "zoom", "tilt", "none"]);
const ECOMMERCE_LAYOUTS = new Set(["card-grid", "horizontal-scroll", "featured-plus-grid"]);
const PRICE_STYLES = new Set(["bold", "inline", "badge"]);
const EVENT_LAYOUTS = new Set(["split-details-form", "centered-card", "banner"]);
const GENERIC_LAYOUTS = new Set(["centered-text", "left-text", "split"]);
const PRICING_LAYOUTS = new Set(["cards-row", "cards-highlighted", "comparison-table", "toggle-annual"]);
const PRICING_HIGHLIGHTS = new Set(["scale-up", "accent-border", "accent-bg", "badge"]);
const TESTIMONIAL_LAYOUTS = new Set(["cards-grid", "carousel", "single-featured", "avatar-wall"]);
const TESTIMONIAL_CARDS = new Set(["elevated", "bordered", "glass", "flat", "accent-top", "quote-mark"]);
const LOGO_LAYOUTS = new Set(["single-row", "double-row", "marquee-scroll", "grid"]);
const LOGO_STYLES = new Set(["grayscale", "color", "monochrome"]);
const STATS_LAYOUTS = new Set(["big-numbers", "icon-stats", "inline-bar", "cards"]);
const NEWSLETTER_LAYOUTS = new Set(["inline-bar", "centered-card", "split-with-copy", "minimal"]);
const FAQ_LAYOUTS = new Set(["accordion", "two-column", "cards", "inline"]);
const TEAM_LAYOUTS = new Set(["photo-grid", "card-grid", "list", "minimal"]);
const COMPARISON_LAYOUTS = new Set(["table", "cards-side-by-side", "checklist"]);
const COMPARISON_HIGHLIGHTS = new Set(["column-accent", "badge", "checkmark-color"]);

/** Clamp a string value to a set of valid options; return first option as default */
function clampEnum(value: unknown, valid: Set<string>): string | undefined {
  if (typeof value === "string" && valid.has(value)) return value;
  return undefined;
}

/** Safely extract a string */
function str(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/** Safely extract a number */
function num(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

/** Safely extract a string array */
function strArr(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const result = value.filter((v) => typeof v === "string" && v.length > 0);
  return result.length > 0 ? result : undefined;
}

// ---------------------------------------------------------------------------
// Per-section props validation
// ---------------------------------------------------------------------------

type PropsMap = Record<string, unknown>;

function validateNavProps(p: PropsMap) {
  return {
    logo: str(p.logo),
    links: Array.isArray(p.links) ? p.links.filter((l: unknown) => typeof l === "string") : undefined,
    cta: str(p.cta),
    ctaHref: str(p.ctaHref),
    layout: clampEnum(p.layout, NAV_LAYOUTS),
    navStyle: clampEnum(p.navStyle, NAV_STYLES),
  };
}

function validateHeroProps(p: PropsMap) {
  return {
    headline: str(p.headline),
    subheadline: str(p.subheadline),
    cta: str(p.cta),
    ctaHref: str(p.ctaHref),
    ctaSecondary: str(p.ctaSecondary),
    ctaSecondaryHref: str(p.ctaSecondaryHref),
    badge: str(p.badge),
    layout: clampEnum(p.layout, HERO_LAYOUTS),
    surface: clampEnum(p.surface, SURFACE_VALUES),
    headlineStyle: clampEnum(p.headlineStyle, HERO_HEADLINES),
    density: clampEnum(p.density, DENSITY_VALUES),
  };
}

function validateFeatureGridProps(p: PropsMap) {
  return {
    title: str(p.title),
    subtitle: str(p.subtitle),
    features: Array.isArray(p.features)
      ? p.features.map((f: Record<string, unknown>) => ({
          icon: str(f?.icon),
          heading: str(f?.heading),
          body: str(f?.body),
          cta: str(f?.cta),
        }))
      : undefined,
    layout: clampEnum(p.layout, FEATURE_LAYOUTS),
    cardStyle: clampEnum(p.cardStyle, CARD_STYLES),
    iconTreatment: clampEnum(p.iconTreatment, ICON_TREATMENTS),
    columns: p.columns === 2 || p.columns === 3 || p.columns === 4 ? p.columns : undefined,
  };
}

function validateSplitProps(p: PropsMap) {
  return {
    heading: str(p.heading),
    body: str(p.body),
    cta: str(p.cta),
    ctaHref: str(p.ctaHref),
    imageSrc: str(p.imageSrc),
    imageAlt: str(p.imageAlt),
    layout: clampEnum(p.layout, SPLIT_LAYOUTS),
    imageStyle: clampEnum(p.imageStyle, IMAGE_STYLES),
  };
}

function validateCTAProps(p: PropsMap) {
  return {
    heading: str(p.heading),
    subheading: str(p.subheading),
    cta: str(p.cta),
    ctaHref: str(p.ctaHref),
    ctaSecondary: str(p.ctaSecondary),
    ctaSecondaryHref: str(p.ctaSecondaryHref),
    layout: clampEnum(p.layout, CTA_LAYOUTS),
    surface: clampEnum(p.surface, CTA_SURFACES),
    intensity: clampEnum(p.intensity, CTA_INTENSITIES),
  };
}

function validateFooterProps(p: PropsMap) {
  return {
    logo: str(p.logo),
    tagline: str(p.tagline),
    copyright: str(p.copyright),
    columns: Array.isArray(p.columns)
      ? p.columns.map((c: Record<string, unknown>) => ({
          heading: str(c?.heading),
          links: Array.isArray(c?.links) ? (c.links as string[]).filter((l) => typeof l === "string") : undefined,
        }))
      : undefined,
    socialLinks: strArr(p.socialLinks),
    layout: clampEnum(p.layout, FOOTER_LAYOUTS),
    footerStyle: clampEnum(p.footerStyle, FOOTER_STYLES),
  };
}

function validatePortfolioProps(p: PropsMap) {
  return {
    title: str(p.title),
    subtitle: str(p.subtitle),
    items: Array.isArray(p.items)
      ? p.items.map((item: Record<string, unknown>) => ({
          title: str(item?.title),
          description: str(item?.description),
          tags: strArr(item?.tags),
          imageSrc: str(item?.imageSrc),
          link: str(item?.link),
        }))
      : undefined,
    layout: clampEnum(p.layout, PORTFOLIO_LAYOUTS),
    hoverEffect: clampEnum(p.hoverEffect, PORTFOLIO_HOVERS),
  };
}

function validateEcommerceProps(p: PropsMap) {
  return {
    title: str(p.title),
    subtitle: str(p.subtitle),
    products: Array.isArray(p.products)
      ? p.products.map((item: Record<string, unknown>) => ({
          name: str(item?.name),
          price: str(item?.price),
          description: str(item?.description),
          badge: str(item?.badge),
          imageSrc: str(item?.imageSrc),
          cta: str(item?.cta),
        }))
      : undefined,
    layout: clampEnum(p.layout, ECOMMERCE_LAYOUTS),
    cardStyle: clampEnum(p.cardStyle, CARD_STYLES),
    priceStyle: clampEnum(p.priceStyle, PRICE_STYLES),
  };
}

function validateEventSignupProps(p: PropsMap) {
  return {
    eventName: str(p.eventName),
    date: str(p.date),
    location: str(p.location),
    description: str(p.description),
    cta: str(p.cta),
    capacity: str(p.capacity),
    layout: clampEnum(p.layout, EVENT_LAYOUTS),
    surface: clampEnum(p.surface, SURFACE_VALUES),
  };
}

function validateGenericProps(p: PropsMap) {
  return {
    heading: str(p.heading),
    body: str(p.body),
    cta: str(p.cta),
    ctaHref: str(p.ctaHref),
    layout: clampEnum(p.layout, GENERIC_LAYOUTS),
    surface: clampEnum(p.surface, SURFACE_VALUES),
  };
}

function validatePricingProps(p: PropsMap) {
  return {
    title: str(p.title),
    subtitle: str(p.subtitle),
    tiers: Array.isArray(p.tiers)
      ? p.tiers.map((t: Record<string, unknown>) => ({
          name: str(t?.name),
          price: str(t?.price),
          annualPrice: str(t?.annualPrice),
          period: str(t?.period),
          description: str(t?.description),
          features: strArr(t?.features),
          cta: str(t?.cta),
          highlighted: t?.highlighted === true,
          badge: str(t?.badge),
        }))
      : undefined,
    layout: clampEnum(p.layout, PRICING_LAYOUTS),
    cardStyle: clampEnum(p.cardStyle, CARD_STYLES),
    highlightStyle: clampEnum(p.highlightStyle, PRICING_HIGHLIGHTS),
  };
}

function validateTestimonialsProps(p: PropsMap) {
  return {
    title: str(p.title),
    subtitle: str(p.subtitle),
    items: Array.isArray(p.items)
      ? p.items.map((item: Record<string, unknown>) => ({
          quote: str(item?.quote),
          author: str(item?.author),
          role: str(item?.role),
          company: str(item?.company),
          rating: num(item?.rating),
        }))
      : undefined,
    layout: clampEnum(p.layout, TESTIMONIAL_LAYOUTS),
    cardStyle: clampEnum(p.cardStyle, TESTIMONIAL_CARDS),
  };
}

function validateLogoCloudProps(p: PropsMap) {
  return {
    title: str(p.title),
    logos: Array.isArray(p.logos)
      ? p.logos.map((l: Record<string, unknown>) => ({
          name: str(l?.name),
          url: str(l?.url),
          imageSrc: str(l?.imageSrc),
        }))
      : undefined,
    layout: clampEnum(p.layout, LOGO_LAYOUTS),
    logoStyle: clampEnum(p.logoStyle, LOGO_STYLES),
  };
}

function validateStatsProps(p: PropsMap) {
  return {
    title: str(p.title),
    stats: Array.isArray(p.stats)
      ? p.stats.map((s: Record<string, unknown>) => ({
          value: str(s?.value),
          label: str(s?.label),
          prefix: str(s?.prefix),
          suffix: str(s?.suffix),
        }))
      : undefined,
    layout: clampEnum(p.layout, STATS_LAYOUTS),
  };
}

function validateNewsletterProps(p: PropsMap) {
  return {
    headline: str(p.headline),
    subtext: str(p.subtext),
    placeholder: str(p.placeholder),
    cta: str(p.cta),
    privacyNote: str(p.privacyNote),
    layout: clampEnum(p.layout, NEWSLETTER_LAYOUTS),
    surface: clampEnum(p.surface, SURFACE_VALUES),
  };
}

function validateFAQProps(p: PropsMap) {
  return {
    title: str(p.title),
    subtitle: str(p.subtitle),
    items: Array.isArray(p.items)
      ? p.items.map((item: Record<string, unknown>) => ({
          question: str(item?.question),
          answer: str(item?.answer),
        }))
      : undefined,
    layout: clampEnum(p.layout, FAQ_LAYOUTS),
  };
}

function validateTeamGridProps(p: PropsMap) {
  return {
    title: str(p.title),
    subtitle: str(p.subtitle),
    members: Array.isArray(p.members)
      ? p.members.map((m: Record<string, unknown>) => ({
          name: str(m?.name),
          role: str(m?.role),
          bio: str(m?.bio),
          avatar: str(m?.avatar),
        }))
      : undefined,
    layout: clampEnum(p.layout, TEAM_LAYOUTS),
  };
}

function validateComparisonProps(p: PropsMap) {
  return {
    title: str(p.title),
    subtitle: str(p.subtitle),
    us: typeof p.us === "object" && p.us !== null
      ? { name: str((p.us as PropsMap).name), features: strArr((p.us as PropsMap).features) }
      : undefined,
    them: typeof p.them === "object" && p.them !== null
      ? { name: str((p.them as PropsMap).name), features: strArr((p.them as PropsMap).features) }
      : undefined,
    layout: clampEnum(p.layout, COMPARISON_LAYOUTS),
    highlightStyle: clampEnum(p.highlightStyle, COMPARISON_HIGHLIGHTS),
  };
}

// ---------------------------------------------------------------------------
// Section type → validator dispatch
// ---------------------------------------------------------------------------

const VALIDATORS: Record<string, (p: PropsMap) => Record<string, unknown>> = {
  "nav": validateNavProps,
  "hero": validateHeroProps,
  "feature-grid": validateFeatureGridProps,
  "text-image-split": validateSplitProps,
  "cta": validateCTAProps,
  "footer": validateFooterProps,
  "portfolio": validatePortfolioProps,
  "ecommerce-grid": validateEcommerceProps,
  "event-signup": validateEventSignupProps,
  "generic": validateGenericProps,
  "pricing-table": validatePricingProps,
  "testimonials": validateTestimonialsProps,
  "logo-cloud": validateLogoCloudProps,
  "stats": validateStatsProps,
  "newsletter": validateNewsletterProps,
  "faq": validateFAQProps,
  "team-grid": validateTeamGridProps,
  "comparison-table": validateComparisonProps,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Convert a single AI response section into a typed SectionContent.
 * Returns null if the type is unknown.
 */
export function applySectionProps(section: RenderResponseSection): SectionContent | null {
  if (!SECTION_TYPE_SET.has(section.type)) return null;
  const validator = VALIDATORS[section.type];
  if (!validator) return null;

  const props = validator(section.props || {});
  // Strip undefined values to keep props clean
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v !== undefined) cleaned[k] = v;
  }

  return { type: section.type, props: cleaned } as SectionContent;
}

/**
 * Validate a complete AI JSON response.
 * Returns null on catastrophic failure (not parseable, missing sections array).
 * Strips invalid sections, clamps enum values, preserves valid data.
 */
export function validateRenderResponse(
  raw: unknown,
  validShapeIds: Set<string>
): RenderResponse | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;

  // Validate sections array
  if (!Array.isArray(obj.sections)) return null;

  // Validate coherence strategy
  const cs = typeof obj.coherenceStrategy === "object" && obj.coherenceStrategy !== null
    ? obj.coherenceStrategy as Record<string, unknown>
    : {};

  const coherenceStrategy: CoherenceStrategy = {
    surface: clampEnum(cs.surface, SURFACE_VALUES) as CoherenceStrategy["surface"],
    density: clampEnum(cs.density, DENSITY_VALUES) as CoherenceStrategy["density"],
    animationLevel: clampEnum(cs.animationLevel, ANIMATION_VALUES) as CoherenceStrategy["animationLevel"],
  };

  // Validate each section
  const sections: RenderResponseSection[] = [];
  for (const item of obj.sections) {
    if (typeof item !== "object" || item === null) continue;
    const s = item as Record<string, unknown>;

    const id = typeof s.id === "string" ? s.id : "";
    const type = typeof s.type === "string" ? s.type : "";
    const props = typeof s.props === "object" && s.props !== null
      ? s.props as Record<string, unknown>
      : {};

    // Skip sections with invalid type or unknown shape ID
    if (!SECTION_TYPE_SET.has(type)) continue;
    if (id && !validShapeIds.has(id)) continue;

    sections.push({
      id,
      type: type as SectionContent["type"],
      props,
    });
  }

  if (sections.length === 0) return null;

  return { coherenceStrategy, sections };
}
