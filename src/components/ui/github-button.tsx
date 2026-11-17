"use client";

import { Github } from "lucide-react";

/**
 * Quiet icon link to the GitHub profile. Sized and bordered to match the year
 * selector it sits next to, so the pair reads as one control group.
 */
export function GithubButton({
  href = "https://github.com/swamiabhishek45",
  ariaLabel = "View GitHub profile",
}: {
  href?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="flex size-6 items-center justify-center rounded-md border border-zinc-300/80 bg-white/80 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:outline-none dark:border-white/15 dark:bg-zinc-900/80 dark:text-zinc-400 dark:hover:bg-zinc-800/90 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-500"
    >
      <Github className="size-3.5" strokeWidth={1.5} aria-hidden />
    </a>
  );
}
