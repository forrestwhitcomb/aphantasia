# Clean Commerce

> Light backgrounds, product-focused layouts, clear CTAs, trust signals, tight grids.
> Every pixel serves conversion. Nothing decorative without purpose.

**Trigger:** `contentType: ecommerce`

---

## 1. Typography

### Primary Font
Use **Inter**, **Suisse Intl**, or **Aeonik**. These are workhorse e-commerce fonts: high x-height, excellent legibility at small sizes, and they disappear into the content (which is the point).

### Headline Treatment
- Hero headline: `clamp(36px, 5vw, 64px)` at weight **600** (semibold, not bold).
- Letter-spacing: `-0.02em`. Tight but not compressed.
- Line-height: `1.1` for hero, `1.15` for section titles.
- NEVER go above 64px. Commerce headlines are informational, not theatrical.

### Body Text
- Size: `16px` base, `15px` on mobile. Never 14px for primary copy.
- Weight: `400` for body, `500` for UI labels and metadata.
- Line-height: `1.6` for paragraphs, `1.4` for card descriptions.
- Color: `#374151` (gray-700) on white. Not pure black. Not lighter than gray-600.

### Supporting Text
- Price text: `18px` weight `600` in the primary brand color or `#111827`.
- Strikethrough prices: `16px` weight `400` in `#9CA3AF` with `text-decoration: line-through`.
- Badge/label text: `11px` weight `600` uppercase, `0.08em` letter-spacing.
- Caption/metadata: `13px` weight `400` in `#6B7280`.

### Font Pairing Rule
One font only. Commerce sites gain trust from typographic consistency. If you absolutely must pair, use the same family at different weights. Two typefaces signals "designed" over "trustworthy."

---

## 2. Color Strategy

### Background
- Primary surface: `#FFFFFF`. No off-whites, no creams. Pure white.
- Alternating sections: toggle between `#FFFFFF` and `#F9FAFB` (gray-50).
- Never use more than two background tones in the entire page.

### Accent Color
- One accent color only. Derive from brand or default to `#2563EB` (blue-600).
- Accent is reserved for: primary CTA buttons, active states, links, and price highlights.
- Secondary actions get `#374151` (gray-700) or outlined style.
- NEVER use accent color for decorative borders, section backgrounds, or icon fills.

### Trust Palette
- Success/in-stock: `#059669` (emerald-600). Use sparingly.
- Sale/urgency: `#DC2626` (red-600). Only on price reductions, never on buttons.
- Star ratings: `#F59E0B` (amber-500).

### Opacity Patterns
- Hover overlays on product images: `rgba(0,0,0,0.03)` -- barely visible.
- Disabled states: `opacity: 0.4` on the element, not a color change.
- Dividers: `1px solid #E5E7EB` (gray-200). Not rgba, not dashed.

### Color Volume
The page should feel 90% neutral with surgical accent placement. If you squint at the page and see more than 3 distinct colors, you've used too many.

---

## 3. Spacing

### Section Padding
- Desktop: `80px 0` vertical padding per section. Not 120px. Commerce pages are dense by design.
- Mobile: `56px 0`.
- Hero section: `96px 0` desktop, `64px 0` mobile.

### Container
- Max-width: `1200px`. Not 1440px -- that's too wide for product grids.
- Horizontal padding: `24px` mobile, `40px` tablet, `0` at max-width.

### Grid System
- Product grid: 4 columns desktop, 2 columns mobile. Gap: `24px` horizontal, `32px` vertical.
- Feature grid: 3 columns desktop, 1 column mobile. Gap: `32px`.
- Never use 5-column grids. They create awkward product card proportions.

### Card Internal Spacing
- Image to text gap: `16px`.
- Text block padding (if card has a surface): `20px`.
- Between title and price: `8px`.
- Between price and CTA: `16px`.
- Between metadata items (color dots, sizes): `8px`.

### Micro-Spacing
- Icon to label: `8px`.
- Between inline badges: `8px`.
- Form field vertical stack: `16px`.
- Button internal padding: `12px 24px` (medium), `16px 32px` (large).

