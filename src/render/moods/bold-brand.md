# Bold Brand

> Vibrant accent that refuses to be ignored, oversized sans-serif headlines that crowd the viewport, tight spacing that creates density, high-energy compositions.
> This is the aesthetic of products that launch at full volume.

**Trigger conditions:** `contentType: saas` + `tone: playful | urgent`

---

## 1. Typography

### Headlines
- **Primary font:** `"Satoshi", "General Sans", "Plus Jakarta Sans", system-ui, sans-serif`
- **Alternative display:** `"Cabinet Grotesk", "Clash Display", sans-serif` for extra geometric punch
- Hero headline size: `clamp(56px, 12vw, 140px)` -- go bigger than you think
- Section headline size: `clamp(36px, 6vw, 72px)`
- Weight: **800** or **900** for hero (extra-bold is the point), **700** for section heads
- Letter-spacing: **-0.05em** on hero (extremely tight, letters nearly touching), **-0.03em** on section heads
- Line-height: **0.90** on hero (lines overlapping slightly is intentional), **1.05** on section heads
- Text-transform: **none** by default, but **uppercase** hero headlines are acceptable here (unlike other moods)

### Body
- **Font:** `"Inter", "DM Sans", "Outfit", system-ui, sans-serif`
- Size: `clamp(15px, 1.1vw, 17px)` -- body is compact, not luxurious
- Weight: **400** for body, **600** for emphasis
- Line-height: **1.55** (tighter than editorial -- energy, not comfort)
- Letter-spacing: **-0.01em**
- Color: context-dependent -- `#2a2a2a` on light, `rgba(255,255,255,0.80)` on dark surfaces

### Micro / Labels
- Font: same sans as body
- Size: `12px` or `13px`
- Weight: **700**
- Letter-spacing: **0.04em**
- Text-transform: **uppercase**
- Color: accent color itself (labels are colored in this mood)
- Use for: section kickers, badge text, nav items, pill labels

### Display Numbers / Stats
- Font: display sans (same as headlines)
- Size: `clamp(48px, 10vw, 120px)`
- Weight: **900**
- Letter-spacing: **-0.05em**
- Color: accent color
- Use for: stat counters, pricing, hero metrics
- Can optionally use a gradient fill: `background: linear-gradient(135deg, {accent-1}, {accent-2}); -webkit-background-clip: text`

### Rules
- One font family for everything is acceptable here -- weight contrast does the work
- Headlines should feel like they might not fit -- crowding the container is intentional
- Line-clamp or text-overflow is fine; let text be cut off at viewport edges for visual tension
- Bold weights below `700` do not exist in this mood

---

## 2. Color Strategy

### Base Palette (Light variant)
- **Background:** `#ffffff` (crisp white -- not warm, not cool, just clean)
- **Surface-1:** `#f5f5f5` (light gray cards)
- **Surface-2:** `{accent}08` (accent-tinted surface for feature sections)
- **Border:** `rgba(0, 0, 0, 0.10)` on light surfaces
- **Text primary:** `#111111`
- **Text secondary:** `#555555`
- **Text muted:** `#999999`

### Base Palette (Dark variant -- for alternating sections)
- **Background:** `#111111`
- **Surface-1:** `#1c1c1c`
- **Border:** `rgba(255, 255, 255, 0.10)`
- **Text primary:** `#ffffff`
- **Text secondary:** `rgba(255, 255, 255, 0.70)`

### Accent
- **Primary accent:** vibrant and unapologetic. Pick ONE pair (primary + complement):
  - Electric purple + hot pink: `#7c3aed` / `#ec4899`
  - Saturated blue + cyan: `#2563eb` / `#06b6d4`
  - Neon orange + warm yellow: `#f97316` / `#eab308`
  - Vivid coral + peach: `#f43f5e` / `#fb923c`
  - Lime + emerald: `#84cc16` / `#10b981`
- **Accent usage rules:**
  1. Accent is NOT subtle. It fills entire buttons, banners, and badge backgrounds at full saturation.
  2. Accent-on-white and accent-on-black are both acceptable -- check contrast.
  3. Two-color gradients using the accent pair are encouraged: `linear-gradient(135deg, {accent-1}, {accent-2})`
  4. Accent fills behind sections: acceptable for one section per page at `{accent}` full saturation with white text
  5. Accent as headline color: permitted for one headline per page, especially stat numbers

