import Link from "next/link";
import { blogs } from "@/data/blogs";
import { Badge } from "@/components/ui/badge";

export default function Blogs() {
    const recentBlogs = blogs.slice(0, 3);

    return (
        <section className="border p-5 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 border-b border-neutral-400 pb-1">
                Blogs
            </h2>

            {/* Cards */}
            <div className="mt-6 flex flex-col gap-4 md:flex-row">
                {recentBlogs.map((blog, index) => (
                    <Link
                        key={blog.slug}
                        href={`/blogs/${blog.slug}`}
                        className="border rounded-lg p-4 hover:bg-neutral-50/5 transition md:flex-1"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-neutral-500">
                                {blog.date}
                            </span>

                            {blog.slug === "offline-pos-system" && (
                                <Badge className="h-5 px-1.5 text-[10px]">
                                    Featured
                                </Badge>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold mb-2 leading-snug">
                            {blog.title}
                        </h3>

                        <p className="text-base text-neutral-400 leading-relaxed">
                            {blog.description}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="flex justify-center mt-6">
                <Link
                    href="/blogs"
                    className="px-6 py-2 border rounded-md text-sm font-medium hover:bg-neutral-50/5 transition"
                >
                    Show More
                </Link>
            </div>
        </section>
    );
}
