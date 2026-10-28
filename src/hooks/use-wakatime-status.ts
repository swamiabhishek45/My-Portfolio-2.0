"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

import { formatActiveSeconds } from "@/lib/format-active-time";
import type { WakaTimeStatus } from "@/lib/integrations/wakatime";

const WAKATIME_KEY = "/api/wakatime";

async function fetchWakaTime(url: string): Promise<WakaTimeStatus> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" },
  });
  if (!res.ok) throw new Error("Failed to fetch WakaTime status");
  return res.json() as Promise<WakaTimeStatus>;
}

/** Polls WakaTime while the tab is visible. */
export function useWakaTimeStatus() {
  return useSWR<WakaTimeStatus>(WAKATIME_KEY, fetchWakaTime, {
    refreshInterval: (latest) =>
      latest?.status === "coding" ? 20_000 : 30_000,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5_000,
    keepPreviousData: true,
  });
}

/**
 * While coding, adds elapsed seconds since the last API poll so "active today"
 * ticks up between WakaTime heartbeats (~every 2 min).
 */
export function useLiveActiveTimeToday(
  status: WakaTimeStatus | undefined
): string | null {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (status?.status !== "coding") return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [status?.status]);

  if (!status?.configured) return null;
  if (status.activeSecondsToday == null && !status.activeTimeToday) {
    return null;
  }

  void tick;

  const baseSeconds = status.activeSecondsToday ?? 0;
  if (status.status === "coding" && status.polledAt) {
    const elapsed = Math.floor((Date.now() - status.polledAt) / 1000);
    return formatActiveSeconds(baseSeconds + Math.max(0, elapsed));
  }

  return status.activeTimeToday ?? formatActiveSeconds(baseSeconds);
}
