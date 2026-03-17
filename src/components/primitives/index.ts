// ============================================================
// APHANTASIA — Primitive (shadcn-style) component renderers
// ============================================================
// Full set of shadcn/ui primitives. Each returns static HTML
// that visually represents the component in the preview pane.
// Uses theme CSS variables from WebRenderer BASE_CSS.
// ============================================================

import type {
  ButtonPrimitiveProps,
  CardPrimitiveProps,
  BadgePrimitiveProps,
  InputPrimitiveProps,
  SeparatorPrimitiveProps,
  AccordionPrimitiveProps,
  AlertPrimitiveProps,
  AlertDialogPrimitiveProps,
  AspectRatioPrimitiveProps,
  AvatarPrimitiveProps,
  BreadcrumbPrimitiveProps,
  ButtonGroupPrimitiveProps,
  CalendarPrimitiveProps,
  CarouselPrimitiveProps,
  ChartPrimitiveProps,
  CheckboxPrimitiveProps,
  CollapsiblePrimitiveProps,
  ComboboxPrimitiveProps,
  CommandPrimitiveProps,
  ContextMenuPrimitiveProps,
  DataTablePrimitiveProps,
  DatePickerPrimitiveProps,
  DialogPrimitiveProps,
  DirectionPrimitiveProps,
  DrawerPrimitiveProps,
  DropdownMenuPrimitiveProps,
  EmptyStatePrimitiveProps,
  FieldPrimitiveProps,
  HoverCardPrimitiveProps,
  InputGroupPrimitiveProps,
  InputOTPPrimitiveProps,
  ItemPrimitiveProps,
  KbdPrimitiveProps,
  LabelPrimitiveProps,
  MenubarPrimitiveProps,
  NativeSelectPrimitiveProps,
  NavigationMenuPrimitiveProps,
  PaginationPrimitiveProps,
  PopoverPrimitiveProps,
  ProgressPrimitiveProps,
  RadioGroupPrimitiveProps,
  ResizablePrimitiveProps,
  ScrollAreaPrimitiveProps,
  SelectPrimitiveProps,
  SheetPrimitiveProps,
  SidebarPrimitiveProps,
  SkeletonPrimitiveProps,
  SliderPrimitiveProps,
  SonnerPrimitiveProps,
  SpinnerPrimitiveProps,
  SwitchPrimitiveProps,
  TablePrimitiveProps,
  TabsPrimitiveProps,
  TextareaPrimitiveProps,
  ToastPrimitiveProps,
  TogglePrimitiveProps,
  ToggleGroupPrimitiveProps,
  TooltipPrimitiveProps,
  TypographyPrimitiveProps,
  PrimitiveContent,
} from "@/types/render";
import { esc } from "@/components/sections/utils";

const W = (inner: string) => `<div class="aph-primitive-wrap">${inner}</div>`;

// ---------------------------------------------------------------------------
// Original five primitives
// ---------------------------------------------------------------------------

export function renderPrimitiveButton(p: ButtonPrimitiveProps): string {
  const label = p.label || "Button";
  const cls = p.variant === "outline" || p.variant === "ghost" ? "aph-btn-ghost" : "aph-btn-accent";
  return W(`<button type="button" class="${cls}">${esc(label)}</button>`);
}

export function renderPrimitiveCard(p: CardPrimitiveProps): string {
  const title = p.title || "Card";
  const body = p.body || "";
  return W(`<div class="aph-feature-card"><div class="aph-feature-heading">${esc(title)}</div>${body ? `<div class="aph-feature-body">${esc(body)}</div>` : ""}</div>`);
}

export function renderPrimitiveBadge(p: BadgePrimitiveProps): string {
  return W(`<span class="aph-badge">${esc(p.text || "Badge")}</span>`);
}

export function renderPrimitiveInput(p: InputPrimitiveProps): string {
  return W(`<input type="text" class="aph-input" placeholder="${esc(p.placeholder || "Placeholder...")}" />`);
}

export function renderPrimitiveSeparator(_p: SeparatorPrimitiveProps): string {
  return W(`<div class="aph-separator-h"></div>`);
}

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

export function renderPrimitiveAccordion(p: AccordionPrimitiveProps): string {
  const items = p.items?.length ? p.items : [
    { trigger: "Is it accessible?", content: "Yes. It adheres to the WAI-ARIA design pattern." },
    { trigger: "Is it styled?", content: "Yes. It comes with default styles that match your theme." },
    { trigger: "Is it animated?", content: "Yes. It's animated by default, but you can disable it." },
  ];
  const rows = items.map((it, i) => `<div class="aph-accordion-item${i === 0 ? " aph-accordion-open" : ""}">
  <div class="aph-accordion-trigger">${esc(it.trigger)}<span class="aph-accordion-chevron">${i === 0 ? "−" : "+"}</span></div>
  ${i === 0 ? `<div class="aph-accordion-content">${esc(it.content)}</div>` : ""}
</div>`).join("");
  return W(`<div class="aph-accordion">${rows}</div>`);
}

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------

