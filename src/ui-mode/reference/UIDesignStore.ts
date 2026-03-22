// ============================================================
// APHANTASIA — UI Design Store (New Schema)
// ============================================================
// Singleton: UIDesignSystem with per-source layers (merge order:
// screenshot → website → figma, i.e. Figma wins on conflicts).
// User overrides apply on top of the merged system.
// ============================================================

import type { UIDesignSystem } from "../types";
import { DEFAULT_UI_DESIGN_SYSTEM } from "../defaultDesignSystem";

const STORAGE_KEY = "aphantasia:uiDesignV2";

export type DesignSourceKey = "screenshot" | "website" | "figma";

/** Figma extraction metadata (session-friendly; thumbnail URLs expire). */
export interface FigmaReferenceMeta {
  fileKey: string;
  fileName: string;
  nodeId: string | null;
  nodeName: string | null;
  thumbnailUrl: string | null;
  componentHints: string[];
  syncedAt: number;
}

export interface UIDesignStoreV2State {
  /** Per-source extractions — merged with precedence Figma > Website > Screenshot */
  sourceLayers: {
    screenshot?: UIDesignSystem | null;
    website?: UIDesignSystem | null;
    figma?: UIDesignSystem | null;
  };
  /** Latest Figma sync metadata (cleared when Figma layer cleared) */
  figmaMeta: FigmaReferenceMeta | null;
  /** Merged base + user overrides (computed getters preferred) */
  designSystem: UIDesignSystem;
  /** User overrides (applied on top of merged layers) */
  overrides: Partial<UIDesignSystem> | null;
  /** Base64 thumbnail of reference screenshot (session-only, not persisted) */
  referenceImage: string | null;
  /** True if any source layer has been set */
  isExtracted: boolean;
}

type StoreListener = (state: UIDesignStoreV2State) => void;

class UIDesignStoreV2 {
  private state: UIDesignStoreV2State;
  private listeners = new Set<StoreListener>();

  constructor() {
    this.state = {
      sourceLayers: {},
      figmaMeta: null,
      designSystem: DEFAULT_UI_DESIGN_SYSTEM,
      overrides: null,
      referenceImage: null,
      isExtracted: false,
    };

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved?.sourceLayers || saved?.designSystem?.fonts?.heading) {
            const layers = migrateLayers(saved);
            this.state = {
              sourceLayers: layers,
              figmaMeta: saved.figmaMeta ?? null,
              designSystem: mergeSourceLayers(layers),
              overrides: saved.overrides ?? null,
              referenceImage: null,
              isExtracted: saved.isExtracted ?? hasAnyLayer(layers),
            };
          }
        }
      } catch {
        /* ignore */
      }
      this.state.designSystem = mergeSourceLayers(this.state.sourceLayers);
    }
  }

  getState(): UIDesignStoreV2State {
    return {
      ...this.state,
      designSystem: mergeSourceLayers(this.state.sourceLayers),
    };
  }

  /** Merged layers only (no user overrides) — Figma > Website > Screenshot */
  getMergedDesignSystem(): UIDesignSystem {
    return mergeSourceLayers(this.state.sourceLayers);
  }

  /** Merged layers + user overrides */
  getEffectiveDesignSystem(): UIDesignSystem {
    const merged = mergeSourceLayers(this.state.sourceLayers);
    if (!this.state.overrides) return merged;
    return deepMerge(merged, this.state.overrides);
  }

  /** Replace one source layer and recompute merge */
  setSourceLayer(source: DesignSourceKey, ds: UIDesignSystem): void {
    const next = { ...this.state.sourceLayers, [source]: deepMerge(DEFAULT_UI_DESIGN_SYSTEM, ds) };
    this.state = {
      ...this.state,
      sourceLayers: next,
      designSystem: mergeSourceLayers(next),
      isExtracted: hasAnyLayer(next),
    };
    this.persist();
    this.notify();
  }

  /** Clear a single source (e.g. "use only screenshot") */
  clearSourceLayer(source: DesignSourceKey): void {
    const next = { ...this.state.sourceLayers };
    delete next[source];
    if (source === "figma") {
      this.state = { ...this.state, figmaMeta: null };
    }
    this.state = {
      ...this.state,
      sourceLayers: next,
      designSystem: mergeSourceLayers(next),
      isExtracted: hasAnyLayer(next),
    };
    this.persist();
    this.notify();
  }

  setFigmaMeta(meta: FigmaReferenceMeta | null): void {
    this.state = { ...this.state, figmaMeta: meta };
    this.persist();
    this.notify();
  }

  /** @deprecated Prefer setSourceLayer — sets screenshot layer only */
  setDesignSystem(ds: UIDesignSystem): void {
    this.setSourceLayer("screenshot", ds);
  }

  setReferenceImage(dataUrl: string | null): void {
    this.state = { ...this.state, referenceImage: dataUrl };
    this.notify();
  }

  setOverride(path: string, value: unknown): void {
    const overrides = { ...(this.state.overrides ?? {}) } as Record<string, unknown>;
    setNestedValue(overrides, path, value);
    this.state = { ...this.state, overrides: overrides as Partial<UIDesignSystem> };
    this.persist();
    this.notify();
  }

  clearOverrides(): void {
    this.state = { ...this.state, overrides: null };
    this.persist();
    this.notify();
  }

  reset(): void {
    this.state = {
      sourceLayers: {},
      figmaMeta: null,
      designSystem: DEFAULT_UI_DESIGN_SYSTEM,
      overrides: null,
      referenceImage: null,
      isExtracted: false,
    };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    this.notify();
  }

  subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const snapshot = this.getState();
    this.listeners.forEach((l) => l(snapshot));
  }

  private persist(): void {
    if (typeof window === "undefined") return;
    try {
      const { referenceImage: _r, ...rest } = this.state;
      const persistable = {
        ...rest,
        sourceLayers: stripHeavyFieldsFromLayers(rest.sourceLayers),
        designSystem: mergeSourceLayers(rest.sourceLayers),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      /* localStorage full */
    }
  }
}

