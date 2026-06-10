"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  compact?: boolean;
  decimals?: number;
  separator?: string;
  replay?: boolean;
  className?: string;
}

// Ease-out cubic: starts fast, decelerates near end
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Format a number in compact notation (1.5K, 2.5M, 1.2B)
 */
function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    const v = value / 1_000_000_000;
    return `${Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    const v = value / 1_000_000;
    return `${Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    const v = value / 1_000;
    return `${Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  return value.toLocaleString();
}

/**
 * Format a number with comma separators and optional decimals
 */
function formatNumber(
  value: number,
  decimals: number,
  separator: string
): string {
  const fixed = value.toFixed(decimals);
  if (separator === ",") {
    const [intPart, decPart] = fixed.split(".");
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decPart !== undefined ? `${withCommas}.${decPart}` : withCommas;
  }
  return fixed;
}

export default function CountUp({
  end,
  duration = 2,
  suffix = "",
  prefix = "",
  compact = false,
  decimals = 0,
  separator = ",",
  replay = false,
  className = "",
}: CountUpProps) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(progress);
      const current = eased * end;

      if (compact) {
        setDisplay(formatCompact(Math.round(current)));
      } else {
        setDisplay(formatNumber(current, decimals, separator));
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Ensure final value is exact
        if (compact) {
          setDisplay(formatCompact(end));
        } else {
          setDisplay(formatNumber(end, decimals, separator));
        }
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [end, duration, compact, decimals, separator]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasAnimated.current || replay) {
            hasAnimated.current = true;
            animate();
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, replay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
