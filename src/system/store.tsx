"use client";

// ============================================================
// Aphantasia/System — Editor State Management
// ============================================================

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
  type Dispatch,
} from "react";
import type {
  EditorState,
  EditorAction,
  SpecNode,
  Screen,
  Annotation,
  CanvasSketch,
  ProjectMeta,
} from "./types";
import { DEFAULT_TOKENS, THEME_PRESETS, validateTokenKey } from "./tokens";
import { makeSpec, uid } from "./registry";

// ── Tree helpers ─────────────────────────────────────────────

function findInTree(node: SpecNode, id: string): SpecNode | null {
  if (node.id === id) return node;
  for (const c of node.children) {
    const found = findInTree(c, id);
    if (found) return found;
  }
  return null;
}

function updateInTree(
  node: SpecNode,
  id: string,
  fn: (n: SpecNode) => SpecNode,
): SpecNode {
  if (node.id === id) return fn(node);
  return {
    ...node,
    children: node.children.map((c) => updateInTree(c, id, fn)),
  };
}

function removeFromTree(node: SpecNode, id: string): SpecNode | null {
  if (node.id === id) return null;
  return {
    ...node,
    children: node.children
      .map((c) => removeFromTree(c, id))
      .filter(Boolean) as SpecNode[],
  };
}

function findParentOf(root: SpecNode, childId: string): SpecNode | null {
  for (const c of root.children) {
    if (c.id === childId) return root;
    const found = findParentOf(c, childId);
    if (found) return found;
  }
  return null;
}

// ── Breakpoint defaults ─────────────────────────────────────

import type { Breakpoint } from "./types";

function defaultBreakpoints(viewport: "mobile" | "tablet" | "desktop"): Breakpoint[] {
  if (viewport === "desktop") return [{ label: "Desktop", width: 1280 }, { label: "Tablet", width: 834 }, { label: "Mobile", width: 393 }];
  if (viewport === "tablet") return [{ label: "Tablet", width: 834 }, { label: "Mobile", width: 393 }];
  return [{ label: "Mobile", width: 393 }];
}

// ── Demo data ────────────────────────────────────────────────

