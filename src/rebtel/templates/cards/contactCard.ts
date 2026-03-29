// ============================================================
// Contact Card — Pixel-perfect from Figma 3.0
// ============================================================
// Figma node: 5405:106510 (Card/Calling)
// Variants: calling, calling-topup, contact-topup
// Font: KH Teka Regular (400), KH Teka Bold (700)
// Display font: Pano (700) for name text
// Letter-spacing: 0.02em everywhere
// ============================================================

import type { ComponentSpec } from "../../spec/types";

// ── SVG Icons (Figma: 1.5px stroke, 24×24 viewbox) ──

const ICON_CHEVRON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B9B9BE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
const ICON_MORE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.25" fill="#111111"/><circle cx="12" cy="12" r="1.25" fill="#111111"/><circle cx="12" cy="19" r="1.25" fill="#111111"/></svg>`;
const ICON_CALL = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const ICON_SEND = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 12l-4-4v8l4-4z"/></svg>`;
const ICON_USER = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B9B9BE" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

// ── Avatar (32×32 circle, grey-200 bg) ──

function avatar(key: string): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      width: 32,
      height: 32,
      borderRadius: "50%",
      flexShrink: 0,
      overflow: "hidden",
    },
    style: { background: "#F3F3F3" },
    data: { innerHTML: ICON_USER },
  };
}

// ── Badge (Figma: #111111 at 60% opacity, white text 11px, radius 4px, padding 4px 8px) ──

function badge(key: string, text: string): ComponentSpec {
  return {
    key,
    tag: "span",
    layout: {
      display: "inline-flex",
      align: "center",
      justify: "center",
      padding: { y: "4px", x: "8px" },
      borderRadius: "4px",
    },
    style: {
      background: "rgba(17,17,17,0.6)",
      fontFamily: "'KH Teka'",
      fontSize: "11px",
      letterSpacing: "0.02em",
      lineHeight: "11px",
    },
    text: {
      content: text,
      style: "label-xs",
      weight: 400,
      color: "#FFFFFF",
    },
  };
}

// ── Calling Variant (Figma: 5405:106510) ──
// Sand bg (#EDEADD), radius 12px, padding 12px, shadow, vertical flex, gap 12px

