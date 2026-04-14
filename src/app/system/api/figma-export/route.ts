// ============================================================
// Aphantasia/System — Figma Export API Route (code.to.design)
// ============================================================

export async function POST(req: Request) {
  try {
    const apiKey = process.env.CODE_TO_DESIGN_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "CODE_TO_DESIGN_API_KEY not configured. Add it to .env.local" }, { status: 401 });
    }

    const body = await req.json();
    const mode = body.mode as "single" | "multi";
    const headers = { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" };

    if (mode === "single") {
      const screen = body.screen as { html: string; width: number; height: number; topLayerName: string };
      const res = await fetch("https://api.to.design/html", {
        method: "POST",
        headers,
        body: JSON.stringify({ html: screen.html, clip: true, width: screen.width, height: screen.height, topLayerName: screen.topLayerName }),
      });

      if (res.status === 429) return Response.json({ error: "Rate limited. Wait a moment and try again." }, { status: 429 });
      if (res.status === 401 || res.status === 403) return Response.json({ error: "Invalid API key. Check your CODE_TO_DESIGN_API_KEY." }, { status: 401 });
      if (!res.ok) {
        const errText = await res.text();
        return Response.json({ error: `code.to.design error (${res.status}): ${errText.substring(0, 200)}` }, { status: 500 });
      }

      const clipboardData = await res.text();
      return new Response(clipboardData, { headers: { "Content-Type": "text/plain" } });
    }

    if (mode === "multi") {
      const screens = body.screens as Array<{ html: string; width: number; height: number; topLayerName: string }>;
      const res = await fetch("https://api.to.design/html-multi", {
        method: "POST",
        headers,
        body: JSON.stringify({ screens, clip: true }),
      });

      if (res.status === 429) return Response.json({ error: "Rate limited. Wait a moment and try again." }, { status: 429 });
      if (res.status === 401 || res.status === 403) return Response.json({ error: "Invalid API key. Check your CODE_TO_DESIGN_API_KEY." }, { status: 401 });
      if (!res.ok) {
        const errText = await res.text();
        return Response.json({ error: `code.to.design error (${res.status}): ${errText.substring(0, 200)}` }, { status: 500 });
      }

      const clipboardData = await res.text();
      return new Response(clipboardData, { headers: { "Content-Type": "text/plain" } });
    }

    return Response.json({ error: 'Invalid mode. Use "single" or "multi".' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "balance") {
      const apiKey = process.env.CODE_TO_DESIGN_API_KEY;
      if (!apiKey) return Response.json({ error: "No API key" }, { status: 401 });

      const res = await fetch("https://api.to.design/balance", {
        headers: { "Authorization": `Bearer ${apiKey}` },
      });
      if (!res.ok) return Response.json({ error: "Failed to check balance" }, { status: 500 });
      const data = await res.json();
      return Response.json(data);
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
