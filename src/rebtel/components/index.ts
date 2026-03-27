// ============================================================
// APHANTASIA for REBTEL — Component Dispatcher
// ============================================================
// Routes component types to their renderers. For the 10 shared
// base types, delegates to the existing ui-mode renderers.
// For Rebtel types, delegates to Rebtel-specific renderers.
// ============================================================

import type { UIComponentPropsBase } from "@/ui-mode/types";
import { renderUIComponent } from "@/ui-mode/components";
import { isSharedType } from "../types";

// Navigation
import { renderAppBar } from "./navigation/AppBar";
import { renderRebtelTabBar } from "./navigation/RebtelTabBar";
import { renderSegmentedNav } from "./navigation/SegmentedNav";
import { renderFlowStepper } from "./navigation/FlowStepper";
import { renderBreadcrumb } from "./navigation/Breadcrumb";

// Content
import { renderContactCard } from "./content/ContactCard";
import { renderRateCard } from "./content/RateCard";
import { renderTopUpCard } from "./content/TopUpCard";
import { renderTransactionRow } from "./content/TransactionRow";
import { renderBalanceWidget } from "./content/BalanceWidget";
import { renderCountryRow } from "./content/CountryRow";
import { renderCarrierBadge } from "./content/CarrierBadge";
import { renderPromoCard } from "./content/PromoCard";
import { renderLabel } from "./content/Label";
import { renderProductCard } from "./content/ProductCard";
import { renderOrderSummary } from "./content/OrderSummary";
import { renderHeroText } from "./content/HeroText";
import { renderSectionText } from "./content/SectionText";

// Inputs
import { renderPhoneInput } from "./inputs/PhoneInput";
import { renderAmountSelector } from "./inputs/AmountSelector";
import { renderCountryPicker } from "./inputs/CountryPicker";
import { renderPinInput } from "./inputs/PinInput";
import { renderPaymentMethod } from "./inputs/PaymentMethod";
import { renderTextField } from "./inputs/TextField";
import { renderPaymentModule } from "./inputs/PaymentModule";

// Feedback
import { renderSuccessScreen } from "./feedback/SuccessScreen";
import { renderErrorBanner } from "./feedback/ErrorBanner";
import { renderLoadingState } from "./feedback/LoadingState";
import { renderCallStatus } from "./feedback/CallStatus";

// Composite
import { renderTopUpFlow } from "./composite/TopUpFlow";
import { renderCallingFlow } from "./composite/CallingFlow";
import { renderOnboardingFlow } from "./composite/OnboardingFlow";
import { renderSettingsGroup } from "./composite/SettingsGroup";
import { renderRebtelProfileHeader } from "./composite/RebtelProfileHeader";
import { renderHomeScreen } from "./composite/HomeScreen";
import { renderRebtelBottomSheet } from "./composite/BottomSheet";
import { renderDialogPopup } from "./composite/DialogPopup";
import { renderPaymentForm } from "./composite/PaymentForm";

/**
 * Render a Rebtel component by type. Returns an HTML string.
 * Delegates shared types to the base renderer, Rebtel types
 * to Rebtel-specific renderers.
 */
export function renderRebtelComponent(
  type: string,
  props: Partial<UIComponentPropsBase> = {}
): string {
  // Shared base types — delegate to existing renderers
  if (isSharedType(type)) {
    return renderUIComponent(type as any, props);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = props as any;

  switch (type) {
    // Navigation
    case "appBar": return renderAppBar(p);
    case "rebtelTabBar": return renderRebtelTabBar(p);
    case "segmentedNav": return renderSegmentedNav(p);
    case "flowStepper": return renderFlowStepper(p);
    case "breadcrumb": return renderBreadcrumb(p);

    // Content
    case "contactCard": return renderContactCard(p);
    case "rateCard": return renderRateCard(p);
    case "topUpCard": return renderTopUpCard(p);
    case "transactionRow": return renderTransactionRow(p);
    case "balanceWidget": return renderBalanceWidget(p);
    case "countryRow": return renderCountryRow(p);
    case "carrierBadge": return renderCarrierBadge(p);
    case "promoCard": return renderPromoCard(p);
    case "label": return renderLabel(p);
    case "productCard": return renderProductCard(p);
    case "orderSummary": return renderOrderSummary(p);
    case "heroText": return renderHeroText(p);
    case "sectionText": return renderSectionText(p);

    // Inputs
    case "phoneInput": return renderPhoneInput(p);
    case "amountSelector": return renderAmountSelector(p);
    case "countryPicker": return renderCountryPicker(p);
    case "pinInput": return renderPinInput(p);
    case "paymentMethod": return renderPaymentMethod(p);
    case "textField": return renderTextField(p);
    case "paymentModule": return renderPaymentModule(p);

    // Feedback
    case "successScreen": return renderSuccessScreen(p);
    case "errorBanner": return renderErrorBanner(p);
    case "loadingState": return renderLoadingState(p);
    case "callStatus": return renderCallStatus(p);

    // Composite
    case "topUpFlow": return renderTopUpFlow(p);
    case "callingFlow": return renderCallingFlow(p);
    case "onboardingFlow": return renderOnboardingFlow(p);
    case "settingsGroup": return renderSettingsGroup(p);
    case "rebtelProfileHeader": return renderRebtelProfileHeader(p);
    case "homeScreen": return renderHomeScreen(p);
    case "rebtelBottomSheet": return renderRebtelBottomSheet(p);
    case "dialogPopup": return renderDialogPopup(p);
    case "paymentForm": return renderPaymentForm(p);

    default:
      return renderRebtelPlaceholder(type, props);
  }
}

/** Fallback placeholder for unrecognized types */
function renderRebtelPlaceholder(type: string, props: Partial<UIComponentPropsBase>): string {
  const label = props.label || type.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()).trim();
  return `
<div style="padding:var(--spacing-md);margin:var(--spacing-sm) var(--spacing-md);background:var(--rebtel-red-light, #FCEAEC);border-radius:var(--radius-md);border:1px dashed var(--rebtel-red, #E63946);text-align:center" data-component="${type}">
  <span style="font-size:var(--font-size-sm);color:var(--color-foreground);font-family:var(--font-body-family)" data-text-editable>${label}</span>
</div>`;
}
