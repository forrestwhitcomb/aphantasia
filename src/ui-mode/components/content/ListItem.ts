// ListItem — Single list row
// Variants: "simple" | "subtitle" | "icon-left" | "chevron" | "toggle" | "destructive"

import type { UIComponentPropsBase } from "../../types";
import { ICONS } from "../icons";

export interface ListItemProps extends UIComponentPropsBase {
  title?: string;
  subtitle?: string;
  value?: string;
  variant?: "simple" | "subtitle" | "icon-left" | "chevron" | "toggle" | "destructive";
  showDivider?: boolean;
  toggleOn?: boolean;
}

const LIST_PLACEHOLDERS = [
  { title: "Account Settings", subtitle: "Manage your profile" },
  { title: "Notifications", subtitle: "Stay up to date" },
  { title: "Privacy & Security", subtitle: "Control your data" },
  { title: "Appearance", subtitle: "Customize the look" },
  { title: "Help Center", subtitle: "Get support" },
  { title: "About", subtitle: "Version info" },
  { title: "Language", subtitle: "English" },
  { title: "Storage", subtitle: "Manage space" },
];

export function renderListItem(props: Partial<ListItemProps> = {}, index = 0): string {
  const variant = props.variant ?? "chevron";
  const placeholder = LIST_PLACEHOLDERS[index % LIST_PLACEHOLDERS.length];
  const title = props.title ?? props.label ?? placeholder.title;
  const subtitle = props.subtitle ?? placeholder.subtitle;
  const destructiveClass = variant === "destructive" ? " ui-list-item--destructive" : "";

  // Icon (for icon-left and chevron variants)
  const showIcon = variant === "icon-left" || variant === "chevron" || variant === "subtitle";
  const iconHtml = showIcon
    ? `<div class="ui-list-item__icon"><div style="width:60%;height:60%;border-radius:var(--radius-sm);background:var(--color-primary);opacity:0.6"></div></div>`
    : "";

  // Subtitle
  const showSubtitle = variant === "subtitle" || variant === "icon-left" || variant === "chevron";
  const subtitleHtml = showSubtitle ? `<div class="ui-list-item__subtitle">${subtitle}</div>` : "";

  // Trailing element
  let trailingHtml = "";
  if (variant === "chevron" || variant === "subtitle" || variant === "icon-left") {
    trailingHtml = `<div class="ui-list-item__trailing">${ICONS.chevron}</div>`;
  } else if (variant === "toggle") {
    const on = props.toggleOn ?? (index % 2 === 0);
    trailingHtml = `<div class="ui-list-item__trailing"><div class="ui-toggle ${on ? "ui-toggle--on" : ""}"><div class="ui-toggle__thumb"></div></div></div>`;
  } else if (variant === "destructive") {
    trailingHtml = "";
  }

  // Divider
  const dividerHtml = props.showDivider !== false ? `<div class="ui-list-divider"></div>` : "";

  return `
<div class="ui-list-item${destructiveClass}" data-component="listItem">
  ${iconHtml}
  <div class="ui-list-item__content">
    <div class="ui-list-item__title">${title}</div>
    ${subtitleHtml}
  </div>
  ${trailingHtml}
</div>${props.showDivider !== false ? dividerHtml : ""}`;
}

export { LIST_PLACEHOLDERS };
