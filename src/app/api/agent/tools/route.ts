import { NextResponse } from "next/server";

import { ensureVisitorId } from "@/lib/agent/ensure-visitor";
import { checkAgentRateLimit } from "@/lib/agent/rate-limit";
import {
  executeAgentTool,
  type AgentToolName,
} from "@/lib/agent/tool-executors";

export const dynamic = "force-dynamic";

const ALLOWED: AgentToolName[] = [
  "search_knowledge",
  "get_project",
  "list_books",
  "get_book",
  "get_profile",
  "get_career",
  "get_tech_stack",
  "get_medium_posts",
  "get_github_summary",
  "list_github_repos",
  "get_github_repo",
  "get_github_activity",
  "get_spotify_now_playing",
  "get_wakatime_today",
];

/** Bridge for Realtime tool calls — same executors as text chat. */
export async function POST(request: Request) {
  const { visitorId } = await ensureVisitorId();
  const rl = await checkAgentRateLimit(`tools:${visitorId}`);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let body: { name?: string; arguments?: Record<string, unknown> };
  try {
    body = (await request.json()) as {
      name?: string;
      arguments?: Record<string, unknown>;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name as AgentToolName;
  if (!name || !ALLOWED.includes(name)) {
    return NextResponse.json({ error: "Unknown tool" }, { status: 400 });
  }

  const result = await executeAgentTool(name, body.arguments ?? {});
  return NextResponse.json({ result });
}
