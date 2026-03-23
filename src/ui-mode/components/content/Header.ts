// Header — Page title / headline. Variants: "large" | "medium" | "small"
//
// When `label` contains newlines (from the canvas text tool), renders:
//   line 1 → large headline (h1)
//   line 2 → subheader (h2)
//   line 3+ → paragraph body text

import type { UIComponentPropsBase } from "../../types";

export interface HeaderProps extends UIComponentPropsBase {
  variant?: "large" | "medium" | "small";
}

const SIZE_MAP: Record<string, { className: string; tag: string }> = {
  large: { className: "ui-header--large", tag: "h1" },
  medium: { className: "ui-header--medium", tag: "h2" },
  small: { className: "ui-header--small", tag: "h3" },
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderHeader(props: Partial<HeaderProps> = {}): string {
  const raw = props.label ?? "";
  const variant = props.variant ?? "medium";

  // Multi-line text tool: headline + optional subheader + paragraphs
  if (raw.includes("\n")) {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length === 0) {
      return `
<div class="ui-header ui-text-stack" data-component="header">
  <div class="${SIZE_MAP.large.className}"><h1 class="ui-header__text">Title</h1></div>
</div>`;
    }
    const parts: string[] = [];
    parts.push(
      `<div class="${SIZE_MAP.large.className}"><h1 class="ui-header__text">${escapeHtml(lines[0])}</h1></div>`
    );
    if (lines.length >= 2) {
      parts.push(
        `<div class="${SIZE_MAP.medium.className}"><h2 class="ui-header__text">${escapeHtml(lines[1])}</h2></div>`
      );
    }
    for (let i = 2; i < lines.length; i++) {
      parts.push(`<p class="ui-text-block__p">${escapeHtml(lines[i])}</p>`);
    }
    return `
<div class="ui-header ui-text-stack" data-component="header">
  ${parts.join("\n  ")}
</div>`;
  }

  // Single-line: preserve variant (keyword-resolved headers, etc.)
  const title = raw.trim() === "" ? "Title" : raw;
  const { className, tag } = SIZE_MAP[variant] ?? SIZE_MAP.medium;
  const safe = escapeHtml(title);

  return `
<div class="ui-header ${className}" data-component="header">
  <${tag} class="ui-header__text">${safe}</${tag}>
</div>`;
}
