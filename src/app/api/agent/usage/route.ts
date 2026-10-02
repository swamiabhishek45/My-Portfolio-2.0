import { NextResponse } from "next/server";

import {
  attachVisitorCookie,
  ensureVisitorId,
} from "@/lib/agent/ensure-visitor";
import {
  assertCanUseVoice,
  getQuotaStatus,
  recordVoiceTurn,
} from "@/lib/agent/quota";
import { checkAgentRateLimit } from "@/lib/agent/rate-limit";

export const dynamic = "force-dynamic";

/** Records a user voice turn (counts toward the 3 voice message limit). */
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

  const gate = await assertCanUseVoice(visitorId);
  if (!gate.canUseVoice) {
    const response = NextResponse.json(
      { code: gate.reason ?? "VOICE_QUOTA_EXCEEDED", ...gate },
      { status: 402 }
    );
    if (setCookie && cookieValue) attachVisitorCookie(response, cookieValue);
    return response;
  }

  await recordVoiceTurn(visitorId);
  const status = await getQuotaStatus(visitorId);

  const response = NextResponse.json({
    ok: true,
    voiceUsed: status.voiceUsed,
    remainingVoice: status.remainingVoice,
    canUseVoice: status.canUseVoice,
  });

  if (setCookie && cookieValue) attachVisitorCookie(response, cookieValue);
  return response;
}
