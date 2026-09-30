import { NextResponse } from "next/server";

import {
  attachVisitorCookie,
  ensureVisitorId,
} from "@/lib/agent/ensure-visitor";
import { assertCanSendMessage } from "@/lib/agent/quota";
import { checkAgentRateLimit } from "@/lib/agent/rate-limit";
import { REALTIME_INSTRUCTIONS } from "@/lib/agent/system-prompt";
import { realtimeToolSchemas } from "@/lib/agent/tools";

export const dynamic = "force-dynamic";

const REALTIME_MODEL =
  process.env.OPENAI_REALTIME_MODEL ?? "gpt-realtime";

function buildRealtimeSessionConfig() {
  return {
    type: "realtime" as const,
    model: REALTIME_MODEL,
    instructions: REALTIME_INSTRUCTIONS,
    tools: realtimeToolSchemas,
    audio: {
      output: {
        voice: "verse",
      },
      input: {
        transcription: {
          model: "gpt-4o-mini-transcribe",
        },
      },
    },
  };
}

export async function POST(request: Request) {
  const { visitorId, setCookie, cookieValue } = await ensureVisitorId();

  const rl = await checkAgentRateLimit(`voice:${visitorId}`);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const gate = await assertCanSendMessage(visitorId);
  if (!gate.canSend) {
    const response = NextResponse.json(
      { code: gate.reason ?? "QUOTA_EXCEEDED" },
      { status: 402 }
    );
    if (setCookie && cookieValue) attachVisitorCookie(response, cookieValue);
    return response;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Voice is not configured" },
      { status: 503 }
    );
  }

  let body: { sdp?: string };
  try {
    body = (await request.json()) as { sdp?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const offerSdp = body.sdp?.trim();
  if (!offerSdp) {
    return NextResponse.json(
      { error: "SDP offer required for WebRTC voice." },
      { status: 400 }
    );
  }

  const sessionJson = JSON.stringify(buildRealtimeSessionConfig());
  const form = new FormData();
  form.set("sdp", offerSdp);
  form.set(
    "session",
    new Blob([sessionJson], { type: "application/json" })
  );

  const sessionRes = await fetch("https://api.openai.com/v1/realtime/calls", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  if (!sessionRes.ok) {
    const err = await sessionRes.text();
    console.error("Realtime call error:", err);
    let detail = "Failed to create voice session";
    try {
      const parsed = JSON.parse(err) as {
        error?: { message?: string };
      };
      if (parsed.error?.message) detail = parsed.error.message;
    } catch {
      /* keep default */
    }
    return NextResponse.json({ error: detail }, { status: 502 });
  }

  const answerSdp = await sessionRes.text();

  const response = NextResponse.json({
    sdp: answerSdp,
    model: REALTIME_MODEL,
  });

  if (setCookie && cookieValue) attachVisitorCookie(response, cookieValue);
  return response;
}
