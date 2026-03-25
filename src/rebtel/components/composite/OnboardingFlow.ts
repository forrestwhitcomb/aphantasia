// OnboardingFlow — Rebtel onboarding screens
// Variants: "signup" | "verification" | "welcome"

import type { UIComponentPropsBase } from "@/ui-mode/types";

export function renderOnboardingFlow(props: Partial<UIComponentPropsBase> = {}): string {
  const variant = (props.variant as "signup" | "verification" | "welcome") ?? "signup";
  const label = props.label ?? "Get Started";

  const containerStyles = `display:flex;flex-direction:column;align-items:center;gap:var(--rebtel-spacing-lg, var(--spacing-lg));padding:var(--rebtel-spacing-xl, 48px) var(--rebtel-spacing-md, var(--spacing-md));width:100%;box-sizing:border-box`;
  const titleStyles = `font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:var(--rebtel-font-size-xl, var(--font-size-xl));font-weight:700;color:var(--rebtel-foreground, var(--color-foreground));text-align:center`;
  const descStyles = `font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));color:var(--rebtel-muted, var(--color-muted-foreground));text-align:center;max-width:300px;line-height:1.5`;
  const buttonStyles = `display:flex;align-items:center;justify-content:center;width:100%;max-width:320px;height:52px;background:var(--rebtel-red, #E63946);color:#fff;border-radius:var(--rebtel-radius-full, var(--radius-full));font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));font-weight:600;cursor:pointer;box-shadow:0 2px 8px rgba(230,57,70,0.3)" data-interactive="button`;
  const inputStyles = `display:flex;align-items:center;gap:var(--rebtel-spacing-sm, var(--spacing-sm));width:100%;max-width:320px;background:var(--rebtel-input-bg, var(--color-secondary));border:1.5px solid var(--rebtel-border, var(--color-border));border-radius:var(--rebtel-radius-md, var(--radius-md));padding:0 var(--rebtel-spacing-md, var(--spacing-md));height:52px;box-sizing:border-box`;

  const ICON_CHEVRON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

  switch (variant) {
    case "signup":
      return `
<div data-component="onboardingFlow" style="${containerStyles}">
  <span style="font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:28px;font-weight:700;color:var(--rebtel-red, #E63946);letter-spacing:-0.02em" data-text-editable>Rebtel</span>
  <span style="${titleStyles}" data-text-editable>Enter your phone number</span>
  <span style="${descStyles}" data-text-editable>We'll send you a verification code to get started.</span>
  <div style="${inputStyles}" data-interactive="input">
    <div style="display:flex;align-items:center;gap:4px;padding-right:var(--rebtel-spacing-sm, var(--spacing-sm));border-right:1px solid var(--rebtel-border, var(--color-border));flex-shrink:0;cursor:pointer" data-interactive="button">
      <span style="font-size:18px">\u{1F1FA}\u{1F1F8}</span>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));font-weight:500;color:var(--rebtel-foreground, var(--color-foreground))">+1</span>
      <span style="color:var(--rebtel-muted, var(--color-muted-foreground));display:flex;align-items:center">${ICON_CHEVRON}</span>
    </div>
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-lg, var(--font-size-lg));color:var(--rebtel-muted, var(--color-muted-foreground));opacity:0.5;flex:1" data-text-editable>Phone number</span>
  </div>
  <div style="${buttonStyles}" data-text-editable>Continue</div>
  <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-xs, var(--font-size-xs));color:var(--rebtel-muted, var(--color-muted-foreground));text-align:center;max-width:280px;line-height:1.4" data-text-editable>By continuing, you agree to our Terms of Service and Privacy Policy.</span>
</div>`;

    case "verification":
      return `
<div data-component="onboardingFlow" style="${containerStyles}">
  <span style="${titleStyles}" data-text-editable>Verify your number</span>
  <span style="${descStyles}" data-text-editable>Enter the 4-digit code sent to +1 (555) 234-5678</span>
  <div style="display:flex;gap:var(--rebtel-spacing-md, var(--spacing-md))">
    ${Array.from({ length: 4 }, (_, i) => {
      const filled = i === 0;
      return `<div style="width:52px;height:60px;display:flex;align-items:center;justify-content:center;border-radius:var(--rebtel-radius-md, var(--radius-md));font-family:var(--rebtel-font-heading, var(--font-heading-family));font-size:24px;font-weight:700;color:var(--rebtel-foreground, var(--color-foreground));${filled ? "background:var(--rebtel-surface, var(--color-background));border:2px solid var(--rebtel-red, #E63946)" : "background:var(--rebtel-input-bg, var(--color-secondary));border:1.5px solid var(--rebtel-border, var(--color-border))"}" data-interactive="input">${filled ? "7" : ""}</div>`;
    }).join("\n    ")}
  </div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:var(--rebtel-spacing-xs, var(--spacing-xs))">
    <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-sm, var(--font-size-sm));color:var(--rebtel-muted, var(--color-muted-foreground))" data-text-editable>Resend code in 0:28</span>
  </div>
  <div style="${buttonStyles}" data-text-editable>Verify</div>
</div>`;

    case "welcome":
      return `
<div data-component="onboardingFlow" style="${containerStyles}">
  <div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg, var(--rebtel-red, #E63946), #FF6B6B);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(230,57,70,0.2)">
    <svg width="56" height="56" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
  </div>
  <span style="${titleStyles}" data-text-editable>Welcome to Rebtel!</span>
  <span style="${descStyles}" data-text-editable>Make affordable international calls and send top-ups to family and friends around the world.</span>
  <div style="display:flex;flex-direction:column;gap:var(--rebtel-spacing-sm, var(--spacing-sm));width:100%;max-width:300px">
    ${[
      { icon: "\u{1F4DE}", text: "Crystal clear HD calls" },
      { icon: "\u{1F4B8}", text: "Send mobile top-ups instantly" },
      { icon: "\u{1F30D}", text: "200+ countries supported" },
    ].map(f => `
    <div style="display:flex;align-items:center;gap:var(--rebtel-spacing-md, var(--spacing-md));padding:var(--rebtel-spacing-sm, var(--spacing-sm))">
      <span style="font-size:20px">${f.icon}</span>
      <span style="font-family:var(--rebtel-font-body, var(--font-body-family));font-size:var(--rebtel-font-size-md, var(--font-size-md));color:var(--rebtel-foreground, var(--color-foreground))">${f.text}</span>
    </div>`).join("")}
  </div>
  <div style="${buttonStyles}" data-text-editable>${label}</div>
</div>`;

    default:
      return renderOnboardingFlow({ ...props, variant: "signup" });
  }
}
