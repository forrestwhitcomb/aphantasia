# Agency Showcase

> Dark or high-contrast, dramatic animation, full-bleed imagery, experimental layout.
> This site IS the portfolio piece. Every scroll tick is a statement. The medium is the message.

**Trigger:** `contentType: agency` + `tone: confident`

---

## 1. Typography

### Primary Font
Use **Neue Montreal**, **Manrope**, or **Space Grotesk**. These are agency-grade: geometric, slightly cold, excellent at large sizes, and they photograph well (yes, that matters -- agency sites get screenshotted and shared).

### Display / Statement Font
Pair with **Clash Display**, **Basement Grotesque**, or **Migra** for hero headlines. This is the one context where a loud display font is appropriate. The headline font should make someone stop scrolling.

### Headline Treatment
- Hero headline: `clamp(52px, 10vw, 120px)` at weight **700** or **800**.
- Letter-spacing: `-0.04em`. Extremely tight. Letters should nearly kiss.
- Line-height: `0.95` for hero. Yes, below 1.0. Lines should stack into a sculptural text block.
- Case: uppercase is permitted here for hero headlines ONLY. Mixed case everywhere else.
- Consider `font-feature-settings: 'ss01'` for stylistic alternates if the chosen font supports them.

### Body Text
- Size: `16px` base with the primary font (not the display font).
- Weight: `400` for body, `500` for captions and labels.
- Line-height: `1.6` for paragraphs, `1.3` for short card descriptions.
- Color on dark: `rgba(255,255,255,0.75)` for body. Not pure white. Dim body text elevates headings.
- Color on light sections: `#1A1A1A`.

### Supporting Text
- Project metadata: `12px` weight `500` uppercase, `0.1em` letter-spacing, `rgba(255,255,255,0.4)`.
- Section labels: `13px` weight `600` uppercase, `0.08em` letter-spacing, accent color.
- Counter/index numbers: `14px` monospaced (`JetBrains Mono` or `Space Mono`), `rgba(255,255,255,0.3)`.

### The Rule of Contrast
On agency sites, typographic hierarchy IS the design. The hero headline should be 6-8x the size of body text. There is no "medium" -- things are either massive or deliberately small.

---

## 2. Color Strategy

### Background
- Primary surface: `#0A0A0A` or `#0C0C0C`. Not `#000000` (pure black causes OLED halation and feels cheap).
- Secondary surface: `#141414` for cards and elevated panels.
- Light contrast sections: `#F5F5F0` (warm off-white) or `#FAFAFA`. Use sparingly -- one or two sections max to break the dark monotony.

### Accent Color
- High-energy accent: `#C8FF00` (acid green), `#FF4D00` (signal orange), or `#5B5BFF` (electric blue).
- The accent is a weapon, not a paintbrush. Use it on: one CTA per viewport, the cursor follower, link hovers, and loading indicators.
- NEVER use the accent as a section background. It should appear in flashes, not floods.

### Contrast Rules
- Text on dark backgrounds: headings at `#FFFFFF`, body at `rgba(255,255,255,0.75)`, tertiary at `rgba(255,255,255,0.4)`.
- Borders on dark: `rgba(255,255,255,0.08)`. Barely perceptible but structurally important.
- Borders on light sections: `rgba(0,0,0,0.08)`.

### Gradient Use
- Permitted: radial gradient spotlights behind hero text. `radial-gradient(ellipse at 50% 0%, rgba(accent, 0.15) 0%, transparent 60%)`.
- Permitted: subtle mesh gradients as section backgrounds at very low opacity.
- Prohibited: linear gradients on buttons, text gradients (unless extremely restrained), gradient borders.

### Opacity Patterns
- Video overlay: `rgba(10,10,10,0.6)` to ensure text legibility over hero video.
- Hover state on project cards: `rgba(accent, 0.08)` background.
- Scroll progress indicator: accent color at `100%` opacity, `2px` height, `position: fixed; top: 0`.

---

## 3. Spacing

### Section Padding
- Desktop: `160px 0` minimum. Agency sites command vertical space. More room = more gravity.
- Mobile: `96px 0`.
- Between hero and first content section: `200px` desktop.

