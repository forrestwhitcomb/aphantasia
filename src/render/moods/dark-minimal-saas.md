# Dark Minimal SaaS

> Near-black backgrounds, electric accent, oversized monospace headlines, surgical precision, cavernous whitespace.
> This is the aesthetic of developer tools that respect your intelligence.

**Trigger conditions:** `contentType: saas` + `tone: confident`

---

## 1. Typography

### Headlines
- **Primary font:** `"JetBrains Mono", "SF Mono", "Fira Code", monospace`
- **Fallback display:** `"Satoshi", "Cabinet Grotesk", system-ui` for non-hero headlines
- Hero headline size: `clamp(52px, 10vw, 120px)`
- Section headline size: `clamp(32px, 5vw, 64px)`
- Weight: **700** for hero, **600** for section heads
- Letter-spacing: **-0.04em** on hero, **-0.03em** on section heads
- Line-height: **0.95** on hero (tight stacking), **1.1** on section heads
- Text-transform: **none** (never uppercase mono headlines -- it looks like a terminal error)

### Body
- **Font:** `"Inter", "Geist", -apple-system, sans-serif`
- Size: `clamp(15px, 1.1vw, 18px)`
- Weight: **400** for body, **500** for emphasis
- Line-height: **1.65**
- Letter-spacing: **-0.01em**
- Color: `rgba(255, 255, 255, 0.70)` -- never full white for body text

### Micro / Labels
- Font: same monospace as headlines
- Size: `11px` or `12px`, never larger
- Weight: **500**
- Letter-spacing: **0.06em**
- Text-transform: **uppercase**
- Color: `rgba(255, 255, 255, 0.40)`
- Use for: section labels, tag chips, metadata, nav items

### Rules
- Never mix more than 2 font families on a single page
- Mono headlines + sans body is the canonical pairing
- Never use italic on monospace -- it defeats the geometric intent
- Heading hierarchy must be enforced through size AND weight, not color alone

---

## 2. Color Strategy

### Base Palette
- **Background:** `#09090b` (near-black with a cold blue undertone, not pure `#000`)
- **Surface-1:** `#111113` (cards, elevated panels)
- **Surface-2:** `#1a1a1f` (nested surfaces, code blocks)
- **Border:** `rgba(255, 255, 255, 0.08)` (1px only, never 2px)
- **Text primary:** `rgba(255, 255, 255, 0.93)`
- **Text secondary:** `rgba(255, 255, 255, 0.55)`
- **Text muted:** `rgba(255, 255, 255, 0.30)`

### Accent
- **Primary accent:** A single electric hue. Pick ONE:
  - Electric violet: `#8b5cf6`
  - Signal blue: `#3b82f6`
  - Acid green: `#22d3ee`
  - Hot white-blue: `#a5b4fc`
- **Accent usage rules:**
  1. Accent appears in a maximum of **3 places** per viewport: primary CTA, one highlight element, one subtle glow
  2. Never use accent as a background fill on large surfaces
  3. Accent on text: only for links and one key stat/number per section
  4. Accent glow: `box-shadow: 0 0 80px -20px {accent}40` behind CTAs, nowhere else
  5. Gradient usage: only as a subtle `background-image` on the hero, flowing from `{accent}15` to `transparent`

### Opacity Patterns
- Glass panels: `background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px)`
- Dividers: `rgba(255, 255, 255, 0.06)` -- thinner than you think
- Hover states: increase surface opacity by exactly **+0.04**
- Active states: increase by **+0.08**
- Focus rings: `0 0 0 2px {accent}60`

### Gradient Rules
- Radial glow behind hero: `radial-gradient(ellipse at 50% 0%, {accent}12, transparent 70%)`
- No linear gradients on text -- it reads as a gimmick on dark backgrounds
- Mesh gradients are acceptable only as very faint full-page background treatment at `opacity: 0.04`

---

## 3. Spacing

### Section Rhythm
- Section padding: `clamp(100px, 15vh, 200px)` top/bottom
- Hero section: `clamp(140px, 25vh, 300px)` top, `clamp(80px, 12vh, 160px)` bottom
- Between headline and body in a section: `24px`
- Between body and CTA: `40px`
- Never less than `80px` between sections -- this aesthetic breathes

### Grid
- Max content width: `1200px` (not 1400 -- tighter is more intentional)
- Feature grid: 3-column at desktop, `gap: 32px`
- Card grid: `gap: 24px` (cards should almost touch to feel like a unified surface)
- Side padding: `clamp(20px, 5vw, 80px)`

