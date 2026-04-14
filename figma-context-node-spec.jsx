import { useState } from "react";

const steps = [
  {
    id: "add",
    label: "01 — Add Node",
    title: "User adds a Figma context node",
    description: "Right-click anywhere on the canvas (or hit F) to open the node picker. Figma node is available alongside Text and Image nodes. It drops onto the canvas as an unconnected node.",
    detail: "No auth required yet — the node appears immediately. Auth is deferred to the moment they try to link a frame.",
    nodeState: "empty",
  },
  {
    id: "connect",
    label: "02 — Connect Account",
    title: "First-time: connect Figma",
    description: "If no PAT is stored, the node shows a one-time prompt. User opens Figma → Settings → Personal Access Tokens → generates a token with file_read scope, pastes it in.",
    detail: "Token is stored in user settings, not per-node. Subsequent Figma nodes skip this step entirely.",
    nodeState: "auth",
  },
  {
    id: "paste",
    label: "03 — Paste Frame URL",
    title: "User pastes a Figma share link",
    description: "User right-clicks any frame in Figma → Copy link → pastes it into the node's input. Aphantasia parses the file key and node-id from the URL automatically.",
    detail: "URL format: figma.com/design/{fileKey}/Title?node-id={nodeId}. Both are extracted silently — the user never sees raw IDs.",
    nodeState: "resolving",
  },
  {
    id: "resolved",
    label: "04 — Frame Resolved",
    title: "Node resolves with frame preview",
    description: "Aphantasia hits the Figma REST API and pulls back the frame thumbnail, name, and a structured extraction of styles and tokens. The node collapses to a compact card with a live preview.",
    detail: "Extracted: color styles, text styles, spacing variables, border radii, shadows, and a component inventory. User can expand to inspect.",
    nodeState: "resolved",
  },
  {
    id: "connect-wire",
    label: "05 — Wire to Frame",
    title: "User connects node to a canvas frame",
    description: "User draws a bezier connection from the Figma node's output handle to any canvas frame. This tells the generation pipeline: 'use this design system when generating this frame.'",
    detail: "Multiple frames can connect to the same Figma node. One Figma node = one design system. You could have multiple Figma nodes for multi-brand canvases.",
    nodeState: "wired",
  },
  {
    id: "generate",
    label: "06 — Generation",
    title: "Design tokens flow into the AI pipeline",
    description: "When the user hits Generate, the Figma node's extracted tokens are injected as a design system brief into the Layer 2 AI prompt. The output CSS uses the exact colors, fonts, and spacing from the linked Figma file.",
    detail: "The brief is structured: colors → CSS custom properties, typography → font stacks + scale, spacing → a spacing system, components → component hints.",
    nodeState: "generating",
  },
];

