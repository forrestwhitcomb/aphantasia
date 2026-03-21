# Strategy: Expressive

**Philosophy:** Break the grid. Surprise the viewer. This is where creative agencies, design studios, and bold brand campaigns live. Think godly.website top picks, Awwwards Site of the Day. The layout IS the statement — asymmetry is intentional, animation is theatrical, and every section has a distinct personality.

**Important:** Expressive does NOT mean chaotic. Every asymmetric choice must be deliberate. Every animation must serve a purpose. The site should feel curated, not random.

---

## Layout Rules

1. **Asymmetric layouts are allowed and encouraged.** Hero can be split (60/40, 70/30). Feature sections can use bento grids. Elements can overlap.
2. **Bento grids are allowed.** Constrained to 1x1 or 2x1 cells only. No 3x2 megacells. The grid should feel intentional, not a dashboard.
3. **Horizontal scroll sections are allowed.** Use for portfolio pieces, testimonials, or case study cards. Pin the section and scrub horizontally.
4. **Overlapping elements are allowed.** Images can bleed behind text. Decorative elements can overlap section boundaries. Use z-index carefully.
5. **MUST break the uniform grid.** If every section uses centered 3-column layout, you're in the wrong strategy. At least 2 sections must use non-standard layouts.
6. **Max-width varies per section.** Some sections go full-bleed (100vw), others use standard container. Mix deliberately.

---

## Section Padding Multipliers

Expressive spacing varies dramatically between sections — contrast is the point:

```css
.section-hero        { padding: 0; min-height: 100vh; }
.section-features    { padding: calc(var(--section-base) * 1.0) 0; }
.section-bento       { padding: calc(var(--section-base) * 0.8) 0; }
.section-showcase    { padding: calc(var(--section-base) * 1.4) 0; }
.section-cta         { padding: calc(var(--section-base) * 1.6) 0; }
.section-testimonials { padding: 0; /* horizontal scroll sections handle their own padding */ }
.section-stats       { padding: calc(var(--section-base) * 0.5) 0; }
```

---

## Typography Rules (Expressive-Specific)

- **Mixed font weights are ALLOWED and ENCOURAGED.** This is the only strategy that permits split-weight headlines.
- **Split-weight pattern:** Filler words (prepositions, articles) get `font-weight: {{dna.typography.headingWeightLight ?? 300}}; opacity: 0.8;`. Key concept words get `font-weight: {{dna.typography.headingWeight}};`.

```html
<h1 class="hero-headline">
  <span class="hw-light">We don't just</span>
  <span class="hw-bold">build brands</span>
</h1>
```

```css
.hw-light { font-weight: {{dna.typography.headingWeightLight ?? 300}}; opacity: 0.8; }
.hw-bold  { font-weight: {{dna.typography.headingWeight}}; }
```

- **Dramatic scale:** Hero h1 can go larger than other strategies: clamp(3.5rem, 9vw + 1rem, 8rem).
- **Tight line-height:** 0.9 to 1.0 on hero headlines. Headlines should feel dense and impactful.
- **Negative letter-spacing:** -0.03em to -0.05em on large headings.

---

## Technique Whitelist (6 Maximum)

You may use UP TO 6 of these techniques. Use at least 3.

### 1. GSAP ScrollTrigger Full Suite

Parallax, pinning, scrub, stagger — the full toolkit:

```javascript
// Parallax on background elements
gsap.to('.bg-element', {
  y: -120, ease: 'none',
  scrollTrigger: { trigger: '.section', scrub: true }
});

// Pin + horizontal scroll
gsap.to('.scroll-track', {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: { trigger: '.scroll-container', pin: true, scrub: 1, end: () => '+=' + track.scrollWidth }
});

// Staggered entrance with varied timing
gsap.from('.bento-card', {
  y: 60, opacity: 0, duration: 0.8,
  stagger: { amount: 0.6, from: 'random' },
  ease: 'power3.out',
  scrollTrigger: { trigger: '.bento-grid', start: 'top 75%' }
});
```

### 2. Gradient Text (ONE Instance Per Page)

A single headline or display text element uses gradient text. Maximum one — more is garish.

