// ============================================================
// APHANTASIA for REBTEL — Component Schema Reference
// ============================================================
// Compact reference of all Rebtel components for AI prompts.
// ============================================================

export const REBTEL_COMPONENT_SCHEMA = `
# Rebtel Component Reference

## Navigation Components
- **appBar** — Top navigation bar. Variants: "home" (logo+hamburger), "back" (back arrow+title), "close" (X+title), "search" (search field). Height: 56px.
- **rebtelTabBar** — Bottom tab navigation. Variants: "default" (4 tabs: Home/Top-Up/Calling/Account). Height: 56px. Use on main screens only.
- **segmentedNav** — Inline tab switcher. Variants: "2-tab", "3-tab", "4-tab". Height: 44px.
- **flowStepper** — Multi-step progress indicator. Props: steps (number), currentStep (number). Height: 48px.
- **breadcrumb** — Navigation path trail. Height: 32px.

## Content & Data Display
- **contactCard** — Contact with avatar, name, phone, country flag. Variants: "default", "compact", "selectable". Height: 72px (default), 56px (compact).
- **rateCard** — Calling rate display per country. Shows country flag, rate, plan price. Variants: "default", "featured". Height: 80px.
- **topUpCard** — Top-up amount option. Variants: "default", "popular" (highlighted), "bundle" (with data). Height: 96px.
- **transactionRow** — Transaction history entry. Variants: "topup", "call", "payment". Height: 64px.
- **balanceWidget** — Credit/plan balance display. Variants: "credits", "plan-remaining", "multi". Height: 80px (default), 120px (multi).
- **countryRow** — Country list item with flag, name, dial code. Variants: "default", "selectable". Height: 56px.
- **carrierBadge** — Carrier logo/name badge. Variants: "default", "selected". Height: 40px.
- **promoCard** — Promotional banner. Variants: "default", "hero" (large), "compact". Height: 120px (default), 180px (hero), 80px (compact).

## Input Components
- **phoneInput** — Phone number input with country code picker. Variants: "default", "with-contact" (add from contacts). Height: 56px.
- **amountSelector** — Top-up amount grid/list. Variants: "grid" (2x3 grid), "list", "custom" (with input). Height: 200px (grid), 56px per item (list).
- **countryPicker** — Country selection dropdown/modal. Variants: "dropdown", "modal", "search". Height: 56px (dropdown trigger).
- **pinInput** — PIN/OTP code entry. Variants: "4-digit", "6-digit". Height: 64px.
- **paymentMethod** — Payment method selector/display. Variants: "card", "wallet", "selector" (list of methods). Height: 64px (single), 200px (selector).

## Feedback & Status
- **successScreen** — Success confirmation with checkmark animation. Variants: "topup", "payment", "generic". Height: fills remaining space.
- **errorBanner** — Inline error message. Variants: "default", "critical", "warning". Height: 48px.
- **loadingState** — Loading skeleton/spinner. Variants: "spinner", "skeleton", "progress". Height: 120px.
- **callStatus** — Active call display with timer, controls. Variants: "ringing", "connected", "ended". Height: fills remaining space.

## Composite / Flow-Level
- **topUpFlow** — Complete top-up wizard (meta-component). Renders as a multi-screen flow.
- **callingFlow** — Call initiation and active call flow.
- **onboardingFlow** — New user welcome and setup flow.
- **settingsGroup** — Group of settings rows with section header. Variants: "default", "account", "preferences". Height: varies.
- **rebtelProfileHeader** — User profile header with avatar, name, stats. Variants: "default", "compact". Height: 160px (default), 80px (compact).
- **homeScreen** — Complete home screen layout (meta-component).

## Shared Base Components (reskinned with Rebtel tokens)
- **button** — Action button. Variants: "primary" (Rebtel red), "secondary", "outline", "ghost", "danger". Height: 48px.
- **textInput** — Text input field. Variants: "default", "outlined", "filled". Height: 48px.
- **toggle** — On/off switch. Height: 32px.
- **sectionHeader** — Section title with optional action link. Height: 40px.
- **emptyState** — Empty content placeholder with icon and message. Height: 200px.
- **alert** — Alert banner. Variants: "info", "success", "warning", "error". Height: 48px.
- **toast** — Temporary notification. Height: 48px.
- **bottomSheet** — Bottom modal sheet. Height: varies.
- **searchBar** — Search input. Variants: "default", "expanded". Height: 48px.
- **divider** — Horizontal separator. Height: 1px.
`.trim();
