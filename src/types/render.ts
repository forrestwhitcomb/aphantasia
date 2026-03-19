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
// Design intent fields — carried on every section so AI + templates
// can make rendering decisions beyond content alone
// ---------------------------------------------------------------------------

export interface SectionDesignHints {
  emphasis?: "hero" | "standard" | "subtle";
  animationHint?: string;
  imageryDirection?: string;
}

// ---------------------------------------------------------------------------
// Per-section prop schemas
// ---------------------------------------------------------------------------

export interface NavProps extends SectionDesignHints {
  logo?: string;
  links?: string[];
  cta?: string;
  ctaHref?: string;
  layout?: "standard" | "centered-logo" | "minimal" | "mega-menu";
  navStyle?: "transparent" | "solid" | "glass";
}

export interface HeroProps extends SectionDesignHints {
  headline?: string;
  subheadline?: string;
  cta?: string;
  ctaHref?: string;
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
  badge?: string;
  imageSrc?: string;
  imageAlt?: string;
  layout?: "centered" | "left-aligned" | "split-image-right" | "split-image-left" | "full-bleed";
  surface?: "flat" | "gradient-mesh" | "grain" | "glass" | "accent-wash";
  headlineStyle?: "oversized" | "balanced" | "editorial" | "gradient";
  density?: "spacious" | "balanced" | "compact";
  /** @deprecated Use layout/surface/headlineStyle instead */
  variant?: string;
}

export interface FeatureItem {
  icon?: string;
  heading?: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
  imageSrc?: string;
}

export interface FeatureGridProps extends SectionDesignHints {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
  layout?: "card-grid" | "bento" | "icon-list" | "alternating-rows" | "numbered";
  cardStyle?: "elevated" | "bordered" | "glass" | "flat" | "accent-top";
  iconTreatment?: "accent-bg-circle" | "accent-text" | "outlined" | "none";
  columns?: 2 | 3 | 4;
  /** @deprecated Use layout instead */
  variant?: string;
}

export interface TextImageSplitProps extends SectionDesignHints {
  heading?: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  layout?: "image-right" | "image-left" | "image-overlap" | "image-full-bleed";
  imageStyle?: "rounded" | "sharp" | "browser-frame" | "phone-frame";
  /** @deprecated Use layout instead */
  imagePosition?: "left" | "right";
}

export interface CTAProps extends SectionDesignHints {
  heading?: string;
  subheading?: string;
  cta?: string;
  ctaHref?: string;
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
  layout?: "centered" | "split" | "inline-bar";
  surface?: "accent-wash" | "gradient-mesh" | "glass" | "inverted";
  intensity?: "bold" | "subtle";
}

export interface FooterProps extends SectionDesignHints {
  logo?: string;
  tagline?: string;
  columns?: Array<{ heading: string; links: string[] }>;
  copyright?: string;
  socialLinks?: string[];
  layout?: "columns" | "simple" | "centered" | "mega";
  footerStyle?: "subtle" | "bordered-top" | "contrasting";
}

export interface PortfolioItem {
  title?: string;
  description?: string;
  tags?: string[];
  imageSrc?: string;
  link?: string;
}

export interface PortfolioProps extends SectionDesignHints {
  title?: string;
  subtitle?: string;
  items?: PortfolioItem[];
  layout?: "grid-uniform" | "grid-masonry" | "carousel" | "list-detailed";
  hoverEffect?: "overlay-title" | "zoom" | "tilt" | "none";
}

export interface ProductItem {
  name?: string;
  price?: string;
  description?: string;
  badge?: string;
  imageSrc?: string;
  cta?: string;
}

export interface EcommerceGridProps extends SectionDesignHints {
  title?: string;
  subtitle?: string;
  products?: ProductItem[];
  layout?: "card-grid" | "horizontal-scroll" | "featured-plus-grid";
  cardStyle?: "elevated" | "bordered" | "glass" | "flat" | "accent-top";
  priceStyle?: "bold" | "inline" | "badge";
}

