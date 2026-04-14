# Session Context — 2026-03-16

> Covers work completed across two extended sessions (2026-03-15 to 2026-03-16). This document captures every major feature built, architectural decisions made, current project state, known issues, and potential next steps.

---

## Session Overview

This session advanced Aphantasia from Phase 2 (context nodes) through the bulk of Phases 3, 4, and 6. Four major feature areas were implemented:

1. **Reference Token System** — Style extraction from screenshots into theme tokens
2. **Component Library + Browser** — Pre-built section catalog with canvas placement
3. **Deploy to GitHub → Vercel** — Full export pipeline with OAuth and CTA link review
4. **Homepage Polish** — Beta badge, logo, favicon

---

## 1. Reference Token System

### What Was Built

A pipeline for extracting CSS-ready design tokens from screenshot reference images and applying them to the theme system.

**Key Files:**
- `src/types/reference.ts` — `ReferenceEntry`, `ExtractedStyleTokens` types
- `src/reference/ReferenceStore.ts` — Singleton store for reference images and their extracted tokens
- `src/reference/index.ts` — Barrel export
- `src/app/api/extract-reference/route.ts` — Claude vision API endpoint that analyzes screenshots and returns CSS-ready tokens
- `src/lib/theme.ts` — `ThemeTokens`, `PRESETS`, `applyReferenceTokens()`, `applyBrandColors()`

**Token Fields (CSS-ready):**
- `background`, `foreground`, `accent` — Core colors
- `fontHeading`, `fontBody` — Typography
- `headingWeight` — Font weight
- `buttonRadius`, `cardRadius` — Border radii
- `sectionPadding` — Spacing
- `buttonStyle`, `cardStyle` — Descriptive style hints

### Decisions Made

- **CSS-ready over abstract**: Tokens map directly to CSS custom properties rather than using abstract names like `typography` or `spacing`. This avoids a translation layer and makes the serializer prompt cleaner.
- **Priority cascade**: Reference tokens → context brand colors → preset defaults. Brand colors from the context panel override reference tokens for color values specifically, but reference tokens take priority over plain preset defaults.
- **Singleton pattern**: `ReferenceStore` uses `globalThis` for HMR survival, consistent with `ContextStore` and `ExportStore`.

### Integration Points

- `PreviewPane.tsx` updated `buildEnrichedDocument` to call `applyReferenceTokens()` instead of old color-only merge
- `serializer.ts` updated STYLE REFERENCES prompt section to use new CSS-ready field names
- `CanvasReferenceWidget.tsx` provides UI for viewing/managing reference images on canvas

---

## 2. Component Library + Browser

### What Was Built

A component catalog of 10 pre-built section types that users can browse and place onto the canvas as semantic shapes.

**Key Files:**
- `src/lib/componentCatalog.ts` — Catalog entries + `placeComponent()` function
- `src/components/ComponentBrowser.tsx` — Glassmorphic overlay UI
- `src/components/sections/` — 10 section renderers (see below)
- `src/render/renderSection.ts` — Dispatcher that routes `SectionContent` to renderers
- `src/types/render.ts` — Full prop types for all 10 sections

**The 10 Section Types:**

| Section | File | Description |
|---|---|---|
| Nav | `NavSection.ts` | Top navigation bar with logo, links, CTA |
| Hero | `HeroSection.ts` | Hero banner with headline, subhead, CTAs |
| Feature Grid | `FeatureGridSection.ts` | Card grid with icons, titles, descriptions |
| Text-Image Split | `TextImageSplitSection.ts` | Two-column text + image layout |
| CTA | `CTASection.ts` | Call-to-action banner |
| Footer | `FooterSection.ts` | Site footer with columns and links |
| Portfolio | `PortfolioSection.ts` | Image gallery / portfolio grid |
| Ecommerce Grid | `EcommerceGridSection.ts` | Product cards with prices |
| Event Signup | `EventSignupSection.ts` | Event details + signup form |
| Generic | `GenericSection.ts` | Fallback for uncategorized sections |

### Component Browser UX

