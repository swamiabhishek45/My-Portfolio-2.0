"use client";

import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import type { FavoriteMediaCategory } from "@/data/favorites-media";
import {
  MediaCard,
  type MediaCategoryKey,
} from "@/components/favorites/media-card";
import { cn } from "@/lib/utils";

type MediaSectionProps = {
  group: FavoriteMediaCategory;
  icon: LucideIcon;
  index: number;
};

export function MediaSection({ group, icon: Icon, index }: MediaSectionProps) {
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const category = group.category as MediaCategoryKey;

  if (group.items.length === 0) return null;

  return (
    <section
      className={cn(
        "flex flex-col gap-3 py-5",
        index > 0 && "border-t border-neutral-200/80 dark:border-neutral-800/90"
      )}
    >
      <header className="flex items-center gap-2 border-b border-neutral-200/80 pb-3 dark:border-neutral-800/90">
        <Icon
          className="h-4 w-4 text-neutral-500 dark:text-neutral-500"
          strokeWidth={1.5}
          aria-hidden
        />
        <h2 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {group.category}
        </h2>
      </header>

      <div className="favorites-poster-row grid grid-cols-2 gap-3 sm:grid-cols-3">
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
      </div>
    </section>
  );
}
