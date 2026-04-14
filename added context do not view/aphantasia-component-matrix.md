# Aphantasia — Component Variant Matrix

> Reference for Claude Code sessions building section components.
> Every section implements content props + variant props.
> Shared design treatments (surfaces, card styles, headline styles) are CSS utilities, not per-component.

---

## Image Handling in Sections

Sections that accept `imageSrc` props must handle three states:
1. **No image** → render a beautiful gradient placeholder (not a broken image icon, not blank space)
2. **Base64 data URL** → render the actual image (preview mode, image dropped on canvas)
3. **Relative path** (`/assets/filename.jpg`) → render from path (export mode, after rewrite)

The gradient placeholder should use `var(--surface)` → `var(--accent)` at low opacity, with a subtle label ("Image" in small caps, very muted). It should feel intentional, not broken.

Image shapes placed inside a frame are **content images** — they render in the section they're spatially associated with. Image shapes outside the frame connected via a line are **context images** — they feed style reference to the AI, they don't render as content.

---

## Shared Design Treatments

These are CSS utility classes available to ALL sections. Build these first as the foundation.

### Surface Treatments (`.aph-surface-*`)

| Class | Visual | CSS |
|-------|--------|-----|
| `aph-surface-flat` | Solid background color (var(--background) or var(--surface-alt)) | Clean, no effects |
| `aph-surface-gradient-mesh` | Soft multi-color gradient (accent tints) | radial-gradient with 2–3 color stops, very low opacity |
| `aph-surface-grain` | Subtle noise/grain texture overlay | ::after pseudo with SVG noise filter at 3–5% opacity |
| `aph-surface-glass` | Glassmorphism: frosted blur + border | backdrop-filter: blur(16px), semi-transparent bg, 1px border |
| `aph-surface-accent-wash` | Full accent color as background (inverted text) | var(--accent) bg, var(--accent-foreground) text |

### Card Styles (`.aph-card-*`)

| Class | Visual |
|-------|--------|
| `aph-card-elevated` | White/surface bg, subtle box-shadow, no border |
| `aph-card-bordered` | Transparent bg, 1px border, no shadow |
| `aph-card-glass` | Glassmorphism card: blur, semi-transparent, border |
| `aph-card-flat` | Surface bg, no shadow, no border (relies on bg contrast) |
| `aph-card-accent-top` | Flat card + 3px solid accent top border |

### Headline Styles (`.aph-headline-*`)

| Class | Visual |
|-------|--------|
| `aph-headline-oversized` | clamp(52px, 10vw, 120px), -0.04em tracking, 800 weight |
| `aph-headline-balanced` | clamp(36px, 6vw, 72px), -0.02em tracking, 700 weight |
| `aph-headline-editorial` | serif font (Playfair Display), clamp(40px, 7vw, 84px), 400 weight, 0em tracking |
| `aph-headline-gradient` | Same as oversized + background-clip text gradient (accent → foreground) |

### Animation Classes (`.aph-anim-*`)

| Class | Behaviour |
|-------|-----------|
| `aph-reveal` | IntersectionObserver fade-up (opacity 0→1, translateY 30→0) |
| `aph-stagger` | Same as reveal but children stagger 0.1s each |
| `aph-hover-lift` | translateY(-4px) + shadow increase on hover |
| `aph-hover-glow` | box-shadow accent glow on hover |

---

## Section Components (18)

### 1. Nav

| Variant Prop | Options |
|-------------|---------|
| `layout` | `standard` · `centered-logo` · `minimal` · `mega-menu` |
| `style` | `transparent` · `solid` · `glass` |

**Content props**: `logo`, `links[]`, `cta`, `ctaHref`

**Standard**: Logo left, links center/right, CTA button right. Sticky, backdrop-blur.
**Centered-logo**: Logo centered, links split left/right.
**Minimal**: Logo left, hamburger right (always collapsed).
**Transparent**: No background, blends with hero. Becomes solid on scroll.
**Glass**: Glassmorphism nav bar.