- **Opens via**: "+" button on toolbar OR "/" keyboard shortcut
- **Categories**: All | Layout | Content | Commerce | Utility (pill filter)
- **Layout**: 2-column grid of cards with name, description, category badge
- **Closing**: Escape key, backdrop click, or selecting a component
- **Placement**: New shape placed below all existing in-frame shapes with 16px gap, auto-selected

### Decisions Made

- **No new renderer needed**: Components leverage the existing semantic tag + label hint pipeline. Placing a component creates a rectangle with the correct `semanticTag` and `label`, which the existing `WebRenderer` and Layer 2 pipeline already handle.
- **Custom DOM events for decoupling**: `aphantasia:open-component-browser` event dispatched from toolbar/keyboard, listened to by `ComponentBrowser.tsx`. Avoids prop drilling through the component tree.
- **Categories mapped to semantic tags**: Each catalog entry maps to one of the existing `SemanticTag` values, maintaining compatibility with the rendering pipeline.

---

## 3. Deploy to GitHub → Vercel

### What Was Built

A complete export flow: authenticate with GitHub, push rendered HTML to a repo, and provide a Vercel deploy link.

**Key Files:**
- `src/app/api/auth/github/route.ts` — OAuth initiation (redirects to GitHub)
- `src/app/api/auth/github/callback/route.ts` — OAuth callback (exchanges code for token)
- `src/app/api/auth/github/status/route.ts` — Auth status check
- `src/app/api/export/route.ts` — Push HTML to GitHub repo via Contents API
- `src/lib/exportStore.ts` — Singleton bridge between PreviewPane and DeployModal
- `src/lib/ctaScanner.ts` — CTA scanning + section anchor collection
- `src/components/DeployModal.tsx` — Multi-step deploy modal

### Deploy Modal Steps

1. **GitHub Auth** — Check if authenticated, show "Connect GitHub" button if not
2. **Project Name** — Input field, defaults from context `productName`, sanitized to `aphantasia-{slug}`
3. **Button Link Review** — Lists all CTAs found in sections, allows setting URLs or internal section anchors
4. **Deploying** — Progress spinner while pushing to GitHub
5. **Success** — Shows repo URL + Vercel import deep link

### CTA Tracking (Cross-Cutting)

Added `ctaHref` / `ctaSecondaryHref` optional fields to all CTA-bearing section prop types. All 10 renderers updated to use `href="${esc(props.ctaHref || '#')}"` instead of hardcoded `href="#"`. Section anchor IDs (`sectionId` parameter) added to all renderers for internal linking support.

### GitHub Integration Details

- **OAuth flow**: Server-side with `httpOnly` cookies (no client-side token exposure)
- **No external packages**: Raw `fetch()` calls to GitHub API
- **Repo creation**: `POST /user/repos` with `auto_init: true`
- **File push**: `PUT /repos/{owner}/{repo}/contents/index.html` with base64 content
- **Updates**: Fetches existing file SHA first for subsequent pushes to same repo
- **Cookie-based auth**: `gh_token` and `gh_user` stored in httpOnly cookies

### Decisions Made

- **GitHub Contents API over git CLI**: Pure REST, no git binary needed, works in serverless (Vercel)
- **Single-file push**: v1 exports a single `index.html` with inlined CSS. No multi-file tree needed.
- **ExportStore singleton**: Bridges PreviewPane (which generates HTML) and DeployModal (which consumes it) without prop drilling or React context
- **Pre-deploy link check**: Users review all CTAs before deploying — reduces broken links in production

---

## 4. Homepage Polish

### What Was Built

- **Beta badge**: Small pill with orange dot + "Beta" text added above the hero subheader in `SplashHero.tsx`
- **Logo in nav**: `logo_black.png` (36×36) placed next to "Aphantasia" text in the top nav bar in `page.tsx`
- **Favicon**: `favicon.png` created from `logo_black.png`, referenced in `layout.tsx` metadata

---

## 5. Additional Components Built

