export type KnowledgeSource =
  | "portfolio"
  | "medium"
  | "github"
  | "linkedin"
  | "x"
  | "resume"
  | "notes"
  | "web";

export type KnowledgeVisibility = "public" | "internal";

export type KnowledgeChunkPayload = {
  source: KnowledgeSource;
  url?: string;
  title?: string;
  updated_at: string;
  visibility: KnowledgeVisibility;
  section?: string;
  do_not_expose: boolean;
};

export type KnowledgeDocument = {
  id: string;
  text: string;
  payload: KnowledgeChunkPayload;
};

export type RetrievedChunk = {
  id: string;
  text: string;
  score: number;
  payload: KnowledgeChunkPayload;
};

export const DEFAULT_COLLECTION =
  process.env.KNOWLEDGE_COLLECTION ?? "abhishek_knowledge_v1";
