// ============================================================
// Aphantasia/System — Core Types
// ============================================================

export type ComponentType =
  | "Card" | "Section" | "Button" | "Text" | "Input"
  | "Badge" | "Avatar" | "Separator" | "Image"
  | "Dropdown" | "Tabs" | "Toggle" | "Nav"
  | "Table" | "Modal" | "Toast" | "Progress" | "Breadcrumb"
  | "Sidebar" | "Footer" | "Form" | "Chart" | "Skeleton"
  | "Accordion" | "Alert"
  | "__root" | "__row";

export interface Annotation {
  id: string;
  text: string;
  type: "ai" | "note" | "behavior" | "requirement";
  applied?: boolean;
}

export interface SpecNode {
  id: string;
  type: ComponentType;
  variant: string | null;
  props: Record<string, unknown>;
  children: SpecNode[];
  annotations: Annotation[];
  responsiveOverrides?: Record<string, Record<string, unknown>>;
}

export interface CanvasSketch {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  color: string;
  stroke?: string;
}

export interface Breakpoint {
  label: string;
  width: number;
}

export interface Screen {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  viewport: "mobile" | "tablet" | "desktop";
  breakpoints: Breakpoint[];
  root: SpecNode;
}

export interface FlowArrow {
  id: string;
  fromScreen: string;
  toScreen: string;
  label?: string;
}

export interface Project {
  screens: Screen[];
  sketches: CanvasSketch[];
  arrows: FlowArrow[];
}

export interface ProjectMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type ToolMode = "select" | "draw" | "annotate" | "hand";
export type PanelTab = "props" | "variants" | "code" | "system";

export interface EditorState {
  projectMeta: ProjectMeta;
  project: Project;
  tokens: Record<string, string>;
  zoom: number;
  pan: { x: number; y: number };
  tool: ToolMode;
  liveMode: boolean;
  selectedNodeId: string | null;
  activeScreenId: string;
  panelTab: PanelTab;
  showChat: boolean;
  showPalette: boolean;
  editingNodeId: string | null;
  editingProp: string | null;
  colorScheme: "light" | "dark";
  darkTokens: Record<string, string>;
  customTokenKeys: string[];
  previewBreakpoint: string | null;
}

// ── Actions ──────────────────────────────────────────────────

export type EditorAction =
  | { type: "SET_TOOL"; tool: ToolMode }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SET_PAN"; pan: { x: number; y: number } }
  | { type: "TOGGLE_LIVE" }
  | { type: "TOGGLE_CHAT" }
  | { type: "TOGGLE_PALETTE" }
  | { type: "SET_PANEL"; tab: PanelTab }
  | { type: "SELECT_NODE"; id: string | null }
  | { type: "SET_ACTIVE_SCREEN"; id: string }
  | { type: "UPDATE_NODE"; id: string; props: Record<string, unknown> }
  | { type: "SWAP_VARIANT"; id: string; variant: string }
  | { type: "SWAP_TYPE"; id: string; newType: ComponentType; newVariant: string }
  | { type: "ADD_COMPONENT"; screenId: string; node: SpecNode }
  | { type: "ADD_CHILD_COMPONENT"; parentId: string; node: SpecNode }
  | { type: "DELETE_NODE"; id: string }
  | { type: "ADD_ANNOTATION"; nodeId: string; annotation: Annotation }
  | { type: "ADD_SKETCH"; sketch: CanvasSketch }
  | { type: "ADD_SCREEN"; screen: Screen }
  | { type: "UPDATE_TOKEN"; key: string; value: string }
  | { type: "SET_TOKENS"; tokens: Record<string, string> }
  | { type: "RESIZE_SCREEN"; id: string; w: number; h: number }
  | { type: "MOVE_SCREEN"; id: string; x: number; y: number }
  | { type: "MOVE_SCREEN_DONE" }
  | { type: "REORDER_NODE"; nodeId: string; targetParentId: string; insertIndex: number }
  | { type: "LOAD_PROJECT"; state: EditorState }
  | { type: "NEW_PROJECT"; template?: "blank" | "landing" | "dashboard" | "mobile" }
  | { type: "RENAME_PROJECT"; name: string }
  | { type: "ADD_CUSTOM_TOKEN"; key: string; value: string; tokenType: "color" | "size" | "shadow" | "font" }
  | { type: "DELETE_CUSTOM_TOKEN"; key: string }
  | { type: "SET_COLOR_SCHEME"; scheme: "light" | "dark" }
  | { type: "APPLY_THEME_PRESET"; presetKey: string }
  | { type: "SET_DARK_TOKENS"; tokens: Record<string, string> }
  | { type: "SET_RESPONSIVE_OVERRIDE"; nodeId: string; breakpoint: string; props: Record<string, unknown> }
  | { type: "ADD_BREAKPOINT"; screenId: string; breakpoint: Breakpoint }
  | { type: "REMOVE_BREAKPOINT"; screenId: string; breakpointLabel: string }
  | { type: "SET_PREVIEW_BREAKPOINT"; breakpoint: string | null }
  | { type: "SET_NODE_LINK"; nodeId: string; targetScreenId: string | null }
  | { type: "ADD_ARROW"; fromScreen: string; toScreen: string; label?: string }
  | { type: "UPDATE_ARROW"; id: string; changes: Partial<FlowArrow> }
  | { type: "DELETE_ARROW"; id: string }
  | { type: "MARK_ANNOTATION_APPLIED"; nodeId: string; annotationId: string }
  | { type: "START_EDITING"; nodeId: string; prop: string }
  | { type: "STOP_EDITING" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SNAPSHOT" };

// ── Variant definition ───────────────────────────────────────

export interface VariantDef {
  label: string;
  desc?: string;
}

export interface ComponentDef {
  icon: string;
  cat: string;
  variants: Record<string, VariantDef>;
}
