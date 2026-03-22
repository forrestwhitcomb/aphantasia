import { NextRequest, NextResponse } from "next/server";
import {
  parseFigmaFileKey,
  mapFigmaToDesignSystem,
  type FigmaStylesResponse,
  type FigmaVariablesResponse,
  type FigmaFileResponse,
} from "./figmaMapper";

// POST /api/ui-extract-figma
// Body: { figmaUrl: string, accessToken: string }
// Returns: { designSystem: UIDesignSystem, fileName?: string }
//
// Uses the Figma REST API with the user's personal access token
// to extract design tokens and map them to UIDesignSystem.

const FIGMA_API = "https://api.figma.com/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { figmaUrl, accessToken } = body as {
      figmaUrl: string;
      accessToken: string;
    };

    if (!figmaUrl || !accessToken) {
      return NextResponse.json(
        { error: "figmaUrl and accessToken are required" },
        { status: 400 }
      );
    }

    const fileKey = parseFigmaFileKey(figmaUrl);
    if (!fileKey) {
      return NextResponse.json(
        { error: "Could not parse Figma file key from URL. Use a URL like: https://www.figma.com/design/ABC123/..." },
        { status: 400 }
      );
    }

    const headers = {
      "X-Figma-Token": accessToken,
    };

    // Fetch file metadata, styles, and variables in parallel
    const [fileRes, stylesRes, variablesRes] = await Promise.all([
      fetchFigma(`${FIGMA_API}/files/${fileKey}?depth=1`, headers),
      fetchFigma(`${FIGMA_API}/files/${fileKey}/styles`, headers),
      fetchFigma(`${FIGMA_API}/files/${fileKey}/variables/local`, headers).catch(
        () => null // Variables API returns 403 on non-Enterprise plans
      ),
    ]);

    if (!fileRes.ok) {
      const status = fileRes.status;
      if (status === 403) {
        return NextResponse.json(
          { error: "Access denied. Check that your personal access token is valid and has access to this file." },
          { status: 403 }
        );
      }
      if (status === 404) {
        return NextResponse.json(
          { error: "File not found. Check the Figma URL." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `Figma API error: ${status}` },
        { status: 502 }
      );
    }

    const fileData = (await fileRes.json()) as FigmaFileResponse;
    const stylesData = stylesRes.ok
      ? ((await stylesRes.json()) as FigmaStylesResponse)
      : null;
    const variablesData =
      variablesRes && variablesRes.ok
        ? ((await variablesRes.json()) as FigmaVariablesResponse)
        : null;

    const designSystem = mapFigmaToDesignSystem(
      stylesData,
      variablesData,
      fileData
    );

    return NextResponse.json({
      designSystem,
      fileName: fileData.name,
      hasVariables: !!variablesData,
    });
  } catch (error) {
    console.error("[ui-extract-figma] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Extraction failed" },
      { status: 500 }
    );
  }
}

async function fetchFigma(
  url: string,
  headers: Record<string, string>
): Promise<Response> {
  return fetch(url, {
    headers,
    signal: AbortSignal.timeout(15000),
  });
}
