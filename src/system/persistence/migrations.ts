// ============================================================
// Aphantasia/System — Schema Migrations
// ============================================================

import type { StoredProject } from "./storage";

type Migration = (state: unknown) => unknown;

const MIGRATIONS: Record<number, Migration> = {
  1: (s) => s, // initial version — identity
  2: (s: unknown) => {
    const state = s as Record<string, unknown>;
    return {
      ...state,
      customTokenKeys: (state as Record<string, unknown>).customTokenKeys ?? [],
      colorScheme: (state as Record<string, unknown>).colorScheme ?? "light",
      darkTokens: (state as Record<string, unknown>).darkTokens ?? {},
    };
  },
};

export const CURRENT_VERSION = 2;

export function migrate(stored: StoredProject): StoredProject {
  let { version } = stored;
  let state: unknown = stored.state;
  while (version < CURRENT_VERSION) {
    version++;
    const fn = MIGRATIONS[version];
    if (fn) state = fn(state);
  }
  return { ...stored, version, state: state as StoredProject["state"] };
}
