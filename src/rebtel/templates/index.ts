// ============================================================
// Template Registry — maps primitive + template → ComponentSpec
// ============================================================
// All 33 Figma components fully ported. No placeholders.
// ============================================================

import type { ComponentSpec, PrimitiveType, TemplateFactory } from "../spec/types";
import { DEFAULT_TEMPLATE } from "../spec/primitives";

// Bars
import { appBarTemplate } from "./bars/appBar";
import { tabBarTemplate } from "./bars/tabBar";

// Buttons
import { buttonTemplate } from "./buttons/button";

// Cards
import { contactCardTemplate } from "./cards/contactCard";
import { blankCardTemplate } from "./cards/blankCard";
import { promoCardTemplate } from "./cards/promoCard";
import { productMtuTemplate } from "./cards/productMtu";
import { productCreditsTemplate } from "./cards/productCredits";
import { orderSummaryTemplate } from "./cards/orderSummary";
import { serviceTypeTemplate } from "./cards/serviceType";
import { infoCardTemplate } from "./cards/infoCard";
import { creditsCardTemplate } from "./cards/creditsCard";

// Inputs
import { textFieldTemplate } from "./inputs/textField";
import { pinInputTemplate } from "./inputs/pinInput";
import { searchBarTemplate } from "./inputs/searchBar";
import { phoneInputTemplate } from "./inputs/phoneInput";

// Rows
import { countryRowTemplate } from "./rows/countryRow";
import { contactRowTemplate } from "./rows/contactRow";

// Sheets
import { actionSheetTemplate } from "./sheets/actionSheet";
import { dialogTemplate } from "./sheets/dialog";
import { paymentSheetTemplate } from "./sheets/paymentSheet";

// Selectors
import { tabsTemplate } from "./selectors/tabs";

// Status
import { successTemplate } from "./status/success";
import { loadingTemplate } from "./status/loading";

// Text
import { textBlockTemplate, heroTextTemplate, sectionTextTemplate } from "./text/textBlock";
import { labelPillTemplate } from "./text/labelPill";

// Phase 2 templates
import { productCardTemplate } from "./cards/productCard";
import { paymentModuleTemplate } from "./cards/paymentModule";
import { balanceWidgetTemplate } from "./cards/balanceWidget";
import { rateCardTemplate } from "./rows/rateCard";
import { transactionRowTemplate } from "./rows/transactionRow";
import { amountPillsTemplate } from "./selectors/amountPills";
import { toggleTemplate } from "./inputs/toggle";
import { countryPickerTemplate } from "./inputs/countryPicker";

// ── Registry ─────────────────────────────────────────────────

