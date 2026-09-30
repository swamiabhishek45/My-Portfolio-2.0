"use client";

import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "portfolio-agent-download-on-close";

type AgentDownloadOnCloseContextValue = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
};

const AgentDownloadOnCloseContext =
  createContext<AgentDownloadOnCloseContextValue | null>(null);

export function AgentDownloadOnCloseProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [enabled, setEnabledState] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setEnabledState(stored === "true");
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <AgentDownloadOnCloseContext.Provider
      value={{ enabled: hydrated ? enabled : true, setEnabled }}
    >
      {children}
    </AgentDownloadOnCloseContext.Provider>
  );
}

export function useAgentDownloadOnClose(): AgentDownloadOnCloseContextValue {
  const ctx = useContext(AgentDownloadOnCloseContext);
  if (!ctx) {
    return {
      enabled: true,
      setEnabled: () => {},
    };
  }
  return ctx;
}

export function AgentDownloadOnCloseToggle({ className }: { className?: string }) {
  const { enabled, setEnabled } = useAgentDownloadOnClose();

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Download className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <div className="min-w-0">
          <p className="text-xs font-medium leading-tight">Save resume & chat</p>
          <p className="text-[11px] leading-tight text-muted-foreground">
            On close or end voice
          </p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={
          enabled
            ? "Disable downloading resume and chat on close"
            : "Enable downloading resume and chat on close"
        }
        onClick={() => setEnabled(!enabled)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          enabled ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block size-5 rounded-full bg-background shadow-sm ring-0 transition-transform",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
