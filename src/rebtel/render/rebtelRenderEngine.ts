// ============================================================
// APHANTASIA for REBTEL — Render Engine Wrapper
// ============================================================
// Thin wrapper around renderLayer1() that injects the Rebtel
// component dispatcher, extra CSS tokens, interaction scripts,
// and screen-to-screen navigation wiring.
// ============================================================

import type { UIResolvedComponent, UILayer2Override } from "@/ui-mode/types";
import type { CanvasShape } from "@/engine/CanvasEngine";
import { renderLayer1 } from "@/ui-mode/render/UIRenderEngine";
import { REBTEL_DESIGN_SYSTEM, REBTEL_EXTRA_CSS } from "../designSystem";
import { renderRebtelComponent } from "../components";
import { REBTEL_COMPONENT_CSS } from "../components/styles";
import { buildRebtelInteractionScript, buildRebtelInteractionCSS } from "../viewport/interactionScript";
import { rebtelDesignStore } from "../store/RebtelDesignStore";

/** Navigation target patterns in notes */
const NAV_PATTERNS = [
  /→\s*(.+)/i,                          // → Screen Name
  /navigat(?:e|es)\s+to\s*:?\s*(.+)/i,  // navigates to: Screen Name
  /go(?:es)?\s+to\s*:?\s*(.+)/i,        // goes to: Screen Name
  /next\s*:\s*(.+)/i,                    // next: Screen Name
  /links?\s+to\s*:?\s*(.+)/i,           // links to: Screen Name
];

/**
 * Try to extract a navigation target from note text.
 * Returns a screenId or null.
 */
function parseNavigationFromNotes(notes: string[], screenTitleToId: Map<string, string>): string | null {
  for (const note of notes) {
    for (const pattern of NAV_PATTERNS) {
      const match = note.match(pattern);
      if (match) {
        const target = match[1].trim().toLowerCase();
        // Try exact screenId match
        if (screenTitleToId.has(target)) {
          return screenTitleToId.get(target)!;
        }
        // Try matching against screen titles (case-insensitive)
        for (const [title, id] of screenTitleToId) {
          if (title.toLowerCase().includes(target) || target.includes(title.toLowerCase())) {
            return id;
          }
        }
        // If it looks like a screenId already (kebab-case), use it directly
        if (/^[a-z0-9-]+$/.test(target)) {
          return target;
        }
      }
    }
  }
  return null;
}

/**
 * Render resolved components into a complete HTML document
 * using the Rebtel design system and component library.
 *
 * Injects:
 * - Rebtel component dispatcher + extra CSS tokens
 * - Interaction CSS and script (button presses, toggles, navigation)
 * - data-navigate-to attributes on components with navigation targets
 */
export function rebtelRenderLayer1(
  components: UIResolvedComponent[],
  layer2Overrides?: UILayer2Override[],
  frameHeight?: number,
  shapes?: CanvasShape[]
): string {
  // Build navigation map: shapeId → target screenId
  const navMap = new Map<string, string>();

  if (shapes) {
    // Build screen title → screenId lookup from the store
    const screens = rebtelDesignStore.getScreens();
    const screenTitleToId = new Map<string, string>();
    for (const s of screens) {
      screenTitleToId.set(s.title, s.screenId);
      screenTitleToId.set(s.screenId, s.screenId);
      // Also index by lowercase
      screenTitleToId.set(s.title.toLowerCase(), s.screenId);
    }

    for (const shape of shapes) {
      // 1. Check meta.navigateTo (from AI-generated flows)
      if (shape.meta?.navigateTo) {
        navMap.set(shape.id, shape.meta.navigateTo as string);
        continue;
      }

      // 2. Check notes for navigation patterns (from canvas editing)
      const comp = components.find(c => c.shapeId === shape.id);
      if (comp && comp.notes.length > 0) {
        const target = parseNavigationFromNotes(comp.notes, screenTitleToId);
        if (target) {
          navMap.set(shape.id, target);
        }
      }
    }
  }

  let html = renderLayer1(
    components,
    REBTEL_DESIGN_SYSTEM,
    layer2Overrides,
    frameHeight,
    {
      dispatcher: renderRebtelComponent,
      extraCSS: REBTEL_COMPONENT_CSS + "\n" + REBTEL_EXTRA_CSS,
    }
  );

  // Inject data-navigate-to on components that have navigation targets.
  //
  // For simple components (button, contactCard, countryRow, etc.),
  // add data-navigate-to on the wrapper div — the interaction script
  // checks ancestors when a button is clicked.
  //
  // For composite components that contain multiple buttons (topUpFlow,
  // homeScreen, etc.), we still put it on the wrapper — the FIRST
  // interactive button click inside will bubble up and find it.
  for (const [shapeId, targetScreenId] of navMap) {
    const marker = `data-shape-id="${shapeId}"`;
    if (html.includes(marker)) {
      html = html.replace(
        marker,
        `${marker} data-navigate-to="${targetScreenId}"`
      );
    }
  }

  // Inject interaction CSS + script before </body>
  const interactionCSS = buildRebtelInteractionCSS();
  const interactionJS = buildRebtelInteractionScript();
  const injection = `<style>${interactionCSS}</style>\n<script>${interactionJS}</script>`;

  if (html.includes("</body>")) {
    html = html.replace("</body>", `${injection}\n</body>`);
  } else {
    html += injection;
  }

  return html;
}
