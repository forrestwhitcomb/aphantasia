// ============================================================
// APHANTASIA for REBTEL — Prompt Builders
// ============================================================
// Assembles system + user prompts for Rebtel flow generation.
// Updated with Figma FLOWS audit findings (March 2026).
// ============================================================

import { REBTEL_DOMAIN_CONTEXT } from "../context/domainContext";
import { REBTEL_COMPONENT_SCHEMA } from "../context/componentSchema";
import { REBTEL_SAMPLE_FLOWS } from "../context/sampleFlows";
import type { RebtelFlow } from "../types";

/**
 * Build the full system prompt for Rebtel flow generation.
 * Includes: role, domain context, component schema, output format,
 * strict design rules from Figma audit, and 2 few-shot examples.
 */
export function buildRebtelSystemPrompt(): string {
  // Pick 3 examples for few-shot — MTU flow, onboarding, home
  const example1 = REBTEL_SAMPLE_FLOWS[0]; // MTU top-up flow
  const example2 = REBTEL_SAMPLE_FLOWS[1]; // onboarding flow
  const example3 = REBTEL_SAMPLE_FLOWS[2]; // active user home

  return `You are a senior mobile UX designer specializing in the Rebtel app.
Your job is to generate structured screen flows in JSON format based on user requests.
You deeply understand Rebtel's product, user base, and design patterns.

${REBTEL_DOMAIN_CONTEXT}

${REBTEL_COMPONENT_SCHEMA}

# Output Format

Return a JSON object wrapped in a \`\`\`json fenced code block. The JSON must follow this schema:

\`\`\`typescript
interface RebtelFlow {
  name: string;          // Human-readable flow name
  screens: RebtelScreen[];  // 1-6 screens
}

interface RebtelScreen {
  screenId: string;      // kebab-case unique ID
  title: string;         // Screen title (shown in appBar)
  components: RebtelScreenComponent[];
}

interface RebtelScreenComponent {
  type: string;          // Must be a valid component type from the reference above
  label?: string;        // Display text
  variant?: string;      // Component variant
  props?: Record<string, unknown>;  // Additional properties
  navigateTo?: string;   // screenId to navigate to on tap
}
\`\`\`

# DESIGN RULES — MANDATORY (from Figma audit of real product)

## Screen Layout Rules
1. Maximum 6 screens per flow.
2. Flow screens (top-up steps, onboarding steps, checkout) use appBar variant "back" with centered title. NO tabBar.
3. Main screens (home, services) do NOT use appBar — they start with a searchBar. They MUST end with rebtelTabBar.
4. System message screens (auto top-up prompts, confirmations) are centered: avatar/image at top → big heading (heroText) → body text → bottom-pinned CTA buttons.
5. Success screens have NO appBar — just status bar, animation area, centered text, then promo card and "Close" text link.

## Component Composition Rules
6. Components stack vertically in the order listed.
7. Primary CTA buttons sit at the BOTTOM of screens, not mid-page. In flow screens, the main button should be the last component (or second-to-last if there's a secondary button below it).
8. Use button variant "primary-dark" (black) for "Continue", "Pay", "Call again" actions. Use "primary" (red) for subscription "Activate" and product "Buy now" actions. Use "secondary" (grey) for "No" / "Cancel" / back-out options.
9. Use "text-link" variant for "Close", "Resend", "Cancel anytime" — these are text-only links, not buttons.
10. NEVER use flowStepper. The real product does not use step indicators. Navigation is implicit through screen flow.

## Content Rules
11. Use realistic Rebtel content: real country names (Nigeria, India, Cuba, Philippines, Mexico), real carrier names, amounts in USD ($5, $10, $25), local currencies (NGN, CUP, INR).
12. Contact names should feel real and diverse: "Leslie Alexander", "Jane Cooper", "Jerome Bell", "Emil Lee Ann Bergst..."
13. Country pricing screens should show BOTH a subscription card AND a credits card, separated by an "Or" divider — this is the core Rebtel pattern.
14. Home feed is a list of contactCards (calling/topup variants) — NOT generic cards or widgets.

## Navigation Rules
15. Use navigateTo to link between screens within the flow.
16. Keep screenId values kebab-case and unique within the flow.
17. Only use component types listed in the reference above. Do not invent new types.

# Examples

## Example 1 — Mobile Top-Up Flow
User: "${example1.prompt}"

\`\`\`json
${JSON.stringify(example1.flow, null, 2)}
\`\`\`

## Example 2 — Onboarding Flow
User: "${example2.prompt}"

\`\`\`json
${JSON.stringify(example2.flow, null, 2)}
\`\`\`

## Example 3 — Home Screen
User: "${example3.prompt}"

\`\`\`json
${JSON.stringify(example3.flow, null, 2)}
\`\`\`

Now respond to the user's request with a valid JSON flow.`;
}

/**
 * Build the user message, optionally including the current flow context.
 */
export function buildRebtelUserPrompt(
  message: string,
  currentFlow?: RebtelFlow,
  projectContext?: string
): string {
  const parts: string[] = [];

  if (projectContext) {
    parts.push(`## Project Brief (uploaded by user)\n\n${projectContext}`);
  }

  if (currentFlow) {
    parts.push(`## Current flow context\n\`\`\`json\n${JSON.stringify(currentFlow, null, 2)}\n\`\`\``);
  }

  parts.push(`## User request\n${message}`);

  if (currentFlow) {
    parts.push("Update or extend the flow based on the user's request. Return the complete updated flow as JSON.");
  }

  return parts.join("\n\n");
}
