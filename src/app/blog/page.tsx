"use client";

import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { DottedGridSection } from "@/components/ui/dotted-grid";
import Navbar from "@/components/navbar";

const BLOG_POSTS = [
  {
    title: "Building Modern Web Apps with Next.js App Router and Turbopack",
    date: "August 2026",
    readTime: "5 min read",
    excerpt: "Insights into architecting high-performance web applications using modern Next.js patterns, React Server Components, and Turbopack compilation.",
    tags: ["Next.js", "React", "Architecture"],
  },
  {
    title: "Designing Pixel-Perfect Responsive Components for Any Screen",
    date: "July 2026",
    readTime: "4 min read",
    excerpt: "Best practices for building responsive UI design systems with Tailwind CSS, fluid typography, and dynamic flex layouts.",
    tags: ["UI/UX", "TailwindCSS", "CSS"],
  },
  {
    title: "Exploring Generative AI Integrations & Real-Time System Design",
    date: "June 2026",
    readTime: "6 min read",
    excerpt: "How to integrate AI models and build scalable real-time microservices with Node.js, WebSockets, and modern state management.",
    tags: ["AI", "System Design", "Node.js"],
  },
];

export default function BlogPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-neutral-900 dark:text-neutral-100 transition-colors py-6 sm:py-10 overflow-x-clip font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-6 lg:gap-8 justify-center">
        <div className="w-full max-w-2xl flex flex-col gap-6">

          {/* Top Navbar */}
          <DottedGridSection id="navbar"><Navbar /></DottedGridSection>

          {/* Header */}
          <DottedGridSection id="blog-header" className="py-4 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="p-1.5 rounded-lg border border-dotted border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <IoIosArrowBack className="text-lg" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Blogs
              </h1>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              {BLOG_POSTS.length} articles
            </span>
          </DottedGridSection>

          {/* Articles List */}
          <DottedGridSection id="blog-list" className="p-4 sm:p-6 flex flex-col gap-4">
            {BLOG_POSTS.map((post, idx) => (
              <article
                key={idx}
                className="border border-dotted border-neutral-300 dark:border-neutral-800/80 rounded-2xl p-5 bg-neutral-50/20 dark:bg-neutral-900/20 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all flex flex-col gap-3 group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-500 transition-colors">
                  {post.title}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {post.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-100 dark:bg-neutral-800 border border-dotted border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </DottedGridSection>

        </div>
      </div>
    </main>
  );
}
