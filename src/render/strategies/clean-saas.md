# Strategy: Clean SaaS

**Philosophy:** Centered. Symmetrical. Professional. Every element sits on a central axis. The layout never distracts — it amplifies the product message. Think Linear.app, Vercel.com, Raycast.com. These sites win through restraint, not spectacle.

**This is the default strategy.** If you're unsure, this is correct. Clean SaaS is never wrong.

---

## Layout Rules

1. **Everything is centered.** Hero headline, hero subtitle, CTA buttons, section headings — all `text-align: center` within a centered `.container`.
2. **Symmetrical grids only.** Feature grids use uniform columns (3-col desktop, 2-col tablet, 1-col mobile). Every card is the same size. No bento grids, no asymmetric layouts.
3. **Max-width discipline:**
   - Hero content: 800px (headline + subtitle + CTA)
   - Section content: `var(--content-width)` (from DNA, typically 1100px)
   - Feature cards: equal-width within the grid
   - CTA sections: 700px for the text block
4. **Vertical flow is uniform.** Sections stack with no horizontal scroll, no overlapping elements, no position tricks.

---

## Section Padding Multipliers

Each section type gets a different vertical rhythm. Never use identical padding on consecutive sections:

```css
.section-hero        { padding: calc(var(--section-base) * 1.6) 0; min-height: 90vh; display: flex; align-items: center; }
.section-features    { padding: calc(var(--section-base) * 0.9) 0; }
.section-stats,
.section-logos       { padding: calc(var(--section-base) * 0.6) 0; }
.section-cta         { padding: calc(var(--section-base) * 1.3) 0; }
.section-testimonials { padding: var(--section-base) 0; }
.section-pricing     { padding: calc(var(--section-base) * 1.1) 0; }
.section-faq         { padding: calc(var(--section-base) * 0.8) 0; }
```

---

## Technique Whitelist (3 Maximum)

You may use UP TO 3 of these techniques. No others.

### 1. Subtle Radial Gradient Atmosphere (Hero Only)

One or two large radial gradients using the accent color at 8-12% opacity, behind the hero content:

```css
.hero-bg {
  background:
    radial-gradient(ellipse 80% 50% at 70% 30%, {{dna.palette.accent}}1a, transparent),
    radial-gradient(ellipse 60% 40% at 20% 70%, {{dna.palette.accent}}0d, transparent),
    var(--bg);
}
```

### 2. GSAP Staggered Entrance Animations

Cards and grid items fade up on scroll with stagger. Section headings fade in. Simple, elegant, no word-by-word reveals.

```javascript
// Feature cards staggered entrance
gsap.from('.feature-card', {
  y: 40, opacity: 0, duration: 0.6,
  stagger: { amount: 0.4 },
  ease: 'power2.out',
  scrollTrigger: { trigger: '.section-features', start: 'top 80%' }
});

// Section headings fade in
document.querySelectorAll('.section-heading').forEach(el => {
  gsap.from(el, {
    y: 20, opacity: 0, duration: 0.5,
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});
```

### 3. Glassmorphism Nav on Scroll

Nav gains backdrop blur when user scrolls past hero:

```javascript
ScrollTrigger.create({
  start: 80,
  onEnter: () => document.querySelector('.nav').classList.add('nav--scrolled'),
  onLeaveBack: () => document.querySelector('.nav').classList.remove('nav--scrolled'),
});
```

```css
.nav { background: transparent; transition: background 0.3s, backdrop-filter 0.3s; }
.nav--scrolled { background: {{dna.palette.background}}cc; backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
```

---

## Technique Blacklist (FORBIDDEN)

Do NOT use any of these in clean-saas:

- **Mixed font-weight headlines** — Use a SINGLE heading weight ({{dna.typography.headingWeight}}) everywhere. No light/bold spans, no split-weight tricks.
- **Gradient text** — No `background-clip: text` gradients on any text
- **Animated borders** — No animated gradient borders, no shimmer effects
- **Bento / asymmetric grids** — All grids must be uniform columns
- **Parallax scrolling** — No GSAP parallax, no background-attachment: fixed
- **Horizontal scroll sections** — Everything scrolls vertically
- **Decorative SVG shapes** — No custom SVG decoratives. The radial gradient atmosphere is sufficient.
- **Word-by-word text reveals** — Too flashy for clean-saas. Simple fade-in only.
- **Overlapping elements** — No negative margins, no absolute positioning for overlap effects
- **Character-by-character animations** — No typewriter effects, no split text animations

---

## Section Blueprints

### Hero

Centered. Clean. Confident.

```
[eyebrow: uppercase, 12px, accent color, letter-spacing 0.1em]
[h1: single weight, clamp(3rem, 7vw, 5rem), max-width 800px, centered]
[subtitle: clamp(1rem, 1.5vw, 1.25rem), muted foreground, max-width 600px, centered]
[CTA group: primary button + secondary button, centered, 12px gap]
[optional: product screenshot/mockup below CTAs with border-radius and subtle shadow]
```

