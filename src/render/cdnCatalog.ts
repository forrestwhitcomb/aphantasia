import type { AnimationLevel } from "./themeResolver";

export interface CDNLibrary {
  name: string;
  scriptTag: string;
  usage: string;
}

const GSAP_CORE: CDNLibrary = {
  name: "GSAP",
  scriptTag: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>`,
  usage: `gsap.to(".element", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });`,
};

const GSAP_SCROLL_TRIGGER: CDNLibrary = {
  name: "ScrollTrigger",
  scriptTag: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>`,
  usage: `gsap.registerPlugin(ScrollTrigger);
gsap.from(".section", {
  scrollTrigger: { trigger: ".section", start: "top 80%" },
  opacity: 0, y: 60, duration: 1, ease: "power3.out"
});`,
};

const LENIS: CDNLibrary = {
  name: "Lenis",
  scriptTag: `<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>`,
  usage: `const lenis = new Lenis({ lerp: 0.07 });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);`,
};

const SPLIT_TYPE: CDNLibrary = {
  name: "SplitType",
  scriptTag: `<script src="https://unpkg.com/split-type@0.3.4/umd/index.min.js"></script>`,
  usage: `const text = new SplitType(".headline", { types: "chars" });
gsap.from(text.chars, { opacity: 0, y: 20, stagger: 0.03, duration: 0.6, ease: "power2.out" });`,
};

const THREE_JS: CDNLibrary = {
  name: "Three.js",
  scriptTag: `<script type="importmap">{"imports":{"three":"https://esm.sh/three@0.170.0"}}</script>`,
  usage: `// Use as ES module: import * as THREE from "three";
// Good for: gradient mesh backgrounds, particle fields, shader-based hero visuals`,
};

export function getLibrariesForLevel(level: AnimationLevel): CDNLibrary[] {
  switch (level) {
    case "none":
      return [];
    case "subtle":
      return [GSAP_CORE, GSAP_SCROLL_TRIGGER];
    case "expressive":
      return [GSAP_CORE, GSAP_SCROLL_TRIGGER, LENIS, SPLIT_TYPE, THREE_JS];
  }
}

export function buildScriptTags(libs: CDNLibrary[]): string {
  return libs.map((l) => l.scriptTag).join("\n");
}

export function buildLibraryReference(libs: CDNLibrary[]): string {
  if (libs.length === 0) return "";
  const lines = libs.map(
    (l) => `### ${l.name}\n${l.scriptTag}\nUsage:\n\`\`\`js\n${l.usage}\n\`\`\``
  );
  return `## Available CDN Libraries (already loaded in <head>)\n\n${lines.join("\n\n")}`;
}
