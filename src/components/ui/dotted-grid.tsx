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
        <div className="absolute top-[-2000px] bottom-[-2000px] left-0 w-[1px] bg-[linear-gradient(to_bottom,rgba(160,160,160,0.25)_50%,transparent_0%)] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12)_50%,transparent_0%)] bg-[length:1px_4px] bg-repeat-y pointer-events-none z-10" />
      )}

      {/* Full-height Right Vertical Dotted Line */}
      {showRightLine && (
        <div className="absolute top-[-2000px] bottom-[-2000px] right-0 w-[1px] bg-[linear-gradient(to_bottom,rgba(160,160,160,0.25)_50%,transparent_0%)] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12)_50%,transparent_0%)] bg-[length:1px_4px] bg-repeat-y pointer-events-none z-10" />
      )}

      {/* Grid Intersection Corner Markers */}
      {showIntersectionDots && (
        <>
          {/* Top-Left Corner Square Marker */}
          {showTopLine && showLeftLine && (
            <div className="absolute -top-[1.5px] -left-[1.5px] w-1 h-1 bg-neutral-400/60 dark:bg-neutral-600/60 rounded-[0.5px] z-20 pointer-events-none" />
          )}
          {/* Top-Right Corner Square Marker */}
          {showTopLine && showRightLine && (
            <div className="absolute -top-[1.5px] -right-[1.5px] w-1 h-1 bg-neutral-400/60 dark:bg-neutral-600/60 rounded-[0.5px] z-20 pointer-events-none" />
          )}
          {/* Bottom-Left Corner Square Marker */}
          {showBottomLine && showLeftLine && (
            <div className="absolute -bottom-[1.5px] -left-[1.5px] w-1 h-1 bg-neutral-400/60 dark:bg-neutral-600/60 rounded-[0.5px] z-20 pointer-events-none" />
          )}
          {/* Bottom-Right Corner Square Marker */}
          {showBottomLine && showRightLine && (
            <div className="absolute -bottom-[1.5px] -right-[1.5px] w-1 h-1 bg-neutral-400/60 dark:bg-neutral-600/60 rounded-[0.5px] z-20 pointer-events-none" />
          )}
        </>
      )}

      {children}
    </div>
  );
}