export interface EventSignupProps extends SectionDesignHints {
  eventName?: string;
  date?: string;
  location?: string;
  description?: string;
  cta?: string;
  capacity?: string;
  layout?: "split-details-form" | "centered-card" | "banner";
  surface?: "flat" | "gradient-mesh" | "grain" | "glass" | "accent-wash";
}

export interface GenericSectionProps extends SectionDesignHints {
  title?: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
  layout?: "centered-text" | "left-text" | "split";
  surface?: "flat" | "gradient-mesh" | "grain" | "glass" | "accent-wash";
}

// ---------------------------------------------------------------------------
// New section types (Vertical 1, Part 2)
// ---------------------------------------------------------------------------

export interface PricingTier {
  name?: string;
  price?: string;
  annualPrice?: string;
  period?: string;
  description?: string;
  features?: string[];
  cta?: string;
  highlighted?: boolean;
  badge?: string;
}

export interface PricingTableProps extends SectionDesignHints {
  title?: string;
  subtitle?: string;
  tiers?: PricingTier[];
  layout?: "cards-row" | "cards-highlighted" | "comparison-table" | "toggle-annual";
  cardStyle?: "elevated" | "bordered" | "glass" | "flat" | "accent-top";
  highlightStyle?: "scale-up" | "accent-border" | "accent-bg" | "badge";
}

export interface TestimonialItem {
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
  rating?: number;
}

export interface TestimonialsProps extends SectionDesignHints {
  title?: string;
  subtitle?: string;
  items?: TestimonialItem[];
  layout?: "cards-grid" | "carousel" | "single-featured" | "avatar-wall";
  cardStyle?: "elevated" | "bordered" | "glass" | "flat" | "accent-top" | "quote-mark";
}

export interface LogoItem {
  name?: string;
  url?: string;
  imageSrc?: string;
}

export interface LogoCloudProps extends SectionDesignHints {
  title?: string;
  logos?: LogoItem[];
  layout?: "single-row" | "double-row" | "marquee-scroll" | "grid";
  logoStyle?: "grayscale" | "color" | "monochrome";
}

export interface StatItem {
  value?: string;
  label?: string;
  prefix?: string;
  suffix?: string;
}

export interface StatsProps extends SectionDesignHints {
  title?: string;
  stats?: StatItem[];
  layout?: "big-numbers" | "icon-stats" | "inline-bar" | "cards";
}

export interface NewsletterProps extends SectionDesignHints {
  headline?: string;
  subtext?: string;
  placeholder?: string;
  cta?: string;
  privacyNote?: string;
  layout?: "inline-bar" | "centered-card" | "split-with-copy" | "minimal";
  surface?: "flat" | "gradient-mesh" | "grain" | "glass" | "accent-wash";
}

export interface FAQItem {
  question?: string;
  answer?: string;
}

export interface FAQProps extends SectionDesignHints {
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
  layout?: "accordion" | "two-column" | "cards" | "inline";
}

export interface TeamMember {
  name?: string;
  role?: string;
  bio?: string;
  avatar?: string;
}

export interface TeamGridProps extends SectionDesignHints {
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
  layout?: "photo-grid" | "card-grid" | "list" | "minimal";
}

export interface ComparisonTableProps extends SectionDesignHints {
  title?: string;
  subtitle?: string;
  us?: { name?: string; features?: string[] };
  them?: { name?: string; features?: string[] };
  layout?: "table" | "cards-side-by-side" | "checklist";
  highlightStyle?: "column-accent" | "badge" | "checkmark-color";
}

// ---------------------------------------------------------------------------
// Primitive (small UI) content — for shadcn-style components
// ---------------------------------------------------------------------------

export interface ButtonPrimitiveProps {
  label?: string;
  variant?: "default" | "outline" | "ghost";
}

export interface CardPrimitiveProps {
  title?: string;
  body?: string;
}

export interface BadgePrimitiveProps {
  text?: string;
}

export interface InputPrimitiveProps {
  placeholder?: string;
}

export interface SeparatorPrimitiveProps {
  orientation?: "horizontal" | "vertical";
}

export interface AccordionPrimitiveProps {
  items?: Array<{ trigger: string; content: string }>;
}

