// ============================================================
// APHANTASIA for REBTEL — Component Schema Reference
// ============================================================
// Compact reference of all Rebtel components for AI prompts.
// Updated from Figma FLOWS audit (March 2026).
// ============================================================

export const REBTEL_COMPONENT_SCHEMA = `
# Rebtel Component Reference

## CRITICAL LAYOUT RULES (from Figma audit)

### Screen Structure Pattern
Every Rebtel screen follows one of these layouts:

**A) Flow screen** (multi-step: top-up, onboarding, checkout):
- statusBar (always present at top, 9:41 time)
- appBar variant "back" (< chevron + centered title)
- Content area with generous vertical spacing
- Primary CTA pinned to bottom (full-width pill button, 16px side margins)
- NO tabBar

**B) Main screen** (home, services, account):
- statusBar
- Search bar or appBar
- Scrollable card feed
- tabBar pinned to bottom (Home / Services / Account)

**C) System message screen** (auto top-up prompt, confirmation, rating):
- statusBar
- appBar variant "back"
- Centered avatar/illustration (120px diameter)
- Centered headline (Pano or KH Teka bold, 24px)
- Centered body text (KH Teka, 16px, grey)
- Bottom-pinned CTA pair: primary red pill + secondary grey pill
- NO tabBar

**D) Success screen** (post-purchase):
- statusBar only (no appBar)
- Lottie animation placeholder area (centered)
- Centered confirmation text
- Info card (grey background, rounded)
- Promo cross-sell card at bottom
- "Close" text link at very bottom

### Spacing Rules (from Figma)
- Screen horizontal padding: 16px (left and right)
- Section gap (between major blocks): 24px
- Component gap within a section: 12px
- Card internal padding: 16-20px
- Button height: 52-56px (full-width, pill-shaped radius-full)
- Button side margins: 16px (so button width = screen width - 32px)
- Bottom CTA area: buttons sit ~32px from bottom of safe area
- Between stacked buttons: 12px gap
- List row height: 72px (with avatar) or 44-52px (simple)
- List rows use thin 1px grey dividers (#EBEBED)
- Content sits below appBar with 16-24px top gap

### Typography Hierarchy (from Figma)
- Screen title in appBar: KH Teka 16px semibold, centered
- Hero heading: Pano bold 24-32px
- Section header: KH Teka 14px medium, grey (#808088)
- Card title: KH Teka 16px semibold
- Body text: KH Teka 14-16px regular
- Price display: KH Teka 32px bold (large), 20px bold (medium)
- Tertiary/meta text: KH Teka 12-14px, grey (#808088)

### Button Patterns (from Figma)
- **Primary CTA**: Red (#E63946) fill, white text, full-width, pill-shaped (radius 9999px), 52px height
- **Primary dark CTA**: Black (#1D1D1F) fill, white text, same sizing — used for "Continue", "Pay", "Call again"
- **Secondary CTA**: Light grey (#F4F4F5) fill OR white with grey border, grey/black text, same sizing
- **Text link CTA**: Red (#E63946) text, no background — used for "Resend", "Close", "Cancel anytime"
- **Pill selector**: Small pill buttons for amounts ($5/$10/$25) — active=black fill, inactive=grey outline

### Card Patterns (from Figma)
- Cards use 16px border-radius, 1px border (#EBEBED), white or light grey fill
- Cards that are "selected" sections use white background with subtle shadow
- Product cards (subscription/credits) stack vertically with "Or" divider between options
- Promo cards have dark background with imagery, rounded corners, bottom-aligned text + CTA
- Info cards (order details, stats) use light grey (#F4F4F5) background

## Component Quality Tiers

### Tier 1 — Full fidelity (use these whenever possible):
appBar, rebtelTabBar, button, contactCard, searchBar, phoneInput, pinInput,
heroText, sectionText, sectionHeader, label, divider, segmentedNav,
orderSummary, promoCard, successScreen, loadingState, textField,
bottomSheet, dialogPopup, countryRow

### Tier 2 — Approximate rendering (functional but simplified):
productCard, topUpCard, paymentModule, rateCard, balanceWidget,
amountSelector, transactionRow, countryPicker, paymentMethod, toggle

### Tier 3 — Avoid in generated flows (use Tier 1 alternatives):
flowStepper (use segmentedNav instead)
carrierBadge (use label instead)
callStatus (use successScreen variant instead)
errorBanner (use sectionText instead)
emptyState (use heroText with subtitle instead)
toast (use sectionText instead)
breadcrumb (use appBar with back variant instead)
alert (use sectionText instead)

### Rule 18: PREFER Tier 1 components. When you need a payment display, compose it
from orderSummary + button rather than using paymentModule. When you need amount
selection, use segmentedNav or compose from multiple buttons rather than
amountSelector. The Tier 1 components have full visual fidelity.

## Navigation Components
- **appBar** — Top navigation. Variants: "home" (no back), "back" (< + centered title + optional icon), "close" (X + centered title). Height: 52px. Title font: KH Teka 16px semibold.
- **rebtelTabBar** — Bottom 3-tab nav: Home (globe icon) / Services (card icon) / Account (person icon). Active=black, inactive=grey. iOS home indicator at bottom. ONLY on main screens, NEVER on flow steps.
- **segmentedNav** — Pill-shaped button tabs. Active=black fill, inactive=grey. Variants: "large" (52px) / "small" (40px). Used for Credits/Activity toggle, Buy Credits/Activity.
- **flowStepper** — DEPRECATED. Maps to segmentedNav. Never use in generated flows.
- **breadcrumb** — Navigation trail. Rarely used.

## Content & Data Display
- **contactCard** — Home feed card. Variants: "calling" (green badge, avatar, name, minutes left, "Call again" black button), "topup" (grey badge, avatar, amount sent/received, dual buttons: "Products" + "Send again"), "compact" (avatar + name + phone + flag in list row, 72px with divider).
- **rateCard** — Country calling rate row. Flag + country name + per-min rate + chevron. Height: 52px.
- **topUpCard** — Product card. Variants: "amount-select" (subscription/credits tabs + $5/$10/$25 pills + minutes display + "Buy now" red CTA), "bundle" (bundle name + features + price + "Select product"), "plan" (plan name + price + features + "Subscribe"). Cards have 16px radius, internal padding 20px.
- **productCard** — Tags + title + feature pills + price/validity + "Select product" outline CTA.
- **orderSummary** — Line-item receipt: item + price rows, Validity, Discount (red), Rebtel credit (red), VAT, Fee, divider, Total (bold large), Auto Top Up row. White background, generous line spacing (20-24px between rows).
- **transactionRow** — Transaction list entry: avatar + name + phone + flag on left, time/amount on right, 72px height, thin divider.
- **balanceWidget** — Credits display: "Rebtel credits" label + large "$24.00" + "Add credits" red outline button + two icon cards (International Calling, Mobile Top-up).
- **countryRow** — Flag (20px) + country name (16px medium) + contacts meta (14px grey) + chevron. 44px height, no dividers.
- **promoCard** — Promotional. Variants: "offer" (dark card with image, tabs, text, red CTA), "banner" (compact red banner), "inline" (white card with border).
- **heroText** — Pano bold heading + grey subtitle. Used for onboarding/welcome.
- **sectionText** — Section title + description.
- **label** — Small pill tag. Variants: "teal", "red", "dark", "light". 24px height.

## Input Components
- **phoneInput** — Pill-shaped (radius-full) input. Flag + chevron country picker on left, phone number text on right. 48px height. NO label above — standalone pill.
- **amountSelector** — Amount grid: 2-column or 3-column pill buttons ($5/$10/$25/$50/$100/$150). Active=black, inactive=light grey outline. Below grid: "About Rebtel Credits" info text.
- **countryPicker** — Pill-shaped search input at top + country list below. Flag + name + "contacts here" + chevron per row.
- **pinInput** — 4-digit OTP boxes (each ~75x75px, rounded 12px, 1px border). Active box has red border. "Didn't receive a code? Resend" help text below. Numeric keypad below that.
- **textField** — Underline-style form field: small label above + value/placeholder + bottom border only.
- **paymentModule** — Visa card selector (pill-shaped, flag + **** 1000 + chevron) + "Use Rebtel Credits" toggle row + "Pay $X" red CTA.
- **paymentMethod** — Card display row.

## Feedback & Status
- **successScreen** — Post-purchase: lottie animation area → centered "You sent X to Y" text → info card (auto top-up status) → promo cross-sell card → "Close" text link.
- **errorBanner** — Inline error. 48px.
- **loadingState** — Spinner/skeleton. Processing screen with centered animation.
- **callStatus** — Active call: avatar + name + timer + call controls. Post-call rating: avatar + name + minutes talked/left stats + star rating + "Close" text link.

## Composite
- **rebtelBottomSheet** — Drag handle + title + options grid or content. "You're low on minutes" warning variant.
- **dialogPopup** — Centered avatar + headline + body + primary red pill CTA + secondary grey CTA + disclaimer.
- **paymentForm** — "Add payment method" title + Card/Apple Pay toggle + form fields.

## Shared Base Components
- **button** — Pill-shaped (radius-full). Variants: "primary" (red fill), "primary-dark" (black fill), "secondary" (grey fill or outline), "text-link" (red text only). Height: 52px.
- **textInput** — Text input. Height: 48px.
- **toggle** — iOS-style switch. Active=black track, white thumb.
- **sectionHeader** — Section label. KH Teka 14px, grey (#808088), uppercase optional. Height: 20px.
- **divider** — Thin horizontal line (#EBEBED). 1px.
- **searchBar** — Pill-shaped search input with magnifying glass icon. Height: 48px. Accompanied by grid/eye/status utility icons.
`.trim();
