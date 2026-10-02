import { kvGet, kvIncr, kvSet } from "@/lib/agent/memory-store";

export const FREE_MESSAGE_LIMIT = 10;
export const FREE_VOICE_LIMIT = 3;

/** Unlimited text while building locally; set AGENT_QUOTA_DISABLED=false on Vercel prod. */
export function isQuotaDisabled(): boolean {
  const flag = process.env.AGENT_QUOTA_DISABLED?.trim().toLowerCase();
  if (flag === "true" || flag === "1" || flag === "yes") return true;
  if (flag === "false" || flag === "0" || flag === "no") return false;
  return process.env.NODE_ENV === "development";
}

/** Voice cap (3 turns) always applies in production; dev follows AGENT_QUOTA_DISABLED. */
export function isVoiceQuotaDisabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return isQuotaDisabled();
}

export const HISTORY_TTL_SECONDS = 60 * 60 * 24;
export const MAX_HISTORY_TURNS = 20;

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type QuotaStatus = {
  visitorId: string;
  textUsed: number;
  remainingText: number;
  canSend: boolean;
  voiceUsed: number;
  remainingVoice: number;
  canUseVoice: boolean;
  quotaDisabled?: boolean;
  reason?: "TEXT_QUOTA_EXCEEDED" | "VOICE_QUOTA_EXCEEDED";
};

function keys(visitorId: string) {
  return {
    text: `agent:${visitorId}:text_used`,
    voice: `agent:${visitorId}:voice_used`,
    history: `agent:${visitorId}:history`,
  };
}

export async function getQuotaStatus(visitorId: string): Promise<QuotaStatus> {
  const textUnlimited = isQuotaDisabled();
  const voiceUnlimited = isVoiceQuotaDisabled();

  if (textUnlimited && voiceUnlimited) {
    return {
      visitorId,
      textUsed: 0,
      remainingText: 999,
      canSend: true,
      voiceUsed: 0,
      remainingVoice: 999,
      canUseVoice: true,
      quotaDisabled: true,
    };
  }

  const k = keys(visitorId);
  const [textRaw, voiceRaw] = await Promise.all([
    textUnlimited ? Promise.resolve(null) : kvGet(k.text),
    voiceUnlimited ? Promise.resolve(null) : kvGet(k.voice),
  ]);
  const textUsed = textRaw ? parseInt(textRaw, 10) : 0;
  const voiceUsed = voiceRaw ? parseInt(voiceRaw, 10) : 0;
  const remainingText = textUnlimited
    ? 999
    : Math.max(0, FREE_MESSAGE_LIMIT - textUsed);
  const remainingVoice = voiceUnlimited
    ? 999
    : Math.max(0, FREE_VOICE_LIMIT - voiceUsed);

  return {
    visitorId,
    textUsed,
    remainingText,
    canSend: textUnlimited || remainingText > 0,
    voiceUsed,
    remainingVoice,
    canUseVoice: voiceUnlimited || remainingVoice > 0,
    quotaDisabled: textUnlimited && voiceUnlimited,
    reason: undefined,
  };
}

export async function assertCanSendMessage(
  visitorId: string
): Promise<QuotaStatus> {
  if (isQuotaDisabled()) {
    return getQuotaStatus(visitorId);
  }
  const status = await getQuotaStatus(visitorId);
  if (!status.canSend) {
    return { ...status, reason: "TEXT_QUOTA_EXCEEDED" };
  }
  return status;
}

export async function assertCanUseVoice(
  visitorId: string
): Promise<QuotaStatus> {
  if (isVoiceQuotaDisabled()) {
    return getQuotaStatus(visitorId);
  }
  const status = await getQuotaStatus(visitorId);
  if (!status.canUseVoice) {
    return { ...status, reason: "VOICE_QUOTA_EXCEEDED" };
  }
  return status;
}

export async function recordUserMessage(visitorId: string): Promise<void> {
  if (isQuotaDisabled()) return;
  await kvIncr(keys(visitorId).text);
}

export async function recordVoiceTurn(visitorId: string): Promise<void> {
  if (isVoiceQuotaDisabled()) return;
  await kvIncr(keys(visitorId).voice);
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