export function renderPrimitiveAlert(p: AlertPrimitiveProps): string {
  const variant = p.variant || "default";
  const cls = variant === "destructive" ? " aph-alert-destructive" : "";
  return W(`<div class="aph-alert${cls}">
  <div class="aph-alert-icon">${variant === "destructive" ? "⚠" : "ℹ"}</div>
  <div><div class="aph-alert-title">${esc(p.title || "Heads up!")}</div>
  <div class="aph-alert-desc">${esc(p.description || "You can add components to your app using the CLI.")}</div></div>
</div>`);
}

// ---------------------------------------------------------------------------
// Alert Dialog
// ---------------------------------------------------------------------------

export function renderPrimitiveAlertDialog(p: AlertDialogPrimitiveProps): string {
  return W(`<div class="aph-dialog-card">
  <div class="aph-dialog-header">
    <div class="aph-dialog-title">${esc(p.title || "Are you absolutely sure?")}</div>
    <div class="aph-dialog-desc">${esc(p.description || "This action cannot be undone. This will permanently delete your account.")}</div>
  </div>
  <div class="aph-dialog-footer">
    <button class="aph-btn-ghost">${esc(p.cancelLabel || "Cancel")}</button>
    <button class="aph-btn-accent">${esc(p.actionLabel || "Continue")}</button>
  </div>
</div>`);
}

// ---------------------------------------------------------------------------
// Aspect Ratio
// ---------------------------------------------------------------------------