---

## 4. Surface & Texture

### Cards
- Product cards: **NO border, NO shadow, NO background.** The product image IS the card. Text sits directly below.
- Feature/info cards: `1px solid #E5E7EB` border, `border-radius: 12px`, white background. No shadow.
- On hover: add `box-shadow: 0 1px 3px rgba(0,0,0,0.06)` -- whisper-light.

### Images
- Product images: white or `#F5F5F5` background. Consistent aspect ratios across the grid.
- Lifestyle images: full-bleed within their container, never with rounded corners.
- Image aspect ratio: `3:4` for product thumbnails (portrait), `16:9` for hero/lifestyle banners.

### Surfaces to Avoid
- Gradients on backgrounds. Zero tolerance.
- Glassmorphism. This is commerce, not a dashboard.
- Noise/grain textures. They interfere with product perception.
- Dark sections in the middle of the page. Dark hero OR dark footer, never both, never mid-page.

### Preferred Treatments
- Thin horizontal dividers (`1px solid #E5E7EB`) between sections instead of background color changes.
- Pill-shaped badges: `border-radius: 9999px`, `background: #F3F4F6`, `padding: 4px 12px`.
- Subtle top-border accent on the header: `3px solid {accent}` at the very top of `<body>`.

---

## 5. Animation

### Philosophy
Animation in commerce must be invisible. The user should never consciously notice a transition. Every animation serves orientation ("where did this come from?") or feedback ("my action registered").

### Transitions
- Button hover: `background-color 150ms ease`. No transform, no scale.
- Card hover: `box-shadow 200ms ease, transform 200ms ease` with `translateY(-2px)`.
- Link hover: `color 150ms ease`. Underline appears via `text-decoration` not a pseudo-element.
- Image hover (optional): `transform: scale(1.03)` over `400ms ease` with `overflow: hidden` on container.

### Page Load
- Fade in sections: `opacity 0 -> 1` over `300ms` with `translateY(8px) -> translateY(0)`.
- Stagger grid items by `50ms` each. Max 4 staggered items, then load the rest instantly.
- NEVER animate the hero. It should be immediately visible on load. No fade, no slide, no scale.

### Scroll Behavior
- No parallax. Period. Parallax signals "look at my website" which is the opposite of commerce intent.
- No scroll-triggered counters or number animations.
- Minimal intersection observer reveals: just opacity fade, `200ms`, triggered once.

### Prohibited
- Skeleton loaders that persist more than 800ms. Use a spinner or nothing.
- Carousel auto-play. Manual swipe/click only.
- Any animation longer than 400ms.
- Bouncing, shaking, or pulsing elements.

---

## 6. Component Conventions

### Buttons
- Primary: `background: {accent}`, `color: #FFFFFF`, `border-radius: 8px`, `font-weight: 600`, `font-size: 15px`.
- Secondary: `background: transparent`, `border: 1.5px solid #D1D5DB`, `color: #374151`, `border-radius: 8px`.
- Ghost: `background: transparent`, `color: {accent}`, `text-decoration: underline on hover`.
- Button height: `44px` minimum (touch target). Horizontal padding: `24px`.
- NEVER use rounded-full (pill) buttons for primary actions. Reserve pills for tags/filters.

### Navigation
- Sticky header, white background, `box-shadow: 0 1px 0 #E5E7EB` (just a bottom border via shadow).
- Height: `64px`. Logo left, links center, cart/account right.
- Mobile: hamburger menu. Slide-in from right, not a dropdown.
- Active link: `font-weight: 600` + accent color. No underline, no background highlight.

### Product Cards
- Image on top, text below. No overlay text on product images ever.
- Title: `font-size: 15px`, `font-weight: 500`, single line with `text-overflow: ellipsis`.
- Price below title: `font-size: 16px`, `font-weight: 600`.
- Color swatches: `20px` circles, `2px solid #E5E7EB` border, `2px` gap between circle and border for selected state.
- "Add to cart" only on hover or as a secondary action. Primary browse state is clean.

