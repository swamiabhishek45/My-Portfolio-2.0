import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COUNT_API = "https://countapi.mileshilliard.com/api/v1";
const VISITOR_COOKIE = "portfolio_visitor";
const COUNTER_KEY =
  process.env.VISITOR_COUNTER_KEY ?? "swamiabhishek45-portfolio-unique";

const cacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

async function fetchCount(): Promise<number> {
  const response = await fetch(`${COUNT_API}/get/${COUNTER_KEY}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Counter API returned status ${response.status}`);
  }

  const data = (await response.json()) as { value?: number };
  return data.value ?? 0;
}

async function incrementCount(): Promise<number> {
  const response = await fetch(`${COUNT_API}/hit/${COUNTER_KEY}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Counter API returned status ${response.status}`);
  }

  const data = (await response.json()) as { value?: number };
  return data.value ?? 0;
}

/** Returns the current unique-visitor count without incrementing. */
export async function GET() {
  try {
    const count = await fetchCount();
    return NextResponse.json({ count }, { headers: cacheHeaders });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return NextResponse.json(
      { count: 0, error: "Visitor counter unavailable" },
      { status: 503, headers: cacheHeaders }
    );
  }
}

/**
 * Tracks a unique visitor (cookie-based) and returns the live count.
 * First visit from a browser increments the counter once.
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const hasVisited = cookieStore.get(VISITOR_COOKIE)?.value === "1";

    const count = hasVisited ? await fetchCount() : await incrementCount();

    const response = NextResponse.json(
      { count, newVisitor: !hasVisited },
      { headers: cacheHeaders }
    );

    if (!hasVisited) {
      response.cookies.set(VISITOR_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 2,
      });
    }

    return response;
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json(
      { count: 0, error: "Visitor counter unavailable" },
      { status: 503, headers: cacheHeaders }
    );
  }
}
