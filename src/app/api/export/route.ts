import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// POST /api/export — Push index.html to GitHub repo
// Body: { projectName: string, html: string }
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;
  const user = cookieStore.get("gh_user")?.value;

  if (!token || !user) {
    return NextResponse.json(
      { error: "Not authenticated with GitHub" },
      { status: 401 }
    );
  }

  const { projectName, html } = (await req.json()) as {
    projectName?: string;
    html?: string;
  };

  if (!projectName || !html) {
    return NextResponse.json(
      { error: "projectName and html are required" },
      { status: 400 }
    );
  }

  // Inject meta tags into the exported HTML
  const exportHtml = injectExportMeta(html, projectName);

  // Sanitize project name to URL-safe slug
  const slug = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || "site";
  const repoName = `aphantasia-${slug}`;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  try {
    // 1. Check if repo exists
    const checkRes = await fetch(
      `https://api.github.com/repos/${user}/${repoName}`,
      { headers }
    );

    if (checkRes.status === 401 || checkRes.status === 403) {
      return NextResponse.json(
        { error: "GitHub token expired or insufficient permissions. Please reconnect." },
        { status: 401 }
      );
    }

    // 2. Create repo if it doesn't exist
    if (checkRes.status === 404) {
      const createRes = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: repoName,
          description: "Built with Aphantasia",
          auto_init: true, // Creates with README so we have a default branch
          private: false,
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        return NextResponse.json(
          { error: `Failed to create repo: ${(err as { message?: string }).message || "unknown"}` },
          { status: 422 }
        );
      }

      // Small delay to let GitHub initialize the repo
      await new Promise((r) => setTimeout(r, 1500));
    }

    // 3. Check if index.html already exists (get SHA for update)
    let existingSha: string | undefined;
    const fileRes = await fetch(
      `https://api.github.com/repos/${user}/${repoName}/contents/index.html`,
      { headers }
    );
    if (fileRes.ok) {
      const fileData = (await fileRes.json()) as { sha?: string };
      existingSha = fileData.sha;
    }

    // 4. Create or update index.html
    const content = Buffer.from(exportHtml).toString("base64");
    const putBody: Record<string, string> = {
      message: existingSha
        ? "Update site from Aphantasia"
        : "Deploy site from Aphantasia",
      content,
    };
    if (existingSha) {
      putBody.sha = existingSha;
    }

    const putRes = await fetch(
      `https://api.github.com/repos/${user}/${repoName}/contents/index.html`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(putBody),
      }
    );

    if (!putRes.ok) {
      const err = await putRes.json();
      return NextResponse.json(
        { error: `Failed to push file: ${(err as { message?: string }).message || "unknown"}` },
        { status: 500 }
      );
    }

    const repoUrl = `https://github.com/${user}/${repoName}`;
    const vercelDeepLink = `https://vercel.com/new/import?s=${encodeURIComponent(repoUrl)}`;

    return NextResponse.json({
      success: true,
      repoUrl,
      repoName,
      vercelDeepLink,
      isUpdate: !!existingSha,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Export failed: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 500 }
    );
  }
}

function injectExportMeta(html: string, projectName: string): string {
  // Extract a description from the first hero section or fall back
  const heroMatch = html.match(/data-aph-type="hero"[\s\S]*?<\/section>/i);
  let description = `${projectName} — Built with Aphantasia`;
  if (heroMatch) {
    const textMatch = heroMatch[0].match(/<(?:p|span)[^>]*>([^<]{20,120})/);
    if (textMatch) description = textMatch[1].trim();
  }

  const metaTags = `  <meta name="generator" content="Aphantasia" />
  <meta property="og:title" content="${escapeAttr(projectName)}" />
  <meta property="og:description" content="${escapeAttr(description)}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <title>${escapeAttr(projectName)}</title>`;

  if (html.includes("</head>")) {
    return html.replace("</head>", `${metaTags}\n</head>`);
  }
  return html;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

