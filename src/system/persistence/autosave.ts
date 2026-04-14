// ============================================================
// Aphantasia/System — Autosave Hook
// ============================================================

import { useRef, useEffect, useState, useCallback } from "react";
import type { EditorState } from "../types";
import { localStorageBackend, type StoredProject } from "./storage";
import { CURRENT_VERSION } from "./migrations";

const DEBOUNCE_MS = 2000;

export type SaveStatus = "idle" | "saving" | "saved";

export function useAutosave(state: EditorState, projectId: string, projectName: string) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevProjectRef = useRef<string>("");
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async () => {
    setSaveStatus("saving");
    const stored: StoredProject = {
      version: CURRENT_VERSION,
      id: projectId,
      name: projectName,
      updatedAt: new Date().toISOString(),
      state,
    };
    await localStorageBackend.saveProject(stored);
    setSaveStatus("saved");
    fadeTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
  }, [state, projectId, projectName]);

  useEffect(() => {
    const serialized = JSON.stringify(state.project);
    if (serialized === prevProjectRef.current) return;
    prevProjectRef.current = serialized;

    if (timerRef.current) clearTimeout(timerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    timerRef.current = setTimeout(save, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [state.project, save]);

  return saveStatus;
}
