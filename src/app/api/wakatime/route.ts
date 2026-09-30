import { NextResponse } from "next/server";

import { getWakaTimeToday } from "@/lib/integrations/wakatime";

export const dynamic = "force-dynamic";

const cacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

export async function GET() {
  const data = await getWakaTimeToday();
  return NextResponse.json(data, { headers: cacheHeaders });
}
