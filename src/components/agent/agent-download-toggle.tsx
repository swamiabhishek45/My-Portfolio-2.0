"use client";

import { useAgentSessionDownload } from "@/components/agent/agent-session-export";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

export function AgentDownloadToggle() {
  const { downloadOnCloseEnabled, setDownloadOnCloseEnabled } =
    useAgentSessionDownload();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={downloadOnCloseEnabled}
      aria-label="Save resume and chat when closing the agent"
      onClick={() => setDownloadOnCloseEnabled(!downloadOnCloseEnabled)}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors",
        downloadOnCloseEnabled
          ? "border-violet-500/40 bg-violet-500/10 text-foreground"
          : "border-border bg-muted/30 text-muted-foreground"
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Download className="size-3.5 shrink-0" aria-hidden />
        <span>
          <span className="font-medium">Save on close</span>
          <span className="mt-0.5 block text-[11px] leading-snug opacity-80">
            Resume PDF & chat transcript to your device
          </span>
        </span>
      </span>
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors",
          downloadOnCloseEnabled ? "bg-violet-600" : "bg-muted-foreground/30"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform",
            downloadOnCloseEnabled ? "left-[18px]" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}
