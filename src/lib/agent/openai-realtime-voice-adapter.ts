import {

  createVoiceSession,

  type RealtimeVoiceAdapter,

  type VoiceSessionControls,

  type VoiceSessionHelpers,

} from "@assistant-ui/react";



export type OpenAIRealtimeVoiceAdapterOptions = {

  canConnect?: () => boolean;

  onQuotaExceeded?: () => void;

  onError?: (message: string) => void;

};



export class OpenAIRealtimeVoiceAdapter implements RealtimeVoiceAdapter {

  constructor(private readonly options: OpenAIRealtimeVoiceAdapterOptions = {}) {}



  connect(sessionOptions: { abortSignal?: AbortSignal }) {

    return createVoiceSession(sessionOptions, (helpers) =>

      this.setupSession(helpers)

    );

  }



  private fail(

    helpers: VoiceSessionHelpers,

    message: string,

    error?: unknown

  ): VoiceSessionControls {

    console.error("[voice]", message, error);

    this.options.onError?.(message);

    helpers.end("error", error ?? new Error(message));

    return { disconnect: () => {}, mute: () => {}, unmute: () => {} };

  }



  private async setupSession(

    helpers: VoiceSessionHelpers

  ): Promise<VoiceSessionControls> {

    try {

      if (this.options.canConnect && !this.options.canConnect()) {

        this.options.onQuotaExceeded?.();

        return this.fail(helpers, "Quota exceeded — unlock or wait for more free messages.");

      }



      const pc = new RTCPeerConnection();

      const audio = document.createElement("audio");

      audio.autoplay = true;

      pc.ontrack = (e) => {

        audio.srcObject = e.streams[0];

      };



      let stream: MediaStream;

      try {

        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      } catch (err) {

        const name = err instanceof DOMException ? err.name : "";

        let message =

          "Microphone access is required for voice. Allow the mic when the browser prompts you.";

        if (name === "NotFoundError") {

          message =

            "No microphone was found. Plug in a headset or mic, then in Windows go to Settings → System → Sound → Input and pick an active device.";

        } else if (name === "NotAllowedError" || name === "PermissionDeniedError") {

          message =

            "Microphone permission was blocked. Click the lock/site icon in the address bar and allow Microphone for this site, then try Connect again.";

        } else if (name === "NotReadableError") {

          message =

            "The microphone could not be opened (often in use by another app). Close other apps using the mic and try again.";

        }

        return this.fail(helpers, message, err);

      }



      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      const volumeLoop = startVolumeMeter(stream, helpers);



      const dc = pc.createDataChannel("oai-events");

      dc.onopen = () => {

        helpers.emitMode("listening");

      };



      dc.onmessage = (ev) => {

        if (helpers.isDisposed()) return;

        try {

          const msg = JSON.parse(String(ev.data)) as {

            type?: string;

            transcript?: string;

            delta?: string;

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

              if (r.status === 402) this.options.onQuotaExceeded?.();

            });

            helpers.emitTranscript({

              role: "user",

              text: msg.transcript,

              isFinal: true,

            });

            helpers.emitMode("listening");

          }



          const assistantDelta =

            (msg.type === "response.audio_transcript.delta" ||

              msg.type === "response.output_audio_transcript.delta") &&

            msg.delta;



          if (assistantDelta) {

            helpers.emitMode("speaking");

            helpers.emitTranscript({

              role: "assistant",

              text: msg.delta!,

              isFinal: false,

            });

          }



          const assistantDone =

            (msg.type === "response.audio_transcript.done" ||

              msg.type === "response.output_audio_transcript.done") &&

            msg.transcript;



          if (assistantDone) {

            helpers.emitTranscript({

              role: "assistant",

              text: msg.transcript!,

              isFinal: true,

            });

            helpers.emitMode("listening");

          }



          if (

            msg.type === "response.audio.delta" ||

            msg.type === "response.output_audio.delta"

          ) {

            helpers.emitMode("speaking");

          }



          if (msg.type === "response.done") {

            helpers.emitMode("listening");

          }

        } catch {

          /* ignore non-json */

        }

      };



      const offer = await pc.createOffer();

      await pc.setLocalDescription(offer);



      if (pc.iceGatheringState !== "complete") {

        await new Promise<void>((resolve, reject) => {

          const timeout = setTimeout(() => {

            pc.removeEventListener("icegatheringstatechange", onState);

            reject(new Error("Timed out gathering ICE candidates"));

          }, 10_000);

          const onState = () => {

            if (pc.iceGatheringState !== "complete") return;

            clearTimeout(timeout);

            pc.removeEventListener("icegatheringstatechange", onState);

            resolve();

          };

          pc.addEventListener("icegatheringstatechange", onState);

          onState();

        });

      }



      const offerSdp = pc.localDescription?.sdp;

      if (!offerSdp) {

        volumeLoop.stop();

        stream.getTracks().forEach((t) => t.stop());

        pc.close();

        return this.fail(helpers, "Could not create WebRTC offer.");

      }



      const sessionRes = await fetch("/api/voice/session", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ sdp: offerSdp }),

      });



      if (sessionRes.status === 402) {

        volumeLoop.stop();

        stream.getTracks().forEach((t) => t.stop());

        pc.close();

        this.options.onQuotaExceeded?.();

        return this.fail(helpers, "Quota exceeded.");

      }



      if (!sessionRes.ok) {

        volumeLoop.stop();

        stream.getTracks().forEach((t) => t.stop());

        pc.close();

        let detail = "Voice session unavailable";

        try {

          const errBody = (await sessionRes.json()) as { error?: string };

          if (errBody.error) detail = errBody.error;

        } catch {

          /* ignore */

        }

        return this.fail(helpers, detail);

      }



      const session = (await sessionRes.json()) as { sdp: string; model: string };



      if (helpers.isDisposed()) {

        volumeLoop.stop();

        stream.getTracks().forEach((t) => t.stop());

        pc.close();

        return { disconnect: () => {}, mute: () => {}, unmute: () => {} };

      }



      await pc.setRemoteDescription({ type: "answer", sdp: session.sdp });

      helpers.setStatus({ type: "running" });

      helpers.emitMode("listening");



      const disconnect = () => {

        volumeLoop.stop();

        dc.close();

        pc.close();

        stream.getTracks().forEach((t) => t.stop());

        audio.srcObject = null;

        helpers.end("finished");

      };



      return {

        disconnect,

        mute: () => {

          stream.getAudioTracks().forEach((t) => {

            t.enabled = false;

          });

        },

        unmute: () => {

          stream.getAudioTracks().forEach((t) => {

            t.enabled = true;

          });

        },

      };

    } catch (err) {

      return this.fail(

        helpers,

        err instanceof Error ? err.message : "Voice connection failed",

        err

      );

    }

  }

}



function startVolumeMeter(

  stream: MediaStream,

  helpers: VoiceSessionHelpers

): { stop: () => void } {

  const audioContext = new AudioContext();

  const source = audioContext.createMediaStreamSource(stream);

  const analyser = audioContext.createAnalyser();

  analyser.fftSize = 256;

  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);

  let frame = 0;



  const tick = () => {

    if (helpers.isDisposed()) return;

    analyser.getByteFrequencyData(data);

    let sum = 0;

    for (let i = 0; i < data.length; i++) sum += data[i];

    const avg = sum / data.length / 255;

    helpers.emitVolume(Math.min(1, avg * 2));

    frame = requestAnimationFrame(tick);

  };

  frame = requestAnimationFrame(tick);



  return {

    stop: () => {

      cancelAnimationFrame(frame);

      source.disconnect();

      void audioContext.close();

    },

  };

}

