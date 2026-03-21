// ============================================================
// APHANTASIA — Deep Render Strategy Router
// ============================================================
// Deterministic routing: StructuredContext → StrategyId.
// No AI call. Pure lookup from contentType + tone + scratchpad.
// Strategy wins on layout. Mood wins on aesthetics.
// ============================================================

import fs from "fs";
import path from "path";
import type { ResolvedDesignDirection } from "./themeResolver";
import type { StructuredContext } from "@/types/context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StrategyId = "clean-saas" | "editorial" | "atmospheric" | "expressive";

export interface LoadedStrategy {
  id: StrategyId;
  label: string;
  content: string; // raw markdown from strategies/<id>.md
}

// ---------------------------------------------------------------------------
// Content-type → strategy mapping
// ---------------------------------------------------------------------------

const CONTENT_TYPE_MAP: Record<string, StrategyId> = {
  // clean-saas (default, ~70%)
  saas: "clean-saas",
  ecommerce: "clean-saas",
  nonprofit: "clean-saas",
  general: "clean-saas",

  // expressive (~10%)
  portfolio: "expressive",
  agency: "expressive",
  event: "expressive",

  // editorial (~10%)
  editorial: "editorial",
  personal: "editorial",

  // atmospheric (~10%)
  restaurant: "atmospheric",
};

// ---------------------------------------------------------------------------
// Tone keywords → strategy
// ---------------------------------------------------------------------------

const EXPRESSIVE_TONES = ["playful", "bold", "urgent", "disruptive", "experimental"];
const ATMOSPHERIC_TONES = ["calm", "warm", "luxurious", "serene", "intimate", "elegant"];
const EDITORIAL_TONES = ["authoritative", "informational", "trustworthy", "thoughtful", "minimal"];

// ---------------------------------------------------------------------------
// Scratchpad keyword → strategy (user intent overrides everything)
// ---------------------------------------------------------------------------

const SCRATCHPAD_OVERRIDES: Array<{ keywords: string[]; strategy: StrategyId }> = [
  { keywords: ["experimental", "creative", "wild", "bento", "asymmetric"], strategy: "expressive" },
  { keywords: ["editorial", "magazine", "longform", "minimal", "blog"], strategy: "editorial" },
  { keywords: ["atmospheric", "moody", "cinematic", "immersive"], strategy: "atmospheric" },
  { keywords: ["clean", "saas", "professional", "corporate"], strategy: "clean-saas" },
];

// ---------------------------------------------------------------------------
// Tone normalizer
// ---------------------------------------------------------------------------

interface NormalizedTone {
  formality: string;
  energy: string;
  personality: string;
}

function normalizeTone(tone: StructuredContext["tone"]): NormalizedTone {
  if (!tone) return { formality: "neutral", energy: "confident", personality: "" };
  if (typeof tone === "string") {
    return { formality: "neutral", energy: tone, personality: tone };
  }
  return {
    formality: tone.formality || "neutral",
    energy: tone.energy || "confident",
    personality: tone.personality || "",
  };
}

// ---------------------------------------------------------------------------
// Strategy selection — the core router
// ---------------------------------------------------------------------------

export function selectStrategy(
  direction: ResolvedDesignDirection,
  context: StructuredContext | null,
  scratchpadNotes?: string,
): StrategyId {
  // 1. Scratchpad keyword overrides (user intent wins)
  if (scratchpadNotes) {
    const n = scratchpadNotes.toLowerCase();
    for (const { keywords, strategy } of SCRATCHPAD_OVERRIDES) {
      if (keywords.some((kw) => n.includes(kw))) return strategy;
    }
  }

  // 2. Content-type routing (strongest signal after explicit intent)
  if (context?.contentType) {
    const mapped = CONTENT_TYPE_MAP[context.contentType];
    if (mapped) return mapped;
  }

  // 3. Tone-based fallback
  if (context?.tone) {
    const { energy, personality } = normalizeTone(context.tone);
    const combined = `${energy} ${personality}`.toLowerCase();

    if (EXPRESSIVE_TONES.some((t) => combined.includes(t))) return "expressive";
    if (ATMOSPHERIC_TONES.some((t) => combined.includes(t))) return "atmospheric";
    if (EDITORIAL_TONES.some((t) => combined.includes(t))) return "editorial";
  }

  // 4. Default — clean-saas is always safe
  return "clean-saas";
}

// ---------------------------------------------------------------------------
// Strategy file loader (lazy cache, same pattern as moodSelector.ts)
// ---------------------------------------------------------------------------

const STRATEGY_DIR = path.join(process.cwd(), "src", "render", "strategies");

const STRATEGY_LABELS: Record<StrategyId, string> = {
  "clean-saas": "Clean SaaS",
  editorial: "Editorial",
  atmospheric: "Atmospheric",
  expressive: "Expressive",
};

function loadStrategyFile(id: StrategyId): LoadedStrategy {
  let raw = "";
  try {
    raw = fs.readFileSync(path.join(STRATEGY_DIR, `${id}.md`), "utf-8");
  } catch {
    raw = `# ${STRATEGY_LABELS[id]}\n\nStrategy file not found.`;
  }
  return { id, label: STRATEGY_LABELS[id], content: raw };
}

let _strategies: Record<StrategyId, LoadedStrategy> | null = null;

function getStrategies(): Record<StrategyId, LoadedStrategy> {
  if (!_strategies) {
    _strategies = {
      "clean-saas": loadStrategyFile("clean-saas"),
      editorial: loadStrategyFile("editorial"),
      atmospheric: loadStrategyFile("atmospheric"),
      expressive: loadStrategyFile("expressive"),
    };
  }
  return _strategies;
}

export function loadStrategy(id: StrategyId): LoadedStrategy {
  return getStrategies()[id];
}

// Also load base.md (shared foundation)
let _base: string | null = null;

export function loadBase(): string {
  if (!_base) {
    try {
      _base = fs.readFileSync(path.join(STRATEGY_DIR, "base.md"), "utf-8");
    } catch {
      _base = "# Base\n\nBase strategy file not found.";
    }
  }
  return _base;
}

// ---------------------------------------------------------------------------
// Template interpolation
// ---------------------------------------------------------------------------
// Light interpolation for {{dna.palette.accent}} style placeholders.
// Supports dotted paths and ?? defaults.
// ---------------------------------------------------------------------------

export function interpolateTemplate(
  template: string,
  vars: Record<string, unknown>,
): string {
  return template.replace(/\{\{(.+?)\}\}/g, (_match, expr: string) => {
    // Handle ?? default syntax: {{dna.typography.headingWeightLight ?? 300}}
    const [pathPart, defaultPart] = expr.split("??").map((s: string) => s.trim());

    const value = resolveDottedPath(vars, pathPart);
    if (value !== undefined && value !== null) return String(value);
    if (defaultPart !== undefined) return defaultPart;
    return "";
  });
}

function resolveDottedPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}