### Gradient Rules
- **Hero gradient background:** `linear-gradient(135deg, {accent-1}, {accent-2})` behind the entire hero is acceptable
- **Text gradient:** `background: linear-gradient(135deg, {accent-1}, {accent-2}); -webkit-background-clip: text` on the hero headline
- **Button gradient:** primary CTA can use the accent gradient
- **Gradient blobs:** large, soft-edged circles of accent color at `opacity: 0.15` placed asymmetrically behind content sections
- Limit to **2 gradient uses per page** -- even bold has a ceiling

### Contrast Rules
- This mood frequently alternates light and dark sections -- every other section can invert
- When a section has an accent background, text must be white or `#111111` depending on accent lightness
- Always verify WCAG AA contrast: accent colors on white often fail -- add a dark text option

---

## 3. Spacing

### Section Rhythm
- Section padding: `clamp(64px, 10vh, 120px)` top/bottom -- tighter than the other moods
- Hero section: `clamp(80px, 15vh, 180px)` top, `clamp(60px, 8vh, 120px)` bottom
- Between headline and body: `16px` (tight -- keep elements in proximity)
- Between body and CTA: `32px`
- Sections should feel dense and packed, not airy

### Grid
- Max content width: `1400px` (wider -- this mood uses the full viewport)
- Feature grid: 3 or 4 columns at desktop, `gap: 20px` (tight grid = energy)
- Card grid: `gap: 16px` (cards nearly touching)
- Side padding: `clamp(16px, 4vw, 64px)` -- less side padding, more content

### Component Internal Spacing
- Card padding: `24px` on desktop, `20px` on mobile
- Button padding: `14px 28px` for default, `18px 36px` for hero CTA
- Input padding: `12px 16px`
- Badge padding: `6px 14px`
- Icon-to-text gap: `8px`

### Vertical Rhythm
- Use an `8px` base grid
- Acceptable values: 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120
- Prefer the lower end -- when in doubt, go tighter

### Overflow & Bleed
- Headlines can bleed past their container on mobile -- `overflow: visible` with `translateX(-8px)`
- Images can bleed to viewport edges (full-bleed) in alternating sections
- Accent gradient blobs should extend beyond their section boundaries

---

## 4. Surface & Texture

### Preferred
- **Flat, bold-colored surfaces:** accent-colored sections, fully saturated, no transparency
- **Soft gradient blobs:** large `300px-600px` circles of accent color at `opacity: 0.12`, placed off-center behind content using `position: absolute; filter: blur(100px)`
- **Solid card backgrounds with color:** cards can be `#f5f5f5`, `{accent}06`, or `#111111` -- mix card colors within a grid for variety
- **Thick accent borders:** `3px solid {accent}` on featured cards or callout boxes
- **Pill-shaped elements everywhere:** badges, tags, buttons, even nav links can be pill-shaped
- **Emoji and illustrations welcome:** playful inline emoji in headlines, abstract blob illustrations, geometric shapes as decorative elements

### Avoid
- Film grain or noise texture -- too subtle for this energy level
- Glass morphism -- too delicate
- Hairline borders below `1.5px` -- this mood uses visible, confident borders or none at all
- Muted or desaturated colors on any surface
- Drop shadows as the primary card elevation mechanism -- use color contrast or thick borders instead
- Anything that reads as "refined" or "quiet"

### Border Radius Scale
- Buttons: `999px` (full pill is the default here)
- Cards: `16px` (noticeably rounded)
- Inputs: `12px`
- Badges: `999px`
- Modals: `20px`
- Images: `12px` or `16px`
- Icon containers: `12px`

---

## 5. Animation

### Transitions
- Default transition: `all 0.15s cubic-bezier(0.4, 0, 0.2, 1)` (snappy -- faster than other moods)
- Hover on cards: `scale(1.02)` + `box-shadow: 0 8px 30px rgba(0,0,0,0.12)`, `0.2s`
- Hover on buttons: `scale(1.05)` + `box-shadow: 0 4px 20px {accent}40`, `0.15s`
- Hover on links: color snap to accent (no fade -- instant), underline thickness increases from `1px` to `2px`
- Active (mousedown) on buttons: `scale(0.97)`, `0.1s` -- satisfying press feedback

