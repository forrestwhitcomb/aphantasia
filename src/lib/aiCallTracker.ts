// ============================================================
// AI Call Tracker — counts API calls + token usage
// ============================================================

type Listener = (stats: AICallStats) => void;

export interface AICallStats {
  extract: number;   // /api/extract calls
  render: number;    // /api/render + /api/render-v2 calls
  total: number;
  tokensIn: number;  // cumulative input tokens
  tokensOut: number; // cumulative output tokens
}

class AICallTracker {
  private stats: AICallStats = { extract: 0, render: 0, total: 0, tokensIn: 0, tokensOut: 0 };
  private listeners = new Set<Listener>();

  get(): AICallStats {
    return { ...this.stats };
  }

  trackExtract(tokens?: { input: number; output: number }) {
    this.stats.extract++;
    this.stats.total++;
    if (tokens) {
      this.stats.tokensIn += tokens.input;
      this.stats.tokensOut += tokens.output;
    }
    this.notify();
  }

  trackRender(tokens?: { input: number; output: number }) {
    this.stats.render++;
    this.stats.total++;
    if (tokens) {
      this.stats.tokensIn += tokens.input;
      this.stats.tokensOut += tokens.output;
    }
    this.notify();
  }

  /** Add tokens after the fact (when API response arrives with usage data) */
  addTokens(tokens: { input: number; output: number }) {
    this.stats.tokensIn += tokens.input;
    this.stats.tokensOut += tokens.output;
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const snap = this.get();
    this.listeners.forEach((l) => l(snap));
  }
}

export const aiCallTracker = new AICallTracker();
