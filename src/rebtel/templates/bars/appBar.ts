// ============================================================
// App Bar — Pixel-perfect from Figma 3.0
// ============================================================
// Container: width 100%, height 48px, flex row, align center,
// justify space-between, padding 0 16px
// Back icon 24x24 left, title center (KH Teka 16px/400, #111111),
// action icon right. Background: white or transparent.
// ============================================================

import type { ComponentSpec } from "../../spec/types";

// ── SVG Icons (24x24, stroke #111111, 1.5px) ────────────────

const ICON_BACK = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const ICON_CLOSE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ICON_SETTINGS = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
const ICON_SEARCH = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#737378" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

// ── Icon button helper (24x24) ──────────────────────────────

function iconButton(key: string, svgHtml: string): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      width: 24,
      height: 24,
      flexShrink: 0,
    },
    style: { cursor: "pointer" },
    interactive: { type: "button" },
    data: { innerHTML: svgHtml },
  };
}

// Invisible 24x24 spacer to balance layout
function spacer(key: string): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: { display: "block", width: 24, height: 24, flexShrink: 0 },
    style: {},
  };
}

// ── Template Factory ─────────────────────────────────────────

export function appBarTemplate(props?: Record<string, unknown>): ComponentSpec {
  const variant = (props?.variant as string) ?? "back";
  const title = (props?.title as string) ?? (props?.label as string) ?? "Mobile Top-up";
  const bg = (props?.background as string) ?? "transparent";

  const navChildren: ComponentSpec[] = [];

  switch (variant) {
    case "home":
      // Home variant: centered brand title, no icons
      navChildren.push(
        spacer("nav-spacer-left"),
        {
          key: "nav-title",
          tag: "span",
          layout: { display: "block", flex: "1" },
          style: { textAlign: "center", fontFamily: "'Pano'", letterSpacing: "0.02em", lineHeight: "20px" },
          text: {
            content: "Rebtel",
            style: "display-xs",
            weight: 700,
            color: { token: "color.brand-red" },
            align: "center",
            editable: true,
          },
        },
        spacer("nav-spacer-right"),
      );
      break;

    case "back":
      // Back variant: back icon | centered title | action icon
      navChildren.push(
        iconButton("nav-back", ICON_BACK),
        {
          key: "nav-title",
          tag: "span",
          layout: { display: "block", flex: "1" },
          style: { textAlign: "center", fontFamily: "'KH Teka'", letterSpacing: "0.02em", lineHeight: "20px" },
          text: {
            content: title,
            style: "label-lg",
            weight: 400,
            color: { token: "color.text-primary" },
            align: "center",
            editable: true,
          },
        },
        iconButton("nav-action", ICON_SETTINGS),
      );
      break;

    case "close":
      // Close variant: close icon | centered title | spacer
      navChildren.push(
        iconButton("nav-close", ICON_CLOSE),
        {
          key: "nav-title",
          tag: "span",
          layout: { display: "block", flex: "1" },
          style: { textAlign: "center", fontFamily: "'KH Teka'", letterSpacing: "0.02em", lineHeight: "20px" },
          text: {
            content: title,
            style: "label-lg",
            weight: 400,
            color: { token: "color.text-primary" },
            align: "center",
            editable: true,
          },
        },
        spacer("nav-spacer"),
      );
      break;

    case "search":
      // Search variant: back icon | search field
      navChildren.push(
        iconButton("nav-back", ICON_BACK),
        {
          key: "search-field",
          tag: "div",
          layout: {
            display: "flex",
            flex: "1",
            align: "center",
            gap: { token: "spacing.xs" },
            height: 36,
            padding: { x: { token: "spacing.sm" } },
            borderRadius: "32px",
            boxSizing: "border-box",
          },
          style: { background: { token: "color.surface-neutral" } },
          interactive: { type: "input" },
          children: [
            {
              key: "search-icon",
              tag: "div",
              layout: { display: "flex", align: "center", justify: "center", width: 24, height: 24, flexShrink: 0 },
              style: {},
              data: { innerHTML: ICON_SEARCH },
            },
            {
              key: "search-placeholder",
              tag: "span",
              layout: { display: "inline-flex" },
              style: { fontFamily: "'KH Teka'", letterSpacing: "0.02em", lineHeight: "16px" },
              text: {
                content: "Search contacts, countries...",
                style: "paragraph-sm",
                weight: 400,
                color: { token: "color.text-secondary" },
                editable: true,
              },
            },
          ],
        },
      );
      break;
  }

  return {
    key: "app-bar",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      width: "100%",
      boxSizing: "border-box",
    },
    style: {
      background: bg,
      fontFamily: "'KH Teka'",
    },
    data: { component: "appBar" },
    children: [
      // Nav row: 48px height, horizontal flex, centered, padding 0 16px
      {
        key: "nav-row",
        tag: "nav",
        layout: {
          display: "flex",
          align: "center",
          justify: "space-between",
          height: 48,
          width: "100%",
          padding: { left: { token: "spacing.md" }, right: { token: "spacing.md" } },
          boxSizing: "border-box",
          gap: variant === "search" ? { token: "spacing.xs" } : undefined,
        },
        style: {},
        children: navChildren,
      },
    ],
  };
}
