// ============================================================
// APHANTASIA — Shared Section + Primitive Rendering
// ============================================================
// shapeToBlock / renderBlock support both sections and primitives.
// ============================================================

import type { CanvasShape } from "@/engine/CanvasEngine";
import type {
  SectionContent,
  BlockContent,
  PrimitiveContent,
  FeatureGridProps,
  FeatureItem,
} from "@/types/render";
import { isPrimitiveContent, detectVariantHint } from "@/types/render";
import { parseTextLabel } from "@/lib/textParse";
import { PRIMITIVE_IDS } from "@/lib/componentCatalogData";
import {
  renderNav,
  renderHero,
  renderFeatureGrid,
  renderTextImageSplit,
  renderCTA,
  renderFooter,
  renderPortfolio,
  renderEcommerceGrid,
  renderEventSignup,
  renderGenericSection,
  renderPricingTable,
  renderTestimonials,
  renderLogoCloud,
  renderStats,
  renderNewsletter,
  renderFAQ,
  renderTeamGrid,
  renderComparisonTable,
} from "@/components/sections";
import { renderPrimitive } from "@/components/primitives";

// ---------------------------------------------------------------------------
// renderSection — dispatches a SectionContent to the correct renderer
// ---------------------------------------------------------------------------

export function renderSection(section: SectionContent, sectionId?: string): string {
  try {
    switch (section.type) {
      case "nav":
        return renderNav(section.props, sectionId);
      case "hero":
        return renderHero(section.props, sectionId);
      case "feature-grid":
        return renderFeatureGrid(section.props, sectionId);
      case "text-image-split":
        return renderTextImageSplit(section.props, sectionId);
      case "cta":
        return renderCTA(section.props, sectionId);
      case "footer":
        return renderFooter(section.props, sectionId);
      case "portfolio":
        return renderPortfolio(section.props, sectionId);
      case "ecommerce-grid":
        return renderEcommerceGrid(section.props, sectionId);
      case "event-signup":
        return renderEventSignup(section.props, sectionId);
      case "generic":
        return renderGenericSection(section.props, sectionId);
      case "pricing-table":
        return renderPricingTable(section.props, sectionId);
      case "testimonials":
        return renderTestimonials(section.props, sectionId);
      case "logo-cloud":
        return renderLogoCloud(section.props, sectionId);
      case "stats":
        return renderStats(section.props, sectionId);
      case "newsletter":
        return renderNewsletter(section.props, sectionId);
      case "faq":
        return renderFAQ(section.props, sectionId);
      case "team-grid":
        return renderTeamGrid(section.props, sectionId);
      case "comparison-table":
        return renderComparisonTable(section.props, sectionId);
      default:
        return "";
    }
  } catch (err) {
    console.error(`[renderSection] Error rendering "${section.type}" (id: ${sectionId}):`, err);
    return `<section data-aph-id="${sectionId ?? ""}" style="padding:40px;text-align:center;color:var(--muted-fg,#888);font-family:var(--font-body,sans-serif);"><p style="font-size:14px;">⚠ Section failed to render</p><p style="font-size:11px;opacity:0.5;">${section.type}</p></section>`;
  }
}

// ---------------------------------------------------------------------------
// shapeToSection — converts a resolved CanvasShape into a SectionContent
// ---------------------------------------------------------------------------

