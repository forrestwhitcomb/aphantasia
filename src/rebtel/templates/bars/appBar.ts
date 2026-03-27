// ============================================================
// App Bar — ComponentSpec template factory
// ============================================================
// Ported from components/navigation/AppBar.ts
// Variants: home, back, close, search
// ============================================================

import type { ComponentSpec } from "../../spec/types";

// ── SVG Icons (identical to legacy renderers) ────────────────

const ICON_BACK = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-default)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const ICON_CLOSE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-default)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ICON_SETTINGS = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-default)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>`;
const ICON_SEARCH = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
const ICON_SIGNAL = `<svg width="16" height="12" viewBox="0 0 16 12" fill="var(--rebtel-icon-default)"><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/><rect x="9" y="1" width="3" height="11" rx="1"/><rect x="13" y="0" width="3" height="12" rx="1"/></svg>`;
const ICON_WIFI = `<svg width="16" height="12" viewBox="0 0 16 12" fill="var(--rebtel-icon-default)"><path d="M8 3C5.8 3 3.8 3.8 2.3 5.2L0.5 3.4C2.5 1.5 5.1 0.3 8 0.3c2.9 0 5.5 1.2 7.5 3.1L13.7 5.2C12.2 3.8 10.2 3 8 3zM8 6.5c-1.5 0-2.8 0.6-3.8 1.5L2.5 6.2C4 4.8 5.9 4 8 4s4 0.8 5.5 2.2L11.8 8C10.8 7.1 9.5 6.5 8 6.5zM8 10c-0.7 0-1.3 0.3-1.8 0.7L8 12.8l1.8-2.1C9.3 10.3 8.7 10 8 10z"/></svg>`;
const ICON_BATTERY = `<svg width="25" height="12" viewBox="0 0 25 12" fill="var(--rebtel-icon-default)"><rect x="0" y="1" width="21" height="10" rx="2" fill="none" stroke="var(--rebtel-icon-default)" stroke-width="1"/><rect x="22" y="4" width="2" height="4" rx="0.5"/><rect x="1.5" y="2.5" width="16" height="7" rx="1"/></svg>`;

// ── Status Bar Sub-spec ──────────────────────────────────────

function statusBar(): ComponentSpec {
  return {
    key: "status-bar",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "space-between",
      height: { token: "height.xs" },
      padding: { x: { token: "spacing.md" } },
      boxSizing: "border-box",
    },
    style: {},
    children: [
      {
        key: "sb-time",
        tag: "span",
        layout: { display: "inline-flex" },
        style: {},
        text: {
          content: "9:41",
          style: "label-sm",
          weight: 600,
          color: { token: "color.text-primary" },
        },
      },
      {
        key: "sb-icons",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          gap: { token: "spacing.xxs" },
        },
        style: {},
        children: [
          { key: "sb-signal", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_SIGNAL } },
          { key: "sb-wifi", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_WIFI } },
          { key: "sb-battery", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_BATTERY } },
        ],
      },
    ],
  };
}

// ── Icon Button Helper ───────────────────────────────────────

function iconButton(key: string, svgHtml: string, size: string = "height.md"): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      width: { token: size },
      height: { token: size },
      flexShrink: 0,
    },
    style: { cursor: "pointer" },
    interactive: { type: "button" },
    data: { innerHTML: svgHtml },
  };
}

// ── Spacer (matches icon button width for centering) ─────────

function spacer(key: string, size: string = "height.md"): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: { display: "block", width: { token: size } },
    style: {},
  };
}

// ── Template Factory ─────────────────────────────────────────

export function appBarTemplate(props?: Record<string, unknown>): ComponentSpec {
  const variant = (props?.variant as string) ?? "back";
  const title = (props?.title as string) ?? (props?.label as string) ?? "Section header";

  const navChildren: ComponentSpec[] = [];

  switch (variant) {
    case "home":
      navChildren.push({
        key: "nav-title",
        tag: "span",
        layout: { display: "inline-flex" },
        style: {},
        text: {
          content: "Rebtel",
          style: "display-xs",
          weight: 700,
          color: { token: "color.brand-red" },
          align: "center",
          editable: true,
        },
      });
      break;

    case "back":
      navChildren.push(
        iconButton("nav-back", ICON_BACK),
        {
          key: "nav-title",
          tag: "span",
          layout: { display: "block", flex: "1" },
          style: {},
          text: {
            content: title,
            style: "headline-xs",
            weight: 600,
            color: { token: "color.text-primary" },
            align: "center",
            editable: true,
          },
        },
        iconButton("nav-action", ICON_SETTINGS),
      );
      break;

    case "close":
      navChildren.push(
        iconButton("nav-close", ICON_CLOSE),
        {
          key: "nav-title",
          tag: "span",
          layout: { display: "block", flex: "1" },
          style: {},
          text: {
            content: title,
            style: "headline-xs",
            weight: 600,
            color: { token: "color.text-primary" },
            align: "center",
            editable: true,
          },
        },
        spacer("nav-spacer"),
      );
      break;

    case "search":
      navChildren.push(
        iconButton("nav-back", ICON_BACK, "height.sm"),
        {
          key: "search-field",
          tag: "div",
          layout: {
            display: "flex",
            flex: "1",
            align: "center",
            gap: { token: "spacing.xs" },
            height: { token: "height.sm" },
            padding: { x: { token: "spacing.sm" } },
            borderRadius: { token: "radius.full" },
          },
          style: { background: { token: "color.surface-light" } },
          interactive: { type: "input" },
          children: [
            { key: "search-icon", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_SEARCH } },
            {
              key: "search-placeholder",
              tag: "span",
              layout: { display: "inline-flex" },
              style: {},
              text: {
                content: "Search contacts, countries...",
                style: "paragraph-sm",
                color: { token: "color.text-tertiary" },
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
    style: { background: { token: "color.surface-primary" } },
    data: { component: "appBar" },
    children: [
      statusBar(),
      {
        key: "nav-row",
        tag: "nav",
        layout: {
          display: "flex",
          align: "center",
          justify: variant === "home" ? "center" : undefined,
          gap: variant === "search" ? { token: "spacing.xs" } : undefined,
          height: { token: "height.xl" },
          width: "100%",
          padding: {
            x: variant === "search" || variant === "home"
              ? { token: "spacing.md" }
              : { token: "spacing.xs" },
          },
          boxSizing: "border-box",
          position: "relative",
        },
        style: {},
        children: navChildren,
      },
    ],
  };
}