export function renderPrimitiveAspectRatio(p: AspectRatioPrimitiveProps): string {
  const ratio = p.ratio || "16 / 9";
  return W(`<div class="aph-aspect-ratio" style="aspect-ratio:${ratio}"><span class="aph-aspect-label">${esc(ratio)}</span></div>`);
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

export function renderPrimitiveAvatar(p: AvatarPrimitiveProps): string {
  const fallback = p.fallback || "CN";
  if (p.src) {
    return W(`<div class="aph-avatar"><img src="${esc(p.src)}" alt="avatar" class="aph-avatar-img" /></div>`);
  }
  return W(`<div class="aph-avatar"><span class="aph-avatar-fallback">${esc(fallback)}</span></div>`);
}

// ---------------------------------------------------------------------------
// Breadcrumb
// ---------------------------------------------------------------------------

export function renderPrimitiveBreadcrumb(p: BreadcrumbPrimitiveProps): string {
  const items = p.items?.length ? p.items : ["Home", "Components", "Breadcrumb"];
  const crumbs = items.map((it, i) =>
    i < items.length - 1
      ? `<a class="aph-breadcrumb-link">${esc(it)}</a><span class="aph-breadcrumb-sep">/</span>`
      : `<span class="aph-breadcrumb-current">${esc(it)}</span>`
  ).join("");
  return W(`<nav class="aph-breadcrumb">${crumbs}</nav>`);
}

// ---------------------------------------------------------------------------
// Button Group
// ---------------------------------------------------------------------------

export function renderPrimitiveButtonGroup(p: ButtonGroupPrimitiveProps): string {
  const buttons = p.buttons?.length ? p.buttons : ["Save", "Cancel", "Delete"];
  const btns = buttons.map((b, i) =>
    `<button class="${i === 0 ? "aph-btn-accent" : "aph-btn-ghost"}">${esc(b)}</button>`
  ).join("");
  return W(`<div class="aph-button-group">${btns}</div>`);
}

// ---------------------------------------------------------------------------
// Calendar
// ---------------------------------------------------------------------------

export function renderPrimitiveCalendar(p: CalendarPrimitiveProps): string {
  const month = p.month || "March 2026";
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const header = days.map(d => `<div class="aph-cal-day-label">${d}</div>`).join("");
  let cells = "";
  for (let i = 0; i < 35; i++) {
    const day = i < 2 ? "" : i > 31 ? "" : String(i - 1);
    const today = i === 17 ? " aph-cal-today" : "";
    cells += `<div class="aph-cal-cell${today}">${day}</div>`;
  }
  return W(`<div class="aph-calendar">
  <div class="aph-cal-header"><button class="aph-cal-nav">‹</button><span class="aph-cal-month">${esc(month)}</span><button class="aph-cal-nav">›</button></div>
  <div class="aph-cal-grid">${header}${cells}</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Carousel
// ---------------------------------------------------------------------------

export function renderPrimitiveCarousel(p: CarouselPrimitiveProps): string {
  const count = p.itemCount || 3;
  let slides = "";
  for (let i = 0; i < count; i++) {
    slides += `<div class="aph-carousel-slide${i === 0 ? " aph-carousel-active" : ""}">${i + 1} of ${count}</div>`;
  }
  return W(`<div class="aph-carousel">
  <button class="aph-carousel-btn aph-carousel-prev">‹</button>
  <div class="aph-carousel-track">${slides}</div>
  <button class="aph-carousel-btn aph-carousel-next">›</button>
</div>`);
}

// ---------------------------------------------------------------------------
// Chart
// ---------------------------------------------------------------------------

export function renderPrimitiveChart(p: ChartPrimitiveProps): string {
  const title = p.title || "Bar Chart";
  const bars = [60, 85, 45, 75, 90, 55];
  const barHtml = bars.map((h, i) => `<div class="aph-chart-bar" style="height:${h}%;" title="Value ${i + 1}"></div>`).join("");
  return W(`<div class="aph-chart">
  <div class="aph-chart-title">${esc(title)}</div>
  <div class="aph-chart-area">${barHtml}</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

export function renderPrimitiveCheckbox(p: CheckboxPrimitiveProps): string {
  const label = p.label || "Accept terms and conditions";
  const checked = p.checked !== false;
  return W(`<label class="aph-checkbox-label">
  <div class="aph-checkbox${checked ? " aph-checkbox-checked" : ""}">${checked ? "✓" : ""}</div>
  <span>${esc(label)}</span>
</label>`);
}

// ---------------------------------------------------------------------------
// Collapsible
// ---------------------------------------------------------------------------

export function renderPrimitiveCollapsible(p: CollapsiblePrimitiveProps): string {
  const title = p.title || "@peduarte starred 3 repositories";
  const content = p.content || "@radix-ui/primitives";
  return W(`<div class="aph-collapsible">
  <div class="aph-collapsible-trigger">${esc(title)} <span class="aph-collapsible-icon">⌄</span></div>
  <div class="aph-collapsible-content">${esc(content)}</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Combobox
// ---------------------------------------------------------------------------

export function renderPrimitiveCombobox(p: ComboboxPrimitiveProps): string {
  const placeholder = p.placeholder || "Select framework...";
  const options = p.options?.length ? p.options : ["Next.js", "Remix", "Astro", "Nuxt"];
  const items = options.map(o => `<div class="aph-combobox-item">${esc(o)}</div>`).join("");
  return W(`<div class="aph-combobox">
  <div class="aph-combobox-trigger"><span>${esc(placeholder)}</span><span class="aph-combobox-chevron">⌄</span></div>
  <div class="aph-combobox-list">${items}</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Command
// ---------------------------------------------------------------------------

export function renderPrimitiveCommand(p: CommandPrimitiveProps): string {
  const placeholder = p.placeholder || "Type a command or search...";
  const groups = p.groups?.length ? p.groups : [
    { heading: "Suggestions", items: ["Calendar", "Search Emoji", "Calculator"] },
    { heading: "Settings", items: ["Profile", "Billing", "Keyboard Shortcuts"] },
  ];
  const groupsHtml = groups.map(g => {
    const items = g.items.map(it => `<div class="aph-command-item">${esc(it)}</div>`).join("");
    return `<div class="aph-command-group"><div class="aph-command-heading">${esc(g.heading)}</div>${items}</div>`;
  }).join(`<div class="aph-separator-h"></div>`);
  return W(`<div class="aph-command">
  <div class="aph-command-input"><span class="aph-command-search-icon">⌕</span><input class="aph-input" placeholder="${esc(placeholder)}" /></div>
  <div class="aph-separator-h"></div>
  ${groupsHtml}
</div>`);
}

// ---------------------------------------------------------------------------
// Context Menu
// ---------------------------------------------------------------------------

export function renderPrimitiveContextMenu(p: ContextMenuPrimitiveProps): string {
  const items = p.items?.length ? p.items : ["Back", "Forward", "Reload", "---", "View Source", "Inspect"];
  const itemsHtml = items.map(it =>
    it === "---" ? `<div class="aph-separator-h"></div>` : `<div class="aph-menu-item">${esc(it)}</div>`
  ).join("");
  return W(`<div class="aph-context-menu">${itemsHtml}</div>`);
}

// ---------------------------------------------------------------------------
// Data Table
// ---------------------------------------------------------------------------

export function renderPrimitiveDataTable(p: DataTablePrimitiveProps): string {
  const columns = p.columns?.length ? p.columns : ["Status", "Email", "Amount"];
  const rows = p.rows?.length ? p.rows : [
    ["Success", "ken99@example.com", "$316.00"],
    ["Processing", "abe45@example.com", "$242.00"],
    ["Failed", "monserrat44@example.com", "$837.00"],
  ];
  const thRow = columns.map(c => `<th class="aph-th">${esc(c)}</th>`).join("");
  const bodyRows = rows.map(r => `<tr>${r.map(c => `<td class="aph-td">${esc(c)}</td>`).join("")}</tr>`).join("");
  return W(`<div class="aph-data-table">
  <div class="aph-data-table-toolbar"><input class="aph-input" placeholder="Filter emails..." style="max-width:240px" /></div>
  <table class="aph-table"><thead><tr>${thRow}</tr></thead><tbody>${bodyRows}</tbody></table>
  <div class="aph-data-table-footer"><span class="aph-muted">3 of 3 row(s) selected.</span></div>
</div>`);
}

// ---------------------------------------------------------------------------
// Date Picker
// ---------------------------------------------------------------------------

export function renderPrimitiveDatePicker(p: DatePickerPrimitiveProps): string {
  const placeholder = p.placeholder || "Pick a date";
  return W(`<button class="aph-date-picker"><span class="aph-date-picker-icon">📅</span><span class="aph-muted">${esc(placeholder)}</span></button>`);
}

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------

export function renderPrimitiveDialog(p: DialogPrimitiveProps): string {
  return W(`<div class="aph-dialog-card">
  <div class="aph-dialog-header">
    <div class="aph-dialog-title">${esc(p.title || "Edit Profile")}</div>
    <div class="aph-dialog-desc">${esc(p.description || "Make changes to your profile here. Click save when you're done.")}</div>
  </div>
  <div class="aph-dialog-body">
    <label class="aph-label-text">Name</label><input class="aph-input" value="Pedro Duarte" />
    <label class="aph-label-text" style="margin-top:12px">Username</label><input class="aph-input" value="@peduarte" />
  </div>
  <div class="aph-dialog-footer"><button class="aph-btn-accent">Save changes</button></div>
</div>`);
}

// ---------------------------------------------------------------------------
// Direction
// ---------------------------------------------------------------------------

export function renderPrimitiveDirection(p: DirectionPrimitiveProps): string {
  const dir = p.direction || "ltr";
  return W(`<div class="aph-direction"><span class="aph-badge">${dir.toUpperCase()}</span> <span class="aph-muted">Text direction: ${dir === "rtl" ? "Right to Left" : "Left to Right"}</span></div>`);
}

// ---------------------------------------------------------------------------
// Drawer
// ---------------------------------------------------------------------------

export function renderPrimitiveDrawer(p: DrawerPrimitiveProps): string {
  return W(`<div class="aph-drawer-card">
  <div class="aph-drawer-handle"></div>
  <div class="aph-dialog-header">
    <div class="aph-dialog-title">${esc(p.title || "Move Goal")}</div>
    <div class="aph-dialog-desc">${esc(p.description || "Set your daily activity goal.")}</div>
  </div>
  <div class="aph-dialog-body" style="text-align:center;padding:24px 0">
    <div style="font-size:48px;font-weight:700;color:var(--foreground)">350</div>
    <div class="aph-muted">calories/day</div>
  </div>
  <div class="aph-dialog-footer"><button class="aph-btn-accent aph-btn-full">Submit</button></div>
</div>`);
}

// ---------------------------------------------------------------------------
// Dropdown Menu
// ---------------------------------------------------------------------------

export function renderPrimitiveDropdownMenu(p: DropdownMenuPrimitiveProps): string {
  const trigger = p.trigger || "Open";
  const items = p.items?.length ? p.items : ["Profile", "Billing", "Settings", "---", "Log out"];
  const itemsHtml = items.map(it =>
    it === "---" ? `<div class="aph-separator-h"></div>` : `<div class="aph-menu-item">${esc(it)}</div>`
  ).join("");
  return W(`<div class="aph-dropdown-wrap">
  <button class="aph-btn-ghost">${esc(trigger)} ⌄</button>
  <div class="aph-context-menu">${itemsHtml}</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Empty
// ---------------------------------------------------------------------------

export function renderPrimitiveEmpty(p: EmptyStatePrimitiveProps): string {
  return W(`<div class="aph-empty-state">
  <div class="aph-empty-icon">📭</div>
  <div class="aph-empty-title">${esc(p.title || "No results found")}</div>
  <div class="aph-muted">${esc(p.description || "Try adjusting your search or filter to find what you're looking for.")}</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

export function renderPrimitiveField(p: FieldPrimitiveProps): string {
  return W(`<div class="aph-field">
  <label class="aph-label-text">${esc(p.label || "Email")}</label>
  <input class="aph-input" placeholder="${esc(p.placeholder || "name@example.com")}" />
  ${p.description ? `<div class="aph-field-desc">${esc(p.description)}</div>` : `<div class="aph-field-desc">Enter your email address.</div>`}
</div>`);
}

// ---------------------------------------------------------------------------
// Hover Card
// ---------------------------------------------------------------------------

export function renderPrimitiveHoverCard(p: HoverCardPrimitiveProps): string {
  return W(`<div class="aph-hover-card-wrap">
  <a class="aph-hover-trigger">${esc(p.trigger || "@nextjs")}</a>
  <div class="aph-hover-card-content">${esc(p.content || "The React Framework – created and maintained by @vercel.")}</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Input Group
// ---------------------------------------------------------------------------

export function renderPrimitiveInputGroup(p: InputGroupPrimitiveProps): string {
  const prefix = p.prefix || "$";
  const suffix = p.suffix || ".00";
  return W(`<div class="aph-input-group">
  <span class="aph-input-addon">${esc(prefix)}</span>
  <input class="aph-input aph-input-grouped" placeholder="${esc(p.placeholder || "0")}" />
  <span class="aph-input-addon">${esc(suffix)}</span>
</div>`);
}

// ---------------------------------------------------------------------------
// Input OTP
// ---------------------------------------------------------------------------

export function renderPrimitiveInputOTP(p: InputOTPPrimitiveProps): string {
  const length = p.length || 6;
  let slots = "";
  for (let i = 0; i < length; i++) {
    if (i === 3) slots += `<span class="aph-otp-separator">-</span>`;
    slots += `<div class="aph-otp-slot"></div>`;
  }
  return W(`<div class="aph-input-otp">${slots}</div>`);
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

export function renderPrimitiveItem(p: ItemPrimitiveProps): string {
  return W(`<div class="aph-item">
  <div class="aph-item-title">${esc(p.title || "List Item")}</div>
  ${p.description ? `<div class="aph-muted">${esc(p.description)}</div>` : ""}
</div>`);
}

// ---------------------------------------------------------------------------
// Kbd
// ---------------------------------------------------------------------------

export function renderPrimitiveKbd(p: KbdPrimitiveProps): string {
  const keys = p.keys?.length ? p.keys : ["⌘", "K"];
  const keysHtml = keys.map(k => `<kbd class="aph-kbd">${esc(k)}</kbd>`).join("");
  return W(`<span class="aph-kbd-group">${keysHtml}</span>`);
}

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

export function renderPrimitiveLabel(p: LabelPrimitiveProps): string {
  return W(`<label class="aph-label-text">${esc(p.text || "Your email address")}</label>`);
}

// ---------------------------------------------------------------------------
// Menubar
// ---------------------------------------------------------------------------

export function renderPrimitiveMenubar(p: MenubarPrimitiveProps): string {
  const menus = p.menus?.length ? p.menus : ["File", "Edit", "View", "Help"];
  const items = menus.map(m => `<div class="aph-menubar-item">${esc(m)}</div>`).join("");
  return W(`<div class="aph-menubar">${items}</div>`);
}

// ---------------------------------------------------------------------------
// Native Select
// ---------------------------------------------------------------------------

export function renderPrimitiveNativeSelect(p: NativeSelectPrimitiveProps): string {
  const options = p.options?.length ? p.options : ["Apple", "Banana", "Orange"];
  const optionsHtml = options.map(o => `<option>${esc(o)}</option>`).join("");
  return W(`<select class="aph-native-select"><option disabled selected>${esc(p.placeholder || "Select a fruit...")}</option>${optionsHtml}</select>`);
}

// ---------------------------------------------------------------------------
// Navigation Menu
// ---------------------------------------------------------------------------

export function renderPrimitiveNavigationMenu(p: NavigationMenuPrimitiveProps): string {
  const items = p.items?.length ? p.items : ["Getting Started", "Components", "Documentation"];
  const links = items.map(it => `<a class="aph-nav-menu-link">${esc(it)}</a>`).join("");
  return W(`<nav class="aph-nav-menu">${links}</nav>`);
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export function renderPrimitivePagination(p: PaginationPrimitiveProps): string {
  const total = p.totalPages || 10;
  const current = p.currentPage || 1;
  let pages = "";
  for (let i = 1; i <= Math.min(total, 5); i++) {
    pages += `<span class="aph-page-btn${i === current ? " aph-page-active" : ""}">${i}</span>`;
  }
  if (total > 5) pages += `<span class="aph-page-btn">…</span><span class="aph-page-btn">${total}</span>`;
  return W(`<nav class="aph-pagination"><span class="aph-page-btn">‹ Prev</span>${pages}<span class="aph-page-btn">Next ›</span></nav>`);
}

// ---------------------------------------------------------------------------
// Popover
// ---------------------------------------------------------------------------

export function renderPrimitivePopover(p: PopoverPrimitiveProps): string {
  return W(`<div class="aph-popover-wrap">
  <button class="aph-btn-ghost">${esc(p.trigger || "Open popover")}</button>
  <div class="aph-popover-content">${esc(p.content || "Place content for the popover here.")}</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

export function renderPrimitiveProgress(p: ProgressPrimitiveProps): string {
  const value = p.value ?? 60;
  return W(`<div class="aph-progress"><div class="aph-progress-bar" style="width:${value}%"></div></div>`);
}

// ---------------------------------------------------------------------------
// Radio Group
// ---------------------------------------------------------------------------

export function renderPrimitiveRadioGroup(p: RadioGroupPrimitiveProps): string {
  const options = p.options?.length ? p.options : ["Default", "Comfortable", "Compact"];
  const selected = p.selected || options[0];
  const radios = options.map(o => {
    const checked = o === selected;
    return `<label class="aph-radio-label"><div class="aph-radio${checked ? " aph-radio-checked" : ""}"><div class="aph-radio-dot"></div></div><span>${esc(o)}</span></label>`;
  }).join("");
  return W(`<div class="aph-radio-group">${radios}</div>`);
}

// ---------------------------------------------------------------------------
// Resizable
// ---------------------------------------------------------------------------

export function renderPrimitiveResizable(p: ResizablePrimitiveProps): string {
  const dir = p.direction || "horizontal";
  const cls = dir === "vertical" ? " aph-resizable-v" : "";
  return W(`<div class="aph-resizable${cls}">
  <div class="aph-resizable-pane">One</div>
  <div class="aph-resizable-handle">⋮</div>
  <div class="aph-resizable-pane">Two</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Scroll Area
// ---------------------------------------------------------------------------

export function renderPrimitiveScrollArea(_p: ScrollAreaPrimitiveProps): string {
  const tags = ["v1.0.0", "v1.1.0", "v1.2.0", "v1.3.0", "v1.4.0", "v2.0.0", "v2.1.0"];
  const items = tags.map(t => `<div class="aph-scroll-item">${t}</div>`).join("");
  return W(`<div class="aph-scroll-area"><div class="aph-scroll-heading">Tags</div>${items}<div class="aph-scroll-track"><div class="aph-scroll-thumb"></div></div></div>`);
}

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------

export function renderPrimitiveSelect(p: SelectPrimitiveProps): string {
  const options = p.options?.length ? p.options : ["Apple", "Banana", "Blueberry", "Grapes"];
  const items = options.map(o => `<div class="aph-combobox-item">${esc(o)}</div>`).join("");
  return W(`<div class="aph-combobox">
  <div class="aph-combobox-trigger"><span>${esc(p.placeholder || "Select a fruit...")}</span><span class="aph-combobox-chevron">⌄</span></div>
  <div class="aph-combobox-list">${items}</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Sheet
// ---------------------------------------------------------------------------

export function renderPrimitiveSheet(p: SheetPrimitiveProps): string {
  return W(`<div class="aph-sheet-card">
  <div class="aph-dialog-header">
    <div class="aph-dialog-title">${esc(p.title || "Edit Profile")}</div>
    <div class="aph-dialog-desc">${esc(p.description || "Make changes to your profile here.")}</div>
  </div>
  <div class="aph-dialog-body">
    <label class="aph-label-text">Name</label><input class="aph-input" value="Pedro Duarte" />
    <label class="aph-label-text" style="margin-top:12px">Username</label><input class="aph-input" value="@peduarte" />
  </div>
  <div class="aph-dialog-footer"><button class="aph-btn-accent">Save changes</button></div>
</div>`);
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

export function renderPrimitiveSidebar(p: SidebarPrimitiveProps): string {
  const title = p.title || "Application";
  const items = p.items?.length ? p.items : ["Dashboard", "Projects", "Settings", "Users", "Help"];
  const links = items.map((it, i) => `<a class="aph-sidebar-link${i === 0 ? " aph-sidebar-active" : ""}">${esc(it)}</a>`).join("");
  return W(`<div class="aph-sidebar"><div class="aph-sidebar-title">${esc(title)}</div><nav class="aph-sidebar-nav">${links}</nav></div>`);
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export function renderPrimitiveSkeleton(p: SkeletonPrimitiveProps): string {
  const lines = p.lines || 3;
  if (p.variant === "circular") {
    return W(`<div class="aph-skeleton-circle"></div>`);
  }
  let rows = `<div class="aph-skeleton-line" style="width:48px;height:48px;border-radius:50%"></div>`;
  for (let i = 0; i < lines; i++) {
    const w = i === 0 ? "60%" : i === lines - 1 ? "40%" : "80%";
    rows += `<div class="aph-skeleton-line" style="width:${w}"></div>`;
  }
  return W(`<div class="aph-skeleton">${rows}</div>`);
}

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------

export function renderPrimitiveSlider(p: SliderPrimitiveProps): string {
  const value = p.value ?? 50;
  return W(`<div class="aph-slider"><div class="aph-slider-track"><div class="aph-slider-fill" style="width:${value}%"></div><div class="aph-slider-thumb" style="left:${value}%"></div></div></div>`);
}

// ---------------------------------------------------------------------------
// Sonner
// ---------------------------------------------------------------------------

export function renderPrimitiveSonner(p: SonnerPrimitiveProps): string {
  const typeClass = p.type === "success" ? " aph-sonner-success" : p.type === "error" ? " aph-sonner-error" : "";
  return W(`<div class="aph-sonner${typeClass}">
  <div class="aph-sonner-title">${esc(p.title || "Event has been created")}</div>
  ${p.description ? `<div class="aph-muted">${esc(p.description)}</div>` : `<div class="aph-muted">Monday, March 16, 2026 at 5:30 PM</div>`}
</div>`);
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

export function renderPrimitiveSpinner(p: SpinnerPrimitiveProps): string {
  const sz = p.size === "sm" ? 16 : p.size === "lg" ? 32 : 24;
  return W(`<div class="aph-spinner" style="width:${sz}px;height:${sz}px"></div>`);
}

// ---------------------------------------------------------------------------
// Switch
// ---------------------------------------------------------------------------

export function renderPrimitiveSwitch(p: SwitchPrimitiveProps): string {
  const checked = p.checked !== false;
  return W(`<label class="aph-switch-label">
  <div class="aph-switch${checked ? " aph-switch-checked" : ""}"><div class="aph-switch-thumb"></div></div>
  <span>${esc(p.label || "Airplane Mode")}</span>
</label>`);
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

export function renderPrimitiveTable(p: TablePrimitiveProps): string {
  const headers = p.headers?.length ? p.headers : ["Invoice", "Status", "Method", "Amount"];
  const rows = p.rows?.length ? p.rows : [
    ["INV001", "Paid", "Credit Card", "$250.00"],
    ["INV002", "Pending", "PayPal", "$150.00"],
    ["INV003", "Paid", "Bank Transfer", "$350.00"],
  ];
  const thRow = headers.map(h => `<th class="aph-th">${esc(h)}</th>`).join("");
  const bodyRows = rows.map(r => `<tr>${r.map(c => `<td class="aph-td">${esc(c)}</td>`).join("")}</tr>`).join("");
  return W(`<table class="aph-table"><thead><tr>${thRow}</tr></thead><tbody>${bodyRows}</tbody></table>`);
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

export function renderPrimitiveTabs(p: TabsPrimitiveProps): string {
  const tabs = p.tabs?.length ? p.tabs : [
    { label: "Account", content: "Make changes to your account here." },
    { label: "Password", content: "Change your password here." },
  ];
  const tabBtns = tabs.map((t, i) =>
    `<button class="aph-tab-btn${i === 0 ? " aph-tab-active" : ""}">${esc(t.label)}</button>`
  ).join("");
  const content = tabs[0]?.content || "";
  return W(`<div class="aph-tabs">
  <div class="aph-tab-list">${tabBtns}</div>
  <div class="aph-tab-content">${esc(content)}</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------

export function renderPrimitiveTextarea(p: TextareaPrimitiveProps): string {
  const rows = p.rows || 4;
  return W(`<textarea class="aph-textarea" rows="${rows}" placeholder="${esc(p.placeholder || "Type your message here.")}"></textarea>`);
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

export function renderPrimitiveToast(p: ToastPrimitiveProps): string {
  const variant = p.variant || "default";
  const cls = variant === "destructive" ? " aph-toast-destructive" : "";
  return W(`<div class="aph-toast${cls}">
  <div class="aph-toast-title">${esc(p.title || "Scheduled: Catch up")}</div>
  <div class="aph-muted">${esc(p.description || "Friday, March 20, 2026 at 5:57 PM")}</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------

export function renderPrimitiveToggle(p: TogglePrimitiveProps): string {
  const pressed = p.pressed ?? false;
  return W(`<button class="aph-toggle${pressed ? " aph-toggle-pressed" : ""}">${esc(p.label || "B")}</button>`);
}

// ---------------------------------------------------------------------------
// Toggle Group
// ---------------------------------------------------------------------------

export function renderPrimitiveToggleGroup(p: ToggleGroupPrimitiveProps): string {
  const items = p.items?.length ? p.items : ["B", "I", "U"];
  const btns = items.map((it, i) =>
    `<button class="aph-toggle${i === 0 ? " aph-toggle-pressed" : ""}">${esc(it)}</button>`
  ).join("");
  return W(`<div class="aph-toggle-group">${btns}</div>`);
}

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

export function renderPrimitiveTooltip(p: TooltipPrimitiveProps): string {
  return W(`<div class="aph-tooltip-wrap">
  <button class="aph-btn-ghost">${esc(p.trigger || "Hover")}</button>
  <div class="aph-tooltip-bubble">${esc(p.content || "Add to library")}</div>
</div>`);
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export function renderPrimitiveTypography(p: TypographyPrimitiveProps): string {
  const text = p.text || "The quick brown fox jumps over the lazy dog.";
  const variant = p.variant || "p";
  const tagMap: Record<string, string> = { h1: "h1", h2: "h2", h3: "h3", h4: "h4", p: "p", lead: "p", large: "p", small: "p", muted: "p" };
  const tag = tagMap[variant] || "p";
  return W(`<${tag} class="aph-typo-${variant}">${esc(text)}</${tag}>`);
}

// ---------------------------------------------------------------------------
// Master dispatcher
// ---------------------------------------------------------------------------

export function renderPrimitive(block: PrimitiveContent): string {
  switch (block.type) {
    case "primitive-button": return renderPrimitiveButton(block.props);
    case "primitive-card": return renderPrimitiveCard(block.props);
    case "primitive-badge": return renderPrimitiveBadge(block.props);
    case "primitive-input": return renderPrimitiveInput(block.props);
    case "primitive-separator": return renderPrimitiveSeparator(block.props);
    case "primitive-accordion": return renderPrimitiveAccordion(block.props);
    case "primitive-alert": return renderPrimitiveAlert(block.props);
    case "primitive-alert-dialog": return renderPrimitiveAlertDialog(block.props);
    case "primitive-aspect-ratio": return renderPrimitiveAspectRatio(block.props);
    case "primitive-avatar": return renderPrimitiveAvatar(block.props);
    case "primitive-breadcrumb": return renderPrimitiveBreadcrumb(block.props);
    case "primitive-button-group": return renderPrimitiveButtonGroup(block.props);
    case "primitive-calendar": return renderPrimitiveCalendar(block.props);
    case "primitive-carousel": return renderPrimitiveCarousel(block.props);
    case "primitive-chart": return renderPrimitiveChart(block.props);
    case "primitive-checkbox": return renderPrimitiveCheckbox(block.props);
    case "primitive-collapsible": return renderPrimitiveCollapsible(block.props);
    case "primitive-combobox": return renderPrimitiveCombobox(block.props);
    case "primitive-command": return renderPrimitiveCommand(block.props);
    case "primitive-context-menu": return renderPrimitiveContextMenu(block.props);
    case "primitive-data-table": return renderPrimitiveDataTable(block.props);
    case "primitive-date-picker": return renderPrimitiveDatePicker(block.props);
    case "primitive-dialog": return renderPrimitiveDialog(block.props);
    case "primitive-direction": return renderPrimitiveDirection(block.props);
    case "primitive-drawer": return renderPrimitiveDrawer(block.props);
    case "primitive-dropdown-menu": return renderPrimitiveDropdownMenu(block.props);
    case "primitive-empty": return renderPrimitiveEmpty(block.props);
    case "primitive-field": return renderPrimitiveField(block.props);
    case "primitive-hover-card": return renderPrimitiveHoverCard(block.props);
    case "primitive-input-group": return renderPrimitiveInputGroup(block.props);
    case "primitive-input-otp": return renderPrimitiveInputOTP(block.props);
    case "primitive-item": return renderPrimitiveItem(block.props);
    case "primitive-kbd": return renderPrimitiveKbd(block.props);
    case "primitive-label": return renderPrimitiveLabel(block.props);
    case "primitive-menubar": return renderPrimitiveMenubar(block.props);
    case "primitive-native-select": return renderPrimitiveNativeSelect(block.props);
    case "primitive-navigation-menu": return renderPrimitiveNavigationMenu(block.props);
    case "primitive-pagination": return renderPrimitivePagination(block.props);
    case "primitive-popover": return renderPrimitivePopover(block.props);
    case "primitive-progress": return renderPrimitiveProgress(block.props);
    case "primitive-radio-group": return renderPrimitiveRadioGroup(block.props);
    case "primitive-resizable": return renderPrimitiveResizable(block.props);
    case "primitive-scroll-area": return renderPrimitiveScrollArea(block.props);
    case "primitive-select": return renderPrimitiveSelect(block.props);
    case "primitive-sheet": return renderPrimitiveSheet(block.props);
    case "primitive-sidebar": return renderPrimitiveSidebar(block.props);
    case "primitive-skeleton": return renderPrimitiveSkeleton(block.props);
    case "primitive-slider": return renderPrimitiveSlider(block.props);
    case "primitive-sonner": return renderPrimitiveSonner(block.props);
    case "primitive-spinner": return renderPrimitiveSpinner(block.props);
    case "primitive-switch": return renderPrimitiveSwitch(block.props);
    case "primitive-table": return renderPrimitiveTable(block.props);
    case "primitive-tabs": return renderPrimitiveTabs(block.props);
    case "primitive-textarea": return renderPrimitiveTextarea(block.props);
    case "primitive-toast": return renderPrimitiveToast(block.props);
    case "primitive-toggle": return renderPrimitiveToggle(block.props);
    case "primitive-toggle-group": return renderPrimitiveToggleGroup(block.props);
    case "primitive-tooltip": return renderPrimitiveTooltip(block.props);
    case "primitive-typography": return renderPrimitiveTypography(block.props);
    default: return "";
  }
}
