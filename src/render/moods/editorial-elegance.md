# Editorial Elegance

> Off-white warmth, serif authority, generous whitespace as a design element, film-grain texture, photography that earns its space.
> This is the aesthetic of objects you want to hold -- magazines, galleries, boutique brands.

**Trigger conditions:** `contentType: portfolio | editorial` + `tone: calm | formal`

---

## 1. Typography

### Headlines
- **Primary font:** `"Playfair Display", "Libre Baskerville", "Lora", Georgia, serif`
- **Alternative display:** `"Fraunces", "Newsreader", serif` for a more contemporary editorial feel
- Hero headline size: `clamp(44px, 8vw, 96px)`
- Section headline size: `clamp(28px, 4vw, 52px)`
- Weight: **700** for hero, **600** for section heads
- Letter-spacing: **-0.02em** on hero (serifs need less tightening than sans), **-0.01em** on section heads
- Line-height: **1.05** on hero, **1.15** on section heads
- Text-transform: **none** on display sizes, **uppercase** only for kickers/labels above headlines

### Body
- **Font:** `"Source Serif 4", "Literata", "Charter", Georgia, serif` for long-form
- **Alternative:** `"DM Sans", "Outfit", system-ui, sans-serif` if a serif-on-serif pairing feels heavy
- Size: `clamp(16px, 1.2vw, 19px)` -- editorial body is slightly larger than SaaS body
- Weight: **400**
- Line-height: **1.75** (generous -- this is a reading experience)
- Letter-spacing: **normal** (0)
- Color: `#2a2a2a` on light backgrounds -- not pure black, not gray
- Max paragraph width: `680px` (the optimal reading measure is 60-75 characters)

### Micro / Labels
- Font: `"DM Sans", "Outfit", system-ui, sans-serif` -- always sans-serif for labels
- Size: `11px` or `12px`
- Weight: **600**
- Letter-spacing: **0.08em**
- Text-transform: **uppercase**
- Color: `#8a8a8a`
- Use for: section labels (kickers), dates, categories, photo credits

### Pull Quotes
- Font: display serif, same as headlines
- Size: `clamp(24px, 3.5vw, 40px)`
- Weight: **400** italic
- Line-height: **1.35**
- Color: `#1a1a1a`
- Left border: `3px solid #1a1a1a` with `32px` left padding
- Or: centered with oversized curly quotes in `rgba(0,0,0,0.08)` as a decorative element

### Rules
- Serif headlines + serif body is acceptable and encouraged here
- Serif headlines + sans body is the safe pairing
- Never use monospace in this mood -- it breaks the editorial warmth
- Drop caps are acceptable on the first paragraph of a long-form section: `font-size: 3.5em; float: left; line-height: 0.8; margin-right: 8px`

---

## 2. Color Strategy

### Base Palette
- **Background:** `#f8f6f2` (warm off-white, like unbleached paper)
- **Surface-1:** `#ffffff` (cards, image containers -- pure white for contrast against warm bg)
- **Surface-2:** `#f0ede8` (recessed areas, alternating section bands)
- **Border:** `rgba(0, 0, 0, 0.08)` (1px, warm gray)
- **Text primary:** `#1a1a1a`
- **Text secondary:** `#555555`
- **Text muted:** `#8a8a8a`

### Accent
- **Primary accent:** muted, sophisticated hues only. Pick ONE:
  - Terracotta: `#c2714f`
  - Deep olive: `#5a6b4a`
  - Dusty rose: `#b5838d`
  - Ink navy: `#2c3e6b`
  - Burnt sienna: `#a0522d`
- **Accent usage rules:**
  1. Accent is used sparingly: links, one decorative element per section, the occasional rule/line
  2. Never use accent as a full button fill -- use `#1a1a1a` (near-black) for primary buttons instead
  3. Accent on hover states for links: text color shifts to accent
  4. Accent as a thin top-border on cards: `3px solid {accent}` or not at all
  5. Never more than **2 accent elements per viewport**

### Opacity Patterns
- Overlays on images: `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.50))` for text-over-image
- Hover states: `background: rgba(0, 0, 0, 0.03)` for subtle interaction feedback
- Disabled states: `opacity: 0.45`
- Decorative rules: `rgba(0, 0, 0, 0.12)`

### Image Treatment
- All photography should have a slight warm grade: `filter: saturate(0.92) contrast(1.02) sepia(0.04)`
- Aspect ratios: prefer `3:4` (portrait), `16:9` (landscape hero), or `1:1` (grid thumbnails)
- Image borders: none, but contained in `border-radius: 4px` containers
- Captions below images: sans-serif, `12px`, `#8a8a8a`, `8px` below image

---

## 3. Spacing

### Section Rhythm
- Section padding: `clamp(80px, 12vh, 160px)` top/bottom
- Hero section: `clamp(120px, 20vh, 240px)` top, `clamp(80px, 10vh, 140px)` bottom
- Between kicker label and headline: `16px`
- Between headline and body: `28px`
- Between body and CTA: `48px`
- Alternating sections should use `Surface-2` background to create visual rhythm without heavy dividers

