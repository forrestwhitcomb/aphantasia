// ============================================================
// APHANTASIA — UI Component Dispatcher
// ============================================================
// Central dispatcher that routes a UIComponentType to its
// renderer. All components return pure HTML strings using
// CSS custom properties exclusively.
// ============================================================

import type { UIComponentType, UIComponentPropsBase } from "../types";
import { UI_COMPONENT_CSS } from "./styles";

// Navigation
import { renderStatusBar } from "./navigation/StatusBar";
import { renderNavBar } from "./navigation/NavBar";
import { renderTabBar } from "./navigation/TabBar";

// Content
import { renderCardGrid } from "./content/Card";
import { renderListItem } from "./content/ListItem";
import { renderListGroup } from "./content/ListGroup";
import { renderSectionHeader } from "./content/SectionHeader";

// Inputs
import { renderButton } from "./inputs/Button";
import { renderTextInput } from "./inputs/TextInput";
import { renderSearchBar } from "./inputs/SearchBar";
import { renderToggle } from "./inputs/Toggle";
import { renderCheckbox } from "./inputs/Checkbox";
import { renderSegmentedControl } from "./inputs/SegmentedControl";
import { renderSlider } from "./inputs/Slider";
import { renderStepper } from "./inputs/Stepper";

// Content (remaining)
import { renderAvatar } from "./content/Avatar";
import { renderBadge } from "./content/Badge";
import { renderTag } from "./content/Tag";
import { renderEmptyState } from "./content/EmptyState";

// Media
import { renderDivider } from "./media/Divider";
import { renderImagePlaceholder } from "./media/ImagePlaceholder";
import { renderCarousel } from "./media/Carousel";
import { renderProgressBar } from "./media/ProgressBar";

// Feedback
import { renderAlert } from "./feedback/Alert";
import { renderToast } from "./feedback/Toast";
import { renderModal } from "./feedback/Modal";
import { renderFAB } from "./feedback/FloatingActionButton";
import { renderBottomSheet } from "./navigation/BottomSheet";

// Composite
import { renderProfileHeader } from "./composite/ProfileHeader";
import { renderMessageBubble } from "./composite/MessageBubble";
import { renderFeedItem } from "./composite/FeedItem";
import { renderSettingsRow } from "./composite/SettingsRow";

/**
 * Render a UI component by type. Returns an HTML string.
 * All CSS values come from var(--*) custom properties.
 *
 * We use `as never` casts because the dispatcher narrows the type
 * via the switch case, and each renderer applies safe defaults to
 * the variant field internally. The base props interface uses
 * `string` for variant to stay generic.
 */
export function renderUIComponent(
  type: UIComponentType,
  props: Partial<UIComponentPropsBase> = {}
): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = props as any;
  switch (type) {
    // Navigation & Structure
    case "statusBar":
      return renderStatusBar(p);
    case "navBar":
      return renderNavBar(p);
    case "tabBar":
      return renderTabBar(p);

    // Content & Data Display
    case "card":
      return renderCardGrid(p);
    case "listItem":
      return renderListItem(p);
    case "listGroup":
      return renderListGroup(p);
    case "sectionHeader":
      return renderSectionHeader(p);

    // Media & Visual
    case "divider":
      return renderDivider(p);

    // Inputs & Actions
    case "button":
      return renderButton(p);
    case "textInput":
      return renderTextInput(p);
    case "searchBar":
      return renderSearchBar(p);
    case "toggle":
      return renderToggle(p);
    case "checkbox":
      return renderCheckbox(p);
    case "segmentedControl":
      return renderSegmentedControl(p);
    case "slider":
      return renderSlider(p);
    case "stepper":
      return renderStepper(p);

    // Content (remaining)
    case "avatar":
      return renderAvatar(p);
    case "badge":
      return renderBadge(p);
    case "tag":
      return renderTag(p);
    case "emptyState":
      return renderEmptyState(p);

    // Media (remaining)
    case "imagePlaceholder":
      return renderImagePlaceholder(p);
    case "carousel":
      return renderCarousel(p);
    case "progressBar":
      return renderProgressBar(p);

    // Feedback & Overlay
    case "alert":
      return renderAlert(p);
    case "toast":
      return renderToast(p);
    case "modal":
      return renderModal(p);
    case "floatingActionButton":
      return renderFAB(p);
    case "bottomSheet":
      return renderBottomSheet(p);

    // Composite
    case "profileHeader":
      return renderProfileHeader(p);
    case "messageBubble":
      return renderMessageBubble(p);
    case "feedItem":
      return renderFeedItem(p);
    case "settingsRow":
      return renderSettingsRow(p);

    default:
      return renderPlaceholder(type as string, props);
  }
}

/** Temporary placeholder for components not yet built */
function renderPlaceholder(type: string, props: Partial<UIComponentPropsBase>): string {
  const label = props.label || type;
  return `
<div style="padding:var(--spacing-md);margin:var(--spacing-sm) var(--spacing-md);background:var(--color-secondary);border-radius:var(--radius-md);border:1px dashed var(--color-border);text-align:center" data-component="${type}">
  <span style="font-size:var(--font-size-sm);color:var(--color-muted-foreground);font-family:var(--font-body-family)">${label}</span>
</div>`;
}

// Re-exports
export { UI_COMPONENT_CSS } from "./styles";
export { renderStatusBar } from "./navigation/StatusBar";
export { renderNavBar } from "./navigation/NavBar";
export { renderTabBar } from "./navigation/TabBar";
export { renderCard, renderCardGrid } from "./content/Card";
export { renderListItem } from "./content/ListItem";
export { renderListGroup } from "./content/ListGroup";
export { renderSectionHeader } from "./content/SectionHeader";
export { renderDivider } from "./media/Divider";
export { renderButton } from "./inputs/Button";
export { renderTextInput } from "./inputs/TextInput";
export { renderSearchBar } from "./inputs/SearchBar";
export { renderToggle } from "./inputs/Toggle";
export { renderCheckbox } from "./inputs/Checkbox";
export { renderSegmentedControl } from "./inputs/SegmentedControl";
export { renderSlider } from "./inputs/Slider";
export { renderStepper } from "./inputs/Stepper";
export { renderAvatar } from "./content/Avatar";
export { renderBadge } from "./content/Badge";
export { renderTag } from "./content/Tag";
export { renderEmptyState } from "./content/EmptyState";
export { renderImagePlaceholder } from "./media/ImagePlaceholder";
export { renderCarousel } from "./media/Carousel";
export { renderProgressBar } from "./media/ProgressBar";
export { renderAlert } from "./feedback/Alert";
export { renderToast } from "./feedback/Toast";
export { renderModal } from "./feedback/Modal";
export { renderFAB } from "./feedback/FloatingActionButton";
export { renderBottomSheet } from "./navigation/BottomSheet";
export { renderProfileHeader } from "./composite/ProfileHeader";
export { renderMessageBubble } from "./composite/MessageBubble";
export { renderFeedItem } from "./composite/FeedItem";
export { renderSettingsRow } from "./composite/SettingsRow";
