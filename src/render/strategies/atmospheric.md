# Strategy: Atmospheric

**Philosophy:** The mood IS the design. Images dominate. Text is sparse and deliberate. Every pixel serves the feeling of the place — warmth, elegance, calm. Think high-end restaurant websites, boutique hotel landing pages, luxury spa sites. The visitor should feel transported before they read a single word.

---

## Layout Rules

1. **Full-viewport hero.** The hero is 100vh minimum with a large image placeholder (or gradient stand-in) and text overlay. This is the first impression — make it immersive.
2. **Image-dominant sections.** Images take up 60%+ of the visual weight. Text is secondary — short, confident, ambient.
3. **Very little text.** Headlines are short (3-5 words). Body text is 1 sentence. Let the imagery and spacing communicate.
4. **Max-width is wider.** Content max-width: 1200px for image sections, 800px for text overlays.
5. **No conversion pressure.** No "Sign up now" urgency. No pricing comparisons. The design invites — it doesn't push.

---

## Section Padding Multipliers

Atmospheric uses dramatic spacing — sections breathe with generous padding:

```css
.section-hero        { padding: 0; min-height: 100vh; position: relative; display: flex; align-items: center; justify-content: center; }
.section-image       { padding: calc(var(--section-base) * 0.4) 0; }
.section-text        { padding: calc(var(--section-base) * 1.4) 0; }
.section-menu        { padding: calc(var(--section-base) * 1.2) 0; }
.section-cta         { padding: calc(var(--section-base) * 1.5) 0; }
.section-footer      { padding: calc(var(--section-base) * 0.6) 0; }
```

---

## Typography Rules (Atmospheric-Specific)

- **Heading weight:** Single weight from DNA ({{dna.typography.headingWeight}}). No mixed weights.
- **Hero h1:** clamp(3rem, 8vw, 6rem). Can be larger than other strategies — the hero is the centerpiece.
- **Letter-spacing:** Slightly wider than other strategies on headings: -0.01em to 0.02em. More spacious, less dense.
- **Body text:** Minimal. 1 sentence per block. clamp(1rem, 1.2vw, 1.125rem), muted foreground.
- **ALL CAPS option:** Section labels and nav can use uppercase at 12-14px with 0.15em letter-spacing for an elegant, restrained feel.

---

## Technique Whitelist (4 Maximum)

### 1. Full-Viewport Hero with Gradient Overlay

The hero image (or placeholder gradient) fills the viewport. A gradient overlay ensures text readability:

```css
.hero {
  position: relative; min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
}
.hero-image {
  position: absolute; inset: 0;
  background: var(--muted); /* placeholder for image */
  background-size: cover; background-position: center;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, {{dna.palette.background}}00 0%, {{dna.palette.background}}cc 100%);
}
.hero-content {
  position: relative; z-index: 1;
  text-align: center; max-width: 800px;
}
```

### 2. GSAP Parallax

Background elements scroll slower than foreground content. Subtle — 20-40px difference, not dramatic:

```javascript
gsap.to('.hero-image', {
  y: 80, ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});
```

### 3. Smooth Section Reveal on Scroll

Sections fade in with a slow, elegant timing. Longer duration than other strategies (1s vs 0.6s):

```javascript
document.querySelectorAll('.reveal').forEach(el => {
  gsap.from(el, {
    y: 40, opacity: 0, duration: 1.0, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 80%' }
  });
});
```

### 4. Noise Grain (0.04-0.06 opacity)

Warmer, more textured grain than other strategies. Adds a film-like quality:

```css
.grain-overlay { opacity: 0.05; }
```

---

## Technique Blacklist (FORBIDDEN)

- **Feature cards or grids** — No icon+title+description cards. No 3-column grids. Information is presented as elegant lists or flowing text.
- **Eyebrow badges** — No uppercase labels above headings. The heading stands alone.
- **Logo marquees / logo clouds** — No partner logos, no trust badges. This isn't a SaaS conversion page.
- **Pricing toggles** — If menu/pricing exists, it's an elegant list with items and prices on a single line, separated by dots or dashes.
- **Stats counters** — No animated numbers, no "10,000+ customers served."
- **Conversion-focused elements** — No "Start free trial," no urgency timers, no comparison tables.
- **Staggered card animations** — No stagger timing (no cards to stagger).
- **Mixed font weights in headlines** — Single weight throughout.
- **Horizontal scroll** — Everything scrolls vertically with generous spacing.

---

## Section Blueprints

