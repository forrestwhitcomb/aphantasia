import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET /api/auth/github/callback — exchanges OAuth code for access token
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/?auth_error=missing_params`);
  }

  // Validate CSRF state
  const cookieStore = await cookies();
  const savedState = cookieStore.get("gh_oauth_state")?.value;
  if (state !== savedState) {
    return NextResponse.redirect(`${origin}/?auth_error=invalid_state`);
  }

  // Clean up state cookie
  cookieStore.delete("gh_oauth_state");

  // Exchange code for access token
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/?auth_error=server_config`);
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${origin}/?auth_error=token_exchange`);
  }

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
  };

  if (!tokenData.access_token) {
    return NextResponse.redirect(
      `${origin}/?auth_error=${tokenData.error || "no_token"}`
    );
  }

  // Fetch GitHub username
  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  let username = "unknown";
  if (userRes.ok) {
    const userData = (await userRes.json()) as { login?: string };
    username = userData.login || "unknown";
  }

  // Store token + username in httpOnly cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  };

  cookieStore.set("gh_token", tokenData.access_token, cookieOptions);
  cookieStore.set("gh_user", username, {
    ...cookieOptions,
    httpOnly: false, // client needs to read the username
  });

  // Redirect back to app with deploy flag to reopen modal
  return NextResponse.redirect(`${origin}/?deploy=1`);
}