### Grid
- Max content width: `1100px` for text-heavy pages, `1400px` for gallery/portfolio layouts
- Article body: single column, `680px` max-width, centered
- Feature grid: 2-column at desktop with generous `gap: 48px`
- Image grid: masonry or 3-column with `gap: 16px` (tighter -- images should feel curated)
- Side padding: `clamp(24px, 6vw, 120px)`

### Component Internal Spacing
- Card padding: `40px` on desktop, `28px` on mobile
- Button padding: `14px 28px` for default, `18px 40px` for hero CTA
- Input padding: `14px 18px`
- Tag padding: `6px 14px`
- Icon-to-text gap: `12px`

### Vertical Rhythm
- Use a `4px` base grid (editorial precision demands finer increments)
- Acceptable values: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96, 120, 160
- Paragraph spacing: `1.5em` (relative to body size)

---

## 4. Surface & Texture

### Preferred
- **Film grain overlay:** `background-image: url(...)` with a subtle noise texture at `opacity: 0.03` on the base background -- gives the warm paper feel
- **CSS grain alternative:** Use an SVG filter: `<feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3"/>` applied as a full-page pseudo-element at `opacity: 0.025`
- **Hairline rules:** `1px solid rgba(0,0,0,0.10)` to separate content blocks within sections (between articles in a list, for example)
- **Pull-quote left border:** `3px solid #1a1a1a` -- one of the few thick lines allowed
- **Image containers:** white background card with `box-shadow: 0 2px 20px rgba(0,0,0,0.06)` -- the only shadow in this aesthetic
- **Alternating section tints:** toggle between `#f8f6f2` and `#f0ede8` for visual rhythm

### Avoid
- Glass morphism / blur effects -- too tech-forward for editorial
- Any neon or electric colors
- Heavy box-shadows (max `rgba(0,0,0,0.06)` on image cards)
- Solid colored backgrounds behind sections (no blue/green/accent section bands)
- Rounded corners above `8px` -- this aesthetic prefers `2px` to `4px`
- Gradient backgrounds of any kind
- Dotted borders or dash patterns

### Border Radius Scale
- Buttons: `4px`
- Cards: `4px`
- Inputs: `4px`
- Badges: `2px` (sharp, not pill-shaped)
- Modals: `8px`
- Images: `2px` or `4px`

---

## 5. Animation

### Transitions
- Default transition: `all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)` (gentle ease)
- Hover on cards: no translate, just `box-shadow` deepens from `0 2px 20px rgba(0,0,0,0.06)` to `0 8px 40px rgba(0,0,0,0.10)`, `0.35s`
- Hover on links: color shifts to accent over `0.2s`, underline `opacity` fades from `0.3` to `1`
- Hover on images: subtle `scale(1.02)` inside an `overflow: hidden` container, `0.6s ease-out`
- Hover on buttons: `background` darkens slightly, `0.2s`

### Scroll Reveals
- Entrance: `opacity: 0 -> 1` + `translateY(30px) -> 0` over `0.7s` with `cubic-bezier(0.22, 1, 0.36, 1)` (smooth deceleration)
- Stagger children by `120ms` each, max stagger of `4` items
- Images: fade in with a slight `scale(1.03) -> scale(1)` for a "developing photo" feel, `0.8s`
- Trigger at `20%` from bottom of viewport
- Headlines can use a `clipPath: inset(0 0 100% 0) -> inset(0)` wipe-up reveal, `0.6s`

### Parallax
- Hero background image: parallax at `0.2` rate (very gentle drift)
- No parallax on text
- No parallax on cards -- they stay planted
- Large editorial images can have `0.1` parallax for depth

### Prohibited Animations
- No bounce or elastic easing -- this aesthetic is composed, not playful
- No horizontal slide-ins
- No scale-up entrances above `1.05`
- No animated gradients or color shifts
- No spinning, rotating, or flipping elements
- No typewriter text effects
- No counter/number animations

---

## 6. Component Conventions

### Cards
- Background: `#ffffff`
- Border: `1px solid rgba(0,0,0,0.08)` or no border (relying on shadow)
- Shadow: `0 2px 20px rgba(0,0,0,0.06)`
- Padding: `0` if image-topped (image bleeds to edges), `40px` for text-only cards
- Border-radius: `4px`
- Image inside card: full-width at top, `aspect-ratio: 3/2`
- Title below image: `20px` padding-top from image, serif, `20px`, `600` weight
- Description: `14px`, `#555555`, `1.6` line-height

### Buttons
- **Primary:** `background: #1a1a1a; color: #f8f6f2; font-weight: 600; border-radius: 4px`
- **Secondary:** `background: transparent; color: #1a1a1a; border: 1.5px solid #1a1a1a; border-radius: 4px`
- **Text link:** `color: {accent}; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: {accent}50`
- Height: `44px` default, `52px` hero CTA
- Font-size: `14px` for default, `15px` for hero CTA
- Font-family: sans-serif for buttons, never serif
- Letter-spacing: `0.02em`

