import { NextResponse } from "next/server";

import {
  attachVisitorCookie,
  ensureVisitorId,
} from "@/lib/agent/ensure-visitor";
import { getQuotaStatus } from "@/lib/agent/quota";

export const dynamic = "force-dynamic";

export async function GET() {
  const { visitorId, setCookie, cookieValue } = await ensureVisitorId();
  const status = await getQuotaStatus(visitorId);

  const response = NextResponse.json({
    remainingFree: status.remainingFree,
    paidUntil: status.paidUntil,
    canSend: status.canSend,
  });

  if (setCookie && cookieValue) attachVisitorCookie(response, cookieValue);
  return response;
}