function migrateLayers(saved: Record<string, unknown>): UIDesignStoreV2State["sourceLayers"] {
  if (saved.sourceLayers && typeof saved.sourceLayers === "object") {
    return saved.sourceLayers as UIDesignStoreV2State["sourceLayers"];
  }
  const ds = saved.designSystem as UIDesignSystem | undefined;
  if (ds?.fonts?.heading) {
    return { screenshot: deepMerge(DEFAULT_UI_DESIGN_SYSTEM, ds) };
  }
  return {};
}

function hasAnyLayer(layers: UIDesignStoreV2State["sourceLayers"]): boolean {
  return !!(layers.screenshot || layers.website || layers.figma);
}

/** Merge: screenshot < website < figma (later wins per leaf). */
function mergeSourceLayers(
  layers: UIDesignStoreV2State["sourceLayers"]
): UIDesignSystem {
  let base: UIDesignSystem = JSON.parse(JSON.stringify(DEFAULT_UI_DESIGN_SYSTEM));
  if (layers.screenshot) base = deepMerge(base, layers.screenshot);
  if (layers.website) base = deepMerge(base, layers.website);
  if (layers.figma) base = deepMerge(base, layers.figma);
  return base;
}

function stripHeavyFieldsFromLayers(
  layers: UIDesignStoreV2State["sourceLayers"]
): UIDesignStoreV2State["sourceLayers"] {
  const out: UIDesignStoreV2State["sourceLayers"] = {};
  for (const key of ["screenshot", "website", "figma"] as const) {
    const ds = layers[key];
    if (!ds) continue;
    const copy = JSON.parse(JSON.stringify(ds)) as UIDesignSystem;
    if (copy.extractedFrom && copy.extractedFrom.length > 2000) {
      delete copy.extractedFrom;
    }
    out[key] = copy;
  }
  return out;
}

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

const GLOBAL_KEY = "__aphantasia_uiDesignStoreV2";

function getOrCreateStore(): UIDesignStoreV2 {
  const g = globalThis as Record<string, unknown>;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = new UIDesignStoreV2();
  }
  return g[GLOBAL_KEY] as UIDesignStoreV2;
}

export const uiDesignStoreV2 = getOrCreateStore();
