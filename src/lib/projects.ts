import fs from "fs";
import path from "path";

const PROJECTS_DIR = path.join(
  process.cwd(),
  "src",
  "data",
  "content",
  "projects"
);

export interface Project {
  slug: string;
  name: string;
  src: string;
  github: string;
  live: string;
  shortDescription: string;
  detailedDescription: string;
  problemStatement: string;
  tech: string[];
  category: string;
  badge?: string;
  tagline?: string;
  gradient?: string;
  order: number;
}

type Frontmatter = {
  name?: string;
  slug?: string;
  image?: string;
  live?: string;
  github?: string;
  category?: string;
  order?: number;
  tech?: string[];
  excerpt?: string;
  problemStatement?: string;
  badge?: string;
  tagline?: string;
  gradient?: string;
};

function normalizeNewlines(raw: string): string {
  return raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function parseFrontmatter(raw: string): {
  data: Frontmatter;
  content: string;
} {
  const normalized = normalizeNewlines(raw);
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: normalized.trim() };
  }

  const [, frontmatter, content] = match;
  const data: Frontmatter = {};
  let currentKey = "";

  for (const line of frontmatter.split("\n")) {
    const trimmedLine = line.trimEnd();

    const listItem = trimmedLine.match(/^\s*-\s+(.+)$/);
    if (listItem && currentKey === "tech") {
      data.tech = [...(data.tech ?? []), listItem[1].trim()];
      continue;
    }

    const pair = trimmedLine.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!pair) continue;

    const [, key, value] = pair;
    currentKey = key;

    if (key === "tech" && value === "") {
      data.tech = [];
      continue;
    }

    if (key === "order") {
      data.order = Number(value.trim());
      continue;
    }

    (data as Record<string, string>)[key] = value.trim();
  }

  return { data, content: content.trim() };
}

function parseProjectFile(filePath: string): Project {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseFrontmatter(raw);
  const slug =
    data.slug ?? path.basename(filePath, path.extname(filePath));

  return {
    slug,
    name: data.name ?? slug,
    src: data.image ?? "",
    live: data.live ?? "",
    github: data.github ?? "",
    shortDescription: data.excerpt ?? content.split("\n\n")[0] ?? "",
    detailedDescription: content || data.excerpt || "",
    problemStatement: data.problemStatement ?? "",
    tech: data.tech ?? [],
    category: data.category ?? "",
    badge: data.badge,
    tagline: data.tagline,
    gradient: data.gradient,
    order: data.order ?? 99,
  };
}

export function getProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => parseProjectFile(path.join(PROJECTS_DIR, file)))
    .sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return getProjects().map((project) => project.slug);
}