The hero background uses the radial gradient atmosphere (technique #1). No decorative SVGs.

### Feature Grid

Uniform 3-column grid (2 on tablet, 1 on mobile). Every card identical in structure:

```
[icon: 48px, accent background circle or accent color]
[title: bold, 1.125rem]
[description: 2 lines max, muted foreground]
```

Cards use DNA card surface style (bordered, elevated, glass, or flat). Staggered entrance on scroll.

### Stats Row

Horizontal row with 3-4 stats. Large number + label below. Subtle vertical dividers between items.

```
[number: 2.5rem+, accent or foreground, count-up animation via GSAP]
[label: 0.875rem, muted foreground, uppercase, letter-spacing 0.05em]
```

### Testimonials

If 3+: grid layout (NOT horizontal scroll — that's forbidden in clean-saas). Each card has:

```
[quote text: 1rem, italic or normal, foreground]
[avatar: 40px circle]
[name: bold, 0.875rem]
[role/company: muted, 0.8125rem]
```

If 1-2: large centered quote with decorative quotation mark.

### Pricing

Horizontal cards (3-tier typical). Center card is "recommended" with:
- 2px accent border
- Scale slightly larger: `transform: scale(1.03)`
- Accent badge: "Most Popular" or "Recommended"

```
[tier name: uppercase, small, letter-spacing]
[price: 2.5rem+, accent color for recommended tier]
[features: checkmark list, accent checkmarks]
[CTA button: primary for recommended, secondary for others]
```

### CTA Section

Narrow max-width (700-800px). Centered text. Accent wash or subtle gradient background.

```
[heading: clamp(2rem, 4vw, 3rem), single weight]
[subtitle: 1 sentence, muted foreground]
[primary CTA button, large]
```

### FAQ

Accordion with smooth height animation. Plus/minus icon rotates on toggle.

```
[question: bold, 1rem, clickable row with chevron/plus icon]
[answer: muted foreground, max-width 80ch, slides open with GSAP or CSS transition]
```

### Logo Cloud

Single row of grayscale/muted logos. Opacity 0.4-0.6, hover opacity 1. Simple horizontal flex with gap.

---

## Hover States

Every interactive element transitions 3+ properties:

**Cards:**
```css
.card { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s, border-color 0.3s; }
.card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -12px rgba(0,0,0,0.15), 0 0 0 1px var(--accent); border-color: {{dna.palette.accent}}44; }
```

**Primary buttons:**
```css
.btn-primary { position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px {{dna.palette.accent}}44; }
.btn-primary:active { transform: translateY(0) scale(0.98); }
```

**Nav links:** underline grow via `::after` pseudo-element, `scaleX(0)` to `scaleX(1)`.

**Images:** `overflow: hidden` wrapper, `img` scales to `1.04` on hover.

---

## GSAP Init Script

The complete `<script>` block for clean-saas (place at bottom of body):

```javascript
gsap.registerPlugin(ScrollTrigger);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

  // Nav glassmorphism on scroll
  ScrollTrigger.create({
    start: 80,
    onEnter: () => document.querySelector('.nav').classList.add('nav--scrolled'),
    onLeaveBack: () => document.querySelector('.nav').classList.remove('nav--scrolled'),
  });

  // Section headings fade in
  document.querySelectorAll('[data-aph-type] h2, [data-aph-type] .section-eyebrow').forEach(el => {
    gsap.from(el, {
      y: 20, opacity: 0, duration: 0.5,
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // Feature cards stagger
  gsap.from('.feature-card, .pricing-card, .testimonial-card', {
    y: 40, opacity: 0, duration: 0.6,
    stagger: { amount: 0.4 },
    ease: 'power2.out',
    scrollTrigger: { trigger: '.section-features, .section-pricing, .section-testimonials', start: 'top 80%' }
  });

  // Stats count-up
  document.querySelectorAll('[data-count-to]').forEach(el => {
    const target = parseFloat(el.dataset.countTo);
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 1.5, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => { el.textContent = Math.round(obj.val).toLocaleString(); }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        gsap.to(i.querySelector('.faq-answer'), { height: 0, duration: 0.3, ease: 'power2.inOut' });
      });
      if (!isOpen) {
        item.classList.add('open');
        gsap.set(answer, { height: 'auto' });
        gsap.from(answer, { height: 0, duration: 0.3, ease: 'power2.inOut' });
      }
    });
  });

}
```

---

## Quality Checklist (Clean SaaS Specific)

Before returning, verify ALL:

1. Every heading uses a SINGLE font-weight (no mixed weights)
2. Hero headline is centered with max-width constraint (800px or less)
3. Layout is perfectly symmetrical — no element is off-center
4. Feature grid uses uniform equal-width columns
5. No bento grids, no asymmetric layouts anywhere
6. No parallax scrolling effects
7. No decorative SVG shapes (radial gradient atmosphere is sufficient)
8. No gradient text anywhere
9. No horizontal scroll sections
10. Pricing "recommended" card has accent border and scale
11. Testimonials are in a grid, NOT horizontal scroll
12. Stats have count-up animation with `data-count-to`
13. All section headings have an eyebrow label above them
14. Nav has glassmorphism on scroll
15. The overall feel: could this be a page on Linear.app or Vercel.com? If not, simplify.
