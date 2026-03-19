# Warm Personal

> Soft tones, rounded shapes, friendly typography, approachable and human.
> This site belongs to a person, not a corporation. It should feel like a handwritten letter, not a press release.

**Trigger:** `contentType: personal | nonprofit` + `tone: casual`

---

## 1. Typography

### Primary Font
Use **Satoshi**, **Cabinet Grotesk**, or **General Sans**. These are geometric-humanist hybrids -- modern but with enough curve and quirk to feel personal. Avoid anything that ships with an operating system.

### Fallback / Serif Pairing
Pair with **Sentient**, **Gambetta**, or **Lora** for long-form body text. The heading font is geometric-friendly, the body font is warm-readable. This pairing says "I care about design and I care about your reading experience."

### Headline Treatment
- Hero headline: `clamp(40px, 8vw, 72px)` at weight **700**.
- Letter-spacing: `-0.03em`. A touch tighter than commerce because personality benefits from density.
- Line-height: `1.08` for hero. Tight. The headline should feel like a single visual block.
- Case: Sentence case always. Never uppercase. Never title case. Lowercase is approachable.

### Body Text
- Size: `17px` base. Slightly larger than standard -- this is long-form reading territory.
- Weight: `400` with the serif font, or `400` with the geometric if single-font.
- Line-height: `1.7` for body paragraphs. Generous. Reading should feel effortless.
- Max paragraph width: `620px`. This is a reading measure, not a layout decision.
- Color: `#3D3935` -- warm dark brown, not gray, not black.

### Supporting Text
- Metadata/dates: `14px` weight `400` in `#8B8178` (warm mid-gray).
- Category labels: `13px` weight `600`, `0.04em` letter-spacing, in the accent color.
- Pull quotes: `24px` italic serif, `#5C564E`, with a `3px` left border in accent color.

---

## 2. Color Strategy

### Background
- Primary surface: `#FFFCF8` -- warm white with a yellow-pink undertone. Not `#FFFFFF`.
- Secondary surface: `#F7F3ED` -- like aged paper. Use for alternating sections or card backgrounds.
- NEVER use pure white (`#FFFFFF`). It reads clinical in a personal context.

### Accent Color
- Default to a muted warm tone: `#C2785C` (terracotta), `#7C6B58` (warm umber), or `#5B7B6A` (sage).
- The accent should feel found-in-nature, not digital. No saturated blues, no neon anything.
- Use accent for: links, CTA buttons, active nav indicators, and pull-quote borders.
- Secondary accent: a lighter tint of the primary at `15%` opacity for tag backgrounds and hover states.

### Color Mixing
- Backgrounds: warm-shift everything. If you'd normally use `gray-100`, use the warm equivalent.
- Borders: `rgba(60, 50, 40, 0.1)` -- warm-tinted transparency, never cool gray borders.
- Shadows: `rgba(60, 45, 30, 0.08)` -- amber-shifted shadows. Never `rgba(0,0,0,x)`.

### Opacity Patterns
- Card hover: `background: rgba(199, 120, 92, 0.06)` -- a ghost of the accent.
- Image overlays for text legibility: `linear-gradient(to top, rgba(30,25,20,0.5), transparent)`.
- Disabled states: `opacity: 0.35`.

### Dark Mode Consideration
If dark mode is needed, do NOT invert to pure black. Use `#1C1917` (warm near-black) as the base, `#F5F0EB` for text, and desaturate the accent by 15%.

---

## 3. Spacing

### Section Padding
- Desktop: `120px 0`. Personal sites breathe. The content is the experience, and it needs room.
- Mobile: `72px 0`.
- Between a section heading and its content: `48px`.

### Container
- Max-width: `960px` for text-heavy layouts. Not wider. Reading needs intimacy.
- For grid/gallery sections: allow up to `1120px`.
- Horizontal padding: `24px` mobile, `48px` tablet.

### Vertical Rhythm
- Between paragraphs: `24px` (1.4x the body font size).
- Between heading and first paragraph: `20px`.
- Between sections of a long-form post: `64px`.
- Between list items: `12px`.

### Card Internal Spacing
- Card padding: `28px` -- slightly more generous than commerce.
- Image to text: `20px`.
- Title to excerpt: `12px`.
- Excerpt to metadata: `16px`.

### Micro-Spacing
- Icon to text: `10px`.
- Tag to tag: `8px`.
- Avatar to name: `12px`.
- Between social links in footer: `16px`.

