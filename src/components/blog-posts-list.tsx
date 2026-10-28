"use client";

import {
  ImageRevealList,
  type ImageRevealListItem,
} from "@/components/ui/image-reveal-list";

export type BlogPostListItem = {
  url: string;
  title: string;
  date: string;
  excerpt?: string;
};

export function BlogPostsList({ posts }: { posts: BlogPostListItem[] }) {
  const items: ImageRevealListItem[] = posts.map((post, index) => ({
    id: post.url,
    title: post.title,
    subtitle: post.date,
    number: String(index + 1).padStart(2, "0"),
    href: post.url,
    image: "/photo.png",
  }));

  return (
    <ImageRevealList
      items={items}
      className="max-w-none pl-0 sm:pl-[100px]"
    />
  );
}