### Container
- Max-width: `1440px` for project grids and case studies.
- Max-width: `800px` for text-heavy sections (about, manifesto).
- Horizontal padding: `24px` mobile, `64px` desktop.
- Full-bleed sections: `0` padding, images and video hit the viewport edges.

### Grid System
- Project grid: 2 columns desktop, 1 column mobile. Gap: `24px` -- tight gaps create tension.
- Asymmetric grids: `60/40` or `70/30` splits for case study layouts.
- Allow intentional grid-breaking: one project card spanning full width between rows of two.

### Vertical Hierarchy
- Between section label and section heading: `16px`.
- Between section heading and content: `64px`. Let the heading breathe.
- Between project cards: `24px` horizontal, `32px` vertical.
- Between paragraphs in case study text: `28px`.

### Micro-Spacing
- Between service tags: `8px` gap.
- Icon to label in metadata: `8px`.
- Between team member grid items: `2px` (tight mosaic).
- Project card internal padding: `32px`.

---

## 4. Surface & Texture

### Cards
- Project cards: `background: #141414`, `border: 1px solid rgba(255,255,255,0.06)`, `border-radius: 12px`, `overflow: hidden`.
- On hover: border transitions to `rgba(255,255,255,0.15)` and the card image scales to `1.05` within its container.
- Feature/service cards: no background, just a top border `1px solid rgba(255,255,255,0.1)` and `padding-top: 32px`.

### Image Treatment
- Project thumbnails: cover the entire card area. No padding between image and card edge.
- Aspect ratios: `16:9` for landscape work, `4:5` for mobile app showcases, `1:1` for team photos.
- Apply `filter: grayscale(100%) contrast(1.1)` on images by default, restore to color on hover with a `500ms` transition. This is a signature agency move.
- Video thumbnails: show a `40px` centered play button icon at `rgba(255,255,255,0.8)`.

### Surface Treatments: Permitted
- Grain/noise overlay: `background-image: url(noise.svg)` at `opacity: 0.03` on the body. Adds analog texture.
- Subtle horizontal scan lines on hero sections at `opacity: 0.015` for a cinematic feel.
- `backdrop-filter: blur(20px)` on navigation when scrolled, with `background: rgba(10,10,10,0.8)`.

### Surface Treatments: Prohibited
- Neumorphism. It died in 2021.
- Bright gradient backgrounds. The background is a stage, not a painting.
- Drop shadows on dark backgrounds. They're invisible and pointless. Use border luminance instead.
- Rounded corners larger than `16px`. Agency is sharp energy with controlled softness.

---

## 5. Animation

### Philosophy
Animation is a core deliverable, not decoration. Every interaction should feel like a reel piece. Motion design here is as important as the visual design. The scroll experience should make a creative director lean forward.

### Page Load Sequence
- First: background fades from `#000000` to `#0A0A0A` over `600ms`.
- Then: hero headline reveals word-by-word or character-by-character, `40ms` stagger, using `clip-path: inset(0 100% 0 0)` -> `clip-path: inset(0 0% 0 0)` (wipe reveal) OR `translateY(100%)` -> `translateY(0)` with overflow hidden (push-up reveal).
- Then: supporting text fades in `300ms` after headline completes.
- Then: scroll indicator appears with a gentle pulse animation.
- Total load sequence: under `2000ms`. Dramatic but not slow.

### Scroll Animations
- Project cards: reveal with `translateY(60px)` -> `translateY(0)` and `opacity: 0` -> `opacity: 1` over `600ms` with `cubic-bezier(0.16, 1, 0.3, 1)`.
- Stagger grid items by `100ms`.
- Large images: subtle parallax at `0.9` speed factor (slower than scroll). This is the ONE context where parallax is appropriate.
- Text sections: reveal line-by-line using `overflow: hidden` and `translateY` on individual lines.

