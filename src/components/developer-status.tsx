"use client";

import { useEffect, useState } from "react";
import { Terminal, AlertCircle, RefreshCw } from "lucide-react";

import {
  useLiveActiveTimeToday,
  useWakaTimeStatus,
} from "@/hooks/use-wakatime-status";

export default function DeveloperStatus() {
  const { data, error, isLoading, mutate } = useWakaTimeStatus();
  const liveActiveToday = useLiveActiveTimeToday(data);

  const [timeTick, setTimeTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTick((t) => t + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  function formatRelativeTime(dateString: string | null): string {
    void timeTick;
    if (!dateString) return "No activity";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 15) return "Just now";
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
    return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  }

  if (isLoading && !data) {
    return (
      <div className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 rounded-xl animate-pulse max-w-md w-full">
        <div className="w-14 h-14 bg-neutral-200 dark:bg-neutral-800 rounded-xl shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center gap-4 p-4 border border-red-200 dark:border-red-950 bg-red-50/40 dark:bg-red-950/20 rounded-xl max-w-md w-full relative group">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-500 shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-red-900 dark:text-red-300">
            Failed to load status
          </div>
          <div className="text-xs text-red-600 dark:text-red-400">
            WakaTime fetch failed
          </div>
        </div>
        <button
          onClick={() => mutate()}
          className="shrink-0 p-2 rounded-lg border border-red-200 dark:border-red-900/60 hover:bg-red-100 dark:hover:bg-red-950/50 text-red-700 dark:text-red-400 transition duration-300"
          title="Retry loading status"
          aria-label="Retry loading status"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (!data?.lastActive && data?.configured) {
    return (
      <div className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/50 rounded-xl max-w-md w-full">
        <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-400">
          <Terminal className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-neutral-800 dark:text-neutral-300">
            Developer Status
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            No activity logged yet
          </div>
        </div>
      </div>
    );
  }

  if (!data?.configured) {
    return null;
  }

  const isCoding = data.status === "coding";

  return (
    <div className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900/85 rounded-xl transition duration-300 group max-w-md w-full relative overflow-hidden">
      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center select-none">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md z-10 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors duration-300 ${
            isCoding ? "border-green-500/30 dark:border-green-500/20 shadow-green-500/5" : ""
          }`}
        >
          <Terminal className={`w-5 h-5 ${isCoding ? "text-green-500 animate-pulse" : "text-neutral-500"}`} />
        </div>
        <div
          className={`absolute inset-0 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 opacity-60 transition-colors duration-300 ${
            isCoding ? "animate-[spin_30s_linear_infinite] border-green-500/50" : ""
          }`}
        ></div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="relative flex h-2 w-2">
            {isCoding && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 transition-colors duration-500 ${
                isCoding ? "bg-green-500" : "bg-neutral-400 dark:bg-neutral-600"
              }`}
            ></span>
          </span>
          <span className="text-[11px] font-medium tracking-wide uppercase text-neutral-500 dark:text-neutral-400">
            {isCoding ? "Currently Cooking" : "Idle · Reading Books"}
          </span>
        </div>

        <div className="truncate text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-green-500 transition-colors duration-200">
          Editor: {data.editor}
        </div>

        {data.language && (
          <div className="truncate text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
            <span className="font-medium text-neutral-400 dark:text-neutral-500">Language:</span>
            <span className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
              {data.language}
            </span>
          </div>
        )}

        {liveActiveToday ? (
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            {liveActiveToday} active today
          </div>
        ) : null}
      </div>

      <div className="flex flex-col items-end justify-between h-14 shrink-0 pb-1">
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 whitespace-nowrap self-end font-mono select-none">
          {formatRelativeTime(data.lastActive)}
        </span>

        {isCoding && (
          <div className="flex items-end gap-[2px] h-3 mr-1 select-none">
            <span
              className="w-[2px] h-full bg-green-500 rounded-sm animate-bounce-slow origin-bottom"
              style={{ animationDelay: "0.1s" }}
            ></span>
            <span
              className="w-[2px] h-full bg-green-500 rounded-sm animate-bounce-slow origin-bottom"
              style={{ animationDelay: "0.4s" }}
            ></span>
            <span
              className="w-[2px] h-full bg-green-500 rounded-sm animate-bounce-slow origin-bottom"
              style={{ animationDelay: "0.2s" }}
            ></span>
          </div>
        )}
      </div>
    </div>
  );
}