```css
.gradient-text {
  background: linear-gradient(135deg, var(--accent), {{dna.palette.accent}}88, var(--fg));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 3. Custom Decorative SVGs

2-4 inline SVG elements positioned behind content. Style based on DNA decorative direction ({{dna.decorative.style}}):

- **Geometric:** Angular lines, concentric circles, rotated squares at 0.05-0.15 opacity
- **Organic:** Custom blob shapes with unique bezier paths at 0.06 opacity
- **Gradient-blobs:** Large blurred divs with accent color, animated 15-20s float cycles

All decoratives: `position: absolute; pointer-events: none; z-index: 0; aria-hidden="true"`. Generate UNIQUE shapes per project.

### 4. Animated Gradient Border on ONE Featured Element

A single card or container gets an animated gradient border:

```css
.featured-card {
  position: relative; border-radius: 16px; overflow: hidden;
}
.featured-card::before {
  content: ''; position: absolute; inset: -2px;
  background: conic-gradient(from var(--angle, 0deg), var(--accent), transparent 40%, var(--accent));
  border-radius: inherit; z-index: -1;
  animation: rotate-border 4s linear infinite;
}
@keyframes rotate-border { to { --angle: 360deg; } }
@property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
```

Maximum ONE element with this effect.

### 5. Radial Gradient Blobs Behind Sections

Large, blurred accent-colored circles positioned behind content:

```css
.blob {
  position: absolute; border-radius: 50%;
  background: {{dna.palette.accent}}15;
  filter: blur(80px);
  pointer-events: none; z-index: 0;
}
```

2-3 blobs per page, positioned asymmetrically. Can animate with gentle float (`translateY(20px)` over 15s).

### 6. Character-by-Character Text Reveal on Hero

Hero headline letters reveal one by one on load:

```javascript
// Split hero text into characters
const heroText = document.querySelector('.hero-headline');
if (heroText) {
  const chars = heroText.textContent.split('');
  heroText.innerHTML = chars.map(c =>
    c === ' ' ? ' ' : `<span class="char">${c}</span>`
  ).join('');

  gsap.from('.hero-headline .char', {
    y: 40, opacity: 0, duration: 0.5,
    stagger: 0.02, ease: 'power3.out', delay: 0.3
  });
}
```

---

## Technique Blacklist

Expressive has very few restrictions, but these still apply:

- **Uniform 3-column grids with identical cards** — If everything looks the same, you're not being expressive. Break the grid.
- **Generic hover states** — Every hover effect should be unique to the element. Don't reuse the same lift-and-glow on everything.
- **Timid animations** — If using ScrollTrigger, commit. Small `y: 20` fades are too safe for expressive. Use pinning, scrub, stagger from random.

---

## Section Blueprints

### Hero (Split or Full Immersive)

Option A — Split Hero (60/40):
```
[left 60%: heading with mixed weights, subtitle, CTA buttons]
[right 40%: large image, slightly overlapping the boundary, rotated 2-3deg]
```

Option B — Full Immersive with Character Reveal:
```
[full-viewport background: accent gradient or image]
[centered headline: character-by-character reveal, mixed weights]
[scroll indicator at bottom]
```

### Bento Feature Grid

Asymmetric grid with mixed cell sizes:

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: var(--grid-gap);
}
.bento-card.span-2 { grid-column: span 2; } /* 2x1 cell */
```

Layout pattern (example):
```
[2x1: featured item with image]  [1x1: stat or quote]
[1x1: feature]  [1x1: feature]  [1x1: feature]
```

Each card has a different visual treatment. Don't make them uniform.

### Horizontal Scroll Testimonials / Portfolio

Pin the section and scroll horizontally:

```css
.scroll-container { overflow: hidden; }
.scroll-track { display: flex; gap: 2rem; padding: 4rem 0; }
.scroll-card { min-width: 400px; flex-shrink: 0; }
```

### Showcase Section

Full-width image or project showcase with text overlay. Can use parallax.

### CTA (Dramatic)

Full-width accent background or gradient. Large headline with mixed weights. Single oversized CTA button.

---

## Hover States (Theatrical)

Each element type gets a unique hover:

**Bento cards:** `transform: scale(1.02); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.2); border-color: var(--accent);`

**Featured card:** The animated border spins faster on hover.

**CTA button:** Background shifts + subtle scale: `transform: scale(1.03); box-shadow: 0 8px 24px {{dna.palette.accent}}44;`

**Portfolio items:** Image scales, caption slides up from below.

**Nav links:** Underline with accent color, animated width.

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

  // Hero character reveal
  const heroText = document.querySelector('.hero-headline');
  if (heroText) {
    const text = heroText.textContent;
    heroText.innerHTML = text.split('').map(c =>
      c === ' ' ? ' ' : `<span class="char" style="display:inline-block">${c}</span>`
    ).join('');
    gsap.from('.hero-headline .char', {
      y: 50, opacity: 0, duration: 0.5,
      stagger: 0.02, ease: 'power3.out', delay: 0.5
    });
  }

  // Parallax on decorative elements
  document.querySelectorAll('.parallax-bg').forEach(el => {
    gsap.to(el, {
      y: -100, ease: 'none',
      scrollTrigger: { trigger: el.closest('section'), scrub: true }
    });
  });

  // Bento cards stagger from random
  gsap.from('.bento-card', {
    y: 60, opacity: 0, scale: 0.95, duration: 0.8,
    stagger: { amount: 0.6, from: 'random' },
    ease: 'power3.out',
    scrollTrigger: { trigger: '.bento-grid', start: 'top 75%' }
  });

  // Horizontal scroll pin (if testimonials or portfolio exist)
  const scrollContainer = document.querySelector('.scroll-container');
  if (scrollContainer) {
    const track = scrollContainer.querySelector('.scroll-track');
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 100),
      ease: 'none',
      scrollTrigger: {
        trigger: scrollContainer, pin: true, scrub: 1,
        end: () => '+=' + (track.scrollWidth - window.innerWidth)
      }
    });
  }

  // Section heading reveals
  document.querySelectorAll('[data-aph-type] h2').forEach(el => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

}
```

---

## Quality Checklist (Expressive Specific)

1. At least 2 sections break the uniform grid (bento, split, full-bleed, or horizontal scroll)
2. Mixed font weights used in at least one headline (light prepositions + bold payload)
3. Gradient text appears on exactly ONE element (not zero, not more than one)
4. At least 2 custom decorative SVG elements with `aria-hidden="true"`
5. Character-by-character reveal on hero headline
6. Animated gradient border on maximum ONE featured element
7. No section uses the same animation as its neighbor
8. Bento grid cells are only 1x1 or 2x1 (no 3x2 megacells)
9. Horizontal scroll (if present) uses ScrollTrigger pin + scrub
10. The site is STILL responsive at 768px and 480px — asymmetry adapts to single column
11. The site is STILL readable — creativity doesn't sacrifice legibility
12. The overall feel: would this get submitted to Awwwards? If it feels like a template, push harder.
