// ============================================================
// APHANTASIA for REBTEL — Chat Types
// ============================================================

import type { RebtelFlow } from "../types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  /** Parsed flow attached to an assistant message */
  flow?: RebtelFlow;
  timestamp: number;
}
