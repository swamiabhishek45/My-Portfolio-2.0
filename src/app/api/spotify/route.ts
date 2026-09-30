import { NextResponse } from "next/server";

import { getSpotifyNowPlaying } from "@/lib/integrations/spotify";

export const dynamic = "force-dynamic";

const cacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

export async function GET() {
  const data = await getSpotifyNowPlaying();
  return NextResponse.json(data, { headers: cacheHeaders });
}