### Component Internal Spacing
- Card padding: `32px` on desktop, `24px` on mobile
- Button padding: `12px 24px` for default, `16px 32px` for hero CTA
- Input padding: `12px 16px`
- Badge/chip padding: `4px 10px`
- Icon-to-text gap: `8px` inline, `16px` stacked

### Vertical Rhythm
- Use an 8px base grid for all spacing decisions
- Acceptable values: 8, 16, 24, 32, 48, 64, 80, 96, 120, 160
- Never use odd spacing values like 13px or 37px

---

## 4. Surface & Texture

### Preferred
- **Flat matte surfaces** with ultra-subtle borders: `1px solid rgba(255,255,255,0.08)`
- **Glass morphism (restrained):** only on nav bar and floating panels, max `backdrop-filter: blur(12px)`, background at `rgba(255,255,255,0.03)`
- **Subtle inner glow:** `inset 0 1px 0 0 rgba(255,255,255,0.06)` on cards (simulates top-light)
- **Dot grid background:** `radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)` at `size: 24px 24px`, only behind hero section
- **Code-block styling:** `Surface-2` background, `border-radius: 8px`, `font-size: 13px`, horizontal scroll never vertical

### Avoid
- Drop shadows on dark backgrounds -- they vanish and add nothing
- Gradients on card surfaces -- keep cards flat
- Noise/grain texture -- it conflicts with the surgical precision of this mood
- Neumorphism -- it requires mid-tone backgrounds to read
- Any texture that implies physicality (paper, fabric, wood)
- Border-radius above `12px` on cards -- `8px` is the ceiling, `12px` for modals only

### Border Radius Scale
- Buttons: `8px`
- Cards: `8px`
- Inputs: `6px`
- Badges: `999px` (full pill)
- Modals: `12px`
- Images/media: `8px`

---

## 5. Animation

### Transitions
- Default transition: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)` (Material ease-out)
- Hover on cards: translate `Y -2px` + border opacity increase to `rgba(255,255,255,0.14)`
- Hover on buttons: background lightens by `+0.06` opacity, no scale change
- Hover on links: underline slides in from left via `scaleX` transform, `0.25s`
- Focus states: `box-shadow` ring expands from 0 to 2px, `0.15s`

### Scroll Reveals
- Entrance: `opacity: 0 -> 1` + `translateY(20px) -> 0` over `0.5s` with `cubic-bezier(0.16, 1, 0.3, 1)` (spring-out)
- Stagger children by `80ms` each, max stagger of `5` items (after that, all enter together)
- Trigger at `15%` from bottom of viewport
- Never use `scale` for entrance animations -- it feels bloated on dark UIs
- Never animate horizontal movement on scroll -- vertical only

### Parallax
- Hero background glow: parallax at `0.3` rate (subtle drift)
- No parallax on text -- ever
- No parallax on cards or content sections

### Micro-interactions
- CTA button: on hover, the glow `box-shadow` expands by `20px` spread, `0.3s`
- Toggle switches: `0.2s` with slight overshoot `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Cursor-following gradient glow on hero: acceptable if `opacity < 0.08`
- Loading states: pulsing dot or skeleton shimmer at `rgba(255,255,255,0.06)`

### Prohibited Animations
- No bounce effects
- No 3D card tilt/perspective shifts
- No confetti, particles, or emoji rain
- No scroll-jacking or smooth-scroll override
- No entrance animations on nav elements

---

## 6. Component Conventions

### Cards
- Background: `Surface-1` flat fill
- Border: `1px solid rgba(255,255,255,0.08)`
- Padding: `32px`
- Border-radius: `8px`
- No shadow, no gradient
- Icon at top (24px, stroke style, accent color), then `16px` gap, then title (18px, 600 weight), then `8px` gap, then description (secondary text color)
- On hover: `translateY(-2px)`, border brightens to `rgba(255,255,255,0.14)`

### Buttons
- **Primary:** `background: {accent}; color: #000; font-weight: 600; border-radius: 8px`
- **Secondary:** `background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.90); border: 1px solid rgba(255,255,255,0.12)`
- **Ghost:** `background: transparent; color: {accent}; padding: 8px 0` (text-button style)
- Height: `40px` default, `48px` hero CTA
- Font-size: `14px` for default, `16px` for hero CTA
- No box-shadow on buttons at rest, only on hover for primary (accent glow)
- Icon inside button: `16px`, `8px` gap from text

### Navigation
- Fixed top, glass surface: `rgba(9,9,11,0.80); backdrop-filter: blur(12px)`
- Height: `64px`
- Border-bottom: `1px solid rgba(255,255,255,0.06)`
- Logo left, links center, CTA right
- Links: `14px`, mono font, `rgba(255,255,255,0.55)`, no underline, hover to `rgba(255,255,255,0.90)`
- Mobile: slide-in drawer from right, same glass surface

