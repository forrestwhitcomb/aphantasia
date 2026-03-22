// ============================================================
// APHANTASIA — UI Design Store (New Schema)
// ============================================================
// Singleton store for the new UIDesignSystem (D-UI-3 schema).
// Holds the extracted design system, user overrides, and
// reference screenshot. Persists tokens to localStorage.
//
// Pattern: same as the old UIDesignStore but with the new type.
// ============================================================

import type { UIDesignSystem } from "../types";
import { DEFAULT_UI_DESIGN_SYSTEM } from "../defaultDesignSystem";

const STORAGE_KEY = "aphantasia:uiDesignV2";

export interface UIDesignStoreV2State {
  /** The extracted or default design system */
  designSystem: UIDesignSystem;
  /** User overrides (applied on top of extracted system) */
  overrides: Partial<UIDesignSystem> | null;
  /** Base64 thumbnail of reference screenshot (session-only, not persisted) */
  referenceImage: string | null;
  /** Whether the system was extracted from a reference (vs default) */
  isExtracted: boolean;
}

type StoreListener = (state: UIDesignStoreV2State) => void;

class UIDesignStoreV2 {
  private state: UIDesignStoreV2State;
  private listeners = new Set<StoreListener>();

  constructor() {
    this.state = {
      designSystem: DEFAULT_UI_DESIGN_SYSTEM,
      overrides: null,
      referenceImage: null,
      isExtracted: false,
    };

    // Rehydrate from localStorage
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          // Validate it has the new schema shape (check for fonts.heading)
          if (saved?.designSystem?.fonts?.heading) {
            this.state = {
              designSystem: deepMerge(DEFAULT_UI_DESIGN_SYSTEM, saved.designSystem),
              overrides: saved.overrides ?? null,
              referenceImage: null, // images are session-only
              isExtracted: saved.isExtracted ?? false,
            };
          }
        }
      } catch {
        // Corrupted storage — use defaults
      }
    }
  }

  getState(): UIDesignStoreV2State {
    return this.state;
  }

  /** Get the effective design system (base + overrides merged) */
  getEffectiveDesignSystem(): UIDesignSystem {
    if (!this.state.overrides) return this.state.designSystem;
    return deepMerge(this.state.designSystem, this.state.overrides);
  }

  /** Set a fully extracted design system (from screenshot or Figma) */
  setDesignSystem(ds: UIDesignSystem): void {
    this.state = {
      ...this.state,
      designSystem: deepMerge(DEFAULT_UI_DESIGN_SYSTEM, ds),
      isExtracted: true,
    };
    this.persist();
    this.notify();
  }

  /** Set the reference screenshot (session-only, not persisted) */
  setReferenceImage(dataUrl: string | null): void {
    this.state = { ...this.state, referenceImage: dataUrl };
    this.notify(); // Don't persist — images are session-only
  }

  /** Apply a partial override (user clicked a color swatch, changed a font, etc.) */
  setOverride(path: string, value: unknown): void {
    const overrides = { ...(this.state.overrides ?? {}) } as Record<string, unknown>;
    setNestedValue(overrides, path, value);
    this.state = { ...this.state, overrides: overrides as Partial<UIDesignSystem> };
    this.persist();
    this.notify();
  }

  /** Clear all overrides */
  clearOverrides(): void {
    this.state = { ...this.state, overrides: null };
    this.persist();
    this.notify();
  }

  /** Reset to default design system */
  reset(): void {
    this.state = {
      designSystem: DEFAULT_UI_DESIGN_SYSTEM,
      overrides: null,
      referenceImage: null,
      isExtracted: false,
    };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
    this.notify();
  }

  subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.state));
  }

  private persist(): void {
    if (typeof window === "undefined") return;
    try {
      const { referenceImage, ...persistable } = this.state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      // localStorage full — skip
    }
  }
}

// ── Helpers ──────────────────────────────────────────────────

/** Deep merge b into a (b wins on conflicts) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge<T>(a: T, b: Partial<T>): T {
  const result = { ...a } as Record<string, unknown>;
  for (const key of Object.keys(b)) {
    const bVal = (b as Record<string, unknown>)[key];
    const aVal = result[key];
    if (
      bVal !== null &&
      bVal !== undefined &&
      typeof bVal === "object" &&
      !Array.isArray(bVal) &&
      typeof aVal === "object" &&
      aVal !== null &&
      !Array.isArray(aVal)
    ) {
      result[key] = deepMerge(
        aVal as Record<string, unknown>,
        bVal as Record<string, unknown>
      );
    } else if (bVal !== undefined) {
      result[key] = bVal;
    }
  }
  return result as T;
}

/** Set a nested value by dot-separated path, e.g. "colors.primary" */
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]] || typeof current[parts[i]] !== "object") {
      current[parts[i]] = {};
    }
    current = current[parts[i]] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}

// ── Singleton ────────────────────────────────────────────────

const GLOBAL_KEY = "__aphantasia_uiDesignStoreV2";

function getOrCreateStore(): UIDesignStoreV2 {
  const g = globalThis as Record<string, unknown>;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = new UIDesignStoreV2();
  }
  return g[GLOBAL_KEY] as UIDesignStoreV2;
}

export const uiDesignStoreV2 = getOrCreateStore();