function callingCard(props: Record<string, unknown>): ComponentSpec {
  const name = (props.name as string) ?? (props.label as string) ?? "Emil Lee Ann Bergst...";
  const flag = (props.flag as string) ?? "\u{1F1F3}\u{1F1EC}";
  const minutesLeft = (props.minutesLeft as string) ?? "340 minutes left";
  const localTime = (props.localTime as string) ?? "2:30 PM";

  return {
    key: "contact-card",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: "12px",
      padding: { all: "12px" },
      borderRadius: "12px",
      boxSizing: "border-box",
    },
    style: {
      background: "#EDEADD",
      shadow: "4px 5px 10px 2px rgba(0,0,0,0.02)",
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    data: { component: "contactCard" },
    children: [
      // Header: badge + timestamp + more icon
      {
        key: "header",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "space-between" },
        style: {},
        children: [
          {
            key: "header-left",
            tag: "div",
            layout: { display: "flex", align: "center", gap: "8px" },
            style: {},
            children: [
              badge("badge", "Calling"),
              {
                key: "timestamp",
                tag: "span",
                layout: { display: "inline-flex" },
                style: { letterSpacing: "0.02em", lineHeight: "11px" },
                text: { content: "10 minutes ago", style: "label-xs", weight: 400, color: "#737378" },
              },
            ],
          },
          {
            key: "more-btn",
            tag: "div",
            layout: { display: "inline-flex", width: 24, height: 24, flexShrink: 0 },
            style: {},
            data: { innerHTML: ICON_MORE },
          },
        ],
      },
      // Identity: avatar + flag + name (KH Teka 16px weight 700)
      {
        key: "identity",
        tag: "div",
        layout: { display: "flex", align: "center", gap: "8px" },
        style: {},
        children: [
          avatar("avatar"),
          {
            key: "name-col",
            tag: "div",
            layout: { display: "flex", flex: "1", minWidth: 0, align: "center", gap: "8px" },
            style: {},
            children: [
              {
                key: "flag",
                tag: "span",
                layout: { display: "inline-flex" },
                style: { fontSize: "16px", lineHeight: "16px" },
                text: { content: flag, style: "label-md" },
              },
              {
                key: "name",
                tag: "span",
                layout: { display: "block" },
                style: {
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflowText: "hidden",
                  fontSize: "16px",
                  fontFamily: "'KH Teka'",
                  letterSpacing: "0.02em",
                  lineHeight: "20px",
                },
                text: {
                  content: name,
                  style: "paragraph-md",
                  weight: 700,
                  color: "#111111",
                  editable: true,
                },
              },
            ],
          },
        ],
      },
      // Info row: green dot + minutes left | local time
      {
        key: "info-row",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "space-between" },
        style: {},
        children: [
          {
            key: "minutes-row",
            tag: "div",
            layout: { display: "flex", align: "center", gap: "4px" },
            style: {},
            children: [
              {
                key: "green-dot",
                tag: "div",
                layout: { display: "block", width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
                style: { background: "#09BC09" },
              },
              {
                key: "minutes",
                tag: "span",
                layout: { display: "inline-flex" },
                style: { letterSpacing: "0.02em", lineHeight: "18px" },
                text: { content: minutesLeft, style: "paragraph-sm", weight: 400, color: "#737378" },
              },
            ],
          },
          {
            key: "time-row",
            tag: "div",
            layout: { display: "flex", align: "center", gap: "4px" },
            style: {},
            children: [
              {
                key: "time-label",
                tag: "span",
                layout: { display: "inline-flex" },
                style: { letterSpacing: "0.02em", lineHeight: "11px" },
                text: { content: "Local time", style: "label-xs", weight: 400, color: "#737378" },
              },
              {
                key: "time-value",
                tag: "span",
                layout: { display: "inline-flex" },
                style: { letterSpacing: "0.02em", lineHeight: "18px" },
                text: { content: localTime, style: "paragraph-sm", weight: 400, color: "#737378" },
              },
            ],
          },
        ],
      },
      // CTA: full width, height 40px, radius 24px, black bg, white text
      {
        key: "cta",
        tag: "button",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          gap: "4px",
          width: "100%",
          height: 40,
          borderRadius: "24px",
          boxSizing: "border-box",
        },
        style: {
          background: "#111111",
          color: "#FFFFFF",
          cursor: "pointer",
          border: { width: "0", style: "none", color: "transparent" },
          fontFamily: "'KH Teka'",
          fontSize: "14px",
          letterSpacing: "0.02em",
          lineHeight: "14px",
        },
        interactive: { type: "button" },
        children: [
          {
            key: "cta-icon",
            tag: "div",
            layout: { display: "inline-flex", width: 16, height: 16 },
            style: {},
            data: { innerHTML: ICON_CALL },
          },
          {
            key: "cta-label",
            tag: "span",
            layout: { display: "inline-flex" },
            style: { letterSpacing: "0.02em", lineHeight: "14px" },
            text: { content: "Call", style: "paragraph-sm", weight: 400, color: "#FFFFFF", editable: true },
          },
        ],
      },
    ],
  };
}

// ── Top-up Variant (cornflower bg #DAE2F4, same structure) ──

