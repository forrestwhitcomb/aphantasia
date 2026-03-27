// ============================================================
// APHANTASIA for REBTEL — Domain Context
// ============================================================
// Structured Rebtel product knowledge for AI prompt context.
// Updated from Figma FLOWS audit (March 2026).
// ============================================================

export const REBTEL_DOMAIN_CONTEXT = `
# Rebtel Product Context

## What Rebtel Is
Rebtel is a mobile-first fintech app serving 2M+ users in migrant communities worldwide.
Two core products: International Calling (190+ countries) and Mobile Top-Up (150+ countries).
Users send airtime/data to family abroad and make affordable international calls.

## Core Products

### Mobile Top-Up (MTU)
- Send airtime or data bundles to phones in 150+ countries
- Major carriers: Cubacel (Cuba), Claro (Latin America), MTN (Africa), Airtel, Digicel, Globe
- Instant delivery with confirmation receipt
- Auto-recharge scheduling (every 7/14/21/30 days)
- Promo bundles with bonus credit
- Two purchase paths: Bundles (fixed data+calls package) and Credits (pay-per-minute airtime)

### International Calling
- Low-cost calls to 190+ countries
- Subscriptions (unlimited monthly, e.g. "India Unlimited $6/30 days") and Credits (pay-per-minute)
- WiFi and cellular calling
- Contact favorites and recents with "minutes left" display
- Call quality rating (5-star) after each call

## Key User Flows (from Figma)

### 1. Onboarding (8 screens)
Welcome splash (dark, branded, Rebtel logo + "Stay globally connected") → Sign up with phone number (hero text + pill phone input + "Continue" pinned bottom) → OTP verification (4-digit boxes + numeric keypad) → Notification permissions (toggle rows) → OS permission popup → NPU first experience home (Welcome text + promo card + "Make your first call" / "Send your first top-up" dual black CTAs + tabBar)

### 2. Home & Services (4 screens)
Home feed: search bar + utility icons → scrolling home cards (calling cards with green badge + top-up cards with grey badge) → bottom sheet warnings ("You're low/out of minutes" + "Add minutes" / "Call anyway") → Services page: "Rebtel credits $24.24" + "Add credits" red button + icon cards (International Calling, Mobile Top-up)

### 3. Mobile Top-Up Flow (18 screens)
Contact search (appBar "Mobile Top-up" + search bar + "Relevant contacts" list with avatar rows) → Enter number (phone input + country flag) → Product selection page (long scroll: segmented nav "Bundles | Credits" tabs → Bundles section with product cards: tags + features + price + "Select product" red outline CTA → Credits section with amount pills $5/$10/$25 + minutes display + "Buy now" red CTA) → Auto top-up prompt (centered avatar + "Make sure Dan never runs out" + frequency pills "7/14/21/30 days" + "Yes" red CTA + "No" grey CTA) → Order summary (line items: product + price, validity, discount in red, Rebtel credit in red, VAT, fee, divider, Total bold, "Auto Top Up: Every 30 days" + "Use Rebtel Credits" toggle + Visa selector + "Pay $5" red CTA) → Processing animation → Success screen (lottie area + "You sent NGN 7650 to Buyaka" + auto top-up active card + promo cross-sell + "Close")

### 4. International Calling Flow (17 screens)
Contact list (appBar "International calling" + search + recent contacts with avatars + minutes left + promo card at bottom + Credits/Subscriptions pill bar at very bottom) → New user variant (promo banner + hero text + country rate list + "Buy credits or subscription" red CTA) → Contact search with keyboard → Selected contact multi-number picker → Enter phone number with dial pad → Country pricing page (Subscription card: flag + "India Unlimited" + "$6/30 days" + "Activate" red CTA + "Cancel anytime" → "Or" divider → Credits card: "Pay as you go" + amount pills + minutes display + "Buy now" red CTA) → Call screen (avatar + name + timer + dial pad) → Call rating (avatar + "Minutes talked/left" stat cards + 5-star rating + "Close" text link)

### 5. Rebtel Credits (2 screens)
Buy Credits tab: balance "$24.00" + Buy Credits/Activity toggle + amount grid ($5/$10/$25/$50/$100/$150) + "About Rebtel Credits" info + referral promo + subscription upsell
Activity tab: Bought Credits/Free Credits sub-tabs + balance amounts + expiring credits list + transaction history rows + referral promo

## User Types
- **New User (NPU)**: First-time, sees branded splash, onboarding, trust signals, "Make your first call/top-up" CTAs
- **Active User**: Regular top-ups/calls, sees home card feed, quick actions, favorites with minutes remaining
- **Power User**: Multiple recipients, auto-recharge, plan management, transaction history

## Design Principles (from Figma audit)
- **Content-first, minimal chrome**: Screens have very little decorative UI — content fills the space
- **Bottom-anchored actions**: Primary CTAs always pinned to bottom of screen, never floating mid-page
- **Generous whitespace**: Large gaps between sections (24px+), content breathes
- **Centered system messages**: Confirmation/prompt screens center everything — avatar, heading, body, then CTAs at bottom
- **Card-based feed on home**: Home screen is a vertical feed of contextual cards, not a dashboard grid
- **Progressive disclosure**: Product pages use tabs/segments to split complexity (Bundles vs Credits)
- **Warm & Human**: Real photos in avatars and promo cards, first names used throughout
- **Speed First**: Minimal taps — contacts are directly tappable, amounts are pill-selectable
- **Trust Signals**: "Cancel anytime", Visa badge, Rebtel credits balance always visible

## Terminology
- **Top-Up / MTU**: Sending airtime/data credit to a phone number
- **Credits**: Pay-per-minute calling balance (Rebtel Credits)
- **Subscriptions**: Unlimited monthly calling plans (e.g., "India Unlimited")
- **Bundles**: Carrier-specific data/voice packages with validity period
- **Carrier**: Mobile network operator (e.g., Cubacel, Claro, MTN)
- **Destination**: The country being called or topped up
- **Recipient**: The person/number receiving the top-up
- **Auto Top-Up**: Scheduled recurring top-ups (every 7/14/21/30 days)
- **NPU**: New/first-time user
`.trim();