function createDemoProject(): EditorState {
  const landingRoot: SpecNode = {
    id: uid(),
    type: "__root",
    variant: null,
    props: {},
    children: [
      makeSpec("Nav", "top", { brand: "Aphantasia" }),
      makeSpec("Section", "hero"),
      makeSpec("Section", "stats"),
      makeSpec("Section", "features"),
      makeSpec("Section", "cta"),
    ],
    annotations: [],
  };

  const pricingRoot: SpecNode = {
    id: uid(),
    type: "__root",
    variant: null,
    props: {},
    children: [
      makeSpec("Nav", "top", { brand: "Aphantasia" }),
      {
        id: uid(),
        type: "Section",
        variant: "cta",
        props: { align: "center", paddingY: "32px", bg: "bg.page" },
        children: [
          { id: uid(), type: "Text", variant: "h1", props: { content: "Simple Pricing" }, children: [], annotations: [] },
          { id: uid(), type: "Text", variant: "p", props: { content: "Start free, upgrade when you're ready." }, children: [], annotations: [] },
        ],
        annotations: [],
      },
      {
        id: uid(),
        type: "__row",
        variant: null,
        props: { gap: "24px", padding: "0 80px", align: "stretch" },
        children: [
          (() => {
            const c = makeSpec("Card", "pricing");
            c.children[0].props.label = "Starter";
            c.children[1].props.content = "Free";
            c.children[2].props.content = "For individuals";
            c.children[5].props.label = "Try Free";
            c.children[5].variant = "outline";
            return c;
          })(),
          makeSpec("Card", "pricing"),
          (() => {
            const c = makeSpec("Card", "pricing");
            c.children[0].props.label = "Enterprise";
            c.children[1].props.content = "$99/mo";
            c.children[2].props.content = "For teams";
            c.children[5].props.label = "Contact Sales";
            c.children[5].variant = "secondary";
            return c;
          })(),
        ],
        annotations: [],
      },
    ],
    annotations: [],
  };

  const mobileRoot: SpecNode = {
    id: uid(),
    type: "__root",
    variant: null,
    props: {},
    children: [
      makeSpec("Nav", "top", { brand: "Aphantasia" }),
      {
        id: uid(), type: "Section", variant: null,
        props: { paddingY: "24px", align: "left" },
        children: [
          { id: uid(), type: "Text", variant: "h2", props: { content: "Welcome back" }, children: [], annotations: [] },
          { id: uid(), type: "Text", variant: "p", props: { content: "Your projects are waiting." }, children: [], annotations: [] },
        ],
        annotations: [],
      },
      makeSpec("Card", "stat"),
      makeSpec("Card", "profile"),
      makeSpec("Card", "info"),
    ],
    annotations: [],
  };

  const now = new Date().toISOString();
  return {
    projectMeta: { id: uid(), name: "Landing Page", createdAt: now, updatedAt: now },
    project: {
      screens: [
        { id: "s1", name: "Landing Page", x: 100, y: 80, w: 1280, h: 960, viewport: "desktop", breakpoints: defaultBreakpoints("desktop"), root: landingRoot },
        { id: "s2", name: "Pricing", x: 100, y: 1140, w: 1280, h: 680, viewport: "desktop", breakpoints: defaultBreakpoints("desktop"), root: pricingRoot },
        { id: "s3", name: "Mobile Home", x: 1500, y: 80, w: 393, h: 852, viewport: "mobile", breakpoints: defaultBreakpoints("mobile"), root: mobileRoot },
      ],
      sketches: [
        { id: "sk1", x: 2000, y: 100, w: 260, h: 160, text: "Ideas:\n— Dark mode toggle\n— Testimonials section\n— Mobile breakpoints\n— Figma import flow", color: "#fef9c3", stroke: undefined },
      ],
      arrows: [
        { id: "a1", fromScreen: "s1", toScreen: "s2", label: "Pricing →" },
      ],
    },
    tokens: { ...DEFAULT_TOKENS },
    zoom: 0.45,
    pan: { x: 30, y: 30 },
    tool: "select",
    liveMode: false,
    selectedNodeId: null,
    activeScreenId: "s1",
    panelTab: "props",
    showChat: false,
    showPalette: true,
    editingNodeId: null,
    editingProp: null,
    colorScheme: "light",
    darkTokens: { ...THEME_PRESETS.dark.tokens },
    customTokenKeys: [],
    previewBreakpoint: null,
  };
}

function createBlankProject(): EditorState {
  const now = new Date().toISOString();
  const screenId = uid();
  const root: SpecNode = { id: uid(), type: "__root", variant: null, props: {}, children: [makeSpec("Nav", "top", { brand: "My App" })], annotations: [] };
  return {
    projectMeta: { id: uid(), name: "Untitled", createdAt: now, updatedAt: now },
    project: {
      screens: [{ id: screenId, name: "Screen 1", x: 100, y: 80, w: 1280, h: 800, viewport: "desktop", breakpoints: defaultBreakpoints("desktop"), root }],
      sketches: [],
      arrows: [],
    },
    tokens: { ...DEFAULT_TOKENS },
    zoom: 0.55,
    pan: { x: 30, y: 30 },
    tool: "select",
    liveMode: false,
    selectedNodeId: null,
    activeScreenId: screenId,
    panelTab: "props",
    showChat: false,
    showPalette: true,
    editingNodeId: null,
    editingProp: null,
    colorScheme: "light",
    darkTokens: { ...THEME_PRESETS.dark.tokens },
    customTokenKeys: [],
    previewBreakpoint: null,
  };
}

