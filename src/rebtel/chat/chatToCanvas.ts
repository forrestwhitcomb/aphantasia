// ============================================================
// APHANTASIA for REBTEL — Chat-to-Canvas Bridge
// ============================================================
// Materializes a RebtelFlow as canvas shapes across multiple
// mobile frames, one per screen.
// ============================================================

import { getCustomEngine } from "@/engine/engines/CustomCanvasEngine";
import type { RebtelFlow, RebtelScreen, RebtelScreenComponent } from "../types";
import { getLegacyMapping } from "../spec/primitives";
import { resolveTemplate, hasTemplate } from "../templates";

const FRAME_W = 393;
const FRAME_GAP = 60;

// Approximate heights for each component type
const COMPONENT_HEIGHTS: Record<string, number> = {
  // Navigation
  appBar: 56,
  rebtelTabBar: 56,
  segmentedNav: 44,
  flowStepper: 48,
  breadcrumb: 32,
  // Content
  contactCard: 72,
  rateCard: 80,
  topUpCard: 96,
  productCard: 220,
  transactionRow: 72,
  balanceWidget: 200,
  countryRow: 56,
  carrierBadge: 40,
  promoCard: 120,
  orderSummary: 280,
  label: 24,
  // Inputs
  phoneInput: 56,
  amountSelector: 140,
  countryPicker: 300,
  pinInput: 64,
  paymentMethod: 64,
  paymentModule: 180,
  // Feedback
  successScreen: 200,
  errorBanner: 48,
  loadingState: 120,
  callStatus: 200,
  // Composite
  topUpFlow: 200,
  callingFlow: 200,
  onboardingFlow: 200,
  settingsGroup: 160,
  rebtelProfileHeader: 160,
  homeScreen: 400,
  // Shared
  button: 48,
  textInput: 48,
  toggle: 44,
  sectionHeader: 40,
  emptyState: 200,
  alert: 48,
  toast: 48,
  bottomSheet: 320,
  rebtelBottomSheet: 320,
  searchBar: 48,
  divider: 1,
};

function getComponentHeight(type: string, variant?: string): number {
  // Special variant-based heights
  if (type === "contactCard" && variant === "compact") return 56;
  if (type === "balanceWidget" && variant === "multi") return 120;
  if (type === "promoCard" && variant === "hero") return 180;
  if (type === "promoCard" && variant === "compact") return 80;
  if (type === "rebtelProfileHeader" && variant === "compact") return 80;
  return COMPONENT_HEIGHTS[type] ?? 60;
}

// ── Screen archetype system ─────────────────────────────────
type ScreenArchetype = "flow" | "main" | "system-message" | "success" | "bottom-sheet";

const ARCHETYPE_GAPS: Record<ScreenArchetype, number> = {
  "flow": 12,
  "main": 12,
  "system-message": 16,
  "success": 16,
  "bottom-sheet": 12,
};

function classifyScreen(components: RebtelScreenComponent[]): ScreenArchetype {
  const types = components.map(c => c.type);
  const hasTabBar = types.includes("rebtelTabBar");
  const hasAppBar = types.includes("appBar");
  const hasSuccessScreen = types.includes("successScreen");
  const hasHeroText = types.includes("heroText");
  const hasBottomSheet = types.includes("bottomSheet") || types.includes("rebtelBottomSheet");
  const hasPaymentModule = types.includes("paymentModule");

  // E) Bottom sheet — explicit sheet component or payment module as checkout overlay
  if (hasBottomSheet) return "bottom-sheet";
  if (hasPaymentModule) {
    const paymentIdx = types.lastIndexOf("paymentModule");
    const contentBefore = types.slice(0, paymentIdx).filter(t =>
      !["appBar", "divider", "sectionHeader"].includes(t)
    );
    if (contentBefore.length >= 1) return "bottom-sheet";
  }

  // D) Success
  if (hasSuccessScreen && !hasAppBar) return "success";

  // B) Main — has tabBar
  if (hasTabBar) return "main";

  // C) System message — heroText + few content components
  if (hasHeroText && !hasTabBar) {
    const contentTypes = types.filter(t =>
      !["appBar", "button", "heroText", "divider", "sectionText"].includes(t)
    );
    if (contentTypes.length <= 2) return "system-message";
  }

  // A) Flow — everything else
  return "flow";
}

const MIN_FRAME_H = 852;

function calculateContentHeight(screen: RebtelScreen, archetype: ScreenArchetype): number {
  const STATUS_BAR = 44;
  const APP_BAR = 56;
  const TAB_BAR = 56;
  const BOTTOM_SAFE = 32;
  const gap = ARCHETYPE_GAPS[archetype];

  let total = STATUS_BAR;
  const hasAppBar = screen.components.some(c => c.type === "appBar");
  const hasTabBar = screen.components.some(c => c.type === "rebtelTabBar");

  if (hasAppBar) total += APP_BAR + gap;

  for (const comp of screen.components) {
    if (comp.type === "appBar" || comp.type === "rebtelTabBar") continue;
    total += getComponentHeight(comp.type, comp.variant) + gap;
  }

  if (hasTabBar) total += TAB_BAR;
  total += BOTTOM_SAFE;

  return total;
}

