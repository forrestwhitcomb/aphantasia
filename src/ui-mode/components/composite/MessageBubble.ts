// MessageBubble — Chat message
// Variants: "sent" | "received" | "with-avatar"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface MessageBubbleProps extends UIComponentPropsBase {
  message?: string;
  variant?: "sent" | "received" | "with-avatar";
}

const PLACEHOLDER_MESSAGES = [
  "Hey, how are you doing?",
  "I'm good, thanks! Just working on a project.",
  "That sounds great! What kind of project?",
  "A mobile app wireframing tool.",
];

export function renderMessageBubble(props: Partial<MessageBubbleProps> = {}): string {
  const variant = props.variant ?? "received";
  const count = props.itemCount ?? 4;

  const messages = Array.from({ length: count }, (_, i) => {
    const isSent = variant === "sent" ? true : (i % 2 === 1);
    const msg = props.label && i === 0 ? props.label : PLACEHOLDER_MESSAGES[i % PLACEHOLDER_MESSAGES.length];
    const avatarHtml = (variant === "with-avatar" && !isSent)
      ? `<div class="ui-msg__avatar">${ICONS.user}</div>`
      : "";

    return `
    <div class="ui-msg ${isSent ? "ui-msg--sent" : "ui-msg--received"}">
      ${avatarHtml}
      <div class="ui-msg__bubble">${msg}</div>
    </div>`;
  }).join("");

  return `<div class="ui-msg-list" data-component="messageBubble">${messages}</div>`;
}
