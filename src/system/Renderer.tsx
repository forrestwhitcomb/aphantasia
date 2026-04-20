"use client";

// ============================================================
// Aphantasia/System — Live Component Renderer
// ============================================================
// Walks a SpecNode tree and renders each node as a real React
// component styled via design tokens. In design mode, nodes are
// selectable and show annotation badges. In live mode, interactive
// components (dropdowns, toggles, tabs) actually work.
// ============================================================

import React, { useState, useRef, useEffect, useCallback, type CSSProperties, type MouseEvent, type Dispatch } from "react";
import type { SpecNode, EditorAction } from "./types";
import { resolveToken } from "./tokens";
import { shouldStartDrag, isContainerType } from "./dnd/engine";
import { computeInsertIndex } from "./dnd/reorder";

// Module-level drag state for cross-container reparenting
let globalDrag: { nodeId: string; parentId: string; onReparent: (containerId: string, insertIndex: number) => void } | null = null;

interface RendererProps {
  node: SpecNode;
  tokens: Record<string, string>;
  selectedId: string | null;
  onSelect: (node: SpecNode) => void;
  live: boolean;
  editingNodeId?: string | null;
  editingProp?: string | null;
  dispatch?: Dispatch<EditorAction>;
  activeBreakpoint?: string | null;
}

function resolveResponsiveProps(node: SpecNode, breakpoint: string | null): Record<string, unknown> {
  if (!breakpoint || !node.responsiveOverrides) return node.props;
  const overrides = node.responsiveOverrides[breakpoint];
  if (!overrides) return node.props;
  return { ...node.props, ...overrides };
}

export function LiveRenderer({ node, tokens, selectedId, onSelect, live, editingNodeId, editingProp, dispatch, activeBreakpoint }: RendererProps) {
  return (
    <NodeRenderer
      node={node}
      tokens={tokens}
      selectedId={selectedId}
      onSelect={onSelect}
      live={live}
      editingNodeId={editingNodeId ?? null}
      editingProp={editingProp ?? null}
      dispatch={dispatch ?? null}
      activeBreakpoint={activeBreakpoint ?? null}
      depth={0}
    />
  );
}

// ── Internal recursive renderer ──────────────────────────────

interface NodeProps {
  node: SpecNode;
  tokens: Record<string, string>;
  selectedId: string | null;
  onSelect: (node: SpecNode) => void;
  live: boolean;
  editingNodeId: string | null;
  editingProp: string | null;
  dispatch: Dispatch<EditorAction> | null;
  activeBreakpoint: string | null;
  depth: number;
}

// ── Inline editable text span ───────────────────────────────

interface EditableTextProps {
  value: string;
  style: CSSProperties;
  singleLine: boolean;
  onCommit: (newValue: string) => void;
}

function EditableText({ value, style, singleLine, onCommit }: EditableTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const committed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, []);

  const commit = useCallback(() => {
    if (committed.current) return;
    committed.current = true;
    const text = ref.current?.textContent ?? value;
    onCommit(text);
  }, [value, onCommit]);

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onBlur={commit}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Escape") {
          committed.current = true;
          onCommit(value); // revert
        }
        if (e.key === "Enter" && singleLine) {
          e.preventDefault();
          commit();
        }
      }}
      style={{
        ...style,
        outline: "2px solid rgba(37,99,235,0.5)",
        outlineOffset: 2,
        borderRadius: 4,
        cursor: "text",
        minWidth: 8,
        display: "inline-block",
      }}
    >
      {value}
    </span>
  );
}

// Parse a token value like "16px" or "400" or "1.25" to a number.
// Used by the typography styleMap to convert token strings to numeric CSS values.
const parseNum = (v: string | undefined, fallback: number): number => {
  if (!v) return fallback;
  const n = parseFloat(v);
  return isNaN(n) ? fallback : n;
};

