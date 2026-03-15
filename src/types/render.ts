// ============================================================
// APHANTASIA — Render Types
// ============================================================
// Prop schemas for all section components.
// These are the shapes Claude fills in Layer 2.
// All fields are optional — sections render beautiful placeholders
// when fields are absent.
// ============================================================

import type { ThemeTokens } from "@/lib/theme";

// ---------------------------------------------------------------------------
// Per-section prop schemas
// ---------------------------------------------------------------------------

export interface NavProps {
  logo?: string;
  links?: string[];
  cta?: string;
  ctaHref?: string;
}

export interface HeroProps {
  headline?: string;
  subheadline?: string;
  cta?: string;
  ctaHref?: string;
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
  badge?: string;
}

export interface FeatureItem {
  icon?: string;
  heading?: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
  imageSrc?: string;
}

export interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
}

export interface TextImageSplitProps {
  heading?: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
}

export interface CTAProps {
  heading?: string;
  subheading?: string;
  cta?: string;
  ctaHref?: string;
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
}

export interface FooterProps {
  logo?: string;
  tagline?: string;
  columns?: Array<{ heading: string; links: string[] }>;
  copyright?: string;
}

export interface PortfolioItem {
  title?: string;
  description?: string;
  tags?: string[];
}

export interface PortfolioProps {
  title?: string;
  subtitle?: string;
  items?: PortfolioItem[];
}

export interface ProductItem {
  name?: string;
  price?: string;
  description?: string;
  badge?: string;
}

export interface EcommerceGridProps {
  title?: string;
  subtitle?: string;
  products?: ProductItem[];
}

export interface EventSignupProps {
  eventName?: string;
  date?: string;
  location?: string;
  description?: string;
  cta?: string;
}

export interface GenericSectionProps {
  title?: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
}

// ---------------------------------------------------------------------------
// SectionContent — discriminated union of all section types
// ---------------------------------------------------------------------------

export type SectionContent =
  | { type: "nav"; props: NavProps }
  | { type: "hero"; props: HeroProps }
  | { type: "feature-grid"; props: FeatureGridProps }
  | { type: "text-image-split"; props: TextImageSplitProps }
  | { type: "cta"; props: CTAProps }
  | { type: "footer"; props: FooterProps }
  | { type: "portfolio"; props: PortfolioProps }
  | { type: "ecommerce-grid"; props: EcommerceGridProps }
  | { type: "event-signup"; props: EventSignupProps }
  | { type: "generic"; props: GenericSectionProps };

// ---------------------------------------------------------------------------
// RenderedPage — full page output
// ---------------------------------------------------------------------------

export interface RenderedPage {
  sections: SectionContent[];
  theme: ThemeTokens;
  title?: string;
}

// ---------------------------------------------------------------------------
// Mapping from canvas semantic tags → SectionContent types
// ---------------------------------------------------------------------------

export const SEMANTIC_TO_SECTION: Record<string, SectionContent["type"]> = {
  nav: "nav",
  hero: "hero",
  cards: "feature-grid",
  split: "text-image-split",
  section: "generic",
  footer: "footer",
  button: "cta",
  form: "event-signup",
  portfolio: "portfolio",
  ecommerce: "ecommerce-grid",
};
