// ============================================================
// Aphantasia/System — Figma Export via code.to.design API
// ============================================================

import type { SpecNode, Screen, Project } from "../types";

// ── Token → CSS ─────────────────────────────────────────────

function tok(tokens: Record<string, string>, key: string, fallback?: string): string {
  return tokens[key] ?? fallback ?? key;
}

function generateCSS(tokens: Record<string, string>): string {
  return `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: ${tok(tokens, "bg.page", "#fff")}; color: ${tok(tokens, "text.primary", "#0f172a")}; }
.flex-col { display: flex; flex-direction: column; }
.flex-row { display: flex; flex-direction: row; }
.items-center { align-items: center; }
.items-stretch { align-items: stretch; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.text-center { text-align: center; }
.w-full { width: 100%; }
.gap-4 { gap: 16px; }
.gap-3 { gap: 12px; }
.gap-2 { gap: 8px; }
`;
}

// ── SpecNode → HTML ─────────────────────────────────────────

function nodeToHTML(node: SpecNode, tokens: Record<string, string>, indent: number): string {
  const pad = "  ".repeat(indent);
  const p = node.props as Record<string, string | number | boolean | string[] | undefined>;
  const t = (k: string, fb?: string) => tok(tokens, k, fb);
  const linkAttr = p.linkTo ? ` data-link="${p.linkTo}"` : "";

  if (node.type === "__root") {
    const children = node.children.map(c => nodeToHTML(c, tokens, indent)).join("\n");
    return `${pad}<div style="display:flex;flex-direction:column;min-height:100%">\n${children}\n${pad}</div>`;
  }

  if (node.type === "__row") {
    const dir = p.direction === "stack" ? "column" : "row";
    const children = node.children.map(c => nodeToHTML(c, tokens, indent + 1)).join("\n");
    return `${pad}<div style="display:flex;flex-direction:${dir};gap:${p.gap ?? "16px"};padding:${p.padding ?? "24px 48px"};align-items:${dir === "column" ? "stretch" : (p.align as string) ?? "flex-start"}">\n${children}\n${pad}</div>`;
  }

  if (node.type === "Nav") {
    const brand = (p.brand as string) ?? "Brand";
    return `${pad}<nav style="display:flex;align-items:center;padding:0 24px;height:56px;border-bottom:1px solid ${t("border.default")};background:${t("bg.page")};gap:24px"${linkAttr}>
${pad}  <span style="font-weight:700;font-size:16px;color:${t("text.primary")};letter-spacing:-0.02em">${brand}</span>
${pad}  <div style="flex:1"></div>
${pad}  <span style="font-size:14px;color:${t("text.secondary")}">Features</span>
${pad}  <span style="font-size:14px;color:${t("text.secondary")}">Pricing</span>
${pad}  <span style="font-size:14px;color:${t("text.secondary")}">Docs</span>
${pad}  <div style="padding:6px 14px;border-radius:${t("radius.md")};background:${t("brand.primary")};color:${t("brand.primary.fg")};font-size:13px;font-weight:500">Sign Up</div>
${pad}</nav>`;
  }

  if (node.type === "Section") {
    const align = p.align === "center" ? "center" : "flex-start";
    const children = node.children.map(c => nodeToHTML(c, tokens, indent + 1)).join("\n");
    return `${pad}<section style="display:flex;flex-direction:column;align-items:${align};gap:16px;padding:${p.paddingY ?? "48px"} 48px;${p.bg ? `background:${t(p.bg as string)}` : ""}${p.align === "center" ? ";text-align:center" : ""}"${linkAttr}>\n${children}\n${pad}</section>`;
  }

  if (node.type === "Card") {
    const children = node.children.map(c => nodeToHTML(c, tokens, indent + 1)).join("\n");
    return `${pad}<div style="display:flex;flex-direction:column;align-items:${p.align === "center" ? "center" : "stretch"};gap:12px;padding:20px;border-radius:${t("radius.lg")};border:1px solid ${t("border.default")};background:${t("bg.card")};box-shadow:${tokens["shadow.md"]};flex:${(p.flex as string) ?? "1"};${p.align === "center" ? "text-align:center" : ""}"${linkAttr}>\n${children}\n${pad}</div>`;
  }

  if (node.type === "Button") {
    const v = node.variant ?? "primary";
    const label = (p.label as string) ?? "Button";
    const sz = p.size === "lg" ? "height:48px;padding:0 24px;font-size:16px" : "height:38px;padding:0 16px;font-size:14px";
    const styles: Record<string, string> = {
      primary: `background:${t("brand.primary")};color:${t("brand.primary.fg")};border:none`,
      secondary: `background:${t("bg.muted")};color:${t("text.primary")};border:none`,
      outline: `background:transparent;color:${t("text.primary")};border:1px solid ${t("border.default")}`,
      ghost: `background:transparent;color:${t("text.primary")};border:none`,
      destructive: `background:${t("brand.destructive")};color:#fff;border:none`,
    };
    return `${pad}<button style="${sz};${styles[v] ?? styles.primary};font-weight:500;font-family:'Inter',sans-serif;border-radius:${t("radius.md")};display:inline-flex;align-items:center;justify-content:center;${p.size === "lg" ? "width:100%" : ""}"${linkAttr}>${label}</button>`;
  }

  if (node.type === "Text") {
    const tags: Record<string, string> = { h1: "h1", h2: "h2", h3: "h3", p: "p", caption: "p", label: "span" };
    const tag = tags[node.variant ?? "p"] ?? "p";
    const styles: Record<string, string> = {
      h1: `font-size:40px;font-weight:800;line-height:1.05;letter-spacing:-0.03em;color:${t("text.primary")}`,
      h2: `font-size:28px;font-weight:700;line-height:1.15;letter-spacing:-0.02em;color:${t("text.primary")}`,
      h3: `font-size:20px;font-weight:600;line-height:1.25;letter-spacing:-0.015em;color:${t("text.primary")}`,
      p: `font-size:15px;font-weight:400;line-height:1.6;color:${p.color ? t(p.color as string) : t("text.secondary")}`,
      caption: `font-size:13px;font-weight:400;line-height:1.4;color:${t("text.secondary")}`,
      label: `font-size:14px;font-weight:500;line-height:1.3;color:${t("text.primary")}`,
    };
    const content = (p.content as string) ?? "Text";
    return `${pad}<${tag} style="${styles[node.variant ?? "p"] ?? styles.p};white-space:pre-line"${linkAttr}>${content}</${tag}>`;
  }

  if (node.type === "Badge") {
    const styles: Record<string, string> = {
      default: `background:${t("brand.primary")};color:${t("brand.primary.fg")}`,
      secondary: `background:${t("bg.muted")};color:${t("text.primary")}`,
      outline: `background:transparent;color:${t("text.primary")};border:1px solid ${t("border.default")}`,
      destructive: `background:${t("brand.destructive")};color:#fff`,
    };
    return `${pad}<span style="display:inline-flex;align-items:center;padding:2px 10px;border-radius:9999px;font-size:12px;font-weight:500;line-height:20px;${styles[node.variant ?? "default"] ?? styles.default}"${linkAttr}>${(p.label as string) ?? "Badge"}</span>`;
  }

  if (node.type === "Input") {
    const label = p.label as string;
    const ph = (p.placeholder as string) ?? "Type...";
    const h = node.variant === "textarea" ? "80px" : "40px";
    let html = "";
    if (label) html += `${pad}<label style="font-size:14px;font-weight:500;color:${t("text.primary")}">${label}</label>\n`;
    html += `${pad}<div style="height:${h};padding:0 12px;border-radius:${t("radius.md")};border:1px solid ${t("border.default")};background:${t("bg.page")};font-size:14px;display:flex;align-items:${node.variant === "textarea" ? "flex-start;padding-top:8px" : "center"};color:${t("text.tertiary")}">${ph}</div>`;
    return label ? `${pad}<div style="display:flex;flex-direction:column;gap:6px">\n${html}\n${pad}</div>` : html;
  }

  if (node.type === "Avatar") {
    const sz = { sm: 28, md: 36, lg: 48 }[(p.size as string) ?? "md"] ?? 36;
    return `${pad}<div style="width:${sz}px;height:${sz}px;border-radius:${node.variant === "square" ? t("radius.md") : "50%"};background:${t("bg.muted")};display:flex;align-items:center;justify-content:center;font-size:${sz * 0.38}px;font-weight:600;color:${t("text.secondary")};flex-shrink:0">${(p.initials as string) ?? "?"}</div>`;
  }

  if (node.type === "Separator") {
    return `${pad}<div style="height:1px;background:${t("border.default")};width:100%;margin:4px 0"></div>`;
  }

  if (node.type === "Image") {
    return `${pad}<div style="aspect-ratio:16/9;background:linear-gradient(135deg,${t("bg.muted")},${t("border.default")});border-radius:${t("radius.md")};display:flex;align-items:center;justify-content:center;color:${t("text.tertiary")};font-size:13px"${linkAttr}>${(p.alt as string) ?? "Image"}</div>`;
  }

  if (node.type === "Alert") {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      info: { bg: "rgba(59,130,246,0.08)", border: "#3b82f6", text: "#1d4ed8" },
      success: { bg: "rgba(16,185,129,0.08)", border: "#10b981", text: "#059669" },
      warning: { bg: "rgba(245,158,11,0.08)", border: "#f59e0b", text: "#d97706" },
      error: { bg: "rgba(239,68,68,0.08)", border: "#ef4444", text: "#dc2626" },
    };
    const ac = colors[node.variant ?? "info"] ?? colors.info;
    return `${pad}<div style="display:flex;flex-direction:column;gap:4px;padding:12px 16px;border-radius:${t("radius.md")};background:${ac.bg};border-left:4px solid ${ac.border}">
${pad}  <span style="font-size:14px;font-weight:600;color:${ac.text}">${(p.title as string) ?? "Alert"}</span>
${pad}  <span style="font-size:13px;color:${ac.text};opacity:0.8">${(p.description as string) ?? ""}</span>
${pad}</div>`;
  }

  if (node.type === "Toast") {
    const colors: Record<string, string> = { success: "#10b981", error: "#ef4444", warning: "#f59e0b", info: "#3b82f6" };
    const bc = colors[node.variant ?? "info"] ?? colors.info;
    return `${pad}<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:${t("radius.md")};border:1px solid ${t("border.default")};border-left:4px solid ${bc};background:${t("bg.card")};font-size:13px;color:${t("text.primary")}">
${pad}  <span style="width:8px;height:8px;border-radius:50%;background:${bc};flex-shrink:0"></span>
${pad}  <span style="flex:1">${(p.message as string) ?? "Notification"}</span>
${pad}</div>`;
  }

  if (node.type === "Progress") {
    const pct = Math.min(100, Math.max(0, (p.percentage as number) ?? 50));
    return `${pad}<div style="display:flex;flex-direction:column;gap:6px">
${pad}  <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:${t("text.secondary")}">${(p.label as string) ?? "Progress"}</span><span style="color:${t("text.primary")};font-weight:600">${pct}%</span></div>
${pad}  <div style="height:8px;border-radius:4px;background:${t("bg.muted")};overflow:hidden"><div style="width:${pct}%;height:100%;border-radius:4px;background:${t("brand.primary")}"></div></div>
${pad}</div>`;
  }

  if (node.type === "Table") {
    const headers = (p.headers as string[]) ?? ["Col 1", "Col 2"];
    const rows = (p.rows as unknown as string[][]) ?? [];
    const ths = headers.map(h => `<th style="padding:8px 12px;text-align:left;font-weight:600;border-bottom:2px solid ${t("border.default")};background:${t("bg.subtle")}">${h}</th>`).join("");
    const trs = rows.map(row => `<tr>${row.map(cell => `<td style="padding:8px 12px;border-bottom:1px solid ${t("border.default")};color:${t("text.secondary")}">${cell}</td>`).join("")}</tr>`).join("\n");
    return `${pad}<table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
  }

  if (node.type === "Footer") {
    const children = node.children.map(c => nodeToHTML(c, tokens, indent + 1)).join("\n");
    return `${pad}<footer style="background:${t("bg.muted")};padding:24px 32px;display:flex;flex-wrap:wrap;gap:16px;align-items:center;${node.variant === "simple" ? "justify-content:center" : ""}">\n${children}\n${pad}</footer>`;
  }

  if (node.type === "Form") {
    const children = node.children.map(c => nodeToHTML(c, tokens, indent + 1)).join("\n");
    return `${pad}<form style="display:flex;flex-direction:column;gap:12px;padding:20px;max-width:400px">\n${children}\n${pad}</form>`;
  }

  if (node.type === "Breadcrumb") {
    const items = (p.items as string[]) ?? ["Home"];
    const spans = items.map((item, i) => i === items.length - 1 ? `<span style="font-weight:500;color:${t("text.primary")}">${item}</span>` : `<span style="color:${t("text.secondary")}">${item}</span>`);
    return `${pad}<nav style="display:flex;align-items:center;gap:6px;font-size:13px">${spans.join(` <span style="color:${t("text.tertiary")}">/</span> `)}</nav>`;
  }

  // Fallback: render children
  if (node.children.length > 0) {
    const children = node.children.map(c => nodeToHTML(c, tokens, indent + 1)).join("\n");
    return `${pad}<div style="display:flex;flex-direction:column;gap:8px">\n${children}\n${pad}</div>`;
  }

  return `${pad}<div style="padding:8px;border:1px dashed #ccc;font-size:12px">${node.type}</div>`;
}

// ── Public API ──────────────────────────────────────────────

export function renderSpecNodeToHTML(root: SpecNode, tokens: Record<string, string>, width: number): string {
  const css = generateCSS(tokens);
  const body = nodeToHTML(root, tokens, 1);
  return `<style>${css}</style>\n<div style="width:${width}px;font-family:'Inter',sans-serif;background:${tok(tokens, "bg.page")};overflow:hidden">\n${body}\n</div>`;
}

export function buildScreenPayload(screen: Screen, tokens: Record<string, string>): { html: string; width: number; height: number; topLayerName: string } {
  return {
    html: renderSpecNodeToHTML(screen.root, tokens, screen.w),
    width: screen.w,
    height: screen.h,
    topLayerName: screen.name,
  };
}

export function buildMultiScreenPayload(project: Project, tokens: Record<string, string>): { screens: Array<{ html: string; width: number; height: number; topLayerName: string }>; clip: boolean } {
  return {
    screens: project.screens.map(s => buildScreenPayload(s, tokens)),
    clip: true,
  };
}
