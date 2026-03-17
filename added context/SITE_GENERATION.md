# Aphantasia — Site Generation Instructions

These instructions govern how the AI generates deployable React sites from canvas sketches. Read this before writing any site generation code or prompts.

---

## Core Philosophy

The goal is not to "build what the user drew." The goal is to **interpret the user's intent and render it as a premium, production-quality site** — the kind someone would screenshot. The canvas sketch is a structured brief, not a spec. Treat it like a world-class designer would treat a rough napkin sketch: extract the intent, elevate the execution.

---

## The Four Non-Negotiables

### 1. Enforce the Design System — No Exceptions

**The design system is everything.**

- Never write raw color values in components. No `text-white`, `bg-black`, `#3b82f6`, `rgb(...)`. None.
- Always use semantic design tokens defined in `index.css` and `tailwind.config.ts`.
- Every color, spacing, radius, shadow, and font must flow through the token system.
- Customize shadcn components using their variant system — never override them with one-off classes.
- The token system is what makes the site feel *cohesive*. Bypass it and the site looks AI-generated.

### 2. Use the Constrained Stack — Don't Invent

The stack is: **React + Vite + TypeScript + Tailwind CSS + shadcn/ui**

- Always reach for shadcn components first. Button, Card, Dialog, Sheet, Input — use them.
- Customize shadcn components with proper variants in the component file, not inline.
- Use Lucide icons (already in the shadcn ecosystem).
- Tailwind breakpoints only — no custom media queries unless explicitly required.
- Mobile-first responsive layout on every component, every time.

This stack constraint is not a limitation — it's why the output looks good. The AI has deep knowledge of this stack. Departing from it introduces inconsistency.

### 3. First Render Must Earn a Screenshot

The first time a user sees their generated site, it must feel like a premium product.

When generating, the internal bar is: *"Would a founder use this in an investor deck?"*

This means:
- Real visual hierarchy — not everything the same weight
- Considered whitespace — breathe, don't cram
- Intentional typography — size contrast, weight contrast, line-height
- Subtle depth — shadows, borders, or blur where appropriate (not everywhere)
- Smooth interactions — hover states, transitions on interactive elements

Do not generate a functional wireframe. Generate a finished design.

### 4. Context from the Canvas Is Sacred

The user's sketch contains structured intent that no text prompt can match. Before generating, extract and serialize the following from the canvas data:

```
- Layout archetype (hero + sections, dashboard, landing, portfolio, etc.)
- Frame hierarchy (what's primary, secondary, supporting)
- Any notes attached to shapes (these are direct user intent signals)
- Scratchpad content (rough ideas, style words, references)
- Implied content type (SaaS, personal, product, editorial, etc.)
```

This extracted context must be passed to the AI as a structured preamble — not appended casually at the end of a prompt. It is the most valuable input in the entire pipeline.

---

## The Generation Prompt Structure

When calling the AI to generate site code, always use this structure:

```
SYSTEM:
You are a world-class frontend engineer and product designer generating a deployable React site. Your output must feel like a premium, production-quality product — not a prototype.

Design system rules (non-negotiable):
- Use only semantic tokens from index.css and tailwind.config.ts
- Never use raw colors, hardcoded hex values, or non-token classes
- Use shadcn/ui components with proper variants
- Mobile-first, fully responsive at all Tailwind breakpoints
- This is the user's first render — make it something they'd screenshot

USER:
## Canvas Intent
[Serialized canvas data: layout archetype, frame hierarchy, shape notes, scratchpad]

## Additional Context
[User-provided context from the context panel]

## Design Direction
Theme: [bold / minimal / editorial / playful — resolved from sketch + context]
Token palette: [resolved color/typography tokens for this theme]
Layout archetype: [hero+sections / dashboard / landing / portfolio / etc.]

Generate the complete site. Start with the root layout, then primary sections, then supporting components.
```

The design direction block should be **resolved by Aphantasia before the prompt is sent** — not left for the AI to guess.

---

## Theme Resolution

When a user's sketch + context is processed, Aphantasia must resolve a theme before calling the AI. Map signals to archetypes:

| Sketch signals | Implied theme |
|---|---|
| Large hero, minimal text, lots of whitespace | Minimal / Editorial |
| Dense layout, multiple panels, data-heavy | Dashboard / SaaS |
| Bold typography notes, high contrast | Bold / Brand |
| Portfolio-style grid, image-forward | Visual / Gallery |
| Notes mentioning specific brand colors | Custom token set |

This resolved theme becomes the token palette passed into the prompt. The AI should never need to *decide* the visual direction — Aphantasia decides it, the AI executes it.

---

## Token Palette Format

Pass token palettes as concrete CSS variable assignments, not descriptions:

```css
/* Example: Minimal theme tokens */
--background: 0 0% 98%;
--foreground: 0 0% 9%;
--primary: 220 90% 56%;
--primary-foreground: 0 0% 100%;
--muted: 0 0% 94%;
--muted-foreground: 0 0% 45%;
--border: 0 0% 89%;
--radius: 0.375rem;
```

This goes into `index.css` before the AI generates component code. Components then reference `bg-primary`, `text-foreground`, etc. — never the raw values.

---

## Canvas Data Serialization

The sketch-to-prompt pipeline should serialize canvas frames as structured text, not a description. Example:

```
Frame: "Hero"
  Type: hero-section
  Note: "Big headline, short subtext, single CTA button — keep it clean"
  Children: [heading, subheading, cta-button]

Frame: "Features"
  Type: feature-grid
  Note: "3 cards, icon + title + description each"
  Children: [feature-card × 3]

Frame: "Footer"
  Type: footer
  Note: (none)
  Children: [nav-links, copyright]

Scratchpad notes: "dark mode friendly, Raycast vibes, Inter font"
```

This is passed verbatim in the `## Canvas Intent` block. The richer this serialization, the more bespoke the output.

---

## What to Never Do

- ❌ Generate sites with hardcoded colors (`text-blue-500`, `bg-gray-100`)
- ❌ Use inline styles (`style={{ color: '#fff' }}`)
- ❌ Skip responsive behavior on any component
- ❌ Send the canvas sketch to the AI without first resolving a theme and token palette
- ❌ Let the AI decide the design direction — Aphantasia decides it
- ❌ Generate a functional wireframe and call it done — first render is the product
- ❌ Ignore shape notes — they are the highest-signal input in the entire pipeline
