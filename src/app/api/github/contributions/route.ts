import { NextResponse } from "next/server";

import {
  fetchGithubContributions,
  GITHUB_USERNAME,
  parseContributionYearParam,
} from "@/lib/github-contributions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") ?? GITHUB_USERNAME;
  const year = parseContributionYearParam(searchParams.get("year"));

  try {
    const calendar = await fetchGithubContributions(username, year);
    return NextResponse.json(calendar);
  } catch (error) {
    console.error("GitHub contributions fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to load GitHub contributions" },
      { status: 500 }
    );
  }
}
