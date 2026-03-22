import { NextRequest, NextResponse } from "next/server";
import {
  parseFigmaFileKey,
  parseFigmaNodeId,
  mapFigmaToDesignSystem,
  collectComponentNamesFromNode,
  type FigmaStylesResponse,
  type FigmaVariablesResponse,
  type FigmaFileResponse,
  type FigmaNodesResponse,
  type FigmaImagesResponse,
  type FigmaNodeDoc,
} from "./figmaMapper";

// POST /api/ui-extract-figma
// Body: { figmaUrl: string, accessToken: string }
// Returns design system + optional frame thumbnail and metadata when node-id is in URL.
//
// Uses Figma REST: file, styles, variables, optional /nodes + /images for frame selection.

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
        {
          error:
            "Could not parse Figma file key from URL. Use a URL like: https://www.figma.com/design/ABC123/...",
        },
        { status: 400 }
      );
    }

    const nodeId = parseFigmaNodeId(figmaUrl);

    const headers = {
      "X-Figma-Token": accessToken,
    };

    const [fileRes, stylesRes, variablesRes] = await Promise.all([
      fetchFigma(`${FIGMA_API}/files/${fileKey}?depth=1`, headers),
      fetchFigma(`${FIGMA_API}/files/${fileKey}/styles`, headers),
      fetchFigma(`${FIGMA_API}/files/${fileKey}/variables/local`, headers).catch(
        () => null
      ),
    ]);

    if (!fileRes.ok) {
      const status = fileRes.status;
      if (status === 403) {
        return NextResponse.json(
          {
            error:
              "Access denied. Check that your personal access token is valid and has access to this file.",
          },
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

    let nodeDocument: FigmaNodeDoc | null = null;
    let frameName: string | undefined;
    let thumbnailUrl: string | undefined;
    let componentHints: string[] = [];

    if (nodeId) {
      const encodedId = encodeURIComponent(nodeId);
      const [nodesRes, imagesRes] = await Promise.all([
        fetchFigma(
          `${FIGMA_API}/files/${fileKey}/nodes?ids=${encodedId}&geometry=paths&plugin_data=shared`,
          headers
        ),
        fetchFigma(
          `${FIGMA_API}/images/${fileKey}?ids=${encodedId}&format=png&scale=2`,
          headers
        ),
      ]);

      if (nodesRes.ok) {
        const nodesData = (await nodesRes.json()) as FigmaNodesResponse;
        const entry = nodesData.nodes?.[nodeId];
        const doc = entry?.document;
        if (doc) {
          nodeDocument = doc;
          frameName = doc.name;
          componentHints = collectComponentNamesFromNode(doc);
        }
      }

      if (imagesRes.ok) {
        const imgData = (await imagesRes.json()) as FigmaImagesResponse;
        const u = imgData.images?.[nodeId];
        if (typeof u === "string" && u) thumbnailUrl = u;
      }
    }

    const designSystem = mapFigmaToDesignSystem(
      stylesData,
      variablesData,
      fileData,
      {
        frameName,
        nodeDocument: nodeDocument ?? undefined,
      }
    );

    return NextResponse.json({
      designSystem,
      fileName: fileData.name,
      hasVariables: !!variablesData,
      nodeId: nodeId ?? null,
      nodeName: frameName ?? null,
      thumbnailUrl: thumbnailUrl ?? null,
      componentHints,
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
