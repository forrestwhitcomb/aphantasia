// ============================================================
// Extraction Pipeline — Figma → ComponentSpec → Template File
// ============================================================
// Orchestrates the conversion of Figma component data into
// auto-generated template files that replace hand-written ones.
// ============================================================

import type { ComponentSpec, TemplateFactory } from "../spec/types";
import { figmaNodeToSpec } from "./figmaNodeToSpec";
import type { FigmaNode } from "./figmaNodeToSpec";

// ── Types ────────────────────────────────────────────────────

export interface ExtractionResult {
  name: string;
  nodeId: string;
  spec: ComponentSpec;
}

export interface VariantExtractionResult {
  componentSetName: string;
  nodeId: string;
  variants: Record<string, ComponentSpec>;
}

// ── Extract a single component ───────────────────────────────

/**
 * Extract a ComponentSpec from Figma component development data.
 * The `figmaData` parameter is the output from
 * figma_get_component_for_development or similar MCP tool.
 */
export function extractComponent(
  figmaData: { document?: FigmaNode; component?: FigmaNode } & Record<string, unknown>,
): ComponentSpec | null {
  // The MCP tool returns data in different shapes:
  // - figma_get_component_for_development: { component: { ... } }
  // - figma_get_file_data with nodeIds: { document: { children: [...] } }
  // - Direct node tree: { id, name, type, ... }
  const rootNode =
    figmaData.component ??
    figmaData.document ??
    (figmaData as unknown as FigmaNode);

  if (!rootNode || !rootNode.type) {
    console.warn("[extraction] No valid node tree found in figma data");
    return null;
  }

  return figmaNodeToSpec(rootNode);
}

// ── Extract variants from a component set ────────────────────

/**
 * Extract all variants from a COMPONENT_SET node.
 * Each child of the set is a COMPONENT with variant properties.
 */
export function extractComponentSet(
  figmaData: Record<string, unknown>,
): VariantExtractionResult | null {
  const rootNode = (figmaData.component ??
    figmaData.document ??
    figmaData) as FigmaNode;

  if (!rootNode || rootNode.type !== "COMPONENT_SET") {
    // Single component, not a set
    const spec = extractComponent(figmaData);
    if (!spec) return null;
    return {
      componentSetName: rootNode?.name ?? "unknown",
      nodeId: rootNode?.id ?? "",
      variants: { default: spec },
    };
  }

  const variants: Record<string, ComponentSpec> = {};
  if (rootNode.children) {
    for (const child of rootNode.children) {
      if (child.type === "COMPONENT") {
        const spec = figmaNodeToSpec(child);
        if (spec) {
          // Extract variant name from the component name
          // Figma convention: "Property1=Value1, Property2=Value2"
          const variantName = child.name
            .split(",")
            .map((p: string) => p.split("=").pop()?.trim() ?? "")
            .filter(Boolean)
            .join("-")
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "");
          variants[variantName || "default"] = spec;
        }
      }
    }
  }

  if (Object.keys(variants).length === 0) return null;

  return {
    componentSetName: rootNode.name,
    nodeId: rootNode.id,
    variants,
  };
}

// ── Generate Template Factory Source Code ─────────────────────

/**
 * Generate a TypeScript source file for an extracted component.
 * The output follows the existing TemplateFactory pattern used
 * in src/rebtel/templates/.
 */
export function specToTemplateSource(
  functionName: string,
  spec: ComponentSpec,
): string {
  const specJson = JSON.stringify(spec, null, 2);

  return `// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const BASE_SPEC: ComponentSpec = ${specJson};

export function ${functionName}Template(props?: Record<string, unknown>): ComponentSpec {
  const spec = JSON.parse(JSON.stringify(BASE_SPEC)) as ComponentSpec;
  if (props) applyTextOverrides(spec, props);
  return spec;
}

function applyTextOverrides(spec: ComponentSpec, props: Record<string, unknown>) {
  if (spec.text?.editable && spec.data?.figmaName && props[spec.data.figmaName] !== undefined) {
    spec.text.content = String(props[spec.data.figmaName]);
  }
  spec.children?.forEach(c => applyTextOverrides(c, props));
}
`;
}

/**
 * Generate a TypeScript source file for a multi-variant component.
 */
export function variantSpecToTemplateSource(
  functionName: string,
  variants: Record<string, ComponentSpec>,
): string {
  const variantEntries = Object.entries(variants)
    .map(
      ([name, spec]) =>
        `  "${name}": ${JSON.stringify(spec, null, 2)}`,
    )
    .join(",\n");

  return `// Auto-extracted from Figma — DO NOT HAND EDIT
// Re-run extraction pipeline to update
import type { ComponentSpec } from "../../spec/types";

const VARIANTS: Record<string, ComponentSpec> = {
${variantEntries}
};

export function ${functionName}Template(props?: Record<string, unknown>): ComponentSpec {
  const variant = (props?.variant as string) ?? Object.keys(VARIANTS)[0];
  const spec = JSON.parse(JSON.stringify(VARIANTS[variant] ?? Object.values(VARIANTS)[0])) as ComponentSpec;
  if (props) applyTextOverrides(spec, props);
  return spec;
}

function applyTextOverrides(spec: ComponentSpec, props: Record<string, unknown>) {
  if (spec.text?.editable && spec.data?.figmaName && props[spec.data.figmaName] !== undefined) {
    spec.text.content = String(props[spec.data.figmaName]);
  }
  spec.children?.forEach(c => applyTextOverrides(c, props));
}
`;
}

/**
 * Convert a Figma component name to a valid camelCase function name.
 * e.g., "Input-search" → "inputSearch"
 *        "Home/Card" → "homeCard"
 */
export function figmaNameToFunctionName(name: string): string {
  return name
    .replace(/[/\\]/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .split("-")
    .filter(Boolean)
    .map((part, i) =>
      i === 0
        ? part.toLowerCase()
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join("");
}
