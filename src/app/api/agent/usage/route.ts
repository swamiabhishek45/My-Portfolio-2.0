import { NextResponse } from "next/server";

import {
  attachVisitorCookie,
  ensureVisitorId,
} from "@/lib/agent/ensure-visitor";
import {
  assertCanSendMessage,
  getQuotaStatus,
  recordUserMessage,
} from "@/lib/agent/quota";
import { checkAgentRateLimit } from "@/lib/agent/rate-limit";

export const dynamic = "force-dynamic";

/** Records a user voice turn against the same quota as text chat. */
export async function POST(request: Request) {
  const { visitorId, setCookie, cookieValue } = await ensureVisitorId();

  const rl = await checkAgentRateLimit(`usage:${visitorId}`);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let body: { kind?: string } = {};
  try {
    body = (await request.json()) as { kind?: string };
  } catch {
    /* empty body ok */
  }

  if (body.kind && body.kind !== "voice_user_turn") {
    return NextResponse.json({ error: "Invalid usage kind" }, { status: 400 });
  }

  const gate = await assertCanSendMessage(visitorId);
  if (!gate.canSend) {
    const response = NextResponse.json(
      { code: gate.reason ?? "QUOTA_EXCEEDED", ...gate },
      { status: 402 }
    );
    if (setCookie && cookieValue) attachVisitorCookie(response, cookieValue);
    return response;
  }

  await recordUserMessage(visitorId);
  const status = await getQuotaStatus(visitorId);

  const response = NextResponse.json({
    ok: true,
    remainingFree: status.remainingFree,
    paidUntil: status.paidUntil,
    canSend: status.canSend,
  });

  if (setCookie && cookieValue) attachVisitorCookie(response, cookieValue);
  return response;
}