---

### 2. Hero

| Variant Prop | Options |
|-------------|---------|
| `layout` | `centered` · `left-aligned` · `split-image-right` · `split-image-left` · `full-bleed` |
| `surface` | All 5 shared surfaces |
| `headlineStyle` | All 4 shared headline styles |
| `density` | `spacious` · `balanced` · `compact` |

**Content props**: `headline`, `subheadline`, `cta`, `ctaSecondary`, `badge`, `ctaHref`, `ctaSecondaryHref`

**Centered**: Text centered, stacked vertically. Most common pattern.
**Left-aligned**: Text left, optional decorative element right. Editorial feel.
**Split-image-right**: 50/50 grid, text left, image/placeholder right.
**Split-image-left**: Mirror of above.
**Full-bleed**: Full-width background image/gradient with overlaid text.

---

### 3. Feature Grid

| Variant Prop | Options |
|-------------|---------|
| `layout` | `card-grid` · `bento` · `icon-list` · `alternating-rows` · `numbered` |
| `cardStyle` | All 5 shared card styles |
| `iconTreatment` | `accent-bg-circle` · `accent-text` · `outlined` · `none` |
| `columns` | `2` · `3` · `4` |

**Content props**: `title`, `subtitle`, `features[]` (each: `icon`, `heading`, `body`, `cta`)

**Card-grid**: Equal cards in a CSS grid. The default.
**Bento**: First card spans 2 columns or rows. Asymmetric grid.
**Icon-list**: Vertical list, icon left, text right. No cards. Clean.
**Alternating-rows**: Full-width rows alternating icon position left/right.
**Numbered**: Sequential list with large numbers (01, 02, 03) instead of icons.

---

### 4. Text + Image Split

| Variant Prop | Options |
|-------------|---------|
| `layout` | `image-right` · `image-left` · `image-overlap` · `image-full-bleed` |
| `imageStyle` | `rounded` · `sharp` · `browser-frame` · `phone-frame` |

**Content props**: `heading`, `body`, `cta`, `ctaHref`, `imageSrc`, `imageAlt`

**Image-overlap**: Image overlaps section edge / previous section slightly.
**Browser-frame**: Image wrapped in a browser chrome mockup.
**Phone-frame**: Image wrapped in a phone mockup (great for app screenshots).

---

### 5. CTA Section

| Variant Prop | Options |
|-------------|---------|
| `layout` | `centered` · `split` · `inline-bar` |
| `surface` | `accent-wash` · `gradient-mesh` · `glass` · `inverted` |
| `intensity` | `bold` · `subtle` |

**Content props**: `heading`, `subheading`, `cta`, `ctaSecondary`, `ctaHref`, `ctaSecondaryHref`

**Inverted surface**: Uses var(--foreground) as background (dark sections on light sites, light on dark).
**Bold intensity**: Larger text, more padding, stronger visual weight.
**Inline-bar**: Horizontal layout with text left, button right (smaller, more integrated).

---

### 6. Footer

| Variant Prop | Options |
|-------------|---------|
| `layout` | `columns` · `simple` · `centered` · `mega` |
| `style` | `subtle` · `bordered-top` · `contrasting` |

**Content props**: `logo`, `tagline`, `columns[]` (each: `heading`, `links[]`), `copyright`, `socialLinks[]`

**Columns**: Multi-column links with brand in first column. Standard.
**Simple**: Single line: logo + links + copyright. Minimal.
**Centered**: Everything centered, stacked vertically.
**Mega**: Large footer with newsletter signup integrated + multiple link columns.
**Contrasting**: Uses surface-alt or inverted background to clearly separate from content.

---

### 7. Portfolio Showcase

| Variant Prop | Options |
|-------------|---------|
| `layout` | `grid-uniform` · `grid-masonry` · `carousel` · `list-detailed` |
| `hoverEffect` | `overlay-title` · `zoom` · `tilt` · `none` |

**Content props**: `title`, `subtitle`, `items[]` (each: `title`, `description`, `tags[]`, `imageSrc`, `link`)

