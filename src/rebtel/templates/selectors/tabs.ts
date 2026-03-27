// Tabs — Segmented control with icon + label, pill style
// Figma: 5405:106192 — Two pill tabs, active=black, inactive=white

import type { ComponentSpec } from "../../spec/types";

function tabPill(key: string, label: string, active: boolean, iconSvg?: string): ComponentSpec {
  const children: ComponentSpec[] = [];
  if (iconSvg) {
    children.push({ key: `${key}-icon`, tag: "div", layout: { display: "inline-flex" }, style: {}, data: { innerHTML: iconSvg } });
  }
  children.push({
    key: `${key}-label`,
    tag: "span",
    layout: { display: "inline-flex" },
    style: {},
    text: { content: label, style: "label-sm", weight: 500, color: active ? { token: "color.brand-white" } : { token: "color.text-primary" }, editable: true },
  });

  return {
    key,
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      justify: "center",
      gap: { token: "spacing.xxs" },
      height: { token: "height.xl" },
      padding: { x: { token: "spacing.lg" } },
      borderRadius: { token: "radius.full" },
    },
    style: {
      background: active ? { token: "color.grey-900" } : { token: "color.surface-primary" },
      cursor: "pointer",
    },
    interactive: { type: "tab" },
  };
}

export function tabsTemplate(props?: Record<string, unknown>): ComponentSpec {
  const items = (props?.items as string[]) ?? ["Label", "Label"];
  const activeIndex = (props?.activeIndex as number) ?? 0;

  return {
    key: "tabs",
    tag: "div",
    layout: { display: "flex", gap: { token: "spacing.xxs" } },
    style: {},
    data: { component: "tabs" },
    children: items.map((label, i) => tabPill(`tab-${i}`, label, i === activeIndex)),
  };
}
