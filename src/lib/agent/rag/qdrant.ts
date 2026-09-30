import { QdrantClient } from "@qdrant/js-client-rest";

import { embedQuery, embedTexts } from "@/lib/agent/rag/embed";
import type { KnowledgeDocument, RetrievedChunk } from "@/lib/agent/rag/types";
import { DEFAULT_COLLECTION as COLLECTION_NAME } from "@/lib/agent/rag/types";
import { sanitizeRetrievedText } from "@/lib/agent/sanitize";

const SCORE_THRESHOLD = 0.35;
const TOP_K = 8;

let qdrant: QdrantClient | null = null;

function isPlaceholderQdrantUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "your-qdrant.example.com" || host.endsWith(".example.com");
  } catch {
    return true;
  }
}

export function getQdrantClient(): QdrantClient | null {
  const url = process.env.QDRANT_URL?.trim();
  if (!url || isPlaceholderQdrantUrl(url)) return null;
  if (!qdrant) {
    qdrant = new QdrantClient({
      url,
      apiKey: process.env.QDRANT_API_KEY,
    });
  }
  return qdrant;
}

export async function ensureCollection(collection = COLLECTION_NAME): Promise<void> {
  const client = getQdrantClient();
  if (!client) return;

  const collections = await client.getCollections();
  const exists = collections.collections.some((c) => c.name === collection);
  if (exists) return;

  await client.createCollection(collection, {
    vectors: { size: 1536, distance: "Cosine" },
  });

  for (const field of ["visibility", "do_not_expose", "source"]) {
    try {
      await client.createPayloadIndex(collection, {
        field_name: field,
        field_schema: field === "do_not_expose" ? "bool" : "keyword",
      });
    } catch {
      /* index may exist */
    }
  }
}

export async function upsertDocuments(
  docs: KnowledgeDocument[],
  collection = COLLECTION_NAME
): Promise<void> {
  const client = getQdrantClient();
  if (!client || docs.length === 0) return;

  await ensureCollection(collection);
  const vectors = await embedTexts(docs.map((d) => d.text));

  await client.upsert(collection, {
    wait: true,
    points: docs.map((doc, i) => ({
      id: doc.id,
      vector: vectors[i],
      payload: {
        text: doc.text,
        ...doc.payload,
      },
    })),
  });
}

export async function searchKnowledge(
  query: string,
  opts?: { limit?: number; collection?: string }
): Promise<RetrievedChunk[]> {
  const client = getQdrantClient();
  if (!client) return [];

  const collection = opts?.collection ?? COLLECTION_NAME;
  const vector = await embedQuery(query);

  let results: Awaited<ReturnType<typeof client.query>>["points"];
  try {
    const response = await client.query(collection, {
      query: vector,
      limit: opts?.limit ?? TOP_K,
      score_threshold: SCORE_THRESHOLD,
      filter: {
        must: [
          { key: "visibility", match: { value: "public" } },
          { key: "do_not_expose", match: { value: false } },
        ],
      },
      with_payload: true,
    });
    results = response.points;
  } catch (error) {
    console.warn("Qdrant search unavailable, using local fallback:", error);
    return [];
  }

  return (results ?? [])
    .map((r) => {
      const payload = (r.payload ?? {}) as Record<string, unknown>;
      const text = sanitizeRetrievedText(String(payload.text ?? ""));
      return {
        id: String(r.id),
        text,
        score: r.score ?? 0,
        payload: {
          source: payload.source as RetrievedChunk["payload"]["source"],
          url: payload.url as string | undefined,
          title: payload.title as string | undefined,
          updated_at: String(payload.updated_at ?? ""),
          visibility: "public" as const,
          section: payload.section as string | undefined,
          do_not_expose: false,
        },
      };
    })
    .filter((c) => c.text.length > 0);
}

export function formatContextBlock(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "";
  return chunks
    .map((c, i) => {
      const cite = [c.payload.title, c.payload.url].filter(Boolean).join(" — ");
      return `[${i + 1}] ${cite}\n${c.text}`;
    })
    .join("\n\n");
}
