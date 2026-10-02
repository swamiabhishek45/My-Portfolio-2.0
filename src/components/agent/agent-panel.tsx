"use client";

import { useChatRuntime } from "@assistant-ui/ai-sdk";
import { AssistantRuntimeProvider, AuiIf } from "@assistant-ui/react";
import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState, type FC, type PropsWithChildren } from "react";

import {
  AgentLimitModal,
  type AgentLimitKind,
} from "@/components/agent/agent-limit-modal";
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
import { isPublicAgentVoiceEnabled } from "@/lib/agent/agent-client-config";
import { OpenAIRealtimeVoiceAdapter } from "@/lib/agent/openai-realtime-voice-adapter";

type QuotaState = {
  remainingText: number;
  remainingVoice: number;
  canSend: boolean;
  canUseVoice: boolean;
  quotaDisabled?: boolean;
  voiceEnabled?: boolean;
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
  "agent-panel-thread-scroll min-h-0 flex-1 overflow-hidden px-2 pb-2";

function quotaLabel(quota: QuotaState | null): string {
  if (quota == null) return "Loading quota…";
  if (quota.quotaDisabled) return "Unlimited in dev mode";
  const text = `${quota.remainingText} text message${quota.remainingText === 1 ? "" : "s"} left`;
  if (!quota.voiceEnabled) return text;
  const voice = `${quota.remainingVoice} voice message${quota.remainingVoice === 1 ? "" : "s"} left`;
  return `${text} · ${voice}`;
}

export function AgentPanel({ open, onOpenChange }: AgentPanelProps) {
  const [quota, setQuota] = useState<QuotaState | null>(null);
  const [limitOpen, setLimitOpen] = useState(false);
  const [limitKind, setLimitKind] = useState<AgentLimitKind>("text");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const exportSessionRef = useRef<AgentSessionExportFn>(async () => {});

  const openLimit = useCallback((kind: AgentLimitKind) => {
    setLimitKind(kind);
    setLimitOpen(true);
  }, []);

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
            <p className="text-xs text-muted-foreground">
              {quotaLabel(quota)}
            </p>
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
              onTextLimit={() => openLimit("text")}
              onVoiceLimit={() => openLimit("voice")}
              onFinish={() => void refreshQuota()}
              refreshQuota={refreshQuota}
              onVoiceError={setVoiceError}
              onRegisterExport={(fn) => {
                exportSessionRef.current = fn;
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>
      </AgentSessionDownloadProvider>

      <AgentLimitModal
        open={limitOpen}
        onOpenChange={setLimitOpen}
        kind={limitKind}
      />
    </>
  );
}

function AgentPanelRuntime({
  quota,
  onTextLimit,
  onVoiceLimit,
  onFinish,
  refreshQuota,
  onVoiceError,
  onRegisterExport,
}: {
  quota: QuotaState | null;
  onTextLimit: () => void;
  onVoiceLimit: () => void;
  onFinish: () => void;
  refreshQuota: () => Promise<void>;
  onVoiceError: (message: string | null) => void;
  onRegisterExport: (fn: AgentSessionExportFn) => void;
}) {
  const voiceEnabled =
    isPublicAgentVoiceEnabled() && (quota?.voiceEnabled ?? false);

  const voiceAdapter = useMemo(
    () =>
      new OpenAIRealtimeVoiceAdapter({
        canConnect: () => quota?.canUseVoice ?? true,
        onQuotaExceeded: onVoiceLimit,
        onVoiceTurnRecorded: () => void refreshQuota(),
        onError: (message) => onVoiceError(message),
      }),
    [quota, onVoiceLimit, onVoiceError, refreshQuota]
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/agent/chat",
        fetch: async (input, init) => {
          const res = await fetch(input, init);
          if (res.status === 402) {
            onTextLimit();
          }
          return res;
        },
      }),
    [onTextLimit]
  );

  const runtime = useChatRuntime({
    transport,
    onFinish,
    ...(voiceEnabled
      ? { adapters: { voice: voiceAdapter } }
      : {}),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AgentSessionExportProvider>
        <RegisterAgentSessionExport onRegister={onRegisterExport} />
        <div className="flex min-h-0 flex-1 flex-col">
          {voiceEnabled ? (
            <AuiIf condition={(s) => s.thread.capabilities.voice}>
              <div className="flex flex-col items-center gap-2 border-b px-4 py-4">
                <VoiceOrb variant="violet" className="size-28" />
                <VoiceControl />
              </div>
            </AuiIf>
          ) : null}
          <div className={AGENT_THREAD_SCROLL_AREA}>
            <Thread components={AGENT_THREAD_COMPONENTS} />
          </div>
        </div>
      </AgentSessionExportProvider>
    </AssistantRuntimeProvider>
  );
}
