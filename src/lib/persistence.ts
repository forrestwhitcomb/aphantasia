// ============================================================
// APHANTASIA — Persistence Layer
// ============================================================
// All persistence goes through PersistenceAdapter.
// No product code references localStorage directly.
// Swap to Supabase in v1.5 by replacing the adapter implementation.
// ============================================================

export interface PersistenceAdapter {
  save(key: string, value: unknown): void;
  load<T>(key: string): T | null;
  remove(key: string): void;
  clear(): void;
}

class LocalStorageAdapter implements PersistenceAdapter {
  save(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("[persistence] save failed:", e);
    }
  }

  load<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (e) {
      console.warn("[persistence] load failed:", e);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("[persistence] remove failed:", e);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("[persistence] clear failed:", e);
    }
  }
}

// Singleton — import this everywhere persistence is needed
export const persistence: PersistenceAdapter = new LocalStorageAdapter();
