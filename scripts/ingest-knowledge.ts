/**
 * Run: npx tsx scripts/ingest-knowledge.ts
 * Requires: OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY (optional locally)
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { formatCareerAsText } from "../src/lib/agent/career-text";
import { parseResumePdf } from "../src/lib/agent/parse-resume-pdf";
import { chunkText } from "../src/lib/agent/rag/chunk";
import { ensureCollection, upsertDocuments } from "../src/lib/agent/rag/qdrant";
import type { KnowledgeDocument } from "../src/lib/agent/rag/types";
import { DEFAULT_COLLECTION } from "../src/lib/agent/rag/types";
import { sanitizeRetrievedText } from "../src/lib/agent/sanitize";
import {
  getGithubActivitySummary,
  listAllGithubRepos,
  readmeExcerpt,
} from "../src/lib/integrations/github-agent";
import { getProjects } from "../src/lib/projects";
import { ingestSourcesConfig } from "./ingest-sources.config";

const SKIP_DATA_FILES = new Set(["career.ts"]);

function docId(parts: string[]): string {
  const hex = createHash("sha256").update(parts.join("|")).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function loadPortfolioDocs(): KnowledgeDocument[] {
  const docs: KnowledgeDocument[] = [];
  const dataDir = path.join(process.cwd(), "src", "data");

  for (const file of fs.readdirSync(dataDir)) {
    if (!file.endsWith(".ts") || SKIP_DATA_FILES.has(file)) continue;
    const full = path.join(dataDir, file);
    const raw = fs.readFileSync(full, "utf8");
    const text = sanitizeRetrievedText(raw);
    for (const chunk of chunkText(text)) {
      docs.push({
        id: docId(["portfolio", file, chunk.slice(0, 40)]),
        text: chunk,
        payload: {
          source: "portfolio",
          title: file,
          updated_at: new Date().toISOString(),
          visibility: "public",
          do_not_expose: false,
          section: "data",
        },
      });
    }
  }

  for (const project of getProjects()) {
    const body = [
      project.name,
      project.tagline ?? "",
      project.category,
      project.shortDescription,
      project.detailedDescription,
      project.github ? `GitHub: ${project.github}` : "",
      project.live ? `Live: ${project.live}` : "",
      `Tech: ${project.tech.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n\n");
    for (const chunk of chunkText(body)) {
      docs.push({
        id: docId(["project", project.slug, chunk.slice(0, 40)]),
        text: chunk,
        payload: {
          source: "portfolio",
          title: project.name,
          url: project.github || project.live,
          updated_at: new Date().toISOString(),
          visibility: "public",
          do_not_expose: false,
          section: "project",
        },
      });
    }
  }

  return docs;
}

function loadCareerDocs(): KnowledgeDocument[] {
  const text = sanitizeRetrievedText(formatCareerAsText());
  const docs: KnowledgeDocument[] = [];
  for (const chunk of chunkText(text)) {
    docs.push({
      id: docId(["career", chunk.slice(0, 40)]),
      text: chunk,
      payload: {
        source: "portfolio",
        title: "Career profile",
        updated_at: new Date().toISOString(),
        visibility: "public",
        do_not_expose: false,
        section: "career",
      },
    });
  }
  return docs;
}

async function loadMediumDocs(): Promise<KnowledgeDocument[]> {
  const username = ingestSourcesConfig.mediumUsername;
  const feedUrl = `https://medium.com/feed/@${username}`;
  const res = await fetch(feedUrl);
  if (!res.ok) return [];
  const xml = await res.text();
  const docs: KnowledgeDocument[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;

  for (const match of xml.matchAll(itemRegex)) {
    const item = match[1];
    const title = extractTag(item, "title");
    const link = extractTag(item, "link");
    const content =
      extractTag(item, "content:encoded") || extractTag(item, "description");
    const plain = sanitizeRetrievedText(stripHtml(content));
    for (const chunk of chunkText(plain)) {
      docs.push({
        id: docId(["medium", link, chunk.slice(0, 40)]),
        text: chunk,
        payload: {
          source: "medium",
          title,
          url: link,
          updated_at: new Date().toISOString(),
          visibility: "public",
          do_not_expose: false,
        },
      });
    }
  }
  return docs;
}

async function loadGithubDocs(): Promise<KnowledgeDocument[]> {
  if (!process.env.GITHUB_TOKEN) return [];

  const repos = await listAllGithubRepos();
  const docs: KnowledgeDocument[] = [];

  for (const repo of repos) {
    const readme = readmeExcerpt(repo.readmeText, 4000);
    const meta = [
      repo.description,
      repo.primaryLanguage?.name
        ? `Language: ${repo.primaryLanguage.name}`
        : "",
      repo.repositoryTopics?.length
        ? `Topics: ${repo.repositoryTopics.map((t) => t.topic.name).join(", ")}`
        : "",
      `Stars: ${repo.stargazerCount}`,
    ]
      .filter(Boolean)
      .join("\n");
    const text = sanitizeRetrievedText(
      [meta, readme].filter(Boolean).join("\n\n")
    );
    if (!text.trim()) continue;

    for (const chunk of chunkText(text)) {
      docs.push({
        id: docId(["github", repo.name, chunk.slice(0, 40)]),
        text: chunk,
        payload: {
          source: "github",
          title: repo.name,
          url: repo.url,
          updated_at: new Date().toISOString(),
          visibility: "public",
          do_not_expose: false,
        },
      });
    }
  }
  return docs;
}

async function loadGithubActivityDoc(): Promise<KnowledgeDocument[]> {
  const summary = await getGithubActivitySummary();
  if (summary.error && summary.totalContributions == null) return [];

  const text = sanitizeRetrievedText(
    [
      `GitHub user: ${summary.username}`,
      summary.totalContributions != null
        ? `Total contributions (last year): ${summary.totalContributions}`
        : "",
      summary.activeDaysLastYear != null
        ? `Active days: ${summary.activeDaysLastYear}`
        : "",
      summary.recentStreakHint ?? "",
    ]
      .filter(Boolean)
      .join("\n")
  );

  return [
    {
      id: docId(["github-activity"]),
      text,
      payload: {
        source: "github",
        title: "GitHub activity",
        updated_at: new Date().toISOString(),
        visibility: "public",
        do_not_expose: false,
        section: "activity",
      },
    },
  ];
}

function loadMarkdownNotesDir(
  relativeDir: string,
  idPrefix: string
): KnowledgeDocument[] {
  const dir = path.join(process.cwd(), relativeDir);
  if (!fs.existsSync(dir)) return [];

  const docs: KnowledgeDocument[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { meta, body } = parseNoteFrontmatter(raw);
    if (meta.visibility === "private" || meta.do_not_expose) continue;
    const visibility = meta.visibility === "internal" ? "internal" : "public";
    if (visibility !== "public") continue;

    for (const chunk of chunkText(sanitizeRetrievedText(body))) {
      docs.push({
        id: docId([idPrefix, file, chunk.slice(0, 40)]),
        text: chunk,
        payload: {
          source: "notes",
          title: file,
          updated_at: new Date().toISOString(),
          visibility: "public",
          do_not_expose: false,
          section: idPrefix,
        },
      });
    }
  }
  return docs;
}

function loadPublicKnowledgeDocs(): KnowledgeDocument[] {
  return loadMarkdownNotesDir(ingestSourcesConfig.publicNotesDir, "public");
}

function loadPrivateNotes(): KnowledgeDocument[] {
  return loadMarkdownNotesDir(ingestSourcesConfig.privateNotesDir, "private");
}

async function loadResumeDocs(): Promise<KnowledgeDocument[]> {
  const pdfPath = ingestSourcesConfig.resumePdfPath;
  if (!pdfPath || !fs.existsSync(pdfPath)) return [];

  const buffer = fs.readFileSync(pdfPath);
  const text = await parseResumePdf(buffer);
  const docs: KnowledgeDocument[] = [];
  for (const chunk of chunkText(sanitizeRetrievedText(text))) {
    docs.push({
      id: docId(["resume", chunk.slice(0, 40)]),
      text: chunk,
      payload: {
        source: "resume",
        title: "Resume",
        updated_at: new Date().toISOString(),
        visibility: "public",
        do_not_expose: false,
      },
    });
  }
  return docs;
}

function loadJsonExport(
  filePath: string,
  source: "linkedin" | "x"
): KnowledgeDocument[] {
  if (!filePath || !fs.existsSync(filePath)) return [];
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
  const items = Array.isArray(raw) ? raw : [];
  const docs: KnowledgeDocument[] = [];

  for (const item of items) {
    const rec = item as Record<string, unknown>;
    const text = sanitizeRetrievedText(
      String(rec.text ?? rec.full_text ?? rec.content ?? "")
    );
    if (!text) continue;
    for (const chunk of chunkText(text)) {
      docs.push({
        id: docId([source, chunk.slice(0, 40)]),
        text: chunk,
        payload: {
          source,
          title: String(rec.title ?? source),
          url: rec.url ? String(rec.url) : undefined,
          updated_at: new Date().toISOString(),
          visibility: "public",
          do_not_expose: false,
        },
      });
    }
  }
  return docs;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractTag(xml: string, tag: string): string {
  const cdata = xml.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i")
  );
  if (cdata?.[1]) return cdata[1].trim();
  const plain = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return plain?.[1]?.trim() ?? "";
}

function parseNoteFrontmatter(raw: string): {
  meta: { visibility?: string; do_not_expose?: boolean };
  body: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: { visibility?: string; do_not_expose?: boolean } = {};
  for (const line of match[1].split("\n")) {
    const [k, v] = line.split(":").map((s) => s.trim());
    if (k === "visibility") meta.visibility = v;
    if (k === "do_not_expose") meta.do_not_expose = v === "true";
  }
  return { meta, body: match[2] };
}

async function main() {
  console.log("Collecting documents…");
  const all = [
    ...loadPortfolioDocs(),
    ...loadCareerDocs(),
    ...loadPublicKnowledgeDocs(),
    ...(await loadMediumDocs()),
    ...(await loadGithubDocs()),
    ...(await loadGithubActivityDoc()),
    ...loadPrivateNotes(),
    ...(await loadResumeDocs()),
    ...loadJsonExport(ingestSourcesConfig.linkedinExportPath, "linkedin"),
    ...loadJsonExport(ingestSourcesConfig.xExportPath, "x"),
  ];

  console.log(`Collected ${all.length} chunks`);
  if (all.length === 0) {
    console.error("No documents to ingest");
    process.exit(1);
  }

  await ensureCollection(DEFAULT_COLLECTION);

  const batchSize = 32;
  for (let i = 0; i < all.length; i += batchSize) {
    const batch = all.slice(i, i + batchSize);
    await upsertDocuments(batch, DEFAULT_COLLECTION);
    console.log(`Upserted ${Math.min(i + batchSize, all.length)} / ${all.length}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
