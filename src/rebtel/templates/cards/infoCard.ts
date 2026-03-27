// Info Card — Icon (optional) + title + subtitle in a light bg card
// Figma: 5405:107498 (with icon), 5405:107513 (without icon)

import type { ComponentSpec } from "../../spec/types";

const ICON_MINUTES = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rebtel-icon-secondary)" stroke-width="1.5" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.07 8.63 2 2 0 0 1 5.11 2h3a2 2 0 0 1 2 1.72c.13.97.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.84.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

export function infoCardTemplate(props?: Record<string, unknown>): ComponentSpec {
  const title = (props?.title as string) ?? (props?.label as string) ?? "Minutes left: 3 minutes";
  const subtitle = (props?.subtitle as string) ?? "Your minutes include your plans and credits";
  const showIcon = props?.showIcon !== false;
  const iconSvg = (props?.iconSvg as string) ?? ICON_MINUTES;

  const children: ComponentSpec[] = [];
  if (showIcon) {
    children.push({ key: "icon", tag: "div", layout: { display: "flex", flexShrink: 0 }, style: {}, data: { innerHTML: iconSvg } });
  }
  children.push({
    key: "text-col",
    tag: "div",
    layout: { display: "flex", direction: "column", flex: "1", gap: "2px" },
    style: {},
    children: [
      { key: "title", tag: "span", layout: { display: "block" }, style: {}, text: { content: title, style: "paragraph-sm", weight: 500, color: { token: "color.text-primary" }, editable: true } },
      { key: "subtitle", tag: "span", layout: { display: "block" }, style: {}, text: { content: subtitle, style: "paragraph-xs", color: { token: "color.text-tertiary" }, editable: true } },
    ],
  });

  return {
    key: "info-card",
    tag: "div",
    layout: {
      display: "flex",
      align: "center",
      gap: { token: "spacing.sm" },
      width: "100%",
      padding: { all: { token: "spacing.md" } },
      borderRadius: { token: "radius.md" },
      boxSizing: "border-box",
    },
    style: { background: { token: "color.surface-light" } },
    data: { component: "infoCard" },
    children,
  };
}
