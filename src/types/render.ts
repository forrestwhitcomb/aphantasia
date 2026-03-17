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
}

export interface HeroProps extends SectionDesignHints {
  headline?: string;
  subheadline?: string;
  cta?: string;
  ctaHref?: string;
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
  badge?: string;
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
  variant?: string;
}

export interface TextImageSplitProps extends SectionDesignHints {
  heading?: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
}

export interface CTAProps extends SectionDesignHints {
  heading?: string;
  subheading?: string;
  cta?: string;
  ctaHref?: string;
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
}

export interface FooterProps extends SectionDesignHints {
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

export interface PortfolioProps extends SectionDesignHints {
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

export interface EcommerceGridProps extends SectionDesignHints {
  title?: string;
  subtitle?: string;
  products?: ProductItem[];
}

export interface EventSignupProps extends SectionDesignHints {
  eventName?: string;
  date?: string;
  location?: string;
  description?: string;
  cta?: string;
}

export interface GenericSectionProps extends SectionDesignHints {
  title?: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
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
  | { type: "generic"; props: GenericSectionProps };

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
};
