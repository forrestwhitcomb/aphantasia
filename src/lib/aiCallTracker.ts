// ============================================================
// AI Call Tracker — counts API calls to Anthropic endpoints
// ============================================================

type Listener = (stats: AICallStats) => void;

export interface AICallStats {
  extract: number;   // /api/extract calls
  render: number;    // /api/render calls
  total: number;
}

class AICallTracker {
  private stats: AICallStats = { extract: 0, render: 0, total: 0 };
  private listeners = new Set<Listener>();

  get(): AICallStats {
    return { ...this.stats };
  }

  trackExtract() {
    this.stats.extract++;
    this.stats.total++;
    this.notify();
  }

  trackRender() {
    this.stats.render++;
    this.stats.total++;
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