function topupCard(props: Record<string, unknown>): ComponentSpec {
  const name = (props.name as string) ?? (props.label as string) ?? "Emil Lee Ann Bergst...";
  const flag = (props.flag as string) ?? "\u{1F1F3}\u{1F1EC}";
  const amountSent = (props.amountSent as string) ?? "UGX 10499";
  const theyReceived = (props.theyReceived as string) ?? "Monthly Youtube & Soc...";

  return {
    key: "contact-card",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: "12px",
      padding: { all: "12px" },
      borderRadius: "12px",
      boxSizing: "border-box",
    },
    style: {
      background: "#DAE2F4",
      shadow: "4px 5px 10px 2px rgba(0,0,0,0.02)",
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    data: { component: "contactCard" },
    children: [
      // Header
      {
        key: "header",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "space-between" },
        style: {},
        children: [
          {
            key: "header-left",
            tag: "div",
            layout: { display: "flex", align: "center", gap: "8px" },
            style: {},
            children: [
              badge("badge", "Top-up"),
              {
                key: "timestamp",
                tag: "span",
                layout: { display: "inline-flex" },
                style: { letterSpacing: "0.02em", lineHeight: "11px" },
                text: { content: "10 minutes ago", style: "label-xs", weight: 400, color: "#737378" },
              },
            ],
          },
          {
            key: "more-btn",
            tag: "div",
            layout: { display: "inline-flex", width: 24, height: 24, flexShrink: 0 },
            style: {},
            data: { innerHTML: ICON_MORE },
          },
        ],
      },
      // Identity: avatar + flag + name
      {
        key: "identity",
        tag: "div",
        layout: { display: "flex", align: "center", gap: "8px" },
        style: {},
        children: [
          avatar("avatar"),
          {
            key: "name-col",
            tag: "div",
            layout: { display: "flex", flex: "1", minWidth: 0, align: "center", gap: "8px" },
            style: {},
            children: [
              {
                key: "flag",
                tag: "span",
                layout: { display: "inline-flex" },
                style: { fontSize: "16px", lineHeight: "16px" },
                text: { content: flag, style: "label-md" },
              },
              {
                key: "name",
                tag: "span",
                layout: { display: "block" },
                style: {
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflowText: "hidden",
                  fontSize: "16px",
                  fontFamily: "'KH Teka'",
                  letterSpacing: "0.02em",
                  lineHeight: "20px",
                },
                text: { content: name, style: "paragraph-md", weight: 700, color: "#111111", editable: true },
              },
            ],
          },
        ],
      },
      // Amount info row
      {
        key: "amount-row",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "space-between" },
        style: {},
        children: [
          {
            key: "sent-col",
            tag: "div",
            layout: { display: "flex", direction: "column", gap: "2px" },
            style: {},
            children: [
              {
                key: "sent-label",
                tag: "span",
                layout: { display: "block" },
                style: { letterSpacing: "0.02em", lineHeight: "11px" },
                text: { content: "You sent", style: "label-xs", weight: 400, color: "#737378" },
              },
              {
                key: "sent-amount",
                tag: "div",
                layout: { display: "block" },
                style: { letterSpacing: "0.02em", lineHeight: "18px" },
                text: { content: amountSent, style: "paragraph-sm", weight: 400, color: "#111111", editable: true },
              },
            ],
          },
          {
            key: "received-col",
            tag: "div",
            layout: { display: "flex", direction: "column", align: "end", gap: "2px" },
            style: {},
            children: [
              {
                key: "received-label",
                tag: "span",
                layout: { display: "block" },
                style: { letterSpacing: "0.02em", lineHeight: "11px", textAlign: "right" },
                text: { content: "They received", style: "label-xs", weight: 400, color: "#737378", align: "right" },
              },
              {
                key: "received-amount",
                tag: "div",
                layout: { display: "block" },
                style: {
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflowText: "hidden",
                  letterSpacing: "0.02em",
                  lineHeight: "18px",
                  textAlign: "right",
                },
                text: { content: theyReceived, style: "paragraph-sm", weight: 400, color: "#111111", align: "right", editable: true },
              },
            ],
          },
        ],
      },
      // Action buttons row
      {
        key: "actions",
        tag: "div",
        layout: { display: "flex", gap: "8px" },
        style: {},
        children: [
          {
            key: "btn-products",
            tag: "button",
            layout: {
              display: "flex",
              flex: "1",
              align: "center",
              justify: "center",
              height: 40,
              borderRadius: "24px",
              boxSizing: "border-box",
            },
            style: {
              background: "#FFFFFF",
              color: "#111111",
              cursor: "pointer",
              border: { width: "0", style: "none", color: "transparent" },
              fontFamily: "'KH Teka'",
              fontSize: "14px",
              letterSpacing: "0.02em",
              lineHeight: "14px",
            },
            interactive: { type: "button" },
            text: { content: "Products", style: "paragraph-sm", weight: 400, editable: true },
          },
          {
            key: "btn-send",
            tag: "button",
            layout: {
              display: "flex",
              flex: "1",
              align: "center",
              justify: "center",
              gap: "4px",
              height: 40,
              borderRadius: "24px",
              boxSizing: "border-box",
            },
            style: {
              background: "#FFFFFF",
              color: "#111111",
              cursor: "pointer",
              border: { width: "0", style: "none", color: "transparent" },
              fontFamily: "'KH Teka'",
              fontSize: "14px",
              letterSpacing: "0.02em",
              lineHeight: "14px",
            },
            interactive: { type: "button" },
            children: [
              {
                key: "send-icon",
                tag: "div",
                layout: { display: "inline-flex", width: 14, height: 14 },
                style: {},
                data: { innerHTML: ICON_SEND },
              },
              {
                key: "send-label",
                tag: "span",
                layout: { display: "inline-flex" },
                style: { letterSpacing: "0.02em", lineHeight: "14px" },
                text: { content: "Send again", style: "paragraph-sm", weight: 400, editable: true },
              },
            ],
          },
        ],
      },
    ],
  };
}

