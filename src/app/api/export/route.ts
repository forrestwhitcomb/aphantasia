import { NextRequest, NextResponse } from "next/server";

// POST /api/export — Export adapter endpoint
// Body: { adapterType, renderOutput, options }
export async function POST(req: NextRequest) {
  // TODO: implement in Phase 4
  return NextResponse.json({ success: false });
}
