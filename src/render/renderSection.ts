// ============================================================
// APHANTASIA — Shared Section Rendering
// ============================================================
// Two functions that eliminate duplicated rendering dispatch
// logic between WebRenderer.renderBlock() and
// PreviewPane.renderEnrichedSection() / renderFallbackBlock().
// ============================================================

import type { CanvasShape } from "@/engine/CanvasEngine";
import type { SectionContent, FeatureGridProps, FeatureItem } from "@/types/render";
import { parseTextLabel } from "@/lib/textParse";
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
} from "@/components/sections";

// ---------------------------------------------------------------------------
// renderSection — dispatches a SectionContent to the correct renderer
// ---------------------------------------------------------------------------

export function renderSection(section: SectionContent, sectionId?: string): string {
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
    default:
      return "";
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
      } satisfies FeatureGridProps,
    };
  }

  // 3. Parse text and map based on semanticTag
  const text = shape.label || shape.content || "";
  const parsed = parseTextLabel(text);

  switch (shape.semanticTag) {
    case "nav":
      return { type: "nav", props: { logo: parsed.heading || text || undefined } };

    case "hero":
      return {
        type: "hero",
        props: {
          headline: parsed.heading || undefined,
          subheadline: parsed.body || undefined,
          cta: parsed.cta || undefined,
        },
      };

    case "cards":
      return { type: "feature-grid", props: { title: parsed.heading || text || undefined } };

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

    case "button":
      return { type: "cta", props: { cta: parsed.cta || text || "Button" } };

    case "form":
      return { type: "event-signup", props: { eventName: parsed.heading || text || undefined } };

    case "portfolio":
      return { type: "portfolio", props: { title: parsed.heading || text || undefined } };

    case "ecommerce":
      return { type: "ecommerce-grid", props: { title: parsed.heading || text || undefined } };

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
