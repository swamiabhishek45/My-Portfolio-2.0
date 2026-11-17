"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import type { FavoriteMediaItem } from "@/data/favorites-media";
import { cn } from "@/lib/utils";

export type MediaCategoryKey = "Movies" | "Series" | "Anime";

type MediaCardProps = {
  item: FavoriteMediaItem;
  creditLabel: "Director" | "Creator";
  category: MediaCategoryKey;
  index: number;
  isDimmed?: boolean;
  isActive?: boolean;
  onActivate?: () => void;
};

// The poster is the colour. The card itself only lifts and sharpens its edge.
const POSTER_RAISED =
  "shadow-[0_12px_32px_-14px_rgba(0,0,0,0.65)] ring-black/20 dark:ring-white/25";

export function MediaCard({
  item,
  creditLabel,
  category,
  index,
  isDimmed,
  isActive,
  onActivate,
}: MediaCardProps) {
  const reduceMotion = useReducedMotion();
  const creditPrefix = creditLabel === "Director" ? "Dir." : "Creator";
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const showDetails = isActive || hovered || focused;

  const handlePointerEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <motion.article
      className={cn(
        "favorites-poster-card group relative w-full cursor-pointer outline-none",
        isDimmed && "favorites-poster-card--dimmed",
        isActive && "favorites-poster-card--active z-10"
      )}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate?.();
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      aria-label={`${item.title}, ${item.year}. ${creditLabel} ${item.director}`}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -4, transition: { duration: 0.2 } }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <div
        className={cn(
          "relative aspect-2/3 w-full overflow-hidden rounded-[11px] bg-neutral-900 ring-1 ring-white/[0.08] transition-[box-shadow,ring-color] duration-300",
          showDetails && POSTER_RAISED
        )}
      >
        <motion.div
          className="relative h-full w-full"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={item.poster}
            alt=""
            fill
            sizes="(max-width: 640px) 45vw, 200px"
            className="object-cover"
          />
        </motion.div>

        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent transition-opacity duration-300",
            showDetails ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-20 p-2 transition-[transform,opacity] duration-200 sm:p-2.5",
            showDetails
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          )}
        >
          <p className="text-[10px] font-semibold leading-snug text-white sm:text-[11px]">
            {item.title}
          </p>
          <p className="mt-0.5 text-[9px] leading-snug text-white/70 sm:text-[10px]">
            {creditPrefix} {item.director} · {item.year}
          </p>
        </div>

        <div
          className={cn(
            "pointer-events-none absolute inset-x-3 top-2 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent transition-opacity duration-300",
            showDetails ? "opacity-100" : "opacity-0"
          )}
          aria-hidden
        />
      </div>
    </motion.article>
  );
}
