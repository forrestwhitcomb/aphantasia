// CallingFlow — Rebtel call initiation and management
// Variants: "dial" | "in-call" | "post-call"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderCallingFlow(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "dial" | "in-call" | "post-call") ?? "dial";
  const label = props.label ?? "Make a Call";

  const containerStyles = `display:flex;flex-direction:column;align-items:center;gap:var(--rebtel-spacing-lg, var(--spacing-lg));padding:var(--rebtel-spacing-lg, var(--spacing-lg)) var(--rebtel-spacing-md, var(--spacing-md));width:100%;box-sizing:border-box`;
  const nameStyles = `font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:var(--rebtel-font-size-xl, var(--font-size-xl));font-weight:700;color:var(--rebtel-foreground, var(--color-foreground))`;
  const subtitleStyles = `font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-muted, var(--color-muted-foreground))`;
  const dialBtnStyles = `width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:22px;font-weight:600;color:var(--rebtel-foreground, var(--color-foreground));background:var(--rebtel-input-bg, var(--color-secondary));cursor:pointer" data-interactive="button`;
  const actionBtnBase = `width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer`;

  const ICON_PHONE = `<svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>`;
  const ICON_MIC = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>`;
  const ICON_SPEAKER = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
  const ICON_PHONE_END = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>`;
  const ICON_BACKSPACE = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>`;

  const dialpad = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  const avatarStyles = `width:72px;height:72px;border-radius:50%;background:var(--rebtel-red, #E63946);display:flex;align-items:center;justify-content:center;font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:28px;font-weight:700;color:#fff`;

  switch (variant) {
    case "dial":
      return `
<div data-component="callingFlow" style="${containerStyles}">
  <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:24px;font-weight:600;color:var(--rebtel-foreground, var(--color-foreground));letter-spacing:0.04em" data-text-editable>+1 555 234 56</span>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--rebtel-spacing-sm, var(--spacing-sm));width:100%;max-width:240px">
    ${dialpad.map(row => row.map(d => `<div style="${dialBtnStyles}">${d}</div>`).join("\n    ")).join("\n    ")}
  </div>
  <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-xl, 40px)">
    <div style="width:52px"></div>
    <div style="width:64px;height:64px;border-radius:50%;background:var(--rebtel-green, #2ECC71);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(46,204,113,0.3)" data-interactive="button">${ICON_PHONE}</div>
    <div style="width:52px;height:52px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--rebtel-muted, var(--color-muted-foreground))" data-interactive="button">${ICON_BACKSPACE}</div>
  </div>
</div>`;

    case "in-call":
      return `
<div data-component="callingFlow" style="${containerStyles};min-height:380px;justify-content:center">
  <div style="${avatarStyles}">MG</div>
  <span style="${nameStyles}" data-text-editable>Maria Garcia</span>
  <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:32px;font-weight:700;color:var(--rebtel-green, #2ECC71);letter-spacing:0.05em">05:12</span>
  <span style="${subtitleStyles}">HD Voice \u00b7 Cuba +53</span>
  <div style="display:flex;align-items:center;justify-content:center;gap:var(--rebtel-spacing-xl, 32px);margin-top:var(--rebtel-spacing-md, var(--spacing-md))">
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
      <div style="${actionBtnBase};background:var(--rebtel-input-bg, var(--color-secondary));color:var(--rebtel-foreground, var(--color-foreground))" data-interactive="button">${ICON_MIC}</div>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:10px;color:var(--rebtel-muted, var(--color-muted-foreground))">Mute</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
      <div style="${actionBtnBase};background:#DC2626;box-shadow:0 4px 12px rgba(220,38,38,0.3)" data-interactive="button">${ICON_PHONE_END}</div>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:10px;color:var(--rebtel-muted, var(--color-muted-foreground))">End</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
      <div style="${actionBtnBase};background:var(--rebtel-input-bg, var(--color-secondary));color:var(--rebtel-foreground, var(--color-foreground))" data-interactive="button">${ICON_SPEAKER}</div>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:10px;color:var(--rebtel-muted, var(--color-muted-foreground))">Speaker</span>
    </div>
  </div>
</div>`;

    case "post-call":
      return `
<div data-component="callingFlow" style="${containerStyles}">
  <div style="${avatarStyles}">MG</div>
  <span style="${nameStyles}" data-text-editable>Maria Garcia</span>
  <span style="${subtitleStyles}">Call ended</span>
  <div style="width:100%;max-width:300px;display:flex;flex-direction:column;gap:var(--rebtel-spacing-sm, var(--spacing-sm));padding:var(--rebtel-spacing-md, var(--spacing-md));background:var(--rebtel-input-bg, var(--color-secondary));border-radius:var(--rebtel-radius-md, var(--radius-md))">
    <div style="display:flex;justify-content:space-between;font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm))">
      <span style="color:var(--rebtel-muted, var(--color-muted-foreground))">Duration</span>
      <span style="color:var(--rebtel-foreground, var(--color-foreground));font-weight:600">12:47</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm))">
      <span style="color:var(--rebtel-muted, var(--color-muted-foreground))">Cost</span>
      <span style="color:var(--rebtel-foreground, var(--color-foreground));font-weight:600">$0.02/min</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm))">
      <span style="color:var(--rebtel-muted, var(--color-muted-foreground))">Quality</span>
      <span style="color:var(--rebtel-foreground, var(--color-foreground));font-weight:600">HD Voice</span>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:var(--rebtel-spacing-xs, var(--spacing-xs))">
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-muted, var(--color-muted-foreground))" data-text-editable>Rate call quality</span>
    <div style="display:flex;gap:4px">
      ${Array.from({ length: 5 }, (_, i) => `<span style="font-size:24px;color:${i < 4 ? "var(--rebtel-yellow, #F59E0B)" : "var(--rebtel-border, var(--color-border))"};cursor:pointer" data-interactive="button">\u2605</span>`).join("")}
    </div>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;width:100%;max-width:300px;height:48px;background:var(--rebtel-red, #E63946);color:#fff;border-radius:var(--rebtel-radius-full, var(--radius-full));font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:600;cursor:pointer" data-text-editable data-interactive="button">Done</div>
</div>`;

    default:
      return renderCallingFlow({ ...props, variant: "dial" });
  }
}
