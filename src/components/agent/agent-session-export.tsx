"use client";

import {
  exportAgentSessionFiles,
  type ExportSessionOptions,
} from "@/lib/agent/export-session";
import {
  readSessionDownloadEnabled,
  writeSessionDownloadEnabled,
} from "@/lib/agent/session-download-preference";
import { useAuiState } from "@assistant-ui/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SessionDownloadContextValue = {
  downloadOnCloseEnabled: boolean;
  setDownloadOnCloseEnabled: (enabled: boolean) => void;
};

const AgentSessionDownloadContext =
  createContext<SessionDownloadContextValue | null>(null);

export function AgentSessionDownloadProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [downloadOnCloseEnabled, setDownloadOnCloseEnabledState] = useState(true);

  useEffect(() => {
    setDownloadOnCloseEnabledState(readSessionDownloadEnabled());
  }, []);

  const setDownloadOnCloseEnabled = useCallback((enabled: boolean) => {
    setDownloadOnCloseEnabledState(enabled);
    writeSessionDownloadEnabled(enabled);
  }, []);

  return (
    <AgentSessionDownloadContext.Provider
      value={{ downloadOnCloseEnabled, setDownloadOnCloseEnabled }}
    >
      {children}
    </AgentSessionDownloadContext.Provider>
  );
}

export function useAgentSessionDownload(): SessionDownloadContextValue {
  const ctx = useContext(AgentSessionDownloadContext);
  if (!ctx) {
    return {
      downloadOnCloseEnabled: true,
      setDownloadOnCloseEnabled: () => {},
    };
  }
  return ctx;
}

export type AgentSessionExportFn = (
  overrides?: Partial<ExportSessionOptions>
) => Promise<void>;

const AgentSessionExportContext = createContext<AgentSessionExportFn | null>(
  null
);

export function useAgentSessionExport(): AgentSessionExportFn {
  const fn = useContext(AgentSessionExportContext);
  if (!fn) {
    return async () => {};
  }
  return fn;
}

/** Keeps latest thread messages in a ref and exposes export for voice disconnect / panel close. */
export function AgentSessionExportProvider({ children }: { children: ReactNode }) {
  const { downloadOnCloseEnabled } = useAgentSessionDownload();
  const downloadEnabledRef = useRef(downloadOnCloseEnabled);
  downloadEnabledRef.current = downloadOnCloseEnabled;

  const messages = useAuiState((s) => s.thread.messages);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const exportSession = useCallback(async (overrides?: Partial<ExportSessionOptions>) => {
    if (!downloadEnabledRef.current) return;
    await exportAgentSessionFiles({
      messages: messagesRef.current,
      ...overrides,
    });
  }, []);

  const exportRef = useRef(exportSession);
  exportRef.current = exportSession;

  const stableExport = useCallback(
    (overrides?: Partial<ExportSessionOptions>) => exportRef.current(overrides),
    []
  );

  return (
    <AgentSessionExportContext.Provider value={stableExport}>
      {children}
    </AgentSessionExportContext.Provider>
  );
}

/** Registers export callback with parent when panel is about to close. */
export function RegisterAgentSessionExport({
  onRegister,
}: {
  onRegister: (fn: AgentSessionExportFn) => void;
}) {
  const exportSession = useAgentSessionExport();

  useEffect(() => {
    onRegister(exportSession);
  }, [exportSession, onRegister]);

  return null;
}
