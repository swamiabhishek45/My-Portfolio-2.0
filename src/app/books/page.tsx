"use client";

import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { BookOpen, Star, CheckCircle } from "lucide-react";
import { DottedGridSection } from "@/components/ui/dotted-grid";
import Navbar from "@/components/navbar";

const BOOKS = [
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    status: "Completed",
    rating: 5,
    takeaway: "The definitive guide to distributed system fundamentals, reliability, scalability, and data storage architectures.",
  },
  {
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    status: "Completed",
    rating: 5,
    takeaway: "Essential principles for writing readable, maintainable, and refactorable software code.",
  },
  {
    title: "System Design Interview – An Insider's Guide",
    author: "Alex Xu",
    status: "Reading",
    rating: 5,
    takeaway: "Step-by-step breakdown of designing modern distributed microservices, caching layers, and load balancers.",
  },
];

export default function BooksPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-neutral-900 dark:text-neutral-100 transition-colors py-6 sm:py-10 overflow-x-clip font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-6 lg:gap-8 justify-center">
        <div className="w-full max-w-2xl flex flex-col gap-6">

          {/* Top Navbar */}
          <DottedGridSection id="navbar"><Navbar /></DottedGridSection>

          {/* Header */}
          <DottedGridSection id="books-header" className="py-4 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="p-1.5 rounded-lg border border-dotted border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <IoIosArrowBack className="text-lg" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Books
              </h1>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              {BOOKS.length} books listed
            </span>
          </DottedGridSection>

          {/* Books Shelf */}
          <DottedGridSection id="books-list" className="p-4 sm:p-6 flex flex-col gap-4">
            {BOOKS.map((book, idx) => (
              <div
                key={idx}
                className="border border-dotted border-neutral-300 dark:border-neutral-800/80 rounded-2xl p-5 bg-neutral-50/20 dark:bg-neutral-900/20 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {book.title}
                    </h2>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-mono rounded flex items-center gap-1 ${
                    book.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  }`}>
                    <CheckCircle className="w-3 h-3" />
                    {book.status}
                  </span>
                </div>

                <div className="text-xs font-mono text-neutral-500">
                  By {book.author}
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  "{book.takeaway}"
                </p>

                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {Array.from({ length: book.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>
            ))}
          </DottedGridSection>

        </div>
      </div>
    </main>
  );
}
