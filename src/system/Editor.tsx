"use client";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useEditor } from "./store";
import { LiveRenderer } from "./Renderer";
import { REGISTRY, PALETTE_CATEGORIES, SCREEN_ARCHETYPES, makeSpec, recognizeShape, uid } from "./registry";
import { TOKEN_GROUPS, THEME_PRESETS, BUILT_IN_KEYS, DEFAULT_TOKENS, validateTokenKey } from "./tokens";
import { specToJSX } from "./codegen";
import { useAutosave } from "./persistence/autosave";
import { localStorageBackend, type StoredProject } from "./persistence/storage";
import { migrate, CURRENT_VERSION } from "./persistence/migrations";
import { callAI, type AIRequest, type SpecNodePatch } from "./ai/service";
import { applyPatches } from "./ai/patches";
import { generateNextJSProject } from "./export/nextjs";
import { buildScreenPayload, buildMultiScreenPayload } from "./export/figma-export";
import type { CanvasSketch, ComponentType, SpecNode } from "./types";
import { MousePointer2, Square, Hand, Play, Pause, MessageSquare, Code2, Plus, Trash2, Rocket, Copy, X, Palette, ChevronRight, Sparkles, Undo2, Redo2, Monitor, Download, FolderOpen, Sun, Moon, Upload, Smartphone } from "lucide-react";
import type { FigmaImportResult } from "./export/figma";

const glass = { background:"rgba(255,255,255,0.72)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.5)", boxShadow:"0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" } as const;
const darkGlass = { background:"rgba(26,26,46,0.92)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.08)", boxShadow:"0 8px 32px rgba(0,0,0,0.4)" } as const;

// Font stack options for the font.* token dropdowns in the System panel.
// Note: these fonts won't visually render in the editor preview unless installed
// locally or loaded via <link> tags in the host page. The dropdown sets the token
// value correctly and exports correctly — visual rendering is a host-page concern.
const FONT_OPTIONS = [
  "'Inter', system-ui, sans-serif",
  "'Plus Jakarta Sans', system-ui, sans-serif",
  "'DM Sans', system-ui, sans-serif",
  "'Outfit', system-ui, sans-serif",
  "'Poppins', system-ui, sans-serif",
  "'Manrope', system-ui, sans-serif",
  "'Space Grotesk', system-ui, sans-serif",
  "'Sora', system-ui, sans-serif",
  "system-ui, -apple-system, sans-serif",
  "'Georgia', serif",
  "'Playfair Display', serif",
  "'Merriweather', serif",
  "'Lora', serif",
  "'JetBrains Mono', monospace",
  "'Fira Code', monospace",
];

