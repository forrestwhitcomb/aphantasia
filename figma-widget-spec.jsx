import { useState } from "react";

const steps = [
  {
    id: "add",
    label: "01 — Add Widget",
    title: "User adds a Design System reference widget",
    description: "Right-click on the canvas near a frame and pick Design System Reference — or hit D. The widget drops as a compact panel with three input options: Image, Website, and Figma.",
    detail: "The widget is always all three options simultaneously — the user just picks which source to connect. They can fill in one, two, or all three to build a richer design system brief.",
    widgetTab: "empty",
  },
  {
    id: "pick",
    label: "02 — Pick Source",
    title: "User selects the Figma tab",
    description: "The widget has three tabs across the top: Image (upload a screenshot or moodboard), Website (paste a URL to scrape styles from), and Figma (link a live frame). User clicks Figma.",
    detail: "All three tabs feed the same downstream object — a design system brief. Figma is just the most structured and reliable source. Image and Website are useful for rough inspiration or when there's no Figma file.",
    widgetTab: "tabs",
  },
  {
    id: "connect",
    label: "03 — Connect Account",
    title: "First-time: user pastes a PAT",
    description: "If no Figma account is connected, the Figma tab shows a one-time auth prompt. User goes to Figma → Settings → Personal Access Tokens, generates a token with file_read scope, and pastes it in.",
    detail: "Token stored in user settings, not per-widget. Every subsequent Figma tab in any widget skips this step. Connection indicator persists in the widget header once set.",
    widgetTab: "auth",
  },
  {
    id: "paste",
    label: "04 — Paste Frame URL",
    title: "User pastes a Figma share link",
    description: "User right-clicks any frame in Figma → Copy link → pastes into the input. Aphantasia parses the file key and node-id from the URL silently. The user only ever sees the frame name.",
    detail: "URL format: figma.com/design/{fileKey}/Title?node-id={nodeId}. Raw IDs are never surfaced. The resolved state shows only the human-readable frame name and a thumbnail preview.",
    widgetTab: "resolving",
  },
  {
    id: "resolved",
    label: "05 — Frame Resolved",
    title: "Widget shows the extracted design system",
    description: "The Figma tab resolves into a compact token preview: color palette, type stack, spacing base, and component count. The widget collapses to a card. User can expand any section to inspect.",
    detail: "Extracted via three Figma REST calls: /nodes (frame structure), /styles (color + type), /variables/local (tokens). The output is a normalized design brief object shared across all three source types.",
    widgetTab: "resolved",
  },
  {
    id: "wire",
    label: "06 — Wire to Frame",
    title: "User connects the widget to a canvas frame",
    description: "User draws a bezier from the widget's output handle to a frame. The connection tells the generation pipeline: use this design system when generating this frame. Multiple frames can share one widget.",
    detail: "The widget is a reusable source node. One widget can connect to many frames — useful for multi-page canvases that share a brand. Or wire separate widgets per frame for per-page overrides.",
    widgetTab: "wired",
  },
  {
    id: "generate",
    label: "07 — Generation",
    title: "All three sources merge into one design brief",
    description: "At generation time, all connected sources (Image + Website + Figma) are merged into a single design brief object. Figma tokens take highest precedence, then Website styles, then Image mood. The brief is injected into the Layer 2 prompt.",
    detail: "Figma wins on color + type + spacing precision. Website helps with layout patterns. Image sets overall mood and feel. The merge is opinionated: structured tokens beat inferred ones, but all three sources contribute.",
    widgetTab: "generating",
  },
];

const COLORS = ["#0052CC","#FF5722","#1A1A2E","#F5F5F5","#00BCD4"];

