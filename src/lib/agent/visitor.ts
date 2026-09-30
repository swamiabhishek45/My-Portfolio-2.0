import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const VISITOR_COOKIE = "visitor_id";

function signingSecret(): string {
  return (
    process.env.VISITOR_SIGNING_SECRET ??
    process.env.CRON_SECRET ??
    "dev-visitor-signing-secret-change-me"
  );
}

function sign(visitorId: string): string {
  const mac = createHmac("sha256", signingSecret())
    .update(visitorId)
    .digest("base64url");
  return `${visitorId}.${mac}`;
}

function verifySigned(raw: string): string | null {
  const dot = raw.lastIndexOf(".");
  if (dot <= 0) return null;
  const visitorId = raw.slice(0, dot);
  const mac = raw.slice(dot + 1);
  const expected = createHmac("sha256", signingSecret())
    .update(visitorId)
    .digest("base64url");
  try {
    const a = Buffer.from(mac);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  if (!/^[0-9a-f-]{36}$/i.test(visitorId)) return null;
  return visitorId;
}

export function createSignedVisitorCookieValue(): string {
  return sign(randomUUID());
}

export async function getVisitorIdFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(VISITOR_COOKIE)?.value;
  if (!raw) return null;
  return verifySigned(raw);
}

export function parseSignedVisitorCookie(raw: string | undefined): string | null {
  if (!raw) return null;
  return verifySigned(raw);
}

export function visitorCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 2,
  };
}
