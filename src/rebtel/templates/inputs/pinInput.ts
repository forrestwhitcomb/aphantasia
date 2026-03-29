// ============================================================
// PIN Input — Pixel-perfect from Figma 3.0
// ============================================================
// Horizontal row of 4 digit boxes
// Container: flex row, gap 8px
// Each box: 52x52, radius 8px, border 1px solid #DCDCE1, white bg
// Digit: KH Teka 24px, weight 400, #111111, center aligned
// Active box: 2px border, #E31B3B
// ============================================================

import type { ComponentSpec } from "../../spec/types";

function pinBox(key: string, value: string, active: boolean, filled: boolean): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      width: 52,
      height: 52,
      borderRadius: "8px",
      boxSizing: "border-box",
    },
    style: {
      background: "#FFFFFF",
      border: {
        width: active ? "2px" : "1px",
        style: "solid",
        color: active ? "#E31B3B" : "#DCDCE1",
      },
      fontFamily: "'KH Teka'",
    },
    interactive: { type: "input" },
    children: filled ? [{
      key: `${key}-val`,
      tag: "span",
      layout: { display: "block" },
      style: {
        fontSize: 24,
        letterSpacing: "0.02em",
        lineHeight: "24px",
        textAlign: "center",
        fontFamily: "'KH Teka'",
      },
      text: { content: value, style: "headline-sm", weight: 400, color: "#111111", align: "center" },
    }] : active ? [{
      key: `${key}-cursor`,
      tag: "div",
      layout: { display: "block", width: 2, height: 24 },
      style: { background: "#E31B3B" },
    }] : undefined,
  };
}

export function pinInputTemplate(props?: Record<string, unknown>): ComponentSpec {
  const digits = (props?.digits as string) ?? "19";
  const count = (props?.count as number) ?? 4;
  const values = digits.split("");

  const boxes: ComponentSpec[] = [];
  for (let i = 0; i < count; i++) {
    const filled = i < values.length;
    const active = i === values.length;
    boxes.push(pinBox(`pin-${i}`, filled ? values[i] : "", active, filled));
  }

  return {
    key: "pin-input",
    tag: "div",
    layout: {
      display: "flex",
      gap: "8px",
      justify: "center",
      width: "100%",
    },
    style: {
      fontFamily: "'KH Teka'",
    },
    data: { component: "pinInput" },
    children: boxes,
  };
}
