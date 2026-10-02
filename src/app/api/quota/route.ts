import { NextResponse } from "next/server";

import { isAgentVoiceEnabled } from "@/lib/agent/agent-config";
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
    textUsed: status.textUsed,
    remainingText: status.remainingText,
    canSend: status.canSend,
    voiceUsed: status.voiceUsed,
    remainingVoice: status.remainingVoice,
    canUseVoice: status.canUseVoice,
    quotaDisabled: status.quotaDisabled ?? false,
    voiceEnabled: isAgentVoiceEnabled(),
  });

  if (setCookie && cookieValue) {
    attachVisitorCookie(response, cookieValue);
  }

  return response;
}
