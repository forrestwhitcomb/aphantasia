// CountryPicker — Rebtel country selection matching Figma
// Figma: search bar "Search country" at top, recent search "Niger" with X,
// then country list with flag + name + contacts count + chevron
// Variants: "search" | "recent" | "alphabetical"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderCountryPicker(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "search" | "recent" | "alphabetical") ?? "search";
  const label = props.label ?? "Search country";

  const ICON_SEARCH = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
  const ICON_CHEVRON_RIGHT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
  const ICON_CLOSE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  const countries = [
    { flag: "\u{1F1F3}\u{1F1EC}", name: "Nigeria", contacts: "848" },
    { flag: "\u{1F1EE}\u{1F1F3}", name: "India", contacts: "1,204" },
    { flag: "\u{1F1F2}\u{1F1FD}", name: "Mexico", contacts: "392" },
    { flag: "\u{1F1F5}\u{1F1ED}", name: "Philippines", contacts: "267" },
    { flag: "\u{1F1E8}\u{1F1FA}", name: "Cuba", contacts: "156" },
  ];

  const renderRow = (c: typeof countries[0]) => `
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-sm);padding:var(--rebtel-spacing-sm) var(--rebtel-spacing-md);min-height:var(--rebtel-height-xl);border-bottom:1px solid var(--rebtel-border-secondary);cursor:pointer;box-sizing:border-box" data-interactive="button">
      <span style="font-size:24px;flex-shrink:0">${c.flag}</span>
      <span style="flex:1;font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-md-size);line-height:var(--rebtel-paragraph-md-lh);font-weight:500;color:var(--rebtel-text-primary);letter-spacing:var(--rebtel-ls)">${c.name}</span>
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls);white-space:nowrap">${c.contacts} contacts</span>
      <span style="display:flex;align-items:center;flex-shrink:0">${ICON_CHEVRON_RIGHT}</span>
    </div>`;

  const searchBar = `
  <div style="padding:var(--rebtel-spacing-sm) var(--rebtel-spacing-md)">
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);background:var(--rebtel-surface-primary-light);border-radius:var(--rebtel-radius-sm);padding:0 var(--rebtel-spacing-sm);height:var(--rebtel-height-md)" data-interactive="input">
      ${ICON_SEARCH}
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-paragraph-sm-size);line-height:var(--rebtel-paragraph-sm-lh);color:var(--rebtel-text-tertiary);letter-spacing:var(--rebtel-ls)" data-text-editable>${label}</span>
    </div>
  </div>`;

  switch (variant) {
    case "search":
      return `
<div data-component="countryPicker" style="display:flex;flex-direction:column;width:100%;box-sizing:border-box;background:var(--rebtel-surface-primary)">
  ${searchBar}
  <div style="display:flex;flex-direction:column">
    ${countries.map(renderRow).join("")}
  </div>
</div>`;

    case "recent":
      return `
<div data-component="countryPicker" style="display:flex;flex-direction:column;width:100%;box-sizing:border-box;background:var(--rebtel-surface-primary)">
  ${searchBar}
  <div style="padding:var(--rebtel-spacing-xs) var(--rebtel-spacing-md)">
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs)">
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-xs-size);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--rebtel-text-tertiary)" data-text-editable>Recent search</span>
    </div>
  </div>
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xs);padding:var(--rebtel-spacing-xs) var(--rebtel-spacing-md)">
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xxs);background:var(--rebtel-surface-primary-light);border-radius:var(--rebtel-radius-xs);padding:var(--rebtel-spacing-xxs) var(--rebtel-spacing-xs);cursor:pointer" data-interactive="button">
      <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);color:var(--rebtel-text-secondary);letter-spacing:var(--rebtel-ls)">Niger</span>
      ${ICON_CLOSE}
    </div>
  </div>
  <div style="padding:var(--rebtel-spacing-sm) var(--rebtel-spacing-md) var(--rebtel-spacing-xs)">
    <span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-xs-size);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--rebtel-text-tertiary)" data-text-editable>All countries</span>
  </div>
  <div style="display:flex;flex-direction:column">
    ${countries.map(renderRow).join("")}
  </div>
</div>`;

    case "alphabetical": {
      const sorted = [...countries].sort((a, b) => a.name.localeCompare(b.name));
      let lastLetter = "";
      const rows = sorted.map(c => {
        const letter = c.name[0].toUpperCase();
        let header = "";
        if (letter !== lastLetter) {
          lastLetter = letter;
          header = `<div style="padding:var(--rebtel-spacing-xxs) var(--rebtel-spacing-md)"><span style="font-family:var(--rebtel-font-body);font-size:var(--rebtel-label-sm-size);font-weight:700;color:var(--rebtel-brand-red);letter-spacing:var(--rebtel-ls)">${letter}</span></div>`;
        }
        return header + renderRow(c);
      }).join("");

      return `
<div data-component="countryPicker" style="display:flex;flex-direction:column;width:100%;box-sizing:border-box;background:var(--rebtel-surface-primary)">
  ${searchBar}
  ${rows}
</div>`;
    }

    default:
      return renderCountryPicker({ ...props, variant: "search" });
  }
}
