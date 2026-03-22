import { NextRequest, NextResponse } from "next/server";
import { extractDesignSystemFromImage } from "./extractFromImage";

// POST /api/ui-extract
// Body: { imageData: string } — base64 dataUrl of reference screenshot
// Returns: { designSystem: UIDesignSystem }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData } = body as { imageData: string };

    if (!imageData) {
      return NextResponse.json({ error: "imageData is required" }, { status: 400 });
    }

    const base64 = imageData.replace(/^data:image\/\w+;base64,/, "");
    const mediaType = imageData.startsWith("data:image/png")
      ? ("image/png" as const)
      : ("image/jpeg" as const);

    const designSystem = await extractDesignSystemFromImage(base64, mediaType);

    return NextResponse.json({ designSystem });
  } catch (error) {
    console.error("[ui-extract] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Extraction failed" },
      { status: 500 }
    );
  }
}