export function shapeToSection(shape: CanvasShape): SectionContent {
  // 1. SlotBag system — if the shape already carries a resolved layout, use it
  if (shape.meta?._resolvedLayout) {
    return shape.meta._resolvedLayout as SectionContent;
  }

  // 2. Legacy compound sections — spatially grouped shapes → feature-grid
  if (shape.meta?._spatialGroup) {
    const groupProps = shape.meta._spatialGroup as Record<string, unknown>;
    const text = shape.label || shape.content || "";
    return {
      type: "feature-grid",
      props: {
        title: (groupProps.title as string) || text || undefined,
        subtitle: groupProps.subtitle as string | undefined,
        features: groupProps.features as FeatureItem[] | undefined,
        variant: shape.meta?.placementVariant as string | undefined,
      } satisfies FeatureGridProps,
    };
  }

  // 3. Prefer context-inferred section type when tag is generic/unknown
  const inferredType = shape.meta?._inferredSection as SectionContent["type"] | undefined;
  const effectiveTag =
    inferredType && (shape.semanticTag === "section" || shape.semanticTag === "unknown")
      ? inferredType
      : shape.semanticTag;

  // 4. Parse text and map based on effectiveTag; detect variant from label + contextNote
  const text = shape.label || shape.content || "";
  const parsed = parseTextLabel(text);
  const variantHint = detectVariantHint(`${text} ${shape.contextNote ?? ""}`);

  switch (effectiveTag) {
    case "nav":
      return { type: "nav", props: { logo: parsed.heading || text || undefined } };

    case "hero":
      return {
        type: "hero",
        props: {
          headline: parsed.heading || undefined,
          subheadline: parsed.body || undefined,
          cta: parsed.cta || undefined,
          variant: variantHint ?? (shape.meta?.placementVariant as string | undefined),
        },
      };

    case "cards":
      return {
        type: "feature-grid",
        props: {
          title: parsed.heading || text || undefined,
          variant: shape.meta?.placementVariant as string | undefined,
        },
      };

    case "split":
      return {
        type: "text-image-split",
        props: {
          heading: parsed.heading || undefined,
          body: parsed.body || undefined,
          cta: parsed.cta || undefined,
        },
      };

    case "section":
      return {
        type: "generic",
        props: {
          title: parsed.heading || undefined,
          body: parsed.body || undefined,
          cta: parsed.cta || undefined,
        },
      };

    case "footer":
      return { type: "footer", props: { logo: parsed.heading || text || undefined } };

    case "cta":
    case "button":
      return { type: "cta", props: { cta: parsed.cta || text || "Button" } };

    case "form":
      return { type: "event-signup", props: { eventName: parsed.heading || text || undefined } };

    case "portfolio":
      return { type: "portfolio", props: { title: parsed.heading || text || undefined } };

    case "ecommerce":
      return { type: "ecommerce-grid", props: { title: parsed.heading || text || undefined } };

    case "pricing":
      return { type: "pricing-table", props: { title: parsed.heading || text || undefined } };
    case "testimonials":
      return { type: "testimonials", props: { title: parsed.heading || text || undefined } };
    case "logo-cloud":
      return { type: "logo-cloud", props: { title: parsed.heading || text || undefined } };
    case "stats":
      return { type: "stats", props: { title: parsed.heading || text || undefined } };
    case "newsletter":
      return { type: "newsletter", props: { headline: parsed.heading || text || undefined } };
    case "faq":
      return { type: "faq", props: { title: parsed.heading || text || undefined } };
    case "team":
      return { type: "team-grid", props: { title: parsed.heading || text || undefined } };
    case "comparison":
      return { type: "comparison-table", props: { title: parsed.heading || text || undefined } };

    case "text-block": {
      // If entire text is just a button keyword (no heading), render as standalone CTA
      if (parsed.cta && !parsed.heading) {
        return { type: "cta", props: { cta: parsed.cta } };
      }
      return {
        type: "generic",
        props: {
          title: parsed.heading || undefined,
          body: parsed.body || (!parsed.heading ? text : undefined) || undefined,
          cta: parsed.cta || undefined,
        },
      };
    }

    default:
      return { type: "generic", props: {} };
  }
}

// ---------------------------------------------------------------------------
// shapeToBlock — section or primitive from shape (uses meta.componentId for primitives)
// ---------------------------------------------------------------------------