---

## 4. Surface & Texture

### Cards
- Blog/post cards: `background: #FFFCF8`, `border: 1px solid rgba(60,50,40,0.08)`, `border-radius: 16px`.
- On hover: `box-shadow: 0 4px 20px rgba(60,45,30,0.08)`, `transform: translateY(-3px)`.
- Interior card padding: `28px`.

### Rounded Everything
- Border-radius: `16px` for cards, `12px` for buttons, `20px` for images, `9999px` for avatars and tags.
- This is a defining trait. Sharp corners feel corporate. Rounds feel approachable.

### Image Treatment
- All images: `border-radius: 16px`. No exceptions except full-bleed hero images.
- Author avatars: `64px` circle, `3px solid #FFFCF8` border (creates a subtle frame).
- Decorative images: allow slight rotation (`transform: rotate(-2deg)`) for a casual, pinned-to-wall feeling.

### Textures: Use Sparingly
- A subtle paper noise texture at `opacity: 0.03` on the body background is permitted. Not required.
- Soft radial gradient blobs (`300px` radius, `rgba(199,120,92,0.06)`) positioned behind key sections add warmth.
- NO hard-edged geometric patterns. No grids, no dots, no diagonal lines.

### Surfaces to Avoid
- Glass/blur effects. They're cold.
- High-contrast borders. Use `rgba` with warm tinting instead.
- Flat color blocks as section backgrounds. Use subtle gradients between warm tones.

---

## 5. Animation

### Philosophy
Animation should feel like things are gently arriving, not performing. Think of a leaf landing on water, not a Vegas entrance. Movement here builds intimacy and delight.

### Transitions
- Card hover: `transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)` -- a slight overshoot gives it personality.
- Link hover: `color 200ms ease`, plus underline offset animation from `4px` to `2px`.
- Button hover: `background-color 200ms ease`, `transform: scale(1.02)` over `200ms`.
- Image hover: `transform: scale(1.04) rotate(0deg)` (if the resting state has a slight rotation).

### Scroll Reveals
- Elements enter with `opacity: 0 -> 1`, `translateY(20px) -> 0` over `500ms` with `cubic-bezier(0.16, 1, 0.3, 1)`.
- Stagger items by `80ms` each.
- Trigger at `15%` of element visible in viewport.
- Long-form text blocks: reveal paragraph by paragraph, not all at once.

### Page Transitions
- New page content fades in over `300ms`.
- Subtle `translateY(12px)` upward movement accompanies the fade.

### Personality Animations
- A waving hand emoji in the hero can have a subtle `rotate(-10deg) -> rotate(10deg)` loop at `2s` duration. Use `animation-timing-function: ease-in-out`.
- Cursor/selection highlight color: set to a tint of the accent (`::selection { background: rgba(199,120,92,0.25) }`).
- Scroll progress bar at the top of blog posts: `3px` height in the accent color.

### Prohibited
- No hard cuts or instant state changes. Everything should transition.
- No parallax on text. Text parallax is a readability crime.
- No bounce animations. They're infantile, not friendly.
- No auto-playing anything.

---

## 6. Component Conventions

### Buttons
- Primary: `background: {accent}`, `color: #FFFCF8`, `border-radius: 12px`, `font-weight: 600`, `font-size: 16px`, `padding: 14px 28px`.
- Secondary: `background: rgba(accent, 0.1)`, `color: {accent}`, `border-radius: 12px`.
- Ghost: `background: transparent`, `color: {accent}`, `border-bottom: 2px solid {accent}`. Looks like a styled link.
- Button text: sentence case. "Read my story" not "READ MY STORY".

### Navigation
- Simple horizontal nav or a tasteful sidebar on desktop.
- Height: `72px`. Background: transparent on hero, then `#FFFCF8` with warm shadow on scroll.
- Logo/name on left, links on right. No mega-menus. This is a personal site, not an enterprise portal.
- Active state: `font-weight: 600` and accent-colored dot below the link (not an underline).

### Blog Cards
- Horizontal layout on desktop (image left, text right) for featured posts.
- Vertical stack (image top, text below) for grid views.
- Date always visible, formatted as "March 14, 2025" -- never "3/14/25" or ISO format.
- Read time estimate in metadata: "5 min read" in warm gray.

### Author/Bio Section
- Avatar: `80px` circle, floated left or centered above.
- Name: `20px` weight `700`.
- Bio: `16px` weight `400`, max 2-3 lines. Personality is okay here ("I write about plants and feelings").
- Social links as small monochrome icons, `20px`, with `opacity: 0.5` rising to `1` on hover.

