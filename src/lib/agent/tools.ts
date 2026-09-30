import { tool } from "ai";
import { z } from "zod";

import { executeAgentTool } from "@/lib/agent/tool-executors";

export const agentToolDefinitions = {
  search_knowledge: tool({
    description: "Search Abhishek's public knowledge base for relevant facts.",
    inputSchema: z.object({
      query: z.string().describe("Search query"),
    }),
    execute: async ({ query }) => executeAgentTool("search_knowledge", { query }),
  }),
  get_project: tool({
    description: "Get details about a portfolio project by slug or name.",
    inputSchema: z.object({
      slugOrName: z.string(),
    }),
    execute: async ({ slugOrName }) =>
      executeAgentTool("get_project", { slugOrName }),
  }),
  list_books: tool({
    description: "List books on Abhishek's reading list.",
    inputSchema: z.object({}),
    execute: async () => executeAgentTool("list_books", {}),
  }),
  get_book: tool({
    description: "Get one book by slug.",
    inputSchema: z.object({ slug: z.string() }),
    execute: async ({ slug }) => executeAgentTool("get_book", { slug }),
  }),
  get_profile: tool({
    description: "Get public profile overview and about bullets.",
    inputSchema: z.object({}),
    execute: async () => executeAgentTool("get_profile", {}),
  }),
  get_tech_stack: tool({
    description: "Get skills and technologies.",
    inputSchema: z.object({}),
    execute: async () => executeAgentTool("get_tech_stack", {}),
  }),
  get_medium_posts: tool({
    description: "List recent Medium posts.",
    inputSchema: z.object({}),
    execute: async () => executeAgentTool("get_medium_posts", {}),
  }),
  get_github_summary: tool({
    description: "Summarize public GitHub repos and README highlights.",
    inputSchema: z.object({}),
    execute: async () => executeAgentTool("get_github_summary", {}),
  }),
  get_spotify_now_playing: tool({
    description: "Get current or recent Spotify track.",
    inputSchema: z.object({}),
    execute: async () => executeAgentTool("get_spotify_now_playing", {}),
  }),
  get_wakatime_today: tool({
    description: "Get WakaTime coding activity for today.",
    inputSchema: z.object({}),
    execute: async () => executeAgentTool("get_wakatime_today", {}),
  }),
};

/** OpenAI Realtime function schemas (shared shape). */
export const realtimeToolSchemas = [
  {
    type: "function" as const,
    name: "search_knowledge",
    description: "Search public knowledge about Abhishek.",
    parameters: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    type: "function" as const,
    name: "get_spotify_now_playing",
    description: "Current Spotify track",
    parameters: { type: "object", properties: {} },
  },
  {
    type: "function" as const,
    name: "get_wakatime_today",
    description: "WakaTime stats today",
    parameters: { type: "object", properties: {} },
  },
  {
    type: "function" as const,
    name: "get_profile",
    description: "Public profile",
    parameters: { type: "object", properties: {} },
  },
];