const TEMPLATE_REGISTRY: Record<string, Record<string, TemplateFactory>> = {
  bar: {
    "app-bar": appBarTemplate,
    "tab-bar": tabBarTemplate,
  },
  button: {
    primary: (p) => buttonTemplate({ ...p, variant: "primary" }),
    secondary: (p) => buttonTemplate({ ...p, variant: "secondary" }),
    "secondary-white": (p) => buttonTemplate({ ...p, variant: "secondary-white" }),
    "secondary-grey": (p) => buttonTemplate({ ...p, variant: "secondary-grey" }),
    outlined: (p) => buttonTemplate({ ...p, variant: "secondary-grey" }),
    ghost: (p) => buttonTemplate({ ...p, variant: "ghost" }),
    green: (p) => buttonTemplate({ ...p, variant: "green" }),
    destructive: (p) => buttonTemplate({ ...p, variant: "destructive" }),
    "icon-only": (p) => buttonTemplate({ ...p, variant: "icon-only" }),
    red: (p) => buttonTemplate({ ...p, variant: "primary" }),
    white: (p) => buttonTemplate({ ...p, variant: "secondary-white" }),
    black: (p) => buttonTemplate({ ...p, variant: "secondary" }),
    dropdown: (p) => buttonTemplate({ ...p, variant: "icon-only" }),
    borderless: (p) => buttonTemplate({ ...p, variant: "ghost" }),
  },
  card: {
    contact: contactCardTemplate,
    "contact-calling": (p) => contactCardTemplate({ ...p, variant: "calling" }),
    "contact-topup": (p) => contactCardTemplate({ ...p, variant: "topup" }),
    blank: blankCardTemplate,
    promo: promoCardTemplate,
    "product-mtu": productMtuTemplate,
    "product-credits": productCreditsTemplate,
    "order-summary": orderSummaryTemplate,
    "service-type": serviceTypeTemplate,
    "info-icon": (p) => infoCardTemplate({ ...p, showIcon: true }),
    info: (p) => infoCardTemplate({ ...p, showIcon: false }),
    "credits-collapsed": (p) => creditsCardTemplate({ ...p, variant: "collapsed" }),
    "credits-expanded": (p) => creditsCardTemplate({ ...p, variant: "expanded" }),
    "product": productCardTemplate,
    "payment-module": paymentModuleTemplate,
    "balance": balanceWidgetTemplate,
  },
  input: {
    "text-field": textFieldTemplate,
    pin: pinInputTemplate,
    search: searchBarTemplate,
    phone: phoneInputTemplate,
    "toggle": toggleTemplate,
    "country-picker": countryPickerTemplate,
  },
  row: {
    country: countryRowTemplate,
    contact: contactRowTemplate,
    "rate": rateCardTemplate,
    "transaction": transactionRowTemplate,
  },
  sheet: {
    "action-sheet": actionSheetTemplate,
    "action-sheet-single": (p) => actionSheetTemplate({ ...p, variant: "one-button" }),
    dialog: dialogTemplate,
    payment: paymentSheetTemplate,
    blank: (p) => ({
      key: "blank-sheet",
      tag: "div",
      layout: {
        display: "flex",
        direction: "column",
        align: "center",
        width: "100%",
        minHeight: 117,
        padding: { all: { token: "spacing.lg" } },
        borderRadius: { token: "radius.xl" },
        boxSizing: "border-box",
      },
      style: { background: { token: "color.surface-primary" } },
      data: { component: "blankSheet" },
      children: [
        { key: "handle", tag: "div", layout: { display: "flex", justify: "center", padding: { bottom: { token: "spacing.md" } } }, style: {}, children: [{ key: "bar", tag: "div", layout: { display: "block", width: 36, height: 4, borderRadius: { token: "radius.full" } }, style: { background: { token: "color.grey-200" } } }] },
        { key: "title", tag: "div", layout: { display: "block" }, style: {}, text: { content: (p?.title as string) ?? "Title", style: "headline-sm", weight: 600, color: { token: "color.text-primary" }, align: "center", editable: true } },
      ],
    }),
  },
  selector: {
    tabs: tabsTemplate,
    segmented: tabsTemplate,
    "pills": amountPillsTemplate,
  },
  status: {
    success: successTemplate,
    loading: loadingTemplate,
  },
  text: {
    "paragraph-md": textBlockTemplate,
    "display-lg": (p) => textBlockTemplate({ ...p, style: "display-lg" }),
    "headline-sm": (p) => textBlockTemplate({ ...p, style: "headline-sm", weight: 600 }),
    "headline-xs": (p) => textBlockTemplate({ ...p, style: "headline-xs" }),
    "label-md": (p) => textBlockTemplate({ ...p, style: "label-md" }),
    "label-pill": labelPillTemplate,
    // Figma-accurate compound text components
    "hero-text": heroTextTemplate,
    "section-text": sectionTextTemplate,
    "body-text": textBlockTemplate,
    balance: (p) => textBlockTemplate({ ...p, style: "display-md", content: (p?.content as string) ?? "$24.00" }),
  },
  media: {
    image: () => ({
      key: "media-image",
      tag: "div",
      layout: { display: "flex", align: "center", justify: "center", width: 120, height: 120, borderRadius: { token: "radius.md" } },
      style: { background: { token: "color.surface-light" } },
      data: { component: "mediaImage" },
    }),
  },
  divider: {
    default: () => ({
      key: "divider",
      tag: "div",
      layout: { display: "block", width: "100%", height: 1 },
      style: { background: { token: "color.border-secondary" } },
      data: { component: "divider" },
    }),
  },
};

// ── Merge auto-generated templates (overlay on hand-written) ──

import { GENERATED_REGISTRY } from "./generated";
for (const [primitive, templates] of Object.entries(GENERATED_REGISTRY)) {
  if (!TEMPLATE_REGISTRY[primitive]) TEMPLATE_REGISTRY[primitive] = {};
  for (const [name, factory] of Object.entries(templates)) {
    TEMPLATE_REGISTRY[primitive][name] = factory;
  }
}

// ── Public API ───────────────────────────────────────────────

export function hasTemplate(primitive: string, template?: string): boolean {
  const tpl = template ?? DEFAULT_TEMPLATE[primitive as PrimitiveType] ?? "blank";
  return !!TEMPLATE_REGISTRY[primitive]?.[tpl];
}

export function resolveTemplate(
  primitive: string,
  template?: string,
  props?: Record<string, unknown>,
): ComponentSpec {
  const tpl = template ?? DEFAULT_TEMPLATE[primitive as PrimitiveType] ?? "blank";
  const factory = TEMPLATE_REGISTRY[primitive]?.[tpl];
  if (!factory) {
    // Try default template for the primitive
    const defaultFactory = TEMPLATE_REGISTRY[primitive]?.[DEFAULT_TEMPLATE[primitive as PrimitiveType]];
    if (defaultFactory) return defaultFactory(props ?? {});
    // Truly unknown — return a minimal placeholder
    return {
      key: `${primitive}-${tpl}`,
      tag: "div",
      layout: { display: "flex", align: "center", justify: "center", width: "100%", minHeight: 48, padding: { all: { token: "spacing.md" } }, borderRadius: { token: "radius.md" }, boxSizing: "border-box" },
      style: { background: { token: "color.surface-light" }, border: { width: "1px", style: "dashed", color: { token: "color.border-default" } } },
      text: { content: `${primitive} / ${tpl}`, style: "paragraph-sm", color: { token: "color.text-tertiary" } },
    };
  }
  return factory(props ?? {});
}

export function getTemplatesForPrimitive(primitive: string): string[] {
  return Object.keys(TEMPLATE_REGISTRY[primitive] ?? {});
}

/** Get all registered primitives and their templates */
export function getAllTemplates(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const [primitive, templates] of Object.entries(TEMPLATE_REGISTRY)) {
    result[primitive] = Object.keys(templates);
  }
  return result;
}
