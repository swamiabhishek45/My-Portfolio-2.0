"use client";

import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { Heart, Film, Tv, Sparkles } from "lucide-react";
import { DottedGridSection } from "@/components/ui/dotted-grid";
import Navbar from "@/components/navbar";
import { MediaSection } from "@/components/favorites/media-section";
import { FAVORITE_MEDIA } from "@/data/favorites-media";

const MEDIA_ICONS = {
  Movies: Film,
  Series: Tv,
  Anime: Sparkles,
} as const;

export default function FavoritesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-neutral-900 dark:text-neutral-100 transition-colors py-6 sm:py-10 overflow-x-clip font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-6 lg:gap-8 justify-center">
        <div className="w-full max-w-2xl flex flex-col gap-6">

          <DottedGridSection id="navbar"><Navbar /></DottedGridSection>

          <DottedGridSection id="favorites-header" className="py-4 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="p-1.5 rounded-lg border border-dotted border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <IoIosArrowBack className="text-lg" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                Favorites
              </h1>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              Curated Picks
            </span>
          </DottedGridSection>

          <DottedGridSection id="favorites-list" className="px-3 pb-6 pt-2 sm:px-6 sm:pb-8">
            <div className="favorites-screening-room rounded-2xl border border-dotted border-neutral-300/80 px-4 py-6 sm:px-6 sm:py-8 dark:border-neutral-800/80">
              <div className="mb-6 flex items-baseline justify-between gap-3">
                <p className="font-mono text-[10px] tracking-[0.28em] text-neutral-500 uppercase">
                  Screening room
                </p>
                <p className="font-mono text-[10px] text-neutral-500 dark:text-neutral-600">
                  Tap to focus · hover to spotlight
                </p>
              </div>

              <div className="flex flex-col">
                {FAVORITE_MEDIA.map((group, index) => {
                  const Icon =
                    MEDIA_ICONS[group.category as keyof typeof MEDIA_ICONS] ?? Film;
                  return (
                    <MediaSection
                      key={group.category}
                      group={group}
                      icon={Icon}
                      index={index}
                    />
                  );
                })}
              </div>
            </div>
          </DottedGridSection>

        </div>
      </div>
    </main>
  );
}
