"use client";

import { useEffect, useState } from "react";
import { FaCode, FaLightbulb } from "react-icons/fa";
import { socialLinks } from "@/data/socials";
import { quotes, authorIcons } from "@/data/quotes";

interface Quote {
  text: string;
  author: string;
}

export default function Contact() {
  const [quote, setQuote] = useState<Quote | null>(null);

  // Runs ONLY on client after hydration
  useEffect(() => {
    setQuote(
      quotes[Math.floor(Math.random() * quotes.length)]
    );
  }, []);

  // Prevent hydration mismatch
  if (!quote) return null;

  const icons = authorIcons[quote.author];
  const LeftIcon = icons?.left ?? FaCode;
  const RightIcon = icons?.right ?? FaLightbulb;

  return (
    <section className="flex flex-col w-full">
      <div className="flex flex-col gap-5 sm:flex-row sm:justify-between items-center border border-dotted border-neutral-300 dark:border-neutral-800/80 p-5 sm:p-6 rounded-2xl bg-neutral-50/10 dark:bg-neutral-900/10 backdrop-blur-sm">
        {/* Social Icons */}
        <div className="flex flex-wrap gap-4">
          {socialLinks.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group text-2xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                <Icon />

                <span
                  className="absolute left-1/2 -translate-x-1/2 -top-9
                             px-3 py-1 text-xs font-medium
                             bg-white dark:bg-neutral-900
                             text-black dark:text-white
                             rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700
                             opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                             transition-all duration-150 whitespace-nowrap pointer-events-none"
                >
                  {item.name}
                </span>
              </a>
            );
          })}
        </div>

        {/* Quote */}
        <div className="text-center max-w-xs leading-snug">
          <p className="text-sm italic text-neutral-700 dark:text-neutral-300">
            “{quote.text}”
          </p>

          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="text-sm opacity-80">
              <LeftIcon />
            </span>

            <span className="font-medium tracking-wide">
              {quote.author}
            </span>

            <span className="text-sm opacity-80">
              <RightIcon />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
