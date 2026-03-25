// ============================================================
// APHANTASIA for REBTEL — Interaction Handler Hook (Phase 4)
// ============================================================
// React hook that listens for rebtel:* postMessage events from
// the viewport iframe and dispatches navigation / tab actions.
// ============================================================

import { useEffect } from "react";

/**
 * Hook that sets up a window message listener for rebtel:* events.
 *
 * - rebtel:navigate -> calls onNavigate with the screenId
 * - rebtel:tab-change -> logs for now (Phase 5 will wire this)
 */
export function useRebtelInteractionHandler(
  onNavigate: (screenId: string) => void
) {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?.type) return;
      if (typeof e.data.type !== "string") return;
      if (!e.data.type.startsWith("rebtel:")) return;

      switch (e.data.type) {
        case "rebtel:navigate": {
          const { screenId } = e.data;
          if (typeof screenId === "string" && screenId) {
            onNavigate(screenId);
          }
          break;
        }
        case "rebtel:tab-change": {
          // Phase 5 will wire this to actual tab switching
          console.log("[Rebtel] tab-change:", e.data.tabIndex);
          break;
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onNavigate]);
}
