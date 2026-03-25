// ============================================================
// APHANTASIA for REBTEL — Sample Flows
// ============================================================
// Few-shot examples for AI flow generation.
// ============================================================

import type { RebtelFlow } from "../types";

interface SampleFlowEntry {
  prompt: string;
  flow: RebtelFlow;
}

export const REBTEL_SAMPLE_FLOWS: SampleFlowEntry[] = [
  // ── 1. Top-Up Flow ────────────────────────────────────────
  {
    prompt: "Create a top-up flow for sending credit to Cuba",
    flow: {
      name: "Cuba Top-Up Flow",
      screens: [
        {
          screenId: "select-recipient",
          title: "Select Recipient",
          components: [
            { type: "appBar", label: "Send Top-Up", variant: "back" },
            { type: "flowStepper", props: { steps: 4, currentStep: 1 } },
            { type: "sectionHeader", label: "Recent Recipients" },
            { type: "contactCard", label: "Maria Garcia", variant: "selectable", navigateTo: "select-amount" },
            { type: "contactCard", label: "Carlos Rodriguez", variant: "selectable", navigateTo: "select-amount" },
            { type: "divider" },
            { type: "sectionHeader", label: "New Recipient" },
            { type: "phoneInput", variant: "with-contact" },
            { type: "countryPicker", label: "Cuba", variant: "dropdown" },
            { type: "button", label: "Continue", variant: "primary", navigateTo: "select-amount" },
          ],
        },
        {
          screenId: "select-amount",
          title: "Select Amount",
          components: [
            { type: "appBar", label: "Select Amount", variant: "back" },
            { type: "flowStepper", props: { steps: 4, currentStep: 2 } },
            { type: "carrierBadge", label: "Cubacel", variant: "selected" },
            { type: "sectionHeader", label: "Popular Amounts" },
            { type: "topUpCard", label: "$20 USD", variant: "popular", props: { receiverGets: "1000 CUP" } },
            { type: "topUpCard", label: "$30 USD", variant: "default", props: { receiverGets: "1500 CUP" } },
            { type: "topUpCard", label: "$50 USD", variant: "default", props: { receiverGets: "2500 CUP" } },
            { type: "promoCard", label: "Double bonus this week!", variant: "compact" },
            { type: "button", label: "Continue", variant: "primary", navigateTo: "payment" },
          ],
        },
        {
          screenId: "payment",
          title: "Payment",
          components: [
            { type: "appBar", label: "Payment", variant: "back" },
            { type: "flowStepper", props: { steps: 4, currentStep: 3 } },
            { type: "sectionHeader", label: "Order Summary" },
            { type: "contactCard", label: "Maria Garcia — Cubacel", variant: "compact" },
            { type: "topUpCard", label: "$20 USD → 1000 CUP", variant: "default" },
            { type: "divider" },
            { type: "sectionHeader", label: "Payment Method" },
            { type: "paymentMethod", label: "Visa ending in 4242", variant: "card" },
            { type: "paymentMethod", label: "Add new card", variant: "selector" },
            { type: "button", label: "Pay $20.00", variant: "primary", navigateTo: "confirmation" },
          ],
        },
        {
          screenId: "confirmation",
          title: "Confirmation",
          components: [
            { type: "appBar", label: "Confirmation", variant: "close" },
            { type: "flowStepper", props: { steps: 4, currentStep: 4 } },
            { type: "successScreen", label: "Top-Up Sent!", variant: "topup" },
            { type: "contactCard", label: "Maria Garcia — $20 USD", variant: "compact" },
            { type: "toggle", label: "Set up auto-recharge" },
            { type: "button", label: "Done", variant: "primary" },
            { type: "button", label: "Send Another", variant: "outline" },
          ],
        },
      ],
    },
  },

  // ── 2. Onboarding Flow ────────────────────────────────────
  {
    prompt: "Design an onboarding flow for new users",
    flow: {
      name: "New User Onboarding",
      screens: [
        {
          screenId: "welcome",
          title: "Welcome",
          components: [
            { type: "appBar", label: "Rebtel", variant: "home" },
            { type: "emptyState", label: "Send love across borders", props: { description: "Affordable calls and instant top-ups to 190+ countries" } },
            { type: "promoCard", label: "Get $2 free calling credit", variant: "hero" },
            { type: "button", label: "Get Started", variant: "primary", navigateTo: "phone-verify" },
            { type: "button", label: "I already have an account", variant: "ghost" },
          ],
        },
        {
          screenId: "phone-verify",
          title: "Phone Verification",
          components: [
            { type: "appBar", label: "Verify Phone", variant: "back" },
            { type: "sectionHeader", label: "Enter your phone number" },
            { type: "phoneInput", variant: "default" },
            { type: "button", label: "Send Code", variant: "primary" },
            { type: "divider" },
            { type: "sectionHeader", label: "Enter verification code" },
            { type: "pinInput", variant: "6-digit" },
            { type: "button", label: "Verify", variant: "primary", navigateTo: "get-started" },
          ],
        },
        {
          screenId: "get-started",
          title: "Get Started",
          components: [
            { type: "appBar", label: "Rebtel", variant: "home" },
            { type: "sectionHeader", label: "What would you like to do?" },
            { type: "topUpCard", label: "Send a Top-Up", variant: "popular", props: { description: "Send airtime to family abroad" } },
            { type: "rateCard", label: "Make a Call", variant: "featured", props: { description: "Cheap international calls" } },
            { type: "promoCard", label: "Explore calling plans", variant: "compact" },
            { type: "rebtelTabBar" },
          ],
        },
      ],
    },
  },

  // ── 3. Home Screen ────────────────────────────────────────
  {
    prompt: "Show me a home screen for an active user",
    flow: {
      name: "Active User Home",
      screens: [
        {
          screenId: "home",
          title: "Home",
          components: [
            { type: "appBar", label: "Rebtel", variant: "home" },
            { type: "balanceWidget", label: "$12.50 Credits", variant: "multi", props: { planName: "Cuba Unlimited", planRemaining: "18 days" } },
            { type: "sectionHeader", label: "Quick Actions" },
            { type: "button", label: "Send Top-Up", variant: "primary" },
            { type: "button", label: "Buy a Plan", variant: "outline" },
            { type: "sectionHeader", label: "Recent Activity" },
            { type: "transactionRow", label: "Top-Up to Maria Garcia", variant: "topup", props: { amount: "$20.00", date: "Today" } },
            { type: "transactionRow", label: "Call to Havana", variant: "call", props: { duration: "23 min", date: "Yesterday" } },
            { type: "transactionRow", label: "Top-Up to Carlos", variant: "topup", props: { amount: "$15.00", date: "Mar 18" } },
            { type: "promoCard", label: "Cuba Double Bonus — This Weekend Only!", variant: "compact" },
            { type: "rebtelTabBar" },
          ],
        },
      ],
    },
  },
];
