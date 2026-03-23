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
//
// Scrollable: when frameHeight > VIEWPORT_HEIGHT, wraps body
// in three zones (top/scroll/bottom) with sticky nav + tab bar.
//
// Interactivity: injects data-shape-id / data-component-type /
// data-variant on each component wrapper, and data-text-editable
// on text elements for inline editing.
// ============================================================

import type { UIDesignSystem, UIResolvedComponent, UILayer2Override, UIComponentPropsBase } from "../types";
import { renderUIComponent } from "../components";
import { UI_COMPONENT_CSS } from "../components/styles";
import { buildUIDocument } from "../themeInjector";
import { renderStatusBar } from "../components/navigation/StatusBar";
import { parseNotes } from "../notes/NoteParser";

const MOBILE_UI_FRAME_WIDTH = 393;
const VIEWPORT_HEIGHT = 852;
const BADGE_FULL_WIDTH_MIN_PX = 140;

/**
 * Render resolved components into a complete HTML document
 * suitable for the viewport iframe's srcDoc.
 *
 * Layer 1: synchronous, no AI. Applies note keyword parsing.
 *
 * @param frameHeight — canvas frame height; when > 852 the viewport becomes scrollable
 */
export function renderLayer1(
  components: UIResolvedComponent[],
  designSystem: UIDesignSystem,
  layer2Overrides?: UILayer2Override[],
  frameHeight?: number
): string {
  // Index Layer 2 overrides by component ID for quick lookup
  const overrideMap = new Map<string, UILayer2Override>();
  if (layer2Overrides) {
    for (const o of layer2Overrides) {
      overrideMap.set(o.componentId, o);
    }
  }

  const isScrollable = (frameHeight ?? VIEWPORT_HEIGHT) > VIEWPORT_HEIGHT;

  // Collect parts into zones: top (status+nav), middle (content), bottom (tab+home)
  const topParts: string[] = [];
  const middleParts: string[] = [];
  const tabBarParts: string[] = [];

  // Auto-inject status bar at top
  topParts.push(renderStatusBar({ variant: "light" }));

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

    // Render nested children, split into top/bottom relative to card midpoint
    let childrenHtmlTop = "";
    let childrenHtmlBottom = "";
    if (comp.children && comp.children.length > 0) {
      const cardMidY = comp.bounds.y + comp.bounds.height / 2;

      const renderChild = (child: UIResolvedComponent) => {
        const childNoteParsed = child.notes.length > 0 ? parseNotes(child.notes) : null;
        const childL2 = overrideMap.get(child.shapeId);
        // For nested badges, compare against parent container width (card/sheet/modal),
        // not the full frame width.
        const parentWidth = comp.bounds.width || MOBILE_UI_FRAME_WIDTH;
        const childFullWidthBadge =
          child.type === "badge" &&
          child.bounds.width >= parentWidth * 0.5 &&
          child.bounds.width >= BADGE_FULL_WIDTH_MIN_PX;
        return renderUIComponent(child.type, {
          label: (childL2?.contentOverrides?.title as string | undefined) ?? child.label,
          variant: childL2?.variantOverride ?? childNoteParsed?.variant ?? child.variant,
          noteOverrides: child.notes.join("\n"),
          fullWidth: childFullWidthBadge,
        });
      };

      const topChildren: UIResolvedComponent[] = [];
      const bottomChildren: UIResolvedComponent[] = [];
      for (const child of comp.children) {
        const childCenterY = child.bounds.y + child.bounds.height / 2;
        if (childCenterY < cardMidY) {
          topChildren.push(child);
        } else {
          bottomChildren.push(child);
        }
      }
      childrenHtmlTop = renderCardChildren(topChildren, renderChild);
      childrenHtmlBottom = renderCardChildren(bottomChildren, renderChild);
    }

    const html = renderUIComponent(comp.type, {
      label,
      variant,
      itemCount,
      itemLabels,
      noteOverrides: comp.notes.join("\n"),
      childrenHtmlTop,
      childrenHtmlBottom,
    } as Partial<UIComponentPropsBase> & { childrenHtmlTop?: string; childrenHtmlBottom?: string });

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
    let rendered = html;
    const isDarkMode = noteParsed?.flags?.has("darkMode") || comp._userDarkMode;
    if (isDarkMode) {
      rendered = `<div data-shape-id="${comp.shapeId}" data-component-type="${comp.type}" data-variant="${variant ?? ""}" style="--color-background:var(--color-foreground);--color-foreground:var(--color-background);--color-card:rgba(255,255,255,0.08);--color-card-foreground:var(--color-background);--color-muted:rgba(255,255,255,0.12);--color-muted-foreground:rgba(255,255,255,0.6);--color-border:rgba(255,255,255,0.15);background:var(--color-foreground);color:var(--color-background);${inlineStyles.join(";")}">${rendered}</div>`;
    } else if (inlineStyles.length > 0) {
      rendered = `<div data-shape-id="${comp.shapeId}" data-component-type="${comp.type}" data-variant="${variant ?? ""}" style="${inlineStyles.join(";")}">${rendered}</div>`;
    } else {
      // Always wrap with data attributes for interactivity
      rendered = `<div data-shape-id="${comp.shapeId}" data-component-type="${comp.type}" data-variant="${variant ?? ""}">${rendered}</div>`;
    }

    // Top-level badges: always respect viewport margins.
    // <50% frame width => text-hugging; >=50% => full width within margins.
    if (comp.type === "badge") {
      const isWide =
        comp.bounds.width >= MOBILE_UI_FRAME_WIDTH * 0.5 &&
        comp.bounds.width >= BADGE_FULL_WIDTH_MIN_PX;
      rendered = `<div class="ui-badge-wrap ${isWide ? "ui-badge-wrap--full" : "ui-badge-wrap--fit"}">${rendered}</div>`;
    }

    // Route to the appropriate zone
    if (comp.type === "tabBar") {
      tabBarParts.push(rendered);
    } else if (isScrollable && comp.type === "navBar") {
      topParts.push(rendered);
    } else {
      middleParts.push(rendered);
    }
  }

  // Home indicator HTML
  const homeIndicatorHtml = `
<div class="ui-home-indicator">
  <div class="ui-home-indicator__bar"></div>
</div>`;

  let bodyHtml: string;

  if (isScrollable) {
    // Scrollable layout: top (sticky) → scroll → bottom (sticky)
    const topHtml = topParts.join("\n");
    const scrollHtml = middleParts.join("\n");
    const bottomHtml = [...tabBarParts, homeIndicatorHtml].join("\n");
    bodyHtml = `<div class="ui-viewport-top">${topHtml}</div>
<div class="ui-viewport-scroll">${scrollHtml}</div>
<div class="ui-viewport-bottom">${bottomHtml}</div>`;
  } else {
    // Flat layout (backward compatible): status bar + content + tabbar + home
    const bodyParts = [...topParts, ...middleParts, ...tabBarParts, homeIndicatorHtml];
    bodyHtml = bodyParts.join("\n");
  }

  // Wrap in full document with theme CSS
  return buildUIDocument(bodyHtml, designSystem, UI_COMPONENT_CSS, { isScrollable });
}

