"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default function Header() {
  return (
    <section className="border p-5 rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        <div className="text-3xl sm:text-4xl font-bold tracking-tight">
          Abhishek Swami
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            abhishekswami1435@gmail.com
          </div>
          <AnimatedThemeToggler />
        </div>
      </div>


    </section>
  );
}
