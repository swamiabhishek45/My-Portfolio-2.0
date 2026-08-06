import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

export async function GET() {
  try {
    // Call counterapi.dev to increment and fetch the count.
    // Namespace: swamiabhishek45, Key: portfolio
    const response = await fetch(
      "https://api.counterapi.dev/v1/swamiabhishek45/portfolio/up",
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Counter API returned status ${response.status}`);
    }

    const data = await response.json();

    if (typeof data?.count !== "number") {
      throw new Error("Counter API response did not contain a numeric count");
    }

    return NextResponse.json(
      { count: data.count },
      {
        headers: CACHE_HEADERS,
      }
    );
  } catch (error) {
    console.error("Error in visitor counter API:", error);
    return NextResponse.json(
      {
        error: "visitor_count_unavailable",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 502,
        headers: CACHE_HEADERS,
      }
    );
  }
}
