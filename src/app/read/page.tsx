"use client";

import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { ArrowUpRight } from "lucide-react";
import { DottedGridSection } from "@/components/ui/dotted-grid";
import Navbar from "@/components/navbar";
import { readArticles } from "@/data/read";

export default function ReadPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-neutral-900 dark:text-neutral-100 transition-colors py-6 sm:py-10 overflow-x-clip font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-6 lg:gap-8 justify-center">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <DottedGridSection id="navbar">
            <Navbar />
          </DottedGridSection>

          <DottedGridSection
            id="read-header"
            className="py-4 px-4 sm:px-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                aria-label="Back to home"
                className="p-1.5 rounded-lg border border-dotted border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <IoIosArrowBack className="text-lg" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Read
              </h1>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              {readArticles.length} articles
            </span>
          </DottedGridSection>

          <DottedGridSection
            id="read-list"
            className="p-4 sm:p-6 flex flex-col gap-2"
          >
            <ul className="flex flex-col gap-2">
              {readArticles.map((article) => (
                <li key={article.url}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-3 rounded-xl border border-dotted border-neutral-300 dark:border-neutral-800/80 bg-neutral-50/20 dark:bg-neutral-900/20 px-4 py-3.5 hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
                  >
                    <span className="text-sm font-medium leading-snug text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </span>
                    <ArrowUpRight
                      className="mt-0.5 size-4 shrink-0 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </DottedGridSection>
        </div>
      </div>
    </main>
  );
}
