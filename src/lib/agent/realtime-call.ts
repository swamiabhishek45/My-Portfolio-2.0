import OpenAI from "openai";
import type { RealtimeSessionCreateRequest } from "openai/resources/realtime/realtime";

export type RealtimeCallResult = {
  ok: boolean;
  status: number;
  body: string;
};

/** WebRTC offers must use CRLF line endings for OpenAI's SDP parser. */
export function normalizeSdp(sdp: string): string {
  const normalized = sdp.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n");
  return normalized.endsWith("\r\n") ? normalized : `${normalized}\r\n`;
}

export async function postRealtimeCall(
  apiKey: string,
  offerSdp: string,
  sessionConfig: RealtimeSessionCreateRequest
): Promise<RealtimeCallResult> {
  const client = new OpenAI({ apiKey: apiKey.trim() });

  let ephemeralToken: string;
  try {
    const secret = await client.realtime.clientSecrets.create({
      session: sessionConfig,
      expires_after: {
        anchor: "created_at",
        seconds: 600,
      },
    });
    ephemeralToken = secret.value;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const message =
        typeof error.error === "object" &&
        error.error !== null &&
        "message" in error.error &&
        typeof error.error.message === "string"
          ? error.error.message
          : error.message;

      return {
        ok: false,
        status: error.status ?? 502,
        body: JSON.stringify({ error: { message } }),
      };
    }
    throw error;
  }

  const sdp = normalizeSdp(offerSdp);
  const response = await fetch("https://api.openai.com/v1/realtime/calls", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ephemeralToken}`,
      Accept: "application/sdp",
      "Content-Type": "application/sdp",
    },
    body: sdp,
  });

  const body = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    body,
  };
}
