// Payment Module — Figma: 190:9961 (State=Default), 390×248
// Exact values from figma_get_component_for_development_deep

import type { ComponentSpec } from "../../spec/types";

// SVG icons extracted from Figma
const ICON_INFO_I = `<svg width="4" height="8" viewBox="0 0 4 8" fill="none" stroke="#2D2D32" stroke-width="1.2" stroke-linecap="round"><line x1="2" y1="0" x2="2" y2="5"/><circle cx="2" cy="7.5" r="0.5"/></svg>`;
const ICON_ARROW_DOWN = `<svg width="18" height="9" viewBox="0 0 18 9" fill="none" stroke="#2D2D32" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 1 9 8 17 1"/></svg>`;

export function paymentSheetTemplate(props?: Record<string, unknown>): ComponentSpec {
  const amount = (props?.amount as string) ?? "$5";
  const credits = (props?.credits as string) ?? "$1.24";
  const cardLast4 = (props?.cardLast4 as string) ?? "1000";

  return {
    key: "payment-module",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      align: "start",
      width: "100%",
      padding: { top: "24px", left: "16px", right: "16px", bottom: "52px" },
      boxSizing: "border-box",
      overflow: "hidden",
    },
    style: {
      background: "#FFFFFF",
      borderTop: { width: "1px", style: "solid", color: "#DCDCE1" },
      textAlign: "left",
      fontSize: 16,
      color: "#737378",
      fontFamily: "'KH Teka'",
    },
    data: { component: "paymentSheet" },
    children: [
      // Frame 536 — main content column
      {
        key: "content-frame",
        tag: "div",
        layout: {
          display: "flex",
          direction: "column",
          align: "start",
          width: "100%",
          gap: "16px",
        },
        style: {},
        children: [
          // Rebtel Credits row
          {
            key: "credits-row",
            tag: "div",
            layout: {
              display: "flex",
              align: "center",
              justify: "space-between",
              width: "100%",
              gap: "20px",
            },
            style: {},
            children: [
              {
                key: "credits-label",
                tag: "span",
                layout: { display: "inline-flex" },
                style: { letterSpacing: "0.02em", lineHeight: "16px" },
                text: {
                  content: "Use Rebtel Credits",
                  style: "label-md",
                  weight: 400,
                  color: "#737378",
                  editable: true,
                },
              },
              // Right side: amount + toggle + info icon
              {
                key: "credits-right",
                tag: "div",
                layout: { display: "flex", align: "center", justify: "end", gap: "8px" },
                style: {},
                children: [
                  {
                    key: "credits-amount",
                    tag: "span",
                    layout: { display: "inline-flex" },
                    style: { letterSpacing: "0.02em", lineHeight: "16px" },
                    text: {
                      content: credits,
                      style: "label-md",
                      weight: 400,
                      color: "#737378",
                      editable: true,
                    },
                  },
                  // Toggle (inactive state)
                  {
                    key: "toggle",
                    tag: "div",
                    layout: {
                      display: "flex",
                      align: "center",
                      width: 46,
                      height: 24,
                      borderRadius: "32px",
                      padding: { all: "2px" },
                      boxSizing: "border-box",
                      overflow: "hidden",
                      flexShrink: 0,
                    },
                    style: { background: "#DCDCE1", cursor: "pointer" },
                    interactive: { type: "toggle" },
                    children: [
                      {
                        key: "goggle",
                        tag: "div",
                        layout: {
                          display: "block",
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                        },
                        style: { background: "#FAFAFC" },
                      },
                    ],
                  },
                  // icon-round (info)
                  {
                    key: "icon-round",
                    tag: "div",
                    layout: {
                      display: "flex",
                      align: "center",
                      justify: "center",
                      width: 24,
                      height: 24,
                      borderRadius: "24px",
                      overflow: "hidden",
                      flexShrink: 0,
                      boxSizing: "border-box",
                    },
                    style: {
                      background: "#FFFFFF",
                      border: { width: "1px", style: "solid", color: "#B9B9BE" },
                    },
                    children: [
                      {
                        key: "i-icon",
                        tag: "div",
                        layout: { display: "flex", align: "center", justify: "center", width: 4, height: 8 },
                        style: {},
                        data: { innerHTML: ICON_INFO_I },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // Dropdown/Payment selector
          {
            key: "dropdown-payment",
            tag: "div",
            layout: {
              display: "flex",
              align: "center",
              justify: "space-between",
              width: "100%",
              height: 52,
              borderRadius: "8px",
              padding: { all: "12px" },
              boxSizing: "border-box",
              overflow: "hidden",
              flexShrink: 0,
            },
            style: {
              border: { width: "1px", style: "solid", color: "#DCDCE1" },
              cursor: "pointer",
            },
            interactive: { type: "button" },
            children: [
              // Payment info (left side)
              {
                key: "payment-info",
                tag: "div",
                layout: { display: "flex", align: "center", gap: "12px", flex: "1", flexShrink: 0 },
                style: {},
                children: [
                  // Payment provider card icon (Visa)
                  {
                    key: "payment-providers",
                    tag: "div",
                    layout: { display: "block", width: 32, height: 32, position: "relative" },
                    style: {},
                    children: [
                      {
                        key: "card-color",
                        tag: "div",
                        layout: {
                          display: "flex",
                          align: "center",
                          justify: "center",
                          position: "absolute",
                          top: "21.88%",
                          right: "6.25%",
                          bottom: "21.88%",
                          left: "6.25%",
                          borderRadius: "2px",
                          overflow: "hidden",
                        },
                        style: {
                          background: "#1434CB",
                          shadow: "0px 2px 20px rgba(183,183,183,0.08), 0px 20px 40px rgba(183,183,183,0.08)",
                        },
                        children: [
                          {
                            key: "visa-text",
                            tag: "span",
                            layout: { display: "inline-flex" },
                            style: {},
                            text: { content: "VISA", style: "label-xs", weight: 700, color: "#FFFFFF" },
                          },
                        ],
                      },
                    ],
                  },
                  // Card number
                  {
                    key: "card-number",
                    tag: "span",
                    layout: { display: "inline-flex" },
                    style: { letterSpacing: "0.02em", lineHeight: "16px" },
                    text: {
                      content: `**** ${cardLast4}`,
                      style: "label-md",
                      weight: 400,
                      color: "#2D2D32",
                      editable: true,
                    },
                  },
                ],
              },
              // Arrow icon
              {
                key: "icon-arrow",
                tag: "div",
                layout: {
                  display: "flex",
                  align: "center",
                  justify: "center",
                  width: 24,
                  height: 24,
                  overflow: "hidden",
                  flexShrink: 0,
                },
                style: {},
                data: { innerHTML: ICON_ARROW_DOWN },
              },
            ],
          },
        ],
      },
      // Primary button — Pay
      {
        key: "pay-btn",
        tag: "div",
        layout: {
          display: "flex",
          align: "center",
          justify: "center",
          width: "100%",
          height: 64,
          borderRadius: "32px",
          padding: { x: "32px" },
          boxSizing: "border-box",
        },
        style: { background: "#E31B3B", cursor: "pointer" },
        interactive: { type: "button" },
        children: [
          {
            key: "pay-label",
            tag: "span",
            layout: { display: "inline-flex" },
            style: { letterSpacing: "0.02em", lineHeight: "20px" },
            text: {
              content: `Pay ${amount}`,
              style: "label-xl",
              weight: 400,
              color: "#FFFFFF",
              editable: true,
            },
          },
        ],
      },
    ],
  };
}
