// ============================================================
// Contact Card — ComponentSpec template factory
// ============================================================
// Ported from components/content/ContactCard.ts (113 LOC)
// Variants: calling, topup, compact
// Most complex card — validates the ComponentSpec model.
// ============================================================

import type { ComponentSpec } from "../../spec/types";

// ── SVG Icons ────────────────────────────────────────────────

const ICON_CHEVRON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-grey-400)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
const ICON_MORE = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>`;
const ICON_CALL = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const ICON_SEND = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 12l-4-4v8l4-4z"/></svg>`;
const ICON_USER = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-grey-400)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

// ── Avatar Helper ────────────────────────────────────────────

function avatar(key: string): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      width: 40,
      height: 40,
      borderRadius: { token: "radius.full" },
      flexShrink: 0,
      overflow: "hidden",
    },
    style: { background: { token: "color.grey-100" } },
    data: { innerHTML: ICON_USER },
  };
}

// ── Badge Helper ─────────────────────────────────────────────

function badge(key: string, text: string, bg: string, textColor: string): ComponentSpec {
  return {
    key,
    tag: "span",
    layout: {
      display: "inline-flex",
      align: "center",
      padding: { y: "3px", x: "8px" },
      borderRadius: { token: "radius.full" },
    },
    style: { background: bg },
    text: {
      content: text,
      style: "label-xs",
      weight: 600,
      color: textColor,
    },
  };
}

// ── Calling Variant ──────────────────────────────────────────

