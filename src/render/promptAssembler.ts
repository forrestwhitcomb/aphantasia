// ============================================================
// APHANTASIA — Deep Render Prompt Assembler
// ============================================================
// Composes the Deep Render system prompt from 3 layers:
//   1. base.md — shared foundation (tokens, reset, nav, footer)
//   2. strategy.md — layout rules, technique whitelist, blueprints
//   3. mood document — aesthetic personality (colors, vibe, decoration)
//
// Strategy wins on layout. Mood wins on aesthetics.
// ============================================================

import type { ResolvedDesignDirection } from "./themeResolver";
import type { MoodDocument } from "./moodSelector";
import { getLibrariesForLevel, buildLibraryReference } from "./cdnCatalog";
import { type StrategyId, loadBase, loadStrategy, interpolateTemplate } from "./strategyRouter";

// ---------------------------------------------------------------------------
// Grain opacity per mood slug
// ---------------------------------------------------------------------------

const GRAIN_OPACITY: Record<string, string> = {
  "dark-minimal-saas": "0.03",
  "editorial-elegance": "0.05",
  "bold-brand": "0.025",
  "clean-commerce": "0.02",
  "warm-personal": "0.04",
  "agency-showcase": "0.03",
};

// ---------------------------------------------------------------------------
// Assemble the complete Deep Render system prompt
// ---------------------------------------------------------------------------

export function assembleDeepRenderPrompt(
  strategyId: StrategyId,
  mood: MoodDocument | undefined,
  direction: ResolvedDesignDirection,
): string {
  const dna = direction.dna;
  const libs = getLibrariesForLevel(direction.animationLevel);
  const libRef = buildLibraryReference(libs);

  // Determine grain opacity from mood slug
  const grainOpacity = GRAIN_OPACITY[dna.moodSlug] ?? "0.03";

  // Build template variables for interpolation
  const vars: Record<string, unknown> = {
    dna,
    direction,
    libRef,
    grainOpacity,
  };

  // Load and interpolate base
  const baseRaw = loadBase();
  const baseInterpolated = interpolateTemplate(baseRaw, vars);

  // Load and interpolate strategy
  const strategy = loadStrategy(strategyId);
  const strategyInterpolated = interpolateTemplate(strategy.content, vars);

  // Compose: base + strategy + mood
  const parts: string[] = [
    baseInterpolated,
    "\n---\n",
    `## Active Strategy: ${strategy.label}\n\n`,
    strategyInterpolated,
  ];

  // Mood document (aesthetic layer)
  if (mood) {
    parts.push("\n---\n");
    parts.push(
      `## Layout vs. Aesthetic Priority\n\n` +
      `The strategy above defines LAYOUT constraints (grid structure, technique whitelist, section blueprints). ` +
      `The mood below defines AESTHETIC direction (colors, vibe, decoration, copy tone). ` +
      `If they conflict, layout constraints take priority.\n\n`
    );
    parts.push(`## Design Aesthetic: ${mood.name}\n\n`);
    parts.push(
      `Follow these mood-specific directives precisely. The DNA gives you exact colors and fonts. The mood tells you how to wield them.\n\n`
    );
    parts.push(mood.fullContent);
  }

  return parts.join("");
}
