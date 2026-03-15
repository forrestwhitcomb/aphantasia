// ============================================================
// APHANTASIA — CTA Scanner
// ============================================================
// Scans SectionContent[] to find all CTA buttons.
// Used by DeployModal to show the pre-deploy link review step.
// ============================================================

import type { SectionContent } from "@/types/render";

export interface CTAEntry {
  sectionIndex: number;
  sectionType: string;
  sectionId: string; // anchor ID, e.g. "hero-0"
  field: "cta" | "ctaSecondary";
  label: string;
  currentHref?: string;
}

/**
 * Walk all sections and collect every CTA button that exists.
 * Returns a flat list of CTAEntry objects.
 */
export function scanCTAs(sections: SectionContent[]): CTAEntry[] {
  const entries: CTAEntry[] = [];
  const typeCounts: Record<string, number> = {};

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    const count = typeCounts[s.type] ?? 0;
    typeCounts[s.type] = count + 1;
    const sectionId = `${s.type}-${count}`;

    const props = s.props as Record<string, unknown>;

    // Primary CTA
    if (props.cta && typeof props.cta === "string") {
      entries.push({
        sectionIndex: i,
        sectionType: s.type,
        sectionId,
        field: "cta",
        label: props.cta as string,
        currentHref: (props.ctaHref as string) || undefined,
      });
    }

    // Secondary CTA
    if (props.ctaSecondary && typeof props.ctaSecondary === "string") {
      entries.push({
        sectionIndex: i,
        sectionType: s.type,
        sectionId,
        field: "ctaSecondary",
        label: props.ctaSecondary as string,
        currentHref: (props.ctaSecondaryHref as string) || undefined,
      });
    }

    // Feature grid: scan each feature's CTA
    if (s.type === "feature-grid" && s.props.features) {
      for (const f of s.props.features) {
        if (f.cta) {
          entries.push({
            sectionIndex: i,
            sectionType: s.type,
            sectionId,
            field: "cta",
            label: f.cta,
            currentHref: f.ctaHref || undefined,
          });
        }
      }
    }
  }

  return entries;
}

/**
 * Collect all unique section anchor IDs from a section list.
 * Useful for the "link to section" dropdown in the deploy modal.
 */
export function collectSectionAnchors(sections: SectionContent[]): string[] {
  const typeCounts: Record<string, number> = {};
  const anchors: string[] = [];

  for (const s of sections) {
    const count = typeCounts[s.type] ?? 0;
    typeCounts[s.type] = count + 1;
    anchors.push(`${s.type}-${count}`);
  }

  return anchors;
}
