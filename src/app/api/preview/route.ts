import { NextRequest, NextResponse } from "next/server";

// Server-side preview HTML cache — replaces sessionStorage to avoid 5MB limit.
// POST: store HTML, return token. GET: retrieve HTML by token.
// TTL: 30 minutes, cleaned up on access.

const cache = new Map<string, { html: string; createdAt: number }>();
const TTL_MS = 30 * 60 * 1000; // 30 minutes

function cleanup() {
  const now = Date.now();
  for (const [token, entry] of cache) {
    if (now - entry.createdAt > TTL_MS) cache.delete(token);
  }
}

export async function POST(req: NextRequest) {
  cleanup();

  const { html } = (await req.json()) as { html?: string };
  if (!html || typeof html !== "string") {
    return NextResponse.json({ error: "Missing html" }, { status: 400 });
  }

  const token = crypto.randomUUID();
  cache.set(token, { html, createdAt: Date.now() });

  return NextResponse.json({ token });
}

export async function GET(req: NextRequest) {
  cleanup();

  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const entry = cache.get(token);
  if (!entry) {
    return new Response(
      `<!DOCTYPE html><html><head><style>body{display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;background:#0a0a0f;color:#888;}</style></head><body><div style="text-align:center"><h2>Preview expired</h2><p>This preview link has expired. Go back to the editor and click Preview again.</p></div></body></html>`,
      { status: 404, headers: { "Content-Type": "text/html" } }
    );
  }

  return new Response(entry.html, {
    headers: { "Content-Type": "text/html" },
  });
}
