import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { Calendar, ArrowUpRight } from "lucide-react";
import { DottedGridSection } from "@/components/ui/dotted-grid";
import Navbar from "@/components/navbar";
import { getCachedMediumPosts } from "@/lib/medium";

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getCachedMediumPosts>> = [];

  try {
    posts = await getCachedMediumPosts();
  } catch (error) {
    console.error("Failed to load Medium posts:", error);
  }

  return (
    <main className="min-h-screen bg-background text-neutral-900 dark:text-neutral-100 transition-colors py-6 sm:py-10 overflow-x-clip font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-6 lg:gap-8 justify-center">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <DottedGridSection id="navbar">
            <Navbar />
          </DottedGridSection>

          <DottedGridSection
            id="blog-header"
            className="py-4 px-4 sm:px-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-1.5 rounded-lg border border-dotted border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                <IoIosArrowBack className="text-lg" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Blogs
              </h1>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>
          </DottedGridSection>

          <DottedGridSection
            id="blog-list"
            className="p-4 sm:p-6 flex flex-col gap-4"
          >
            {posts.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
                No articles found. Check back soon!
              </p>
            ) : (
              posts.map((post) => (
                <a
                  key={post.url}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-dotted border-neutral-300 dark:border-neutral-800/80 rounded-2xl p-5 bg-neutral-50/20 dark:bg-neutral-900/20 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all flex flex-col gap-3 group"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-500 transition-colors">
                    {post.title}
                  </h2>

                  {post.excerpt ? (
                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  ) : null}

                  {post.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-100 dark:bg-neutral-800 border border-dotted border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </a>
              ))
            )}
          </DottedGridSection>
        </div>
      </div>
    </main>
  );
}