export interface AlertPrimitiveProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export interface AlertDialogPrimitiveProps {
  title?: string;
  description?: string;
  cancelLabel?: string;
  actionLabel?: string;
}

export interface AspectRatioPrimitiveProps {
  ratio?: string;
}

export interface AvatarPrimitiveProps {
  fallback?: string;
  src?: string;
}

export interface BreadcrumbPrimitiveProps {
  items?: string[];
}

export interface ButtonGroupPrimitiveProps {
  buttons?: string[];
}

export interface CalendarPrimitiveProps {
  month?: string;
}

export interface CarouselPrimitiveProps {
  itemCount?: number;
}

export interface ChartPrimitiveProps {
  type?: "bar" | "line" | "pie";
  title?: string;
}

export interface CheckboxPrimitiveProps {
  label?: string;
  checked?: boolean;
}

export interface CollapsiblePrimitiveProps {
  title?: string;
  content?: string;
}

export interface ComboboxPrimitiveProps {
  placeholder?: string;
  options?: string[];
}

export interface CommandPrimitiveProps {
  placeholder?: string;
  groups?: Array<{ heading: string; items: string[] }>;
}

export interface ContextMenuPrimitiveProps {
  items?: string[];
}

export interface DataTablePrimitiveProps {
  columns?: string[];
  rows?: string[][];
}

export interface DatePickerPrimitiveProps {
  placeholder?: string;
}

export interface DialogPrimitiveProps {
  title?: string;
  description?: string;
}

export interface DirectionPrimitiveProps {
  direction?: "ltr" | "rtl";
}

export interface DrawerPrimitiveProps {
  title?: string;
  description?: string;
}

export interface DropdownMenuPrimitiveProps {
  trigger?: string;
  items?: string[];
}

export interface EmptyStatePrimitiveProps {
  title?: string;
  description?: string;
}

export interface FieldPrimitiveProps {
  label?: string;
  placeholder?: string;
  description?: string;
}

export interface HoverCardPrimitiveProps {
  trigger?: string;
  content?: string;
}

export interface InputGroupPrimitiveProps {
  prefix?: string;
  placeholder?: string;
  suffix?: string;
}

export interface InputOTPPrimitiveProps {
  length?: number;
}

export interface ItemPrimitiveProps {
  title?: string;
  description?: string;
}

export interface KbdPrimitiveProps {
  keys?: string[];
}

export interface LabelPrimitiveProps {
  text?: string;
}

export interface MenubarPrimitiveProps {
  menus?: string[];
}

export interface NativeSelectPrimitiveProps {
  placeholder?: string;
  options?: string[];
}

export interface NavigationMenuPrimitiveProps {
  items?: string[];
}

export interface PaginationPrimitiveProps {
  totalPages?: number;
  currentPage?: number;
}

export interface PopoverPrimitiveProps {
  trigger?: string;
  content?: string;
}

export interface ProgressPrimitiveProps {
  value?: number;
}

export interface RadioGroupPrimitiveProps {
  options?: string[];
  selected?: string;
}

export interface ResizablePrimitiveProps {
  direction?: "horizontal" | "vertical";
}

export interface ScrollAreaPrimitiveProps {
  height?: number;
}

export interface SelectPrimitiveProps {
  placeholder?: string;
  options?: string[];
}

export interface SheetPrimitiveProps {
  title?: string;
  description?: string;
  side?: "top" | "right" | "bottom" | "left";
}

export interface SidebarPrimitiveProps {
  title?: string;
  items?: string[];
}

export interface SkeletonPrimitiveProps {
  variant?: "text" | "circular" | "rectangular";
  lines?: number;
}

export interface SliderPrimitiveProps {
  value?: number;
  min?: number;
  max?: number;
}

export interface SonnerPrimitiveProps {
  title?: string;
  description?: string;
  type?: "default" | "success" | "error" | "warning";
}

export interface SpinnerPrimitiveProps {
  size?: "sm" | "md" | "lg";
}

export interface SwitchPrimitiveProps {
  label?: string;
  checked?: boolean;
}

export interface TablePrimitiveProps {
  headers?: string[];
  rows?: string[][];
}

