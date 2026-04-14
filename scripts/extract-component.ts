#!/usr/bin/env tsx
// ============================================================
// Extraction Runner — feeds Figma MCP data through the pipeline
// Usage: npx tsx scripts/extract-component.ts <input.json> <outputName> [single|variant]
// ============================================================

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { extractComponent, specToTemplateSource, variantSpecToTemplateSource } from "../src/rebtel/extraction";

const [,, inputFile, outputName, mode = "single"] = process.argv;

if (!inputFile || !outputName) {
  console.error("Usage: npx tsx scripts/extract-component.ts <input.json> <outputName> [single|variant]");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(inputFile, "utf-8"));

// The MCP tool returns { component: { ... } } — pass directly
const spec = extractComponent(raw);

if (!spec) {
  console.error(`[FAIL] extractComponent returned null for ${inputFile}`);
  process.exit(1);
}

// Audit: count token refs vs hardcoded values
let tokenCount = 0;
let hexCount = 0;
let textNodes = 0;
const tokens: string[] = [];
const hexValues: string[] = [];

function auditSpec(s: any) {
  // Check all possible token ref locations
  const checkVal = (v: any, ctx: string) => {
    if (v && typeof v === "object" && "token" in v) {
      tokenCount++;
      tokens.push(v.token);
    } else if (typeof v === "string" && v.startsWith("#") && v.length >= 7) {
      hexCount++;
      hexValues.push(`${ctx}: ${v}`);
    }
  };

  if (s.layout) {
    checkVal(s.layout.gap, "gap");
    checkVal(s.layout.borderRadius, "borderRadius");
    checkVal(s.layout.width, "width");
    checkVal(s.layout.height, "height");
    if (s.layout.padding) {
      for (const [k, v] of Object.entries(s.layout.padding)) checkVal(v, `padding.${k}`);
    }
  }
  if (s.style) {
    checkVal(s.style.background, "background");
    checkVal(s.style.color, "color");
    if (s.style.border) checkVal(s.style.border.color, "border.color");
  }
  if (s.text) {
    textNodes++;
    checkVal(s.text.color, "text.color");
  }
  if (s.children) s.children.forEach(auditSpec);
}

auditSpec(spec);

console.log(`\n=== Extraction Report: ${outputName} ===`);
console.log(`Key: ${spec.key}`);
console.log(`Tag: ${spec.tag}`);
console.log(`Layout: display=${spec.layout.display}, direction=${spec.layout.direction ?? "row"}`);
console.log(`Children: ${spec.children?.length ?? 0}`);
console.log(`Text nodes: ${textNodes}`);
console.log(`Token refs: ${tokenCount}`);
console.log(`Hardcoded hex: ${hexCount}`);
if (hexValues.length > 0) {
  console.log(`Hex values:`);
  hexValues.forEach(v => console.log(`  - ${v}`));
}
console.log(`Unique tokens: ${[...new Set(tokens)].join(", ")}`);

// Generate source
const source = specToTemplateSource(outputName, spec);
const outPath = resolve(__dirname, "../src/rebtel/templates/generated", `${outputName}.ts`);
writeFileSync(outPath, source);
console.log(`\nWritten: ${outPath}`);
