// ============================================================
// Aphantasia/System — Figma Import API Route (Server-side)
// ============================================================

import { parseFigmaUrl, mapFigmaToADS } from "../../../../system/export/figma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fileUrl = body.fileUrl as string;
    const accessToken = body.accessToken as string | undefined;

    if (!fileUrl) {
      return Response.json({ error: "fileUrl is required" }, { status: 400 });
    }

    const parsed = parseFigmaUrl(fileUrl);
    if (!parsed) {
      return Response.json({ error: "Invalid Figma URL. Use a link like https://figma.com/design/KEY/name?node-id=123-456" }, { status: 400 });
    }

    const figmaToken = accessToken || process.env.FIGMA_ACCESS_TOKEN;
    if (!figmaToken) {
      return Response.json({ error: "Figma access token is required. Paste your personal access token from Figma settings." }, { status: 401 });
    }

    const headers = { "X-Figma-Token": figmaToken };
    const { fileKey, nodeId } = parsed;

    // Get file info
    const fileRes = await fetch(`https://api.figma.com/v1/files/${fileKey}?depth=1`, { headers });
    if (fileRes.status === 404) {
      return Response.json({ error: "Figma file not found. Check the URL and your access permissions." }, { status: 404 });
    }
    if (fileRes.status === 403) {
      return Response.json({ error: "Access denied. Your token may not have access to this file." }, { status: 403 });
    }
    if (!fileRes.ok) {
      const errText = await fileRes.text();
      return Response.json({ error: `Figma API error (${fileRes.status}): ${errText.substring(0, 200)}` }, { status: 500 });
    }
    const fileData = await fileRes.json();
    const fileName = fileData.name ?? "Unknown";

    // If node-id is provided, fetch that specific node's subtree
    let nodeData = null;
    if (nodeId) {
      const nodeRes = await fetch(
        `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`,
        { headers },
      );
      if (nodeRes.ok) {
        const nd = await nodeRes.json();
        nodeData = nd.nodes?.[nodeId]?.document ?? null;
      }
    }

    // Try variables API (requires Enterprise plan — may return 403/404)
    let varsData: unknown = { meta: { variables: {} } };
    try {
      const varsRes = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, { headers });
      if (varsRes.ok) varsData = await varsRes.json();
    } catch {
      // Variables API not available, continue with styles
    }

    // Get published styles (always available)
    const stylesRes = await fetch(`https://api.figma.com/v1/files/${fileKey}/styles`, { headers });
    const stylesData = stylesRes.ok ? await stylesRes.json() : { meta: { styles: [] } };

    // For FILL styles, fetch their actual node data to extract color values
    const rawStyles = stylesData?.meta?.styles ?? stylesData?.styles ?? [];
    const styleArray = Array.isArray(rawStyles) ? rawStyles : Object.values(rawStyles);
    const fillStyleNodeIds = styleArray
      .filter((s: Record<string, unknown>) => s && s.style_type === "FILL" && s.node_id)
      .map((s: Record<string, unknown>) => s.node_id as string);

    let styleNodeData: Record<string, unknown> = {};
    if (fillStyleNodeIds.length > 0) {
      // Fetch in batches of 50 (Figma API limit)
      for (let i = 0; i < fillStyleNodeIds.length; i += 50) {
        const batch = fillStyleNodeIds.slice(i, i + 50);
        const ids = batch.join(",");
        try {
          const nodeRes = await fetch(
            `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${ids}`,
            { headers },
          );
          if (nodeRes.ok) {
            const nd = await nodeRes.json();
            styleNodeData = { ...styleNodeData, ...nd.nodes };
          }
        } catch {
          // Continue with what we have
        }
      }
    }

    // Map to ADS tokens — pass style node data for color extraction
    const result = mapFigmaToADS(varsData, stylesData, fileName, fileKey, styleNodeData);

    return Response.json({
      ...result,
      nodeId,
      nodeData,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