// ── Reducer ──────────────────────────────────────────────────

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_TOOL":
      return { ...state, tool: action.tool };
    case "SET_ZOOM":
      return { ...state, zoom: Math.max(0.1, Math.min(3, action.zoom)) };
    case "SET_PAN":
      return { ...state, pan: action.pan };
    case "TOGGLE_LIVE":
      return { ...state, liveMode: !state.liveMode, selectedNodeId: state.liveMode ? state.selectedNodeId : null };
    case "TOGGLE_CHAT":
      return { ...state, showChat: !state.showChat, showPalette: state.showChat ? state.showPalette : false };
    case "TOGGLE_PALETTE":
      return { ...state, showPalette: !state.showPalette };
    case "SET_PANEL":
      return { ...state, panelTab: action.tab };
    case "SELECT_NODE":
      return { ...state, selectedNodeId: action.id };
    case "SET_ACTIVE_SCREEN":
      return { ...state, activeScreenId: action.id };

    case "UPDATE_NODE":
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => ({
            ...s,
            root: updateInTree(s.root, action.id, (n) => ({
              ...n,
              props: { ...n.props, ...action.props },
            })),
          })),
        },
      };

    case "SWAP_VARIANT": {
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => {
            const found = findInTree(s.root, action.id);
            if (!found) return s;
            const replacement = makeSpec(found.type, action.variant);
            replacement.id = found.id;
            replacement.annotations = found.annotations;
            return { ...s, root: updateInTree(s.root, action.id, () => replacement) };
          }),
        },
      };
    }

    case "SWAP_TYPE": {
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => {
            const found = findInTree(s.root, action.id);
            if (!found) return s;
            const replacement = makeSpec(action.newType, action.newVariant);
            // Preserve id + annotations across the type change; everything
            // else (props, children) comes from the new type's factory.
            replacement.id = found.id;
            replacement.annotations = found.annotations;
            return { ...s, root: updateInTree(s.root, action.id, () => replacement) };
          }),
        },
      };
    }

    case "ADD_COMPONENT": {
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => {
            if (s.id !== action.screenId) return s;
            return {
              ...s,
              root: { ...s.root, children: [...s.root.children, action.node] },
            };
          }),
        },
        selectedNodeId: action.node.id,
        panelTab: "props",
      };
    }

    case "ADD_CHILD_COMPONENT": {
      // Append the new node as a child of the parentId, found anywhere in the tree.
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => ({
            ...s,
            root: updateInTree(s.root, action.parentId, (p) => ({
              ...p,
              children: [...p.children, action.node],
            })),
          })),
        },
        selectedNodeId: action.node.id,
        panelTab: "props",
      };
    }

    case "DELETE_NODE":
      return {
        ...state,
        selectedNodeId: null,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => ({
            ...s,
            root: removeFromTree(s.root, action.id) || s.root,
          })),
        },
      };

    case "ADD_ANNOTATION":
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => ({
            ...s,
            root: updateInTree(s.root, action.nodeId, (n) => ({
              ...n,
              annotations: [...n.annotations, action.annotation],
            })),
          })),
        },
      };

    case "SET_RESPONSIVE_OVERRIDE":
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => ({
            ...s,
            root: updateInTree(s.root, action.nodeId, (n) => ({
              ...n,
              responsiveOverrides: {
                ...n.responsiveOverrides,
                [action.breakpoint]: { ...(n.responsiveOverrides?.[action.breakpoint] ?? {}), ...action.props },
              },
            })),
          })),
        },
      };

    case "ADD_BREAKPOINT": {
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => {
            if (s.id !== action.screenId) return s;
            if ((s.breakpoints ?? []).some((b) => b.label === action.breakpoint.label)) return s;
            return { ...s, breakpoints: [...(s.breakpoints ?? []), action.breakpoint] };
          }),
        },
      };
    }

    case "REMOVE_BREAKPOINT":
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => {
            if (s.id !== action.screenId) return s;
            return { ...s, breakpoints: (s.breakpoints ?? []).filter((b) => b.label !== action.breakpointLabel) };
          }),
        },
      };

    case "SET_PREVIEW_BREAKPOINT":
      return { ...state, previewBreakpoint: action.breakpoint };

    case "SET_NODE_LINK":
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => ({
            ...s,
            root: updateInTree(s.root, action.nodeId, (n) => ({
              ...n,
              props: action.targetScreenId
                ? { ...n.props, linkTo: action.targetScreenId }
                : (() => { const p = { ...n.props }; delete p.linkTo; return p; })(),
            })),
          })),
        },
      };

    case "ADD_ARROW":
      return {
        ...state,
        project: {
          ...state.project,
          arrows: [...state.project.arrows, { id: uid(), fromScreen: action.fromScreen, toScreen: action.toScreen, label: action.label }],
        },
      };

    case "UPDATE_ARROW":
      return {
        ...state,
        project: {
          ...state.project,
          arrows: state.project.arrows.map((a) => a.id === action.id ? { ...a, ...action.changes } : a),
        },
      };

    case "DELETE_ARROW":
      return {
        ...state,
        project: {
          ...state.project,
          arrows: state.project.arrows.filter((a) => a.id !== action.id),
        },
      };

    case "MARK_ANNOTATION_APPLIED":
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => ({
            ...s,
            root: updateInTree(s.root, action.nodeId, (n) => ({
              ...n,
              annotations: n.annotations.map((a) =>
                a.id === action.annotationId ? { ...a, applied: true } : a,
              ),
            })),
          })),
        },
      };

    case "ADD_SKETCH":
      return {
        ...state,
        project: {
          ...state.project,
          sketches: [...state.project.sketches, action.sketch],
        },
      };

    case "ADD_SCREEN":
      return {
        ...state,
        project: {
          ...state.project,
          screens: [...state.project.screens, action.screen],
        },
        activeScreenId: action.screen.id,
      };

    case "RESIZE_SCREEN": {
      const w = Math.max(320, action.w);
      const h = Math.max(480, action.h);
      const viewport = w <= 428 ? "mobile" : w <= 834 ? "tablet" : "desktop";
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) =>
            s.id === action.id ? { ...s, w, h, viewport } : s,
          ),
        },
      };
    }

    case "MOVE_SCREEN": {
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) =>
            s.id === action.id ? { ...s, x: action.x, y: action.y } : s,
          ),
        },
      };
    }

    case "MOVE_SCREEN_DONE":
      // No state change; the history middleware snapshots on this action so
      // the whole drag collapses into one undo entry.
      return state;

    case "REORDER_NODE": {
      return {
        ...state,
        project: {
          ...state.project,
          screens: state.project.screens.map((s) => {
            // Cycle prevention: don't drop into self or descendant
            const nodeToMove = findInTree(s.root, action.nodeId);
            if (!nodeToMove) return s;
            if (action.nodeId === action.targetParentId) return s;
            if (findInTree(nodeToMove, action.targetParentId)) return s;

            // Check if this is same-parent or cross-parent
            const currentParent = findParentOf(s.root, action.nodeId);
            if (!currentParent) return s;

            if (currentParent.id === action.targetParentId) {
              // Same parent — simple reorder
              return {
                ...s,
                root: updateInTree(s.root, action.targetParentId, (parent) => {
                  const idx = parent.children.findIndex((c) => c.id === action.nodeId);
                  if (idx < 0) return parent;
                  const children = [...parent.children];
                  const [item] = children.splice(idx, 1);
                  const insertAt = action.insertIndex > idx ? action.insertIndex - 1 : action.insertIndex;
                  children.splice(insertAt, 0, item);
                  return { ...parent, children };
                }),
              };
            }

            // Cross-parent: remove from current parent, insert into target
            let movedNode: SpecNode | null = null;
            let root = updateInTree(s.root, currentParent.id, (p) => {
              const idx = p.children.findIndex((c) => c.id === action.nodeId);
              if (idx < 0) return p;
              movedNode = p.children[idx];
              return { ...p, children: p.children.filter((c) => c.id !== action.nodeId) };
            });
            if (!movedNode) return s;
            root = updateInTree(root, action.targetParentId, (p) => {
              const children = [...p.children];
              children.splice(action.insertIndex, 0, movedNode!);
              return { ...p, children };
            });
            return { ...s, root };
          }),
        },
      };
    }

    case "UPDATE_TOKEN":
      return { ...state, tokens: { ...state.tokens, [action.key]: action.value } };

    case "SET_TOKENS":
      return { ...state, tokens: action.tokens };

    case "ADD_CUSTOM_TOKEN": {
      const validation = validateTokenKey(action.key);
      if (!validation.valid) return state;
      if (state.tokens[action.key] !== undefined) return state;
      return {
        ...state,
        tokens: { ...state.tokens, [action.key]: action.value },
        customTokenKeys: [...state.customTokenKeys, action.key],
      };
    }

    case "DELETE_CUSTOM_TOKEN": {
      if (!state.customTokenKeys.includes(action.key)) return state;
      const newTokens = { ...state.tokens };
      delete newTokens[action.key];
      return {
        ...state,
        tokens: newTokens,
        customTokenKeys: state.customTokenKeys.filter((k) => k !== action.key),
      };
    }

    case "SET_COLOR_SCHEME": {
      if (action.scheme === state.colorScheme) return state;
      return {
        ...state,
        colorScheme: action.scheme,
        tokens: state.darkTokens,
        darkTokens: state.tokens,
      };
    }

    case "APPLY_THEME_PRESET": {
      const preset = THEME_PRESETS[action.presetKey];
      if (!preset) return state;
      return { ...state, tokens: { ...preset.tokens } };
    }

    case "SET_DARK_TOKENS":
      return { ...state, darkTokens: action.tokens };

    case "LOAD_PROJECT":
      return action.state;

    case "NEW_PROJECT":
      return action.template === "landing" ? createDemoProject() : createBlankProject();

    case "RENAME_PROJECT":
      return {
        ...state,
        projectMeta: { ...state.projectMeta, name: action.name, updatedAt: new Date().toISOString() },
      };

    case "START_EDITING":
      return { ...state, editingNodeId: action.nodeId, editingProp: action.prop };

    case "STOP_EDITING":
      return { ...state, editingNodeId: null, editingProp: null };

    default:
      return state;
  }
}

