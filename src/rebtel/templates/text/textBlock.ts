// Text Block — Balance display, labels, section text
// Figma: 5405:106767 (balance), 5405:106478+ (labels)

import type { ComponentSpec, TextStyleToken } from "../../spec/types";

export function textBlockTemplate(props?: Record<string, unknown>): ComponentSpec {
  const content = (props?.content as string) ?? (props?.label as string) ?? "Text";
  const style = (props?.style as TextStyleToken) ?? "paragraph-md";
  const weight = (props?.weight as number) ?? undefined;
  const color = (props?.color as string) ?? undefined;

  return {
    key: "text-block",
    tag: "div",
    layout: { display: "block", width: "100%" },
    style: {},
    data: { component: "textBlock" },
    text: {
      content,
      style,
      weight,
      color: color ? color : { token: "color.text-primary" },
      editable: true,
    },
  };
}
