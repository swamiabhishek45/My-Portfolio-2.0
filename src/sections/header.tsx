"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import ScannerAvatar from "@/components/ui/scanner-avatar";
import CountUp from "@/components/ui/count-up";
import { Eye, BadgeCheck, Globe } from "lucide-react";

export default function Header() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  const { data: statusData } = useSWR(
    "/api/wakatime",
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 60000 }
  );

  const isCoding = statusData?.status === "coding";
  const editor = statusData?.editor || "VS Code";
  const statusText = statusData
    ? isCoding
      ? `Cooking in ${editor}`
      : "Idle · Reading books"
    : "Loading status...";

  const activeTimeText = statusData?.activeTimeToday
    ? ` • ${statusData.activeTimeToday} active today`
    : "";

  useEffect(() => {
    async function fetchVisitorCount() {
      try {
        const res = await fetch("/api/visitor");
        if (res.ok) {
          const data = await res.json();
          setVisitorCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch visitor count:", error);
      }
    }
    fetchVisitorCount();
  }, []);

  return (
    <section className="border border-neutral-200 dark:border-neutral-800/80 p-5 sm:p-6 rounded-2xl bg-neutral-50/30 dark:bg-neutral-900/20 relative overflow-hidden transition-all duration-300">
      {/* Top Right Controls: Visitor Count & Theme Toggler */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 flex items-center gap-4 z-20">
        {visitorCount !== null && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/50 px-2 py-1 rounded-md border border-neutral-200/50 dark:border-neutral-800/30">
            <Eye className="w-3.5 h-3.5" />
            <CountUp end={visitorCount} duration={2} />
          </div>
        )}
        <AnimatedThemeToggler />
      </div>

      {/* Main Profile Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 mt-4 sm:mt-0">
        {/* Avatar */}
        <ScannerAvatar
          primaryImage="/avatar.png"
          secondaryImage="/photo.png"
          interval={3000}
          duration={650}
          className="w-24 h-24 sm:w-28 sm:h-28 border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shrink-0 shadow-sm"
        />

        {/* Details */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left justify-center h-full sm:pt-2">
          {/* Top small icon */}
          <div className="mb-1 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">
            <Globe className="w-4 h-4 animate-[spin_20s_linear_infinite]" />
          </div>

          {/* Name & Verified Badge */}
          <div className="flex items-center gap-1.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
              Abhishek Swami
            </h1>
            <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500 dark:fill-blue-500 stroke-neutral-50 dark:stroke-neutral-900 shrink-0" />
          </div>

          {/* Subtitles */}
          <div className="text-sm sm:text-base font-medium text-neutral-600 dark:text-neutral-400 mb-2">
            22 • Software Engineer
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 h-5">
            <span className="relative flex h-2 w-2">
              {(!statusData || isCoding) && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isCoding ? "bg-green-400" : "bg-neutral-400 dark:bg-neutral-600 opacity-75"
                  }`}></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${statusData
                    ? isCoding
                      ? "bg-green-500"
                      : "bg-neutral-400 dark:bg-neutral-600"
                    : "bg-neutral-300 dark:bg-neutral-700"
                  }`}
              ></span>
            </span>
            <span>{statusText}{activeTimeText}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
