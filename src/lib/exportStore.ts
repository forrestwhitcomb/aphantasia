// ============================================================
// APHANTASIA — Export Store
// ============================================================
// Singleton bridge between PreviewPane (writes HTML) and
// DeployModal (reads HTML for export). Follows ContextStore pattern.
// ============================================================

import type { SectionContent } from "@/types/render";

const STORE_KEY = "aphantasia:exportStore";

class ExportStore {
  private html = "";
  private sections: SectionContent[] = [];

  setHTML(html: string): void {
    this.html = html;
  }

  getHTML(): string {
    return this.html;
  }

  setSections(sections: SectionContent[]): void {
    this.sections = sections;
  }

  getSections(): SectionContent[] {
    return this.sections;
  }
}

// Singleton via globalThis (survives HMR)
function getStore(): ExportStore {
  const g = globalThis as unknown as Record<string, ExportStore>;
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = new ExportStore();
  }
  return g[STORE_KEY];
}

export const exportStore = getStore();
