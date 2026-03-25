// ============================================================
// APHANTASIA for REBTEL — Interaction Script (Phase 4)
// ============================================================
// Returns a JavaScript string to be injected into the iframe's
// srcDoc. Handles button press states, input focus, toggle
// switches, tab bar navigation, and screen navigation via CTA.
//
// Supports two modes:
//   - "design": Rebtel interaction handlers disabled, base
//     aphantasia handlers (text edit, variant pick) active.
//   - "preview": Rebtel handlers active, base handlers disabled.
//     Clicks navigate, toggle, and interact like a real app.
// ============================================================

/**
 * Build the interaction CSS that gets injected alongside the script.
 */
export function buildRebtelInteractionCSS(): string {
  return `
/* ── Rebtel Interaction States ─────────────────────────────── */
[data-interactive="button"] {
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}
[data-interactive="button"].pressed {
  transform: scale(0.97);
  opacity: 0.8;
}
[data-interactive="input"].focused {
  outline: 2px solid var(--rebtel-red, #E63946);
  outline-offset: -2px;
}
[data-interactive="toggle"] {
  cursor: pointer;
}
[data-interactive="toggle"] .toggle-track {
  transition: background 0.2s;
}
[data-interactive="toggle"].on .toggle-track {
  background: var(--rebtel-green, #2ECC71);
}
[data-interactive="toggle"].on .toggle-thumb {
  transform: translateX(20px);
}
[data-interactive="tab"] {
  cursor: pointer;
}

/* Preview mode cursor for clickable elements */
body.rebtel-preview [data-interactive] {
  cursor: pointer;
}
body.rebtel-preview [data-navigate-to] {
  cursor: pointer;
}
`;
}

/**
 * Build the interaction JavaScript to inject into the iframe srcDoc.
 *
 * Supports mode switching via postMessage:
 *   parent → iframe: { type: "rebtel:set-mode", mode: "design" | "preview" }
 *
 * In "design" mode: Rebtel handlers are no-ops, base aphantasia
 * click/dblclick handlers work normally for text editing and variant picking.
 *
 * In "preview" mode: Rebtel handlers are active, and the base aphantasia
 * single-click handler (component selection) is suppressed.
 */
export function buildRebtelInteractionScript(): string {
  return `
(function() {
  "use strict";

  var mode = "design"; // default: design mode

  function applyMode(newMode) {
    mode = newMode || "design";
    if (mode === "preview") {
      document.body.classList.add("rebtel-preview");
    } else {
      document.body.classList.remove("rebtel-preview");
    }
  }

  // Listen for mode switch from parent
  window.addEventListener("message", function(e) {
    if (e.data && e.data.type === "rebtel:set-mode") {
      applyMode(e.data.mode);
    }
  });

  // Signal to parent that we're ready to receive messages
  window.parent.postMessage({ type: "rebtel:iframe-ready" }, "*");

  // ── Button press states ────────────────────────────────────
  document.addEventListener("click", function(e) {
    if (mode !== "preview") return;

    var btn = e.target.closest('[data-interactive="button"]');
    if (btn) {
      e.stopPropagation();
      e.preventDefault();
      btn.classList.add("pressed");
      setTimeout(function() { btn.classList.remove("pressed"); }, 150);

      // Check for navigation target on the button itself OR on ancestor wrapper
      var navAncestor = btn.closest("[data-navigate-to]");
      var target = btn.getAttribute("data-navigate-to")
        || (navAncestor ? navAncestor.getAttribute("data-navigate-to") : null);
      if (target) {
        window.parent.postMessage({ type: "rebtel:navigate", screenId: target }, "*");
      }
      return;
    }

    // Toggle switches
    var toggle = e.target.closest('[data-interactive="toggle"]');
    if (toggle) {
      e.stopPropagation();
      e.preventDefault();
      toggle.classList.toggle("on");
      return;
    }

    // Tab bar
    var tab = e.target.closest('[data-interactive="tab"]');
    if (tab) {
      e.stopPropagation();
      e.preventDefault();
      var parent = tab.parentElement;
      if (parent) {
        parent.querySelectorAll('[data-interactive="tab"]').forEach(function(sib) {
          sib.classList.remove("active");
        });
      }
      tab.classList.add("active");
      var tabs = parent ? Array.from(parent.querySelectorAll('[data-interactive="tab"]')) : [tab];
      window.parent.postMessage({ type: "rebtel:tab-change", tabIndex: tabs.indexOf(tab) }, "*");
      return;
    }

    // Generic navigate-to on any element
    var navEl = e.target.closest("[data-navigate-to]");
    if (navEl) {
      e.stopPropagation();
      e.preventDefault();
      var navTarget = navEl.getAttribute("data-navigate-to");
      if (navTarget) {
        window.parent.postMessage({ type: "rebtel:navigate", screenId: navTarget }, "*");
      }
      return;
    }
  }, true); // useCapture to fire before base handlers

  // ── Form input focus ───────────────────────────────────────
  document.querySelectorAll('[data-interactive="input"]').forEach(function(el) {
    el.addEventListener("focus", function() {
      if (mode !== "preview") return;
      el.classList.add("focused");
    });
    el.addEventListener("blur", function() {
      el.classList.remove("focused");
    });
  });

  // ── Suppress base aphantasia single-click in preview mode ──
  // The base script (themeInjector.ts) listens for single clicks
  // to trigger component selection / variant picker. In preview
  // mode we block that by adding a capture-phase listener that
  // stops propagation for interactive elements.
  document.addEventListener("click", function(e) {
    if (mode !== "preview") return;
    // In preview mode, prevent the base component-select handler
    // from firing. The handlers above already handled interactive
    // elements. For non-interactive elements, still block to
    // prevent accidental variant picker popups.
    var comp = e.target.closest("[data-shape-id]");
    if (comp) {
      // Don't propagate to base handler
      e.stopImmediatePropagation();
    }
  }, true); // useCapture

  // ── Block double-click text editing in preview mode ────────
  document.addEventListener("dblclick", function(e) {
    if (mode !== "preview") return;
    e.stopImmediatePropagation();
    e.preventDefault();
  }, true);

})();
`;
}
