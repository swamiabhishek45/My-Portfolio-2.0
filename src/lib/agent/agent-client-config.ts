/** Client-side agent flags (keep in sync with server AGENT_VOICE_ENABLED). */

function parseBool(
  value: string | undefined,
  defaultValue: boolean
): boolean {
  const flag = value?.trim().toLowerCase();
  if (flag === "true" || flag === "1" || flag === "yes") return true;
  if (flag === "false" || flag === "0" || flag === "no") return false;
  return defaultValue;
}

export function isPublicAgentVoiceEnabled(): boolean {
  return parseBool(
    process.env.NEXT_PUBLIC_AGENT_VOICE_ENABLED,
    process.env.NODE_ENV === "production"
  );
}