| Component | File | Purpose |
|---|---|---|
| AI Call Counter | `AICallCounter.tsx` | Tracks and displays AI API call count |
| Canvas Context Widget | `CanvasContextWidget.tsx` | On-canvas global context indicator |
| Canvas Reference Widget | `CanvasReferenceWidget.tsx` | On-canvas reference image manager |
| Sparkle Icon | `SparkleIcon.tsx` | Animated sparkle SVG for AI indicators |
| Export Store | `exportStore.ts` | Singleton HTML/sections bridge for deploy |
| AI Call Tracker | `aiCallTracker.ts` | Utility for counting AI calls |
| Text Parse | `textParse.ts` | Text extraction utilities |

---

## 6. Spatial Analysis System

### What Was Built (prior session, documented for completeness)

- `src/spatial/SpatialAnalyzer.ts` — Containment tree + pattern recognition
- `src/spatial/SlotExtractor.ts` — Extracts structured props from spatial groups
- `src/spatial/SlotBag.ts` — Slot accumulator
- `src/spatial/LayoutResolver.ts` — Maps spatial groups to section types
- `src/spatial/index.ts` — Barrel export

Detects nested shapes (e.g., cards inside a container) and automatically creates compound sections without AI.

---

## Current Project State

### Phase Status (Updated)

| Phase | Status |
|---|---|
| Phase 0 — Architecture | ✅ Complete |
| Phase 1 — Canvas + semantic rules + Layer 1 | ✅ Complete |
| Phase 2 — Context layer + context nodes | ✅ Complete |
| Phase 3 — Component library (shadcn/ui) | ✅ Complete (catalog, renderers, browser, types) |
| Phase 4 — Layer 2 AI render | ⚠️ Partial (serializer + API route exist, streaming not wired) |
| Phase 5 — AI canvas suggestions | ❌ Deprioritised (cost concerns) |
| Phase 6 — Export (GitHub → Vercel) | ⚠️ Partial (code complete, GitHub OAuth not configured) |

### Known Issues / Incomplete Items

1. **GitHub OAuth not configured**: `.env.local` has empty `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`. User deferred this — needs a GitHub OAuth App registered and credentials added.

2. **Layer 2 streaming not fully wired**: The serializer and `/api/render` route exist but the full streaming loop (debounce → serialize → stream → merge into preview) is not end-to-end connected in the UI.

3. **Global broadcast node visual indicator**: The ambient halo/highlight on shapes inheriting global context is not implemented. The data flow works; the visual feedback is missing.

4. **Connection type inference UI**: Midpoint type indicator on note connection lines (`copy`/`style`/`structural`) and the radial picker override are not implemented. All connections are currently treated uniformly.

5. **Canvas persistence**: Shapes are not saved/restored on page reload. Only global context persists via localStorage.

6. **AI semantic refinement**: `SemanticResolver.ts` has a TODO for AI-assisted tagging of ambiguous shapes. Currently all tagging is rules-based.

---

## Potential Next Steps

### High Priority

1. **Configure GitHub OAuth** — Register a GitHub OAuth App, add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to `.env.local`, test the full deploy flow end-to-end.

2. **Wire Layer 2 Streaming** — Connect the debounce → serialize → `/api/render` → stream → merge pipeline in PreviewPane. The pieces exist; they need to be composed into a working loop with proper state management (show streaming indicator, merge AI output into preview without layout jumps).

3. **Canvas Persistence** — Serialize `CanvasDocument` to localStorage on change, restore on mount. Critical for any real usage — losing work on refresh is a dealbreaker.

### Medium Priority

4. **Component Customization** — Allow users to edit content within placed components (via notes, inline editing, or a props panel). Currently components render with placeholder content until Layer 2 enriches them.

5. **Context Nodes — Type Inference UI** — Add midpoint indicators on connection lines showing `copy`/`style`/`structural` type, with radial picker to override. Improves the clarity of the context layer.

6. **Global Context Visual Indicator** — Add subtle halo/border on shapes inheriting from global context broadcast. Makes the context layer more legible.

7. **Multi-Frame Support** — Allow multiple independent frames on canvas, each rendering its own page/view. The architecture supports this but the UI assumes a single page.

### Lower Priority

8. **Export Enhancements** — Multi-file export (separate CSS, multiple pages), asset handling (images), custom domain configuration via Vercel API.