/**
 * Render nested card children with lightweight row grouping:
 * - two button children on the same row render side-by-side
 * - all other children render in stacked order
 */
function renderCardChildren(
  children: UIResolvedComponent[],
  renderChild: (child: UIResolvedComponent) => string
): string {
  if (children.length === 0) return "";
  const ordered = [...children].sort((a, b) =>
    a.bounds.y === b.bounds.y ? a.bounds.x - b.bounds.x : a.bounds.y - b.bounds.y
  );

  const parts: string[] = [];
  const rowThreshold = 18;

  for (let i = 0; i < ordered.length; i++) {
    const current = ordered[i];
    const next = ordered[i + 1];
    if (
      current.type === "button" &&
      next &&
      next.type === "button" &&
      Math.abs(
        (current.bounds.y + current.bounds.height / 2) -
          (next.bounds.y + next.bounds.height / 2)
      ) <= rowThreshold
    ) {
      parts.push(
        `<div class="ui-card__actions-row">` +
          `<div class="ui-card__actions-col">${renderChild(current)}</div>` +
          `<div class="ui-card__actions-col">${renderChild(next)}</div>` +
        `</div>`
      );
      i++;
      continue;
    }
    parts.push(renderChild(current));
  }
  return parts.join("\n");
}

/** Convert camelCase to kebab-case for CSS properties */
function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}
