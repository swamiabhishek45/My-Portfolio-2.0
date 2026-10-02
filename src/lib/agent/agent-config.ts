/** Server-side agent feature flags (portfolio cost control). */

function parseBool(
  value: string | undefined,
  defaultValue: boolean
): boolean {
  const flag = value?.trim().toLowerCase();
  if (flag === "true" || flag === "1" || flag === "yes") return true;
  if (flag === "false" || flag === "0" || flag === "no") return false;
  return defaultValue;
}

/**
 * Realtime voice: on in production by default (3 voice turns enforced there).
 * Off in local dev unless AGENT_VOICE_ENABLED=true.
 */
export function isAgentVoiceEnabled(): boolean {
  return parseBool(
    process.env.AGENT_VOICE_ENABLED,
    process.env.NODE_ENV === "production"
  );
}