const NodePreview = ({ state }) => {
  const base = "rounded-xl border font-mono text-xs transition-all duration-500";

  if (state === "empty") return (
    <div className={`${base} border-dashed border-zinc-600 bg-zinc-900 p-5 w-64 text-zinc-500 flex flex-col gap-3`}>
      <div className="flex items-center gap-2">
        <FigmaIcon />
        <span className="text-zinc-400 font-sans text-sm font-medium">Figma</span>
        <span className="ml-auto text-zinc-600 text-[10px]">not connected</span>
      </div>
      <div className="bg-zinc-800 rounded-lg p-3 text-zinc-600 text-center text-[11px] leading-relaxed">
        Connect a Figma account<br/>to link a frame
      </div>
    </div>
  );

  if (state === "auth") return (
    <div className={`${base} border-amber-800/50 bg-zinc-900 p-5 w-64 flex flex-col gap-3`}>
      <div className="flex items-center gap-2">
        <FigmaIcon />
        <span className="text-zinc-300 font-sans text-sm font-medium">Figma</span>
        <span className="ml-auto w-2 h-2 rounded-full bg-amber-500"></span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-zinc-500 text-[10px] uppercase tracking-widest">Personal Access Token</div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-400 text-[11px] flex items-center gap-2">
          <span>figd_••••••••••••••••••</span>
        </div>
        <div className="bg-amber-500 rounded-lg px-3 py-2 text-zinc-900 text-[11px] font-bold text-center cursor-pointer">
          Connect Figma →
        </div>
      </div>
    </div>
  );

  if (state === "resolving") return (
    <div className={`${base} border-zinc-700 bg-zinc-900 p-5 w-64 flex flex-col gap-3`}>
      <div className="flex items-center gap-2">
        <FigmaIcon />
        <span className="text-zinc-300 font-sans text-sm font-medium">Figma</span>
        <span className="ml-auto text-emerald-500 text-[10px]">connected</span>
      </div>
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-400 text-[11px] truncate">
        figma.com/design/Kx7mN2.../DS?node-id=...
      </div>
      <div className="flex items-center gap-2 text-zinc-500 text-[10px]">
        <span className="animate-spin inline-block w-3 h-3 border border-zinc-600 border-t-zinc-300 rounded-full"></span>
        Resolving frame...
      </div>
    </div>
  );

  if (state === "resolved") return (
    <div className={`${base} border-zinc-600 bg-zinc-900 p-4 w-72 flex flex-col gap-3`}>
      <div className="flex items-center gap-2">
        <FigmaIcon />
        <span className="text-zinc-200 font-sans text-sm font-semibold">Rebtel 3.0 — Home</span>
        <span className="ml-auto text-emerald-400 text-[10px]">✓ linked</span>
      </div>
      <div className="bg-zinc-800 rounded-lg h-20 flex items-center justify-center text-zinc-600 text-[10px] overflow-hidden relative">
        <div className="absolute inset-0 opacity-20" style={{background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"}}></div>
        <div className="relative flex gap-1 items-end">
          <div className="w-8 h-12 bg-blue-500/60 rounded-sm"></div>
          <div className="w-16 h-8 bg-zinc-600/80 rounded-sm"></div>
          <div className="w-8 h-10 bg-blue-400/40 rounded-sm"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="bg-zinc-800 rounded-lg p-2 flex flex-col gap-1">
          <div className="text-zinc-500 uppercase tracking-wider text-[9px]">Colors</div>
          <div className="flex gap-1">
            {["#0052CC","#FF5722","#1A1A2E","#F5F5F5","#00BCD4"].map(c => (
              <div key={c} className="w-4 h-4 rounded-full border border-zinc-700" style={{background: c}}></div>
            ))}
          </div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-2 flex flex-col gap-1">
          <div className="text-zinc-500 uppercase tracking-wider text-[9px]">Type</div>
          <div className="text-zinc-400 text-[10px] leading-tight">Aktiv Grotesk<br/>GT America</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-2 flex flex-col gap-1">
          <div className="text-zinc-500 uppercase tracking-wider text-[9px]">Spacing</div>
          <div className="text-zinc-400 text-[10px]">4px base · 8 steps</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-2 flex flex-col gap-1">
          <div className="text-zinc-500 uppercase tracking-wider text-[9px]">Components</div>
          <div className="text-zinc-400 text-[10px]">14 detected</div>
        </div>
      </div>
    </div>
  );

  if (state === "wired") return (
    <div className="flex items-center gap-4">
      <div className={`${base} border-emerald-700/60 bg-zinc-900 p-4 w-56 flex flex-col gap-2`}>
        <div className="flex items-center gap-2">
          <FigmaIcon />
          <span className="text-zinc-200 font-sans text-sm font-semibold">Rebtel 3.0 — Home</span>
        </div>
        <div className="text-[10px] text-zinc-500">Design system · 5 colors · 2 fonts</div>
        <div className="w-full h-px bg-zinc-700"></div>
        <div className="flex items-center justify-end">
          <div className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-zinc-900"></div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-16 h-px bg-gradient-to-r from-emerald-600 to-blue-600"></div>
        <div className="text-[9px] text-zinc-600">bezier</div>
      </div>
      <div className="border border-blue-700/50 bg-zinc-900 rounded-xl p-4 w-40 flex flex-col gap-2">
        <div className="text-zinc-400 font-sans text-xs font-medium">Frame 3</div>
        <div className="bg-zinc-800 rounded h-16 flex items-center justify-center">
          <div className="text-zinc-600 text-[9px]">sketch area</div>
        </div>
      </div>
    </div>
  );

  if (state === "generating") return (
    <div className="flex flex-col gap-3 w-80">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-[10px] font-mono">
        <div className="text-zinc-500 mb-2 text-[9px] uppercase tracking-widest">Design Brief injected to Layer 2</div>
        <div className="text-emerald-400">:root {"{"}</div>
        <div className="text-blue-400 pl-4">--color-primary: #0052CC;</div>
        <div className="text-blue-400 pl-4">--color-accent: #FF5722;</div>
        <div className="text-blue-400 pl-4">--font-display: 'Aktiv Grotesk';</div>
        <div className="text-blue-400 pl-4">--font-body: 'GT America';</div>
        <div className="text-blue-400 pl-4">--space-unit: 4px;</div>
        <div className="text-blue-400 pl-4">--radius-md: 8px;</div>
        <div className="text-emerald-400">{"}"}</div>
        <div className="mt-2 text-zinc-500">/* 14 component hints loaded */</div>
      </div>
      <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Layer 2 generating with design constraints...
      </div>
    </div>
  );

  return null;
};

const FigmaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 38 57" fill="none">
    <path d="M19 28.5C19 24.9 21.9 22 25.5 22H32V35H25.5C21.9 35 19 32.1 19 28.5Z" fill="#1ABCFE"/>
    <path d="M6 41.5C6 37.9 8.9 35 12.5 35H19V41.5C19 45.1 16.1 48 12.5 48C8.9 48 6 45.1 6 41.5Z" fill="#0ACF83"/>
    <path d="M19 9V22H25.5C29.1 22 32 19.1 32 15.5C32 11.9 29.1 9 25.5 9H19Z" fill="#FF7262"/>
    <path d="M6 15.5C6 19.1 8.9 22 12.5 22H19V9H12.5C8.9 9 6 11.9 6 15.5Z" fill="#F24E1E"/>
    <path d="M6 28.5C6 32.1 8.9 35 12.5 35H19V22H12.5C8.9 22 6 24.9 6 28.5Z" fill="#FF7262"/>
  </svg>
);

const APIPayload = () => (
  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 font-mono text-[11px] leading-relaxed overflow-auto max-h-80">
    <div className="text-zinc-500 mb-3 text-[10px] uppercase tracking-widest font-sans">Figma REST API → Aphantasia extraction</div>
    <div className="text-zinc-400"><span className="text-purple-400">GET</span> /v1/files/<span className="text-amber-300">{"{"}</span>fileKey<span className="text-amber-300">{"}"}</span>/nodes?ids=<span className="text-amber-300">{"{"}</span>nodeId<span className="text-amber-300">{"}"}</span></div>
    <div className="text-zinc-400 mt-1"><span className="text-purple-400">GET</span> /v1/files/<span className="text-amber-300">{"{"}</span>fileKey<span className="text-amber-300">{"}"}</span>/styles</div>
    <div className="text-zinc-400 mt-1"><span className="text-purple-400">GET</span> /v1/files/<span className="text-amber-300">{"{"}</span>fileKey<span className="text-amber-300">{"}"}</span>/variables/local</div>
    <div className="mt-4 text-zinc-500 text-[10px] uppercase tracking-widest font-sans">Extraction output shape</div>
    <div className="mt-2 text-emerald-400">{"{"}</div>
    <div className="pl-4 text-zinc-300">  <span className="text-blue-300">"frameId"</span>: <span className="text-amber-300">"143:22"</span>,</div>
    <div className="pl-4 text-zinc-300">  <span className="text-blue-300">"frameName"</span>: <span className="text-amber-300">"Home – Desktop"</span>,</div>
    <div className="pl-4 text-zinc-300">  <span className="text-blue-300">"colors"</span>: [</div>
    <div className="pl-8 text-zinc-400">{"{"} <span className="text-blue-300">"name"</span>: <span className="text-amber-300">"Brand/Primary"</span>, <span className="text-blue-300">"hex"</span>: <span className="text-amber-300">"#0052CC"</span> {"}"}</div>
    <div className="pl-4 text-zinc-300">  ],</div>
    <div className="pl-4 text-zinc-300">  <span className="text-blue-300">"typography"</span>: [</div>
    <div className="pl-8 text-zinc-400">{"{"} <span className="text-blue-300">"name"</span>: <span className="text-amber-300">"Display/H1"</span>, <span className="text-blue-300">"family"</span>: <span className="text-amber-300">"Aktiv Grotesk"</span>, <span className="text-blue-300">"size"</span>: <span className="text-emerald-300">56</span>, <span className="text-blue-300">"weight"</span>: <span className="text-emerald-300">700</span> {"}"}</div>
    <div className="pl-4 text-zinc-300">  ],</div>
    <div className="pl-4 text-zinc-300">  <span className="text-blue-300">"spacing"</span>: {"{"} <span className="text-blue-300">"base"</span>: <span className="text-emerald-300">4</span>, <span className="text-blue-300">"scale"</span>: [<span className="text-emerald-300">4,8,12,16,24,32,48,64</span>] {"}"},</div>
    <div className="pl-4 text-zinc-300">  <span className="text-blue-300">"radii"</span>: {"{"} <span className="text-blue-300">"sm"</span>: <span className="text-emerald-300">4</span>, <span className="text-blue-300">"md"</span>: <span className="text-emerald-300">8</span>, <span className="text-blue-300">"lg"</span>: <span className="text-emerald-300">16</span> {"}"},</div>
    <div className="pl-4 text-zinc-300">  <span className="text-blue-300">"components"</span>: [<span className="text-amber-300">"Button/Primary"</span>, <span className="text-amber-300">"Card/Default"</span>, <span className="text-amber-300">"Nav/Desktop"</span>]</div>
    <div className="text-emerald-400">{"}"}</div>
  </div>
);

export default function FigmaNodeSpec() {
  const [activeStep, setActiveStep] = useState(0);
  const [showPayload, setShowPayload] = useState(false);
  const step = steps[activeStep];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#0c0c0e", minHeight: "100vh", color: "#e4e4e7" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #18181b; } ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
        .step-btn { transition: all 0.2s; }
        .step-btn:hover { background: #27272a !important; }
        .step-btn.active { background: #1c1c20 !important; border-color: #52525b !important; }
        .next-btn { transition: all 0.15s; }
        .next-btn:hover { opacity: 0.85; transform: translateX(2px); }
        .payload-btn { transition: all 0.15s; }
        .payload-btn:hover { background: #27272a !important; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #18181b", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, background: "#1c1c20", borderRadius: 8, border: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⬡</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5", letterSpacing: "-0.01em" }}>Aphantasia</div>
            <div style={{ fontSize: 11, color: "#52525b" }}>Figma Context Node — UX Spec</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#3f3f46", fontFamily: "'DM Mono', monospace" }}>v1 · PAT auth · REST API</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 65px)" }}>
        {/* Steps sidebar */}
        <div style={{ borderRight: "1px solid #18181b", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 10, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, paddingLeft: 8 }}>User Flow</div>
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActiveStep(i); setShowPayload(false); }}
              className={`step-btn ${activeStep === i ? "active" : ""}`}
              style={{
                background: activeStep === i ? "#1c1c20" : "transparent",
                border: `1px solid ${activeStep === i ? "#3f3f46" : "transparent"}`,
                borderRadius: 8,
                padding: "10px 12px",
                textAlign: "left",
                cursor: "pointer",
                color: activeStep === i ? "#e4e4e7" : "#71717a",
              }}
            >
              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: activeStep === i ? "#52525b" : "#3f3f46", marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 12, fontWeight: activeStep === i ? 500 : 400, lineHeight: 1.3 }}>{s.title.replace(/^(User|First-time): /, "")}</div>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#52525b", marginBottom: 8 }}>{step.label}</div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#f4f4f5", letterSpacing: "-0.02em", marginBottom: 12 }}>{step.title}</h2>
            <p style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.7, maxWidth: 520 }}>{step.description}</p>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12, color: "#71717a", lineHeight: 1.6, maxWidth: 520 }}>
              ↳ {step.detail}
            </div>
          </div>

          {/* Node preview */}
          <div>
            <div style={{ fontSize: 10, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Node state</div>
            <div style={{ background: "#111113", border: "1px solid #18181b", borderRadius: 16, padding: "40px 48px", display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 400, position: "relative" }}>
              {/* Canvas grid dots */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 16, opacity: 0.3,
                backgroundImage: "radial-gradient(circle, #3f3f46 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}></div>
              <div style={{ position: "relative" }}>
                <NodePreview state={step.nodeState} />
              </div>
            </div>
          </div>

          {/* API Payload toggle (show on step 3+) */}
          {activeStep >= 3 && (
            <div>
              <button
                onClick={() => setShowPayload(!showPayload)}
                className="payload-btn"
                style={{
                  background: "#18181b", border: "1px solid #27272a", borderRadius: 8,
                  padding: "8px 14px", fontSize: 12, color: "#a1a1aa", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8
                }}
              >
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#52525b" }}>{"{ }"}</span>
                {showPayload ? "Hide" : "Show"} API extraction shape
              </button>
              {showPayload && <div style={{ marginTop: 12 }}><APIPayload /></div>}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto", paddingTop: 16, borderTop: "1px solid #18181b" }}>
            {activeStep > 0 && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, padding: "8px 16px", fontSize: 12, color: "#71717a", cursor: "pointer" }}
              >
                ← Back
              </button>
            )}
            {activeStep < steps.length - 1 && (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="next-btn"
                style={{ background: "#e4e4e7", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 12, fontWeight: 600, color: "#09090b", cursor: "pointer" }}
              >
                Next step →
              </button>
            )}
            {activeStep === steps.length - 1 && (
              <div style={{ fontSize: 12, color: "#52525b" }}>End of flow — Frame generates with Figma design system applied ✓</div>
            )}
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              {steps.map((_, i) => (
                <div key={i} onClick={() => setActiveStep(i)} style={{ width: i === activeStep ? 20 : 6, height: 6, borderRadius: 3, background: i === activeStep ? "#e4e4e7" : "#27272a", cursor: "pointer", transition: "all 0.2s" }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
