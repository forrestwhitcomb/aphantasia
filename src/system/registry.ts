// ============================================================
// Aphantasia/System — Component Registry + Spec Factories
// ============================================================
// Each component type has named variants. Each variant maps to
// a factory function that produces a full SpecNode subtree.
// This is the Aphantasia equivalent of Figma component variants.
// ============================================================

import type { ComponentDef, SpecNode } from "./types";

let _uid = 1000;
export const uid = () => `n${++_uid}`;

function node(
  type: SpecNode["type"],
  variant: string | null,
  props: Record<string, unknown> = {},
  children: SpecNode[] = [],
): SpecNode {
  return { id: uid(), type, variant, props, children, annotations: [] };
}

// ── Registry ─────────────────────────────────────────────────

export const REGISTRY: Record<string, ComponentDef> = {
  Card: {
    icon: "▢",
    cat: "surfaces",
    variants: {
      info:    { label: "Info Card",    desc: "Title, description, action button" },
      pricing: { label: "Pricing Card", desc: "Plan, price, features, CTA" },
      image:   { label: "Image Card",   desc: "Image header with content below" },
      stat:    { label: "Stat Card",    desc: "KPI number with label and trend" },
      profile: { label: "Profile Card", desc: "Avatar, name, role" },
    },
  },
  Section: {
    icon: "☰",
    cat: "layout",
    variants: {
      hero:     { label: "Hero",     desc: "Headline, subtitle, CTA" },
      features: { label: "Features", desc: "Grid of feature cards" },
      cta:      { label: "CTA",      desc: "Centered call to action" },
      split:    { label: "Split",    desc: "Image + text side by side" },
      stats:    { label: "Stats",    desc: "Row of stat cards" },
    },
  },
  Button: {
    icon: "▬",
    cat: "actions",
    variants: {
      primary:     { label: "Primary" },
      secondary:   { label: "Secondary" },
      outline:     { label: "Outline" },
      ghost:       { label: "Ghost" },
      destructive: { label: "Destructive" },
    },
  },
  Input: {
    icon: "▭",
    cat: "inputs",
    variants: {
      text:     { label: "Text" },
      email:    { label: "Email" },
      password: { label: "Password" },
      search:   { label: "Search" },
      textarea: { label: "Textarea" },
    },
  },
  Text: {
    icon: "T",
    cat: "content",
    variants: {
      h1:      { label: "Heading 1" },
      h2:      { label: "Heading 2" },
      h3:      { label: "Heading 3" },
      p:       { label: "Paragraph" },
      caption: { label: "Caption" },
      label:   { label: "Label" },
    },
  },
  Badge: {
    icon: "●",
    cat: "content",
    variants: {
      default:     { label: "Default" },
      secondary:   { label: "Secondary" },
      outline:     { label: "Outline" },
      destructive: { label: "Destructive" },
    },
  },
  Avatar: {
    icon: "◉",
    cat: "content",
    variants: {
      circle: { label: "Circle" },
      square: { label: "Square" },
    },
  },
  Dropdown: {
    icon: "▾",
    cat: "inputs",
    variants: {
      default: { label: "Default" },
    },
  },
  Tabs: {
    icon: "⊟",
    cat: "nav",
    variants: {
      default:  { label: "Default" },
      pills:    { label: "Pills" },
    },
  },
  Toggle: {
    icon: "◐",
    cat: "inputs",
    variants: {
      default: { label: "Default" },
    },
  },
  Image: {
    icon: "▨",
    cat: "content",
    variants: {
      default: { label: "Default" },
      rounded: { label: "Rounded" },
    },
  },
  Separator: {
    icon: "—",
    cat: "layout",
    variants: {
      default: { label: "Default" },
    },
  },
  Nav: {
    icon: "≡",
    cat: "nav",
    variants: {
      top:     { label: "Top Bar" },
      sidebar: { label: "Sidebar" },
    },
  },
  Table: {
    icon: "▦",
    cat: "content",
    variants: {
      default: { label: "Default",  desc: "Standard data table" },
      striped: { label: "Striped",  desc: "Alternating row colors" },
      compact: { label: "Compact",  desc: "Tighter spacing" },
    },
  },
  Modal: {
    icon: "◻",
    cat: "surfaces",
    variants: {
      default: { label: "Default", desc: "Dialog with title and actions" },
      alert:   { label: "Alert",   desc: "Confirmation dialog" },
      form:    { label: "Form",    desc: "Dialog with form fields" },
    },
  },
  Toast: {
    icon: "◩",
    cat: "content",
    variants: {
      success: { label: "Success" },
      error:   { label: "Error" },
      warning: { label: "Warning" },
      info:    { label: "Info" },
    },
  },
  Progress: {
    icon: "◫",
    cat: "content",
    variants: {
      bar:    { label: "Bar",    desc: "Horizontal progress bar" },
      circle: { label: "Circle", desc: "Circular progress" },
      steps:  { label: "Steps",  desc: "Step indicator" },
    },
  },
  Breadcrumb: {
    icon: "›",
    cat: "nav",
    variants: {
      default: { label: "Default" },
    },
  },
  Sidebar: {
    icon: "▌",
    cat: "nav",
    variants: {
      default:   { label: "Default",   desc: "Full sidebar nav" },
      collapsed: { label: "Collapsed", desc: "Icon-only sidebar" },
    },
  },
  Footer: {
    icon: "▁",
    cat: "layout",
    variants: {
      simple:     { label: "Simple",     desc: "Copyright text" },
      links:      { label: "Links",      desc: "Multi-column links" },
      newsletter: { label: "Newsletter", desc: "Email signup footer" },
    },
  },
  Form: {
    icon: "☐",
    cat: "inputs",
    variants: {
      login:   { label: "Login",   desc: "Email + password" },
      signup:  { label: "Signup",  desc: "Name, email, password" },
      contact: { label: "Contact", desc: "Name, email, message" },
      search:  { label: "Search",  desc: "Search input + button" },
    },
  },
  Chart: {
    icon: "▊",
    cat: "content",
    variants: {
      bar:   { label: "Bar Chart" },
      line:  { label: "Line Chart" },
      pie:   { label: "Pie Chart" },
      donut: { label: "Donut Chart" },
    },
  },
  Skeleton: {
    icon: "▤",
    cat: "content",
    variants: {
      card:   { label: "Card",   desc: "Loading card placeholder" },
      text:   { label: "Text",   desc: "Loading text lines" },
      avatar: { label: "Avatar", desc: "Loading avatar circle" },
      table:  { label: "Table",  desc: "Loading table rows" },
    },
  },
  Accordion: {
    icon: "▼",
    cat: "content",
    variants: {
      default: { label: "Default", desc: "Collapsible sections" },
    },
  },
  Alert: {
    icon: "⚠",
    cat: "content",
    variants: {
      info:    { label: "Info" },
      success: { label: "Success" },
      warning: { label: "Warning" },
      error:   { label: "Error" },
    },
  },
};

