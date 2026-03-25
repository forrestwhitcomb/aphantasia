// ============================================================
// APHANTASIA for REBTEL — Domain Context
// ============================================================
// Structured Rebtel product knowledge for AI prompt context.
// ============================================================

export const REBTEL_DOMAIN_CONTEXT = `
# Rebtel Product Context

## What Rebtel Is
Rebtel is a mobile-first fintech app serving 2M+ users in migrant communities worldwide.
Two core products: International Calling (190+ countries) and Mobile Top-Up (150+ countries).
Users send airtime/data to family abroad and make affordable international calls.

## Core Products

### Mobile Top-Up
- Send airtime or data bundles to phones in 150+ countries
- Major carriers: Cubacel (Cuba), Claro (Latin America), MTN (Africa), Airtel, Digicel, Globe
- Instant delivery with confirmation receipt
- Auto-recharge scheduling (weekly/monthly)
- Promo bundles with bonus credit

### International Calling
- Low-cost calls to 190+ countries
- Plans (unlimited monthly) and Credits (pay-per-minute)
- WiFi and cellular calling
- Call quality indicator
- Contact favorites and recents

## Key User Flows
1. **Top-Up Flow**: Select Recipient -> Choose Country/Carrier -> Pick Amount -> Payment -> Confirmation
2. **Calling Flow**: Dial/Select Contact -> Call Screen -> Call Status -> Call Summary
3. **Onboarding**: Welcome -> Phone Verification -> Profile Setup -> Get Started
4. **Auto-Recharge**: Select Contact -> Set Amount -> Choose Frequency -> Payment Method -> Confirm
5. **Account & Settings**: Profile -> Payment Methods -> Transaction History -> Preferences -> Support

## User Types
- **New User**: First-time, needs onboarding, trust signals, clear value props
- **Active User**: Regular top-ups/calls, needs speed, quick actions, favorites
- **Power User**: Multiple recipients, auto-recharge, plan management, transaction history

## Design Principles
- **Warm & Human**: Friendly tone, real photos, cultural sensitivity
- **Speed First**: Minimal taps to complete a top-up or call
- **Trust Signals**: Security badges, delivery confirmations, transaction receipts
- **Localized**: Multi-language, local carrier logos, country flags
- **Accessible**: High contrast, large touch targets, clear hierarchy

## Terminology
- **Top-Up**: Sending airtime/data credit to a phone number
- **Credits**: Pay-per-minute calling balance
- **Plans**: Unlimited monthly calling subscriptions
- **Bundles**: Carrier-specific data/voice packages
- **Carrier**: Mobile network operator (e.g., Cubacel, Claro)
- **Destination**: The country being called or topped up
- **Recipient**: The person/number receiving the top-up
- **Auto-Recharge**: Scheduled recurring top-ups
`.trim();