**Grid-uniform**: Equal-size cards in a grid. Clean.
**Grid-masonry**: Varied heights. More editorial.
**Carousel**: Horizontal scroll with snap points.
**List-detailed**: Vertical list with large image + title + description per row.

Images are critical for this section — portfolio without images is broken. When `imageSrc` is present, render the actual image. When absent, render a gradient placeholder that still looks intentional.

---

### 8. E-commerce Grid

| Variant Prop | Options |
|-------------|---------|
| `layout` | `card-grid` · `horizontal-scroll` · `featured-plus-grid` |
| `cardStyle` | All 5 shared card styles |
| `priceStyle` | `bold` · `inline` · `badge` |

**Content props**: `title`, `subtitle`, `products[]` (each: `name`, `price`, `description`, `badge`, `imageSrc`, `cta`)

**Featured-plus-grid**: First product is large/hero, remaining in grid below.

---

### 9. Event Signup

| Variant Prop | Options |
|-------------|---------|
| `layout` | `split-details-form` · `centered-card` · `banner` |
| `surface` | All 5 shared surfaces |

**Content props**: `eventName`, `date`, `location`, `description`, `cta`, `capacity`

**Split-details-form**: Details left, signup form right.
**Centered-card**: Everything in a single elevated card, centered.
**Banner**: Full-width with details inline and CTA button.

---

### 10. Generic Section

| Variant Prop | Options |
|-------------|---------|
| `layout` | `centered-text` · `left-text` · `split` |
| `surface` | All 5 shared surfaces |

**Content props**: `heading`, `body`, `cta`, `ctaHref`

Fallback for unrecognised shapes. Should look good as a simple text section.

---

### 11. Pricing Table ✦ NEW

| Variant Prop | Options |
|-------------|---------|
| `layout` | `cards-row` · `cards-highlighted` · `comparison-table` · `toggle-annual` |
| `cardStyle` | All 5 shared card styles |
| `highlightStyle` | `scale-up` · `accent-border` · `accent-bg` · `badge` |

**Content props**: `title`, `subtitle`, `tiers[]` (each: `name`, `price`, `period`, `description`, `features[]`, `cta`, `highlighted`, `badge`)

**Cards-highlighted**: Middle card is visually promoted (scale, border, or badge).
**Comparison-table**: Horizontal table with features as rows, tiers as columns.
**Toggle-annual**: Cards with monthly/annual toggle that updates prices.

---

### 12. Testimonials ✦ NEW

| Variant Prop | Options |
|-------------|---------|
| `layout` | `cards-grid` · `carousel` · `single-featured` · `avatar-wall` |
| `cardStyle` | All 5 shared card styles + `quote-mark` |

**Content props**: `title`, `subtitle`, `items[]` (each: `quote`, `author`, `role`, `company`, `rating`)

**Single-featured**: One large quote with name/photo. Rotates or is static.
**Avatar-wall**: Small circular avatars with names, quote appears on hover/tap.
**Quote-mark**: Card with oversized opening quote mark as decorative element.

---

### 13. Logo Cloud ✦ NEW

| Variant Prop | Options |
|-------------|---------|
| `layout` | `single-row` · `double-row` · `marquee-scroll` · `grid` |
| `style` | `grayscale` · `color` · `monochrome` |

**Content props**: `title`, `logos[]` (each: `name`, `url`, `imageSrc`)

**Marquee-scroll**: Infinite horizontal scroll animation. Eye-catching.
**Grayscale**: Logos desaturated. Professional, doesn't compete with content.
**Monochrome**: All logos rendered in foreground color. Cleanest.

When `imageSrc` is present on a logo, render the actual image. When absent, render the logo `name` as a styled text badge — still looks polished. This means the section works with zero images (text-only logos) and progressively improves as images are added.

---

### 14. Stats / Metrics ✦ NEW

| Variant Prop | Options |
|-------------|---------|
| `layout` | `big-numbers` · `icon-stats` · `inline-bar` · `cards` |