export const PALETTE_CATEGORIES = [
  { key: "layout",   label: "Layout" },
  { key: "surfaces", label: "Surfaces" },
  { key: "content",  label: "Content" },
  { key: "actions",  label: "Actions" },
  { key: "inputs",   label: "Inputs" },
  { key: "nav",      label: "Navigation" },
];

// ── Spec Factories ───────────────────────────────────────────
// Each factory creates a full subtree for a given variant.
// When a user switches variants, we replace the entire subtree
// (preserving the parent id and annotations).

export function makeSpec(
  type: string,
  variant: string,
  overrides: Record<string, unknown> = {},
): SpecNode {
  const base = node(type as SpecNode["type"], variant, overrides);

  // ── Card variants ──
  if (type === "Card") {
    switch (variant) {
      case "info":
        base.children = [
          node("Text", "h3", { content: "Card Title" }),
          node("Text", "p", { content: "A brief description of this card and what it does." }),
          node("Button", "primary", { label: "Action" }),
        ];
        break;
      case "pricing":
        base.children = [
          node("Badge", "default", { label: "Popular" }),
          node("Text", "h2", { content: "$29/mo" }),
          node("Text", "caption", { content: "Pro Plan" }),
          node("Separator", "default"),
          node("Text", "p", { content: "✓ Unlimited screens\n✓ AI generation\n✓ Code export\n✓ Team collaboration" }),
          node("Button", "primary", { label: "Get Started" }),
        ];
        break;
      case "image":
        base.children = [
          node("Image", "default", { alt: "Cover image" }),
          node("Text", "h3", { content: "Image Card" }),
          node("Text", "p", { content: "Visual content with a description below the image." }),
        ];
        break;
      case "stat":
        base.children = [
          node("Text", "caption", { content: "Total Users" }),
          node("Text", "h1", { content: "2,847" }),
          node("Badge", "secondary", { label: "+12.5%" }),
        ];
        break;
      case "profile":
        base.children = [
          node("Avatar", "circle", { initials: "JD", size: "lg" }),
          node("Text", "h3", { content: "Jane Doe" }),
          node("Text", "caption", { content: "Product Designer" }),
        ];
        base.props.align = "center";
        break;
    }
  }

  // ── Section variants ──
  if (type === "Section") {
    switch (variant) {
      case "hero":
        base.children = [
          node("Text", "h1", { content: "Build interfaces\nthat ship" }),
          node("Text", "p", { content: "Sketch on a canvas. Get real components. Export production code." }),
          node("Button", "primary", { label: "Start Building", size: "lg" }),
        ];
        base.props.align = "center";
        base.props.paddingY = "80px";
        break;
      case "features":
        base.children = [
          node("Text", "h2", { content: "Everything you need", align: "center" }),
          node("__row", null, { gap: "24px" }, [
            makeSpec("Card", "info"),
            makeSpec("Card", "info"),
            makeSpec("Card", "info"),
          ]),
        ];
        base.children[1].children[0].children[0].props.content = "Design System";
        base.children[1].children[0].children[1].props.content = "Real components with token bindings. Change a color, everything updates.";
        base.children[1].children[1].children[0].props.content = "AI Assist";
        base.children[1].children[1].children[1].props.content = "Chat or annotate. AI generates within your design system constraints.";
        base.children[1].children[2].children[0].props.content = "Ship to Code";
        base.children[1].children[2].children[1].props.content = "Export React, HTML, or deploy to Vercel. What you see is what ships.";
        break;
      case "cta":
        base.children = [
          node("Text", "h2", { content: "Ready to ship?" }),
          node("Text", "p", { content: "Start building with real components today." }),
          node("Button", "primary", { label: "Get Started Free" }),
        ];
        base.props.align = "center";
        base.props.bg = "bg.muted";
        base.props.paddingY = "48px";
        break;
      case "split":
        base.children = [
          node("__row", null, { gap: "48px", align: "center" }, [
            node("Image", "rounded", { alt: "Product screenshot", flex: "1" }),
            node("__root", null, { flex: "1" }, [
              node("Text", "h2", { content: "Powerful yet simple" }),
              node("Text", "p", { content: "Everything you draw becomes a real component. Every component carries its design tokens. Change anything, ship everywhere." }),
              node("Button", "primary", { label: "Learn More" }),
            ]),
          ]),
        ];
        break;
      case "stats":
        base.children = [
          node("__row", null, { gap: "24px" }, [
            makeSpec("Card", "stat"),
            makeSpec("Card", "stat"),
            makeSpec("Card", "stat"),
          ]),
        ];
        base.children[0].children[0].children[0].props.content = "Screens Built";
        base.children[0].children[0].children[1].props.content = "12,483";
        base.children[0].children[1].children[0].props.content = "Components";
        base.children[0].children[1].children[1].props.content = "847";
        base.children[0].children[1].children[2].props.label = "+24%";
        base.children[0].children[2].children[0].props.content = "Deployments";
        base.children[0].children[2].children[1].props.content = "156";
        break;
    }
  }

  // ── Table variants ──
  if (type === "Table") {
    const headers = ["Name", "Email", "Role"];
    const rows = [["Alice Smith", "alice@example.com", "Admin"], ["Bob Jones", "bob@example.com", "Editor"], ["Carol Lee", "carol@example.com", "Viewer"]];
    base.props = { ...base.props, headers, rows, striped: variant === "striped", compact: variant === "compact" };
  }

  // ── Modal variants ──
  if (type === "Modal") {
    switch (variant) {
      case "default":
        base.children = [
          node("Text", "h2", { content: "Modal Title" }),
          node("Text", "p", { content: "This is a description of the modal content." }),
          node("Button", "primary", { label: "Confirm" }),
          node("Button", "outline", { label: "Cancel" }),
        ];
        break;
      case "alert":
        base.children = [
          node("Text", "h3", { content: "Are you sure?" }),
          node("Text", "p", { content: "This action cannot be undone." }),
          node("Button", "destructive", { label: "Delete" }),
        ];
        break;
      case "form":
        base.children = [
          node("Text", "h2", { content: "Edit Profile" }),
          node("Input", "text", { label: "Name", placeholder: "Your name" }),
          node("Input", "email", { label: "Email", placeholder: "you@example.com" }),
          node("Button", "primary", { label: "Save" }),
        ];
        break;
    }
  }

  // ── Toast variants ──
  if (type === "Toast") {
    const msgs: Record<string, string> = { success: "Changes saved successfully", error: "Something went wrong", warning: "Please review your input", info: "New update available" };
    base.props = { ...base.props, message: msgs[variant] ?? "Notification" };
  }

  // ── Progress variants ──
  if (type === "Progress") {
    base.props = { ...base.props, percentage: 65, label: "Loading..." };
    if (variant === "steps") base.props = { ...base.props, steps: ["Details", "Payment", "Confirm"], currentStep: 1 };
  }

  // ── Breadcrumb ──
  if (type === "Breadcrumb") {
    base.props = { ...base.props, items: ["Home", "Products", "Electronics"] };
  }

  // ── Sidebar variants ──
  if (type === "Sidebar") {
    base.children = [
      node("Text", "h3", { content: "App Name" }),
      node("Text", "label", { content: "Dashboard" }),
      node("Text", "label", { content: "Analytics" }),
      node("Text", "label", { content: "Projects" }),
      node("Text", "label", { content: "Settings" }),
      node("Text", "label", { content: "Help" }),
    ];
    if (variant === "collapsed") base.props = { ...base.props, collapsed: true };
  }

  // ── Footer variants ──
  if (type === "Footer") {
    switch (variant) {
      case "simple":
        base.children = [node("Text", "caption", { content: "\u00a9 2025 Company. All rights reserved." })];
        break;
      case "links":
        base.children = [
          node("Text", "label", { content: "Product" }),
          node("Text", "caption", { content: "Features \u00b7 Pricing \u00b7 Docs" }),
          node("Text", "label", { content: "Company" }),
          node("Text", "caption", { content: "About \u00b7 Blog \u00b7 Careers" }),
          node("Text", "label", { content: "Legal" }),
          node("Text", "caption", { content: "Privacy \u00b7 Terms" }),
        ];
        break;
      case "newsletter":
        base.children = [
          node("Text", "h3", { content: "Stay Updated" }),
          node("Text", "p", { content: "Subscribe to our newsletter." }),
          node("Input", "email", { placeholder: "you@example.com" }),
          node("Button", "primary", { label: "Subscribe" }),
        ];
        break;
    }
  }

  // ── Form variants ──
  if (type === "Form") {
    switch (variant) {
      case "login":
        base.children = [
          node("Text", "h2", { content: "Sign In" }),
          node("Input", "email", { label: "Email", placeholder: "you@example.com" }),
          node("Input", "password", { label: "Password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }),
          node("Button", "primary", { label: "Sign In", size: "lg" }),
        ];
        break;
      case "signup":
        base.children = [
          node("Text", "h2", { content: "Create Account" }),
          node("Input", "text", { label: "Full Name", placeholder: "Jane Doe" }),
          node("Input", "email", { label: "Email", placeholder: "you@example.com" }),
          node("Input", "password", { label: "Password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }),
          node("Button", "primary", { label: "Sign Up", size: "lg" }),
        ];
        break;
      case "contact":
        base.children = [
          node("Text", "h2", { content: "Contact Us" }),
          node("Input", "text", { label: "Name", placeholder: "Your name" }),
          node("Input", "email", { label: "Email", placeholder: "you@example.com" }),
          node("Input", "textarea", { label: "Message", placeholder: "How can we help?" }),
          node("Button", "primary", { label: "Send Message", size: "lg" }),
        ];
        break;
      case "search":
        base.children = [
          node("Input", "search", { placeholder: "Search..." }),
          node("Button", "primary", { label: "Search" }),
        ];
        break;
    }
  }

  // ── Chart variants ──
  if (type === "Chart") {
    base.props = { ...base.props, title: variant.charAt(0).toUpperCase() + variant.slice(1) + " Chart", caption: "Data from last 30 days" };
  }

  // ── Skeleton variants ──
  if (type === "Skeleton") {
    base.props = { ...base.props, lines: variant === "text" ? 4 : variant === "table" ? 5 : 1 };
  }

  // ── Accordion ──
  if (type === "Accordion") {
    base.props = { ...base.props, items: [
      { title: "What is this?", content: "This is a frequently asked question with an expandable answer." },
      { title: "How does it work?", content: "Click the title to expand or collapse the content section." },
      { title: "Can I customize it?", content: "Yes, you can edit the text and add more items." },
    ]};
  }

  // ── Alert variants ──
  if (type === "Alert") {
    const msgs: Record<string, { title: string; desc: string }> = {
      info:    { title: "Information", desc: "This is an informational message." },
      success: { title: "Success", desc: "The operation completed successfully." },
      warning: { title: "Warning", desc: "Please review before continuing." },
      error:   { title: "Error", desc: "Something went wrong. Please try again." },
    };
    const m = msgs[variant] ?? msgs.info;
    base.props = { ...base.props, title: m.title, description: m.desc };
  }

  return base;
}

// ── Shape → Component Recognition ────────────────────────────
// Given a drawn rectangle's dimensions, guess what component it is.

// ── Screen archetypes ───────────────────────────────────────

export const SCREEN_ARCHETYPES: Record<string, { viewport: "mobile" | "tablet" | "desktop"; w: number; h: number; description: string }> = {
  "landing-page": { viewport: "desktop", w: 1280, h: 960, description: "Marketing landing page" },
  "dashboard":    { viewport: "desktop", w: 1440, h: 900, description: "Analytics dashboard" },
  "settings":     { viewport: "desktop", w: 1280, h: 800, description: "Settings page" },
  "auth":         { viewport: "mobile",  w: 393,  h: 852, description: "Login / signup" },
  "profile":      { viewport: "mobile",  w: 393,  h: 852, description: "User profile" },
  "feed":         { viewport: "mobile",  w: 393,  h: 852, description: "Content feed" },
  "checkout":     { viewport: "desktop", w: 1280, h: 800, description: "E-commerce checkout" },
  "pricing":      { viewport: "desktop", w: 1280, h: 800, description: "Pricing comparison" },
};

export function recognizeShape(
  w: number,
  h: number,
): { type: string; variant: string } {
  const aspect = w / h;

  if (h < 44) return { type: "Button", variant: "primary" };
  if (h < 56 && w > 140) return { type: "Input", variant: "text" };
  if (aspect > 4) return { type: "Separator", variant: "default" };
  if (w < 80 && h < 80) return { type: "Avatar", variant: "circle" };
  if (w < 120 && h < 40) return { type: "Badge", variant: "default" };
  if (w < 200 && h > 400) return { type: "Sidebar", variant: "default" };
  if (aspect > 1.5 && h > 150 && h < 300) return { type: "Table", variant: "default" };
  if (w > 200 && w < 500 && h > 300) return { type: "Form", variant: "contact" };
  if (aspect > 1.8 && h > 120) return { type: "Card", variant: "image" };
  if (h > 250) return { type: "Section", variant: "hero" };
  if (h > 150) return { type: "Card", variant: "info" };
  return { type: "Card", variant: "info" };
}
