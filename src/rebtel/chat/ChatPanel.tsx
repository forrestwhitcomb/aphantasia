"use client";

// ============================================================
// APHANTASIA for REBTEL — Chat Panel
// ============================================================
// AI-powered chat interface for generating Rebtel screen flows.
// Users describe flows in natural language; the AI generates
// structured JSON that gets materialized as canvas shapes.
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage } from "./types";
import type { RebtelFlow } from "../types";
import { applyFlowToCanvas } from "./chatToCanvas";
import { rebtelDesignStore } from "../store/RebtelDesignStore";

// ── Prompt Suggestions ──────────────────────────────────────

const SUGGESTIONS = [
  "Create a top-up flow for Cuba",
  "Design onboarding screens",
  "Show me a settings page",
  "Build a calling flow",
  "Home screen for active user",
  "Payment method management",
];

// ── Chat Panel Component ────────────────────────────────────

interface ChatPanelProps {
  /** If provided, auto-fires this prompt on mount (from landing page) */
  initialPrompt?: string;
}

export function ChatPanel({ initialPrompt }: ChatPanelProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<RebtelFlow | undefined>();
  const [projectContext, setProjectContext] = useState<string>("");
  const [projectFileName, setProjectFileName] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialPromptFired = useRef(false);

  // Load project context from sessionStorage (set by landing page)
  useEffect(() => {
    const stored = sessionStorage.getItem("rebtel:projectContext");
    const storedName = sessionStorage.getItem("rebtel:projectFileName");
    if (stored) {
      setProjectContext(stored);
      setProjectFileName(storedName || "project.md");
      sessionStorage.removeItem("rebtel:projectContext");
      sessionStorage.removeItem("rebtel:projectFileName");
    }
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".md") && !file.name.endsWith(".txt") && !file.name.endsWith(".markdown")) {
      alert("Please upload a .md or .txt file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) {
        setProjectContext(text);
        setProjectFileName(file.name);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-uploaded
    e.target.value = "";
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}-u`,
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/rebtel/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text.trim(), currentFlow, projectContext: projectContext || undefined }),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));

              if (data.done) {
                if (data.error) {
                  const errorMsg: ChatMessage = {
                    id: `msg-${Date.now()}-e`,
                    role: "assistant",
                    content: `Error: ${data.error}`,
                    timestamp: Date.now(),
                  };
                  setMessages((prev) => [...prev, errorMsg]);
                } else if (data.flow) {
                  const assistantMsg: ChatMessage = {
                    id: `msg-${Date.now()}-a`,
                    role: "assistant",
                    content: `Generated "${data.flow.name}" with ${data.flow.screens.length} screen${data.flow.screens.length === 1 ? "" : "s"}: ${data.flow.screens.map((s: { title: string }) => s.title).join(", ")}`,
                    flow: data.flow,
                    timestamp: Date.now(),
                  };
                  setMessages((prev) => [...prev, assistantMsg]);
                  setCurrentFlow(data.flow);
                }
              }
            } catch {
              // Skip malformed SSE events
            }
          }
        }
      } catch (err) {
        const errorMsg: ChatMessage = {
          id: `msg-${Date.now()}-err`,
          role: "assistant",
          content: `Failed to generate: ${err instanceof Error ? err.message : "Unknown error"}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, currentFlow, projectContext]
  );

  // Auto-fire initial prompt from landing page (once)
  useEffect(() => {
    if (initialPrompt && !initialPromptFired.current && !isLoading) {
      initialPromptFired.current = true;
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, sendMessage, isLoading]);

  const handleApplyFlow = useCallback(
    (flow: RebtelFlow) => {
      const entries = applyFlowToCanvas(flow);
      rebtelDesignStore.setScreens(
        entries.map((e) => ({
          screenId: e.screenId,
          frameId: e.frameId,
          title: e.title,
        }))
      );
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage]
  );

  const isEmpty = messages.length === 0;

  return (
    <div style={styles.container}>
      {/* Header — reset only, no title */}
      {!isEmpty && (
        <div style={styles.header}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button
              onClick={() => {
                setMessages([]);
                setCurrentFlow(undefined);
                setInput("");
                const { getCustomEngine } = require("@/engine/engines/CustomCanvasEngine");
                const engine = getCustomEngine();
                engine.initMobileUIFrame();
                engine.setOutputType("rebtel");
                rebtelDesignStore.clearScreens();
              }}
              style={styles.clearButton}
              title="Clear chat and canvas"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={styles.messageList}>
        {isEmpty && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div style={styles.emptyTitle}>Start designing</div>
            <div style={styles.emptyDesc}>
              Describe a user flow and the AI will generate screens with real Rebtel components.
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={msg.role === "user" ? styles.userMsgRow : styles.assistantMsgRow}
          >
            <div style={msg.role === "user" ? styles.userBubble : styles.assistantBubble}>
              <div style={styles.msgText}>{msg.content}</div>
              {msg.flow && (
                <button
                  style={styles.applyButton}
                  onClick={() => handleApplyFlow(msg.flow!)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Apply to canvas
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={styles.assistantMsgRow}>
            <div style={styles.assistantBubble}>
              <div style={styles.typingIndicator}>
                <span style={{ ...styles.dot, animationDelay: "0ms" }} />
                <span style={{ ...styles.dot, animationDelay: "150ms" }} />
                <span style={{ ...styles.dot, animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {isEmpty && (
        <div style={styles.suggestions}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              style={styles.chip}
              onClick={() => sendMessage(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Project file indicator */}
      {projectFileName && (
        <div style={styles.fileIndicator}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{projectFileName}</span>
          <button
            onClick={() => { setProjectContext(""); setProjectFileName(""); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, color: "inherit", opacity: 0.5 }}
            title="Remove file"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Area */}
      <div style={styles.inputArea}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.txt,.markdown"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        {/* Upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          style={styles.uploadButton}
          title="Upload project brief (.md)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a flow..."
          style={styles.textarea}
          rows={1}
          disabled={isLoading}
        />
        <button
          style={{
            ...styles.sendButton,
            opacity: input.trim() && !isLoading ? 1 : 0.4,
          }}
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      {/* Inline keyframe animation for typing dots */}
      <style>{`
        @keyframes rebtelChatDotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "transparent",
    color: "#1a1a2e",
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: 13,
    overflow: "hidden",
  },
  header: {
    padding: "16px 16px 12px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1a1a2e",
    letterSpacing: "-0.01em",
  },
  headerSub: {
    fontSize: 11,
    color: "rgba(26, 26, 46, 0.45)",
    marginTop: 2,
  },
  messageList: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 12px 0",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: "32px 16px",
    textAlign: "center",
    gap: 8,
    opacity: 0.8,
  },
  emptyIcon: {
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1a1a2e",
  },
  emptyDesc: {
    fontSize: 12,
    color: "rgba(26, 26, 46, 0.5)",
    lineHeight: 1.5,
    maxWidth: 240,
  },
  userMsgRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  userBubble: {
    background: "#1a1a2e",
    color: "#F2E6DC",
    borderRadius: "14px 14px 4px 14px",
    padding: "8px 14px",
    maxWidth: "85%",
    lineHeight: 1.45,
  },
  assistantMsgRow: {
    display: "flex",
    justifyContent: "flex-start",
  },
  assistantBubble: {
    background: "rgba(255, 255, 255, 0.6)",
    color: "#1a1a2e",
    borderRadius: "14px 14px 14px 4px",
    padding: "8px 14px",
    maxWidth: "85%",
    lineHeight: 1.45,
    border: "1px solid rgba(0, 0, 0, 0.06)",
  },
  msgText: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  applyButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    padding: "6px 12px",
    background: "#1a1a2e",
    color: "#F2E6DC",
    border: "none",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  typingIndicator: {
    display: "flex",
    gap: 4,
    padding: "4px 0",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#E84393",
    display: "inline-block",
    animation: "rebtelChatDotBounce 1s ease-in-out infinite",
  },
  suggestions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    padding: "8px 12px 4px",
  },
  chip: {
    padding: "5px 10px",
    background: "rgba(255, 255, 255, 0.5)",
    color: "#1a1a2e",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    borderRadius: 20,
    fontSize: 11,
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  },
  inputArea: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    padding: "8px 12px 12px",
    borderTop: "1px solid rgba(0, 0, 0, 0.06)",
    flexShrink: 0,
  },
  textarea: {
    flex: 1,
    padding: "10px 12px",
    background: "rgba(255, 255, 255, 0.5)",
    color: "#1a1a2e",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    borderRadius: 12,
    fontSize: 13,
    fontFamily: "inherit",
    resize: "none",
    outline: "none",
    lineHeight: 1.4,
    maxHeight: 120,
    overflow: "auto",
  },
  clearButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 10px",
    background: "transparent",
    color: "rgba(26, 26, 46, 0.5)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "inherit",
    flexShrink: 0,
  },
  uploadButton: {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: "rgba(26, 26, 46, 0.4)",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    flexShrink: 0,
    transition: "color 0.15s",
    padding: 0,
  },
  fileIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 12px",
    margin: "0 12px",
    background: "rgba(26, 26, 46, 0.06)",
    borderRadius: 8,
    fontSize: 11,
    color: "rgba(26, 26, 46, 0.6)",
    fontFamily: "inherit",
  },
  sendButton: {
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1a1a2e",
    color: "#F2E6DC",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    flexShrink: 0,
    transition: "opacity 0.15s",
  },
};
