import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Triggers knowledge reindex via GitHub Actions (recommended) or returns instructions.
 * Set GITHUB_REINDEX_DISPATCH=true plus GITHUB_TOKEN with actions:write to enable dispatch.
 */
export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repo = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;
  const workflowId = process.env.GITHUB_REINDEX_WORKFLOW ?? "reindex-knowledge.yml";

  if (
    process.env.GITHUB_REINDEX_DISPATCH === "true" &&
    repo &&
    token
  ) {
    const [owner, name] = repo.split("/");
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${name}/actions/workflows/${workflowId}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref: process.env.VERCEL_GIT_COMMIT_REF ?? "main" }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Reindex dispatch failed:", text);
      return NextResponse.json(
        { error: "Failed to dispatch workflow" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, dispatched: true });
  }

  return NextResponse.json({
    ok: true,
    dispatched: false,
    message:
      "Configure GITHUB_REINDEX_DISPATCH or run: npx tsx scripts/ingest-knowledge.ts",
  });
}
