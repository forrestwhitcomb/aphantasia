// ============================================================
// Contact Card — ComponentSpec template factory (Figma 3.0 audited)
// ============================================================
// Figma node: 5405:106510 (Card/Calling)
// Variants: calling, topup, compact
// Calling: bg #EDEADD (sand/100), shadow 4px 5px 10px 2px rgba(0,0,0,0.02)
// ============================================================

import type { ComponentSpec } from "../../spec/types";

// ── SVG Icons (Figma audited: 1.5px stroke, 24×24 viewbox) ──

const ICON_CHEVRON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-grey-400)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
const ICON_MORE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.25" fill="var(--rebtel-content-primary)"/><circle cx="12" cy="12" r="1.25" fill="var(--rebtel-content-primary)"/><circle cx="12" cy="19" r="1.25" fill="var(--rebtel-content-primary)"/></svg>`;
const ICON_CALL = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const ICON_SEND = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 12l-4-4v8l4-4z"/></svg>`;
const ICON_USER = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-grey-400)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

// ── Avatar ───────────────────────────────────────────────────

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
      borderRadius: { token: "radius.full" },
      flexShrink: 0,
      overflow: "hidden",
    },
    style: { background: { token: "color.grey-200" } },
    data: { innerHTML: ICON_USER },
  };
}

// ── Badge (Figma: dark semi-transparent pill) ────────────────

function badge(key: string, text: string): ComponentSpec {
  return {
    key,
    tag: "span",
    layout: {
      display: "inline-flex",
      align: "center",
      justify: "center",
      padding: { y: "4px", x: "8px" },
      borderRadius: { token: "radius.md" },
    },
    // Figma: #111111 at 60% opacity
    style: { background: "rgba(17,17,17,0.6)" },
    text: {
      content: text,
      style: "label-xs",
      weight: 400,
      color: "#FFFFFF",
    },
  };
}

// ── Calling Variant (Figma 3.0 audited: 5405:106510) ─────────

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
      gap: { token: "spacing.sm" }, // 12px
      padding: { all: { token: "spacing.sm" } }, // 12px
      borderRadius: { token: "radius.md" }, // 12px
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-calling" }, // #EDEADD
      shadow: { token: "shadow.card" }, // 4px 5px 10px 2px rgba(0,0,0,0.02)
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
            layout: { display: "flex", align: "center", gap: { token: "spacing.xs" } },
            style: {},
            children: [
              badge("badge", "Calling"),
              {
                key: "timestamp",
                tag: "span",
                layout: { display: "inline-flex" },
                style: {},
                text: { content: "10 minutes ago", style: "label-xs", weight: 400, color: { token: "color.content-secondary" } },
              },
            ],
          },
          { key: "more-btn", tag: "div", layout: { display: "inline-flex", width: 24, height: 24 }, style: {}, data: { innerHTML: ICON_MORE } },
        ],
      },
      // Avatar + name
      {
        key: "identity",
        tag: "div",
        layout: { display: "flex", align: "center", gap: { token: "spacing.xs" } },
        style: {},
        children: [
          avatar("avatar"),
          {
            key: "name-col",
            tag: "div",
            layout: { display: "flex", flex: "1", minWidth: 0, align: "center", gap: { token: "spacing.xs" } },
            style: {},
            children: [
              { key: "flag", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: flag, style: "label-md" } },
              {
                key: "name",
                tag: "span",
                layout: { display: "block" },
                style: { textOverflow: "ellipsis", whiteSpace: "nowrap", overflowText: "hidden" },
                text: {
                  content: name,
                  style: "display-xs", // Figma: Pano Regular 16px
                  weight: 400,
                  color: { token: "color.content-primary" },
                  editable: true,
                },
              },
            ],
          },
        ],
      },
      // Info row: minutes left + local time
      {
        key: "info-row",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "space-between" },
        style: {},
        children: [
          {
            key: "minutes-row",
            tag: "div",
            layout: { display: "flex", align: "center", gap: "2px" },
            style: {},
            children: [
              // Green dot
              {
                key: "green-dot",
                tag: "div",
                layout: { display: "block", width: 8, height: 8, borderRadius: { token: "radius.full" }, flexShrink: 0 },
                style: { background: { token: "color.content-success" } },
              },
              {
                key: "minutes",
                tag: "span",
                layout: { display: "inline-flex" },
                style: {},
                text: { content: minutesLeft, style: "paragraph-sm", weight: 400, color: { token: "color.content-secondary" } },
              },
            ],
          },
          {
            key: "time-row",
            tag: "div",
            layout: { display: "flex", align: "center", gap: "4px" },
            style: {},
            children: [
              { key: "time-label", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: "Local time", style: "label-xs", weight: 400, color: { token: "color.content-secondary" } } },
              { key: "time-value", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: localTime, style: "paragraph-sm", weight: 400, color: { token: "color.content-secondary" } } },
            ],
          },
        ],
      },
      // CTA button (Figma: secondary-black, height 40px, radius 24px)
      {
        key: "cta",
        tag: "button",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          gap: "4px",
          width: "100%",
          height: { token: "height.md" }, // 40px
          borderRadius: { token: "radius.xl" }, // 24px
        },
        style: {
          background: { token: "color.button-secondary-black-bg" }, // #111111
          color: { token: "color.content-inverse" },
          cursor: "pointer",
          border: { width: "0", style: "none", color: "transparent" },
        },
        interactive: { type: "button" },
        children: [
          { key: "cta-icon", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_CALL } },
          { key: "cta-label", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: "Call again", style: "paragraph-sm", weight: 400, color: { token: "color.content-inverse" }, editable: true } },
        ],
      },
    ],
  };
}

