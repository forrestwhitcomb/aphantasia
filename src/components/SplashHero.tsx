"use client";

/**
 * Splash hero:
 *  - Subheader: "From small shapes come big ideas" Poppins 500, 20px, #000
 *  - H1: "Build something with Aphantasia" Poppins 700, 56px, #000
 *  - CTA: pill button (r=125), black fill, "Get started" Poppins 600, 20px, white
 *         height ~78px (50% taller than 54px toolbar)
 */
export function SplashHero() {
  return (
    <section
      style={{
        height: "calc(100vh - 113px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        fontFamily: "var(--font-poppins), sans-serif",
        paddingBottom: "calc(25vh + 100px)",
      }}
    >
      {/* Beta badge */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 14px",
          borderRadius: 999,
          background: "rgba(0,0,0,0.06)",
          fontSize: 13,
          fontWeight: 600,
          color: "#000000",
          letterSpacing: "0.02em",
          marginBottom: 18,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#F97316",
            flexShrink: 0,
          }}
        />
        Beta
      </span>

      {/* Subheader — above headline */}
      <p
        style={{
          fontSize: 20,
          fontWeight: 500,
          color: "#000000",
          letterSpacing: "0.02em",
          lineHeight: "125%",
          marginBottom: 14,
        }}
      >
        From small shapes come big ideas
      </p>

      {/* Headline */}
      <h1
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#000000",
          letterSpacing: "0.02em",
          lineHeight: "120%",
          textAlign: "center",
          maxWidth: 720,
        }}
      >
        Build something with Aphantasia
      </h1>

      {/* CTA Button — pill shape, ~50% taller than toolbar (54px toolbar → 78px button) */}
      <button
        style={{
          marginTop: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 28px",
          height: 40,
          background: "#000000",
          color: "#FFFFFF",
          borderRadius: 125,
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-poppins), sans-serif",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
        onClick={() => {
          window.scrollTo({ top: document.documentElement.scrollHeight - window.innerHeight, behavior: "smooth" });
        }}
      >
        Get started
        {/* Down arrow icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </button>
    </section>
  );
}
