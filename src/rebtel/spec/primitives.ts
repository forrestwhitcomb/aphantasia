// ============================================================
// Primitive ↔ Template mappings + Legacy bridge
// ============================================================

import type { PrimitiveType } from "./types";

// ── Default template for each primitive ──────────────────────

export const DEFAULT_TEMPLATE: Record<PrimitiveType, string> = {
  screen: "default",
  bar: "app-bar",
  card: "blank",
  row: "simple",
  button: "primary",
  input: "text-field",
  sheet: "action-sheet",
  text: "paragraph-md",
  status: "success",
  selector: "segmented",
  media: "image",
  divider: "default",
};

// ── Legacy type → { primitive, template } mapping ────────────
// Maps every old AllRebtelComponentType to the new system.
// Used for incremental migration: when a shape has an old type
// but no spec, we can infer what template to generate.

export const LEGACY_TO_PRIMITIVE: Record<
  string,
  { primitive: PrimitiveType; template: string }
> = {
  // Navigation
  appBar: { primitive: "bar", template: "app-bar" },
  rebtelTabBar: { primitive: "bar", template: "tab-bar" },
  segmentedNav: { primitive: "selector", template: "segmented" },
  flowStepper: { primitive: "bar", template: "stepper" },
  breadcrumb: { primitive: "bar", template: "breadcrumb" },

  // Content & Data Display
  contactCard: { primitive: "card", template: "contact" },
  rateCard: { primitive: "card", template: "rate" },
  topUpCard: { primitive: "card", template: "topup-amount" },
  transactionRow: { primitive: "row", template: "transaction" },
  balanceWidget: { primitive: "card", template: "balance" },
  countryRow: { primitive: "row", template: "country" },
  carrierBadge: { primitive: "row", template: "carrier" },
  promoCard: { primitive: "card", template: "promo" },
  productCard: { primitive: "card", template: "product" },
  orderSummary: { primitive: "card", template: "order-summary" },
  heroText: { primitive: "text", template: "hero-text" },
  sectionText: { primitive: "text", template: "section-text" },
  label: { primitive: "text", template: "label-md" },

  // Inputs
  phoneInput: { primitive: "input", template: "phone" },
  amountSelector: { primitive: "selector", template: "pills" },
  countryPicker: { primitive: "input", template: "country-picker" },
  pinInput: { primitive: "input", template: "pin" },
  paymentMethod: { primitive: "row", template: "payment-method" },
  textField: { primitive: "input", template: "text-field" },
  paymentModule: { primitive: "card", template: "payment-module" },
  paymentForm: { primitive: "card", template: "payment-form" },

  // Feedback & Status
  successScreen: { primitive: "status", template: "success" },
  errorBanner: { primitive: "status", template: "error-banner" },
  loadingState: { primitive: "status", template: "loading" },
  callStatus: { primitive: "status", template: "call-status" },

  // Composite / Flow-Level → map to card (closest match)
  topUpFlow: { primitive: "card", template: "topup-amount" },
  callingFlow: { primitive: "card", template: "contact" },
  onboardingFlow: { primitive: "card", template: "blank" },
  settingsGroup: { primitive: "card", template: "blank" },
  rebtelProfileHeader: { primitive: "card", template: "profile" },
  homeScreen: { primitive: "card", template: "blank" },

  // Shared base types
  button: { primitive: "button", template: "primary" },
  textInput: { primitive: "input", template: "text-field" },
  toggle: { primitive: "input", template: "toggle" },
  sectionHeader: { primitive: "text", template: "headline-xs" },
  emptyState: { primitive: "status", template: "empty" },
  alert: { primitive: "status", template: "error-banner" },
  toast: { primitive: "status", template: "toast" },
  bottomSheet: { primitive: "sheet", template: "action-sheet" },
  rebtelBottomSheet: { primitive: "sheet", template: "action-sheet" },
  dialogPopup: { primitive: "sheet", template: "dialog" },
  searchBar: { primitive: "input", template: "search" },
  divider: { primitive: "divider", template: "default" },
};

/** Check if a legacy type has a primitive mapping */
export function hasLegacyMapping(type: string): boolean {
  return type in LEGACY_TO_PRIMITIVE;
}

/** Get the primitive + template for a legacy type, or null */
export function getLegacyMapping(
  type: string,
): { primitive: PrimitiveType; template: string } | null {
  return LEGACY_TO_PRIMITIVE[type] ?? null;
}
