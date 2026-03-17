"use client";

import { useEffect, useRef, useState } from "react";

export default function PreviewPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const html = sessionStorage.getItem("aphantasia-preview");
    if (html && iframeRef.current) {
      iframeRef.current.srcdoc = html;
      setLoaded(true);
    }
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 9999 }}>
      {!loaded && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: "system-ui", color: "#888" }}>
          No preview available. Go back and hit Render first.
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="Site Preview"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: loaded ? "block" : "none",
        }}
      />
    </div>
  );
}
