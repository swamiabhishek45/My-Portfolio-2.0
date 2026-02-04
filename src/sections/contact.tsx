"use client";

import { ReactNode, useEffect, useState } from "react";

import { FaDiscord, FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

import {
  FaApple,
  FaLinux,
  FaMicrosoft,
  FaGoogle,
  FaFacebook,
  FaCode,
  FaRocket,
  FaAmazon,
  FaLightbulb,
  FaGlobe,
} from "react-icons/fa";

type Quote = {
  text: string;
  author: string;
};

export default function Contact() {
  const contact = [
    { name: "X", link: "https://x.com/swamiabhishek45", icon: <FaXTwitter /> },
    { name: "LinkedIn", link: "https://linkedin.com/in/swamiabhishek45", icon: <FaLinkedin /> },
    { name: "GitHub", link: "https://github.com/swamiabhishek45", icon: <FaGithub /> },
    { name: "LeetCode", link: "https://leetcode.com/swamiabhishek45", icon: <SiLeetcode /> },
    { name: "YouTube", link: "https://youtube.com/@swamiabhishek45", icon: <FaYoutube /> },
    { name: "Discord", link: "https://discord.com/users/swamiabhishek45", icon: <FaDiscord /> },
  ];

  const quotes: Quote[] = [
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Innovation grows when curiosity leads.", author: "Steve Jobs" },
    { text: "Good software is born from clear minds.", author: "Bill Gates" },
    { text: "Focus on users, the rest follows soon.", author: "Larry Page" },
    { text: "Move fast, learn fast, build even faster.", author: "Mark Zuckerberg" },
    { text: "Stay simple; complexity kills progress.", author: "Dennis Ritchie" },
    { text: "Great tools empower great developers.", author: "Anders Hejlsberg" },
    { text: "Precision matters; craft code with care.", author: "Ken Thompson" },
    { text: "Create value first, optimize it later.", author: "Jeff Bezos" },
  ];

  const authorIcons: Record<string, { left: ReactNode; right: ReactNode }> = {
    "Linus Torvalds": { left: <FaLinux />, right: <FaCode /> },
    "Steve Jobs": { left: <FaApple />, right: <FaLightbulb /> },
    "Bill Gates": { left: <FaMicrosoft />, right: <FaGlobe /> },
    "Larry Page": { left: <FaGoogle />, right: <FaLightbulb /> },
    "Mark Zuckerberg": { left: <FaFacebook />, right: <FaGlobe /> },
    "Dennis Ritchie": { left: <FaCode />, right: <FaCode /> },
    "Anders Hejlsberg": { left: <FaCode />, right: <FaLightbulb /> },
    "Ken Thompson": { left: <FaCode />, right: <FaCode /> },
    "Elon Musk": { left: <FaRocket />, right: <FaGlobe /> },
    "Jeff Bezos": { left: <FaAmazon />, right: <FaGlobe /> },
  };

  const [quote, setQuote] = useState<Quote | null>(null);

  // ✅ Runs ONLY on client after hydration
  useEffect(() => {
    setQuote(
      quotes[Math.floor(Math.random() * quotes.length)]
    );
  }, []);

  // ✅ Prevent hydration mismatch
  if (!quote) return null;

  const icons = authorIcons[quote.author];

  return (
    <section className="flex flex-col gap-5 sm:flex-row sm:justify-between items-center border p-5 rounded-xl backdrop-blur-sm">

      {/* Social Icons */}
      <div className="flex flex-wrap gap-4">
        {contact.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group text-2xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition"
          >
            {item.icon}

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
        ))}
      </div>

      {/* Quote */}
      <div className="text-center max-w-xs leading-snug">
        <p className="text-sm italic text-neutral-700 dark:text-neutral-300">
          “{quote.text}”
        </p>

        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="text-sm opacity-80">
            {icons?.left ?? <FaCode />}
          </span>

          <span className="font-medium tracking-wide">
            {quote.author}
          </span>

          <span className="text-sm opacity-80">
            {icons?.right ?? <FaLightbulb />}
          </span>
        </div>
      </div>
    </section>
  );
}