const SourceTab = ({ label, icon, active, onClick, filled }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1, padding: "7px 4px", background: active ? "#1c1a17" : "transparent",
      border: "none", borderBottom: `2px solid ${active ? "#f59e0b" : "transparent"}`,
      borderRadius: 0, cursor: "pointer", display: "flex", flexDirection: "column",
      alignItems: "center", gap: 3, transition: "all 0.15s",
    }}
  >
    <span style={{ fontSize: 13 }}>{icon}</span>
    <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: active ? "#f59e0b" : filled ? "#a8a29e" : "#57534e", letterSpacing: "0.05em" }}>{label}</span>
    {filled && !active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#f59e0b", marginTop: -2 }}></div>}
  </button>
);

const Widget = ({ tab }) => {
  const [activeTab, setActiveTab] = useState("figma");

  const base = {
    width: 280, background: "#1a1714", border: "1px solid #44403c",
    borderRadius: 14, overflow: "hidden", fontFamily: "'DM Sans', sans-serif",
  };

  if (tab === "empty") return (
    <div style={{ ...base, border: "1px dashed #44403c" }}>
      <div style={{ padding: "12px 14px", borderBottom: "1px solid #292524", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: "#57534e" }}></div>
        <span style={{ fontSize: 12, color: "#78716c", fontWeight: 500 }}>Design System Reference</span>
      </div>
      <div style={{ padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ icon: "🖼", label: "Image" }, { icon: "🔗", label: "Website" }, { icon: "✦", label: "Figma" }].map(s => (
            <div key={s.label} style={{ flex: 1, background: "#211f1c", border: "1px dashed #2c2a27", borderRadius: 8, padding: "10px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span style={{ fontSize: 9, color: "#57534e", fontFamily: "'DM Mono', monospace" }}>{s.label}</span>
            </div>
          ))}
        </div>
        <span style={{ fontSize: 11, color: "#44403c" }}>Connect a source to begin</span>
      </div>
    </div>
  );

  if (tab === "tabs") return (
    <div style={base}>
      <div style={{ padding: "10px 14px 0", borderBottom: "1px solid #292524" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: "#57534e" }}></div>
          <span style={{ fontSize: 12, color: "#d6d3d1", fontWeight: 500 }}>Design System Reference</span>
        </div>
        <div style={{ display: "flex" }}>
          <SourceTab label="Image" icon="🖼" active={false} filled={false} />
          <SourceTab label="Website" icon="🔗" active={false} filled={false} />
          <SourceTab label="Figma" icon="✦" active={true} filled={false} />
        </div>
      </div>
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: "#211f1c", border: "1px solid #292524", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#57534e", fontStyle: "italic" }}>
          Connect your Figma account to link a frame...
        </div>
        <div style={{ fontSize: 11, color: "#44403c", lineHeight: 1.6 }}>
          Or use Image / Website tabs to add reference from other sources.
        </div>
      </div>
    </div>
  );

  if (tab === "auth") return (
    <div style={base}>
      <div style={{ padding: "10px 14px 0", borderBottom: "1px solid #292524" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: "#f59e0b" }}></div>
          <span style={{ fontSize: 12, color: "#d6d3d1", fontWeight: 500 }}>Design System Reference</span>
        </div>
        <div style={{ display: "flex" }}>
          <SourceTab label="Image" icon="🖼" active={false} filled={false} />
          <SourceTab label="Website" icon="🔗" active={false} filled={false} />
          <SourceTab label="Figma" icon="✦" active={true} filled={false} />
        </div>
      </div>
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 11, color: "#78716c", lineHeight: 1.6 }}>
          Generate a token in <span style={{ color: "#a8a29e" }}>Figma → Settings → Personal Access Tokens</span> with <code style={{ background: "#211f1c", padding: "1px 5px", borderRadius: 4, fontSize: 10 }}>file_read</code> scope.
        </div>
        <div style={{ background: "#211f1c", border: "1px solid #44403c", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#a8a29e", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#44403c" }}>figd_</span>
          <span>••••••••••••••••••••</span>
        </div>
        <div style={{ background: "#f59e0b", borderRadius: 8, padding: "9px 12px", fontSize: 12, fontWeight: 600, color: "#1c1a17", textAlign: "center", cursor: "pointer" }}>
          Connect Figma →
        </div>
        <div style={{ fontSize: 10, color: "#44403c", textAlign: "center" }}>One-time setup · stored in your account</div>
      </div>
    </div>
  );

  if (tab === "resolving") return (
    <div style={base}>
      <div style={{ padding: "10px 14px 0", borderBottom: "1px solid #292524" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: "#f59e0b" }}></div>
          <span style={{ fontSize: 12, color: "#d6d3d1", fontWeight: 500 }}>Design System Reference</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#78716c", background: "#211f1c", padding: "2px 7px", borderRadius: 10 }}>✦ connected</span>
        </div>
        <div style={{ display: "flex" }}>
          <SourceTab label="Image" icon="🖼" active={false} filled={false} />
          <SourceTab label="Website" icon="🔗" active={false} filled={false} />
          <SourceTab label="Figma" icon="✦" active={true} filled={false} />
        </div>
      </div>
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: "#211f1c", border: "1px solid #44403c", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#78716c", fontFamily: "'DM Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          figma.com/design/Kx7mN2pR.../DS?node-id=...
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#78716c" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", border: "1.5px solid #57534e", borderTopColor: "#f59e0b", animation: "spin 0.8s linear infinite" }}></div>
          Resolving frame...
        </div>
      </div>
    </div>
  );

  if (tab === "resolved") return (
    <div style={{ ...base, border: "1px solid #57534e" }}>
      <div style={{ padding: "10px 14px 0", borderBottom: "1px solid #292524" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: "#f59e0b" }}></div>
          <span style={{ fontSize: 12, color: "#d6d3d1", fontWeight: 500 }}>Design System Reference</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#78716c", background: "#211f1c", padding: "2px 7px", borderRadius: 10 }}>✦ connected</span>
        </div>
        <div style={{ display: "flex" }}>
          <SourceTab label="Image" icon="🖼" active={false} filled={false} />
          <SourceTab label="Website" icon="🔗" active={false} filled={false} />
          <SourceTab label="Figma" icon="✦" active={true} filled={true} />
        </div>
      </div>
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Frame thumbnail row */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 52, height: 36, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#111113", border: "1px solid #27272a", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#0a0a1a,#0d1f3c)" }}></div>
            <div style={{ position: "absolute", bottom: 4, left: 4, right: 4, height: 3, background: "#0052CC", borderRadius: 1 }}></div>
            <div style={{ position: "absolute", top: 4, left: 4, width: 20, height: 3, background: "#ffffff22", borderRadius: 1 }}></div>
            <div style={{ position: "absolute", top: 10, left: 4, width: 32, height: 3, background: "#ffffff11", borderRadius: 1 }}></div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#e7e5e4", fontWeight: 500, marginBottom: 2 }}>Rebtel 3.0 — Home</div>
            <div style={{ fontSize: 10, color: "#57534e" }}>Design System APP · DS audit</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 10, color: "#78716c" }}>✓</div>
        </div>

        {/* Tokens grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {/* Colors */}
          <div style={{ background: "#211f1c", borderRadius: 8, padding: "10px 10px 8px" }}>
            <div style={{ fontSize: 9, color: "#57534e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Colors</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {COLORS.map(c => (
                <div key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}></div>
              ))}
            </div>
            <div style={{ fontSize: 9, color: "#44403c", marginTop: 6 }}>5 tokens</div>
          </div>
          {/* Type */}
          <div style={{ background: "#211f1c", borderRadius: 8, padding: "10px 10px 8px" }}>
            <div style={{ fontSize: 9, color: "#57534e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Type</div>
            <div style={{ fontSize: 11, color: "#d6d3d1", fontWeight: 500, lineHeight: 1.4 }}>Aktiv Grotesk</div>
            <div style={{ fontSize: 10, color: "#78716c", lineHeight: 1.4 }}>GT America</div>
            <div style={{ fontSize: 9, color: "#44403c", marginTop: 4 }}>2 families · 6 styles</div>
          </div>
          {/* Spacing */}
          <div style={{ background: "#211f1c", borderRadius: 8, padding: "10px 10px 8px" }}>
            <div style={{ fontSize: 9, color: "#57534e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Spacing</div>
            <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
              {[2,4,6,8,10,12].map((h,i) => (
                <div key={i} style={{ width: 4, height: h, background: "#44403c", borderRadius: 1 }}></div>
              ))}
            </div>
            <div style={{ fontSize: 9, color: "#44403c", marginTop: 6 }}>4px base · 8 steps</div>
          </div>
          {/* Components */}
          <div style={{ background: "#211f1c", borderRadius: 8, padding: "10px 10px 8px" }}>
            <div style={{ fontSize: 9, color: "#57534e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Components</div>
            <div style={{ fontSize: 11, color: "#d6d3d1", fontWeight: 600 }}>14</div>
            <div style={{ fontSize: 9, color: "#78716c", marginTop: 2 }}>Button, Card, Nav +11</div>
            <div style={{ fontSize: 9, color: "#44403c", marginTop: 2 }}>detected</div>
          </div>
        </div>

        {/* Output handle */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, color: "#44403c" }}>connect to frame →</span>
          <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid #f59e0b", background: "#1a1714" }}></div>
        </div>
      </div>
    </div>
  );

  if (tab === "wired") return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {/* Widget compact */}
      <div style={{ ...base, width: 200, border: "1px solid #78716c" }}>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid #292524", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: 2, background: "#f59e0b" }}></div>
          <span style={{ fontSize: 11, color: "#d6d3d1", fontWeight: 500 }}>Design System Ref</span>
        </div>
        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ flex: 1, background: "#211f1c", borderRadius: 5, padding: "5px 7px", fontSize: 9, color: "#44403c", display: "flex", gap: 3, alignItems: "center" }}>
              <span>🖼</span><span style={{ fontFamily: "'DM Mono', monospace" }}>—</span>
            </div>
            <div style={{ flex: 1, background: "#211f1c", borderRadius: 5, padding: "5px 7px", fontSize: 9, color: "#44403c", display: "flex", gap: 3, alignItems: "center" }}>
              <span>🔗</span><span style={{ fontFamily: "'DM Mono', monospace" }}>—</span>
            </div>
            <div style={{ flex: 1, background: "#292524", borderRadius: 5, padding: "5px 7px", fontSize: 9, color: "#f59e0b", display: "flex", gap: 3, alignItems: "center" }}>
              <span>✦</span><span style={{ fontFamily: "'DM Mono', monospace" }}>✓</span>
            </div>
          </div>
          <div style={{ fontSize: 10, color: "#78716c" }}>Rebtel 3.0 — Home</div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 6px rgba(245,158,11,0.4)" }}></div>
          </div>
        </div>
      </div>

      {/* Bezier */}
      <svg width="64" height="40" style={{ overflow: "visible" }}>
        <defs>
          <marker id="arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#f59e0b" opacity="0.7" />
          </marker>
        </defs>
        <path d="M 0 20 C 28 20 36 20 64 20" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.7" markerEnd="url(#arr2)" />
      </svg>

      {/* Frame */}
      <div style={{ width: 150, border: "1px solid #3f3f46", borderRadius: 10, background: "#111113", overflow: "hidden" }}>
        <div style={{ padding: "7px 10px", borderBottom: "1px solid #1c1c20", background: "#1a1a1c", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "#71717a" }}>● ●</span>
          <span style={{ fontSize: 9, color: "#3f3f46" }}>Frame 2</span>
        </div>
        <div style={{ padding: "14px 10px 10px" }}>
          <div style={{ width: "80%", height: 5, background: "#1c1c20", borderRadius: 2, marginBottom: 5 }}></div>
          <div style={{ width: "55%", height: 4, background: "#1c1c20", borderRadius: 2, marginBottom: 10 }}></div>
          <div style={{ display: "flex", gap: 4 }}>
            {[1,2,3].map(i => <div key={i} style={{ flex: 1, height: 22, background: "#1c1c20", borderRadius: 4 }}></div>)}
          </div>
        </div>
      </div>
    </div>
  );

  if (tab === "generating") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 380 }}>
      {/* Merge diagram */}
      <div style={{ background: "#0f0e0c", border: "1px solid #27272a", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 10, color: "#57534e", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>Source merge · precedence order</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { icon: "✦", label: "Figma", desc: "Colors · Type · Spacing · Components", rank: "1st — tokens", active: true },
            { icon: "🔗", label: "Website", desc: "Layout patterns · Component structure", rank: "2nd — layout", active: false },
            { icon: "🖼", label: "Image", desc: "Mood · Atmosphere · Art direction", rank: "3rd — mood", active: false },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: s.active ? "#1c1a17" : "#111113", borderRadius: 8, border: `1px solid ${s.active ? "#44403c" : "#1c1c20"}` }}>
              <span style={{ fontSize: 12 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: s.active ? "#d6d3d1" : "#52525b", fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: s.active ? "#78716c" : "#3f3f46" }}>{s.desc}</div>
              </div>
              <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: s.active ? "#f59e0b" : "#3f3f46", background: s.active ? "#211f1c" : "transparent", padding: "2px 6px", borderRadius: 4 }}>{s.rank}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Brief output */}
      <div style={{ background: "#0f0e0c", border: "1px solid #27272a", borderRadius: 12, padding: 16, fontFamily: "'DM Mono', monospace", fontSize: 11, lineHeight: 1.8 }}>
        <div style={{ color: "#57534e", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Layer 2 design brief</div>
        <div style={{ color: "#78716c" }}>// figma tokens (authoritative)</div>
        <div style={{ color: "#a8a29e" }}>--color-primary: <span style={{ color: "#f59e0b" }}>#0052CC</span>;</div>
        <div style={{ color: "#a8a29e" }}>--font-display: <span style={{ color: "#f59e0b" }}>"Aktiv Grotesk"</span>;</div>
        <div style={{ color: "#a8a29e" }}>--space-unit: <span style={{ color: "#86efac" }}>4px</span>;</div>
        <div style={{ color: "#78716c", marginTop: 4 }}>// image mood (supplemental)</div>
        <div style={{ color: "#a8a29e" }}>tone: <span style={{ color: "#f59e0b" }}>"warm, trustworthy, global"</span>;</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#78716c" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", animation: "pulse 1.5s ease-in-out infinite" }}></div>
        Design brief merged · Layer 2 generating...
      </div>
    </div>
  );

  return null;
};