/**
 * Apply a RebtelFlow to the canvas.
 * Creates one mobile frame per screen, each populated with component shapes.
 */
export function applyFlowToCanvas(flow: RebtelFlow): Array<{ screenId: string; frameId: string; title: string }> {
  const engine = getCustomEngine();

  // Clear existing shapes and frames
  const existingShapes = engine.getShapes();
  for (const shape of existingShapes) {
    engine.deleteShape(shape.id);
  }
  const existingFrames = engine.getAllFrames();
  for (const frame of existingFrames) {
    engine.deleteFrame(frame.id);
  }

  // Set output type to rebtel
  engine.setOutputType("rebtel");

  const screenEntries: Array<{ screenId: string; frameId: string; title: string }> = [];

  // Create one frame per screen with archetype-aware sizing
  for (let i = 0; i < flow.screens.length; i++) {
    const screen = flow.screens[i];
    const archetype = classifyScreen(screen.components);
    const contentHeight = calculateContentHeight(screen, archetype);
    const frameH = Math.max(MIN_FRAME_H, contentHeight);

    const frameX = i * (FRAME_W + FRAME_GAP);
    const frameY = 0;

    const frame = engine.createFrame(frameX, frameY, FRAME_W, frameH, screen.title);

    screenEntries.push({
      screenId: screen.screenId,
      frameId: frame.id,
      title: screen.title,
    });

    // Populate the frame with archetype-aware layout
    layoutScreenComponents(engine, screen, frame.id, frameX, frameY, frameH, archetype);
  }

  // Set the first frame as active
  if (screenEntries.length > 0) {
    engine.setActiveFrame(screenEntries[0].frameId);
  }

  // Zoom to fit all frames
  engine.zoomToFit();

  return screenEntries;
}

/**
 * Layout components inside a frame using archetype-specific composition.
 * StatusBar: y=0..44 (auto-injected by render engine, skip)
 * AppBar: y=44, h=56
 * Content: archetype-dependent gaps and positioning
 * TabBar: pinned to frameH - 56 (on main screens)
 */
