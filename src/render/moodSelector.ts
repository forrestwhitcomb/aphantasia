// ============================================================
// APHANTASIA — Mood Selector + Loader
// ============================================================
// Selects and loads mood documents based on context, archetype,
// and scratchpad notes. Mood files are loaded via fs at init time
// (server-side only — this module is used in API routes).
// ============================================================

import fs from "fs";
import path from "path";
import type { ResolvedDesignDirection } from "./themeResolver";
import type { StructuredContext } from "@/types/context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MoodId =
  | "dark-minimal-saas"
  | "editorial-elegance"
  | "bold-brand"
  | "clean-commerce"
  | "warm-personal"
  | "agency-showcase";

export interface MoodDocument {
  id: MoodId;
  name: string;
  fullContent: string;       // entire markdown document
  variantBias: string;       // just the Variant Bias section (for Layer 2)
}

// ---------------------------------------------------------------------------
// Load mood documents from disk
// ---------------------------------------------------------------------------

const MOOD_DIR = path.join(process.cwd(), "src", "render", "moods");

const MOOD_META: Record<MoodId, string> = {
  "dark-minimal-saas": "Dark Minimal SaaS",
  "editorial-elegance": "Editorial Elegance",
  "bold-brand": "Bold Brand",
  "clean-commerce": "Clean Commerce",
  "warm-personal": "Warm Personal",
  "agency-showcase": "Agency Showcase",
};

function extractVariantBias(content: string): string {
  const marker = "## Variant Bias";
  const idx = content.indexOf(marker);
  if (idx === -1) return "";
  return content.slice(idx);
}

function loadMood(id: MoodId): MoodDocument {
  let raw = "";
  try {
    raw = fs.readFileSync(path.join(MOOD_DIR, `${id}.md`), "utf-8");
  } catch {
    // File not found — return empty mood
    raw = `# ${MOOD_META[id]}\n\nMood document not found.`;
  }
  return {
    id,
    name: MOOD_META[id],
    fullContent: raw,
    variantBias: extractVariantBias(raw),
  };
}

// Lazy-load cache (loads on first access, avoids startup cost)
let _moods: Record<MoodId, MoodDocument> | null = null;

function getMoods(): Record<MoodId, MoodDocument> {
  if (!_moods) {
    _moods = {
      "dark-minimal-saas": loadMood("dark-minimal-saas"),
      "editorial-elegance": loadMood("editorial-elegance"),
      "bold-brand": loadMood("bold-brand"),
      "clean-commerce": loadMood("clean-commerce"),
      "warm-personal": loadMood("warm-personal"),
      "agency-showcase": loadMood("agency-showcase"),
    };
  }
  return _moods;
}

// ---------------------------------------------------------------------------
// Keyword matching for scratchpad override
// ---------------------------------------------------------------------------

const SCRATCHPAD_KEYWORDS: Record<string, MoodId> = {
  // Dark Minimal SaaS
  "linear": "dark-minimal-saas",
  "vercel": "dark-minimal-saas",
  "raycast": "dark-minimal-saas",
  "dark mode": "dark-minimal-saas",
  "dark theme": "dark-minimal-saas",
  "minimal saas": "dark-minimal-saas",
  "supabase": "dark-minimal-saas",

  // Editorial Elegance
  "editorial": "editorial-elegance",
  "magazine": "editorial-elegance",
  "aesop": "editorial-elegance",
  "monocle": "editorial-elegance",
  "kinfolk": "editorial-elegance",
  "serif": "editorial-elegance",
  "elegant": "editorial-elegance",

  // Bold Brand
  "bold": "bold-brand",
  "colorful": "bold-brand",
  "notion": "bold-brand",
  "figma": "bold-brand",
  "framer": "bold-brand",
  "vibrant": "bold-brand",
  "playful": "bold-brand",
  "energetic": "bold-brand",

  // Clean Commerce
  "ecommerce": "clean-commerce",
  "e-commerce": "clean-commerce",
  "store": "clean-commerce",
  "shop": "clean-commerce",
  "allbirds": "clean-commerce",
  "glossier": "clean-commerce",
  "apple store": "clean-commerce",
  "product page": "clean-commerce",

  // Warm Personal
  "personal": "warm-personal",
  "blog": "warm-personal",
  "substack": "warm-personal",
  "warm": "warm-personal",
  "friendly": "warm-personal",
  "approachable": "warm-personal",
  "casual": "warm-personal",

  // Agency Showcase
  "agency": "agency-showcase",
  "awwwards": "agency-showcase",
  "experimental": "agency-showcase",
  "dramatic": "agency-showcase",
  "showcase": "agency-showcase",
  "studio": "agency-showcase",
};

// ---------------------------------------------------------------------------
// Mood selection logic
// ---------------------------------------------------------------------------

/**
 * Select the best mood based on design direction, context, and scratchpad notes.
 *
 * Priority:
 * 1. Scratchpad keyword match (explicit user intent)
 * 2. Content type + archetype mapping (from context extraction)
 * 3. Default: dark-minimal-saas
 */
export function selectMood(
  direction: ResolvedDesignDirection,
  context?: StructuredContext | null,
  scratchpadText?: string
): MoodDocument {
  const moods = getMoods();

  // Priority 1: scratchpad keyword override
  if (scratchpadText) {
    const lower = scratchpadText.toLowerCase();
    for (const [keyword, moodId] of Object.entries(SCRATCHPAD_KEYWORDS)) {
      if (lower.includes(keyword)) {
        return moods[moodId];
      }
    }
  }

  // Priority 2: content type mapping
  const ct = direction.contentType;
  switch (ct) {
    case "portfolio":
    case "editorial":
      return moods["editorial-elegance"];
    case "product":
      return moods["clean-commerce"];
    case "personal":
      return moods["warm-personal"];
    case "agency":
      return moods["agency-showcase"];
    case "saas":
      if (direction.archetype === "bold") return moods["bold-brand"];
      return moods["dark-minimal-saas"];
    case "restaurant":
      return moods["editorial-elegance"];
    default:
      break;
  }

  // Priority 3: archetype fallback
  switch (direction.archetype) {
    case "editorial":
      return moods["editorial-elegance"];
    case "bold":
      return moods["bold-brand"];
    case "gallery":
      return moods["agency-showcase"];
    case "minimal":
    case "saas":
    case "dashboard":
    default:
      return moods["dark-minimal-saas"];
  }
}

/** Get a mood by ID directly */
export function getMood(id: MoodId): MoodDocument {
  return getMoods()[id];
}

/** Get all available mood IDs */
export function getAllMoodIds(): MoodId[] {
  return Object.keys(MOOD_META) as MoodId[];
}
