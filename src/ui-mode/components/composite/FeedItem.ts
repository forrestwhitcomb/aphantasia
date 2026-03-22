// FeedItem — Social/news feed entry
// Variants: "social" | "news" | "minimal"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface FeedItemProps extends UIComponentPropsBase {
  variant?: "social" | "news" | "minimal";
}

export function renderFeedItem(props: Partial<FeedItemProps> = {}): string {
  const variant = props.variant ?? "social";
  const title = props.label ?? "Feed Post Title";

  if (variant === "news") {
    return `
<div class="ui-feed ui-feed--news" data-component="feedItem">
  <div class="ui-feed__image"><span class="ui-feed__image-icon">${ICONS.image}</span></div>
  <div class="ui-feed__body">
    <span class="ui-feed__category">Technology</span>
    <h4 class="ui-feed__title">${title}</h4>
    <span class="ui-feed__meta">5 min read</span>
  </div>
</div>`;
  }

  if (variant === "minimal") {
    return `
<div class="ui-feed ui-feed--minimal" data-component="feedItem">
  <h4 class="ui-feed__title">${title}</h4>
  <p class="ui-feed__excerpt"><span class="ui-skel ui-skel--w90"></span></p>
  <span class="ui-feed__meta">2h ago</span>
</div>`;
  }

  // social
  return `
<div class="ui-feed" data-component="feedItem">
  <div class="ui-feed__header">
    <div class="ui-avatar ui-avatar--circle" style="width:var(--spacing-xl);height:var(--spacing-xl)"><span style="color:var(--color-muted-foreground)">${ICONS.user}</span></div>
    <div class="ui-feed__user">
      <span class="ui-feed__username">username</span>
      <span class="ui-feed__time">2h ago</span>
    </div>
    <span class="ui-feed__more">${ICONS.more}</span>
  </div>
  <div class="ui-feed__image ui-feed__image--full"><span class="ui-feed__image-icon">${ICONS.image}</span></div>
  <div class="ui-feed__actions">
    <span>${ICONS.heart}</span>
    <span>${ICONS.chat}</span>
  </div>
  <p class="ui-feed__caption"><strong>username</strong> ${title}</p>
</div>`;
}
