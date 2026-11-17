"use client";

import { socialLinks } from "@/data/socials";

interface SocialLinkItemProps {
  name: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

function SocialLinkItem({ name, link, icon: Icon }: SocialLinkItemProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="
        group relative flex h-10 w-10 items-center justify-center rounded-xl
        border border-neutral-200/80 bg-neutral-50
        transition-colors duration-150 hover:border-neutral-300 hover:bg-neutral-100
        focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:outline-none
        dark:border-neutral-800/80 dark:bg-neutral-900/60
        dark:hover:border-neutral-600 dark:hover:bg-neutral-800/70
        dark:focus-visible:ring-neutral-500
        sm:h-12 sm:w-12
      "
    >
      <Icon className="h-5 w-5 text-neutral-600 transition-colors duration-150 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100 sm:h-6 sm:w-6" />

      <span className="pointer-events-none absolute left-1/2 -top-10 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-black opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
        {name}
      </span>
    </a>
  );
}

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap justify-start gap-4 border-t border-neutral-200 bg-neutral-100/10 p-4 dark:border-neutral-800/80 dark:bg-neutral-950/20">
      {socialLinks.map((link, index) => (
        <SocialLinkItem key={index} {...link} />
      ))}
    </div>
  );
}
