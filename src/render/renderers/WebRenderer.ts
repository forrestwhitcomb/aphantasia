import type { CanvasDocument, CanvasShape } from "@/engine/CanvasEngine";
import type { RenderEngine, RenderOutput } from "../RenderEngine";

// ---------------------------------------------------------------------------
// WebRenderer — Phase 1
// Converts a semantically resolved CanvasDocument into a full HTML page.
// Synchronous, deterministic, zero AI dependency.
// ---------------------------------------------------------------------------

export class WebRenderer implements RenderEngine {
  renderPhase1(doc: CanvasDocument): RenderOutput {
    const inside = doc.shapes
      .filter((s) => s.isInsideFrame && s.semanticTag !== "unknown" && s.semanticTag !== "scratchpad" && s.semanticTag !== "context-note")
      .sort((a, b) => a.y - b.y);

    if (inside.length === 0) {
      return { html: emptyState(), css: "" };
    }

    const blocks = inside.map((s) => renderBlock(s)).filter(Boolean).join("\n");
    return { html: wrapDocument(blocks), css: "" };
  }

  async render(doc: CanvasDocument, context: string): Promise<RenderOutput> {
    return this.renderPhase1(doc);
  }

  async renderPhase2(doc: CanvasDocument, _context: string): Promise<RenderOutput> {
    // Phase 2: AI refinement — implemented in Phase 3
    return this.renderPhase1(doc);
  }
}

// ---------------------------------------------------------------------------
// Block renderers
// ---------------------------------------------------------------------------

function renderBlock(shape: CanvasShape): string {
  const text = shape.label || shape.content || "";

  switch (shape.semanticTag) {
    case "nav":        return renderNav(text);
    case "hero":       return renderHero(text);
    case "section":    return renderSection(text);
    case "cards":      return renderCards(text);
    case "footer":     return renderFooter(text);
    case "button":     return renderButton(text);
    case "image":      return renderImage(text);
    case "form":       return renderForm(text);
    case "split":      return renderSplit(text);
    case "text-block": return renderTextBlock(text);
    default:           return "";
  }
}

function renderNav(text: string): string {
  const logo = text || "Logo";
  return `<nav class="aph-nav">
  <div class="aph-nav-inner">
    <span class="aph-logo">${esc(logo)}</span>
    <ul class="aph-nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </div>
</nav>`;
}

function renderHero(text: string): string {
  const headline = text || "Your Big Idea, Built.";
  return `<section class="aph-hero">
  <div class="aph-hero-inner">
    <h1>${esc(headline)}</h1>
    <p class="aph-hero-sub">A compelling description of what you do and why it matters to the people who need it most.</p>
    <div class="aph-hero-cta">
      <a href="#" class="aph-btn-primary">Get Started</a>
      <a href="#" class="aph-btn-ghost">Learn More</a>
    </div>
  </div>
</section>`;
}

function renderSection(text: string): string {
  const title = text || "Section Title";
  return `<section class="aph-section">
  <div class="aph-inner">
    <h2>${esc(title)}</h2>
    <p class="aph-section-body">Add your content here. This section will be refined based on your context and the rest of your canvas.</p>
  </div>
</section>`;
}

function renderCards(text: string): string {
  const title = text || "Features";
  const cards = [
    { icon: "◆", heading: "First Thing", body: "Brief description of this feature and why it matters." },
    { icon: "◈", heading: "Second Thing", body: "Brief description of this feature and why it matters." },
    { icon: "◉", heading: "Third Thing", body: "Brief description of this feature and why it matters." },
  ];
  const cardHtml = cards
    .map(
      (c) => `<div class="aph-card">
      <div class="aph-card-icon">${c.icon}</div>
      <h3>${c.heading}</h3>
      <p>${c.body}</p>
    </div>`
    )
    .join("\n    ");
  return `<section class="aph-cards">
  <div class="aph-inner">
    <h2 class="aph-cards-title">${esc(title)}</h2>
    <div class="aph-cards-grid">
    ${cardHtml}
    </div>
  </div>
</section>`;
}

function renderSplit(text: string): string {
  const heading = text || "Why it works";
  return `<section class="aph-split">
  <div class="aph-inner aph-split-inner">
    <div class="aph-split-text">
      <h2>${esc(heading)}</h2>
      <p>Describe this feature or concept in a sentence or two. Keep it focused and outcome-oriented.</p>
      <a href="#" class="aph-btn-primary">Learn More</a>
    </div>
    <div class="aph-split-visual">
      <div class="aph-split-placeholder"></div>
    </div>
  </div>
</section>`;
}

function renderForm(text: string): string {
  const heading = text || "Get in touch";
  return `<section class="aph-form-section">
  <div class="aph-inner">
    <h2>${esc(heading)}</h2>
    <form class="aph-form">
      <input type="text"  placeholder="Your name"         class="aph-input" />
      <input type="email" placeholder="Email address"     class="aph-input" />
      <textarea           placeholder="Your message"      class="aph-textarea"></textarea>
      <button type="submit" class="aph-btn-primary">Send Message</button>
    </form>
  </div>
</section>`;
}

function renderFooter(text: string): string {
  const brand = text || "Company";
  return `<footer class="aph-footer">
  <div class="aph-inner aph-footer-inner">
    <span class="aph-footer-logo">${esc(brand)}</span>
    <span class="aph-footer-copy">© ${new Date().getFullYear()} ${esc(brand)}. All rights reserved.</span>
    <ul class="aph-footer-links">
      <li><a href="#">Privacy</a></li>
      <li><a href="#">Terms</a></li>
    </ul>
  </div>
</footer>`;
}

