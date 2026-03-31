// ============================================================
// Country Picker — Figma-verified from node 5251:165935
// ============================================================
// Vertical stack, gap 4px (spacing/xxs)
// Section label "Popular" 11px grey
// Country rows: flag + name + contacts + chevron, 44px height
// ============================================================

import type { ComponentSpec } from "../../spec/types";

const ICON_SEARCH = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B9B9BE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
const ICON_CHEVRON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B9B9BE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

interface CountryEntry {
  flag: string;
  name: string;
  contacts?: string;
}

const DEFAULT_COUNTRIES: CountryEntry[] = [
  { flag: "\u{1F1F3}\u{1F1EC}", name: "Nigeria", contacts: "646" },
  { flag: "\u{1F1E8}\u{1F1FA}", name: "Cuba", contacts: "312" },
  { flag: "\u{1F1EE}\u{1F1F3}", name: "India", contacts: "528" },
  { flag: "\u{1F1F5}\u{1F1ED}", name: "Philippines", contacts: "419" },
  { flag: "\u{1F1F2}\u{1F1FD}", name: "Mexico", contacts: "287" },
];

function countryRow(key: string, entry: CountryEntry): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      gap: { token: "spacing.xs" },
      height: 44,
      padding: { y: { token: "spacing.sm" } },
      boxSizing: "border-box",
    },
    style: {
      cursor: "pointer",
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    interactive: { type: "button" },
    children: [
      {
        key: `${key}-flag`,
        tag: "span",
        layout: { display: "inline-flex", flexShrink: 0 },
        style: { fontSize: "18px", lineHeight: "18px" },
        text: { content: entry.flag, style: "label-lg" },
      },
      {
        key: `${key}-name`,
        tag: "span",
        layout: { display: "block", flex: "1" },
        style: { letterSpacing: "0.02em", lineHeight: "20px" },
        text: { content: entry.name, style: "paragraph-md", weight: 400, color: { token: "color.text-primary" }, editable: true },
      },
      ...(entry.contacts
        ? [{
            key: `${key}-contacts`,
            tag: "span" as const,
            layout: { display: "inline-flex" as const },
            style: { letterSpacing: "0.02em", lineHeight: "18px" },
            text: { content: `${entry.contacts} contacts here`, style: "paragraph-sm" as const, color: { token: "color.text-secondary" } },
          }]
        : []),
      {
        key: `${key}-chevron`,
        tag: "div",
        layout: { display: "inline-flex", width: 16, height: 16, flexShrink: 0 },
        style: {},
        data: { innerHTML: ICON_CHEVRON },
      },
    ],
  };
}

export function countryPickerTemplate(props?: Record<string, unknown>): ComponentSpec {
  const countriesInput = props?.countries as CountryEntry[] | string[] | undefined;
  let countries: CountryEntry[];

  if (Array.isArray(countriesInput) && countriesInput.length > 0) {
    if (typeof countriesInput[0] === "string") {
      countries = (countriesInput as string[]).map((name) => ({
        flag: "\u{1F3F3}\u{FE0F}",
        name,
      }));
    } else {
      countries = countriesInput as CountryEntry[];
    }
  } else {
    countries = DEFAULT_COUNTRIES;
  }

  return {
    key: "country-picker",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      width: "100%",
      gap: { token: "spacing.xxs" },
    },
    style: {
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    data: { component: "countryPicker" },
    children: [
      // Search bar
      {
        key: "search-bar",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          gap: { token: "spacing.xs" },
          height: 48,
          padding: { left: { token: "spacing.sm" }, right: { token: "spacing.sm" } },
          borderRadius: { token: "radius.md" },
          boxSizing: "border-box",
          width: "100%",
        },
        style: {
          background: { token: "color.surface-light" },
        },
        children: [
          {
            key: "search-icon",
            tag: "div",
            layout: { display: "flex", align: "center", justify: "center", width: 16, height: 16, flexShrink: 0 },
            style: {},
            data: { innerHTML: ICON_SEARCH },
          },
          {
            key: "search-input",
            tag: "div",
            layout: { display: "block", flex: "1" },
            style: { letterSpacing: "0.02em", lineHeight: "20px" },
            interactive: { type: "input" },
            text: { content: "Search countries", style: "paragraph-md", weight: 400, color: { token: "color.text-tertiary" }, editable: true },
          },
        ],
      },
      // Section label
      {
        key: "section-label",
        tag: "span",
        layout: { display: "block", padding: { top: { token: "spacing.xs" } } },
        style: { letterSpacing: "0.02em", lineHeight: "11px" },
        text: { content: "Popular", style: "label-xs", weight: 400, color: { token: "color.text-secondary" } },
      },
      // Country rows
      ...countries.map((c, i) => countryRow(`country-${i}`, c)),
    ],
  };
}