export default function FigmaWidgetSpec() {
  const [activeStep, setActiveStep] = useState(0);
  const step = steps[activeStep];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#0c0c0e", minHeight: "100vh", color: "#e4e4e7" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #18181b; } ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .step-btn { transition: all 0.2s; }
        .step-btn:hover { background: #1a1714 !important; }
        .step-btn.active { background: #1c1a17 !important; border-color: #57534e !important; }
        .nav-btn { transition: all 0.15s; cursor: pointer; }
        .nav-btn:hover { opacity: 0.8; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #18181b", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, background: "#1c1a17", borderRadius: 8, border: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⬡</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5", letterSpacing: "-0.01em" }}>Aphantasia</div>
            <div style={{ fontSize: 11, color: "#52525b" }}>Design System Reference Widget — UX Spec</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 4 }}>
            <span style={{ fontSize: 12 }}>🖼</span>
            <span style={{ fontSize: 12 }}>🔗</span>
            <span style={{ fontSize: 12 }}>✦</span>
          </div>
          <div style={{ fontSize: 11, color: "#57534e", fontFamily: "'DM Mono', monospace" }}>image · website · figma</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 65px)" }}>
        {/* Sidebar */}
        <div style={{ borderRight: "1px solid #18181b", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 10, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, paddingLeft: 8 }}>User Flow</div>
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(i)}
              className={`step-btn ${activeStep === i ? "active" : ""}`}
              style={{
                background: activeStep === i ? "#1c1a17" : "transparent",
                border: `1px solid ${activeStep === i ? "#57534e" : "transparent"}`,
                borderRadius: 8, padding: "10px 12px", textAlign: "left",
                cursor: "pointer", color: activeStep === i ? "#e4e4e7" : "#71717a",
              }}
            >
              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: activeStep === i ? "#78716c" : "#44403c", marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 12, fontWeight: activeStep === i ? 500 : 400, lineHeight: 1.3 }}>{s.title.replace(/^User /, "")}</div>
            </button>
          ))}

          <div style={{ marginTop: "auto", padding: "14px 12px", background: "#1a1714", border: "1px solid #292524", borderRadius: 10 }}>
            <div style={{ fontSize: 10, color: "#78716c", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Key idea</div>
            <p style={{ fontSize: 11, color: "#a8a29e", lineHeight: 1.6 }}>One widget, three source types. Figma gives precision tokens. Website gives layout hints. Image gives mood. All three merge into one design brief at generation time.</p>
          </div>
        </div>

        {/* Main panel */}
        <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#57534e", marginBottom: 8 }}>{step.label}</div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#f4f4f5", letterSpacing: "-0.02em", marginBottom: 12 }}>{step.title}</h2>
            <p style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.75, maxWidth: 520 }}>{step.description}</p>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#18181b", border: "1px solid #1c1a17", borderLeft: "2px solid #57534e", borderRadius: "0 8px 8px 0", fontSize: 12, color: "#71717a", lineHeight: 1.6, maxWidth: 520 }}>
              ↳ {step.detail}
            </div>
          </div>

          {/* Widget preview */}
          <div>
            <div style={{ fontSize: 10, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Widget state</div>
            <div style={{
              background: "#0e0d0b", border: "1px solid #1c1a17", borderRadius: 16,
              padding: "40px 48px", display: "inline-flex", alignItems: "center",
              justifyContent: "center", minWidth: 420, position: "relative"
            }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: 16, opacity: 0.15,
                backgroundImage: "radial-gradient(circle, #78716c 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}></div>
              <div style={{ position: "relative" }}>
                <Widget tab={step.widgetTab} />
              </div>
            </div>
          </div>

          {/* Precedence callout on last step */}
          {activeStep === 6 && (
            <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 10, padding: "14px 16px", maxWidth: 520, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: "#1c1a17", border: "1px solid #44403c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <span style={{ fontSize: 10, color: "#f59e0b" }}>↑</span>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#d6d3d1", fontWeight: 500, marginBottom: 4 }}>Merge is opinionated</div>
                <div style={{ fontSize: 11, color: "#78716c", lineHeight: 1.6 }}>Figma tokens always win on color, type, and spacing because they're explicit and structured. Website and Image fill in the gaps — layout intuition and tonal direction — that Figma doesn't capture well.</div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto", paddingTop: 16, borderTop: "1px solid #18181b" }}>
            {activeStep > 0 && (
              <button onClick={() => setActiveStep(activeStep - 1)} className="nav-btn"
                style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, padding: "8px 16px", fontSize: 12, color: "#71717a", cursor: "pointer" }}>
                ← Back
              </button>
            )}
            {activeStep < steps.length - 1 && (
              <button onClick={() => setActiveStep(activeStep + 1)} className="nav-btn"
                style={{ background: "#f59e0b", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 12, fontWeight: 600, color: "#1c1a17", cursor: "pointer" }}>
                Next step →
              </button>
            )}
            {activeStep === steps.length - 1 && (
              <div style={{ fontSize: 12, color: "#57534e" }}>End of flow — all three sources merged into generation brief ✓</div>
            )}
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              {steps.map((_, i) => (
                <div key={i} onClick={() => setActiveStep(i)} className="nav-btn"
                  style={{ width: i === activeStep ? 20 : 6, height: 6, borderRadius: 3, background: i === activeStep ? "#f59e0b" : "#27272a", transition: "all 0.2s" }}>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