export interface TabsPrimitiveProps {
  tabs?: Array<{ label: string; content?: string }>;
}

export interface TextareaPrimitiveProps {
  placeholder?: string;
  rows?: number;
}

export interface ToastPrimitiveProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export interface TogglePrimitiveProps {
  label?: string;
  pressed?: boolean;
}

export interface ToggleGroupPrimitiveProps {
  items?: string[];
}

export interface TooltipPrimitiveProps {
  trigger?: string;
  content?: string;
}

export interface TypographyPrimitiveProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "p" | "lead" | "large" | "small" | "muted";
  text?: string;
}

export type PrimitiveContent =
  | { type: "primitive-button"; props: ButtonPrimitiveProps }
  | { type: "primitive-card"; props: CardPrimitiveProps }
  | { type: "primitive-badge"; props: BadgePrimitiveProps }
  | { type: "primitive-input"; props: InputPrimitiveProps }
  | { type: "primitive-separator"; props: SeparatorPrimitiveProps }
  | { type: "primitive-accordion"; props: AccordionPrimitiveProps }
  | { type: "primitive-alert"; props: AlertPrimitiveProps }
  | { type: "primitive-alert-dialog"; props: AlertDialogPrimitiveProps }
  | { type: "primitive-aspect-ratio"; props: AspectRatioPrimitiveProps }
  | { type: "primitive-avatar"; props: AvatarPrimitiveProps }
  | { type: "primitive-breadcrumb"; props: BreadcrumbPrimitiveProps }
  | { type: "primitive-button-group"; props: ButtonGroupPrimitiveProps }
  | { type: "primitive-calendar"; props: CalendarPrimitiveProps }
  | { type: "primitive-carousel"; props: CarouselPrimitiveProps }
  | { type: "primitive-chart"; props: ChartPrimitiveProps }
  | { type: "primitive-checkbox"; props: CheckboxPrimitiveProps }
  | { type: "primitive-collapsible"; props: CollapsiblePrimitiveProps }
  | { type: "primitive-combobox"; props: ComboboxPrimitiveProps }
  | { type: "primitive-command"; props: CommandPrimitiveProps }
  | { type: "primitive-context-menu"; props: ContextMenuPrimitiveProps }
  | { type: "primitive-data-table"; props: DataTablePrimitiveProps }
  | { type: "primitive-date-picker"; props: DatePickerPrimitiveProps }
  | { type: "primitive-dialog"; props: DialogPrimitiveProps }
  | { type: "primitive-direction"; props: DirectionPrimitiveProps }
  | { type: "primitive-drawer"; props: DrawerPrimitiveProps }
  | { type: "primitive-dropdown-menu"; props: DropdownMenuPrimitiveProps }
  | { type: "primitive-empty"; props: EmptyStatePrimitiveProps }
  | { type: "primitive-field"; props: FieldPrimitiveProps }
  | { type: "primitive-hover-card"; props: HoverCardPrimitiveProps }
  | { type: "primitive-input-group"; props: InputGroupPrimitiveProps }
  | { type: "primitive-input-otp"; props: InputOTPPrimitiveProps }
  | { type: "primitive-item"; props: ItemPrimitiveProps }
  | { type: "primitive-kbd"; props: KbdPrimitiveProps }
  | { type: "primitive-label"; props: LabelPrimitiveProps }
  | { type: "primitive-menubar"; props: MenubarPrimitiveProps }
  | { type: "primitive-native-select"; props: NativeSelectPrimitiveProps }
  | { type: "primitive-navigation-menu"; props: NavigationMenuPrimitiveProps }
  | { type: "primitive-pagination"; props: PaginationPrimitiveProps }
  | { type: "primitive-popover"; props: PopoverPrimitiveProps }
  | { type: "primitive-progress"; props: ProgressPrimitiveProps }
  | { type: "primitive-radio-group"; props: RadioGroupPrimitiveProps }
  | { type: "primitive-resizable"; props: ResizablePrimitiveProps }
  | { type: "primitive-scroll-area"; props: ScrollAreaPrimitiveProps }
  | { type: "primitive-select"; props: SelectPrimitiveProps }
  | { type: "primitive-sheet"; props: SheetPrimitiveProps }
  | { type: "primitive-sidebar"; props: SidebarPrimitiveProps }
  | { type: "primitive-skeleton"; props: SkeletonPrimitiveProps }
  | { type: "primitive-slider"; props: SliderPrimitiveProps }
  | { type: "primitive-sonner"; props: SonnerPrimitiveProps }
  | { type: "primitive-spinner"; props: SpinnerPrimitiveProps }
  | { type: "primitive-switch"; props: SwitchPrimitiveProps }
  | { type: "primitive-table"; props: TablePrimitiveProps }
  | { type: "primitive-tabs"; props: TabsPrimitiveProps }
  | { type: "primitive-textarea"; props: TextareaPrimitiveProps }
  | { type: "primitive-toast"; props: ToastPrimitiveProps }
  | { type: "primitive-toggle"; props: TogglePrimitiveProps }
  | { type: "primitive-toggle-group"; props: ToggleGroupPrimitiveProps }
  | { type: "primitive-tooltip"; props: TooltipPrimitiveProps }
  | { type: "primitive-typography"; props: TypographyPrimitiveProps };

