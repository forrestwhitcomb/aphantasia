// PIN Input — 4-digit PIN entry boxes
// Figma: 5405:106149 — 4 boxes, 75px tall, rounded corners, active box has red border

import type { ComponentSpec } from "../../spec/types";

function pinBox(key: string, value: string, active: boolean, filled: boolean): ComponentSpec {
  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      width: 75,
      height: 75,
      borderRadius: { token: "radius.md" },
      boxSizing: "border-box",
    },
    style: {
      background: { token: "color.surface-primary" },
      border: {
        width: active ? "2px" : "1px",
        style: "solid",
        color: active ? { token: "color.brand-red" } : { token: "color.border-default" },
      },
    },
    interactive: { type: "input" },
    children: filled ? [{
      key: `${key}-val`,
      tag: "span",
      layout: { display: "block" },
      style: {},
      text: { content: value, style: "headline-lg", weight: 400, color: { token: "color.text-primary" }, align: "center" },
    }] : active ? [{
      key: `${key}-cursor`,
      tag: "div",
      layout: { display: "block", width: 2, height: 24 },
      style: { background: { token: "color.brand-red" } },
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
    layout: { display: "flex", gap: { token: "spacing.sm" }, justify: "center", width: "100%" },
    style: {},
    data: { component: "pinInput" },
    children: boxes,
  };
}
