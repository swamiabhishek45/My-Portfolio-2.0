"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import type { FavoriteMediaCategory } from "@/data/favorites-media";
import {
  MediaCard,
  type MediaCategoryKey,
} from "@/components/favorites/media-card";
import { cn } from "@/lib/utils";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

type MediaSectionProps = {
  group: FavoriteMediaCategory;
  icon: LucideIcon;
  index: number;
};

export function MediaSection({ group, icon: Icon, index }: MediaSectionProps) {
  const reduceMotion = useReducedMotion();
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const category = group.category as MediaCategoryKey;

  return (
    <motion.section
      className={cn(
        "flex flex-col gap-3 py-5",
        index > 0 && "border-t border-neutral-200/80 dark:border-neutral-800/90"
      )}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "show"}
      viewport={{ once: true, margin: "-40px 0px -60px 0px", amount: 0.2 }}
      variants={sectionVariants}
    >
      <motion.header
        className="flex items-center gap-2 border-b border-neutral-200/80 pb-2.5 dark:border-neutral-800/90"
        variants={{
          hidden: { opacity: 0, x: -8 },
          show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
        }}
      >
        <motion.span
          variants={{
            hidden: { scale: 0.8, opacity: 0 },
            show: { scale: 1, opacity: 1, transition: { duration: 0.35 } },
          }}
        >
          <Icon
            className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-500"
            strokeWidth={2}
          />
        </motion.span>
        <h2 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
          {group.category}
        </h2>
      </motion.header>

      <motion.div
        className="favorites-poster-row grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {group.items.map((item, itemIndex) => (
          <MediaCard
            key={item.title}
            item={item}
            creditLabel={group.creditLabel}
            category={category}
            index={itemIndex}
            isActive={activeTitle === item.title}
            isDimmed={activeTitle !== null && activeTitle !== item.title}
            onActivate={() =>
              setActiveTitle((current) =>
                current === item.title ? null : item.title
              )
            }
          />
        ))}
      </motion.div>
    </motion.section>
  );
}
