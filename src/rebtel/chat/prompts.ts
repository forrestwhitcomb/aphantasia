// ============================================================
// APHANTASIA for REBTEL — Prompt Builders
// ============================================================
// Assembles system + user prompts for Rebtel flow generation.
// ============================================================

import { REBTEL_DOMAIN_CONTEXT } from "../context/domainContext";
import { REBTEL_COMPONENT_SCHEMA } from "../context/componentSchema";
import { REBTEL_SAMPLE_FLOWS } from "../context/sampleFlows";
import type { RebtelFlow } from "../types";

/**
 * Build the full system prompt for Rebtel flow generation.
 * Includes: role, domain context, component schema, output format, and 2 few-shot examples.
 */
export function buildRebtelSystemPrompt(): string {
  // Pick 2 examples for few-shot
  const example1 = REBTEL_SAMPLE_FLOWS[0]; // top-up flow
  const example2 = REBTEL_SAMPLE_FLOWS[2]; // home screen

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
  title: string;         // Screen title
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

# Rules
1. Maximum 6 screens per flow.
2. Every screen MUST have an "appBar" as the first component (variant "home" for main screens, "back" for flow steps, "close" for modals).
3. Main screens (home, account, etc.) should have "rebtelTabBar" as the last component.
4. Flow screens (top-up steps, onboarding, etc.) should NOT have a rebtelTabBar.
5. Components stack vertically in the order listed.
6. Use realistic labels and content that match Rebtel's domain (real country names, carrier names, amounts in USD).
7. Use navigateTo to link between screens within the flow.
8. Keep screenId values kebab-case and unique within the flow.
9. Only use component types listed in the reference above. Do not invent new types.
10. For flows with steps, include a flowStepper component after the appBar.

# Examples

## Example 1
User: "${example1.prompt}"

\`\`\`json
${JSON.stringify(example1.flow, null, 2)}
\`\`\`

## Example 2
User: "${example2.prompt}"

\`\`\`json
${JSON.stringify(example2.flow, null, 2)}
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
