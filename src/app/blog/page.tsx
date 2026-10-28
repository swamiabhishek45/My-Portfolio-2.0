import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { DottedGridSection } from "@/components/ui/dotted-grid";
import { BlogPostsList } from "@/components/blog-posts-list";
import { SectionHeading } from "@/components/section-heading";
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
              <SectionHeading className="text-xl sm:text-2xl">Blogs</SectionHeading>
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
              <BlogPostsList
                posts={posts.map((post) => ({
                  url: post.url,
                  title: post.title,
                  date: post.date,
                  excerpt: post.excerpt,
                }))}
              />
            )}
          </DottedGridSection>
        </div>
      </div>
    </main>
  );
}