// ── TopUp Variant ────────────────────────────────────────────

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
      gap: { token: "spacing.sm" },
      padding: { all: { token: "spacing.sm" } },
      borderRadius: { token: "radius.md" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-mtu" }, // #DAE2F4
      shadow: { token: "shadow.card" },
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
            layout: { display: "flex", align: "center", gap: { token: "spacing.xs" } },
            style: {},
            children: [
              badge("badge", "Top-up"),
              { key: "timestamp", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: "10 minutes ago", style: "label-xs", weight: 400, color: { token: "color.content-secondary" } } },
            ],
          },
          { key: "more-btn", tag: "div", layout: { display: "inline-flex", width: 24, height: 24 }, style: {}, data: { innerHTML: ICON_MORE } },
        ],
      },
      // Avatar + name
      {
        key: "identity",
        tag: "div",
        layout: { display: "flex", align: "center", gap: { token: "spacing.xs" } },
        style: {},
        children: [
          avatar("avatar"),
          {
            key: "name-col",
            tag: "div",
            layout: { display: "flex", flex: "1", minWidth: 0, align: "center", gap: { token: "spacing.xs" } },
            style: {},
            children: [
              { key: "flag", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: flag, style: "label-md" } },
              {
                key: "name",
                tag: "span",
                layout: { display: "block" },
                style: { textOverflow: "ellipsis", whiteSpace: "nowrap", overflowText: "hidden" },
                text: { content: name, style: "display-xs", weight: 400, color: { token: "color.content-primary" }, editable: true },
              },
            ],
          },
        ],
      },
      // Amount info
      {
        key: "amount-row",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "space-between" },
        style: {},
        children: [
          {
            key: "sent-col",
            tag: "div",
            layout: { display: "flex", direction: "column" },
            style: {},
            children: [
              { key: "sent-label", tag: "span", layout: { display: "block" }, style: {}, text: { content: "You sent", style: "label-xs", weight: 400, color: { token: "color.content-secondary" } } },
              { key: "sent-amount", tag: "div", layout: { display: "block" }, style: {}, text: { content: amountSent, style: "paragraph-sm", weight: 400, color: { token: "color.content-primary" }, editable: true } },
            ],
          },
          {
            key: "received-col",
            tag: "div",
            layout: { display: "flex", direction: "column" },
            style: {},
            children: [
              { key: "received-label", tag: "span", layout: { display: "block" }, style: {}, text: { content: "They received", style: "label-xs", weight: 400, color: { token: "color.content-secondary" }, align: "right" } },
              { key: "received-amount", tag: "div", layout: { display: "block" }, style: { textOverflow: "ellipsis", whiteSpace: "nowrap", overflowText: "hidden" }, text: { content: theyReceived, style: "paragraph-sm", weight: 400, color: { token: "color.content-primary" }, align: "right", editable: true } },
            ],
          },
        ],
      },
      // Action buttons
      {
        key: "actions",
        tag: "div",
        layout: { display: "flex", gap: { token: "spacing.xs" } },
        style: {},
        children: [
          {
            key: "btn-products",
            tag: "button",
            layout: { display: "flex", flex: "1", align: "center", justify: "center", height: { token: "height.md" }, borderRadius: { token: "radius.xl" } },
            style: { background: { token: "color.surface-raised" }, color: { token: "color.content-primary" }, cursor: "pointer", border: { width: "0", style: "none", color: "transparent" } },
            interactive: { type: "button" },
            text: { content: "Products", style: "paragraph-sm", weight: 400, editable: true },
          },
          {
            key: "btn-send",
            tag: "button",
            layout: { display: "flex", flex: "1", align: "center", justify: "center", gap: "4px", height: { token: "height.md" }, borderRadius: { token: "radius.xl" } },
            style: { background: { token: "color.surface-raised" }, color: { token: "color.content-primary" }, cursor: "pointer", border: { width: "0", style: "none", color: "transparent" } },
            interactive: { type: "button" },
            children: [
              { key: "send-icon", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_SEND } },
              { key: "send-label", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: "Send again", style: "paragraph-sm", weight: 400, editable: true } },
            ],
          },
        ],
      },
    ],
  };
}

// ── Compact Variant ──────────────────────────────────────────

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
      gap: { token: "spacing.xs" },
      padding: { y: { token: "spacing.sm" } },
      height: 44,
      boxSizing: "border-box",
    },
    style: { cursor: "pointer" },
    interactive: { type: "button" },
    data: { component: "contactCard" },
    children: [
      { key: "flag", tag: "span", layout: { display: "inline-flex", flexShrink: 0 }, style: {}, text: { content: flag, style: "label-lg" } },
      { key: "name", tag: "span", layout: { display: "block", flex: "1" }, style: {}, text: { content: name, style: "paragraph-md", weight: 400, color: { token: "color.content-primary" }, editable: true } },
      { key: "count", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: `${contactCount} contacts here`, style: "paragraph-sm", color: { token: "color.content-secondary" } } },
      { key: "chevron", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_CHEVRON } },
    ],
  };
}

// ── Template Factory ─────────────────────────────────────────

export function contactCardTemplate(props?: Record<string, unknown>): ComponentSpec {
  const variant = (props?.variant as string) ?? "calling";
  const p = props ?? {};

  switch (variant) {
    case "topup":
      return topupCard(p);
    case "compact":
      return compactCard(p);
    case "calling":
    default:
      return callingCard(p);
  }
}
