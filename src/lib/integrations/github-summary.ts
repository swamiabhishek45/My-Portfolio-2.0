import { getGithubSummaryForAgent } from "@/lib/integrations/github-agent";

export async function getGithubSummary(): Promise<{
  username: string;
  repos: Array<{ name: string; description: string | null; url: string }>;
  readmeHighlights: string[];
  error?: string;
}> {
  return getGithubSummaryForAgent();
}
