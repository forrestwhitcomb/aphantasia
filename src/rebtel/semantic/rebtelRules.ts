// ============================================================
// APHANTASIA for REBTEL — Domain-Specific Label Rules
// ============================================================
// Maps Rebtel domain keywords in shape labels to component types.
// These run BEFORE the generic spatial/label rules.
// ============================================================

import type { AllRebtelComponentType } from "../types";

interface RebtelLabelRule {
  pattern: RegExp;
  type: AllRebtelComponentType;
}

/**
 * Rebtel-specific label rules — tested in order against the
 * first line of the shape label (case-insensitive).
 *
 * More specific patterns come first to avoid collisions.
 */
export const REBTEL_LABEL_RULES: RebtelLabelRule[] = [
  // Navigation
  { pattern: /\b(app\s*bar|header\s*bar|top\s*bar|rebtel\s*bar)\b/i, type: "appBar" },
  { pattern: /\b(tab\s*bar|bottom\s*nav|bottom\s*tabs)\b/i, type: "rebtelTabBar" },
  { pattern: /\b(segment|segmented|tabs?\s*nav|credits.*bundles|plans?\s*tab)\b/i, type: "segmentedNav" },
  { pattern: /\b(stepper|step\s*indicator|flow\s*step|progress\s*step)\b/i, type: "flowStepper" },
  { pattern: /\b(breadcrumb|bread\s*crumb|crumb|trail)\b/i, type: "breadcrumb" },

  // Content — specific first
  { pattern: /\b(contact\s*card|contact\s*list|contact)\b/i, type: "contactCard" },
  { pattern: /\b(rate\s*card|calling\s*rate|rate|per\s*min)/i, type: "rateCard" },
  { pattern: /\b(top[\s-]?up\s*card|recharge\s*card|top[\s-]?up\s*amount|add\s*credit)\b/i, type: "topUpCard" },
  { pattern: /\b(transaction|history\s*row|transaction\s*row|activity)\b/i, type: "transactionRow" },
  { pattern: /\b(balance|credit\s*balance|plan\s*balance|wallet)\b/i, type: "balanceWidget" },
  { pattern: /\b(country\s*row|country\s*list|destination)\b/i, type: "countryRow" },
  { pattern: /\b(carrier|network|operator)\b/i, type: "carrierBadge" },
  { pattern: /\b(promo|promotion|offer|deal|discount|banner)\b/i, type: "promoCard" },

  // Inputs
  { pattern: /\b(phone\s*input|phone\s*number|dial\s*input|enter\s*number)\b/i, type: "phoneInput" },
  { pattern: /\b(amount\s*select|amount\s*picker|choose\s*amount|select\s*amount)\b/i, type: "amountSelector" },
  { pattern: /\b(country\s*picker|select\s*country|choose\s*country|country\s*select)\b/i, type: "countryPicker" },
  { pattern: /\b(pin|otp|verification\s*code|verify\s*code|enter\s*code)\b/i, type: "pinInput" },
  { pattern: /\b(payment\s*method|pay\s*with|credit\s*card|debit\s*card|visa|mastercard|paypal|apple\s*pay)\b/i, type: "paymentMethod" },

  // Feedback
  { pattern: /\b(success\s*screen|confirmation|confirmed|complete[d]?\s*screen)\b/i, type: "successScreen" },
  { pattern: /\b(error\s*banner|error\s*message|failed|failure)\b/i, type: "errorBanner" },
  { pattern: /\b(loading|spinner|skeleton|shimmer)\b/i, type: "loadingState" },
  { pattern: /\b(call\s*status|calling|in[\s-]call|connecting|call\s*screen)\b/i, type: "callStatus" },

  // Composite — more specific patterns
  { pattern: /\b(top[\s-]?up\s*flow|recharge\s*flow|send\s*credit)\b/i, type: "topUpFlow" },
  { pattern: /\b(call(?:ing)?\s*flow|dial\s*pad|make\s*(?:a\s*)?call)\b/i, type: "callingFlow" },
  { pattern: /\b(onboarding|sign[\s-]?up\s*flow|welcome\s*flow|registration)\b/i, type: "onboardingFlow" },
  { pattern: /\b(settings?\s*group|settings?\s*section|preferences)\b/i, type: "settingsGroup" },
  { pattern: /\b(profile\s*header|user\s*profile|my\s*profile|account\s*header)\b/i, type: "rebtelProfileHeader" },
  { pattern: /\b(home\s*screen|main\s*screen|dashboard|home\s*page)\b/i, type: "homeScreen" },

  // New Figma-matched components
  { pattern: /\b(label|tag|badge|chip)\b/i, type: "label" },
  { pattern: /\b(product\s*card|bundle\s*card|data\s*plan)\b/i, type: "productCard" },
  { pattern: /\b(order\s*summary|pricing|price\s*summary|plan\s*summary)\b/i, type: "orderSummary" },
  { pattern: /\b(hero\s*text|hero\s*title|big\s*text|page\s*title)\b/i, type: "heroText" },
  { pattern: /\b(section\s*text|section\s*title|sub\s*header)\b/i, type: "sectionText" },
  { pattern: /\b(text\s*field|input\s*field|form\s*field|email\s*input|underline\s*input)\b/i, type: "textField" },
  { pattern: /\b(bottom\s*sheet|action\s*sheet|picker\s*sheet|frequency)\b/i, type: "rebtelBottomSheet" },
  { pattern: /\b(payment\s*module|pay\s*now|checkout\s*button)\b/i, type: "paymentModule" },
  { pattern: /\b(payment\s*form|add\s*payment|card\s*form|checkout\s*form)\b/i, type: "paymentForm" },
  { pattern: /\b(dialog|popup|confirm|modal|confirmation)\b/i, type: "dialogPopup" },

  // Generic fallbacks (after specific patterns)
  { pattern: /\b(top[\s-]?up|recharge)\b/i, type: "topUpCard" },
  { pattern: /\b(rates?)\b/i, type: "rateCard" },
];

/**
 * Try to resolve a shape label to a Rebtel component type.
 * Returns the type if matched, null otherwise.
 */
export function resolveRebtelLabel(label: string): AllRebtelComponentType | null {
  const firstLine = label.split("\n")[0].trim();
  for (const rule of REBTEL_LABEL_RULES) {
    if (rule.pattern.test(firstLine)) {
      return rule.type;
    }
  }
  return null;
}
