import { aboutBullets } from "@/data/about";
import { books } from "@/data/books";
import { overviewData } from "@/data/overview";
import { skillMarqueeRows } from "@/data/technologies";
import { formatContextBlock, searchKnowledge } from "@/lib/agent/rag/qdrant";
import { rerankChunks } from "@/lib/agent/rag/rerank";
import { sanitizeProfileForAgent } from "@/lib/agent/sanitize";
import { getGithubSummary } from "@/lib/integrations/github-summary";
import { getSpotifyNowPlaying } from "@/lib/integrations/spotify";
import { getWakaTimeToday } from "@/lib/integrations/wakatime";
import { getCachedMediumPosts } from "@/lib/medium";
import { getProjects } from "@/lib/projects";

export type AgentToolName =
  | "search_knowledge"
  | "get_project"
  | "list_books"
  | "get_book"
  | "get_profile"
  | "get_tech_stack"
  | "get_medium_posts"
  | "get_github_summary"
  | "get_spotify_now_playing"
  | "get_wakatime_today";

export async function executeAgentTool(
  name: AgentToolName,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "search_knowledge": {
      const query = String(args.query ?? "");
      const chunks = rerankChunks(await searchKnowledge(query));
      return {
        snippets: chunks.map((c) => ({
          text: c.text,
          title: c.payload.title,
          url: c.payload.url,
          source: c.payload.source,
        })),
        context: formatContextBlock(chunks),
      };
    }
    case "get_project": {
      const slugOrName = String(args.slugOrName ?? "").toLowerCase();
      const project = getProjects().find(
        (p) =>
          p.slug.toLowerCase() === slugOrName ||
          p.name.toLowerCase().includes(slugOrName)
      );
      if (!project) return { error: "Project not found" };
      return {
        slug: project.slug,
        name: project.name,
        category: project.category,
        tech: project.tech,
        shortDescription: project.shortDescription,
        detailedDescription: project.detailedDescription,
        github: project.github,
        live: project.live,
      };
    }
    case "list_books":
      return books.map((b) => ({
        slug: b.slug,
        title: b.title,
        author: b.author,
        status: b.status,
        rating: b.rating,
      }));
    case "get_book": {
      const slug = String(args.slug ?? "");
      const book = books.find((b) => b.slug === slug);
      return book ?? { error: "Book not found" };
    }
    case "get_profile":
      return {
        overview: sanitizeProfileForAgent(
          overviewData as unknown as Record<string, unknown>
        ),
        about: aboutBullets.map((b) =>
          b.segments.map((s) => s.text).join("")
        ),
      };
    case "get_tech_stack":
      return skillMarqueeRows;
    case "get_medium_posts":
      return getCachedMediumPosts();
    case "get_github_summary":
      return getGithubSummary();
    case "get_spotify_now_playing":
      return getSpotifyNowPlaying();
    case "get_wakatime_today":
      return getWakaTimeToday();
    default:
      return { error: "Unknown tool" };
  }
}
