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
        border border-neutral-200/80 bg-gradient-to-b from-white to-neutral-100
        shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.9),_0_4px_12px_rgba(0,0,0,0.05)]
        transition-all duration-300 ease-out hover:border-neutral-300
        dark:border-neutral-800/80 dark:from-[#22222a] dark:to-[#0c0c0e]
        dark:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.15),_0_4px_12px_rgba(0,0,0,0.25)]
        dark:hover:border-neutral-600
        sm:h-12 sm:w-12
      "
    >
      <Icon className="h-5 w-5 text-neutral-800 transition-all duration-300 group-hover:text-black group-hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.15)] dark:text-neutral-200 dark:group-hover:text-white dark:group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.85)] sm:h-6 sm:w-6" />

      <span className="pointer-events-none absolute left-1/2 -top-10 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-black opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
        {name}
      </span>
    </a>
  );
}

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap justify-start gap-3.5 border-t border-neutral-200 bg-neutral-100/10 p-4 dark:border-neutral-800/80 dark:bg-neutral-950/20">
      {socialLinks.map((link, index) => (
        <SocialLinkItem key={index} {...link} />
      ))}
    </div>
  );
}
