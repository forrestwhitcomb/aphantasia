// ============================================================
// TextNode — contentEditable text sub-component
// ============================================================
// Renders text content from a ComponentSpec TextSpec.
// In design mode with editable=true, enables inline text editing
// via contentEditable. On blur, fires onTextChange callback.
// ============================================================

import { useRef, useState, useCallback } from "react";
import type { TextSpec } from "../spec/types";
import { buildTextStyle } from "./buildStyleObject";

interface TextNodeProps {
  text: TextSpec;
  specKey: string;
  isDesignMode: boolean;
  onTextChange?: (key: string, newText: string) => void;
}

export function TextNode({ text, specKey, isDesignMode, onTextChange }: TextNodeProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const style = buildTextStyle(text);

  const handleBlur = useCallback(() => {
    if (!spanRef.current || !onTextChange) return;
    const newText = spanRef.current.textContent ?? "";
    if (newText !== text.content) {
      onTextChange(specKey, newText);
    }
  }, [specKey, text.content, onTextChange]);

  const isEditable = isDesignMode && text.editable;

  return (
    <span
      ref={isEditable ? spanRef : undefined}
      style={{
        ...style,
        cursor: isEditable ? "text" : undefined,
        borderBottom: isEditable && hovered ? "1px dashed rgba(59,130,246,0.4)" : undefined,
      }}
      contentEditable={isEditable || undefined}
      suppressContentEditableWarning={isEditable || undefined}
      onBlur={isEditable ? handleBlur : undefined}
      onClick={isEditable ? (e) => {
        e.stopPropagation();
        spanRef.current?.focus();
      } : undefined}
      onMouseEnter={isEditable ? () => setHovered(true) : undefined}
      onMouseLeave={isEditable ? () => setHovered(false) : undefined}
    >
      {text.content}
    </span>
  );
}
