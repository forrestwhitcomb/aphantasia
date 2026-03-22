// ============================================================
// APHANTASIA — UI Render Engine
// ============================================================
// Takes UIResolvedComponent[] + UIDesignSystem, calls the
// component dispatcher for each, and assembles into a complete
// phone-frame HTML document.
//
// Auto-injects StatusBar at top and home indicator at bottom.
// All CSS values flow through the theme injector.
//
// Layer 1: synchronous, rules-based, <50ms
// Layer 2: async, AI-powered, merges overrides into Layer 1
// ============================================================

import type { UIDesignSystem, UIResolvedComponent, UILayer2Override } from "../types";
import { renderUIComponent } from "../components";
import { UI_COMPONENT_CSS } from "../components/styles";
import { buildUIDocument } from "../themeInjector";
import { renderStatusBar } from "../components/navigation/StatusBar";
import { parseNotes } from "../notes/NoteParser";

/**
 * Render resolved components into a complete HTML document
 * suitable for the viewport iframe's srcDoc.
 *
 * Layer 1: synchronous, no AI. Applies note keyword parsing.
 */
export function renderLayer1(
  components: UIResolvedComponent[],
  designSystem: UIDesignSystem,
  layer2Overrides?: UILayer2Override[]
): string {
  // Index Layer 2 overrides by component ID for quick lookup
  const overrideMap = new Map<string, UILayer2Override>();
  if (layer2Overrides) {
    for (const o of layer2Overrides) {
      overrideMap.set(o.componentId, o);
    }
  }

  // Build body HTML from resolved components
  const bodyParts: string[] = [];

  // Auto-inject status bar at top
  bodyParts.push(renderStatusBar({ variant: "light" }));

  // Render each resolved component
  for (const comp of components) {
    // Parse notes for Layer 1 keywords
    const noteParsed = comp.notes.length > 0 ? parseNotes(comp.notes) : null;

    // Merge Layer 2 overrides if available
    const l2 = overrideMap.get(comp.shapeId);

    // Build props from resolver + note parsing + Layer 2 overrides
    const variant = l2?.variantOverride ?? noteParsed?.variant ?? comp.variant;
    const itemCount = (l2?.contentOverrides?.itemCount as number | undefined) ?? noteParsed?.itemCount ?? comp.itemCount;
    const itemLabels = (l2?.contentOverrides?.itemLabels as string[] | undefined) ?? noteParsed?.itemLabels ?? comp.itemLabels;
    const label = (l2?.contentOverrides?.title as string | undefined) ?? comp.label;

    const html = renderUIComponent(comp.type, {
      label,
      variant,
      itemCount,
      itemLabels,
      noteOverrides: comp.notes.join("\n"),
    });

    // Collect inline style overrides from note flags + note state + Layer 2
    const inlineStyles: string[] = [];

    // Apply note flags as inline styles
    if (noteParsed?.flags) {
      const flags = noteParsed.flags;
      if (flags.has("fullWidth")) inlineStyles.push("width:100%");
      if (flags.has("noBorder")) inlineStyles.push("border:none");
      if (flags.has("noShadow")) inlineStyles.push("box-shadow:none");
      if (flags.has("transparent")) inlineStyles.push("background:transparent");
      if (flags.has("blur")) inlineStyles.push("backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)");
    }

    // Apply note state
    if (noteParsed?.state) {
      switch (noteParsed.state) {
        case "disabled":
        case "inactive":
          inlineStyles.push("opacity:0.45;pointer-events:none");
          break;
        case "loading":
          inlineStyles.push("opacity:0.7");
          break;
        case "error":
          inlineStyles.push("outline:2px solid var(--color-destructive);outline-offset:-2px");
          break;
        case "selected":
        case "active":
          inlineStyles.push("outline:2px solid var(--color-primary);outline-offset:-2px");
          break;
      }
    }

    // Apply Layer 2 style overrides
    if (l2?.styleOverrides && Object.keys(l2.styleOverrides).length > 0) {
      for (const [k, v] of Object.entries(l2.styleOverrides)) {
        inlineStyles.push(`${camelToKebab(k)}:${v}`);
      }
    }

    // Dark mode flag wraps component with inverted CSS variables
    if (noteParsed?.flags?.has("darkMode")) {
      const darkWrapper = `<div style="--color-background:var(--color-foreground);--color-foreground:var(--color-background);--color-card:rgba(255,255,255,0.08);--color-card-foreground:var(--color-background);--color-muted:rgba(255,255,255,0.12);--color-muted-foreground:rgba(255,255,255,0.6);--color-border:rgba(255,255,255,0.15);background:var(--color-foreground);color:var(--color-background);${inlineStyles.join(";")}">${html}</div>`;
      bodyParts.push(darkWrapper);
    } else if (inlineStyles.length > 0) {
      bodyParts.push(`<div style="${inlineStyles.join(";")}">${html}</div>`);
    } else {
      bodyParts.push(html);
    }
  }

  // Auto-inject home indicator at bottom
  bodyParts.push(`
<div class="ui-home-indicator">
  <div class="ui-home-indicator__bar"></div>
</div>`);

  const bodyHtml = bodyParts.join("\n");

  // Wrap in full document with theme CSS
  return buildUIDocument(bodyHtml, designSystem, UI_COMPONENT_CSS);
}

/** Convert camelCase to kebab-case for CSS properties */
function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}