function renderButton(text: string): string {
  return `<div class="aph-inner aph-btn-row">
  <a href="#" class="aph-btn-primary">${esc(text || "Get Started")}</a>
</div>`;
}

function renderImage(text: string): string {
  return `<div class="aph-inner">
  <div class="aph-img-placeholder" role="img" aria-label="${esc(text || "Image")}">
    <span>${esc(text || "Image")}</span>
  </div>
</div>`;
}

function renderTextBlock(text: string): string {
  if (!text) return "";
  return `<div class="aph-inner">
  <p class="aph-text-block">${esc(text)}</p>
</div>`;
}

// ---------------------------------------------------------------------------
// Document shell + CSS
// ---------------------------------------------------------------------------

function wrapDocument(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>${BASE_CSS}</style>
</head>
<body>
${body}
</body>
</html>`;
}

function emptyState(): string {
  return wrapDocument(`<div class="aph-empty">
  <p>Draw shapes inside the Page frame to see a live preview.</p>
</div>`);
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Base CSS — clean, modern, minimal design system
// ---------------------------------------------------------------------------

const BASE_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; }
body { font-family: 'Inter', system-ui, sans-serif; background: #fff; color: #111; line-height: 1.6; }
a { color: inherit; text-decoration: none; }

.aph-inner { max-width: 1100px; margin: 0 auto; padding: 0 40px; }

/* Nav */
.aph-nav { border-bottom: 1px solid #eee; padding: 0; }
.aph-nav-inner { max-width: 1100px; margin: 0 auto; padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; }
.aph-logo { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; }
.aph-nav-links { list-style: none; display: flex; gap: 32px; }
.aph-nav-links a { font-size: 14px; color: #555; font-weight: 500; transition: color .15s; }
.aph-nav-links a:hover { color: #111; }

/* Hero */
.aph-hero { padding: 100px 0 80px; background: #fff; }
.aph-hero-inner { max-width: 1100px; margin: 0 auto; padding: 0 40px; }
.aph-hero h1 { font-size: clamp(36px, 5vw, 64px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; max-width: 720px; }
.aph-hero-sub { margin-top: 20px; font-size: 18px; color: #555; line-height: 1.65; max-width: 560px; }
.aph-hero-cta { margin-top: 36px; display: flex; gap: 12px; flex-wrap: wrap; }

/* Buttons */
.aph-btn-primary { display: inline-flex; align-items: center; padding: 12px 24px; background: #111; color: #fff; font-weight: 600; font-size: 14px; border-radius: 8px; transition: background .15s; cursor: pointer; }
.aph-btn-primary:hover { background: #333; }
.aph-btn-ghost { display: inline-flex; align-items: center; padding: 12px 24px; border: 1px solid #ddd; color: #333; font-weight: 500; font-size: 14px; border-radius: 8px; transition: border-color .15s; cursor: pointer; }
.aph-btn-ghost:hover { border-color: #999; }
.aph-btn-row { padding: 20px 0; display: flex; gap: 12px; }

/* Section */
.aph-section { padding: 80px 0; }
.aph-section h2 { font-size: 32px; font-weight: 700; letter-spacing: -0.02em; }
.aph-section-body { margin-top: 16px; font-size: 16px; color: #555; max-width: 640px; }

/* Cards */
.aph-cards { padding: 80px 0; background: #fafafa; }
.aph-cards-title { font-size: 32px; font-weight: 700; letter-spacing: -0.02em; text-align: center; margin-bottom: 48px; }
.aph-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.aph-card { background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 28px; }
.aph-card-icon { font-size: 24px; margin-bottom: 16px; }
.aph-card h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
.aph-card p { font-size: 14px; color: #666; line-height: 1.6; }

/* Split */
.aph-split { padding: 80px 0; }
.aph-split-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.aph-split-text h2 { font-size: 32px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 16px; }
.aph-split-text p { font-size: 16px; color: #555; margin-bottom: 28px; }
.aph-split-visual { }
.aph-split-placeholder { aspect-ratio: 4/3; background: #f0f0f0; border-radius: 12px; }

/* Form */
.aph-form-section { padding: 80px 0; }
.aph-form-section h2 { font-size: 32px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 36px; }
.aph-form { display: flex; flex-direction: column; gap: 12px; max-width: 480px; }
.aph-input, .aph-textarea { font-family: inherit; font-size: 15px; padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px; outline: none; transition: border-color .15s; }
.aph-input:focus, .aph-textarea:focus { border-color: #888; }
.aph-textarea { min-height: 120px; resize: vertical; }
.aph-form .aph-btn-primary { align-self: flex-start; border: none; }

/* Image placeholder */
.aph-img-placeholder { aspect-ratio: 16/9; background: #f0f0f0; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 20px 0; }
.aph-img-placeholder span { font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.08em; }

/* Text block */
.aph-text-block { font-size: 16px; color: #444; line-height: 1.75; padding: 20px 0; max-width: 720px; }

/* Footer */
.aph-footer { border-top: 1px solid #eee; padding: 32px 0; margin-top: auto; }
.aph-footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.aph-footer-logo { font-weight: 700; font-size: 15px; }
.aph-footer-copy { font-size: 13px; color: #888; }
.aph-footer-links { list-style: none; display: flex; gap: 20px; }
.aph-footer-links a { font-size: 13px; color: #888; }
.aph-footer-links a:hover { color: #111; }

/* Empty state */
.aph-empty { height: 100vh; display: flex; align-items: center; justify-content: center; }
.aph-empty p { font-size: 14px; color: #aaa; }
`;
