"use client";

import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { Heart, Laptop, Code, Wrench, Coffee } from "lucide-react";
import { DottedGridSection } from "@/components/ui/dotted-grid";
import Navbar from "@/components/navbar";

const FAVORITES = [
  {
    category: "Development Setup",
    icon: Laptop,
    items: ["VS Code + Antigravity AI", "Warp Terminal", "Next.js App Router", "Tailwind CSS"],
  },
  {
    category: "Favorite Tech Stack",
    icon: Code,
    items: ["TypeScript", "React / Next.js", "Node.js", "MongoDB / PostgreSQL", "Turbopack"],
  },
  {
    category: "Productivity Tools",
    icon: Wrench,
    items: ["Raycast", "Linear", "Figma", "Notion"],
  },
  {
    category: "Daily Essentials",
    icon: Coffee,
    items: ["Dark Mode Everywhere", "Lo-Fi Beats", "Mechanical Keyboards", "Espresso"],
  },
];

export default function FavoritesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-neutral-900 dark:text-neutral-100 transition-colors py-6 sm:py-10 overflow-x-clip font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-6 lg:gap-8 justify-center">
        <div className="w-full max-w-2xl flex flex-col gap-6">

          {/* Top Navbar */}
          <DottedGridSection id="navbar"><Navbar /></DottedGridSection>

          {/* Header */}
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

          {/* Favorites List */}
          <DottedGridSection id="favorites-list" className="p-4 sm:p-6 flex flex-col gap-4">
            {FAVORITES.map((fav, idx) => {
              const Icon = fav.icon;
              return (
                <div
                  key={idx}
                  className="border border-dotted border-neutral-300 dark:border-neutral-800/80 rounded-2xl p-5 bg-neutral-50/20 dark:bg-neutral-900/20 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-bold text-sm">
                    <Icon className="w-4 h-4 text-blue-500" />
                    <span>{fav.category}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {fav.items.map((item, itemIdx) => (
                      <span
                        key={itemIdx}
                        className="px-3 py-1 text-xs font-mono rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-dotted border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </DottedGridSection>

        </div>
      </div>
    </main>
  );
}
