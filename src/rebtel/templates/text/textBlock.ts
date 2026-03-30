// ============================================================
// Text Block — Hero text, section text, body text
// ============================================================
// Figma: 183:6902 (Text component = hero-text)
//   - Vertical, no padding, left-aligned
//   - Headline: Pano 20px/32px, 400, left, #111 (text-primary), letter-spacing 0.02em
//   - Body: KH Teka 16px/24px, 400, left, #737378 (text-secondary), letter-spacing 0.02em
//
// Figma: 165:29604 (Section header = section-text)
//   - Vertical, no padding, justify center, left-aligned
//   - Title: KH Teka 16px/16px, 400, left, #2D2D32 (grey-800), letter-spacing 0.02em
//   - Description: KH Teka 14px/20px, 400, left, #737378 (text-secondary), letter-spacing 0.02em
// ============================================================

import type { ComponentSpec, TextStyleToken } from "../../spec/types";

/**
 * Hero text — large centered headline + body paragraph.
 * Maps to Figma "Text component" (183:6902).
 */
export function heroTextTemplate(props?: Record<string, unknown>): ComponentSpec {
  const headline =
    (props?.headline as string) ??
    (props?.content as string) ??
    (props?.label as string) ??
    "Which country do you want to connect to?";
  const body =
    (props?.body as string) ??
    (props?.description as string) ??
    (props?.subtitle as string) ??
    "";

  const children: ComponentSpec[] = [
    {
      key: "hero-headline",
      tag: "span",
      layout: { display: "block", width: "100%" },
      style: {
        fontFamily: "'Pano'",
        fontSize: 20,
        letterSpacing: "0.02em",
        lineHeight: "32px",
      },
      text: {
        content: headline,
        style: "display-sm",
        weight: 400,
        color: { token: "color.text-primary" },
        align: "left",
        editable: true,
      },
    },
  ];

  if (body) {
    children.push({
      key: "hero-body",
      tag: "span",
      layout: { display: "block", width: "100%" },
      style: {
        fontFamily: "'KH Teka'",
        fontSize: 16,
        letterSpacing: "0.02em",
        lineHeight: "24px",
      },
      text: {
        content: body,
        style: "paragraph-md",
        weight: 400,
        color: { token: "color.text-secondary" },
        align: "left",
        editable: true,
      },
    });
  }

  return {
    key: "hero-text",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      align: "start",
      width: "100%",
      boxSizing: "border-box",
    },
    style: {},
    data: { component: "heroText" },
    children,
  };
}

/**
 * Section text — title + optional description, left aligned.
 * Maps to Figma "Section header" (165:29604).
 */
export function sectionTextTemplate(props?: Record<string, unknown>): ComponentSpec {
  const title =
    (props?.title as string) ??
    (props?.content as string) ??
    (props?.label as string) ??
    "Plans";
  const description =
    (props?.description as string) ??
    (props?.body as string) ??
    "";

  const children: ComponentSpec[] = [
    {
      key: "section-title",
      tag: "span",
      layout: { display: "block", width: "100%" },
      style: {
        fontFamily: "'KH Teka'",
        fontSize: 16,
        letterSpacing: "0.02em",
        lineHeight: "16px",
      },
      text: {
        content: title,
        style: "label-lg",
        weight: 400,
        color: { token: "color.grey-800" },
        align: "left",
        editable: true,
      },
    },
  ];

  if (description) {
    children.push({
      key: "section-description",
      tag: "span",
      layout: { display: "block", width: "100%" },
      style: {
        fontFamily: "'KH Teka'",
        fontSize: 14,
        letterSpacing: "0.02em",
        lineHeight: "20px",
      },
      text: {
        content: description,
        style: "paragraph-sm",
        weight: 400,
        color: { token: "color.text-secondary" },
        align: "left",
        editable: true,
      },
    });
  }

  return {
    key: "section-text",
    tag: "div",
    layout: {
      display: "flex",
      direction: "column",
      justify: "center",
      width: "100%",
      boxSizing: "border-box",
    },
    style: {},
    data: { component: "sectionText" },
    children,
  };
}

/**
 * Simple text block — single text element, flexible style.
 * Backward-compatible with existing textBlockTemplate API.
 */
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
