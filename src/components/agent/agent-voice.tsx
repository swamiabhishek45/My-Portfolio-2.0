"use client";

import { useEffect, useRef, useState } from "react";

type AgentVoiceProps = {
  canSend: boolean;
  onQuotaExceeded: () => void;
  onStop: () => void;
  onTranscript: (role: "user" | "assistant", text: string) => void;
};

export function AgentVoice({
  canSend,
  onQuotaExceeded,
  onStop,
  onTranscript,
}: AgentVoiceProps) {
  const [status, setStatus] = useState<string>("Connecting…");
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!canSend) {
      onQuotaExceeded();
      onStop();
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    async function start() {
      try {
        const sessionRes = await fetch("/api/voice/session", { method: "POST" });
        if (sessionRes.status === 402) {
          onQuotaExceeded();
          onStop();
          return;
        }
        if (!sessionRes.ok) {
          throw new Error("Voice session unavailable");
        }
        const session = (await sessionRes.json()) as {
          clientSecret: string;
          model: string;
        };

        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        const audio = document.createElement("audio");
        audio.autoplay = true;
        audioRef.current = audio;
        pc.ontrack = (e) => {
          audio.srcObject = e.streams[0];
        };

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        const dc = pc.createDataChannel("oai-events");
        dcRef.current = dc;

        dc.onopen = () => setStatus("Listening — speak now");
        dc.onmessage = (ev) => {
          try {
            const msg = JSON.parse(String(ev.data)) as {
              type?: string;
              transcript?: string;
            };
            if (
              msg.type === "conversation.item.input_audio_transcription.completed" &&
              msg.transcript
            ) {
              void fetch("/api/agent/usage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ kind: "voice_user_turn" }),
              }).then((r) => {
                if (r.status === 402) onQuotaExceeded();
              });
              onTranscript("user", msg.transcript);
            }
            if (
              msg.type === "response.audio_transcript.done" &&
              msg.transcript
            ) {
              onTranscript("assistant", msg.transcript);
            }
          } catch {
            /* ignore non-json */
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const sdpRes = await fetch(
          `https://api.openai.com/v1/realtime?model=${encodeURIComponent(session.model)}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.clientSecret}`,
              "Content-Type": "application/sdp",
            },
            body: offer.sdp,
          }
        );

        if (!sdpRes.ok) {
          throw new Error("WebRTC negotiation failed");
        }

        const answer = await sdpRes.text();
        if (cancelled) return;
        await pc.setRemoteDescription({ type: "answer", sdp: answer });
        setStatus("Voice connected");
      } catch {
        setStatus("Voice failed — use text chat");
      }
    }

    void start();

    return () => {
      cancelled = true;
      dcRef.current?.close();
      pcRef.current?.close();
      streamCleanup(pcRef.current);
    };
  }, [canSend, onQuotaExceeded, onStop, onTranscript]);

  return (
    <div className="rounded-lg border bg-muted/40 px-3 py-4 text-center text-sm">
      <p>{status}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Microphone active for Realtime voice
      </p>
    </div>
  );
}

function streamCleanup(pc: RTCPeerConnection | null) {
  pc?.getSenders().forEach((s) => s.track?.stop());
}