// ── History middleware ───────────────────────────────────────

interface HistoryState {
  past: EditorState[];
  present: EditorState;
  future: EditorState[];
}

const SKIP_HISTORY: EditorAction["type"][] = [
  "SET_PAN", "SET_ZOOM", "SET_TOOL", "SELECT_NODE",
  "TOGGLE_LIVE", "TOGGLE_CHAT", "TOGGLE_PALETTE", "SET_PANEL",
  "SET_ACTIVE_SCREEN", "START_EDITING", "STOP_EDITING", "RENAME_PROJECT", "SET_PREVIEW_BREAKPOINT",
  "MOVE_SCREEN", "MOVE_SCREEN_DONE",
];

function historyReducer(history: HistoryState, action: EditorAction): HistoryState {
  if (action.type === "LOAD_PROJECT" || action.type === "NEW_PROJECT") {
    const newPresent = editorReducer(history.present, action);
    return { past: [], present: newPresent, future: [] };
  }
  if (action.type === "UNDO") {
    if (history.past.length === 0) return history;
    const prev = history.past[history.past.length - 1];
    return {
      past: history.past.slice(0, -1),
      present: prev,
      future: [history.present, ...history.future],
    };
  }
  if (action.type === "REDO") {
    if (history.future.length === 0) return history;
    const next = history.future[0];
    return {
      past: [...history.past, history.present],
      present: next,
      future: history.future.slice(1),
    };
  }
  if (action.type === "SNAPSHOT") {
    // Pushes the CURRENT present onto past so the next mutation (run through
    // SKIP_HISTORY) is undoable back to this point. Used to checkpoint before
    // a batch of skip-history actions (e.g. the start of a screen drag).
    return {
      past: [...history.past.slice(-50), history.present],
      present: history.present,
      future: [],
    };
  }

  const newPresent = editorReducer(history.present, action);
  if (newPresent === history.present) return history;

  if (SKIP_HISTORY.includes(action.type)) {
    return { ...history, present: newPresent };
  }

  return {
    past: [...history.past.slice(-50), history.present],
    present: newPresent,
    future: [],
  };
}

// ── Context ──────────────────────────────────────────────────

interface EditorContextValue {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  /** Find a node by ID across all screens */
  findNode: (id: string) => SpecNode | null;
  canUndo: boolean;
  canRedo: boolean;
}

const EditorContext = createContext<EditorContextValue | null>(null);

function initHistory(): HistoryState {
  return { past: [], present: createDemoProject(), future: [] };
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const [history, dispatch] = useReducer(historyReducer, undefined, initHistory);
  const state = history.present;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const findNode = useCallback(
    (id: string) => {
      for (const s of state.project.screens) {
        const found = findInTree(s.root, id);
        if (found) return found;
      }
      return null;
    },
    [state.project.screens],
  );

  const value = useMemo(() => ({ state, dispatch, findNode, canUndo, canRedo }), [state, dispatch, findNode, canUndo, canRedo]);

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be inside EditorProvider");
  return ctx;
}