### Navigation
- Static or sticky (not fixed -- let it scroll away on editorial pages to maximize reading space)
- Background: `#f8f6f2` with `border-bottom: 1px solid rgba(0,0,0,0.08)`
- Height: `72px`
- Logo left (wordmark preferred over icon), links right
- Links: sans-serif, `13px`, `600` weight, `0.04em` tracking, uppercase, `#555555`
- Hover: color to `#1a1a1a`
- Mobile: centered logo, hamburger menu, full-screen overlay with large serif links

### Forms
- Input background: `#ffffff`
- Border: `1.5px solid rgba(0,0,0,0.15)`
- Focus border: `#1a1a1a`
- Focus ring: none (the border change is sufficient -- minimal)
- Label: sans-serif, `12px`, `600` weight, `0.06em` tracking, uppercase, `#555555`
- Placeholder: `#b0b0b0`
- Border-radius: `4px`

### Image Gallery
- Grid: masonry layout preferred, or uniform `3:2` ratio grid
- Gap: `12px` to `16px`
- Hover: slight warm overlay `rgba(0,0,0,0.05)` + cursor change
- Lightbox: full-screen with `#1a1a1a` background, image centered, caption below

---

## 7. Anti-Patterns

**Never do these in Editorial Elegance:**

1. **Never use neon or electric accent colors** -- this palette is warm and muted. If a color would look at home on a rave flyer, it does not belong here.
2. **Never use monospace fonts** -- they signal code/tech, which contradicts the editorial character.
3. **Never use full-width colored section backgrounds** -- variation comes from warm/cool white alternation and whitespace, not blocks of color.
4. **Never use pill-shaped badges or buttons** (`border-radius: 999px`) -- keep corners crisp at `2px` to `4px`.
5. **Never center-align long body text** -- always left-align. Center-align only headlines and very short descriptors (under 15 words).
6. **Never use icon grids as the primary feature display** -- this aesthetic prefers photography and typography. If icons are needed, use fine-stroke editorial illustrations, not filled icon sets.
7. **Never use glass morphism or blur effects** -- transparency and blur read as tech UI, not print.
8. **Never stack cards in a single column on desktop** -- editorial layouts use asymmetric grids, side-by-side layouts, and magazine-style compositions. Single-column card stacks look like a blog feed.
9. **Never auto-play video** -- editorial respects the reader's pace. Video should be click-to-play with a tasteful poster frame.
10. **Never use emoji, ASCII art, or decorative Unicode** -- the only decorative elements are typography itself, photography, and whitespace.

---

## 8. Touchstones

### Monocle (monocle.com)
- The definitive editorial web experience
- Note: their use of serif headlines over clean sans body, the warmth of their off-white, and how photos carry every page
- Study: the disciplined grid, consistent gutter widths, and how sections breathe

### Cereal Magazine (readcereal.com)
- Reference for: extreme whitespace as a luxury signal
- Note: how little is on each viewport -- one headline, one image, one paragraph. That restraint IS the design.
- Study: their typography scale and the quiet confidence of undersized body text

### Aesop (aesop.com)
- Reference for: warm palette, muted photography, and how a single brand color (terracotta/olive) can anchor an entire site
- Note: their product pages -- photography does all the work, text is secondary
- Study: form styling, button design, and how they handle e-commerce without looking commercial

### Kinfolk (kinfolk.com)
- Reference for: the intersection of editorial and lifestyle branding
- Note: their use of oversized serif headlines with generous leading
- Study: how they balance image-heavy layouts without feeling cluttered

### Italic Type Foundry (italic.space)
- Reference for: how type can BE the visual content
- Note: their specimen pages show what confident serif typography looks like at scale
- Study: letter-spacing decisions, line-height on display sizes, and weight contrast

---

## Variant Bias

```json
{
  "hero": {
    "layout": "text-image-split",
    "surface": "warm-offwhite",
    "headlineStyle": "serif-display",
    "headlineSize": "clamp(44px, 8vw, 96px)",
    "headlineWeight": 700,
    "headlineTracking": "-0.02em",
    "subheadColor": "#555555",
    "ctaStyle": "solid-dark",
    "backgroundTreatment": "grain-texture"
  },
  "features": {
    "layout": "2-col-asymmetric",
    "cardStyle": "image-topped-shadow",
    "cardPadding": "40px",
    "iconStyle": "none-use-photography",
    "gap": "48px"
  },
  "cta": {
    "layout": "centered-minimal",
    "surface": "surface-2-warm",
    "headlineSize": "clamp(28px, 4vw, 48px)",
    "buttonStyle": "solid-dark"
  },
  "nav": {
    "style": "static-clean",
    "height": "72px",
    "linkFont": "sans-uppercase"
  },
  "footer": {
    "layout": "2-col-minimal",
    "surface": "base-warm",
    "textColor": "#8a8a8a"
  },
  "global": {
    "maxWidth": "1100px",
    "sectionPadding": "clamp(80px, 12vh, 160px)",
    "borderRadius": "4px",
    "fontBody": "Source Serif 4",
    "fontDisplay": "Playfair Display",
    "density": "spacious-editorial"
  }
}
```