// Pull the first font name out of a CSS font stack for the dropdown label.
// e.g. "'Playfair Display', serif" → "Playfair Display"; "system-ui, -apple-system, sans-serif" → "system-ui".
function fontLabel(stack: string): string {
  const first = stack.split(",")[0].trim();
  return first.replace(/^['"]|['"]$/g, "");
}

export function Editor() {
  const { state, dispatch, findNode, canUndo, canRedo } = useEditor();
  const canvasRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const blobTarget = useRef({ x: 0.7, y: 0.3 });
  const blobCurrent = useRef({ x: 0.7, y: 0.3 });
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const [drawing, setDrawing] = useState<{ x:number; y:number; w:number; h:number } | null>(null);
  const [chatMsgs, setChatMsgs] = useState<Array<{ role:"ai"|"user"|"summary"|"error"; text:string }>>([{ role:"ai", text:"What do you want to build? I generate real components using your design system." }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [annType, setAnnType] = useState<"ai"|"note"|"behavior"|"requirement">("ai");
  const [applyingAnnIds, setApplyingAnnIds] = useState<Set<string>>(new Set());
  const [annInput, setAnnInput] = useState("");
  const [rightPanel, setRightPanel] = useState<"props"|"variants"|"code"|"system"|null>("props");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [changeTypeOpen, setChangeTypeOpen] = useState(false);
  // Shape tag popover — shown after drawing, lets the user confirm/override inference.
  // screenX/screenY are in screen-local (world) coords, anchored near the drawn shape.
  const [shapeTag, setShapeTag] = useState<{ screenId: string; nodeId: string; inferredType: string; inferredVariant: string; screenX: number; screenY: number } | null>(null);
  const [shapeTagDropdownOpen, setShapeTagDropdownOpen] = useState(false);
  const shapeTagTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [viewportOpen, setViewportOpen] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [showNewScreen, setShowNewScreen] = useState(false);
  const [screenGenDesc, setScreenGenDesc] = useState("");
  const [screenGenArch, setScreenGenArch] = useState<string | null>(null);
  const [screenGenLoading, setScreenGenLoading] = useState(false);
  const [savedProjects, setSavedProjects] = useState<StoredProject[]>([]);
  const [tokenSearch, setTokenSearch] = useState("");
  const [addingTokenGroup, setAddingTokenGroup] = useState<string | null>(null);
  const [newTokenKey, setNewTokenKey] = useState("");
  const [newTokenValue, setNewTokenValue] = useState("");
  const [newTokenType, setNewTokenType] = useState<"color"|"size"|"shadow"|"font">("color");
  const [figmaUrl, setFigmaUrl] = useState("");
  const [figmaToken, setFigmaToken] = useState(() => typeof window !== "undefined" ? localStorage.getItem("aphantasia-figma-token") ?? "" : "");
  const [figmaStatus, setFigmaStatus] = useState<"" | "connecting" | "extracting" | "mapping" | "error">("");
  const figmaLoading = figmaStatus === "connecting" || figmaStatus === "extracting" || figmaStatus === "mapping";
  const figmaStatusText =
    figmaStatus === "connecting" ? "Connecting to Figma..."
    : figmaStatus === "extracting" ? "Extracting styles..."
    : figmaStatus === "mapping" ? "Mapping to design system..."
    : "Connect & Import";
  const [figmaResult, setFigmaResult] = useState<FigmaImportResult | null>(null);
  const [figmaError, setFigmaError] = useState("");
  const [showFigmaImport, setShowFigmaImport] = useState(false);
  const [responsiveOpen, setResponsiveOpen] = useState(false);
  const [editingArrowId, setEditingArrowId] = useState<string | null>(null);
  const [figmaExportState, setFigmaExportState] = useState<"idle"|"preparing"|"ready"|"copied"|"error">("idle");
  const [figmaExportError, setFigmaExportError] = useState("");
  const figmaClipRef = useRef<string>("");
  const [arrowLabelInput, setArrowLabelInput] = useState("");
  const [responsiveTab, setResponsiveTab] = useState<string | null>(null);
  const resizing = useRef<{ edge: "right" | "bottom" | "corner"; startX: number; startY: number; startW: number; startH: number; screenId: string } | null>(null);
  const draggingScreen = useRef<{ id: string; startX: number; startY: number; screenStartX: number; screenStartY: number } | null>(null);
  const hasLoadedRef = useRef(false);

  // Autosave
  const saveStatus = useAutosave(state, state.projectMeta.id, state.projectMeta.name);

  // Load last project on mount
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    localStorageBackend.listProjects().then(projects => {
      if (projects.length > 0) {
        const latest = projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
        const migrated = migrate(latest);
        dispatch({ type: "LOAD_PROJECT", state: migrated.state });
      }
    });
  }, [dispatch]);

  const loadProjectList = useCallback(() => {
    localStorageBackend.listProjects().then(setSavedProjects);
  }, []);

  const exportProject = useCallback(() => {
    const data: StoredProject = {
      version: CURRENT_VERSION,
      id: state.projectMeta.id,
      name: state.projectMeta.name,
      updatedAt: new Date().toISOString(),
      state,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.projectMeta.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const [exporting, setExporting] = useState(false);
  const exportNextJS = useCallback(async () => {
    setExporting(true);
    try {
      const { default: JSZip } = await import("jszip");
      const exported = generateNextJSProject(state.project, state.tokens, state.darkTokens ?? {});
      const zip = new JSZip();
      for (const [path, content] of Object.entries(exported.files)) {
        zip.file(path, content);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${state.projectMeta.name.replace(/\s+/g, "-").toLowerCase()}-nextjs.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, [state]);

  const selectedNode = useMemo(() => state.selectedNodeId ? findNode(state.selectedNodeId) : null, [state.selectedNodeId, findNode]);
  const activeScreen = state.project.screens.find(s => s.id === state.activeScreenId);
  const codeOutput = activeScreen ? specToJSX(activeScreen.root) : "";

  // Blob animation
  useEffect(() => { let raf:number; const animate = () => { const l=0.025,c=blobCurrent.current,t=blobTarget.current; c.x+=(t.x-c.x)*l; c.y+=(t.y-c.y)*l; if(blobRef.current){ blobRef.current.style.right=`${-(c.x*100-20)+50}%`; blobRef.current.style.top=`${c.y*100-10}%`; } raf=requestAnimationFrame(animate); }; raf=requestAnimationFrame(animate); return()=>cancelAnimationFrame(raf); }, []);
  useEffect(() => { const h=(e:MouseEvent)=>{ blobTarget.current={x:e.clientX/window.innerWidth,y:e.clientY/window.innerHeight}; }; window.addEventListener("mousemove",h); return()=>window.removeEventListener("mousemove",h); }, []);

  // Canvas
  const onWheel = useCallback((e:WheelEvent) => { e.preventDefault(); if(e.ctrlKey||e.metaKey) dispatch({type:"SET_ZOOM",zoom:state.zoom-e.deltaY*.002*state.zoom}); else dispatch({type:"SET_PAN",pan:{x:state.pan.x-e.deltaX,y:state.pan.y-e.deltaY}}); }, [state.zoom,state.pan,dispatch]);
  useEffect(() => { const el=canvasRef.current; if(!el) return; el.addEventListener("wheel",onWheel,{passive:false}); return()=>el.removeEventListener("wheel",onWheel); }, [onWheel]);
  const toWorld = (cx:number,cy:number) => { const r=canvasRef.current!.getBoundingClientRect(); return {x:(cx-r.left-state.pan.x)/state.zoom, y:(cy-r.top-state.pan.y)/state.zoom}; };

  const onDown = (e:React.MouseEvent) => { const t=e.target as HTMLElement; if(state.tool!=="draw"&&!t.dataset.bg&&t!==canvasRef.current) return; if(shapeTag){setShapeTag(null);setShapeTagDropdownOpen(false);if(shapeTagTimeoutRef.current)clearTimeout(shapeTagTimeoutRef.current);} if(state.tool==="draw"){ const p=toWorld(e.clientX,e.clientY); setDrawing({x:p.x,y:p.y,w:0,h:0}); } else { isPanning.current=true; lastMouse.current={x:e.clientX,y:e.clientY}; if(state.tool==="select") dispatch({type:"SELECT_NODE",id:null}); } };
  const onMove = (e:React.MouseEvent) => {
    if (draggingScreen.current) {
      const d = draggingScreen.current;
      const dx = (e.clientX - d.startX) / state.zoom;
      const dy = (e.clientY - d.startY) / state.zoom;
      dispatch({ type: "MOVE_SCREEN", id: d.id, x: d.screenStartX + dx, y: d.screenStartY + dy });
      return;
    }
    if(drawing){ const p=toWorld(e.clientX,e.clientY); setDrawing(d=>d&&({...d,w:p.x-d.x,h:p.y-d.y})); }
    if(isPanning.current){ dispatch({type:"SET_PAN",pan:{x:state.pan.x+(e.clientX-lastMouse.current.x),y:state.pan.y+(e.clientY-lastMouse.current.y)}}); lastMouse.current={x:e.clientX,y:e.clientY}; }
  };
  const onUp = () => {
    if (draggingScreen.current) {
      dispatch({ type: "MOVE_SCREEN_DONE" });
      draggingScreen.current = null;
    }
    if(drawing&&(Math.abs(drawing.w)>20||Math.abs(drawing.h)>20)){
      const x=drawing.w<0?drawing.x+drawing.w:drawing.x, y=drawing.h<0?drawing.y+drawing.h:drawing.y, w=Math.abs(drawing.w), h=Math.abs(drawing.h);
      let inside:typeof state.project.screens[0]|null=null;
      for(const s of state.project.screens){ if(x>=s.x&&y>=s.y&&x+w<=s.x+s.w&&y+h<=s.y+s.h){inside=s;break} }
      if(inside){
        // Hit test: does the drawn shape fall inside an existing top-level child?
        // Heuristic: split the screen's height into N equal slots (one per top-level child),
        // and match by the drawn shape's vertical midpoint. Only treat as a child-drop if
        // the shape is meaningfully smaller than the slot (otherwise it's a sibling).
        const children = inside.root.children;
        let parent: typeof children[0] | null = null;
        if (children.length > 0) {
          const slot = inside.h / children.length;
          const relMidY = (y + h/2) - inside.y;
          const idx = Math.max(0, Math.min(children.length - 1, Math.floor(relMidY / slot)));
          const target = children[idx];
          // Treat as child-drop only if the shape occupies less than ~60% of its slot area
          const slotArea = inside.w * slot;
          if (w * h < slotArea * 0.6) parent = target;
        }
        const { type, variant } = recognizeShape(w, h, {
          frameW: inside.w,
          frameH: inside.h,
          parentType: parent ? parent.type : undefined,
        });
        const newNode = makeSpec(type, variant);
        if (parent) {
          dispatch({ type: "ADD_CHILD_COMPONENT", parentId: parent.id, node: newNode });
        } else {
          dispatch({ type: "ADD_COMPONENT", screenId: inside.id, node: newNode });
        }
        dispatch({ type: "SET_ACTIVE_SCREEN", id: inside.id });
        // Show the shape tag popover anchored near the shape's top-right corner (screen-local coords)
        if (shapeTagTimeoutRef.current) clearTimeout(shapeTagTimeoutRef.current);
        setShapeTag({ screenId: inside.id, nodeId: newNode.id, inferredType: type, inferredVariant: variant, screenX: x - inside.x + w, screenY: y - inside.y + h });
        setShapeTagDropdownOpen(false);
        shapeTagTimeoutRef.current = setTimeout(() => { setShapeTag(null); setShapeTagDropdownOpen(false); }, 4000);
      } else {
        dispatch({type:"ADD_SKETCH",sketch:{id:uid(),x,y,w,h,text:"",color:"transparent",stroke:"rgba(26,26,46,0.2)"}});
      }
    }
    setDrawing(null); isPanning.current=false;
  };

  // Keyboard
  useEffect(() => { const h=(e:KeyboardEvent)=>{ const t=(document.activeElement as HTMLElement)?.tagName; if(t==="INPUT"||t==="TEXTAREA") return; if(e.key==="Escape"&&shapeTag){e.preventDefault();setShapeTag(null);setShapeTagDropdownOpen(false);if(shapeTagTimeoutRef.current)clearTimeout(shapeTagTimeoutRef.current);return;} if((e.metaKey||e.ctrlKey)&&e.key==="z"&&!e.shiftKey){e.preventDefault();dispatch({type:"UNDO"});return;} if((e.metaKey||e.ctrlKey)&&e.key==="z"&&e.shiftKey){e.preventDefault();dispatch({type:"REDO"});return;} if(e.key==="v") dispatch({type:"SET_TOOL",tool:"select"}); if(e.key==="r") dispatch({type:"SET_TOOL",tool:"draw"}); if(e.key==="h") dispatch({type:"SET_TOOL",tool:"hand"}); if((e.key==="Delete"||e.key==="Backspace")&&state.selectedNodeId) dispatch({type:"DELETE_NODE",id:state.selectedNodeId}); }; window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h); });

  // Dismiss shape tag popover when the user selects a different node (e.g. clicks
  // another component in the canvas). Stays open while the just-drawn node is
  // selected so the user has a chance to retag.
  useEffect(() => {
    if (shapeTag && state.selectedNodeId !== shapeTag.nodeId) {
      setShapeTag(null);
      setShapeTagDropdownOpen(false);
      if (shapeTagTimeoutRef.current) clearTimeout(shapeTagTimeoutRef.current);
    }
  }, [state.selectedNodeId, shapeTag]);

  const sendChat = (override?: string) => {
    const m = (override ?? chatInput).trim();
    if (!m || chatLoading) return;
    setChatMsgs(ms => [...ms, { role: "user", text: m }]);
    setChatInput("");
    setChatLoading(true);

    const request: AIRequest = {
      mode: "chat",
      message: m,
      context: {
        activeScreen: activeScreen!,
        selectedNode: selectedNode ?? undefined,
        tokens: state.tokens,
        registry: Object.keys(REGISTRY),
        projectScreenNames: state.project.screens.map(s => s.name),
      },
    };

    const timeout = setTimeout(() => {
      setChatLoading(false);
      setChatMsgs(ms => [...ms, { role: "error", text: "Request timed out — try again." }]);
    }, 30000);

    callAI(request)
      .then(res => {
        clearTimeout(timeout);
        setChatMsgs(ms => [...ms, { role: "ai", text: res.explanation }]);

        if (res.patches.length > 0) {
          const { actions, errors } = applyPatches(res.patches, state);
          for (const action of actions) dispatch(action);

          const counts: Record<string, number> = {};
          for (const p of res.patches) counts[p.op] = (counts[p.op] ?? 0) + 1;
          const parts: string[] = [];
          if (counts.add) parts.push(`Added ${counts.add} component${counts.add > 1 ? "s" : ""}`);
          if (counts.replace) parts.push(`Replaced ${counts.replace}`);
          if (counts.update) parts.push(`Updated ${counts.update} prop${counts.update > 1 ? "s" : ""}`);
          if (counts.delete) parts.push(`Deleted ${counts.delete}`);
          if (counts.reorder) parts.push(`Reordered ${counts.reorder}`);
          if (counts.updateTokens) parts.push(`Updated tokens`);
          if (parts.length > 0) setChatMsgs(ms => [...ms, { role: "summary", text: "\u2713 " + parts.join(" \u00b7 ") }]);
          if (errors.length > 0) setChatMsgs(ms => [...ms, { role: "error", text: errors.join(", ") }]);
        }
      })
      .catch((err) => {
        clearTimeout(timeout);
        const reason = err instanceof Error ? err.message : "Unknown error";
        setChatMsgs(ms => [...ms, { role: "error", text: "Something went wrong \u2014 " + reason }]);
      })
      .finally(() => setChatLoading(false));
  };
  const addAnnotation = (autoApply = false) => {
    if (!annInput.trim() || !state.selectedNodeId) return;
    const id = uid();
    const text = annInput.trim();
    dispatch({ type: "ADD_ANNOTATION", nodeId: state.selectedNodeId, annotation: { id, text, type: annType } });
    setAnnInput("");
    if (autoApply && annType === "ai") applyAnnotation(id, text);
  };

  const applyAnnotation = (annId: string, annText: string) => {
    if (!selectedNode || !activeScreen) return;
    setApplyingAnnIds(s => new Set(s).add(annId));
    callAI({
      mode: "annotation",
      message: annText,
      context: {
        activeScreen: activeScreen,
        selectedNode: selectedNode,
        tokens: state.tokens,
        registry: Object.keys(REGISTRY),
        projectScreenNames: state.project.screens.map(s => s.name),
      },
    })
      .then(res => {
        if (res.patches.length > 0) {
          const { actions } = applyPatches(res.patches, state);
          for (const action of actions) dispatch(action);
        }
        dispatch({ type: "MARK_ANNOTATION_APPLIED", nodeId: selectedNode.id, annotationId: annId });
      })
      .catch((err) => {
        const reason = err instanceof Error ? err.message : "Unknown error";
        setChatMsgs(ms => [...ms, { role: "error", text: "Annotation failed: " + reason }]);
      })
      .finally(() => setApplyingAnnIds(s => { const n = new Set(s); n.delete(annId); return n; }));
  };

  const applyAllAnnotations = () => {
    if (!selectedNode || !activeScreen) return;
    const unapplied = selectedNode.annotations.filter(a => a.type === "ai" && !a.applied);
    if (unapplied.length === 0) return;
    const ids = unapplied.map(a => a.id);
    setApplyingAnnIds(s => { const n = new Set(s); ids.forEach(id => n.add(id)); return n; });
    const message = unapplied.map((a, i) => `${i + 1}. ${a.text}`).join("\n");
    callAI({
      mode: "annotation",
      message: `Apply all these annotations to the selected component:\n${message}`,
      context: {
        activeScreen: activeScreen,
        selectedNode: selectedNode,
        tokens: state.tokens,
        registry: Object.keys(REGISTRY),
        projectScreenNames: state.project.screens.map(s => s.name),
      },
    })
      .then(res => {
        if (res.patches.length > 0) {
          const { actions } = applyPatches(res.patches, state);
          for (const action of actions) dispatch(action);
        }
        for (const id of ids) dispatch({ type: "MARK_ANNOTATION_APPLIED", nodeId: selectedNode.id, annotationId: id });
      })
      .catch(() => {})
      .finally(() => setApplyingAnnIds(s => { const n = new Set(s); ids.forEach(id => n.delete(id)); return n; }));
  };
  const addFromPalette = (type:string,variant:string) => { dispatch({type:"ADD_COMPONENT",screenId:state.activeScreenId,node:makeSpec(type,variant)}); setPaletteOpen(false); };
  const addBlankScreen = () => { const last=state.project.screens[state.project.screens.length-1]; const root:SpecNode={id:uid(),type:"__root",variant:null,props:{},children:[makeSpec("Nav","top",{brand:"New Screen"})],annotations:[]}; dispatch({type:"ADD_SCREEN",screen:{id:uid(),name:`Screen ${state.project.screens.length+1}`,x:last?last.x+last.w+120:100,y:80,w:1280,h:800,viewport:"desktop",breakpoints:[{label:"Desktop",width:1280},{label:"Tablet",width:834},{label:"Mobile",width:393}],root}}); setShowNewScreen(false); };

  const generateScreen = () => {
    if (!screenGenDesc.trim() || screenGenLoading) return;
    setScreenGenLoading(true);
    const arch = screenGenArch ? SCREEN_ARCHETYPES[screenGenArch] : null;
    const w = arch?.w ?? 1280;
    const h = arch?.h ?? 800;
    const viewport = arch?.viewport ?? "desktop";
    const last = state.project.screens[state.project.screens.length - 1];
    const screenId = uid();
    const rootId = uid();
    const root: SpecNode = { id: rootId, type: "__root", variant: null, props: {}, children: [], annotations: [] };
    const screenName = screenGenDesc.trim().substring(0, 30);

    // Create the empty screen first so it's visible on canvas
    const bps = viewport === "desktop" ? [{label:"Desktop",width:w},{label:"Tablet",width:834},{label:"Mobile",width:393}] : viewport === "tablet" ? [{label:"Tablet",width:w},{label:"Mobile",width:393}] : [{label:"Mobile",width:w}];
    const newScreen = { id: screenId, name: screenName, x: last ? last.x + last.w + 120 : 100, y: 80, w, h, viewport, breakpoints: bps, root };
    dispatch({ type: "ADD_SCREEN", screen: newScreen });
    dispatch({ type: "SET_ACTIVE_SCREEN", id: screenId });

    // applyPatches needs a state snapshot that already contains the new screen;
    // `state` is captured from the closure BEFORE the ADD_SCREEN dispatch above.
    const patchState = {
      ...state,
      project: { ...state.project, screens: [...state.project.screens, newScreen] },
      activeScreenId: screenId,
    };

    callAI({
      mode: "chat",
      message: `Create a complete screen for: ${screenGenDesc.trim()}. Target viewport: ${w}×${h} (${viewport}). Generate a full SpecNode tree with Nav, sections, and content. IMPORTANT: use the literal string "${rootId}" as the parentId in all add patches (not a placeholder like <root id>).`,
      context: {
        activeScreen: newScreen,
        tokens: state.tokens,
        registry: Object.keys(REGISTRY),
        projectScreenNames: state.project.screens.map(s => s.name),
      },
    })
      .then(res => {
        setChatMsgs(ms => [...ms, { role: "ai", text: res.explanation || "(no explanation)" }]);
        if (res.patches.length === 0) {
          setChatMsgs(ms => [...ms, { role: "error", text: "Screen generated but AI returned no patches — the screen is empty." }]);
          if (!state.showChat) dispatch({ type: "TOGGLE_CHAT" });
          return;
        }
        const { actions, errors } = applyPatches(res.patches, patchState);
        for (const action of actions) dispatch(action);
        const counts: Record<string, number> = {};
        for (const p of res.patches) counts[p.op] = (counts[p.op] ?? 0) + 1;
        const parts: string[] = [];
        if (counts.add) parts.push(`Added ${counts.add} component${counts.add > 1 ? "s" : ""}`);
        if (counts.replace) parts.push(`Replaced ${counts.replace}`);
        if (counts.update) parts.push(`Updated ${counts.update} prop${counts.update > 1 ? "s" : ""}`);
        if (counts.delete) parts.push(`Deleted ${counts.delete}`);
        if (parts.length > 0) setChatMsgs(ms => [...ms, { role: "summary", text: "\u2713 " + parts.join(" \u00b7 ") }]);
        if (errors.length > 0) {
          setChatMsgs(ms => [...ms, { role: "error", text: `${errors.length} patch${errors.length > 1 ? "es" : ""} rejected: ${errors.join("; ")}` }]);
          if (actions.length === 0 && !state.showChat) dispatch({ type: "TOGGLE_CHAT" });
        }
      })
      .catch((err) => {
        setChatMsgs(ms => [...ms, { role: "error", text: "Screen generation failed: " + (err instanceof Error ? err.message : "Unknown error") }]);
        if (!state.showChat) dispatch({ type: "TOGGLE_CHAT" });
      })
      .finally(() => { setScreenGenLoading(false); setShowNewScreen(false); setScreenGenDesc(""); setScreenGenArch(null); });
  };

  const VIEWPORT_PRESETS = [
    { label: "iPhone 15 Pro", w: 393, h: 852 },
    { label: "iPhone 15 Pro Max", w: 430, h: 932 },
    { label: "iPad", w: 834, h: 1194 },
    { label: "Desktop HD", w: 1280, h: 800 },
    { label: "Desktop FHD", w: 1440, h: 900 },
    { label: "Desktop 4K", w: 1920, h: 1080 },
  ];

  const onResizeStart = (edge: "right" | "bottom" | "corner", screenId: string, screenW: number, screenH: number) => (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    resizing.current = { edge, startX: e.clientX, startY: e.clientY, startW: screenW, startH: screenH, screenId };
    const onMove = (ev: globalThis.MouseEvent) => {
      if (!resizing.current) return;
      const r = resizing.current;
      const dx = (ev.clientX - r.startX) / state.zoom;
      const dy = (ev.clientY - r.startY) / state.zoom;
      const w = r.edge === "bottom" ? r.startW : Math.round(r.startW + dx);
      const h = r.edge === "right" ? r.startH : Math.round(r.startH + dy);
      dispatch({ type: "RESIZE_SCREEN", id: r.screenId, w, h });
    };
    const onUp = () => {
      resizing.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const cursors:{[k:string]:string} = {select:"default",draw:"crosshair",annotate:"crosshair",hand:"grab"};

  return (
    <div style={{width:"100vw",height:"100vh",overflow:"hidden",position:"relative",fontFamily:"'Inter',system-ui,sans-serif"}}>
      {/* Warm gradient background */}
      <div style={{position:"fixed",inset:0,background:"#E2E0E0",zIndex:0}}>
        <div ref={blobRef} style={{position:"absolute",top:"-15%",right:"-10%",width:"78%",height:"102%",background:"radial-gradient(ellipse at center, rgba(255,180,150,0.4) 0%, rgba(230,140,180,0.25) 30%, rgba(180,160,220,0.15) 60%, transparent 80%)",opacity:0.9,pointerEvents:"none",willChange:"top, right"}} />
        <svg style={{position:"absolute",inset:0,pointerEvents:"none",opacity:0.4,mixBlendMode:"overlay"}} width="100%" height="100%"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#grain)"/></svg>
      </div>

      {/* Canvas */}
      <div ref={canvasRef} data-bg="1" onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} style={{position:"fixed",inset:0,zIndex:1,overflow:"hidden",cursor:draggingScreen.current?"grabbing":isPanning.current?"grabbing":cursors[state.tool]}}>
        <div data-bg="1" style={{position:"absolute",left:0,top:0,transformOrigin:"0 0",transform:`translate(${state.pan.x}px,${state.pan.y}px) scale(${state.zoom})`}}>
          {state.project.sketches.map(sk=><div key={sk.id} style={{position:"absolute",left:sk.x,top:sk.y,width:sk.w,height:sk.h,background:sk.color==="transparent"?"transparent":sk.color,border:sk.stroke?`2px solid ${sk.stroke}`:"none",borderRadius:8,padding:sk.text?12:0,fontSize:13,color:"#1a1a2e",fontFamily:"'Inter',system-ui",whiteSpace:"pre-wrap",lineHeight:1.5,pointerEvents:"none"}}>{sk.text}</div>)}
          {drawing&&<div style={{position:"absolute",left:Math.min(drawing.x,drawing.x+drawing.w),top:Math.min(drawing.y,drawing.y+drawing.h),width:Math.abs(drawing.w),height:Math.abs(drawing.h),border:"2px dashed #1a1a2e",borderRadius:4,background:"rgba(26,26,46,0.04)",pointerEvents:"none"}}/>}
          {state.project.screens.map(screen=>(
            <div key={screen.id} style={{position:"absolute",left:screen.x,top:screen.y,width:screen.w}} onMouseDown={e=>{ if(state.tool==="draw") return; e.stopPropagation(); dispatch({type:"SET_ACTIVE_SCREEN",id:screen.id}) }}>
              <div onMouseDown={e=>{
                if(state.tool!=="select"||state.liveMode) return;
                e.stopPropagation();
                // Snapshot the pre-drag state so one Cmd+Z restores the
                // original position. Subsequent MOVE_SCREEN events are
                // skip-history so they don't flood the undo stack.
                dispatch({type:"SNAPSHOT"});
                dispatch({type:"SET_ACTIVE_SCREEN",id:screen.id});
                draggingScreen.current={id:screen.id,startX:e.clientX,startY:e.clientY,screenStartX:screen.x,screenStartY:screen.y};
              }} style={{position:"absolute",top:-26/state.zoom,left:0,fontSize:13,fontFamily:"'Inter',system-ui",color:state.activeScreenId===screen.id?"#1a1a2e":"rgba(26,26,46,0.4)",fontWeight:state.activeScreenId===screen.id?600:400,display:"flex",gap:8,alignItems:"center",whiteSpace:"nowrap",userSelect:"none",cursor:state.tool==="select"&&!state.liveMode?(draggingScreen.current?.id===screen.id?"grabbing":"grab"):"default"}}>{screen.name}<span style={{fontSize:11,opacity:0.4}}>{screen.w}×{screen.h}</span>{state.liveMode&&<span style={{fontSize:10,background:"rgba(16,185,129,0.15)",color:"#059669",padding:"1px 8px",borderRadius:9999,fontWeight:600}}>LIVE</span>}</div>
              <div style={{width:screen.w,height:screen.h,background:state.tokens["bg.page"],borderRadius:12,overflow:"hidden",boxShadow:state.activeScreenId===screen.id?`0 0 0 2px ${state.tokens["brand.primary"]}, 0 12px 40px rgba(0,0,0,0.15)`:"0 4px 24px rgba(0,0,0,0.08)"}}><div style={{width:"100%",height:"100%",overflow:"auto"}}><LiveRenderer node={screen.root} tokens={state.tokens} selectedId={state.selectedNodeId} onSelect={n=>{if(!state.liveMode){dispatch({type:"SELECT_NODE",id:n.id});setRightPanel("props")}}} live={state.liveMode} editingNodeId={state.editingNodeId} editingProp={state.editingProp} dispatch={dispatch}/></div></div>
              {state.activeScreenId===screen.id&&!state.liveMode&&<>
                <div onMouseDown={onResizeStart("right",screen.id,screen.w,screen.h)} style={{position:"absolute",top:0,right:-4,width:8,height:screen.h,cursor:"ew-resize",zIndex:5}}><div style={{position:"absolute",top:"50%",right:2,width:3,height:32,marginTop:-16,borderRadius:2,background:"rgba(37,99,235,0.3)",transition:"background 0.15s"}}/></div>
                <div onMouseDown={onResizeStart("bottom",screen.id,screen.w,screen.h)} style={{position:"absolute",bottom:-4,left:0,width:screen.w,height:8,cursor:"ns-resize",zIndex:5}}><div style={{position:"absolute",left:"50%",bottom:2,width:32,height:3,marginLeft:-16,borderRadius:2,background:"rgba(37,99,235,0.3)",transition:"background 0.15s"}}/></div>
                <div onMouseDown={onResizeStart("corner",screen.id,screen.w,screen.h)} style={{position:"absolute",bottom:-4,right:-4,width:12,height:12,cursor:"nwse-resize",zIndex:6,borderRadius:"0 0 4px 0"}}><div style={{position:"absolute",bottom:2,right:2,width:6,height:6,borderRight:"2px solid rgba(37,99,235,0.4)",borderBottom:"2px solid rgba(37,99,235,0.4)",borderRadius:"0 0 2px 0"}}/></div>
              </>}
              {/* Responsive breakpoint previews */}
              {state.activeScreenId===screen.id&&state.previewBreakpoint!==null&&(screen.breakpoints??[]).length>0&&(()=>{
                const bps = state.previewBreakpoint==="all"
                  ? (screen.breakpoints??[]).filter(bp=>bp.width!==screen.w)
                  : (screen.breakpoints??[]).filter(bp=>bp.label===state.previewBreakpoint&&bp.width!==screen.w);
                let offsetX = screen.w + 40;
                return bps.map(bp=>{
                  const x = offsetX;
                  offsetX += bp.width + 40;
                  return <div key={bp.label} style={{position:"absolute",left:screen.x+x,top:screen.y,width:bp.width}}>
                    <div style={{position:"absolute",top:-26/state.zoom,left:0,fontSize:11,fontFamily:"'Inter',system-ui",color:"rgba(37,99,235,0.6)",fontWeight:500,whiteSpace:"nowrap",userSelect:"none"}}>{bp.label} — {bp.width}px</div>
                    <div style={{width:bp.width,height:screen.h,background:state.tokens["bg.page"],borderRadius:12,overflow:"hidden",boxShadow:"0 4px 24px rgba(0,0,0,0.08)",border:"1px dashed rgba(37,99,235,0.2)"}}>
                      <div style={{width:"100%",height:"100%",overflow:"auto"}}><LiveRenderer node={screen.root} tokens={state.tokens} selectedId={state.selectedNodeId} onSelect={n=>{if(!state.liveMode){dispatch({type:"SELECT_NODE",id:n.id});setRightPanel("props")}}} live={state.liveMode} editingNodeId={state.editingNodeId} editingProp={state.editingProp} dispatch={dispatch} activeBreakpoint={bp.label}/></div>
                    </div>
                  </div>;
                });
              })()}
            </div>
          ))}
          <svg style={{position:"absolute",left:0,top:0,width:"100%",height:"100%",pointerEvents:"none",overflow:"visible"}}>
            <defs>
              <marker id="arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><path d="M0,0 L7,2.5 L0,5" fill="rgba(26,26,46,0.3)"/></marker>
              <marker id="arrow-solid" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><path d="M0,0 L7,2.5 L0,5" fill="rgba(37,99,235,0.5)"/></marker>
            </defs>
            {state.project.arrows.map(arrow=>{
              const from=state.project.screens.find(s=>s.id===arrow.fromScreen),to=state.project.screens.find(s=>s.id===arrow.toScreen);
              if(!from||!to)return null;
              const x1=from.x+from.w/2,y1=from.y+from.h+20,x2=to.x+to.w/2,y2=to.y-20;
              const lx=(x1+x2)/2,ly=(y1+y2)/2-10;
              const hasNodeLink=state.project.screens.some(s=>{const walk=(n:SpecNode):boolean=>{if(n.props.linkTo===arrow.toScreen)return true;return n.children.some(walk);};return s.id===arrow.fromScreen&&walk(s.root)});
              const stroke=hasNodeLink?"rgba(37,99,235,0.35)":"rgba(26,26,46,0.15)";
              const dash=hasNodeLink?undefined:"6 4";
              const marker=hasNodeLink?"url(#arrow-solid)":"url(#arrow)";
              return<g key={arrow.id}>
                <path d={`M${x1},${y1} C${x1},${y1+50} ${x2},${y2-50} ${x2},${y2}`} fill="none" stroke={stroke} strokeWidth="1.5" strokeDasharray={dash} markerEnd={marker}/>
                {arrow.label&&editingArrowId!==arrow.id&&<>
                  <rect x={lx-40} y={ly-10} width="80" height="20" rx="10" fill="rgba(255,255,255,0.85)" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" style={{pointerEvents:"auto",cursor:"pointer"}} onClick={()=>{setEditingArrowId(arrow.id);setArrowLabelInput(arrow.label??"");}} onDoubleClick={()=>dispatch({type:"DELETE_ARROW",id:arrow.id})}/>
                  <text x={lx} y={ly+4} textAnchor="middle" fill="rgba(26,26,46,0.5)" fontSize="11" fontFamily="Inter,system-ui" style={{pointerEvents:"none"}}>{arrow.label}</text>
                </>}
                {!arrow.label&&editingArrowId!==arrow.id&&<circle cx={lx} cy={ly} r="6" fill="rgba(255,255,255,0.7)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" style={{pointerEvents:"auto",cursor:"pointer"}} onClick={()=>{setEditingArrowId(arrow.id);setArrowLabelInput("");}}/>}
              </g>;
            })}
          </svg>
          {editingArrowId&&(()=>{
            const arrow=state.project.arrows.find(a=>a.id===editingArrowId);if(!arrow)return null;
            const from=state.project.screens.find(s=>s.id===arrow.fromScreen),to=state.project.screens.find(s=>s.id===arrow.toScreen);if(!from||!to)return null;
            const x1=from.x+from.w/2,y1=from.y+from.h+20,x2=to.x+to.w/2,y2=to.y-20;
            const lx=(x1+x2)/2*state.zoom+state.pan.x,ly=((y1+y2)/2-10)*state.zoom+state.pan.y;
            return<div style={{position:"absolute",left:lx-50,top:ly-12,zIndex:10,display:"flex",gap:4}}>
              <input autoFocus value={arrowLabelInput} onChange={e=>setArrowLabelInput(e.target.value)} onBlur={()=>{dispatch({type:"UPDATE_ARROW",id:editingArrowId,changes:{label:arrowLabelInput||undefined}});setEditingArrowId(null);}} onKeyDown={e=>{if(e.key==="Enter"){dispatch({type:"UPDATE_ARROW",id:editingArrowId,changes:{label:arrowLabelInput||undefined}});setEditingArrowId(null);}if(e.key==="Escape")setEditingArrowId(null);}} style={{width:80,padding:"3px 8px",borderRadius:8,border:"1px solid rgba(0,0,0,0.1)",background:"#fff",fontSize:11,outline:"none",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}/>
              <button onClick={()=>{dispatch({type:"DELETE_ARROW",id:editingArrowId});setEditingArrowId(null);}} style={{padding:"3px 6px",borderRadius:6,border:"1px solid rgba(220,38,38,0.2)",background:"rgba(220,38,38,0.05)",color:"#dc2626",fontSize:9,fontWeight:600,cursor:"pointer"}}>Del</button>
            </div>;
          })()}
        </div>
      </div>

      {/* Shape tag popover — shown briefly after drawing a component */}
      {shapeTag && (()=>{
        const sc = state.project.screens.find(s=>s.id===shapeTag.screenId);
        if (!sc) return null;
        const worldX = sc.x + shapeTag.screenX;
        const worldY = sc.y + shapeTag.screenY;
        const vx = worldX * state.zoom + state.pan.x;
        const vy = worldY * state.zoom + state.pan.y;
        // Flip above if it would go off the bottom of the viewport
        const fitsBelow = vy + 240 < window.innerHeight;
        const top = fitsBelow ? vy + 8 : Math.max(8, vy - 48 - 240);
        const left = Math.min(Math.max(8, vx + 8), window.innerWidth - 220);
        const regEntry = REGISTRY[shapeTag.inferredType];
        const cancelDismiss = () => { if (shapeTagTimeoutRef.current) clearTimeout(shapeTagTimeoutRef.current); };
        const closeTag = () => { setShapeTag(null); setShapeTagDropdownOpen(false); cancelDismiss(); };
        return <div style={{position:"fixed",left,top,zIndex:150}} onMouseDown={e=>e.stopPropagation()}>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <button onClick={()=>{cancelDismiss();setShapeTagDropdownOpen(o=>!o);}} style={{...glass,borderRadius:10,padding:"4px 12px",height:32,display:"flex",alignItems:"center",gap:8,border:"1px solid rgba(26,26,46,0.1)",cursor:"pointer",fontSize:12,fontWeight:500,color:"#1a1a2e",fontFamily:"inherit"}}>
              {regEntry && <span style={{width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.04)",borderRadius:4,fontSize:11}}>{regEntry.icon}</span>}
              <span>{shapeTag.inferredType}</span>
              <span style={{fontSize:10,color:"rgba(26,26,46,0.4)"}}>▾</span>
            </button>
            <button onClick={closeTag} title="Dismiss" style={{...glass,borderRadius:8,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(26,26,46,0.1)",cursor:"pointer",color:"rgba(26,26,46,0.5)"}}>
              <X size={12}/>
            </button>
          </div>
          {shapeTagDropdownOpen && <div style={{marginTop:6,width:200,maxHeight:260,overflow:"auto",...glass,borderRadius:12,padding:6,border:"1px solid rgba(26,26,46,0.08)"}}>
            {PALETTE_CATEGORIES.map(cat=>{
              const items = Object.entries(REGISTRY).filter(([k,v])=>v.cat===cat.key && k!=="__root" && k!=="__row");
              if (items.length===0) return null;
              return <div key={cat.key} style={{marginBottom:4}}>
                <div style={{padding:"4px 8px 2px",fontSize:9,fontWeight:600,color:"rgba(26,26,46,0.35)",textTransform:"uppercase",letterSpacing:".04em"}}>{cat.label}</div>
                {items.map(([tk,td])=>{
                  const isActive = shapeTag.inferredType===tk;
                  return <div key={tk} onClick={()=>{
                    if (isActive) { setShapeTagDropdownOpen(false); return; }
                    const firstVariant = Object.keys(REGISTRY[tk].variants)[0] ?? "";
                    dispatch({type:"SWAP_TYPE",id:shapeTag.nodeId,newType:tk as ComponentType,newVariant:firstVariant});
                    setShapeTag(t=>t?{...t,inferredType:tk,inferredVariant:firstVariant}:null);
                    setShapeTagDropdownOpen(false);
                  }} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",borderRadius:6,cursor:isActive?"default":"pointer",fontSize:12,color:"#1a1a2e",background:isActive?"rgba(26,26,46,0.06)":"transparent",border:isActive?"1.5px solid rgba(26,26,46,0.2)":"1px solid transparent",marginBottom:2}} onMouseEnter={e=>{if(!isActive)(e.currentTarget as HTMLElement).style.background="rgba(0,0,0,0.04)"}} onMouseLeave={e=>{if(!isActive)(e.currentTarget as HTMLElement).style.background="transparent"}}>
                    <span style={{width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.04)",borderRadius:4,fontSize:11,flexShrink:0}}>{td.icon}</span>
                    <span style={{fontWeight:isActive?600:500}}>{tk}</span>
                  </div>;
                })}
              </div>;
            })}
          </div>}
        </div>;
      })()}

      {/* Chat (top-left glass) */}
      {state.showChat&&<div style={{position:"fixed",top:16,left:16,width:300,maxHeight:"70vh",zIndex:100,...glass,borderRadius:16,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(0,0,0,0.05)"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Sparkles size={14} color="#1a1a2e"/><span style={{fontSize:14,fontWeight:600,color:"#1a1a2e"}}>AI Chat</span></div><button onClick={()=>dispatch({type:"TOGGLE_CHAT"})} style={{background:"rgba(0,0,0,0.05)",border:"none",borderRadius:8,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={14} color="rgba(26,26,46,0.5)"/></button></div>
        <div style={{flex:1,overflow:"auto",padding:12,display:"flex",flexDirection:"column",gap:8}}>
          {chatMsgs.map((m,i)=>{
            if(m.role==="summary") return <div key={i} style={{padding:"6px 10px",borderRadius:8,fontSize:11,lineHeight:1.4,color:"#059669",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.15)",fontWeight:500}}>{m.text}</div>;
            if(m.role==="error") return <div key={i} style={{padding:"8px 10px",borderRadius:10,fontSize:12,lineHeight:1.4,color:"#dc2626",background:"rgba(220,38,38,0.06)",border:"1px solid rgba(220,38,38,0.12)"}}>{m.text}</div>;
            return <div key={i} style={{padding:"9px 12px",borderRadius:12,fontSize:13,lineHeight:1.45,maxWidth:"90%",alignSelf:m.role==="user"?"flex-end":"flex-start",background:m.role==="user"?"#1a1a2e":"rgba(0,0,0,0.04)",color:m.role==="user"?"#E2E0E0":"#1a1a2e",whiteSpace:"pre-wrap"}}>{m.text}</div>;
          })}
          {chatLoading&&<div style={{padding:"9px 12px",borderRadius:12,fontSize:13,alignSelf:"flex-start",background:"rgba(0,0,0,0.04)",color:"rgba(26,26,46,0.4)",display:"flex",gap:3,alignItems:"center"}}><span style={{animation:"pulse 1.2s infinite",animationDelay:"0s"}}>.</span><span style={{animation:"pulse 1.2s infinite",animationDelay:"0.2s"}}>.</span><span style={{animation:"pulse 1.2s infinite",animationDelay:"0.4s"}}>.</span><style>{`@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style></div>}
          {chatMsgs.length===1&&!chatLoading&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
            {["Add a hero section","Create a pricing page","Make the design more modern","Add a contact form"].map(chip=><button key={chip} onClick={()=>sendChat(chip)} style={{padding:"6px 10px",borderRadius:8,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"inherit",color:"#1a1a2e",transition:"background 0.15s"}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="rgba(0,0,0,0.06)"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.5)"}>{chip}</button>)}
          </div>}
        </div>
        <div style={{padding:"8px 12px",borderTop:"1px solid rgba(0,0,0,0.05)",display:"flex",gap:6}}><input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder={chatLoading?"Thinking...":"Describe what to build..."} disabled={chatLoading} style={{flex:1,padding:"8px 10px",borderRadius:10,border:"1px solid rgba(0,0,0,0.08)",background:chatLoading?"rgba(0,0,0,0.02)":"rgba(255,255,255,0.5)",fontSize:13,outline:"none",fontFamily:"inherit",opacity:chatLoading?0.5:1}}/><button onClick={()=>sendChat()} disabled={chatLoading} style={{width:36,height:36,borderRadius:10,background:chatLoading?"rgba(26,26,46,0.5)":"#1a1a2e",color:"#E2E0E0",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:chatLoading?"default":"pointer"}}><ChevronRight size={16}/></button></div>
      </div>}

      {/* Right panel (glass) */}
      {rightPanel&&<div style={{position:"fixed",top:16,right:16,width:272,maxHeight:"calc(100vh - 100px)",zIndex:100,...glass,borderRadius:16,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{display:"flex",borderBottom:"1px solid rgba(0,0,0,0.06)",padding:"4px 4px 0"}}>{(["props","variants","code","system"] as const).map(k=><button key={k} onClick={()=>setRightPanel(k)} style={{flex:1,padding:"8px 0 6px",fontSize:11,fontWeight:rightPanel===k?600:400,color:rightPanel===k?"#1a1a2e":"rgba(26,26,46,0.4)",background:"transparent",border:"none",borderBottom:rightPanel===k?"2px solid #1a1a2e":"2px solid transparent",cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>{k}</button>)}<button onClick={()=>setRightPanel(null)} style={{padding:"6px",background:"none",border:"none",cursor:"pointer",color:"rgba(26,26,46,0.3)"}}><X size={12}/></button></div>
        <div style={{flex:1,overflow:"auto"}}>
          {rightPanel==="props"&&selectedNode&&<div>
            <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(0,0,0,0.05)"}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".05em",color:"rgba(26,26,46,0.4)",marginBottom:2}}>Component</div><div style={{fontSize:15,fontWeight:600,color:"#1a1a2e"}}>{selectedNode.type}</div><div style={{fontSize:11,color:"rgba(26,26,46,0.4)",fontFamily:"monospace",marginTop:2}}>variant: {selectedNode.variant??"—"}</div></div>
            {Object.entries(selectedNode.props).filter(([k,v])=>typeof v==="string"&&!["align","paddingY","bg","gap","padding","size","options","flex"].includes(k)).map(([k,v])=><div key={k} style={{padding:"8px 16px"}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".04em",color:"rgba(26,26,46,0.4)",marginBottom:4}}>{k}</div><input value={v as string} onChange={e=>dispatch({type:"UPDATE_NODE",id:selectedNode.id,props:{[k]:e.target.value}})} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/></div>)}
            <div style={{padding:"12px 16px",borderTop:"1px solid rgba(0,0,0,0.05)"}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".04em",color:"rgba(26,26,46,0.4)",marginBottom:6}}>Annotations</div>{selectedNode.annotations.map(a=>{
              const isAi = a.type === "ai";
              const isApplied = !!a.applied;
              const isApplying = applyingAnnIds.has(a.id);
              const colors = isApplied
                ? { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", text: "#065f46", icon: "\u2713" }
                : a.type === "note"
                ? { bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#475569", icon: "\ud83d\udcce" }
                : { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", text: "#92400e", icon: "\ud83d\udccc" };
              return <div key={a.id} style={{padding:"8px 10px",background:colors.bg,borderRadius:8,fontSize:12,color:colors.text,lineHeight:1.4,border:`1px solid ${colors.border}`,marginBottom:4}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:6}}>
                  <span style={{flexShrink:0}}>{colors.icon}</span>
                  <span style={{flex:1}}>{a.text}</span>
                  {isAi && !isApplied && <button onClick={()=>applyAnnotation(a.id,a.text)} disabled={isApplying} style={{padding:"2px 8px",borderRadius:6,border:"none",background:isApplying?"rgba(245,158,11,0.2)":"#f59e0b",color:isApplying?"#92400e":"#fff",fontSize:10,fontWeight:600,cursor:isApplying?"default":"pointer",whiteSpace:"nowrap",flexShrink:0}}>{isApplying?"...":"Apply"}</button>}
                  {isApplied && <span style={{fontSize:10,color:"#059669",fontWeight:600,flexShrink:0}}>Applied</span>}
                </div>
                <div style={{fontSize:10,color:colors.text,opacity:0.6,marginTop:2,marginLeft:20}}>{a.type}</div>
              </div>;
            })}
            {selectedNode.annotations.filter(a=>a.type==="ai"&&!a.applied).length>1&&<button onClick={applyAllAnnotations} style={{width:"100%",padding:"6px 0",borderRadius:8,border:"1px solid rgba(245,158,11,0.3)",background:"rgba(245,158,11,0.08)",color:"#92400e",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:2}}>Apply All AI Annotations</button>}
            </div>
            {activeScreen&&(activeScreen.breakpoints??[]).length>1&&<div style={{padding:"12px 16px",borderTop:"1px solid rgba(0,0,0,0.05)"}}>
              <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".04em",color:"rgba(26,26,46,0.4)",marginBottom:6}}>Responsive Overrides</div>
              <div style={{display:"flex",gap:2,marginBottom:8}}>{(activeScreen.breakpoints??[]).map(bp=><button key={bp.label} onClick={()=>setResponsiveTab(responsiveTab===bp.label?null:bp.label)} style={{flex:1,padding:"4px 0",borderRadius:6,border:"none",background:responsiveTab===bp.label?"#1a1a2e":"rgba(0,0,0,0.04)",color:responsiveTab===bp.label?"#fff":"rgba(26,26,46,0.5)",fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{bp.label}</button>)}</div>
              {responsiveTab&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><label style={{fontSize:11,color:"rgba(26,26,46,0.5)"}}>Hidden</label>
                  <input type="checkbox" checked={!!(selectedNode.responsiveOverrides?.[responsiveTab]?.hidden)} onChange={e=>dispatch({type:"SET_RESPONSIVE_OVERRIDE",nodeId:selectedNode.id,breakpoint:responsiveTab,props:{hidden:e.target.checked||undefined}})} style={{cursor:"pointer"}}/>
                </div>
                {selectedNode.type==="__row"&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><label style={{fontSize:11,color:"rgba(26,26,46,0.5)"}}>Direction</label>
                  <select value={(selectedNode.responsiveOverrides?.[responsiveTab]?.direction as string)??""} onChange={e=>dispatch({type:"SET_RESPONSIVE_OVERRIDE",nodeId:selectedNode.id,breakpoint:responsiveTab,props:{direction:e.target.value||undefined}})} style={{padding:"3px 4px",borderRadius:6,border:"1px solid rgba(0,0,0,0.08)",fontSize:10,background:"rgba(255,255,255,0.5)",fontFamily:"inherit",outline:"none"}}>
                    <option value="">Row (default)</option><option value="stack">Stack (column)</option>
                  </select>
                </div>}
                {Object.entries(selectedNode.responsiveOverrides?.[responsiveTab]??{}).filter(([k])=>k!=="hidden"&&k!=="direction").map(([k,v])=><div key={k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:10}}>
                  <span style={{fontFamily:"monospace",color:"rgba(26,26,46,0.5)"}}><span style={{width:6,height:6,borderRadius:"50%",background:"#2563eb",display:"inline-block",marginRight:4}}/>  {k}: {String(v)}</span>
                  <span onClick={()=>{const overrides={...selectedNode.responsiveOverrides?.[responsiveTab]};delete overrides[k];dispatch({type:"SET_RESPONSIVE_OVERRIDE",nodeId:selectedNode.id,breakpoint:responsiveTab,props:overrides});}} style={{color:"rgba(37,99,235,0.6)",cursor:"pointer",fontSize:9}}>reset</span>
                </div>)}
              </div>}
            </div>}
            <div style={{padding:"12px 16px",borderTop:"1px solid rgba(0,0,0,0.05)"}}>
              <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".04em",color:"rgba(26,26,46,0.4)",marginBottom:6}}>Navigation</div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:11,color:"rgba(26,26,46,0.5)",flexShrink:0}}>Link to</span>
                <select value={(selectedNode.props.linkTo as string) ?? ""} onChange={e=>{
                  const target = e.target.value || null;
                  dispatch({type:"SET_NODE_LINK",nodeId:selectedNode.id,targetScreenId:target});
                  if(target&&activeScreen){
                    const exists = state.project.arrows.some(a=>(a.fromScreen===activeScreen.id&&a.toScreen===target)||(a.fromScreen===target&&a.toScreen===activeScreen.id));
                    if(!exists) dispatch({type:"ADD_ARROW",fromScreen:activeScreen.id,toScreen:target});
                  }
                }} style={{flex:1,padding:"4px 6px",borderRadius:6,border:"1px solid rgba(0,0,0,0.08)",fontSize:11,background:"rgba(255,255,255,0.5)",fontFamily:"inherit",outline:"none"}}>
                  <option value="">None</option>
                  {state.project.screens.filter(s=>s.id!==activeScreen?.id).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              {!!(selectedNode.props.linkTo as string)&&<div style={{display:"flex",alignItems:"center",gap:4,marginTop:4}}>
                <span style={{fontSize:10,color:"#2563eb"}}>↗ {state.project.screens.find(s=>s.id===(selectedNode.props.linkTo as string))?.name??""}</span>
                <span onClick={()=>dispatch({type:"SET_NODE_LINK",nodeId:selectedNode.id,targetScreenId:null})} style={{fontSize:9,color:"rgba(220,38,38,0.5)",cursor:"pointer",marginLeft:"auto"}}>Remove link</span>
              </div>}
            </div>
            <div style={{padding:"8px 16px 16px"}}><button onClick={()=>dispatch({type:"DELETE_NODE",id:selectedNode.id})} style={{width:"100%",padding:"8px 0",borderRadius:8,border:"1px solid rgba(220,38,38,0.2)",background:"rgba(220,38,38,0.05)",color:"#dc2626",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>Delete</button></div>
          </div>}
          {rightPanel==="props"&&!selectedNode&&<div style={{padding:24,textAlign:"center",color:"rgba(26,26,46,0.35)",fontSize:13}}>Click a component<br/>to edit properties</div>}
          {rightPanel==="variants"&&selectedNode&&REGISTRY[selectedNode.type]&&<div style={{padding:12}}>
            {/* Change Type — collapsible, collapsed by default */}
            <div onClick={()=>setChangeTypeOpen(o=>!o)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",padding:"4px 0",marginBottom:changeTypeOpen?8:10,fontSize:10,textTransform:"uppercase",letterSpacing:".04em",color:"rgba(26,26,46,0.4)",fontWeight:600,userSelect:"none"}}>
              <span>Change Type</span>
              <ChevronRight size={12} style={{transform:changeTypeOpen?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.15s"}}/>
            </div>
            {changeTypeOpen&&<div style={{marginBottom:14,paddingBottom:10,borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
              {PALETTE_CATEGORIES.map(cat=>{
                const items=Object.entries(REGISTRY).filter(([k,v])=>v.cat===cat.key&&k!=="__root"&&k!=="__row");
                if(items.length===0) return null;
                return <div key={cat.key} style={{marginBottom:6}}>
                  <div style={{padding:"4px 2px 2px",fontSize:9,fontWeight:600,color:"rgba(26,26,46,0.35)",textTransform:"uppercase",letterSpacing:".04em"}}>{cat.label}</div>
                  {items.map(([tk,td])=>{
                    const isActive=selectedNode.type===tk;
                    return <div key={tk} onClick={()=>{
                      if(isActive) return;
                      const firstVariant=Object.keys(REGISTRY[tk].variants)[0]??"";
                      dispatch({type:"SWAP_TYPE",id:selectedNode.id,newType:tk as typeof selectedNode.type,newVariant:firstVariant});
                    }} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",borderRadius:8,cursor:isActive?"default":"pointer",fontSize:12,color:"#1a1a2e",background:isActive?"rgba(26,26,46,0.06)":"transparent",border:isActive?"1.5px solid rgba(26,26,46,0.2)":"1px solid transparent",marginBottom:2}} onMouseEnter={e=>{if(!isActive)(e.currentTarget as HTMLElement).style.background="rgba(0,0,0,0.04)"}} onMouseLeave={e=>{if(!isActive)(e.currentTarget as HTMLElement).style.background="transparent"}}>
                      <span style={{width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.04)",borderRadius:4,fontSize:11,flexShrink:0}}>{td.icon}</span>
                      <span style={{fontWeight:isActive?600:500}}>{tk}</span>
                    </div>;
                  })}
                </div>;
              })}
            </div>}
            <div style={{fontSize:12,fontWeight:600,color:"#1a1a2e",marginBottom:10}}>Variants for {selectedNode.type}</div>{Object.entries(REGISTRY[selectedNode.type].variants).map(([vk,vv])=><div key={vk} onClick={()=>dispatch({type:"SWAP_VARIANT",id:selectedNode.id,variant:vk})} style={{padding:"10px 12px",borderRadius:10,marginBottom:4,cursor:"pointer",background:selectedNode.variant===vk?"rgba(26,26,46,0.06)":"transparent",border:selectedNode.variant===vk?"1.5px solid rgba(26,26,46,0.2)":"1px solid rgba(0,0,0,0.06)"}}><div style={{fontSize:13,fontWeight:selectedNode.variant===vk?600:500,color:"#1a1a2e"}}>{vv.label}</div>{vv.desc&&<div style={{fontSize:11,color:"rgba(26,26,46,0.4)",marginTop:2}}>{vv.desc}</div>}</div>)}
          </div>}
          {rightPanel==="variants"&&(!selectedNode||!REGISTRY[selectedNode.type])&&<div style={{padding:24,textAlign:"center",color:"rgba(26,26,46,0.35)",fontSize:13}}>Select a component<br/>to see variants</div>}
          {rightPanel==="code"&&<div><div style={{padding:"10px 14px",borderBottom:"1px solid rgba(0,0,0,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:600,color:"#1a1a2e"}}>{activeScreen?.name??"Screen"}</span><button onClick={()=>navigator.clipboard?.writeText(codeOutput)} style={{padding:"3px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",fontSize:11,cursor:"pointer",fontFamily:"inherit",color:"rgba(26,26,46,0.5)",display:"flex",alignItems:"center",gap:3}}><Copy size={10}/>Copy</button></div><pre style={{padding:14,fontSize:11,lineHeight:1.6,fontFamily:"monospace",color:"#1a1a2e",margin:0,whiteSpace:"pre-wrap",wordBreak:"break-all",background:"rgba(0,0,0,0.02)",minHeight:200}}>{codeOutput}</pre><div style={{padding:"12px 14px",borderTop:"1px solid rgba(0,0,0,0.05)"}}><button style={{width:"100%",padding:"10px 0",borderRadius:10,border:"none",background:"#1a1a2e",color:"#E2E0E0",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Rocket size={14}/>Deploy to Vercel</button><button onClick={exportNextJS} disabled={exporting} style={{width:"100%",padding:"10px 0",borderRadius:10,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",color:"#1a1a2e",fontSize:13,fontWeight:600,cursor:exporting?"default":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:6,opacity:exporting?0.5:1}}><Download size={14}/>{exporting?"Generating...":"Export Next.js Project"}</button>
            <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(0,0,0,0.05)"}}>
              <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",color:"rgba(26,26,46,0.4)",marginBottom:6}}>Copy to Figma</div>
              {figmaExportState==="idle"&&<div style={{display:"flex",gap:6}}>
                <button onClick={()=>{
                  if(!activeScreen)return;
                  setFigmaExportState("preparing");setFigmaExportError("");
                  const payload=buildScreenPayload(activeScreen,state.tokens);
                  fetch("/system/api/figma-export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"single",screen:payload})})
                    .then(async r=>{if(!r.ok){const e=await r.json().catch(()=>({error:"Failed"}));throw new Error(e.error||"Failed");}return r.text();})
                    .then(clip=>{figmaClipRef.current=clip;setFigmaExportState("ready");})
                    .catch(e=>{setFigmaExportError(e instanceof Error?e.message:"Failed");setFigmaExportState("error");});
                }} style={{flex:1,padding:"8px 0",borderRadius:8,border:"1px solid rgba(0,0,0,0.06)",background:"rgba(255,255,255,0.5)",color:"#1a1a2e",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>This Screen</button>
                <button onClick={()=>{
                  setFigmaExportState("preparing");setFigmaExportError("");
                  const payload=buildMultiScreenPayload(state.project,state.tokens);
                  fetch("/system/api/figma-export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"multi",screens:payload.screens})})
                    .then(async r=>{if(!r.ok){const e=await r.json().catch(()=>({error:"Failed"}));throw new Error(e.error||"Failed");}return r.text();})
                    .then(clip=>{figmaClipRef.current=clip;setFigmaExportState("ready");})
                    .catch(e=>{setFigmaExportError(e instanceof Error?e.message:"Failed");setFigmaExportState("error");});
                }} style={{flex:1,padding:"8px 0",borderRadius:8,border:"1px solid rgba(0,0,0,0.06)",background:"rgba(255,255,255,0.5)",color:"#1a1a2e",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>All Screens</button>
              </div>}
              {figmaExportState==="preparing"&&<div style={{padding:"8px 0",fontSize:11,color:"rgba(26,26,46,0.5)",textAlign:"center"}}>Preparing for Figma...</div>}
              {figmaExportState==="ready"&&<button onClick={()=>{
                const handler=(e:ClipboardEvent)=>{e.clipboardData?.setData("text/html",figmaClipRef.current);e.preventDefault();};
                document.addEventListener("copy",handler,{once:true});
                document.execCommand("copy");
                setFigmaExportState("copied");
                setTimeout(()=>setFigmaExportState("idle"),5000);
              }} style={{width:"100%",padding:"8px 0",borderRadius:8,border:"none",background:"#2563eb",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Copy to Clipboard</button>}
              {figmaExportState==="copied"&&<div style={{padding:"8px 0",fontSize:11,color:"#059669",textAlign:"center",fontWeight:600}}>Copied! Paste into Figma with Cmd+V</div>}
              {figmaExportState==="error"&&<div style={{padding:"6px 8px",borderRadius:6,background:"rgba(220,38,38,0.06)",border:"1px solid rgba(220,38,38,0.12)",color:"#dc2626",fontSize:10,marginTop:4}}>{figmaExportError}<button onClick={()=>setFigmaExportState("idle")} style={{marginLeft:8,fontSize:9,color:"rgba(26,26,46,0.4)",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Try again</button></div>}
            </div>
            </div></div>}
          {rightPanel==="system"&&<div style={{padding:12}}>
            <button onClick={()=>{setShowFigmaImport(!showFigmaImport);setFigmaError("");setFigmaResult(null);}} style={{width:"100%",padding:"8px 0",borderRadius:8,border:"1px solid rgba(0,0,0,0.06)",background:showFigmaImport?"rgba(37,99,235,0.06)":"rgba(255,255,255,0.5)",color:showFigmaImport?"#2563eb":"rgba(26,26,46,0.6)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginBottom:10}}><Upload size={12}/>Import from Figma</button>
            {showFigmaImport&&<div style={{marginBottom:12,padding:10,borderRadius:10,border:"1px solid rgba(0,0,0,0.06)",background:"rgba(255,255,255,0.4)"}}>
              {!figmaResult&&<>
                <div style={{marginBottom:6}}>
                  <div style={{fontSize:9,fontWeight:600,color:"rgba(26,26,46,0.4)",marginBottom:3,textTransform:"uppercase",letterSpacing:".04em"}}>Figma Node URL</div>
                  <input value={figmaUrl} onChange={e=>setFigmaUrl(e.target.value)} placeholder="https://figma.com/design/KEY/name?node-id=..." disabled={figmaLoading} style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",fontSize:11,outline:"none",fontFamily:"inherit",boxSizing:"border-box",opacity:figmaLoading?0.5:1}}/>
                </div>
                <div style={{marginBottom:6}}>
                  <div style={{fontSize:9,fontWeight:600,color:"rgba(26,26,46,0.4)",marginBottom:3,textTransform:"uppercase",letterSpacing:".04em"}}>Figma Access Token</div>
                  <input value={figmaToken} onChange={e=>{setFigmaToken(e.target.value);if(typeof window!=="undefined")localStorage.setItem("aphantasia-figma-token",e.target.value);}} placeholder="figd_..." type="password" disabled={figmaLoading} style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",fontSize:11,outline:"none",fontFamily:"monospace",boxSizing:"border-box",opacity:figmaLoading?0.5:1}}/>
                  <div style={{fontSize:9,color:"rgba(26,26,46,0.3)",marginTop:2}}>From Figma &rarr; Settings &rarr; Personal access tokens. Saved locally.</div>
                </div>
                <button onClick={()=>{
                  if(!figmaUrl.trim()||figmaLoading) return;
                  setFigmaStatus("connecting");setFigmaError("");
                  // Visual staging of the single response — lets the user see
                  // progress while the server does the work in one shot
                  const t1 = setTimeout(()=>setFigmaStatus("extracting"),800);
                  const t2 = setTimeout(()=>setFigmaStatus("mapping"),1800);
                  fetch("/system/api/figma",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fileUrl:figmaUrl,accessToken:figmaToken||undefined})})
                    .then(async r=>{
                      clearTimeout(t1);clearTimeout(t2);
                      setFigmaStatus("mapping");
                      const d=await r.json();
                      if(!r.ok) throw new Error(d.error||"Failed");
                      setFigmaResult(d as FigmaImportResult);
                      setFigmaStatus("");
                    })
                    .catch(e=>{clearTimeout(t1);clearTimeout(t2);setFigmaError(e instanceof Error?e.message:"Failed");setFigmaStatus("error");});
                }} disabled={figmaLoading||!figmaUrl.trim()} style={{width:"100%",padding:"7px 0",borderRadius:6,background:figmaLoading?"rgba(26,26,46,0.5)":"#1a1a2e",color:"#fff",border:"none",fontSize:11,fontWeight:600,cursor:figmaLoading?"default":"pointer",fontFamily:"inherit",marginBottom:6}}>{figmaLoading?figmaStatusText:"Connect & Import"}</button>
                {figmaError&&<div style={{padding:"6px 8px",borderRadius:6,background:"rgba(220,38,38,0.06)",border:"1px solid rgba(220,38,38,0.12)",color:"#dc2626",fontSize:10,lineHeight:1.4}}>{figmaError}</div>}
              </>}
              {figmaResult&&<>
                <div style={{fontSize:10,color:"rgba(26,26,46,0.5)",marginBottom:8}}>Imported {figmaResult.source.variableCount} variables and {figmaResult.source.styleCount} styles from <strong style={{color:"#1a1a2e"}}>{figmaResult.source.fileName}</strong>, mapped <strong style={{color:"#1a1a2e"}}>{Object.keys(figmaResult.tokens).length}</strong> token{Object.keys(figmaResult.tokens).length===1?"":"s"}.</div>
                {Object.keys(figmaResult.tokens).length>0&&<>
                  <div style={{fontSize:10,fontWeight:600,color:"rgba(26,26,46,0.4)",marginBottom:4}}>Matched Tokens ({Object.keys(figmaResult.tokens).length})</div>
                  <div style={{maxHeight:120,overflow:"auto",marginBottom:8}}>
                    {Object.entries(figmaResult.tokens).map(([k,v])=><div key={k} style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,fontSize:10}}>
                      {v.startsWith("#")&&<div style={{width:12,height:12,borderRadius:3,background:v,border:"1px solid rgba(0,0,0,0.1)",flexShrink:0}}/>}
                      <span style={{fontFamily:"monospace",color:"rgba(26,26,46,0.6)"}}>{k}</span>
                      <span style={{color:"rgba(26,26,46,0.3)"}}>{"\u2192"}</span>
                      <span style={{fontFamily:"monospace",color:"#1a1a2e"}}>{v}</span>
                    </div>)}
                  </div>
                </>}
                {figmaResult.unmapped.length>0&&<>
                  <div style={{fontSize:10,fontWeight:600,color:"rgba(26,26,46,0.4)",marginBottom:4}}>Unmapped ({figmaResult.unmapped.length})</div>
                  <div style={{maxHeight:80,overflow:"auto",marginBottom:8}}>
                    {figmaResult.unmapped.slice(0,10).map((u,i)=><div key={i} style={{fontSize:9,color:"rgba(26,26,46,0.4)",fontFamily:"monospace",marginBottom:2}}>{u.name}: {u.value}</div>)}
                    {figmaResult.unmapped.length>10&&<div style={{fontSize:9,color:"rgba(26,26,46,0.3)"}}>...and {figmaResult.unmapped.length-10} more</div>}
                  </div>
                </>}
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>{for(const[k,v]of Object.entries(figmaResult.tokens))dispatch({type:"UPDATE_TOKEN",key:k,value:v});setFigmaResult(null);setShowFigmaImport(false);setFigmaUrl("");}} style={{flex:1,padding:"6px 0",borderRadius:6,background:"#1a1a2e",color:"#fff",border:"none",fontSize:10,fontWeight:600,cursor:"pointer"}}>Merge</button>
                  <button onClick={()=>{dispatch({type:"SET_TOKENS",tokens:{...state.tokens,...figmaResult.tokens}});setFigmaResult(null);setShowFigmaImport(false);setFigmaUrl("");}} style={{flex:1,padding:"6px 0",borderRadius:6,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",color:"#1a1a2e",fontSize:10,fontWeight:600,cursor:"pointer"}}>Replace</button>
                  <button onClick={()=>{setFigmaResult(null);setFigmaUrl("");}} style={{padding:"6px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,0.06)",background:"transparent",color:"rgba(26,26,46,0.4)",fontSize:10,cursor:"pointer"}}>Cancel</button>
                </div>
              </>}
            </div>}
            <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",color:"rgba(26,26,46,0.4)",marginBottom:8}}>Theme Presets</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
              {Object.entries(THEME_PRESETS).map(([key,preset])=>{const t=preset.tokens;return<div key={key} onClick={()=>dispatch({type:"APPLY_THEME_PRESET",presetKey:key})} style={{padding:"8px 6px",borderRadius:8,border:"1px solid rgba(0,0,0,0.06)",background:"rgba(255,255,255,0.5)",cursor:"pointer",textAlign:"center",transition:"border-color 0.15s"}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="rgba(37,99,235,0.3)"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="rgba(0,0,0,0.06)"}><div style={{display:"flex",gap:3,justifyContent:"center",marginBottom:4}}>{[t["brand.primary"],t["bg.page"],t["bg.card"],t["text.primary"]].map((c,i)=><div key={i} style={{width:12,height:12,borderRadius:3,background:c,border:"1px solid rgba(0,0,0,0.08)"}}/>)}</div><div style={{fontSize:9,fontWeight:600,color:"#1a1a2e",lineHeight:1.2}}>{preset.name}</div></div>})}
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",marginBottom:8,borderTop:"1px solid rgba(0,0,0,0.05)",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
              <span style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",color:"rgba(26,26,46,0.4)"}}>Color Scheme</span>
              <div style={{display:"flex",borderRadius:8,border:"1px solid rgba(0,0,0,0.08)",overflow:"hidden"}}>
                <button onClick={()=>dispatch({type:"SET_COLOR_SCHEME",scheme:"light"})} style={{padding:"4px 10px",border:"none",background:state.colorScheme==="light"?"#1a1a2e":"transparent",color:state.colorScheme==="light"?"#fff":"rgba(26,26,46,0.5)",fontSize:10,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontFamily:"inherit"}}><Sun size={10}/>Light</button>
                <button onClick={()=>dispatch({type:"SET_COLOR_SCHEME",scheme:"dark"})} style={{padding:"4px 10px",border:"none",background:state.colorScheme==="dark"?"#1a1a2e":"transparent",color:state.colorScheme==="dark"?"#fff":"rgba(26,26,46,0.5)",fontSize:10,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontFamily:"inherit"}}><Moon size={10}/>Dark</button>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <span style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",color:"rgba(26,26,46,0.4)"}}>Tokens ({state.colorScheme})</span>
              <input value={tokenSearch} onChange={e=>setTokenSearch(e.target.value)} placeholder="Filter..." style={{flex:1,padding:"3px 6px",borderRadius:6,border:"1px solid rgba(0,0,0,0.06)",background:"rgba(255,255,255,0.4)",fontSize:10,outline:"none",fontFamily:"inherit"}}/>
            </div>
            {TOKEN_GROUPS.map(g=>{
              const allKeys = [...g.keys, ...(state.customTokenKeys??[]).filter(k=>k.startsWith(g.keys[0]?.split(".")[0]+".")||false)];
              const filteredKeys = tokenSearch ? allKeys.filter(k=>k.toLowerCase().includes(tokenSearch.toLowerCase())) : allKeys;
              if(filteredKeys.length===0&&!tokenSearch) return null;
              const prefix = g.keys[0]?.split(".")[0]+".";
              return <div key={g.title} style={{marginBottom:14}}>
                <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",color:"rgba(26,26,46,0.4)",marginBottom:6}}>{g.title}</div>
                {filteredKeys.map(k=>{
                  const isCustom = (state.customTokenKeys??[]).includes(k);
                  const isBuiltIn = BUILT_IN_KEYS.has(k);
                  const isModified = isBuiltIn && state.tokens[k] !== DEFAULT_TOKENS[k];
                  return <div key={k} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                    {g.type==="color"
                      ? <input type="color" value={state.tokens[k]??"#000"} onChange={e=>dispatch({type:"UPDATE_TOKEN",key:k,value:e.target.value})} style={{width:22,height:22,borderRadius:6,border:"1px solid rgba(0,0,0,0.1)",cursor:"pointer",padding:0}}/>
                      : g.type==="text" && k.startsWith("font.") && !k.startsWith("font.weight.")
                        ? (() => {
                            const cur = state.tokens[k] ?? "";
                            const hasCustom = cur && !FONT_OPTIONS.includes(cur);
                            return <select value={cur} onChange={e=>dispatch({type:"UPDATE_TOKEN",key:k,value:e.target.value})} style={{width:120,padding:"3px 4px",borderRadius:6,border:"1px solid rgba(0,0,0,0.08)",fontSize:10,fontFamily:"inherit",background:"rgba(255,255,255,0.5)",outline:"none",cursor:"pointer"}}>
                              {hasCustom && <option value={cur}>{fontLabel(cur)} (custom)</option>}
                              {FONT_OPTIONS.map(opt => <option key={opt} value={opt}>{fontLabel(opt)}</option>)}
                            </select>;
                          })()
                        : <input value={state.tokens[k]??""} onChange={e=>dispatch({type:"UPDATE_TOKEN",key:k,value:e.target.value})} style={{width:48,padding:"3px 5px",borderRadius:6,border:"1px solid rgba(0,0,0,0.08)",fontSize:10,fontFamily:"monospace",textAlign:"right",background:"rgba(255,255,255,0.5)"}}/>
                    }
                    <span style={{fontSize:10,color:"rgba(26,26,46,0.5)",fontFamily:"monospace",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{k}</span>
                    {isModified&&<span onClick={()=>dispatch({type:"UPDATE_TOKEN",key:k,value:DEFAULT_TOKENS[k]})} style={{fontSize:9,color:"rgba(37,99,235,0.6)",cursor:"pointer",flexShrink:0}}>reset</span>}
                    {isCustom&&<span onClick={()=>dispatch({type:"DELETE_CUSTOM_TOKEN",key:k})} style={{fontSize:12,color:"rgba(220,38,38,0.4)",cursor:"pointer",lineHeight:1,flexShrink:0}}>&times;</span>}
                  </div>;
                })}
                {!tokenSearch&&<button onClick={()=>{setAddingTokenGroup(addingTokenGroup===g.title?null:g.title);setNewTokenKey(prefix);setNewTokenValue(g.type==="color"?"#000000":"0px");setNewTokenType(g.type==="color"?"color":"size");}} style={{fontSize:10,color:"rgba(37,99,235,0.5)",background:"none",border:"none",cursor:"pointer",padding:"4px 0",fontFamily:"inherit"}}>{addingTokenGroup===g.title?"Cancel":"+ Add token"}</button>}
                {addingTokenGroup===g.title&&<div style={{display:"flex",gap:4,alignItems:"center",marginTop:4,flexWrap:"wrap"}}>
                  <input value={newTokenKey} onChange={e=>setNewTokenKey(e.target.value)} placeholder="key.path" style={{width:80,padding:"3px 6px",borderRadius:6,border:"1px solid rgba(0,0,0,0.08)",fontSize:10,fontFamily:"monospace",background:"rgba(255,255,255,0.5)",outline:"none"}}/>
                  {newTokenType==="color"?<input type="color" value={newTokenValue} onChange={e=>setNewTokenValue(e.target.value)} style={{width:22,height:22,borderRadius:6,border:"1px solid rgba(0,0,0,0.1)",cursor:"pointer",padding:0}}/>:<input value={newTokenValue} onChange={e=>setNewTokenValue(e.target.value)} style={{width:48,padding:"3px 5px",borderRadius:6,border:"1px solid rgba(0,0,0,0.08)",fontSize:10,fontFamily:"monospace",background:"rgba(255,255,255,0.5)",outline:"none"}}/>}
                  <select value={newTokenType} onChange={e=>setNewTokenType(e.target.value as "color"|"size"|"shadow"|"font")} style={{padding:"3px 2px",borderRadius:6,border:"1px solid rgba(0,0,0,0.08)",fontSize:9,background:"rgba(255,255,255,0.5)",fontFamily:"inherit",outline:"none"}}>
                    <option value="color">Color</option><option value="size">Size</option><option value="shadow">Shadow</option><option value="font">Font</option>
                  </select>
                  <button onClick={()=>{const v=validateTokenKey(newTokenKey);if(v.valid&&newTokenValue){dispatch({type:"ADD_CUSTOM_TOKEN",key:newTokenKey,value:newTokenValue,tokenType:newTokenType});setAddingTokenGroup(null);setNewTokenKey("");setNewTokenValue("");}}} style={{padding:"3px 8px",borderRadius:6,background:"#1a1a2e",color:"#fff",border:"none",fontSize:10,fontWeight:600,cursor:"pointer"}}>Add</button>
                </div>}
              </div>;
            })}
            {(state.customTokenKeys??[]).filter(k=>!TOKEN_GROUPS.some(g=>g.keys[0]&&k.startsWith(g.keys[0].split(".")[0]+"."))).length>0&&<div style={{marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",color:"rgba(26,26,46,0.4)",marginBottom:6}}>Custom</div>
              {(state.customTokenKeys??[]).filter(k=>!TOKEN_GROUPS.some(g=>g.keys[0]&&k.startsWith(g.keys[0].split(".")[0]+"."))).filter(k=>!tokenSearch||k.includes(tokenSearch)).map(k=><div key={k} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                <input type="color" value={state.tokens[k]??"#000"} onChange={e=>dispatch({type:"UPDATE_TOKEN",key:k,value:e.target.value})} style={{width:22,height:22,borderRadius:6,border:"1px solid rgba(0,0,0,0.1)",cursor:"pointer",padding:0}}/>
                <span style={{fontSize:10,color:"rgba(26,26,46,0.5)",fontFamily:"monospace",flex:1}}>{k}</span>
                <span onClick={()=>dispatch({type:"DELETE_CUSTOM_TOKEN",key:k})} style={{fontSize:12,color:"rgba(220,38,38,0.4)",cursor:"pointer",lineHeight:1}}>&times;</span>
              </div>)}
            </div>}
          </div>}
        </div>
        {rightPanel==="props"&&selectedNode&&<div style={{flexShrink:0,borderTop:"1px solid rgba(0,0,0,0.06)",padding:"10px 16px"}}>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <select value={annType} onChange={e=>setAnnType(e.target.value as typeof annType)} style={{padding:"5px 4px",borderRadius:6,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",fontSize:10,fontFamily:"inherit",color:"rgba(26,26,46,0.6)",outline:"none",cursor:"pointer"}}>
              <option value="ai">AI</option>
              <option value="note">Note</option>
              <option value="behavior">Behavior</option>
              <option value="requirement">Requirement</option>
            </select>
            <input value={annInput} onChange={e=>setAnnInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addAnnotation(annType==="ai")} placeholder={annType==="ai"?"e.g. Make this full width":"e.g. Needs user testing..."} style={{flex:1,padding:"6px 8px",borderRadius:8,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
            <button onClick={()=>addAnnotation(annType==="ai")} style={{padding:"6px 10px",borderRadius:8,background:"#f59e0b",color:"#fff",border:"none",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{annType==="ai"?"Send to AI":"+ Add"}</button>
          </div>
        </div>}
      </div>}

      {/* Bottom toolbar (dark floating pill) */}
      <div style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",zIndex:200,display:"flex",alignItems:"center",gap:4,...darkGlass,borderRadius:16,padding:"6px 12px"}}>
        <button onClick={()=>dispatch({type:"UNDO"})} disabled={!canUndo} title="Undo (⌘Z)" style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,border:"none",cursor:canUndo?"pointer":"default",background:"transparent",color:canUndo?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.25)"}}><Undo2 size={18}/></button>
        <button onClick={()=>dispatch({type:"REDO"})} disabled={!canRedo} title="Redo (⌘⇧Z)" style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,border:"none",cursor:canRedo?"pointer":"default",background:"transparent",color:canRedo?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.25)"}}><Redo2 size={18}/></button>
        <div style={{width:1,height:24,background:"rgba(255,255,255,0.1)",margin:"0 4px"}}/>
        {([["select",MousePointer2,"V"],["draw",Square,"R"],["hand",Hand,"H"]] as const).map(([tool,Icon,key])=><button key={tool} onClick={()=>dispatch({type:"SET_TOOL",tool})} title={`${tool} (${key})`} style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,border:"none",cursor:"pointer",transition:"background .15s, color .15s",background:state.tool===tool?"rgba(255,255,255,0.15)":"transparent",color:state.tool===tool?"#fff":"rgba(255,255,255,0.5)"}}><Icon size={18}/></button>)}
        <div style={{position:"relative"}}><button onClick={()=>setPaletteOpen(!paletteOpen)} title="Add Component" style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,border:"none",cursor:"pointer",background:paletteOpen?"rgba(255,255,255,0.15)":"transparent",color:paletteOpen?"#fff":"rgba(255,255,255,0.5)"}}><Plus size={18}/></button>
          {paletteOpen&&<div style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%)",marginBottom:8,width:220,maxHeight:400,...glass,borderRadius:14,overflow:"auto",padding:8}}>{PALETTE_CATEGORIES.map(cat=>{const items=Object.entries(REGISTRY).filter(([,v])=>v.cat===cat.key);if(!items.length)return null;return<div key={cat.key}><div style={{padding:"6px 10px 3px",fontSize:10,fontWeight:600,color:"rgba(26,26,46,0.35)",textTransform:"uppercase",letterSpacing:".04em"}}>{cat.label}</div>{items.map(([key,comp])=><div key={key} onClick={()=>addFromPalette(key,Object.keys(comp.variants)[0])} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:8,cursor:"pointer",fontSize:13,color:"#1a1a2e"}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="rgba(0,0,0,0.04)"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}><span style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.04)",borderRadius:4,fontSize:12}}>{comp.icon}</span>{key}</div>)}</div>})}</div>}
        </div>
        <div style={{width:1,height:24,background:"rgba(255,255,255,0.1)",margin:"0 4px"}}/>
        <button onClick={()=>dispatch({type:"TOGGLE_LIVE"})} style={{padding:"8px 16px",borderRadius:12,border:state.liveMode?"1px solid rgba(16,185,129,0.4)":"none",background:state.liveMode?"rgba(16,185,129,0.15)":"transparent",color:state.liveMode?"#10b981":"rgba(255,255,255,0.5)",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>{state.liveMode?<Pause size={14}/>:<Play size={14}/>}Live</button>
        <div style={{width:1,height:24,background:"rgba(255,255,255,0.1)",margin:"0 4px"}}/>
        {state.project.screens.map(sc=><button key={sc.id} onClick={()=>{dispatch({type:"SET_ACTIVE_SCREEN",id:sc.id});dispatch({type:"SET_PAN",pan:{x:30-sc.x*state.zoom,y:30-sc.y*state.zoom}})}} style={{padding:"6px 12px",borderRadius:10,border:"none",background:state.activeScreenId===sc.id?"rgba(255,255,255,0.12)":"transparent",color:state.activeScreenId===sc.id?"#fff":"rgba(255,255,255,0.4)",fontSize:12,fontWeight:state.activeScreenId===sc.id?500:400,cursor:"pointer",fontFamily:"inherit"}}>{sc.name}</button>)}
        <div style={{position:"relative"}}><button onClick={()=>setViewportOpen(!viewportOpen)} title="Viewport Presets" style={{width:32,height:32,borderRadius:10,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",background:viewportOpen?"rgba(255,255,255,0.15)":"transparent",color:viewportOpen?"#fff":"rgba(255,255,255,0.35)"}}><Monitor size={14}/></button>
          {viewportOpen&&<div style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%)",marginBottom:8,width:200,...glass,borderRadius:12,overflow:"hidden",padding:4}}>
            <div style={{padding:"6px 10px 4px",fontSize:10,fontWeight:600,color:"rgba(26,26,46,0.35)",textTransform:"uppercase",letterSpacing:".04em"}}>Viewport Presets</div>
            {VIEWPORT_PRESETS.map(vp=><div key={vp.label} onClick={()=>{if(activeScreen){dispatch({type:"RESIZE_SCREEN",id:activeScreen.id,w:vp.w,h:vp.h});}setViewportOpen(false);}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 10px",borderRadius:8,cursor:"pointer",fontSize:12,color:"#1a1a2e"}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="rgba(0,0,0,0.04)"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}><span style={{fontWeight:500}}>{vp.label}</span><span style={{fontSize:10,color:"rgba(26,26,46,0.4)",fontFamily:"monospace"}}>{vp.w}×{vp.h}</span></div>)}
          </div>}
        </div>
        <div style={{position:"relative"}}><button onClick={()=>{if(state.previewBreakpoint!==null&&!responsiveOpen){dispatch({type:"SET_PREVIEW_BREAKPOINT",breakpoint:null});} else {setResponsiveOpen(!responsiveOpen);}}} title="Responsive Preview" style={{width:32,height:32,borderRadius:10,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",background:state.previewBreakpoint!==null||responsiveOpen?"rgba(37,99,235,0.2)":"transparent",color:state.previewBreakpoint!==null||responsiveOpen?"#60a5fa":"rgba(255,255,255,0.35)"}}><Smartphone size={14}/></button>
          {responsiveOpen&&activeScreen&&<div style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%)",marginBottom:8,width:160,...glass,borderRadius:12,overflow:"hidden",padding:4}}>
            <div style={{padding:"6px 10px 4px",fontSize:10,fontWeight:600,color:"rgba(26,26,46,0.35)",textTransform:"uppercase",letterSpacing:".04em"}}>Responsive</div>
            <div onClick={()=>{dispatch({type:"SET_PREVIEW_BREAKPOINT",breakpoint:"all"});setResponsiveOpen(false);}} style={{padding:"6px 10px",borderRadius:8,cursor:"pointer",fontSize:12,color:state.previewBreakpoint==="all"?"#2563eb":"#1a1a2e",fontWeight:state.previewBreakpoint==="all"?600:400,background:state.previewBreakpoint==="all"?"rgba(37,99,235,0.06)":"transparent"}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="rgba(0,0,0,0.04)"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=state.previewBreakpoint==="all"?"rgba(37,99,235,0.06)":"transparent"}>All Breakpoints</div>
            {(activeScreen.breakpoints??[]).map(bp=><div key={bp.label} onClick={()=>{dispatch({type:"SET_PREVIEW_BREAKPOINT",breakpoint:bp.label});setResponsiveOpen(false);}} style={{padding:"6px 10px",borderRadius:8,cursor:"pointer",fontSize:12,color:state.previewBreakpoint===bp.label?"#2563eb":"#1a1a2e",fontWeight:state.previewBreakpoint===bp.label?600:400,display:"flex",justifyContent:"space-between",background:state.previewBreakpoint===bp.label?"rgba(37,99,235,0.06)":"transparent"}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="rgba(0,0,0,0.04)"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=state.previewBreakpoint===bp.label?"rgba(37,99,235,0.06)":"transparent"}><span>{bp.label}</span><span style={{fontSize:10,color:"rgba(26,26,46,0.4)",fontFamily:"monospace"}}>{bp.width}px</span></div>)}
          </div>}
        </div>
        <button onClick={()=>setShowNewScreen(true)} title="New Screen" style={{width:32,height:32,borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.3)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={14}/></button>
        <div style={{width:1,height:24,background:"rgba(255,255,255,0.1)",margin:"0 4px"}}/>
        <button onClick={()=>dispatch({type:"TOGGLE_CHAT"})} style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,border:"none",cursor:"pointer",background:state.showChat?"rgba(255,255,255,0.15)":"transparent",color:state.showChat?"#fff":"rgba(255,255,255,0.5)"}}><MessageSquare size={18}/></button>
        <button onClick={()=>setRightPanel(rightPanel==="code"?"props":"code")} style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,border:"none",cursor:"pointer",background:rightPanel==="code"?"rgba(255,255,255,0.15)":"transparent",color:rightPanel==="code"?"#fff":"rgba(255,255,255,0.5)"}}><Code2 size={18}/></button>
        <button onClick={()=>setRightPanel(rightPanel==="system"?"props":"system")} style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,border:"none",cursor:"pointer",background:rightPanel==="system"?"rgba(255,255,255,0.15)":"transparent",color:rightPanel==="system"?"#fff":"rgba(255,255,255,0.5)"}}><Palette size={18}/></button>
        <div style={{width:1,height:24,background:"rgba(255,255,255,0.1)",margin:"0 4px"}}/>
        <button onClick={()=>{loadProjectList();setShowProjectPicker(true);}} title="Projects" style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,border:"none",cursor:"pointer",background:"transparent",color:"rgba(255,255,255,0.5)"}}><FolderOpen size={18}/></button>
        <button onClick={exportProject} title="Export JSON" style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,border:"none",cursor:"pointer",background:"transparent",color:"rgba(255,255,255,0.5)"}}><Download size={18}/></button>
        {saveStatus!=="idle"&&<span style={{fontSize:11,color:saveStatus==="saved"?"rgba(16,185,129,0.8)":"rgba(255,255,255,0.4)",fontWeight:500,marginLeft:4,whiteSpace:"nowrap",transition:"opacity 0.3s"}}>{saveStatus==="saving"?"Saving...":"Saved \u2713"}</span>}
      </div>

      {/* Zoom (top-right glass) */}
      <div style={{position:"fixed",top:16,right:rightPanel?300:16,zIndex:50,...glass,borderRadius:10,padding:"4px 8px",display:"flex",alignItems:"center",gap:2,fontSize:12,transition:"right .2s"}}><button onClick={()=>dispatch({type:"SET_ZOOM",zoom:state.zoom-.1})} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(26,26,46,0.4)",padding:"2px 6px",fontSize:14}}>−</button><span style={{minWidth:36,textAlign:"center",fontFamily:"monospace",fontWeight:500,color:"rgba(26,26,46,0.6)",fontSize:11}}>{Math.round(state.zoom*100)}%</span><button onClick={()=>dispatch({type:"SET_ZOOM",zoom:state.zoom+.1})} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(26,26,46,0.4)",padding:"2px 6px",fontSize:14}}>+</button></div>

      {/* New screen modal */}
      {showNewScreen&&<div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(26,26,46,0.6)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>{if(!screenGenLoading){setShowNewScreen(false);setScreenGenDesc("");setScreenGenArch(null);}}}>
        <div onClick={e=>e.stopPropagation()} style={{width:480,maxHeight:"80vh",...glass,borderRadius:20,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"20px 24px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:18,fontWeight:700,color:"#1a1a2e"}}>New Screen</span>
            <button onClick={()=>{if(!screenGenLoading){setShowNewScreen(false);setScreenGenDesc("");setScreenGenArch(null);}}} style={{background:"rgba(0,0,0,0.05)",border:"none",borderRadius:8,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={14} color="rgba(26,26,46,0.5)"/></button>
          </div>
          <div style={{padding:"0 24px 12px",display:"flex",gap:8}}>
            <button onClick={addBlankScreen} style={{padding:"8px 16px",borderRadius:10,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#1a1a2e"}}>+ Blank Screen</button>
          </div>
          <div style={{padding:"0 24px 8px"}}><div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",color:"rgba(26,26,46,0.35)",marginBottom:8}}>Generate with AI</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:10}}>
              {Object.entries(SCREEN_ARCHETYPES).map(([key,arch])=><div key={key} onClick={()=>{setScreenGenArch(screenGenArch===key?null:key);setScreenGenDesc(screenGenDesc||arch.description);}} style={{padding:"8px 6px",borderRadius:8,border:screenGenArch===key?"1.5px solid #2563eb":"1px solid rgba(0,0,0,0.06)",background:screenGenArch===key?"rgba(37,99,235,0.06)":"rgba(255,255,255,0.5)",cursor:"pointer",textAlign:"center",transition:"border-color 0.15s"}} onMouseEnter={e=>{if(screenGenArch!==key)(e.currentTarget as HTMLElement).style.borderColor="rgba(37,99,235,0.3)";}} onMouseLeave={e=>{if(screenGenArch!==key)(e.currentTarget as HTMLElement).style.borderColor="rgba(0,0,0,0.06)";}}>
                <div style={{fontSize:11,fontWeight:600,color:"#1a1a2e",marginBottom:2}}>{key.replace("-"," ").replace(/\b\w/g,c=>c.toUpperCase())}</div>
                <div style={{fontSize:9,color:"rgba(26,26,46,0.4)"}}>{arch.w}×{arch.h}</div>
              </div>)}
            </div>
            <div style={{display:"flex",gap:6}}>
              <input value={screenGenDesc} onChange={e=>setScreenGenDesc(e.target.value)} onKeyDown={e=>e.key==="Enter"&&generateScreen()} placeholder="Describe the screen..." disabled={screenGenLoading} style={{flex:1,padding:"8px 10px",borderRadius:10,border:"1px solid rgba(0,0,0,0.08)",background:screenGenLoading?"rgba(0,0,0,0.02)":"rgba(255,255,255,0.5)",fontSize:13,outline:"none",fontFamily:"inherit",opacity:screenGenLoading?0.5:1}}/>
              <button onClick={generateScreen} disabled={screenGenLoading||!screenGenDesc.trim()} style={{padding:"8px 16px",borderRadius:10,border:"none",background:screenGenLoading?"rgba(26,26,46,0.5)":"#1a1a2e",color:"#E2E0E0",fontSize:12,fontWeight:600,cursor:screenGenLoading?"default":"pointer",fontFamily:"inherit",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}><Sparkles size={12}/>{screenGenLoading?"Generating...":"Generate"}</button>
            </div>
          </div>
        </div>
      </div>}

      {/* Project picker overlay */}
      {showProjectPicker&&<div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(26,26,46,0.6)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowProjectPicker(false)}>
        <div onClick={e=>e.stopPropagation()} style={{width:560,maxHeight:"70vh",...glass,borderRadius:20,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"20px 24px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:18,fontWeight:700,color:"#1a1a2e"}}>Projects</span>
            <button onClick={()=>setShowProjectPicker(false)} style={{background:"rgba(0,0,0,0.05)",border:"none",borderRadius:8,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={14} color="rgba(26,26,46,0.5)"/></button>
          </div>
          <div style={{padding:"0 24px 12px",display:"flex",gap:8}}>
            <button onClick={()=>{dispatch({type:"NEW_PROJECT",template:"blank"});setShowProjectPicker(false);}} style={{padding:"8px 16px",borderRadius:10,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#1a1a2e"}}>+ New Blank</button>
            <button onClick={()=>{dispatch({type:"NEW_PROJECT",template:"landing"});setShowProjectPicker(false);}} style={{padding:"8px 16px",borderRadius:10,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#1a1a2e"}}>Landing Page Template</button>
          </div>
          <div style={{flex:1,overflow:"auto",padding:"0 24px 20px"}}>
            {savedProjects.length===0&&<div style={{padding:24,textAlign:"center",color:"rgba(26,26,46,0.35)",fontSize:13}}>No saved projects yet</div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {savedProjects.map(sp=><div key={sp.id} onClick={()=>{const migrated=migrate(sp);dispatch({type:"LOAD_PROJECT",state:migrated.state});setShowProjectPicker(false);}} style={{padding:16,borderRadius:12,border:"1px solid rgba(0,0,0,0.06)",background:"rgba(255,255,255,0.5)",cursor:"pointer",transition:"border-color 0.15s"}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="rgba(37,99,235,0.3)"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="rgba(0,0,0,0.06)"}>
                <div style={{fontSize:14,fontWeight:600,color:"#1a1a2e",marginBottom:4}}>{sp.name}</div>
                <div style={{fontSize:11,color:"rgba(26,26,46,0.4)"}}>{new Date(sp.updatedAt).toLocaleDateString(undefined,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                <div style={{fontSize:10,color:"rgba(26,26,46,0.3)",marginTop:4}}>{sp.state.project.screens.length} screen{sp.state.project.screens.length!==1?"s":""}</div>
              </div>)}
            </div>
          </div>
        </div>
      </div>}

      {/* Hints */}
      {state.tool==="draw"&&!drawing&&<div style={{position:"fixed",bottom:76,left:"50%",transform:"translateX(-50%)",...darkGlass,color:"#E2E0E0",padding:"6px 16px",borderRadius:10,fontSize:12,fontWeight:500,pointerEvents:"none",zIndex:150}}>Draw inside screen → component · Draw outside → sketch · Press V to select</div>}
      {state.liveMode&&<div style={{position:"fixed",bottom:76,left:"50%",transform:"translateX(-50%)",background:"rgba(16,185,129,0.9)",color:"#fff",padding:"6px 16px",borderRadius:10,fontSize:12,fontWeight:500,pointerEvents:"none",zIndex:150,display:"flex",alignItems:"center",gap:6}}><span style={{width:6,height:6,borderRadius:"50%",background:"#a7f3d0"}}/>Live Mode — components are interactive</div>}
    </div>
  );
}
