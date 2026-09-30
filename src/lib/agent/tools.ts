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

const emptyObjectSchema = {
  type: "object" as const,
  properties: {},
};

/** OpenAI Realtime function schemas — same capabilities as text chat tools. */
export const realtimeToolSchemas = [
  {
    type: "function" as const,
    name: "search_knowledge",
    description:
      "Search Abhishek's portfolio knowledge (projects, skills, bio, books).",
    parameters: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    type: "function" as const,
    name: "get_project",
    description: "Get one portfolio project by slug or name.",
    parameters: {
      type: "object",
      properties: { slugOrName: { type: "string" } },
      required: ["slugOrName"],
    },
  },
  {
    type: "function" as const,
    name: "list_books",
    description: "List books on Abhishek's reading list.",
    parameters: emptyObjectSchema,
  },
  {
    type: "function" as const,
    name: "get_book",
    description: "Get one book by slug.",
    parameters: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
    },
  },
  {
    type: "function" as const,
    name: "get_profile",
    description: "Profile, bio, and project summaries.",
    parameters: emptyObjectSchema,
  },
  {
    type: "function" as const,
    name: "get_tech_stack",
    description: "Skills and technologies.",
    parameters: emptyObjectSchema,
  },
  {
    type: "function" as const,
    name: "get_medium_posts",
    description: "Recent Medium posts.",
    parameters: emptyObjectSchema,
  },
  {
    type: "function" as const,
    name: "get_github_summary",
    description: "GitHub repos and README highlights.",
    parameters: emptyObjectSchema,
  },
  {
    type: "function" as const,
    name: "get_spotify_now_playing",
    description: "Current or recent Spotify track.",
    parameters: emptyObjectSchema,
  },
  {
    type: "function" as const,
    name: "get_wakatime_today",
    description: "WakaTime coding activity today.",
    parameters: emptyObjectSchema,
  },
];
