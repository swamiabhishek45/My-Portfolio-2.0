"use client";

import { useChatRuntime } from "@assistant-ui/ai-sdk";
import { AssistantRuntimeProvider, AuiIf } from "@assistant-ui/react";
import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState, type FC, type PropsWithChildren } from "react";

import { PaywallModal } from "@/components/agent/paywall-modal";
import { Thread, type ThreadGroupPart } from "@/components/thread.aui";
import { VoiceControl, VoiceOrb } from "@/components/voice.aui";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AgentDownloadToggle } from "@/components/agent/agent-download-toggle";
import {
  AgentSessionDownloadProvider,
  AgentSessionExportProvider,
  RegisterAgentSessionExport,
  type AgentSessionExportFn,
} from "@/components/agent/agent-session-export";
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

/** Recruiters see answers only — not internal tool names or args. */
const HiddenToolCall: ToolCallMessagePartComponent = () => null;

const HiddenToolGroup: FC<
  PropsWithChildren<{ group: ThreadGroupPart }>
> = () => null;

const AGENT_THREAD_COMPONENTS = {
  ToolFallback: HiddenToolCall,
  ToolGroup: HiddenToolGroup,
};

const AGENT_THREAD_SCROLL_AREA =
  "agent-panel-thread-scroll min-h-0 flex-1 px-2 pb-2";

export function AgentPanel({ open, onOpenChange }: AgentPanelProps) {
  const [quota, setQuota] = useState<QuotaState | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const exportSessionRef = useRef<AgentSessionExportFn>(async () => {});

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        void exportSessionRef.current();
      }
      onOpenChange(next);
    },
    [onOpenChange]
  );

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

  return (
    <>
      <AgentSessionDownloadProvider>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          showCloseButton
          className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md"
        >
          <SheetHeader className="space-y-3 border-b px-4 py-3 pr-12 text-left">
            <SheetTitle className="text-base">Chat with Abhishek</SheetTitle>
            <AgentDownloadToggle />
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
              onRegisterExport={(fn) => {
                exportSessionRef.current = fn;
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>
      </AgentSessionDownloadProvider>

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
  onRegisterExport,
}: {
  quota: QuotaState | null;
  onPaywall: () => void;
  onFinish: () => void;
  onVoiceError: (message: string | null) => void;
  onRegisterExport: (fn: AgentSessionExportFn) => void;
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
      <AgentSessionExportProvider>
        <RegisterAgentSessionExport onRegister={onRegisterExport} />
        <div className="flex min-h-0 flex-1 flex-col">
          <AuiIf condition={(s) => s.thread.capabilities.voice}>
            <div className="flex flex-col items-center gap-2 border-b px-4 py-4">
              <VoiceOrb variant="violet" className="size-28" />
              <VoiceControl />
            </div>
          </AuiIf>
          <div className={AGENT_THREAD_SCROLL_AREA}>
            <Thread components={AGENT_THREAD_COMPONENTS} />
          </div>
        </div>
      </AgentSessionExportProvider>
    </AssistantRuntimeProvider>
  );
}
