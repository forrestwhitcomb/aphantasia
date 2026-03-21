// ============================================================
// APHANTASIA — DNAStore
// ============================================================
// Singleton that holds the current DesignDNA for the project.
// Persists to localStorage. Emits change events for reactivity.
// Separate from ContextStore — different lifecycles.
// ============================================================

import type { DesignDNA, DNASource } from "./DesignDNA";
import { DEFAULT_DNA } from "./DesignDNA";
import { persistence } from "@/lib/persistence";

const STORAGE_KEY = "aphantasia:dna";
const EVENT_NAME = "dna:changed";

type DNAListener = (dna: DesignDNA) => void;

/** Deep partial — allows partial nested objects */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface PersistedDNAState {
  dna: DesignDNA;
  source: DNASource;
}

class DNAStore {
  private dna: DesignDNA = DEFAULT_DNA;
  private source: DNASource = "default";
  private listeners = new Set<DNAListener>();

  constructor() {
    if (typeof window !== "undefined") {
      const saved = persistence.load<PersistedDNAState>(STORAGE_KEY);
      if (saved?.dna) {
        this.dna = saved.dna;
        this.source = saved.source ?? "default";
      }
    }
  }

  /** Get the current DesignDNA */
  getDNA(): DesignDNA {
    return this.dna;
  }

  /** Get how the current DNA was produced */
  getSource(): DNASource {
    return this.source;
  }

  /** Replace the entire DNA */
  setDNA(dna: DesignDNA, source: DNASource = "manual"): void {
    this.dna = dna;
    this.source = source;
    this.persist();
    this.notify();
  }

  /** Deep-merge a partial DNA update into the current DNA */
  merge(partial: DeepPartial<DesignDNA>): void {
    this.dna = deepMergeDNA(this.dna, partial);
    this.source = "manual";
    this.persist();
    this.notify();
  }

  /** Reset to the beautiful default DNA */
  resetToDefault(): void {
    this.dna = DEFAULT_DNA;
    this.source = "default";
    this.persist();
    this.notify();
  }

  /** Re-sync from localStorage (e.g. after HMR or tab switch) */
  rehydrate(): void {
    if (typeof window === "undefined") return;
    const saved = persistence.load<PersistedDNAState>(STORAGE_KEY);
    if (saved?.dna) {
      this.dna = saved.dna;
      this.source = saved.source ?? "default";
    } else {
      this.dna = DEFAULT_DNA;
      this.source = "default";
    }
    this.notify();
  }

  /** Subscribe to DNA changes. Returns an unsubscribe function. */
  subscribe(listener: DNAListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private persist(): void {
    persistence.save(STORAGE_KEY, { dna: this.dna, source: this.source });
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.dna));
    // Also emit a DOM event for cross-component reactivity
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: this.dna }));
    }
  }
}

// ---------------------------------------------------------------------------
// Deep merge utility for nested DNA objects
// ---------------------------------------------------------------------------

function deepMergeDNA(
  base: DesignDNA,
  overrides: DeepPartial<DesignDNA>
): DesignDNA {
  const result = { ...base };

  for (const key of Object.keys(overrides) as (keyof DesignDNA)[]) {
    const val = overrides[key];
    if (val === undefined) continue;

    if (
      typeof val === "object" &&
      val !== null &&
      !Array.isArray(val) &&
      typeof result[key] === "object" &&
      result[key] !== null
    ) {
      // Nested object — merge one level deep
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[key] = { ...(result as any)[key], ...(val as any) };
    } else {
      (result as Record<string, unknown>)[key] = val;
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Singleton — survives HMR
// ---------------------------------------------------------------------------

const GLOBAL_KEY = "__aphantasia_dnaStore";

function getOrCreateStore(): DNAStore {
  const g = globalThis as Record<string, unknown>;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = new DNAStore();
  }
  return g[GLOBAL_KEY] as DNAStore;
}

export const dnaStore = getOrCreateStore();
export { EVENT_NAME as DNA_CHANGED_EVENT };
