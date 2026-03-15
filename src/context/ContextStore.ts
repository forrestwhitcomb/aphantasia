// ============================================================
// APHANTASIA — ContextStore
// ============================================================
// Singleton that holds the current StructuredContext.
// Caches the last extracted context and the raw text that produced it.
// Re-extraction only triggers when rawText changes.
// ============================================================

import type { StructuredContext } from "@/types/context";
import { persistence } from "@/lib/persistence";

const STORAGE_KEY = "aphantasia:context";

type ContextListener = (ctx: StructuredContext | null) => void;

interface PersistedContextState {
  context: StructuredContext;
  rawText: string;
}

class ContextStore {
  private context: StructuredContext | null = null;
  private rawText: string = "";
  private listeners = new Set<ContextListener>();

  constructor() {
    // Hydrate from persistence on init (client-side only)
    if (typeof window !== "undefined") {
      const saved = persistence.load<PersistedContextState>(STORAGE_KEY);
      if (saved) {
        this.context = saved.context;
        this.rawText = saved.rawText;
      }
    }
  }

  /** Re-sync in-memory state from localStorage. Clears if storage is empty. */
  rehydrate(): void {
    if (typeof window === "undefined") return;
    const saved = persistence.load<PersistedContextState>(STORAGE_KEY);
    if (saved) {
      this.context = saved.context;
      this.rawText = saved.rawText;
    } else {
      this.context = null;
      this.rawText = "";
    }
    this.notify();
  }

  getContext(): StructuredContext | null {
    return this.context;
  }

  getRawText(): string {
    return this.rawText;
  }

  /** Returns true if rawText differs from what was last extracted */
  isDirty(rawText: string): boolean {
    return rawText.trim() !== this.rawText.trim();
  }

  setContext(ctx: StructuredContext, rawText: string): void {
    this.context = ctx;
    this.rawText = rawText;
    persistence.save(STORAGE_KEY, { context: ctx, rawText });
    this.notify();
  }

  clearContext(): void {
    this.context = null;
    this.rawText = "";
    persistence.remove(STORAGE_KEY);
    this.notify();
  }

  /** Subscribe to context changes. Returns an unsubscribe function. */
  subscribe(listener: ContextListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.context));
  }
}

// Singleton — import this wherever context is needed
// Use globalThis to survive HMR module re-evaluation
const GLOBAL_KEY = "__aphantasia_contextStore";

function getOrCreateStore(): ContextStore {
  const g = globalThis as Record<string, unknown>;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = new ContextStore();
  }
  return g[GLOBAL_KEY] as ContextStore;
}

export const contextStore = getOrCreateStore();
