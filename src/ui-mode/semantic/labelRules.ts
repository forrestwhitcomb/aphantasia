// ============================================================
// APHANTASIA — UI Label Rules
// ============================================================
// Keyword-to-component mapping. If a shape's label matches one
// of these keywords, it is force-resolved to that component
// type — overriding spatial inference. This is highest priority.
//
// Source: aphantasia-ui-build-plan.md, D-UI-5 label-override rules
// ============================================================

import type { UIComponentType } from "../types";

/**
 * Each entry maps a regex pattern (tested against the shape's
 * label, case-insensitive) to a component type and optional
 * variant hint.
 */
export interface LabelRule {
  pattern: RegExp;
  type: UIComponentType;
  variant?: string;
}

export const LABEL_RULES: LabelRule[] = [
  // Navigation & Structure
  { pattern: /\b(nav|navbar|navigation|header|app\s*bar)\b/i, type: "navBar" },
  { pattern: /\b(tab|tabbar|tabs|bottom\s*nav)\b/i, type: "tabBar" },
  { pattern: /\b(bottom\s*sheet|sheet|drawer)\b/i, type: "bottomSheet" },
  { pattern: /\b(status\s*bar)\b/i, type: "statusBar" },

  // Content & Data Display
  { pattern: /\b(card)\b/i, type: "card" },
  { pattern: /\b(list|menu)\b/i, type: "listGroup" },
  { pattern: /\b(section\s*header|group\s*title)\b/i, type: "sectionHeader" },
  { pattern: /\b(avatar|profile\s*pic)\b/i, type: "avatar" },
  { pattern: /\b(badge)\b/i, type: "badge" },
  { pattern: /\b(tag|chip|pill)\b/i, type: "tag" },
  { pattern: /\b(empty|empty\s*state|no\s*data|no\s*results)\b/i, type: "emptyState" },

  // Inputs & Actions
  { pattern: /\b(button|btn|cta|action)\b/i, type: "button" },
  { pattern: /\b(input|field|text\s*field|form)\b/i, type: "textInput" },
  { pattern: /\b(search)\b/i, type: "searchBar" },
  { pattern: /\b(toggle|switch)\b/i, type: "toggle" },
  { pattern: /\b(checkbox|check\s*box)\b/i, type: "checkbox" },
  { pattern: /\b(segment|segmented)\b/i, type: "segmentedControl" },
  { pattern: /\b(slider|range)\b/i, type: "slider" },
  { pattern: /\b(stepper|counter|quantity)\b/i, type: "stepper" },

  // Media & Visual
  { pattern: /\b(image|photo|thumbnail|img|picture)\b/i, type: "imagePlaceholder" },
  { pattern: /\b(carousel|swiper|gallery)\b/i, type: "carousel" },
  { pattern: /\b(progress|loading)\b/i, type: "progressBar" },
  { pattern: /\b(divider|separator|line)\b/i, type: "divider" },

  // Feedback & Overlay
  { pattern: /\b(alert|banner|notification)\b/i, type: "alert" },
  { pattern: /\b(toast|snackbar)\b/i, type: "toast" },
  { pattern: /\b(modal|dialog|popup)\b/i, type: "modal" },
  { pattern: /\b(fab|floating\s*button|floating\s*action)\b/i, type: "floatingActionButton" },
  { pattern: /\b(dropdown|select|picker)\b/i, type: "bottomSheet" },

  // Composite
  { pattern: /\b(profile|user\s*header)\b/i, type: "profileHeader" },
  { pattern: /\b(message|chat|bubble)\b/i, type: "messageBubble" },
  { pattern: /\b(feed|post)\b/i, type: "feedItem" },
  { pattern: /\b(settings|preferences)\b/i, type: "settingsRow" },
];

/**
 * Try to resolve a component type from a shape's label text.
 * Returns the first matching rule, or null if no match.
 */
export function resolveFromLabel(label: string): { type: UIComponentType; variant?: string } | null {
  if (!label || !label.trim()) return null;
  // Only check the first line of multi-line labels
  const firstLine = label.split("\n")[0].trim();
  for (const rule of LABEL_RULES) {
    if (rule.pattern.test(firstLine)) {
      return { type: rule.type, variant: rule.variant };
    }
  }
  return null;
}
