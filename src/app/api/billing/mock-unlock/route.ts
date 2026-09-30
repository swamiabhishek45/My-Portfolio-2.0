import { NextResponse } from "next/server";

import {
  attachVisitorCookie,
  ensureVisitorId,
} from "@/lib/agent/ensure-visitor";
import { grantPaidSession, getQuotaStatus } from "@/lib/agent/quota";

export const dynamic = "force-dynamic";

/** Dev/test unlock when AGENT_BILLING_MOCK=true */
export async function POST() {
  if (process.env.AGENT_BILLING_MOCK !== "true") {
    return NextResponse.json({ error: "Mock billing disabled" }, { status: 403 });
  }

  const { visitorId, setCookie, cookieValue } = await ensureVisitorId();
  const paidUntil = await grantPaidSession(visitorId);
  const status = await getQuotaStatus(visitorId);

  const response = NextResponse.json({
    ok: true,
    paidUntil,
    canSend: status.canSend,
    remainingFree: status.remainingFree,
  });

  if (setCookie && cookieValue) {
    attachVisitorCookie(response, cookieValue);
  }

  return response;
}
