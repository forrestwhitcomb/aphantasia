import { NextRequest, NextResponse } from "next/server";
import {
  parseFigmaFileKey,
  parseFigmaNodeId,
  mapFigmaToDesignSystem,
  collectComponentNamesFromNode,
  collectComponentRegistry,
  collectComponentLayouts,
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
    let componentRegistry: import("@/ui-mode/types").FigmaComponentEntry[] = [];
    let componentLayouts: Record<string, import("@/ui-mode/types").ComponentLayoutCSS> = {};

    if (nodeId) {
      // Specific node selected — fetch its full subtree + thumbnail
      const encodedId = encodeURIComponent(nodeId);
      const [nodesRes, imagesRes] = await Promise.all([
        fetchFigma(
          `${FIGMA_API}/files/${fileKey}/nodes?ids=${encodedId}&plugin_data=shared`,
          headers,
          45000
        ),
        fetchFigma(
          `${FIGMA_API}/images/${fileKey}?ids=${encodedId}&format=png&scale=2`,
          headers,
          45000
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
          componentRegistry = collectComponentRegistry(doc);
          componentLayouts = collectComponentLayouts(doc);
        }
      }

      if (imagesRes.ok) {
        const imgData = (await imagesRes.json()) as FigmaImagesResponse;
        const u = imgData.images?.[nodeId];
        if (typeof u === "string" && u) thumbnailUrl = u;
      }
    } else {
      // No node-id — fetch the full file tree to discover components
      const deepFileRes = await fetchFigma(
        `${FIGMA_API}/files/${fileKey}`,
        headers,
        45000
      );
      if (deepFileRes.ok) {
        const deepFileData = (await deepFileRes.json()) as FigmaFileResponse;
        const doc = deepFileData.document as FigmaNodeDoc | undefined;
        if (doc) {
          componentHints = collectComponentNamesFromNode(doc);
          componentRegistry = collectComponentRegistry(doc);
          componentLayouts = collectComponentLayouts(doc);
        }
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
      componentRegistry,
      componentLayouts,
    });
  } catch (error) {
    console.error("[ui-extract-figma] Error:", error);
    const isTimeout =
      error instanceof DOMException && error.name === "TimeoutError";
    return NextResponse.json(
      {
        error: isTimeout
          ? "The operation was aborted due to timeout. The Figma file may be too large — try a URL with a specific node-id (e.g. ?node-id=123:456)."
          : error instanceof Error
            ? error.message
            : "Extraction failed",
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}

async function fetchFigma(
  url: string,
  headers: Record<string, string>,
  timeoutMs = 30000
): Promise<Response> {
  return fetch(url, {
    headers,
    signal: AbortSignal.timeout(timeoutMs),
  });
}
