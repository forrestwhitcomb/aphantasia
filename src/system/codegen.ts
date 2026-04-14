// ============================================================
// Aphantasia/System — Code Generator
// ============================================================
// Walks a SpecNode tree and produces clean React JSX output.
// This is a "projection" — a pure function of the document.
// ============================================================

import type { SpecNode, ComponentType } from "./types";

export function specToJSX(node: SpecNode, indent = 0): string {
  const pad = "  ".repeat(indent);

  // Structural nodes
  if (node.type === "__root") {
    return node.children.map((c) => specToJSX(c, indent)).join("\n");
  }
  if (node.type === "__row") {
    return `${pad}<div className="flex gap-6 px-12">\n${node.children.map((c) => specToJSX(c, indent + 1)).join("\n")}\n${pad}</div>`;
  }

  const tag = node.type;
  const attrs: string[] = [];

  if (node.variant) attrs.push(`variant="${node.variant}"`);

  // Serialize meaningful props
  for (const [k, v] of Object.entries(node.props)) {
    if (k === "children" || v === undefined || v === null) continue;
    if (typeof v === "string") attrs.push(`${k}="${v}"`);
    else if (typeof v === "number") attrs.push(`${k}={${v}}`);
    else if (typeof v === "boolean" && v) attrs.push(k);
    else attrs.push(`${k}={${JSON.stringify(v)}}`);
  }

  const attrStr = attrs.length > 0 ? " " + attrs.join(" ") : "";

  // Annotations as comments
  const annComments = node.annotations
    .map((a) => `${pad}  {/* ${a.type === "ai" ? "AI" : a.type}: ${a.text} */}`)
    .join("\n");

  if (!node.children.length) {
    return annComments
      ? `${annComments}\n${pad}<${tag}${attrStr} />`
      : `${pad}<${tag}${attrStr} />`;
  }

  const childrenStr = node.children
    .map((c) => specToJSX(c, indent + 1))
    .join("\n");

  return annComments
    ? `${annComments}\n${pad}<${tag}${attrStr}>\n${childrenStr}\n${pad}</${tag}>`
    : `${pad}<${tag}${attrStr}>\n${childrenStr}\n${pad}</${tag}>`;
}

/** Collect all component types used in a SpecNode tree */
export function getUsedComponentTypes(node: SpecNode): Set<ComponentType> {
  const types = new Set<ComponentType>();
  function walk(n: SpecNode) {
    if (n.type !== "__root" && n.type !== "__row") types.add(n.type);
    n.children.forEach(walk);
  }
  walk(node);
  return types;
}

/** Generate a full React component file for a screen */
export function generateScreenComponent(
  screenName: string,
  root: SpecNode,
): string {
  const body = specToJSX(root, 2);

  return `import React from "react";

export default function ${screenName.replace(/\s+/g, "")}() {
  return (
    <div className="min-h-screen">
${body}
    </div>
  );
}
`;
}
