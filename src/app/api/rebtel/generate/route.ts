import { NextRequest } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { aiCallTracker } from "@/lib/aiCallTracker";
import { buildRebtelSystemPrompt, buildRebtelUserPrompt, type GenerationMode } from "@/rebtel/chat/prompts";
import type { RebtelFlow } from "@/rebtel/types";

// POST /api/rebtel/generate — Generate Rebtel flow from natural language
// Body: { message: string, currentFlow?: RebtelFlow }
// Returns: SSE stream — final event contains { done: true, text: string, flow: RebtelFlow }

export async function POST(req: NextRequest) {
  const { message, currentFlow, projectContext, image, activeScreenId } = (await req.json()) as {
    message: string;
    currentFlow?: RebtelFlow;
    projectContext?: string;
    image?: { base64: string; mimeType: string };
    activeScreenId?: string;
  };

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: "No message provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Detect generation mode
  let mode: GenerationMode = "generate";
  if (image) {
    mode = "image-to-flow";
  } else if (currentFlow && activeScreenId && /iterate|variation|alternative|try different|explore/i.test(message)) {
    mode = "iterate";
  } else if (currentFlow) {
    mode = "extend";
  }

  const systemMessage = buildRebtelSystemPrompt();
  const userMessage = buildRebtelUserPrompt(message, currentFlow, projectContext, mode, activeScreenId);

  // Build multimodal content when image is present
  type MessageContent = string | Array<{ type: string; source?: { type: string; media_type: string; data: string }; text?: string }>;
  const userContent: MessageContent = image
    ? [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: image.mimeType,
            data: image.base64,
          },
        },
        { type: "text", text: userMessage },
      ]
    : userMessage;

  // Use Sonnet for image analysis (faster), Opus for everything else
  const model = mode === "image-to-flow"
    ? "claude-sonnet-4-20250514"
    : "claude-opus-4-20250514";

  const client = getAnthropicClient();
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      // Send progress event immediately
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ status: "generating" })}\n\n`)
      );

      try {
        aiCallTracker.trackRender();

        const response = await client.messages.create({
          model,
          max_tokens: 8192,
          system: systemMessage,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          messages: [{ role: "user", content: userContent as any }],
        });

        // Track token usage
        aiCallTracker.addTokens({
          input: response.usage.input_tokens,
          output: response.usage.output_tokens,
        });

        // Extract text from response
        let fullText = "";
        for (const block of response.content) {
          if (block.type === "text") {
            fullText += block.text;
          }
        }

        // Send the text as a streaming chunk
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ status: "parsing", text: fullText })}\n\n`)
        );

        // Extract JSON from ```json fenced block
        const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
        if (!jsonMatch) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                error: "No JSON block found in AI response",
                text: fullText,
              })}\n\n`
            )
          );
          controller.close();
          return;
        }

        let flow: RebtelFlow;
        try {
          flow = JSON.parse(jsonMatch[1]);
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                error: "Invalid JSON in AI response",
                text: fullText,
              })}\n\n`
            )
          );
          controller.close();
          return;
        }

        // Basic validation
        if (!flow.name || !Array.isArray(flow.screens) || flow.screens.length === 0) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                error: "AI returned an invalid flow structure",
                text: fullText,
              })}\n\n`
            )
          );
          controller.close();
          return;
        }

        // Send the final result
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              done: true,
              text: fullText,
              flow,
              tokenUsage: {
                input: response.usage.input_tokens,
                output: response.usage.output_tokens,
              },
            })}\n\n`
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, error: message })}\n\n`
          )
        );
      }

      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
