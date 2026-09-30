"use client";

import { useChatRuntime } from "@assistant-ui/ai-sdk";
import { AssistantRuntimeProvider, AuiIf } from "@assistant-ui/react";
import { DefaultChatTransport } from "ai";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PaywallModal } from "@/components/agent/paywall-modal";
import { Thread } from "@/components/thread.aui";
import { VoiceControl, VoiceOrb } from "@/components/voice.aui";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OpenAIRealtimeVoiceAdapter } from "@/lib/agent/openai-realtime-voice-adapter";

type QuotaState = {
  remainingFree: number;
  paidUntil: number | null;
  canSend: boolean;
  quotaDisabled?: boolean;
};

type AgentPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AgentPanel({ open, onOpenChange }: AgentPanelProps) {
  const [quota, setQuota] = useState<QuotaState | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const refreshQuota = useCallback(async () => {
    const res = await fetch("/api/quota");
    if (res.ok) {
      setQuota(await res.json());
    }
  }, []);

  useEffect(() => {
    if (open) {
      setVoiceError(null);
      void refreshQuota();
    }
  }, [open, refreshQuota]);

  const quotaLabel =
    quota == null
      ? "Loading quota…"
      : quota.quotaDisabled
        ? "Unlimited messages while building"
        : quota.paidUntil && quota.paidUntil > Date.now()
          ? "Paid session active"
          : `${quota.remainingFree} free question${quota.remainingFree === 1 ? "" : "s"} left`;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        >
          <SheetHeader className="border-b px-4 py-3 text-left">
            <div className="flex items-start justify-between gap-2">
              <div>
                <SheetTitle>Chat with Abhishek</SheetTitle>
                <SheetDescription className="text-xs">
                  First-person answers about my work — text or voice.
                </SheetDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
              >
                <X className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{quotaLabel}</p>
            {voiceError ? (
              <p className="text-xs text-destructive" role="alert">
                {voiceError}
              </p>
            ) : null}
          </SheetHeader>

          {open ? (
            <AgentPanelRuntime
              quota={quota}
              onPaywall={() => setPaywallOpen(true)}
              onFinish={() => void refreshQuota()}
              onVoiceError={setVoiceError}
            />
          ) : null}
        </SheetContent>
      </Sheet>

      <PaywallModal
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        onUnlocked={() => {
          void refreshQuota();
          setPaywallOpen(false);
        }}
      />
    </>
  );
}

function AgentPanelRuntime({
  quota,
  onPaywall,
  onFinish,
  onVoiceError,
}: {
  quota: QuotaState | null;
  onPaywall: () => void;
  onFinish: () => void;
  onVoiceError: (message: string | null) => void;
}) {
  const voiceAdapter = useMemo(
    () =>
      new OpenAIRealtimeVoiceAdapter({
        canConnect: () => quota?.canSend ?? true,
        onQuotaExceeded: onPaywall,
        onError: (message) => onVoiceError(message),
      }),
    [quota, onPaywall, onVoiceError]
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/agent/chat",
        fetch: async (input, init) => {
          const res = await fetch(input, init);
          if (res.status === 402) {
            onPaywall();
          }
          return res;
        },
      }),
    [onPaywall]
  );

  const runtime = useChatRuntime({
    transport,
    onFinish,
    adapters: {
      voice: voiceAdapter,
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex min-h-0 flex-1 flex-col">
        <AuiIf condition={(s) => s.thread.capabilities.voice}>
          <div className="flex flex-col items-center gap-2 border-b px-4 py-4">
            <VoiceOrb variant="violet" className="size-28" />
            <VoiceControl />
          </div>
        </AuiIf>
        <div className="min-h-0 flex-1 px-2 pb-2">
          <Thread />
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
}
