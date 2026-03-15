"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { exportStore } from "@/lib/exportStore";
import { scanCTAs, collectSectionAnchors, type CTAEntry } from "@/lib/ctaScanner";
import { contextStore } from "@/context/ContextStore";

// ---------------------------------------------------------------------------
// DeployModal — multi-step deploy flow
// ---------------------------------------------------------------------------
// Step 1: Connect GitHub (OAuth)
// Step 2: Project name
// Step 3: Button link review
// Step 4: Deploying (progress)
// Step 5: Success / Vercel card
// ---------------------------------------------------------------------------

type Step = 1 | 2 | 3 | 4 | 5;

interface AuthStatus {
  authenticated: boolean;
  username?: string;
}

interface DeployResult {
  success: boolean;
  repoUrl?: string;
  repoName?: string;
  vercelDeepLink?: string;
  isUpdate?: boolean;
  error?: string;
}

export function DeployModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [auth, setAuth] = useState<AuthStatus>({ authenticated: false });
  const [projectName, setProjectName] = useState("my-site");
  const [ctas, setCtas] = useState<CTAEntry[]>([]);
  const [ctaHrefs, setCtaHrefs] = useState<Record<string, string>>({});
  const [anchors, setAnchors] = useState<string[]>([]);
  const [deploying, setDeploying] = useState(false);
  const [result, setResult] = useState<DeployResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const checkedAuth = useRef(false);

  // Listen for open event
  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setStep(1);
      setResult(null);
      setError(null);
      checkedAuth.current = false;
    };
    window.addEventListener("aphantasia:open-deploy-modal", handler);
    return () =>
      window.removeEventListener("aphantasia:open-deploy-modal", handler);
  }, []);

  // Auto-open on ?deploy=1 (after OAuth redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("deploy") === "1") {
      setOpen(true);
      setStep(1);
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("deploy");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  // Check auth status when modal opens
  useEffect(() => {
    if (!open || checkedAuth.current) return;
    checkedAuth.current = true;

    fetch("/api/auth/github/status")
      .then((r) => r.json())
      .then((data: AuthStatus) => {
        setAuth(data);
        if (data.authenticated) {
          // Auto-advance to step 2
          setStep(2);
          // Derive default project name from context
          const ctx = contextStore.getContext();
          if (ctx?.productName) {
            setProjectName(
              ctx.productName
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "")
            );
          }
        }
      })
      .catch(() => setAuth({ authenticated: false }));
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deploying) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [open, deploying]);

  const handleConnectGitHub = useCallback(() => {
    window.location.href = "/api/auth/github";
  }, []);

  const handleNextToLinks = useCallback(() => {
    // Scan for CTAs
    const sections = exportStore.getSections();
    const foundCtas = scanCTAs(sections);
    const foundAnchors = collectSectionAnchors(sections);
    setCtas(foundCtas);
    setAnchors(foundAnchors);
    // Init href state
    const hrefs: Record<string, string> = {};
    foundCtas.forEach((c, i) => {
      hrefs[`${i}`] = c.currentHref || "";
    });
    setCtaHrefs(hrefs);
    setStep(3);
  }, []);

  const handleDeploy = useCallback(async () => {
    setStep(4);
    setDeploying(true);
    setError(null);

    try {
      // Get HTML and inject CTA hrefs if any were set
      let html = exportStore.getHTML();

      // Simple href injection: replace href="#" for CTAs that were given URLs
      // This works because our rendered HTML has predictable patterns
      for (const [key, href] of Object.entries(ctaHrefs)) {
        if (!href) continue;
        const cta = ctas[parseInt(key)];
        if (!cta) continue;
        // For internal anchors, prefix with #
        const finalHref = href.startsWith("#") ? href : href;
        // Replace the first occurrence of href="#" near this CTA's label
        // This is a simple approach — for v1 it works well enough
        const label = cta.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = new RegExp(
          `href="#"(\\s[^>]*?>\\s*${label})`,
          "i"
        );
        html = html.replace(pattern, `href="${finalHref}"$1`);
      }

      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, html }),
      });

      const data = (await res.json()) as DeployResult;
      if (data.success) {
        setResult(data);
        setStep(5);
      } else {
        setError(data.error || "Deploy failed");
        setStep(3); // Go back to allow retry
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deploy failed");
      setStep(3);
    } finally {
      setDeploying(false);
    }
  }, [projectName, ctaHrefs, ctas]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => !deploying && setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 300,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 301,
          width: 500,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          background: "rgba(26,26,26,0.96)",
          backdropFilter: "blur(16px)",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          fontFamily: "var(--font-poppins), system-ui, sans-serif",
          overflow: "hidden",
          color: "#fff",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600 }}>Deploy to GitHub</span>
          <button
            onClick={() => !deploying && setOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontSize: 18,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Step content */}
        <div style={{ padding: 24, flex: 1, overflowY: "auto" }}>
          {step === 1 && <StepAuth auth={auth} onConnect={handleConnectGitHub} onNext={() => setStep(2)} />}
          {step === 2 && (
            <StepProjectName
              projectName={projectName}
              onChange={setProjectName}
              onNext={handleNextToLinks}
            />
          )}
          {step === 3 && (
            <StepLinkReview
              ctas={ctas}
              ctaHrefs={ctaHrefs}
              anchors={anchors}
              onChange={(key, val) =>
                setCtaHrefs((prev) => ({ ...prev, [key]: val }))
              }
              onDeploy={handleDeploy}
              onSkip={handleDeploy}
              error={error}
            />
          )}
          {step === 4 && <StepDeploying />}
          {step === 5 && result && (
            <StepSuccess result={result} onDone={() => setOpen(false)} />
          )}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Step 1: GitHub Authentication
