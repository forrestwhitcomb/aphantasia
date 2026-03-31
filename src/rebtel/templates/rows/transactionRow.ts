// ============================================================
// Transaction Row — Built from spec for list contexts
// ============================================================
// Avatar + name/subtitle + time/amount
// Height 72px, gap 12px, bottom border
// ============================================================

import type { ComponentSpec } from "../../spec/types";

const ICON_USER = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B9B9BE" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

export function transactionRowTemplate(props?: Record<string, unknown>): ComponentSpec {
  const name = (props?.name as string) ?? (props?.label as string) ?? "Rebtel credits top up";
  const subtitle = (props?.subtitle as string) ?? (props?.phone as string) ?? "";
  const time = (props?.time as string) ?? "2024 April 16";
  const amount = (props?.amount as string) ?? "$50";

  return {
    key: "transaction-row",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      height: 72,
      gap: { token: "spacing.sm" },
      width: "100%",
      padding: { y: { token: "spacing.sm" } },
      boxSizing: "border-box",
    },
    style: {
      cursor: "pointer",
      fontFamily: "'KH Teka'",
      letterSpacing: "0.02em",
      borderBottom: { width: "1px", style: "solid", color: { token: "color.border-secondary" } },
    },
    interactive: { type: "button" },
    data: { component: "transactionRow" },
    children: [
      // Avatar
      {
        key: "avatar",
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
        style: { background: { token: "color.surface-neutral" } },
        data: { innerHTML: ICON_USER },
      },
      // Name + subtitle column
      {
        key: "info-col",
        tag: "div",
        layout: { display: "flex", direction: "column", flex: "1", gap: "2px", minWidth: 0 },
        style: {},
        children: [
          {
            key: "name",
            tag: "span",
            layout: { display: "block" },
            style: {
              letterSpacing: "0.02em",
              lineHeight: "20px",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflowText: "hidden",
            },
            text: { content: name, style: "paragraph-md", weight: 400, color: { token: "color.text-primary" }, editable: true },
          },
          ...(subtitle
            ? [{
                key: "subtitle",
                tag: "span" as const,
                layout: { display: "block" as const },
                style: { letterSpacing: "0.02em", lineHeight: "18px" },
                text: { content: subtitle, style: "paragraph-sm" as const, weight: 400, color: { token: "color.text-secondary" } },
              }]
            : []),
        ],
      },
      // Time + amount column (right)
      {
        key: "right-col",
        tag: "div",
        layout: { display: "flex", direction: "column", align: "end", gap: "2px", flexShrink: 0 },
        style: {},
        children: [
          {
            key: "time",
            tag: "span",
            layout: { display: "block" },
            style: { letterSpacing: "0.02em", lineHeight: "14px", textAlign: "right" },
            text: { content: time, style: "label-xs", weight: 400, color: { token: "color.text-secondary" }, align: "right" },
          },
          {
            key: "amount",
            tag: "span",
            layout: { display: "block" },
            style: { letterSpacing: "0.02em", lineHeight: "20px", textAlign: "right" },
            text: { content: amount, style: "paragraph-sm", weight: 400, color: { token: "color.text-primary" }, align: "right", editable: true },
          },
        ],
      },
    ],
  };
}
