// ============================================================
// APHANTASIA for REBTEL — Type System
// ============================================================
// Extends the base UIComponentType with 36 Rebtel-specific
// components. Defines flow/screen types for multi-screen
// prototyping.
// ============================================================

import type { UIComponentType } from "@/ui-mode/types";

// ── Rebtel-Specific Component Types ─────────────────────────

export type RebtelComponentType =
  // Navigation
  | "appBar"
  | "rebtelTabBar"
  | "segmentedNav"
  | "flowStepper"
  | "breadcrumb"
  // Content & Data Display
  | "contactCard"
  | "rateCard"
  | "topUpCard"
  | "transactionRow"
  | "balanceWidget"
  | "countryRow"
  | "carrierBadge"
  | "promoCard"
  // Inputs
  | "phoneInput"
  | "amountSelector"
  | "countryPicker"
  | "pinInput"
  | "paymentMethod"
  // Feedback & Status
  | "successScreen"
  | "errorBanner"
  | "loadingState"
  | "callStatus"
  // Composite / Flow-Level
  | "topUpFlow"
  | "callingFlow"
  | "onboardingFlow"
  | "settingsGroup"
  | "rebtelProfileHeader"
  | "homeScreen"
  // New Figma-matched components
  | "label"
  | "productCard"
  | "orderSummary"
  | "heroText"
  | "sectionText"
  | "textField"
  | "rebtelBottomSheet"
  | "paymentModule"
  | "paymentForm"
  | "dialogPopup";

// ── Shared Base Components (reskinned via Rebtel tokens) ────

export type SharedComponentType =
  | "button"
  | "textInput"
  | "toggle"
  | "sectionHeader"
  | "emptyState"
  | "alert"
  | "toast"
  | "bottomSheet"
  | "searchBar"
  | "divider";

// ── Combined Type ───────────────────────────────────────────

export type AllRebtelComponentType = RebtelComponentType | SharedComponentType;

// ── Flow & Screen Types ─────────────────────────────────────

export interface RebtelScreenComponent {
  type: AllRebtelComponentType;
  label?: string;
  variant?: string;
  props?: Record<string, unknown>;
  /** Screen ID to navigate to when this component is tapped */
  navigateTo?: string;
}

export interface RebtelScreen {
  screenId: string;
  title: string;
  components: RebtelScreenComponent[];
}

export interface RebtelFlow {
  name: string;
  screens: RebtelScreen[];
}

// ── Type Guards ─────────────────────────────────────────────

const REBTEL_TYPES = new Set<string>([
  "appBar", "rebtelTabBar", "segmentedNav", "flowStepper", "breadcrumb",
  "contactCard", "rateCard", "topUpCard", "transactionRow", "balanceWidget",
  "countryRow", "carrierBadge", "promoCard",
  "phoneInput", "amountSelector", "countryPicker", "pinInput", "paymentMethod",
  "successScreen", "errorBanner", "loadingState", "callStatus",
  "topUpFlow", "callingFlow", "onboardingFlow", "settingsGroup",
  "rebtelProfileHeader", "homeScreen",
  "label", "productCard", "orderSummary", "heroText", "sectionText",
  "textField", "rebtelBottomSheet", "paymentModule", "paymentForm", "dialogPopup",
]);

const SHARED_TYPES = new Set<string>([
  "button", "textInput", "toggle", "sectionHeader", "emptyState",
  "alert", "toast", "bottomSheet", "searchBar", "divider",
]);

export function isRebtelType(type: string): type is RebtelComponentType {
  return REBTEL_TYPES.has(type);
}

export function isSharedType(type: string): type is SharedComponentType {
  return SHARED_TYPES.has(type);
}

export function isAllRebtelType(type: string): type is AllRebtelComponentType {
  return REBTEL_TYPES.has(type) || SHARED_TYPES.has(type);
}

/** All valid Rebtel component type strings */
export const ALL_REBTEL_TYPES: AllRebtelComponentType[] = [
  ...Array.from(REBTEL_TYPES) as RebtelComponentType[],
  ...Array.from(SHARED_TYPES) as SharedComponentType[],
];
