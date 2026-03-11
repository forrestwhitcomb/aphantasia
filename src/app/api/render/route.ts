import { NextRequest, NextResponse } from "next/server";

// POST /api/render — Phase 2 AI render pipeline
// Body: { canvasDocument, globalContext }
export async function POST(req: NextRequest) {
  // TODO: implement in Phase 3
  return NextResponse.json({ html: "", css: "" });
}