9. **AI Semantic Refinement** — Send ambiguous shapes to Claude for better semantic tagging. Would improve accuracy for edge cases where rules-based tagging is insufficient.

10. **Template Presets** — Pre-built canvas layouts (landing page, portfolio, SaaS) that users can start from instead of blank canvas.

11. **Collaborative Features** — Multi-user canvas (would require migrating from localStorage to a real-time backend like Supabase + presence).

---

## Architecture Summary

```
Canvas (CustomCanvasEngine)
  ↓ shapes + semantic tags
Semantic Resolver (rules-based)
  ↓ tagged shapes
Spatial Analyzer (containment detection)
  ↓ grouped sections
Slot Extractor → Layout Resolver
  ↓ SectionContent[]
┌─────────────────────┬──────────────────────┐
│ Layer 1 (WebRenderer)│ Layer 2 (serializer) │
│ Instant, rules-based │ AI-enriched, async   │
│ Placeholder content  │ Real contextual copy │
└─────────────────────┴──────────────────────┘
  ↓ HTML
PreviewPane (iframe srcDoc)
  ↓
ExportStore → DeployModal → GitHub API → Vercel
```

### Singleton Stores

| Store | File | Purpose | Persistence |
|---|---|---|---|
| ContextStore | `src/context/ContextStore.ts` | Global context (product desc, tone, brand) | localStorage |
| ReferenceStore | `src/reference/ReferenceStore.ts` | Reference images + extracted tokens | In-memory |
| ExportStore | `src/lib/exportStore.ts` | Current HTML + sections for deploy | In-memory |

All use `globalThis` pattern for HMR survival.

### Event System

| Event | Dispatcher | Listener |
|---|---|---|
| `aphantasia:open-component-browser` | Toolbar "+" / "/" key | ComponentBrowser.tsx |
| `aphantasia:open-deploy-modal` | Toolbar "Deploy" button | DeployModal.tsx |

---

## Files Changed This Session

### New Files (37)
```
public/favicon.png
public/logo_black.png
public/logo_white.png
src/app/api/auth/github/route.ts
src/app/api/auth/github/callback/route.ts
src/app/api/auth/github/status/route.ts
src/app/api/extract-reference/route.ts
src/components/AICallCounter.tsx
src/components/CanvasContextWidget.tsx
src/components/CanvasReferenceWidget.tsx
src/components/ComponentBrowser.tsx
src/components/DeployModal.tsx
src/components/SparkleIcon.tsx
src/components/sections/CTASection.ts
src/components/sections/EcommerceGridSection.ts
src/components/sections/EventSignupSection.ts
src/components/sections/FeatureGridSection.ts
src/components/sections/FooterSection.ts
src/components/sections/GenericSection.ts
src/components/sections/HeroSection.ts
src/components/sections/NavSection.ts
src/components/sections/PortfolioSection.ts
src/components/sections/TextImageSplitSection.ts
src/components/sections/index.ts
src/components/sections/utils.ts
src/components/ui/badge.tsx
src/components/ui/card.tsx
src/components/ui/separator.tsx
src/lib/aiCallTracker.ts
src/lib/componentCatalog.ts
src/lib/ctaScanner.ts
src/lib/exportStore.ts
src/lib/textParse.ts
src/lib/theme.ts
src/reference/ReferenceStore.ts
src/reference/index.ts
src/render/renderSection.ts
src/spatial/LayoutResolver.ts
src/spatial/SlotBag.ts
src/spatial/SlotExtractor.ts
src/spatial/SpatialAnalyzer.ts
src/spatial/index.ts
src/types/reference.ts
src/types/render.ts
```

### Modified Files (16)
```
src/app/api/export/route.ts
src/app/api/render/route.ts
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/components/PreviewPane.tsx
src/components/SplashHero.tsx
src/components/Toolbar.tsx
src/context/ContextPanel.tsx
src/context/ContextStore.ts
src/engine/CanvasEngine.ts
src/engine/engines/CustomCanvasEngine.tsx
src/render/renderers/WebRenderer.ts
src/render/serializer.ts
src/semantic/SemanticResolver.ts
src/semantic/rules.ts
```

---

*Last updated: 2026-03-16*
