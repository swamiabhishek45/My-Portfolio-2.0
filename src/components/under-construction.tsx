"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Hammer } from "lucide-react";

type UnderConstructionProps = {
  onShowWebsite: () => void;
};

export function UnderConstruction({ onShowWebsite }: UnderConstructionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md px-6 text-center select-none"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full mx-auto space-y-6">
        {/* GIF Container */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 opacity-25 blur-lg group-hover:opacity-40 transition duration-500" />
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/80 p-3 shadow-xl">
            <Image
              src="/under-construction.gif"
              alt="The site is under construction"
              width={260}
              height={260}
              unoptimized
              priority
              className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Hammer className="w-3.5 h-3.5 animate-bounce" />
            Work In Progress
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
            The site is under construction
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs mx-auto">
            We are fine-tuning the experience. You can still preview the full portfolio website.
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onShowWebsite}
          className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium text-sm shadow-lg shadow-neutral-950/10 dark:shadow-neutral-100/10 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
          id="show-website-btn"
        >
          <span>show website</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
}
