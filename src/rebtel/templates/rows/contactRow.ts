// ============================================================
// Contact Row — Pixel-perfect from Figma 3.0
// ============================================================
// Container: width 100%, height 72px, flex row, align center,
//   padding 12px 16px, gap 12px
// Avatar: 48x48 circle, #F3F3F3 bg, user icon
// Info column: flex column, gap 2px
//   Name: KH Teka 16px, #111111
//   Phone: KH Teka 14px, #737378
// Action: chevron icon 24x24
// ============================================================

import type { ComponentSpec } from "../../spec/types";

const ICON_USER = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B9B9BE" stroke-width="1.5" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const ICON_CHEVRON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B9B9BE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

export function contactRowTemplate(props?: Record<string, unknown>): ComponentSpec {
  const name = (props?.name as string) ?? (props?.label as string) ?? "Leslie Alexander";
  const phone = (props?.phone as string) ?? "+234 787 332 454";
  const avatarSvg = (props?.avatarSvg as string) ?? ICON_USER;

  return {
    key: "contact-row",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      gap: { token: "spacing.sm" },
      width: "100%",
      height: 72,
      padding: { top: { token: "spacing.sm" }, bottom: { token: "spacing.sm" }, left: { token: "spacing.md" }, right: { token: "spacing.md" } },
      boxSizing: "border-box",
    },
    style: {
      cursor: "pointer",
      fontFamily: "'KH Teka'",
    },
    interactive: { type: "button" },
    data: { component: "contactRow" },
    children: [
      // Avatar: 48x48 circle, grey-200 bg
      {
        key: "avatar",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          width: 48,
          height: 48,
          borderRadius: "50%",
          flexShrink: 0,
          overflow: "hidden",
        },
        style: { background: { token: "color.surface-neutral" } },
        data: { innerHTML: avatarSvg },
      },
      // Info column: name + phone
      {
        key: "info",
        tag: "div",
        layout: {
          display: "flex",
          direction: "column",
          flex: "1",
          minWidth: 0,
          gap: "2px",
        },
        style: {},
        children: [
          // Name: KH Teka 16px, #111111
          {
            key: "name",
            tag: "span",
            layout: { display: "block" },
            style: {
              fontFamily: "'KH Teka'",
              fontSize: 16,
              letterSpacing: "0.02em",
              lineHeight: "22px",
            },
            text: {
              content: name,
              style: "paragraph-md",
              weight: 400,
              color: { token: "color.text-primary" },
              editable: true,
            },
          },
          // Phone: KH Teka 14px, #737378
          {
            key: "phone",
            tag: "span",
            layout: { display: "block" },
            style: {
              fontFamily: "'KH Teka'",
              fontSize: 14,
              letterSpacing: "0.02em",
              lineHeight: "18px",
            },
            text: {
              content: phone,
              style: "paragraph-sm",
              weight: 400,
              color: { token: "color.text-secondary" },
              editable: true,
            },
          },
        ],
      },
      // Chevron: 24x24
      {
        key: "chevron",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          width: 24,
          height: 24,
          flexShrink: 0,
        },
        style: {},
        data: { innerHTML: ICON_CHEVRON },
      },
    ],
  };
}