### Hover Interactions
- Project cards: image scales `1.05`, grayscale lifts to color, card border brightens, all over `500ms cubic-bezier(0.16, 1, 0.3, 1)`.
- Links: accent-colored underline grows from left with `scaleX(0)` -> `scaleX(1)`, `transform-origin: left`, `300ms`.
- Buttons: `background` shifts, `letter-spacing` expands from `-0.02em` to `0em` over `300ms` (a subtle, premium micro-interaction).
- Navigation links: `opacity: 0.5` -> `opacity: 1` with accent color shift, `200ms`.

### Cursor
- Custom cursor: `32px` circle, `border: 1.5px solid rgba(255,255,255,0.5)`, follows mouse with `lerp` smoothing (trail effect).
- On hovering project cards: cursor expands to `80px` and shows "VIEW" text in `11px` uppercase.
- On hovering links: cursor shrinks to `8px` solid accent dot.
- Implement with `mix-blend-mode: difference` for automatic contrast.

### Page Transitions
- Route changes: current page content slides out with `translateY(-30px)` + `opacity: 0` over `400ms`, new content slides in from `translateY(30px)` over `400ms`.
- Shared element transitions on project cards to project detail pages where possible.

### Prohibited
- CSS `transition: all`. Always specify properties. Animating everything is amateur.
- `ease` timing function for any visual animation. Use custom cubic-beziers. `ease` is the default and it looks like a default.
- Animation durations above `800ms` for any single element (except the hero load sequence).
- Horizontal scroll sections. They confuse users and break on most trackpads.

---

## 6. Component Conventions

### Buttons
- Primary: `background: #FFFFFF`, `color: #0A0A0A`, `border-radius: 9999px` (pill), `font-weight: 600`, `font-size: 14px`, `padding: 16px 32px`, `letter-spacing: 0.02em`.
- On hover: `background: {accent}`, `color: #0A0A0A` (or white depending on accent), scale to `1.03`.
- Secondary: `background: transparent`, `border: 1px solid rgba(255,255,255,0.2)`, `color: #FFFFFF`, `border-radius: 9999px`.
- Magnetic button effect: button subtly shifts position toward the cursor when nearby (optional but on-brand).

### Navigation
- Fixed position, full width. `background: transparent` at top, transitioning to `rgba(10,10,10,0.9)` + `backdrop-filter: blur(16px)` on scroll.
- Height: `80px`. Logo/name left, links right. No hamburger menu on desktop ever.
- Mobile: full-screen overlay menu, `background: #0A0A0A`, links centered vertically at `32px` size.
- Menu open/close: staggered link reveals with `translateY` + `opacity`, `60ms` per link.
- Active page: accent-colored dot to the right of the link, `6px` diameter.

### Project Cards
- Full-bleed image with text overlay at bottom OR image above with text below separated by `16px`.
- Project title: `24px` weight `600` white.
- Category/year: `12px` uppercase, `rgba(255,255,255,0.4)`.
- Index number: `14px` monospace, positioned top-left of card, `rgba(255,255,255,0.2)`.
- Never more than 6 projects on the homepage. Curation signals quality.

### Case Study Pages
- Hero: full-viewport image with `object-fit: cover` and text overlay.
- Content sections alternate between full-bleed images and text blocks at `800px` max-width.
- Stats/metrics in a horizontal row: number in `48px` weight `700`, label in `13px` uppercase below.
- "Next Project" section at the bottom: full-width card previewing the next case study.

### Footer
- Minimal. Agency name, email, social links, and location. Nothing else.
- Layout: two columns. Left: name + tagline. Right: contact links stacked.
- Social links: text-based ("Twitter", "Instagram"), not icons. Hover: accent color.
- Background: `#0A0A0A` with top border `1px solid rgba(255,255,255,0.06)`.
- A large decorative word or phrase at `clamp(80px, 15vw, 200px)` in `rgba(255,255,255,0.03)` as a watermark.

---

## 7. Anti-Patterns

