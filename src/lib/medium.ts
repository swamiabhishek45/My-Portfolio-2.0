import { unstable_cache } from "next/cache";

export interface MediumPost {
  title: string;
  url: string;
  date: string;
  excerpt: string;
  tags: string[];
}

const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME ?? "swamiabhishek45";
const REVALIDATE_SECONDS = 3600;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function extractTag(xml: string, tag: string): string {
  const cdataMatch = xml.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i")
  );
  if (cdataMatch?.[1]) return cdataMatch[1].trim();

  const textMatch = xml.match(
    new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "i")
  );
  return textMatch?.[1]?.trim() ?? "";
}

function extractCategories(itemXml: string): string[] {
  const tags: string[] = [];
  const categoryRegex =
    /<category[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/category>/gi;

  for (const match of itemXml.matchAll(categoryRegex)) {
    const tag = (match[1] ?? match[2] ?? "").trim();
    if (tag) tags.push(tag);
  }

  return tags;
}

function extractExcerpt(itemXml: string): string {
  const content =
    extractTag(itemXml, "description") ||
    extractTag(itemXml, "content:encoded");
  const firstParagraph = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1];
  const text = stripHtml(firstParagraph ?? content);
  const maxLength = 220;

  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength).replace(/\s+\S*$/, "");
  return `${truncated}...`;
}

function parseRssItems(xml: string): MediumPost[] {
  const items: MediumPost[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;

  for (const match of xml.matchAll(itemRegex)) {
    const itemXml = match[1];
    const title = extractTag(itemXml, "title");
    const url = extractTag(itemXml, "link");
    const pubDate = extractTag(itemXml, "pubDate");
    const tags = extractCategories(itemXml);

    if (!title || !url) continue;

    items.push({
      title,
      url,
      date: formatDate(pubDate),
      excerpt: extractExcerpt(itemXml),
      tags,
    });
  }

  return items;
}

async function fetchMediumPosts(): Promise<MediumPost[]> {
  const feedUrl = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
  const response = await fetch(feedUrl, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Medium RSS failed with status ${response.status}`);
  }

  const xml = await response.text();
  return parseRssItems(xml);
}

export const getCachedMediumPosts = unstable_cache(
  fetchMediumPosts,
  ["medium-posts-v2", MEDIUM_USERNAME],
  { revalidate: REVALIDATE_SECONDS }
);