### Scroll Reveals
- Entrance: `opacity: 0 -> 1` + `translateY(40px) -> 0` over `0.4s` with `cubic-bezier(0.16, 1, 0.3, 1)` (fast spring)
- Stagger children by `60ms` each, max stagger of `6` items
- Trigger at `10%` from bottom of viewport (trigger early -- things should already be animating when you see them)
- `scale(0.95) -> scale(1)` is acceptable for card entrances in this mood
- Headline words can stagger individually for a kinetic reveal

### Parallax
- Hero: gradient blobs parallax at `0.4` rate
- Large accent circles behind sections: `0.2` parallax
- Background geometric shapes (if used): `0.3` parallax
- No parallax on text or cards

### Micro-interactions
- Button press: `scale(0.97)` then `scale(1.05)` on release -- spring effect
- Toggle/checkbox: accent color fill with `0.2s` and overshoot easing `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Cursor follower: a `20px` accent-colored dot that trails the cursor on the hero section at `opacity: 0.3` (optional, but fits the mood)
- Number counters: animate from 0 to value on scroll reveal, `1.2s` with `cubic-bezier(0.16, 1, 0.3, 1)`
- Marquee/ticker: infinite horizontal scroll of logos or testimonials at `40px/s`, pause on hover

### Encouraged Effects
- Slight rotation on card hover: `rotate(0.5deg)` -- just enough to feel alive
- Gradient shift on hero hover: `background-position` animates slowly
- Elastic button bounce on click
- Confetti or particle burst on successful form submission (optional, tasteful)

---

## 6. Component Conventions

### Cards
- Background: `#f5f5f5` or `{accent}06` or solid accent for featured cards
- Border: none, or `3px solid {accent}` for emphasis
- Shadow: `0 4px 20px rgba(0,0,0,0.08)` at rest, `0 8px 30px rgba(0,0,0,0.12)` on hover
- Padding: `24px`
- Border-radius: `16px`
- Icon/emoji at top: `32px` or larger, can be a colored circle background `{accent}15` with centered icon
- Title: `20px`, `700` weight, `#111111`
- Description: `14px`, `#555555`, `1.55` line-height
- On hover: `scale(1.02)` + shadow deepens

### Buttons
- **Primary:** `background: linear-gradient(135deg, {accent-1}, {accent-2}); color: #fff; font-weight: 700; border-radius: 999px`
- **Primary alt:** `background: {accent-1}; color: #fff; border-radius: 999px` (solid, no gradient)
- **Secondary:** `background: #111111; color: #ffffff; border-radius: 999px`
- **Outline:** `background: transparent; color: {accent-1}; border: 2px solid {accent-1}; border-radius: 999px`
- Height: `44px` default, `56px` hero CTA (chonky)
- Font-size: `15px` for default, `17px` for hero CTA
- Letter-spacing: `-0.01em`
- Icon inside button: `18px`, `8px` gap
- Shadow on primary: `0 4px 15px {accent-1}30`

### Navigation
- Fixed top, white background or transparent-to-white on scroll
- Height: `64px`
- Border-bottom: none at top (transparent), `1px solid rgba(0,0,0,0.08)` after scroll
- Logo left (icon + wordmark), links center, CTA right (pill button in accent)
- Links: `14px`, `600` weight, `#555555`, no underline
- Hover: color to `#111111`
- Active page: `{accent}` text color + `{accent}15` pill background behind link
- Mobile: bottom sheet or full-screen overlay with large centered links + accent CTA

### Forms
- Input background: `#f5f5f5`
- Border: `2px solid transparent` at rest
- Focus border: `2px solid {accent-1}`
- Focus ring: `0 0 0 4px {accent-1}15`
- Label: `13px`, `700` weight, `#111111`
- Placeholder: `#999999`
- Border-radius: `12px`
- Newsletter input + button combo: input and button side by side in a `4px` padded container with `border-radius: 999px`, button inside the container

### Badges / Tags
- Background: `{accent-1}` full saturation
- Text: `#ffffff`
- Padding: `6px 14px`
- Border-radius: `999px`
- Font: `12px`, `700` weight, `0.02em` tracking
- Variant: outline badge -- `border: 2px solid {accent-1}; color: {accent-1}; background: transparent`

### Stats / Metrics
- Number: display font, `clamp(48px, 10vw, 96px)`, `900` weight, accent gradient text
- Label below: `14px`, `600` weight, `#555555`, uppercase, `0.04em` tracking
- Layout: 3 or 4 columns, tight gap `24px`
- Divider between stats: `1px solid rgba(0,0,0,0.10)` vertical line

