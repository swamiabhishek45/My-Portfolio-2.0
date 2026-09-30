import { NextResponse } from "next/server";



import {

  attachVisitorCookie,

  ensureVisitorId,

} from "@/lib/agent/ensure-visitor";

import { assertCanSendMessage } from "@/lib/agent/quota";

import { postRealtimeCall } from "@/lib/agent/realtime-call";

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

        voice: "sage",

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



  const apiKey = process.env.OPENAI_API_KEY?.trim();

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

  if (!offerSdp.includes("m=audio")) {

    return NextResponse.json(

      { error: "Invalid WebRTC offer (missing audio)." },

      { status: 400 }

    );

  }



  try {

    const sessionRes = await postRealtimeCall(

      apiKey,

      offerSdp,

      buildRealtimeSessionConfig()

    );



    if (!sessionRes.ok) {

      console.error("Realtime call error:", sessionRes.body);

      let detail = "Failed to create voice session";

      try {

        const parsed = JSON.parse(sessionRes.body) as {

          error?: { message?: string };

        };

        if (parsed.error?.message) detail = parsed.error.message;

      } catch {

        /* keep default */

      }

      return NextResponse.json({ error: detail }, { status: 502 });

    }



    const answerSdp = sessionRes.body;



    const response = NextResponse.json({

      sdp: answerSdp,

      model: REALTIME_MODEL,

    });



    if (setCookie && cookieValue) attachVisitorCookie(response, cookieValue);

    return response;

  } catch (error) {

    console.error("Voice session error:", error);

    return NextResponse.json(

      { error: "Failed to create voice session" },

      { status: 502 }

    );

  }

}