function layoutScreenComponents(
  engine: ReturnType<typeof getCustomEngine>,
  screen: RebtelScreen,
  frameId: string,
  frameX: number,
  frameY: number,
  frameH: number,
  archetype: ScreenArchetype
) {
  const STATUS_BAR_H = 44;
  const APP_BAR_H = 56;
  const TAB_BAR_H = 56;
  const BOTTOM_SAFE = 32;
  const gap = ARCHETYPE_GAPS[archetype];

  // Helper to resolve spec for a component
  function resolveComponentSpec(component: RebtelScreenComponent) {
    const mapping = getLegacyMapping(component.type);
    let spec: unknown = undefined;
    let primitive: string | undefined = undefined;
    let template: string | undefined = undefined;
    if (mapping && hasTemplate(mapping.primitive, mapping.template)) {
      primitive = mapping.primitive;
      template = mapping.template;
      spec = resolveTemplate(mapping.primitive, mapping.template, {
        ...component.props,
        label: component.label,
        variant: component.variant,
      });
    }
    return { spec, primitive, template };
  }

  // Helper to emit a shape onto the canvas
  function emitShape(
    component: RebtelScreenComponent,
    shapeY: number,
    height: number,
    extraMeta?: Record<string, unknown>
  ) {
    const { spec, primitive, template } = resolveComponentSpec(component);
    engine.createShape({
      type: "rectangle",
      x: frameX,
      y: frameY + shapeY,
      width: FRAME_W,
      height,
      label: component.label || component.type,
      semanticTag: "unknown",
      isInsideFrame: true,
      primitive,
      template,
      spec,
      meta: {
        uiComponentType: component.type,
        variant: component.variant,
        props: component.props,
        navigateTo: component.navigateTo,
        screenId: screen.screenId,
        frameId,
        ...extraMeta,
      },
    });
  }

  // ── Detect trailing buttons for CTA pinning ──
  const trailingButtons: RebtelScreenComponent[] = [];
  for (let i = screen.components.length - 1; i >= 0; i--) {
    if (screen.components[i].type === "button") trailingButtons.unshift(screen.components[i]);
    else break;
  }
  const pinnedButtons = trailingButtons.slice(-2);
  const pinnedSet = new Set(pinnedButtons);

  // ── Detect bottom-sheet split point ──
  const isPopupSheet = archetype === "bottom-sheet" &&
    screen.components.some(c => c.type === "bottomSheet" || c.type === "rebtelBottomSheet");
  const isCheckoutSheet = archetype === "bottom-sheet" && !isPopupSheet;

  let paymentSplitIdx = -1;
  if (isCheckoutSheet) {
    paymentSplitIdx = screen.components.findIndex(c => c.type === "paymentModule");
  }

  // ── E1: Popup bottom sheet ──
  if (isPopupSheet) {
    const overlayH = Math.round(frameH * 0.45);
    // Emit dark overlay shape
    engine.createShape({
      type: "rectangle",
      x: frameX,
      y: frameY,
      width: FRAME_W,
      height: overlayH,
      label: "overlay",
      semanticTag: "unknown",
      isInsideFrame: true,
      meta: {
        uiComponentType: "overlay",
        isOverlay: true,
        screenId: screen.screenId,
        frameId,
      },
    });
    // Layout sheet components below overlay
    let cursorY = overlayH;
    for (const component of screen.components) {
      const height = getComponentHeight(component.type, component.variant);
      emitShape(component, cursorY, height, { sheetZone: true });
      cursorY += height + gap;
    }
    return;
  }

  // ── Archetype-specific layout ──

  if (archetype === "success") {
    // D) Success — no appBar, content starts at y=100, trailing button at bottom
    let cursorY = 100;
    for (const component of screen.components) {
      if (component.type === "appBar") continue; // skip if accidentally present
      const height = getComponentHeight(component.type, component.variant);
      if (pinnedSet.has(component)) {
        // Pin to bottom
        const pinnedY = frameH - BOTTOM_SAFE - height;
        emitShape(component, pinnedY, height, { pinnedBottom: true });
      } else {
        emitShape(component, cursorY, height);
        cursorY += height + gap;
      }
    }
    return;
  }

  if (archetype === "system-message") {
    // C) System message — center content vertically, pin buttons to bottom
    const appBarBottom = STATUS_BAR_H + APP_BAR_H + gap;
    // Calculate content height (excluding appBar and pinned buttons)
    let contentTotal = 0;
    const contentComponents: RebtelScreenComponent[] = [];
    for (const component of screen.components) {
      if (component.type === "appBar" || pinnedSet.has(component)) continue;
      contentComponents.push(component);
      contentTotal += getComponentHeight(component.type, component.variant) + gap;
    }
    if (contentComponents.length > 0) contentTotal -= gap; // remove trailing gap

    // Available space between appBar and pinned buttons area
    let pinnedHeight = 0;
    for (const btn of pinnedButtons) {
      pinnedHeight += getComponentHeight(btn.type, btn.variant) + gap;
    }
    const available = frameH - appBarBottom - pinnedHeight - BOTTOM_SAFE;
    const startY = appBarBottom + Math.max(0, (available - contentTotal) / 2);

    // Emit appBar
    for (const component of screen.components) {
      if (component.type === "appBar") {
        emitShape(component, STATUS_BAR_H, APP_BAR_H);
      }
    }

    // Emit centered content
    let cursorY = startY;
    for (const component of contentComponents) {
      const height = getComponentHeight(component.type, component.variant);
      emitShape(component, cursorY, height);
      cursorY += height + gap;
    }

    // Emit pinned buttons at bottom
    let btnY = frameH - BOTTOM_SAFE;
    for (let i = pinnedButtons.length - 1; i >= 0; i--) {
      const btn = pinnedButtons[i];
      const height = getComponentHeight(btn.type, btn.variant);
      btnY -= height;
      emitShape(btn, btnY, height, { pinnedBottom: true });
      btnY -= gap;
    }
    return;
  }

  // ── A) Flow, B) Main, E2) Checkout sheet — top-down with pinning ──
  let cursorY = STATUS_BAR_H;

  for (let idx = 0; idx < screen.components.length; idx++) {
    const component = screen.components[idx];
    const isTabBar = component.type === "rebtelTabBar";
    const isAppBar = component.type === "appBar";
    const height = getComponentHeight(component.type, component.variant);

    // E2: Checkout sheet — paymentModule and everything after goes to sheet zone
    if (isCheckoutSheet && idx >= paymentSplitIdx) {
      // Pin sheet zone components to bottom of frame
      // Calculate total sheet zone height first
      const sheetComponents = screen.components.slice(paymentSplitIdx);
      let sheetTotal = 0;
      for (const sc of sheetComponents) {
        sheetTotal += getComponentHeight(sc.type, sc.variant) + gap;
      }
      sheetTotal -= gap; // remove trailing gap

      let sheetY = frameH - BOTTOM_SAFE - sheetTotal;
      for (const sc of sheetComponents) {
        const h = getComponentHeight(sc.type, sc.variant);
        emitShape(sc, sheetY, h, { sheetZone: true });
        sheetY += h + gap;
      }
      break; // done — all remaining components handled
    }

    if (isAppBar) {
      emitShape(component, STATUS_BAR_H, height);
      cursorY = STATUS_BAR_H + height + gap;
    } else if (isTabBar) {
      emitShape(component, frameH - TAB_BAR_H, height);
    } else if (pinnedSet.has(component)) {
      // Flow archetype: pin trailing buttons to bottom
      let btnY = frameH - BOTTOM_SAFE;
      for (let i = pinnedButtons.length - 1; i >= 0; i--) {
        const btn = pinnedButtons[i];
        const h = getComponentHeight(btn.type, btn.variant);
        btnY -= h;
        emitShape(btn, btnY, h, { pinnedBottom: true });
        btnY -= gap;
      }
      break; // pinned buttons are always last
    } else {
      emitShape(component, cursorY, height);
      cursorY += height + gap;
    }
  }
}
