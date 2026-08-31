"use client";

import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { DottedGridSection } from "@/components/ui/dotted-grid";
import Navbar from "@/components/navbar";
import { BookGrid } from "@/components/books/book-grid";
import { books } from "@/data/books";

export default function BooksPage() {
  const router = useRouter();

  return (
    <main className="bg-background min-h-screen overflow-x-clip py-6 font-sans text-neutral-900 transition-colors sm:py-10 dark:text-neutral-100">
      <div className="mx-auto flex max-w-5xl justify-center gap-6 px-4 sm:px-6 lg:gap-8">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <DottedGridSection id="navbar">
            <Navbar />
          </DottedGridSection>

          <DottedGridSection
            id="books-header"
            className="flex items-center justify-between px-4 py-4 sm:px-6"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                aria-label="Back to home"
                className="cursor-pointer rounded-lg border border-dotted border-neutral-300 p-1.5 text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <IoIosArrowBack className="text-lg" />
              </button>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-50">
                Books
              </h1>
            </div>
            <span className="font-mono text-xs text-neutral-500">
              {books.length} books listed
            </span>
          </DottedGridSection>

          <DottedGridSection id="book-shelf" className="py-4">
            <div className="book-shelf-backdrop overflow-visible rounded-2xl border border-dotted border-neutral-800/80 px-5 py-8 sm:px-8 sm:py-10">
              <div className="mb-7 flex items-baseline justify-between">
                <h2 className="font-mono text-[10px] tracking-[0.28em] text-neutral-500 uppercase">
                  Shelf
                </h2>
                <p className="font-mono text-[10px] text-neutral-600">
                  Hover to open · tap on mobile
                </p>
              </div>

              <BookGrid books={books} />
            </div>
          </DottedGridSection>
        </div>
      </div>
    </main>
  );
}
