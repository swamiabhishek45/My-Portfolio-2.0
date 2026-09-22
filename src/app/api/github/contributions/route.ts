import { NextResponse } from "next/server";

import {
  fetchGithubContributions,
  GITHUB_USERNAME,
} from "@/lib/github-contributions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") ?? GITHUB_USERNAME;

  try {
    const calendar = await fetchGithubContributions(username);
    return NextResponse.json(calendar);
  } catch (error) {
    console.error("GitHub contributions fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to load GitHub contributions" },
      { status: 500 }
    );
  }
}