### Logo Cloud
- Grayscale at `opacity: 0.45`, hover to `opacity: 1` with color
- Layout: flex row, `gap: 48px`, centered, with marquee animation for overflow
- Logo size: `32px` height max

---

## 7. Anti-Patterns

**Never do these in Bold Brand:**

1. **Never use thin font weights (100-400) for headlines** -- the minimum headline weight is `700`. This mood is about impact, not elegance.
2. **Never use serif fonts** -- serifs signal tradition and formality. This mood is forward, geometric, and energetic.
3. **Never use muted or pastel accent colors** -- if the accent color could be described as "dusty" or "muted," it is wrong. Saturation should be at or near maximum.
4. **Never leave more than `120px` of empty space between sections** -- density creates energy. Excessive whitespace makes this mood feel underfilled.
5. **Never use `border-radius: 0` or `2px`** -- sharp corners read as corporate or editorial. Minimum radius is `12px` for containers, `999px` for buttons and badges.
6. **Never use a single-column layout for feature sections** -- always at least 2 columns, preferably 3-4. Single-column reads as a blog post.
7. **Never underline links with a thin 1px line** -- if links are underlined, use `2px` minimum or a colored underline. Better yet, use color change alone.
8. **Never use black-and-white photography** -- photos should be vibrant and saturated, or use a duotone filter with the accent colors.
9. **Never put all content in the center** -- mix centered and left-aligned sections. Asymmetry creates dynamism.
10. **Never use gray for primary CTAs** -- every primary CTA is accent-colored. Gray CTAs signal uncertainty, which is the opposite of this mood.

---

## 8. Touchstones

### Notion Marketing (notion.so)
- Reference for: how to combine playful illustration with confident typography
- Note: their use of a single accent color that appears everywhere -- buttons, highlights, illustrations, backgrounds
- Study: how they alternate light/dark sections and use full-bleed accent backgrounds for CTAs

### Figma (figma.com)
- Reference for: the gradient hero treatment and how to make a multi-color palette feel cohesive
- Note: their typography scale -- massive headlines with extremely tight tracking
- Study: feature grid layout, card styling, and how they present complex features simply

### Framer (framer.com)
- Reference for: the highest-energy SaaS marketing on the web
- Note: their scroll animations, the speed of transitions, and how every element feels alive
- Study: button styling, badge/pill usage, and how tight their section spacing is

### Stripe Press (press.stripe.com)
- Reference for: how bold color and geometry can still feel premium
- Note: their use of large flat color fields and confident typographic hierarchy
- Study: the interplay between saturated backgrounds and white text

### Raycast (raycast.com) -- Marketing pages
- Reference for: the pill-button aesthetic and how rounded corners create friendliness at scale
- Note: their stat sections and how numbers become visual elements
- Study: card border-radius, badge styling, and the density of their feature grids

---

## Variant Bias

```json
{
  "hero": {
    "layout": "centered",
    "surface": "gradient-accent",
    "headlineStyle": "sans-oversized-bold",
    "headlineSize": "clamp(56px, 12vw, 140px)",
    "headlineWeight": 900,
    "headlineTracking": "-0.05em",
    "subheadColor": "rgba(255,255,255,0.80)",
    "ctaStyle": "pill-gradient-shadow",
    "backgroundTreatment": "accent-gradient-blobs"
  },
  "features": {
    "layout": "3-col-grid-tight",
    "cardStyle": "rounded-shadow-hover",
    "cardPadding": "24px",
    "iconStyle": "emoji-or-colored-circle",
    "gap": "16px"
  },
  "cta": {
    "layout": "centered-bold",
    "surface": "accent-solid",
    "headlineSize": "clamp(36px, 6vw, 64px)",
    "buttonStyle": "pill-white-on-accent"
  },
  "nav": {
    "style": "fixed-white-scroll",
    "height": "64px",
    "linkFont": "sans-medium"
  },
  "footer": {
    "layout": "4-col-links",
    "surface": "dark-inverted",
    "textColor": "rgba(255,255,255,0.55)"
  },
  "global": {
    "maxWidth": "1400px",
    "sectionPadding": "clamp(64px, 10vh, 120px)",
    "borderRadius": "16px",
    "fontBody": "Inter",
    "fontDisplay": "Satoshi",
    "density": "tight"
  }
}
```
