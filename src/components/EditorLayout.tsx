"use client";

import { CanvasView } from "@/engine";
import { PreviewPane } from "./PreviewPane";

export function EditorLayout() {
  return (
    <main className="w-full h-full flex bg-[#090909] overflow-hidden">
      {/* Canvas — left two-thirds */}
      <div className="w-2/3 h-full relative">
        <CanvasView />
      </div>

      {/* Preview pane — right one-third */}
      <div className="w-1/3 h-full border-l border-[#1a1a1a] bg-[#0d0d0d]">
        <PreviewPane />
      </div>
    </main>
  );
}
