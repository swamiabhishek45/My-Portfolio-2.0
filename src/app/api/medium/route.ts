import { NextResponse } from "next/server";

import { getCachedMediumPosts } from "@/lib/medium";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getCachedMediumPosts();

    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Medium RSS fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch Medium posts" },
      { status: 500 }
    );
  }
}
