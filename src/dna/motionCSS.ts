// ============================================================
// APHANTASIA — Motion CSS Generator
// ============================================================
// Generates CSS for entrance animations, hover effects,
// and stagger delays based on DNAMotion settings.
// Respects prefers-reduced-motion.
// ============================================================

import type { DNAMotion } from "./DesignDNA";

// ---------------------------------------------------------------------------
// Entrance keyframes
// ---------------------------------------------------------------------------

const KEYFRAMES = {
  "fade-up": `
@keyframes aph-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}`,
  "fade-in": `
@keyframes aph-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
  "slide-in": `
@keyframes aph-slide-in {
  from { opacity: 0; transform: translateX(-24px); }
  to { opacity: 1; transform: translateX(0); }
}`,
  "scale-up": `
@keyframes aph-scale-up {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}`,
  "none": "",
} as const;

// ---------------------------------------------------------------------------
// Hover effect classes
// ---------------------------------------------------------------------------

function hoverCSS(hover: DNAMotion["hover"], duration: string): string {
  const transition = `transition: all ${duration} cubic-bezier(0.4, 0, 0.2, 1);`;

  switch (hover) {
    case "lift":
      return `
.aph-hover-lift, .aph-card-elevated, .aph-card-bordered, .aph-card-glass {
  ${transition}
}
.aph-hover-lift:hover, [data-motion="subtle"] .aph-card-elevated:hover,
[data-motion="expressive"] .aph-card-elevated:hover,
[data-motion="subtle"] .aph-card-bordered:hover,
[data-motion="expressive"] .aph-card-bordered:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
}`;
    case "glow":
      return `
.aph-hover-glow, .aph-card-elevated, .aph-card-bordered, .aph-card-glass {
  ${transition}
}
.aph-hover-glow:hover, [data-motion="subtle"] .aph-card-elevated:hover,
[data-motion="expressive"] .aph-card-elevated:hover,
[data-motion="subtle"] .aph-card-bordered:hover,
[data-motion="expressive"] .aph-card-bordered:hover {
  box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 30%, transparent);
}`;
    case "scale":
      return `
.aph-hover-scale, .aph-card-elevated, .aph-card-bordered, .aph-card-glass {
  ${transition}
}
.aph-hover-scale:hover, [data-motion="subtle"] .aph-card-elevated:hover,
[data-motion="expressive"] .aph-card-elevated:hover,
[data-motion="subtle"] .aph-card-bordered:hover,
[data-motion="expressive"] .aph-card-bordered:hover {
  transform: scale(1.02);
}`;
    case "border-accent":
      return `
.aph-hover-border-accent, .aph-card-bordered {
  ${transition}
}
.aph-hover-border-accent:hover, [data-motion="subtle"] .aph-card-bordered:hover,
[data-motion="expressive"] .aph-card-bordered:hover {
  border-color: var(--accent);
}`;
    case "none":
    default:
      return "";
  }
}

// ---------------------------------------------------------------------------
// Stagger delay classes
// ---------------------------------------------------------------------------

function staggerCSS(staggerDelay: string): string {
  const delays = [];
  for (let i = 1; i <= 8; i++) {
    delays.push(`.aph-reveal-delay-${i} { animation-delay: calc(${i} * ${staggerDelay}); }`);
  }
  return delays.join("\n");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function generateMotionCSS(motion: DNAMotion): string {
  // Level none: disable all animations
  if (motion.level === "none") {
    return `
.aph-reveal { opacity: 1 !important; transform: none !important; animation: none !important; }
.aph-stagger > * { opacity: 1 !important; transform: none !important; }
.aph-hover-lift:hover, .aph-hover-glow:hover, .aph-hover-scale:hover, .aph-hover-border-accent:hover {
  transform: none !important;
  box-shadow: none !important;
}
`;
  }

  const entrance = motion.entrance;
  const keyframe = KEYFRAMES[entrance] || "";
  const animName = entrance !== "none" ? `aph-${entrance}` : "none";

  let css = "";

  // Keyframe definition
  if (keyframe) css += keyframe + "\n";

  // Reveal class — paused until IntersectionObserver triggers
  css += `
.aph-reveal {
  opacity: 0;
  animation: ${animName} ${motion.duration} cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-play-state: paused;
}
.aph-reveal.aph-visible {
  animation-play-state: running;
}
`;

  // Stagger children (existing pattern enhanced with DNA values)
  css += `
.aph-stagger > * {
  opacity: 0;
  animation: ${animName} ${motion.duration} cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-play-state: paused;
}
.aph-stagger.aph-visible > * {
  animation-play-state: running;
}
`;

  // Per-child stagger delays
  for (let i = 1; i <= 8; i++) {
    css += `.aph-stagger.aph-visible > *:nth-child(${i}) { animation-delay: calc(${i} * ${motion.staggerDelay}); }\n`;
  }

  // Reveal delay classes
  css += staggerCSS(motion.staggerDelay) + "\n";

  // Hover effects
  css += hoverCSS(motion.hover, motion.duration) + "\n";

  // Button hover for expressive
  if (motion.level === "expressive") {
    css += `
.aph-btn-accent {
  transition: all ${motion.duration} cubic-bezier(0.4, 0, 0.2, 1);
}
.aph-btn-accent:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--accent) 40%, transparent);
}
`;
  }

  // Marquee animation (always available)
  css += `
@keyframes aph-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
`;

  // Reduced motion override
  css += `
@media (prefers-reduced-motion: reduce) {
  .aph-reveal, .aph-stagger > * {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .aph-hover-lift:hover, .aph-hover-glow:hover, .aph-hover-scale:hover {
    transform: none !important;
  }
}
`;

  return css;
}
