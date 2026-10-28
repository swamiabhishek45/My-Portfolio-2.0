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

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (!quote) return null;

  const icons = authorIcons[quote.author];
  const LeftIcon = icons?.left ?? FaCode;
  const RightIcon = icons?.right ?? FaLightbulb;

  return (
    <section className="flex w-full flex-col">
      <div className="flex flex-col gap-5 rounded-2xl border border-dotted border-neutral-300 bg-neutral-50/10 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-neutral-800/80 dark:bg-neutral-900/10">
        <div className="flex flex-wrap gap-4">
          {socialLinks.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="group relative text-2xl text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                <Icon />
                <span
                  className="pointer-events-none absolute left-1/2 -top-9 -translate-x-1/2 whitespace-nowrap rounded-md border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-black opacity-0 shadow-lg transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                >
                  {item.name}
                </span>
              </a>
            );
          })}
        </div>

        <div className="max-w-xs text-center leading-snug">
          <p className="text-sm italic text-neutral-700 dark:text-neutral-300">
            “{quote.text}”
          </p>

          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="text-sm opacity-80">
              <LeftIcon />
            </span>

            <span className="font-medium tracking-wide">{quote.author}</span>

            <span className="text-sm opacity-80">
              <RightIcon />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
