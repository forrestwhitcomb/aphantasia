// ============================================================
// APHANTASIA for REBTEL — Chat-to-Canvas Bridge
// ============================================================
// Materializes a RebtelFlow as canvas shapes across multiple
// mobile frames, one per screen.
// ============================================================

import { getCustomEngine } from "@/engine/engines/CustomCanvasEngine";
import type { RebtelFlow, RebtelScreen, RebtelScreenComponent } from "../types";

const FRAME_W = 393;
const FRAME_H = 852;
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
  transactionRow: 64,
  balanceWidget: 80,
  countryRow: 56,
  carrierBadge: 40,
  promoCard: 120,
  // Inputs
  phoneInput: 56,
  amountSelector: 200,
  countryPicker: 56,
  pinInput: 64,
  paymentMethod: 64,
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
  toggle: 32,
  sectionHeader: 40,
  emptyState: 200,
  alert: 48,
  toast: 48,
  bottomSheet: 300,
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

  // Create one frame per screen
  for (let i = 0; i < flow.screens.length; i++) {
    const screen = flow.screens[i];
    const frameX = i * (FRAME_W + FRAME_GAP);
    const frameY = 0;

    const frame = engine.createFrame(frameX, frameY, FRAME_W, FRAME_H, screen.title);

    screenEntries.push({
      screenId: screen.screenId,
      frameId: frame.id,
      title: screen.title,
    });

    // Populate the frame with component shapes
    layoutScreenComponents(engine, screen, frame.id, frameX, frameY);
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
 * Layout components vertically inside a frame.
 * StatusBar: y=0..44 (auto-injected by render engine, skip)
 * AppBar: y=44, h=56
 * Content: starts at y=108, stacked with 8px gaps
 * TabBar: y=796, h=56 (on main screens)
 */
function layoutScreenComponents(
  engine: ReturnType<typeof getCustomEngine>,
  screen: RebtelScreen,
  frameId: string,
  frameX: number,
  frameY: number
) {
  const STATUS_BAR_H = 44;
  const CONTENT_GAP = 8;
  const TAB_BAR_Y = 796;

  let cursorY = STATUS_BAR_H; // Start below status bar

  for (const component of screen.components) {
    const isTabBar = component.type === "rebtelTabBar";
    const isAppBar = component.type === "appBar";
    const height = getComponentHeight(component.type, component.variant);

    let shapeY: number;
    if (isAppBar) {
      // AppBar always at top, right after status bar
      shapeY = STATUS_BAR_H;
      cursorY = STATUS_BAR_H + height + CONTENT_GAP;
    } else if (isTabBar) {
      // TabBar always at bottom
      shapeY = TAB_BAR_Y;
    } else {
      // Content components stack sequentially
      shapeY = cursorY;
      cursorY += height + CONTENT_GAP;
    }

    engine.createShape({
      type: "rectangle",
      x: frameX,
      y: frameY + shapeY,
      width: FRAME_W,
      height,
      label: component.label || component.type,
      semanticTag: "unknown",
      isInsideFrame: true,
      meta: {
        uiComponentType: component.type,
        variant: component.variant,
        props: component.props,
        navigateTo: component.navigateTo,
        screenId: screen.screenId,
        frameId,
      },
    });
  }
}