### Newsletter Signup
- Single email input + button, inline on desktop, stacked on mobile.
- Framed inside a card with warm background (`#F7F3ED`) and `border-radius: 20px`.
- Placeholder text should be personal: "your@email.com" not "Enter your email address".
- Supporting text: warm and honest. "No spam. Unsubscribe anytime. I send ~2x/month."

---

## 7. Anti-Patterns

1. **No corporate blue.** No `#2563EB`, no `#3B82F6`. Blue is for SaaS dashboards. Personal sites use earth tones, greens, terracottas.
2. **No stock photography of handshakes.** All imagery should feel authentic -- real photos, illustrations, or nothing.
3. **No grid layouts with more than 3 columns.** Personal sites are intimate. 3 columns max, 2 preferred.
4. **No "hero with background video."** A warm photo or illustration, or no image at all. Video is attention theft.
5. **No uppercase text anywhere except single-word labels** like "BLOG" or "NEW". Uppercase sentences are shouting.
6. **No sharp 0px border-radius.** Minimum `8px` on any rectangular element. Sharp corners signal corporate.
7. **No animated counters ("500+ articles!").**  Numbers-as-achievements feels performative on personal sites.
8. **No sticky CTAs or floating action buttons.** Let people browse in peace.
9. **No testimonial walls.** A few genuine quotes inline, not a dedicated social-proof section.
10. **No dark mode by default.** Warm personal sites need warmth. Dark mode can exist as a toggle, but the default experience is warm-light.

---

## 8. Touchstones

### Paco Coursey (paco.me)
Minimal personal site with impeccable spacing, warm tones, and typography that feels like opening a well-designed book. The content has room to breathe, and the personality comes through in copywriting, not in flashy UI.

### Brian Lovin (brianlovin.com)
Clean personal site that balances long-form writing with structured content. Notice the generous line-height, the muted color palette, and how the sidebar navigation feels like a table of contents, not a corporate nav bar.

### Maggie Appleton (maggieappleton.com)
Illustrated, warm, and deeply personal. Great reference for how to integrate personality through custom illustration, warm backgrounds, and typography that refuses to be boring. The "digital garden" concept executed beautifully.

### The Pudding (pudding.cool)
While technically a publication, the warmth, visual storytelling approach, and willingness to break layout conventions for personality makes this an excellent reference for how personal sites can be editorially rich without feeling cold.

### Substack's Best-Designed Profiles
The better Substack writers customize their profiles with warm tones, personal photography, and reading-first layouts. Look at how the content hierarchy puts the writing front and center with minimal UI chrome.

---

## Variant Bias

```json
{
  "hero": {
    "layout": "centered-stack",
    "surface": "warm-paper",
    "headlineStyle": "large-friendly",
    "ctaStyle": "rounded-accent",
    "imagePosition": "below-or-none",
    "maxWidth": "960px"
  },
  "features": {
    "layout": "2-col-grid",
    "cardStyle": "rounded-warm-border",
    "iconUse": "illustrative-or-emoji",
    "density": "generous"
  },
  "blog": {
    "layout": "single-column-stream",
    "cardStyle": "horizontal-image-left",
    "dateFormat": "human-readable",
    "excerptLength": "2-3-sentences"
  },
  "about": {
    "layout": "text-with-portrait",
    "imageStyle": "rounded-rotated",
    "bioTone": "first-person-casual"
  },
  "newsletter": {
    "layout": "centered-card",
    "surface": "warm-tinted",
    "inputStyle": "rounded-generous",
    "copyTone": "honest-personal"
  },
  "footer": {
    "layout": "centered-simple",
    "surface": "warm-paper-darker",
    "socialIcons": "monochrome-small",
    "density": "airy"
  },
  "global": {
    "borderRadius": "16px",
    "sectionPadding": "120px",
    "maxContentWidth": "960px",
    "fontStack": "Satoshi, system-ui, sans-serif",
    "bodyFontStack": "Lora, Georgia, serif",
    "colorMode": "warm-light-default",
    "backgroundBase": "#FFFCF8"
  }
}
```

_When this mood is active, the render pipeline should enforce warm color shifting on all neutrals, disable any grid wider than 3 columns, apply `border-radius: 16px` minimum to all card-like elements, and use the serif stack for any body text longer than 2 sentences._