// ---------------------------------------------------------------------------

function StepAuth({
  auth,
  onConnect,
  onNext,
}: {
  auth: AuthStatus;
  onConnect: () => void;
  onNext: () => void;
}) {
  if (auth.authenticated) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ color: "#4ade80", fontSize: 20 }}>✓</span>
          <span style={{ fontSize: 14 }}>
            Connected as <strong>@{auth.username}</strong>
          </span>
        </div>
        <ModalButton onClick={onNext}>Continue</ModalButton>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16, lineHeight: 1.6 }}>
        Connect your GitHub account to push your site to a repository. Aphantasia will create a repo in your account.
      </p>
      <ModalButton onClick={onConnect}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        Connect GitHub
      </ModalButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Project Name
// ---------------------------------------------------------------------------

function StepProjectName({
  projectName,
  onChange,
  onNext,
}: {
  projectName: string;
  onChange: (name: string) => void;
  onNext: () => void;
}) {
  const slug = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || "site";

  return (
    <div>
      <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>
        Project name
      </label>
      <input
        type="text"
        value={projectName}
        onChange={(e) => onChange(e.target.value)}
        placeholder="my-landing-page"
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 8,
          color: "#fff",
          fontSize: 14,
          fontFamily: "inherit",
          outline: "none",
        }}
        onKeyDown={(e) => e.key === "Enter" && onNext()}
      />
      <p
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.35)",
          marginTop: 8,
          fontFamily: "monospace",
        }}
      >
        github.com/you/<strong>aphantasia-{slug}</strong>
      </p>
      <div style={{ marginTop: 20 }}>
        <ModalButton onClick={onNext}>Next</ModalButton>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Button Link Review
// ---------------------------------------------------------------------------

function StepLinkReview({
  ctas,
  ctaHrefs,
  anchors,
  onChange,
  onDeploy,
  onSkip,
  error,
}: {
  ctas: CTAEntry[];
  ctaHrefs: Record<string, string>;
  anchors: string[];
  onChange: (key: string, val: string) => void;
  onDeploy: () => void;
  onSkip: () => void;
  error: string | null;
}) {
  if (ctas.length === 0) {
    return (
      <div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
          No CTA buttons found in your site. Ready to deploy!
        </p>
        {error && (
          <p style={{ fontSize: 12, color: "#f87171", marginBottom: 12 }}>{error}</p>
        )}
        <ModalButton onClick={onDeploy}>Deploy</ModalButton>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16, lineHeight: 1.5 }}>
        Connect your buttons to destinations. Leave blank for placeholder links (#).
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 300, overflowY: "auto" }}>
        {ctas.map((cta, i) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                }}
              >
                {cta.sectionType}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>"{cta.label}"</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={ctaHrefs[`${i}`] || ""}
                onChange={(e) => onChange(`${i}`, e.target.value)}
                placeholder="https://... or select section"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  color: "#fff",
                  fontSize: 12,
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) onChange(`${i}`, `#${e.target.value}`);
                }}
                style={{
                  padding: "8px 10px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 12,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="">Section ↓</option>
                {anchors.map((a) => (
                  <option key={a} value={a}>
                    #{a}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p style={{ fontSize: 12, color: "#f87171", marginTop: 12 }}>{error}</p>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <ModalButton onClick={onSkip} variant="ghost">
          Skip
        </ModalButton>
        <ModalButton onClick={onDeploy}>Deploy</ModalButton>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Deploying
// ---------------------------------------------------------------------------

function StepDeploying() {
  return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div
        style={{
          width: 32,
          height: 32,
          border: "3px solid rgba(255,255,255,0.1)",
          borderTopColor: "#fff",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 16px",
        }}
      />
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
        Pushing to GitHub...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 5: Success
// ---------------------------------------------------------------------------

function StepSuccess({
  result,
  onDone,
}: {
  result: DeployResult;
  onDone: () => void;
}) {
  return (
    <div>
      {/* Success banner */}
      <div
        style={{
          background: "rgba(74,222,128,0.1)",
          border: "1px solid rgba(74,222,128,0.25)",
          borderRadius: 10,
          padding: "14px 18px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ color: "#4ade80", fontSize: 18 }}>✓</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600 }}>
            {result.isUpdate ? "Updated" : "Deployed"} to GitHub
          </p>
          <a
            href={result.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: "#60a5fa", textDecoration: "none" }}
          >
            {result.repoUrl} ↗
          </a>
        </div>
      </div>

      {/* Vercel card */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          padding: 18,
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          Deploy to Vercel
        </p>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
          <p><strong>Step 1</strong> → Click the button below</p>
          <p><strong>Step 2</strong> → Click "Deploy" — no settings to change</p>
          <p style={{ color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
            Live in ~30 seconds
          </p>
        </div>
        <a
          href={result.vercelDeepLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 14,
            padding: "10px 20px",
            background: "#fff",
            color: "#000",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            fontFamily: "inherit",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 76 65" fill="currentColor">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
          Deploy on Vercel
        </a>
      </div>

      <div style={{ marginTop: 20 }}>
        <ModalButton onClick={onDone} variant="ghost">
          Done
        </ModalButton>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared button component
// ---------------------------------------------------------------------------

function ModalButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "ghost";
}) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        background: isPrimary ? "#fff" : "transparent",
        color: isPrimary ? "#000" : "rgba(255,255,255,0.6)",
        border: isPrimary ? "none" : "1px solid rgba(255,255,255,0.15)",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}
