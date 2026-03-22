// ProfileHeader — User profile section
// Variants: "centered" | "left-aligned" | "with-cover"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface ProfileHeaderProps extends UIComponentPropsBase {
  name?: string;
  variant?: "centered" | "left-aligned" | "with-cover";
}

export function renderProfileHeader(props: Partial<ProfileHeaderProps> = {}): string {
  const variant = props.variant ?? "centered";
  const name = props.label ?? props.name ?? "User Name";

  const coverHtml = variant === "with-cover"
    ? `<div class="ui-profile__cover"><span class="ui-profile__cover-icon">${ICONS.image}</span></div>`
    : "";

  const alignClass = variant === "left-aligned" ? " ui-profile--left" : "";

  return `
<div class="ui-profile${alignClass}" data-component="profileHeader">
  ${coverHtml}
  <div class="ui-profile__avatar">
    <span class="ui-profile__avatar-icon">${ICONS.user}</span>
  </div>
  <h2 class="ui-profile__name">${name}</h2>
  <p class="ui-profile__bio"><span class="ui-skel ui-skel--w65" style="display:inline-block"></span></p>
  <div class="ui-profile__actions">
    <button class="ui-btn ui-btn--primary" style="flex:1">Follow</button>
    <button class="ui-btn ui-btn--outline" style="flex:1">Message</button>
  </div>
</div>`;
}
