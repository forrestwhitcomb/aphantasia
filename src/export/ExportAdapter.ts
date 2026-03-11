import type { RenderOutput } from "@/render/RenderEngine";

// All export adapters implement this interface
export interface ExportAdapter {
  name: string;
  export(output: RenderOutput, options?: Record<string, unknown>): Promise<void>;
}