export function shapeToBlock(shape: CanvasShape): BlockContent {
  const componentId = shape.meta?.componentId as string | undefined;
  if (componentId && PRIMITIVE_IDS.has(componentId)) {
    const text = shape.label || shape.content || "";
    const parsed = parseTextLabel(text);
    switch (componentId) {
      case "primitive-button":
        return { type: "primitive-button", props: { label: parsed.cta || parsed.heading || text || "Button" } };
      case "primitive-card":
        return { type: "primitive-card", props: { title: parsed.heading || text || "Card", body: parsed.body } };
      case "primitive-badge":
        return { type: "primitive-badge", props: { text: parsed.heading || text || "Badge" } };
      case "primitive-input":
        return { type: "primitive-input", props: { placeholder: text || "Placeholder..." } };
      case "primitive-separator":
        return { type: "primitive-separator", props: { orientation: "horizontal" } };
      case "primitive-accordion":
        return { type: "primitive-accordion", props: {} };
      case "primitive-alert":
        return { type: "primitive-alert", props: { title: parsed.heading || text || undefined } };
      case "primitive-alert-dialog":
        return { type: "primitive-alert-dialog", props: { title: parsed.heading || text || undefined } };
      case "primitive-aspect-ratio":
        return { type: "primitive-aspect-ratio", props: { ratio: text || "16 / 9" } };
      case "primitive-avatar":
        return { type: "primitive-avatar", props: { fallback: text || "CN" } };
      case "primitive-breadcrumb":
        return { type: "primitive-breadcrumb", props: {} };
      case "primitive-button-group":
        return { type: "primitive-button-group", props: {} };
      case "primitive-calendar":
        return { type: "primitive-calendar", props: {} };
      case "primitive-carousel":
        return { type: "primitive-carousel", props: {} };
      case "primitive-chart":
        return { type: "primitive-chart", props: { title: parsed.heading || text || undefined } };
      case "primitive-checkbox":
        return { type: "primitive-checkbox", props: { label: text || undefined } };
      case "primitive-collapsible":
        return { type: "primitive-collapsible", props: { title: parsed.heading || text || undefined } };
      case "primitive-combobox":
        return { type: "primitive-combobox", props: { placeholder: text || undefined } };
      case "primitive-command":
        return { type: "primitive-command", props: {} };
      case "primitive-context-menu":
        return { type: "primitive-context-menu", props: {} };
      case "primitive-data-table":
        return { type: "primitive-data-table", props: {} };
      case "primitive-date-picker":
        return { type: "primitive-date-picker", props: { placeholder: text || undefined } };
      case "primitive-dialog":
        return { type: "primitive-dialog", props: { title: parsed.heading || text || undefined } };
      case "primitive-direction":
        return { type: "primitive-direction", props: {} };
      case "primitive-drawer":
        return { type: "primitive-drawer", props: { title: parsed.heading || text || undefined } };
      case "primitive-dropdown-menu":
        return { type: "primitive-dropdown-menu", props: { trigger: text || undefined } };
      case "primitive-empty":
        return { type: "primitive-empty", props: { title: parsed.heading || text || undefined } };
      case "primitive-field":
        return { type: "primitive-field", props: { label: parsed.heading || text || undefined } };
      case "primitive-hover-card":
        return { type: "primitive-hover-card", props: { trigger: text || undefined } };
      case "primitive-input-group":
        return { type: "primitive-input-group", props: {} };
      case "primitive-input-otp":
        return { type: "primitive-input-otp", props: {} };
      case "primitive-item":
        return { type: "primitive-item", props: { title: parsed.heading || text || undefined } };
      case "primitive-kbd":
        return { type: "primitive-kbd", props: {} };
      case "primitive-label":
        return { type: "primitive-label", props: { text: text || undefined } };
      case "primitive-menubar":
        return { type: "primitive-menubar", props: {} };
      case "primitive-native-select":
        return { type: "primitive-native-select", props: { placeholder: text || undefined } };
      case "primitive-navigation-menu":
        return { type: "primitive-navigation-menu", props: {} };
      case "primitive-pagination":
        return { type: "primitive-pagination", props: {} };
      case "primitive-popover":
        return { type: "primitive-popover", props: {} };
      case "primitive-progress":
        return { type: "primitive-progress", props: {} };
      case "primitive-radio-group":
        return { type: "primitive-radio-group", props: {} };
      case "primitive-resizable":
        return { type: "primitive-resizable", props: {} };
      case "primitive-scroll-area":
        return { type: "primitive-scroll-area", props: {} };
      case "primitive-select":
        return { type: "primitive-select", props: { placeholder: text || undefined } };
      case "primitive-sheet":
        return { type: "primitive-sheet", props: { title: parsed.heading || text || undefined } };
      case "primitive-sidebar":
        return { type: "primitive-sidebar", props: { title: parsed.heading || text || undefined } };
      case "primitive-skeleton":
        return { type: "primitive-skeleton", props: {} };
      case "primitive-slider":
        return { type: "primitive-slider", props: {} };
      case "primitive-sonner":
        return { type: "primitive-sonner", props: { title: parsed.heading || text || undefined } };
      case "primitive-spinner":
        return { type: "primitive-spinner", props: {} };
      case "primitive-switch":
        return { type: "primitive-switch", props: { label: text || undefined } };
      case "primitive-table":
        return { type: "primitive-table", props: {} };
      case "primitive-tabs":
        return { type: "primitive-tabs", props: {} };
      case "primitive-textarea":
        return { type: "primitive-textarea", props: { placeholder: text || undefined } };
      case "primitive-toast":
        return { type: "primitive-toast", props: { title: parsed.heading || text || undefined } };
      case "primitive-toggle":
        return { type: "primitive-toggle", props: { label: text || undefined } };
      case "primitive-toggle-group":
        return { type: "primitive-toggle-group", props: {} };
      case "primitive-tooltip":
        return { type: "primitive-tooltip", props: { content: text || undefined } };
      case "primitive-typography":
        return { type: "primitive-typography", props: { text: text || undefined } };
      default:
        break;
    }
  }
  return shapeToSection(shape);
}

// ---------------------------------------------------------------------------
// renderBlock — section or primitive to HTML
// ---------------------------------------------------------------------------

export function renderBlock(block: BlockContent, sectionId?: string): string {
  if (isPrimitiveContent(block)) {
    return renderPrimitive(block);
  }
  return renderSection(block, sectionId);
}
