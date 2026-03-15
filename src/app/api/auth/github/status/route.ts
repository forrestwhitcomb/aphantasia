import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET /api/auth/github/status — check if user is authenticated with GitHub
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;
  const user = cookieStore.get("gh_user")?.value;

  if (token && user) {
    return NextResponse.json({ authenticated: true, username: user });
  }

  return NextResponse.json({ authenticated: false });
}
