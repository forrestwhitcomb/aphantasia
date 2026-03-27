// ============================================================
// APHANTASIA for REBTEL — Figma Component Registry
// ============================================================

import type { FigmaComponentEntry } from '@/ui-mode/types';
import type { AllRebtelComponentType } from './types';
import { isAllRebtelType } from './types';

// ── Rebtel Figma name → component type mapping ──────────────
// Tests against BOTH baseName and figmaName so "MTU/Product/Bundle"
// matches on the full name even when baseName is just "MTU".
// Patterns use [\s\-_]* to match spaces, hyphens, and underscores.

const REBTEL_NAME_MAP: [RegExp, AllRebtelComponentType][] = [
  // ── Navigation ──
  [/main[\s\-_]*nav|bottom[\s\-_]*nav/i, 'rebtelTabBar'],
  [/app[\s\-_]*bar|header[\s\-_]*bar|top[\s\-_]*bar/i, 'appBar'],
  [/^header$/i, 'appBar'],
  [/tab[\s\-_]*bar/i, 'rebtelTabBar'],
  [/segmented|segment[\s\-_]*control/i, 'segmentedNav'],
  [/flow[\s\-_]*stepper|step[\s\-_]*indicator/i, 'flowStepper'],
  [/breadcrumb/i, 'breadcrumb'],

  // ── Cards & content ──
  [/contact[\s\-_]*card/i, 'contactCard'],
  [/rate[\s\-_]*card|calling[\s\-_]*rate|credit[\s\-_]*product/i, 'rateCard'],
  [/top[\s\-_]?up[\s\-_]*card|recharge[\s\-_]*card|auto[\s\-_]*top[\s\-_]*up/i, 'topUpCard'],
  [/product[\s\-_]*card|bundle[\s\-_]*card|product[\s\/]bundle/i, 'productCard'],
  [/transaction[\s\-_]*row|history[\s\-_]*row/i, 'transactionRow'],
  [/balance[\s\-_]*widget|credit[\s\-_]*balance/i, 'balanceWidget'],
  [/country[\s\-_]*list|country[\s\-_]*row/i, 'countryRow'],
  [/carrier[\s\-_]*badge|network/i, 'carrierBadge'],
  [/promo[\s\-_]*card|offer[\s\-_]*card|banner/i, 'promoCard'],
  [/order[\s\-_]*summary|price[\s\-_]*summary|reciept[\s\-_]*module|receipt[\s\-_]*module/i, 'orderSummary'],

  // ── Inputs & forms ──
  [/enter[\s\-_]*phone|phone[\s\-_]*input|phone[\s\-_]*number/i, 'phoneInput'],
  [/amount[\s\-_]*selector|amount[\s\-_]*picker/i, 'amountSelector'],
  [/country[\s\-_]*picker|country[\s\-_]*select/i, 'countryPicker'],
  [/pin[\s\-_]*input|otp|verification/i, 'pinInput'],
  [/input[\s\-_]*search|search[\s\-_]*bar|search[\s\-_]*input/i, 'searchBar'],
  [/text[\s\-_]*field|input[\s\-_]*field|form[\s\-_]*field/i, 'textField'],

  // ── Payment ──
  [/payment[\s\-_]*method|pay[\s\-_]*with/i, 'paymentMethod'],
  [/payment[\s\-_]*module|pay[\s\-_]*now/i, 'paymentModule'],
  [/payment[\s\-_]*form|checkout[\s\-_]*form/i, 'paymentForm'],

  // ── Buttons ──
  [/^primary$|^secondary$|^tertiary$/i, 'button'],
  [/text[\s\-_]*button/i, 'button'],
  [/button[\s\-_]*tab/i, 'button'],
  [/squared[\s\-_]*w[\s\-_]*icon/i, 'button'],

  // ── Feedback & overlays ──
  [/success[\s\-_]*screen|confirmation[\s\-_]*screen/i, 'successScreen'],
  [/error[\s\-_]*banner|error[\s\-_]*message/i, 'errorBanner'],
  [/loading|skeleton|shimmer/i, 'loadingState'],
  [/dialog|popup|modal|confirm/i, 'dialogPopup'],
  [/bottom[\s\-_]*sheet|action[\s\-_]*sheet/i, 'rebtelBottomSheet'],

  // ── Composite flows ──
  [/call[\s\-_]*status|in[\s\-_]*call/i, 'callStatus'],
  [/top[\s\-_]?up[\s\-_]*flow/i, 'topUpFlow'],
  [/calling[\s\-_]*flow|dial[\s\-_]*pad/i, 'callingFlow'],
  [/onboarding[\s\-_]*flow|sign[\s\-_]*up[\s\-_]*flow/i, 'onboardingFlow'],
  [/settings?[\s\-_]*group/i, 'settingsGroup'],
  [/profile[\s\-_]*header|user[\s\-_]*profile/i, 'rebtelProfileHeader'],
  [/home[\s\-_]*screen|main[\s\-_]*screen/i, 'homeScreen'],

  // ── Typography ──
  [/hero[\s\-_]*text|page[\s\-_]*title/i, 'heroText'],
  [/section[\s\-_]*header|section[\s\-_]*text|section[\s\-_]*title/i, 'sectionText'],

  // ── Misc ──
  [/^toggle$/i, 'toggle'],
  [/^label$|^tag$|^badge$|^chip$/i, 'label'],
  [/^divider$/i, 'divider'],
];

// Also test against the full figmaName (e.g. "MTU/Product/Bundle")
const REBTEL_FULLNAME_MAP: [RegExp, AllRebtelComponentType][] = [
  [/MTU[\s\/\-_]*Product/i, 'productCard'],
  [/MTU[\s\/\-_]*Auto[\s\-_]*top/i, 'topUpCard'],
  [/Calling[\s\/\-_]*credit[\s\-_]*product/i, 'rateCard'],
];

export function applyRebtelMapping(entry: FigmaComponentEntry): FigmaComponentEntry {
  // 1. Try full figmaName first (catches "MTU/Product/Bundle" etc.)
  for (const [pattern, type] of REBTEL_FULLNAME_MAP) {
    if (pattern.test(entry.figmaName)) {
      return { ...entry, aphantasiaType: type };
    }
  }

  // 2. Try baseName
  for (const [pattern, type] of REBTEL_NAME_MAP) {
    if (pattern.test(entry.baseName)) {
      return { ...entry, aphantasiaType: type };
    }
  }

  return entry;
}

export function buildRebtelRegistry(raw: FigmaComponentEntry[]): FigmaComponentEntry[] {
  const mapped = raw.map(applyRebtelMapping);
  // Only keep entries that resolved to a valid Rebtel component type.
  // This filters out icons, primitives, and other unmappable items.
  return mapped.filter(e => isAllRebtelType(e.aphantasiaType));
}

export function lookupByFigmaId(
  registry: FigmaComponentEntry[],
  figmaId: string
): FigmaComponentEntry | undefined {
  return registry.find(e => e.figmaId === figmaId);
}

/**
 * Look up by shape label or Figma component name.
 * Used by RebtelSemanticResolver for drawn shapes.
 */
export function lookupByName(
  registry: FigmaComponentEntry[],
  label: string
): FigmaComponentEntry | undefined {
  const firstLine = label.split('\n')[0].trim().toLowerCase();
  const exact = registry.find(e => e.figmaName.toLowerCase() === firstLine);
  if (exact) return exact;
  return registry.find(e =>
    firstLine.includes(e.baseName.toLowerCase()) ||
    e.baseName.toLowerCase().includes(firstLine)
  );
}