### Forms
- Input background: `rgba(255,255,255,0.05)`
- Border: `1px solid rgba(255,255,255,0.12)`
- Focus border: `{accent}`
- Focus ring: `0 0 0 3px {accent}20`
- Label: mono font, `12px`, uppercase, `0.06em` tracking, `rgba(255,255,255,0.50)`
- Placeholder: `rgba(255,255,255,0.25)`

### Badges / Tags
- Background: `{accent}15` (very faint accent wash)
- Text: `{accent}` at full saturation
- Padding: `4px 10px`
- Border-radius: `999px`
- Font: mono, `11px`, `500` weight, `0.04em` tracking

---

## 7. Anti-Patterns

**Never do these in Dark Minimal SaaS:**

1. **Never use pure white (`#fff`) for any text** -- always `rgba(255,255,255,0.93)` at most. Pure white is harsh on dark backgrounds.
2. **Never put colored backgrounds behind content sections** -- the background is `#09090b` everywhere. Variation comes from surface elevation, not hue.
3. **Never use more than one accent color** -- this aesthetic is monochromatic + one electric highlight. Two accents = confusion.
4. **Never use rounded avatar bubbles with colored rings** -- that is consumer SaaS, not developer tooling.
5. **Never center-align body paragraphs** -- left-align all body text. Center-align only headlines and CTAs.
6. **Never use emoji in headlines or CTAs** -- this aesthetic is typographic, not conversational.
7. **Never use stock photography** -- if images are needed, use abstract 3D renders, code screenshots, or product UI shots. No humans smiling at laptops.
8. **Never use horizontal rules (`<hr>`)** -- use spacing to separate, not lines.
9. **Never animate font-size or letter-spacing** -- these cause layout reflow and look janky on dark UIs.
10. **Never stack more than 3 CTAs in a single viewport** -- one primary, one secondary max per section.

---

## 8. Touchstones

### Linear (linear.app)
- The gold standard for dark SaaS aesthetic
- Note: their use of a single purple accent, monospace labels, and the radial glow behind hero text
- Study: card grid spacing, typography hierarchy, and how little color they use

### Raycast (raycast.com)
- Reference for: command-palette UI metaphor, dot-grid backgrounds, glass-morphism nav
- Note: their headline sizing -- massive but with extremely tight leading
- Study: how they use accent color only on interactive elements

### Vercel (vercel.com)
- Reference for: the purest expression of near-black + white typography
- Note: their restraint -- almost no accent color, relying on contrast alone
- Study: section spacing, the rhythm between dense info blocks and breathing room

### Supabase (supabase.com)
- Reference for: how to introduce a green accent without it feeling like a Christmas tree
- Note: their use of code-block styling as a design element
- Study: the glow effects behind hero elements

### Warp (warp.dev)
- Reference for: gradient glow treatments done tastefully on dark backgrounds
- Note: how they keep body text at a comfortable reading opacity
- Study: their mobile adaptation of the dark aesthetic

---

## Variant Bias

```json
{
  "hero": {
    "layout": "centered",
    "surface": "transparent",
    "headlineStyle": "mono-oversized",
    "headlineSize": "clamp(52px, 10vw, 120px)",
    "headlineWeight": 700,
    "headlineTracking": "-0.04em",
    "subheadColor": "rgba(255,255,255,0.55)",
    "ctaStyle": "solid-accent-glow",
    "backgroundTreatment": "radial-accent-glow"
  },
  "features": {
    "layout": "3-col-grid",
    "cardStyle": "flat-bordered",
    "cardPadding": "32px",
    "iconStyle": "stroke-accent",
    "gap": "24px"
  },
  "cta": {
    "layout": "centered-stack",
    "surface": "transparent",
    "headlineSize": "clamp(32px, 5vw, 56px)",
    "buttonStyle": "solid-accent-glow"
  },
  "nav": {
    "style": "glass-fixed",
    "height": "64px",
    "linkFont": "mono"
  },
  "footer": {
    "layout": "4-col-links",
    "surface": "surface-1",
    "textColor": "rgba(255,255,255,0.40)"
  },
  "global": {
    "maxWidth": "1200px",
    "sectionPadding": "clamp(100px, 15vh, 200px)",
    "borderRadius": "8px",
    "fontBody": "Inter",
    "fontDisplay": "JetBrains Mono",
    "density": "spacious"
  }
}
```