// ── Compact Variant ──

function compactCard(props: Record<string, unknown>): ComponentSpec {
  const name = (props.name as string) ?? (props.label as string) ?? "Emil Lee Ann Bergst...";
  const flag = (props.flag as string) ?? "\u{1F1F3}\u{1F1EC}";
  const contactCount = (props.contactCount as string) ?? "646";

  return {
    key: "contact-card",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      gap: "8px",
      padding: { y: "12px" },
      height: 44,
      boxSizing: "border-box",
    },
    style: {
      cursor: "pointer",
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
    },
    interactive: { type: "button" },
    data: { component: "contactCard" },
    children: [
      {
        key: "flag",
        tag: "span",
        layout: { display: "inline-flex", flexShrink: 0 },
        style: { fontSize: "18px", lineHeight: "18px" },
        text: { content: flag, style: "label-lg" },
      },
      {
        key: "name",
        tag: "span",
        layout: { display: "block", flex: "1" },
        style: { letterSpacing: "0.02em", lineHeight: "20px" },
        text: { content: name, style: "paragraph-md", weight: 400, color: "#111111", editable: true },
      },
      {
        key: "count",
        tag: "span",
        layout: { display: "inline-flex" },
        style: { letterSpacing: "0.02em", lineHeight: "18px" },
        text: { content: `${contactCount} contacts here`, style: "paragraph-sm", color: "#737378" },
      },
      {
        key: "chevron",
        tag: "div",
        layout: { display: "inline-flex", width: 16, height: 16 },
        style: {},
        data: { innerHTML: ICON_CHEVRON },
      },
    ],
  };
}

// ── Template Factory ──

export function contactCardTemplate(props?: Record<string, unknown>): ComponentSpec {
  const variant = (props?.variant as string) ?? "calling";
  const p = props ?? {};

  switch (variant) {
    case "calling-topup":
    case "topup":
      return topupCard(p);
    case "contact-topup":
    case "compact":
      return compactCard(p);
    case "calling":
    default:
      return callingCard(p);
  }
}