// ---------------------------------------------------------------------------
// Variant hint detection — keywords in label/contextNote map to section variants
// ---------------------------------------------------------------------------

export const VARIANT_HINTS: Record<string, string> = {
  animated: "animated-headline",
  "animated text": "animated-headline",
  marquee: "animated-headline",
  "gradient text": "animated-headline",
  typewriter: "animated-headline",
  "type writer": "animated-headline",
};

/** Detect variant from combined label + contextNote (lowercase). */
export function detectVariantHint(text: string): string | undefined {
  const t = text.toLowerCase().trim();
  for (const [keyword, variant] of Object.entries(VARIANT_HINTS)) {
    if (t.includes(keyword)) return variant;
  }
  return undefined;
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
  | { type: "generic"; props: GenericSectionProps }
  | { type: "pricing-table"; props: PricingTableProps }
  | { type: "testimonials"; props: TestimonialsProps }
  | { type: "logo-cloud"; props: LogoCloudProps }
  | { type: "stats"; props: StatsProps }
  | { type: "newsletter"; props: NewsletterProps }
  | { type: "faq"; props: FAQProps }
  | { type: "team-grid"; props: TeamGridProps }
  | { type: "comparison-table"; props: ComparisonTableProps };

/** Block = section or primitive; one unit in the rendered page. */
export type BlockContent = SectionContent | PrimitiveContent;

export function isPrimitiveContent(b: BlockContent): b is PrimitiveContent {
  return b.type.startsWith("primitive-");
}

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
  pricing: "pricing-table",
  testimonials: "testimonials",
  "logo-cloud": "logo-cloud",
  stats: "stats",
  newsletter: "newsletter",
  faq: "faq",
  team: "team-grid",
  comparison: "comparison-table",
};

// ---------------------------------------------------------------------------
// V2 — Variant-Aware AI Pipeline types
// ---------------------------------------------------------------------------

/** Set of all valid section type strings for runtime validation */
export const SECTION_TYPE_SET: Set<string> = new Set([
  "nav", "hero", "feature-grid", "text-image-split", "cta", "footer",
  "portfolio", "ecommerce-grid", "event-signup", "generic",
  "pricing-table", "testimonials", "logo-cloud", "stats",
  "newsletter", "faq", "team-grid", "comparison-table",
]);

/** Page-wide design coherence decisions selected by AI */
export interface CoherenceStrategy {
  surface?: "flat" | "gradient-mesh" | "grain" | "glass" | "accent-wash";
  density?: "spacious" | "balanced" | "compact";
  animationLevel?: "none" | "subtle" | "expressive";
}

/** A single section in the AI JSON response */
export interface RenderResponseSection {
  id: string;                         // shape ID from canvas
  type: SectionContent["type"];       // one of 18 section types
  props: Record<string, unknown>;     // validated per-type at runtime
}

/** Complete AI response from /api/render-v2 */
export interface RenderResponse {
  coherenceStrategy: CoherenceStrategy;
  sections: RenderResponseSection[];
}