### Hero (Immersive Full-Viewport)

```
[full-viewport image placeholder: 100vh, centered]
[gradient overlay: bottom-heavy, 50-80% opacity at bottom]
[h1: centered over image, large (clamp 3rem-6rem), single weight, text-shadow for readability]
[optional subtitle: 1 short sentence, muted or semi-transparent white]
[optional: single understated CTA button or scroll indicator arrow]
```

No eyebrow. No feature list. Just the name and a feeling.

### Image Sections

Large images that span the full content width (1200px) or full viewport width. Minimal text overlay or caption.

```css
.image-section img {
  width: 100%;
  border-radius: var(--img-radius);
  object-fit: cover;
  aspect-ratio: 16/9; /* or 3/2 for portraits */
}
.image-caption {
  margin-top: 1rem;
  font-size: 0.8125rem;
  color: var(--muted-fg);
  text-align: center;
}
```

### Elegant Menu / Price List

For restaurants, spas, services. Items presented as a clean list:

```css
.menu-item {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}
.menu-item-name {
  font-family: var(--heading-font);
  font-weight: {{dna.typography.headingWeight}};
  font-size: 1.125rem;
}
.menu-item-dots {
  flex: 1;
  border-bottom: 1px dotted var(--border);
  margin: 0 1rem;
  min-width: 2rem;
}
.menu-item-price {
  font-family: var(--heading-font);
  font-size: 1.125rem;
  white-space: nowrap;
}
.menu-item-description {
  font-size: 0.875rem;
  color: var(--muted-fg);
  margin-top: 0.25rem;
}
```

### Text Block (Sparse)

Short heading + 1-2 sentences. Centered. Max-width 700px. Used sparingly between image sections.

```css
.text-block {
  max-width: 700px; margin: 0 auto;
  text-align: center;
}
.text-block h2 {
  margin-bottom: 1.5rem;
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
}
.text-block p {
  color: var(--muted-fg);
  font-size: clamp(1rem, 1.2vw, 1.125rem);
  line-height: 1.7;
}
```

### Footer (Minimal)

Extremely simple. Brand name, address/location, one line of essential links. No 4-column grid.

```css
.footer {
  text-align: center;
  padding: calc(var(--section-base) * 0.6) 0;
  border-top: 1px solid var(--border);
}
.footer-brand { font-family: var(--heading-font); font-size: 1.25rem; margin-bottom: 1rem; }
.footer-address { font-size: 0.875rem; color: var(--muted-fg); margin-bottom: 1rem; }
.footer-links { font-size: 0.8125rem; color: var(--muted-fg); }
.footer-links a { color: var(--muted-fg); text-decoration: none; margin: 0 1rem; }
.footer-links a:hover { color: var(--fg); }
```

---

## Hover States (Restrained)

Atmospheric hover states are subtle and slow:

**Nav links:** Color shift only. `transition: color 0.4s`.

**CTA button (if present):** Gentle background opacity shift. No lift, no glow.

**Images:** No hover effect. Images are for looking at, not interacting with.

**Menu items:** Subtle background highlight on hover. No transform.

---

## GSAP Init Script

```javascript
gsap.registerPlugin(ScrollTrigger);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

  // Nav scroll state
  ScrollTrigger.create({
    start: 80,
    onEnter: () => document.querySelector('.nav').classList.add('nav--scrolled'),
    onLeaveBack: () => document.querySelector('.nav').classList.remove('nav--scrolled'),
  });

  // Hero parallax
  const heroImg = document.querySelector('.hero-image');
  if (heroImg) {
    gsap.to(heroImg, {
      y: 80, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  // Hero content fade out on scroll
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.to(heroContent, {
      y: -40, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: true }
    });
  }

  // Smooth section reveals
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%' }
    });
  });

}
```

---

## Quality Checklist (Atmospheric Specific)

1. Hero is 100vh minimum with image/gradient background
2. Hero has gradient overlay for text readability
3. No feature card grids anywhere
4. No pricing toggle or comparison table
5. No animated stats counters
6. No logo clouds or trust badges
7. Text is minimal — no section has more than 3 sentences of body copy
8. Images dominate — at least 50% of the visual weight is imagery
9. Menu/price list uses elegant list format (not cards)
10. Footer is minimal — no 4-column grid
11. Hover states are subtle and slow (0.4s+ transitions)
12. Parallax is subtle (40-80px range, no dramatic speed differences)
13. The overall feel: does this transport you to a place? If it feels like a SaaS page, strip it down further.
