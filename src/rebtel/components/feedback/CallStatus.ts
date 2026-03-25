// CallStatus — Rebtel calling screen status
// Variants: "connecting" | "active" | "ended" | "failed"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderCallStatus(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "connecting" | "active" | "ended" | "failed") ?? "connecting";
  const label = props.label ?? "Maria Garcia";

  const containerStyles = `display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--rebtel-spacing-lg, var(--spacing-lg));padding:var(--rebtel-spacing-xl, 48px) var(--rebtel-spacing-md, var(--spacing-md));width:100%;min-height:360px;box-sizing:border-box;text-align:center`;
  const avatarStyles = `width:80px;height:80px;border-radius:50%;background:var(--rebtel-red, #E63946);display:flex;align-items:center;justify-content:center;font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:32px;font-weight:700;color:#fff`;
  const nameStyles = `font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:var(--rebtel-font-size-xl, var(--font-size-xl));font-weight:700;color:var(--rebtel-foreground, var(--color-foreground))`;
  const statusStyles = `font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-muted, var(--color-muted-foreground))`;

  const ICON_MIC = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>`;
  const ICON_SPEAKER = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
  const ICON_PHONE_END = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>`;

  const actionBtnBase = `width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer`;
  const controlsRow = `display:flex;align-items:center;justify-content:center;gap:var(--rebtel-spacing-xl, 32px)`;

  const initials = label.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  switch (variant) {
    case "connecting":
      return `
<div data-component="callStatus" style="${containerStyles}">
  <div style="${avatarStyles}">${initials}</div>
  <span style="${nameStyles}" data-text-editable>${label}</span>
  <div style="display:flex;gap:6px;align-items:center">
    <div style="width:8px;height:8px;border-radius:50%;background:var(--rebtel-green, #2ECC71);animation:rebtel-pulse 1.2s ease infinite"></div>
    <div style="width:8px;height:8px;border-radius:50%;background:var(--rebtel-green, #2ECC71);animation:rebtel-pulse 1.2s ease infinite;animation-delay:0.2s"></div>
    <div style="width:8px;height:8px;border-radius:50%;background:var(--rebtel-green, #2ECC71);animation:rebtel-pulse 1.2s ease infinite;animation-delay:0.4s"></div>
  </div>
  <span style="${statusStyles}" data-text-editable>Connecting...</span>
  <div style="${controlsRow}">
    <div style="${actionBtnBase};background:var(--rebtel-input-bg, var(--color-secondary));color:var(--rebtel-foreground, var(--color-foreground))" data-interactive="button">${ICON_MIC}</div>
    <div style="${actionBtnBase};background:#DC2626;box-shadow:0 4px 12px rgba(220,38,38,0.3)" data-interactive="button">${ICON_PHONE_END}</div>
    <div style="${actionBtnBase};background:var(--rebtel-input-bg, var(--color-secondary));color:var(--rebtel-foreground, var(--color-foreground))" data-interactive="button">${ICON_SPEAKER}</div>
  </div>
  <style>@keyframes rebtel-pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}</style>
</div>`;

    case "active":
      return `
<div data-component="callStatus" style="${containerStyles}">
  <div style="${avatarStyles}">${initials}</div>
  <span style="${nameStyles}" data-text-editable>${label}</span>
  <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:28px;font-weight:700;color:var(--rebtel-green, #2ECC71);letter-spacing:0.05em">02:34</span>
  <span style="${statusStyles}">HD Voice</span>
  <div style="${controlsRow}">
    <div style="${actionBtnBase};background:var(--rebtel-input-bg, var(--color-secondary));color:var(--rebtel-foreground, var(--color-foreground))" data-interactive="button">${ICON_MIC}</div>
    <div style="${actionBtnBase};background:#DC2626;box-shadow:0 4px 12px rgba(220,38,38,0.3)" data-interactive="button">${ICON_PHONE_END}</div>
    <div style="${actionBtnBase};background:var(--rebtel-input-bg, var(--color-secondary));color:var(--rebtel-foreground, var(--color-foreground))" data-interactive="button">${ICON_SPEAKER}</div>
  </div>
</div>`;

    case "ended":
      return `
<div data-component="callStatus" style="${containerStyles}">
  <div style="${avatarStyles}">${initials}</div>
  <span style="${nameStyles}" data-text-editable>${label}</span>
  <span style="${statusStyles}" data-text-editable>Call ended</span>
  <div style="display:flex;flex-direction:column;align-items:center;gap:var(--rebtel-spacing-sm, var(--spacing-sm))">
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:600;color:var(--rebtel-foreground, var(--color-foreground))">Duration: 12:47</span>
    <div style="display:flex;gap:4px;align-items:center">
      ${Array.from({ length: 5 }, (_, i) => `<span style="font-size:20px;color:${i < 4 ? "var(--rebtel-yellow, #F59E0B)" : "var(--rebtel-border, var(--color-border))"}">\u2605</span>`).join("")}
    </div>
    <span style="${statusStyles}" data-text-editable>Rate call quality</span>
  </div>
  <div style="display:flex;align-items:center;justify-content:center;width:100%;max-width:300px;height:48px;background:var(--rebtel-red, #E63946);color:#fff;border-radius:var(--rebtel-radius-full, var(--radius-full));font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:600;cursor:pointer" data-text-editable data-interactive="button">Done</div>
</div>`;

    case "failed":
      return `
<div data-component="callStatus" style="${containerStyles}">
  <div style="width:80px;height:80px;border-radius:50%;background:#FEF2F2;display:flex;align-items:center;justify-content:center;border:2px solid #FECACA">
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
  </div>
  <span style="${nameStyles}" data-text-editable>${label}</span>
  <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));color:#DC2626;font-weight:500" data-text-editable>Call could not be connected</span>
  <span style="${statusStyles}" data-text-editable>Please check your internet connection and try again.</span>
  <div style="display:flex;gap:var(--rebtel-spacing-md, var(--spacing-md))">
    <div style="display:flex;align-items:center;justify-content:center;height:44px;padding:0 24px;background:var(--rebtel-red, #E63946);color:#fff;border-radius:var(--rebtel-radius-full, var(--radius-full));font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:600;cursor:pointer" data-text-editable data-interactive="button">Try Again</div>
    <div style="display:flex;align-items:center;justify-content:center;height:44px;padding:0 24px;background:var(--rebtel-input-bg, var(--color-secondary));color:var(--rebtel-foreground, var(--color-foreground));border-radius:var(--rebtel-radius-full, var(--radius-full));font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:500;cursor:pointer;border:1px solid var(--rebtel-border, var(--color-border))" data-text-editable data-interactive="button">Cancel</div>
  </div>
</div>`;

    default:
      return renderCallStatus({ ...props, variant: "connecting" });
  }
}