**Content props**: `title`, `stats[]` (each: `value`, `label`, `prefix`, `suffix`)

**Big-numbers**: Massive numerals (clamp(48px, 8vw, 96px)) with small labels beneath.
**Icon-stats**: Each stat has an icon, value, and label in a card.
**Inline-bar**: Horizontal bar with stats evenly spaced. Minimal.
**Cards**: Each stat in its own card. Good for 3–4 metrics.

---

### 15. Newsletter Signup ✦ NEW

| Variant Prop | Options |
|-------------|---------|
| `layout` | `inline-bar` · `centered-card` · `split-with-copy` · `minimal` |
| `surface` | All 5 shared surfaces |

**Content props**: `headline`, `subtext`, `placeholder`, `cta`, `privacyNote`

**Inline-bar**: Single line: input field + button. Compact. Can sit between sections.
**Centered-card**: Card with headline, subtext, input, button. Standalone section.
**Split-with-copy**: Text/value prop left, signup form right.
**Minimal**: Just an input and button with tiny label. Almost invisible.

Form is visual-only in preview. No backend.

---

### 16. FAQ / Accordion ✦ NEW

| Variant Prop | Options |
|-------------|---------|
| `layout` | `accordion` · `two-column` · `cards` · `inline` |

**Content props**: `title`, `subtitle`, `items[]` (each: `question`, `answer`)

**Accordion**: Click-to-expand. Classic pattern. Uses CSS-only `<details>/<summary>`.
**Two-column**: Questions in left column, answers in right. Desktop only, stacks on mobile.
**Cards**: Each Q&A in its own card, all visible. Good for <6 items.
**Inline**: No cards or borders. Just alternating Q (bold) and A (regular). Minimal.

---

### 17. Team Grid ✦ NEW

| Variant Prop | Options |
|-------------|---------|
| `layout` | `photo-grid` · `card-grid` · `list` · `minimal` |

**Content props**: `title`, `subtitle`, `members[]` (each: `name`, `role`, `bio`, `avatar`)

**Photo-grid**: Large photos with name/role overlay on hover.
**Card-grid**: Cards with photo, name, role, short bio.
**List**: Horizontal rows with photo left, info right. Compact.
**Minimal**: Names + roles only, no photos. Clean for small teams.

Avatars use the actual image when `avatar` (imageSrc) is provided. When absent, render a gradient circle with the person's initials — looks intentional, not broken.

---

### 18. Comparison Table ✦ NEW

| Variant Prop | Options |
|-------------|---------|
| `layout` | `table` · `cards-side-by-side` · `checklist` |
| `highlightStyle` | `column-accent` · `badge` · `checkmark-color` |

**Content props**: `title`, `subtitle`, `us` (name + features), `them` (name + features)

**Table**: Standard comparison table. Us column highlighted.
**Cards-side-by-side**: Two cards, us with accent treatment, them muted.
**Checklist**: Feature list with ✓/✗ per column. Clean.

---

## Build Priority

Build in this order. Each group is testable end-to-end.

**Group 1 — Shared foundations (Day 1)**
Surfaces, card styles, headline styles, animation utilities, theme preset CSS.

**Group 2 — Core page sections (Days 2–4)**
Nav, Hero, Feature Grid, Text+Image Split, CTA, Footer.
These 6 cover the minimum viable landing page.

**Group 3 — Conversion sections (Days 5–6)**
Pricing, Testimonials, Logo Cloud, Stats, Newsletter Signup.
These are what make a site feel complete and conversion-ready.

**Group 4 — Supporting sections (Day 7)**
FAQ, Team Grid, Comparison Table, Portfolio, E-commerce, Event Signup, Generic.
Lower priority but rounds out the library.

Each section: implement 1 default layout first, then add remaining variants. Don't try to build all variants for all sections before moving to the next section. Get the defaults working end-to-end, then layer in variants.

---

*Component Variant Matrix — 2026-03-18*