### Forms
- Input height: `44px`. Border: `1px solid #D1D5DB`. Border-radius: `8px`.
- Focus state: `border-color: {accent}`, `box-shadow: 0 0 0 3px rgba(accent, 0.1)`.
- Labels above inputs, `13px` weight `500`, `6px` margin-bottom.
- Error state: `border-color: #DC2626`, error message in `13px` `#DC2626` below the input.

### Trust Elements
- Star ratings inline with review count: ★★★★☆ (42 reviews).
- Shipping/return badges as a horizontal row of icon + text below the hero.
- Payment method logos in footer at `32px` height, desaturated (`filter: grayscale(1) opacity(0.5)`).

---

## 7. Anti-Patterns

1. **No hero video backgrounds.** Product commerce requires immediate scannability. Video steals focus.
2. **No asymmetric or masonry grids for products.** Uniform grid creates scannable rhythm. Masonry implies "gallery" not "shop."
3. **No full-width text blocks.** Max paragraph width: `640px`. Always.
4. **No color backgrounds behind product grids.** Products need neutral staging. Colored backgrounds compete.
5. **No icon-heavy feature sections.** If explaining product benefits, use product photos or simple text. Abstract icons dilute the message.
6. **No sticky "add to cart" bars on collection pages.** Only on PDP (product detail pages).
7. **No decorative shapes or blobs.** Circles, waves, and gradients are for SaaS landing pages. Commerce demands restraint.
8. **No "creative" scroll hijacking.** Standard scroll behavior only. Users are here to buy, not to admire.
9. **No testimonial carousels with auto-play.** Static grid of 2-3 reviews, or a simple scrollable row.
10. **No drop shadows on images.** Product photography should handle its own dimensionality.

---

## 8. Touchstones

### Allbirds (allbirds.com)
Clean product grid, restrained color, lifestyle imagery interspersed. Notice how they use one accent color and massive product photography to do all the work. The typography is invisible -- and that's the point.

### Glossier (glossier.com)
Soft but not precious. The pink accent is surgical. Product cards have zero decoration. Trust comes from whitespace and consistent image treatment, not from badges and icons.

### Apple Store (apple.com/store)
The gold standard. Product images on white, extreme typographic restraint, and a grid system so consistent you could set a watch to it. Note the total absence of "design flourishes."

### Everlane (everlane.com)
Transparency-focused commerce. Minimal UI, honest typography, and a pricing layout that builds trust through simplicity. Good reference for how to handle price/value messaging cleanly.

### Aesop (aesop.com)
Premium commerce without dark backgrounds or luxury cliches. Warm neutrals, impeccable spacing, and typography that signals quality through restraint rather than ornamentation.

---

## Variant Bias

```json
{
  "hero": {
    "layout": "split",
    "surface": "flat-white",
    "headlineStyle": "medium-tight",
    "ctaStyle": "solid-accent",
    "imagePosition": "right",
    "maxWidth": "1200px"
  },
  "features": {
    "layout": "3-col-grid",
    "cardStyle": "borderless",
    "iconUse": "none-or-minimal",
    "density": "tight"
  },
  "products": {
    "layout": "4-col-grid",
    "cardStyle": "image-top-text-below",
    "hoverBehavior": "lift-shadow",
    "imageRatio": "3:4"
  },
  "testimonials": {
    "layout": "static-row",
    "cardStyle": "bordered",
    "density": "compact"
  },
  "cta": {
    "layout": "centered-stack",
    "surface": "gray-50",
    "buttonStyle": "solid-accent-large"
  },
  "footer": {
    "layout": "4-col-links",
    "surface": "white-with-top-border",
    "density": "standard"
  },
  "global": {
    "borderRadius": "8px",
    "sectionPadding": "80px",
    "maxContentWidth": "1200px",
    "fontStack": "Inter, system-ui, sans-serif",
    "colorMode": "light-only"
  }
}
```

_When this mood is active, the render pipeline should suppress any dark section variants, disable parallax, enforce uniform grid layouts, and cap animation durations at 400ms._
