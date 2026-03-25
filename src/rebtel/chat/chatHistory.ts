// ============================================================
// APHANTASIA for REBTEL — Chat History Management
// ============================================================
// Manages multi-turn context for AI conversations.
// Sliding window of recent messages, localStorage persistence,
// and formatting for Anthropic messages API.
// ============================================================

import type { ChatMessage } from "./types";

const STORAGE_KEY = "aphantasia:rebtel-chat";
const MAX_MESSAGES = 20;
const MAX_STORAGE_BYTES = 100_000; // 100KB

/**
 * Load chat history from localStorage.
 */
export function loadChatHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const messages: ChatMessage[] = JSON.parse(raw);
    return messages.slice(-MAX_MESSAGES);
  } catch {
    return [];
  }
}

/**
 * Save chat history to localStorage.
 * Prunes oldest messages if storage limit is exceeded.
 */
export function saveChatHistory(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    let toSave = messages.slice(-MAX_MESSAGES);
    let json = JSON.stringify(toSave);

    // Prune if too large (drop oldest messages until under limit)
    while (json.length > MAX_STORAGE_BYTES && toSave.length > 2) {
      toSave = toSave.slice(1);
      json = JSON.stringify(toSave);
    }

    localStorage.setItem(STORAGE_KEY, json);
  } catch {
    // Storage full — try clearing and saving just the last 5
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-5)));
    } catch {
      // Give up silently
    }
  }
}

/**
 * Clear all chat history from localStorage.
 */
export function clearChatHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Format chat history into Anthropic messages API format.
 * Uses a sliding window of the most recent messages.
 * Strips flow data to reduce token count.
 */
export function formatForAPI(
  messages: ChatMessage[],
  windowSize = 10
): Array<{ role: "user" | "assistant"; content: string }> {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-windowSize)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
}