function callingCard(props: Record<string, unknown>): ComponentSpec {
  const name = (props.name as string) ?? (props.label as string) ?? "Emil Lee Ann Bergst...";
  const flag = (props.flag as string) ?? "\u{1F1F3}\u{1F1EC}";
  const minutesLeft = (props.minutesLeft as string) ?? "340 minutes left";
  const localTime = (props.localTime as string) ?? "Local time 2:30 PM";

  return {
    key: "contact-card",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      gap: { token: "spacing.sm" },
      padding: { all: { token: "spacing.md" } },
      borderRadius: { token: "radius.lg" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-secondary" } },
      shadow: { token: "shadow.card" },
    },
    data: { component: "contactCard" },
    children: [
      // Header row: badge + timestamp + more icon
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
              badge("badge", "Calling", "#34C759", "#FFFFFF"),
              {
                key: "timestamp",
                tag: "span",
                layout: { display: "inline-flex" },
                style: {},
                text: { content: "10 minutes ago", style: "paragraph-xs", color: { token: "color.text-tertiary" } },
              },
            ],
          },
          { key: "more-btn", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_MORE } },
        ],
      },
      // Avatar + name row
      {
        key: "identity",
        tag: "div",
        layout: { display: "flex", align: "center", gap: { token: "spacing.sm" } },
        style: {},
        children: [
          avatar("avatar"),
          {
            key: "name-col",
            tag: "div",
            layout: { display: "flex", flex: "1", minWidth: 0, align: "center", gap: { token: "spacing.xs" } },
            style: {},
            children: [
              {
                key: "flag",
                tag: "span",
                layout: { display: "inline-flex" },
                style: {},
                text: { content: flag, style: "label-md" },
              },
              {
                key: "name",
                tag: "span",
                layout: { display: "block" },
                style: { textOverflow: "ellipsis", whiteSpace: "nowrap", overflowText: "hidden" },
                text: {
                  content: name,
                  style: "headline-xs",
                  weight: 700,
                  color: { token: "color.text-primary" },
                  editable: true,
                },
              },
            ],
          },
        ],
      },
      // Info row: minutes + local time
      {
        key: "info-row",
        tag: "div",
        layout: { display: "flex", align: "center", justify: "space-between" },
        style: {},
        children: [
          {
            key: "minutes",
            tag: "span",
            layout: { display: "inline-flex" },
            style: {},
            text: { content: `\u25CF${minutesLeft}`, style: "paragraph-xs", color: { token: "color.success" } },
          },
          {
            key: "local-time",
            tag: "span",
            layout: { display: "inline-flex" },
            style: {},
            text: { content: localTime, style: "paragraph-xs", color: { token: "color.text-tertiary" } },
          },
        ],
      },
      // CTA button
      {
        key: "cta",
        tag: "button",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          gap: { token: "spacing.xs" },
          width: "100%",
          height: { token: "height.md" },
          borderRadius: { token: "radius.full" },
        },
        style: {
          background: { token: "color.grey-900" },
          color: { token: "color.brand-white" },
          cursor: "pointer",
          border: { width: "0", style: "none", color: "transparent" },
        },
        interactive: { type: "button" },
        children: [
          { key: "cta-icon", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_CALL } },
          {
            key: "cta-label",
            tag: "span",
            layout: { display: "inline-flex" },
            style: {},
            text: { content: "Call again", style: "paragraph-sm", weight: 600, editable: true },
          },
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
      padding: { all: { token: "spacing.md" } },
      borderRadius: { token: "radius.lg" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: { width: "1px", style: "solid", color: { token: "color.border-secondary" } },
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
              badge("badge", "Top-up", "var(--rebtel-grey-100)", "var(--rebtel-text-secondary)"),
              {
                key: "timestamp",
                tag: "span",
                layout: { display: "inline-flex" },
                style: {},
                text: { content: "10 minutes ago", style: "paragraph-xs", color: { token: "color.text-tertiary" } },
              },
            ],
          },
          { key: "more-btn", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_MORE } },
        ],
      },
      // Avatar + name
      {
        key: "identity",
        tag: "div",
        layout: { display: "flex", align: "center", gap: { token: "spacing.sm" } },
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
                text: { content: name, style: "headline-xs", weight: 700, color: { token: "color.text-primary" }, editable: true },
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
              { key: "sent-label", tag: "span", layout: { display: "block" }, style: {}, text: { content: "You sent", style: "paragraph-xs", color: { token: "color.text-tertiary" } } },
              { key: "sent-amount", tag: "div", layout: { display: "block" }, style: {}, text: { content: amountSent, style: "paragraph-sm", weight: 600, color: { token: "color.text-primary" }, editable: true } },
            ],
          },
          {
            key: "received-col",
            tag: "div",
            layout: { display: "flex", direction: "column" },
            style: {},
            children: [
              { key: "received-label", tag: "span", layout: { display: "block" }, style: {}, text: { content: "They received", style: "paragraph-xs", color: { token: "color.text-tertiary" }, align: "right" } },
              {
                key: "received-amount",
                tag: "div",
                layout: { display: "block" },
                style: { textOverflow: "ellipsis", whiteSpace: "nowrap", overflowText: "hidden" },
                text: { content: theyReceived, style: "paragraph-sm", weight: 600, color: { token: "color.text-primary" }, align: "right", editable: true },
              },
            ],
          },
        ],
      },
      // Action buttons row
      {
        key: "actions",
        tag: "div",
        layout: { display: "flex", gap: { token: "spacing.xs" } },
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
              height: { token: "height.md" },
              borderRadius: { token: "radius.full" },
            },
            style: {
              background: { token: "color.surface-primary" },
              color: { token: "color.text-primary" },
              cursor: "pointer",
              border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
            },
            interactive: { type: "button" },
            text: { content: "Products", style: "paragraph-sm", weight: 500, editable: true },
          },
          {
            key: "btn-send",
            tag: "button",
            layout: {
              display: "flex",
              flex: "1",
              align: "center",
              justify: "center",
              gap: { token: "spacing.xxs" },
              height: { token: "height.md" },
              borderRadius: { token: "radius.full" },
            },
            style: {
              background: { token: "color.surface-primary" },
              color: { token: "color.text-primary" },
              cursor: "pointer",
              border: { width: "1px", style: "solid", color: { token: "color.border-default" } },
            },
            interactive: { type: "button" },
            children: [
              { key: "send-icon", tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: ICON_SEND } },
              { key: "send-label", tag: "span", layout: { display: "inline-flex" }, style: {}, text: { content: "Send again", style: "paragraph-sm", weight: 500, editable: true } },
            ],
          },
        ],
      },
    ],
  };
}

// ── Compact Variant (country row) ────────────────────────────

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
      {
        key: "name",
        tag: "span",
        layout: { display: "block", flex: "1" },
        style: {},
        text: { content: name, style: "paragraph-md", weight: 500, color: { token: "color.text-primary" }, editable: true },
      },
      {
        key: "count",
        tag: "span",
        layout: { display: "inline-flex" },
        style: {},
        text: { content: `${contactCount} contacts here`, style: "paragraph-sm", color: { token: "color.text-tertiary" } },
      },
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
