// ============================================================
// APHANTASIA — UIDesignStore
// ============================================================
// Singleton that holds UI mode context: screen description,
// reference design screenshot, extracted design system, and
// inspiration images/URLs.
// Pattern mirrors ContextStore exactly.
// ============================================================

import type { UIDesignSystem, UIInspiration, UIDesignStoreState } from "@/types/uiDesign";
import { persistence } from "@/lib/persistence";

const STORAGE_KEY = "aphantasia:uiDesign";

type UIDesignListener = (state: UIDesignStoreState) => void;

const DEFAULT_STATE: UIDesignStoreState = {
  screenContext: "",
  designContextImage: null,
  extractedDesignSystem: null,
  inspirations: [],
};

class UIDesignStore {
  private state: UIDesignStoreState = { ...DEFAULT_STATE };
  private listeners = new Set<UIDesignListener>();

  constructor() {
    if (typeof window !== "undefined") {
      const saved = persistence.load<UIDesignStoreState>(STORAGE_KEY);
      if (saved) {
        this.state = {
          ...DEFAULT_STATE,
          ...saved,
          // Clear placeholder values — images are session-only
          designContextImage: saved.designContextImage === "__image_present__" ? null : (saved.designContextImage ?? null),
          inspirations: (saved.inspirations ?? []).map((i) => ({
            ...i,
            source: i.source === "__image_present__" ? "" : i.source,
          })),
        };
      }
    }
  }

  /** Re-sync in-memory state from localStorage. */
  rehydrate(): void {
    if (typeof window === "undefined") return;
    const saved = persistence.load<UIDesignStoreState>(STORAGE_KEY);
    if (saved) {
      this.state = {
        ...DEFAULT_STATE,
        ...saved,
        designContextImage: saved.designContextImage === "__image_present__" ? null : (saved.designContextImage ?? null),
        inspirations: (saved.inspirations ?? []).map((i) => ({
          ...i,
          source: i.source === "__image_present__" ? "" : i.source,
        })),
      };
    } else {
      this.state = { ...DEFAULT_STATE };
    }
    this.notify();
  }

  getState(): UIDesignStoreState {
    return this.state;
  }

  setScreenContext(text: string): void {
    this.state = { ...this.state, screenContext: text };
    this.persist();
    this.notify();
  }

  setDesignContextImage(dataUrl: string | null): void {
    this.state = { ...this.state, designContextImage: dataUrl };
    this.persist();
    this.notify();
  }

  setExtractedDesignSystem(ds: UIDesignSystem | null): void {
    this.state = { ...this.state, extractedDesignSystem: ds };
    this.persist();
    this.notify();
  }

  addInspiration(item: UIInspiration): void {
    this.state = {
      ...this.state,
      inspirations: [...this.state.inspirations, item],
    };
    this.persist();
    this.notify();
  }

  removeInspiration(id: string): void {
    this.state = {
      ...this.state,
      inspirations: this.state.inspirations.filter((i) => i.id !== id),
    };
    this.persist();
    this.notify();
  }

  updateInspiration(id: string, updates: Partial<UIInspiration>): void {
    this.state = {
      ...this.state,
      inspirations: this.state.inspirations.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    };
    this.persist();
    this.notify();
  }

  clear(): void {
    this.state = { ...DEFAULT_STATE };
    persistence.remove(STORAGE_KEY);
    this.notify();
  }

  /** Subscribe to state changes. Returns an unsubscribe function. */
  subscribe(listener: UIDesignListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.state));
  }

  private persist(): void {
    // Persist only lightweight fields — exclude base64 image data which can
    // exceed localStorage quota (5MB). Images are session-only; the extracted
    // design system tokens (~2KB) are what we need to survive reloads.
    const { designContextImage, inspirations, ...lightweight } = this.state;
    persistence.save(STORAGE_KEY, {
      ...lightweight,
      // Store a flag that an image was present (for UI state), not the image itself
      designContextImage: designContextImage ? "__image_present__" : null,
      // Strip base64 data from inspirations, keep metadata
      inspirations: inspirations.map(({ source, ...rest }) => ({
        ...rest,
        source: source?.startsWith("data:") ? "__image_present__" : source,
      })),
    });
  }
}

// Singleton — import this wherever UI design state is needed
// Use globalThis to survive HMR module re-evaluation
const GLOBAL_KEY = "__aphantasia_uiDesignStore";

function getOrCreateStore(): UIDesignStore {
  const g = globalThis as Record<string, unknown>;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = new UIDesignStore();
  }
  return g[GLOBAL_KEY] as UIDesignStore;
}

export const uiDesignStore = getOrCreateStore();
