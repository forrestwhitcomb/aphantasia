// ============================================================
// Aphantasia/System — Persistent Storage
// ============================================================

import type { EditorState } from "../types";

// ── Interfaces ──────────────────────────────────────────────

export interface StoredProject {
  version: number;
  id: string;
  name: string;
  updatedAt: string;
  state: EditorState;
  thumbnail?: string;
}

export interface StorageBackend {
  listProjects(): Promise<StoredProject[]>;
  loadProject(id: string): Promise<StoredProject | null>;
  saveProject(project: StoredProject): Promise<void>;
  deleteProject(id: string): Promise<void>;
}

// ── localStorage backend ────────────────────────────────────

const STORAGE_KEY = "aphantasia-system-projects";

function readAll(): StoredProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredProject[];
  } catch {
    return [];
  }
}

function writeAll(projects: StoredProject[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export const localStorageBackend: StorageBackend = {
  async listProjects() {
    return readAll();
  },

  async loadProject(id: string) {
    return readAll().find((p) => p.id === id) ?? null;
  },

  async saveProject(project: StoredProject) {
    const all = readAll();
    const idx = all.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      all[idx] = project;
    } else {
      all.push(project);
    }
    writeAll(all);
  },

  async deleteProject(id: string) {
    writeAll(readAll().filter((p) => p.id !== id));
  },
};
