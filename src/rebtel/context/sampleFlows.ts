// ============================================================
// APHANTASIA for REBTEL — Sample Flows
// ============================================================
// Few-shot examples matching actual Figma FLOWS audit.
// These teach the AI the exact screen patterns from the
// real product design.
// ============================================================

import type { RebtelFlow } from "../types";

interface SampleFlowEntry {
  prompt: string;
  flow: RebtelFlow;
}

export const REBTEL_SAMPLE_FLOWS: SampleFlowEntry[] = [
  // ── 1. Mobile Top-Up Flow (from Figma MTU section) ─────────
  {
    prompt: "Create a top-up flow for sending credit to Nigeria",
    flow: {
      name: "Nigeria Top-Up Flow",
      screens: [
        {
          screenId: "search-contact",
          title: "Mobile Top-up",
          components: [
            { type: "appBar", label: "Mobile Top-up", variant: "back" },
            { type: "searchBar", label: "Search contacts" },
            { type: "sectionHeader", label: "Relevant contacts" },
            { type: "contactCard", label: "Jane Cooper", variant: "compact", props: { phone: "+234787332454", flag: "🇳🇬" }, navigateTo: "select-product" },
            { type: "contactCard", label: "Jane Cooper", variant: "compact", props: { phone: "+234787332454", flag: "🇳🇬" }, navigateTo: "select-product" },
            { type: "contactCard", label: "Jane Cooper", variant: "compact", props: { phone: "+234787332454", flag: "🇳🇬" }, navigateTo: "select-product" },
            { type: "divider" },
            { type: "contactCard", label: "Jane Cooper", variant: "compact", props: { phone: "+234787332454", flag: "🇳🇬" }, navigateTo: "select-product" },
          ],
        },
        {
          screenId: "select-product",
          title: "Mobile Top-up",
          components: [
            { type: "appBar", label: "Mobile Top-up", variant: "back" },
            { type: "segmentedNav", label: "Bundles | Credits", variant: "large" },
            { type: "sectionHeader", label: "Bundles" },
            { type: "productCard", label: "7GB Nigeria", props: { tags: ["Most popular", "Carrier Bonus"], features: ["11 GB data", "Unlimited calling", "20 SMS"], price: "$3.21", validity: "30 days" }, navigateTo: "order-summary" },
            { type: "productCard", label: "15GB Nigeria", props: { tags: ["Auto-restock", "Carrier Bonus"], features: ["Data 24GB", "Unlimited calling", "Unlimited SMS"], price: "$3.21", validity: "30 days" }, navigateTo: "order-summary" },
            { type: "sectionHeader", label: "Credits" },
            { type: "topUpCard", label: "Rebtel Credits to Nigeria", variant: "amount-select", props: { amounts: ["$5", "$10", "$25"] } },
          ],
        },
        {
          screenId: "auto-topup",
          title: "Mobile Top-up",
          components: [
            { type: "appBar", label: "Mobile Top-up", variant: "back" },
            { type: "contactCard", label: "Jane Cooper", variant: "compact", props: { phone: "+234787332454", flag: "🇳🇬" } },
            { type: "heroText", label: "Make sure that Dan never runs out of credit", props: { subtitle: "Don't think about it ever again: we'll do it for you! Activate automatic Top-Ups. Cancel anytime." } },
            { type: "button", label: "Yes", variant: "primary" , navigateTo: "order-summary" },
            { type: "button", label: "No", variant: "secondary", navigateTo: "order-summary" },
          ],
        },
        {
          screenId: "order-summary",
          title: "Order summary",
          components: [
            { type: "appBar", label: "Order summary", variant: "back" },
            { type: "orderSummary", props: { planName: "11GB Nigeria", planPrice: "$5", trialText: "Validity:", trialPrice: "30 days", payNow: "$5", afterTrial: "Every 30 days" } },
            { type: "paymentModule", props: { cardLast4: "1000", ctaLabel: "Pay $5" } },
          ],
        },
        {
          screenId: "success",
          title: "Success",
          components: [
            { type: "successScreen", label: "You sent NGN 7650 to Buyaka", variant: "topup", props: { subtitle: "For more details, just check your account activity." } },
            { type: "promoCard", label: "Get 30 minutes to call Philippines!", variant: "offer", props: { description: "Only $1, Try a free call." } },
            { type: "button", label: "Close", variant: "text-link" },
          ],
        },
      ],
    },
  },

  // ── 2. Onboarding Flow (from Figma Onboarding section) ─────
  {
    prompt: "Design an onboarding flow for new users",
    flow: {
      name: "New User Onboarding",
      screens: [
        {
          screenId: "welcome-splash",
          title: "Welcome",
          components: [
            { type: "heroText", label: "Stay globally connected with calls and top-ups.", props: { subtitle: "" } },
            { type: "button", label: "Get started", variant: "primary-dark", navigateTo: "sign-up" },
            { type: "button", label: "Log in", variant: "secondary", navigateTo: "sign-up" },
          ],
        },
        {
          screenId: "sign-up",
          title: "Sign Up",
          components: [
            { type: "appBar", variant: "back" },
            { type: "heroText", label: "Sign up with your phone number", props: { subtitle: "We need this for some services and to ensure your account's security" } },
            { type: "phoneInput", variant: "filled" },
            { type: "button", label: "Continue", variant: "primary-dark", navigateTo: "otp-verify" },
          ],
        },
        {
          screenId: "otp-verify",
          title: "Verify",
          components: [
            { type: "appBar", variant: "back" },
            { type: "heroText", label: "Please verify your phone number", props: { subtitle: "We've sent a one-time verification code to (USER NUMBER). Enter the code below" } },
            { type: "pinInput", variant: "4-digit" },
          ],
        },
        {
          screenId: "notifications",
          title: "Notifications",
          components: [
            { type: "appBar", variant: "back" },
            { type: "heroText", label: "Never miss out", props: { subtitle: "Stay up-to-date on important info, promos, and new features — no need to keep checking the app." } },
            { type: "toggle", label: "Notifications", props: { description: "Describe notifications" } },
            { type: "toggle", label: "Promotions", props: { description: "Describe promotions" } },
            { type: "button", label: "Continue", variant: "primary-dark", navigateTo: "npu-home" },
          ],
        },
        {
          screenId: "npu-home",
          title: "Home",
          components: [
            { type: "searchBar", label: "Search contacts" },
            { type: "heroText", label: "Welcome to Rebtel", props: { subtitle: "The place for dual-culture people like you to connect their worlds." } },
            { type: "promoCard", label: "Get started with 7 days of free unlimited calls to Nigeria", variant: "offer", props: { ctaText: "Start free trial" } },
            { type: "button", label: "Make your first call", variant: "primary-dark" },
            { type: "button", label: "Send your first top-up", variant: "primary-dark" },
            { type: "rebtelTabBar" },
          ],
        },
      ],
    },
  },

  // ── 3. Home Screen — Active User (from Figma Home section) ─
  {
    prompt: "Show me a home screen for an active user",
    flow: {
      name: "Active User Home",
      screens: [
        {
          screenId: "home",
          title: "Home",
          components: [
            { type: "searchBar", label: "Search contacts" },
            { type: "contactCard", label: "Emil Lee Ann Bergst...", variant: "calling", props: { minutesLeft: "340 minutes left", localTime: "Local time 2:30 PM" } },
            { type: "contactCard", label: "Emil Lee Ann Bergst...", variant: "topup", props: { amountSent: "UGX 10499", theyReceived: "Monthly Youtube & Soc..." } },
            { type: "contactCard", label: "Emil Lee Ann Bergst...", variant: "calling", props: { minutesLeft: "3 minutes left", localTime: "Local time 2:30 PM" } },
            { type: "contactCard", label: "Emil Lee Ann Bergst...", variant: "calling", props: { minutesLeft: "0 minutes left", localTime: "Local time 2:30 PM" } },
            { type: "rebtelTabBar" },
          ],
        },
      ],
    },
  },

  // ── 4. International Calling Flow (from Figma Calling section) ─
  {
    prompt: "Design the international calling experience",
    flow: {
      name: "International Calling",
      screens: [
        {
          screenId: "calling-home",
          title: "International calling",
          components: [
            { type: "appBar", label: "International calling", variant: "back" },
            { type: "searchBar", label: "Search contacts" },
            { type: "sectionHeader", label: "Recent" },
            { type: "contactCard", label: "Leslie Alexander", variant: "compact", props: { phone: "+234787332454", flag: "🇮🇳", minutesLeft: "23 min left" }, navigateTo: "country-pricing" },
            { type: "contactCard", label: "Jerome Bell", variant: "compact", props: { phone: "+234787332454", flag: "🇲🇽", minutesLeft: "78 min left" }, navigateTo: "country-pricing" },
            { type: "promoCard", label: "Get 30 minutes to call Philippines!", variant: "offer" },
          ],
        },
        {
          screenId: "country-pricing",
          title: "India",
          components: [
            { type: "appBar", label: "India", variant: "back" },
            { type: "topUpCard", label: "India Unlimited", variant: "plan", props: { planName: "India Unlimited", planPrice: "$6/30 days", planFeatures: ["Unlimited calls to India", "Cancel anytime"] } },
            { type: "divider", label: "Or" },
            { type: "topUpCard", label: "Rebtel Credits to India", variant: "amount-select", props: { amounts: ["$5", "$10", "$25"] } },
          ],
        },
        {
          screenId: "call-rating",
          title: "Call Rating",
          components: [
            { type: "callStatus", variant: "ended", label: "Richmond Ko", props: { minutesTalked: "335 min", minutesLeft: "267 min" } },
            { type: "button", label: "Close", variant: "text-link" },
          ],
        },
      ],
    },
  },
  // ── Sample 5: Rebtel Credits (scrollable main screen) ──
  {
    prompt: "Show the Rebtel credits experience",
    flow: {
      name: "Rebtel Credits",
      screens: [
        {
          screenId: "buy-credits",
          title: "Buy Credits",
          components: [
            { type: "rebtelTabBar" },
            { type: "segmentedNav", label: "Buy Credits | Activity", variant: "large" },
            { type: "balanceWidget", label: "Rebtel Credits", props: { balance: "$24.00" } },
            { type: "amountSelector", props: { amounts: ["$5", "$10", "$25", "$50", "$100", "$150"] } },
            { type: "sectionText", label: "About Rebtel Credits", props: { description: "Credits never expire and can be used for calls and top-ups." } },
            { type: "promoCard", label: "Get 30 minutes to call Philippines!", variant: "offer" },
            { type: "promoCard", label: "Refer a friend, get $5 credit", variant: "inline" },
          ],
        },
        {
          screenId: "activity",
          title: "Activity",
          components: [
            { type: "rebtelTabBar" },
            { type: "segmentedNav", label: "Buy Credits | Activity", variant: "large" },
            { type: "sectionHeader", label: "March 2026" },
            { type: "transactionRow", label: "Jane Cooper", props: { amount: "-$10.00", time: "Mar 28" } },
            { type: "transactionRow", label: "Emil Bergström", props: { amount: "-$5.00", time: "Mar 25" } },
            { type: "transactionRow", label: "Credit Purchase", props: { amount: "+$50.00", time: "Mar 20" } },
            { type: "transactionRow", label: "Jerome Bell", props: { amount: "-$10.00", time: "Mar 15" } },
            { type: "promoCard", label: "Low on credits? Add more now", variant: "banner" },
          ],
        },
      ],
    },
  },
  // ── Sample 6: Auto Top-Up Prompt + Success ──
  {
    prompt: "Show what happens after a successful top-up",
    flow: {
      name: "Auto Top-Up Success",
      screens: [
        {
          screenId: "auto-topup-prompt",
          title: "Auto Top-Up",
          components: [
            { type: "appBar", label: "Mobile Top-up", variant: "back" },
            { type: "contactCard", label: "Dan Cooper", variant: "compact" },
            { type: "heroText", label: "Make sure that Dan never runs out of credit", props: { subtitle: "Don't think about it — we'll top them up automatically when they run low." } },
            { type: "sectionText", label: "How it works", props: { description: "We'll send the same amount when their balance drops below 10%." } },
            { type: "button", label: "Yes, set up auto top-up", variant: "primary", navigateTo: "processing" },
            { type: "button", label: "No thanks", variant: "secondary", navigateTo: "success" },
          ],
        },
        {
          screenId: "processing",
          title: "Processing",
          components: [
            { type: "loadingState", label: "Processing your top-up..." },
          ],
        },
        {
          screenId: "success",
          title: "Success",
          components: [
            { type: "successScreen", label: "You sent NGN 7650 to Dan Cooper", variant: "topup", props: { subtitle: "Auto top-up is now active. We'll top up Dan when their balance is low." } },
            { type: "promoCard", label: "Get 30 minutes to call Philippines!", variant: "offer" },
            { type: "button", label: "Close", variant: "text-link" },
          ],
        },
      ],
    },
  },
  // ── Sample 7: Order Summary with Payment Sheet ──
  {
    prompt: "Show the checkout and payment experience",
    flow: {
      name: "Checkout Payment",
      screens: [
        {
          screenId: "order-checkout",
          title: "Order Summary",
          components: [
            { type: "appBar", label: "Order summary", variant: "back" },
            { type: "orderSummary", props: { planName: "7GB Nigeria Bundle", planPrice: "$12.99", trialText: "7-day trial", trialPrice: "$0.00", payNow: "$0.00", afterTrial: "$12.99/month" } },
            { type: "paymentModule", props: { cardLast4: "1000", ctaLabel: "Pay $0.00" } },
          ],
        },
      ],
    },
  },
];
