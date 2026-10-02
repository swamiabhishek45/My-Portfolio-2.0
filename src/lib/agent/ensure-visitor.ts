import { NextResponse } from "next/server";

import { getQuotaStatus } from "@/lib/agent/quota";
import {
  createSignedVisitorCookieValue,
  getVisitorIdFromCookies,
  visitorCookieOptions,
  VISITOR_COOKIE,
} from "@/lib/agent/visitor";

export async function ensureVisitorId(): Promise<{
  visitorId: string;
  setCookie: boolean;
  cookieValue?: string;
}> {
  let visitorId = await getVisitorIdFromCookies();
  if (visitorId) {
    return { visitorId, setCookie: false };
  }
  const cookieValue = createSignedVisitorCookieValue();
  const dot = cookieValue.lastIndexOf(".");
  visitorId = cookieValue.slice(0, dot);
  return { visitorId, setCookie: true, cookieValue };
}

export function attachVisitorCookie(
  response: NextResponse,
  cookieValue: string
): NextResponse {
  response.cookies.set(VISITOR_COOKIE, cookieValue, visitorCookieOptions());
  return response;
}

export async function jsonWithVisitor<T extends Record<string, unknown>>(
  body: T,
  init?: ResponseInit
): Promise<NextResponse> {
  const { visitorId, setCookie, cookieValue } = await ensureVisitorId();
  const status = await getQuotaStatus(visitorId);
  const response = NextResponse.json(
    {
      ...body,
      remainingText: status.remainingText,
      canSend: status.canSend,
      remainingVoice: status.remainingVoice,
      canUseVoice: status.canUseVoice,
    },
    init
  );
  if (setCookie && cookieValue) {
    attachVisitorCookie(response, cookieValue);
  }
  return response;
}
