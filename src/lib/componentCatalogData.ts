// ============================================================
// APHANTASIA — Component Catalog Data (no engine dependency)
// ============================================================
// Static catalog entries and types. Import this from canvas/UI
// to avoid circular dependency with engine. placeComponent lives in componentCatalog.ts.
// ============================================================

import type { SemanticTag } from "@/engine/CanvasEngine";

export const FRAME_WIDTH = 1280;

export type ComponentKind = "section" | "primitive";
export type ComponentCategory = "layout" | "content" | "commerce" | "utility" | "ui";

export interface ComponentCatalogEntry {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  kind: ComponentKind;
  semanticTag: SemanticTag;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
  iconPath: string;
  canvasType?: "rectangle" | "roundedRect";
  variant?: string;
}

export const COMPONENT_CATALOG: ComponentCatalogEntry[] = [
  { id: "nav", name: "Navigation", description: "Header bar with logo, links & CTA", category: "layout", kind: "section", semanticTag: "nav", label: "Nav", defaultWidth: FRAME_WIDTH, defaultHeight: 64, iconPath: "M3 6h18M3 12h18M3 18h18" },
  { id: "hero", name: "Hero Banner", description: "Large headline section with call to action", category: "layout", kind: "section", semanticTag: "hero", label: "Hero", defaultWidth: FRAME_WIDTH, defaultHeight: 400, iconPath: "M4 4h16v12H4zM8 20h8" },
  { id: "feature-grid", name: "Feature Grid", description: "Card grid showcasing features or benefits", category: "content", kind: "section", semanticTag: "cards", label: "Features", defaultWidth: FRAME_WIDTH, defaultHeight: 360, iconPath: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
  { id: "text-image", name: "Text + Image", description: "Two-column split with text and image", category: "content", kind: "section", semanticTag: "split", label: "Split", defaultWidth: FRAME_WIDTH, defaultHeight: 320, iconPath: "M4 4h7v16H4zM13 4h7v16h-7z" },
  { id: "cta", name: "Call to Action", description: "Prominent CTA section with dark background", category: "content", kind: "section", semanticTag: "button", label: "CTA", defaultWidth: FRAME_WIDTH, defaultHeight: 200, iconPath: "M5 12h14M12 5l7 7-7 7" },
  { id: "generic", name: "Text Section", description: "Simple text block with optional button", category: "content", kind: "section", semanticTag: "section", label: "Section", defaultWidth: FRAME_WIDTH, defaultHeight: 240, iconPath: "M4 6h16M4 10h12M4 14h14M4 18h10" },
  { id: "footer", name: "Footer", description: "Page footer with links and copyright", category: "layout", kind: "section", semanticTag: "footer", label: "Footer", defaultWidth: FRAME_WIDTH, defaultHeight: 160, iconPath: "M4 20h16M4 16h16M8 12h8" },
  { id: "portfolio", name: "Portfolio", description: "Project showcase grid with thumbnails", category: "content", kind: "section", semanticTag: "portfolio", label: "Portfolio", defaultWidth: FRAME_WIDTH, defaultHeight: 360, iconPath: "M4 4h16v10H4zM4 16h5v4H4zM11 16h5v4h-5z" },
  { id: "ecommerce", name: "Product Grid", description: "E-commerce product catalog with prices", category: "commerce", kind: "section", semanticTag: "ecommerce", label: "Shop", defaultWidth: FRAME_WIDTH, defaultHeight: 360, iconPath: "M6 2L3 8v12a1 1 0 001 1h16a1 1 0 001-1V8l-3-6H6zM3 8h18M16 12a4 4 0 01-8 0" },
  { id: "event-signup", name: "Event Signup", description: "Event details with registration form", category: "utility", kind: "section", semanticTag: "form", label: "Event", defaultWidth: FRAME_WIDTH, defaultHeight: 300, iconPath: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { id: "pricing-table", name: "Pricing Table", description: "Pricing tiers with features and CTAs", category: "commerce", kind: "section", semanticTag: "pricing", label: "Pricing", defaultWidth: FRAME_WIDTH, defaultHeight: 400, iconPath: "M4 4h5v16H4zM10 4h5v16h-5zM16 4h5v16h-5zM4 10h17" },
  { id: "testimonials", name: "Testimonials", description: "Customer quotes and social proof", category: "content", kind: "section", semanticTag: "testimonials", label: "Testimonials", defaultWidth: FRAME_WIDTH, defaultHeight: 320, iconPath: "M4 4h16v12H4zM8 20h2M14 20h2" },
  { id: "logo-cloud", name: "Logo Cloud", description: "Partner or client logos", category: "content", kind: "section", semanticTag: "logo-cloud", label: "Logos", defaultWidth: FRAME_WIDTH, defaultHeight: 120, iconPath: "M2 12h4M7 12h4M12 12h4M17 12h4" },
  { id: "stats", name: "Stats / Metrics", description: "Key numbers and trust signals", category: "content", kind: "section", semanticTag: "stats", label: "Stats", defaultWidth: FRAME_WIDTH, defaultHeight: 160, iconPath: "M4 20V10M10 20V4M16 20v-8M22 20v-4" },
  { id: "newsletter", name: "Newsletter Signup", description: "Email capture with input and CTA", category: "utility", kind: "section", semanticTag: "newsletter", label: "Newsletter", defaultWidth: FRAME_WIDTH, defaultHeight: 200, iconPath: "M4 4h16v12H4zM4 4l8 6 8-6" },
  { id: "faq", name: "FAQ / Accordion", description: "Frequently asked questions", category: "content", kind: "section", semanticTag: "faq", label: "FAQ", defaultWidth: FRAME_WIDTH, defaultHeight: 320, iconPath: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v4M12 16h.01" },
  { id: "team-grid", name: "Team Grid", description: "Team member profiles with photos", category: "content", kind: "section", semanticTag: "team", label: "Team", defaultWidth: FRAME_WIDTH, defaultHeight: 320, iconPath: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
  { id: "comparison-table", name: "Comparison Table", description: "Us vs them feature comparison", category: "commerce", kind: "section", semanticTag: "comparison", label: "Comparison", defaultWidth: FRAME_WIDTH, defaultHeight: 320, iconPath: "M3 3h18v18H3zM12 3v18M3 10h18" },
  { id: "bundui-hero", name: "Bundui Hero", description: "Animated hero with entrance motion (Bundui-style)", category: "layout", kind: "section", semanticTag: "hero", label: "Bundui Hero", defaultWidth: FRAME_WIDTH, defaultHeight: 400, iconPath: "M4 4h16v12H4zM8 20h8", variant: "bundui-entrance" },
  { id: "bundui-bento", name: "Bundui Bento Grid", description: "Bento-style card grid with staggered layout (Bundui-style)", category: "content", kind: "section", semanticTag: "cards", label: "Bundui Grid", defaultWidth: FRAME_WIDTH, defaultHeight: 360, iconPath: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h8v6H4zM14 14h6v6h-6z", variant: "bundui-bento" },
];

export const PRIMITIVE_CATALOG: ComponentCatalogEntry[] = [
  { id: "primitive-accordion", name: "Accordion", description: "Collapsible content sections", category: "ui", kind: "primitive", semanticTag: "section", label: "Accordion", defaultWidth: 400, defaultHeight: 200, iconPath: "M4 6h16M4 12h16M4 18h16M20 6l-2 3-2-3M20 12l-2 3-2-3", canvasType: "rectangle" },
  { id: "primitive-alert", name: "Alert", description: "Callout for important messages", category: "ui", kind: "primitive", semanticTag: "section", label: "Alert", defaultWidth: 400, defaultHeight: 80, iconPath: "M12 2L2 22h20L12 2zM12 10v4M12 18h.01", canvasType: "rectangle" },
  { id: "primitive-alert-dialog", name: "Alert Dialog", description: "Confirmation dialog with actions", category: "ui", kind: "primitive", semanticTag: "section", label: "Alert Dialog", defaultWidth: 360, defaultHeight: 200, iconPath: "M3 3h18v18H3zM8 12h8M8 16h4", canvasType: "rectangle" },
  { id: "primitive-aspect-ratio", name: "Aspect Ratio", description: "Fixed ratio container", category: "ui", kind: "primitive", semanticTag: "section", label: "Aspect Ratio", defaultWidth: 320, defaultHeight: 180, iconPath: "M3 3h18v12H3zM7 19h10", canvasType: "rectangle" },
  { id: "primitive-avatar", name: "Avatar", description: "User profile image or initials", category: "ui", kind: "primitive", semanticTag: "section", label: "Avatar", defaultWidth: 48, defaultHeight: 48, iconPath: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 8a3 3 0 110 6 3 3 0 010-6z", canvasType: "roundedRect" },
  { id: "primitive-badge", name: "Badge", description: "Small label or tag", category: "ui", kind: "primitive", semanticTag: "button", label: "Badge", defaultWidth: 64, defaultHeight: 24, iconPath: "M7 7h10v10H7z", canvasType: "roundedRect" },
  { id: "primitive-breadcrumb", name: "Breadcrumb", description: "Navigation path indicator", category: "ui", kind: "primitive", semanticTag: "section", label: "Breadcrumb", defaultWidth: 320, defaultHeight: 32, iconPath: "M3 12h4l3-3 3 3h8", canvasType: "rectangle" },
  { id: "primitive-button", name: "Button", description: "Clickable button with label", category: "ui", kind: "primitive", semanticTag: "button", label: "Button", defaultWidth: 120, defaultHeight: 40, iconPath: "M5 12h14M12 5l7 7-7 7", canvasType: "roundedRect" },
  { id: "primitive-button-group", name: "Button Group", description: "Row of grouped buttons", category: "ui", kind: "primitive", semanticTag: "section", label: "Button Group", defaultWidth: 300, defaultHeight: 40, iconPath: "M2 6h6v12H2zM9 6h6v12H9zM16 6h6v12h-6z", canvasType: "roundedRect" },
  { id: "primitive-calendar", name: "Calendar", description: "Date grid calendar", category: "ui", kind: "primitive", semanticTag: "section", label: "Calendar", defaultWidth: 280, defaultHeight: 300, iconPath: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z", canvasType: "rectangle" },
  { id: "primitive-card", name: "Card", description: "Content card with optional header", category: "ui", kind: "primitive", semanticTag: "section", label: "Card", defaultWidth: 280, defaultHeight: 160, iconPath: "M4 4h16v16H4z", canvasType: "rectangle" },
  { id: "primitive-carousel", name: "Carousel", description: "Sliding content display", category: "ui", kind: "primitive", semanticTag: "section", label: "Carousel", defaultWidth: 400, defaultHeight: 240, iconPath: "M2 12l4-4v8l-4-4zM22 12l-4-4v8l4-4zM6 4h12v16H6z", canvasType: "rectangle" },
  { id: "primitive-chart", name: "Chart", description: "Data visualization chart", category: "ui", kind: "primitive", semanticTag: "section", label: "Chart", defaultWidth: 400, defaultHeight: 280, iconPath: "M4 20V10M10 20V4M16 20v-8M22 20v-4", canvasType: "rectangle" },
  { id: "primitive-checkbox", name: "Checkbox", description: "Toggle checkbox with label", category: "ui", kind: "primitive", semanticTag: "section", label: "Checkbox", defaultWidth: 180, defaultHeight: 32, iconPath: "M4 4h16v16H4zM7 12l3 3 7-7", canvasType: "rectangle" },
  { id: "primitive-collapsible", name: "Collapsible", description: "Expandable content area", category: "ui", kind: "primitive", semanticTag: "section", label: "Collapsible", defaultWidth: 360, defaultHeight: 120, iconPath: "M4 6h16M4 14h16M18 6l-2 4-2-4", canvasType: "rectangle" },
  { id: "primitive-combobox", name: "Combobox", description: "Searchable dropdown select", category: "ui", kind: "primitive", semanticTag: "section", label: "Combobox", defaultWidth: 240, defaultHeight: 40, iconPath: "M3 6h18M3 12h18M8 18h8M19 9l-3 3-3-3", canvasType: "rectangle" },
  { id: "primitive-command", name: "Command", description: "Search command palette", category: "ui", kind: "primitive", semanticTag: "section", label: "Command", defaultWidth: 360, defaultHeight: 280, iconPath: "M3 3h18v18H3zM7 7h10M7 11h6M7 15h8", canvasType: "rectangle" },
  { id: "primitive-context-menu", name: "Context Menu", description: "Right-click context menu", category: "ui", kind: "primitive", semanticTag: "section", label: "Context Menu", defaultWidth: 200, defaultHeight: 160, iconPath: "M3 3h18v18H3zM7 8h10M7 12h10M7 16h6", canvasType: "rectangle" },
  { id: "primitive-data-table", name: "Data Table", description: "Sortable data table", category: "ui", kind: "primitive", semanticTag: "section", label: "Data Table", defaultWidth: 500, defaultHeight: 280, iconPath: "M3 3h18v18H3zM3 8h18M3 13h18M8 3v18M15 3v18", canvasType: "rectangle" },
  { id: "primitive-date-picker", name: "Date Picker", description: "Date selection input", category: "ui", kind: "primitive", semanticTag: "section", label: "Date Picker", defaultWidth: 240, defaultHeight: 40, iconPath: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z", canvasType: "rectangle" },
  { id: "primitive-dialog", name: "Dialog", description: "Modal dialog window", category: "ui", kind: "primitive", semanticTag: "section", label: "Dialog", defaultWidth: 360, defaultHeight: 220, iconPath: "M3 3h18v18H3zM8 8h8M8 12h6M12 18h4", canvasType: "rectangle" },
  { id: "primitive-direction", name: "Direction", description: "RTL/LTR direction context", category: "ui", kind: "primitive", semanticTag: "section", label: "Direction", defaultWidth: 160, defaultHeight: 32, iconPath: "M4 12h16M16 8l4 4-4 4", canvasType: "rectangle" },
  { id: "primitive-drawer", name: "Drawer", description: "Bottom drawer panel", category: "ui", kind: "primitive", semanticTag: "section", label: "Drawer", defaultWidth: 360, defaultHeight: 240, iconPath: "M3 12h18M3 18h18v4H3zM12 12v-8", canvasType: "rectangle" },
  { id: "primitive-dropdown-menu", name: "Dropdown Menu", description: "Dropdown action menu", category: "ui", kind: "primitive", semanticTag: "section", label: "Dropdown Menu", defaultWidth: 200, defaultHeight: 180, iconPath: "M3 6h18M3 3h18M7 10h10M7 14h10M7 18h6", canvasType: "rectangle" },
  { id: "primitive-empty", name: "Empty", description: "Empty state placeholder", category: "ui", kind: "primitive", semanticTag: "section", label: "Empty", defaultWidth: 320, defaultHeight: 160, iconPath: "M12 8a4 4 0 100 8 4 4 0 000-8zM4 20h16", canvasType: "rectangle" },
  { id: "primitive-field", name: "Field", description: "Form field with label and description", category: "ui", kind: "primitive", semanticTag: "section", label: "Field", defaultWidth: 280, defaultHeight: 80, iconPath: "M4 4h8M4 10h16v4H4zM4 18h12", canvasType: "rectangle" },
  { id: "primitive-hover-card", name: "Hover Card", description: "Card revealed on hover", category: "ui", kind: "primitive", semanticTag: "section", label: "Hover Card", defaultWidth: 300, defaultHeight: 160, iconPath: "M4 4h16v12H4zM8 20h8", canvasType: "rectangle" },
  { id: "primitive-input", name: "Input", description: "Text input field", category: "ui", kind: "primitive", semanticTag: "section", label: "Input", defaultWidth: 200, defaultHeight: 40, iconPath: "M4 6h16M4 12h16M4 18h10", canvasType: "rectangle" },
  { id: "primitive-input-group", name: "Input Group", description: "Input with prefix/suffix addons", category: "ui", kind: "primitive", semanticTag: "section", label: "Input Group", defaultWidth: 280, defaultHeight: 40, iconPath: "M2 6h4v12H2zM6 6h12v12H6zM18 6h4v12h-4z", canvasType: "rectangle" },
  { id: "primitive-input-otp", name: "Input OTP", description: "One-time password input", category: "ui", kind: "primitive", semanticTag: "section", label: "Input OTP", defaultWidth: 240, defaultHeight: 48, iconPath: "M2 6h4v12H2zM7 6h4v12H7zM12 6h4v12h-4zM17 6h4v12h-4z", canvasType: "rectangle" },
  { id: "primitive-item", name: "Item", description: "Styled list item", category: "ui", kind: "primitive", semanticTag: "section", label: "Item", defaultWidth: 320, defaultHeight: 56, iconPath: "M4 8h16M4 16h12", canvasType: "rectangle" },
  { id: "primitive-kbd", name: "Kbd", description: "Keyboard shortcut display", category: "ui", kind: "primitive", semanticTag: "section", label: "Kbd", defaultWidth: 80, defaultHeight: 28, iconPath: "M4 4h16v16H4zM8 12h2M14 12h2", canvasType: "roundedRect" },
  { id: "primitive-label", name: "Label", description: "Form label text", category: "ui", kind: "primitive", semanticTag: "section", label: "Label", defaultWidth: 120, defaultHeight: 24, iconPath: "M4 12h16", canvasType: "rectangle" },
  { id: "primitive-menubar", name: "Menubar", description: "Horizontal menu bar", category: "ui", kind: "primitive", semanticTag: "section", label: "Menubar", defaultWidth: 400, defaultHeight: 40, iconPath: "M3 6h18v12H3zM7 12h2M12 12h2M17 12h2", canvasType: "rectangle" },
  { id: "primitive-native-select", name: "Native Select", description: "System native select dropdown", category: "ui", kind: "primitive", semanticTag: "section", label: "Native Select", defaultWidth: 200, defaultHeight: 40, iconPath: "M4 6h16v12H4zM16 10l-4 4-4-4", canvasType: "rectangle" },
  { id: "primitive-navigation-menu", name: "Navigation Menu", description: "Top navigation with dropdowns", category: "ui", kind: "primitive", semanticTag: "nav", label: "Nav Menu", defaultWidth: 500, defaultHeight: 48, iconPath: "M3 6h18M8 12h8M3 18h18", canvasType: "rectangle" },
  { id: "primitive-pagination", name: "Pagination", description: "Page navigation controls", category: "ui", kind: "primitive", semanticTag: "section", label: "Pagination", defaultWidth: 360, defaultHeight: 40, iconPath: "M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4", canvasType: "rectangle" },
  { id: "primitive-popover", name: "Popover", description: "Floating content popover", category: "ui", kind: "primitive", semanticTag: "section", label: "Popover", defaultWidth: 280, defaultHeight: 140, iconPath: "M4 4h16v12H4zM12 16v4", canvasType: "rectangle" },
  { id: "primitive-progress", name: "Progress", description: "Progress bar indicator", category: "ui", kind: "primitive", semanticTag: "section", label: "Progress", defaultWidth: 280, defaultHeight: 24, iconPath: "M4 12h16M4 12h10", canvasType: "roundedRect" },
  { id: "primitive-radio-group", name: "Radio Group", description: "Radio button options", category: "ui", kind: "primitive", semanticTag: "section", label: "Radio Group", defaultWidth: 200, defaultHeight: 120, iconPath: "M12 4a4 4 0 100 8 4 4 0 000-8zM12 16a4 4 0 100 8 4 4 0 000-8z", canvasType: "rectangle" },
  { id: "primitive-resizable", name: "Resizable", description: "Resizable panels", category: "ui", kind: "primitive", semanticTag: "section", label: "Resizable", defaultWidth: 400, defaultHeight: 200, iconPath: "M3 3h7v18H3zM14 3h7v18h-7zM12 9v6", canvasType: "rectangle" },
  { id: "primitive-scroll-area", name: "Scroll Area", description: "Custom scrollable container", category: "ui", kind: "primitive", semanticTag: "section", label: "Scroll Area", defaultWidth: 280, defaultHeight: 200, iconPath: "M3 3h18v18H3zM21 8v8", canvasType: "rectangle" },
  { id: "primitive-select", name: "Select", description: "Custom select dropdown", category: "ui", kind: "primitive", semanticTag: "section", label: "Select", defaultWidth: 200, defaultHeight: 40, iconPath: "M4 6h16v12H4zM16 10l-4 4-4-4", canvasType: "rectangle" },
  { id: "primitive-separator", name: "Separator", description: "Visual divider line", category: "ui", kind: "primitive", semanticTag: "section", label: "Separator", defaultWidth: FRAME_WIDTH, defaultHeight: 16, iconPath: "M4 12h16", canvasType: "rectangle" },
  { id: "primitive-sheet", name: "Sheet", description: "Side sheet panel", category: "ui", kind: "primitive", semanticTag: "section", label: "Sheet", defaultWidth: 340, defaultHeight: 280, iconPath: "M14 3h7v18h-7zM3 8h10M3 12h10M3 16h7", canvasType: "rectangle" },
  { id: "primitive-sidebar", name: "Sidebar", description: "Vertical navigation sidebar", category: "ui", kind: "primitive", semanticTag: "section", label: "Sidebar", defaultWidth: 260, defaultHeight: 400, iconPath: "M3 3h7v18H3zM14 7h7M14 11h7M14 15h5", canvasType: "rectangle" },
  { id: "primitive-skeleton", name: "Skeleton", description: "Loading content placeholder", category: "ui", kind: "primitive", semanticTag: "section", label: "Skeleton", defaultWidth: 280, defaultHeight: 100, iconPath: "M4 6h16M4 12h12M4 18h8", canvasType: "rectangle" },
  { id: "primitive-slider", name: "Slider", description: "Range slider control", category: "ui", kind: "primitive", semanticTag: "section", label: "Slider", defaultWidth: 240, defaultHeight: 32, iconPath: "M4 12h16M12 8v8", canvasType: "rectangle" },
  { id: "primitive-sonner", name: "Sonner", description: "Toast notification (Sonner)", category: "ui", kind: "primitive", semanticTag: "section", label: "Sonner", defaultWidth: 340, defaultHeight: 64, iconPath: "M4 4h16v8H4zM8 16h8", canvasType: "roundedRect" },
  { id: "primitive-spinner", name: "Spinner", description: "Loading spinner animation", category: "ui", kind: "primitive", semanticTag: "section", label: "Spinner", defaultWidth: 40, defaultHeight: 40, iconPath: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6a6 6 0 016 6", canvasType: "roundedRect" },
  { id: "primitive-switch", name: "Switch", description: "Toggle switch control", category: "ui", kind: "primitive", semanticTag: "section", label: "Switch", defaultWidth: 180, defaultHeight: 32, iconPath: "M4 12h16M17 8a4 4 0 100 8", canvasType: "roundedRect" },
  { id: "primitive-table", name: "Table", description: "Data table display", category: "ui", kind: "primitive", semanticTag: "section", label: "Table", defaultWidth: 480, defaultHeight: 240, iconPath: "M3 3h18v18H3zM3 8h18M3 13h18M9 3v18M15 3v18", canvasType: "rectangle" },
  { id: "primitive-tabs", name: "Tabs", description: "Tabbed content switcher", category: "ui", kind: "primitive", semanticTag: "section", label: "Tabs", defaultWidth: 400, defaultHeight: 200, iconPath: "M3 8h6v-4h6v4h6M3 8h18v14H3z", canvasType: "rectangle" },
  { id: "primitive-textarea", name: "Textarea", description: "Multi-line text input", category: "ui", kind: "primitive", semanticTag: "section", label: "Textarea", defaultWidth: 280, defaultHeight: 100, iconPath: "M4 4h16v16H4zM8 8h8M8 12h6", canvasType: "rectangle" },
  { id: "primitive-toast", name: "Toast", description: "Notification toast message", category: "ui", kind: "primitive", semanticTag: "section", label: "Toast", defaultWidth: 340, defaultHeight: 64, iconPath: "M4 4h16v8H4zM8 16h8", canvasType: "roundedRect" },
  { id: "primitive-toggle", name: "Toggle", description: "Toggle button", category: "ui", kind: "primitive", semanticTag: "button", label: "Toggle", defaultWidth: 80, defaultHeight: 36, iconPath: "M4 4h16v16H4z", canvasType: "roundedRect" },
  { id: "primitive-toggle-group", name: "Toggle Group", description: "Group of toggle buttons", category: "ui", kind: "primitive", semanticTag: "section", label: "Toggle Group", defaultWidth: 220, defaultHeight: 36, iconPath: "M2 4h6v16H2zM9 4h6v16H9zM16 4h6v16h-6z", canvasType: "roundedRect" },
  { id: "primitive-tooltip", name: "Tooltip", description: "Hover tooltip text", category: "ui", kind: "primitive", semanticTag: "section", label: "Tooltip", defaultWidth: 180, defaultHeight: 60, iconPath: "M4 4h16v8H4zM12 12v4", canvasType: "roundedRect" },
  { id: "primitive-typography", name: "Typography", description: "Styled text block", category: "ui", kind: "primitive", semanticTag: "section", label: "Typography", defaultWidth: 320, defaultHeight: 48, iconPath: "M4 6h16M8 6v14M16 6v14", canvasType: "rectangle" },
];

export const ALL_CATALOG_ENTRIES: ComponentCatalogEntry[] = [...COMPONENT_CATALOG, ...PRIMITIVE_CATALOG];
export const PRIMITIVE_IDS = new Set(PRIMITIVE_CATALOG.map((e) => e.id));

export const CATEGORIES: { id: ComponentCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "layout", label: "Layout" },
  { id: "content", label: "Content" },
  { id: "commerce", label: "Commerce" },
  { id: "utility", label: "Utility" },
  { id: "ui", label: "Components" },
];
