// ============================================================
// Generated Template Registry — Auto-extracted from Figma
// ============================================================
// Re-run extraction pipeline to update. DO NOT HAND EDIT.
// ============================================================

import type { TemplateFactory } from "../../spec/types";

// Bars
import { appBarTemplate } from "./appBar";
import { tabBarTemplate } from "./tabBar";

// Buttons
import { buttonTemplate } from "./button";

// Cards
import { blankCardTemplate } from "./blankCard";
import { contactCardTemplate } from "./contactCard";
import { creditsCardTemplate } from "./creditsCard";
import { infoCardTemplate } from "./infoCard";
import { orderSummaryTemplate } from "./orderSummary";
import { productCreditsTemplate } from "./productCredits";
import { productMtuTemplate } from "./productMtu";
import { promoCardTemplate } from "./promoCard";
import { serviceTypeTemplate } from "./serviceType";

// Inputs
import { phoneInputTemplate } from "./phoneInput";
import { pinInputTemplate } from "./pinInput";
import { searchBarTemplate } from "./searchBar";
import { textFieldTemplate } from "./textField";

// Selectors
import { tabsTemplate } from "./tabs";

// Sheets
import { actionSheetTemplate } from "./actionSheet";
import { dialogTemplate } from "./dialog";
import { paymentSheetTemplate } from "./paymentSheet";

// Text
import { textBlockTemplate } from "./textBlock";

// ── Registry ─────────────────────────────────────────────────

export const GENERATED_REGISTRY: Record<string, Record<string, TemplateFactory>> = {
  bar: {
    "app-bar": appBarTemplate,
    "tab-bar": tabBarTemplate,
  },
  button: {
    "primary": (p) => buttonTemplate({ ...p, variant: "primary" }),
    "secondary": (p) => buttonTemplate({ ...p, variant: "secondary" }),
    "secondary-white": (p) => buttonTemplate({ ...p, variant: "secondary-white" }),
    "secondary-grey": (p) => buttonTemplate({ ...p, variant: "secondary-grey" }),
    "outlined": (p) => buttonTemplate({ ...p, variant: "secondary-grey" }),
    "red": (p) => buttonTemplate({ ...p, variant: "primary" }),
    "white": (p) => buttonTemplate({ ...p, variant: "secondary-white" }),
    "black": (p) => buttonTemplate({ ...p, variant: "secondary" }),
  },
  card: {
    "blank": blankCardTemplate,
    "contact": contactCardTemplate,
    "contact-calling": (p) => contactCardTemplate({ ...p, variant: "calling" }),
    "contact-topup": (p) => contactCardTemplate({ ...p, variant: "topup" }),
    "credits-collapsed": (p) => creditsCardTemplate({ ...p, variant: "collapsed" }),
    "credits-expanded": (p) => creditsCardTemplate({ ...p, variant: "expanded" }),
    "info": infoCardTemplate,
    "info-icon": infoCardTemplate,
    "order-summary": orderSummaryTemplate,
    "product-credits": productCreditsTemplate,
    "product-mtu": productMtuTemplate,
    "promo": promoCardTemplate,
    "service-type": serviceTypeTemplate,
  },
  input: {
    "phone": phoneInputTemplate,
    "pin": pinInputTemplate,
    "search": searchBarTemplate,
    "text-field": textFieldTemplate,
  },
  selector: {
    "tabs": tabsTemplate,
    "segmented": tabsTemplate,
  },
  sheet: {
    "action-sheet": actionSheetTemplate,
    "dialog": dialogTemplate,
    "payment": paymentSheetTemplate,
  },
  text: {
    "balance": textBlockTemplate,
  },
};
