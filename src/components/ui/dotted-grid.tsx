"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DottedGridSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  showTopLine?: boolean;
  showBottomLine?: boolean;
  showLeftLine?: boolean;
  showRightLine?: boolean;
  showIntersectionDots?: boolean;
}

export function DottedGridSection({
  children,
  className,
  id,
  showTopLine = true,
  showBottomLine = true,
  showLeftLine = true,
  showRightLine = true,
  showIntersectionDots = true,
}: DottedGridSectionProps) {
  return (
    <div id={id} className={cn("relative w-full", className)}>
      {/* Full-width Top Horizontal Dotted Line */}
      {showTopLine && (
        <div className="absolute top-0 left-[-2000px] right-[-2000px] h-[1px] bg-[linear-gradient(to_right,rgba(160,160,160,0.25)_50%,transparent_0%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_50%,transparent_0%)] bg-[length:4px_1px] bg-repeat-x pointer-events-none z-10" />
      )}

      {/* Full-width Bottom Horizontal Dotted Line */}
      {showBottomLine && (
        <div className="absolute bottom-0 left-[-2000px] right-[-2000px] h-[1px] bg-[linear-gradient(to_right,rgba(160,160,160,0.25)_50%,transparent_0%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_50%,transparent_0%)] bg-[length:4px_1px] bg-repeat-x pointer-events-none z-10" />
      )}

      {/* Full-height Left Vertical Dotted Line */}
      {showLeftLine && (
        <div className="pointer-events-none absolute top-[-12px] bottom-[-12px] left-0 z-10 hidden w-[1px] bg-[linear-gradient(to_bottom,rgba(160,160,160,0.25)_50%,transparent_0%)] bg-[length:1px_4px] bg-repeat-y dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12)_50%,transparent_0%)] md:block" />
      )}

      {/* Full-height Right Vertical Dotted Line */}
      {showRightLine && (
        <div className="pointer-events-none absolute top-[-12px] bottom-[-12px] right-0 z-10 hidden w-[1px] bg-[linear-gradient(to_bottom,rgba(160,160,160,0.25)_50%,transparent_0%)] bg-[length:1px_4px] bg-repeat-y dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12)_50%,transparent_0%)] md:block" />
      )}

      {/* Grid Intersection Corner Markers */}
      {showIntersectionDots && (
        <>
          {/* Top-Left Corner Square Marker */}
          {showTopLine && showLeftLine && (
            <div className="pointer-events-none absolute -top-[1.5px] -left-[1.5px] z-20 hidden h-1 w-1 rounded-[0.5px] bg-neutral-400/60 dark:bg-neutral-600/60 md:block" />
          )}
          {/* Top-Right Corner Square Marker */}
          {showTopLine && showRightLine && (
            <div className="pointer-events-none absolute -top-[1.5px] -right-[1.5px] z-20 hidden h-1 w-1 rounded-[0.5px] bg-neutral-400/60 dark:bg-neutral-600/60 md:block" />
          )}
          {/* Bottom-Left Corner Square Marker */}
          {showBottomLine && showLeftLine && (
            <div className="pointer-events-none absolute -bottom-[1.5px] -left-[1.5px] z-20 hidden h-1 w-1 rounded-[0.5px] bg-neutral-400/60 dark:bg-neutral-600/60 md:block" />
          )}
          {/* Bottom-Right Corner Square Marker */}
          {showBottomLine && showRightLine && (
            <div className="pointer-events-none absolute -bottom-[1.5px] -right-[1.5px] z-20 hidden h-1 w-1 rounded-[0.5px] bg-neutral-400/60 dark:bg-neutral-600/60 md:block" />
          )}
        </>
      )}

      {children}
    </div>
  );
}
