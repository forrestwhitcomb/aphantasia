// ============================================================
// APHANTASIA — ReferenceStore
// ============================================================
// Singleton that holds visual references (screenshots, URLs)
// tagged as "style" or "tone" that influence rendering.
// Mirrors the ContextStore pattern exactly.
// ============================================================

import type { ReferenceItem } from "@/types/reference";
import { persistence } from "@/lib/persistence";

const STORAGE_KEY = "aphantasia:references";

type ReferenceListener = (refs: ReferenceItem[]) => void;

class ReferenceStore {
  private references: ReferenceItem[] = [];
  private listeners = new Set<ReferenceListener>();

  constructor() {
    if (typeof window !== "undefined") {
      const saved = persistence.load<ReferenceItem[]>(STORAGE_KEY);
      if (saved && Array.isArray(saved)) {
        this.references = saved;
      }
    }
  }

  /** Re-sync in-memory state from localStorage */
  rehydrate(): void {
    if (typeof window === "undefined") return;
    const saved = persistence.load<ReferenceItem[]>(STORAGE_KEY);
    if (saved && Array.isArray(saved)) {
      this.references = saved;
    } else {
      this.references = [];
    }
    this.notify();
  }

  getReferences(): ReferenceItem[] {
    return [...this.references];
  }

  /** Get only references that have been extracted and are ready */
  getReadyReferences(): ReferenceItem[] {
    return this.references.filter((r) => r.status === "ready" && r.extractedTokens);
  }

  addReference(item: ReferenceItem): void {
    this.references.push(item);
    this.persist();
    this.notify();
  }

  updateReference(id: string, updates: Partial<ReferenceItem>): void {
    const idx = this.references.findIndex((r) => r.id === id);
    if (idx === -1) return;
    this.references[idx] = { ...this.references[idx], ...updates };
    this.persist();
    this.notify();
  }

  removeReference(id: string): void {
    this.references = this.references.filter((r) => r.id !== id);
    this.persist();
    this.notify();
  }

  clearAll(): void {
    this.references = [];
    persistence.remove(STORAGE_KEY);
    this.notify();
  }

  subscribe(listener: ReferenceListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private persist(): void {
    persistence.save(STORAGE_KEY, this.references);
  }

  private notify(): void {
    const snap = [...this.references];
    this.listeners.forEach((l) => l(snap));
  }
}

// Singleton via globalThis (survives HMR)
const GLOBAL_KEY = "__aphantasia_referenceStore";

function getOrCreateStore(): ReferenceStore {
  const g = globalThis as Record<string, unknown>;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = new ReferenceStore();
  }
  return g[GLOBAL_KEY] as ReferenceStore;
}

export const referenceStore = getOrCreateStore();
