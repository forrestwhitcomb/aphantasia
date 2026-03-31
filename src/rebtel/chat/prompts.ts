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

export type GenerationMode = "generate" | "extend" | "iterate" | "image-to-flow";

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
 * Build the user message with mode-specific instructions.
 */
export function buildRebtelUserPrompt(
  message: string,
  currentFlow?: RebtelFlow,
  projectContext?: string,
  mode?: GenerationMode,
  activeScreenId?: string,
  imageDescription?: string
): string {
  const parts: string[] = [];

  if (projectContext) {
    parts.push(`## Project Brief (uploaded by user)\n\n${projectContext}`);
  }

  if (imageDescription) {
    parts.push(`## Uploaded Image Analysis\n\n${imageDescription}`);
  }

  if (currentFlow) {
    parts.push(`## Current flow context\n\`\`\`json\n${JSON.stringify(currentFlow, null, 2)}\n\`\`\``);

    if (activeScreenId) {
      parts.push(`The user is currently viewing screen: "${activeScreenId}"`);
    }
  }

  parts.push(`## User request\n${message}`);

  // Mode-specific instructions
  switch (mode) {
    case "extend":
      parts.push(
        "EXTEND the existing flow by ADDING new screens. Keep all existing screens " +
        "and their screenIds unchanged. Append new screens with new unique screenIds. " +
        "Return the COMPLETE flow including both existing and new screens." +
        (activeScreenId
          ? ` The user is currently on screen "${activeScreenId}". If they ask to "add a screen after this", ` +
            "insert the new screen(s) after the active screen in the flow order."
          : "")
      );
      break;

    case "iterate": {
      const activeScreen = currentFlow?.screens.find(s => s.screenId === activeScreenId);
      if (activeScreen) {
        parts.push(`## Screen to iterate on\n\`\`\`json\n${JSON.stringify(activeScreen, null, 2)}\n\`\`\``);
      }
      parts.push(
        "Generate 3 ALTERNATIVE VERSIONS of the currently active screen. " +
        "Each variation should have the same functional purpose but differ in: " +
        "layout structure, content density, component choices, or information hierarchy. " +
        "Return a flow with 3 screens, each a distinct variation. " +
        "Name them: 'Variation A — [description]', 'Variation B — [description]', 'Variation C — [description]'."
      );
      break;
    }

    case "image-to-flow":
      parts.push(
        "Based on the uploaded image analysis above, recreate the UI as a Rebtel screen flow " +
        "using Rebtel components. Map the visual elements to the closest Rebtel component types. " +
        "Adapt colors, layout, and content to match Rebtel's design system. " +
        "For napkin sketches: interpret the intent, don't translate literally. " +
        "For competitor screenshots: map to Rebtel equivalents, use Rebtel terminology and patterns."
      );
      break;

    default: // "generate"
      if (currentFlow) {
        parts.push("Update or extend the flow based on the user's request. Return the complete updated flow as JSON.");
      }
      break;
  }

  return parts.join("\n\n");
}
