// ============================================================
// APHANTASIA for REBTEL — Design Store
// ============================================================
// Simplified store that always returns the baked-in Rebtel
// design system. No extraction pipeline needed.
//
// Also tracks active screen + flow state for multi-screen
// prototyping.
// ============================================================

import type { UIDesignSystem, FigmaComponentEntry, ComponentLayoutCSS } from "@/ui-mode/types";
import { REBTEL_DESIGN_SYSTEM } from "../designSystem";
import { buildRebtelRegistry } from "../figmaRegistry";

interface ScreenEntry {
  screenId: string;
  frameId: string;
  title: string;
}

type Listener = () => void;

class RebtelDesignStore {
  private listeners = new Set<Listener>();
  private screens: ScreenEntry[] = [];
  private activeScreenId: string = "";
  private registry: FigmaComponentEntry[] = [];
  private layoutMap: Record<string, ComponentLayoutCSS> = {};
  private figmaConnected: boolean = false;

  // ── Design System ─────────────────────────────────────────

  getEffectiveDesignSystem(): UIDesignSystem {
    return REBTEL_DESIGN_SYSTEM;
  }

  // ── Subscription ──────────────────────────────────────────

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const fn of this.listeners) fn();
  }

  // ── Screen Management ─────────────────────────────────────

  getScreens(): ScreenEntry[] {
    return this.screens;
  }

  getActiveScreenId(): string {
    return this.activeScreenId;
  }

  setActiveScreen(screenId: string) {
    if (this.activeScreenId !== screenId) {
      this.activeScreenId = screenId;
      this.notify();
    }
  }

  setScreens(screens: ScreenEntry[]) {
    this.screens = screens;
    if (screens.length > 0 && !screens.find(s => s.screenId === this.activeScreenId)) {
      this.activeScreenId = screens[0].screenId;
    }
    this.notify();
  }

  addScreen(title: string, frameId: string): ScreenEntry {
    const screenId = `screen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const entry: ScreenEntry = { screenId, frameId, title };
    this.screens.push(entry);
    if (this.screens.length === 1) {
      this.activeScreenId = screenId;
    }
    this.notify();
    return entry;
  }

  clearScreens() {
    this.screens = [];
    this.activeScreenId = "";
    this.notify();
  }

  // ── Figma Registry ────────────────────────────────────────

  setFigmaData(
    rawRegistry: FigmaComponentEntry[],
    layoutMap: Record<string, ComponentLayoutCSS>
  ): void {
    this.registry = buildRebtelRegistry(rawRegistry);
    this.layoutMap = layoutMap;
    this.figmaConnected = true;
    this.notify();
  }

  getRegistry(): FigmaComponentEntry[] {
    return this.registry;
  }

  getLayoutMap(): Record<string, ComponentLayoutCSS> {
    return this.layoutMap;
  }

  isFigmaConnected(): boolean {
    return this.figmaConnected;
  }

  getLayoutForComponent(figmaId: string): ComponentLayoutCSS | undefined {
    return this.layoutMap[figmaId];
  }

  clearFigmaData(): void {
    this.registry = [];
    this.layoutMap = {};
    this.figmaConnected = false;
    this.notify();
  }
}

// Singleton
export const rebtelDesignStore = new RebtelDesignStore();