function NodeRenderer({ node, tokens, selectedId, onSelect, live, editingNodeId, editingProp, dispatch, activeBreakpoint, depth }: NodeProps) {
  const [hov, setHov] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const [tabIdx, setTabIdx] = useState(0);
  const [toggled, setToggled] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [reparentHighlight, setReparentHighlight] = useState(false);

  const t = (k: string) => resolveToken(k, tokens) ?? k;
  const isSel = selectedId === node.id;
  const design = !live;
  const p = resolveResponsiveProps(node, activeBreakpoint) as Record<string, any>;
  const hasAnn = (node.annotations?.length ?? 0) > 0;

  // Hidden at this breakpoint
  if (p.hidden === true && activeBreakpoint) return null;

  const isEditing = editingNodeId === node.id;
  const startEdit = (prop: string) => {
    if (design && dispatch) {
      dispatch({ type: "START_EDITING", nodeId: node.id, prop });
    }
  };
  const commitEdit = (prop: string, newValue: string) => {
    if (dispatch) {
      dispatch({ type: "UPDATE_NODE", id: node.id, props: { [prop]: newValue } });
      dispatch({ type: "STOP_EDITING" });
    }
  };

  // ── Shared wiring ──
  const linkTo = p.linkTo as string | undefined;

  const outline = isSel
    ? `2px solid ${tokens["brand.primary"]}`
    : design && hov
      ? "1.5px dashed rgba(37,99,235,0.3)"
      : "2px solid transparent";

  const baseStyle: CSSProperties = {
    position: "relative",
    boxSizing: "border-box",
    outline: reparentHighlight ? "2px solid #2563eb" : outline,
    outlineOffset: isSel ? "-2px" : "0",
    transition: "outline 0.08s ease, background 0.08s ease",
    background: reparentHighlight ? "rgba(37,99,235,0.04)" : undefined,
    cursor: live && linkTo ? "pointer" : undefined,
  };

  const click = (e: MouseEvent) => {
    e.stopPropagation();
    if (design) onSelect(node);
    else if (live && linkTo && dispatch) {
      dispatch({ type: "SET_ACTIVE_SCREEN", id: linkTo });
    }
  };

  const hoverHandlers = design
    ? {
        onMouseEnter: (e: MouseEvent) => { e.stopPropagation(); setHov(true); },
        onMouseLeave: () => setHov(false),
      }
    : {};

  const childProps = { tokens, selectedId, onSelect, live, editingNodeId, editingProp, dispatch, activeBreakpoint };

  const renderChildren = () =>
    node.children.map((c) => (
      <NodeRenderer key={c.id} node={c} depth={depth + 1} {...childProps} />
    ));

  // ── Drag-to-reorder + reparent for container types ────────
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState<{ nodeId: string; insertIndex: number } | null>(null);

  // Detect when a dragged item from another container hovers over this one
  useEffect(() => {
    if (!design || !containerRef.current || !isContainerType(node.type)) return;
    const el = containerRef.current;
    const onEnter = () => { if (globalDrag && globalDrag.parentId !== node.id && globalDrag.nodeId !== node.id) setReparentHighlight(true); };
    const onLeave = () => setReparentHighlight(false);
    const onDropHere = (ev: globalThis.MouseEvent) => {
      if (!globalDrag || globalDrag.parentId === node.id || globalDrag.nodeId === node.id) return;
      // Compute insertion index within this container
      const items = el.querySelectorAll(":scope > [data-dnd-index]");
      const rects = Array.from(items).map((item) => item.getBoundingClientRect());
      let insertIdx = rects.length;
      for (let i = 0; i < rects.length; i++) {
        if (ev.clientY < rects[i].top + rects[i].height / 2) { insertIdx = i; break; }
      }
      globalDrag.onReparent(node.id, insertIdx);
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mouseup", onDropHere);
    return () => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); el.removeEventListener("mouseup", onDropHere); };
  }, [design, node.id, node.type]);

  // Clear reparent highlight when global drag ends
  useEffect(() => {
    if (!reparentHighlight) return;
    const check = () => { if (!globalDrag) setReparentHighlight(false); };
    const id = setInterval(check, 100);
    return () => clearInterval(id);
  }, [reparentHighlight]);

  const onDragHandleDown = (childId: string, childIndex: number) => (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const startY = e.clientY;
    let dragging = false;
    let currentInsert = childIndex;
    let reparented = false;

    const onReparent = (containerId: string, insertIndex: number) => {
      if (dispatch) {
        dispatch({ type: "REORDER_NODE", nodeId: childId, targetParentId: containerId, insertIndex });
        reparented = true;
      }
    };

    const onMove = (ev: globalThis.MouseEvent) => {
      if (!dragging && shouldStartDrag(ev.clientX - e.clientX, ev.clientY - startY)) {
        dragging = true;
        globalDrag = { nodeId: childId, parentId: node.id, onReparent };
        setDragOver({ nodeId: childId, insertIndex: childIndex });
      }
      if (!dragging) return;
      const container = containerRef.current;
      if (!container) return;
      const items = container.querySelectorAll(":scope > [data-dnd-index]");
      const rects = Array.from(items).map((el) => el.getBoundingClientRect());
      const newInsert = computeInsertIndex(ev.clientY, rects, childIndex);
      if (newInsert !== currentInsert) {
        currentInsert = newInsert;
        setDragOver({ nodeId: childId, insertIndex: newInsert });
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      globalDrag = null;
      if (dragging && !reparented && currentInsert !== childIndex && dispatch) {
        dispatch({ type: "REORDER_NODE", nodeId: childId, targetParentId: node.id, insertIndex: currentInsert });
      }
      setDragOver(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const insertLine = <div style={{ height: 2, background: "#2563eb", borderRadius: 1, margin: "2px 8px", flexShrink: 0 }} />;

  const renderDraggableChildren = () => (
    <>
      {node.children.map((c, i) => (
        <React.Fragment key={c.id}>
          {dragOver && dragOver.insertIndex === i && dragOver.nodeId !== c.id && insertLine}
          <div
            data-dnd-index={i}
            style={{ position: "relative", opacity: dragOver?.nodeId === c.id ? 0.4 : 1, transition: "opacity 0.15s" }}
          >
            {design && (
              <div
                onMouseDown={onDragHandleDown(c.id, i)}
                style={{
                  position: "absolute",
                  left: -2,
                  top: 0,
                  width: 10,
                  height: "100%",
                  cursor: "grab",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: hov || dragOver ? 0.6 : 0,
                  transition: "opacity 0.15s",
                  zIndex: 4,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[0, 1, 2].map((j) => (
                    <div key={j} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(26,26,46,0.3)" }} />
                  ))}
                </div>
              </div>
            )}
            <NodeRenderer node={c} depth={depth + 1} {...childProps} />
          </div>
        </React.Fragment>
      ))}
      {dragOver && dragOver.insertIndex === node.children.length && insertLine}
    </>
  );

  // Annotation badge
  const annBubble = hasAnn && design && (() => {
    const allApplied = node.annotations.every((a) => a.applied);
    const hasNoteOnly = node.annotations.every((a) => a.type === "note");
    const bg = allApplied ? "#10b981" : hasNoteOnly ? "#94a3b8" : "#f59e0b";
    const icon = allApplied ? "\u2713" : hasNoteOnly ? "\ud83d\udcce" : node.annotations.length.toString();
    return (
      <div
        title={node.annotations.map((a) => `${a.applied ? "\u2713" : "\ud83d\udccc"} ${a.text}`).join("\n")}
        style={{
          position: "absolute",
          top: -6,
          right: -6,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: bg,
          color: "#fff",
          fontSize: allApplied ? 11 : 9,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
      >
        {icon}
      </div>
    );
  })();

  // Link badge (design mode: shows ↗ icon for linked nodes)
  const linkBadge = linkTo && design && (
    <div
      title="Linked to another screen"
      style={{
        position: "absolute",
        top: -6,
        right: hasAnn ? 16 : -6,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "#fff",
        color: "#2563eb",
        fontSize: 9,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5,
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        border: "1px solid rgba(37,99,235,0.3)",
      }}
    >
      ↗
    </div>
  );

  // Combined badges (annotation + link)
  const badges = <>{annBubble}{linkBadge}</>;

  // ── Structural nodes ──
  if (node.type === "__root") {
    return (
      <div ref={containerRef} style={{ display: "flex", flexDirection: "column", minHeight: "100%" }} onClick={click}>
        {renderDraggableChildren()}
      </div>
    );
  }

  if (node.type === "__row") {
    const stacked = p.direction === "stack";
    return (
      <div
        ref={containerRef}
        onClick={click}
        {...hoverHandlers}
        style={{
          ...baseStyle,
          display: "flex",
          flexDirection: stacked ? "column" : "row",
          gap: p.gap ?? "16px",
          padding: p.padding ?? "24px 48px",
          alignItems: stacked ? "stretch" : (p.align as string) ?? "flex-start",
        }}
      >
        {badges}
        {renderDraggableChildren()}
      </div>
    );
  }

  // ── Nav ──
  if (node.type === "Nav") {
    const navBrand = (p.brand as string) ?? "Brand";
    return (
      <div
        onClick={click}
        {...hoverHandlers}
        style={{
          ...baseStyle,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          height: 56,
          borderBottom: `1px solid ${t("border.default")}`,
          background: t("bg.page"),
          gap: 24,
        }}
      >
        {badges}
        <span
          onDoubleClick={(e) => { e.stopPropagation(); startEdit("brand"); }}
          style={{
            fontWeight: 700,
            fontSize: 16,
            fontFamily: t("font.sans"),
            color: t("text.primary"),
            letterSpacing: "-0.02em",
          }}
        >
          {isEditing && editingProp === "brand" ? (
            <EditableText value={navBrand} style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }} singleLine onCommit={(v) => commitEdit("brand", v)} />
          ) : navBrand}
        </span>
        <div style={{ flex: 1 }} />
        {["Features", "Pricing", "Docs"].map((l) => (
          <span
            key={l}
            style={{
              fontSize: 14,
              color: t("text.secondary"),
              fontFamily: t("font.sans"),
              cursor: live ? "pointer" : "default",
            }}
          >
            {l}
          </span>
        ))}
        <div
          style={{
            padding: "6px 14px",
            borderRadius: t("radius.md"),
            background: t("brand.primary"),
            color: t("brand.primary.fg"),
            fontSize: 13,
            fontWeight: 500,
            fontFamily: t("font.sans"),
            cursor: live ? "pointer" : "default",
          }}
        >
          Sign Up
        </div>
      </div>
    );
  }

  // ── Section ──
  if (node.type === "Section") {
    return (
      <div
        ref={containerRef}
        onClick={click}
        {...hoverHandlers}
        style={{
          ...baseStyle,
          display: "flex",
          flexDirection: "column",
          alignItems: p.align === "center" ? "center" : "flex-start",
          gap: 16,
          padding: `${p.paddingY ?? "48px"} 48px`,
          background: p.bg ? t(p.bg as string) : "transparent",
          textAlign: p.align === "center" ? "center" : undefined,
        }}
      >
        {badges}
        {renderDraggableChildren()}
      </div>
    );
  }

  // ── Card ──
  if (node.type === "Card") {
    return (
      <div
        ref={containerRef}
        onClick={click}
        {...hoverHandlers}
        style={{
          ...baseStyle,
          display: "flex",
          flexDirection: "column",
          alignItems: p.align === "center" ? "center" : "stretch",
          gap: 12,
          padding: 20,
          borderRadius: t("radius.lg"),
          border: `1px solid ${t("border.default")}`,
          background: t("bg.card"),
          boxShadow: tokens["shadow.md"],
          flex: p.flex as string ?? "1",
          textAlign: p.align === "center" ? "center" : undefined,
        }}
      >
        {badges}
        {renderDraggableChildren()}
      </div>
    );
  }

  // ── Button ──
  if (node.type === "Button") {
    const v = node.variant ?? "primary";
    const sz = p.size === "lg" ? { h: 48, px: 24, fs: 16 } : { h: 38, px: 16, fs: 14 };
    const variants: Record<string, CSSProperties> = {
      primary:     { background: t("brand.primary"), color: t("brand.primary.fg"), border: "none" },
      secondary:   { background: t("bg.muted"), color: t("text.primary"), border: "none" },
      outline:     { background: "transparent", color: t("text.primary"), border: `1px solid ${t("border.default")}` },
      ghost:       { background: "transparent", color: t("text.primary"), border: "none" },
      destructive: { background: t("brand.destructive"), color: "#fff", border: "none" },
    };
    const vs = variants[v] ?? variants.primary;

    const btnLabel = (p.label as string) ?? "Button";
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (design) onSelect(node);
          else { setPressed(true); setTimeout(() => setPressed(false), 150); }
        }}
        onDoubleClick={(e) => { e.stopPropagation(); startEdit("label"); }}
        {...hoverHandlers}
        style={{
          ...baseStyle,
          ...vs,
          height: sz.h,
          padding: `0 ${sz.px}px`,
          fontSize: sz.fs,
          fontWeight: 500,
          fontFamily: t("font.sans"),
          borderRadius: t("radius.md"),
          cursor: live ? "pointer" : "default",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transform: pressed ? "scale(0.96)" : "none",
          transition: "transform 0.12s ease",
          width: p.size === "lg" ? "100%" : undefined,
          letterSpacing: "-0.01em",
        }}
      >
        {badges}
        {isEditing && editingProp === "label" ? (
          <EditableText value={btnLabel} style={{ fontSize: sz.fs, fontWeight: 500 }} singleLine onCommit={(v) => commitEdit("label", v)} />
        ) : btnLabel}
      </button>
    );
  }

  // ── Text ──
  if (node.type === "Text") {
    // Token-resolved type scale. Headings use font.heading (falling back to font.sans);
    // body variants use font.sans. parseNum strips "px"/unit suffixes from the token values.
    const styleMap: Record<string, CSSProperties> = {
      h1: {
        fontSize: parseNum(t("text.5xl"), 48),
        fontWeight: parseNum(t("font.weight.extrabold"), 800),
        lineHeight: parseNum(t("leading.tight"), 1.1),
        letterSpacing: "-0.03em",
        fontFamily: t("font.heading") ?? t("font.sans"),
      },
      h2: {
        fontSize: parseNum(t("text.3xl"), 30),
        fontWeight: parseNum(t("font.weight.bold"), 700),
        lineHeight: parseNum(t("leading.snug"), 1.25),
        letterSpacing: "-0.02em",
        fontFamily: t("font.heading") ?? t("font.sans"),
      },
      h3: {
        fontSize: parseNum(t("text.xl"), 20),
        fontWeight: parseNum(t("font.weight.semibold"), 600),
        lineHeight: parseNum(t("leading.snug"), 1.25),
        letterSpacing: "-0.015em",
        fontFamily: t("font.heading") ?? t("font.sans"),
      },
      p: {
        fontSize: parseNum(t("text.base"), 16),
        fontWeight: parseNum(t("font.weight.normal"), 400),
        lineHeight: parseNum(t("leading.relaxed"), 1.65),
        fontFamily: t("font.sans"),
      },
      caption: {
        fontSize: parseNum(t("text.xs"), 12),
        fontWeight: parseNum(t("font.weight.normal"), 400),
        lineHeight: parseNum(t("leading.normal"), 1.5),
        fontFamily: t("font.sans"),
      },
      label: {
        fontSize: parseNum(t("text.sm"), 14),
        fontWeight: parseNum(t("font.weight.medium"), 500),
        lineHeight: parseNum(t("leading.snug"), 1.25),
        fontFamily: t("font.sans"),
      },
    };
    const sm = styleMap[node.variant ?? "p"] ?? styleMap.p;
    const isSecondary = node.variant === "caption" || node.variant === "label";
    const singleLine = node.variant !== "p";
    const textContent = (p.content as string) ?? "Text";

    return (
      <div
        onClick={click}
        onDoubleClick={(e) => { e.stopPropagation(); startEdit("content"); }}
        {...hoverHandlers}
        style={{
          ...baseStyle,
          ...sm,
          // fontFamily is set per-variant in styleMap (headings use font.heading, body uses font.sans)
          color: p.color ? t(p.color as string) : t(isSecondary ? "text.secondary" : "text.primary"),
          whiteSpace: "pre-line",
          padding: p.paddingY ? `${p.paddingY} 0` : undefined,
          textAlign: (p.align as CSSProperties["textAlign"]) ?? undefined,
        }}
      >
        {badges}
        {isEditing && editingProp === "content" ? (
          <EditableText value={textContent} style={sm} singleLine={singleLine} onCommit={(v) => commitEdit("content", v)} />
        ) : textContent}
      </div>
    );
  }

  // ── Badge ──
  if (node.type === "Badge") {
    const variants: Record<string, CSSProperties> = {
      default:     { background: t("brand.primary"), color: t("brand.primary.fg") },
      secondary:   { background: t("bg.muted"), color: t("text.primary") },
      outline:     { background: "transparent", color: t("text.primary"), border: `1px solid ${t("border.default")}` },
      destructive: { background: t("brand.destructive"), color: "#fff" },
    };
    const vs = variants[node.variant ?? "default"] ?? variants.default;

    const badgeLabel = (p.label as string) ?? "Badge";
    return (
      <span
        onClick={click}
        onDoubleClick={(e) => { e.stopPropagation(); startEdit("label"); }}
        {...hoverHandlers}
        style={{
          ...baseStyle,
          ...vs,
          display: "inline-flex",
          alignItems: "center",
          padding: "2px 10px",
          borderRadius: 9999,
          fontSize: 12,
          fontWeight: 500,
          fontFamily: t("font.sans"),
          lineHeight: "20px",
        }}
      >
        {badges}
        {isEditing && editingProp === "label" ? (
          <EditableText value={badgeLabel} style={{ fontSize: 12, fontWeight: 500 }} singleLine onCommit={(v) => commitEdit("label", v)} />
        ) : badgeLabel}
      </span>
    );
  }

  // ── Avatar ──
  if (node.type === "Avatar") {
    const sizes: Record<string, number> = { sm: 28, md: 36, lg: 48 };
    const sz = sizes[(p.size as string) ?? "md"] ?? 36;

    return (
      <div
        onClick={click}
        {...hoverHandlers}
        style={{
          ...baseStyle,
          width: sz,
          height: sz,
          borderRadius: node.variant === "square" ? t("radius.md") : "50%",
          background: t("bg.muted"),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: sz * 0.38,
          fontWeight: 600,
          fontFamily: t("font.sans"),
          color: t("text.secondary"),
          flexShrink: 0,
        }}
      >
        {badges}
        {(p.initials as string) ?? "?"}
      </div>
    );
  }

  // ── Separator ──
  if (node.type === "Separator") {
    return (
      <div
        onClick={click}
        {...hoverHandlers}
        style={{ ...baseStyle, height: 1, background: t("border.default"), width: "100%", margin: "4px 0" }}
      >
        {badges}
      </div>
    );
  }

  // ── Image ──
  if (node.type === "Image") {
    return (
      <div
        onClick={click}
        {...hoverHandlers}
        style={{
          ...baseStyle,
          aspectRatio: "16/9",
          background: `linear-gradient(135deg, ${t("bg.muted")}, ${t("border.default")})`,
          borderRadius: node.variant === "rounded" ? t("radius.lg") : t("radius.md"),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: t("text.tertiary"),
          fontSize: 13,
          fontFamily: t("font.sans"),
          flex: p.flex as string ?? undefined,
        }}
      >
        {badges}
        {(p.alt as string) ?? "Image"}
      </div>
    );
  }

  // ── Input ──
  if (node.type === "Input") {
    const inputPlaceholder = (p.placeholder as string) ?? "Type...";
    return (
      <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, display: "flex", flexDirection: "column", gap: 6 }}>
        {badges}
        {p.label && (
          <label style={{ fontSize: 14, fontWeight: 500, fontFamily: t("font.sans"), color: t("text.primary") }}>
            {p.label as string}
          </label>
        )}
        <div
          onDoubleClick={(e) => { e.stopPropagation(); startEdit("placeholder"); }}
          style={{
            height: node.variant === "textarea" ? 80 : 40,
            padding: "0 12px",
            borderRadius: t("radius.md"),
            border: `1px solid ${t("border.default")}`,
            background: t("bg.page"),
            fontFamily: t("font.sans"),
            fontSize: 14,
            display: "flex",
            alignItems: node.variant === "textarea" ? "flex-start" : "center",
            paddingTop: node.variant === "textarea" ? 8 : undefined,
            color: t("text.tertiary"),
          }}
        >
          {isEditing && editingProp === "placeholder" ? (
            <EditableText value={inputPlaceholder} style={{ fontSize: 14, color: t("text.tertiary") }} singleLine={node.variant !== "textarea"} onCommit={(v) => commitEdit("placeholder", v)} />
          ) : inputPlaceholder}
        </div>
      </div>
    );
  }

  // ── Dropdown ──
  if (node.type === "Dropdown") {
    const options = (p.options as string[]) ?? ["Option A", "Option B", "Option C"];
    return (
      <div
        onClick={(e) => { e.stopPropagation(); if (design) onSelect(node); else setDdOpen(!ddOpen); }}
        {...hoverHandlers}
        style={{ ...baseStyle, position: "relative" }}
      >
        {badges}
        <div
          style={{
            height: 40,
            padding: "0 12px",
            borderRadius: t("radius.md"),
            border: `1px solid ${t("border.default")}`,
            background: t("bg.page"),
            fontFamily: t("font.sans"),
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: live ? "pointer" : "default",
          }}
        >
          <span>{(p.placeholder as string) ?? "Select..."}</span>
          <span style={{ fontSize: 10, color: t("text.tertiary"), transform: ddOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▼</span>
        </div>
        {ddOpen && live && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: 4,
              background: t("bg.page"),
              border: `1px solid ${t("border.default")}`,
              borderRadius: t("radius.md"),
              boxShadow: tokens["shadow.lg"],
              zIndex: 20,
              overflow: "hidden",
            }}
          >
            {options.map((o, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setDdOpen(false); }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = t("bg.muted"); }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                style={{ padding: "8px 12px", fontSize: 14, fontFamily: t("font.sans"), cursor: "pointer" }}
              >
                {o}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Tabs ──
  if (node.type === "Tabs") {
    const tabs = (p.tabs as string[]) ?? ["Tab 1", "Tab 2", "Tab 3"];
    return (
      <div onClick={click} {...hoverHandlers} style={baseStyle}>
        {badges}
        <div style={{ display: "flex", borderBottom: `1px solid ${t("border.default")}` }}>
          {tabs.map((tb, i) => (
            <div
              key={i}
              onClick={live ? (e) => { e.stopPropagation(); setTabIdx(i); } : undefined}
              style={{
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: tabIdx === i ? 600 : 400,
                fontFamily: t("font.sans"),
                color: tabIdx === i ? t("brand.primary") : t("text.secondary"),
                borderBottom: tabIdx === i ? `2px solid ${t("brand.primary")}` : "2px solid transparent",
                cursor: live ? "pointer" : "default",
              }}
            >
              {tb}
            </div>
          ))}
        </div>
        <div style={{ padding: 16, fontSize: 14, fontFamily: t("font.sans"), color: t("text.secondary") }}>
          Content for {tabs[tabIdx]}
        </div>
      </div>
    );
  }

  // ── Toggle ──
  if (node.type === "Toggle") {
    return (
      <div
        onClick={(e) => { e.stopPropagation(); if (design) onSelect(node); else setToggled(!toggled); }}
        {...hoverHandlers}
        style={{ ...baseStyle, display: "flex", alignItems: "center", gap: 10, cursor: live ? "pointer" : "default" }}
      >
        {badges}
        <div
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            background: toggled ? t("brand.primary") : t("border.default"),
            transition: "background 0.2s",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 2,
              left: toggled ? 22 : 2,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: tokens["shadow.sm"],
              transition: "left 0.2s",
            }}
          />
        </div>
        <span style={{ fontSize: 14, fontFamily: t("font.sans"), color: t("text.primary") }}>
          {(p.label as string) ?? "Toggle"}
        </span>
      </div>
    );
  }

  // ── Table ──
  if (node.type === "Table") {
    const headers = (p.headers as string[]) ?? ["Col 1", "Col 2", "Col 3"];
    const rows = (p.rows as string[][]) ?? [["A", "B", "C"]];
    const striped = !!p.striped;
    const compact = !!p.compact;
    const cellPad = compact ? "4px 8px" : "8px 12px";
    return (
      <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, overflow: "auto" }}>
        {badges}
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: t("font.sans"), fontSize: compact ? 12 : 14 }}>
          <thead>
            <tr>{headers.map((h, i) => <th key={i} style={{ padding: cellPad, textAlign: "left", fontWeight: 600, color: t("text.primary"), borderBottom: `2px solid ${t("border.default")}`, background: t("bg.subtle") }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: cellPad, color: t("text.secondary"), borderBottom: `1px solid ${t("border.default")}`, background: striped && ri % 2 === 1 ? t("bg.muted") : "transparent" }}>{cell}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Modal ──
  if (node.type === "Modal") {
    return (
      <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, position: "relative", padding: 4 }}>
        {badges}
        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: t("radius.lg"), padding: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: t("bg.card"), borderRadius: t("radius.lg"), padding: 24, minWidth: 280, boxShadow: tokens["shadow.xl"], display: "flex", flexDirection: "column", gap: 12 }}>
            {renderChildren()}
          </div>
        </div>
      </div>
    );
  }

  // ── Toast ──
  if (node.type === "Toast") {
    const colors: Record<string, string> = { success: "#10b981", error: "#ef4444", warning: "#f59e0b", info: "#3b82f6" };
    const borderColor = colors[node.variant ?? "info"] ?? colors.info;
    return (
      <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: t("radius.md"), border: `1px solid ${t("border.default")}`, borderLeft: `4px solid ${borderColor}`, background: t("bg.card"), fontFamily: t("font.sans"), fontSize: 13, color: t("text.primary") }}>
        {badges}
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: borderColor, flexShrink: 0 }} />
        <span style={{ flex: 1 }}>{(p.message as string) ?? "Notification"}</span>
        <span style={{ fontSize: 11, color: t("text.tertiary"), cursor: live ? "pointer" : "default" }}>&times;</span>
      </div>
    );
  }

  // ── Progress ──
  if (node.type === "Progress") {
    const pct = Math.min(100, Math.max(0, (p.percentage as number) ?? 50));
    if (node.variant === "circle") {
      const r = 32, c = 2 * Math.PI * r;
      return (
        <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          {badges}
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={r} fill="none" stroke={t("bg.muted")} strokeWidth="6" />
            <circle cx="40" cy="40" r={r} fill="none" stroke={t("brand.primary")} strokeWidth="6" strokeDasharray={`${c * pct / 100} ${c}`} strokeLinecap="round" transform="rotate(-90 40 40)" />
            <text x="40" y="44" textAnchor="middle" style={{ fontSize: 14, fontWeight: 600, fontFamily: t("font.sans"), fill: t("text.primary") }}>{pct}%</text>
          </svg>
          <span style={{ fontSize: 12, color: t("text.secondary"), fontFamily: t("font.sans") }}>{(p.label as string) ?? ""}</span>
        </div>
      );
    }
    if (node.variant === "steps") {
      const steps = (p.steps as string[]) ?? ["Step 1", "Step 2", "Step 3"];
      const cur = (p.currentStep as number) ?? 0;
      return (
        <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, display: "flex", alignItems: "center", gap: 0, fontFamily: t("font.sans") }}>
          {badges}
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ flex: 1, height: 2, background: i <= cur ? t("brand.primary") : t("bg.muted") }} />}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: i <= cur ? t("brand.primary") : t("bg.muted"), color: i <= cur ? t("brand.primary.fg") : t("text.tertiary"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>{i + 1}</div>
                <span style={{ fontSize: 10, color: i <= cur ? t("text.primary") : t("text.tertiary"), whiteSpace: "nowrap" }}>{s}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      );
    }
    // bar (default)
    return (
      <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, display: "flex", flexDirection: "column", gap: 6 }}>
        {badges}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: t("font.sans") }}>
          <span style={{ color: t("text.secondary") }}>{(p.label as string) ?? "Progress"}</span>
          <span style={{ color: t("text.primary"), fontWeight: 600 }}>{pct}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: t("bg.muted"), overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: t("brand.primary"), transition: "width 0.3s" }} />
        </div>
      </div>
    );
  }

  // ── Breadcrumb ──
  if (node.type === "Breadcrumb") {
    const items = (p.items as string[]) ?? ["Home"];
    return (
      <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, display: "flex", alignItems: "center", gap: 6, fontFamily: t("font.sans"), fontSize: 13 }}>
        {badges}
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: t("text.tertiary") }}>/</span>}
            <span style={{ color: i === items.length - 1 ? t("text.primary") : t("text.secondary"), fontWeight: i === items.length - 1 ? 500 : 400, cursor: live ? "pointer" : "default" }}>{item}</span>
          </React.Fragment>
        ))}
      </div>
    );
  }

  // ── Sidebar ──
  if (node.type === "Sidebar") {
    const collapsed = !!p.collapsed;
    return (
      <div ref={containerRef} onClick={click} {...hoverHandlers} style={{ ...baseStyle, width: collapsed ? 56 : 220, background: t("bg.card"), borderRight: `1px solid ${t("border.default")}`, padding: collapsed ? "16px 8px" : "16px", display: "flex", flexDirection: "column", gap: 4, minHeight: 300 }}>
        {badges}
        {renderDraggableChildren()}
      </div>
    );
  }

  // ── Footer ──
  if (node.type === "Footer") {
    return (
      <div ref={containerRef} onClick={click} {...hoverHandlers} style={{ ...baseStyle, background: t("bg.muted"), padding: "24px 32px", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: node.variant === "simple" ? "center" : "flex-start" }}>
        {badges}
        {renderDraggableChildren()}
      </div>
    );
  }

  // ── Form ──
  if (node.type === "Form") {
    return (
      <div ref={containerRef} onClick={click} {...hoverHandlers} style={{ ...baseStyle, display: "flex", flexDirection: "column", gap: 12, padding: 20, maxWidth: 400 }}>
        {badges}
        {renderDraggableChildren()}
      </div>
    );
  }

  // ── Chart ──
  if (node.type === "Chart") {
    const title = (p.title as string) ?? "Chart";
    const caption = (p.caption as string) ?? "";
    const isRound = node.variant === "pie" || node.variant === "donut";
    return (
      <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, display: "flex", flexDirection: "column", gap: 8 }}>
        {badges}
        <span style={{ fontSize: 14, fontWeight: 600, fontFamily: t("font.sans"), color: t("text.primary") }}>{title}</span>
        {isRound ? (
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ alignSelf: "center" }}>
            <circle cx="60" cy="60" r="50" fill={t("brand.primary")} opacity={0.15} />
            <circle cx="60" cy="60" r="50" fill="none" stroke={t("brand.primary")} strokeWidth="10" strokeDasharray="200 314" strokeLinecap="round" transform="rotate(-90 60 60)" />
            {node.variant === "donut" && <circle cx="60" cy="60" r="30" fill={t("bg.card")} />}
          </svg>
        ) : (
          <div style={{ height: 120, display: "flex", alignItems: "flex-end", gap: 8, padding: "0 8px" }}>
            {[65, 40, 80, 55, 90, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0", background: node.variant === "line" ? "transparent" : t("brand.primary"), borderBottom: node.variant === "line" ? `2px solid ${t("brand.primary")}` : "none", opacity: 0.6 + i * 0.06 }} />
            ))}
          </div>
        )}
        {caption && <span style={{ fontSize: 11, color: t("text.tertiary"), fontFamily: t("font.sans") }}>{caption}</span>}
      </div>
    );
  }

  // ── Skeleton ──
  if (node.type === "Skeleton") {
    const lines = (p.lines as number) ?? 3;
    const renderSkelLine = (w: string, h: number, key: number) => (
      <div key={key} style={{ width: w, height: h, borderRadius: t("radius.md"), background: t("bg.muted") }}>
        <style>{`@keyframes skel{0%,100%{opacity:0.4}50%{opacity:0.8}}`}</style>
        <div style={{ width: "100%", height: "100%", borderRadius: "inherit", animation: "skel 1.5s ease-in-out infinite" }} />
      </div>
    );
    if (node.variant === "avatar") {
      return (
        <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, display: "flex", alignItems: "center", gap: 12 }}>
          {badges}
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: t("bg.muted"), animation: "skel 1.5s ease-in-out infinite" }}><style>{`@keyframes skel{0%,100%{opacity:0.4}50%{opacity:0.8}}`}</style></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            {renderSkelLine("60%", 12, 0)}
            {renderSkelLine("40%", 10, 1)}
          </div>
        </div>
      );
    }
    if (node.variant === "card") {
      return (
        <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, padding: 16, borderRadius: t("radius.lg"), border: `1px solid ${t("border.default")}`, display: "flex", flexDirection: "column", gap: 10 }}>
          {badges}
          {renderSkelLine("100%", 120, 0)}
          {renderSkelLine("70%", 14, 1)}
          {renderSkelLine("50%", 10, 2)}
        </div>
      );
    }
    if (node.variant === "table") {
      return (
        <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, display: "flex", flexDirection: "column", gap: 8 }}>
          {badges}
          {Array.from({ length: lines }).map((_, i) => renderSkelLine("100%", 16, i))}
        </div>
      );
    }
    // text (default)
    return (
      <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, display: "flex", flexDirection: "column", gap: 8 }}>
        {badges}
        {Array.from({ length: lines }).map((_, i) => renderSkelLine(i === lines - 1 ? "60%" : "100%", 14, i))}
      </div>
    );
  }

  // ── Accordion ──
  if (node.type === "Accordion") {
    const items = (p.items as Array<{ title: string; content: string }>) ?? [{ title: "Item", content: "Content" }];
    const [expandedIdx, setExpandedIdx] = useState<number | null>(design ? null : 0);
    return (
      <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, borderRadius: t("radius.md"), border: `1px solid ${t("border.default")}`, overflow: "hidden", fontFamily: t("font.sans") }}>
        {badges}
        {items.map((item, i) => {
          const open = design || expandedIdx === i;
          return (
            <div key={i} style={{ borderBottom: i < items.length - 1 ? `1px solid ${t("border.default")}` : "none" }}>
              <div
                onClick={live ? (e) => { e.stopPropagation(); setExpandedIdx(expandedIdx === i ? null : i); } : undefined}
                style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: live ? "pointer" : "default", background: t("bg.card") }}
              >
                <span style={{ fontSize: 14, fontWeight: 500, color: t("text.primary") }}>{item.title}</span>
                <span style={{ fontSize: 10, color: t("text.tertiary"), transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>\u25BC</span>
              </div>
              {open && <div style={{ padding: "8px 14px 12px", fontSize: 13, lineHeight: 1.5, color: t("text.secondary"), background: t("bg.subtle") }}>{item.content}</div>}
            </div>
          );
        })}
      </div>
    );
  }

  // ── Alert ──
  if (node.type === "Alert") {
    const alertColors: Record<string, { bg: string; border: string; text: string }> = {
      info:    { bg: "rgba(59,130,246,0.08)", border: "#3b82f6", text: "#1d4ed8" },
      success: { bg: "rgba(16,185,129,0.08)", border: "#10b981", text: "#059669" },
      warning: { bg: "rgba(245,158,11,0.08)", border: "#f59e0b", text: "#d97706" },
      error:   { bg: "rgba(239,68,68,0.08)",  border: "#ef4444", text: "#dc2626" },
    };
    const ac = alertColors[node.variant ?? "info"] ?? alertColors.info;
    return (
      <div onClick={click} {...hoverHandlers} style={{ ...baseStyle, display: "flex", flexDirection: "column", gap: 4, padding: "12px 16px", borderRadius: t("radius.md"), background: ac.bg, borderLeft: `4px solid ${ac.border}`, fontFamily: t("font.sans") }}>
        {badges}
        <span style={{ fontSize: 14, fontWeight: 600, color: ac.text }}>{(p.title as string) ?? "Alert"}</span>
        <span style={{ fontSize: 13, color: ac.text, opacity: 0.8, lineHeight: 1.4 }}>{(p.description as string) ?? ""}</span>
      </div>
    );
  }

  // ── Fallback ──
  return (
    <div onClick={click} style={{ ...baseStyle, padding: 8, border: "1px dashed #ccc", fontSize: 12 }}>
      {badges}
      {node.type}
    </div>
  );
}
