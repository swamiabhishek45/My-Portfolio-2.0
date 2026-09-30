import { kvGet, kvIncr, kvSet, kvExpire } from "@/lib/agent/memory-store";

export const FREE_MESSAGE_LIMIT = 3;
export const PAID_SESSION_SECONDS = 3600;
export const PAID_HOURLY_MSG_CAP = 200;
export const HISTORY_TTL_SECONDS = 60 * 60 * 24;
export const MAX_HISTORY_TURNS = 20;

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type QuotaStatus = {
  visitorId: string;
  freeUsed: number;
  remainingFree: number;
  paidUntil: number | null;
  canSend: boolean;
  reason?: "QUOTA_EXCEEDED" | "RATE_ABUSE";
};

function keys(visitorId: string) {
  return {
    free: `agent:${visitorId}:free_used`,
    paid: `agent:${visitorId}:paid_until`,
    hour: `agent:${visitorId}:msgs_hour`,
    history: `agent:${visitorId}:history`,
  };
}

export async function getQuotaStatus(visitorId: string): Promise<QuotaStatus> {
  const k = keys(visitorId);
  const [freeRaw, paidRaw] = await Promise.all([
    kvGet(k.free),
    kvGet(k.paid),
  ]);
  const freeUsed = freeRaw ? parseInt(freeRaw, 10) : 0;
  const paidUntil = paidRaw ? parseInt(paidRaw, 10) : null;
  const now = Date.now();
  const isPaid = paidUntil != null && paidUntil > now;
  const remainingFree = Math.max(0, FREE_MESSAGE_LIMIT - freeUsed);
  const canSend = isPaid || remainingFree > 0;

  return {
    visitorId,
    freeUsed,
    remainingFree,
    paidUntil: isPaid ? paidUntil : paidUntil && paidUntil <= now ? null : paidUntil,
    canSend,
    reason: canSend ? undefined : "QUOTA_EXCEEDED",
  };
}

export async function assertCanSendMessage(
  visitorId: string
): Promise<QuotaStatus> {
  const status = await getQuotaStatus(visitorId);
  if (!status.canSend) {
    return { ...status, reason: "QUOTA_EXCEEDED" };
  }

  const now = Date.now();
  if (status.paidUntil && status.paidUntil > now) {
    const k = keys(visitorId);
    const hourCount = await kvIncr(k.hour);
    if (hourCount === 1) {
      await kvExpire(k.hour, 3600);
    }
    if (hourCount > PAID_HOURLY_MSG_CAP) {
      return { ...status, canSend: false, reason: "RATE_ABUSE" };
    }
  }

  return status;
}

export async function recordUserMessage(visitorId: string): Promise<void> {
  const k = keys(visitorId);
  const status = await getQuotaStatus(visitorId);
  const now = Date.now();
  const isPaid = status.paidUntil != null && status.paidUntil > now;

  if (!isPaid) {
    await kvIncr(k.free);
  }
}

export async function grantPaidSession(visitorId: string): Promise<number> {
  const k = keys(visitorId);
  const until = Date.now() + PAID_SESSION_SECONDS * 1000;
  await kvSet(k.paid, String(until));
  return until;
}

export async function getConversationHistory(
  visitorId: string
): Promise<ChatTurn[]> {
  const raw = await kvGet(keys(visitorId).history);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ChatTurn[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function appendConversationTurns(
  visitorId: string,
  turns: ChatTurn[]
): Promise<void> {
  const existing = await getConversationHistory(visitorId);
  const merged = [...existing, ...turns].slice(-MAX_HISTORY_TURNS);
  await kvSet(keys(visitorId).history, JSON.stringify(merged), {
    ex: HISTORY_TTL_SECONDS,
  });
}
