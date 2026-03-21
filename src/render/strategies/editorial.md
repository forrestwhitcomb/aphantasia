# Strategy: Editorial

**Philosophy:** The content IS the design. Typography leads, whitespace breathes, images punctuate. Think Monocle, NYT feature articles, elegant personal sites. The reader should forget they're on a website and feel like they're reading a beautifully typeset page.

---

## Layout Rules

1. **Narrow content column.** Body text: max-width 720px. Full sections (images, dividers): max-width 1000px. Everything centered on the page.
2. **Text-first hierarchy.** Headings and body copy dominate. No feature cards, no pricing tables, no conversion widgets.
3. **Alternating rhythm.** Sections alternate between narrow text blocks and wider image/visual blocks. This creates a breathing pattern.
4. **Generous vertical whitespace.** More space between sections than other strategies. Let content breathe.
5. **Pull quotes break the column.** Pull quotes extend slightly wider than body text (max-width 800px) with a thin accent left border.

---

## Section Padding Multipliers

Editorial uses more generous spacing than other strategies:

```css
.section-hero        { padding: calc(var(--section-base) * 2.0) 0; min-height: 70vh; display: flex; align-items: center; }
.section-text        { padding: calc(var(--section-base) * 0.8) 0; }
.section-image       { padding: calc(var(--section-base) * 0.6) 0; }
.section-pullquote   { padding: calc(var(--section-base) * 0.5) 0; }
.section-cta         { padding: calc(var(--section-base) * 1.5) 0; }
.section-faq         { padding: calc(var(--section-base) * 0.9) 0; }
.section-footer      { padding: calc(var(--section-base) * 0.7) 0; }
```

---

## Typography Rules (Editorial-Specific)

- **Heading weight:** Use a SINGLE weight from DNA ({{dna.typography.headingWeight}}). No mixed weights.
- **Heading line-height:** 1.05 to 1.15 — slightly more relaxed than SaaS for readability.
- **Body line-height:** 1.75 to 1.85 — generous for long-form reading.
- **Body font-size:** clamp(1.0625rem, 1.2vw, 1.1875rem) — slightly larger than SaaS for comfort.
- **Paragraph max-width:** 65-70ch — the typographic sweet spot.
- **Drop caps:** Optional on first paragraph. First letter: `float: left; font-size: 3.5em; line-height: 0.8; margin-right: 0.08em; font-weight: {{dna.typography.headingWeight}};`

---

## Technique Whitelist (3 Maximum)

### 1. Simple GSAP Fade-In on Scroll

Elements fade in with a subtle upward motion. No stagger, no parallax, no word-reveals. Clean and quiet.

```javascript
document.querySelectorAll('.fade-in').forEach(el => {
  gsap.from(el, {
    y: 24, opacity: 0, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});
```

### 2. Editorial Dividers

Thin horizontal rules between sections using the accent color at low opacity. Centered, max-width 120px.

```css
.editorial-divider {
  width: 120px; height: 1px;
  background: {{dna.palette.accent}}33;
  margin: 0 auto;
}
```

Place between major content sections. Not between every section — use judgment.

### 3. Subtle Noise Grain (0.02 opacity)

The grain overlay from base.md at very low opacity (0.02). Barely perceptible — adds warmth without noise.

---

## Technique Blacklist (FORBIDDEN)

- **Cards with hover effects** — No lifted cards, no glowing borders. If you must group content, use simple bordered containers without hover animation.
- **Feature grids** — No 3-column icon+title+description grids. Content is presented as flowing text or alternating text/image blocks.
- **Pricing tables** — If pricing exists, present as simple text with horizontal rules, not cards or toggles.
- **Gradient backgrounds** — No radial gradient atmosphere, no accent washes. Backgrounds are flat: `var(--bg)` or subtle contrast with `var(--muted)`.
- **Parallax scrolling** — No GSAP parallax, no scroll-speed differences.
- **Hover animations on content** — Text, images, and quotes don't animate on hover. Only nav links and buttons get hover states.
- **Decorative SVG shapes** — No geometric patterns, no blobs, no grid overlays. Whitespace is the decoration.
- **Staggered card entrances** — No stagger timing on grouped elements.
- **Eyebrow badges** — No uppercase eyebrow labels above headings. Let the heading speak for itself.

---

## Section Blueprints

### Hero (Text-Only)

No background layers. No images. Just powerful typography on a clean background.

```
[h1: clamp(2.5rem, 6vw, 4.5rem), single weight, max-width 720px, centered or left-aligned]
[subtitle: 1-2 sentences, body font, muted foreground, max-width 600px]
[optional: thin editorial divider below]
```

The hero is quiet. No CTA buttons (or at most a single understated text link). The headline does the work.

### Alternating Text + Image

The core pattern of editorial. Sections alternate:

**Text block:** Narrow column (720px). Heading + 2-3 paragraphs of rich, specific copy. Left-aligned.

**Image block:** Wider (1000px). Full-width image with DNA border-radius. No hover effects on images. Optional caption below in small muted text.

### Pull Quote

A standout quote that breaks the rhythm:

```css
.pullquote {
  max-width: 800px; margin: 0 auto;
  padding-left: 2rem;
  border-left: 3px solid var(--accent);
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-family: var(--heading-font);
  font-style: italic;
  line-height: 1.4;
  color: var(--fg);
}
.pullquote-attribution {
  margin-top: 1rem;
  font-size: 0.875rem;
  font-style: normal;
  color: var(--muted-fg);
}
```

### FAQ (Editorial Style)

Simple accordion, no fancy animations. Questions in bold, answers in body font. Thin borders between items.

```css
.faq-item { border-bottom: 1px solid var(--border); padding: 1.5rem 0; }
.faq-question { font-weight: {{dna.typography.headingWeight}}; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
.faq-answer { max-width: 65ch; color: var(--muted-fg); padding-top: 1rem; }
```

### Footer (Minimal)

Simpler than the base blueprint. 2 columns max: brand + essential links. No social icons grid. Thin top border.

---

## Hover States (Minimal)

Editorial hover states are subtle. Only navigation and explicit CTAs get hover treatment:

**Nav links:** Color shift from `var(--muted-fg)` to `var(--fg)` on hover. No underline animation.

**Text links in body:** Underline with `text-decoration-color: var(--accent)`. No transform.

**Buttons (if any):** Simple background color shift. No lift, no glow, no shadow changes.

---

## GSAP Init Script

Minimal. Just fade-in on scroll:

```javascript
gsap.registerPlugin(ScrollTrigger);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

  // Nav scroll state
  ScrollTrigger.create({
    start: 80,
    onEnter: () => document.querySelector('.nav').classList.add('nav--scrolled'),
    onLeaveBack: () => document.querySelector('.nav').classList.remove('nav--scrolled'),
  });

  // Gentle fade-in for all content sections
  document.querySelectorAll('.fade-in').forEach(el => {
    gsap.from(el, {
      y: 24, opacity: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

}
```

---

## Quality Checklist (Editorial Specific)

1. Body text column never exceeds 720px
2. No feature card grids anywhere
3. No pricing tables or conversion widgets
4. No hover animations on content (only nav/buttons)
5. No gradient backgrounds — flat colors only
6. No decorative SVG shapes — whitespace is the decoration
7. Pull quotes have left accent border, not quotation marks
8. Images extend wider than text column (up to 1000px)
9. At least 2 editorial dividers between sections
10. Body line-height is 1.75+ for reading comfort
11. Heading uses single weight — no mixed font-weight tricks
12. The overall feel: could this be a Monocle or NYT feature article? If not, simplify further.
