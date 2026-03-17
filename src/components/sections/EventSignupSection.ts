import type { EventSignupProps } from "@/types/render";
import { esc } from "./utils";

export function renderEventSignup(props: EventSignupProps, sectionId?: string): string {
  const name = props.eventName || "Upcoming Event";
  const date = props.date || "TBA";
  const location = props.location || "Online";
  const description =
    props.description ||
    "Join us for an event you won't want to miss. Register now to secure your spot.";
  const cta = props.cta || "Register now";
  const idAttr = sectionId ? ` id="${esc(sectionId)}"` : "";

  return `<section class="aph-event aph-reveal"${idAttr}>
  <div class="aph-inner aph-event-inner">
    <div class="aph-event-info">
      <div class="aph-event-meta aph-reveal aph-reveal-delay-1">
        <span class="aph-badge">${esc(date)}</span>
        <span class="aph-badge aph-badge-outline">${esc(location)}</span>
      </div>
      <h2 class="aph-event-title">${esc(name)}</h2>
      <p class="aph-event-desc">${esc(description)}</p>
    </div>
    <form class="aph-event-form aph-reveal aph-reveal-delay-2" onsubmit="return false">
      <h3 class="aph-event-form-heading">Reserve your spot</h3>
      <input type="text" placeholder="Your name" class="aph-input" />
      <input type="email" placeholder="Email address" class="aph-input" />
      <button type="submit" class="aph-btn-accent aph-btn-full">${esc(cta)}</button>
    </form>
  </div>
</section>`;
}
