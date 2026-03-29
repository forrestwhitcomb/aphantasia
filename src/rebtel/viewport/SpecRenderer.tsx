"use client";

// ============================================================
// SpecRenderer — Recursive React component for ComponentSpec
// ============================================================
// Replaces the iframe + renderSpec() HTML string pipeline.
// Walks a ComponentSpec tree and renders real DOM elements.
// Supports design mode (selection, text editing) and preview
// mode (button presses, toggles, navigation).
// ============================================================

import { useState, useCallback, createElement } from "react";
import type { ComponentSpec } from "../spec/types";
import { buildStyleObject } from "./buildStyleObject";
import { TextNode } from "./TextNode";

export interface SpecRendererProps {
  spec: ComponentSpec;
  shapeId: string;
  selectedKey: string | null;
  onSelect: (shapeId: string, key: string, spec: ComponentSpec) => void;
  onTextChange: (shapeId: string, key: string, newText: string) => void;
  onNavigate?: (screenId: string) => void;
  isDesignMode: boolean;
}

export function SpecRenderer({
  spec,
  shapeId,
  selectedKey,
  onSelect,
  onTextChange,
  onNavigate,
  isDesignMode,
}: SpecRendererProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [toggledKeys, setToggledKeys] = useState<Set<string>>(new Set());

  const handlePress = useCallback((key: string) => {
    setPressedKeys((prev) => new Set(prev).add(key));
    setTimeout(() => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 150);
  }, []);

  const handleToggle = useCallback((key: string) => {
    setToggledKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <SpecNode
      spec={spec}
      shapeId={shapeId}
      selectedKey={selectedKey}
      onSelect={onSelect}
      onTextChange={onTextChange}
      onNavigate={onNavigate}
      isDesignMode={isDesignMode}
      pressedKeys={pressedKeys}
      toggledKeys={toggledKeys}
      onPress={handlePress}
      onToggle={handleToggle}
    />
  );
}

// ── Internal recursive node ──────────────────────────────────

interface SpecNodeProps {
  spec: ComponentSpec;
  shapeId: string;
  selectedKey: string | null;
  onSelect: (shapeId: string, key: string, spec: ComponentSpec) => void;
  onTextChange: (shapeId: string, key: string, newText: string) => void;
  onNavigate?: (screenId: string) => void;
  isDesignMode: boolean;
  pressedKeys: Set<string>;
  toggledKeys: Set<string>;
  onPress: (key: string) => void;
  onToggle: (key: string) => void;
}

function SpecNode({
  spec,
  shapeId,
  selectedKey,
  onSelect,
  onTextChange,
  onNavigate,
  isDesignMode,
  pressedKeys,
  toggledKeys,
  onPress,
  onToggle,
}: SpecNodeProps) {
  const style = buildStyleObject(spec);
  const isSelected = selectedKey === spec.key;
  const isPressed = pressedKeys.has(spec.key);
  const isToggled = toggledKeys.has(spec.key);

  // Selection outline in design mode
  if (isSelected) {
    style.outline = "2px solid #3B82F6";
    style.outlineOffset = "-2px";
  }

  // Button press animation in preview mode
  if (isPressed && spec.interactive?.type === "button") {
    style.transform = "scale(0.97)";
    style.opacity = 0.8;
    style.transition = "transform 0.15s, opacity 0.15s";
  } else if (spec.interactive?.type === "button") {
    style.transition = "transform 0.15s, opacity 0.15s";
  }

  // Toggle state
  if (isToggled && spec.interactive?.type === "toggle") {
    // Toggle "on" — handled by children via class check
  }

  // Preview mode cursor
  if (!isDesignMode && (spec.interactive || spec.data?.["navigate-to"])) {
    style.cursor = "pointer";
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDesignMode) {
      onSelect(shapeId, spec.key, spec);
      return;
    }

    // Preview mode interactions
    if (spec.interactive) {
      switch (spec.interactive.type) {
        case "button":
          onPress(spec.key);
          if (spec.interactive.navigateTo && onNavigate) {
            onNavigate(spec.interactive.navigateTo);
          }
          break;
        case "toggle":
          onToggle(spec.key);
          break;
        case "tab":
          // Tab switching handled at parent level
          break;
        case "link":
          if (spec.interactive.navigateTo && onNavigate) {
            onNavigate(spec.interactive.navigateTo);
          }
          break;
      }
    }
  };

  // Build data attributes
  const dataAttrs: Record<string, string> = {};
  dataAttrs["data-spec-key"] = spec.key;
  if (spec.interactive) {
    dataAttrs["data-interactive"] = spec.interactive.type;
    if (spec.interactive.navigateTo) {
      dataAttrs["data-navigate-to"] = spec.interactive.navigateTo;
    }
  }
  if (spec.data) {
    for (const [k, v] of Object.entries(spec.data)) {
      if (k === "innerHTML") continue;
      dataAttrs[`data-${k.toLowerCase()}`] = v;
    }
  }

  // Children
  const children: React.ReactNode[] = [];

  // SVG innerHTML injection
  if (spec.data?.innerHTML) {
    children.push(
      <span
        key="__innerHTML"
        dangerouslySetInnerHTML={{ __html: spec.data.innerHTML }}
      />
    );
  }

  // Text content
  if (spec.text) {
    children.push(
      <TextNode
        key="__text"
        text={spec.text}
        specKey={spec.key}
        isDesignMode={isDesignMode}
        onTextChange={(key, newText) => onTextChange(shapeId, key, newText)}
      />
    );
  }

  // Child specs
  if (spec.children) {
    const keyCounts: Record<string, number> = {};
    for (const child of spec.children) {
      const count = keyCounts[child.key] ?? 0;
      keyCounts[child.key] = count + 1;
      const uniqueKey = count === 0 ? child.key : `${child.key}__${count}`;
      children.push(
        <SpecNode
          key={uniqueKey}
          spec={child}
          shapeId={shapeId}
          selectedKey={selectedKey}
          onSelect={onSelect}
          onTextChange={onTextChange}
          onNavigate={onNavigate}
          isDesignMode={isDesignMode}
          pressedKeys={pressedKeys}
          toggledKeys={toggledKeys}
          onPress={onPress}
          onToggle={onToggle}
        />
      );
    }
  }

  return createElement(
    spec.tag,
    {
      style,
      onClick: handleClick,
      ...dataAttrs,
    },
    children.length > 0 ? children : undefined
  );
}