1. **No carousel sliders for projects.** Each project deserves a full card. Carousels bury work behind arrows.
2. **No light-background hero sections.** The hero is dark. Always. This is non-negotiable for agency mood.
3. **No stock photography.** Every image is original work or a screenshot of real deliverables. Fake mockups are visible from orbit.
4. **No "Our Services" with generic icons.** If listing services, use text-only with strong typographic hierarchy. Generic icons (lightbulb, gear, chart) scream template.
5. **No testimonial sections with headshots in circles.** If social proof is needed, use a single large client quote as a full-width typographic moment.
6. **No blue accent color.** Blues read corporate or tech. Agency showcase demands acid green, orange, coral, or electric violet.
7. **No centered text blocks wider than 800px.** Wide centered text is hard to read and looks undesigned.
8. **No cookie-cutter "About Us" sections** with three team member cards. Either do a full team page with high-quality photography or skip it entirely.
9. **No thin-weight body text below 300.** Thin text on dark backgrounds becomes illegible. Minimum weight `400`.
10. **No default scroll behavior.** If the native scroll works fine, add `scroll-behavior: smooth`. But also consider `locomotive-scroll` or similar for buttery inertial scrolling with parallax support.

---

## 8. Touchstones

### Basement Studio (basement.studio)
The benchmark. Custom cursor, dramatic text reveals, dark background, and project cards that function as visual events. Notice how every interaction has been considered -- nothing uses browser defaults.

### Locomotive (locomotive.ca)
Pioneers of smooth scroll in agency sites. The horizontal-in-vertical scroll section, the typography scale, and the restrained use of color alongside dramatic motion is the gold standard.

### Aristide Benoist (aristidebenoist.com)
A single-designer portfolio that punches above its weight. Minimal UI, maximum impact through typography and image quality. Shows that agency energy does not require complexity -- it requires confidence and curation.

### Resn (resn.co.nz)
Playful agency energy with experimental navigation. Good reference for pushing boundaries on interaction design without losing usability. The tone is "we are creative people who build creative things."

### Lusion (lusion.co)
WebGL-enhanced agency site that sets the bar for immersive experiences. Not every agency site needs 3D, but the principle -- that the site itself demonstrates the team's capability -- is the core lesson.

---

## Variant Bias

```json
{
  "hero": {
    "layout": "full-viewport",
    "surface": "dark-with-gradient-spot",
    "headlineStyle": "massive-tight-uppercase",
    "ctaStyle": "pill-white-invert",
    "imagePosition": "background-or-none",
    "maxWidth": "1440px",
    "animation": "character-reveal"
  },
  "projects": {
    "layout": "2-col-asymmetric",
    "cardStyle": "image-cover-dark-border",
    "hoverBehavior": "grayscale-to-color-scale",
    "imageRatio": "16:9",
    "maxItems": 6
  },
  "services": {
    "layout": "text-list-with-dividers",
    "cardStyle": "top-border-only",
    "iconUse": "none",
    "density": "spacious"
  },
  "testimonial": {
    "layout": "single-large-quote",
    "surface": "dark-match",
    "typography": "display-italic-centered"
  },
  "about": {
    "layout": "split-text-image",
    "surface": "light-contrast-section",
    "imageStyle": "full-bleed-grayscale"
  },
  "cta": {
    "layout": "centered-minimal",
    "surface": "dark-with-accent-glow",
    "buttonStyle": "pill-accent",
    "typography": "large-display"
  },
  "footer": {
    "layout": "2-col-minimal",
    "surface": "dark-with-top-border",
    "socialLinks": "text-not-icons",
    "watermark": "large-faded-text"
  },
  "global": {
    "borderRadius": "12px",
    "sectionPadding": "160px",
    "maxContentWidth": "1440px",
    "fontStack": "Neue Montreal, system-ui, sans-serif",
    "displayFontStack": "Clash Display, system-ui, sans-serif",
    "colorMode": "dark-primary",
    "backgroundBase": "#0A0A0A",
    "accentColor": "#C8FF00",
    "cursorStyle": "custom-circle",
    "scrollLibrary": "smooth-with-inertia"
  }
}
```

_When this mood is active, the render pipeline should enforce dark backgrounds on hero and footer sections, enable advanced scroll animations including parallax, apply grayscale-to-color filters on project images, activate custom cursor if supported, use the display font stack for hero headlines, and ensure all animation timing uses custom cubic-beziers rather than default easing._
